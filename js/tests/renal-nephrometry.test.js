import { describe, it, expect } from 'vitest';
import { meta, calculate } from '../calculators/renal-nephrometry.js';

describe('RENAL Nephrometry Score', () => {
  it('has valid meta', () => {
    expect(meta.id).toBe('renal-nephrometry');
    expect(meta.category).toBe('renal-cancer');
  });

  it('calculates low complexity (score 4)', () => {
    const r = calculate({
      radius: 3,
      exophytic: '≥50% exophytic (1pt)',
      nearness: '≥10mm from collecting system (1pt)',
      location: 'Entirely above or below polar line (1pt)'
    });
    expect(r.total).toBe(4);
    expect(r.complexity).toBe('Low complexity');
  });

  it('calculates moderate complexity (score 7)', () => {
    const r = calculate({
      radius: 5,
      exophytic: '<50% exophytic (2pt)',
      nearness: '≥10mm from collecting system (1pt)',
      location: 'Crosses polar line (2pt)'
    });
    expect(r.total).toBe(7);
    expect(r.complexity).toBe('Moderate complexity');
  });

  it('calculates high complexity (score 11)', () => {
    const r = calculate({
      radius: 8,
      exophytic: 'Entirely endophytic (3pt)',
      nearness: '≤7mm / invades it (3pt)',
      location: 'Crosses polar line (2pt)'
    });
    expect(r.total).toBe(11);
    expect(r.complexity).toBe('High complexity');
  });

  it('R component: radius 4cm = 1pt', () => {
    const r = calculate({ radius: 4, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    expect(r.total).toBe(4);
  });

  it('R component: radius 7cm = 2pt', () => {
    const r = calculate({ radius: 7, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    expect(r.total).toBe(5);
  });

  it('R component: radius 8cm = 3pt', () => {
    const r = calculate({ radius: 8, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    expect(r.total).toBe(6);
  });

  it('caps at 12', () => {
    const r = calculate({
      radius: 10,
      exophytic: 'Entirely endophytic (3pt)',
      nearness: '≤7mm / invades it (3pt)',
      location: 'Crosses polar line (2pt)'
    });
    expect(r.total).toBe(12);
    expect(r.complexity).toBe('High complexity');
  });
});
