/**
 * Gandaglia Nomogram — Lymph Node Invasion (LNI) Risk Prediction
 * EAU 2026: Sect. 5.4.3 [517,518,519]
 *
 * NOT DIY — Regression coefficients NOT publicly disclosed in EAU guidelines.
 * Published: Gandaglia G et al. Eur Urol 2017;72:632-640 (Briganti 2017 updated model)
 * Gandaglia G et al. Eur Urol 2019;75:506-514 (PSMA PET-enhanced LNI model)
 *
 * Clinical use: Predicts lymph node invasion (LNI) risk to guide extended PLND (ePLND).
 * EAU 2026: "Consider Briganti/Gandaglia nomogram when ePLND is planned" [517]
 * EAU-referenced resource: MSKCC nomograms or Evidencio platform
 *
 * DIY: NO — use official web nomogram
 */

export const meta = {
  id: 'gandaglia',
  name: 'Gandaglia Nomogram (LNI)',
  shortName: 'Gandaglia',
  category: 'nomogram-closed',
  inputs: [
    { id: 'info', label: 'Note', type: 'info',
      value: 'NOT DIY. Use official web nomogram for LNI risk assessment.' }
  ],
  outputs: [
    { id: 'resource', label: 'Official resource', value: 'https://www.evidencio.com/models/show/1555' },
    { id: 'citation', label: 'Citation', value: 'Gandaglia G et al. Eur Urol 2017;72:632-640' }
  ],
  references: [
    'Gandaglia G et al. Eur Urol 2017;72:632-640 — LNI nomogram',
    'Gandaglia G et al. Eur Urol 2019;75:506-514 — PSMA PET-enhanced model',
    'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4.3 [517,518,519]'
  ],
  isDIY: false,
  disclaimer: 'Gandaglia nomogram coefficients are not publicly reproduced here. Use the published nomogram platform (Evidencio or MSKCC).'
};

export function calculate() { return {}; }