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
- Coverage is enforced by a ratcheting floor gate: `coverage-floor.json` at the repo root records minimum statements/branches/functions/lines percentages. `node scripts/check-coverage.mjs` (wired into CI as `npm run coverage:check`) fails with a clear per-metric message if measured coverage (from `test-app/coverage/coverage-summary.json`) drops below any floor.
- **`coverage-floor.json` is a ratchet — it only ever moves up, and only via a dedicated bump.** Feature and spec PRs must **not** edit `coverage-floor.json` directly; raising it is a separate, deliberate commit made with `npm run coverage:bump` (rewrites the floor file to the currently measured coverage, never lowering an existing entry). This avoids merge conflicts across parallel coverage-improvement PRs.
- The gate script itself is covered by `node --test scripts/check-coverage.test.mjs` (Node's built-in test runner, no extra deps). This is **not currently wired into any CI workflow** — run it manually after touching `scripts/check-coverage.mjs`.
- Playwright E2E smoke test (`test-app/e2e/`) runs via `npm --prefix test-app run test:e2e`, gated separately in `.github/workflows/e2e.yml`.

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
