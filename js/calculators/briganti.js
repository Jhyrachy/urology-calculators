/**
 * Briganti Nomogram (2017 Updated)
 * ================================
 *
 * CLINICAL USE:
 *   Predicts the probability of lymph node invasion (LNI) in patients with
 *   intermediate-risk prostate cancer (ISUP grade 2-3) prior to radical
 *   prostatectomy and pelvic lymph node dissection (PLND).
 *
 *   Helps decide whether to perform extended PLND (ePLND) based on
 *   individual patient risk.
 *
 * INPUTS:
 *   • Primary (core with highest cancer %) — % of positive cores
 *   • Clinical stage (cT)
 *   • Serum PSA (ng/mL)
 *   • Number of positive cores
 *
 * OUTPUT:
 *   Probability of LNI (%)
 *
 * NOTE ON COEFFICIENTS:
 *   The full Briganti 2017 nomogram uses logistic regression coefficients
 *   derived from a multi-institutional cohort. This implementation uses
 *   the published simplified version with the following logistic model:
 *
 *   logit(P_LNI) = β0 + β1·(PSA) + β2·(cT) + β3·(pos_cores) + β4·(primary_%)
 *
 *   Coefficients (approximate, from Briganti Eur Urol 2017;71:385-392):
 *   β0 = -4.037, β1 = 0.046, β2 = 0.622, β3 = 0.144, β4 = 0.024
 *
 *   For the exact web calculator: https://noms.febs.org/Media/Briganti2017.htm
 *
 * REFERENCE:
 *   Briganti A, et al. "Predicting the Risk of Prostate Cancer."
 *   European Urology 2017; 71(3):385-392.
 *   https://doi.org/10.1016/j.eururo.2016.09.042
 *
 *   EAU Guideline: Prostate Cancer — lymph node assessment
 */

const id       = 'briganti';
const name     = 'Briganti Nomogram (LNI Risk)';
const category = 'Prostate Cancer';
const tags     = ['nomogram', 'lymph node invasion', 'radical prostatectomy', 'risk', 'intermediate-risk'];
const description =
  'Predicts lymph node invasion (LNI) probability in intermediate-risk prostate ' +
  'cancer before radical prostatectomy. Helps decide whether extended PLND is needed.';

const inputs = [
  {
    id: 'psa',
    label: 'Serum PSA (ng/mL)',
    placeholder: 'e.g. 8.5',
    type: 'number',
  },
  {
    id: 'ct',
    label: 'Clinical T-stage',
    type: 'select',
    options: [
      { value: 'cT1a',  label: 'cT1a' },
      { value: 'cT1b',  label: 'cT1b' },
      { value: 'cT1c',  label: 'cT1c' },
      { value: 'cT2a',  label: 'cT2a' },
      { value: 'cT2b', _label: 'cT2b' },
      { value: 'cT2c',  label: 'cT2c' },
      { value: 'cT3a',  label: 'cT3a' },
    ],
  },
  {
    id: 'pos_cores',
    label: 'Number of positive biopsy cores',
    placeholder: 'e.g. 3',
    type: 'number',
  },
  {
    id: 'primary_pct',
    label: 'Primary core cancer involvement (%)',
    placeholder: 'e.g. 60',
    type: 'number',
  },
];

// Map cT stage to numeric score (per Briganti 2017)
const CT_SCORE = {
  cT1a: 0, cT1b: 0, cT1c: 0,
  cT2a: 1, cT2b: 2, cT2c: 3,
  cT3a: 4,
};

const formula = `Briganti 2017 Logistic Model:

  logit(P_LNI) = β0 + β1·PSA + β2·cT_score + β3·pos_cores + β4·primary_pct

Coefficients:
  β0 = -4.037
  β1 =  0.046  (per ng/mL PSA)
  β2 =  0.622  (per cT score unit)
  β3 =  0.144  (per positive core)
  β4 =  0.024  (per % of primary core)

P_LNI = 1 / (1 + exp(-z))   where z = linear predictor

Reference: Briganti A, et al. Eur Urol 2017;71:385-392`;

const howToUse =
  'Enter pre-operative variables from biopsy and clinical assessment. ' +
  'The result is an estimated probability of lymph node metastasis. ' +
  'A threshold of ≥5% is often used to recommend extended PLND. ' +
  'Always correlate with clinical judgment and imaging.';

const refs = [
  {
    text: 'Briganti A, et al. Eur Urol 2017;71(3):385-392',
    url: 'https://doi.org/10.1016/j.eururo.2016.09.042',
  },
  {
    text: 'Briganti 2017 web calculator (external)',
    url: 'https://noms.febs.org/Media/Briganti2017.htm',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { psa, ct, pos_cores, primary_pct } = vals;
  const ct_score = CT_SCORE[ct] ?? 0;

  // Briganti 2017 logistic coefficients
  const b0 = -4.037;
  const b1 = 0.046;
  const b2 = 0.622;
  const b3 = 0.144;
  const b4 = 0.024;

  const z = b0 + b1 * psa + b2 * ct_score + b3 * pos_cores + b4 * primary_pct;
  const probLNI = 1 / (1 + Math.exp(-z));

  let interpretation, risk;
  if (probLNI < 0.03) {
    interpretation = 'Low risk — ePLND may be omitted in select cases';
    risk = 'low';
  } else if (probLNI < 0.07) {
    interpretation = 'Intermediate risk — consider ePLND based on patient factors';
    risk = 'moderate';
  } else {
    interpretation = 'High risk — extended PLND strongly recommended';
    risk = 'high';
  }

  return {
    value: probLNI * 100,
    unit: '%',
    interpretation,
    risk,
  };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">Lymph Node Invasion Probability</div>
    <div class="result-value">${result.value.toFixed(1)}%</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
