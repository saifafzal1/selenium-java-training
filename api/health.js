module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 5000); // 5s timeout
    const r = await fetch(`${ollamaUrl}/api/tags`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeleniumTraining/1.0)' }
    });
    clearTimeout(tid);
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
