# Milestone 2 — Interactive 3D hero QA

Date: 2026-09-15. Starting branch: `milestone1/foundation`. Baseline: `285fbfa` (Milestone 1.1), following `5d320f7` (Milestone 1). The starting working tree was clean. Implementation branch: `milestone2/interactive-3d-hero`.

## Result and scope

PASS. A real React Three Fiber scene replaces the temporary CSS hero enhancement. The approved hero name, positioning, supporting text, availability and four CTA destinations remain unchanged.

All existing sections, project/profile/content records, navigation, global styles, section styles and design tokens are unchanged from the baseline. The only shared entry-point change imports a hero-scoped stylesheet. No fictional project, unsupported technology or new project claim was introduced.

## Scene implementation

- Central identity: three layered beveled graphite plates, a custom extruded A shape with a cutout, thin edge highlight and cyan sphere. No image or font asset is used.
- Orbits: three subtle 96-point elliptical line loops with separate tilt angles.
- Nodes: four matching dimensional chips, O / AI / P / K, referencing OpsCheck Flow, AI Operations Automation Hub, PasaWise CSE and Kivo through the existing project data.
- Motion: bounded frame deltas; central float amplitude 0.065 scene units; gentle rotation; orbit speeds 0.035–0.052 radians/second. Mobile scales core motion to 45% and node speeds to 65%.
- Pointer: damped rotation within 0.075 radians vertically and 0.12 horizontally. Fine pointers only; no camera chasing or touch parallax.
- Hover: node scales toward 1.12, slightly strengthens its cyan accent and slows to 35% of normal orbit speed. A crosshair is decorative; nodes do not navigate. Hover clears on pause or loss of fine-pointer mode.
- Lighting: ambient, key, fill and a modest cyan point accent. No shadows or postprocessing.
- Camera: perspective, 40-degree field of view; aspect-aware distance keeps the scene inside its available area.

`HeroVisualBoundary` retains the original HTML/visual split. `HeroScene`, `SceneCanvas`, `AerolCore`, `OrbitSystem`, `ProjectNode`, `SceneLighting`, `SceneFallback`, `SceneErrorBoundary`, geometry and typed node/configuration helpers isolate the enhancement.

A controlled R3F root catches asynchronous initialization rejection. It creates a fresh canvas per mount so React StrictMode cleanup cannot dispose a replacement canvas. Only the Three primitives used by the scene are registered. The scene owns one caught draw per frame and becomes ready after the first successful render.

## Dependencies

| Dependency | Version | Purpose |
| --- | --- | --- |
| three | 0.182.0 | Geometry, camera, materials and WebGL renderer |
| @react-three/fiber | 9.7.0 | React scene reconciliation and frame/event lifecycle |
| @react-three/drei | 10.7.8 | RoundedBox geometry |
| @types/three | 0.182.0 | Development types |

Compatibility changes: React and React DOM 19.3.0 → 19.2.8, with @types/react 19.2.18 and @types/react-dom 19.2.7. Fiber 9.7's peer range excludes React 19.3. Three and its types are pinned together to 0.182, before the Clock deprecation used by this Fiber release. No peer checks were forced or bypassed.

No postprocessing, animation or physics package was added directly or integrated. The Three type package includes Rapier transitively for addon declarations; it is neither imported by the scene nor present in the built runtime. No external models, textures, fonts, shader packages or environment assets are requested.

## Responsive and visual QA

| Width | Hero layout | 3D framing | Overlap / clipping | Horizontal overflow |
| --- | --- | --- | --- | --- |
| 1440px | Approved text left, visual right; name dominant | Approximately 565 × 500px; all four nodes visible | None; selectable copy and clear CTAs | None |
| 1024px | Existing desktop arrangement | Approximately 451 × 420px; comfortable margins | None | None |
| 768px | Existing tablet copy retained | Approximately 218 × 290px; camera recedes to fit | None | None |
| 430px | Copy and links first | 350 × 205px below the links | None; reduced motion amplitude | None |
| 390px | Copy and links first | 350 × 205px below the links | None; touch scrolling passes | None |
| 360px | Readable hierarchy and usable CTAs | 320 × 205px below the links | None; all four nodes fit | None |

The mobile visual adds 205px plus an 8px gap, keeping every primary and secondary hero link above it. The scene does not cover the header, text or controls. All six hero screenshots, pointer left/right comparisons, the static fallback and the narrow full page were visually inspected. No project label or technology chip forces horizontal scrolling.

Full-page tests cover every section, expanded project details, mobile navigation, touch targets, minimum main-body type sizes, resume placeholders and contact links. At 1440/1024/768, the screenshot region from About through the footer is pixel-identical to Milestone 1.1. Mobile lower-section widths/heights are identical after the 213px shift. Pixel comparison shows only one-channel-step project-gradient differences and a few antialiasing pixels; the content/layout is preserved.

