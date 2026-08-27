# AGENTS.md

Guidance for AI coding agents working in this repository.

## Testing

- Library specs (`src/**/*.spec.ts`) run against the `test-app` workspace's Vitest harness (Analog's Angular Vite plugin + `@vitest/coverage-istanbul`). From the repo root: `npm ci && npm ci --prefix test-app && npm --prefix test-app test`.
- Coverage is enforced by a ratcheting floor gate: `coverage-floor.json` at the repo root records the minimum required statements/branches/functions/lines percentages, and `node scripts/check-coverage.mjs` (wired into CI as `npm run coverage:check`) fails the build with a clear per-metric message if measured coverage (from `test-app/coverage/coverage-summary.json`) drops below any floor.
- **`coverage-floor.json` is a ratchet — it only ever moves up, and only via a dedicated bump.** Feature and spec PRs must **not** edit `coverage-floor.json` directly; raising it is a separate, deliberate commit made with `npm run coverage:bump` (rewrites the floor file to the currently measured coverage, never lowering an existing entry). This keeps the shared floor file from becoming a merge-conflict magnet across parallel coverage-improvement PRs.
- The gate script itself is covered by `node --test scripts/check-coverage.test.mjs` (Node's built-in test runner, no extra deps).

## Lint

- `npm run lint` / `npm --prefix test-app run lint` run ESLint. A ratcheting warning-baseline gate (`eslint-baseline.json`, `scripts/check-lint-baseline.mjs`) works the same way as the coverage gate above — only ever lower the baseline via `--bump`, never raise it by hand.
