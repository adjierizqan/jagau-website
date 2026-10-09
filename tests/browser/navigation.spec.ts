import {test,expect} from '@playwright/test';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const axe=readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'),'utf8');
const records:object[]=[];
async function capture(page:import('@playwright/test').Page,name:string){
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all(document.getAnimations().filter(a=>a.effect?.getTiming().iterations!==Infinity).map(a=>a.finished.catch(()=>{})));});
 const png=await page.screenshot({scale:'css'}),jpg=await page.screenshot({type:'jpeg',quality:92,scale:'css'});
 mkdirSync('artifacts/navigation-browser',{recursive:true});writeFileSync(`artifacts/navigation-browser/${name}.png`,png);writeFileSync(`artifacts/navigation-browser/${name}.jpg`,jpg);
 const sha=createHash('sha256').update(jpg).digest('hex');records.push({name,viewport:page.viewportSize(),pngSha256:createHash('sha256').update(png).digest('hex'),reviewSha256:sha});
 console.log(`REVIEW_FILE ${name}.jpg ${sha} ${jpg.length}`);const b=jpg.toString('base64');for(let i=0;i<b.length;i+=4096)console.log(`REVIEW_PART ${name}.jpg ${i/4096} ${b.slice(i,i+4096)}`);
}
test.afterAll(()=>{mkdirSync('artifacts/navigation-browser',{recursive:true});writeFileSync(`artifacts/navigation-browser/manifest-${test.info().project.name}.json`,JSON.stringify({records},null,2));});
for(const [width,height]of [[1440,900],[768,1024],[390,844]])for(const theme of ['light','dark']){
 test(`four destinations, studio, case history and chat ${width} ${theme}`,async({page},info)=>{
  await page.setViewportSize({width,height});await page.emulateMedia({colorScheme:theme as 'light'|'dark',reducedMotion:'reduce'});await page.addInitScript(value=>localStorage.setItem('aw-theme',value),theme);await page.goto('/');
  await expect(page.locator('.aw-dock button')).toHaveCount(4);await expect(page.locator('.aw-new-session')).toHaveCount(0);
  const nav=page.locator('.aw-primary-nav');await expect(nav.getByRole('button')).toHaveCount(5); // Four destinations plus command-palette utility.
  for(const label of ['Home','Projects','Ask','Studio'])await expect(nav.getByRole('button',{name:label,exact:true})).toHaveCount(1);
  for(const label of ['Work','Labs','Knowledge'])await expect(nav.getByRole('button',{name:label,exact:true})).toHaveCount(0);
  async function open(label:string){if(width<760&&!(await page.locator('.aw-sidebar').getAttribute('class'))?.includes('is-open'))await page.getByRole('button',{name:'Open navigation',exact:true}).click();const button=nav.getByRole('button',{name:label,exact:true});await button.focus();await page.keyboard.press('Enter');}
  await open('Projects');await expect(page.locator('main h1')).toHaveText('Projects');for(const name of ['LabStock','SuhuLog','BDRS','ELAB'])await expect(page.locator('.aw-project-objects button').filter({has:page.locator('strong',{hasText:name})})).toHaveCount(1);
  await capture(page,`${info.project.name}-${width}-${theme}-projects`);
  await page.locator('.aw-project-objects button').filter({has:page.locator('strong',{hasText:'ELAB'})}).click();await expect(page).toHaveURL(/\/projects\/elab\/$/);await expect(page.locator('main')).toContainText('In progress');await page.goBack();await expect(page.locator('main h1')).toHaveText('Projects');
  await open('Studio');await expect(page.locator('main h1')).toHaveText('Studio');await expect(page.locator('main')).toContainText('Adjie Rizqan');await expect(page.locator('main a[href="mailto:adjie@jagau.id"]')).toHaveCount(1);await capture(page,`${info.project.name}-${width}-${theme}-studio`);
  await page.addScriptTag({content:axe});const violations=await page.evaluate(async()=>{const a=(window as unknown as {axe:{run(o:unknown):Promise<{violations:{id:string;nodes:{target:string[];failureSummary:string}[]}[]}>}}).axe;return (await a.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}})).violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));});expect(violations).toEqual([]);
  await open('Ask');await expect(page.locator('.aw-new-session')).toHaveCount(1);await page.getByRole('textbox',{name:'Ask about JAGAU or founder work'}).fill('What is ELAB?');await page.getByRole('button',{name:'Send query',exact:true}).click();await expect(page.locator('.aw-message:not(.is-user)').last()).toContainText('ELAB');await capture(page,`${info.project.name}-${width}-${theme}-ask`);
  await page.keyboard.press('Control+n');await expect(page.locator('.aw-message')).toHaveCount(0);await expect(page.locator('.aw-new-session')).toHaveCount(1);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 });
}
