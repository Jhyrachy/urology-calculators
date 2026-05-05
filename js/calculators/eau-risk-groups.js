/**
 * EAU Risk Groups — Table 4.3 (EAU 2026)
 * Stratifies localized/locally advanced PCa:
 *   Low / Favourable Intermediate / Unfavourable Intermediate / High Risk
 *
 * EAU 2026 Reference: Table 4.3 [110] + Summary of Changes 2026
 * Criteria: ISUP Grade Group + PSA + cT stage (DRE-based)
 * DIY: YES
 *
 * NOTE: Table 4.3 revised in 2026 — intermediate-risk split updated.
 *       See also: Cambridge Prognostic Groups (CPG) — 5-tier model [141-143]
 */
(function() {
  'use strict';
  const meta = {
    id: 'eau-risk-groups',
    name: 'EAU Risk Groups',
    shortName: 'EAU Risk',
    category: 'risk-stratification',
    inputs: [
      { id: 'isup', label: 'ISUP Grade Group (1–5)', min: 1, max: 5, step: 1, required: true },
      { id: 'psa',  label: 'PSA (ng/mL)',             min: 0, step: 0.1,  required: true },
      { id: 'ct',   label: 'cT stage (1–4, DRE)',      min: 1, max: 4, step: 1, required: true }
    ],
    outputs: [
      { id: 'risk_group', label: 'EAU Risk Group' },
      { id: 'management', label: 'Management' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Table 4.3 [110]',
      'Summary of Changes 2026: Table 4.3 revised'
    ]
  };
  function calculate({ isup, psa, ct }) {
    let group, mgmt;
    if (isup === 1 && psa < 10 && ct <= 2) {
      group = 'Low Risk'; mgmt = 'AS or WW';
    } else if ((isup === 1 && psa >= 10 && psa <= 20 && ct <= 2) ||
               (isup === 2 && psa < 10 && ct <= 2)) {
      group = 'Favourable Intermediate Risk'; mgmt = 'AS (selected) or curative intent (RP/EBRT) ± HT';
    } else if ((isup === 2 && psa >= 10 && psa <= 20 && ct <= 2) || (isup === 3 && ct <= 2)) {
      group = 'Unfavourable Intermediate Risk'; mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT; multimodal approach';
    } else {
      group = 'High Risk / Locally Advanced'; mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT± chemo; multimodal';
    }
    return { risk_group: group, management: mgmt };
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
