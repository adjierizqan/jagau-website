# JAGAU workspace polish v1 — review evidence

Status: PASS for the proposed polish; draft review only, not a production release.
Branch: `design/jagau-polish-v1`. [Draft PR #1](https://github.com/adjierizqan/jagau-website/pull/1).
Unchanged public baseline: `625d62177ddce5f61679ec0d4d3b2e7d037fa945`.
Verified implementation/test revision: `715383ff12164cd523536b1244bdb7b31d6de92f`.

## Observable changes

- Homepage retains the same JAGAU Guide, typography, wallpaper, desktop window,
  sidebar, dock and navigation. Three existing previews become image-first links;
  desktop images grow from 96 px to about 223 px wide. Tablet/mobile keep their
  existing three-column identity and gain stronger project labels.
- Intro height changes from 660 to 648 px on desktop, 660 to 585 px on tablet,
  and 600 to 581 px on mobile. Tablet content starts 10 px earlier. These are
  measured screenshot-manifest values, rounded to whole pixels.
- Selected-work gaps and the existing stagger are tighter, with restrained
  borders, shadows and hover/focus image feedback. Reduced motion disables the
  added transitions/transforms. No scroll hijacking or new dependency.
- Clickable screenshots explicitly say `Quick Look ↗`. The existing viewer,
  image assets, project text, routes, appearance/language settings and curated
  Guide remain intact. Recapture remains a separate proposal in POLISH_V1.md.

## Machine verification

[Release gates run 37930245746](https://github.com/adjierizqan/jagau-website/actions/runs/37930245746):
25 unit tests, lint, build (11 static routes), typecheck, 11 static integrity groups,
and all 34 browser tests passed. Chromium and WebKit cover responsive layouts,
curated answers, keyboard/navigation, reduced motion, window controls, metadata,
automated WCAG checks and image viewing. The eight additional tests check all
three projects at mobile/desktop in light/dark, including keyboard opening, zoom,
fit, Escape, focus return and horizontal overflow. Tests select a rendered link
and assert actual focus before pressing Enter, instead of focusing hidden links.
Automated accessibility checks are not a full manual WCAG certification.

## Visual evidence and inspection

[Reviewed capture run 37929573583](https://github.com/adjierizqan/jagau-website/actions/runs/37929573583)
completed successfully (exit 0): 132 PNGs, 132 JPEG review copies and a JSON
manifest. Matrix: 11 states × 3 viewports × 2 themes × before/after.
Viewports: 1440×900, 768×1024, 390×844. States: home, selected work, navigation,
composer input/workspace, guided response, three project intros, LabStock evidence
and Quick Look. Each PNG has recorded dimensions and SHA-256. Fonts and images
were ready and finite animations finished; all project intros had `data-playing=false`
and fully visible prompt characters. No horizontal overflow was accepted.

[Original artifact 11615318447](https://github.com/adjierizqan/jagau-website/actions/runs/37929573583/artifacts/11615318447)
contains `capture-results-polish.json`, `comparison-polish.html`, PNG/JPEG images
and server/capture logs. ZIP SHA-256:
`8c723d23f14c8c3ea732dc58cc5d4deb132ce91d4efa90620c6ed2dc729efab1`.
Capture head: `16aa09ff3aafed22052721480a40ad464c763b89`; runner checkout/manifest
merge SHA: `30132c28c3dc174808f20acba1feabe5e9158b82`. The later verified revision
changes only test selection; it does not change rendered website files.

Local review: `artifacts/polish-runs/37929573583/review/review-comparison.html`.
All 132 actual browser JPEG review copies were recovered through authorized
GitHub job logs and checked against their recorded SHA-256 and exact dimensions.
They are separate same-viewport browser captures, not fabricated mockups. Original
PNGs remain in the CI artifact; native artifact download DNS was restricted.
All 66 pairs from the preceding successful run were opened; 96 current images
were byte-identical and 36 changed images were reopened in their side-by-side
pairs, including all corrected selected-work captures. Review found complete
intros, unchanged workspace identity and viewer behavior, clearer previews and
image-opening labels, and no new clipping or unfinished content.

An additional [capture run 37930245633](https://github.com/adjierizqan/jagau-website/actions/runs/37930245633)
also passed after the test-only fix; visual acceptance is based on the explicitly
reviewed artifact above rather than assuming a green run constitutes image review.

## Delivery boundary

Production, main, hosting/deployment workflows, DNS, email, hospital systems and
the personal portfolio were not changed. No merge or deployment performed.
Review the draft PR before a separate release decision. Existing screenshots
still contain clearly synthetic DEMO placeholders; their safe recapture proposal
does not execute any production-data mutation or replace any image in this PR.
