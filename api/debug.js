// Diagnostic endpoint — visit /api/debug in your browser to verify the setup
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
  const envSet    = !!process.env.OLLAMA_URL;

  let ollamaReachable = false;
  let ollamaError     = null;
  let models          = [];

  try {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), 6000);
    const r = await fetch(`${ollamaUrl}/api/tags`, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SeleniumTraining/1.0)' }
    });

    if (r.ok) {
      const data  = await r.json();
      ollamaReachable = true;
      models = data.models?.map(m => m.name) || [];
    } else {
      const text = await r.text();
      ollamaError = `HTTP ${r.status} — ${text.slice(0, 300)}`;
    }
  } catch (err) {
    ollamaError = err.message;
  }

  const result = {
    timestamp:       new Date().toISOString(),
    nodeVersion:     process.version,
    ollamaUrl,
    envVarSet:       envSet,
    ollamaReachable,
    models,
    ollamaError,
    verdict: ollamaReachable
      ? `✅ Everything looks good — ${models.length} model(s) available`
      : envSet
        ? `❌ OLLAMA_URL is set to "${ollamaUrl}" but Vercel cannot reach it. Is the tunnel running?`
        : `❌ OLLAMA_URL env var is not set in Vercel. Add it in Settings → Environment Variables, then Redeploy.`
  };

  // Pretty HTML response for easy reading in browser
  res.setHeader('Content-Type', 'text/html');
  res.send(`<!DOCTYPE html><html><head>
    <title>SeleniumLabs Debug</title>
    <style>
      body { font-family: monospace; background: #0b1a12; color: #e8f5ec; padding: 32px; }
      h1 { color: #3cff8f; }
      pre { background: #0f2218; padding: 20px; border-radius: 8px; border: 1px solid #1e3d28; white-space: pre-wrap; }
      .ok  { color: #3cff8f; }
      .err { color: #ff4d6d; }
    </style></head><body>
    <h1>⚡ SeleniumLabs — Vercel Debug</h1>
    <p class="${ollamaReachable ? 'ok' : 'err'}">${result.verdict}</p>
    <pre>${JSON.stringify(result, null, 2)}</pre>
    </body></html>`);
};
