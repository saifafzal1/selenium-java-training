module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const { messages, model } = req.body;
  const selectedModel = model || process.env.QWEN_MODEL || 'qwen3:latest';

  // SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const { default: fetch } = await import('node-fetch');

    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: selectedModel, messages, stream: true })
    });

    if (!ollamaRes.ok) {
      const hint = ollamaRes.status === 404
        ? `Model not found. Pull it:\n  ollama pull ${selectedModel}`
        : `Ollama error ${ollamaRes.status}: ${ollamaRes.statusText}`;
      res.write(`data: ${JSON.stringify({ error: hint })}\n\n`);
      return res.end();
    }

    for await (const chunk of ollamaRes.body) {
      const lines = chunk.toString().split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.message?.content) {
            res.write(`data: ${JSON.stringify({ content: parsed.message.content, done: parsed.done })}\n\n`);
          }
          if (parsed.done) { res.write('data: [DONE]\n\n'); return res.end(); }
        } catch {}
      }
    }
    res.end();
  } catch (err) {
    const msg = ollamaUrl === 'http://localhost:11434'
      ? `Cannot reach Ollama. On Vercel, set OLLAMA_URL to your public tunnel URL.\nLocally run: ollama serve`
      : `Cannot reach Ollama at ${ollamaUrl}. Check OLLAMA_URL environment variable.`;
    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
};
