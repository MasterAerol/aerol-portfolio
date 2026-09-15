# Milestone 3 — Interactive project storytelling

Date: 2026-09-15. Baseline: `5127c0e` on `milestone2/interactive-3d-hero`. Implementation branch: `milestone3/project-storytelling`.

## Baseline gate

The working tree was clean before changes. The requested dependency inspection, 23 baseline unit tests, typecheck, production build, whitespace check, and Git status all passed before the new branch or implementation.

| Dependency | Version |
| --- | --- |
| React / React DOM | 19.2.8 / 19.2.8 |
| Three | 0.182.0 |
| React Three Fiber | 9.7.0 |
| Drei | 10.7.8 |

Exactly one usable React version is installed, React DOM matches, and npm reports no invalid packages, unmet peers, or ERESOLVE state. The existing unused stats-gl transitive Three 0.170.0 remains in Drei's dependency tree. No package or lockfile change was needed.

## Implementation

Selected Work now contains four named case-study articles with alternating desktop text/visual columns. Each shows its purpose, implemented capabilities, technology list, validation, and only supplied links. At widths below 1024px, the layout stacks; mobile order is introduction → visual → capabilities → technologies → proof.

A reusable `ProjectStory` reads the central `Project` model. The model adds a discriminated visual union, narratives, selectable nodes/stages/layers, and structured proof. Counts are defined once and reused for accessible summaries and displayed metrics.

The four diagrams share graphite surfaces, cyan selected states, monospace labels, thin connectors, native buttons, and an HTML explanation panel. They use different structures:

- **OpsCheck Flow:** selectable review/recovery paths. The review diagram covers event, idempotency, queue, claim, workflow, parallel quality/change workers, verifier, briefing, and human approval. Split/join connectors distinguish parallel work from the explicitly labeled revise-or-complete decision. Recovery covers worker, lease/heartbeat, failure, retry/backoff, dead letter, and replay.
- **AI Operations Automation Hub:** selectable Workspace, Data, and Automation layers. Workspace shows requests/review/tasks/activity; Data shows the Supabase Auth/PostgreSQL/RLS foundation; Automation shows n8n/Google Sheets. Plus connectors represent complementary layers rather than invented processing steps.
- **PasaWise CSE:** four clockwise study stages, Learn → Practice → Measure → Recover, with a return to continued learning. Selecting a stage reveals its supplied features. Smart Recovery is not described as generative AI.
- **Kivo:** an abstract, explicitly labeled system diagram of Today, PETSA, SAAN KO, Search, and Add around the life-organizer core, followed by information categories. It contains no screenshot, phone status bar, invented records, or simulated live product data.

The old ProjectCard component is removed. Core narratives, capabilities, technologies, and proof remain visible. Small native disclosures contain validation notes only.

## Claims and proof

All project content follows the supplied Milestone 3 brief. There are no invented customers, usage numbers, revenue, productivity gains, launch claims, AI processing, or integrations.

OpsCheck prominently displays **227 tests, 225 passed, 0 failed, 2 intentional Windows symlink skips**. CI lists Ubuntu Python 3.10/3.12/3.14 and Windows Python 3.12. Open Source category, Released v0.1.0 status, and the supplied repository/release links remain.

Hub retains the Operations Automation / Workflow Systems category and exactly the supplied technology list. Hub and PasaWise release status/links stay unspecified.

PasaWise technologies now list Cloudflare D1 and SQL separately. Its story covers the CSE study/recovery loop; no CE functionality or AI recommendations are claimed.

Kivo remains **Private Alpha**, with **596 automated tests** and Android/Capacitor technologies. APK builds, offline/local-first behavior, responsive layouts, and automated QA are implementation evidence. No pass count, public store availability, framework, backend, bank integration, or future AI feature is inferred.

The stricter brief supersedes older displayed details: Kivo's package identifier and OpsCheck's deterministic verification/atomic-claim/stale-token-fencing specifics are omitted. OpsCheck's total is described as tests total, not tests executed. General ChatGPT/Codex development-tool references elsewhere are preserved.

