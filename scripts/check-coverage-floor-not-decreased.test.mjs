#!/usr/bin/env node
/**
 * Tests for scripts/check-coverage-floor-not-decreased.mjs — the CI-only
 * guard that compares coverage-floor.json on a PR branch against the base
 * branch's version and fails if any metric's floor decreased.
 *
 * Run: node --test scripts/check-coverage-floor-not-decreased.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const script = join(scriptDir, "check-coverage-floor-not-decreased.mjs");

function run(args) {
  try {
    const stdout = execFileSync("node", [script, ...args], {
      encoding: "utf8",
    });
    return { status: 0, stdout, stderr: "" };
  } catch (error) {
    return {
      status: error.status ?? 1,
      stdout: error.stdout?.toString() ?? "",
      stderr: error.stderr?.toString() ?? "",
    };
  }
}

function withTempDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), "floor-guard-"));
  try {
    return fn(dir);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function writeFloors(dir, name, data) {
  const path = join(dir, name);
  writeFileSync(path, JSON.stringify(data));
  return path;
}

test("passes when the floor is unchanged", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const head = writeFloors(dir, "head.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const { status } = run([base, head]);
    assert.equal(status, 0);
  });
});

test("passes when a floor is raised", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const head = writeFloors(dir, "head.json", {
      statements: 60,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const { status } = run([base, head]);
    assert.equal(status, 0);
  });
});

test("fails when a floor is lowered", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const head = writeFloors(dir, "head.json", {
      statements: 30,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const { status, stderr } = run([base, head]);
    assert.equal(status, 1);
    assert.match(stderr, /statements: coverage floor decreased 53% → 30%/);
  });
});

test("fails when any of multiple metrics is lowered", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 52,
    });
    const head = writeFloors(dir, "head.json", {
      statements: 53,
      branches: 39,
      functions: 50,
      lines: 10,
    });
    const { status, stderr } = run([base, head]);
    assert.equal(status, 1);
    assert.match(stderr, /lines: coverage floor decreased 52% → 10%/);
  });
});

test("allows a brand-new metric entry not present on the base branch", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", { statements: 53 });
    const head = writeFloors(dir, "head.json", {
      statements: 53,
      "new-metric": 1,
    });
    const { status } = run([base, head]);
    assert.equal(status, 0);
  });
});

test("treats a missing base-branch floor file as an empty floor set", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", {});
    const head = writeFloors(dir, "head.json", { statements: 53 });
    const { status } = run([base, head]);
    assert.equal(status, 0);
  });
});

test("fails on a non-numeric floor value", () => {
  withTempDir((dir) => {
    const base = writeFloors(dir, "base.json", { statements: 53 });
    const head = writeFloors(dir, "head.json", { statements: "fifty-three" });
    const { status, stderr } = run([base, head]);
    assert.equal(status, 1);
    assert.match(stderr, /invalid coverage-floor value/);
  });
});

test("exits non-zero with usage when arguments are missing", () => {
  const { status, stderr } = run([]);
  assert.equal(status, 1);
  assert.match(stderr, /Usage:/);
});
