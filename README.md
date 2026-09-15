# Aerol Portfolio

Personal portfolio of James Aerol Ilagan showcasing software development, workflow automation, systems projects, and digital product work.

## Overview

AEROL. combines an accessible, responsive portfolio with a restrained 3D identity scene, four interactive project case studies, and two targeted HTML resumes. Important content stays in ordinary HTML. The site uses the same shared project facts across the portfolio and resumes.

Release preparation targets `MasterAerol/aerol-portfolio` on GitHub and Cloudflare Workers Static Assets. No production URL, hosted CI result, or published v1.0.0 release is claimed yet.

## Featured projects

| Project | Focus | Status |
| --- | --- | --- |
| OpsCheck Flow | Durable Python/SQLite workflows for operational CSV review | Released — v0.1.0 |
| AI Operations Automation Hub | Operations Automation / Workflow Systems | Built / Workflow Prototype |
| PasaWise CSE | Full-Stack Product / EdTech | Built / Web Application |
| Kivo — Life Organizer | Android life organization | Private Alpha / In Development |

OpsCheck's public [repository](https://github.com/MasterAerol/opscheck-flow) and [v0.1.0 release](https://github.com/MasterAerol/opscheck-flow/releases/tag/v0.1.0) are the supplied public project destinations. Unverified or private project links are omitted.

Project facts follow the supplied implementation evidence: OpsCheck has 227 tests, 225 passed, 0 failed and 2 intentional Windows symlink skips; Kivo has 596 automated tests. Built/prototype and private-alpha labels do not imply public launches, paid employment, adoption or performance outcomes. See the [content audit](docs/content-audit.md).

## Portfolio stack

These technologies describe this repository, separately from the featured projects:

- React 19.2.8 and React DOM 19.2.8, TypeScript and Vite.
- Three.js 0.182.0, React Three Fiber 9.7.0 and Drei 10.7.8.
- CSS, local SVG/geometry and system fonts.
- Vitest, Testing Library, Playwright and axe for verification.
- Wrangler 4.131.2 as a development dependency for Cloudflare's local static-assets runtime and future deployment.

Runtime versions are pinned in `package.json`; `package-lock.json` records the dependency tree. npm remains the package manager.

## Local development

Prefer the latest Node.js 22 patch, at least 22.22.2. The Milestone 6 baseline was also tested with Node.js 24.18.0 and npm 11.16.0. CI uses Node 22.

```sh
npm ci
npm run dev
```

