import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/capra-s.js';

describe('CAPRA-S Score', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('capra-s');
    expect(meta.category).toBe('post-rp-risk');
  });

  it('calculates Low Risk (score 1)', () => {
    const r = calculate({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    expect(r.score).toBe(1);
    expect(r.risk_group).toBe('Low');
  });

  it('calculates Intermediate (score 2)', () => {
    const r = calculate({ psa: 0.3, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    expect(r.score).toBe(2);
    expect(r.risk_group).toBe('Intermediate');
  });

  it('calculates Intermediate Risk (score 3)', () => {
    const r = calculate({ psa: 0.7, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    expect(r.score).toBe(3);
    expect(r.risk_group).toBe('Intermediate');
  });

  it('calculates High Risk (score 5)', () => {
    const r = calculate({ psa: 2.5, pt: 'pT3a', margins: 'No', lni: 'No', isup: 2 });
    expect(r.score).toBe(5);
    expect(r.risk_group).toBe('High');
  });

  it('calculates Very High Risk (score 9)', () => {
    const r = calculate({ psa: 2.5, pt: 'pT3a', margins: 'Yes', lni: 'No', isup: 2 });
    expect(r.score).toBe(9);
    expect(r.risk_group).toBe('Very High');
  });

  it('caps score at 10', () => {
    const r = calculate({ psa: 5.0, pt: 'pT3b', margins: 'Yes', lni: 'Yes', isup: 5 });
    expect(r.score).toBe(10);
    expect(r.risk_group).toBe('Very High');
  });

  it('positive margins add 1 point', () => {
    const r1 = calculate({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    const r2 = calculate({ psa: 0.1, pt: 'pT2a', margins: 'Yes', lni: 'No', isup: 1 });
    expect(r2.score - r1.score).toBe(1);
  });

  it('LNI adds 2 points', () => {
    const r1 = calculate({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'No', isup: 1 });
    const r2 = calculate({ psa: 0.1, pt: 'pT2a', margins: 'No', lni: 'Yes', isup: 1 });
    expect(r2.score - r1.score).toBe(2);
  });

  it('GG5 capped at 3 points', () => {
    const r = calculate({ psa: 5.0, pt: 'pT2a', margins: 'No', lni: 'No', isup: 5 });
    expect(r.score).toBe(8);
  });
});
