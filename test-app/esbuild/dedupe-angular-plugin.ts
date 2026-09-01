import type { Plugin, PluginBuild } from "esbuild";
import * as path from "node:path";
import { DEDUPED_PACKAGES } from "../dedupe-packages";

/**
 * test-app compiles the library straight from its raw root `src/` tree
 * (see tsconfig `paths` mapping `@gsa-sam/sam-ui-elements` -> `../index.ts`)
 * rather than from a published npm package. Because those library source
 * files physically live outside `test-app/`, esbuild's default node_modules
 * directory-walk resolves their `@angular/*`, `@angular/cdk/*`, `rxjs`, and
 * FontAwesome imports starting from the *repo root* `node_modules`, while
 * `test-app/src/app/**` files resolve the very same package names starting
 * from `test-app/node_modules`. Both installs are the same version, but
 * esbuild treats them as two distinct modules, so the app ends up with two
 * live copies of `@angular/core` in one bundle. Angular's DI context
 * tracking depends on module-scoped globals in `@angular/core`, so a split
 * copy breaks it, surfacing as a runtime `NG0203 (MISSING_INJECTION_CONTEXT)`
 * error as soon as any component from the root `src/` tree is instantiated.
 * (`zone.js` is not in the shared dedupe list: it only enters the bundle via
 * the `polyfills` array below, which esbuild already resolves starting from
 * `test-app`, so no source file's import of it needs rewriting.)
 *
 * This plugin forces every resolution of these packages (regardless of
 * which file is doing the importing) to the single copy installed under
 * `test-app/node_modules`, mirroring the `resolve.dedupe` workaround that
 * `vitest.config.mts` already applies for the Vitest/Vite unit-test path.
 * `DEDUPED_PACKAGES` is shared between the two configs (see
 * `dedupe-packages.ts`) so the lists can't drift out of sync again.
 */

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

    build.onResolve({ filter }, async (args) => {
      // `build.resolve()` re-runs esbuild's full resolution pipeline
      // (including this same `onResolve` hook) for the path it's given, so
      // without this re-entry guard the call below would recurse into
      // itself forever. `pluginData` round-trips through that re-entrant
      // call, so on the second pass we just return `undefined` and let
      // esbuild's own default resolver (scoped to `resolveDir` below) run.
      if (args.pluginData?.dedupeAngularResolved) {
        return undefined;
      }

      // Re-resolve using esbuild's own resolver rather than Node's
      // `require.resolve`, which forces the `require` export condition and
      // would pick e.g. rxjs's CommonJS entry over its ESM one -- inflating
      // the bundle and triggering "not ESM" optimization-bailout warnings.
      // Pointing `resolveDir` at `test-app` is what forces the single
      // shared copy; esbuild's normal condition/extension resolution still
      // applies on top, so the ESM entry is still picked when available.
      const result = await build.resolve(args.path, {
        kind: args.kind,
        resolveDir: testAppRoot,
        pluginData: { dedupeAngularResolved: true },
      });
      if (result.errors.length > 0) {
        // Fall back to default resolution if test-app doesn't have this
        // subpath installed (lets esbuild report its own clearer error).
        return undefined;
      }
      return { path: result.path };
    });
  },
};

export default dedupeAngularPlugin;
