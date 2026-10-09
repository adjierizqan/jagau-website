#!/usr/bin/env node
import { spawn, fork, spawnSync } from "node:child_process";
import { mkdir, access, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
process.chdir(root);
const referenceRoot = process.env.PORTFOLIO_EXPORT || "/Users/adjie/Projects/adjie-portfolio/out";
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const output = resolve(root, "docs/release/operator-qa", stamp);
const report = { startedAt: new Date().toISOString(), status: "RUNNING", visualAcceptance: "UNREVIEWED", steps: [], referenceRoot, commit: null, screenshots: [] };
const owned = new Set();
let interrupted = false;
await mkdir(output, { recursive: true });
function gitHead(repo, worktree) {
  const env = { ...process.env, GIT_OPTIONAL_LOCKS: "0" };
  if (repo) { env.GIT_DIR = repo; env.GIT_WORK_TREE = worktree; }
  const result = spawnSync("git", ["rev-parse", "HEAD"], { cwd: worktree, env, encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : null;
}
function register(child) { owned.add(child); child.once("close", () => owned.delete(child)); return child; }
function terminate(child) {
  if (!owned.has(child) || !child.pid) return;
  try { process.kill(process.platform === "win32" ? child.pid : -child.pid, "SIGTERM"); } catch (error) { if (error.code !== "ESRCH") throw error; }
}
async function cleanup() {
  const children = [...owned];
  if (!children.length) return;
  const exits = children.map(child => new Promise(resolve => child.once("close", resolve)));
  children.forEach(terminate);
  await Promise.race([Promise.all(exits), new Promise(resolve => setTimeout(resolve, 2000))]);
  for (const child of children) if (owned.has(child)) {
    try { process.kill(process.platform === "win32" ? child.pid : -child.pid, "SIGKILL"); } catch (error) { if (error.code !== "ESRCH") throw error; }
  }
}
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => {
  interrupted = true;
  for (const child of owned) terminate(child);
});
async function run(name, executable, args, extraEnv = {}) {
  if (interrupted) throw new Error("QA interrupted; owned processes are being cleaned up.");
  console.log(`\n[${name}]`);
  const step = { name, startedAt: new Date().toISOString(), status: "RUNNING", log: `${name}.log` };
  report.steps.push(step);
  const chunks = [];
  const child = register(spawn(executable, args, {
    cwd: root, env: { ...process.env, ...extraEnv }, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe"],
  }));
  for (const stream of [child.stdout, child.stderr]) stream.on("data", data => { chunks.push(data); process.stdout.write(data); });
  let launchError;
  const code = await new Promise(resolve => {
    child.once("error", error => { launchError = error; resolve(1); });
    child.once("close", code => resolve(code ?? 1));
  });
  if (launchError) chunks.push(Buffer.from(String(launchError)));
  await writeFile(resolve(output, step.log), Buffer.concat(chunks));
  step.exitCode = code; step.status = code === 0 ? "PASS" : "FAIL"; step.endedAt = new Date().toISOString();
  return code === 0;
}
async function server(name, staticRoot) {
  const chunks = [];
  const child = register(fork(resolve(root, "scripts/serve.mjs"), [], {
    cwd: root, env: { ...process.env, STATIC_ROOT: staticRoot, PORT: "0" }, detached: process.platform !== "win32", stdio: ["ignore", "pipe", "pipe", "ipc"],
  }));
  for (const stream of [child.stdout, child.stderr]) stream.on("data", data => chunks.push(data));
  try {
    const origin = await new Promise((resolveOrigin, reject) => {
      const timeout = setTimeout(() => reject(new Error(`${name} server did not become ready`)), 15000);
      child.once("message", message => {
        clearTimeout(timeout);
        if (message.type !== "ready" || message.root !== resolve(staticRoot) || !Number.isInteger(message.port) || message.port <= 0)
          reject(new Error(`${name}: invalid readiness message`));
        else resolveOrigin(`http://127.0.0.1:${message.port}`);
      });
      child.once("error", error => { clearTimeout(timeout); reject(error); });
      child.once("exit", code => { clearTimeout(timeout); reject(new Error(`${name} server exited (${code}): ${Buffer.concat(chunks).toString()}`)); });
    });
    child.once("close", () => { void writeFile(resolve(output, `${name}-server.log`), Buffer.concat(chunks)); });
    return origin;
  } catch (error) {
    await writeFile(resolve(output, `${name}-server.log`), Buffer.concat(chunks));
    throw error;
  }
}
try {
  if (Number(process.versions.node.split(".")[0]) !== 22) throw new Error(`Node 22 required; found ${process.versions.node}`);
  await access(resolve(referenceRoot, "index.html"), constants.R_OK);
  const reference = await readFile(resolve(referenceRoot, "index.html"), "utf8");
  if (!reference.includes("workspace-home") || !reference.includes("aw-desktop")) throw new Error("Reference export is not the original Workspace homepage");
  report.referenceExportSha256 = createHash("sha256").update(reference).digest("hex");
  report.referenceCommit = gitHead(null, dirname(referenceRoot));
  report.commit = gitHead(resolve(root,"artifacts/git-history"),root) || gitHead(null,root);
  if (process.argv.includes("--preflight-only")) {
    report.status = "PREFLIGHT_ONLY";
    console.log("Preflight complete: Node 22 and read-only reference export found. No servers or browsers started.");
  } else {
    if (!await run("install", "npm", ["ci"])) throw new Error("Dependency installation failed; see install.log");
    if (!await run("browser-install", "npx", ["--no-install", "playwright", "install", "chromium", "webkit"])) throw new Error("Browser installation failed");
    // Keep build and typecheck sequential: Next regenerates the type directory.
    for (const gate of ["test", "lint", "build", "typecheck", "test:static"]) {
      if (!await run(gate.replace(":", "-"), "npm", ["run", gate])) throw new Error(`Required gate failed: ${gate}`);
    }
    report.targetExportSha256 = createHash("sha256").update(await readFile("out/index.html")).digest("hex");
    const original = await server("portfolio", referenceRoot);
    const jagau = await server("jagau", resolve(root, "out"));
    report.origins = { portfolio: original, jagau };
    const browserOK = await run("browser", "npm", ["run", "test:browser"], { QA_BASE_URL: jagau });
    const captures = [];
    // Capture even when a runtime assertion fails, preserving evidence for diagnosis.
    for (const theme of ["light", "dark"]) {
      captures.push(await run(`parity-${theme}`, process.execPath, ["scripts/capture-workspace-parity.mjs"], {
        COMPARE_PORTFOLIO_URL: original, COMPARE_JAGAU_URL: jagau, COMPARE_THEME: theme,
      }));
      try { report.screenshots.push(JSON.parse(await readFile(`docs/release/parity-screenshots/capture-results-${theme}.json`, "utf8"))); } catch { /* Capture log records the exact failure. */ }
    }
    report.status = browserOK && captures.every(Boolean) ? "AUTOMATED_CHECKS_COMPLETE_VISUAL_REVIEW_REQUIRED" : "FAIL";
    report.nextAction = "Inspect the actual paired screenshots and browser findings; record VISUAL_REVIEW.md before publication.";
    if (report.status === "FAIL") process.exitCode = 1;
  }
} catch (error) {
  report.status = interrupted ? "INTERRUPTED" : "BLOCKED";
  report.error = String(error);
  console.error(report.error);
  process.exitCode = 1;
} finally {
  await cleanup();
  report.endedAt = new Date().toISOString();
  await writeFile(resolve(output, "results.json"), JSON.stringify(report,null,2)+"\n");
  const latestName = process.argv.includes("--preflight-only") ? "latest-preflight.json" : "latest.json";
  await writeFile(`docs/release/operator-qa/${latestName}`, JSON.stringify({ directory: output, status: report.status, visualAcceptance: report.visualAcceptance },null,2)+"\n");
  console.log(`\n${report.status}\nEvidence: ${output}\nVisual acceptance: UNREVIEWED. No deployment or DNS/email changes performed.`);
  if (!process.argv.includes("--preflight-only") && report.screenshots.some(result => result.screenshots?.length)) {
    console.log("Compare: docs/release/parity-screenshots/comparison-light.html and comparison-dark.html");
    if (process.platform === "darwin") spawn("open", [resolve("docs/release/parity-screenshots/comparison-light.html")], {stdio:"ignore"});
  }
}
