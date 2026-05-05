/**
 * Neutrophil-to-Lymphocyte Ratio (NLR)
 * EAU 2026: Sect. 6.6+ — inflammatory prognostic marker
 * Formula: NLR = ANC (×10⁹/L) / ALC (×10⁹/L)
 * DIY: YES — CBC with differential required
 *
 * Thresholds (literature):
 *   NLR < 3   → Low/normal
 *   NLR 3-5   → Elevated — monitor
 *   NLR > 5   → High — worse prognosis in nmCRPC/mHSPC (EAU 2026)
 */

export const meta = {
  id: 'nlr',
  name: 'Neutrophil-to-Lymphocyte Ratio',
  shortName: 'NLR',
  category: 'blood-count',
  inputs: [
    { id: 'anc', label: 'Absolute Neutrophil Count (×10⁹/L)', min: 0, step: 0.1, required: true },
    { id: 'alc', label: 'Absolute Lymphocyte Count (×10⁹/L)', min: 0, step: 0.1, required: true }
  ],
  outputs: [
    { id: 'result', label: 'NLR' },
    { id: 'interpretation', label: 'Interpretation' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Sect. 6.6+',
    'Lorente D et al. Eur Urol 2015 — NLR prognostic in mCRPC'
  ]
};

export function calculate({ anc, alc }) {
  if (anc < 0 || alc <= 0) return { error: 'Invalid values' };
  return { result: parseFloat((anc / alc).toFixed(2)) };
}

export function interpret(result) {
  if (result == null) return null;
  if (result < 3)  return `Normal (${result}) — Lower inflammatory burden`;
  if (result < 5)  return `Elevated (${result}) — Moderate inflammatory response; monitor`;
  return `High (${result}) — High inflammatory burden; associated with worse OS/PFS (EAU 2026)`;
}