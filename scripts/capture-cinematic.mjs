import {chromium} from '@playwright/test';
import {mkdirSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const root='artifacts/cinematic-qa';mkdirSync(root,{recursive:true});
const browser=await chromium.launch();const context=await browser.newContext({viewport:{width:1440,height:900},recordVideo:{dir:root,size:{width:1440,height:900}}});const page=await context.newPage();
const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:4185/');
await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(1200);await page.screenshot({path:`${root}/desktop-home.png`});const stage=page.getByRole('region',{name:'LabStock cinematic presentation'});await stage.scrollIntoViewIfNeeded();
const v=stage.locator('video');await v.evaluate(v=>v.play());await page.waitForTimeout(16500);
const metrics=await v.evaluate(v=>({time:v.currentTime,duration:v.duration,ended:v.ended,ready:v.readyState,quality:v.getVideoPlaybackQuality().toJSON?.()??{frames:v.getVideoPlaybackQuality().totalVideoFrames,dropped:v.getVideoPlaybackQuality().droppedVideoFrames}}));
await stage.getByRole('button',{name:'02 SuhuLog'}).click();await page.waitForTimeout(4000);await page.screenshot({path:`${root}/desktop-suhulog.png`});
await page.getByRole('button',{name:'Ask about SuhuLog ↗'}).click();await page.waitForTimeout(1500);await page.screenshot({path:`${root}/desktop-chat.png`});
const perf=await page.evaluate(()=>({resources:performance.getEntriesByType('resource').map(r=>({name:r.name,bytes:r.transferSize,duration:r.duration})),navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd}))}));
writeFileSync(`${root}/performance.json`,JSON.stringify({metrics,errors,...perf},null,2));await context.close();await browser.close();
for(const n of readdirSync(root).filter(n=>n.endsWith('.png'))){const b=await sharp(`${root}/${n}`).resize({width:1280,withoutEnlargement:true}).jpeg({quality:86}).toBuffer();const s=b.toString('base64'),name=n.replace('.png','.jpg');console.log(`CINE_FILE ${name} ${createHash('sha256').update(b).digest('hex')} ${b.length}`);for(let i=0;i<s.length;i+=4096)console.log(`CINE_PART ${name} ${i/4096} ${s.slice(i,i+4096)}`);}
console.log('PERFORMANCE_REPORT '+JSON.stringify({metrics,errors,navigation:perf.navigation}));
