# Spatial motion experiment

Baseline: PR #13, `6e9eda4e1e525542df334e7d0cbb9c776458d5b1`.
Experiment: `experiment/spatial-motion`, draft PR #14. Production and baseline stay untouched.

## Acceptance fixed before implementation

- Compare two real LabStock prototype treatments at `/motion-study/`, with playback recording and changing browser transform samples, before selecting one.
- Keep Workspace shell, navigation, Guide, project facts, screenshot bytes and Quick Look behavior.
- Apply selected vocabulary to Home previews, Selected Work, LabStock/SuhuLog/BDRS evidence, navigation/opening, and Studio only where hierarchy benefits.
- No simulated screenshot controls, repeating ornamental movement, scroll hijacking or hidden content pending JS.
- Keyboard has equivalent presentation feedback; reduced motion cancels runtime effects and static evidence stays visible.
- Verify desktop/tablet/mobile, both themes, Chromium/WebKit, loading, idle animations, and meaningful performance measurements.
- Existing unit, lint, typecheck, build, static and exact-asset gates must pass. Owner acceptance remains pending.

## Tool decision, 2026-10-10

Reviewed official documentation:
- Motion React: https://motion.dev/docs/react — declarative presence, layout, gestures and hybrid native animation; valuable for a larger stateful choreography, but unnecessary for finite transforms here.
- Motion AI Kit: https://motion.dev/docs/ai-kit — free docs/skill context; premium audit/example/transition features require Motion+. No Motion MCP callable in this session. No paid features or installer executed.
- GSAP: https://gsap.com/resources/React/ — powerful timelines with React cleanup; not needed for this limited sequence vocabulary.
- Remotion: https://www.remotion.dev/docs/player — useful for frame-based video compositions. No authentic interaction recording supplied; do not fabricate one from stills.
- Native WAAPI: https://developer.mozilla.org/en-US/docs/Web/API/Element/animate — finite, cancellable compositor transforms and opacity, with CSS static fallbacks.

Selected CSS + WAAPI. No new dependencies, network runtime or license/security surface. Existing package lock unchanged. This implements the latest user-authorized experiment despite DESIGN.md's earlier no-new-motion boundary.

## Environment

Local export has no Git metadata. GitHub connector verifies branch SHA and performs isolated commits. Shell GitHub access fails with `error connecting to api.github.com`.
Project AGENTS.md records blocked macOS sandbox browser execution and explicitly instructs CI use without retrying the restriction. Browser QA runs on authorized Ubuntu Actions.
Shell defaults to Node 16; checks use installed Node 22.23.1. First lint found prototype root anchor; corrected to Next Link. An initial check mistakenly ran in the parent export, which includes unrelated artifact trees; all subsequent checks use the isolated experiment directory.

## Results

Prototype source local gates: 41 unit tests, lint, production build, typecheck, 12 static groups and 40 exact image hashes PASS.
Browser playback, visual selection, final integration and performance: PENDING.
