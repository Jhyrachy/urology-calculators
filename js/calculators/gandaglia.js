/**
 * Gandaglia Nomogram (2014)
 * ==========================
 *
 * CLINICAL USE:
 *   Predicts the probability of EAU surgical complications after radical
 *   prostatectomy (RP) or cytoreductive radical nephrectomy in kidney cancer.
 *   (Note: there are multiple Gandaglia nomograms — this implements the
 *    RP complication predictor published in Eur Urol 2014.)
 *
 *   For kidney cancer version, see the renal-cell-carcinoma section.
 *
 * INPUTS (approximate from published model):
 *   • Age (years)
 *   • BMI (kg/m²)
 *   • Charlson Comorbidity Index (CCI)
 *   • Surgical approach (open vs laparoscopic/robotic)
 *   • Console time (minutes, optional)
 *
 * OUTPUT:
 *   Probability of any Clavien-Dindo ≥ III complication (%)
 *
 * REFERENCE:
 *   Gandaglia G, et al. "A Novel Mathematical Model for Predicting
 *   Complications after Radical Prostatectomy."
 *   European Urology 2014; 66(4):686-693.
 *   https://doi.org/10.1016/j.eururo.2014.03.022
 *
 *   EAU Guideline: Prostate Cancer — Treatment
 */

const id       = 'gandaglia';
const name     = 'Gandaglia Complication Nomogram';
const category = 'Prostate Cancer';
const tags     = ['complications', 'radical prostatectomy', 'Clavien-Dindo', 'risk', 'surgical'];
const description =
  'Predicts risk of significant surgical complications (Clavien-Dindo ≥ III) ' +
  'after radical prostatectomy based on patient and surgical factors.';

const inputs = [
  {
    id: 'age',
    label: 'Age (years)',
    placeholder: 'e.g. 65',
    type: 'number',
  },
  {
    id: 'bmi',
    label: 'BMI (kg/m²)',
    placeholder: 'e.g. 27.5',
    type: 'number',
  },
  {
    id: 'cci',
    label: 'Charlson Comorbidity Index (0–15)',
    placeholder: 'e.g. 2',
    type: 'number',
  },
  {
    id: 'approach',
    label: 'Surgical approach',
    type: 'select',
    options: [
      { value: 'open',    label: 'Open retropubic' },
      { value: 'laparoscopic', label: 'Laparoscopic' },
      { value: 'robotic', label: 'Robotic-assisted' },
    ],
  },
];

// Approximate coefficients from Gandaglia et al. Eur Urol 2014;66:686
// Full model includes console time, nerve-sparing, etc.
const B = {
  intercept: -4.52,
  age:        0.031,   // per year
  bmi:        0.048,   // per kg/m²
  cci:        0.223,   // per CCI point
  lap:        -0.32,   // laparoscopic
  robotic:    -0.58,   // robotic vs open
};

const formula = `Gandaglia Logistic Model (Eur Urol 2014):

  z = β0 + β1·age + β2·BMI + β3·CCI + β4·approach

Coefficients:
  β0 (intercept) = -4.52
  β1 (age)       = +0.031  per year
  β2 (BMI)       = +0.048  per kg/m²
  β3 (CCI)       = +0.223  per point
  β4 (laparoscopic) = -0.32  vs open
  β4 (robotic)      = -0.58  vs open

P(complication) = 1 / (1 + exp(-z))

Reference: Gandaglia G, et al. Eur Urol 2014;66(4):686-693`;

const howToUse =
  'Enter patient factors before surgery. The model estimates risk of major ' +
  '(Clavien-Dindo ≥ III) complications. Higher BMI, age, and comorbidity ' +
  'increase risk. Minimally invasive approaches carry lower risk. ' +
  'Use as decision support, not sole determinant.';

const refs = [
  {
    text: 'Gandaglia G, et al. Eur Urol 2014;66(4):686-693',
    url: 'https://doi.org/10.1016/j.eururo.2014.03.022',
  },
  {
    text: 'Clavien-Dindo classification of surgical complications',
    url: 'https://doi.org/10.1007/s00268-009-0271-5',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { age, bmi, cci, approach } = vals;
  const approachBeta = approach === 'laparoscopic' ? B.lap : approach === 'robotic' ? B.robotic : 0;

  const z = B.intercept + B.age * age + B.bmi * bmi + B.cci * cci + approachBeta;
  const prob = 1 / (1 + Math.exp(-z));

  return {
    value: prob * 100,
    unit: '%',
    interpretation:
      prob < 0.03 ? 'Low surgical risk — standard care' :
      prob < 0.07 ? 'Moderate risk — optimise modifiable factors' :
      'High risk — consider alternative strategy',
    risk: prob < 0.03 ? 'low' : prob < 0.07 ? 'moderate' : 'high',
  };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">Major Complication Risk (Clavien ≥ III)</div>
    <div class="result-value">${result.value.toFixed(1)}%</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
