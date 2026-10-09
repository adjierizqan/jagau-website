#!/usr/bin/env node
// Normal-Terminal transport for audited source and CI evidence. Never changes DNS or deploys Pages.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync, existsSync, chmodSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repo = "adjierizqan/jagau-website";
const history = resolve(root, "artifacts/git-history");
const publication = resolve(root, "artifacts/publication.git");
const output = resolve(root, "artifacts/operator-publish", new Date().toISOString().replace(/[:.]/g, "-"));
mkdirSync(output, { recursive: true });
const report = { status: "RUNNING", repository: repo, sourceCommit: null, publicationCommit: null, visualAcceptance: "UNREVIEWED", deployed: false, dnsChanged: false, steps: [] };
const env = { ...process.env };
delete env.GIT_DIR; delete env.GIT_WORK_TREE; delete env.GIT_INDEX_FILE;
function run(command, args, { cwd = root, optional = false, buffer = false } = {}) {
  const result = spawnSync(command, args, { cwd, env, encoding: buffer ? undefined : "utf8", maxBuffer: 30 * 1024 * 1024 });
  if (result.status !== 0 && !optional) throw new Error(`${command} ${args[0]} failed: ${result.error?.message || result.stderr?.toString().trim() || `exit ${result.status}`}`);
  return result;
}
function git(args, options) { return run("git", [`--git-dir=${history}`, `--work-tree=${root}`, ...args], options); }
function publicGit(args, options) { return run("git", [`--git-dir=${publication}`, ...args], options); }
const hash = bytes => createHash("sha256").update(bytes).digest("hex");
const allowed = path => /^(app|components|data|lib|public|scripts|tests|\.github)\//.test(path)
  || /^(\.env\.example|\.gitignore|README\.md|CHANGELOG\.md|package(-lock)?\.json|.*\.config\.(ts|mjs)|tsconfig\.json)$/.test(path)
  || /^(docs\/(requirements\.md|decisions\/[^/]+\.md|deployment\/[^/]+\.md|operations\/[^/]+\.md|release\/(content-provenance\.md|wallpaper-provenance\.json|current-assets-audit\.json)))$/.test(path);
