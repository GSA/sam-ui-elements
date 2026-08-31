import type { Plugin, PluginBuild } from "esbuild";
import * as path from "node:path";

/**
 * test-app compiles the library straight from its raw root `src/` tree
 * (see tsconfig `paths` mapping `@gsa-sam/sam-ui-elements` -> `../index.ts`)
 * rather than from a published npm package. Because those library source
 * files physically live outside `test-app/`, esbuild's default node_modules
 * directory-walk resolves their `@angular/*`, `@angular/cdk/*`, `rxjs`, and
 * `zone.js` imports starting from the *repo root* `node_modules`, while
 * `test-app/src/app/**` files resolve the very same package names starting
 * from `test-app/node_modules`. Both installs are the same version, but
 * esbuild treats them as two distinct modules, so the app ends up with two
 * live copies of `@angular/core` in one bundle. Angular's DI context
 * tracking depends on module-scoped globals in `@angular/core`, so a split
 * copy breaks it, surfacing as a runtime `NG0203 (MISSING_INJECTION_CONTEXT)`
 * error as soon as any component from the root `src/` tree is instantiated.
 *
 * This plugin forces every resolution of these packages (regardless of
 * which file is doing the importing) to the single copy installed under
 * `test-app/node_modules`, mirroring the `resolve.dedupe` workaround that
 * `vitest.config.mts` already applies for the Vitest/Vite unit-test path.
 */
const DEDUPED_PACKAGES = [
  "@angular/core",
  "@angular/common",
  "@angular/compiler",
  "@angular/platform-browser",
  "@angular/platform-browser-dynamic",
  "@angular/forms",
  "@angular/router",
  "@angular/cdk",
  "@angular/animations",
  "rxjs",
  "zone.js",
];

function buildFilter(): RegExp {
  const escaped = DEDUPED_PACKAGES.map((pkg) =>
    pkg.replace(/[/\\^$.*+?()[\]{}|]/g, "\\$&")
  );
  // Match the bare package name or any deep import beneath it
  // (e.g. "@angular/cdk/overlay", "rxjs/operators").
  return new RegExp(`^(?:${escaped.join("|")})(?:/.*)?$`);
}

const dedupeAngularPlugin: Plugin = {
  name: "dedupe-angular",
  setup(build: PluginBuild) {
    const testAppRoot = path.resolve(__dirname, "..");
    const filter = buildFilter();

    build.onResolve({ filter }, (args) => {
      try {
        const resolved = require.resolve(args.path, { paths: [testAppRoot] });
        return { path: resolved };
      } catch {
        // Fall back to default resolution if test-app doesn't have this
        // subpath installed (lets esbuild report its own clearer error).
        return undefined;
      }
    });
  },
};

export default dedupeAngularPlugin;
