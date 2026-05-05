/**
 * EAU Risk Groups — Table 4.3 (EAU 2026, revised)
 * Stratifies newly diagnosed localized/locally advanced PCa:
 *   Low / Favourable Intermediate / Unfavourable Intermediate / High Risk
 *
 * EAU 2026 Reference: Table 4.3 [110] + Summary of Changes 2026
 * Criteria: ISUP Grade Group + PSA + cT stage (DRE-based)
 *
 * Table 4.3 (revised 2026):
 *   Low:        ISUP GG 1 AND PSA < 10 AND cT1-2
 *   Fav. Int:   ISUP GG 2 AND PSA < 10 AND cT1-2
 *   Unfav. Int: ISUP GG 2 AND PSA 10-20 AND cT1-2
 *                OR ISUP GG 3 AND cT1-2 AND PSA < 10
 *   High:       ISUP GG 3 AND PSA 10-20 AND cT1-2
 *                OR ISUP GG 4-5
 *                OR PSA > 20
 *
 * NOTE: cT stage is based on DRE only.
 *
 * DIY: YES
 */

export const meta = {
  id: 'eau-risk-groups',
  name: 'EAU Risk Groups',
  shortName: 'EAU Risk',
  category: 'risk-stratification',
  inputs: [
    { id: 'isup', label: 'ISUP Grade Group (1–5)', min: 1, max: 5, step: 1, required: true },
    { id: 'psa',  label: 'PSA (ng/mL)',             min: 0, step: 0.1,  required: true },
    { id: 'ct',   label: 'cT stage (DRE)',           type: 'select',
      options: ['cT1', 'cT2', 'cT3', 'cT4'],                                   required: true }
  ],
  outputs: [
    { id: 'risk_group', label: 'EAU Risk Group' },
    { id: 'management', label: 'Suggested management' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Table 4.3 [110]',
    'Summary of Changes 2026: Table 4.3 revised'
  ]
};

export function calculate({ isup, psa, ct }) {
  const g = parseInt(isup, 10);
  const p = parseFloat(psa);
  const isCT2orLess = ct === 'cT1' || ct === 'cT2';

  let group, mgmt;

  if (g === 1 && p < 10 && isCT2orLess) {
    group = 'Low Risk';
    mgmt = 'AS or WW preferred; curative intent if patient chooses';
  } else if (g === 2 && p < 10 && isCT2orLess) {
    group = 'Favourable Intermediate Risk';
    mgmt = 'AS (selected) or curative intent (RP/EBRT ± HT)';
  } else if (g === 2 && p >= 10 && p <= 20 && isCT2orLess) {
    group = 'Unfavourable Intermediate Risk';
    mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT; multimodal approach';
  } else if (g === 3 && p < 10 && isCT2orLess) {
    group = 'Unfavourable Intermediate Risk';
    mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT; close follow-up';
  } else if (g === 3 && p >= 10 && p <= 20 && isCT2orLess) {
    group = 'High Risk / Locally Advanced';
    mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT± chemo; multimodal';
  } else {
    group = 'High Risk / Locally Advanced';
    mgmt = 'Curative intent: RP ± ePLND or EBRT+ADT± chemo; multimodal';
  }
  return { risk_group: group, management: mgmt };
}