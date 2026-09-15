# AEROL. — Portfolio

James Aerol Ilagan's responsive, accessible React / TypeScript / Vite portfolio. Milestones 1 and 1.1 establish the approved content and design. Milestone 2 adds an isolated React Three Fiber identity scene to the hero. Milestone 3 turns Selected Work into four interactive case studies built with HTML, CSS, and SVG. Milestone 4 adds reusable proof/status presentation, recruiter context, copy-email interaction, and truthful professional metadata.

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

On a new machine, install Chromium once with `npx playwright install chromium`. Browser tests start Vite automatically when no development server is available. Use `npm run test:watch` for unit testing and `npm run preview` for the production build at http://127.0.0.1:4173. No lint script is configured.

Vitest checks content, landmarks, navigation, project data, resume availability, scene selection and failure behavior. Playwright checks six viewport widths, keyboard/menu behavior, technology wrapping, 200% text enlargement, axe accessibility, actual WebGL rendering, DPR, pause/resume, reduced motion, fallback paths, hover and touch scrolling. Browser tests use one worker because concurrent WebGL contexts compete for the same GPU/software renderer. Existing test coverage is retained; traces are retained on failure.

QA screenshots and measurements go to ignored `.qa/`; browser reports and traces are also ignored. Recorded results: [Milestone 1](docs/milestone-1-qa.md), [Milestone 1.1](docs/milestone-1.1-qa.md), [Milestone 2](docs/milestone-2-qa.md), [Milestone 3](docs/milestone-3-qa.md), [Milestone 4](docs/milestone-4-qa.md).

## Structure

- `src/components/`: header, footer, icons, section headings, reusable project stories and hero visual boundary.
- `src/components/projects/`: case-study layout, reusable proof/status/links, and workflow, layer, learning-loop, and organizer diagrams.
- `src/components/hero/`: lazy scene, controlled canvas host, geometry, core, orbits, nodes, lighting and fallback.
- `src/sections/`: the approved semantic HTML sections, including unchanged hero content.
- `src/data/projects.ts`: the sole project-content source, validated by `Project` in `src/types/project.ts`.
- `src/data/profile.ts` and `src/data/content.ts`: identity, navigation, capabilities, process, skills, opportunities and resume tracks.
- `src/styles/`: existing tokens/layout plus separately scoped hero scene, project story, and recruiter proof stylesheets.
- `src/test/` and `tests/`: unit/content and browser/accessibility tests.

## Content policy

Project claims derive from the supplied briefs, with Selected Work restricted to the supplied Milestone 3 facts and Milestone 4 status/evidence wording; they are supplied evidence, not a new independent repository audit. See [content notes](docs/content-audit.md).

Missing project links remain absent. Built/prototype and private-alpha labels do not imply public launches. Resume controls are disabled until real files are supplied. No resume downloads, LinkedIn URL, fabricated screenshots, employment, customers or performance claims have been added.

## Design and accessibility

The approved near-black, graphite, white and cyan design uses system fonts, semantic HTML, a skip link, native links/buttons/disclosures and visible focus outlines. The mobile menu supports Escape, focus exit, outside clicks, breakpoint changes and short screens.

Essential hero text and CTAs remain ordinary HTML. The canvas is decorative, hidden from assistive technology and excluded from keyboard navigation. On mobile it sits below the hero links, permits vertical touch scrolling, and uses reduced motion amplitudes without pointer parallax.

## Hero scene boundary

`HeroVisualBoundary` selects a static CSS fallback or lazy `HeroScene`. Reduced motion skips the animated scene entirely. Unsupported WebGL, initialization failure, drawing failure and context loss all restore the fallback without removing content.

The scene uses local geometry only: a layered beveled graphite plate, extruded A, cyan dot, three thin elliptical paths and four project chips. Names come from the existing project records. The scene contains no navigation or new project claims.

The controlled R3F root catches asynchronous renderer setup failures, announces readiness only after a successful draw, owns cleanup, and pauses continuous rendering offscreen or in a hidden document. Pointer and animation updates use refs. DPR is fixed at 1 after profiling; shadows, textures, environment maps and postprocessing are absent.

Runtime versions are pinned to Three 0.182.0, Fiber 9.7.0 and Drei 10.7.8. React/React DOM use compatible 19.2.8 instead of the foundation's 19.3.0: Fiber 9.7's peer range excludes 19.3. The matched React types are 19.2.18 / 19.2.7. Three 0.182 avoids a newer Clock deprecation while Fiber still uses that clock.

## Deferred work

Scroll-driven multi-section cameras, project-specific 3D storytelling, advanced scene transitions and deployment remain future milestones. No external models, postprocessing, physics integration, backend, analytics or contact-form services were added.

Milestone 4 stays local on `milestone4/recruiter-proof`, branched from completed Milestone 3 commit `c95bc0c`. No push, merge or deployment is part of this milestone.
