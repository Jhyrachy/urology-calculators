/**
 * Platelet-to-Lymphocyte Ratio (PLR)
 * EAU 2026: Sect. 6.6+ — inflammatory prognostic marker
 * Formula: PLR = Platelet Count (×10⁹/L) / ALC (×10⁹/L)
 * DIY: YES — CBC required
 */

export const meta = {
  id: 'plr',
  name: 'Platelet-to-Lymphocyte Ratio',
  shortName: 'PLR',
  category: 'blood-count',
  inputs: [
    { id: 'platelets', label: 'Platelet Count (×10⁹/L)',  min: 0, step: 1, required: true },
    { id: 'alc',       label: 'Lymphocyte Count (×10⁹/L)', min: 0, step: 0.1, required: true }
  ],
  outputs: [
    { id: 'result', label: 'PLR' },
    { id: 'interpretation', label: 'Interpretation' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Sect. 6.6+',
    'Wang J et al. Prostate 2020 — PLR and PCa prognosis'
  ]
};

export function calculate({ platelets, alc }) {
  if (platelets <= 0 || alc <= 0) return { error: 'Invalid values' };
  return { result: parseFloat((platelets / alc).toFixed(1)) };
}

export function interpret(result) {
  if (result == null) return null;
  if (result < 150) return `Normal (${result}) — Lower inflammatory burden`;
  if (result < 250) return `Moderate (${result}) — Elevated; monitor`;
  return `High (${result}) — High inflammatory burden; worse prognosis associated`;
}