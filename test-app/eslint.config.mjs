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

// Template accessibility debt (see #583) has been fully resolved in this
// workspace (0 findings). Per #580's promotion policy, these rules are
// enforced at the plugin's own recommended `error` severity instead of being
// downgraded to warnings, matching the root workspace's `eslint.config.mjs`.

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
  }
);
