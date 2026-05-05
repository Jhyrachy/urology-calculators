/**
 * PNI (Prognostic Nutritional Index)
 * =================================
 *
 * CLINICAL USE:
 *   PNI combines serum albumin and lymphocyte count to assess a patient's
 *   nutritional and immunological status. Originally developed for
 *   gastrointestinal surgery patients, it is now widely used in oncology
 *   for prognosis in RCC, PCa, and bladder cancer.
 *
 *   Low PNI = malnourished / immunocompromised = worse cancer outcomes
 *
 * FORMULA:
 *   PNI = 10 × Serum Albumin (g/dL) + 0.005 × Total Lymphocyte Count (cells/µL)
 *
 *   Note: If ALC is in 10⁹/L, multiply by 1000 before using.
 *
 * THRESHOLDS:
 *   < 40   → malnourished — poor prognosis, higher complication risk
 *   40–48  → moderate nutritional risk
 *   > 48   → well-nourished — better prognosis
 *
 * REFERENCE:
 *   Buzby GP, et al. "Prognostic Nutritional Index in gastrointestinal surgery."
 *   Am J Surg 1980; 139(2):160-167.
 *
 *   Applications in urologic oncology:
 *   - Zhao Z, et al. PNI and renal cancer prognosis. Urol Oncol 2020.
 *   - EAU Guidelines — Renal Cell Carcinoma.
 */

const id       = 'pni';
const name     = 'PNI (Prognostic Nutritional Index)';
const category = 'General Oncology';
const tags     = ['nutrition', 'albumin', 'lymphocytes', 'prognosis', 'immunology', 'RCC', 'bladder cancer'];
const description =
  'Combines serum albumin and lymphocyte count to assess nutritional-immune status. ' +
  'Low PNI is associated with worse cancer-specific survival.';

const inputs = [
  {
    id: 'albumin',
    label: 'Serum Albumin (g/dL)',
    placeholder: 'e.g. 4.0',
    type: 'number',
  },
  {
    id: 'alc',
    label: 'Absolute Lymphocyte Count (cells/µL)',
    placeholder: 'e.g. 1800',
    type: 'number',
  },
];

const formula = `Formula (Buzby/Onodera PNI):

  PNI = 10 × Albumin (g/dL) + 0.005 × ALC (cells/µL)

If ALC is in 10⁹/L: multiply by 1000 first → cells/µL

Thresholds:
  < 40   → Malnourished — higher surgical risk, worse prognosis
  40–48  → Moderate nutritional risk
  > 48   → Well-nourished — better surgical and oncological outcomes`;

const howToUse =
  'Enter serum albumin (g/dL) from a chemistry panel and ALC from CBC. ' +
  'Albumin must be in g/dL (not g/L — to convert g/L ÷ 10 = g/dL). ' +
  'PNI is a strong independent predictor of survival in RCC, PCa, and bladder cancer. ' +
  'Pre-operative PNI <40 is associated with higher complication rates and worse cancer outcomes.';

const refs = [
  {
    text: 'Buzby GP, et al. Am J Surg 1980;139(2):160-167',
    url: 'https://pubmed.ncbi.nlm.nih.gov/7377511/',
  },
  {
    text: 'PNI in RCC — Zhao Z, et al. Urologic Oncology 2020',
    url: 'https://doi.org/10.1016/j.urolonc.2019.12.027',
  },
  {
    text: 'EAU Guidelines — Renal Cell Carcinoma',
    url: 'https://uroweb.org/guidelines/renal-cell-carcinoma',
  },
];

function calculate(vals) {
  const { albumin, alc } = vals;
  if (albumin <= 0 || alc <= 0) throw new Error('Albumin and ALC must be positive');

  const pni = 10 * albumin + 0.005 * alc;

  let interpretation, risk;
  if (pni < 40) {
    interpretation = 'Malnourished — high risk for surgical complications and worse oncological outcomes. Nutritional support should be considered pre-operatively.';
    risk = 'high';
  } else if (pni <= 48) {
    interpretation = 'Moderate nutritional risk — optimise nutrition before major surgery. Intermediate prognosis.';
    risk = 'moderate';
  } else {
    interpretation = 'Well-nourished — lower surgical risk and better expected cancer-specific survival.';
    risk = 'low';
  }

  return { value: pni, unit: '', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">Prognostic Nutritional Index</div>
    <div class="result-value">${result.value.toFixed(1)}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
