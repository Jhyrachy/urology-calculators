/**
 * RENAL Nephrometry Score
 * =======================
 *
 * CLINICAL USE:
 *   Quantifies the complexity of a renal mass for planning partial (PN) vs
 *   radical nephrectomy (RN). Also used for active surveillance decision-making
 *   and predicting warm ischemia time (WIT).
 *
 *   Developed by Kutikov & Uzzo (2009) for clear cell RCC.
 *
 * COMPONENTS (each scored 1–3):
 *   R = Radius (tumor size, max diameter in cm)
 *   E = Exophytic/Endophytic nature
 *   N = Nearness to collecting system / sinus
 *   A = Anterior / Posterior designation
 *   L = Location relative to polar lines
 *
 *   Total score: 4–12
 *   Low complexity: 4–6  → amenable to PN
 *   Moderate: 7–9
 *   High complexity: 10–12 → challenging PN, consider RN
 *
 * REFERENCE:
 *   Kutikov A, Uzzo RG. "The R.E.N.A.L. Nephrometry Score:
 *   A Comprehensive Standardized System for Quantifying Renal Mass Tumor
 *   Complexity." J Urol 2009; 181(2):844-853.
 *   https://doi.org/10.1016/j.juro.2008.11.032
 */

const id       = 'renal-nephrometry';
const name     = 'RENAL Nephrometry Score';
const category = 'Renal Cancer';
const tags     = ['renal cell carcinoma', 'partial nephrectomy', 'nephrometry', 'tumor complexity', 'surgical planning'];
const description =
  'Scores renal tumor complexity (4–12) based on size, location, and depth. ' +
  'Guides surgical approach: partial vs radical nephrectomy.';

const inputs = [
  {
    id: 'radius',
    label: 'R — Tumor size (max diameter, cm)',
    placeholder: 'e.g. 4.5',
    type: 'number',
  },
  {
    id: 'exophytic',
    label: 'E — Exophytic/Endophytic',
    type: 'select',
    options: [
      { value: '3', label: '≥50% exophytic (easiest)' },
      { value: '2', label: '<50% exophytic' },
      { value: '1', label: 'Completely endophytic' },
    ],
  },
  {
    id: 'nearness',
    label: 'N — Nearness to collecting system/sinus',
    type: 'select',
    options: [
      { value: '1', label: '≥7 mm from sinus' },
      { value: '2', label: '4–7 mm from sinus' },
      { value: '3', label: '<4 mm from sinus / invades sinus' },
    ],
  },
  {
    id: 'anterior',
    label: 'A — Anterior or Posterior',
    type: 'select',
    options: [
      { value: 'a', label: 'Anterior' },
      { value: 'p', label: 'Posterior' },
      { value: 'x', label: 'Neither (bisects upper or lower pole)' },
    ],
  },
  {
    id: 'location',
    label: 'L — Location relative to polar lines',
    type: 'select',
    options: [
      { value: '1', label: 'Entirely above upper or below lower pole line' },
      { value: '2', label: 'Crosses the polar line' },
      { value: '3', label: '>50% crosses hilum / entirely between polar lines' },
    ],
  },
];

const formula = `RENAL Score Components:

  R (Radius)     — Tumor size (cm):
                   ≤4 cm  → 1 point
                   >4–7   → 2 points
                   >7 cm  → 3 points

  E (Exophytic)  — How much protrudes from kidney surface:
                   ≥50% exophytic → 1
                   <50% exophytic → 2
                   Completely endophytic → 3

  N (Nearness)  — Distance from collecting system/sinus:
                   ≥7 mm → 1
                   4–7 mm → 2
                   <4 mm / touches → 3

  A (Anterior/Posterior): 'a', 'p', or 'x' (no pts) — for surgical planning

  L (Location)  — Relative to polar lines:
                   Entirely above/below → 1
                   Crosses polar line → 2
                   Entirely between / crosses hilum → 3

Total: 4–12
  Low (4–6):     amenable to partial nephrectomy
  Moderate (7–9): challenging but often doable with PN
  High (10–12):  complex — may require radical or hybrid approach`;

const howToUse =
  'Score each component based on CT/MRI findings. ' +
  'The A (anterior/posterior) suffix (a/p/x) does not add points but is ' +
  'critical for surgical approach planning (flank vs posterior vs anterior). ' +
  'Higher scores predict longer warm ischemia time and higher complication rates ' +
  'for partial nephrectomy. Consider radical nephrectomy for very high scores ' +
  'in patients with reduced renal function.';

const refs = [
  {
    text: 'Kutikov A, Uzzo RG. J Urol 2009;181(2):844-853',
    url: 'https://doi.org/10.1016/j.juro.2008.11.032',
  },
  {
    text: 'Hancock et al. RENAL score and outcomes — Urol Oncol 2020',
    url: 'https://doi.org/10.1016/j.urolonc.2020.02.013',
  },
  {
    text: 'EAU Guidelines — Renal Cell Carcinoma',
    url: 'https://uroweb.org/guidelines/renal-cell-carcinoma',
  },
];

function calculate(vals) {
  const { radius, exophytic, nearness, anterior, location } = vals;

  let rScore;
  if (radius <= 4) rScore = 1;
  else if (radius <= 7) rScore = 2;
  else rScore = 3;

  const score = rScore + parseInt(exophytic) + parseInt(nearness) + parseInt(location);

  let complexity;
  if (score <= 6) complexity = 'Low';
  else if (score <= 9) complexity = 'Moderate';
  else complexity = 'High';

  return {
    score,
    maxScore: 12,
    complexity,
    anteriorSuffix: anterior.toUpperCase(),
    interpretation:
      score <= 6
        ? 'Low complexity tumor — partial nephrectomy is feasible and recommended.'
        : score <= 9
        ? 'Moderate complexity — partial nephrectomy challenging but usually achievable. Consider surgeon experience.'
        : 'High complexity — radical nephrectomy may be preferred, especially with pre-existing CKD.',
    risk: score <= 6 ? 'low' : score <= 9 ? 'moderate' : 'high',
  };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">RENAL Nephrometry Score</div>
    <div class="result-value">${result.score}${result.anteriorSuffix} <span style="font-size:0.9rem;font-weight:400;">/ 12</span></div>
    <div style="font-size:0.85rem;margin:0.5rem 0;">Complexity: <strong>${result.complexity}</strong></div>
    <p style="font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
