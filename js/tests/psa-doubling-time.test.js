import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/psa-doubling-time.js';

describe('PSA Doubling Time', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('psa-doubling-time');
    expect(meta.name).toBe('PSA Doubling Time');
    expect(meta.category).toBe('kinetics');
  });

  it('calculates correct DT for known values', () => {
    const r = calculate({ psa1: 0.1, psa2: 0.2, delta_t: 365 });
    expect(r.result).toBeCloseTo(12.0, 1);
  });

  it('returns error when psa2 <= psa1', () => {
    const r = calculate({ psa1: 1.0, psa2: 0.5, delta_t: 180 });
    expect(r.error).toBeDefined();
  });

  it('returns error when delta_t <= 0', () => {
    const r = calculate({ psa1: 0.1, psa2: 0.2, delta_t: 0 });
    expect(r.error).toBeDefined();
  });

  it('returns null for non-rising PSA', () => {
    const r = calculate({ psa1: 0.2, psa2: 0.2, delta_t: 365 });
    expect(r.result).toBeNull();
  });

  it('DT ~ 12 months for doubling PSA in 1 year', () => {
    const r = calculate({ psa1: 1.0, psa2: 2.0, delta_t: 365 });
    expect(r.result).toBeCloseTo(12.0, 1);
  });

  it('DT ~ 6 months for rapid doubling in 6 months', () => {
    const r = calculate({ psa1: 1.0, psa2: 2.0, delta_t: 182 });
    expect(r.result).toBeCloseTo(6.0, 1);
  });
});
