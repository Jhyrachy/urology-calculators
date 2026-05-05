import { meta, calculate, interpret } from '../calculators/pni.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('pni');
    e(m.category).toBe('nutrition-inflammatory');
  }],
  ['PNI = 10*4.0 + 0.005*2000 = 50', (e, _, c) => {
    const r = c({ albumin: 4.0, lymphocytes: 2000 });
    e(r.result).toBe(50);
  }],
  ['interpret normal: >=40', (e, _, _, i) => {
    e(i(45)).toContain('Normal');
  }],
  ['interpret mild: 35-39', (e, _, _, i) => {
    e(i(37)).toContain('Mild');
  }],
  ['interpret moderate: 30-34', (e, _, _, i) => {
    e(i(32)).toContain('Moderate');
  }],
  ['interpret high risk: <30', (e, _, _, i) => {
    e(i(28)).toContain('High risk');
  }],
  ['error for negative albumin', (e, _, c) => {
    const r = c({ albumin: -1, lymphocytes: 2000 });
    e(r.error).toBeDefined();
  }],
];