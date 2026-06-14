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
  return 'ollama'; // local-only — won't work on Vercel, handled gracefully
}

// ── Qwen prompt refinement helper ────────────────────────────
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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).end();

  const { messages, model, chainMode } = req.body;
  const selectedModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
  const provider = getProvider(selectedModel);

  // Smart Mode: refine prompt with fast Groq model first
  let workingMessages = messages;
  let refinedQuestion = null;
  if (chainMode) {
    refinedQuestion = await refineWithQwen(messages, process.env.GROQ_API_KEY);
    if (refinedQuestion) {
      const lastUserIdx = messages.map((m, i) => m.role === 'user' ? i : -1).filter(i => i >= 0).pop();
      workingMessages = messages.map((m, i) =>
        i === lastUserIdx ? { ...m, content: refinedQuestion } : m
      );
    }
  }

  // ── Groq ────────────────────────────────────────────────────
  if (provider === 'groq') {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return res.json({ error: 'GROQ_API_KEY is not set in Vercel Environment Variables.' });

    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 55000);
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({ model: selectedModel, messages: workingMessages, stream: false, max_tokens: 4096 }),
        signal: controller.signal
      });
      clearTimeout(tid);
      if (!r.ok) {
        const txt = await r.text().catch(() => '');
        if (r.status === 401) return res.json({ error: 'Invalid GROQ_API_KEY — check Vercel env vars.' });
        if (r.status === 429) return res.json({ error: 'Groq rate limit hit. Wait a moment and retry.' });
        return res.json({ error: `Groq error ${r.status}: ${txt.slice(0, 200)}` });
      }
      const data = await r.json();
      return res.json({ content: data.choices?.[0]?.message?.content || '', refinedQuestion });
    } catch (err) {
      return res.json({ error: `Groq request failed: ${err.message}` });
    }
  }

  // ── Anthropic / Claude ──────────────────────────────────────
  if (provider === 'anthropic') {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.json({
      error: '⚠️ ANTHROPIC_API_KEY is not set.\n\nTo use Claude:\n1. Get a key at console.anthropic.com\n2. Add ANTHROPIC_API_KEY to Vercel → Settings → Environment Variables\n3. Redeploy'
    });

    try {
      const systemMsg = workingMessages.find(m => m.role === 'system');
      const convoMsgs = workingMessages.filter(m => m.role !== 'system');
      const body = { model: selectedModel, max_tokens: 4096, messages: convoMsgs };
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

  // ── Ollama (local only — not available on Vercel) ───────────
  return res.json({
    error: `"${selectedModel}" is a local Ollama model and only works when running the app locally with npm start.\n\nFor the cloud version, choose a Groq or Claude model from the dropdown.`
  });
};
