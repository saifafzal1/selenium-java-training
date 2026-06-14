// rag/embed.js — embed text via nomic-embed-text running in Ollama
// Prerequisites: ollama pull nomic-embed-text:latest
'use strict';

const OLLAMA_BASE = process.env.OLLAMA_URL || 'http://localhost:11434';

/**
 * Embed a single text string using nomic-embed-text.
 * @param {string} text
 * @param {Function} fetchFn  node-fetch (injected so callers can share the import)
 * @returns {number[]|null}  768-dim embedding vector, or null on failure
 */
async function embed(text, fetchFn) {
  const r = await fetchFn(`${OLLAMA_BASE}/api/embed`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ model: 'nomic-embed-text:latest', input: text }),
    signal:  AbortSignal.timeout(15000)
  });
  if (!r.ok) throw new Error(`Embed ${r.status}: ${r.statusText}`);
  const data = await r.json();
  // Ollama /api/embed returns { embeddings: [[...768 floats...]] }
  return data.embeddings?.[0] ?? data.embedding ?? null;
}

module.exports = { embed };
