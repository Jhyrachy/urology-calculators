/**
 * PSA Doubling Time Calculator
 * EAU 2026: Sect. 6.4.3 — Biochemical Recurrence
 * Formula: DT = (0.693 × Δt_years) / log₂(PSA₂/PSA₁)
 */
(function() {
  'use strict';
  const meta = {
    id: 'psa-doubling-time',
    name: 'PSA Doubling Time',
    shortName: 'PSADT',
    category: 'kinetics',
    inputs: [
      { id: 'psa1',  label: 'Initial PSA (ng/mL)',     min: 0.001, step: 0.01, required: true },
      { id: 'psa2',  label: 'Follow-up PSA (ng/mL)',    min: 0.001, step: 0.01, required: true },
      { id: 'delta_t', label: 'Time interval (days)',   min: 1,     step: 1,   required: true }
    ],
    outputs: [{ id: 'result', label: 'Doubling Time (months)' }],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Sect. 6.4.3 [994]',
      'Soto K et al. Eur Urol 2023 — PSA kinetics meta-analysis'
    ]
  };
  function calculate({ psa1, psa2, delta_t }) {
    if (psa1 <= 0 || psa2 <= psa1 || delta_t <= 0)
      return { result: null, error: 'PSA2 must be > PSA1, Δt > 0' };
    const years = delta_t / 365.25;
    const dt = (0.693 * years) / (Math.log(psa2) - Math.log(psa1)) * 12;
    return { result: isFinite(dt) && dt > 0 ? parseFloat(dt.toFixed(1)) : null };
  }
  function interpret(result) {
    if (result == null) return null;
    if (result < 0)     return 'Cannot calculate (PSA not rising)';
    if (result < 9)    return `Very short (${result} mo) — High risk rapid progression`;
    if (result < 12)   return `Short (${result} mo) — High risk; early HT considered (EAU 2026)`;
    if (result < 18)   return `Moderate (${result} mo) — Intermediate risk`;
    return `Slow (${result} mo) — Low risk (EAU BCR Low-Risk: >18 mo)`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
