'use strict';
const { embed } = require('./embed');
const { addChunks } = require('./store');
const CHUNK_SIZE=600, CHUNK_OVERLAP=80;
function stripHtml(h){return h.replace(/<script[\s\S]*?<\/script>/gi,' ').replace(/<style[\s\S]*?<\/style>/gi,' ').replace(/<nav[\s\S]*?<\/nav>/gi,' ').replace(/<header[\s\S]*?<\/header>/gi,' ').replace(/<footer[\s\S]*?<\/footer>/gi,' ').replace(/<[^>]+>/g,' ').replace(/&nbsp;/g,' ').replace(/\s{2,}/g,' ').trim();}
function chunkText(text,source){const chunks=[],ts=new Date().toISOString();let i=0,id=0;while(i<text.length){const s=text.slice(i,i+CHUNK_SIZE).trim();if(s.length>60)chunks.push({chunkId:`${source}__${id++}`,source,text:s,ts});i+=CHUNK_SIZE-CHUNK_OVERLAP;}return chunks;}
async function ingestUrl(url,label,fetchFn,onProgress){
  try{
    onProgress?.({stage:'fetch',url});
    const r=await fetchFn(url,{headers:{'User-Agent':'SeleniumLab-RAG/1.0'},signal:AbortSignal.timeout(20000)});
    if(!r.ok)throw new Error(`HTTP ${r.status}`);
    const html=await r.text(),text=stripHtml(html),chunks=chunkText(text,label);
    onProgress?.({stage:'embed',url,embedded:0,totalChunks:chunks.length});
    const embedded=[];
    for(let i=0;i<chunks.length;i++){const v=await embed(chunks[i].text,fetchFn);if(v)embedded.push({...chunks[i],embedding:v});onProgress?.({stage:'embed',url,embedded:i+1,totalChunks:chunks.length});}
    const added=addChunks(embedded);
    return {ok:true,url,label,chunksAdded:added};
  }catch(err){onProgress?.({stage:'error',url,error:err.message});return {ok:false,url,label,error:err.message};}
}
async function ingestAll(sources,fetchFn,onProgress){const r=[];for(const s of sources)r.push(await ingestUrl(s.url,s.label,fetchFn,onProgress));return r;}
module.exports = { ingestAll, ingestUrl };
