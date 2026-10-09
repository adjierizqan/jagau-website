import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync("docs/release", { recursive: true });
const checks = [];
for (const script of ["test", "lint", "typecheck", "build", "test:static"]) {
  const result = spawnSync("npm", ["run", script], { encoding: "utf8" });
  writeFileSync(
    `docs/release/${script.replace(":", "-")}.log`,
    result.stdout + result.stderr,
  );
  checks.push({
    command: `npm run ${script}`,
    exitCode: result.status,
    status: result.status === 0 ? "PASS" : "FAIL",
  });
  console.log(`${checks.at(-1).status}: npm run ${script}`);
  if (result.status !== 0) break;
}
writeFileSync(
  "docs/release/local-results.json",
  JSON.stringify({ checks }, null, 2) + "\n",
);
if (checks.some((c) => c.status !== "PASS")) process.exitCode = 1;
