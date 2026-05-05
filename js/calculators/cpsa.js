/**
 * cPSA — Complexed PSA
 * EAU 2026: Sect. 5.2.5
 *
 * Commercial assay — true cPSA requires proprietary immunoassay.
 * DIY approximation: cPSA ≈ tPSA - fPSA (note: approximation, not equivalent to assay).
 * EAU: similar clinical utility to %fPSA for csPCa detection.
 * DIY: APPROXIMATION ONLY — not equivalent to commercial cPSA assay
 */
(function() {
  'use strict';
  const meta = {
    id: 'cpsa',
    name: 'Complexed PSA (cPSA)',
    shortName: 'cPSA',
    category: 'serum-biomarker-approximation',
    inputs: [
      { id: 'tpsa', label: 'Total PSA (ng/mL)', min: 0, step: 0.01, required: true },
      { id: 'fpsa', label: 'Free PSA (ng/mL)',  min: 0, step: 0.01, required: true }
    ],
    outputs: [
      { id: 'cpsa_approx', label: 'cPSA approximated (tPSA − fPSA)' },
      { id: 'ratio',       label: 'cPSA/tPSA × 100 (%)' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.2.5',
      'Catalona WJ et al. JAMA 2000 — cPSA for PCa detection'
    ],
    isCommercial: true,
    disclaimer: 'Approximation only. True cPSA requires proprietary Beckman Coulter assay. This formula (tPSA − fPSA) is a simplified estimate for educational purposes.'
  };
  function calculate({ tpsa, fpsa }) {
    if (fpsa < 0 || tpsa <= 0 || fpsa > tpsa) return { error: 'Invalid values' };
    const cpsa = tpsa - fpsa;
    return { cpsa_approx: parseFloat(cpsa.toFixed(2)), ratio: parseFloat(((cpsa/tpsa)*100).toFixed(1)) };
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
