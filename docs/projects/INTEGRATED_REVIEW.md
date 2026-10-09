# Integrated JAGAU review candidate — issue #2

Acceptance before implementation: RC A preserves the macOS Workspace, approved polish, ELAB facts and four-destination navigation with all 40 cleared original bitmaps; Guide remains curated. Combined default and optional-endpoint contract tests must pass; actual desktop/tablet/mobile light/dark screenshots must be inspected. RC B requires genuine provider inference and exact-payload image clearance, independently of RC A.

Source candidates: polish 96ca98b, ELAB e73039d, navigation 92f27e3, optional Guide aa612fb, screenshot tooling 03cbbdb. Integration starts from navigation's tree, applies exact Guide and QA-tooling deltas relative to ELAB and reconciles two overlapping JSX sections. Studio reference opens Studio, project Back opens Projects, consent/configuration and legacy behavior remain. No rejected image payload or staged replacement reference is included.

Combined local checks: 40 unit tests, lint, build, typecheck and 12 static integrity groups passed before CI. Exact-image/default-disabled guard is added to verify. Combined browser and visual review: PENDING; workflow success alone is insufficient.

RC A: IN REVIEW. RC B: BLOCKED — authenticated Cloudflare Free/quota/genuine inference unavailable; exact replacement image publication denied by automatic review. AI defaults disabled; existing screenshots retained. See ../architecture/AI_ACTIVATION_CHECKLIST.md.

Production stays main 625d621; review only, no merge/deploy/DNS/email/hospital data changes. Routes: /, /projects/{labstock,suhulog,bdrs,elab}/, legacy /work/{same}/, robots.txt, sitemap.xml, 404. Default endpoint is empty, and optional browser responses are explicitly mocked contract fixtures.

Rollback: close/decline the integration draft; production never changed. Preserve previous PRs and artifacts. An eventual release needs separate owner approval and production verification; overall issue is not PASS while RC B gates remain blocked.
