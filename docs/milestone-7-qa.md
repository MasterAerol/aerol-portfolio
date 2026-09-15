# Milestone 7 — Release engineering QA

Validation status: PASS — ready for GitHub publication preparation. No remote publication or deployment has been performed.

## Baseline and history

The required baseline gate ran before repository modifications on clean `milestone6/production-hardening`, at `cfcc5f5`. Git status/branch/history, both dependency-tree commands, 50 unit tests, typecheck, build and `git diff --check` passed. No lint script exists.

All seven milestone commits remain ancestors of `release/v1.0.0`, created from the approved Milestone 6 commit:

| Milestone | Commit |
| --- | --- |
| 1 | `5d320f7` |
| 1.1 | `285fbfa` |
| 2 | `5127c0e` |
| 3 | `c95bc0c` |
| 4 | `041552e` |
| 5 | `6548855` |
| 6 | `cfcc5f5` |

The first subsequent `npm ci` attempt encountered a Windows file lock held by the previous Vite preview. Stopping that preview resolved it. The unchanged foundation lockfile then installed successfully and the complete normal QA passed again.

No milestone history was rewritten. No Git remote was configured, and no push, merge, tag, hosted release or remote deployment was performed. The package's existing `0.1.0` version is retained; this prepares an eventual v1.0.0 release without claiming it has been published.

## Scope

No files under `src/`, `public/`, or `index.html` changed. The approved design, content, project data, metadata, hero, interactions and resume views remain intact.

Release preparation adds:

- Validation-only `.github/workflows/ci.yml`.
- Project-local Wrangler `4.131.2`, resolved from npm's current release and pinned in the manifest and lockfile.
- Static-only `wrangler.jsonc` and local/future deployment scripts.
- A Cloudflare Playwright configuration that reuses the complete existing browser suite.
- Explicit HTTP-200/HTML checks for direct route loads and reloads, plus JS/CSS MIME checks. The asset assertions also support Vite's development-only CSS injection.
- Typecheck coverage for all Playwright configuration files.
- Wrangler/private-variable ignore rules, a public repository README and this report.

## GitHub Actions

The workflow's YAML was parsed with the existing Playwright-bundled YAML parser, including duplicate-key validation. Triggers, permissions, action versions, Node setup and exact run commands were also asserted.

| Setting | Verified value |
| --- | --- |
| Events | Pull requests targeting `main`; pushes to `main` |
| Runner | `ubuntu-latest`, 15-minute timeout |
| Checkout | `actions/checkout@v7`, `persist-credentials: false` |
| Setup | `actions/setup-node@v7`, Node `22`, latest patch, npm cache |
| Permissions | `contents: read` |
| Commands | `npm ci`, `npm test`, `npm run typecheck`, `npm run build` |
| Lint | Omitted because the manifest has no lint script |
| Deployment or Cloudflare credentials | None |

Official current action releases were checked. Node 22 must be at least 22.22.2 for the installed jsdom release; the locally tested Node 22 runtime was 22.23.2. Node 24.18.0/npm 11.16.0 also passed the original baseline. Local validation is not a claim that GitHub-hosted CI has run. Browser tests are documented local gates; the prepared CI runs the requested unit/type/build checks.

## Cloudflare configuration

| Setting | Value |
| --- | --- |
| Hosting | Cloudflare Workers Static Assets |
| Wrangler | `4.131.2`, development dependency |
| Name | `aerol-portfolio` |
| Compatibility date | `2026-09-15` |
| Production assets | `./dist/` |
| SPA handling | `single-page-application` |
| Backend `main` / bindings / APIs | None |

The installed Wrangler accepted the configuration and started its local runtime on `127.0.0.1:8787`. The preview served the built assets and used SPA fallback for browser navigation to both resumes. There are no KV, D1, R2 or Workers AI bindings.

`cf:dev` builds and runs `wrangler dev --local --ip 127.0.0.1 --port 8787`. The prepared `cf:deploy` script builds and invokes `wrangler deploy`; it was never executed.

The eventual URL format is `aerol-portfolio.<account-workers-subdomain>.workers.dev`. No account subdomain, production canonical URL, custom domain, JSON-LD website URL or CI badge was invented.

## Automated QA

The release lockfile installed successfully with `npm ci` under Node 22.23.2/npm 11.16.0 without changing its hash. Tests, typecheck, build, dependency checks and audit passed. The final repeat after the last configuration/documentation changes also passed: npm ci, all 50 tests, typecheck, build, both dependency-tree checks, npm audit and git diff --check. The lockfile hash and all five production artifact hashes remained unchanged.

| Gate | Result |
| --- | --- |
| Unit tests | 50 passed, 7 files |
| Typecheck | PASS; includes base, Vite production and Cloudflare Playwright configs |
| Lint | Not configured |
| Build | PASS |
| `git diff --check` | PASS |
| `npm ls` | Healthy |
| Focused React/Three tree | React and React DOM 19.2.8, no invalid dependencies |
| `npm audit` | 0 vulnerabilities |

