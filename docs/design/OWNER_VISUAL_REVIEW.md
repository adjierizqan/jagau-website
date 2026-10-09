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

Current status: implementation ready for combined CI/render review; owner
approval PENDING. Final runtime evidence and local dashboard location will be
recorded after actual screenshot inspection. Revert/discard this review branch
to return to the unchanged PR #11 foundation. Production is unaffected.
