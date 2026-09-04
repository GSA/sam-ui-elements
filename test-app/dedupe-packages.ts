/**
 * Single source of truth for which packages must resolve to one physical
 * copy across `test-app`'s two build/test paths:
 *
 * - `vitest.config.mts` (`resolve.dedupe`) for the Vitest/unit-test path.
 * - `esbuild/dedupe-angular-plugin.ts` for the `ng build`/`ng serve`
 *   (esbuild) path, which Playwright's `test:e2e` webServer boots.
 *
 * Both paths hit the same root cause: library source under root `src/`
 * resolves these packages starting from the *repo root* `node_modules`,
 * while `test-app/src/app/**` resolves the same package names starting
 * from `test-app/node_modules`. Even though both installs are the same
 * version, the bundler/test runner treats them as two distinct modules,
 * which splits Angular's DI-context tracking (`@angular/core`) and
 * FontAwesome's icon registry (`@fortawesome/fontawesome-svg-core`) across
 * two live copies -- surfacing as `NG0203 (MISSING_INJECTION_CONTEXT)` or
 * missing icons as soon as a root-tree component that uses either is
 * instantiated. Previously these two lists were maintained separately and
 * had already drifted (the esbuild list was missing the two FontAwesome
 * entries); import this shared array in both places instead of copying it,
 * so that drift is no longer possible.
 */
export const DEDUPED_PACKAGES = [
  "@angular/core",
  "@angular/common",
  "@angular/compiler",
  "@angular/platform-browser",
  "@angular/platform-browser-dynamic",
  "@angular/forms",
  "@angular/router",
  "@angular/cdk",
  "@angular/animations",
  "@fortawesome/angular-fontawesome",
  "@fortawesome/fontawesome-svg-core",
  "rxjs",
  "@ngx-formly/core",
];
