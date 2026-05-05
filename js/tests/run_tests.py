#!/usr/bin/env python3
"""
Zero-dependency test runner — Python stdlib + Node.js.
Python orchestrates, Node.js executes calculator tests.
Each test file: js/tests/*.test.mjs exports: export const tests = [['name', fn], ...]

Usage:
    python3 js/tests/run_tests.py
"""
import subprocess, os, sys, tempfile

NODE = os.environ.get('NODE', 'node')
TEST_DIR = os.path.dirname(os.path.abspath(__file__))
CALC_DIR = os.path.join(TEST_DIR, '..', 'calculators')

passed = failed = 0
failures = []

JS = r"""
import { readFileSync } from 'fs';
const [calcPath, testPath] = process.argv.slice(2);
const calc = await import('file://' + calcPath);
const { tests } = await import('file://' + testPath);

const expect = v => ({
  toBe: e => { if (v !== e) throw Error(`Expected ${e}, got ${v}`); },
  toEqual: e => { if (JSON.stringify(v) !== JSON.stringify(e)) throw Error(`Expected ${JSON.stringify(e)}, got ${JSON.stringify(v)}`); },
  toBeCloseTo: (e, p=2) => { const x=10**p; if (Math.round(v*x) !== Math.round(e*x)) throw Error(`Expected ~${e}, got ${v}`); },
  toBeGreaterThan: e => { if (v <= e) throw Error(`Expected > ${e}, got ${v}`); },
  toBeLessThan: e => { if (v >= e) throw Error(`Expected < ${e}, got ${v}`); },
  toBeLessThanOrEqual: e => { if (v > e) throw Error(`Expected <= ${e}, got ${v}`); },
  toContain: e => { if (!String(v).includes(e)) throw Error(`"${v}" does not contain "${e}"`); },
  toBeDefined: () => { if (v === undefined) throw Error(`Expected defined`); },
  toBeNull: () => { if (v !== null) throw Error(`Expected null, got ${v}`); },
  toHaveLength: n => { if (!v || v.length !== n) throw Error(`Expected length ${n}, got ${v?.length}`); },
});

for (const [name, fn] of tests) {
  try {
    fn(expect, calc.meta, calc.calculate, calc.interpret);
    console.log('PASS ' + name);
  } catch(e) {
    console.log('FAIL ' + name + ': ' + e.message);
  }
}
"""

for fname in sorted(os.listdir(TEST_DIR)):
    if not fname.endswith('.test.mjs'):
        continue
    test_path = os.path.join(TEST_DIR, fname)
    calc_path = os.path.join(CALC_DIR, fname[:-9] + '.js')  # .test.mjs → .js (remove 9 chars: .test.mjs)

    if not os.path.exists(calc_path):
        print(f"  SKIP {fname} (no calculator)")
        continue

    print(f"\n  {fname}")
    r = subprocess.run(
        [NODE, '--input-type=module', '--eval', JS, calc_path, test_path],
        capture_output=True, text=True, timeout=15, cwd=TEST_DIR
    )

    for line in r.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        if line.startswith('PASS'):
            passed += 1
            print(f"    ✓ {line[5:]}")
        elif line.startswith('FAIL'):
            failed += 1
            msg = line[5:]
            failures.append(f"{fname} {msg}")
            print(f"    ✗ {msg}")
        else:
            print(f"    {line}")

    if r.stderr and 'PASS' not in r.stdout and 'FAIL' not in r.stdout:
        err = r.stderr.strip().split('\n')[0][:120]
        print(f"    ERROR: {err}")

print(f"\n{'─'*50}")
print(f"Results: {passed} passed, {failed} failed")
for f in failures: print(f"  {f}")
sys.exit(1 if failed else 0)
