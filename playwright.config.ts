import { defineConfig, devices } from "@playwright/test";
const baseURL = process.env.QA_BASE_URL || "http://127.0.0.1:4185";
const reportPath = process.argv.includes("--list") ? "docs/release/browser-inventory.json" : "docs/release/workspace-browser-results.json";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: reportPath }],
  ],
  use: { baseURL, trace: "retain-on-failure" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: process.env.QA_BASE_URL ? undefined : {
    command: "node scripts/serve.mjs",
    url: "http://127.0.0.1:4185",
    reuseExistingServer: false,
  },
});
