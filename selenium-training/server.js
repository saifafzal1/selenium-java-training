const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const PROGRESS_FILE = path.join(__dirname, 'data', 'progress.json');

// ── Provider config ───────────────────────────────────────────────
const OLLAMA_BASE   = process.env.OLLAMA_URL    || 'http://localhost:11434';
const GROQ_KEY      = process.env.GROQ_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Known Groq model names (anything else → try Ollama)
const GROQ_MODELS = new Set([
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'llama-3.1-70b-versatile',
  'qwen-qwq-32b',
  'gemma2-9b-it',
  'mixtral-8x7b-32768',
  'deepseek-r1-distill-llama-70b',
]);

function getProvider(model = '') {
  if (model.startsWith('claude-')) return 'anthropic';
  if (GROQ_MODELS.has(model))       return 'groq';
  return 'ollama';
}

// ── RAG modules (optional — graceful degradation if not present) ───────
let ragSearch, ragGetStatus, ragClearStore, ragIngestAll, RAG_SOURCES, ragEmbed;
let ragEnabled = false;
try {
  ({ search: ragSearch, getStatus: ragGetStatus, clearStore: ragClearStore } = require('./rag/store'));
  ({ ingestAll: ragIngestAll } = require('./rag/ingest'));
  ({ SOURCES: RAG_SOURCES }   = require('./rag/sources'));
  ({ embed:   ragEmbed }      = require('./rag/embed'));
  ragEnabled = true;
  console.log('📚 RAG module loaded — local knowledge base available');
} catch (e) {
  console.warn('⚠️  RAG modules not found:', e.message, '\n    (Run from feature/isolated-rag branch or npm install)');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Progress API ────────────────────────────────────────────────
function readProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')); }
  catch { return { completedLessons: [], lastVisited: null, startedAt: null, notes: {} }; }
}
function writeProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/progress', (req, res) => res.json(readProgress()));

app.post('/api/progress', (req, res) => {
  const current = readProgress();
  const update  = req.body;

  if (update.reset) {
    writeProgress({ completedLessons: [], lastVisited: null, startedAt: null, notes: {} });
    return res.json({ ok: true, progress: readProgress() });
  }
  if (update.completedLesson !== undefined) {
    if (!current.completedLessons.includes(update.completedLesson))
      current.completedLessons.push(update.completedLesson);
    if (!current.startedAt) current.startedAt = new Date().toISOString();
  }
  if (update.removeLesson !== undefined)
    current.completedLessons = current.completedLessons.filter(l => l !== update.removeLesson);
  if (update.lastVisited !== undefined) current.lastVisited = update.lastVisited;
  if (update.note) current.notes[update.note.lessonId] = update.note.text;

  writeProgress(current);
  res.json({ ok: true, progress: current });
});

// ── Qwen prompt refinement helper ──────────────────────────────────
async function refineWithQwen(messages, groqKey, fetchFn) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUserMsg || !groqKey) return null;
  try {
    const r = await fetchFn('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 300,
        stream: false,
        messages: [
          { role: 'system', content: 'You are a prompt refinement engine for a Selenium with Java coding tutor. Rewrite the user\'s question to be precise, specific, and technical. Add any missing Java/Selenium context. Return ONLY the refined question — no preamble, no explanation, no markdown.' },
          { role: 'user', content: lastUserMsg.content }
        ]
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

// ── RAG Endpoints ──────────────────────────────────────────────────

// GET /api/rag/status — knowledge base sync state
app.get('/api/rag/status', (req, res) => {
  if (!ragEnabled) return res.json({ synced: false, count: 0, sources: [], available: false });
  res.json({ ...ragGetStatus(), available: true });
});

// POST /api/rag/clear — wipe local vector store
app.post('/api/rag/clear', (req, res) => {
  if (!ragEnabled) return res.json({ ok: false, error: 'RAG not available' });
  ragClearStore();
  res.json({ ok: true });
});

// GET /api/rag/ingest — SSE stream: fetch docs, embed, store
// Streams JSON events: { type: 'start'|'progress'|'done'|'error', ... }
app.get('/api/rag/ingest', async (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.flushHeaders();

  const send = (data) => {
    try { res.write(`data: ${JSON.stringify(data)}\n\n`); } catch { /* client disconnected */ }
  };

  if (!ragEnabled) {
    send({ type: 'error', error: 'RAG modules not available on this deployment (local server only)' });
    return res.end();
  }

  // Check nomic-embed-text is installed first
  const { default: fetch } = await import('node-fetch');
  try {
    const testR = await fetch(`${OLLAMA_BASE}/api/embed`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ model: 'nomic-embed-text:latest', input: 'test' }),
      signal:  AbortSignal.timeout(5000)
    });
    if (!testR.ok) {
      send({ type: 'error', error: 'nomic-embed-text model not found. Run: ollama pull nomic-embed-text:latest' });
      return res.end();
    }
  } catch {
    send({ type: 'error', error: 'Cannot reach Ollama. Start it with: ollama serve' });
    return res.end();
  }

  try {
    send({ type: 'start', total: RAG_SOURCES.length, sources: RAG_SOURCES.map(s => s.label) });

    const results = await ragIngestAll(RAG_SOURCES, fetch, (evt) => send({ type: 'progress', ...evt }));

    const totalAdded = results.reduce((s, r) => s + (r.chunksAdded || 0), 0);
    send({ type: 'done', results, totalAdded, status: ragGetStatus() });
  } catch (err) {
    send({ type: 'error', error: err.message });
  }
  res.end();
});

