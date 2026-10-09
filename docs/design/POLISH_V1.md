# JAGAU polish v1 — review candidate

Owner request: improve the approved workspace in place. No merge, deploy,
DNS/email changes, replacement template or new dependencies.

Acceptance: compare the unchanged public-source baseline 625d621 against
design/jagau-polish-v1 at 1440×900, 768×1024 and 390×844 in light/dark.
Homepage should show larger project previews with less introductory whitespace.
The same sidebar, dock, composer, routes, case studies and Quick Look must work.
Inspect actual rendered screenshots; green CI alone is insufficient visual acceptance.

Targeted changes: remove the viewport-sized home intro spacer, retain the existing
type scale while tightening spacing, expand the same three thumbnail links into
image-first previews, soften figure borders and improve restrained hover/focus
feedback. Existing image-opening links gain a visible Quick Look label; the
viewer implementation is unchanged. Reduced motion suppresses added transforms.

Evidence workflow: polish-qa.yml compares two actual static builds, pinned
baseline and proposed source. 132 PNGs cover 11 states × 3 viewports × 2 themes
× 2 versions; manifest records dimensions, hashes, geometry, decoded images,
fonts and animation completion. Existing release-gate CI checks regressions.
Both workflows have read-only permissions and no deployment step.

## Separate safe product screenshot recapture proposal

Current evidence images remain unchanged in this PR. Recapture is a separate,
owner-approved milestone with the application owners' authorization. Use an
isolated local/staging copy of each actual product with a fresh synthetic database,
never a production database export or write to hospital production systems.

Seed plausible fictional names (e.g. Raka Pratama, Nabila Safitri, Dimas Saputra),
invented identifiers, coherent dates and explicitly synthetic clinical/stock
records. Prevent collisions with real patient/staff records by keeping the seed
environment separate; use example.test for any addresses. Disable notifications,
external integrations and production credentials. Synthetic values are never
presented as actual patients, outcomes or customer metrics.

Capture the real application UI after fonts, images and loading/animations settle.
Do not paint over screenshots or generate fictional product UI. Keep a visible
“Synthetic demonstration data” notice and matching website captions. Review every
image for patient identifiers, private URLs, credentials, institutional ownership
and licensing before replacement. Record app revision, fixture seed/version,
viewport, timestamp and SHA-256 in a new manifest; retain current originals and
rollback mapping. Publish replacements only in a separate reviewed PR.

Status: VISUAL PASS; implementation ready for owner review in draft PR #1.
Production remains unchanged. See POLISH_V1_REVIEW.md for checks, evidence and limits.
