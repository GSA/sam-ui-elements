const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

const accessibilityWarnings = Object.fromEntries(
  angular.configs.templateAccessibility
    .flatMap((config) => Object.keys(config.rules || {}))
    .map((rule) => [rule, 'warn']),
);

module.exports = tseslint.config(
  { ignores: ['coverage/**', 'dist/**', 'node_modules/**', 'src/components/**'] },
  {
    files: ['**/*.ts'],
    extends: [angular.configs.tsRecommended[0]],
    processor: angular.processInlineTemplates,
  },
  {
    files: ['**/*.html'],
    extends: angular.configs.templateAccessibility,
    rules: accessibilityWarnings,
  },
);
