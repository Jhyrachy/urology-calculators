import { describe, it, expect } from 'vitest';
import { meta, calculate, interpret } from '../calculators/pni.js';

describe('Prognostic Nutritional Index (PNI)', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('pni');
    expect(meta.category).toBe('nutrition-inflammatory');
  });

  it('calculates PNI correctly', () => {
    const r = calculate({ albumin: 4.0, lymphocytes: 2000 });
    expect(r.result).toBe(50);
  });

  it('interprets normal PNI (>= 40)', () => {
    expect(interpret(45)).toContain('Normal');
  });

  it('interprets mild risk (35-39)', () => {
    expect(interpret(37)).toContain('Mild');
  });

  it('interprets moderate risk (30-34)', () => {
    expect(interpret(32)).toContain('Moderate');
  });

  it('interprets high risk (< 30)', () => {
    expect(interpret(28)).toContain('High risk');
  });

  it('returns error for invalid values', () => {
    const r = calculate({ albumin: -1, lymphocytes: 2000 });
    expect(r.error).toBeDefined();
  });
});
