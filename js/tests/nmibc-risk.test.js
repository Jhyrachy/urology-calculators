import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/nmibc-risk.js';

describe('NMIBC Risk Classifier', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('nmibc-risk');
    expect(meta.category).toBe('bladder-cancer');
  });

  it('has 5 inputs', () => {
    expect(meta.inputs.length).toBe(5);
  });

  it('classifies Very High Risk: T1G3', () => {
    const r = calculate({ stage: 'T1', grade: 'G3', num: 1, size: 2, recurrent: false });
    expect(r.risk_group).toBe('Very High Risk');
  });

  it('classifies Very High Risk: CIS', () => {
    const r = calculate({ stage: 'Tis (CIS)', grade: 'G1', num: 1, size: 1, recurrent: false });
    expect(r.risk_group).toBe('Very High Risk');
  });

  it('classifies High Risk: T1 only', () => {
    const r = calculate({ stage: 'T1', grade: 'G2', num: 1, size: 2, recurrent: false });
    expect(r.risk_group).toBe('High Risk');
  });

  it('classifies High Risk: G3 only', () => {
    const r = calculate({ stage: 'Ta', grade: 'G3', num: 1, size: 2, recurrent: false });
    expect(r.risk_group).toBe('High Risk');
  });

  it('classifies Intermediate Risk: multiple tumours', () => {
    const r = calculate({ stage: 'Ta', grade: 'G1', num: 3, size: 2, recurrent: false });
    expect(r.risk_group).toBe('Intermediate Risk');
  });

  it('classifies Intermediate Risk: large tumour', () => {
    const r = calculate({ stage: 'Ta', grade: 'G1', num: 1, size: 4, recurrent: false });
    expect(r.risk_group).toBe('Intermediate Risk');
  });

  it('classifies Low Risk', () => {
    const r = calculate({ stage: 'Ta', grade: 'G1', num: 1, size: 2, recurrent: false });
    expect(r.risk_group).toBe('Low Risk');
  });

  it('provides management recommendation', () => {
    const r = calculate({ stage: 'Ta', grade: 'G1', num: 1, size: 2, recurrent: false });
    expect(r.management).toBeDefined();
    expect(r.management.length).toBeGreaterThan(0);
  });
});
