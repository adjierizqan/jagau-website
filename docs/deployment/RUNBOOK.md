# Operations and release runbook

Owner: Adjie. No database, accounts or persistent visitor state. Static site only. Live AI is absent.

## Local operation

Install with Node 22 and `npm ci`. Develop with `npm run dev`; stop with Ctrl-C. Build with `npm run build`. Start export preview with `node scripts/serve.mjs`; stop with Ctrl-C and restart by running it again. Check `/`, each `/projects/<id>/` (legacy `/work/` redirects), `/robots.txt`, `/sitemap.xml`, `/icon.svg` and the contact link. Read build/server output for errors. Browser screenshots are written by `npm run test:browser`; local workspace screenshot review passed on 0037439 (see release/VISUAL_REVIEW.md); public production rendering remains unverified.

## Before production

1. Local gates and rendered review passed through the normal Mac QA executable on 0037439. Remote CI must rerun the gates on the published commit, followed by staging/production rendering and owner review. Obtain current dependency advisory results; the offline audit output is not current security evidence.
2. Create or verify dedicated `adjierizqan/jagau-website`; the authenticated connector's 27-repository inventory returned no JAGAU repository. GitHub CLI credential check failed. This session has no repository-creation or Pages-configuration tool.
3. Push the source and traceable commit. Configure Pages source as GitHub Actions, domain `jagau.id`, repository protection and required reviewers for the `production` environment. Verify domain ownership and HTTPS settings through GitHub. Quality workflow must pass remotely before release.
4. Export the **entire DNS zone** through its authenticated current provider; DNS lookups cannot enumerate all DKIM selectors or wildcard records. Save before snapshot and existing website/hosting backup. Identify current website records and actual nameservers from evidence. Do not infer email ownership.
5. Preserve MX, SPF/TXT, DKIM, DMARC, NS, wildcard, hospital app and VPS records exactly. Obtain current official GitHub Pages targets rather than copying stale IPs. Only after Pages domain configuration, change the website's apex A/AAAA and www CNAME as needed; do not remove unrelated or wildcard records. Save the after snapshot and deterministic record diff. Hold if any protected record changes.
6. Dispatch `Deploy verified JAGAU export` for the reviewed commit. It reruns every gate and supplies CNAME in the artifact. No automatic DNS update runs. Review workflow logs and Pages deployment result.
7. Verify apex and www: valid HTTPS/TLS, no redirect loop, expected content and commit, all case studies/assets, metadata, mailto and console. With mailbox owner, perform actual email send/receive; unchanged MX records alone do not prove mailbox delivery. Collect real mobile performance/CWV reports on the deployed origin. Do not fabricate scores.

Never mark LIVE/SHIPPED until these checks and the frozen SOP release gate pass. This session made zero remote repository, Pages, Worker, DNS or email mutations. No DNS before/after snapshot is claimed.

## Backup, rollback and monitoring

Keep source in dedicated GitHub repository plus the permanent local Git metadata at `artifacts/git-history` and the source bundle in `artifacts/`. Keep the exported artifact and its SHA-256 in independent storage before deployment. Preserve the previous hosting artifact/config and full DNS zone before the first cutover. Owner retains access. Retain at least the current and previous successful release and every pre-change DNS snapshot.

Restore source using `git clone <source-bundle-path> <new-checkout>`, then `npm ci` and `npm run verify`. Restore of the current source bundle is checked through a bare repository because this workspace forbids normal `.git` creation. Static export checksums provide artifact integrity, not proof of browser behavior.

Rollback: identify the previous known-good commit, revert the release change on protected main, pass verification and dispatch deployment. If the new Pages origin itself is unavailable, restore **only** the website records from the before snapshot and verify the previous origin. Never bulk-import a DNS zone or modify mail records as part of rollback. An actual production rollback cannot be rehearsed before hosting is inventoried.

After release, check both HTTPS origins, case studies and static assets after every deploy and periodically. Check Actions/Pages status and browser console on errors. There are no server application logs, databases or storage volumes. Do not add visitor prompt logging. If a separate AI Worker is later implemented, document its deployment, limiter, daily budget, exact origins, timeout, safe output validation and live tests before activation.

## Permanent local history and current access

Full reachable project history is copied from /private/tmp/jagau-v2.git to /Users/adjie/Projects/jagau/artifacts/git-history. Integrity fsck passed; historic unreferenced objects remain locally. This is a bare metadata directory inside the writable project, excluded from publication by artifacts/. Commands in this workspace now use:

```sh
GIT_DIR=/Users/adjie/Projects/jagau/artifacts/git-history GIT_WORK_TREE=/Users/adjie/Projects/jagau git status
```

Source bundles are portable complete-history backups; verify bundle and checksums before restore. Keep a copy in independent owner-controlled storage. Do not publish the bare metadata directory, DNS exports, credentials or mailbox evidence. Current history signature audit is history-audit.json; it does not replace rendered image/patient-privacy review or rights evidence. Original wallpaper provenance was unavailable; owner requested a generated replacement, recorded in release/wallpaper-provenance.json. Keep historical wallpaper/comparison captures in private backups; publish only the audited current source snapshot without old unverified media/history.

After visual/publication gates, repository creation and Pages administration need valid authorized GitHub access. Current CLI token is invalid and connector target get_repo returns 404 (not proof the repository cannot exist privately). For that later gate, reauthenticate with gh auth login --hostname github.com --web in normal Terminal; never paste tokens in chat. DNS requires the current provider's authenticated zone access/export; public lookups alone cannot back up unknown DKIM/wildcard records. Mailbox send/receive remains unverified. No website cutover is authorized by an incomplete zone snapshot.
