# Pre-v1 General VA expansion QA

## Baseline and scope

- Started from clean `main`, fast-forwarded to `1c3e27c`, then created `fix/pre-v1-general-va`.
- Baseline passed before edits: 63 unit tests, typecheck, production build and `git diff --check`.
- Added `/resume/general-va` through the existing resume-track router and shared identity, project facts, education, training, contact links and screen/print template.
- Added the three approved opportunity targets while retaining the existing five roles. These are application targets, not employment claims.
- The Resume section now has three choices with the requested supporting text. Cards use the existing treatment, three columns on wide screens and a readable single column at tablet/mobile sizes.
- Existing hero positioning, 3D implementation, project claims/data, portfolio skills, contact profiles, scroll reveals, dependencies, CI and Cloudflare configuration are unchanged.

## Content and claims

The new resume targets General Virtual Assistant with Data Entry, Administrative Support and Research as its focus. Its summary explicitly describes independent, project-based experience. Only AI Operations Automation Hub and PasaWise CSE are included, in that order, labeled independent/project-based work and Personal Project.

The four skill groups contain only the approved administrative/data, AI/productivity, workflow and technical-foundation items. Tests reject formal VA employment, client work, AI processing, unsupported technology claims and unpracticed administrative skills. The business email and canonical LinkedIn URL remain shared and unchanged.

Both existing resume documents were captured from the baseline production build and compared against the final build: their complete rendered document HTML is identical. Shared education and DICT training remain unchanged.

## Automated QA

| Check | Result |
| --- | --- |
| `npm test` | 72 passed across 10 files |
| `npm run typecheck` | Passed |
| `npm run build` | Passed |
| `git diff --check` | Passed |
| `npm ls react react-dom three @react-three/fiber @react-three/drei` | Passed; no invalid dependencies |
| Full production browser suite | 121 passed |
| Final affected tests on local Cloudflare runtime | 47 passed |

The complete browser suite passed before the final General VA print page-break adjustment. After that adjustment, unit/type/build checks and all affected resume, route-integrity and General VA browser tests passed using the local Cloudflare configuration. No coverage was removed. The existing Vite advisory for the lazy Three.js chunk remains; no new dependency was added. There is no lint script.

## Responsive, routing and accessibility

- Full-page and resume tests passed at **430, 412, 390, 375, 360, 768, 1024, 1280, 1440 and 1920 px**.
- All four routes (`/`, `/resume/software`, `/resume/operations`, `/resume/general-va`) returned valid HTML on direct navigation and refresh through the existing Cloudflare SPA fallback.
- Three resume cards, all eight opportunity targets, skills and contact URLs fit without horizontal overflow. Tested body text remains at least 16 px on screen.
- Keyboard/skip links, visible focus, 44 px controls, Back to Portfolio, Print / Save as PDF, contact links, axe checks and 200% text enlargement passed.
- Resume pages remain static with no canvas or reveal animation. Portfolio 3D, reduced motion, reveal behavior, project interactions, copy-email and remaining section regression checks passed.
- Visually inspected desktop resume choices, narrow mobile cards/opportunities and the complete General VA resume at 360 px.
- Browser coverage uses Chromium emulation and local runtimes; it does not claim physical-device or Safari testing.

## Print review

The General VA resume prints to **two A4 pages** using the unchanged shared 10.5 pt body typography and 15 mm margins. Page one contains identity, summary and both projects. Page two starts with the existing continuation treatment and keeps skills, education and completed training together. Both final pages were rendered and visually inspected.

All three print previews passed page-count, text, margin and PDF link checks. Both existing resumes remain two pages. Email, GitHub and LinkedIn links work in the generated QA PDFs. Print controls are hidden; no public PDF download was added.

## Evidence and release boundaries

Local reports, screenshots, baseline document comparisons and print previews are in ignored `.qa/pre-v1-general-va/`. The complete suite also writes to existing ignored QA directories.

The final initial JavaScript is approximately 244.69 kB (75.61 kB gzip), compared with 241.81 kB (74.83 kB gzip) at baseline. The lazy hero chunk remains approximately 693.33 kB (186.87 kB gzip).

This branch is intended for normal push and pull-request review. No merge, release tag or manual deployment is part of this change.
