import { meta, calculate } from '../calculators/capra-s.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('capra-s');
    e(m.category).toBe('post-rp-risk');
  }],
  ['score 1: Low', (e, _, c) => {
    const r = c({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    e(r.score).toBe(1);
    e(r.risk_group).toBe('Low');
  }],
  ['score 2: Intermediate', (e, _, c) => {
    const r = c({ psa: 0.3, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    e(r.score).toBe(2);
    e(r.risk_group).toBe('Intermediate');
  }],
  ['score 5: High', (e, _, c) => {
    const r = c({ psa: 2.5, pt: 'pT3a', margins: 'No', lni: 'No', isup: 2 });
    e(r.score).toBe(5);
    e(r.risk_group).toBe('High');
  }],
  ['score 9: Very High', (e, _, c) => {
    const r = c({ psa: 2.5, pt: 'pT3a', margins: 'Yes', lni: 'No', isup: 2 });
    e(r.score).toBe(9);
    e(r.risk_group).toBe('Very High');
  }],
  ['caps at 10', (e, _, c) => {
    const r = c({ psa: 5.0, pt: 'pT3b', margins: 'Yes', lni: 'Yes', isup: 5 });
    e(r.score).toBe(10);
    e(r.risk_group).toBe('Very High');
  }],
  ['positive margins add 1', (e, _, c) => {
    const r1 = c({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    const r2 = c({ psa: 0.1, pt: 'pT2a', margins: 'Yes', lni: 'No', isup: 1 });
    e(r2.score - r1.score).toBe(1);
  }],
  ['LNI adds 2', (e, _, c) => {
    const r1 = c({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    const r2 = c({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'Yes', isup: 1 });
    e(r2.score - r1.score).toBe(2);
  }],
  ['GG5 capped at 3 points: score 8', (e, _, c) => {
    const r = c({ psa: 5.0, pt: 'pT2a', margins: 'No', lni: 'No', isup: 5 });
    e(r.score).toBe(8);
  }],
];