/**
 * eGFR (Estimated Glomerular Filtration Rate)
 * ============================================
 *
 * CLINICAL USE:
 *   eGFR estimates kidney function using serum creatinine, age, sex, and race.
 *   Essential for:
 *   - Dosing drugs (especially contrast agents, chemotherapy)
 *   - Assessing eligibility for contrast MRI/CT
 *   - Pre-operative renal function assessment
 *   - Monitoring chronic kidney disease (CKD)
 *
 * FORMULAS:
 *   CKD-EPI (2021, race-free) — recommended by most guidelines:
 *     eGFR = 142 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^-1.200 × 0.9938^age × 1.012 [if female]
 *     where κ = 0.7 (female), 0.9 (male); α = -0.241 (female), -0.302 (male)
 *
 *   MDRD (older, less accurate):
 *     eGFR = 175 × SCr^-1.154 × age^-0.203 × 0.742 [if female]
 *
 * NOTE:
 *   CKD-EPI 2021 equation does NOT use race coefficient.
 *   Creatinine must be in mg/dL.
 *   eGFR < 60 mL/min/1.73m² = CKD stage 3 or worse.
 *
 * REFERENCE:
 *   CKD-EPI Collaboration. "A New Equation to Estimate GFR."
 *   Annals of Internal Medicine 2009; 150(9):604-612.
 *   Updated 2021 race-free equation: https://doi.org/10.7326/M20-8183
 */

const id       = 'egfr';
const name     = 'eGFR (CKD-EPI 2021)';
const category = 'Renal Function';
const tags     = ['kidney function', 'creatinine', 'CKD', 'renal', 'pre-operative', 'GFR'];
const description =
  'Estimates glomerular filtration rate using the CKD-EPI 2021 race-free equation. ' +
  'Essential for assessing renal function before procedures or chemotherapy.';

const inputs = [
  {
    id: 'creatinine',
    label: 'Serum Creatinine (mg/dL)',
    placeholder: 'e.g. 1.1',
    type: 'number',
  },
  {
    id: 'age',
    label: 'Age (years)',
    placeholder: 'e.g. 65',
    type: 'number',
  },
  {
    id: 'sex',
    label: 'Sex at birth',
    type: 'select',
    options: [
      { value: 'male',   label: 'Male' },
      { value: 'female', label: 'Female' },
    ],
  },
];

const formula = `CKD-EPI 2021 Race-Free Equation:

  eGFR = 142 × min(SCr/κ, 1)^α × max(SCr/κ, 1)^-1.200 × 0.9938^age × 1.012 [if female]

  κ = 0.7 (female), 0.9 (male)
  α = -0.241 (female), -0.302 (male)

If SCr is in µmol/L, divide by 88.4 to convert to mg/dL.

CKD Stages:
  G1: ≥90  — Normal
  G2: 60–89 — Mild
  G3a: 45–59 — Moderate
  G3b: 30–44 — Moderately severe
  G4: 15–29 — Severe
  G5: <15   — Kidney failure`;

const howToUse =
  'Enter serum creatinine (mg/dL), age, and sex. ' +
  'If your lab reports creatinine in µmol/L, divide by 88.4 to get mg/dL. ' +
  'eGFR < 60 mL/min/1.73m² indicates CKD stage 3 or worse. ' +
  'For urologists: critical before contrast imaging, chemotherapy (cisplatin), ' +
  'and decisions about nephron-sparing surgery.';

const refs = [
  {
    text: 'CKD-EPI Collaboration. Ann Intern Med 2009;150(9):604-612',
    url: 'https://doi.org/10.7326/0003-4819-150-9-200905050-00006',
  },
  {
    text: 'CKD-EPI 2021 Race-Free Update — Inker LA, et al.',
    url: 'https://doi.org/10.7326/M20-8183',
  },
  {
    text: 'KDIGO 2024 CKD Guideline',
    url: 'https://kdigo.org/guidelines/',
  },
];

function calculate(vals) {
  const { creatinine, age, sex } = vals;
  const isFemale = sex === 'female';
  const κ = isFemale ? 0.7 : 0.9;
  const α = isFemale ? -0.241 : -0.302;

  const scr = creatinine;
  const min = Math.min(scr / κ, 1);
  const max = Math.max(scr / κ, 1);

  let egfr = 142 * Math.pow(min, α) * Math.pow(max, -1.200) * Math.pow(0.9938, age);
  if (isFemale) egfr *= 1.012;

  // Cap at 200
  egfr = Math.min(egfr, 200);

  // CKD stage
  let stage, stageLabel;
  if (egfr >= 90)       { stage = 'G1'; stageLabel = 'Normal'; }
  else if (egfr >= 60)  { stage = 'G2'; stageLabel = 'Mildly reduced'; }
  else if (egfr >= 45)  { stage = 'G3a'; stageLabel = 'Mildly–moderately reduced'; }
  else if (egfr >= 30)  { stage = 'G3b'; stageLabel = 'Moderately–severely reduced'; }
  else if (egfr >= 15)  { stage = 'G4'; stageLabel = 'Severely reduced'; }
  else                   { stage = 'G5'; stageLabel = 'Kidney failure'; }

  return {
    value: egfr,
    unit: 'mL/min/1.73m²',
    stage,
    stageLabel,
    interpretation: egfr < 60
      ? `CKD Stage ${stage} — eGFR ${egfr.toFixed(0)}. Reduce drug doses, monitor electrolytes, and consider nephrology referral.`
      : `eGFR ${egfr.toFixed(0)} — normal or mildly reduced kidney function. General anesthesia and most procedures are safe.`,
    risk: egfr < 30 ? 'high' : egfr < 60 ? 'moderate' : 'low',
  };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">eGFR (CKD-EPI 2021)</div>
    <div class="result-value">${result.value.toFixed(0)} <span style="font-size:0.9rem;font-weight:400;">${result.unit}</span></div>
    <div style="font-size:0.85rem;margin:0.5rem 0;">CKD Stage: <strong>${result.stage}</strong> — ${result.stageLabel}</div>
    <p style="font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
