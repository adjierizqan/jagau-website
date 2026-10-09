# JAGAU v2 release report

STATUS: BLOCKED at external GitHub publication/CI operation. Local automated/rendered workspace acceptance passed on 0037439; new wallpaper browser review is pending. Public HTTPS milestone remains undelivered.

## Actual evidence

Normal Mac Terminal run operator-qa/2026-10-09T01-49-50-614Z tested target 45c68018dc05a62def41cebdba1cf5c441c5a595 against portfolio f1cc1210a579a928a49cc04de00d5c1990bc07b4. Unit 25/25, lint, build, typecheck and 11 static integrity groups passed. Chromium/WebKit browser results: 24 passed, 2 failed, both serious color-contrast violations on home. Browser execution outside Codex now works; previous sandbox EPERM remains a session restriction, not an application failure.

All 60 light/dark desktop/mobile parity PNGs have been inspected. The actual wallpaper/window/sidebar/dock/composer/navigation/case-study structure matches the original portfolio. Tablet home captures in both engines were also inspected. See VISUAL_REVIEW.md. Immutable original failure evidence and screenshots are preserved in historical/qa-45c6801/ and the timestamped operator run. Historical prose before this successful capture is archived at historical/REPORT-before-mac-qa.md.

## Correction awaiting browser verification

app/accessibility.css darkens only eight reported light-theme labels. Original shared styles, geometry, dark palette and interactions are unchanged. Axe waits for fonts/finite entrance animations and collects findings on home and all cases before asserting no violations. Checks are not suppressed or weakened. New candidate unit 25/25, lint, production build, typecheck and static 11 groups passed: contrast-*.log. Fresh browser results and corrected screenshots remain pending; no new browser PASS claimed.

## Preserved scope

Actual WorkspacePrototype interface and public case compositions are reused. Company identity/contact is JAGAU / adjie@jagau.id; LabStock, SuhuLog and BDRS retain reviewed founder attribution. Replies are deterministic curated exploration, with no live AI or external prompt transmission. Personal portfolio and hospital systems were not modified. No editorial homepage remains active. Live AI is a separate future milestone.

## Remaining gates

Immediate operation: run /Users/adjie/Projects/jagau/scripts/run-release-qa.mjs once in normal Mac Terminal, then review fresh render/accessibility evidence. No repeated forbidden listener/browser escalation is attempted in Codex.

Prior access inspection: GitHub CLI token invalid; connector target repository returned 404 and lacks repository creation/Pages administration. Shell network access restricted. No remote push, CI run, staging/Pages deploy or custom domain is claimed. Publication audit is limited: signature scans found no matches, but full binary data review and wallpaper provenance remain HOLD. Permanent complete reachable Git history is preserved at artifacts/git-history; original temporary metadata is stale and must not be used.

DNS-provider full-zone and mailbox authorization are unavailable. No DNS or email records changed. Before cutover, export the full zone and preserve MX/SPF/DKIM/DMARC/nameservers/unrelated records; configure Pages domain first and change only website records. Verify public jagau.id/www HTTPS and actual sending/receiving. These remain UNVERIFIED. Existing operations/deployment documentation records rollback requirements.

SOP v1.0 frozen. Final outcome cannot be LIVE — VERIFIED until fresh acceptance, safe publication, protected DNS cutover, external HTTPS/workspace checks and actual mail smoke evidence pass.

## Latest Mac QA — 2026-10-09T02-00-40-217Z

Target 16674520adf9ed79c482311d01e38fd6a0e97d61: 25 unit tests, lint/build/typecheck/static gates and both capture passes succeeded. Browser 24/26 pass. Home has no reported axe violations in either engine, confirming the eight-label correction. Both axe tests now reached every case: Work/back link ratio 4.19 and Replay intro ratio 4.28 (required 4.5), plus invalid LabStock dl child (div > a). These were previously hidden by the first home assertion failure, not a regression of the homepage fix.

Inspected all 15 changed parity PNGs; other 45 match the previously inspected PNG hashes. Workspace structure remains correct, lighter labels are now readable without layout changes. Screenshot manifest: operator-qa/2026-10-09T02-00-40-217Z/visual-review.json. This is pre-case-fix evidence, not final release approval.

Minimal case correction: extend light-theme contrast override to Work/back and Replay intro, and enclose LabStock evidence links in semantic dd elements. Preserve original CSS and three-column/stacked link placement using isolated rules. Capture harness now includes matched LabStock evidence-section screenshots, so the changed semantic markup placement can be inspected directly at both viewports/themes. New render and axe acceptance remain PENDING. No deployment/DNS/email mutation.

## Accepted local candidate — 2026-10-09T02-09-07-429Z

Target 0037439dbbe1d814964933282c5f8eae922d058f; reference f1cc1210a579a928a49cc04de00d5c1990bc07b4. Every operator step passed, including 25 unit tests, lint, production build, typecheck, static integrity (11 groups), 26 browser tests in Chromium/WebKit, and both capture runs. Axe reports no violations on home and all three public case pages within its tested scope. No test rule was suppressed.

