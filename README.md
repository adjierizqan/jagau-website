# JAGAU Interactive Studio

Independent company website with an integrated **guided project explorer**. Built with Next.js 16.4.0, React 19.2.4 and TypeScript. Essential content is exported as readable HTML. Questions match reviewed topics in the browser; no live AI, analytics or backend is enabled. Only appearance/audio preferences use local storage; questions remain in memory.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
npm run test:static
npx playwright install chromium webkit
npm run test:browser
```

`npm run verify` runs all gates. `node scripts/serve.mjs` serves the production export at `http://127.0.0.1:4185` for review. Browser checks start that server themselves. Review screenshots in `docs/release/workspace-screenshots/` and paired galleries in `docs/release/parity-screenshots/` after a successful run. No environment variables are required. Optional `QA_BASE_URL=https://<staging-host>` runs browser QA against an existing public staging URL; see `.env.example`.

`data/studio.ts` is the reviewed content source. `lib/explorer.ts` routes questions to that data. `data/workspace.ts` carries the same three public founder studies from the portfolio. `app/projects/[slug]/page.tsx` exports them; legacy `/work/` links redirect. `components/WorkspacePrototype.tsx` uses the actual portfolio workspace shell and guided conversation UI. Never import private operational data into these sources.

Mandatory paired visual QA: run the one executable [release QA script](scripts/run-release-qa.mjs) from normal Mac Terminal against both real exports and inspect its side-by-side galleries. CSS reuse alone does not clear acceptance.

Sources: [content provenance](docs/release/content-provenance.md). Requirements and acceptance: [release scope](docs/decisions/001-release-scope.md). Authoritative status: [PROJECT_STATUS](docs/PROJECT_STATUS.md). Operations, deployment and rollback: [runbook](docs/deployment/RUNBOOK.md). Current gate evidence: [release report](docs/release/REPORT.md).

CI verifies every push/PR. Production Pages deployment is a separate manual workflow that repeats every gate and uses the `production` environment. Configure required reviewers and protected main before using it. Deployment is currently blocked, as documented in the release report. No DNS automation is included.

## Cinematic review experiment

This isolated branch extends PR13, with editable React/Remotion software presentations and a curated chat that reveals the relevant film. The interfaces are illustrative reconstructions with synthetic examples; original public screenshots remain in the case studies. Production and the approved drafts are unchanged.

`npm run motion:studio` opens the four editable compositions. `npm run motion:render` exports three product films plus the alternate LabStock direction, each 1920×1080 at 30fps for 16 seconds. Committed MP4/JPEG media lets Cloudflare build the website using `npm run build`, output directory `out`, without running Chromium or requesting rendering credentials. The dedicated staging Git branch is `experiment/cinematic-ui`.

`/motion/review.html` provides a full-size A/B film player on the staging site. See [acceptance](docs/cinematic/ACCEPTANCE.md), [source provenance](docs/cinematic/PROVENANCE.md), and [dependency audit](docs/cinematic/SECURITY.md). Remaining lint-tool vulnerabilities are documented; this draft does not authorize a production release.
