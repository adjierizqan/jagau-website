import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

// Capture the real two running sites. No mocked responses or fixture HTML.
const sites = [
  { name: "portfolio", origin: process.env.COMPARE_PORTFOLIO_URL || "http://127.0.0.1:4186", heading: "Adjie Rizqan" },
  { name: "jagau", origin: process.env.COMPARE_JAGAU_URL || "http://127.0.0.1:4185", heading: "JAGAU" },
];
const directory = "docs/release/parity-screenshots";
const theme = process.env.COMPARE_THEME || "light";
assert.ok(["light", "dark"].includes(theme));
await mkdir(directory, { recursive: true });
const rows = [];
const report = { capturedAt: new Date().toISOString(), status: "INCOMPLETE", visualAcceptance: "UNREVIEWED", theme, sites, screenshots: rows };
let browser;
try {
  browser = await chromium.launch();
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const size = `${viewport.width}x${viewport.height}`;
    for (const site of sites) {
      const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: "reduce" });
      // Set only identical appearance preferences; never replace the application's content.
      await context.addInitScript(value => localStorage.setItem("aw-theme", value), theme);
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      page.setDefaultNavigationTimeout(30000);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      async function capture(screen) {
        await page.evaluate(async () => { await document.fonts.ready; });
        await page.locator("main img").evaluateAll(async images => {
          for (const image of images) { image.loading = "eager"; await image.decode(); }
        });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${site.name}/${screen} page overflow`);
        const file = `${size}-${theme}-${screen}-${site.name}.png`;
        await page.screenshot({ path: `${directory}/${file}` });
        const geometry = await page.evaluate(() => {
          const result = {};
          for (const selector of [".aw-window", ".aw-titlebar", ".aw-sidebar", ".aw-dock", ".aw-mobile-header", "main", ".home-intro", ".aw-composer"]) {
            const element = document.querySelector(selector);
            if (!element) continue;
            const {x,y,width,height} = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            result[selector] = {x,y,width,height,display:style.display,fontFamily:style.fontFamily,fontSize:style.fontSize};
          }
          return result;
        });
        rows.push({ site: site.name, size, screen, file, geometry, sha256: createHash("sha256").update(await readFile(`${directory}/${file}`)).digest("hex") });
      }
      async function home() {
        const response = await page.goto(site.origin + "/");
        assert.equal(response?.status(), 200);
        await page.getByRole("heading", {name:site.heading,exact:true}).waitFor();
        for (const selector of [".aw-desktop", ".aw-window", ".aw-sidebar", ".aw-dock", ".workspace-home", ".aw-composer"])
          assert.equal(await page.locator(selector).count(), 1, `${site.name}: missing ${selector}`);
      }
      try {
        await home();
        await capture("home");
        if (viewport.width < 760) await page.getByRole("button", {name:"Open navigation",exact:true}).click();
        else await page.locator(".aw-primary-nav").getByRole("button", {name:"Projects",exact:true}).click();
        await capture("navigation");
        await home();
        await page.locator(".aw-composer textarea").fill("How does LabStock preserve history?");
        await capture("composer-input");
        // Reference composer stays local: no requests to its live personal AI backend.
        await home();
        if (viewport.width < 760) await page.getByRole("button", {name:"Open navigation",exact:true}).click();
        await page.locator(".aw-primary-nav").getByRole("button", {name:"Ask",exact:true}).click();
        await capture("composer-workspace");
        if (site.name === "jagau") {
          await page.locator(".aw-composer textarea").fill("How does LabStock preserve history?");
          await page.getByRole("button", {name:"Send query",exact:true}).click();
          await page.locator(".aw-message:not(.is-user)").last().waitFor();
          assert.ok((await page.locator(".aw-message:not(.is-user)").last().innerText()).includes("LabStock"));
          await capture("guided-response");
        }
        for (const slug of ["labstock", "suhulog", "bdrs"]) {
          assert.equal((await page.goto(`${site.origin}/projects/${slug}/`))?.status(), 200);
          await page.locator(".project-intro").waitFor();
          await capture(`case-${slug}`);
          if (slug === "labstock") {
            await page.locator("#ls-evidence").scrollIntoViewIfNeeded();
            await capture("case-labstock-evidence");
          }
        }
        assert.deepEqual(errors, [], `${site.name} runtime errors`);
      } finally { await context.close(); }
    }
  }
  report.status = "CAPTURED_REQUIRES_VISUAL_REVIEW";
} catch (error) {
  report.error = String(error);
  process.exitCode = 1;
} finally {
  await browser?.close();
  report.comparisons = rows.filter(row => row.site === "portfolio").map(reference => {
    const target = rows.find(row => row.site === "jagau" && row.size === reference.size && row.screen === reference.screen);
    if (!target) return { size: reference.size, screen: reference.screen, status: "MISSING_TARGET_CAPTURE" };
    const geometry = Object.fromEntries(Object.entries(reference.geometry).map(([selector, original]) => {
      const current = target.geometry[selector];
      return [selector, current ? {
        dx: current.x - original.x, dy: current.y - original.y,
        dWidth: current.width - original.width, dHeight: current.height - original.height,
        sameDisplay: current.display === original.display,
        sameFontFamily: current.fontFamily === original.fontFamily,
        sameFontSize: current.fontSize === original.fontSize,
      } : { missing: true }];
    }));
    return { size: reference.size, screen: reference.screen, status: "RECORDED_REQUIRES_VISUAL_REVIEW", reference: reference.file, target: target.file, geometry };
  });
  await writeFile(`${directory}/capture-results-${theme}.json`, JSON.stringify(report,null,2)+"\n");
  const screens = [...new Set(rows.map(row => `${row.size}/${row.screen}`))];
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Workspace parity — unreviewed ${theme}</title><style>body{font:16px system-ui;margin:24px;background:#eee}section{margin-bottom:32px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;height:auto;border:1px solid #999}h2{font-size:18px}</style><h1>Actual workspace captures · ${theme}</h1><p>Capture status: ${report.status}. Visual acceptance: UNREVIEWED. Left: original portfolio. Right: JAGAU. Exact viewport PNGs are linked. Composer reference uses typed input and Ask navigation, without invoking its live AI backend. JAGAU guided answer is labelled curated.</p>` + screens.map(key => {
    const [size,screen] = key.split("/");
    return `<section><h2>${size} · ${screen}</h2><div class="pair">`+sites.map(site => {
      const row = rows.find(row => row.size===size && row.screen===screen && row.site===site.name);
      return `<figure><figcaption>${site.name}</figcaption>${row ? `<a href="${row.file}"><img src="${row.file}" alt="${site.name} ${screen} ${size}"></a>` : "No matching capture"}</figure>`;
    }).join("")+"</div></section>";
  }).join("")+"</html>";
  await writeFile(`${directory}/comparison-${theme}.html`,html);
}
