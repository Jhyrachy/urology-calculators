import { meta, calculate } from '../calculators/psa-doubling-time.js';

export const tests = [
  ['meta: id, name, category', (e, m) => {
    e(m.id).toBe('psa-doubling-time');
    e(m.name).toBe('PSA Doubling Time');
    e(m.category).toBe('kinetics');
  }],
  ['DT ~12mo: PSA 0.1→0.2 in 365 days', (e, _, c) => {
    const r = c({ psa1: 0.1, psa2: 0.2, delta_t: 365 });
    e(r.result).toBeCloseTo(12.0, 1);
  }],
  ['DT ~12mo: PSA 1→2 in 365 days', (e, _, c) => {
    const r = c({ psa1: 1.0, psa2: 2.0, delta_t: 365 });
    e(r.result).toBeCloseTo(12.0, 1);
  }],
  ['DT ~6mo: rapid doubling in 182 days', (e, _, c) => {
    const r = c({ psa1: 1.0, psa2: 2.0, delta_t: 182 });
    e(r.result).toBeCloseTo(6.0, 1);
  }],
  ['error when psa2 <= psa1', (e, _, c) => {
    const r = c({ psa1: 1.0, psa2: 0.5, delta_t: 180 });
    e(r.error).toBeDefined();
  }],
  ['error when delta_t <= 0', (e, _, c) => {
    const r = c({ psa1: 0.1, psa2: 0.2, delta_t: 0 });
    e(r.error).toBeDefined();
  }],
  ['null for non-rising PSA', (e, _, c) => {
    const r = c({ psa1: 0.2, psa2: 0.2, delta_t: 365 });
    e(r.result).toBeNull();
  }],
];