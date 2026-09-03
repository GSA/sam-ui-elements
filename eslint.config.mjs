import tseslint from "typescript-eslint";
import angular from "angular-eslint";

const asWarnings = (configs) =>
  Object.fromEntries(
    configs
      .flatMap((config) => Object.entries(config.rules || {}))
      .map(([rule, setting]) => [
        rule,
        setting === "off" || setting === 0
          ? "off"
          : Array.isArray(setting)
            ? ["warn", ...setting.slice(1)]
            : "warn",
      ])
  );

const recommendedTypeScriptWarnings = asWarnings([
  ...tseslint.configs.recommended,
  ...angular.configs.tsRecommended,
]);

// Template accessibility debt (see #583) has been fully resolved: every rule
// in `angular.configs.templateAccessibility` currently has 0 findings across
// both workspaces. Per #580's promotion policy ("resolved rule categories are
// promoted from warnings to errors"), these are enforced as errors directly
// from the plugin's own recommended severities rather than downgraded to
// warnings, so any future regression fails the build immediately instead of
// silently inflating the warning baseline.

// Bans the RxJS 5 "unbound operator" call pattern (e.g.
// `first.call(observable).subscribe(...)`), which throws
// `TypeError: ...subscribe is not a function` under RxJS 7 because an
// operator imported from `rxjs/operators` is a factory that returns an
// `OperatorFunction`, not something invocable via `.call(observable)`.
// The correct RxJS 7 form is `observable.pipe(operator())`.
//
// This targets the specific shape `<identifier>.call(<anything>).subscribe(...)`
// so it does not flag legitimate unrelated `.call()` usages such as
// `Object.prototype.toString.call(x)`, `Array.prototype.slice.call(list)`,
// or a plain callback's `callback.call(context, ...args)` (none of which
// chain a `.subscribe(...)` off the `.call(...)` result).
const noUnboundRxjsOperatorRule = {
  selector:
    "CallExpression[callee.property.name='subscribe'][callee.object.type='CallExpression'][callee.object.callee.property.name='call'][callee.object.callee.object.type='Identifier']",
  message:
    "Unbound RxJS operator call detected: `<operator>.call(observable).subscribe(...)` returns a function under RxJS 7, not an Observable, so `.subscribe(...)` throws at runtime. Use `observable.pipe(<operator>()).subscribe(...)` instead.",
};

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "src/ui-kit/experimental/patterns/layout/components/core/**",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      ...recommendedTypeScriptWarnings,
      "no-restricted-syntax": ["error", noUnboundRxjsOperatorRule],
    },
  },
  {
    files: ["**/*.html"],
    extends: angular.configs.templateAccessibility,
  }
);
