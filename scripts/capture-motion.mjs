import { chromium } from '@playwright/test';
import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
const dir = 'artifacts/motion-review';
await mkdir(dir, {recursive:true});
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:1440,height:1000},recordVideo:{dir,size:{width:1440,height:1000}}});
const page = await context.newPage();
await page.goto('http://127.0.0.1:4185/motion-study/');
await page.locator('img').evaluateAll(images => Promise.all(images.map(i=>i.decode())));
await page.screenshot({path:`${dir}/prototype-rest.png`});
await page.getByRole('button', {name:'Play both treatments'}).click();
const samples=[];
for(let i=0;i<20;i++) { samples.push(await page.locator('.motion-study-screen').evaluateAll(es=>es.map(e=>({transform:getComputedStyle(e).transform,animations:e.getAnimations().length})))); await page.waitForTimeout(80); if(i===2||i===6) await page.screenshot({path:`${dir}/prototype-frame-${i}.png`}); }
if(new Set(samples.map(s=>JSON.stringify(s))).size<3) throw Error('Motion did not play');
await writeFile(`${dir}/samples.json`,JSON.stringify(samples,null,2));
await context.close();
await browser.close();

for (const file of await readdir(dir)) {
 if (!file.endsWith('.png')) continue;
 const bytes = await readFile(`${dir}/${file}`);
 console.log(`MOTION_FILE ${file} ${bytes.toString('base64')}`);
}
