# Visual-first owner review candidate

Foundation: PR #11, `11114aec6243652532d5605816f5a7c8b714c506`.
This follow-on is review-only. No merge, deployment, DNS, email, production-data
changes or AI activation are authorized in this milestone.

Acceptance: preserve the macOS workspace and four destinations; tighten the
home hierarchy; complete Studio with existing public engineering facts and
inspectable project links; retain truthful case-study status and accessible
Quick Look. Verify combined tests, actual desktop/tablet/mobile captures in both
themes, and owner review of one offline Before/After dashboard.

The local dashboard includes original production → approved polish, approved
polish → integrated foundation, and foundation → this candidate comparisons.
New pages/captures are marked NEW / NO BEFORE. Product recaptures are explicitly
non-comparable when revisions, data, viewport or crop differ. Review decisions
start pending, persist locally where available, and can be exported/imported.
Exporting owner decisions is necessary for a durable approval record; technical
QA does not approve on the owner's behalf.

`scripts/build-owner-gallery.mjs` takes a local JSON manifest and a new output
directory. It verifies exact supplied image hashes, copies bytes unchanged,
embeds metadata for offline use, and refuses evidence overwrite. The generated
HTML, manifest and images stay in ignored local artifacts. The browser tests use
only an already-cleared image fixture, never the 14 withheld captures.

Privacy: all 40 existing cleared assets remain byte-identical in the candidate.
The 14 selected synthetic application screenshots are authorized for local
owner review only. The earlier automatic public-egress rejection remains
binding. No alternative upload route is attempted. Publication is BLOCKED but
does not block the UI-only candidate using existing images.

Real AI is DEFERRED, outside this milestone. The curated Guide remains enabled;
the optional endpoint and Worker activation flags remain disabled. No provider
configuration or paid service is added.

Current status: technical and agent visual review PASS; mandatory owner
approval PENDING. [Draft PR #12](https://github.com/adjierizqan/jagau-website/pull/12)
is stacked on PR #11. No merge/deployment is authorized.

## Actual evidence

- Tested revision: `005a7571208a0439df993388100ed13ac7d060c7`.
- [Combined gates 37970798516](https://github.com/adjierizqan/jagau-website/actions/runs/37970798516):
  41 unit tests, lint, typecheck, static build, 12 static integrity groups,
  exact 40-image guard and 64 Chromium/WebKit tests PASS. The 16 optional
  configured-provider fixture tests remain skipped in this curated-only build;
  they are outside this milestone, not genuine AI evidence.
- [Navigation 37970798526](https://github.com/adjierizqan/jagau-website/actions/runs/37970798526):
  12 focused tests PASS, including keyboard Studio → ELAB → history return,
  mobile drawer, all four primary destinations and automated accessibility.
- [Inspected captures 37969877749](https://github.com/adjierizqan/jagau-website/actions/runs/37969877749):
  exit 0; 198 PNGs plus matching JPEG review copies and manifest, at 1440×900,
  768×1024 and 390×844, light/dark. Runner merge SHA
  `78db820c48d6904a3be0de0a86e238456548e9ae`; head `5205a1d`.
  All 198 hashes/dimensions/readiness records passed validation. All 76 new
  render copies were actually opened in 13 contact sheets; 122 matched exact
  bytes of previously inspected evidence. All intros were complete, fonts and
  images ready, and finite animations finished. Key full-size views were also
  opened for legibility. No visual defect requiring a website change was found.
- The only diff between inspected render `5205a1d` and tested `005a757` is the
  dashboard browser QA script. Website source and original assets are identical.
- [Latest capture 37970798778](https://github.com/adjierizqan/jagau-website/actions/runs/37970798778)
  also completed successfully; its images are not represented as inspected.
- Dashboard interaction QA: six Chromium/WebKit desktop/tablet/mobile tests
  PASS for keyboard zoom/fit/Escape/focus return, filter, note persistence,
  export/import validation, overflow and automated WCAG checks. Six actual
  fixture render copies were opened; the fixture uses only a cleared asset.
  Native Chromium is sandbox-blocked, so no local-browser PASS is inferred.

Local owner dashboard: `artifacts/owner-visual-review-final/index.html`.
Offline manifest: `artifacts/owner-visual-review-final/manifest.json`.
266 review entries, 287 unique exact image files, 14 local-only replacement
comparisons. Original production/polish/foundation comparisons are preserved;
new pages/captures and non-comparable product captures are clearly labeled.
All local hashes/image decodes passed; approval starts at 0, not pre-approved.
The generated full dashboard is local-only. Its shared interaction code was
browser-tested in CI with safe fixtures; the private bundle itself was not sent
there or claimed to have been opened by a local browser.

## Meaningful changes and limitations

Home uses the existing available column more fully, with wider desktop
previews and tighter prompt-to-preview spacing. Studio replaces unused space
with existing public approach facts and four projects, including ELAB's honest
in-progress boundary. Case captions grow from 0.72rem to 0.8rem; hover gives
restrained 1% scaling, disabled under reduced motion. The cleared product
bitmaps are unchanged, so dense embedded text still needs Quick Look zoom.
No new project identity, fabricated product screen or release claim is added.

Early dashboard QA found mobile import-control overflow and readiness checks
including a closed dialog's empty image. Both were fixed; the failed runs remain
preserved. No acceptance criterion or accessibility check was disabled.
Automated WCAG checks do not constitute a complete human certification.

Owner must inspect the offline dashboard and export decisions/feedback before
any merge/deployment. Replacement publication remains BLOCKED by prior
exact-payload automatic approval rejection; local approval does not bypass it.
Real AI remains DEFERRED, not a blocker for this UI-only milestone.

Rollback: discard/close PR #12 to return to unchanged PR #11; discard PR #11 to
return to existing main. No production rollback is needed because nothing was
deployed. Production, DNS, email and hospital systems are unchanged.
