/**
 * Briganti 2017/2019 Nomogram — Lymph Node Invasion (LNI) Prediction
 * EAU 2026: Sect. 5.4.3 [517,518,519]
 *
 * NOT DIY — Beta regression coefficients NOT published in EAU guidelines.
 * Briganti 2017: Briganti A et al. Eur Urol 2017;72:632-640 (LNI prediction)
 * Briganti 2019: Gandaglia G et al. Eur Urol 2019;75:506-514 (PSMA PET-enhanced model)
 *
 * EAU 2026 notes: "Given the excellent specificity of PSMA PET, it remains
 * unclear whether a nomogram is required in patients with PSMA PET-positive
 * lesions" [518].
 *
 * Clinical use: Pre-operative prediction of LNI in PCa candidates for ePLND.
 * EAU-referenced resource: Evidencio platform ( Briganti 2019 model)
 *
 * DIY: NO — use official web nomogram
 */

export const meta = {
  id: 'briganti',
  name: 'Briganti Nomogram (LNI)',
  shortName: 'Briganti',
  category: 'nomogram-closed',
  inputs: [
    { id: 'note', label: 'Note', type: 'info',
      value: 'NOT DIY. Beta coefficients from the original publications are required.' }
  ],
  outputs: [
    { id: 'resource', label: 'Official resource', value: 'https://www.evidencio.com/models/show/1555' },
    { id: 'citation', label: 'Citation', value: 'Briganti A et al. Eur Urol 2017;72:632-640' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4.3 [517,518,519]',
    'Briganti A et al. Eur Urol 2017;72:632-640 — LNI prediction nomogram',
    'Gandaglia G et al. Eur Urol 2019;75:506-514 — PSMA PET-enhanced model [518]'
  ],
  isDIY: false,
  disclaimer: 'This is a reference page. The Briganti 2017/2019 nomogram requires beta coefficients from the original publications and is available as a web nomogram. This page does not implement the formula.'
};

export function calculate() { return {}; }