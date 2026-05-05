/**
 * Briganti 2017/2019 Nomogram — Lymph Node Invasion (LNI) Prediction
 * EAU 2026: Sect. 5.4.3 (Diagnostic Evaluation) [517,518,519]
 *
 * NOT DIY — Beta regression coefficients NOT published in EAU guidelines.
 * Published in: Briganti A et al. Eur Urol 2017;71(3):407-414 (Briganti 2017)
 * Briganti 2019: PSMA PET-enhanced model externally validated in n=757 patients.
 *
 * EAU 2026 notes: "Given the excellent specificity of PSMA PET, it remains
 * unclear whether a nomogram is required in patients with PSMA PET-positive
 * lesions" [518].
 *
 * Clinical use: Pre-operative prediction of LNI in PCa candidates for ePLND.
 * Alternative: Briganti 2019 nomogram incorporating PSMA PET findings.
 *
 * DIY: NO — use official web nomogram
 * EAU-referenced resource: https://www.nomogram.org (general urology nomograms)
 */
(function() {
  'use strict';
  const meta = {
    id: 'briganti',
    name: 'Briganti Nomogram (LNI)',
    shortName: 'Briganti',
    category: 'nomogram-closed',
    inputs: [
      { id: 'note', label: 'Note', type: 'info',
        value: 'NOT DIY. Beta coefficients from the original publications are required.' }
    ],
    outputs: [
      { id: 'resource', label: 'Official resource', value: 'https://www.nomogram.org' },
      { id: 'citation', label: 'Citation', value: 'Briganti A et al. Eur Urol 2017;71(3):407-414' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4.3 [517,518,519]',
      'Briganti A et al. Eur Urol 2017;71(3):407-414',
      'Briganti 2019 PSMA PET: external validation n=757 [518]'
    ],
    isDIY: false,
    disclaimer: 'This is a reference page. The Briganti 2017/2019 nomogram requires beta coefficients from the original publications and is available as a web nomogram. This page does not implement the formula.'
  };
  function calculate() { return {}; }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
