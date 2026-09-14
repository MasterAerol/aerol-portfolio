# Milestone 1 QA

Recorded on 2026-09-15 against the local React / TypeScript / Vite application.

## Automated checks

| Check | Result |
| --- | --- |
| `npm test` | PASS — 14 tests in 2 files |
| `npm run typecheck` | PASS |
| `npm run build` | PASS — static Vite production build |
| `npm run test:e2e` | PASS — 13 Chromium browser tests |
| `git diff --check` | PASS |
| `git diff --cached --check` | PASS before commit |

Unit checks cover all ten main sections plus header/footer, navigation targets, typed project content, evidence snapshots, technology fields, project/contact links, menu behavior, unavailable resumes, decorative scene boundary, and metadata.

## Responsive and visual QA

| CSS viewport width | Result |
| --- | --- |
| 1440 | PASS |
| 1024 | PASS |
| 768 | PASS |
| 430 | PASS |
| 390 | PASS |
| 360 | PASS |

All six widths have no horizontal overflow with project details closed or expanded. Navigation anchors resolve and scroll to the work section. Mobile navigation opens and closes; long technology tags wrap; project disclosures remain readable and keyboard-operable. Main controls and disclosures have touch-friendly heights.

Chromium screenshots were visually reviewed for hero, navigation, typography, spacing, project content, and lower sections. Local evidence files are ignored at `.qa/portfolio-{width}.png`.

Additional checks pass for a 740×320 landscape menu and 200% text enlargement at 390px. Decorative clipping fixes verified tablet overflow without clipping meaningful content or focus outlines.

## Accessibility

- Keyboard: skip link, primary navigation, native project disclosures, Escape focus restoration, menu focus exit, and outside-click/breakpoint dismissal verified.
- Focus: visible 2px cyan outlines; focused main landmark receives skip-link navigation.
- Contrast: axe scans report zero WCAG A/AA violations at desktop and mobile widths with expanded details. Representative base token ratios: primary text/background about 17.8:1; muted text/background about 8.7:1; primary button text/background about 10.9:1.
- Reduced motion: computed smooth-scrolling and transitions are disabled; content and links remain usable.
- Structure: one h1, named sections, hierarchical headings, header/nav/main/footer landmarks, meaningful links, and explanatory disabled resume buttons.
- Future visual: CSS-only, aria-hidden, pointer-inert; no canvas or required information in the enhancement boundary.

## Scope and limits

Browser validation used Chromium on Windows, not physical devices or Safari/Firefox. Automated accessibility scans and keyboard checks are not a complete assistive-technology audit. Contact URLs are validated; no email was sent. Supplied project URLs are preserved without creating or publishing any external content.

No runtime errors were observed across responsive tests. No backend, analytics, third-party font request, or 3D dependency is present.

## Git and delivery

Branch: `milestone1/foundation`.

Commit is created only after the checks above pass. See `git log -1` for the final commit identifier and `git status --short` for the working tree. The staged-file review excludes secrets, dependencies, builds, screenshots, browser reports, and traces.

No push, pull request, merge, production deployment, or domain purchase was performed.
