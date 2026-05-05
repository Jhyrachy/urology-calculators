/**
 * PHI — Prostate Health Index
 * EAU 2026: Sect. 5.2.5 [280,281]
 *
 * Commercial serum biomarker (Beckman Coulter FDA-approved assay).
 * NOT DIY — formula closed, requires proprietary p2PSA measurement.
 *
 * Clinical use: Reduces unnecessary biopsies in men with PSA 4-10 ng/mL.
 * EAU 2026: "Outperforms f/t PSA for csPCa detection"
 * Threshold: PHI >25-30 associated with higher csPCa risk
 *
 * NOT DIY: p2PSA requires Beckman Coulter Access immunoassay
 */

export const meta = {
  id: 'phi',
  name: 'Prostate Health Index (PHI)',
  shortName: 'PHI',
  category: 'serum-biomarker-commercial',
  inputs: [
    { id: 'lab_note', label: 'Note', type: 'info',
      value: 'Commercial lab test — enter your PHI value from the lab report. DIY formula not reproducible.' },
    { id: 'phi_value', label: 'PHI value (from lab report)', min: 0, step: 0.1, required: false }
  ],
  outputs: [
    { id: 'interpretation', label: 'Interpretation (EAU 2026)' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Sect. 5.2.5 [280,281]',
    'Loeb S et al. Eur Urol 2015;68:464-471 — PHI meta-analysis',
    'Catalona WJ et al. J Urol 2011;185:1650-1655 — PHI development'
  ],
  isCommercial: true,
  disclaimer: 'PHI is a commercial laboratory test. The p2PSA isoform measurement requires the Beckman Coulter proprietary assay and cannot be approximated. Enter the PHI value from your laboratory report.'
};

export function calculate({ phi_value }) {
  if (!phi_value || phi_value <= 0) {
    return { interpretation: 'Enter your PHI value from the laboratory report.' };
  }
  if (phi_value < 25) return { interpretation: `Low-moderate risk (PHI ${phi_value}) — csPCa less likely` };
  if (phi_value < 35) return { interpretation: `Moderate-high risk (PHI ${phi_value}) — csPCa likely; biopsy recommended` };
  return { interpretation: `High risk (PHI ${phi_value}) — csPCa highly likely; biopsy recommended` };
}

export function interpret(phi_value) {
  if (!phi_value || phi_value <= 0) return null;
  if (phi_value < 25) return `Low-moderate risk (PHI ${phi_value}) — csPCa less likely`;
  if (phi_value < 35) return `Moderate-high risk (PHI ${phi_value}) — csPCa likely; biopsy recommended`;
  return `High risk (PHI ${phi_value}) — csPCa highly likely; biopsy recommended`;
}