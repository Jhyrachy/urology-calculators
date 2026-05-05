/**
 * EAU BCR Risk Stratification — Table 6.4.1 (EAU 2026)
 * Classifies biochemical recurrence after RP or RT.
 *
 * EAU 2026 Reference: Table 6.4.1 [994,1021]
 * Post-RP: Low = pISUP < 4 AND interval >18 mo | High = ISUP 4-5 OR interval ≤18 mo
 * Post-RT: Low = bISUP < 4 AND interval >18 mo | High = ISUP 4-5 OR interval ≤18 mo
 * DIY: YES
 */

export const meta = {
  id: 'eau-bcr-risk',
  name: 'EAU BCR Risk Stratification',
  shortName: 'EAU BCR',
  category: 'risk-stratification',
  inputs: [
    { id: 'treatment', label: 'Primary treatment', type: 'select',
      options: ['Radical Prostatectomy (RP)', 'Radiotherapy (RT)'], required: true },
    { id: 'isup', label: 'ISUP Grade Group (pathology/biopsy)', min: 1, max: 5, step: 1, required: true },
    { id: 'interval', label: 'Interval to BCR (months)', min: 0, step: 1, required: true }
  ],
  outputs: [
    { id: 'risk_group', label: 'EAU BCR Risk' },
    { id: 'imaging', label: 'Imaging' },
    { id: 'management', label: 'Management note' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Table 6.4.1 [994]',
    'PreOtto et al. Eur Urol 2023 — BCR risk validation [1021]'
  ]
};

export function calculate({ treatment, isup, interval }) {
  const isHigh = isup >= 4 || interval <= 18;
  const group = isHigh ? 'EAU High-Risk BCR' : 'EAU Low-Risk BCR';
  return {
    risk_group: group,
    imaging: isHigh ? 'PSMA-PET/CT staging before salvage treatment' : 'PSMA-PET if salvage RT considered',
    management: isHigh
      ? 'High systemic risk; multimodal approach recommended'
      : 'Salvage RT ± ADT may be offered; relatively favourable prognosis'
  };
}