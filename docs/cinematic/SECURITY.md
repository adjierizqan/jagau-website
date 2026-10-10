# Dependency audit — 2026-10-10

Source: actual npm registry audit in Ubuntu CI, original lock and cinematic lock. Reports alongside this document preserve advisory IDs, affected ranges and dependency paths.

Before: 9 affected package nodes: 1 critical (Next.js), 8 high. After Next.js + eslint-config-next 16.4.0 and refreshed lock: 0 critical, 5 high, 0 moderate, 0 low. Remotion + CLI 4.0.534 and Motion 14.1.0 introduce no additional reported findings in this audit.

Remaining: braces → micromatch → fast-glob → @next/eslint-plugin-next → eslint-config-next. These five nodes represent one underlying stack-exhaustion advisory, GHSA-vfj7-8cjw-p6xm. Official advisory lists no patched version. npm suggests downgrading eslint-config-next to 14.2.35; rejected as a major compatibility regression. No audit suppressions or forced downgrade. This chain is development lint tooling, not shipped browser JS or a server exposed by this static export. Avoid accepting untrusted glob patterns. Recheck upstream patch before a production release; this report does not approve one.

Inherited runtime advisories include Next server/proxy/actions/image features, PostCSS source-map parsing, Sharp's native dependencies and source-map-js. Static export has no live Next server/Server Actions/Image Optimization, reducing the deployed attack surface; that did not justify leaving outdated packages. Next patch/minor upgrade and regenerated lock remove those audit findings in the experiment. Production and approved branches remain unchanged.

Licenses/compatibility reviewed: Motion 14.1.0 MIT supports React 18/19; Remotion 4.0.534 supports React >=16.8, uses its own free evaluation/individual/small-company license (not MIT). This is a free evaluation prototype. No paid or deprecated MCP. Node22/React19 maintained. All Remotion packages pinned to matching version. No forced audit fix.

Official skills: `skills` installer 1.7.2 (MIT), project-local `--copy` installation in a fresh CI temp Git workspace. Four skills: remotion-best-practices/create/markup/render, version4.0.534. File list and SHA256 logged in preparation run38018613078; installation created .agents/skills and skills-lock.json. No application files or global agent configuration changed. This session reads archived official text manually; live registration in local Codex is not claimed. No Remotion MCP installed.

References: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm · https://github.com/remotion-dev/remotion/blob/main/LICENSE.md · https://www.remotion.dev/docs/ai/skills · https://motion.dev/docs/ai-kit-install
