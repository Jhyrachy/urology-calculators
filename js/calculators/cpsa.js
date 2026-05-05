/**
 * cPSA (Complexed PSA)
 * ====================
 *
 * CLINICAL USE:
 *   cPSA is the portion of PSA bound to protease inhibitors (primarily ACT,
 *   antichymotrypsin) in the blood. Unlike free PSA, cPSA is not cleaved
 *   and remains bound.
 *
 *   cPSA has been proposed as an alternative to total and free PSA because:
 *   1. It is more stable in blood (free PSA degrades faster)
 *   2. It has better specificity for PCa detection in the 4–10 ng/mL range
 *   3. Only one measurement needed (vs %fPSA which requires two)
 *
 *   Many studies show cPSA performs similarly to %fPSA for PCa detection.
 *   Commercial assays: Bayer ACS:cPSA, Beckman Coulter.
 *
 * THRESHOLDS (approximate — assay-dependent):
 *   For 90% sensitivity (detecting any PCa):
 *     cPSA ≥ ~3.7 ng/mL
 *   For 90% specificity (excluding high-grade PCa):
 *     cPSA < ~4.3 ng/mL has poor specificity
 *
 * REFERENCE:
 *   Brawer MK, et al. "Complexed Prostate Specific Antigen Reduces
 *   Unnecessary Biopsies." J Urol 2002; 167(6):2441-2447.
 *   https://doi.org/10.1016/S0022-5347(05)65078-5
 */

const id       = 'cpsa';
const name     = 'Complexed PSA (cPSA)';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'biomarker', 'diagnosis', 'cPSA', 'prostate cancer detection'];
const description =
  'Complexed PSA (cPSA) — the protein-bound fraction of PSA. More stable than ' +
  'free PSA and can be used alone or with %cPSA for cancer detection.';

const inputs = [
  {
    id: 'cpsa',
    label: 'cPSA value (ng/mL)',
    placeholder: 'e.g. 4.2',
    type: 'number',
  },
  {
    id: 'total_psa',
    label: 'Total PSA (ng/mL) — if available',
    placeholder: 'e.g. 6.5  (leave blank if not measured)',
    type: 'number',
  },
];

const formula = `Complexed PSA = cPSA (ng/mL)

Often expressed as:
  %cPSA = (cPSA / total PSA) × 100

Thresholds (assay-dependent, Bayer ACS:cPSA):
  %cPSA < 20%  → higher probability of PCa
  %cPSA 20–30% → intermediate
  %cPSA > 30%  → lower probability of PCa (BPH more likely)

Note: Only use ONE of cPSA or %cPSA depending on what your lab reports.`;

const howToUse =
  'Enter the cPSA value from your lab report. If total PSA is also available, ' +
  'the calculator shows %cPSA as well. ' +
  'cPSA is particularly useful when free PSA degradation in the sample tube ' +
  'may have invalidated a free PSA result. ' +
  'Always check which assay your laboratory uses — thresholds vary between platforms.';

const refs = [
  {
    text: 'Brawer MK, et al. J Urol 2002;167(6):2441-2447',
    url: 'https://doi.org/10.1016/S0022-5347(05)65078-5',
  },
  {
    text: 'Miller JI, et al. Urology 2003 — cPSA vs %fPSA comparison',
    url: 'https://pubmed.ncbi.nlm.nih.gov/14698725/',
  },
  {
    text: 'EAU Guidelines — Prostate Cancer Diagnosis',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

function calculate(vals) {
  const { cpsa, total_psa } = vals;
  if (cpsa <= 0) throw new Error('cPSA must be positive');

  let pcpsa = null, interp = '', risk = 'low';

  if (total_psa && total_psa > 0) {
    pcpsa = (cpsa / total_psa) * 100;

    if (pcpsa < 20) {
      interp = 'Low %cPSA — higher probability of prostate cancer. Biopsy should be considered.';
      risk = 'high';
    } else if (pcpsa <= 30) {
      interp = 'Intermediate %cPSA — correlate with DRE, family history, and patient preference.';
      risk = 'moderate';
    } else {
      interp = 'High %cPSA — lower probability of cancer, BPH more likely. Continue routine monitoring.';
      risk = 'low';
    }
  } else {
    if (cpsa < 3.7) {
      interp = 'cPSA below typical diagnostic threshold. Low probability of cancer.';
      risk = 'low';
    } else if (cpsa < 7.0) {
      interp = 'cPSA in indeterminate range — correlate with DRE and clinical context.';
      risk = 'moderate';
    } else {
      interp = 'Elevated cPSA — higher probability of prostate cancer. Biopsy recommended.';
      risk = 'high';
    }
  }

  return {
    value: cpsa,
    unit: 'ng/mL',
    pcpsa: pcpsa ? pcpsa.toFixed(1) + '%' : null,
    interpretation: interp,
    risk,
  };
}

function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  const extra = result.pcpsa
    ? `<div style="font-size:0.85rem;margin-top:0.4rem;">%cPSA: <strong>${result.pcpsa}</strong></div>`
    : '';
  return `<div class="result-box ${colorMap[result.risk]}">
    <div class="result-label">cPSA Result</div>
    <div class="result-value">${result.value.toFixed(2)} ng/mL</div>
    ${extra}
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
