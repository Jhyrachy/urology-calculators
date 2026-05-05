import { meta, calculate } from '../calculators/egfr.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('egfr');
    e(m.category).toBe('renal-function');
  }],
  ['young male: eGFR > 90, normal', (e, _, c) => {
    const r = c({ age: 30, sex: 'Male', creatinine: 1.0 });
    e(r.result).toBeGreaterThan(90);
    e(r.ckd_stage).toContain('Normal');
  }],
  ['elderly male: eGFR > 50', (e, _, c) => {
    const r = c({ age: 70, sex: 'Male', creatinine: 1.2 });
    e(r.result).toBeGreaterThan(50);
  }],
  ['female correction: female < male', (e, _, c) => {
    const rM = c({ age: 50, sex: 'Male', creatinine: 1.0 });
    const rF = c({ age: 50, sex: 'Female', creatinine: 1.0 });
    e(rF.result).toBeLessThan(rM.result);
  }],
  ['error for zero creatinine', (e, _, c) => {
    const r = c({ age: 50, sex: 'Male', creatinine: 0 });
    e(r.error).toBeDefined();
  }],
  ['error for negative creatinine', (e, _, c) => {
    const r = c({ age: 50, sex: 'Male', creatinine: -1 });
    e(r.error).toBeDefined();
  }],
  ['G3a: eGFR 45-59', (e, _, c) => {
    const r = c({ age: 60, sex: 'Male', creatinine: 1.5 });
    e(r.ckd_stage).toContain('G3a');
  }],
  ['G4: eGFR 30-44', (e, _, c) => {
    const r = c({ age: 60, sex: 'Male', creatinine: 3.0 });
    e(r.ckd_stage).toContain('G4');
  }],
  ['G5: eGFR < 15', (e, _, c) => {
    const r = c({ age: 60, sex: 'Male', creatinine: 8.0 });
    e(r.ckd_stage).toContain('G5');
  }],
  ['result has 1 decimal', (e, _, c) => {
    const r = c({ age: 40, sex: 'Male', creatinine: 0.9 });
    const dec = r.result.toString().split('.')[1] || '';
    e(dec.length).toBeLessThanOrEqual(1);
  }],
];