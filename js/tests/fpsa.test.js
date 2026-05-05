import { describe, it, expect } from 'vitest';
import { meta, calculate, interpret } from '../calculators/fpsa.js';

describe('% Free PSA', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('fpsa');
    expect(meta.category).toBe('serum-biomarker');
  });

  it('calculates %fPSA correctly', () => {
    const r = calculate({ tpsa: 6.0, fpsa: 1.2 });
    expect(r.result).toBeCloseTo(20.0, 1);
  });

  it('interprets low risk (high %fPSA > 25)', () => {
    expect(interpret(30)).toContain('Low risk');
  });

  it('interprets grey zone (15-25)', () => {
    expect(interpret(20)).toContain('Grey zone');
  });

  it('interprets high risk (low %fPSA < 15)', () => {
    expect(interpret(10)).toContain('High risk');
  });

  it('returns error for invalid values', () => {
    const r = calculate({ tpsa: -1, fpsa: 1.0 });
    expect(r.error).toBeDefined();
  });

  it('returns error when fpsa > tpsa', () => {
    const r = calculate({ tpsa: 1.0, fpsa: 2.0 });
    expect(r.error).toBeDefined();
  });
});