No pre-existing package version changed when Wrangler was installed. The lockfile adds Wrangler's dependency and optional platform-package entries. The pre-existing unused `stats-gl` dependency still has its nested Three 0.170.0; the actual scene uses Three 0.182.0 and no additional React version is present.

## Routing and production preview

| Target | Browser suite |
| --- | --- |
| Wrangler local static assets, port 8787 | 87 passed |
| Vite production preview, port 4173 | 87 passed |
| Vite development compatibility, port 5173 | 3 passed |

On both production previews, `/`, `/resume/software` and `/resume/operations` passed direct navigation and direct refresh with HTTP 200/HTML. Resume links and Back to Portfolio passed normal navigation. JavaScript, CSS and favicon assets passed status, MIME/content and no-404 checks. The real 3D scene, reduced-motion static experience, failure fallbacks, mobile menu, project interactions, public GitHub destinations and email controls passed. Tests verify public link destinations without sending email.

The complete suite checks ten widths: 1920, 1440, 1280, 1024, 768, 430, 412, 390, 375 and 360px. All widths on both production previews passed page/section geometry, readable type, technology wrapping, touch targets and zero horizontal overflow. Keyboard order/focus, menu behavior, 200% text, axe checks, resume content and print CSS remain covered. Actual new PDF exports were not part of this release-only pass.

Cloudflare screenshots at 1440px and 390px were visually inspected for the hero and mobile About/resume/education/contact areas. The approved text-first hierarchy, 3D framing, links and narrow email area remain intact. Additional widths are supported by the full automated layout and screenshot run. These are Chromium/Windows checks with viewport/touch emulation, not a claim of physical-device, Safari or Firefox testing.

Ignored evidence is retained under `.qa/milestone-7/`: configuration validation, baseline asset hashes, Cloudflare screenshots/layout measurements, and separate browser reports. The existing regression suite also writes its usual ignored screenshots under `.qa/milestone-6/regression/`.

## Build and runtime observations

Every generated production file was SHA-256 compared with the approved baseline after the Node 22 build and was byte-for-byte identical.

| Asset | Built size | Gzip |
| --- | ---: | ---: |
| HTML | 2.25 kB | 0.87 kB |
| CSS | 36.95 kB | 8.72 kB |
| Initial JS | 239.76 kB | 74.17 kB |
| Lazy hero JS | 693.33 kB | 186.87 kB |

Wrangler is development tooling and adds no browser bundle growth. The existing lazy-hero chunk-size advisory remains. No postprocessing, external 3D assets, textures, shadows, new network services or continuous-render behavior was introduced.

No application console errors or failed asset responses were observed on either production preview; no Worker runtime errors were observed on Cloudflare. The suite retains unexpected warnings and permits only the existing narrowly matched Chromium software-GPU ReadPixels notice if it occurs. Tooling notices remain visible: Vite's chunk-size advisory, Vitest's environment-performance suggestion, and Playwright's NO_COLOR/FORCE_COLOR notice. npm 11 also reported unapproved optional esbuild/workerd postinstall scripts; the clean install and actual local Wrangler runtime succeeded without a blanket script-policy change.

## Security, content and license

The final independent audit covered 91 current text files, including the new configurations and built output, and 137 historical text blobs across the seven milestone commits. No likely secrets or private environment/key files were found. Third-party dependencies, generated Wrangler state and binary QA media were excluded from this heuristic source scan. A final publication-scope scan also checked all 87 publishable text files, including this report, with zero likely-secret matches. This report contains only known public configuration and validation results.

`.env` / `.env.*`, `.dev.vars` / `.dev.vars.*` and `.wrangler/` are ignored. Both safe example exceptions remain. No environment file or Cloudflare credential is needed to run the static application. CI has read-only repository permissions and no secret references.

The rendered site retains exactly the four approved projects and their truthful evidence/status. No OpenAI API, Docker, Resend, AWS, Kubernetes, Stripe, unfinished Civil Engineering project, paid employment, clients, users or revenue claim was introduced. Private project links remain absent.

The README separates this portfolio's implementation stack from the technologies in showcased projects. No existing repository license exists, and none was invented. The requested concise personal-source/no-license-grant statement is retained.

## Publication readiness and deferred actions

READY FOR GITHUB. No local release blocker remains. The release preparation is committed separately on release/v1.0.0 using the requested commit message; its identifier and final clean-tree status are reported after Git verification. The README records the requested repository name, description and topics. CI execution on GitHub, publication, merge, deployment, verified production metadata, custom domain and a v1.0.0 tag/release remain future steps. Cloudflare deployment will use its own deployment/Git integration later; GitHub Actions here is validation only.

## References checked

- [Current GitHub checkout action](https://github.com/actions/checkout)
- [Current GitHub setup-node action](https://github.com/actions/setup-node)
- [Cloudflare static assets configuration](https://developers.cloudflare.com/workers/static-assets/binding/)
- [Cloudflare SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/)
- [Wrangler local-development commands](https://developers.cloudflare.com/workers/wrangler/commands/workers/)
