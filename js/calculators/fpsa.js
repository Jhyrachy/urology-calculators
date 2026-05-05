/**
 * % Free PSA
 * EAU 2026: Sect. 5.2.5 [280,281]
 * Formula: %fPSA = (fPSA / tPSA) × 100
 * DIY: YES
 */
(function() {
  'use strict';
  const meta = {
    id: 'fpsa',
    name: '% Free PSA',
    shortName: 'fPSA%',
    category: 'serum-biomarker',
    inputs: [
      { id: 'fpsa', label: 'Free PSA (ng/mL)', min: 0, step: 0.01, required: true },
      { id: 'tpsa', label: 'Total PSA (ng/mL)', min: 0.001, step: 0.01, required: true }
    ],
    outputs: [
      { id: 'result', label: '% Free PSA' },
      { id: 'interpretation', label: 'Interpretation' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.2.5 [280,281]',
      'Catalona WJ et al. JAMA 1998'
    ]
  };
  function calculate({ fpsa, tpsa }) {
    if (fpsa < 0 || tpsa <= 0) return { error: 'Invalid PSA values' };
    return { result: parseFloat(((fpsa / tpsa) * 100).toFixed(2)) };
  }
  function interpret(result) {
    if (result == null) return null;
    if (result > 25) return `Low risk (${result}%) — csPCa unlikely`;
    if (result >= 15) return `Grey zone (${result}%) — Consider PHI or biopsy`;
    return `High risk (${result}%) — csPCa likely; biopsy recommended`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
