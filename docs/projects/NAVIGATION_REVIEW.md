# Four-destination navigation — issue #2 / #6

Status: implementation, automated checks and scoped visual acceptance PASS; draft PR #10 awaits owner review. No merge or deployment.

Tested commit: 39973c488ef57185c377b9ff73b5396f9368463b. Home, Projects, Studio and Ask share the original macOS shell. More remains a command-palette utility. New Session appears only inside Ask; keyboard reset stays in Ask. Project shortcuts, history, direct routes, settings and Quick Look are retained. Studio reuses the original company/about block without changing homepage content.

Release gates: https://github.com/adjierizqan/jagau-website/actions/runs/37954918123 — 29 unit tests, lint, typecheck, build, 12 static groups and 58 Chromium/WebKit browser tests PASS.

Focused browser acceptance: https://github.com/adjierizqan/jagau-website/actions/runs/37954918265 — 12 tests, 36 actual frames, 1440×900 / 768×1024 / 390×844 × light/dark × Chromium/WebKit. Keyboard destinations, ELAB route and browser history, curated Ask, reset, overflow and Studio WCAG checks PASS. All 36 screenshots opened and inspected. Artifact 11627373403; SHA256 43856a959b59a428ea6ef574c1faff7aa73b66c77f0c359c075d5dee4b62d545.

Full comparison: https://github.com/adjierizqan/jagau-website/actions/runs/37954918072 — 144 actual frames. Every changed frame opened in labelled review sheets; identical hashes reuse the previous completed image review. Home content, three featured previews, wallpaper/windows, case intros and Quick Look remain visually consistent. Sidebar/dock now avoid duplicate destinations. Artifact 11628140531; SHA256 c3132367094bf146a8750404573732e045eb5029bc13b71d5b8643cdecdc4213. Original PNGs and manifests remain in Actions artifacts; local JPEG review copies and hash/size records under artifacts/project-runs/navigation-37954918072/review and navigation-37954918265/review.

Fixed confirmed defects before acceptance: keyboard reset returned Home; new Studio text had insufficient contrast. Earlier failed runs/evidence retained. No test threshold weakened.

This PR stacks on feature/verified-projects. AI and screenshot tracks are separate candidates; combined integration has not been tested or merged. No overall issue #2 PASS implied. Rollback: drop this unmerged PR.
