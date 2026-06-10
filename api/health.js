module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.json({ server: 'ok', ollama: 'offline', models: [], error: 'GROQ_API_KEY not set' });
  }

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 5000);

    const r = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { 'Authorization': `Bearer ${apiKey}` },
      signal: controller.signal
    });

    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();

    // Filter to the models we expose in the dropdown
    const preferred = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'qwen-qwq-32b',
      'gemma2-9b-it',
      'mixtral-8x7b-32768'
    ];
    const available = (data.data || []).map(m => m.id);
    const models = preferred.filter(m => available.includes(m));

    return res.json({ server: 'ok', ollama: 'ok', models });
  } catch {
    return res.json({ server: 'ok', ollama: 'offline', models: [] });
  }
};
