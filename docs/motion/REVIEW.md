# Spatial motion experiment

Baseline: PR #13, `6e9eda4e1e525542df334e7d0cbb9c776458d5b1`.
Experiment: `experiment/spatial-motion`, draft PR #14. Production and baseline stay untouched.

## Acceptance fixed before implementation

- Compare two real LabStock prototype treatments at `/motion-study/`, with playback recording and changing browser transform samples, before selecting one.
- Keep Workspace shell, navigation, Guide, project facts, screenshot bytes and Quick Look behavior.
- Apply selected vocabulary to Home previews, Selected Work, LabStock/SuhuLog/BDRS evidence, navigation/opening, and Studio only where hierarchy benefits.
- No simulated screenshot controls, repeating ornamental movement, scroll hijacking or hidden content pending JS.
- Keyboard has equivalent presentation feedback; reduced motion cancels runtime effects and static evidence stays visible.
- Verify desktop/tablet/mobile, both themes, Chromium/WebKit, loading, idle animations, and meaningful performance measurements.
- Existing unit, lint, typecheck, build, static and exact-asset gates must pass. Owner acceptance remains pending.

## Tool decision, 2026-10-10

Reviewed official documentation:
- Motion React: https://motion.dev/docs/react — declarative presence, layout, gestures and hybrid native animation; valuable for a larger stateful choreography, but unnecessary for finite transforms here.
- Motion AI Kit: https://motion.dev/docs/ai-kit — free docs/skill context; premium audit/example/transition features require Motion+. No Motion MCP callable in this session. No paid features or installer executed.
- GSAP: https://gsap.com/resources/React/ — powerful timelines with React cleanup; not needed for this limited sequence vocabulary.
- Remotion: https://www.remotion.dev/docs/player — useful for frame-based video compositions. No authentic interaction recording supplied; do not fabricate one from stills.
- Native WAAPI: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate — finite, cancellable compositor transforms and opacity, with CSS static fallbacks.

Selected CSS + WAAPI. No new dependencies, network runtime or license/security surface. Existing package lock unchanged. This implements the latest user-authorized experiment despite DESIGN.md's earlier no-new-motion boundary.

## Environment

Local export has no Git metadata. GitHub connector verifies branch SHA and performs isolated commits. Shell GitHub access fails with `error connecting to api.github.com`.
Project AGENTS.md records blocked macOS sandbox browser execution and explicitly instructs CI use without retrying the restriction. Browser QA runs on authorized Ubuntu Actions.
Shell defaults to Node 16; checks use installed Node 22.23.1. First lint found prototype root anchor; corrected to Next Link. An initial check mistakenly ran in the parent export, which includes unrelated artifact trees; all subsequent checks use the isolated experiment directory.

## Results

Prototype source local gates: 41 unit tests, lint, production build, typecheck, 12 static groups and 40 exact image hashes PASS.
Prototype playback: PASS in Chromium CI run 38015683873. Actual WebM and changing browser transform samples recorded. Three recovered actual PNG frames were opened locally. Desk lift selected: spatial approach is legible without the camera-settle version's lateral drift and extra settling time. Both settle to the exact static image; neither simulates product controls.

Integration implemented: one finite, decode-aware entrance for approved screenshot elements; shallow pointer/keyboard depth; shorter navigation arrival; Studio text entry. Reduced motion and document hiding cancel active runtime animations, cleanup disconnects observers. Mobile uses translation only. No idle RAF loop, scroll-linked camera, permanent will-change, new font, library or public asset.

Verified source: `73695f2344fa3e0e52b7281bc14229a1109563ea` (runtime unchanged since `8c3aed6`).

- Release gates PASS: https://github.com/adjierizqan/jagau-website/actions/runs/38016475934 — 41 unit tests, 82 Chromium/WebKit tests passed, 16 optional provider tests skipped, lint, typecheck, production build, 12 static groups, 40 exact original assets. Includes keyboard, responsive/theme, Quick Look, WCAG checks, replay, dynamic reduced motion and JavaScript-disabled fallback.
- Focused navigation PASS: https://github.com/adjierizqan/jagau-website/actions/runs/38016475929 — 12 tests.
- Motion review PASS: https://github.com/adjierizqan/jagau-website/actions/runs/38016475932 — 146 actual JPEG captures, 20 distinct live transform samples, two actual browser WebM recordings. Three viewports (1440×900, 768×1024, 390×844), both themes, PR #13 before/after. No page errors or horizontal document overflow; six normal-load Home states reported zero CLS, zero long tasks and zero idle animations.
- Existing broader comparison PASS: https://github.com/adjierizqan/jagau-website/actions/runs/38016475963. This older workflow compares PR #12; the dedicated motion review above uses the required exact PR #13 baseline. Its additional images are not represented as visually inspected.
- Motion artifact: https://github.com/adjierizqan/jagau-website/actions/runs/38016475932/artifacts/11656033275 . ZIP SHA-256 `705c7d459bdf1a28cb95eed180c1680bf5a3b5285b5b46673e855217ec0bec5a`.
- Static review build: https://github.com/adjierizqan/jagau-website/actions/runs/38016475934/artifacts/11656911804 . No deployment.

