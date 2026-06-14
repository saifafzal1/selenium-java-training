// rag/store.js — local JSON vector store with cosine similarity retrieval
// No external database — all data lives in data/vector-store.json on disk
'use strict';

const fs   = require('fs');
const path = require('path');

const STORE_FILE = path.join(__dirname, '..', 'data', 'vector-store.json');

function cosineSimilarity(a, b) {
  let dot = 0, ma = 0, mb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    ma  += a[i] * a[i];
    mb  += b[i] * b[i];
  }
  const denom = Math.sqrt(ma) * Math.sqrt(mb);
  return denom < 1e-12 ? 0 : dot / denom;
}

function readStore() {
  try { return JSON.parse(fs.readFileSync(STORE_FILE, 'utf8')); }
  catch { return []; }
}

function writeStore(chunks) {
  fs.mkdirSync(path.dirname(STORE_FILE), { recursive: true });
  // Compact JSON — vector arrays make this file large
  fs.writeFileSync(STORE_FILE, JSON.stringify(chunks));
}

/**
 * Get a summary of what's in the knowledge base.
 */
function getStatus() {
  const chunks = readStore();
  if (!chunks.length) return { synced: false, count: 0, sources: [], lastSynced: null };
  const sources    = [...new Set(chunks.map(c => c.source))];
  const lastSynced = chunks.reduce((max, c) => (c.ts && c.ts > max ? c.ts : max), '');
  return { synced: true, count: chunks.length, sources, lastSynced };
}

/**
 * Append new chunks to the store, skipping duplicates by chunkId.
 * @returns {number} number of chunks actually added
 */
function addChunks(newChunks) {
  const existing    = readStore();
  const existingIds = new Set(existing.map(c => c.chunkId));
  const toAdd       = newChunks.filter(c => !existingIds.has(c.chunkId));
  writeStore([...existing, ...toAdd]);
  return toAdd.length;
}

/** Wipe the entire knowledge base. */
function clearStore() {
  writeStore([]);
}

/**
 * Find the top-k most similar chunks to queryEmbedding.
 * @param {number[]} queryEmbedding
 * @param {number}   topK
 * @param {number}   minScore  minimum cosine similarity threshold (0-1)
 * @returns {Array}  chunks with .score property added, sorted descending
 */
function search(queryEmbedding, topK = 3, minScore = 0.25) {
  const chunks = readStore();
  if (!chunks.length || !queryEmbedding) return [];
  return chunks
    .map(c  => ({ ...c, score: cosineSimilarity(queryEmbedding, c.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter(c => c.score >= minScore);
}

module.exports = { readStore, writeStore, getStatus, addChunks, clearStore, search };
