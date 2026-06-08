module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  try {
    const { default: fetch } = await import('node-fetch');
    const r = await fetch(`${ollamaUrl}/api/tags`, {
      signal: AbortSignal.timeout(3000)
    });
    const data = await r.json();
    return res.json({
      server: 'ok',
      ollama: 'ok',
      models: data.models?.map(m => m.name) || []
    });
  } catch {
    return res.json({ server: 'ok', ollama: 'offline', models: [] });
  }
};
