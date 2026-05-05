/**
 * eGFR — CKD-EPI 2021 (no race coefficient)
 * EAU 2026: renal function assessment for treatment eligibility
 *
 * Formula (CKD-EPI 2021):
 *   eGFR = 142 × min(SCr/κ, 1)^a × max(SCr/κ, 1)^−1.20 × 0.9938^age × 1.011 [if female]
 *   κ = 0.7 (♀) or 0.9 (♂), a = −0.241 (♀) or −0.302 (♂)
 *
 * EAU 2026 thresholds:
 *   eGFR < 45  → caution with abiraterone
 *   eGFR < 30  → dose adjustments; nephrology referral
 *   eGFR < 15  → contraindicated for cisplatin
 *
 * DIY: YES
 */

export const meta = {
  id: 'egfr',
  name: 'eGFR (CKD-EPI 2021)',
  shortName: 'eGFR',
  category: 'renal-function',
  inputs: [
    { id: 'age',         label: 'Age (years)',            min: 18, max: 120, step: 1, required: true },
    { id: 'sex',         label: 'Sex',                   type: 'select',
      options: ['Male', 'Female'],                                                required: true },
    { id: 'creatinine',  label: 'Serum Creatinine (mg/dL)', min: 0.1, step: 0.01, required: true }
  ],
  outputs: [
    { id: 'result',    label: 'eGFR (mL/min/1.73m²)' },
    { id: 'ckd_stage', label: 'CKD Stage' }
  ],
  references: [
    'Inker LA et al. N Engl J Med 2021;385:1737-1749 — CKD-EPI 2021',
    'EAU 2026 — drug dosing and treatment eligibility'
  ]
};

export function calculate({ age, sex, creatinine }) {
  if (creatinine <= 0) return { error: 'Invalid creatinine' };
  const isF = sex === 'Female';
  const κ = isF ? 0.7 : 0.9;
  const a  = isF ? -0.241 : -0.302;
  const scr_κ = creatinine / κ;
  const egfr = 142 * Math.pow(Math.min(scr_κ, 1), a) * Math.pow(Math.max(scr_κ, 1), -1.20) * Math.pow(0.9938, age) * (isF ? 1.011 : 1);
  const val = parseFloat(egfr.toFixed(1));
  const stage = val >= 90 ? 'G1 — Normal'
                : val >= 60 ? 'G2 — Mildly decreased'
                : val >= 45 ? 'G3a — Mildly-moderately decreased'
                : val >= 30 ? 'G3b — Moderately-severely decreased'
                : val >= 15 ? 'G4 — Severely decreased'
                : 'G5 — Kidney failure';
  return { result: val, ckd_stage: stage };
}