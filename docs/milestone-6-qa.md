# Milestone 6 — Production hardening and final QA

> Current status: the portfolio is deployed at [the verified production URL](https://aerol-portfolio.master-course.workers.dev/), now used by canonical, Open Graph URL and Person URL metadata. Deployment/metadata deferrals below describe this historical milestone, not current availability. No published v1.0.0 GitHub Release is claimed.

Date: 2026-09-15. Starting branch: `milestone5/dual-resume`, commit `6548855`. Working branch: `milestone6/production-hardening`.

## Baseline gate

Before any repository changes: clean working tree; 46 unit tests passed; typecheck, build and `git diff --check` passed. React and React DOM are both 19.2.8; Three 0.182.0; Fiber 9.7.0; Drei 10.7.8. One valid React version, no invalid dependencies or unmet peers. No lint script exists.

The existing unused Drei → stats-gl dependency includes Three 0.170.0; the application uses 0.182.0 and does not import stats-gl. No dependency or lockfile update was warranted.

## Changes made

- Added a 1rem bottom scroll inset. Sequential keyboard navigation at 390px previously put some OpsCheck controls against the bottom edge, clipping their focus outlines. The inset keeps the full outline visible without changing section layout. Existing top clearance already protects focus from the sticky header.
- Extended the shared browser matrix to 1920, 1440, 1280, 1024, 768, 430, 412, 390, 375 and 360px.
- Added explicit published-content guardrails, full sequential project keyboard checks, menu destination/reverse navigation, repeated live-canvas resizing, and route/metadata/link/asset/console checks.
- Added `npm run test:e2e:production`. It builds and runs the same complete browser suite against the local static production preview on port 4173.
- Documented future Workers Static Assets routing. No hosting configuration or backend was introduced.

No project facts, resume content, hero geometry, animation, layout, dependencies or branding were changed.

## Claims and personal information

The four featured projects remain in their approved order. Both resumes reuse the same project records with their approved differing presentation/order.

| Project | Verified presentation |
| --- | --- |
| OpsCheck Flow | Released — v0.1.0. Repository and release links intact. 227 tests, 225 passed, 0 failed, 2 intentional Windows symlink skips. Ubuntu Python 3.10 / 3.12 / 3.14 and Windows Python 3.12 remain explicit. |
| AI Operations Automation Hub | Operations Automation / Workflow Systems; Built / Workflow Prototype. Approved workflow, Supabase/Auth/PostgreSQL/RLS, n8n and Google Sheets implementation only. |
| PasaWise CSE | Full-Stack Product / EdTech; Built / Web Application. Approved CSE curriculum, assessment, mock-exam, Smart Recovery and QA facts; no invented outcomes or adoption. |
| Kivo — Life Organizer | Private Alpha / In Development; Android, Capacitor, APK builds, offline behavior, responsive layouts, and 596 automated tests. |

Source/content searches were manually reviewed. Before the new guardrail tests, all 11 forbidden-term occurrences were absence assertions or documentation denying unsupported claims. The new tests/report add the same kinds of negative references. No rendered portfolio or resume claims use OpenAI API, Docker, Resend, AWS, Kubernetes, Stripe, live paid models, enterprise-grade/production-proven language, customers/clients, fabricated employment or adoption. ChatGPT and Codex remain development tools.

Both resumes use Selected Project Experience and explicit Target role labels. No unfinished Civil Engineering project, public Kivo release, PasaWise exam results, or OpsCheck enterprise usage is claimed. Education and DICT training remain accurate.

## Security and privacy

A read-only heuristic scan covered 77 tracked files, 85 current text files (including the built frontend), and 123 distinct historical text blobs across all six baseline commits. Patterns covered provider keys/PATs, private-key blocks, AWS access IDs, JWTs, password/secret assignments, and credential-bearing URLs. Zero matches.

No .env, .dev.vars, .npmrc, .netrc or private-key files were found in the workspace (including ignored QA locations) or Git history. Third-party node_modules and binary QA media were excluded; this is not a guarantee against every possible secret format.

Public personal information remains limited to approved name, email, GitHub, education and completed training. No private phone, street address, government ID or private account identifier is exposed.

## Accessibility and keyboard

Semantic header/nav/main/footer and heading hierarchy remain intact. Links/buttons/disclosures have names; diagram controls expose pressed state and controlled panels; the mobile menu exposes expanded state and its navigation target. Status text is visible independently of color. Decorative SVG and WebGL content has no keyboard stops and is hidden from assistive technology.

The skip link becomes visible on focus and moves focus to main. Actual sequential Tab navigation covers both OpsCheck paths, every project diagram, repository/release links, disclosures, opportunities and resume cards. Enter/Space activate controls. Menu selection continues at its destination; Escape and forward/reverse focus exit close it without trapping focus. Strict assertions include the complete focus outline inside the viewport.

Axe WCAG A/AA checks (including 2.1/2.2 tags) reported no violations on the 1920px portfolio, open 375px menu, existing expanded 1440/390px states, and both 360px resume views. Existing 200% text checks remain. No screen-reader-device conformance claim is made.

Reduced motion retains complete content, skips the animated scene download, and disables project line/entrance transitions. Existing unavailable-WebGL, initialization, draw-failure and context-loss tests remain.

## Responsive and visual review

Actual full-page screenshots were inspected across every required width, including all ten portfolio sections, header/footer, each project diagram/proof block, five mobile menu states, and both resume views. Selected-state variations and expanded disclosures are exercised by the browser suite.

| Width | Layout / navigation / readability / visuals | Horizontal overflow / clipped text |
| --- | --- | --- |
| 1920 | PASS; bounded content and balanced hero | None |
| 1440 | PASS; approved desktop layout retained | None |
| 1280 | PASS; balanced scene and readable project columns | None |
| 1024 | PASS; navigation and project columns fit | None |
| 768 | PASS; diagrams reorganize cleanly, desktop navigation fits | None |
| 430 | PASS; text-first hero and stacked content | None |
| 412 | PASS; menus, cards, chips and contact fit | None |
| 390 | PASS; full-page layout and corrected keyboard focus | None |
| 375 | PASS; narrow labels and URLs wrap safely | None |
| 360 | PASS; full name, controls, chips and contact remain readable | None |

Hero supporting body copy remains 16px or larger; project body text and resume bullets stay readable. Small technical/status labels were visually checked and are not the only source of important information. GitHub Actions, Google Sheets and Row Level Security wrap safely. The mobile scene stays below the hero controls and permits vertical touch scrolling.

Testing uses Chromium on Windows with viewport/touch emulation. Physical devices, Firefox and Safari were not tested.

## Resume and print inspection

Both direct routes and trailing-slash variants render correctly, survive refresh and provide Back to Portfolio, email, GitHub and a real Print / Save as PDF button. No PDF download, missing asset or fabricated link is introduced.

Actual Chromium A4 print output was rendered through Poppler and all four resulting pages were visually inspected. Both resumes use two A4 pages with white background/margins, dark text, readable URLs and complete bullets. Page two begins with project three and finishes Skills, Education and Completed Training. No navigation, print controls, canvas, clipped bullets or blank trailing pages.

Counts apply to default A4 scale with browser headers/footers disabled. Other print settings may change pagination. After the focus fix, all four final print page images matched the visually inspected output exactly by SHA-256 hash; extracted text stayed inside the margins. Temporary QA PDFs were then removed. Rendered images and verification records remain in ignored QA storage; no final export or public PDF download was created.

## Link, metadata and asset integrity

The distinct public HTTP destinations returned 200 with no redirect:

- https://github.com/MasterAerol
- https://github.com/MasterAerol/opscheck-flow
- https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0

The release API confirms tag v0.1.0 is published, not a draft or prerelease. Email syntax and destination are verified; no message was sent and deliverability was not tested.

All internal anchors resolve. Both resume routes and return links work. Unknown routes preserve the existing portfolio fallback. No bare # placeholder, LinkedIn, fake live-project URL or PDF exists. No broken asset responses, duplicate IDs or unresolved aria-controls were found.

Title: James Aerol Ilagan — Software, Automation & Operations.

Description: Portfolio of James Aerol Ilagan showcasing software development, workflow automation, systems engineering, and digital product work.

Open Graph mirrors truthful identity/content. Person JSON-LD contains the real name, GitHub and approved knowledge areas, with no employer, organization or invented personal domain. No canonical or production URL is fabricated. The 246-byte SVG favicon loads successfully and preserves the A/cyan-dot brand.

## Performance and runtime

| Built asset | Minified | Gzip |
| --- | --- | --- |
| Initial JS | 239.76 kB | 74.17 kB |
| Lazy HeroScene JS | 693.33 kB | 186.87 kB |
| Total JS: 2 chunks | 933.09 kB | 261.04 kB |
| CSS | 36.95 kB | 8.72 kB |
| HTML | 2.25 kB | 0.87 kB |
| Favicon | 246 bytes | — |

JS size is unchanged from Milestone 5; the small scroll inset adds approximately 0.03 kB CSS. The lazy scene chunk contains Three/R3F and scene code. Resume routes and reduced-motion mode do not request it. There are no raster images, external models/textures/fonts, postprocessing, shadows, environment maps or network-loaded 3D assets.

The existing lazy boundary, fixed DPR 1, ref-based animation and offscreen/hidden-document pause remain appropriate. Repeated desktop/mobile resizing retains one canvas and causes no resize loop. An isolated software-GPU sample measured 36 draw calls and about 2,980 triangles per frame, with zero canvas resizes while stationary. At 1440px median/p95 frame intervals were 26.8/28.7ms; at 390px 17.0/17.8ms. These are local SwiftShader measurements, not physical-device or field performance results.

No uncaught errors, React/key warnings, missing asset requests or application resize warnings were observed. Chromium SwiftShader emitted GPU stall due to ReadPixels warnings during desktop inspection. Those driver warnings are recorded in QA JSON and attached when observed by the new browser tests; only that specific known warning is distinguished from application failures. No warning logging was disabled.

Existing Vite >500 kB lazy-hero warning, Vitest environment-performance notice and Playwright NO_COLOR/FORCE_COLOR notice remain visible. Chrome DevTools MCP was unavailable, so no Lighthouse score, field Core Web Vitals or DevTools trace result is claimed.

No speculative bundle restructuring or dependency upgrades were needed. A few unused legacy CSS selectors remain in the stylesheet; removing them offers negligible savings and was deferred to avoid unrelated cleanup.

## Automated results

- Unit tests: all 50 pass across seven files (8.0 seconds with browser work idle).
- Typecheck: passes.
- Production build: passes.
- Production browser suite: all 87 pass in 4.8 minutes against a fresh build.
- Lint: no script configured.
- npm ls and focused React/Three tree: baseline and final checks pass; dependencies unchanged.
- npm audit: initial and final scans report zero vulnerabilities.
- git diff --check: passes for working and staged changes.

During diagnosis, one unchanged unit assertion timed out while the unit and browser suites ran concurrently; the complete unit suite then passed without timeout or assertion changes when run alone. The expanded 375px browser case exposed floating-point coordinate noise (43.99994px for a 44px target). That size assertion now rounds to 0.001px before applying the same 44px minimum; no touch-target requirement or test coverage was removed.

## Deployment preparation

The static application is ready for a separate, authorized deployment-preparation step after the final QA gate. Future Cloudflare Workers Static Assets configuration should point assets.directory to ./dist/ and set assets.not_found_handling to single-page-application so direct resume navigation and refresh receive the app entry. This is documented guidance only; no configuration, Worker backend, account connection or deployment was created.

Reference checked 2026-09-15: [Cloudflare Workers Static Assets SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/).

After configuring the actual host, repeat deep-route/asset/link smoke checks on that host. A custom domain, canonical URL, exported final PDFs, backend contact form, analytics, and advanced scroll-driven 3D transitions remain deferred. Nothing was pushed, merged or deployed.

Review artifacts: ignored .qa/milestone-6/ contains full-page/menu screenshots, resume screenshots and print page images, layout/link/accessibility records, and performance measurements.
