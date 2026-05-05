import { meta, calculate } from '../calculators/renal-nephrometry.js';

export const tests = [
  ['meta: id and category', (e, m) => {
    e(m.id).toBe('renal-nephrometry');
    e(m.category).toBe('renal-cancer');
  }],
  ['score 4: Low complexity', (e, _, c) => {
    const r = c({ radius: 3, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    e(r.total).toBe(4);
    e(r.complexity).toBe('Low complexity');
  }],
  ['score 7: Moderate complexity', (e, _, c) => {
    const r = c({ radius: 5, exophytic: '<50% exophytic (2pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Crosses polar line (2pt)' });
    e(r.total).toBe(7);
    e(r.complexity).toBe('Moderate complexity');
  }],
  ['score 11: High complexity', (e, _, c) => {
    const r = c({ radius: 8, exophytic: 'Entirely endophytic (3pt)', nearness: '≤7mm / invades it (3pt)', location: 'Crosses polar line (2pt)' });
    e(r.total).toBe(11);
    e(r.complexity).toBe('High complexity');
  }],
  ['R: radius 4cm = 1pt', (e, _, c) => {
    const r = c({ radius: 4, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    e(r.total).toBe(4);
  }],
  ['R: radius 7cm = 2pt', (e, _, c) => {
    const r = c({ radius: 7, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    e(r.total).toBe(5);
  }],
  ['R: radius 8cm = 3pt', (e, _, c) => {
    const r = c({ radius: 8, exophytic: '≥50% exophytic (1pt)', nearness: '≥10mm from collecting system (1pt)', location: 'Entirely above or below polar line (1pt)' });
    e(r.total).toBe(6);
  }],
  ['max score 12', (e, _, c) => {
    const r = c({ radius: 10, exophytic: 'Entirely endophytic (3pt)', nearness: '≤7mm / invades it (3pt)', location: 'Crosses polar line (2pt)' });
    e(r.total).toBe(12);
    e(r.complexity).toBe('High complexity');
  }],
];