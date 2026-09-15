# Milestone 5 — Dual resume experience and recruiter conversion

Date: 2026-09-15. Baseline: `041552e` on `milestone4/recruiter-proof`. Implementation branch: `milestone5/dual-resume`.

## Baseline gate

Before implementation or branching, all required checks passed: a clean working tree, dependency inspection, 39 unit tests, typecheck, production build, and whitespace check.

React/React DOM are both 19.2.8, with one usable React version. Three is 0.182.0, Fiber 9.7.0, and Drei 10.7.8. No invalid dependencies, unmet peers, or ERESOLVE state. The existing unused stats-gl transitive Three 0.170.0 is unchanged.

## Shared facts and scope

Both resumes reference the same `profile`, project objects, statuses, URLs, and evidence used by the portfolio. Track-specific project bullets live beside those project facts in `src/data/projects.ts`; summaries, order, and skills live in `src/data/resume.ts`. Numeric validation text is derived from existing evidence metrics, never copied into separate counters.

The existing Education fields move into `src/data/education.ts`, shared by the portfolio and both resumes without changing the portfolio's visible Education content. The Milestone 5 brief newly verifies completed DICT training, REST APIs for the Developer resume, and OpsCheck atomic SQLite claims, lease-token fencing, heartbeat renewal, and crash recovery. Historical milestone reports remain unchanged.

No paid employment, companies, client engagements, dates of employment, commercial experience, adoption, management history, outcomes, or unverified project URLs are introduced.

## Resume presentations

### Software / Developer

Target headline: Junior Software Developer. Focus: Software Systems · Full-Stack Projects · AI-Assisted Development.

The summary explicitly describes hands-on personal project experience, requirements and milestones, software systems/web applications, databases/authentication, testing/debugging, workflow design, Git/GitHub, and reviewed AI-assisted implementation.

Project order: OpsCheck Flow → PasaWise CSE → AI Operations Automation Hub → Kivo — Life Organizer. Bullets emphasize software construction, concurrency safeguards, application workflows, verified stack, and validation.

Skills cover the approved Programming/Web, Backend/Systems, and Automation/Engineering groups, including the newly verified REST APIs label. No ratings, percentages, expertise levels, or commercial tenure.

### AI Operations / Technical VA

Target headline: AI Operations / Technical Virtual Assistant. Focus: Workflow Automation · Technical Operations · Systems Support.

The summary explicitly starts with project-based experience. It emphasizes operational requests/tasks, process mapping, automation, controlled data access, documentation/research, QA, troubleshooting, and learning tools within project work.

Project order: AI Operations Automation Hub → OpsCheck Flow → PasaWise CSE → Kivo — Life Organizer. Bullets emphasize workflow organization, approval, recovery/reporting, product milestones, user-flow iteration, and mobile/offline QA. They do not imply administrative client employment.

### Shared proof and credentials

Both use Selected Project Experience and an explicit Target role label.

- OpsCheck: Released — v0.1.0; 227 tests, 225 passed, 0 failed, 2 intentional Windows symlink skips; supplied public repository. Deterministic workers are not described as AI agents.
- Hub: Built / Workflow Prototype; existing Supabase/Auth/PostgreSQL/RLS, n8n/Google Sheets, and automated/browser QA; no live-model or public-launch claim.
- PasaWise: Built / Web Application; CSE product breadth, no learner counts, exam outcomes, or unfinished CE project.
- Kivo: Private Alpha / In Development; 596 automated tests, with no invented pass count or public launch.
- Education: Bachelor of Science in Civil Engineering, Major in Structural Engineering, Notre Dame of Marbel University, 2021–2025.
- Completed Training: Python Programming Essentials, Department of Information and Communications Technology (DICT), 40-hour training, December 2023. No certificate ID or incomplete Udemy course is presented.

Both include the same factual AI-assisted development disclosure naming ChatGPT and Codex while retaining human responsibility for requirements, validation, and review.

## Routes and portfolio integration

`/resume/software` and `/resume/operations` render the same semantic ResumePage with different data. A small route selector handles the two known paths and trailing slashes; ordinary links load the selected view. Unknown paths preserve the prior portfolio fallback. No routing library or WebGL is needed on either resume page.

Portfolio cards now provide View Resume links and the note “Print / Save as PDF from the resume page.” No downloadable PDF, missing file, or placeholder download is claimed. Each view includes Back to Portfolio, email, GitHub, and a real Print / Save as PDF button using the browser's print dialog.

Resume titles are targeted. No production domain or canonical URL is invented. The portfolio's existing metadata remains intact.

## Screen and print design

