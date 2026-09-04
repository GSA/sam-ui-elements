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

// @angular-eslint/prefer-standalone is intentionally disabled; see the
// matching rationale in the root eslint.config.mjs and AGENTS.md
// "Standalone-component lint policy (deferred)" (GSA/sam-ui-elements#584).
recommendedTypeScriptWarnings["@angular-eslint/prefer-standalone"] = "off";

const accessibilityWarnings = asWarnings(angular.configs.templateAccessibility);

export default tseslint.config(
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**", "src/components/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: recommendedTypeScriptWarnings,
  },
  {
    files: ["**/*.html"],
    extends: angular.configs.templateAccessibility,
    rules: accessibilityWarnings,
  }
);
