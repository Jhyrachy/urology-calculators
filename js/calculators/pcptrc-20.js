/**
 * PCPTRC 2.0 — Prostate Cancer Prevention Trial Risk Calculator 2.0
 * EAU 2026: Sect. 5.4 [181]
 *
 * Derived from the Prostate Cancer Prevention Trial (PCPT) cohort.
 * URL explicitly cited in EAU 2026: http://myprostatecancerrisk.com
 *
 * The PCPTRC 2.0 combines age, PSA, DRE, family history, and prior biopsy
 * into a logistic regression model to estimate prostate cancer risk.
 * Beta coefficients are not printed in the EAU guideline.
 *
 * Reference: Thompson IM et al. J Urol 2006;176(5):1970-1977 (PCPT original).
 * Updated PCPTRC 2.0: Ankerst DP et al. J Urol 2018 (updated model).
 *
 * DIY: NO — use official web calculator
 */
(function() {
  'use strict';
  const meta = {
    id: 'pcptrc-20',
    name: 'PCPTRC 2.0 Risk Calculator',
    shortName: 'PCPTRC 2.0',
    category: 'nomogram-closed',
    inputs: [
      { id: 'note', label: 'Note', type: 'info',
        value: 'NOT DIY — beta coefficients from PCPT cohort required. Use official web calculator.' }
    ],
    outputs: [
      { id: 'resource', label: 'Official calculator',
        value: 'http://myprostatecancerrisk.com' },
      { id: 'citation', label: 'Citation',
        value: 'Ankerst DP et al. J Urol 2018 — PCPTRC 2.0 update' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4 [181]',
      'Thompson IM et al. J Urol 2006;176(5):1970-1977 — PCPT original',
      'Ankerst DP et al. J Urol 2018 — PCPTRC 2.0'
    ],
    isDIY: false,
    disclaimer: 'PCPTRC 2.0 beta coefficients are not reproduced here. Please use the official calculator at myprostatecancerrisk.com.'
  };
  function calculate() { return {}; }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
