import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='artifacts/cinematic-qa';mkdirSync(root,{recursive:true});
const browser=await chromium.launch();
for(const viewport of [{width:1440,height:900},{width:390,height:844}]){
 const label=viewport.width===1440?'desktop':'mobile';
 const context=await browser.newContext({viewport,recordVideo:{dir:root,size:viewport}});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__reviewMetrics={lcp:0,cls:0,longTasks:0,longTaskMs:0};
  for(const type of ['largest-contentful-paint','layout-shift','longtask']){
   try{new PerformanceObserver(list=>{for(const entry of list.getEntries()){
    if(type==='largest-contentful-paint')window.__reviewMetrics.lcp=entry.startTime;
    if(type==='layout-shift'&&!entry.hadRecentInput)window.__reviewMetrics.cls+=entry.value;
    if(type==='longtask'){window.__reviewMetrics.longTasks++;window.__reviewMetrics.longTaskMs+=entry.duration;}
   }}).observe({type,buffered:true});}catch{}
  }
 });
 await page.goto(process.env.QA_BASE_URL || 'http://127.0.0.1:4185/');
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2000);
 await page.screenshot({path:`${root}/${label}-home.png`});
 await page.getByRole("button",{name:"Replay motion ↻"}).click();
 await page.waitForTimeout(280);await page.screenshot({path:`${root}/${label}-words-280ms.png`});
 await page.waitForTimeout(420);await page.screenshot({path:`${root}/${label}-words-700ms.png`});
 await page.waitForTimeout(1200);
 const homePerformance=await page.evaluate(()=>({sample:window.__reviewMetrics,navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})),resourceBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),videoRequests:performance.getEntriesByType('resource').filter(r=>/\.(mp4|webm)/.test(r.name)).length}));
 const stage=page.getByRole('region',{name:'Explore real project screens'});await stage.scrollIntoViewIfNeeded();
 const box=await stage.locator('.evidence-space').boundingBox();
 if(box&&label==='desktop'){await page.mouse.move(box.x+box.width*.2,box.y+box.height*.3);await page.waitForTimeout(600);await page.mouse.move(box.x+box.width*.8,box.y+box.height*.7);await page.waitForTimeout(600);}
 await stage.getByRole('button',{name:'Next screenshot'}).click();await page.waitForTimeout(600);
 await stage.getByRole('button',{name:/02 SuhuLog/}).click();await page.waitForTimeout(600);
 await page.screenshot({path:`${root}/${label}-suhulog.png`});
 await stage.getByRole('button',{name:'Ask about SuhuLog ↗'}).click();await page.waitForTimeout(900);
 await page.screenshot({path:`${root}/${label}-chat.png`});
 for(const label of ['Projects','Studio','Ask']){
  if(viewport.width<760)await page.getByRole('button',{name:'Open navigation',exact:true}).click();
  await page.locator('.aw-primary-nav').getByRole('button',{name:label,exact:true}).click();await page.waitForTimeout(650);
  await page.screenshot({path:`${root}/${viewport.width}-${label.toLowerCase()}.png`});
  await page.mouse.wheel(0,580);await page.waitForTimeout(600);
 }
 for(const slug of ['labstock','suhulog','bdrs','elab']){
  await page.goto(`${process.env.QA_BASE_URL || 'http://127.0.0.1:4185'}/projects/${slug}/`);await page.waitForTimeout(1500);
  await page.screenshot({path:`${root}/${label}-${slug}.png`});
  await page.mouse.wheel(0,650);await page.waitForTimeout(650);
  await page.screenshot({path:`${root}/${label}-${slug}-body.png`});
 }
 const perf=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})),overflow:document.documentElement.scrollWidth>innerWidth}));
 writeFileSync(`${root}/${label}-performance.json`,JSON.stringify({errors,homePerformance,...perf},null,2));console.log('PERFORMANCE_REPORT '+JSON.stringify({label,errors,homePerformance,...perf}));
 const video=page.video();await context.close();await video.saveAs(`${root}/${label}-interactions.webm`);
}
await browser.close();
for(const n of readdirSync(root).filter(n=>n.endsWith('.png'))){const b=await sharp(`${root}/${n}`).resize({width:1280,withoutEnlargement:true}).jpeg({quality:86}).toBuffer();const s=b.toString('base64'),name=n.replace('.png','.jpg');console.log(`CINE_FILE ${name} ${createHash('sha256').update(b).digest('hex')} ${b.length}`);for(let i=0;i<s.length;i+=4096)console.log(`CINE_PART ${name} ${i/4096} ${s.slice(i,i+4096)}`);}
