import { chromium } from "@playwright/test";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import { assertCaptureAuthorization } from "./guard.ts";
// Run only on a supported runner with an actual seeded product. No replacement HTML.
const config=JSON.parse(await readFile(process.argv[2],"utf8"));
assertCaptureAuthorization(config);
assert.ok(Array.isArray(config.pages) && config.pages.length>0);
const directory=`artifacts/recapture/${config.project}/${new Date().toISOString().replace(/[:.]/g,"-")}`;
await mkdir(directory,{recursive:true});
const manifest={project:config.project,appRevision:config.sourceRevision,fixtureSeed:config.fixtureSeed,capturedAt:new Date().toISOString(),privacyReview:"UNREVIEWED",publication:"BLOCKED_UNTIL_IMAGE_REVIEW",captures:[]};
let browser;
try {
  browser=await chromium.launch();
  for(const viewport of [{width:1440,height:900},{width:768,height:1024},{width:390,height:844}]) {
    const context=await browser.newContext({viewport,reducedMotion:"reduce"});
    // Deny non-loopback network requests rather than trusting the seed declaration alone.
    await context.route("**/*",route=>{
      const url=new URL(route.request().url());
      return url.origin===new URL(config.origin).origin ? route.continue() : route.abort();
    });
    const page=await context.newPage();
    for(const target of config.pages) {
      assert.match(target.name,/^[a-z0-9-]+$/);assert.ok(target.path.startsWith("/")&&!target.path.startsWith("//"));
      const url=new URL(target.path,config.origin);assert.equal(url.origin,new URL(config.origin).origin);
      assert.equal((await page.goto(url.href))?.status(),200);
      await page.locator(target.readySelector).waitFor();
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(image=>image.decode()));});
      const text=await page.locator("body").innerText();
      assert.match(text,/Synthetic demonstration data|Data demonstrasi sintetis/,"Product must visibly identify its synthetic environment");
      assert.ok(!/DEMO PASIEN|KLINIS DEMO/.test(text),"Use natural fictional identities, never edit production data");
      assert.ok(target.expectedNames.length>0);
      for(const name of target.expectedNames) {assert.ok(["Raka Pratama","Nabila Safitri","Dimas Saputra"].includes(name));assert.ok(text.includes(name));}
      const file=`${target.name}-${viewport.width}x${viewport.height}.png`;
      const bytes=await page.screenshot({path:`${directory}/${file}`});
      manifest.captures.push({file,viewport,sha256:createHash("sha256").update(bytes).digest("hex"),privacyReview:"UNREVIEWED"});
    }
    await context.close();
  }
} finally {
  await browser?.close();
  await writeFile(`${directory}/manifest.json`,JSON.stringify(manifest,null,2)+"\n");
  console.log(`Evidence: ${directory}; privacy/publication remains UNREVIEWED`);
}
