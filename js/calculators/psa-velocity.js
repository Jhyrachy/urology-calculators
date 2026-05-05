/**
 * PSA Velocity (PSAV)
 * ===================
 *
 * CLINICAL USE:
 *   PSA velocity measures the rate of PSA increase over time (ng/mL per year).
 *   Used to assess risk of prostate cancer and its aggressiveness.
 *
 * FORMULA:
 *   PSAV = (PSA2 - PSA1) / time × 12   [expressed as ng/mL/year]
 *
 *   For 3-measurement method:
 *   PSAV = (PSA3 - PSA1) / ((date3 - date1).days / 365.25)
 *
 * THRESHOLDS (D'Amico criteria):
 *   ≤ 0.35 ng/mL/yr  → low risk
 *   0.35–2.0 ng/mL/yr → intermediate
 *   > 2.0 ng/mL/yr   → high risk (associated with fatal PCa in pre-PSA era)
 *
 * REFERENCE:
 *   D'Amico AV, et al. "Prostate Specific Antigen Velocity as a Measure
 *   of the Natural History of Prostate Cancer."
 *   JAMA 2003; 289(18):2693-2704.
 *   https://doi.org/10.1001/jama.289.18.2693
 */

const id       = 'psa-velocity';
const name     = 'PSA Velocity';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'kinetics', 'risk', 'active surveillance', 'biochemical recurrence'];
const description =
  'Measures how fast PSA is rising over time (ng/mL per year). ' +
  'Used for risk stratification and monitoring of active surveillance patients.';

const inputs = [
  {
    id: 'psa1',
    label: 'First PSA (ng/mL)',
    placeholder: 'e.g. 2.1',
    type: 'number',
  },
  {
    id: 'psa2',
    label: 'Second PSA (ng/mL)',
    placeholder: 'e.g. 2.8',
    type: 'number',
  },
  {
    id: 'months',
    label: 'Time between PSA tests (months)',
    placeholder: 'e.g. 12',
    type: 'number',
  },
];

const formula = `Two-measurement PSAV:

  PSAV (ng/mL/yr) = (PSA2 - PSA1) / months × 12

Three-measurement method (more accurate):
  PSAV = (PSA3 - PSA1) / years_between_first_and_third

D'Amico thresholds:
  ≤ 0.35 ng/mL/yr  → Low risk
  0.35–2.0 ng/mL/yr → Intermediate
  > 2.0 ng/mL/yr   → High risk — associated with higher mortality`;

const howToUse =
  'Enter two PSA values and the time between them in months. ' +
  'For most accurate results, use ≥3 measurements over ≥12 months. ' +
  'A PSAV >0.35 ng/mL/yr should raise suspicion even if absolute PSA is low. ' +
  'A PSAV >2.0 ng/mL/yr is associated with higher risk of fatal prostate cancer.';

const refs = [
  {
    text: "D'Amico AV, et al. JAMA 2003;289(18):2693-2704",
    url: 'https://doi.org/10.1001/jama.289.18.2693',
  },
  {
    text: 'PSA kinetics review — European Urology 2014',
    url: 'https://doi.org/10.1016/j.eururo.2014.01.013',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { psa1, psa2, months } = vals;
  if (psa2 <= psa1) {
    throw new Error('PSA2 must be greater than PSA1 (PSA must be rising)');
  }
  const psav = ((psa2 - psa1) / months) * 12;

  let interpretation, risk;
  if (psav <= 0.35) {
    interpretation = 'Low PSA velocity — stable disease, low risk of aggressive cancer.';
    risk = 'low';
  } else if (psav <= 2.0) {
    interpretation = 'Intermediate PSA velocity — monitor closely, consider biopsy.';
    risk = 'moderate';
  } else {
    interpretation = 'High PSA velocity — associated with higher risk of fatal prostate cancer. Urgent work-up recommended.';
    risk = 'high';
  }

  return { value: psav, unit: 'ng/mL/yr', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">PSA Velocity</div>
    <div class="result-value">${result.value.toFixed(2)} ${result.unit}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
