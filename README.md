# AEROL. — Portfolio foundation

Milestone 1 of James Aerol Ilagan's portfolio. A responsive, accessible, single-page React / TypeScript / Vite application with a typed project content source and a CSS-only hero enhancement.

## Run locally

Tested with Node.js 24.18.0 and npm 11.16.0.

```sh
npm ci
npm run dev
```

The development URL is http://127.0.0.1:5173. The port is strict so a conflict is reported instead of silently opening another URL.

## Verification

```sh
npm test
npm run typecheck
npm run build
npm run test:e2e
git diff --check
```

On a new machine, install the browser once with `npx playwright install chromium`. Browser tests start Vite automatically when no existing development server is available. Use `npm run test:watch` for interactive unit testing and `npm run preview` for the production build at http://127.0.0.1:4173.

Vitest and Testing Library check content, landmarks, navigation, project data, resume availability, and labels. Playwright checks six viewport widths, keyboard navigation, menu behavior, long technology labels, reduced motion, 200% text enlargement, and axe accessibility rules. QA screenshots go to ignored `.qa/`; browser reports and traces are also ignored.

See [QA results](docs/milestone-1-qa.md) for the recorded outcome and scope.

## Structure

- `src/components/`: header, footer, icons, section heading, project card, and optional hero visual boundary.
- `src/sections/`: Hero, About, Selected Work, What I Can Help With, How I Work, Skills, Open to Opportunities, Resume, Education, and Contact.
- `src/data/projects.ts`: the sole project-content source, validated by `Project` in `src/types/project.ts`.
- `src/data/profile.ts` and `src/data/content.ts`: contact identity, navigation, capabilities, process, skills, opportunities, and resume tracks.
- `src/styles/`: shared design tokens, global/responsive foundations, and section styles.
- `src/test/`: unit and content tests.
- `tests/`: browser and accessibility tests.

## Content policy

All project claims derive from the user-supplied Milestone 1 brief; they are supplied evidence, not a new independent repository audit. See [content notes](docs/content-audit.md).

Missing project links and unspecified statuses remain absent. Resume controls are disabled with explanatory text until real files are supplied. No resume downloads, LinkedIn URL, fabricated project screenshots, employment, customers, or performance metrics have been added.

## Design and accessibility

Near-black background, graphite surfaces, white type, and a cyan accent. System fonts avoid external font requests. The layout uses semantic HTML, a skip link, native links/buttons/disclosures, visible focus outlines, and a mobile navigation disclosure. The mobile menu supports Escape, focus exit, outside clicks, breakpoint changes, and scrolling on short screens.

Core content is visible without animation. `prefers-reduced-motion` disables smooth scrolling and transitions. Essential text is separate from the decorative, pointer-inert, aria-hidden `HeroVisualBoundary`.

## Milestone 2 boundary

`HeroVisualBoundary.tsx` is the integration point for a future optional `HeroScene`. Preserve the CSS fallback and semantic content outside that boundary. Any future 3D should load separately, honor reduced motion and device capability, and fail without hiding information.

Three.js / React Three Fiber, 3D models, particles, scroll-linked cameras, heavy animation packages, backend/database, analytics, contact-form services, paid AI APIs, deployment, and domain purchases are outside Milestone 1.

This repository is local-only on `milestone1/foundation`. No push, pull request, merge, or deployment is part of this milestone.
