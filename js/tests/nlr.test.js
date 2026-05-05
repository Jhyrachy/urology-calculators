import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/nlr.js';

describe('NLR (Neutrophil-to-Lymphocyte Ratio)', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('nlr');
    expect(meta.category).toBe('blood-count');
  });

  it('calculates NLR correctly', () => {
    const r = calculate({ anc: 6.0, alc: 2.0 });
    expect(r.result).toBeCloseTo(3.0, 1);
  });

  it('returns error for invalid values', () => {
    const r = calculate({ anc: -1, alc: 2.0 });
    expect(r.error).toBeDefined();
  });

  it('interprets normal NLR (result < 3)', () => {
    const r = calculate({ anc: 2.0, alc: 1.0 });
    expect(r.result).toBeLessThan(3);
  });

  it('interprets high NLR (result > 5)', () => {
    const r = calculate({ anc: 10.0, alc: 2.0 });
    expect(r.result).toBeGreaterThan(5);
  });
});
