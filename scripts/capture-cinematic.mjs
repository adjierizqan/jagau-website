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
 await page.goto(process.env.QA_BASE_URL || 'http://127.0.0.1:4185/');
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(700);
 await page.screenshot({path:`${root}/${label}-home.png`});
 const stage=page.getByRole('region',{name:'Explore real project screens'});await stage.scrollIntoViewIfNeeded();
 const box=await stage.locator('.evidence-space').boundingBox();
 if(box&&label==='desktop'){await page.mouse.move(box.x+box.width*.2,box.y+box.height*.3);await page.waitForTimeout(600);await page.mouse.move(box.x+box.width*.8,box.y+box.height*.7);await page.waitForTimeout(600);}
 await stage.getByRole('button',{name:'Next screenshot'}).click();await page.waitForTimeout(600);
 await stage.getByRole('button',{name:/02 SuhuLog/}).click();await page.waitForTimeout(600);
 await page.screenshot({path:`${root}/${label}-suhulog.png`});
 await stage.getByRole('button',{name:'Ask about SuhuLog ↗'}).click();await page.waitForTimeout(900);
 await page.screenshot({path:`${root}/${label}-chat.png`});
 for(const route of ['work','studio','projects/labstock','projects/suhulog','projects/bdrs','projects/elab','projects','labs','knowledge']){
  await page.goto(`${process.env.QA_BASE_URL || 'http://127.0.0.1:4185'}/${route}/`);await page.waitForTimeout(700);
  const skip=page.getByRole('button',{name:/Skip animation/});if(await skip.count())await skip.click();
  await page.screenshot({path:`${root}/${label}-${route.replaceAll('/','-')}.png`});
  await page.mouse.wheel(0,580);await page.waitForTimeout(700);
 }
 const perf=await page.evaluate(()=>({navigation:performance.getEntriesByType('navigation').map(n=>({domContentLoaded:n.domContentLoadedEventEnd,load:n.loadEventEnd})),overflow:document.documentElement.scrollWidth>innerWidth}));
 writeFileSync(`${root}/${label}-performance.json`,JSON.stringify({errors,...perf},null,2));console.log('PERFORMANCE_REPORT '+JSON.stringify({label,errors,...perf}));
 const video=page.video();await context.close();await video.saveAs(`${root}/${label}-interactions.webm`);
}
await browser.close();
for(const n of readdirSync(root).filter(n=>n.endsWith('.png'))){const b=await sharp(`${root}/${n}`).resize({width:1280,withoutEnlargement:true}).jpeg({quality:86}).toBuffer();const s=b.toString('base64'),name=n.replace('.png','.jpg');console.log(`CINE_FILE ${name} ${createHash('sha256').update(b).digest('hex')} ${b.length}`);for(let i=0;i<s.length;i+=4096)console.log(`CINE_PART ${name} ${i/4096} ${s.slice(i,i+4096)}`);}
