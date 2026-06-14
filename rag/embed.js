'use strict';
const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434';
async function embed(text, fetchFn) {
  const r = await fetchFn(`${OLLAMA_BASE}/api/embed`, {
    method: 'POST', headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ model: 'nomic-embed-text:latest', input: text }),
    signal: AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`Embed ${r.status}: ${r.statusText}`);
  const data = await r.json();
  return data.embeddings?.[0] ?? data.embedding ?? null;
}
module.exports = { embed };
