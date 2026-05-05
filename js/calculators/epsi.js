/**
 * EPSI (EAU Risk Score for NMIBC)
 * ================================
 *
 * CLINICAL USE:
 *   European Association of Urology (EAU) risk score for predicting
 *   recurrence and progression in non-muscle-invasive bladder cancer (NMIBC).
 *   Used to stratify patients into low, intermediate, and high risk groups
 *   to guide treatment (BCG, cystectomy, follow-up intensity).
 *
 * RISK GROUPS (simplified from EAU NMIBC guidelines):
 *   LOW RISK:
 *     - Single, Ta, G1, <3cm, no CIS
 *   INTERMEDIATE RISK:
 *     - All others not fitting low or high
 *   HIGH RISK:
 *     - T1, G3, CIS, multiple/recurrent, ≥3cm, G2pTa >1 tumor
 *
 * THIS CALCULATOR:
 *   Assigns points to each factor to give a numeric risk score.
 *
 * REFERENCE:
 *   EAU Guidelines on Non-muscle-invasive Bladder Cancer.
 *   European Urology. Updated annually.
 *   https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer
 */

const id       = 'epsi';
const name     = 'EAU NMIBC Risk Score';
const category = 'Bladder Cancer';
const tags     = ['NMIBC', 'bladder cancer', 'recurrence', 'progression', 'BCG', 'risk stratification'];
const description =
  'Stratifies non-muscle-invasive bladder cancer (NMIBC) patients into ' +
  'low, intermediate, and high risk groups to guide BCG therapy and follow-up.';

const inputs = [
  {
    id: 'stage',
    label: 'T-stage',
    type: 'select',
    options: [
      { value: 'Ta',  label: 'Ta — papillary, confined to urothelium' },
      { value: 'T1',  label: 'T1 — invades lamina propria' },
    ],
  },
  {
    id: 'grade',
    label: 'Tumor grade (WHO 1973 or 2004/2016)',
    type: 'select',
    options: [
      { value: 'G1', label: 'G1 — Low grade (1973) / Grade 1 (2004)' },
      { value: 'G2', label: 'G2 — Intermediate grade (1973)' },
      { value: 'G3', label: 'G3 — High grade (1973) / Grade 3 (2004)' },
    ],
  },
  {
    id: 'size',
    label: 'Tumor size (cm)',
    placeholder: 'e.g. 2.5',
    type: 'number',
  },
  {
    id: 'count',
    label: 'Number of tumors',
    placeholder: 'e.g. 1',
    type: 'number',
  },
  {
    id: 'cis',
    label: 'Concomitant CIS',
    type: 'select',
    options: [
      { value: 'no',  label: 'No CIS' },
      { value: 'yes', label: 'Yes — concurrent carcinoma in situ' },
    ],
  },
  {
    id: 'recurrence',
    label: 'Prior recurrence history',
    type: 'select',
    options: [
      { value: 'primary', label: 'Primary (first tumor)' },
      { value: 'recurrent', label: 'Recurrent (previous TURBTs)' },
    ],
  },
];

const formula = `EAU Risk Group Scoring:

  Points are assigned per factor:
  - T1              → +2
  - G3/High grade  → +2
  - Size ≥3cm       → +1
  - Multiplicity    → +1 (≥2 tumors)
  - CIS present     → +2
  - Recurrent       → +1

  Risk Group:
    0–1 points  → LOW RISK
    2–4 points  → INTERMEDIATE RISK
    ≥5 points  → HIGH RISK

Reference: EAU Guidelines on Non-Muscle-Invasive Bladder Cancer`;

const howToUse =
  'Enter the pathological findings from TURBT. This score assigns a numeric ' +
  'risk level to guide treatment intensity: low-risk patients may need only ' +
  'single instillation of mitomycin C post-TURBT; intermediate-risk patients ' +
  'benefit from adjuvant BCG; high-risk patients should be considered for ' +
  'early cystectomy or radical treatment.';

const refs = [
  {
    text: 'EAU Guidelines — Non-Muscle-Invasive Bladder Cancer',
    url: 'https://uroweb.org/guidelines/non-muscle-invasive-bladder-cancer',
  },
  {
    text: 'Sylvester RJ, et al. Eur Urol 2019 — EAU risk group validation',
    url: 'https://doi.org/10.1016/j.eururo.2019.02.014',
  },
];

function calculate(vals) {
  const { stage, grade, size, count, cis, recurrence } = vals;
  let score = 0;
  const factors = [];

  if (stage === 'T1')    { score += 2; factors.push('T1 invasion (+2)'); }
  if (grade === 'G3')    { score += 2; factors.push('G3/High grade (+2)'); }
  if (size >= 3)         { score += 1; factors.push('Size ≥3cm (+1)'); }
  if (count >= 2)        { score += 1; factors.push(`Multiplicity ${count} tumors (+1)`); }
  if (cis === 'yes')     { score += 2; factors.push('CIS present (+2)'); }
  if (recurrence === 'recurrent') { score += 1; factors.push('Prior recurrence (+1)'); }

  let group, interpretation, risk;
  if (score <= 1) {
    group = 'LOW RISK';
    interpretation = 'Adjuvant mitomycin C post-TURBT. Standard follow-up.';
    risk = 'low';
  } else if (score <= 4) {
    group = 'INTERMEDIATE RISK';
    interpretation = 'Consider adjuvant BCG instillations. More frequent cystoscopies.';
    risk = 'moderate';
  } else {
    group = 'HIGH RISK';
    interpretation = 'Early cystectomy should be discussed. BCG + close surveillance or radical treatment.';
    risk = 'high';
  }

  return { score, maxScore: 9, group, interpretation, risk, factors };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">NMIBC Risk Group</div>
    <div class="result-value">${result.group}</div>
    <div style="font-size:0.8rem;margin:0.5rem 0;">Score: ${result.score}/9</div>
    <p style="font-size:0.875rem;">${result.interpretation}</p>
    <ul style="font-size:0.8rem;margin-top:0.5rem;padding-left:1.2rem;color:var(--text-muted);">
      ${result.factors.map(f => `<li>${f}</li>`).join('')}
    </ul>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
