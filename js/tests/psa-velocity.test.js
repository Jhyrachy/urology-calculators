import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/psa-velocity.js';

describe('PSA Velocity', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('psa-velocity');
    expect(meta.category).toBe('kinetics');
  });

  it('calculates annual velocity correctly', () => {
    const r = calculate({ psa1: 2.0, psa2: 4.0, date1: '2023-01-01', date2: '2024-01-01' });
    expect(r.result).toBeCloseTo(2.0, 1);
  });

  it('returns negative for decreasing PSA', () => {
    const r = calculate({ psa1: 4.0, psa2: 2.0, date1: '2023-01-01', date2: '2024-01-01' });
    expect(r.result).toBeLessThan(0);
  });

  it('returns error when date2 <= date1', () => {
    const r = calculate({ psa1: 2.0, psa2: 4.0, date1: '2024-01-01', date2: '2023-01-01' });
    expect(r.error).toBeDefined();
  });

  it('returns error for negative PSA', () => {
    const r = calculate({ psa1: -1, psa2: 2.0, date1: '2023-01-01', date2: '2024-01-01' });
    expect(r.error).toBeDefined();
  });
});
