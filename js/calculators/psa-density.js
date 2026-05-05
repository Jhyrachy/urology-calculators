/**
 * PSA Density (PSA-D)
 * EAU 2026: Table 5.5 [230] + Sect. 5.2.2 [212-216]
 * Formula: PSAD = tPSA (ng/mL) / Prostate Volume (mL = cc)
 * DIY: YES
 *
 * Table 5.5 thresholds (biopsy-naïve, PI-RADS-guided):
 *   PI-RADS ≤2 + PSAD < 0.15 → omit biopsy
 *   PI-RADS 3 + PSAD < 0.10  → may omit biopsy
 *   PI-RADS 3 + PSAD ≥ 0.10  → biopsy recommended
 *   PI-RADS 4-5              → proceed to biopsy
 *   PSAD > 0.20              → 18% risk ISUP GG ≥2
 */
(function() {
  'use strict';
  const meta = {
    id: 'psa-density',
    name: 'PSA Density',
    shortName: 'PSAD',
    category: 'imaging-biopsy',
    inputs: [
      { id: 'tpsa',   label: 'Total PSA (ng/mL)',    min: 0.001, step: 0.01, required: true },
      { id: 'volume', label: 'Prostate Volume (mL)',  min: 1,     step: 1,   required: true }
    ],
    outputs: [
      { id: 'result', label: 'PSAD (ng/mL/cc)' },
      { id: 'interpretation', label: 'Interpretation' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Table 5.5 [230]',
      'Schoots IG & Padhani AR. BJU Int 2021;127(2):175'
    ]
  };
  function calculate({ tpsa, volume }) {
    if (tpsa <= 0 || volume <= 0) return { error: 'PSA and volume must be > 0' };
    return { result: parseFloat((tpsa / volume).toFixed(3)) };
  }
  function interpret(result) {
    if (result == null) return null;
    if (result < 0.10) return `Low (${result}) — Biopsy may be omitted (EAU 2026 Table 5.5)`;
    if (result < 0.15) return `Intermediate (${result}) — Consider biopsy if PI-RADS ≥3`;
    return `High (${result}) — Biopsy recommended; elevated csPCa risk`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
