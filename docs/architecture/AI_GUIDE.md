# Real AI Guide — issue #2 / C

Implementation candidate, BLOCKED for real-model/live acceptance. Stacked on the
source inventory PR so case studies and retrieval share versioned public facts.
No Worker, Pages build or endpoint has been deployed or activated.

The existing static workspace calls a separately configured HTTPS `/ask` Worker
only when the visitor opts in. Empty endpoint or unchecked consent uses the
existing deterministic explorer with an explicit curated label. Model replies
are labeled AI-generated with canonical project references and an uncertainty
notice. Failure, unavailable quota/provider or unsafe request produces a correctly
labeled local fallback. Stop aborts the request and stale replies cannot overwrite
a newer turn. No client secret or raw question logging is introduced.

Worker: mandatory exact HTTPS origin allowlist; POST/JSON/path/context validation;
3 KB input, 800-character question, 1600-character answer/20 KB provider envelope;
10-second request/model deadline; sensitive/prompt-injection guards; no tools,
history, database, private hosts or arbitrary retrieval. Model-generated URLs/HTML
and references outside retrieved records are rejected. React renders plain text.
These guards reduce risk; they cannot prove that every model claim is truthful.
Real-model adversarial and grounding evaluation remains a required activation gate.

Before inference, mandatory rate limiter and a single SQLite Durable Object
atomically reserve a global daily request/unit budget. No per-isolate counters,
optional-limit fail-open, refunds after timeout or paid-plan switch. Hard caps:
30 requests/day, 100000 conservative input/output units/day, 5 requests/minute per
HMAC-hashed visitor. Raw IP/question is not stored; UTC-day aggregate/hashed
counters replace prior-day state. Missing storage/limiter fails closed. Reservations
include UTF-8 prompt/question bytes plus chat-overhead allowance and maximum output.
Budget storage is independently tested for simultaneous requests; Cloudflare runtime
semantics and actual account usage still need live verification.

Proposed provider/model for owner review: Cloudflare Workers AI,
`@cf/meta/llama-3.1-8b-instruct-fp8-fast`. [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/)
documents 10000 free neurons/day and this model's token/neurons pricing. [SQLite
Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/)
allows SQLite objects on Free. This is a proposal, not proof of account tier/quota;
do not enable a paid account or purchase credits. Reservations are application
limits, not a promise about shared-account billing. Verify Free plan and remaining
quota before any authorized test. Read [provider data usage](https://developers.cloudflare.com/workers-ai/platform/data-usage/)
and approve the visitor privacy wording before activation.

Worker-only secrets: CLOUDFLARE_ACCOUNT_ID, AI_API_TOKEN with inference-only scope,
ABUSE_SALT. Frontend receives only NEXT_PUBLIC_JAGAU_GUIDE_ENDPOINT; CSP permits
its exact origin. wrangler config defaults ENABLED=false and
OWNER_APPROVED_FREE_PLAN=false, no public workers.dev endpoint and no logs.
There is no automatic deployment workflow. No credentials or quota were inferred
from the personal portfolio account.

Acceptance before activation: owner approval of provider/limits/privacy, authorized
free account and isolated test endpoint; real non-mocked question/answer, references,
quota exhaustion, timeout/abort, CORS, privacy and grounding evidence; browser tests
of opt-in, model labels and fallback; explicit separate release authorization.
Contract tests using mock transport do not satisfy real inference acceptance.
Current production remains curated and unchanged. Rollback removes endpoint from
the frontend configuration and disables Worker inference, retaining local explorer.
