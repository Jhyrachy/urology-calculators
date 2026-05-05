import { meta, calculate } from '../calculators/plr.js';

export const tests = [
  ['meta: id and category', (e, meta) => {
    e(meta.id).toBe('plr');
    e(meta.category).toBe('blood-count');
  }],
  ['calculates PLR: 300/2 = 150', (e, _, calc) => {
    const r = calc({ platelets: 300, alc: 2.0 });
    e(r.result).toBe(150);
  }],
  ['error for negative platelets', (e, _, calc) => {
    const r = calc({ platelets: -1, alc: 2.0 });
    e(r.error).toBeDefined();
  }],
  ['high PLR: result > 250', (e, _, calc) => {
    const r = calc({ platelets: 400, alc: 2.0 });
    e(r.result).toBeGreaterThan(250);
  }],
];