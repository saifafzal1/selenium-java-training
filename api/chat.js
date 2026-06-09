module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const { messages, model } = req.body;
  const selectedModel = model || process.env.QWEN_MODEL || 'qwen3:latest';

  try {
    const controller = new AbortController();
    // 55s — stays under the 60s maxDuration set in vercel.json
    const tid = setTimeout(() => controller.abort(), 55000);

    const ollamaRes = await fetch(`${ollamaUrl}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (compatible; SeleniumTraining/1.0)'
      },
      // stream:false — get the full reply in one JSON object, no SSE needed
      body: JSON.stringify({ model: selectedModel, messages, stream: false }),
      signal: controller.signal
    });
    clearTimeout(tid);

    if (!ollamaRes.ok) {
      const text = await ollamaRes.text().catch(() => '');
      return res.json({
        error: ollamaRes.status === 404
          ? `Model "${selectedModel}" not found on your machine.\nRun:  ollama pull ${selectedModel}`
          : `Ollama returned HTTP ${ollamaRes.status}.\nResponse: ${text.slice(0, 300)}`
      });
    }

    const data = await ollamaRes.json();
    return res.json({ content: data.message?.content || '' });

  } catch (err) {
    const isLocal = ollamaUrl.includes('localhost') || ollamaUrl.includes('127.0.0.1');
    return res.json({
      error: isLocal
        ? `Cannot reach Ollama locally.\nMake sure it is running:  ollama serve\n\nError: ${err.message}`
        : `Cannot reach Ollama tunnel at:\n${ollamaUrl}\n\nCheck the tunnel is still running on your machine.\nError: ${err.message}`
    });
  }
};
