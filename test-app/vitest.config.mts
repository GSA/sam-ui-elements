/// <reference types="vitest" />
import { defineConfig } from "vite";
import { coverageConfigDefaults } from "vitest/config";
import { resolve } from "path";
import angular from "@analogjs/vite-plugin-angular";

// Coverage settings MUST live in this root config. Vitest only reads
// coverage options from the root vitest.config.ts; a shared/extended base
// config would have its coverage options silently ignored, falling back
// to Vitest's own defaults (html + clover + json) instead of lcov.info.
export default defineConfig({
  server: {
    fs: {
      allow: [resolve(__dirname, "..")],
    },
  },
  plugins: [
    angular({
      tsconfig: resolve(__dirname, "src/tsconfig.spec.json"),
      jit: true,
    }),
  ],
  resolve: {
    dedupe: [
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
      "zone.js",
    ],
    alias: [
      {
        find: "@gsa-sam/sam-ui-elements",
        replacement: resolve(__dirname, "../index.ts"),
      },
      {
        // src/ui-kit/components/header-next/header.component.ts imports
        // @gsa-sam/icons, which is only declared as a test-app dependency
        // (not a root peerDependency of the library). Since specs now run
        // directly against the root src/ tree instead of being copied into
        // test-app/src/components, Node's node_modules directory walk no
        // longer reaches test-app/node_modules on its own — alias it
        // explicitly.
        find: "@gsa-sam/icons",
        replacement: resolve(__dirname, "node_modules/@gsa-sam/icons"),
      },
    ],
  },
  test: {
    globals: true,
    // it.skip-only files/suites (e.g. label-wrapper, fieldset-wrapper, the
    // fully-commented-out alert.spec.ts) intentionally contain zero runnable
    // tests. Vitest's default behaviour is to fail a suite/file with no
    // executed tests; Karma/Jasmine did not enforce this, so preserve the
    // previous behavior instead of failing the whole run over legitimately
    // all-skipped files.
    passWithNoTests: true,
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
    include: [
      resolve(__dirname, "src/**/*.spec.ts"),
      resolve(__dirname, "../src/**/*.spec.ts"),
    ],
    exclude: [
      // Not test files despite the .spec.ts name — shared test-data helpers
      // imported by their sibling *.component.spec.ts files.
      "**/autocomplete-seach-test-service.spec.ts",
      "**/hierarchical-test-service.spec.ts",
    ],
    coverage: {
      provider: "istanbul",
      reporter: ["text-summary", "lcovonly"],
      reportsDirectory: "coverage",
      // Specs run directly against the library's root `../src` tree instead
      // of a copy inside test-app/src; without this, Vitest's coverage
      // provider treats any covered file outside test-app's root as
      // "external" and silently drops it from the report.
      allowExternal: true,
      // Vitest's coverage.all defaults to true, which walks the whole
      // project for source files (respecting extension/exclude) and reports
      // 0%-covered entries for anything never touched by a test. Karma's
      // coverage only ever instrumented files that specs actually imported,
      // so app scaffolding/config files (test-app's own bootstrap, build
      // config, environment files) never showed up in its lcov.info. Match
      // that scope instead of inflating the denominator with untested
      // harness files that have nothing to do with the library under test.
      exclude: [
        ...(coverageConfigDefaults.exclude ?? []),
        "src/main.ts",
        "src/app/app.module.ts",
        "src/environments/**",
        "playwright.config.ts",
      ],
    },
  },
});
