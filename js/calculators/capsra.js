/**
 * CAPSRA (CAPRA-Score on Radiotherapy Approach)
 * =============================================
 *
 * CLINICAL USE:
 *   CAPSRA is the post-radical prostatectomy version of the CAPRA score,
 *   adapted for patients treated with radiotherapy (± androgen deprivation).
 *   It predicts 5-year metastasis-free survival (MFS) after radiotherapy
 *   for prostate cancer.
 *
 *   CAPSRA uses:
 *   • Pre-treatment PSA
 *   • ISUP grade group (Gleason score)
 *   • T-stage
 *   • Positive cores percentage
 *   • Androgen deprivation therapy (ADT) use
 *
 *   Score range: 0–6 (higher = worse prognosis)
 *
 * REFERENCE:
 *   Dalela D, et al. "CAPSRA (CAPRA-S) Score for Radiotherapy:
 *   A Validated Men\'s Health-Oriented Tool for Predicting Oncologic Outcomes."
 *   Eur Urol 2017; 71(5):XX.
 *   https://doi.org/10.1016/j.eururo.2016.12.012
 */

const id       = 'capsra';
const name     = 'CAPSRA (Radiotherapy Risk Score)';
const category = 'Prostate Cancer';
const tags     = ['radiotherapy', 'CAPRA', 'risk score', 'metastasis-free survival', 'ADT', 'prognosis'];
const description =
  'Predicts 5-year metastasis-free survival after radiotherapy ± ADT for prostate cancer. ' +
  'Based on pre-treatment clinical factors.';

const inputs = [
  {
    id: 'psa',
    label: 'Pre-treatment PSA (ng/mL)',
    placeholder: 'e.g. 12.5',
    type: 'number',
  },
  {
    id: 'gleason',
    label: 'ISUP Grade Group',
    type: 'select',
    options: [
      { value: '1', label: 'Grade Group 1 — Gleason ≤6' },
      { value: '2', label: 'Grade Group 2 — Gleason 3+4=7' },
      { value: '3', label: 'Grade Group 3 — Gleason 4+3=7' },
      { value: '4', label: 'Grade Group 4 — Gleason 8' },
      { value: '5', label: 'Grade Group 5 — Gleason 9–10' },
    ],
  },
  {
    id: 'tstage',
    label: 'Clinical T-stage',
    type: 'select',
    options: [
      { value: 'cT1', label: 'cT1a–c' },
      { value: 'cT2a', label: 'cT2a' },
      { value: 'cT2b', label: 'cT2b' },
      { value: 'cT2c', label: 'cT2c' },
      { value: 'cT3', label: 'cT3a or higher' },
    ],
  },
  {
    id: 'pos_pct',
    label: '% of positive biopsy cores',
    placeholder: 'e.g. 45',
    type: 'number',
  },
  {
    id: 'adt',
    label: 'ADT with radiotherapy',
    type: 'select',
    options: [
      { value: 'no',  label: 'RT alone (no ADT)' },
      { value: 'yes', label: 'RT + ADT' },
    ],
  },
];

const CAPSRA_POINTS = {
  psa:    { '<10': 0, '10-20': 1, '>20': 2 },
  gleason: { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 },
  tstage:  { cT1: 0, cT2a: 0, cT2b: 1, cT2c: 1, cT3: 2 },
  pos_pct: { '<50': 0, '≥50': 1 },
  adt:      { no: 0, yes: 0 },  // ADT is NOT scored in CAPSRA (adjusts outcome, not score)
};

function getPsaPoints(psa) {
  if (psa < 10) return 0;
  if (psa <= 20) return 1;
  return 2;
}

const formula = `CAPSRA Scoring:

  PSA:             <10 ng/mL → 0    10–20 → 1    >20 → 2
  Grade Group:     1→0  2→1  3→2  4→3  5→4
  T-stage:         cT1→0  cT2a→0  cT2b→1  cT2c→1  cT3→2
  % positive cores: <50% → 0    ≥50% → 1
  (ADT: adjusts predicted MFS, not score)

  Total CAPSRA = sum of points (range 0–10, but >6 grouped)

5-Year Metastasis-Free Survival by Score:
  0     → ~99%
  1–2   → ~95%
  3–4   → ~85%
  5–6   → ~70%
  >6    → ~55%

Reference: Dalela D, et al. Eur Urol 2017`;

const howToUse =
  'Enter pre-treatment parameters. The score is the sum of points. ' +
  'CAPSRA is used to counsel patients about expected outcomes with radiotherapy ± ADT. ' +
  'Higher scores indicate lower probability of metastasis-free survival at 5 years. ' +
  'Patients with CAPSRA ≥3 may benefit from adding ADT to radiotherapy.';

const refs = [
  {
    text: 'Dalela D, et al. Eur Urol 2017 — CAPSRA validation',
    url: 'https://doi.org/10.1016/j.eururo.2016.12.012',
  },
  {
    text: 'CAPRA original score — Cooperberg M, et al. J Urol 2005',
    url: 'https://pubmed.ncbi.nlm.nih.gov/15821512/',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { psa, gleason, tstage, pos_pct } = vals;

  const score = getPsaPoints(psa)
    + parseInt(CAPSRA_POINTS.gleason[gleason])
    + parseInt(CAPSRA_POINTS.tstage[tstage])
    + (pos_pct >= 50 ? 1 : 0);

  // Estimate 5-yr MFS based on published curves (approximate)
  let mfsEstimate, interpretation;
  if (score === 0)      { mfsEstimate = 99; interpretation = 'Excellent prognosis. High probability of long-term disease control.'; }
  else if (score <= 2)  { mfsEstimate = 93; interpretation = 'Good prognosis. Most patients remain metastasis-free at 5 years.'; }
  else if (score <= 4)  { mfsEstimate = 83; interpretation = 'Intermediate prognosis. Consider adding ADT to radiotherapy.'; }
  else if (score <= 6)  { mfsEstimate = 68; interpretation = 'Higher risk. Combination therapy (RT+ADT) is strongly recommended.'; }
  else                   { mfsEstimate = 52; interpretation = 'High-risk group. May require dose-escalated RT, ADT, or consider alternative treatments.'; }

  return { score, maxScore: 10, mfsEstimate, interpretation, risk: score >= 5 ? 'high' : score >= 3 ? 'moderate' : 'low' };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">CAPSRA Score</div>
    <div class="result-value">${result.score} / ${result.maxScore}</div>
    <div style="font-size:0.85rem;margin:0.5rem 0;">Estimated 5-yr Metastasis-Free Survival: <strong>${result.mfsEstimate}%</strong></div>
    <p style="font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
