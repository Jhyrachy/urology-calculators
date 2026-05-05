import { meta, calculate, interpret } from '../calculators/fpsa.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('fpsa');
    e(m.category).toBe('serum-biomarker');
  }],
  ['%fPSA = 1.2/6.0 * 100 = 20', (e, _, c) => {
    const r = c({ tpsa: 6.0, fpsa: 1.2 });
    e(r.result).toBeCloseTo(20.0, 1);
  }],
  ['interpret: >25 = Low risk', (e, _, _, i) => {
    e(i(30)).toContain('Low risk');
  }],
  ['interpret: 15-25 = Grey zone', (e, _, _, i) => {
    e(i(20)).toContain('Grey zone');
  }],
  ['interpret: <15 = High risk', (e, _, _, i) => {
    e(i(10)).toContain('High risk');
  }],
  ['error for negative PSA', (e, _, c) => {
    const r = c({ tpsa: -1, fpsa: 1.0 });
    e(r.error).toBeDefined();
  }],
  ['error when fpsa > tpsa', (e, _, c) => {
    const r = c({ tpsa: 1.0, fpsa: 2.0 });
    e(r.error).toBeDefined();
  }],
];