import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/egfr.js';

describe('eGFR CKD-EPI 2021', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('egfr');
    expect(meta.category).toBe('renal-function');
  });

  it('calculates normal eGFR for young male', () => {
    const r = calculate({ age: 30, sex: 'Male', creatinine: 1.0 });
    expect(r.result).toBeGreaterThan(90);
    expect(r.ckd_stage).toContain('Normal');
  });

  it('calculates mildly decreased for elderly male', () => {
    const r = calculate({ age: 70, sex: 'Male', creatinine: 1.2 });
    expect(r.result).toBeGreaterThan(50);
  });

  it('applies female correction factor', () => {
    const rM = calculate({ age: 50, sex: 'Male', creatinine: 1.0 });
    const rF = calculate({ age: 50, sex: 'Female', creatinine: 1.0 });
    expect(rF.result).toBeLessThan(rM.result);
  });

  it('returns error for zero creatinine', () => {
    const r = calculate({ age: 50, sex: 'Male', creatinine: 0 });
    expect(r.error).toBeDefined();
  });

  it('returns error for negative creatinine', () => {
    const r = calculate({ age: 50, sex: 'Male', creatinine: -1 });
    expect(r.error).toBeDefined();
  });

  it('classifies G3a stage correctly', () => {
    const r = calculate({ age: 60, sex: 'Male', creatinine: 1.5 });
    expect(r.ckd_stage).toContain('G3a');
  });

  it('classifies G4 stage correctly', () => {
    const r = calculate({ age: 60, sex: 'Male', creatinine: 3.0 });
    expect(r.ckd_stage).toContain('G4');
  });

  it('classifies G5 stage correctly', () => {
    const r = calculate({ age: 60, sex: 'Male', creatinine: 8.0 });
    expect(r.ckd_stage).toContain('G5');
  });

  it('result is rounded to 1 decimal', () => {
    const r = calculate({ age: 40, sex: 'Male', creatinine: 0.9 });
    const decimals = (r.result.toString().split('.')[1] || '').length;
    expect(decimals).toBeLessThanOrEqual(1);
  });
});
