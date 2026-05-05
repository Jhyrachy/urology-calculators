/**
 * NMIBC Risk Classifier — EPSI (EAU NMIBC Prognostic Index)
 * EAU 2026: separate NMIBC guideline — risk stratification
 *
 * DIY: PARTIAL — risk stratification logic DIY; exact EPSI coefficients
 * not published in open-access format by EAU working group.
 *
 * Risk groups (simplified EAU 2026 NMIBC classification):
 *   Low risk: primary, solitary, G1-2, Ta, <3cm, no CIS
 *   Intermediate risk: all others not in high/very high
 *   High risk: T1, G3, CIS, multiple/recurrent, >3cm
 *   Very high risk: T1G3 + CIS or T1G3 + unfavourable
 *
 * EAU 2026 NMIBC: consider EPSI when available; if not,
 * use EORTC recurrence/progression scores.
 */

export const meta = {
  id: 'nmibc-risk',
  name: 'NMIBC Risk Classifier',
  shortName: 'NMIBC',
  category: 'bladder-cancer',
  inputs: [
    { id: 'stage',      label: 'T stage',      type: 'select',
      options: ['Ta', 'T1', 'Tis (CIS)'],                             required: true },
    { id: 'grade',      label: 'WHO Grade',    type: 'select',
      options: ['G1', 'G2', 'G3'],                                      required: true },
    { id: 'num',        label: 'Number of tumours', min: 1,  step: 1,  required: true },
    { id: 'size',       label: 'Largest tumour (cm)', min: 0, step: 0.5, required: true },
    { id: 'recurrent',  label: 'Prior recurrence?', type: 'checkbox' }
  ],
  outputs: [
    { id: 'risk_group',  label: 'NMIBC Risk Group' },
    { id: 'management',  label: 'Management' }
  ],
  references: [
    'EAU 2026 NMIBC Guidelines — EPSI risk stratification',
    'WHO 1973/2004 grade classification — EAU 2026'
  ],
  disclaimer: 'EPSI is EAU-proprietary. This simplified classifier reflects EAU 2026 NMIBC risk groups. For exact EPSI scoring use the EAU NMIBC app.'
};

export function calculate({ stage, grade, num, size, recurrent }) {
  const isG3  = grade === 'G3';
  const isCIS  = stage === 'Tis (CIS)';
  const isT1  = stage === 'T1';
  const large = size > 3;
  const multi = num > 1;
  const recur = recurrent === true;

  let risk, mgmt;
  if (isCIS || (isT1 && isG3)) {
    risk = 'Very High Risk'; mgmt = 'Re-TURBT within 4-6 weeks + BCG or early radical cystectomy';
  } else if (isT1 || isG3) {
    risk = 'High Risk'; mgmt = 'Re-TURBT + BCG intravesical therapy; cystectomy in selected cases';
  } else if (multi || large || recur) {
    risk = 'Intermediate Risk'; mgmt = 'Intravesical therapy (BCG or MMC); close follow-up';
  } else {
    risk = 'Low Risk'; mgmt = 'TURBT alone; single instillation post-TURBT may be considered';
  }
  return { risk_group: risk, management: mgmt };
}