# JAGAU Workspace design

An independent engineering studio whose real software systems are presented through a meticulously crafted, interactive desktop workspace.

The incumbent interface is the source of visual truth: the macOS window, owner-generated wallpaper, sidebar, dock, traffic lights, Quick Look and four destinations. This is a refinement of PR #12 (`d84b396`), never a replacement world.

## Hierarchy and material

Show actual product evidence first, its workflow second, and the curated Guide as the next way to explore. Keep the native workspace shell quiet and predictable. Use existing surface, border, foreground and motion tokens. Native glass, small corner radii and system typography have a platform purpose; generic skill warnings do not prohibit them.

Use the existing self-hosted Geist for the JAGAU wordmark, native sans for controls and readable body text, and the established case-study serif emphasis. Do not add fonts merely to avoid a detector's default-font warning. Heading tracking stays around −.03em; balance wrapping. Case-study sections separate ideas without hiding the next piece of evidence behind excessive whitespace.

Product previews remain uncropped, authentic cleared assets. At mobile width give the lead preview the full content width; the other two still identify their distinct workflows. Full screenshots open through the existing Quick Look. Motion communicates hover, focus or state; no scroll effects, looping ornament or new dependencies. Keyboard feedback matches pointer feedback; reduced motion disables scaling.

## Truth and voice

Explain what a record means and how the system handles it. Prefer workbook → ledger → report, reading → correction → export, and request → crossmatch → outcome over interchangeable claims about reliability. Keep founder attribution and verified project statuses. ELAB is source-verified, in progress, with no claimed production release or fabricated screenshot.

The current public interface is English. A labeled Indonesian Studio summary is intentionally localized (`lang="id"`); this is not a claim that the whole UI has a working bilingual toggle. The curated Guide accepts visitor questions independently. AI remains disabled.

## Review acceptance

Compare exact PR #12 and this candidate at 1440×900, 768×1024 and 390×844 in light/dark. Product previews must grow observably; native shell geometry and functions must remain stable. Inspect real screenshots, including cases, gallery hover, Quick Look, navigation and Guide. Run Chromium/WebKit, WCAG, unit, lint, build, typecheck, static and original-asset gates. Owner decisions stay pending until actually recorded. No merge or deployment in this milestone.
