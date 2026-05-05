import { meta, calculate } from '../calculators/nlr.js';

export const tests = [
  ['meta: id and category', (e, meta) => {
    e(meta.id).toBe('nlr');
    e(meta.category).toBe('blood-count');
  }],
  ['calculates NLR: 6.0/2.0 = 3.0', (e, _, calc) => {
    const r = calc({ anc: 6.0, alc: 2.0 });
    e(r.result).toBeCloseTo(3.0, 1);
  }],
  ['error for negative ANC', (e, _, calc) => {
    const r = calc({ anc: -1, alc: 2.0 });
    e(r.error).toBeDefined();
  }],
  ['normal NLR: result < 3', (e, _, calc) => {
    const r = calc({ anc: 2.0, alc: 1.0 });
    e(r.result).toBeLessThan(3);
  }],
  ['high NLR: result > 5', (e, _, calc) => {
    const r = calc({ anc: 10.0, alc: 2.0 });
    e(r.result).toBeGreaterThan(5);
  }],
];