/**
 * EPSI — EAU Prognostic Index for NMIBC
 * EAU 2026: separate NMIBC guideline — risk stratification
 *
 * NOT DIY — EPSI coefficients are proprietary to EAU working group.
 * Simplified EAU 2026 NMIBC risk stratification shown here.
 *
 * Risk groups (simplified EAU 2026 NMIBC):
 *   Low: primary, solitary, G1-2, Ta, <3cm, no CIS
 *   Intermediate: selected TaG2, small recurrences
 *   High: T1, G3, CIS, multiple/recurrent large tumours
 *   Very High: T1G3 + CIS or other very high-risk features
 *
 * DIY: PARTIAL — risk stratification is evidence-based;
 *       exact EPSI formula is EAU-proprietary
 */
(function() {
  'use strict';
  const meta = {
    id: 'epsi',
    name: 'NMIBC Risk (EPSI-based)',
    shortName: 'EPSI',
    category: 'bladder-cancer',
    inputs: [
      { id: 'stage',     label: 'T stage',               type: 'select',
        options: ['Ta', 'T1', 'Tis (CIS)'],                               required: true },
      { id: 'grade',     label: 'WHO Grade',              type: 'select',
        options: ['G1 (low grade)', 'G2 (low grade)', 'G3 (high grade)'], required: true },
      { id: 'num',       label: 'Number of tumours',       min: 1, step: 1, required: true },
      { id: 'size',      label: 'Largest tumour diameter (cm)', min: 0, step: 0.5, required: true },
      { id: 'recurrent', label: 'Prior recurrence?',      type: 'checkbox' }
    ],
    outputs: [
      { id: 'risk_group', label: 'NMIBC Risk Group' },
      { id: 'management', label: 'Management' }
    ],
    references: [
      'EAU 2026 NMIBC Guidelines — EPSI risk stratification',
      'For exact EPSI scoring: EAU NMIBC official app'
    ],
    disclaimer: 'EPSI is EAU-proprietary. This tool implements simplified EAU 2026 NMIBC risk groups for clinical guidance. For official EPSI scoring, use the EAU NMIBC app.'
  };
  function calculate({ stage, grade, num, size, recurrent }) {
    const isG3  = grade === 'G3 (high grade)';
    const isCIS = stage === 'Tis (CIS)';
    const isT1  = stage === 'T1';
    const large = size > 3;
    const multi = num > 1;
    const recur = !!recurrent;

    let risk, mgmt;
    if (isCIS || (isT1 && isG3)) {
      risk = 'Very High Risk';
      mgmt = 'Re-TURBT within 4-6 weeks + BCG or early radical cystectomy';
    } else if (isT1 || (isG3 && (multi || large)) || (isT1 && recur)) {
      risk = 'High Risk';
      mgmt = 'Re-TURBT + BCG intravesical therapy; consider cystectomy in selected cases';
    } else if (isT1 || isG3 || multi || large || recur) {
      risk = 'Intermediate Risk';
      mgmt = 'Intravesical therapy (BCG or MMC); close follow-up with cystoscopy';
    } else {
      risk = 'Low Risk';
      mgmt = 'TURBT alone; single post-TURBT instillation may be considered';
    }
    return { risk_group: risk, management: mgmt };
  }
  if (typeof window !== 'undefined') window.__registerCalculator__(meta.id, meta, calculate);
  if (typeof module !== 'undefined') module.exports = { meta, calculate };
})();
