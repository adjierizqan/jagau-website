import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dir = 'artifacts/motion-review';
await mkdir(dir, {recursive:true});
const browser = await chromium.launch();
const report={source:process.env.SOURCE_SHA,baseline:'6e9eda4e1e525542df334e7d0cbb9c776458d5b1',prototypes:[],pages:[],visualAcceptance:'REQUIRES_INSPECTION'};
async function shot(page,name) {
 const bytes=await page.screenshot({type:'jpeg',quality:88});
 await writeFile(`${dir}/${name}.jpg`,bytes);
 report.pages.push({file:`${name}.jpg`,sha256:createHash('sha256').update(bytes).digest('hex')});
}
const context = await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir,size:{width:1440,height:1000}}});
const page = await context.newPage();
await page.goto('http://127.0.0.1:4185/motion-study/');
await page.locator('img').evaluateAll(images => Promise.all(images.map(i=>i.decode())));
await shot(page,'prototype-rest');
await page.getByRole('button', {name:'Play both treatments'}).click();
for(let i=0;i<20;i++) { report.prototypes.push(await page.locator('.motion-study-screen').evaluateAll(es=>es.map(e=>({transform:getComputedStyle(e).transform,animations:e.getAnimations().length})))); if(i===0||i===2||i===6) await shot(page,`prototype-frame-${i}`); await page.waitForTimeout(60); }
assert(new Set(report.prototypes.map(s=>JSON.stringify(s))).size>=3,'Motion did not play');
await context.close();
for (const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844}]) {
 for(const theme of ['light','dark']) {
  for(const [label,port] of [['before',4186],['after',4185]]) {
   const ctx=await browser.newContext({viewport,colorScheme:theme,...(label==='after' && viewport.width===1440 && theme==='light'?{recordVideo:{dir,size:viewport}}:{})});
   const p=await ctx.newPage();
   const errors=[];p.on('pageerror',e=>errors.push(e.message));
   await p.addInitScript(theme=>{
    localStorage.setItem('aw-theme',theme);
    window.__motionMetrics={cls:0,longTasks:[]};
    new PerformanceObserver(list=>{ for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.__motionMetrics.cls+=entry.value; }).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(list=>{window.__motionMetrics.longTasks.push(...list.getEntries().map(e=>e.duration));}).observe({type:'longtask',buffered:true});
   },theme);
   const prefix=`${viewport.width}-${theme}-${label}`;
   for(const [name,path] of [['home','/'],['labstock','/projects/labstock/'],['suhulog','/projects/suhulog/'],['bdrs','/projects/bdrs/']]) {
    await p.goto(`http://127.0.0.1:${port}${path}`);
    await p.locator('main').first().waitFor();
    await p.waitForTimeout(1900);
    await p.locator('main img').evaluateAll(images=>Promise.all(images.filter(i=>{const r=i.getBoundingClientRect();return r.width>0 && r.height>0 && r.bottom>0 && r.top<innerHeight;}).map(async i=>{i.loading='eager';await Promise.race([i.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error('Visible image decode timeout')),10000))]);})));
    console.log(`CAPTURE ${prefix}-${name}`);
    await shot(p,`${prefix}-${name}`);
    if(name!=='home') {
     const hero=p.locator(name==='labstock'?'.ls-hero':name==='suhulog'?'.suhu-phone':viewport.width<761?'.bdrs-hero-mobile .study-media':'.bdrs-hero-desktop .study-media').first();
     await hero.scrollIntoViewIfNeeded();
     await p.waitForTimeout(120);
     await shot(p,`${prefix}-${name}-moving`);
     await p.waitForTimeout(1200);
     await shot(p,`${prefix}-${name}-evidence`);
    }
    assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Horizontal overflow');
    if(label==='after' && name==='home') {
     const metrics=await p.evaluate(()=>({...window.__motionMetrics,transfer:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0),animations:document.getAnimations().filter(a=>a.playState==='running').length}));
     report.pages.push({viewport,theme,metrics});
     assert(metrics.animations===0,'Idle motion remains');
     const link=p.locator('.home-proof a').first(); await link.focus(); await p.waitForTimeout(700); await shot(p,`${prefix}-focus`);
     if(viewport.width===1440) {await p.locator('.home-project').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(180); await shot(p,`${prefix}-selected-moving`); await p.waitForTimeout(1200);await shot(p,`${prefix}-selected`);}
    }
   }
   await p.goto(`http://127.0.0.1:${port}/`);
   await p.locator('.aw-dock').getByRole('button', {name:'Studio',exact:true}).click();
   await p.locator('.workspace-studio').waitFor();
   await p.waitForTimeout(1800);
   await shot(p,`${prefix}-studio`);
   assert.equal(errors.length,0,errors.join('\n'));
   await ctx.close();
  }
 }
}
await browser.close();
await writeFile(`${dir}/report.json`,JSON.stringify(report,null,2));
const files=await readdir(dir);
const html=`<!doctype html><meta charset="utf-8"><title>JAGAU motion review</title><style>body{font:16px system-ui;background:#eaeae7;color:#222;margin:24px}img,video{width:100%;height:auto}section{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:28px 0}figure{margin:0}h1{font-size:28px}a{color:inherit}</style><h1>JAGAU / spatial motion review</h1><p>PR #13 baseline → isolated motion experiment. Owner decision pending. Recordings are browser capture of the presentation, not product interaction recordings.</p><a href="report.json">Source, hashes and measured results</a>`+files.filter(f=>f.endsWith('.webm')).map(f=>`<video controls loop muted src="${f}"></video>`).join('')+files.filter(f=>f.includes('-before-')).map(f=>`<section><figure><figcaption>Before / ${f}</figcaption><img src="${f}"></figure><figure><figcaption>After</figcaption><img src="${f.replace('-before-','-after-')}"></figure></section>`).join('');
await writeFile(`${dir}/index.html`,html);
for(const file of ['report.json','index.html',...files.filter(f=>f.endsWith('.jpg'))]) {
 const bytes=await readFile(`${dir}/${file}`);
 const encoded=bytes.toString('base64');
 console.log(`MOTION_FILE ${file} ${createHash('sha256').update(bytes).digest('hex')} ${bytes.length}`);
 for(let i=0;i<encoded.length;i+=4096) console.log(`MOTION_PART ${file} ${i/4096} ${encoded.slice(i,i+4096)}`);
}
