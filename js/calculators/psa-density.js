/**
 * PSI (Prostate Specific Antigen) Density
 * ========================================
 *
 * CLINICAL USE:
 *   PSA density = PSA (ng/mL) / prostate volume (cc or mL)
 *   Used to distinguish benign prostatic hyperplasia (BPH) from prostate cancer.
 *   A higher PSA density suggests greater likelihood of cancer, especially
 *   when PSA is in the "grey zone" (4–10 ng/mL).
 *
 * THRESHOLDS:
 *   < 0.15  → likely benign (BPH)
 *   ≥ 0.15  → warrants further investigation / biopsy consideration
 *   ≥ 0.20  → higher cancer risk
 *
 * NOTE ON PROSTATE VOLUME:
 *   Usually measured by transrectal ultrasound (TRUS) or MRI.
 *   Volume (cc) ≈ 0.52 × (transverse × anteroposterior × longitudinal) cm
 *
 * REFERENCE:
 *   Benson MC, et al. "The use of prostate specific antigen density to
 *   improve the sensitivity of PSA in the detection of prostate cancer."
 *   J Urol 1992; 147(3 Pt 2):817-821.
 *
 *   EAU Guideline: Prostate Cancer — diagnosis
 */

const id       = 'psa-density';
const name     = 'PSA Density';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'prostate volume', 'diagnosis', 'grey zone', 'TRUS'];
const description =
  'PSA divided by prostate volume. Helps differentiate BPH from prostate cancer ' +
  'when PSA is in the indeterminate range (4–10 ng/mL).';

const inputs = [
  {
    id: 'psa',
    label: 'Serum PSA (ng/mL)',
    placeholder: 'e.g. 6.5',
    type: 'number',
  },
  {
    id: 'volume',
    label: 'Prostate volume (cc or mL)',
    placeholder: 'e.g. 45',
    type: 'number',
  },
];

const formula = `Formula:

  PSAD = PSA (ng/mL) / Prostate Volume (cc or mL)

Interpretation thresholds:
  PSAD < 0.15  → Benign prostatic hyperplasia likely
  PSAD 0.15–0.20 → Grey zone — correlate with clinical findings
  PSAD ≥ 0.20  → Higher cancer risk — biopsy recommended`;

const howToUse =
  'Enter the serum PSA value and the prostate volume measured by TRUS or MRI. ' +
  'Volume should be in cubic centimeters (cc) or milliliters (mL) — they are equivalent. ' +
  'PSAD is most useful when PSA is between 4–10 ng/mL (grey zone) where ' +
  'PSA alone has poor specificity.';

const refs = [
  {
    text: 'Benson MC, et al. J Urol 1992;147(3 Pt 2):817-821',
    url: 'https://pubmed.ncbi.nlm.nih.gov/1371552/',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer Diagnosis',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { psa, volume } = vals;
  if (volume <= 0) throw new Error('Prostate volume must be greater than 0');
  const psad = psa / volume;

  let interpretation, risk;
  if (psad < 0.15) {
    interpretation = 'Likely benign prostatic hyperplasia. No immediate biopsy needed.';
    risk = 'low';
  } else if (psad < 0.20) {
    interpretation = 'Indeterminate. Correlate with digital rectal exam, family history, and risk factors.';
    risk = 'moderate';
  } else {
    interpretation = 'Elevated density — higher cancer risk. Biopsy should be considered.';
    risk = 'high';
  }

  return { value: psad, unit: 'ng/mL/cc', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">PSA Density</div>
    <div class="result-value">${result.value.toFixed(3)} ${result.unit}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
