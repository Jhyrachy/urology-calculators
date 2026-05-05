/**
 * Prognostic Nutritional Index (PNI)
 * EAU 2026: Table 6.1.1 [592] + Sect. 6.6+
 * Formula: PNI = 10 × Albumin (g/dL) + 0.005 × Lymphocyte count (/mm³)
 * DIY: YES — serum albumin + CBC required
 *
 * Thresholds:
 *   PNI ≥ 40  → Normal
 *   PNI 35-39 → Mild risk
 *   PNI 30-34 → Moderate risk
 *   PNI < 30  → High risk — consider CGA (Table 6.1.1 EAU)
 */
(function() {
  'use strict';
  const meta = {
    id: 'pni',
    name: 'Prognostic Nutritional Index',
    shortName: 'PNI',
    category: 'nutrition-inflammatory',
    inputs: [
      { id: 'albumin',    label: 'Serum Albumin (g/dL)',     min: 0, step: 0.1, required: true },
      { id: 'lymphocytes', label: 'Lymphocyte Count (/mm³)', min: 0, step: 10, required: true }
    ],
    outputs: [
      { id: 'result', label: 'PNI' },
      { id: 'interpretation', label: 'Interpretation' }
    ],
    references: [
      'EAU 2026 Prostate Cancer Guidelines — Table 6.1.1 [592], Sect. 6.6+',
      'Onodera T et al. Nippon Geka Gakkai Zasshi 1984 — PNI original'
    ]
  };
  function calculate({ albumin, lymphocytes }) {
    if (albumin < 0 || lymphocytes <= 0) return { error: 'Invalid values' };
    const pni = (10 * albumin) + (0.005 * lymphocytes);
    return { result: parseFloat(pni.toFixed(1)) };
  }
  function interpret(result) {
    if (result == null) return null;
    if (result >= 40) return `Normal (${result}) — Adequate nutritional status`;
    if (result >= 35) return `Mild risk (${result}) — Monitor nutritional status`;
    if (result >= 30) return `Moderate risk (${result}) — Nutritional intervention indicated`;
    return `High risk (${result}) — Severe malnutrition; perform CGA (Table 6.1.1 EAU)`;
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate, interpret);
  if (typeof module !== 'undefined') module.exports = { meta, calculate, interpret };
})();