Agent visual review: all 146 motion-review images inspected in nine contact sheets; full-size desktop focus/Selected Work, mobile Home, tablet dark Studio and prototype starting frame also opened. Workspace proportions, image content, readable labels and focus rings are retained. No new clipping found in those views. Evidence-focused frames intentionally scroll past some headings; they are not full-page screenshots. Early frames named `moving` are timing samples, not a claim that every image is still moving: some once-only entrances already played on opening.

Owner review: PENDING. Local offline dashboard at `artifacts/owner-motion-review-final/index.html`: 80 entries, 66 paired comparisons and 14 additional prototype/interaction views, 89 unique exact images. Existing hash-verifying gallery generator and tested decision/zoom/export/import UI reused. Complete local bundle hashes verified; local browser execution remains blocked, so complete-bundle interactive validation is not claimed. Fingerprint `0a204a8fbf9e6800b45f1e2f2f96e80eeeaa0b92539513c09d87ff9fcaaeb6a1`.

## Performance and security

One synthetic cold mobile run per build, Chromium CI, 4× CPU slowdown, 120 ms latency, 1.5 Mbps down; not field CWV:

| Metric | PR #13 | Motion |
|---|---:|---:|
| First preview decoded | 5351 ms | 5560 ms |
| Resource transfer | 848435 B | 853848 B |
| CLS | 0 | 0 |
| Observed LCP | 1464 ms | 1436 ms |
| Frame interval p95 during selected-work entrance | 16.8 ms | 16.7 ms |
| Frames >50 ms in that sample | 0 | 0 |
| Idle animations / broken previews | 0 / 0 | 0 / 0 |

Raw values: `performance.json`. The +210 ms decode difference is from single runs and should not be treated as a stable regression estimate. Slow-link preview readiness remains about 5.6 seconds. No attempt was made to alter the approved original image payloads.

Both baseline and experiment `npm ci` logs report **9 existing vulnerabilities (8 high, 1 critical)**. Package manifest/lock are byte-identical and no dependency was added. Individual advisories and remediation are outside this motion change; this is not a clean security audit or production release approval.

## Critical visual review and limits

The desk lift fits the native Workspace better than the sideways camera settle: it preserves the screenshot's opacity and moves toward the reader without a lateral fade. Selected Work has slightly more surface separation, and keyboard focus is easy to see. Mobile uses shorter planar movement, which keeps the narrow layout stable.

This is restrained planar 2.5D motion. At rest, much of the site intentionally resembles PR #13. Screenshot text remains too dense to read at thumbnail size; Quick Look is still necessary. It does not demonstrate real product interactions or layered live UI. Studio's change is modest. Continuous playback/timing judgment in a local browser remains unverified; actual WebM recordings are delivered for owner review, while agent inspection used real timed frames and changing runtime transform samples.

## Changed files

Runtime: `components/WorkspacePrototype.tsx`, `components/workspace/SpatialMotion.tsx`, `components/workspace/spatial.css`.
Review prototypes: `components/workspace/MotionStudy.tsx`, `app/motion-study/page.tsx`.
Verification: `tests/browser/motion.spec.ts`, `scripts/capture-motion.mjs`, `scripts/measure-motion.mjs`, `scripts/capture-workspace-parity.mjs`, `.github/workflows/motion-qa.yml`.
Evidence/docs: this report, `source-hashes.json`, `bundle-comparison.json`, `performance.json`.
Dependencies: none added or changed. Canonical data and public assets unchanged.


Local preview server attempt: `listen EPERM: operation not permitted 127.0.0.1:4190`. No local working URL is claimed. Accessible review build is the Actions static-export artifact and local `out/`; it can be served outside this restricted agent environment with Node 22 and `node scripts/serve.mjs`. No deployment is requested or performed.

Artifact download connector returned a ZIP reference, but local curl could not resolve its storage host. Approved browser screenshots can be recovered from CI evidence logs; this does not involve the 14 blocked replacement images. Continuous video playback in this restricted local environment is unavailable. Motion inspection uses real timed browser frames and runtime transform samples; original WebM recordings remain downloadable in Actions.


QA corrections: the settled-capture gate caught a race between hydration/decode and the first IntersectionObserver entrance (three animations began after a briefly idle frame). The capture now waits for the real controller readiness marker and 250 ms sustained quiescence, retaining its zero-running-animation assertion. The new review harness also uses the visible mobile drawer, excludes hidden responsive variants from visible-image decoding, and bounds waits. Earlier incomplete runs remain preserved; they are not represented as passing visual evidence.

Local export JS comparison (all chunks, including review-only route): 307,875 → 310,202 gzip bytes, +2,327 bytes. This is a build-size comparison, not a per-route transfer or field performance claim.

Direct public-site fetch through the web tool returned `URL https://jagau.id/ is not accessible via this tool`. No new production runtime verification is claimed; this milestone verifies isolated builds.
