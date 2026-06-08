module.exports = async function handler(req, res) {
  // ── CORS ────────────────────────────────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const { messages, model } = req.body;
  const selectedModel = model || process.env.QWEN_MODEL || 'qwen3:latest';

  // ── SSE headers — must flush immediately so client sees the stream ──
  res.writeHead(200, {
    'Content-Type':      'text/event-stream',
    'Cache-Control':     'no-cache, no-transform',
    'Connection':        'keep-alive',
    'X-Accel-Buffering': 'no'   // disables nginx/Vercel proxy buffering
  });
  res.flushHeaders();

  const sendEvent = (payload) => res.write(`data: ${JSON.stringify(payload)}\n\n`);

  try {
    // Use native fetch (Node 20 — available on Vercel without node-fetch)
    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Browser-like UA prevents Cloudflare quick-tunnel from blocking the request
        'User-Agent': 'Mozilla/5.0 (compatible; SeleniumTraining/1.0)'
      },
      body: JSON.stringify({ model: selectedModel, messages, stream: true })
    });

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text().catch(() => '');
      const hint = ollamaRes.status === 404
        ? `Model not found. Run: ollama pull ${selectedModel}`
        : `Ollama returned ${ollamaRes.status}: ${text.slice(0, 200)}`;
      sendEvent({ error: hint });
      return res.end();
    }

    // Stream via Web Streams reader (native fetch in Node 20)
    const reader  = ollamaRes.body.getReader();
    const decoder = new TextDecoder();
    let   buf     = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop(); // keep any partial last line for next iteration

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            sendEvent({ content: parsed.message.content, done: parsed.done });
          }
          if (parsed.done) {
            res.write('data: [DONE]\n\n');
            return res.end();
          }
        } catch { /* skip malformed JSON lines */ }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (err) {
    sendEvent({
      error: `Cannot reach Ollama at ${ollamaUrl}.\n`
           + `Make sure your tunnel is running and OLLAMA_URL is set in Vercel.\n`
           + `Error: ${err.message}`
    });
    res.end();
  }
};
