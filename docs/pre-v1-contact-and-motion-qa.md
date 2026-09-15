# Pre-v1 contact and motion QA

## Baseline and scope

- Started from clean `main`, fast-forwarded to `63cc9a3`, then created `fix/pre-v1-contact-and-motion`.
- Baseline: 50 unit tests passed; typecheck, production build and `git diff --check` passed before edits.
- Updated public contact to **aerolilagan00@gmail.com** in shared data, rendered routes and the noscript fallback.
- Added the approved canonical LinkedIn profile to hero, Contact, both resumes, and Person JSON-LD alongside GitHub. Social links keep the existing same-tab behavior and accessible text.
- The former email remains only in a negative test fixture among tracked source, tests and current documentation. Historical Git metadata was not changed.
- Project claims, resume facts, 3D scene source, dependencies, CI workflow and Cloudflare configuration are unchanged.

## Reveal behavior

- A small React hook uses IntersectionObserver to animate selected section eyebrows, headings, capability headings and project story headlines once.
- Desktop headings use a 560 ms fade/rise with a 14 px offset and 60 ms word stagger, capped at 360 ms. Mobile uses whole-heading reveals to preserve natural wrapping.
- Text is visible by default. Only successful viewport entry applies an animation; missing, failed or undelivered observer initialization leaves content readable.
- Semantic heading elements retain their complete accessible phrase; visual word spans are hidden from assistive technology.
- Initial or newly enabled reduced motion settles reveals immediately. Print is static. Hero text and CTAs have no added intro delay; both resume routes remain static.
- Replaced the earlier whole-project entrance animation with headline reveals, avoiding nested motion on paragraphs and technology chips.

## Automated results

| Check | Result |
| --- | --- |
| `npm test` | 63 passed across 9 files |
| `npm run typecheck` | Passed |
| `npm run build` | Passed |
| `git diff --check` | Passed |
| `npm ls react react-dom three @react-three/fiber @react-three/drei` | Passed; no invalid dependencies |
| Focused reveal/contact browser tests | 15 passed |
| Complete production browser suite | 101 passed |

There is no lint script. Existing build/tool notices remain, including Vite's advisory for the lazy Three.js chunk; no new runtime warning or asset failure was found by the browser suite.

## Responsive, accessibility and regression review

- The full-page browser matrix passed at **360, 375, 390, 412, 430, 768, 1024, 1280, 1440 and 1920 px**.
- Reveal-specific checks covered all five requested phone widths plus 768, 1024 and 1440 px: no horizontal overflow, clipped headings, word-wrap height changes or settled animation offsets.
- Header/menu, hero controls, focus visibility, keyboard access, 200% sizing and accessibility scans passed.
- Existing 3D framing, pointer/hover behavior, touch scrolling, conservative DPR, offscreen pause, reduced-motion and WebGL failure tests passed.
- About, project stories/proof, capabilities, process, skills, opportunities, resume section, Education, Contact and footer regression tests passed.
- Contact screenshots at 1440 and 360 px were visually inspected; email, GitHub and LinkedIn fit with clear focus treatment.
- Both resume routes passed browser checks and print inspection. Each remains two A4 pages with clean margins, preserved facts and working new email/LinkedIn PDF links. All four rendered print pages were visually inspected.
- Browser coverage uses Chromium and viewport/device emulation; this does not claim testing on physical phones or Safari.

## Build impact and evidence

- Initial JavaScript: approximately **241.81 kB / 74.83 kB gzip**, up about 2.05 kB / 0.66 kB gzip from baseline.
- CSS: approximately **37.85 kB / 8.92 kB gzip**, up about 0.90 kB / 0.20 kB gzip.
- Lazy hero JavaScript remains approximately **693.33 kB / 186.87 kB gzip**. No new asset or package dependency was added.
- Local browser reports, screenshots and print inspection artifacts are kept in ignored `.qa/pre-v1-contact-and-motion/`; full-page regression artifacts also use the existing ignored QA directories.
- No merge, release tag or manual deployment is part of this polish. The branch is intended for normal push and pull-request review.
