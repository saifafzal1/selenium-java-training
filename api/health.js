// v2 — updated model list
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.json({ server: 'ok', groq: 'no_key', models: [], error: 'GROQ_API_KEY not set' });
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

    // Current active Groq models exposed in the dropdown
    const preferred = [
      'llama-3.3-70b-versatile',
      'llama-3.1-8b-instant',
      'qwen/qwen3-32b',
      'meta-llama/llama-4-scout-17b-16e-instruct',
      'openai/gpt-oss-120b',
      'groq/compound',
      'groq/compound-mini'
    ];
    const available = (data.data || []).map(m => m.id);
    const models = preferred.filter(m => available.includes(m));

    return res.json({ server: 'ok', groq: 'ok', models, ollamaModels: models });
  } catch (e) {
    return res.json({ server: 'ok', groq: 'error', models: [], error: e.message });
  }
};
