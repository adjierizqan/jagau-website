import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";

// Capture the real two running sites. No mocked responses or fixture HTML.
const polish = process.argv.includes("--polish");
const productionOnly = process.argv.includes("--production");
const sites = polish ? [
  { name: "before", origin: "http://127.0.0.1:4186", heading: "JAGAU" },
  { name: "after", origin: "http://127.0.0.1:4185", heading: "JAGAU" },
] : productionOnly ? [
  { name: "jagau", origin: "https://jagau.id", heading: "JAGAU" },
] : [
  { name: "portfolio", origin: process.env.COMPARE_PORTFOLIO_URL || "http://127.0.0.1:4186", heading: "Adjie Rizqan" },
  { name: "jagau", origin: process.env.COMPARE_JAGAU_URL || "http://127.0.0.1:4185", heading: "JAGAU" },
];
const directory = polish ? "artifacts/polish-visual" : productionOnly ? `artifacts/operator-public-visual/${new Date().toISOString().replace(/[:.]/g, "-")}` : "docs/release/parity-screenshots";
const theme = process.env.COMPARE_THEME || "light";
const themes = (productionOnly || polish) ? ["light", "dark"] : [theme];
assert.ok(["light", "dark"].includes(theme));
await mkdir(directory, { recursive: true });
const rows = [];
const report = { capturedAt: new Date().toISOString(), status: "INCOMPLETE", visualAcceptance: "UNREVIEWED", theme, themes, productionOnly, polish, qaCommit: process.env.GITHUB_SHA || null, runId: process.env.GITHUB_RUN_ID || null, sites, screenshots: rows };
let browser;
try {
  browser = await chromium.launch();
  for (const theme of themes) {
  for (const viewport of [{ width: 1440, height: 900 }, ...((productionOnly || polish) ? [{ width: 768, height: 1024 }] : []), { width: 390, height: 844 }]) {
    const size = `${viewport.width}x${viewport.height}`;
    for (const site of sites) {
      const context = await browser.newContext({ viewport, deviceScaleFactor: 1, colorScheme: theme, reducedMotion: (productionOnly || polish) ? "no-preference" : "reduce" });
      // Set only identical appearance preferences; never replace the application's content.
      await context.addInitScript(value => localStorage.setItem("aw-theme", value), theme);
      const page = await context.newPage();
      page.setDefaultTimeout(30000);
      page.setDefaultNavigationTimeout(30000);
      const errors = [];
      page.on("pageerror", error => errors.push(error.message));
      async function capture(screen) {
        await page.evaluate(async () => { await document.fonts.ready; });
        await page.locator("main img, .aw-quicklook img").evaluateAll(async images => {
          for (const image of images) { image.loading = "eager"; await image.decode(); }
        });
        let stability = null;
        if (productionOnly || polish) {
          // Use application state and computed animation state, not a fixed sleep.
          await page.waitForFunction(() => {
            const intro = document.querySelector(".project-intro");
            if (!intro) return true;
            if (intro.getAttribute("data-playing") !== "false") return false;
            return [...intro.querySelectorAll("[data-character], .project-ai-identity, .project-answer-lead, .project-story > article > header")]
              .every(element => Number(getComputedStyle(element).opacity) >= 0.99);
          });
          await page.evaluate(async () => {
            await Promise.allSettled(document.getAnimations().filter(animation =>
              Number.isFinite(Number(animation.effect?.getComputedTiming().endTime))
            ).map(animation => animation.finished));
          });
          const settled = await page.waitForFunction(async () => {
            // Scroll-triggered reveals can start after the first animation snapshot.
            // Require a quiet interval including scroll and content geometry; never
            // cancel animations or hide them to manufacture a settled capture.
            const rectangles = () => [...document.querySelectorAll("main, main h2, main figure, .aw-composer, .project-intro")].map(element => {
              const { x, y, width, height } = element.getBoundingClientRect();
              return [x, y, width, height, element.scrollTop, window.scrollY];
            });
            const before = JSON.stringify(rectangles());
            const start = performance.now();
            while (performance.now() - start < 300) {
              await new Promise(requestAnimationFrame);
              if (before !== JSON.stringify(rectangles())) return false;
              if (document.getAnimations().some(animation =>
                Number.isFinite(Number(animation.effect?.getComputedTiming().endTime)) &&
                (animation.pending || animation.playState === "running")
              )) return false;
            }
            const intro = document.querySelector(".project-intro");
            const state = {
              introPlaying: intro?.getAttribute("data-playing") || null,
              introCharacterCount: intro?.querySelectorAll("[data-character]").length || 0,
              introCharactersVisible: intro ? [...intro.querySelectorAll("[data-character]")].every(element => Number(getComputedStyle(element).opacity) >= 0.99) : null,
              fontsReady: document.fonts.status === "loaded",
              imagesDecoded: [...document.querySelectorAll("main img, .aw-quicklook img")].every(element => element.complete && element.naturalWidth > 0),
              theme: document.documentElement.getAttribute("data-theme"),
              finiteAnimationsRunning: document.getAnimations().filter(animation => Number.isFinite(Number(animation.effect?.getComputedTiming().endTime)) && animation.playState === "running").length,
            };
            return state.finiteAnimationsRunning === 0 ? state : false;
          });
          stability = await settled.jsonValue();
          await settled.dispose();
          assert.equal(stability.theme, theme, "Production appearance preference did not apply");
          assert.ok(stability.fontsReady && stability.imagesDecoded, "Production font/image readiness failed");
          assert.equal(stability.finiteAnimationsRunning, 0, `Capture still has running finite animations: ${site.name}/${screen}`);
          assert.equal(new URL(page.url()).origin, site.origin, "Capture is not from public production");
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${site.name}/${screen} page overflow`);
        const file = `${size}-${theme}-${screen}-${site.name}.png`;
        await page.screenshot({ path: `${directory}/${file}` });
        const bytes = await readFile(`${directory}/${file}`);
        const pngSize = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
        if (productionOnly || polish) assert.deepEqual(pngSize, viewport, "Screenshot dimensions differ from required CSS viewport");
        const geometry = await page.evaluate(() => {
          const result = {};
          for (const selector of [".aw-window", ".aw-titlebar", ".aw-sidebar", ".aw-dock", ".aw-mobile-header", "main", ".home-intro", ".aw-composer", ".home-proof img", ".home-guide"]) {
            const element = document.querySelector(selector);
            if (!element) continue;
            const {x,y,width,height} = element.getBoundingClientRect();
            const style = getComputedStyle(element);
            result[selector] = {x,y,width,height,display:style.display,fontFamily:style.fontFamily,fontSize:style.fontSize};
          }
          return result;
        });
        let review = null;
        if (polish && process.env.QA_LOG_REVIEW === "true") {
          const reviewFile = file.replace(/\.png$/, ".jpg");
          const jpeg = await page.screenshot({type:"jpeg", quality:92});
          await writeFile(`${directory}/${reviewFile}`, jpeg);
          review = {file:reviewFile, sha256:createHash("sha256").update(jpeg).digest("hex")};
        }
        rows.push({ review, site: site.name, size, theme, screen, file, url: page.url(), pngSize, stability, geometry, sha256: createHash("sha256").update(bytes).digest("hex") });
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
        if (polish) {
          await page.locator(".home-selected").evaluate(element => element.scrollIntoView({block:"start", behavior:"instant"}));
          await capture("selected-work");
          if (process.env.QA_PREMIUM === "true") {
            await page.locator(".home-about").evaluate(element=>element.scrollIntoView({block:"start",behavior:"instant"}));
            await capture("home-footer");
          }
          await home();
        }
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
        if (site.name === "jagau" || polish) {
          await page.locator(".aw-composer textarea").fill("How does LabStock preserve history?");
          await page.getByRole("button", {name:"Send query",exact:true}).click();
          await page.locator(".aw-message:not(.is-user)").last().waitFor();
          assert.ok((await page.locator(".aw-message:not(.is-user)").last().innerText()).includes("LabStock"));
          await capture("guided-response");
        }
        if (polish && process.env.QA_STUDIO === "true") {
          await home();
          if (viewport.width < 760) await page.getByRole("button", {name:"Open navigation",exact:true}).click();
          await page.locator(".aw-primary-nav").getByRole("button", {name:"Studio",exact:true}).click();
          await capture("studio");
          if (process.env.QA_PREMIUM === "true" && site.name === "after") {
            await page.locator(".studio-language summary").click();
            await capture("studio-indonesian");
            await page.locator(".studio-language summary").click();
          }
          if (site.name === "after" || process.env.QA_REFERENCE_STUDIO_SYSTEMS === "true") {
            await page.locator(".studio-systems").evaluate(element => element.scrollIntoView({block:"start",behavior:"instant"}));
            await capture("studio-systems");
          }
        }
        for (const slug of ["labstock", "suhulog", "bdrs", ...(polish && (site.name === "after" ? process.env.QA_EXTRA_PROJECT : process.env.QA_REFERENCE_EXTRA_PROJECT) === "elab" ? ["elab"] : [])]) {
          assert.equal((await page.goto(`${site.origin}/projects/${slug}/`))?.status(), 200);
          await page.locator(".project-intro").waitFor();
          if (productionOnly || polish) await page.locator(".project-intro-answer").waitFor({ state: "visible" });
          await capture(`case-${slug}`);
          if (process.env.QA_PREMIUM === "true" && slug !== "labstock") {
            await page.locator(".study").evaluate(element=>{
              element.scrollIntoView({block:"start",behavior:"instant"});
              const main=element.closest("main");
              const toolbar=document.querySelector(".aw-mobile-header");
              const toolbarBottom=toolbar && getComputedStyle(toolbar).display!=="none" ? toolbar.getBoundingClientRect().bottom : main.getBoundingClientRect().top;
              const clearance=Math.max(0,toolbarBottom-element.getBoundingClientRect().top)+16;
              if (["auto","scroll"].includes(getComputedStyle(main).overflowY)) main.scrollBy({top:-clearance,behavior:"instant"});
              else window.scrollBy({top:-clearance,behavior:"instant"});
            });
            await page.waitForFunction(()=>{
              const study=document.querySelector(".study"),heading=study.querySelector("h1");
              const mobile=document.querySelector(".aw-mobile-header");
              const top=mobile && getComputedStyle(mobile).display!=="none" ? mobile.getBoundingClientRect().bottom : study.closest("main").getBoundingClientRect().top;
              return heading.getBoundingClientRect().top>=top;
            });
            await capture(`case-${slug}-study`);
          }
          if (polish && process.env.QA_STUDIO === "true" && ["suhulog", "bdrs"].includes(slug)) {
            const media = page.locator(".study-media").last();
            await media.evaluate(element => element.scrollIntoView({block:"end",behavior:"instant"}));
            await media.locator("a").hover();
            await capture(`case-${slug}-gallery-hover`);
          }
          if (slug === "elab") {
            await page.locator("#study-evidence").scrollIntoViewIfNeeded();
            await capture("case-elab-evidence");
          }
          if (slug === "labstock") {
            await page.locator("#ls-evidence").scrollIntoViewIfNeeded();
            await capture("case-labstock-evidence");
            if (polish) {
              const trigger = page.locator('main a[aria-label^="Quick Look:"]').first();
              await trigger.click();
              await page.getByRole("dialog", { name: "Project image viewer" }).waitFor();
              await capture("quick-look");
              await page.getByRole("button", {name:"Close image viewer", exact:true}).click();
              await page.waitForFunction(() => document.activeElement === document.querySelector('main a[aria-label^="Quick Look:"]'));
              assert.ok(await trigger.evaluate(element => element === document.activeElement), "Quick Look must restore trigger focus");
            }
          }
        }
        assert.deepEqual(errors, [], `${site.name} runtime errors`);
      } finally { await context.close(); }
    }
  }
  }
  if (polish) assert.equal(rows.length, 132 + (process.env.QA_EXTRA_PROJECT === "elab" ? 12 : 0) + (process.env.QA_REFERENCE_EXTRA_PROJECT === "elab" ? 12 : 0) + (process.env.QA_STUDIO === "true" ? 42 + (process.env.QA_REFERENCE_STUDIO_SYSTEMS === "true" ? 6 : 0) : 0) + (process.env.QA_PREMIUM === "true" ? 54 : 0), "Before/after screenshot matrix incomplete");
  if (productionOnly) {
    assert.equal(rows.length, 54, "Required production screenshot inventory incomplete");
    assert.equal(new Set(rows.map(row => row.file)).size, 54, "Production capture filenames are not unique");
    for (const size of ["1440x900", "768x1024", "390x844"])
      for (const appearance of themes)
        for (const screen of ["home", "navigation", "composer-input", "composer-workspace", "guided-response", "case-labstock", "case-labstock-evidence", "case-suhulog", "case-bdrs"])
          assert.equal(rows.filter(row => row.size === size && row.theme === appearance && row.screen === screen).length, 1, `Missing/duplicate ${size}/${appearance}/${screen}`);
  }
  report.status = "CAPTURED_REQUIRES_VISUAL_REVIEW";
} catch (error) {
  report.error = String(error);
  console.error(report.error);
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
  const label = polish ? "polish" : productionOnly ? "production" : theme;
  await writeFile(`${directory}/capture-results-${label}.json`, JSON.stringify(report,null,2)+"\n");
  const screens = [...new Set(rows.map(row => `${row.size}/${row.screen}/${row.theme}`))];
  const description = polish ? "Left: unchanged JAGAU baseline. Right: polish branch. Identical viewports, themes and real interactions; no production deployment." : productionOnly ? "Actual public JAGAU screenshots. Both themes; CSS viewport sizes and settled animation checks are recorded in the manifest. No automatic visual PASS." : "Left: original portfolio. Right: JAGAU. Reference composer does not invoke live AI.";
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Workspace parity — unreviewed ${theme}</title><style>body{font:16px system-ui;margin:24px;background:#eee}section{margin-bottom:32px}.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}figure{margin:0}img{width:100%;height:auto;border:1px solid #999}h2{font-size:18px}</style><h1>Actual workspace captures · ${theme}</h1><p>Capture status: ${report.status}. Visual acceptance: UNREVIEWED. ${description} Exact viewport PNGs are linked. JAGAU guided answer is labelled curated.</p>` + screens.map(key => {
    const [size,screen,rowTheme] = key.split("/");
    return `<section><h2>${size} · ${rowTheme} · ${screen}</h2><div class="pair">`+sites.map(site => {
      const row = rows.find(row => row.size===size && row.screen===screen && row.site===site.name && row.theme===rowTheme);
      return `<figure><figcaption>${site.name}</figcaption>${row ? `<a href="${row.file}"><img src="${row.file}" alt="${site.name} ${screen} ${size}"></a>` : "No matching capture"}</figure>`;
    }).join("")+"</div></section>";
  }).join("")+"</html>";
  await writeFile(`${directory}/comparison-${label}.html`,html);
  // Supported connector-readable copies when native artifact downloads are unavailable.
  // Public screenshots only; no credentials, browser state or production data export.
  if (polish && process.env.QA_LOG_REVIEW === "true") {
    for (const file of [...rows.map(row => row.review?.file).filter(Boolean), `capture-results-${label}.json`, `comparison-${label}.html`]) {
      const bytes = await readFile(`${directory}/${file}`);
      const encoded = bytes.toString("base64");
      console.log(`REVIEW_FILE ${file} ${createHash("sha256").update(bytes).digest("hex")} ${bytes.length}`);
      for (let i=0; i<encoded.length; i+=4096) console.log(`REVIEW_PART ${file} ${i/4096} ${encoded.slice(i,i+4096)}`);
    }
  }
  if (productionOnly || polish) console.log(`${report.status}\nEvidence: ${directory}\n${rows.length} public screenshots; visual acceptance remains UNREVIEWED.`);
}
