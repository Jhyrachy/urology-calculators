/**
 * PSA Doubling Time Calculator
 * EAU 2026: Sect. 6.4.3 — Biochemical Recurrence [994]
 *
 * Formula: DT = (0.693 × Δt_years) / log₂(PSA₂/PSA₁)
 *   Alternatively: DT = (0.693 × 365.25 × Δt_days) / (ln(PSA₂) − ln(PSA₁))  → result in days
 *   Common output: months = days / 30.4375
 *
 * EAU 2026 thresholds:
 *   PSA-DT < 10 months   → nmCRPC high-risk: intensified therapy (ADT + 2nd agent) [1014]
 *   PSA-DT ≤ 9 months   → EMBARK trial threshold for high-risk BCR (MFS benefit from combination therapy) [1145]
 *   PSA-DT < 12 months  → early ADT benefit in locally advanced/watchful waiting [604,895]
 *   PSA-DT < 6 months   → very short DT; high systemic progression risk [1144]
 *   PSA-DT 3–12 months → during AS: triggers further investigation (Movember consensus) [644,645]
 *   PSA-DT > 18 months  → EAU BCR Low-Risk group (favourable prognosis) [Table 6.4.1]
 *
 * DIY: YES — requires ≥2 PSA measurements with time interval
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
    if (result < 0)    return 'Cannot calculate (PSA not rising)';
    if (result < 6)    return `${result} mo — Very short DT (<6 mo) — High systemic progression; early ADT considered (EAU 2026)`;
    if (result <= 9)  return `${result} mo — Short DT (6–9 mo) — nmCRPC high-risk + EMBARK threshold: intensified therapy (ADT + 2nd agent)`;
    if (result < 12)  return `${result} mo — Short DT (10–12 mo) — Early ADT benefit in locally advanced/WW (EAU 2026)`;
    if (result <= 18) return `${result} mo — Moderate DT (12–18 mo) — Intermediate risk; monitor closely`;
    return `${result} mo — Slow DT (>18 mo) — EAU Low-Risk BCR; favourable prognosis (EAU 2026 Table 6.4.1)`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
