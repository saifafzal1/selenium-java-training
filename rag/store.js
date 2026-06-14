'use strict';
const fs = require('fs'), path = require('path');
const STORE_FILE = path.join(__dirname, '..', 'data', 'vector-store.json');
function cosineSimilarity(a, b) {
  let dot=0, ma=0, mb=0;
  for(let i=0;i<a.length;i++){dot+=a[i]*b[i];ma+=a[i]*a[i];mb+=b[i]*b[i];}
  const d=Math.sqrt(ma)*Math.sqrt(mb); return d<1e-12?0:dot/d;
}
function readStore() { try{return JSON.parse(fs.readFileSync(STORE_FILE,'utf8'));}catch{return[];} }
function writeStore(c) { fs.mkdirSync(path.dirname(STORE_FILE),{recursive:true}); fs.writeFileSync(STORE_FILE,JSON.stringify(c)); }
function getStatus() { const c=readStore(); if(!c.length) return {synced:false,count:0,sources:[],lastSynced:null}; return {synced:true,count:c.length,sources:[...new Set(c.map(x=>x.source))]}; }
function addChunks(n) { const e=readStore(); const ids=new Set(e.map(c=>c.chunkId)); const add=n.filter(c=>!ids.has(c.chunkId)); writeStore([...e,...add]); return add.length; }
function clearStore() { writeStore([]); }
function search(q, k=3, m=0.25) { const c=readStore(); if(!c.length||!q) return []; return c.map(x=>({...x,score:cosineSimilarity(q,x.embedding)})).sort((a,b)=>b.score-a.score).slice(0,k).filter(x=>x.score>=m); }
module.exports = { readStore, writeStore, getStatus, addChunks, clearStore, search };
