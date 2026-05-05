/**
 * NLR (Neutrophil-to-Lymphocyte Ratio)
 * ====================================
 *
 * CLINICAL USE:
 *   NLR is a marker of systemic inflammatory response (SIR).
 *   Elevated NLR is associated with worse prognosis in many cancers,
 *   including prostate cancer, renal cell carcinoma, and bladder cancer.
 *
 *   Used for:
 *   - Prognosis in metastatic castration-resistant prostate cancer (mCRPC)
 *   - Predicting survival in RCC and urothelial carcinoma
 *   - Monitoring treatment response (immunotherapy response often correlates
 *     with decreasing NLR)
 *
 * FORMULA:
 *   NLR = Absolute Neutrophil Count (cells/µL or 10⁹/L) /
 *         Absolute Lymphocyte Count (cells/µL or 10⁹/L)
 *
 * THRESHOLDS:
 *   < 3.0   → normal / low inflammatory state
 *   3.0–5.0 → moderate inflammation
 *   > 5.0   → significant systemic inflammation / poor prognosis
 *
 * NOTE:
 *   Both ANC and ALC must use the same unit. Most labs report
 *   ANC as cells/µL (×10⁹/L = 1000 cells/µL). If using 10⁹/L,
 *   divide ANC by 1000 before calculating if ALC is in cells/µL.
 *
 * REFERENCE:
 *   Templeton AJ, et al. "Prognostic Role of Neutrophil-to-Lymphocyte Ratio
 *   in Solid Tumors: A Systematic Review and Meta-Analysis."
 *   J Natl Cancer Inst 2014; 106(6):dju124.
 *   https://doi.org/10.1093/jnci/dju124
 */

const id       = 'nlr';
const name     = 'NLR (Neutrophil-Lymphocyte Ratio)';
const category = 'General Oncology';
const tags     = ['inflammation', 'prognosis', 'biomarker', 'CBC', 'immune'];
const description =
  'Calculates NLR from complete blood count. Elevated NLR indicates systemic ' +
  'inflammation and is associated with poorer cancer prognosis.';

const inputs = [
  {
    id: 'anc',
    label: 'Absolute Neutrophil Count (cells/µL)',
    placeholder: 'e.g. 4500',
    type: 'number',
  },
  {
    id: 'alc',
    label: 'Absolute Lymphocyte Count (cells/µL)',
    placeholder: 'e.g. 1500',
    type: 'number',
  },
];

const formula = `Formula:

  NLR = ANC (cells/µL) / ALC (cells/µL)

Thresholds (solid tumor literature):
  < 3.0   → Normal / low inflammatory state
  3.0–5.0 → Moderate systemic inflammation
  > 5.0   → Significant inflammation — poor prognosis

Note: If your lab reports in 10⁹/L:
  ANC (10⁹/L) × 1000 = ANC (cells/µL)
  Example: 4.5 × 10⁹/L = 4500 cells/µL`;

const howToUse =
  'Enter the absolute neutrophil count (ANC) and absolute lymphocyte count (ALC) ' +
  'from a complete blood count (CBC). These are typically reported in cells/µL ' +
  '(also written as /µL or /mm³ — all equivalent). ' +
  'If your lab uses 10⁹/L, multiply by 1000 to convert to cells/µL. ' +
  'NLR >3 is associated with worse survival in prostate, kidney, and bladder cancer. ' +
  'On immunotherapy, decreasing NLR often indicates treatment response.';

const refs = [
  {
    text: 'Templeton AJ, et al. J Natl Cancer Inst 2014;106(6):dju124',
    url: 'https://doi.org/10.1093/jnci/dju124',
  },
  {
    text: 'NLR in prostate cancer — systematic review, Eur Urol 2015',
    url: 'https://doi.org/10.1016/j.eururo.2015.01.003',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { anc, alc } = vals;
  if (anc <= 0 || alc <= 0) throw new Error('Both ANC and ALC must be positive');
  const nlr = anc / alc;

  let interpretation, risk;
  if (nlr < 3.0) {
    interpretation = 'Normal NLR — low systemic inflammatory state. No adverse prognostic implication.';
    risk = 'low';
  } else if (nlr <= 5.0) {
    interpretation = 'Moderate inflammation — intermediate prognosis. Monitor and correlate with clinical status.';
    risk = 'moderate';
  } else {
    interpretation = 'Elevated NLR — significant systemic inflammation associated with worse cancer outcomes.';
    risk = 'high';
  }

  return { value: nlr, unit: '', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">Neutrophil-to-Lymphocyte Ratio</div>
    <div class="result-value">${result.value.toFixed(2)}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
