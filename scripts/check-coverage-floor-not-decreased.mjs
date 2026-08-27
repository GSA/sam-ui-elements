#!/usr/bin/env node
/**
 * Guards against a coverage-floor being lowered directly in
 * coverage-floor.json rather than earned via `coverage:bump`.
 *
 * The per-metric gate (check-coverage.mjs) only evaluates the floors
 * committed on the branch being checked, so a contributor could lower a
 * floor (e.g. `statements` from 53 to 30) in the same PR that regresses
 * coverage, and the gate would still pass. This script closes that hole by
 * comparing coverage-floor.json on the PR branch against the base branch's
 * version and failing if any metric's floor decreased — the same shape as
 * check-baseline-not-increased.mjs for eslint-baseline.json.
 *
 * New metric keys that don't exist on the base branch are allowed (they
 * can't be "decreased" if there's nothing to compare against). Any increase
 * or unchanged value is allowed, matching the ratchet-only semantics of
 * `coverage:bump`.
 *
 * Usage:
 *   node scripts/check-coverage-floor-not-decreased.mjs <base-floor.json> <head-floor.json>
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const [baseArg, headArg] = process.argv.slice(2);

if (!baseArg || !headArg) {
  console.error(
    "Usage: node scripts/check-coverage-floor-not-decreased.mjs <base-floor.json> <head-floor.json>"
  );
  process.exit(1);
}

function loadFloors(label, path) {
  try {
    return JSON.parse(readFileSync(resolve(path), "utf8"));
  } catch (error) {
    console.error(`✖ Could not read ${label} coverage floors at ${path}`);
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

const base = loadFloors("base-branch", baseArg);
const head = loadFloors("pull-request", headArg);

let hasDecrease = false;

for (const metric of Object.keys(head)) {
  if (!(metric in base)) {
    // New metric entry — nothing to compare against, so it can't be a
    // decrease from a previously-trusted value.
    continue;
  }

  const baseValue = base[metric];
  const headValue = head[metric];

  if (!Number.isFinite(baseValue) || !Number.isFinite(headValue)) {
    console.error(
      `✖ ${metric}: invalid coverage-floor value (base: ${baseValue}, head: ${headValue})`
    );
    hasDecrease = true;
    continue;
  }

  if (headValue < baseValue) {
    console.error(
      `✖ ${metric}: coverage floor decreased ${baseValue}% → ${headValue}%. ` +
        "The committed floor can only go up (via `npm run coverage:bump`), never down. " +
        "Revert this change to coverage-floor.json."
    );
    hasDecrease = true;
  }
}

if (hasDecrease) {
  process.exit(1);
}

console.log(
  "✓ coverage-floor.json: no metric's floor decreased vs. the base branch."
);
