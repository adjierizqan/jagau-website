# RC B — Cloudflare activation gates (10 October 2026)

Status: BLOCKED. Owner approved proposed Cloudflare/Llama limits and public grounding. No account credential, authenticated quota response or genuine inference evidence is available. Local credential presence checks returned false without printing values; no provider administration/inference connector is available. No activation, paid plan, purchase or deployment occurred.

Verified public requirements:
- [Workers AI pricing](https://developers.cloudflare.com/workers-ai/platform/pricing/): 10,000 free neurons/day, UTC reset; Free fails beyond allocation. Chosen @cf/meta/llama-3.1-8b-instruct-fp8-fast is listed at 4,119 input and 34,868 output neurons per million tokens. Other account workloads consume the same allocation. Published limits do not prove this account's plan or remaining quota.
- [Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/): SQLite-backed objects are available on Free; excess limits fail. Check actual shared account request/storage use before testing. Do not create resources in this review task.
- [Provider data terms](https://developers.cloudflare.com/workers-ai/platform/data-usage/): model licences apply; Cloudflare processes customer content and states it does not train/improve services with it absent consent. [Meta Llama 3.1 licence](https://github.com/meta-llama/llama-models/blob/main/models/llama3_1/LICENSE) was inspected: review applicable use-policy, redistribution/notice and attribution obligations (including Built with Llama when applicable) before activation. This review does not distribute model weights or activate inference. No claim of zero retention is inferred.

Required account evidence, provided through an approved account connection/secrets mechanism, never chat or public logs:
1. Account identity and confirmed Workers Free plan; authenticated AI usage/remaining daily neurons and relevant shared DO usage, timestamped. Keep identifiers/tokens private; publish only redacted status.
2. Inference-only token scoped to approved account and existing authorized nonproduction endpoint if present. No deployment is allowed by this task. If no endpoint exists, raw REST inference can test the model only, not the complete deployed Worker boundary; keep that limitation explicit.
3. Real public-only questions: ELAB status, ledger history, temperature audit, BDRS correction state and studio identity. Inspect actual replies, project references and uncertainty. Adversarial/private-input rejection, abort, unavailable-provider and CORS/budget behavior require a separately authorized real Worker boundary.
4. Exact model/licence, provider privacy wording, fresh quota before/after, bounded responses and no raw question/IP/secrets logs. Do not switch to a paid model/plan or infer quota from application request limits.
5. Obtain genuine endpoint browser evidence in all three viewports/themes. Fixture responses and disabled dry-run bundles do not satisfy this gate.

Current controls: endpoint empty, consent unchecked, Worker ENABLED=false and OWNER_APPROVED_FREE_PLAN=false, logs disabled. Daily app reservations of 30 requests/100,000 conservative units are independently tested; they are not neuron or billing guarantees. Existing local curated answers remain available.

RC B also requires trusted exact-payload clearance for the 14 selected replacement images, integration tests and actual visual review. Automatic approval denied their public upload; neither direct nor indirect alternative routes are permitted. Forty cleared originals stay in RC A.

Release authorization remains separate: owner reviews the candidate; no merge/deploy/DNS/email change here. Future rollback (only if separately deployed): remove optional frontend endpoint and disable Worker, restoring curated fallback; restore the exact cleared original asset references. Today rollback is simply declining the unmerged review branch.
