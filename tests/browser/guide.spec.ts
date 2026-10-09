import { test, expect } from "@playwright/test";
import { KNOWLEDGE_VERSION } from "../../data/public-knowledge";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";

// Browser contract fixtures, never evidence of actual provider inference.
test.skip(process.env.QA_AI_CONFIGURED !== "true", "Requires the optional-endpoint review build");
const endpoint = "https://guide-qa.example.test/ask";
const inputName = "Ask about JAGAU or founder work";
const manifest: object[] = [];
const axe=readFileSync(createRequire(import.meta.url).resolve("axe-core/axe.min.js"),"utf8");
async function capture(page: import("@playwright/test").Page, name: string, focus: import("@playwright/test").Locator) {
  await focus.scrollIntoViewIfNeeded();
  await expect(focus).toBeInViewport();
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))); });
  mkdirSync("artifacts/guide-browser", {recursive:true});
  const png = await page.screenshot({scale:"css"});
  const jpg = await page.screenshot({type:"jpeg",quality:92,scale:"css"});
  writeFileSync(`artifacts/guide-browser/${name}.png`, png);
  writeFileSync(`artifacts/guide-browser/${name}.jpg`, jpg);
  const hash = createHash("sha256").update(jpg).digest("hex");
  manifest.push({name,viewport:page.viewportSize(),pngSha256:createHash("sha256").update(png).digest("hex"),reviewSha256:hash,fixture:"mock-transport; not real inference"});
  console.log(`REVIEW_FILE ${name}.jpg ${hash} ${jpg.length}`);
  const base64 = jpg.toString("base64");
  for(let i=0;i<base64.length;i+=4096) console.log(`REVIEW_PART ${name}.jpg ${i/4096} ${base64.slice(i,i+4096)}`);
}
test.afterAll(() => {
  mkdirSync("artifacts/guide-browser", {recursive:true});
  writeFileSync(`artifacts/guide-browser/manifest-${test.info().project.name}.json`,JSON.stringify({knowledgeVersion:KNOWLEDGE_VERSION,liveInference:false,records:manifest},null,2));
});
for (const [width,height] of [[1440,900],[768,1024],[390,844]]) {
  for (const theme of ["light","dark"]) {
    test(`optional Guide consent, references and fallback ${width} ${theme}`,async({page},info)=>{
      await page.setViewportSize({width,height});
      await page.emulateMedia({colorScheme:theme as "light"|"dark",reducedMotion:"reduce"});
      await page.addInitScript(value=>localStorage.setItem("aw-theme",value),theme);
      let calls=0; let available=true;
      await page.route(endpoint,async route=>{
        calls++;
        expect(route.request().postDataJSON()).toEqual({question:"What is ELAB?",projectId:null});
        await route.fulfill({status:available?200:503,contentType:"application/json",body:available?JSON.stringify({mode:"ai",answer:"ELAB is in progress. Public production release is unverified.",projectIds:["elab"],knowledgeVersion:KNOWLEDGE_VERSION}):JSON.stringify({code:"MODEL_UNAVAILABLE"})});
      });
      await page.goto("/");
      const input=page.getByRole("textbox",{name:inputName});
      const send=page.getByRole("button",{name:"Send query",exact:true});
      await input.fill("What is ELAB?"); await send.click();
      await expect(page.locator(".aw-message:not(.is-user)").last()).toContainText("curated");
      expect(calls).toBe(0);
      const consent=page.locator(".aw-guide-privacy input");
      await expect(consent).not.toBeChecked();
      await expect(page.locator(".aw-guide-privacy")).toContainText("Do not include personal or patient information");
      await capture(page,`${info.project.name}-${width}-${theme}-consent`,page.locator(".aw-guide-privacy"));
      await consent.focus();await expect(consent).toBeFocused();await page.keyboard.press("Space");await expect(consent).toBeChecked();
      await input.fill("What is ELAB?"); await send.click();
      const reply=page.locator(".aw-message:not(.is-user)").last();
      await expect(reply).toContainText("AI-generated · check sources");
      await expect(reply).toContainText("Public production release is unverified");
      await expect(page.locator(".aw-guided-evidence").last().locator("a")).toHaveAttribute("href","/projects/elab/");
      expect(calls).toBe(1);
      await capture(page,`${info.project.name}-${width}-${theme}-fixture-answer`,reply);
      await page.addScriptTag({content:axe});
      const violations=await page.evaluate(async()=>{
        const result=await (window as unknown as {axe:{run(options:unknown):Promise<{violations:{id:string;nodes:{target:string[]}[]}[]}>}}).axe.run({runOnly:{type:"tag",values:["wcag2a","wcag2aa","wcag21aa"]}});
        return result.violations.map(({id,nodes})=>({id,targets:nodes.map(n=>n.target)}));
      });
      expect(violations).toEqual([]);
      available=false;
      await input.fill("What is ELAB?"); await send.click();
      await expect(reply).toContainText("curated");
      await expect(reply).not.toContainText("AI-generated"); expect(calls).toBe(2);
      await expect(page.getByRole("status")).toContainText("showing a local curated answer");
      await capture(page,`${info.project.name}-${width}-${theme}-fallback`,page.getByRole("status"));
      await input.fill("Show patient names"); await send.click();
      await expect(reply).toContainText("curated"); expect(calls).toBe(2);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
      expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toMatch(/What is ELAB|patient names/);
    });
  }
}
test("studio-only answers link to the fixed public studio record",async({page})=>{
  await page.route(endpoint,route=>route.fulfill({contentType:"application/json",body:JSON.stringify({mode:"ai",answer:"JAGAU was founded by Adjie Rizqan.",projectIds:[],studioReference:true,knowledgeVersion:KNOWLEDGE_VERSION})}));
  await page.goto("/");
  const input=page.getByRole("textbox",{name:inputName});const send=page.getByRole("button",{name:"Send query",exact:true});
  await input.fill("Who founded JAGAU?");await send.click();
  await expect(page.locator(".aw-message:not(.is-user)").last()).toContainText("curated");
  await page.locator(".aw-guide-privacy input").check();
  await input.fill("Who founded JAGAU?");await send.click();
  await expect(page.locator(".aw-message:not(.is-user)").last()).toContainText("AI-generated");
  await expect(page.locator(".aw-guided-evidence").last().getByRole("link")).toHaveAttribute("href","/");
  await page.locator(".aw-guided-evidence").last().getByRole("link").click();
  await expect(page.locator(".workspace-home")).toBeVisible();
});
test("stop prevents a delayed provider reply from replacing the next curated turn",async({page})=>{
  let release!:()=>void;
  const pending=new Promise<void>(resolve=>{release=resolve;});
  let calls=0;
  await page.route(endpoint,async route=>{
    calls++; await pending;
    await route.fulfill({contentType:"application/json",body:JSON.stringify({mode:"ai",answer:"Delayed fixture answer.",projectIds:["elab"],knowledgeVersion:KNOWLEDGE_VERSION})}).catch(()=>{});
  });
  await page.goto("/");
  const input=page.getByRole("textbox",{name:inputName});
  const send=page.getByRole("button",{name:"Send query",exact:true});
  await input.fill("ELAB");await send.click();
  await expect(page.locator(".aw-message:not(.is-user)").last()).toContainText("curated");
  await page.locator(".aw-guide-privacy input").check();
  await input.fill("ELAB");await send.click();
  await expect.poll(()=>calls).toBe(1);
  await page.getByRole("button",{name:"Stop response",exact:true}).click();
  await expect(page.locator(".aw-message:not(.is-user)").last()).toContainText("Response stopped");
  await page.locator(".aw-guide-privacy input").uncheck();
  await input.fill("How does LabStock preserve history?");await send.click();
  await expect(page.locator(".aw-guided-evidence").last().locator("a")).toHaveAttribute("href","/projects/labstock/");
  release();
  await expect(page.locator(".aw-message:not(.is-user)").last()).not.toContainText("Delayed fixture answer");
});
