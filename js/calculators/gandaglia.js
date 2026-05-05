/**
 * Gandaglia 2014 Nomogram — Post-RP Complications Prediction
 * EAU 2026: referenced in Sect. 6.3.1 (post-RP complications)
 *
 * NOT DIY — Regression coefficients NOT publicly disclosed in EAU guidelines.
 * Published Gandaglia D et al. Eur Urol 2014;66(2):406-412.
 * Hosted as web-based nomogram.
 *
 * Clinical use: Predicts 30-day complications after RP (e.g. ePLND extent).
 * EAU 2019+: cited as reference for extended PLND risk-benefit assessment.
 *
 * DIY: NO — use official web nomogram
 */
(function() {
  'use strict';
  const meta = {
    id: 'gandaglia',
    name: 'Gandaglia Nomogram (RP Complications)',
    shortName: 'Gandaglia',
    category: 'nomogram-closed',
    inputs: [
      { id: 'info', label: 'Note', type: 'info',
        value: 'NOT DIY. Use official web nomogram for Gandaglia 2014.' }
    ],
    outputs: [
      { id: 'reference', label: 'Citation', value: 'Gandaglia D et al. Eur Urol 2014;66(2):406-412' }
    ],
    references: [
      'Gandaglia D et al. Eur Urol 2014;66(2):406-412',
      'EAU 2026 Prostate Cancer Guidelines — Sect. 6.3.1'
    ],
    isDIY: false,
    disclaimer: 'Gandaglia 2014 nomogram coefficients are not publicly reproduced here. Use the published nomogram platform.'
  };
  function calculate() { return {}; }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