// ── Chat API — multi-provider with optional RAG augmentation ────────
app.post('/api/chat', async (req, res) => {
  const { messages, model, chainMode } = req.body;
  const selectedModel = model || 'llama-3.3-70b-versatile';
  const provider = getProvider(selectedModel);
  const { default: fetch } = await import('node-fetch');

  // Smart Mode: refine prompt with fast Groq model first
  let workingMessages = messages;
  let refinedQuestion = null;
  if (chainMode) {
    refinedQuestion = await refineWithQwen(messages, GROQ_KEY, fetch);
    if (refinedQuestion) {
      const lastUserIdx = messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop();
      workingMessages = messages.map((m, i) =>
        i === lastUserIdx ? { ...m, content: refinedQuestion } : m
      );
    }
  }

  // ── Groq ──────────────────────────────────────────────────
  if (provider === 'groq') {
    if (!GROQ_KEY) return res.json({ error: 'GROQ_API_KEY is not set.\nAdd it to your environment: export GROQ_API_KEY=gsk_...' });
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body: JSON.stringify({ model: selectedModel, messages: workingMessages, stream: false, max_tokens: 4096 }),
        signal: AbortSignal.timeout(30000)
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        if (r.status === 401) return res.json({ error: 'Invalid GROQ_API_KEY.' });
        if (r.status === 429) return res.json({ error: 'Groq rate limit hit. Wait a moment and retry.' });
        return res.json({ error: `Groq error ${r.status}: ${txt.slice(0, 200)}` });
      }
      const data = await r.json();
      return res.json({ content: data.choices?.[0]?.message?.content || '', refinedQuestion });
    } catch (err) {
      return res.json({ error: `Groq request failed: ${err.message}` });
    }
  }

  // ── Anthropic / Claude ────────────────────────────────────────────
  if (provider === 'anthropic') {
    if (!ANTHROPIC_KEY) return res.json({
      error: 'ANTHROPIC_API_KEY is not set.\n\nTo use Claude:\n1. Get a key at console.anthropic.com\n2. Set it: export ANTHROPIC_API_KEY=sk-ant-...\n3. Restart the server'
    });
    try {
      const systemMsg = workingMessages.find(m => m.role === 'system');
      const convoMsgs = workingMessages.filter(m => m.role !== 'system');
      const body = { model: selectedModel, max_tokens: 4096, messages: convoMsgs };
      if (systemMsg) body.system = systemMsg.content;

      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(60000)
      });
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        if (r.status === 401) return res.json({ error: 'Invalid ANTHROPIC_API_KEY.' });
        if (r.status === 429) return res.json({ error: 'Claude rate limit hit. Wait a moment and retry.' });
        return res.json({ error: `Claude error ${r.status}: ${txt.slice(0, 200)}` });
      }
      const data = await r.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      return res.json({ content: text, refinedQuestion });
    } catch (err) {
      return res.json({ error: `Claude request failed: ${err.message}` });
    }
  }

  // ── Ollama (local) with RAG augmentation ─────────────────────────
  // When RAG is enabled and docs are synced, we:
  //   1. Embed the user's query with nomic-embed-text
  //   2. Find top-3 semantically similar documentation chunks
  //   3. Prepend them as context in the system message
  // This lets a small local model (e.g. qwen2.5-coder:14b) answer
  // Selenium questions accurately even without internet access.
  let ragMessages = [...workingMessages];
  let ragUsed = false;

  if (ragEnabled) {
    try {
      const status = ragGetStatus();
      if (status.synced && status.count > 0) {
        const lastUser = [...workingMessages].reverse().find(m => m.role === 'user');
        if (lastUser) {
          const queryVec = await ragEmbed(lastUser.content, fetch);
          const chunks   = ragSearch(queryVec, 3, 0.25);

          if (chunks.length > 0) {
            const context = chunks
              .map((c, i) => `[${i + 1}] (${c.source}) ${c.text}`)
              .join('\n\n');

            const ragSystemContent =
              `You are a Selenium with Java expert tutor. ` +
              `The following excerpts from official documentation are relevant to the user's question. ` +
              `Use them to give a precise, accurate answer. ` +
              `If the excerpts aren't relevant, use your training knowledge.\n\n` +
              `DOCUMENTATION CONTEXT:\n${context}`;

            // Inject or augment system message
            const hasSystem = ragMessages.find(m => m.role === 'system');
            if (hasSystem) {
              ragMessages = ragMessages.map(m =>
                m.role === 'system'
                  ? { ...m, content: ragSystemContent + '\n\n---\n\n' + m.content }
                  : m
              );
            } else {
              ragMessages = [{ role: 'system', content: ragSystemContent }, ...ragMessages];
            }
            ragUsed = true;
          }
        }
      }
    } catch (ragErr) {
      // RAG is optional — fail silently, continue with unaugmented messages
      console.warn('RAG retrieval failed (non-fatal):', ragErr.message);
    }
  }

  try {
    const r = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: selectedModel, messages: ragMessages, stream: false }),
      signal: AbortSignal.timeout(120000)
    });
    if (!r.ok) {
      const hint = r.status === 404
        ? `Model "${selectedModel}" not found locally.\nRun:  ollama pull ${selectedModel}`
        : `Ollama error ${r.status}: ${r.statusText}`;
      return res.json({ error: hint });
    }
    const data = await r.json();
    return res.json({ content: data.message?.content || '', refinedQuestion, ragUsed });
  } catch (err) {
    return res.json({ error: `Cannot reach Ollama at ${OLLAMA_BASE}.\n\nFix: open a Terminal and run:\n  ollama serve\n\nError: ${err.message}` });
  }
});

