# Milestone 4 — Proof, recruiter readiness and project presentation

> Current status: the portfolio is deployed at [the verified production URL](https://aerol-portfolio.master-course.workers.dev/), now used by canonical, Open Graph URL and Person URL metadata. Deployment/metadata deferrals below describe this historical milestone, not current availability. No published v1.0.0 GitHub Release is claimed.

Date: 2026-09-15. Baseline: `c95bc0c` on `milestone3/project-storytelling`. Implementation branch: `milestone4/recruiter-proof`.

## Baseline gate

Before any implementation or branch changes, the working tree was clean and all requested checks passed: dependency inspection, 31 unit tests, typecheck, production build, and `git diff --check`.

React and React DOM are both 19.2.8, with one usable React version. Three is 0.182.0, Fiber 9.7.0, and Drei 10.7.8. There are no invalid dependencies, unmet peers, or ERESOLVE state. The existing unused stats-gl transitive Three 0.170.0 remains unchanged. No package or lockfile changes were needed.

## Proof and status

The central project model now carries typed status treatment, evidence labels, evidence notes, and check-group labels. Reusable `ProjectProof`, `ProjectStatus`, and `ProjectLinks` components render those facts. Compact proof remains part of each case study, with a visible release/built/alpha status and separate QA label; meaning never depends only on color.

- **OpsCheck Flow:** Released — v0.1.0; 227 tests, 225 passed, 0 failed, 2 intentional Windows symlink skips. Four CI environments: Ubuntu / Python 3.10, 3.12, 3.14, and Windows / Python 3.12. The two supplied URLs use “View Repository” and “View v0.1.0 Release.” The visible evidence note says “Open-source release with cross-platform automated validation.”
- **AI Operations Automation Hub:** Built / Workflow Prototype. The existing workspace, data/access, and external automation layers remain interactive; automated and browser testing are shown without an invented count. No public URL is supplied.
- **PasaWise CSE:** Built / Web Application. Existing capabilities cover authentication/access control, dashboard, curriculum, lessons, practice, subject/full-mock assessments, Smart Recovery, progress/weak areas, responsive UI, and testing. No users, pass rates, CE functionality, or public URL are inferred.
- **Kivo:** Private Alpha with visible In Development. Its 596 automated tests remain a supplied test count, not a new pass-count claim. Android, Capacitor, APK builds, offline/local-first behavior, responsive layouts, and automated QA remain the implementation evidence. No public URL is supplied.

All external project links open normally in the same tab, consistently with the existing portfolio, with meaningful project-specific accessible names and decorative external-arrow icons. Missing URLs produce no CTA. Proof notes describe the supplied evidence; the underlying project repositories were not retested as part of this portfolio milestone.

No OpenAI API, Docker, Resend, AWS, Kubernetes, Stripe, fabricated AI features, customers, employment, revenue, usage statistics, launch claims, or unverified integrations were added.

## Asset, resume and certification audit

The repository contains no approved real product screenshots and no approved resume PDFs. Ignored `.qa/` images are screenshots of this portfolio and are not product evidence. The only production asset is the existing lightweight `public/favicon.svg`.

No media gallery, fake screenshot, placeholder media, missing-file link, PDF, video, or generated preview image was added. Both resume cards retain disabled “Resume being prepared” buttons with descriptive unavailable-state text. A concise on-page summary shows Focus and Selected Project Experience, using the four central project names. Personal projects are not presented as paid employment.

No DICT/training/Udemy evidence already exists in verified portfolio data, so the brief's conditional certification addition is omitted. The existing Education section remains unchanged.

## Contact and metadata

The verified email and GitHub profile remain visible and unchanged. A native Copy email button uses the Clipboard API. It announces success through a polite status region; absent or rejected clipboard access yields a short non-blocking explanation while the selectable address and mailto link remain usable. There is no alert, LinkedIn profile, or backend form.

The document title and description exactly match the brief. Open Graph and Twitter summary metadata use the same professional identity. Person JSON-LD contains only the supplied name, GitHub sameAs, and approved general knowsAbout areas. No employer, job title, social handle, production domain, canonical, og:url, or image URL is fabricated. A head comment documents adding the canonical and absolute social URLs together once the production origin and asset exist.

The existing original A + cyan-dot SVG favicon is retained and checked. Actual OG image creation remains deferred.

## Accessibility and responsive QA

Native headings, links, buttons and disclosures remain. Status and evidence labels use visible words. Project SVG connectors and the decorative hero canvas stay hidden from assistive navigation. Keyboard focus remains visible; copy/project link targets are at least 44px high. Reduced-motion handling and the mobile menu are unchanged.

The six requested viewport widths are covered: 1440, 1024, 768, 430, 390, and 360px. Focused checks cover proof metrics, long CI/technology labels, status badges, public CTAs, resume cards, contact email, and opportunity rows. All existing story interaction, full-page layout, 200% text enlargement, axe, mobile menu, and hero tests are retained.

All 40 browser tests pass. Production screenshots were visually reviewed across all six widths, including proof, Resume, Contact, and clipboard-failure feedback. Production measurements found no clipped text or horizontal overflow at any width; exactly one hero canvas remains in normal-motion mode. Desktop/mobile axe audits report zero tested WCAG A/AA violations. Unknown-path refresh and invalid anchors preserve all four projects and hero HTML.

QA uses Chromium on Windows, including viewport/touch emulation. Physical devices and Safari/Firefox are not claimed as tested. Single-page unknown paths and invalid anchors use the existing static/SPA fallback; no router was added.

## Performance

No new runtime dependency or WebGL canvas. No new media/font/video download. The only WebGL scene remains the unchanged hero.

| Production asset | Minified | Gzip |
| --- | --- | --- |
| Initial application JavaScript | 229.83 kB | 71.90 kB |
| HeroScene JavaScript | 693.33 kB | 186.87 kB |
| CSS | 31.82 kB | 7.65 kB |

Compared with Milestone 3, initial JS grows 2.35 kB / 0.60 kB gzip; CSS grows 2.18 kB / 0.41 kB gzip. The hero chunk size remains unchanged.

Vite's existing lazy-hero chunk-size warning remains. Vitest prints its existing environment-performance suggestion, and Playwright prints the environment's NO_COLOR/FORCE_COLOR warning. No errors are suppressed.

Production console/asset inspection reports no application errors and no external asset requests. Four bounded, existing Chromium SwiftShader ReadPixels GPU-driver warnings were emitted, ending with the driver's no-further-repetition notice. No new application warning or repeated error was observed.

## Automated QA

- `npm test`: 39 tests across five files pass.
- `npm run typecheck`: passes.
- `npm run build`: passes with the existing hero chunk-size warning.
- `npm run test:e2e`: all 40 browser tests pass (3.9 minutes).
- `git diff --check`: passes, including staged whitespace checks before commit.
- `npm ls react react-dom three @react-three/fiber @react-three/drei`: baseline and final dependency checks pass.
- Lint: no script configured.

Eight focused unit tests and nine browser tests cover proof/status/links, unavailable assets/resumes, project-experience labeling, exact metadata/JSON-LD/favicon, clipboard success and failure, narrow-screen usability, and unknown-path refresh. Existing assertions were updated only for the newly approved status/CTA wording, CI separators, and exact meta description. No prior test coverage was removed.

## Scope and review artifacts

Hero source/styles, project diagram logic, header, About, Capabilities, How I Work, Skills, Opportunities, Education, existing shared styles, dependencies, and lockfile remain unchanged. The only production changes concern proof/status presentation, Resume summary, Contact copy action, and metadata.

Ignored local screenshots, measurements, and console records are under `.qa/milestone-4/`. This milestone stays local: no push, merge, or deployment.

Deferred: approved final resume PDFs; real screenshot galleries; backend contact form; analytics; deployment; custom domain; advanced scroll-driven 3D transitions.
