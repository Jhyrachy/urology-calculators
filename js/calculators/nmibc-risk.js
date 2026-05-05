/**
 * EAU NMIBC Risk Calculator (Simplified)
 * =====================================
 *
 * CLINICAL USE:
 *   Stratifies non-muscle-invasive bladder cancer (NMIBC) into risk groups
 *   based on the 2024 EAU guidelines. Used to guide treatment intensity:
 *   - Low risk: single post-TURBT mitomycin C instillation
 *   - Intermediate: full-course BCG or repeat mitomycin C
 *   - High risk: early cystectomy or radical treatment
 *
 * FACTORS FOR RISK CLASSIFICATION (simplified table):
 *   LOW RISK: Solitary, Ta G1, <3cm, no CIS
 *   HIGH RISK: Any of: T1, G3, CIS, multiple/recurrent, ≥3cm, G2pTa>1
 *   INTERMEDIATE: All others
 *
 * REFERENCE:
 *   EAU Guidelines on Non-Muscle-Invasive Bladder Cancer (updated 2024).
 *   https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer
 */

const id          = 'nmibc-risk';
const name        = 'EAU NMIBC Risk Stratification';
const category    = 'Bladder Cancer';
const tags        = ['NMIBC', 'bladder cancer', 'risk', 'BCG', 'TURBT', 'EAU'];
const description = 'Stratifies NMIBC patients into low/intermediate/high risk groups per 2024 EAU guidelines to guide treatment.';

const inputs = [
  { id: 'stage',  label: 'Pathological stage', type: 'select', options: [
    { value: 'Ta', label: 'Ta — papillary, confined to urothelium' },
    { value: 'T1', label: 'T1 — invades lamina propria' },
  ]},
  { id: 'grade',  label: 'WHO 1973 grade (or WHO 2004/2016 group)', type: 'select', options: [
    { value: 'G1', label: 'G1 / Grade 1 — Low grade' },
    { value: 'G2', label: 'G2 — Intermediate grade' },
    { value: 'G3', label: 'G3 / Grade 3 — High grade' },
  ]},
  { id: 'size',   label: 'Largest tumor diameter (cm)', placeholder: 'e.g. 2.5', type: 'number' },
  { id: 'count',  label: 'Number of tumors', placeholder: 'e.g. 1', type: 'number' },
  { id: 'cis',    label: 'Concurrent CIS', type: 'select', options: [{ value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' }] },
  { id: 'prior',  label: 'Prior recurrence', type: 'select', options: [{ value: 'primary', label: 'Primary (first TURBT)' }, { value: 'recurrent', label: 'Recurrent tumor' }] },
];

const formula = `EAU 2024 NMIBC Risk Groups:

  LOW RISK (ALL must be true):
    • Ta G1, solitary, <3cm, no CIS, primary

  HIGH RISK (ANY triggers):
    • T1 tumor
    • G3 / Grade 3
    • CIS (concurrent)
    • Multiple + recurrent (≥2 tumors, prior recurrence)
    • Size ≥3cm
    • G2pTa >1 tumor

  INTERMEDIATE: All others not fitting low or high

Reference: EAU Guidelines on NMIBC 2024`;

const howToUse =
  'Enter the TURBT pathological findings. Low-risk patients need only a ' +
  'single post-operative mitomycin C instillation. Intermediate-risk patients ' +
  'benefit from adjuvant BCG or repeat mitomycin C. High-risk patients should be ' +
  'counseled about early cystectomy vs BCG + close surveillance. ' +
  'This tool reflects the 2024 EAU risk classification table.';

const refs = [
  { text: 'EAU Guidelines — Non-Muscle-Invasive Bladder Cancer 2024', url: 'https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer' },
  { text: 'Sylvester RJ, et al. Eur Urol 2019;76(2):230-241 — EAU NMIBC validation', url: 'https://doi.org/10.1016/j.eururo.2019.02.014' },
];

function calculate(vals) {
  const { stage, grade, size, count, cis, prior } = vals;
  const isHigh =
    stage === 'T1' ||
    grade === 'G3' ||
    cis === 'yes' ||
    (prior === 'recurrent' && count >= 2) ||
    size >= 3 ||
    (grade === 'G2' && count > 1);

  const isLow =
    stage === 'Ta' && grade === 'G1' &&
    size < 3 && count === 1 && cis === 'no' && prior === 'primary';

  let group, interpretation, risk;
  if (isLow) {
    group = 'LOW RISK';
    interpretation = 'Single post-TURBT mitomycin C instillation. Standard follow-up cystoscopy.';
    risk = 'low';
  } else if (isHigh) {
    group = 'HIGH RISK';
    interpretation = 'Consider early cystectomy or radical BCG therapy. Discuss in multidisciplinary team. Early re-TURBT recommended for T1 G3.';
    risk = 'high';
  } else {
    group = 'INTERMEDIATE RISK';
    interpretation = 'Adjuvant BCG instillations (6+ weekly doses) or repeat mitomycin C. More frequent cystoscopy follow-up.';
    risk = 'moderate';
  }

  return { group, interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">EAU NMIBC Risk Group</div>
    <div class="result-value">${result.group}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
