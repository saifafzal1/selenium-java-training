const express = require('express');
const cors    = require('cors');
const fs      = require('fs');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

const PROGRESS_FILE = path.join(__dirname, 'data', 'progress.json');

// ── Provider config ───────────────────────────────────────────
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

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Progress API ──────────────────────────────────────────────
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

// ── Qwen prompt refinement helper ────────────────────────────
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

// ── Chat API — multi-provider ─────────────────────────────────
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

  // ── Anthropic / Claude ────────────────────────────────────
  if (provider === 'anthropic') {
    if (!ANTHROPIC_KEY) return res.json({
      error: 'ANTHROPIC_API_KEY is not set.\n\nTo use Claude:\n1. Get a key at console.anthropic.com\n2. Set it: export ANTHROPIC_API_KEY=sk-ant-...\n3. Restart the server'
    });
    try {
      // Separate system message from conversation messages (Anthropic format)
      const systemMsg = workingMessages.find(m => m.role === 'system');
      const convoMsgs = workingMessages.filter(m => m.role !== 'system');
      const body = {
        model:      selectedModel,
        max_tokens: 4096,
        messages:   convoMsgs
      };
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

  // ── Ollama (local) ────────────────────────────────────────
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: selectedModel, messages: workingMessages, stream: false }),
      signal: AbortSignal.timeout(120000)
    });
    if (!r.ok) {
      const hint = r.status === 404
        ? `Model "${selectedModel}" not found locally.\nRun:  ollama pull ${selectedModel}`
        : `Ollama error ${r.status}: ${r.statusText}`;
      return res.json({ error: hint });
    }
    const data = await r.json();
    return res.json({ content: data.message?.content || '', refinedQuestion });
  } catch (err) {
    return res.json({ error: `Cannot reach Ollama at ${OLLAMA_BASE}.\n\nFix: open a Terminal and run:\n  ollama serve\n\nError: ${err.message}` });
  }
});

// ── Save generated code to local project folder ───────────────
app.post('/api/save-file', (req, res) => {
  const { code, filename, folder } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  // Resolve target directory (default: generated-code/ inside project)
  let targetDir;
  try {
    targetDir = path.resolve(folder || path.join(__dirname, 'generated-code'));
  } catch {
    return res.status(400).json({ error: 'Invalid folder path' });
  }

  // Create directory if it doesn't exist
  try {
    fs.mkdirSync(targetDir, { recursive: true });
  } catch (e) {
    return res.status(500).json({ error: `Cannot create folder: ${e.message}` });
  }

  // Auto-generate filename from Java class name if not provided
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

// ── Health check — all three providers ───────────────────────
app.get('/api/health', async (req, res) => {
  const { default: fetch } = await import('node-fetch');
  const result = {
    server:    'ok',
    groq:      GROQ_KEY      ? 'key_set'  : 'no_key',
    claude:    ANTHROPIC_KEY ? 'key_set'  : 'no_key',
    ollama:    'offline',
    ollamaModels: []
  };

  // Probe Ollama
  try {
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) });
    const data = await r.json();
    result.ollama       = 'ok';
    result.ollamaModels = data.models?.map(m => m.name) || [];
  } catch { /* offline */ }

  res.json(result);
});

// ── SPA catch-all ─────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Selenium Training App → http://localhost:${PORT}`);
  console.log(`\n🤖 AI Providers:`);
  console.log(`   Groq   : ${GROQ_KEY      ? '✅ key set' : '❌ set GROQ_API_KEY'}`);
  console.log(`   Claude : ${ANTHROPIC_KEY ? '✅ key set' : '⚠️  set ANTHROPIC_API_KEY (optional)'}`);
  console.log(`   Ollama : run "ollama serve" for local models\n`);
});
