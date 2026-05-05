/**
 * CAPRA-S Score — Post-RP Prognostic Score
 * EAU 2026: Sect. 6.2.5 [614]
 *
 * University of California, San Francisco — Cancer of the Prostate
 * Risk Assessment (Post-Surgical).
 *
 * Components (points):
 *   PSA:  0.2-0.49=1 | 0.5-0.99=2 | 1.0-1.99=3 | 2.0-2.99=4 | ≥3.0=5
 *   pT:   pT2a=1 | pT2b=2 | pT3a=3 | pT3b-T4=4
 *   Margins: positive=1 | negative=0
 *   LNI: yes=2 | no=0
 *   ISUP GG: GG1=0 | GG2=1 | GG3=2 | GG4=3 | GG5=3 (max)
 *
 * Total 0-10 → Risk: ≤1 Low | 2-3 Intermediate | 4-5 High | 6-10 Very High
 *
 * EAU 2026 [614]:
 *   15-year outcomes: 26.4% Score 3-5 (CAPRA 3-5), 2.5% Score 6-10
 *   Pre-SRT PSA and CAPRA-S scores used for HT benefit assessment post-SRT
 *
 * DIY: YES — requires RP pathology report
 */

export const meta = {
  id: 'capra-s',
  name: 'CAPRA-S Score',
  shortName: 'CAPRA-S',
  category: 'post-rp-risk',
  inputs: [
    { id: 'psa',    label: 'Pre-op PSA (ng/mL)',                min: 0, step: 0.01, required: true },
    { id: 'pt',     label: 'Pathological T stage',            type: 'select',
      options: ['pT2a', 'pT2b', 'pT3a', 'pT3b', 'pT4'],                         required: true },
    { id: 'margins',label: 'Positive surgical margins?',       type: 'select',
      options: ['No', 'Yes'],                                                          required: true },
    { id: 'lni',    label: 'Lymph node involvement?',          type: 'select',
      options: ['No', 'Yes'],                                                          required: true },
    { id: 'isup',   label: 'Pathological ISUP Grade Group',     min: 1, max: 5, step: 1, required: true }
  ],
  outputs: [
    { id: 'score',      label: 'CAPRA-S Score (0-10)' },
    { id: 'risk_group', label: 'Risk Group' }
  ],
  references: [
    'Cooperberg MR et al. J Urol 2011;185:1161-1165 — CAPRA-S',
    'EAU 2026 Prostate Cancer Guidelines — Sect. 6.2.5 [614]'
  ]
};

function psaPts(psa) {
  if (psa < 0.2)  return 0;
  if (psa < 0.5)  return 1;
  if (psa < 1.0)  return 2;
  if (psa < 2.0)  return 3;
  if (psa < 3.0)  return 4;
  return 5;
}

function ptPts(pt) { return { pT2a: 1, pT2b: 2, pT3a: 3, 'pT3b': 4, pT4: 4 }[pt] || 0; }

function ggPts(gg) { return Math.min(Math.max(0, gg - 1), 3); }

export function calculate({ psa, pt, margins, lni, isup }) {
  const total = psaPts(psa) + ptPts(pt) + (margins === 'Yes' ? 1 : 0) + (lni === 'Yes' ? 2 : 0) + ggPts(isup);
  const score = Math.min(total, 10);
  const group = score <= 1 ? 'Low' : score <= 3 ? 'Intermediate' : score <= 5 ? 'High' : 'Very High';
  return { score, risk_group: group };
}