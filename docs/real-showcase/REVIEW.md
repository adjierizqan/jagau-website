# Real JAGAU showcase — review in progress

This direction supersedes the reconstructed-film acceptance in `docs/cinematic/`.
The original films and editable sources remain an archived experiment. No primary
website route loads them. Owner approval and production release remain pending.

## Observable acceptance

- Existing Home, Projects, Studio and Ask destinations work through real navigation.
- All four canonical project pages, legacy `/work/[slug]` entries, Quick Look,
  command palette, theme, mobile menu, curated Guide and history remain usable.
- The homepage viewer uses only the existing cleared `/projects/` assets; project
  selection changes the screenshot, caption, case destination and Guide question.
- Pointer perspective and finite screen/content transitions play in the browser.
  Keyboard users can perform the same selection. Reduced motion is still.
- Desktop 1440×900, tablet 768×1024, mobile 390×844, light/dark, Chromium/WebKit.
- No overflow, unintended video requests, continuous background render loop or
  screenshot masquerading as a working product control.
- All gates and a separate HTTPS preview must match the proposed source revision.
- New application screenshots require a successfully running isolated demo and
  inspected output. Preparing a database is not evidence of successful UI capture.

## Creative direction

A workspace for inspecting the working record. A quiet native shell supports
larger authentic product evidence, an independently usable conversation and a
more deliberate rhythm of full-width and paired project presentations. Studio
explains three actual engineering decisions rather than a generic services grid.

Browser-inspected references: [Active Theory](https://v5.activetheory.net/) for
spatial hierarchy and an unmistakable central focus; [Resn](https://www.resn.co.nz/)
for restraint around an interactive focal point. Neither site's scenery or
artwork is reused. [Siteinspire](https://www.siteinspire.com/) and
[Awwwards](https://www.awwwards.com/sites/self-aware) inform comparison, not a
claim of comparable awards or quality. Godly's research fetch returned an error.

Motion uses the already reviewed Motion dependency for responsive springs and
finite transitions, plus browser-native Web Animations/IntersectionObserver for
real page copy. [Reduced-motion guidance](https://motion.dev/docs/react-accessibility)
is applied. No new dependency, paid purchase, 3D engine or rendering service.

## First live critique / revision

The initial preview exposed CSS ordering conflicts: Studio's old three-column
list combined with new row layouts, compressing text into narrow columns. The
art-direction selectors are now scoped above those component rules. The home
heading and controls also need that consistent precedence. The real Projects
index—not the retained, unreachable legacy Work component—is the primary gallery.

## Local application discovery

Only code/instructions were inspected. Existing environment files and database
contents were not used. No original application source was modified.

| Application | Local source revision | Readiness / evidence |
|---|---|---|
| SuhuLog | dced8407158ac2d200661758a07ec6075dea9988 | Express/EJS/SQLite. Installed dependencies. Fresh isolated demo generated with actual repositories: 2 points, 36 readings, 1 correction; integrity OK, zero FK violations. No new browser capture yet. |
| LabStock | c2dab5aa8f820ce2a8430dbca95f12758eab5e83 | Next/PostgreSQL. Existing guarded synthetic seed found. Main local DB documented as containing real records: not opened. Fresh isolated service not started. |
| ELAB | a2f15ef8bfdbb932b2653f0a4284822dc96647b2 | Next/PostgreSQL, separate owner/app/worker roles. Existing marked E2E database workflow and synthetic seed found. No new capture or public-release claim. |
| Toko Naka | 199aeae3a7d12477850c0b6fb5d194142b4ccd6b | Actual Bun/SQLite backend exists despite stale template instructions. Fresh explicit demo DB with 10 sample items; integrity OK, zero FK violations. No transactions or UI capture claimed. |
| BDRS current | 6ffa5bc56510a2d511adc3f4710f6bb59422d649 | Laravel/React. Disposable SQLite E2E runner exists. This copy lacks node_modules; several other release copies exist. No authoritative patient database opened. |

Local server/browser execution previously failed with `listen EPERM 127.0.0.1:4190`.
Repository AGENTS.md explicitly forbids retrying that restriction and directs
website browser checks to authorized Ubuntu CI. Private application source is
not uploaded to the public JAGAU repository to circumvent that boundary. Demo
DBs and temporary credentials stay local under ignored artifacts. Existing 40
cleared public images remain byte-identical; the 14 denied payloads stay excluded.

## Release status

HOLD: new local-app captures and complete visual acceptance are not yet achieved.
The live preview is a review build, not production approval. The previous audit
reported five high-severity development dependency nodes in the braces chain;
current runtime and full audits must be attached before recommending release.
