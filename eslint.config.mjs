import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import browserSecurity from 'eslint-plugin-browser-security';
import nodeSecurity from 'eslint-plugin-node-security';
import secureCoding from 'eslint-plugin-secure-coding';

const asWarnings = (configs) => Object.fromEntries(
  configs.flatMap((config) => Object.entries(config.rules || {}))
    .map(([rule, setting]) => [
      rule,
      setting === 'off' || setting === 0
        ? 'off'
        : Array.isArray(setting)
          ? ['warn', ...setting.slice(1)]
          : 'warn',
    ]),
);

const recommendedTypeScriptWarnings = asWarnings([
  ...tseslint.configs.recommended,
  ...angular.configs.tsRecommended,
]);

const accessibilityWarnings = asWarnings(
  angular.configs.templateAccessibility,
);

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/ui-kit/experimental/patterns/layout/components/core/**',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: recommendedTypeScriptWarnings,
  },
  {
    files: ['**/*.html'],
    extends: angular.configs.templateAccessibility,
    rules: accessibilityWarnings,
  },
  // Security rules, CWE- and CVSS-tagged. Measured against this repository
  // before being proposed: 0 findings across 42.5 KLOC.
  {
    files: ['**/*.ts'],
    plugins: {
      'browser-security': browserSecurity,
      'secure-coding': secureCoding,
    },
    rules: {
      ...browserSecurity.configs.recommended.rules,
      ...secureCoding.configs.recommended.rules,
    },
  },
  // The build and publish scripts are plain JS, so the blocks above never
  // reach them — `files: ['**/*.ts']` does not match `.js` or `.mjs`. They run
  // in Node with repository write access during release, which is the one place
  // a shell or path bug matters most here.
  //
  // Scoped to the paths `npm run lint:security` passes to ESLint. A wider glob
  // would be inert: `npm run lint` is `ng lint`, and the Angular builder hands
  // ESLint exactly the `lintFilePatterns` from angular.json — `src/**/*.ts`
  // and `src/**/*.html` — so no `.js` file is ever presented to this config,
  // whatever it matches. test-app is not covered here either: ESLint resolves
  // the nearest flat config, which for `test-app/karma.conf.js` is
  // `test-app/eslint.config.mjs`, not this file.
  {
    files: ['scripts/**/*.{js,mjs,cjs}', 'mock-test.js'],
    plugins: {
      'node-security': nodeSecurity,
      'secure-coding': secureCoding,
    },
    rules: {
      ...nodeSecurity.configs.recommended.rules,
      ...secureCoding.configs.recommended.rules,
    },
  },
);
