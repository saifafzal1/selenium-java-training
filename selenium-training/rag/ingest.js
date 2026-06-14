// rag/ingest.js — fetch → strip HTML → chunk → embed → persist pipeline
'use strict';

const { embed }     = require('./embed');
const { addChunks } = require('./store');

const CHUNK_SIZE    = 600;   // characters per chunk
const CHUNK_OVERLAP = 80;    // overlap between consecutive chunks (for context continuity)

// ── HTML stripping ─────────────────────────────────────────────

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi,   ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi,       ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<[^>]+>/g,   ' ')
    .replace(/&nbsp;/g,    ' ')
    .replace(/&lt;/g,      '<')
    .replace(/&gt;/g,      '>')
    .replace(/&amp;/g,     '&')
    .replace(/&quot;/g,    '"')
    .replace(/&#39;/g,     "'")
    .replace(/\s{2,}/g,    ' ')
    .trim();
}

// ── Chunking ───────────────────────────────────────────────────

function chunkText(text, source) {
  const chunks = [];
  const ts     = new Date().toISOString();
  let i = 0, id = 0;
  while (i < text.length) {
    const slice = text.slice(i, i + CHUNK_SIZE).trim();
    if (slice.length > 60) {           // skip tiny fragments
      chunks.push({ chunkId: `${source}__${id++}`, source, text: slice, ts });
    }
    i += CHUNK_SIZE - CHUNK_OVERLAP;
  }
  return chunks;
}

// ── Single URL ingestion ───────────────────────────────────────

/**
 * Fetch one URL, chunk the text, embed each chunk, save to store.
 *
 * @param {string}   url       The page URL to ingest
 * @param {string}   label     Source label stored with each chunk
 * @param {Function} fetchFn   node-fetch (injected)
 * @param {Function} [onProgress]  progress callback { stage, url, embedded, totalChunks }
 * @returns {{ ok, url, label, chunksAdded?, error? }}
 */
async function ingestUrl(url, label, fetchFn, onProgress) {
  try {
    onProgress?.({ stage: 'fetch', url });

    const r = await fetchFn(url, {
      headers: { 'User-Agent': 'SeleniumLab-RAG/1.0 (local knowledge sync)' },
      signal:  AbortSignal.timeout(20000)
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);

    const html   = await r.text();
    const text   = stripHtml(html);
    const chunks = chunkText(text, label);

    onProgress?.({ stage: 'embed', url, embedded: 0, totalChunks: chunks.length });

    const embedded = [];
    for (let i = 0; i < chunks.length; i++) {
      const vec = await embed(chunks[i].text, fetchFn);
      if (vec) embedded.push({ ...chunks[i], embedding: vec });
      onProgress?.({ stage: 'embed', url, embedded: i + 1, totalChunks: chunks.length });
    }

    const added = addChunks(embedded);
    return { ok: true, url, label, chunksAdded: added };

  } catch (err) {
    onProgress?.({ stage: 'error', url, error: err.message });
    return { ok: false, url, label, error: err.message };
  }
}

// ── Batch ingestion ────────────────────────────────────────────

/**
 * Ingest all sources sequentially, reporting progress per-source.
 */
async function ingestAll(sources, fetchFn, onProgress) {
  const results = [];
  for (const src of sources) {
    results.push(await ingestUrl(src.url, src.label, fetchFn, onProgress));
  }
  return results;
}

module.exports = { ingestAll, ingestUrl };
