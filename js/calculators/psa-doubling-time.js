/**
 * PSA Doubling Time (PSADT)
 * ==========================
 *
 * CLINICAL USE:
 *   Determines how quickly PSA levels are rising over time.
 *   Critical for distinguishing aggressive from indolent prostate cancer,
 *   and for monitoring biochemical recurrence after treatment.
 *
 * FORMULA:
 *   PSADT (months) = (t × log(2)) / log(PSA2 / PSA1)
 *   where:
 *     PSA1  = first PSA value (ng/mL)
 *     PSA2  = second PSA value (ng/mL)  [must be > PSA1]
 *     t     = time between measurements (months)
 *
 * INTERPRETATION:
 *   < 3 months   → very high risk of rapid progression
 *   3–12 months  → moderate risk, warrants further investigation
 *   > 12 months  → slow-growing, lower risk
 *   Note: PSADT is only meaningful when PSA2 > PSA1 (rising PSA)
 *
 * REFERENCE:
 *   Pound CR, et al. "Natural history of progression after PSA elevation
 *   following radical prostatectomy." JAMA 1999; 281(17):1591-1597.
 *   https://doi.org/10.1001/jama.281.17.1591
 *
 * EAU Guideline:see Prostate Cancer — Biochemical recurrence section
 */

const id       = 'psa-doubling-time';
const name     = 'PSA Doubling Time';
const category = 'Prostate Cancer';
const tags     = ['PSA', 'biochemical recurrence', 'prognosis', ' kinetics'];
const description =
  'Calculates the rate of PSA rise after radical prostatectomy or during AS, ' +
  'a key predictor of aggressive disease.';

const inputs = [
  {
    id: 'psa1',
    label: 'First PSA (ng/mL)',
    placeholder: 'e.g. 0.15',
    type: 'number',
    validate: v => v > 0 || 'PSA1 must be positive',
  },
  {
    id: 'psa2',
    label: 'Second PSA (ng/mL)',
    placeholder: 'e.g. 0.32',
    type: 'number',
    validate: v => v > 0 || 'PSA2 must be positive',
  },
  {
    id: 't',
    label: 'Time between measurements (months)',
    placeholder: 'e.g. 12',
    type: 'number',
    validate: v => v > 0 || 'Time must be positive',
  },
];

const formula = `PSADT (months) = (t × log(2)) / log(PSA2 / PSA1)

Example:
  PSA1 = 0.15 ng/mL
  PSA2 = 0.32 ng/mL
  t    = 12 months

  PSADT = (12 × 0.693) / log(0.32 / 0.15)
        = 8.316 / log(2.133)
        = 8.316 / 0.329
        = 25.3 months`;

const howToUse =
  'Enter two consecutive PSA values taken at least 3 months apart (or use any ' +
  'interval in months). The second PSA must be higher than the first. ' +
  'A shorter doubling time indicates higher risk of metastatic disease. ' +
  'For post-prostatectomy patients, values >0.2 ng/mL are considered ' +
  'biochemical recurrence by most guidelines.';

const refs = [
  {
    text: 'Pound CR, et al. JAMA 1999 — Natural history of PSA progression after RP',
    url: 'https://doi.org/10.1001/jama.281.17.1591',
  },
  {
    text: 'EAU Guidelines on Prostate Cancer — Biochemical recurrence',
    url: 'https://uroweb.org/guidelines/prostate-cancer',
  },
];

/**
 * Calculate PSA Doubling Time
 * @param {{ psa1: number, psa2: number, t: number }} vals
 * @returns {{ value: number, unit: string, interpretation: string, risk: 'low'|'moderate'|'high' }}
 */
function calculate(vals) {
  const { psa1, psa2, t } = vals;

  if (psa2 <= psa1) {
    throw new Error('PSA2 must be greater than PSA1 (PSA must be rising)');
  }
  if (psa1 <= 0 || psa2 <= 0) {
    throw new Error('PSA values must be positive numbers');
  }

  const psadt = (t * Math.log(2)) / Math.log(psa2 / psa1);

  let interpretation, risk;
  if (psadt < 3) {
    interpretation = 'Very high risk — rapid progression. Immediate work-up for metastatic disease recommended.';
    risk = 'high';
  } else if (psadt <= 12) {
    interpretation = 'Moderate risk — consider imaging and further evaluation.';
    risk = 'moderate';
  } else {
    interpretation = 'Lower risk — slow-growing disease. Continue active surveillance.';
    risk = 'low';
  }

  return {
    value: psadt,
    unit: 'months',
    interpretation,
    risk,
  };
}

/**
 * Render the result as an HTML fragment.
 * @param {{ value: number, unit: string, interpretation: string, risk: string }} result
 * @returns {string} HTML
 */
function renderResult(result) {
  const colorMap = { high: 'danger', moderate: 'warning', low: 'success' };
  const cls = colorMap[result.risk] || '';
  const riskLabel = result.risk.toUpperCase();

  return `<div class="result-box ${cls}">
    <div class="result-label">PSA Doubling Time</div>
    <div class="result-value">${result.value.toFixed(1)} ${result.unit}</div>
    <p style="margin-top:0.5rem;font-size:0.875rem;">${result.interpretation}</p>
    <p style="margin-top:0.5rem;font-size:0.75rem;color:var(--accent-light);">Risk: ${riskLabel}</p>
  </div>`;
}

export { id, name, category, tags, description, inputs, formula, howToUse, refs, calculate, renderResult };
