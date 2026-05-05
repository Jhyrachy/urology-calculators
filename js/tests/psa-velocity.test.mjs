import { meta, calculate } from '../calculators/psa-velocity.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('psa-velocity');
    e(m.category).toBe('kinetics');
  }],
  ['velocity ~2.0: PSA 2→4 over 1 year', (e, _, c) => {
    const r = c({ psa1: 2.0, psa2: 4.0, date1: '2023-01-01', date2: '2024-01-01' });
    e(r.result).toBeCloseTo(2.0, 1);
  }],
  ['negative velocity for decreasing PSA', (e, _, c) => {
    const r = c({ psa1: 4.0, psa2: 2.0, date1: '2023-01-01', date2: '2024-01-01' });
    e(r.result).toBeLessThan(0);
  }],
  ['error when date2 <= date1', (e, _, c) => {
    const r = c({ psa1: 2.0, psa2: 4.0, date1: '2024-01-01', date2: '2023-01-01' });
    e(r.error).toBeDefined();
  }],
  ['error for negative PSA', (e, _, c) => {
    const r = c({ psa1: -1, psa2: 2.0, date1: '2023-01-01', date2: '2024-01-01' });
    e(r.error).toBeDefined();
  }],
];