const secretPatterns = [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /github_pat_[A-Za-z0-9_]{30,}/, /gh[pousr]_[A-Za-z0-9]{30,}/, /AKIA[0-9A-Z]{16}/, /sk-(?:proj-)?[A-Za-z0-9_-]{32,}/];
try {
  if (!existsSync(history)) throw new Error("Permanent source history missing; do not use stale /private/tmp metadata.");
  if (git(["status", "--porcelain", "--untracked-files=normal"]).stdout.trim()) throw new Error("Commit and review source changes before publication.");
  const source = git(["rev-parse", "HEAD"]).stdout.trim();
  report.sourceCommit = source;
  const audit = JSON.parse(git(["show", `${source}:docs/release/current-assets-audit.json`]).stdout);
  const entries = git(["ls-tree", "-rz", "--full-tree", source], { buffer: true }).stdout.toString().split("\0").filter(Boolean);
  const exportRoot = mkdtempSync(resolve("/private/tmp", `jagau-publication-${source.slice(0, 12)}-`));
  const manifest = [];
  for (const entry of entries) {
    const [metadata, path] = entry.split("\t");
    if (!allowed(path)) continue;
    const [mode, type, oid] = metadata.split(" ");
    if (type !== "blob" || !["100644", "100755"].includes(mode) || path.split("/").includes("..")) throw new Error(`Unexpected source entry: ${path}`);
    const bytes = git(["cat-file", "blob", oid], { buffer: true }).stdout;
    const sha256 = hash(bytes);
    if (path.startsWith("public/") && audit.assets[path]?.sha256 !== sha256) throw new Error(`Unreviewed or changed asset: ${path}`);
    if (!bytes.includes(0) && secretPatterns.some(pattern => pattern.test(bytes.toString()))) throw new Error(`Credential signature found in ${path}; HOLD.`);
    const destination = resolve(exportRoot, path);
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, bytes); chmodSync(destination, mode === "100755" ? 0o755 : 0o644);
    manifest.push({ path, sha256 });
  }
  writeFileSync(resolve(output, "source-manifest.json"), JSON.stringify({ sourceCommit: source, files: manifest }, null, 2));
  if (!existsSync(publication)) run("git", ["init", "--bare", "--initial-branch=main", publication]);
  const prior = publicGit(["rev-parse", "--verify", "refs/heads/main"], { optional: true });
  // A fresh index creates the exact allowlisted tree, excluding prior files and local historical media.
  env.GIT_INDEX_FILE = resolve(output, "publication-index");
  publicGit([`--work-tree=${exportRoot}`, "read-tree", "--empty"]);
  publicGit([`--work-tree=${exportRoot}`, "add", "--all"]);
  const tree = publicGit(["write-tree"]).stdout.trim();
  const previous = prior.status === 0 ? prior.stdout.trim() : null;
  const sameTree = previous && publicGit(["rev-parse", `${previous}^{tree}`]).stdout.trim() === tree;
  let commit = previous;
  if (!sameTree) {
    const args = ["-c", "user.name=Adjie Rizqan", "-c", "user.email=adjie@jagau.id", "commit-tree", tree];
    if (previous) args.push("-p", previous);
    args.push("-m", `release: audited JAGAU Workspace source\n\nEngineering-Source: ${source}\nComplete original history preserved privately; historical unverified media excluded.`);
    commit = publicGit(args).stdout.trim();
    publicGit(["update-ref", "refs/heads/main", commit, previous || "0000000000000000000000000000000000000000"]);
  }
  report.publicationCommit = commit;
  report.steps.push("Audited current-source export; complete private history unchanged");
  if (process.argv.includes("--prepare-only")) {
    report.status = "PREPARED_NOT_PUBLISHED";
  } else {
    if (run("gh", ["api", "user", "--jq", ".login"]).stdout.trim() !== "adjierizqan") throw new Error("GitHub CLI must authenticate as adjierizqan in normal Terminal.");
    const metadata = run("gh", ["api", `repos/${repo}`], { optional: true });
    if (metadata.status !== 0) {
      if (!/HTTP 404/.test(metadata.stderr)) throw new Error(`Cannot inspect target repository: ${metadata.stderr.trim()}`);
      run("gh", ["repo", "create", repo, "--public", "--description", "JAGAU Workspace — independent software studio"]);
    } else {
      const remote = JSON.parse(metadata.stdout);
      if (remote.full_name !== repo || !remote.permissions?.push || remote.private || remote.archived) throw new Error("Target must be this dedicated public, writable repository; inspect its access/settings.");
    }
    const url = `https://github.com/${repo}.git`;
    const credentials = ["-c", "credential.helper=", "-c", "credential.helper=!gh auth git-credential"];
    const remoteRefs = run("git", [...credentials, "ls-remote", url, "refs/heads/*", "refs/tags/*"]).stdout.trim();
    if (remoteRefs) {
      const refs = remoteRefs.split("\n");
      if (refs.length !== 1 || !refs[0].endsWith("\trefs/heads/main")) throw new Error("Existing remote refs require review; refusing to overwrite another history.");
      const remoteHead = refs[0].split("\t")[0];
      if (publicGit(["merge-base", "--is-ancestor", remoteHead, commit], { optional: true }).status !== 0) throw new Error("Remote history is not this prepared publication history; refusing to overwrite.");
    }
    run("git", [...credentials, `--git-dir=${publication}`, "push", url, "refs/heads/main:refs/heads/main"]);
    report.steps.push("Published dedicated audited source; no force push");
    let workflowReady = false;
    for (let attempt = 0; attempt < 30; attempt++) {
      const workflow = run("gh", ["api", `repos/${repo}/actions/workflows/visual-qa.yml`], { optional: true });
      if (workflow.status === 0) { workflowReady = true; break; }
      if (!/HTTP 404/.test(workflow.stderr)) throw new Error(`Cannot inspect browser QA workflow: ${workflow.stderr.trim()}`);
      await new Promise(done => setTimeout(done, 2000));
    }
    if (!workflowReady) throw new Error("Pushed source, but GitHub has not registered visual-qa.yml; inspect Actions before proceeding.");
    const dispatchedAt = Date.now();
    run("gh", ["workflow", "run", "visual-qa.yml", "--repo", repo, "--ref", "main"]);
    report.steps.push("Dispatched paired browser QA on GitHub runner");
    let qaRun;
    for (let attempt = 0; attempt < 30; attempt++) {
      const runs = JSON.parse(run("gh", ["run", "list", "--repo", repo, "--workflow", "visual-qa.yml", "--commit", commit, "--event", "workflow_dispatch", "--limit", "1", "--json", "databaseId,url,conclusion,status,createdAt"]).stdout);
      if (runs.length && Date.parse(runs[0].createdAt) >= dispatchedAt - 2000) { qaRun = runs[0]; break; }
      await new Promise(done => setTimeout(done, 2000));
    }
    if (!qaRun) throw new Error("CI dispatch accepted but run not yet found; inspect repository Actions, do not deploy.");
    report.qaRun = qaRun;
    console.log(`Browser QA: ${qaRun.url}`);
    const watched = run("gh", ["run", "watch", String(qaRun.databaseId), "--repo", repo, "--exit-status"], { optional: true });
    writeFileSync(resolve(output, "ci-watch.log"), `${watched.stdout}\n${watched.stderr}`);
    const downloaded = run("gh", ["run", "download", String(qaRun.databaseId), "--repo", repo, "--name", "workspace-render-evidence", "--dir", resolve(output, "workspace-render-evidence")], { optional: true });
    if (watched.status !== 0 || downloaded.status !== 0) throw new Error(`CI or evidence download failed; inspect ${qaRun.url} and saved logs.`);
    report.status = "CI_COMPLETE_VISUAL_REVIEW_REQUIRED";
  }
} catch (error) {
  report.status = "BLOCKED"; report.blocker = error.message; process.exitCode = 1;
} finally {
  writeFileSync(resolve(output, "results.json"), JSON.stringify(report, null, 2));
  writeFileSync(resolve(root, "artifacts/operator-publish/latest.json"), JSON.stringify({ evidence: output, ...report }, null, 2));
  console.log(report.status);
  if (report.blocker) console.error(report.blocker);
  console.log(`Evidence: ${output}`);
  console.log("Production deployment, DNS/email changes: NONE. Actual new wallpaper render review remains required.");
}
