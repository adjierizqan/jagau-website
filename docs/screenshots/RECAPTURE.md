# Authentic recapture — issue #2 / B

Status: BLOCKED for replacement screenshots; safe capture tooling and deterministic
fictional fixtures implemented. No new product image or cover is fabricated.
Stack this review independently on the inventory PR; do not merge/deploy.

The checked-in inventory records original SHA-256, provenance review reference
and keep/refresh decisions for each public bitmap. Current cleared originals stay
in place. ELAB images are excluded until publication clearance; NAKA lacks a
reviewed public case. No institutional screenshots, private documents or database
exports are copied into JAGAU or uploaded to CI.

scripts/recapture/fixtures.ts defines fictional Indonesian names, SYN identifiers,
coherent stock movements, dates and temperature readings. It does not connect to
a database. Application-specific adapters must seed a newly created isolated demo
copy of the actual authorized app, never relabel rows in an existing database.
The existing LabStock seed has a demo database guard, but it also clears tables;
it was inspected and deliberately not run against any existing database.

capture.mjs accepts a local JSON authorization/config, refuses remote hosts and
credentials, blocks nonlocal browser requests, requires a visible synthetic-data
notice and the expected fictional names, then captures the real product UI at
three viewports. It preserves originals and emits app revision, seed, dimensions,
timestamp, hash and UNREVIEWED privacy status. It never creates product HTML,
paints over images or labels fixtures as clinical results. Screens require human
privacy/licensing review before caption/cover replacement in a follow-on commit.

Remaining dependency: an authorized, newly seeded isolated runtime and confirmation
of image publication rights for each actual product. The macOS sandbox cannot
launch the browser; authorized Ubuntu capture also needs the real demo app/source,
which must not be copied from private hospital projects into a public runner/repo
without a reviewed transfer. No real recapture execution is claimed here.
No manual Terminal work is requested from the owner. After runtime/clearance access
is available, Codex can use the supplied capture tool on an authorized runner.

Rollback: drop this tooling PR. There are no replaced assets or external changes.
