/**
 * RENAL Nephrometry Score
 * EAU 2026: Kidney Cancer Guidelines — nephron-sparing surgery indication
 *
 * Components (1-3 points each):
 *   R — Radius: ≤4 / 4-7 / >7 cm
 *   E — Exophytic: ≥50% / <50% / entirely endophytic
 *   N — Nearness: ≥10mm / >7<10mm / ≤7mm from collecting system
 *   L — Location: entirely above or below polar line / crosses polar line
 *
 * Total: 4-6 low | 7-9 moderate | 10-12 high complexity
 * Score ≥7 → consider partial nephrectomy when feasible (EAU 2026)
 *
 * DIY: YES — requires CT imaging
 */
(function() {
  'use strict';
  const meta = {
    id: 'renal-nephrometry',
    name: 'RENAL Nephrometry Score',
    shortName: 'RENAL',
    category: 'renal-cancer',
    inputs: [
      { id: 'radius',   label: 'R — Max tumour diameter (cm)', min: 0, step: 0.1, required: true },
      { id: 'exophytic', label: 'E — Exophytic rate',         type: 'select',
        options: ['≥50% exophytic (1pt)', '<50% exophytic (2pt)', 'Entirely endophytic (3pt)'], required: true },
      { id: 'nearness', label: 'N — Nearness to collecting system', type: 'select',
        options: ['≥10mm from collecting system (1pt)', '>7<10mm (2pt)', '≤7mm / invades it (3pt)'], required: true },
      { id: 'location', label: 'L — Location vs polar lines', type: 'select',
        options: ['Entirely above or below polar line (1pt)', 'Crosses polar line (2pt)'], required: true }
    ],
    outputs: [
      { id: 'total',      label: 'RENAL Score (4-12)' },
      { id: 'complexity', label: 'Complexity' }
    ],
    references: [
      'Kutikov A & Uzzo RG. J Urol 2009;182:844-853',
      'EAU 2026 Kidney Cancer Guidelines — nephron-sparing surgery'
    ]
  };
  function calculate({ radius, exophytic, nearness, location }) {
    const r = radius <= 4 ? 1 : radius <= 7 ? 2 : 3;
    const e = exophytic.includes('≥50') ? 1 : exophytic.includes('<50') ? 2 : 3;
    const n = nearness.includes('≥10') ? 1 : nearness.includes('>7<10') ? 2 : 3;
    const l = location.includes('above or below') ? 1 : 2;
    const total = r + e + n + l;
    const complexity = total <= 6 ? 'Low complexity' : total <= 9 ? 'Moderate complexity' : 'High complexity';
    return { total, complexity };
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
