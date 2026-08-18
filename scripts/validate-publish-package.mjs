import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const REQUIRED_ENTRY_POINT = 'src/formly/index.ts';
const EXTENSIONS = ['', '.ts', '.js', '.scss', '.css', '/index.ts', '/index.js'];

const consumerImports = JSON.parse(
  readFileSync(new URL('./consumer-deep-imports.json', import.meta.url), 'utf8'),
);

function packedFiles() {
  const output = execFileSync('npm', ['pack', '--dry-run', '--json'], {
    encoding: 'utf8',
  });
  const result = JSON.parse(output)[0];
  if (!result?.files) throw new Error('npm pack did not return a file list');
  return new Set(result.files.map(({ path }) => path));
}

function trackedUiKitFiles() {
  return execFileSync('git', ['ls-files', 'src/ui-kit/**'], { encoding: 'utf8' })
    .trim()
    .split('\n')
    .filter(Boolean);
}

function resolvePackedImport(specifier, files) {
  const relativePath = specifier.replace('@gsa-sam/sam-ui-elements/', '');
  return EXTENSIONS.find((suffix) => files.has(`${relativePath}${suffix}`));
}

const files = packedFiles();
const uiKitFiles = trackedUiKitFiles();
const missing = [];

if (!files.has(REQUIRED_ENTRY_POINT)) missing.push(REQUIRED_ENTRY_POINT);

for (const path of uiKitFiles) {
  if (!files.has(path)) missing.push(path);
}

for (const [consumer, imports] of Object.entries(consumerImports)) {
  for (const specifier of imports) {
    if (!resolvePackedImport(specifier, files)) {
      missing.push(`${specifier} (used by ${consumer})`);
    }
  }
}

if (missing.length > 0) {
  console.error('Package is missing required public paths:');
  for (const path of missing) console.error(`- ${path}`);
  process.exit(1);
}

console.log(`Verified ${files.size} packed files.`);
console.log(`Verified ${uiKitFiles.length} tracked src/ui-kit files.`);
console.log(`Verified ${REQUIRED_ENTRY_POINT}.`);
console.log(
  `Verified ${Object.values(consumerImports).reduce((sum, imports) => sum + imports.length, 0)} consumer deep imports across ${Object.keys(consumerImports).length} repositories.`,
);
