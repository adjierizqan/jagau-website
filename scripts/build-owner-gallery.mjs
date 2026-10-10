#!/usr/bin/env node
// Offline only. Never uploads input files. Generated bundles belong under ignored artifacts/.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync,existsSync} from 'node:fs';
import {resolve,dirname,extname} from 'node:path';
import {createHash} from 'node:crypto';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw Error('Expected local manifest and NEW output directory');
const manifest=JSON.parse(readFileSync(input,'utf8')),out=resolve(output);
if(existsSync(out))throw Error('Preserve evidence: output already exists');
const ids=new Set();
for(const row of manifest.entries){
 if(!row.id||ids.has(row.id))throw Error('Duplicate or missing review ID');ids.add(row.id);
 for(const side of ['before','after'])if(row[side]){
  const file=resolve(dirname(resolve(input)),row[side].path),bytes=readFileSync(file);
  const hash=createHash('sha256').update(bytes).digest('hex');
  if(row[side].sha256&&row[side].sha256!==hash)throw Error('Hash mismatch: '+file);
  const ext=extname(file).toLowerCase();if(!['.png','.jpg','.jpeg','.webp'].includes(ext))throw Error('Image type rejected');
  row[side]={...row[side],path:`images/${hash}${ext}`,sha256:hash};
 }
}
mkdirSync(out,{recursive:true});mkdirSync(resolve(out,'images'));
const original=JSON.parse(readFileSync(input,'utf8'));
original.entries.forEach((row,i)=>{for(const side of ['before','after'])if(row[side])copyFileSync(resolve(dirname(resolve(input)),row[side].path),resolve(out,manifest.entries[i][side].path));});
const fingerprint=createHash('sha256').update(JSON.stringify(manifest)).digest('hex');
writeFileSync(resolve(out,'manifest.json'),JSON.stringify({...manifest,fingerprint},null,2));
const data=JSON.stringify({...manifest,fingerprint}).replaceAll('<','\\u003c');
writeFileSync(resolve(out,'index.html'),`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>JAGAU — owner visual review</title>
<style>*{box-sizing:border-box}body{font:15px/1.6 system-ui;margin:0;background:#f2f3f2;color:#242a2b}header,main{max-width:1440px;margin:auto;padding:24px}h1{font-size:28px;margin:0}h2{font-size:20px}p{max-width:100ch}button,select,input,textarea{font:inherit;padding:8px;border:1px solid #a4aaa7;border-radius:5px;background:white;color:inherit}button{cursor:pointer}button:focus-visible,select:focus-visible,input:focus-visible,textarea:focus-visible{outline:3px solid #2563eb;outline-offset:3px}.tools{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}.card{background:white;border:1px solid #d4d9d6;padding:20px;margin-bottom:20px;border-radius:8px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}.pair figure{margin:0;min-width:0}.image{display:block;width:100%;padding:0;border:0;background:#e8ece9}.image img{width:100%;height:auto;display:block}.meta{font-size:12px;overflow-wrap:anywhere;color:#515b56}figcaption{margin:8px 0}.missing{padding:50px 20px;background:#f2f3f2}.review{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:16px}.review textarea{flex:1;min-width:220px}.flag{font-weight:600;color:#634412}dialog{width:95vw;max-width:1500px;height:94vh;padding:16px;border:1px solid #b4b9b6}dialog::backdrop{background:#000b}.viewer{height:calc(100% - 60px);overflow:auto;margin-top:12px}.viewer img{display:block;max-width:100%;max-height:100%;margin:auto;object-fit:contain}.viewer.zoom img{max-width:none;max-height:none}.viewerbar{display:flex;align-items:center;gap:10px}#zoom-title{flex:1}label{display:flex;gap:6px;align-items:center;flex-wrap:wrap;max-width:100%}input{max-width:100%;min-width:0}input[type=file]{width:260px}[hidden]{display:none!important}@media(max-width:760px){header,main{padding:16px}.pair{grid-template-columns:1fr}.card{padding:12px}.review textarea{min-width:100%}}</style>
<header><h1>JAGAU · Before / After review</h1><p id="summary"></p><p class="flag">Review-only. Original cleared images remain in the release candidate. The 14 blocked replacement images are excluded from this review; publication remains blocked. Real AI is deferred. Owner approval is pending until you record it below.</p><div class="tools"><label>Milestone <select id="phase"><option value="">All</option></select></label><label>Viewport <select id="viewport"><option value="">All</option></select></label><label>Theme <select id="theme"><option value="">All</option><option>light</option><option>dark</option></select></label><label>Search <input id="search" type="search"></label><label>Review <select id="status"><option value="">All</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="changes">Revise</option><option value="rejected">Reject</option></select></label></div><div class="tools"><button id="export">Export owner decisions</button><label>Import decisions <input id="import" type="file" accept="application/json"></label><span id="progress" role="status"></span></div></header><main id="cards"></main><dialog aria-labelledby="zoom-title"><div class="viewerbar"><strong id="zoom-title"></strong><button id="zoom">Actual pixels / fit</button><button id="close">Close</button></div><div class="viewer"><img alt=""></div></dialog><script type="application/json" id="data">${data}</script>
<script>
const data=JSON.parse(document.getElementById('data').textContent),key='jagau-review-'+data.fingerprint;let decisions={};
try{decisions=JSON.parse(localStorage.getItem(key)||'{}')}catch{};
const $=id=>document.getElementById(id),esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(key,JSON.stringify(decisions))}catch{}progress()}
function progress(){const values=Object.values(decisions);$('progress').textContent=values.filter(v=>v.status==='approved').length+' / '+data.entries.length+' approved · '+values.filter(v=>v.status==='changes').length+' revise · '+values.filter(v=>v.status==='rejected').length+' rejected. Export to preserve decisions.'}
for(const id of ['phase','viewport'])for(const value of [...new Set(data.entries.map(r=>r[id]))])$(id).add(new Option(value,value));
$('summary').textContent=data.description+' · '+data.entries.length+' review entries. Click either image to zoom. SHA-256 and source revisions are preserved in manifest.json.';
const dialog=document.querySelector('dialog');let origin;
function render(){
 const rows=data.entries.filter(r=>['phase','viewport','theme'].every(k=>!$(k).value||r[k]===$(k).value)&&(!$('status').value||(decisions[r.id]?.status||'pending')===$('status').value)&&JSON.stringify(r).toLowerCase().includes($('search').value.toLowerCase()));
 $('cards').innerHTML=rows.map(r=>'<article class="card"><h2>'+esc(r.title)+'</h2><p>'+esc(r.description)+'</p><p class="meta">'+esc(r.phase)+' · '+esc(r.viewport)+' · '+esc(r.theme)+' · '+esc(r.changeState||'Review required')+'</p>'+(r.comparable===false?'<p class="flag">NON-COMPARABLE: '+esc(r.reason)+'</p>':'')+'<div class="pair">'+['before','after'].map(side=>r[side]?'<figure><figcaption>'+side.toUpperCase()+' · '+esc(r[side].label)+'</figcaption><button class="image" data-image="'+esc(r[side].path)+'" data-title="'+esc(r.title+' · '+side)+'" aria-label="Zoom '+esc(r.title+' '+side)+'"><img loading="lazy" src="'+esc(r[side].path)+'" alt="'+esc(r.title+' '+side)+'"></button><p class="meta">SHA-256 '+esc(r[side].sha256)+'</p></figure>':'<div class="missing">NEW / NO BEFORE · no equivalent page or capture exists.</div>').join('')+'</div><div class="review"><label>Owner decision <select data-decision="'+esc(r.id)+'">'+['pending','approved','changes','rejected'].map(v=>'<option value="'+v+'"'+((decisions[r.id]?.status||'pending')===v?' selected':'')+'>'+({pending:'Pending',approved:'Approved',changes:'Revise',rejected:'Reject'}[v])+'</option>').join('')+'</select></label><textarea aria-label="Review notes for '+esc(r.title)+'" data-notes="'+esc(r.id)+'" placeholder="Owner feedback">'+esc(decisions[r.id]?.notes||'')+'</textarea></div></article>').join('');progress()
}
for(const id of ['phase','viewport','theme','search','status'])$(id).addEventListener('input',render);
$('cards').addEventListener('change',e=>{const id=e.target.dataset.decision||e.target.dataset.notes;if(!id)return;decisions[id]={status:decisions[id]?.status||'pending',notes:decisions[id]?.notes||'',updatedAt:new Date().toISOString(),[e.target.dataset.decision?'status':'notes']:e.target.value};save()});
$('cards').addEventListener('click',e=>{const b=e.target.closest('[data-image]');if(!b)return;origin=b;$('zoom-title').textContent=b.dataset.title;dialog.querySelector('img').src=b.dataset.image;dialog.querySelector('img').alt=b.dataset.title;dialog.querySelector('.viewer').classList.remove('zoom');dialog.showModal();$('close').focus()});
$('zoom').onclick=()=>dialog.querySelector('.viewer').classList.toggle('zoom');$('close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>origin?.focus());
$('export').onclick=()=>{const blob=new Blob([JSON.stringify({fingerprint:data.fingerprint,decisions},null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='jagau-owner-decisions.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
$('import').onchange=async e=>{try{const value=JSON.parse(await e.target.files[0].text());if(value.fingerprint!==data.fingerprint)throw Error('Different review bundle');for(const [id,v]of Object.entries(value.decisions)){if(!data.entries.some(r=>r.id===id)||!['pending','approved','changes','rejected'].includes(v.status)||typeof v.notes!=='string')throw Error('Invalid review entry')}decisions=value.decisions;save();render()}catch(error){$('progress').textContent='Import rejected: '+error.message}};
render();
</script></html>`);
console.log(JSON.stringify({status:'OWNER_REVIEW_PENDING',entries:manifest.entries.length,images:new Set(manifest.entries.flatMap(r=>['before','after'].filter(s=>r[s]).map(s=>r[s].path))).size,fingerprint,output:out}));
