/**
 * Briganti 2017/2019 Nomogram — Lymph Node Invasion (LNI) Prediction
 * EAU 2026: Sect. 5.4.3 (Diagnostic Evaluation) [518]
 *
 * NOT DIY — Regression coefficients NOT published in EAU guidelines.
 * The full logistic regression model (beta coefficients) is proprietary
 * to the original Briganti 2017/2019 publications and hosted as a
 * web-based nomogram (https://www.nomogram.org/).
 *
 * Published references:
 *   - Briganti A et al. Eur Urol 2017;71(3):407-414 (Briganti 2017)
 *   - External validation: external cohort n=305 [518]
 *   - Briganti 2019: PSMA PET-enhanced model [518]
 *
 * Clinical use: Pre-operative prediction of LNI in PCa candidates for ePLND.
 * EAU 2026: "Given the excellent specificity of PSMA PET, it remains
 * unclear whether a nomogram is required in patients with PSMA PET-positive
 * lesions" [518].
 *
 * DIY: NO — use the official web nomogram linked above
 */
(function() {
  'use strict';
  const meta = {
    id: 'briganti',
    name: 'Briganti Nomogram (LNI)',
    shortName: 'Briganti',
    category: 'nomogram-closed',
    inputs: [
      { id: 'info', label: 'Note', type: 'info',
        value: 'NOT DIY. Beta coefficients from original paper required. Use web nomogram.' }
    ],
    outputs: [
      { id: 'reference', label: 'Official resource', value: 'https://www.nomogram.org/' },
      { id: 'citation', label: 'Citation', value: 'Briganti A et al. Eur Urol 2017;71(3):407-414' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4.3 [518]',
      'Briganti A et al. Eur Urol 2017;71(3):407-414',
      'Briganti 2019 external validation: similar performance to Briganti 2017'
    ],
    isCommercial: false,
    isDIY: false,
    disclaimer: 'Briganti nomogram is a published logistic regression nomogram. Coefficients are not reproduced here because they are not freely available in the EAU guidelines. Please use the official nomogram platform.'
  };
  function calculate() { return meta.inputs[0]; }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
