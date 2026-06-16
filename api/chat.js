// ── IP Rate Limiter (in-memory, per warm instance) ──────────
// Max 30 requests per IP per hour. Resets automatically.
const ipWindows    = new Map();
const RATE_LIMIT   = 30;               // max requests per window
const WINDOW_MS    = 60 * 60 * 1000;  // 1-hour rolling window
const MAX_MSG_CHARS = 4000;            // truncate any single message longer than this

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = ipWindows.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    ipWindows.set(ip, { count: 1, windowStart: now });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  entry.count++;
  if (entry.count > RATE_LIMIT) {
    const resetIn = Math.ceil((WINDOW_MS - (now - entry.windowStart)) / 60000);
    return { allowed: false, resetIn };
  }
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

// Purge stale IP entries every 100 requests to prevent memory leak
let _cleanupTick = 0;
function maybeCleanup() {
  if (++_cleanupTick % 100 !== 0) return;
  const now = Date.now();
  for (const [ip, entry] of ipWindows.entries()) {
    if (now - entry.windowStart > WINDOW_MS) ipWindows.delete(ip);
  }
}

// ── Truncate oversized messages (fix #6) ────────────────────
function truncateMessages(messages) {
  return messages.map(m => {
    if (typeof m.content === 'string' && m.content.length > MAX_MSG_CHARS) {
      return {
        ...m,
        content: m.content.slice(0, MAX_MSG_CHARS) +
          `\n\n[... truncated at ${MAX_MSG_CHARS} chars to protect API quota ...]`
      };
    }
    return m;
  });
}

// ── Provider detection ───────────────────────────────────────
const GROQ_MODELS = new Set([
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3-32b',
  'meta-llama/llama-4-scout-17b-16e-instruct',
  'openai/gpt-oss-120b',
]);

function getProvider(model = '') {
  if (model.startsWith('claude-')) return 'anthropic';
  if (GROQ_MODELS.has(model))       return 'groq';
  return 'ollama';
}

// ── Qwen prompt refinement helper (Smart Mode) ───────────────
async function refineWithQwen(messages, groqKey) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  if (!lastUserMsg || !groqKey) return null;
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${groqKey}` },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        max_tokens: 300,
        stream: false,
        messages: [
          { role: 'system', content: 'You are a prompt refinement engine for a Selenium/Playwright coding tutor. Rewrite the user\'s question to be precise, specific, and technical. Return ONLY the refined question — no preamble, no explanation.' },
          { role: 'user', content: lastUserMsg.content.slice(0, 1000) } // cap refinement input too
        ]
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch { return null; }
}

// ── Main handler ─────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).end();

  // ── IP Rate Limit check ──────────────────────────────────
  const ip = getClientIp(req);
  maybeCleanup();
  const { allowed, remaining, resetIn } = checkRateLimit(ip);

  if (!allowed) {
    return res.status(429).json({
      error: `⏱️ Rate limit reached (${RATE_LIMIT} messages/hour).\n\nYou can send more messages in ~${resetIn} minute${resetIn === 1 ? '' : 's'}.\n\nTip: Switch to a local Ollama model for unlimited usage.`
    });
  }

  // Add remaining count to response headers (useful for debugging)
  res.setHeader('X-RateLimit-Remaining', remaining);
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT);

  const { messages, model, chainMode } = req.body;

  // ── Validate & truncate messages (fixes #4 + #6) ─────────
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'No messages provided.' });
  }
  const safeMessages = truncateMessages(messages);

  const selectedModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const provider = getProvider(selectedModel);

  // ── Smart Mode: refine prompt with Qwen first ─────────────
  let workingMessages = safeMessages;
  let refinedQuestion = null;
  if (chainMode) {
    refinedQuestion = await refineWithQwen(safeMessages, process.env.GROQ_API_KEY);
    if (refinedQuestion) {
      const lastUserIdx = safeMessages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop();
      workingMessages = safeMessages.map((m, i) =>
        i === lastUserIdx ? { ...m, content: refinedQuestion } : m
      );
    }
  }

  // ── Groq ──────────────────────────────────────────────────
  if (provider === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.json({ error: 'GROQ_API_KEY is not set in Vercel Environment Variables.' });

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 55000);
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: selectedModel, messages: workingMessages, stream: false, max_tokens: 2048 }),
        signal: controller.signal
      });
      clearTimeout(tid);
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        if (r.status === 401) return res.json({ error: 'Invalid GROQ_API_KEY — check Vercel env vars.' });
        if (r.status === 429) return res.json({ error: 'Groq rate limit hit. Wait a moment and retry, or switch models.' });
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
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.json({
      error: '⚠️ ANTHROPIC_API_KEY is not set.\n\nTo use Claude:\n1. Get a key at console.anthropic.com\n2. Add ANTHROPIC_API_KEY to Vercel → Settings → Environment Variables\n3. Redeploy'
    });

    try {
      const systemMsg    = workingMessages.find(m => m.role === 'system');
      const convoMsgs    = workingMessages.filter(m => m.role !== 'system');
      const body = { model: selectedModel, max_tokens: 2048, messages: convoMsgs };
      if (systemMsg) body.system = systemMsg.content;

      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 55000);
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type':      'application/json',
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(tid);
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        if (r.status === 401) return res.json({ error: 'Invalid ANTHROPIC_API_KEY.' });
        if (r.status === 429) return res.json({ error: 'Claude rate limit hit. Wait a moment.' });
        return res.json({ error: `Claude error ${r.status}: ${txt.slice(0, 200)}` });
      }
      const data = await r.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      return res.json({ content: text, refinedQuestion });
    } catch (err) {
      return res.json({ error: `Claude request failed: ${err.message}` });
    }
  }

  // ── Ollama (local only) ───────────────────────────────────
  return res.json({
    error: `"${selectedModel}" is a local Ollama model and only works when running locally with npm start.\n\nFor the cloud version, choose a Groq or Claude model from the dropdown.`
  });
};
