# Workspace craft review candidate

Draft PR: https://github.com/adjierizqan/jagau-website/pull/13
Branch: design/workspace-craft-v1. Baseline PR #12 d84b396 remains intact. Runtime candidate 2b20085e9bfc9ad7299f3cdf4451873d261f98b8; subsequent changes concern evidence framing and documentation only.

The Home now leads with authentic founder software. Existing previews grow from 236 to 304 px on desktop, 134 to 454 px in the narrow tablet window, and about 101 to 350 px on mobile. Mobile/tablet Guide follows the evidence band: review this intentional tradeoff in the dashboard. The macOS shell, original image payloads, navigation, windows, dock, themes, metadata, contacts and curated responses are preserved.

Studio explains actual LabStock source identity, SuhuLog correction history and BDRS event meaning rather than generic numbered process steps. An explicitly labeled Indonesian summary supplements the English UI; full UI localization is not claimed. Shared case typography uses balanced wrapping, less compressed tracking and smaller section gaps. Quick Look retains its name alongside Open full-size. Case CTAs use a shared stylesheet so direct ELAB visits no longer display concatenated controls.

## Verified automation

- 41 unit tests; lint; production build; typecheck; 12 static groups; guard retaining 40 exact cleared images and disabled AI.
- 76 Chromium/WebKit browser tests passed; 16 provider fixture tests intentionally skipped while AI is disabled. WCAG, all viewport/theme navigation and Quick Look keyboard/focus tests passed.
- Release gates: https://github.com/adjierizqan/jagau-website/actions/runs/38009617634
- Navigation: https://github.com/adjierizqan/jagau-website/actions/runs/38009617818
- Actual visual capture: https://github.com/adjierizqan/jagau-website/actions/runs/38009617803 — 258 PNGs, hashed JPEG review copies, manifest and logs. Artifact 11653092389, SHA-256 8ffe0b4f38f922cd3dfdca6c138a1cf9c0e7761f446abfa9cc29e0286f3ef365.

The first test run correctly caught loss of the visible Quick Look name; the UI was repaired without weakening the tests. A later actual render exposed a QA-only mobile study-anchor framing problem. The capture script now reserves measured toolbar clearance and asserts the complete heading is visible. Final evidence and inspected screenshot inventory are linked in the PR; workflow success alone never constitutes visual or owner acceptance. Preserve earlier runs as evidence.

## Owner review and provenance

Offline bundle: artifacts/owner-premium-review/index.html, with manifest.json, exact viewport JPEGs, source revisions and original PNG hashes. The full PNGs remain in Actions artifacts. Compare Home, footer, directory, Guide, Studio, cases, gallery/hover, Quick Look and all three viewports in both themes. New Indonesian disclosure is explicitly non-comparable; no new page is claimed. Changed versus byte-identical captures are labeled. Zoom, keyboard focus, Approve/Revise/Reject, notes, persistence and decision import/export are tested on the shared dashboard UI using cleared assets only. Opening every full private/local bundle in the macOS sandbox is not claimed.

Owner decisions start pending. Review Approve / Revise / Reject and export decisions. This is the remaining approval boundary; no release authorization is inferred.

Skill audit: requested OpenAI frontend-skill absent at pinned revision; Impeccable binaries/hooks excluded; Vercel guidelines manually applied. Six audited static reference files have source/hash provenance. Root .agents registration is blocked by managed filesystem permissions; automatic discovery is not claimed. See SKILL_AUDIT.json and DESIGN.md.

The 14 rejected replacement payloads remain excluded and unmodified. Existing privacy/publication denial remains binding; no alternate upload route is attempted. No hospital production access or real inference occurred.

## Release diff and rollback

Four existing UI/style files, QA scripts/tests/workflow and project design guidance. No dependency, public image, canonical fact, endpoint, hosting or DNS/email change. Main remains 625d62177ddce5f61679ec0d4d3b2e7d037fa945.

Review rollback: close the unmerged draft PR or use unchanged PR #12 d84b396. Preserve all evidence folders. Production has not changed, so no production or DNS rollback is required. Real AI is deferred; image publication requires trusted clearance of the exact payloads in a separate milestone.
