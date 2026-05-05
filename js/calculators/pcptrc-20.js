/**
 * PCPTRC 2.0 — Prostate Cancer Prevention Trial Risk Calculator 2.0
 * EAU 2026: Sect. 5.4.1, Table 5.4 [181]
 *
 * Derived from the Prostate Cancer Prevention Trial (PCPT) cohort.
 * URL explicitly cited in EAU 2026 Table 5.4: https://riskcalc.org/PCPTRC/
 *
 * The PCPTRC 2.0 combines age, PSA, DRE, family history, and prior biopsy
 * into a logistic regression model to estimate prostate cancer risk.
 * Beta coefficients are not printed in the EAU guideline.
 *
 * Reference: Thompson IM et al. J Urol 2006;176(5):1970-1977 (PCPT original).
 * PCPTRC 2.0: Ankerst DP et al. Urology 2014;83(6):1362-1367.
 *
 * DIY: NO — use official web calculator
 */

export const meta = {
  id: 'pcptrc-20',
  name: 'PCPTRC 2.0 Risk Calculator',
  shortName: 'PCPTRC 2.0',
  category: 'nomogram-closed',
  inputs: [
    { id: 'note', label: 'Note', type: 'info',
      value: 'NOT DIY — beta coefficients from PCPT cohort required. Use official web calculator.' }
  ],
  outputs: [
    { id: 'resource', label: 'Official calculator',
      value: 'https://riskcalc.org/PCPTRC/' },
    { id: 'citation', label: 'Citation',
      value: 'Ankerst DP et al. Urology 2014;83(6):1362-1367 — PCPTRC 2.0' }
  ],
  references: [
    'EAU 2026 Prostate Cancer Guidelines — Sect. 5.4.1, Table 5.4 [181]',
    'Thompson IM et al. J Urol 2006;176(5):1970-1977 — PCPT original',
    'Ankerst DP et al. Urology 2014;83(6):1362-1367 — PCPTRC 2.0'
  ],
  isDIY: false,
  disclaimer: 'PCPTRC 2.0 beta coefficients are not reproduced here. Please use the official calculator at riskcalc.org/PCPTRC/.'
};

export function calculate() { return {}; }