Open [the local development server](http://127.0.0.1:5173). Its port is strict, so a conflict is reported instead of silently choosing another URL.

The static application requires no application secrets. Private environment files, deployment state, dependencies, builds and QA artifacts are excluded from Git. The safe `.env.example` exception is retained; no example or private environment file is required to run the site.

## QA

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
npm run test:e2e:production
npm ls
npm audit
git diff --check
```

Install Chromium once on a new machine with `npx playwright install chromium`. Use `npm run test:watch` for unit-test development. No lint script is configured.

Vitest checks content, landmarks, navigation, project data, resume routes/shared facts, print controls, scene selection and failure handling. Playwright covers ten viewport widths from 360px to 1920px, sequential keyboard/menu navigation, technology wrapping, 200% text enlargement, axe accessibility, actual WebGL rendering, DPR, pause/resume, reduced motion, fallback paths, hover and touch scrolling. One browser worker avoids competing WebGL contexts; traces are retained on failure.

Browser commands use the same regression suite:

| Command | Local target | Startup |
| --- | --- | --- |
| `npm run test:e2e` | Vite development, port 5173 | Starts the development server if needed |
| `npm run test:e2e:production` | Vite production preview, port 4173 | Builds first, then starts preview if needed |
| `npm run test:e2e:cloudflare` | Wrangler local static assets, port 8787 | Starts `cf:dev`, including its build, if needed |

QA screenshots and measurements are stored in ignored `.qa/`; browser reports and traces are also ignored. Recorded checks use Chromium on Windows with viewport/touch emulation; physical devices, Firefox and Safari are not represented as tested.

See the [release-preparation report](docs/milestone-7-qa.md) for current results and limitations. Earlier reports preserve development evidence: [M1](docs/milestone-1-qa.md), [M1.1](docs/milestone-1.1-qa.md), [M2](docs/milestone-2-qa.md), [M3](docs/milestone-3-qa.md), [M4](docs/milestone-4-qa.md), [M5](docs/milestone-5-qa.md), [M6](docs/milestone-6-qa.md).

## GitHub Actions CI

`.github/workflows/ci.yml` validates pull requests targeting `main` and pushes to `main`. It uses `actions/checkout@v7`, `actions/setup-node@v7`, Node 22 and `npm ci`, then runs unit tests, typecheck and the production build. There is no lint step because no lint script exists.

CI performs validation only. It does not deploy or require Cloudflare credentials. Hosted workflow results will exist only after GitHub publication and execution; no CI badge is asserted in advance.

## Production build

```sh
npm run build
npm run preview
```

Vite writes the static application to `dist/`. Open [the local production preview](http://127.0.0.1:4173). The HTML resume routes are `/resume/software` and `/resume/operations`.

## Cloudflare Workers Static Assets

`wrangler.jsonc` configures static hosting without a backend Worker:

| Setting | Value |
| --- | --- |
| Worker name | `aerol-portfolio` |
| Compatibility date | `2026-09-15` |
| Build command | `npm run build` |
| Assets directory | `./dist/` |
| Not-found handling | `single-page-application` |

SPA fallback serves the application entry for direct navigation and refresh at both resume routes. Ordinary JS, CSS and favicon requests remain static assets. No KV, D1, R2, Workers AI, backend API or deployment secret is needed by this portfolio.

Run the local Cloudflare preview:

```sh
npm run cf:dev
```

This builds the site, then runs the project-local Wrangler with `--local --ip 127.0.0.1 --port 8787`. Open [the local Cloudflare preview](http://127.0.0.1:8787). Use `npm run test:e2e:cloudflare` for its browser regression suite. Local-preview evidence and any limitations belong in the release-preparation report.

Remote deployment is a separate step requiring explicit approval. The prepared `cf:deploy` script runs `npm run build && wrangler deploy`; do not execute it as part of local QA. Future deployment may use Cloudflare Workers deployment/Git integration; the GitHub Actions workflow here remains validation only.

The expected initial URL format is `aerol-portfolio.<account-workers-subdomain>.workers.dev`. The actual account subdomain is not known or hardcoded. After a deployment is verified, add the real canonical and social metadata URLs together and repeat direct-route/asset/link checks on that host. A custom domain remains a later decision.

## Project structure

- `src/components/`: header, footer, icons, section headings and the hero visual boundary.
- `src/components/projects/`: case-study layout, proof/status/links, and workflow, layer, learning-loop and organizer diagrams.
- `src/components/hero/`: lazy scene, controlled canvas host, geometry, core, orbits, nodes, lighting and fallback.
- `src/sections/`: semantic HTML portfolio sections.
- `src/data/projects.ts`: shared project content, validated by `src/types/project.ts`.
- `src/data/profile.ts` and `src/data/content.ts`: identity, navigation, capabilities, process, skills, opportunities and resume tracks.
- `src/data/resume.ts` and `src/data/education.ts`: targeted resume presentation and shared education/completed training.
- `src/ResumeRouter.tsx` and `src/pages/ResumePage.tsx`: HTML resume views; unknown paths preserve the portfolio.
- `src/styles/`: shared design tokens/layout and scoped hero, project, proof and resume screen/print styles.
- `src/test/` and `tests/`: unit/content and browser/accessibility checks.
- `.github/workflows/ci.yml` and `wrangler.jsonc`: CI validation and static hosting configuration.

## Accessibility and reduced motion

The near-black, graphite, white and cyan design uses semantic HTML, a skip link, native links/buttons/disclosures and visible focus outlines. The mobile menu supports Escape, focus exit, outside clicks, breakpoint changes and short screens.

Essential hero text and CTAs remain ordinary HTML. The decorative canvas is hidden from assistive technology and excluded from keyboard navigation. On mobile it sits below the hero links, allows vertical touch scrolling, and uses reduced motion amplitudes without pointer parallax.

`HeroVisualBoundary` selects a static CSS fallback or lazy `HeroScene`. Reduced motion skips the animated scene entirely; project-story animation also stops without removing content. Unsupported WebGL, initialization failure, drawing failure and context loss restore the fallback.

The scene uses local geometry: a layered beveled graphite plate, extruded A, cyan dot, three elliptical paths and four project chips. It contains no navigation or additional project claims. The controlled R3F root handles asynchronous setup failures, waits for a successful draw before reporting readiness, owns cleanup, and pauses continuous rendering offscreen or in hidden documents. Pointer and animation updates use refs. DPR is fixed at 1 after profiling; shadows, textures, environment maps and postprocessing are absent.

## Resume views and printing

Both resumes share identity, project evidence, education and completed training. Summaries, skills, factual bullets and project order differ by target role. Projects are labeled Selected Project Experience.

Each route offers a real Print / Save as PDF control. Use A4 at default scale with browser headers/footers disabled. The recorded M5/M6 print inspections produced two pages per resume with white margins and readable URLs; other print settings may change pagination. Temporary QA print files are not public downloads. Final exported resume PDFs remain deferred.

## GitHub repository metadata

Suggested metadata describes this portfolio repository:

- Name: `MasterAerol/aerol-portfolio`
- Description: Interactive portfolio of James Aerol Ilagan featuring software, automation, systems, and product projects.
- Topics: `portfolio`, `react`, `typescript`, `vite`, `threejs`, `react-three-fiber`, `frontend`, `developer-portfolio`, `webgl`, `accessibility`

## License and usage

Personal portfolio source. No license has been granted unless stated otherwise.

## Deferred work

GitHub publication, hosted CI execution, remote deployment, a verified production URL, a custom domain, final PDF exports, backend contact forms and analytics remain separate steps. Scroll-driven multi-section cameras, project-specific 3D storytelling and advanced scene transitions are also deferred.