// ── Save generated code to local project folder ─────────────────────
app.post('/api/save-file', (req, res) => {
  const { code, filename, folder } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  let targetDir;
  try {
    targetDir = path.resolve(folder || path.join(__dirname, 'generated-code'));
  } catch {
    return res.status(400).json({ error: 'Invalid folder path' });
  }

  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch (e) {
    return res.status(500).json({ error: `Cannot create folder: ${e.message}` });
  }

  let fname = filename;
  if (!fname) {
    const match = code.match(/public\s+class\s+(\w+)/);
    fname = match ? `${match[1]}.java` : `SeleniumCode_${Date.now()}.java`;
  }

  const fullPath = path.join(targetDir, fname);
  try {
    fs.writeFileSync(fullPath, code, 'utf8');
    return res.json({ ok: true, path: fullPath, filename: fname });
  } catch (e) {
    return res.status(500).json({ error: `Cannot write file: ${e.message}` });
  }
});

// ── Submit Project for AI Code Review ───────────────────────────────
// Fetches Java files from a public GitHub repo and sends them to AI for review.
app.post('/api/submit-review', async (req, res) => {
  const { repoUrl, model } = req.body;
  if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/\s#?]+)/);
  if (!match) return res.status(400).json({ error: 'Invalid GitHub URL. Expected: https://github.com/owner/repo' });

  const [, owner, repo] = match;
  const { default: fetch } = await import('node-fetch');
  const ghHeaders = {
    'Accept':     'application/vnd.github.v3+json',
    'User-Agent': 'SeleniumLab-Training/1.0'
  };

  try {
    // List all files in the repo tree
    const treeRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`,
      { headers: ghHeaders, signal: AbortSignal.timeout(15000) }
    );
    if (!treeRes.ok) {
      const msg = treeRes.status === 404
        ? `Repo not found: ${owner}/${repo}. Make sure it exists and is public.`
        : `GitHub API error: ${treeRes.status}`;
      return res.status(400).json({ error: msg });
    }

    const tree = await treeRes.json();
    const javaFiles = (tree.tree || [])
      .filter(f => f.type === 'blob' && f.path.endsWith('.java'))
      .slice(0, 8);   // limit to 8 files to stay within token budget

    if (!javaFiles.length) {
      return res.json({ ok: false, error: 'No .java files found in the repository. Commit your Selenium test files first.' });
    }

    // Fetch file contents
    const fileContents = [];
    for (const file of javaFiles) {
      try {
        const fc = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(file.path)}`,
          { headers: ghHeaders, signal: AbortSignal.timeout(10000) }
        );
        if (!fc.ok) continue;
        const d = await fc.json();
        if (d.content) {
          const content = Buffer.from(d.content, 'base64').toString('utf8');
          fileContents.push({ path: file.path, content: content.slice(0, 3000) }); // 3k chars per file
        }
      } catch { /* skip unreadable files */ }
    }

    if (!fileContents.length) {
      return res.json({ ok: false, error: 'Could not read any Java files from the repository.' });
    }

    // Build review prompt
    const filesText = fileContents
      .map(f => `### ${f.path}\n\`\`\`java\n${f.content}\n\`\`\`\n`)
      .join('\n');

    const reviewPrompt = `You are an expert Selenium with Java automation engineer reviewing code from a learner who just completed the SeleniumLab training course.

Repository: ${owner}/${repo}
Files reviewed: ${fileContents.map(f => f.path).join(', ')}

${filesText}

Provide a structured code review with these sections:

## 🌟 Overall Assessment
Brief summary of the project quality and what you see.

## ✅ What's Done Well
Highlight good practices, patterns used correctly, positive observations.

## 📚 Structure & Design
Project organization, package structure, Page Object Model usage, class design.

## 🤖 Selenium Best Practices
Locator strategy quality, wait strategies, element interactions, driver management.

## 🧪 TestNG Usage
Test annotations (@Test, @BeforeClass, etc.), assertions, data providers, grouping.

## 🔧 Areas for Improvement
Specific suggestions with code examples where helpful.

## 🏅 Score
Give a score out of 10 for: Structure, Selenium Usage, Code Quality. Format as a table.

Be encouraging, specific, and practical. This person is a beginner building their first automation framework.`;

    // Send to AI provider
    const selectedModel = model || (GROQ_KEY ? 'llama-3.3-70b-versatile' : 'qwen2.5-coder:14b');
    const provider      = getProvider(selectedModel);
    let reviewText = '';

    if (provider === 'groq' && GROQ_KEY) {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_KEY}` },
        body:    JSON.stringify({ model: selectedModel, messages: [{ role: 'user', content: reviewPrompt }], max_tokens: 3000, stream: false }),
        signal:  AbortSignal.timeout(60000)
      });
      const d = await r.json();
      reviewText = d.choices?.[0]?.message?.content || 'Could not generate review.';

    } else if (provider === 'anthropic' && ANTHROPIC_KEY) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': ANTHROPIC_KEY, 'anthropic-version': '2023-06-01' },
        body:    JSON.stringify({ model: selectedModel, max_tokens: 3000, messages: [{ role: 'user', content: reviewPrompt }] }),
        signal:  AbortSignal.timeout(60000)
      });
      const d = await r.json();
      reviewText = d.content?.find(b => b.type === 'text')?.text || 'Could not generate review.';

    } else {
      // Local Ollama fallback
      const r = await fetch(`${OLLAMA_BASE}/api/chat`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ model: selectedModel, messages: [{ role: 'user', content: reviewPrompt }], stream: false }),
        signal:  AbortSignal.timeout(180000)
      });
      const d = await r.json();
      reviewText = d.message?.content || 'Could not generate review.';
    }

    return res.json({
      ok:            true,
      review:        reviewText,
      repo:          `${owner}/${repo}`,
      filesReviewed: fileContents.map(f => f.path)
    });

  } catch (err) {
    return res.status(500).json({ error: `Review failed: ${err.message}` });
  }
});

// ── Health check — all three providers + RAG ──────────────────────
app.get('/api/health', async (req, res) => {
  const { default: fetch } = await import('node-fetch');
  const result = {
    server:    'ok',
    groq:      GROQ_KEY      ? 'key_set'  : 'no_key',
    claude:    ANTHROPIC_KEY ? 'key_set'  : 'no_key',
    ollama:    'offline',
    ollamaModels: [],
    rag:       ragEnabled ? ragGetStatus() : { available: false }
  };

  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) });
    const data = await r.json();
    result.ollama       = 'ok';
    result.ollamaModels = data.models?.map(m => m.name) || [];
  } catch { /* offline */ }

  res.json(result);
});

// ── SPA catch-all ─────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Selenium Training App → http://localhost:${PORT}`);
  console.log(`\n🤖 AI Providers:`);
  console.log(`   Groq   : ${GROQ_KEY      ? '✅ key set' : '❌ set GROQ_API_KEY'}`);
  console.log(`   Claude : ${ANTHROPIC_KEY ? '✅ key set' : '⚠️  set ANTHROPIC_API_KEY (optional)'}`);
  console.log(`   Ollama : run "ollama serve" for local models`);
  if (ragEnabled) {
    const ragStatus = ragGetStatus();
    console.log(`\n📚 RAG Knowledge Base:`);
    console.log(`   Status : ${ragStatus.synced ? `✅ Synced (${ragStatus.count} chunks, ${ragStatus.sources.length} sources)` : '⏳ Not synced yet — open Settings → Sync Docs'}`);
    if (!ragStatus.synced) console.log(`   Setup  : ollama pull nomic-embed-text:latest`);
  }
  console.log('');
});
