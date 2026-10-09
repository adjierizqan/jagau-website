# Integrated JAGAU acceptance — 10 October 2026

Review-only draft: https://github.com/adjierizqan/jagau-website/pull/11
Branch: review/integration-rc-a
Tested implementation: 9985f0d448d105eed221a7484ecd501bc7cf13fa.
Baseline: approved polish 96ca98b; main stays 625d62177ddce5f61679ec0d4d3b2e7d037fa945.

RC A: PASS for combined implementation, automated and visual review readiness. Owner approval/merge/deployment are separate and were not performed. RC B: BLOCKED for genuine inference and exact-payload image publication. Overall issue #2 remains BLOCKED.

## Integration and release diff

The candidate combines polish PR #1, ELAB #7, navigation #10, disabled AI code #9 and screenshot tooling #8. It preserves their public commit ancestry. Two JSX overlaps were explicitly reconciled: Home retains configuration awareness and Studio rendering, project Back opens Projects, and Guide studio references open Studio. The combined configured browser test exercises that actual navigation. No rejected replacement image, private source or database was published.

The tested diff from main contains 52 files: existing workspace/case components and scoped CSS, ELAB/public knowledge/routes, optional consent/client/Worker code, recapture guards/fixtures, tests/workflows and documentation. Existing cleared project bitmaps, dependency lock, deployment workflow and domain configuration are unchanged. Documentation-only closure adds this report, archived old prose and review metadata; it does not alter tested runtime code. Exact release diff is available on the draft PR and in INTEGRATION_EVIDENCE.json.

## Combined machine verification

- Release gates https://github.com/adjierizqan/jagau-website/actions/runs/37961663151 — 40 unit tests, lint, typecheck, production build, 12 static integrity groups and 58 Chromium/WebKit browser tests passed. Sixteen configured-only tests skip in the default build and pass in the separate endpoint-contract build. The guard confirms 40 exact original asset hashes, empty Guide endpoint and disabled Worker flags.
- Optional contracts https://github.com/adjierizqan/jagau-website/actions/runs/37961663138 — 16 tests passed, 36 PNG captures, disabled Wrangler dry-run. Transport is mocked: no genuine provider inference claim.
- Navigation https://github.com/adjierizqan/jagau-website/actions/runs/37961662973 — 12 focused tests passed, 36 PNG captures. These also belong to the 58-test default suite; they are not extra unique tests.
- Visual comparison https://github.com/adjierizqan/jagau-website/actions/runs/37961662873 — 144 PNG captures, 66 baseline/78 candidate, desktop 1440x900, tablet 768x1024, mobile 390x844, light/dark.

Static routes: /, /projects/{labstock,suhulog,bdrs,elab}/, legacy /work/{same}/, robots.txt, sitemap.xml and 404. Browser gates exercise navigation/history, composer/privacy, window controls, keyboard/palette, mobile drawer, reduced motion, metadata, Quick Look, asset loading, horizontal overflow and automated WCAG checks. Build works at root without a project-repository prefix.

## Actual visual inspection

216 captures reviewed: 144 comparison plus 36 navigation plus 36 configured Guide. SHA-256 validated rendered JPEG review copies were recovered from authorized Actions logs; original PNGs, manifests and logs remain in Actions artifacts. All 26 changed comparison frames were opened in labelled sheets; 118 comparison files exactly match the previously inspected navigation comparison. All 72 focused captures were opened. Six current ELAB intro frames were additionally reopened.

Manifest validation: 48 comparison frames per viewport; all 144 correctly sized, fonts ready, images decoded, zero finite animations running. All 72 intro-bearing records report playing=false and characters visible. Actual inspected intros show complete text, not half-rendered animation. Wallpaper/window/sidebar/dock, original polished home/project previews and Quick Look remain. Projects and Studio work alongside optional consent/curated fallback; text wraps on mobile without page overflow. Browser-specific fonts/carets and viewport scrolling are expected, not a zero-pixel-difference claim. No visual defect requiring production change was found.

Local evidence directories under artifacts/project-runs/: integration-visual-37961662873/review/ (capture-results-polish.json, comparison-polish.html, 144 review copies, changed sheets, visual-review.json); integration-navigation-37961662973/review/; integration-guide-37961663138/review/.

Actions artifact IDs/digests:
- Comparison 11632330877: sha256:6917123ce71b2c4f8fd8f27ee3894352a7fc5e1f09ac9b2502230e748f829208
- Navigation 11631715836: sha256:32bc43c77937dfacf61a0a71659d4583250eafeb69df6d295d1c85e9698eb72b
- Guide 11632380441: sha256:a0c9963198c557aeca3fcee1abb1568880de4a1bdeb8b9ab5169466d648d9e14
- Combined release evidence 11631716163: sha256:d50de5c2c2df53ed44d4edf732d35224a90bd25a1cc27c7c1d1ddb6180854747
- Static export 11632355587: sha256:eac13321f97646b37b4f6e31c9d1e7594790531fc9b7370c8068e473747d70b2

## Privacy and RC B boundary

All 40 already-cleared project images are retained byte-for-byte. A deterministic CI guard refuses new/changed project bitmaps or optional endpoint activation for RC A. The 42 authentic isolated demo captures and 14 selected replacements remain private/local; automatic approval denied upload due to insufficient trusted exact-payload privacy clearance. There was no alternative egress attempt in this integration task. New-image website-level integration remains unverified. No real patient/hospital production data was touched.

Guide endpoint remains empty; consent starts unchecked, Worker ENABLED=false and OWNER_APPROVED_FREE_PLAN=false. Provider documentation/pricing/licence requirements were reviewed in ../architecture/AI_ACTIVATION_CHECKLIST.md. Actual account tier/shared quota and genuine inference are unavailable; no credential values were read into public evidence. No authenticated quota or real-answer PASS is inferred from public pricing or fixture tests.

Smallest remaining actions: owner reviews draft #11 for RC A; provide an approved Cloudflare account connection with Free-plan/usage evidence and inference-only scope for RC B, without sharing secrets in chat. The existing authorized 14 exact image payloads require trusted privacy/publication clearance through the approval mechanism. General owner permission already exists and does not override that rejection. Once access/clearance exists, run only the missing RC B boundaries, then combined image/inference browser review. No merge or release is authorized here.

## Rollback and closure

No deployment, DNS, mail, hospital data or personal portfolio change occurred. Production remains on main 625d621; historical public HTTPS/redirect/assets/browser and owner-confirmed email evidence is retained, not retested by these CI-local candidate renders. Decline/close draft #11 to abandon the candidate; keep prior PRs and all evidence. No production rollback is needed. Future release or AI activation needs separate authorization and production verification.

Final result: RC A PASS (review only); RC B BLOCKED; overall BLOCKED. No overall release PASS or new live deployment claimed.
