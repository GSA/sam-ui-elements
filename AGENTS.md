# AGENTS.md

Guidance for AI coding agents working in this repository.

## Repo shape

This is a **raw-source, dual-workspace** Angular library, not a normal Angular CLI app:

- **Root** (`src/ui-kit/`, `src/formly/`) — the `@gsa-sam/sam-ui-elements` library itself. It is published as raw `.ts`/`.scss` source (no build step, no `dist/`) — consumers compile it themselves. `index.ts` re-exports `src/ui-kit`; `src/formly/index.ts` is a second, separately-imported entry point.
- **`test-app/`** — a _separate_ npm workspace (own `package.json`/`package-lock.json`/`node_modules`) that exists solely to host the Angular build tooling and Vitest test runner needed to exercise the root library's specs. Always `npm ci` (root) **and** `npm ci --prefix test-app` before running anything.
- Specs live next to the source they test under root `src/**/*.spec.ts` (not copied into `test-app`). `test-app/vitest.config.mts` globs both `test-app/src/**/*.spec.ts` and `../src/**/*.spec.ts`, with `allowExternal: true` so istanbul still instruments files outside `test-app`'s own root.

## Publish contract — do not break silently

`scripts/validate-publish-package.mjs` (`npm run validate:publish`) enforces that `npm pack` still includes every file listed in `scripts/consumer-deep-imports.json` — a frozen list of deep `@gsa-sam/sam-ui-elements/src/...` import paths used by real downstream consumers (`iae-sam-front-end` and others). **Renaming or moving a `src/ui-kit` file that appears in that list is a breaking change for consumers even though nothing inside this repo imports it.** Check that file before restructuring `src/ui-kit`.

## Testing

