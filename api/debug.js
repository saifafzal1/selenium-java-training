module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const apiKey  = process.env.GROQ_API_KEY;
  const keySet  = !!apiKey;
  let reachable = false, models = [], error = null;

  if (apiKey) {
    try {
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 6000);
      const r = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { 'Authorization': `Bearer ${apiKey}` },
        signal: controller.signal
      });
      if (r.ok) {
        const data = await r.json();
        reachable = true;
        models = (data.data || []).map(m => m.id)
          .filter(id => ['llama-3.3-70b-versatile','llama-3.1-8b-instant','qwen-qwq-32b','gemma2-9b-it','mixtral-8x7b-32768'].includes(id));
      } else {
        error = `HTTP ${r.status}`;
      }
    } catch (err) { error = err.message; }
  }

  const verdict = !keySet
    ? '❌ GROQ_API_KEY not set — add it in Vercel → Settings → Environment Variables'
    : reachable
      ? `✅ Groq API connected — ${models.length} model(s) available`
      : `❌ Groq API unreachable: ${error}`;

  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><head><title>SeleniumLab Debug</title>
  <style>
    body{font-family:Inter,sans-serif;background:#07090E;color:#E8EDF5;padding:40px}
    h1{color:#FF6B2B;font-size:22px;margin-bottom:24px}
    .verdict{font-size:15px;margin-bottom:28px;padding:16px 20px;border-radius:8px;border:1px solid #1C2A3A;background:#0C1018}
    table{border-collapse:collapse;width:100%;margin-bottom:28px}
    td,th{padding:10px 16px;border:1px solid #1C2A3A;font-size:13px;text-align:left}
    th{background:#111827;color:#FF6B2B}
    .ok{color:#3cff8f}.err{color:#ff4d6d}.warn{color:#ffb347}
    pre{background:#060A10;padding:20px;border-radius:8px;border:1px solid #1C2A3A;font-size:12px;color:#C8D8EC;white-space:pre-wrap}
  </style></head><body>
  <h1>⚡ SeleniumLab — Debug</h1>
  <div class="verdict">${verdict}</div>
  <table>
    <tr><th>Check</th><th>Value</th><th>Status</th></tr>
    <tr><td>GROQ_API_KEY</td><td>${keySet ? 'gsk_••••••••' : '(not set)'}</td><td class="${keySet?'ok':'err'}">${keySet?'✓ set':'✗ missing'}</td></tr>
    <tr><td>Groq API</td><td>api.groq.com/openai/v1</td><td class="${reachable?'ok':'err'}">${reachable?'✓ online':'✗ '+(error||'offline')}</td></tr>
    <tr><td>Available models</td><td>${models.join(', ')||'none'}</td><td class="${models.length?'ok':'warn'}">${models.length?'✓':'⚠'}</td></tr>
    <tr><td>Node.js</td><td>${process.version}</td><td class="ok">✓</td></tr>
  </table>
  <pre>${JSON.stringify({timestamp:new Date().toISOString(),keySet,reachable,models,error},null,2)}</pre>
  </body></html>`);
};
