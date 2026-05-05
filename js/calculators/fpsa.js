/**
 * % Free PSA (%fPSA)
 * ==================
 *
 * CLINICAL USE:
 *   %fPSA = (free PSA / total PSA) × 100
 *   Used to decide whether to biopsy men with total PSA in the "grey zone"
 *   (4–10 ng/mL) and a negative digital rectal exam (DRE).
 *
 *   Lower %fPSA = higher probability of prostate cancer.
 *   Higher %fPSA = more likely BPH.
 *
 * CLINICAL THRESHOLDS (DxI assay, Beckman Coulter):
 *   %fPSA < 10%  → 56% probability of PCa — biopsy recommended
 *   %fPSA 10–25%  → intermediate — biopsy recommended if other risk factors
 *   %fPSA > 25%  → 8–10% probability of PCa — may avoid biopsy
 *
 * NOTE:
 *   Thresholds are assay-specific. Always use manufacturer thresholds.
 *   Never use %fPSA in men with PSA <4 ng/mL or >10 ng/mL.
 *   Do not use during 5-alpha-reductase inhibitor therapy (falsely lowers fPSA).
 *
 * REFERENCE:
 *   Catalona WJ, et al. "Use of the Percentage of Free Prostate-Specific
 *   Antigen to Enhance Differentiation of Prostate Cancer from Benign
 *   Prostatic Diseases." JAMA 1998; 279(19):1542-1547.
 *   https://doi.org/10.1001/jama.279.19.1542
 */

const id       = 'fpsa';
const name     = '% Free PSA';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'free PSA', 'diagnosis', 'biopsy', 'grey zone', 'BPH'];
const description =
  'Calculates the percentage of free (unbound) PSA. Lower %fPSA indicates ' +
  'higher probability of prostate cancer in the 4–10 ng/mL PSA range.';

const inputs = [
  {
    id: 'total_psa',
    label: 'Total PSA (ng/mL)',
    placeholder: 'e.g. 6.5',
    type: 'number',
  },
  {
    id: 'free_psa',
    label: 'Free PSA (ng/mL)',
    placeholder: 'e.g. 0.85',
    type: 'number',
  },
];

const formula = `Formula:

  %fPSA = (Free PSA / Total PSA) × 100

Diagnostic thresholds (PSA 4–10 ng/mL range, DRE negative):
  %fPSA < 10%  → High PCa risk (56%) — biopsy recommended
  %fPSA 10–25% → Intermediate — biopsy if other risk factors present
  %fPSA > 25%  → Low PCa risk (8–10%) — biopsy may be avoided

⚠️ Only use when PSA is between 4–10 ng/mL and DRE is negative.
⚠️ Do NOT use during 5-alpha-reductase inhibitor therapy.`;

const howToUse =
  'Enter total PSA and free PSA from the same blood sample. ' +
  'Both values must be from the same lab run — do not mix measurements from different days. ' +
  '%fPSA is only validated for the 4–10 ng/mL range. Outside this range, ' +
  'its predictive value is significantly reduced. ' +
  'Always correlate with DRE, family history, and patient age.';

const refs = [
  {
    text: 'Catalona WJ, et al. JAMA 1998;279(19):1542-1547',
    url: 'https://doi.org/10.1001/jama.279.19.1542',
  },
  {
    text: 'Loeb S, et al. Eur Urol 2009 — %fPSA review and meta-analysis',
    url: 'https://doi.org/10.1016/j.eururo.2009.02.019',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer Diagnosis',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { total_psa, free_psa } = vals;
  if (total_psa <= 0 || free_psa <= 0) throw new Error('PSA values must be positive');
  if (free_psa >= total_psa) throw new Error('Free PSA cannot exceed total PSA');

  const pf = (free_psa / total_psa) * 100;

  let interpretation, risk;
  if (pf < 10) {
    interpretation = 'High probability of prostate cancer — biopsy recommended.';
    risk = 'high';
  } else if (pf <= 25) {
    interpretation = 'Intermediate probability — consider biopsy based on DRE, family history, and patient preference.';
    risk = 'moderate';
  } else {
    interpretation = 'Low probability of cancer — BPH more likely. Biopsy may be avoided. Continue monitoring.';
    risk = 'low';
  }

  return { value: pf, unit: '%', interpretation, risk };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">% Free PSA</div>
    <div class="result-value">${result.value.toFixed(1)}%</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
