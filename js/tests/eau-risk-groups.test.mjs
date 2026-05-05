import { meta, calculate } from '../calculators/eau-risk-groups.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('eau-risk-groups');
    e(m.category).toBe('risk-stratification');
  }],
  ['Low Risk: GG1 PSA<10 cT1-2', (e, _, c) => {
    const r = c({ isup: 1, psa: 5.0, ct: 'cT1' });
    e(r.risk_group).toBe('Low Risk');
  }],
  ['Favourable Intermediate: GG2 PSA<10 cT1-2', (e, _, c) => {
    const r = c({ isup: 2, psa: 8.0, ct: 'cT1' });
    e(r.risk_group).toBe('Favourable Intermediate Risk');
  }],
  ['Unfavourable Intermediate: GG2 PSA10-20', (e, _, c) => {
    const r = c({ isup: 2, psa: 15.0, ct: 'cT2' });
    e(r.risk_group).toBe('Unfavourable Intermediate Risk');
  }],
  ['Unfavourable Intermediate: GG3 PSA<10 (Table 4.3 2026)', (e, _, c) => {
    const r = c({ isup: 3, psa: 5.0, ct: 'cT1' });
    e(r.risk_group).toBe('Unfavourable Intermediate Risk');
  }],
  ['High Risk: GG3 PSA10-20', (e, _, c) => {
    const r = c({ isup: 3, psa: 15.0, ct: 'cT2' });
    e(r.risk_group).toBe('High Risk / Locally Advanced');
  }],
  ['High Risk: PSA>20', (e, _, c) => {
    const r = c({ isup: 1, psa: 25.0, ct: 'cT2' });
    e(r.risk_group).toBe('High Risk / Locally Advanced');
  }],
  ['High Risk: GG4', (e, _, c) => {
    const r = c({ isup: 4, psa: 5.0, ct: 'cT1' });
    e(r.risk_group).toBe('High Risk / Locally Advanced');
  }],
  ['High Risk: GG5', (e, _, c) => {
    const r = c({ isup: 5, psa: 5.0, ct: 'cT1' });
    e(r.risk_group).toBe('High Risk / Locally Advanced');
  }],
  ['High Risk: cT3+', (e, _, c) => {
    const r = c({ isup: 1, psa: 5.0, ct: 'cT3' });
    e(r.risk_group).toBe('High Risk / Locally Advanced');
  }],
  ['management is non-empty', (e, _, c) => {
    const r = c({ isup: 1, psa: 5.0, ct: 'cT1' });
    e(r.management.length).toBeGreaterThan(0);
  }],
];