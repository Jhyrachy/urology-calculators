/**
 * PSA Density (PSAD) + PI-RADS Risk-Adapted Biopsy Decision
 * EAU 2026: Table 5.5 [230] + Sect. 5.2.2 [212-216]
 *
 * Formula: PSAD = tPSA (ng/mL) / Prostate Volume (mL = cc)
 *
 * Table 5.5 — PI-RADS stratified biopsy decision (biopsy-naïve):
 *   PI-RADS 1-2  + PSAD < 0.15  → omit biopsy
 *   PI-RADS 3    + PSAD < 0.10  → may omit biopsy
 *   PI-RADS 3    + PSAD ≥ 0.10  → biopsy recommended
 *   PI-RADS 4-5  (any PSAD)     → proceed to biopsy
 *
 * Reference: Schooths IG & Padhani AR. BJU Int 2021;127(2):175 [230]
 * Validation cohort: 2,055 biopsy-naïve men [384]
 *   PI-RADS 3 + PSAD 0.15 → 58.4% biopsies avoided, 6.5% ISUP GG ≥2 missed [385]
 *
 * DIY: YES
 */

export const meta = {
  id: 'psa-density',
  name: 'PSA Density + PI-RADS',
  shortName: 'PSAD',
  category: 'imaging-biopsy',
  inputs: [
    { id: 'tpsa',   label: 'Total PSA (ng/mL)',      min: 0.001, step: 0.01, required: true },
    { id: 'volume', label: 'Prostate Volume (mL = cc)', min: 1,   step: 1,   required: true },
    { id: 'pirads', label: 'PI-RADS score',           type: 'select',
      options: ['1', '2', '3', '4', '5'],                                    required: true }
  ],
  outputs: [
    { id: 'psad',         label: 'PSAD (ng/mL/cc)' },
    { id: 'decision',     label: 'Biopsy decision (EAU 2026 Table 5.5)' },
    { id: 'rationale',    label: 'Rationale' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Table 5.5 [230]',
    'Schooths IG & Padhani AR. BJU Int 2021;127(2):175 [230]',
    'Validation cohort: 2,055 biopsy-naïve men [384,385]'
  ]
};

export function calculate({ tpsa, volume, pirads }) {
  if (tpsa <= 0 || volume <= 0) return { error: 'PSA and volume must be > 0' };
  const psad = parseFloat((tpsa / volume).toFixed(3));
  const p = parseInt(pirads, 10);
  let decision, rationale;

  if (p <= 2) {
    if (psad < 0.15) {
      decision = 'Omit biopsy';
      rationale = `PI-RADS ${p} + PSAD ${psad} < 0.15 → csPCa risk low; biopsy can be omitted (EAU 2026 Table 5.5). 2,055-patient validation: safe approach [384].`;
    } else {
      decision = 'Biopsy recommended';
      rationale = `PI-RADS ${p} but PSAD ${psad} ≥ 0.15 → elevated csPCa risk despite low PI-RADS. Consider biopsy.`;
    }
  } else if (p === 3) {
    if (psad < 0.10) {
      decision = 'Biopsy may be omitted';
      rationale = `PI-RADS 3 + PSAD ${psad} < 0.10 → 58.4% biopsies could be avoided, 6.5% ISUP GG ≥2 missed [385]. Shared decision-making appropriate.`;
    } else {
      decision = 'Biopsy recommended';
      rationale = `PI-RADS 3 + PSAD ${psad} ≥ 0.10 → biopsy recommended per EAU 2026 Table 5.5. Elevated csPCa risk.`;
    }
  } else {
    decision = 'Proceed to biopsy';
    rationale = `PI-RADS ${p} → clinically significant PCa likely regardless of PSAD. Proceed to systematic + targeted biopsy.`;
  }
  return { psad, decision, rationale };
}