/**
 * PHI (Prostate Health Index)
 * ============================
 *
 * CLINICAL USE:
 *   PHI is a mathematical combination of total PSA, free PSA, and [-2]proPSA.
 *   It is more specific than PSA alone for detecting prostate cancer, especially
 *   in men with PSA in the 4–10 ng/mL range and a negative DRE.
 *
 * FORMULA:
 *   PHI = ([-2]proPSA / free PSA) × √PSA
 *   (some versions use: PHI = [-2]proPSA/fPSA × 1000 for integer math)
 *
 * FDA-cleared thresholds:
 *   < 25   → low probability of PCa (biopsy may be avoided)
 *   25–35  → intermediate — consider other factors
 *   > 35   → higher probability of PCa — biopsy recommended
 *
 * NOTE:
 *   [-2]proPSA (p2PSA) must be measured by specific immunoassays
 *   (e.g. Beckman Coulter DxI). Not all labs offer this test.
 *
 * REFERENCE:
 *   Catalona WJ, et al. "Multicenter Evaluation of the Prostate Health Index
 *   for Detection of Prostate Cancer." J Urol 2011; 185(5):1650-1655.
 *   https://doi.org/10.1016/j.juro.2010.12.032
 */

const id       = 'phi';
const name     = 'Prostate Health Index (PHI)';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'biomarker', 'diagnosis', 'free PSA', 'proPSA', 'PHI'];
const description =
  'Combines total PSA, free PSA, and [-2]proPSA for more accurate detection ' +
  'of prostate cancer in the 4–10 ng/mL PSA range.';

const inputs = [
  {
    id: 'psa',
    label: 'Total PSA (ng/mL)',
    placeholder: 'e.g. 6.5',
    type: 'number',
  },
  {
    id: 'fpsa',
    label: 'Free PSA (ng/mL)',
    placeholder: 'e.g. 0.85',
    type: 'number',
  },
  {
    id: 'p2psa',
    label: '[-2]proPSA (p2PSA) (pg/mL)',
    placeholder: 'e.g. 18.5',
    type: 'number',
  },
];

const formula = `PHI Formula:

  PHI = ([-2]proPSA / free PSA) × √(total PSA)

  = (p2PSA / fPSA) × √PSA

FDA-cleared thresholds (Beckman Coulter assay):
  PHI < 25   → Low risk — biopsy may be avoided
  PHI 25–35  → Intermediate — correlate with DRE and clinical context
  PHI > 35   → High risk — biopsy recommended

Reference: Catalona WJ, et al. J Urol 2011;185(5):1650-1655`;

const howToUse =
  'Requires three lab values from the same blood draw. These must be ' +
  'measured using the Beckman Coulter immunoassay platform for valid results. ' +
  'PHI is most useful when total PSA is between 4–10 ng/mL and DRE is negative. ' +
  'It reduces unnecessary biopsies by ~30% compared to PSA alone.';

const refs = [
  {
    text: 'Catalona WJ, et al. J Urol 2011;185(5):1650-1655',
    url: 'https://doi.org/10.1016/j.juro.2010.12.032',
  },
  {
    text: 'Loeb S, et al. Eur Urol 2013 — systematic review of PHI',
    url: 'https://doi.org/10.1016/j.eururo.2013.03.004',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer Diagnosis',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { psa, fpsa, p2psa } = vals;
  if (fpsa <= 0 || psa <= 0) throw new Error('PSA and fPSA must be positive');

  const phi = (p2psa / fpsa) * Math.sqrt(psa);

  let interpretation, risk;
  if (phi < 25) {
    interpretation = 'Low probability of prostate cancer. Biopsy may be avoided. Continue routine screening.';
    risk = 'low';
  } else if (phi <= 35) {
    interpretation = 'Intermediate probability. Consider DRE, family history, and patient preference before biopsy.';
    risk = 'moderate';
  } else {
    interpretation = 'High probability of prostate cancer. Biopsy is recommended.';
    risk = 'high';
  }

  return { value: phi, unit: '', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">PHI Score</div>
    <div class="result-value">${result.value.toFixed(1)}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