## Accessibility and failure recovery

- Decorative container has `aria-hidden="true"`; canvas has `tabIndex=-1`. No mesh tab stops, routes or required content.
- Hero HTML, name, availability, positioning and CTA hrefs are verified independently of WebGL. Name selection works.
- Keyboard order, skip link, focus outline, mobile menu labels/expanded state, Escape restoration and native project disclosures pass.
- Reduced motion avoids both WebGL probing and the lazy scene download. The original static visual remains. Repeated live/static changes and delayed cleanup are tested.
- Missing WebGL, actual display-canvas initialization failure, thrown draw errors, React render errors and context loss restore the static visual without a page crash or lost content.
- Canvas touch-action preserves vertical scrolling and pinch zoom; the coarse-pointer surface does not capture scene interactions. A synthetic mobile touch swipe scrolls the page.
- Desktop/mobile axe scans report zero WCAG A/AA violations. Semantic section and landmark counts are unchanged. 200% text enlargement remains usable without horizontal overflow.

## Performance

The scene uses a fixed DPR of 1, including on emulated DPR-3 displays. A 1.5 cap was measured first; lowering it reduced desktop pixel fill cost without removing scene behavior. Geometry measures about 2,980 rendered triangles and 36 draw calls/frame. There are no realtime shadows, textures, environment maps, particles or postprocessing.

Production samples used Chromium's ANGLE/SwiftShader software renderer on this Windows host, with no screenshot or trace capture during sampling. These are not physical-phone or hardware-GPU benchmarks.

| Sample | Median frame interval | 95th percentile | Approximate rate |
| --- | --- | --- | --- |
| 1440px, final DPR 1 | 25.0ms | 25.6ms | 40fps |
| 390px, final DPR 1 | 17.0ms | 17.1ms | 59fps |

The earlier desktop DPR-1.5 sample measured 44.7ms median, approximately 22fps. Final sampling found zero canvas resizes during steady rendering and no external requests. Offscreen and hidden-document rendering pauses; pointer updates do not cause React rerenders.

No application errors, React warnings or Three deprecation warnings remain. Desktop software rendering emits four bounded Chromium GPU-driver ReadPixels stall warnings at startup, including without screenshots; they stop repeating. Mobile production sampling emitted none. This driver behavior and the software-only timing limit are recorded rather than suppressed.

| Built JavaScript | Minified | Gzip |
| --- | --- | --- |
| Initial application | 214.84 kB | 68.03 kB |
| Lazy HeroScene | 693.33 kB | 186.87 kB |
| Total | 908.17 kB | 254.90 kB |
| Milestone 1.1 total | 239.34 kB | 74.80 kB |
| Increase | 668.83 kB | 180.10 kB |

The initial bundle is smaller after the compatible React alignment; the optional 3D renderer accounts for the growth. CSS is 20.30 kB / 5.14 kB gzip. Vite reports its normal >500 kB chunk warning for the lazy scene. The warning is not suppressed; there are no model/font/texture downloads or unused runtime physics modules in the output.

## Automated QA

| Command | Result |
| --- | --- |
| npm test | PASS — 23 tests across 3 files |
| npm run typecheck | PASS |
| npm run test:e2e | PASS — 22 browser tests |
| npm run lint | Not applicable; no lint script exists |
| npm run build | PASS, with the documented lazy-chunk size warning |
| git diff --check | PASS |
| git diff --cached --check | PASS before commit |

Nine focused unit tests and nine browser tests were added; all 13 existing browser tests remain. The prior mobile assertion was updated to expect the new visual to be visible. Browser concurrency changed from three workers to one after concurrent WebGL browsers caused renderer contention and timeouts; the complete suite passes with normal trace retention.

## Review artifacts

Ignored local artifacts under `.qa/milestone-2/`:

- `final/hero-{width}.png`: production hero at all six widths.
- `final/pointer-left.png`, `final/pointer-right.png`: restrained pointer response.
- `final/static-1440.png`, `final/static-360.png`: reduced-motion fallback.
- `regression/closed-{width}.png`, `regression/menu-{width}.png`, `regression/layout-{width}.json`: complete-page/navigation checks.
- `regression-comparison.json` and `regression-pixels.json`: baseline geometry and pixel comparison.
- `performance.json`: final production measurement and console/network evidence.

Ready for manual mobile screenshot review. Chromium viewport/touch emulation was used; physical devices and Safari/Firefox were not tested.

## Git and deferred scope

A new commit follows the approved Milestone 1.1 state on `milestone2/interactive-3d-hero`; prior history is preserved. Commit only after the final QA gate, then verify a clean working tree.

No push, merge or deployment. Scroll-driven multi-section camera movement, project-specific 3D storytelling, advanced scene transitions and deployment remain Milestone 3+ work.
