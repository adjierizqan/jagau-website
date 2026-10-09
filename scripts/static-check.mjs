import { readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import assert from "node:assert/strict";
const root = resolve("out");
const checks = [];
const pages = [
  "index.html",
  "projects/labstock/index.html",
  "projects/suhulog/index.html",
  "projects/bdrs/index.html",
  "projects/elab/index.html",
  "404.html",
];
for (const page of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  const markup = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  assert.ok(markup.includes("<main"), `${page}: main landmark`);
  assert.equal(
    (markup.match(/<h1\b/g) || []).length,
    1,
    `${page}: one heading`,
  );
  assert.ok(
    markup.includes("mailto:adjie@jagau.id") || page === "404.html",
    `${page}: contact`,
  );
  assert.ok(markup.includes("Content-Security-Policy"), `${page}: CSP`);
  for (const [, url] of markup.matchAll(/(?:href|src)="([^"#]+)"/g)) {
    if (!url.startsWith("/")) continue;
    const clean = url.split("?")[0];
    const target = resolve(
      root,
      "." + clean + (clean.endsWith("/") ? "index.html" : ""),
    );
    assert.ok((await stat(target)).isFile(), `${page}: missing ${url}`);
  }
  checks.push(`${page}: semantic HTML, contact, CSP and internal links/assets`);
}
for (const slug of ["labstock", "suhulog", "bdrs"]) {
  const html = await readFile(resolve(root, `work/${slug}/index.html`), "utf8");
  assert.ok(html.includes(`/projects/${slug}/`), `legacy ${slug}: redirect destination`);
}
checks.push("legacy work routes redirect to canonical project routes");
const index = (await readFile(resolve(root, "index.html"), "utf8")).replace(
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,
  "",
);
for (const name of [
  "JAGAU",
  "LabStock",
  "SuhuLog",
  "BDRS",
  "Adjie Rizqan",
  "Curated answers",
  "no live AI",
])
  assert.ok(index.includes(name));
assert.ok(index.includes("https://jagau.id/"));
for (const shell of ["aw-desktop", "aw-window", "aw-sidebar", "aw-dock", "workspace-home", "aw-composer"]) {
  assert.ok(index.includes(shell), `home: actual workspace shell ${shell}`);
}
for (const old of ["hero-title", "explorer-result", "mode-label", "paper-hero"]) {
  assert.ok(!index.includes(old), `home: obsolete editorial marker ${old}`);
}
checks.push("active exported homepage contains the workspace shell and no obsolete editorial markers");
checks.push("essential company and work content survives removing all scripts");
for (const path of [
  "robots.txt",
  "sitemap.xml",
  "icon.svg",
  "social.png",
  ".nojekyll",
])
  assert.ok((await stat(resolve(root, path))).isFile());
checks.push("SEO, favicon, social image and Pages assets exist");
async function files(dir) {
  const result = [];
  for (const name of await readdir(dir)) {
    const path = resolve(dir, name);
    if ((await stat(path)).isDirectory()) result.push(...(await files(path)));
    else result.push(path);
  }
  return result;
}
const exportedFiles = await files(root);
for (const path of exportedFiles.filter(file => file.endsWith(".css"))) {
  const css = await readFile(path, "utf8");
  for (const [, url] of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
    if (/^(data:|#)/.test(url)) continue;
    assert.ok(!/^https?:/.test(url), `nonlocal CSS resource in ${path}`);
    const clean = url.split(/[?#]/)[0];
    const target = clean.startsWith("/") ? resolve(root, "." + clean) : resolve(dirname(path), clean);
    assert.ok((await stat(target)).isFile(), `missing CSS font/wallpaper resource: ${clean}`);
  }
}
checks.push("all exported CSS font and wallpaper URLs resolve to local assets");
for (const path of exportedFiles) {
  if (!/\.(js|html|json|txt)$/.test(path)) continue;
  const text = await readFile(path, "utf8");
  assert.ok(
    !/gh[pousr]_[A-Za-z0-9]{30,}|sk-ant-[A-Za-z0-9-]{20,}|-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(
      text,
    ),
    `secret signature in ${path}`,
  );
  assert.ok(
    !text.includes("adjie-workspace-ask.adjierizqan.workers.dev"),
    `portfolio backend in ${path}`,
  );
}
checks.push(
  "export contains no tested secret signatures or personal portfolio AI endpoint",
);
await mkdir("docs/release", { recursive: true });
await writeFile(
  "docs/release/static-results.json",
  JSON.stringify({ status: "PASS", checks }, null, 2) + "\n",
);
console.log(`PASS: ${checks.length} static integrity groups`);
