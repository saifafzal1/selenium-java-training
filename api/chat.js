module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.json({ error: 'GROQ_API_KEY is not set.\nGo to Vercel → Settings → Environment Variables and add it.' });
  }

  const { messages, model } = req.body;
  const selectedModel = model || process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  try {
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), 55000);

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model:      selectedModel,
        messages,
        stream:     false,
        max_tokens: 4096
      }),
      signal: controller.signal
    });
    clearTimeout(tid);

    if (!groqRes.ok) {
      const text = await groqRes.text().catch(() => '');
      let hint;
      if (groqRes.status === 401) hint = 'Invalid GROQ_API_KEY — check it in Vercel env vars.';
      else if (groqRes.status === 429) hint = 'Rate limit hit. Free tier: 14,400 tokens/min. Wait a moment and try again.';
      else hint = `Groq API error ${groqRes.status}: ${text.slice(0, 200)}`;
      return res.json({ error: hint });
    }

    const data = await groqRes.json();
    return res.json({ content: data.choices?.[0]?.message?.content || '' });

  } catch (err) {
    return res.json({ error: `Request failed: ${err.message}` });
  }
};
