import { meta, calculate } from '../calculators/nmibc-risk.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('nmibc-risk');
    e(m.category).toBe('bladder-cancer');
  }],
  ['Very High: T1G3', (e, _, c) => {
    const r = c({ stage: 'T1', grade: 'G3', num: 1, size: 2, recurrent: false });
    e(r.risk_group).toBe('Very High Risk');
  }],
  ['Very High: CIS', (e, _, c) => {
    const r = c({ stage: 'Tis (CIS)', grade: 'G1', num: 1, size: 1, recurrent: false });
    e(r.risk_group).toBe('Very High Risk');
  }],
  ['High: T1 only', (e, _, c) => {
    const r = c({ stage: 'T1', grade: 'G2', num: 1, size: 2, recurrent: false });
    e(r.risk_group).toBe('High Risk');
  }],
  ['High: G3 only', (e, _, c) => {
    const r = c({ stage: 'Ta', grade: 'G3', num: 1, size: 2, recurrent: false });
    e(r.risk_group).toBe('High Risk');
  }],
  ['Intermediate: multiple tumours', (e, _, c) => {
    const r = c({ stage: 'Ta', grade: 'G1', num: 3, size: 2, recurrent: false });
    e(r.risk_group).toBe('Intermediate Risk');
  }],
  ['Intermediate: large tumour (>3cm)', (e, _, c) => {
    const r = c({ stage: 'Ta', grade: 'G1', num: 1, size: 4, recurrent: false });
    e(r.risk_group).toBe('Intermediate Risk');
  }],
  ['Low Risk: Ta G1 single small', (e, _, c) => {
    const r = c({ stage: 'Ta', grade: 'G1', num: 1, size: 2, recurrent: false });
    e(r.risk_group).toBe('Low Risk');
  }],
  ['management is non-empty', (e, _, c) => {
    const r = c({ stage: 'Ta', grade: 'G1', num: 1, size: 2, recurrent: false });
    e(r.management.length).toBeGreaterThan(0);
  }],
];