#!/usr/bin/env node
/**
 * Ratcheting coverage gate for the test-app Vitest harness.
 *
 * Floors live in `coverage-floor.json` at the repo root, not hardcoded in
 * this script, so that ordinary feature/spec PRs never need to touch the
 * gate itself. That file is a *ratchet*: only ever raise it. Feature/spec
 * PRs must NOT edit `coverage-floor.json` directly — that is the exact
 * shared-file conflict this mechanism exists to avoid on parallel PRs. When
 * coverage genuinely improves, lock the gain in with a dedicated bump:
 *
 *     npm run coverage:bump
 *
 * which rewrites `coverage-floor.json` to the current measured values.
 * Commit that on its own so the shared floor file rarely collides.
 *
 * Usage:
 *   node scripts/check-coverage.mjs [path/to/coverage-summary.json]
 *   node scripts/check-coverage.mjs --bump [path/to/coverage-summary.json]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const METRICS = ["statements", "branches", "functions", "lines"];

const scriptDir = dirname(fileURLToPath(import.meta.url));
const floorPath = resolve(scriptDir, "..", "coverage-floor.json");

const args = process.argv.slice(2);
const bump = args.includes("--bump");
const summaryArg = args.find((arg) => !arg.startsWith("--"));
const summaryPath = resolve(
  summaryArg ?? "test-app/coverage/coverage-summary.json"
);

let total;
try {
  total = JSON.parse(readFileSync(summaryPath, "utf8")).total;
} catch (error) {
  console.error(`✖ Could not read coverage summary at ${summaryPath}`);
  console.error(`  ${error.message}`);
  console.error("  Run `npm --prefix test-app test` first to generate it.");
  process.exit(1);
}

let floors;
try {
  floors = JSON.parse(readFileSync(floorPath, "utf8"));
} catch (error) {
  console.error(`✖ Could not read coverage floors at ${floorPath}`);
  console.error(`  ${error.message}`);
  process.exit(1);
}

if (bump) {
  const next = {};
  let raised = false;
  for (const metric of METRICS) {
    const pct = total?.[metric]?.pct;
    if (typeof pct !== "number") {
      console.error(`✖ ${metric}: missing from coverage summary; cannot bump.`);
      process.exit(1);
    }
    const rawCurrent = floors[metric];
    // Treat a missing or malformed floor as 0 so a corrupt
    // coverage-floor.json can never poison the ratchet with NaN/null values.
    const current = Number.isFinite(rawCurrent) ? rawCurrent : 0;
    // Ratchet only ever moves up. Preserve the fractional measured value
    // (istanbul reports two decimal places) rather than flooring it, so a
    // sub-1% improvement (e.g. 53.12% -> 53.87%) is still locked in instead
    // of silently discarded.
    next[metric] = Math.max(current, pct);
    if (next[metric] > current) {
      raised = true;
      console.log(
        `  ↑ ${metric.padEnd(11)} ${current}% → ${next[metric]}% (measured ${pct.toFixed(2)}%)`
      );
    } else {
      console.log(
        `  = ${metric.padEnd(11)} ${current}% (measured ${pct.toFixed(2)}%)`
      );
    }
  }
  if (!raised) {
    console.log(
      "\n✓ Floors already at or above current coverage; nothing to bump."
    );
    process.exit(0);
  }
  writeFileSync(floorPath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(
    `\n✓ Wrote raised floors to ${floorPath}. Commit this change on its own.`
  );
  process.exit(0);
}

const failures = [];
for (const metric of METRICS) {
  const floor = floors[metric];
  const pct = total?.[metric]?.pct;
  if (!Number.isFinite(floor)) {
    failures.push(`${metric}: missing or invalid in coverage-floor.json`);
    continue;
  }
  if (typeof pct !== "number") {
    failures.push(`${metric}: missing from coverage summary`);
    continue;
  }
  const status = pct >= floor ? "✓" : "✖";
  const line = `  ${status} ${metric.padEnd(11)} ${pct.toFixed(2)}% (floor ${floor}%)`;
  if (pct < floor) {
    failures.push(line.trim());
  }
  console.log(line);
}

if (failures.length > 0) {
  console.error("\n✖ Coverage gate failed:");
  for (const failure of failures) {
    console.error(`  ${failure}`);
  }
  console.error(
    "\nCoverage dropped below the committed ratchet in coverage-floor.json.\n" +
      "Add tests to restore it — do not lower the floors to go green."
  );
  process.exit(1);
}

console.log("\n✓ Coverage gate passed.");
