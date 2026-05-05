import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/eau-risk-groups.js';

describe('EAU Risk Groups (Table 4.3 EAU 2026)', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('eau-risk-groups');
    expect(meta.category).toBe('risk-stratification');
  });

  it('classifies Low Risk', () => {
    const r = calculate({ isup: 1, psa: 5.0, ct: 'cT1' });
    expect(r.risk_group).toBe('Low Risk');
  });

  it('classifies Favourable Intermediate', () => {
    const r = calculate({ isup: 2, psa: 8.0, ct: 'cT1' });
    expect(r.risk_group).toBe('Favourable Intermediate Risk');
  });

  it('classifies Unfavourable Intermediate (GG2 + PSA 10-20)', () => {
    const r = calculate({ isup: 2, psa: 15.0, ct: 'cT2' });
    expect(r.risk_group).toBe('Unfavourable Intermediate Risk');
  });

  it('classifies Unfavourable Intermediate (GG3 + PSA < 10)', () => {
    const r = calculate({ isup: 3, psa: 5.0, ct: 'cT1' });
    expect(r.risk_group).toBe('Unfavourable Intermediate Risk');
  });

  it('classifies High Risk (GG3 + PSA 10-20)', () => {
    const r = calculate({ isup: 3, psa: 15.0, ct: 'cT2' });
    expect(r.risk_group).toBe('High Risk / Locally Advanced');
  });

  it('classifies High Risk (PSA > 20)', () => {
    const r = calculate({ isup: 1, psa: 25.0, ct: 'cT2' });
    expect(r.risk_group).toBe('High Risk / Locally Advanced');
  });

  it('classifies High Risk (ISUP GG 4)', () => {
    const r = calculate({ isup: 4, psa: 5.0, ct: 'cT1' });
    expect(r.risk_group).toBe('High Risk / Locally Advanced');
  });

  it('classifies High Risk (ISUP GG 5)', () => {
    const r = calculate({ isup: 5, psa: 5.0, ct: 'cT1' });
    expect(r.risk_group).toBe('High Risk / Locally Advanced');
  });

  it('classifies High Risk (cT3+)', () => {
    const r = calculate({ isup: 1, psa: 5.0, ct: 'cT3' });
    expect(r.risk_group).toBe('High Risk / Locally Advanced');
  });

  it('provides management recommendation', () => {
    const r = calculate({ isup: 1, psa: 5.0, ct: 'cT1' });
    expect(r.management).toBeDefined();
    expect(r.management.length).toBeGreaterThan(0);
  });
});
