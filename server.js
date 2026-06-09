const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const PROGRESS_FILE = path.join(__dirname, 'data', 'progress.json');

// ── Ollama / Qwen config (can be overridden via env vars) ──────────────────
const OLLAMA_BASE    = process.env.OLLAMA_URL   || 'http://localhost:11434';
const DEFAULT_MODEL  = process.env.QWEN_MODEL   || 'qwen3:latest';

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Progress API ──────────────────────────────────────────────────────────
function readProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    return { completedLessons: [], lastVisited: null, startedAt: null, notes: {} };
  }
}

function writeProgress(data) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2));
}

app.get('/api/progress', (req, res) => {
  res.json(readProgress());
});

app.post('/api/progress', (req, res) => {
  const current = readProgress();
  const update  = req.body;

  if (update.reset) {
    writeProgress({ completedLessons: [], lastVisited: null, startedAt: null, notes: {} });
    return res.json({ ok: true, progress: readProgress() });
  }

  if (update.completedLesson !== undefined) {
    if (!current.completedLessons.includes(update.completedLesson)) {
      current.completedLessons.push(update.completedLesson);
    }
    if (!current.startedAt) current.startedAt = new Date().toISOString();
  }

  if (update.removeLesson !== undefined) {
    current.completedLessons = current.completedLessons.filter(l => l !== update.removeLesson);
  }

  if (update.lastVisited !== undefined) current.lastVisited = update.lastVisited;

  if (update.note) {
    current.notes[update.note.lessonId] = update.note.text;
  }

  writeProgress(current);
  res.json({ ok: true, progress: current });
});

// ── Chat API (Ollama / Qwen proxy) ────────────────────────────────────────
app.post('/api/chat', async (req, res) => {
  const { messages, model } = req.body;
  const selectedModel = model || DEFAULT_MODEL;

  try {
    const { default: fetch } = await import('node-fetch');

    const ollamaRes = await fetch(`${OLLAMA_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: selectedModel, messages, stream: false })
    });

    if (!ollamaRes.ok) {
      const hint = ollamaRes.status === 404
        ? `Model not found. Run:  ollama pull ${selectedModel}`
        : `Ollama error ${ollamaRes.status}: ${ollamaRes.statusText}`;
      return res.json({ error: hint });
    }

    const data = await ollamaRes.json();
    return res.json({ content: data.message?.content || '' });

  } catch (err) {
    return res.json({ error: `Cannot reach Ollama. Is it running?\n  ollama serve\n\nError: ${err.message}` });
  }
});

// ── Config API ────────────────────────────────────────────────────────────
app.get('/api/config', (req, res) => {
  res.json({
    ollamaUrl: OLLAMA_BASE,
    defaultModel: DEFAULT_MODEL,
    availableModels: ['qwen3:latest', 'qwen3:8b', 'qwen3:4b', 'qwen3:1.7b', 'qwen2.5-coder:latest', 'qwen2.5-coder:7b']
  });
});

// ── Health check ──────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const { default: fetch } = await import('node-fetch');
    const r = await fetch(`${OLLAMA_BASE}/api/tags`, { signal: AbortSignal.timeout(2000) });
    const data = await r.json();
    res.json({ server: 'ok', ollama: 'ok', models: data.models?.map(m => m.name) || [] });
  } catch {
    res.json({ server: 'ok', ollama: 'offline', models: [] });
  }
});

// ── Serve SPA ─────────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🚀 Selenium Training App running at http://localhost:${PORT}`);
  console.log(`📚 Open your browser and start learning!\n`);
  console.log(`💬 For AI chat, ensure Ollama is running:`);
  console.log(`   ollama serve`);
  console.log(`   ollama pull qwen3:latest\n`);
});
