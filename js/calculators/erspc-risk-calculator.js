/**
 * ERSPC Risk Calculator — Prostate Cancer Risk Prediction (Pre-biopsy)
 * EAU 2026: Sect. 5.4 [181]
 *
 * Derived from the European Randomised Screening for Prostate Cancer (ERSPC) cohort.
 * URL explicitly cited in EAU 2026: http://www.prostatecancer-riskcalculator.com/seven-prostate-cancer-risk-calculators
 * Updated to incorporate 2014 ISUP Pathology Gleason Grading and Cribriform growth [181].
 *
 * The calculator combines clinical data (age, PSA, DRE, prior biopsy, family history)
 * into a logistic regression model. Beta coefficients are not printed in the EAU
 * guideline and the full model is hosted exclusively on the official web platform.
 *
 * Published by: SWOP – The Prostate Cancer Research Foundation, Reeuwijk.
 * Related publication: Hendriks JD et al. Eur Urol 2017 (ERSPC risk calculator validation).
 *
 * DIY: NO — use official web calculator
 */
(function() {
  'use strict';
  const meta = {
    id: 'erspc-risk-calculator',
    name: 'ERSPC Risk Calculator',
    shortName: 'ERSPC',
    category: 'nomogram-closed',
    inputs: [
      { id: 'note', label: 'Note', type: 'info',
        value: 'NOT DIY — beta coefficients from ERSPC cohort required. Use official web calculator.' }
    ],
    outputs: [
      { id: 'resource', label: 'Official calculator',
        value: 'http://www.prostatecancer-riskcalculator.com/seven-prostate-cancer-risk-calculators' },
      { id: 'citation', label: 'Citation',
        value: 'Hendriks JD et al. Eur Urol 2017;71(1):96-104 — ERSPC risk calculator' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4 [181]',
      'ERSPC: Schröder FH et al. Lancet 2014;383:2027-2037',
      'Updated calculator: prostatecancer-riskcalculator.com (SWOP)'
    ],
    isDIY: false,
    disclaimer: 'ERSPC Risk Calculator beta coefficients are not reproduced here. Please use the official calculator at prostatecancer-riskcalculator.com. Formula complexity requires web-based implementation.'
  };
  function calculate() { return {}; }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
