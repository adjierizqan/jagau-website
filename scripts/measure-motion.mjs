import { chromium } from '@playwright/test';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch();
const results=[];
for(const [name,port] of [['before',4186],['after',4185]]) {
 const context=await browser.newContext({viewport:{width:390,height:844}});
 const page=await context.newPage();
 const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
 await cdp.send('Network.enable');
 await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:120,downloadThroughput:187500,uploadThroughput:93750});
 await page.addInitScript(()=>{
  window.__qa={cls:0,lcp:0,longTasks:[]};
  new PerformanceObserver(l=>{for(const e of l.getEntries()) if(!e.hadRecentInput)window.__qa.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  new PerformanceObserver(l=>{window.__qa.lcp=l.getEntries().at(-1).startTime;}).observe({type:'largest-contentful-paint',buffered:true});
  new PerformanceObserver(l=>window.__qa.longTasks.push(...l.getEntries().map(e=>e.duration))).observe({type:'longtask',buffered:true});
 });
 await page.goto(`http://127.0.0.1:${port}/`);
 await page.locator('.home-proof img').first().evaluate(i=>i.decode());
 const firstPreviewDecoded=await page.evaluate(()=>performance.now());
 await page.waitForTimeout(1800);
 const metrics=await page.evaluate(()=>({...window.__qa,bytes:performance.getEntriesByType('resource').reduce((n,e)=>n+e.transferSize,0),runningAnimations:document.getAnimations().filter(a=>a.playState==='running').length,brokenImages:[...document.querySelectorAll('.home-proof img')].filter(i=>i.complete&&!i.naturalWidth).length}));
 // Measure the actual selected-work entrance in this throttled browser.
 const samples=await page.evaluate(async()=>{
  const values=[];let last=performance.now();const end=last+1500;
  document.querySelector('.home-project').scrollIntoView({behavior:'instant'});
  await new Promise(resolve=>{function frame(now){values.push(now-last);last=now;if(now<end)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame);});
  return values.filter(n=>n>0).sort((a,b)=>a-b);
 });
 results.push({name,conditions:'Chromium CI, 4x CPU, 120ms latency, 1.5Mbps down, mobile 390x844; one synthetic cold run, not field CWV',firstPreviewDecoded,...metrics,frameIntervalP95:samples[Math.floor(samples.length*.95)],framesOver50ms:samples.filter(n=>n>50).length});
 await context.close();
}
await browser.close();
await writeFile('artifacts/motion-review/performance.json',JSON.stringify(results,null,2));
console.log('MOTION_PERFORMANCE '+JSON.stringify(results));
