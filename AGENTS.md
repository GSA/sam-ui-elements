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
- **`test-app` renders library components via the routed gallery shell** described below (established in #665) — a new component under test gets its own `<name>-gallery` route rather than hand-rolled harness scaffolding.

### Playwright component-render harness (`test-app` gallery routes)

`test-app` doubles as a real-browser render harness for library components that Vitest/jsdom can't meaningfully exercise (real layout, real CSS cascade, real animations). The convention, established in #665:

- **One route per component/feature under test.** `test-app/src/app/app.module.ts` wires each gallery route (e.g. `/tabs` → `TabsGalleryComponent`) alongside the `/` home route that `smoke.spec.ts` asserts against. Add a new `<name>-gallery` component + route for each new component you need to render, rather than growing one shared route.
- **`test-app/tsconfig.json` / `src/tsconfig.app.json` `paths`** map `@gsa-sam/sam-ui-elements` (and deep imports like `@gsa-sam/sam-ui-elements/src/ui-kit/experimental/tabs`) straight to the root `src/` tree, with `skipLibCheck: true` — this is what lets a gallery route import and render library source directly, the same way `vitest.config.mts`'s alias does for specs.
- **`BrowserAnimationsModule`, not `NoopAnimationsModule`**, is registered in `app.module.ts` — real animations (e.g. `tab-body.ts`'s `translateTab` trigger) need to actually run for a browser test to exercise them.
- **`test-app/esbuild/dedupe-angular-plugin.ts`** exists because library source under root `src/` and `test-app/src/app/**` resolve the same `@angular/*`/`rxjs`/`zone.js`/FontAwesome package names from two different `node_modules` starting points, which esbuild otherwise treats as two live copies — splitting Angular's DI-context tracking and throwing `NG0203 (MISSING_INJECTION_CONTEXT)`, or duplicating FontAwesome's icon registry, as soon as a root-tree component is instantiated. It forces every resolution of the shared package list to the single copy under `test-app/node_modules`. That package list lives in `test-app/dedupe-packages.ts` and is imported by both this plugin and `vitest.config.mts`'s `resolve.dedupe` — **edit that one file**, not either config, when the set of packages needing dedup changes; the two lists must stay identical or the next gallery route risks silently reintroducing `NG0203`.
- `test-app/angular.json`'s `build`/`serve` targets use `@angular-builders/custom-esbuild` (still esbuild/Vite under the hood, not webpack) specifically so `dedupe-angular-plugin.ts` can be registered as a build plugin.
- New e2e specs go in `test-app/e2e/`; assert deterministic, cascade-level properties (`getComputedStyle`/`toHaveCSS`, bounding boxes) rather than racing a fixed timeout against animation/detach timing — see `test-app/e2e/tabs.spec.ts`.

## Lint

- `npm run lint` (root) / `npm --prefix test-app run lint` run `ng lint` (ESLint) per workspace.
- A ratcheting warning-baseline gate works the same way as coverage: `eslint-baseline.json` (keys `root`, `test-app`) + `scripts/check-lint-baseline.mjs` fail the build if warnings exceed the recorded baseline, or if there are _any_ errors (errors always fail regardless of the baseline). `--bump` only ever lowers the baseline.
- `.github/workflows/lint.yml` additionally runs `scripts/check-baseline-not-increased.mjs`, comparing `eslint-baseline.json` on the PR branch against the base branch — this closes the hole where a contributor could raise the ceiling by hand-editing the JSON in the same PR that adds new warnings. The `--bump` scripts are the only sanctioned way to change either baseline file; same rule as `coverage-floor.json` above.
- Both `scripts/check-lint-baseline.test.mjs` and `scripts/check-baseline-not-increased.test.mjs` exist and pass but, like the coverage gate tests, are **not run in CI** — run `node --test scripts/*.test.mjs` manually when touching any gate script.

### Standalone-component lint policy (deferred)

`@angular-eslint/prefer-standalone` is **disabled** (not just downgraded to a warning) in both `eslint.config.mjs` (root) and `test-app/eslint.config.mjs`. This is a deliberate, evaluated decision (GSA/sam-ui-elements#584), not an oversight:

- Of the 190 flagged components (root) and 3 (`test-app`), all but one already have `standalone: false` and are registered via `declarations:` in one of 46 `NgModule`s across the library. The single `standalone: true` outlier (`SamAutocompleteComponent`) is still consumed through `declarations:` in two NgModules, so the flag doesn't reflect real usage either.
- Applying ESLint's own `--fix` for this rule strips `standalone: false`, flipping Angular's default to `standalone: true`. This was tried in #582/PR #675 and broke `TestBed.configureTestingModule` for every spec declaring one of these components — 827 failing tests. It is a behavior change, not a style fix, so it cannot be autofixed or done piecemeal without also rewriting every consuming `NgModule`'s `declarations:` to `imports:` and updating every affected spec's `TestBed` config (106+ specs use `declarations:`).
- Several of the affected files (e.g. `hierarchical.module`, `progress.module`, `autocomplete.module`, `progress.component`, `autocomplete-multiselect.component`, `radiobutton.component`, `text.component`, `toolbar.component`) are in the frozen `scripts/consumer-deep-imports.json` contract — an uncoordinated standalone migration risks a breaking change for downstream consumers, not just an internal refactor.
- **Decision: defer.** A real standalone migration is out of scope for lint-debt cleanup and would need its own epic, planned in consumer-safe slices (NgModule → `imports:` rewrites, spec updates, coordinated consumer rollout) rather than a mechanical lint fix. Until that epic exists, the rule stays off so it doesn't produce unactionable warnings.

## Formatting

- `npm run format:check` / `npm run format` (Prettier). Applies to the whole repo — remember to run it on new root-level `scripts/*.mjs` files too, not just `src/`.

## CI workflows

- `.github/workflows/ci.yml` — installs both workspaces, runs `npm --prefix test-app test`, then `npm run coverage:check`.
- `.github/workflows/lint.yml` — format check, baseline-not-increased guard, `ng lint` + baseline gate for both workspaces.
- `.github/workflows/e2e.yml` — Playwright smoke test.
- `.github/workflows/security.yml` — DAST (OWASP ZAP) against `test-app` built in production mode; SAST is GitHub CodeQL default setup (no committed workflow). See `docs/security-scanning.md`.
- `.github/workflows/publish.yml` — npm Trusted Publisher (OIDC) flow, gated on `validate:publish`; only trigger is a GitHub Release (or a dry-run `workflow_dispatch`).

## Angular / TypeScript quirks

- Root `tsconfig.json` targets `es2015`/`commonjs` with `strictNullChecks: false` — this is a legacy config for the raw-source library, distinct from `test-app`'s stricter `tsconfig.spec.json` (`es2022`, TestBed/Vitest types). Don't assume one workspace's TS settings apply to the other.
- `test-app/src/test-setup.ts` shims several `jsdom` gaps Karma never needed to care about: `Element.scrollIntoView`, `Element.innerText` (falls back to `textContent`), and `Element.animate` (Web Animations API used by `@angular/animations`). If a spec hangs or throws on one of these, check this file before adding a per-spec workaround.
- `@gsa-sam/icons` is a `test-app`-only dependency (not a root peerDependency) but is imported by root library source (e.g. `header-next`); it's aliased explicitly in `vitest.config.mts` since specs run directly against root `src/` and Node's module resolution wouldn't otherwise reach `test-app/node_modules`.
