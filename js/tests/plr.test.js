import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/plr.js';

describe('PLR (Platelet-to-Lymphocyte Ratio)', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('plr');
    expect(meta.category).toBe('blood-count');
  });

  it('calculates PLR correctly', () => {
    const r = calculate({ platelets: 300, alc: 2.0 });
    expect(r.result).toBe(150);
  });

  it('returns error for invalid values', () => {
    const r = calculate({ platelets: -1, alc: 2.0 });
    expect(r.error).toBeDefined();
  });

  it('interprets high PLR (result > 250)', () => {
    const r = calculate({ platelets: 400, alc: 2.0 });
    expect(r.result).toBeGreaterThan(250);
  });
});
