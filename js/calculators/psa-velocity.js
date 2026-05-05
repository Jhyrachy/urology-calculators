/**
 * PSA Velocity (PSAV)
 * EAU 2026: Sect. 6.4.3 — PSA kinetics
 *
 * Formula (simplified, 2 measurements):
 *   PSAV = (PSA₂ − PSA₁) / Δt_years
 *
 * For ≥3 measurements: use least-squares regression slope.
 *
 * Thresholds (EAU 2026):
 *   PSAV > 2.0 ng/mL/yr before RP → associated with worse outcomes [994]
 *   PSAV > 0.75 ng/mL/yr during AS → trigger re-biopsy/investigation
 *     (EAU Movember consensus: PSAV alone should NOT change management)
 *   PSAV < 0.75 ng/mL/yr → low/acceptable velocity
 *
 * DIY: YES — requires ≥2 PSA measurements with dates
 */
(function() {
  'use strict';
  const meta = {
    id: 'psa-velocity',
    name: 'PSA Velocity',
    shortName: 'PSAV',
    category: 'kinetics',
    inputs: [
      { id: 'psa1',  label: 'Initial PSA (ng/mL)',        min: 0, step: 0.01, required: true },
      { id: 'date1', label: 'Date 1 (YYYY-MM-DD)',        type: 'text',        required: true },
      { id: 'psa2',  label: 'Follow-up PSA (ng/mL)',      min: 0, step: 0.01, required: true },
      { id: 'date2', label: 'Date 2 (YYYY-MM-DD)',        type: 'text',        required: true }
    ],
    outputs: [
      { id: 'result', label: 'PSAV (ng/mL/year)' },
      { id: 'interpretation', label: 'Interpretation' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 6.4.3',
      'D\'Amico AV et al. JAMA 2004 — PSAV before RP',
      'Movember Consensus: PSAV alone should trigger investigation, not treatment'
    ]
  };
  function calculate({ psa1, psa2, date1, date2 }) {
    if (psa1 < 0 || psa2 < 0) return { error: 'Invalid PSA values' };
    const d1 = new Date(date1), d2 = new Date(date2);
    if (isNaN(d1) || isNaN(d2) || d2 <= d1) return { error: 'Invalid dates' };
    const days = (d2 - d1) / (1000 * 60 * 60 * 24);
    if (days <= 0) return { error: 'Date 2 must be after Date 1' };
    const years = days / 365.25;
    return { result: parseFloat(((psa2 - psa1) / years).toFixed(3)) };
  }
  function interpret(result) {
    if (result == null) return null;
    if (result <= 0)    return `${result} ng/mL/yr — No rise (PSA stable/declining)`;
    if (result < 0.75)  return `${result} ng/mL/yr — Low velocity; AS continuation`; // Movember: PSAV alone should NOT change management
    if (result < 2.0)  return `${result} ng/mL/yr — Moderate (0.75–2.0); investigate — consider re-biopsy if on AS`;
    return `${result} ng/mL/yr — High (>2.0); rapid progression — aggressive disease suspected (EAU 2026)`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