Rendered technology tests reject OpenAI API, Docker, Resend, AWS, and Kubernetes. Other content/links are checked against the supplied data.

## Accessibility and motion

All interactive controls are native buttons with selected state via `aria-pressed`, valid `aria-controls`, visible 2px focus outlines, and at least 44px target height. Enter/Space, real mobile taps, and all selectable diagram states are covered. Information does not depend on hovering. Updated explanations use polite live HTML panels.

SVG connectors are `aria-hidden` and non-focusable. Project articles/figures are named; the original ten page regions and landmark structure remain intact.

IntersectionObserver triggers a restrained 480ms entrance once per article. Content is visible even before observation or when the observer is unavailable. There is no continuous project animation, scroll pinning, or new scroll choreography. Reduced motion disables entrance movement and transitions immediately, with all diagrams and controls retained. Tests verify one-time activation and reduced-motion behavior.

## Responsive and regression QA

| Width | Layout and diagram result |
| --- | --- |
| 1440px | Alternating case studies; balanced text/visual columns; all selection states fit |
| 1024px | Alternating columns retained; long labels wrap |
| 768px | Single-column story/visual flow; capabilities and technologies use available tablet space |
| 430px | Ordered mobile stack; clear diagram controls and wrapped labels |
| 390px | Ordered mobile stack; touch interactions and all diagram states pass |
| 360px | Readable narrow layout; all diagram states and long technology names fit |

All six widths have no horizontal overflow, clipped project text, or control overlap. Browser tests cover all paths/layers/stages/concepts and the required mobile ordering. 200% text enlargement remains usable.

Milestone 2 hero source, pointer behavior, fallback logic, scene styles, header/navigation, About, Capabilities, How I Work, Skills, Opportunities, Resume, Education, Contact, existing global styles, and tokens are unchanged. The existing nine hero browser tests and all page regression tests remain. Desktop/mobile axe audits report zero tested WCAG A/AA violations. Resume placeholders remain disabled; no download links were added.

Final production screenshots were visually reviewed across all six widths, including each distinct diagram. Visual QA uses Chromium on Windows, including viewport and touch emulation. Physical devices and Safari/Firefox are not claimed as tested.

## Performance

No additional WebGL canvas, runtime dependency, image/video asset, font download, or animation library was added. Project interaction uses local React state and HTML/CSS/SVG. The hero remains the only WebGL experience. Production inspection recorded no application errors or external asset requests. Chromium emitted four bounded, existing SwiftShader ReadPixels GPU-driver warnings and then stopped; no repeated application warnings were observed.

| Production asset | Minified | Gzip |
| --- | --- | --- |
| Initial application JavaScript | 227.48 kB | 71.30 kB |
| HeroScene JavaScript | 693.33 kB | 186.87 kB |
| CSS | 29.64 kB | 7.24 kB |

Compared with Milestone 2, initial JavaScript increases about 12.64 kB / 3.27 kB gzip; CSS increases about 9.34 kB / 2.10 kB gzip. The hero chunk size is unchanged. Vite's existing >500 kB lazy-hero warning remains; it is not suppressed.

## Automated QA

- `npm test`: 31 unit/content tests across four files.
- `npm run typecheck`: passes.
- `npm run test:e2e`: 31 browser tests, including nine new project-story checks.
- `npm run build`: passes with the previously documented hero chunk-size warning.
- `npm ls react react-dom three @react-three/fiber @react-three/drei`: healthy.
- `git diff --check` and staged whitespace check: passes.
- Lint: no lint script is configured.

Existing card-specific assertions were updated to validate the new visible stories and stronger proof structure. Existing hero tests were not changed. No coverage was removed to conceal a failure.

## Review artifacts and scope

Ignored local artifacts are under `.qa/milestone-3/`: first and final project screenshots at six widths, full-page regression/menu images, alternate-state and reduced-motion captures, and layout/console inspection records.

This work stays local. No push, merge, or deployment is part of the milestone. Project galleries, downloadable resumes, advanced scroll-driven 3D, deployment, analytics, a backend contact form, and a custom domain remain deferred.