- Run specs: `npm ci && npm ci --prefix test-app && npm --prefix test-app test` (Vitest, `--coverage`, istanbul provider, jsdom environment). Config lives in `test-app/vitest.config.mts` — **coverage options must stay in this root config**; a shared/extended base config would have them silently ignored (falls back to Vitest defaults: html/clover/json instead of lcov).
- Run one spec or pattern: `cd test-app && npx vitest run --config vitest.config.mts -t "<name filter>"`, or pass a spec path directly.
- `it.skip`/`describe.skip`-only files (e.g. `label-wrapper`, `fieldset-wrapper`, the fully-commented-out `alert.spec.ts`) are intentional and contain zero runnable tests — `passWithNoTests: true` is set so these don't fail the run; this preserves prior Karma behavior.
- Coverage is enforced by a ratcheting floor gate: `coverage-floor.json` at the repo root records minimum statements/branches/functions/lines percentages (fractional, e.g. `53.56`). `node scripts/check-coverage.mjs` (wired into CI as `npm run coverage:check`) fails with a clear per-metric message if measured coverage (from `test-app/coverage/coverage-summary.json`) drops below any floor.
- **`coverage-floor.json` is a ratchet — it only ever moves up, and only via a dedicated bump.** Feature and spec PRs must **not** edit `coverage-floor.json` directly; raising it is a separate, deliberate commit made with `npm run coverage:bump` (rewrites the floor file to the currently measured coverage — preserving istanbul's fractional `pct`, not floored to a whole percent — and never lowering an existing entry). `.github/workflows/ci.yml` also runs `scripts/check-coverage-floor-not-decreased.mjs` on PRs, comparing `coverage-floor.json` against the base branch and failing if any metric's floor decreased, so a floor can't be hand-lowered in the same PR that regresses coverage. This mirrors the ESLint baseline guard below.
- The gate scripts are covered by `node --test scripts/check-coverage.test.mjs` and `node --test scripts/check-coverage-floor-not-decreased.test.mjs` (Node's built-in test runner, no extra deps). These are **not currently wired into any CI workflow** — run them manually after touching either script.
- Playwright E2E smoke test (`test-app/e2e/`) runs via `npm --prefix test-app run test:e2e`, gated separately in `.github/workflows/e2e.yml`.

### Choosing between Vitest and Playwright

Vitest is the primary tool and should cover component logic, inputs/outputs, `ControlValueAccessor` wiring, and lifecycle behavior. But the jsdom environment is **structurally incapable** of catching two classes of defect, and no amount of unit-spec effort will change that:

- **Anything depending on the CSS cascade or layout.** jsdom does not apply a component's compiled `.scss`, so an author rule that beats the user-agent `[hidden] { display: none; }` looks correct in a spec (`getComputedStyle` reports `none`/`inline`) while the real browser renders both elements stacked.
- **Anything depending on which element a real pointer actually hits.** A synthetic `el.click()` or a hand-built `{ target }` object dispatches against the element you named; a real mouse click hit-tests and can land on a nested child (e.g. an `.sr-only` span inside an icon button), which is what `event.target` comparisons then see.

**Rule: when a bug is found that jsdom could not structurally have caught, its fix must include a Playwright test.** This grows the E2E suite along the actual risk surface rather than by component census — a blanket "E2E test per component" mandate would mostly re-assert what Vitest already covers faster. Playwright here is cheap to run (`fullyParallel: true`; nearly all of the ~2 min job is install + browser download + `ng serve` boot) and expensive to author, which is the opposite of the usual tradeoff.

Assert `toBeVisible()`, computed style, focus order, and bounding boxes. **Do not add screenshot/visual-regression testing** for this class of bug — baseline churn and font-rendering flake cost more than they reveal, and explicit assertions state intent.

Two related traps worth knowing:

- **A spec can pass vacuously.** `picker.spec.ts` had a test asserting the datepicker calendar stays open when its button is clicked; it passed only because a `@ViewChild(..., { static: true })` query against an `*ngIf`-gated element was permanently `undefined`, so the guard early-returned. It asserted nothing while looking like coverage. When a spec exercises a defensive guard, confirm the guard is actually reachable.
- **`test-app` cannot currently render library components at all** — no `paths` mapping to the root `src/`, and `app.module.ts` imports only `BrowserModule`. Adding a Playwright test for a component therefore also means harness work. The shared routed gallery shell (one route per component, stable URL) is being established in GSA/sam-ui-elements#665; check its state before hand-rolling scaffolding.

## Lint

- `npm run lint` (root) / `npm --prefix test-app run lint` run `ng lint` (ESLint) per workspace.
- A ratcheting warning-baseline gate works the same way as coverage: `eslint-baseline.json` (keys `root`, `test-app`) + `scripts/check-lint-baseline.mjs` fail the build if warnings exceed the recorded baseline, or if there are _any_ errors (errors always fail regardless of the baseline). `--bump` only ever lowers the baseline.
- `.github/workflows/lint.yml` additionally runs `scripts/check-baseline-not-increased.mjs`, comparing `eslint-baseline.json` on the PR branch against the base branch — this closes the hole where a contributor could raise the ceiling by hand-editing the JSON in the same PR that adds new warnings. The `--bump` scripts are the only sanctioned way to change either baseline file; same rule as `coverage-floor.json` above.
- Both `scripts/check-lint-baseline.test.mjs` and `scripts/check-baseline-not-increased.test.mjs` exist and pass but, like the coverage gate tests, are **not run in CI** — run `node --test scripts/*.test.mjs` manually when touching any gate script.

## Formatting

- `npm run format:check` / `npm run format` (Prettier). Applies to the whole repo — remember to run it on new root-level `scripts/*.mjs` files too, not just `src/`.

## CI workflows

- `.github/workflows/ci.yml` — installs both workspaces, runs `npm --prefix test-app test`, then `npm run coverage:check`.
- `.github/workflows/lint.yml` — format check, baseline-not-increased guard, `ng lint` + baseline gate for both workspaces.
- `.github/workflows/e2e.yml` — Playwright smoke test.
- `.github/workflows/publish.yml` — npm Trusted Publisher (OIDC) flow, gated on `validate:publish`; only trigger is a GitHub Release (or a dry-run `workflow_dispatch`).

## Angular / TypeScript quirks

- Root `tsconfig.json` targets `es2015`/`commonjs` with `strictNullChecks: false` — this is a legacy config for the raw-source library, distinct from `test-app`'s stricter `tsconfig.spec.json` (`es2022`, TestBed/Vitest types). Don't assume one workspace's TS settings apply to the other.
- `test-app/src/test-setup.ts` shims several `jsdom` gaps Karma never needed to care about: `Element.scrollIntoView`, `Element.innerText` (falls back to `textContent`), and `Element.animate` (Web Animations API used by `@angular/animations`). If a spec hangs or throws on one of these, check this file before adding a per-spec workaround.
- `@gsa-sam/icons` is a `test-app`-only dependency (not a root peerDependency) but is imported by root library source (e.g. `header-next`); it's aliased explicitly in `vitest.config.mts` since specs run directly against root `src/` and Node's module resolution wouldn't otherwise reach `test-app/node_modules`.