Visual structure acceptance: PASS for desktop/mobile in light/dark. 68 PNGs accounted for: all 16 new/changed PNGs directly inspected this turn, 52 byte-identical to previously inspected images. New evidence-section pairs confirm correct columns/stacking and functional visible links after semantic repair. Minor mobile row spacing differences from semantic wrapping do not impair the layout; no pixel-identical claim is made. Screenshot review and automated axe do not establish full VoiceOver/manual accessibility certification. Per-image hashes and findings: operator-qa/2026-10-09T02-09-07-429Z/visual-review.json. Generated capture reports retain UNREVIEWED deliberately; this separate review records the actual human-readable verdict.

Next blocked operation: access dedicated GitHub repository/create/connect/push. Fresh gh auth status reports invalid adjierizqan token. GitHub connector target get_repo returns 404; it cannot create repositories or administer Pages. Reauthenticate in normal Terminal using gh auth login --hostname github.com --git-protocol https --web --scopes workflow. Do not share credentials in chat. Network restrictions may still require a separate normal-Terminal publishing operation after login; login alone is not deployment evidence.

Publication credential signature scan is publication-audit-0037439.json (limited scope). Wallpaper provenance still missing; asked owner for source/license or own-photo confirmation. Full rights/data clearance is not inferred from its use in the original portfolio. Current DNS provider/full zone backup and mailbox authorization remain unavailable. No repository push, Pages/domain configuration, DNS/mail mutation or public HTTPS success occurred. Local VERIFY is accepted; SHIP/MAINTAIN are not complete.

## Owner-authorized wallpaper replacement

Owner requested a new macOS-style picture instead of tracing the old wallpaper. Built-in image_gen produced an original fictional alpine lake at dusk; converted to JPEG at native 1586×992, about 389 KiB. Saved at public/wallpaper_mac.jpg with the same asset path/CSS/layout. Generated image and final JPEG were inspected. Full prompt/hash/method: wallpaper-provenance.json. Not an official Apple image, real-location photograph or UI screenshot. Browser evidence on 0037439 remains valid for that commit; it does not show the new wallpaper. Only the changed background needs new rendered review on the replacement commit, which can occur in the next authorized QA/staging run.

Current asset's provenance is now recorded. Old wallpaper and captures remain in complete local historical backups; do not push historical unverified media publicly. Publish only an audited current source snapshot/clean publication history, retaining complete engineering history and comparison captures privately. Credential signature PASS does not establish binary privacy/rights clearance. No deployment/DNS/email mutation.

## Current access correction and publication operation

Owner completed the requested GitHub login in normal Terminal. Restricted-session gh reports invalid token, but gh api user and curl fail to reach/resolve api.github.com; actual normal-Terminal authentication is therefore unverified, not proven invalid. Do not ask for another login based solely on that output. Connected GitHub profile is adjierizqan; dedicated get_repo returned 404. Connector has no create-repository or Pages-admin tools.

Current asset audit: all 40 project bitmaps directly inspected, including full case-study captures. Demo/synthetic identities and generic operational content; no real identifying patient data/private URLs observed. Other current asset provenance documented; per-file hashes in current-assets-audit.json. This clears reviewed current presentation for an isolated source publication, not historical media. scripts/publish-release.mjs prepares a clean publication history, preserves complete local engineering history, checks source/asset drift and credential signatures, creates/connects only the dedicated repository from normal Terminal, refuses unknown histories/force pushes, dispatches paired external browser QA and downloads evidence. It does not deploy Pages or touch DNS/email. Prepare-only evidence is local; no remote success inferred.

Owner reports Rumahweb as registrar/DNS provider, not yet connected. Confirm actual authoritative DNS host from current nameservers and full panel record list; preserve nameservers and every mail/unrelated record. Full-zone backup and mailbox sending/receiving evidence are unavailable. Exact remaining operation: run the publication executable in normal Terminal, then inspect new wallpaper/CI screenshots. Later Pages/domain binding and DNS cutover must follow verified hosting and private zone backup; public HTTPS/mail remain UNVERIFIED.

Publication harness verification on 856fc73: Node syntax checks, lint (no warnings), typecheck and unit 25/25 passed. --prepare-only completed without network/publication: artifacts/operator-publish/2026-10-09T02-28-45-376Z/results.json. 127 allowlisted source files, 57 matching reviewed public assets, zero historical screenshots/environment secrets in the export; clean publication history has one initial commit a65aae68bbf69efe1b5f26133bfd3b82f747025f. Full original history signature audit checked 656 blobs/122,483,082 bytes with zero listed signature matches (limited credential-pattern scope; not general privacy certification). Full original bundle verified complete. No remote repository creation/push/CI/deploy inferred from local preparation.
