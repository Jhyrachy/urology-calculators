/**
 * PLR (Platelet-to-Lymphocyte Ratio)
 * ==================================
 *
 * CLINICAL USE:
 *   PLR is another systemic inflammatory marker, complementary to NLR.
 *   Elevated PLR is associated with worse prognosis in several urological
 *   malignancies including clear cell renal cell carcinoma (ccRCC),
 *   urothelial carcinoma, and prostate cancer.
 *
 *   PLR and NLR together provide more robust prognostic information than
 *   either alone.
 *
 * FORMULA:
 *   PLR = Platelet Count (cells/µL) / Absolute Lymphocyte Count (cells/µL)
 *
 * THRESHOLDS:
 *   < 150   → normal / low
 *   150–300 → moderate inflammation
 *   > 300   → significant inflammation / poor prognosis
 *
 * NOTE:
 *   If platelet count is in 10⁹/L, multiply by 1000 to convert to cells/µL.
 *
 * REFERENCE:
 *   Templeton AJ, et al. "Prognostic Role of Platelet-to-Lymphocyte Ratio
 *   in Solid Tumors: A Systematic Review and Meta-Analysis."
 *   J Natl Cancer Inst 2014; 106(12):dju291.
 *   https://doi.org/10.1093/jnci/dju291
 */

const id       = 'plr';
const name     = 'PLR (Platelet-Lymphocyte Ratio)';
const category = 'General Oncology';
const tags     = ['inflammation', 'prognosis', 'biomarker', 'CBC', 'RCC', 'bladder cancer'];
const description =
  'Calculates PLR from CBC. Like NLR, elevated PLR indicates systemic ' +
  'inflammation and is linked to worse cancer prognosis.';

const inputs = [
  {
    id: 'platelets',
    label: 'Platelet count (cells/µL)',
    placeholder: 'e.g. 280000',
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

  PLR = Platelet Count (cells/µL) / ALC (cells/µL)

If lab reports platelets in 10⁹/L:
  Platelets (10⁹/L) × 1000 = Platelets (cells/µL)

Thresholds (solid tumor literature):
  < 150   → Normal
  150–300 → Moderate inflammation
  > 300   → Significant inflammation — poor prognosis`;

const howToUse =
  'Enter platelet count and ALC from a CBC. ' +
  'If platelets are in 10⁹/L, multiply by 1000 to get cells/µL. ' +
  'PLR >300 is associated with worse survival in RCC, bladder cancer, and PCa. ' +
  'Use alongside NLR for a more complete picture of systemic inflammation.';

const refs = [
  {
    text: 'Templeton AJ, et al. J Natl Cancer Inst 2014;106(12):dju291',
    url: 'https://doi.org/10.1093/jnci/dju291',
  },
  {
    text: 'PLR in RCC — Bagheri et al. Int J Urol 2020',
    url: 'https://doi.org/10.1111/iju.14333',
  },
];

function calculate(vals) {
  const { platelets, alc } = vals;
  if (platelets <= 0 || alc <= 0) throw new Error('Platelets and ALC must be positive');
  const plr = platelets / alc;

  let interpretation, risk;
  if (plr < 150) {
    interpretation = 'Normal PLR — no significant inflammatory signal.';
    risk = 'low';
  } else if (plr <= 300) {
    interpretation = 'Moderate PLR — intermediate prognosis. Correlate with clinical findings.';
    risk = 'moderate';
  } else {
    interpretation = 'Elevated PLR — significant systemic inflammation. Associated with worse oncological outcomes.';
    risk = 'high';
  }

  return { value: plr, unit: '', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">Platelet-to-Lymphocyte Ratio</div>
    <div class="result-value">${result.value.toFixed(1)}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