Resume views use a conservative white document with restrained dark text, modest headings, compact sections, and a light surrounding surface. All rules are scoped to resume pages except the narrowly scoped portfolio View Resume link treatment. The original portfolio remains dark/cyan.

A named A4 page uses 15mm margins. Print rules hide navigation, the skip link, and the print control; preserve visible email/repository URLs; remove shadows and animations; and use 10.5pt body text. A deliberate break before project three keeps the two leading projects on page one and the remaining projects/skills/credentials on page two. A small continuation line provides context on page two. Project blocks and bullets avoid splitting where practical.

Initial visual print inspection caught inherited dark page margins. A resume-only light color scheme and white named-page background corrected it. The corrected output was regenerated and every page was visually inspected. All four production print page images match the reviewed development output exactly by file hash. Extracted text contains all four projects and the approved evidence/training facts; every word stays within the A4 margins.

| Browser print output | Pages | Result |
| --- | --- | --- |
| Software | 2 A4 | White page/margins, readable text and URLs, no clipping or blank pages |
| Operations | 2 A4 | White page/margins, readable text and URLs, no clipping or blank pages |

Print QA used Chromium's actual paginated print output and Poppler-rendered images, not only screen-mode CSS measurements. Temporary PDFs were removed after inspection; rendered page images and verification records remain in ignored QA storage. No final exports, public PDF assets, or linked downloads were created. Page counts apply to the tested A4/default-scale configuration with browser headers/footers disabled; user print settings may alter pagination.

## Accessibility and responsive QA

Both pages have one h1, properly ordered h2 sections/h3 projects, named semantic sections/articles, a skip link, native links/buttons, explicit target/status words, and visible focus. Accessible link names include the visible URL text. Screen controls and links meet 44px minimum height. Project body text remains 16px on mobile; skills/email/URLs wrap.

Both resumes were measured at 1440, 1024, 768, 430, 390, and 360px: zero horizontal overflow, zero clipped text, zero canvases, and no HeroScene/Three/Fiber/Drei requests. Full screenshots were reviewed across all six widths. No content relies on animation.

All 57 browser tests pass, including the existing portfolio regression suite and 17 new resume checks. Both 360px resume accessibility audits pass with no violations; keyboard navigation, visible focus, reduced motion, and 200% text enlargement pass. Production verification repeated all 12 resume viewport cases with no overflow or clipped text. Both trailing-slash routes survive refresh with correct titles and four projects; no console errors, warnings, external requests, or canvases were observed.

QA uses Chromium on Windows with viewport/touch emulation. Physical devices, Firefox, and Safari are not claimed as tested.

## Regression and performance

The existing hero, About, diagrams, proof renderer, Capabilities, How I Work, Skills, Opportunities, Contact, mobile menu, and shared visual styles remain unchanged. The Education renderer only reads the same values from shared data. Existing tests requiring unavailable HTML resumes were updated to check the newly approved real routes while preserving no-fake-PDF checks.

No runtime dependencies, images, fonts, videos, WebGL canvases, backend, analytics, or hosting changes.

| Production asset | Minified | Gzip |
| --- | --- | --- |
| Initial application JavaScript | 239.76 kB | 74.17 kB |
| HeroScene JavaScript | 693.33 kB | 186.87 kB |
| CSS | 36.92 kB | 8.72 kB |

Compared with Milestone 4, initial JS adds about 9.93 kB / 2.27 kB gzip; CSS adds 5.10 kB / 1.07 kB gzip. The hero chunk size is unchanged. Existing Vite lazy-hero chunk warning, Vitest environment-performance notice, and Playwright NO_COLOR/FORCE_COLOR notice remain unsuppressed.

## Automated QA

- Unit tests: 46 across six files pass.
- Typecheck: passes.
- Production build: passes.
- Browser tests: all 57 pass (4.6 minutes).
- Lint: no script configured.
- Dependency inspection: baseline and final checks pass; versions and lockfile unchanged.
- Whitespace check: passes; the same check is required on the staged changes before committing.

Seven new unit tests and seventeen browser tests cover routes/order/shared facts, training, truthful claims, print controls, print styles, 12 resume viewport cases, metadata titles, no WebGL requests, accessibility, 200% text, and portfolio round trips.

## Review artifacts and deferred work

Ignored `.qa/milestone-5/` contains complete resume screenshots, measurements, paginated print QA images, and portfolio regression captures. The HTML routes are the reviewable deliverables.

Final exported PDFs, backend contact form, analytics, deployment, custom domain, and advanced scroll-driven 3D transitions remain deferred. Nothing is pushed, merged, or deployed.
