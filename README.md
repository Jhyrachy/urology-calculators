# Urology Calculators

Evidence-based clinical calculators for urology practice. All formulas are aligned with **EAU Guidelines 2026**. Mobile-first PWA with offline support.

**Live:** https://jhyrachy.github.io/urology-calculators

## Features

- **21 clinical calculators** covering prostate cancer, bladder cancer, renal cancer, and general oncology
- **PWA** — installable, works offline
- **Mobile-first** — responsive, works on any device
- **EAU 2026 aligned** — every formula cites the latest EAU Guidelines
- **DIY + External** — DIY tools implement the full calculation; non-DIY tools link to the official web calculator
- **Zero runtime dependencies** — pure vanilla HTML/CSS/JS, no build step
- **Unit tested** — 11 DIY calculators have automated test coverage
- **Open source** — MIT License

## Calculators

### Prostate Cancer

| Calculator | Type | Purpose |
|---|---|---|
| PSA Doubling Time | DIY | BCR kinetics — PSA-DT thresholds for nmCRPC/AS/ADT decisions |
| PSA Velocity | DIY | Annual PSA rise rate |
| % Free PSA | DIY | PCa detection in grey zone (PSA 4–10 ng/mL) |
| PSA Density + PI-RADS | DIY | PI-RADS-stratified biopsy decision per EAU 2026 Table 5.5 |
| PHI (Prostate Health Index) | Commercial | Lab assay — enter PHI value from lab report |
| EAU Risk Groups | DIY | Initial risk stratification per EAU 2026 Table 4.3 |
| EAU BCR Risk Groups | DIY | BCR risk stratification after RP or RT |
| CAPRA-S | DIY | Post-RP adjuvant risk score |
| Briganti/Gandaglia Nomogram | External | Lymph node invasion risk before ePLND → [evidencio.com](https://www.evidencio.com/models/show/1555) |
| ERSPC Risk Calculator | External | Population-based PCa pre-biopsy risk → [prostatecancer-riskcalculator.com](https://www.prostatecancer-riskcalculator.com) |
| PCPTRC 2.0 | External | 20-item PCa risk calculator → [riskcalc.org](https://riskcalc.org/PCPTRC/) |

### Bladder Cancer

| Calculator | Type | Purpose |
|---|---|---|
| NMIBC Risk Classifier | DIY | TURBT risk stratification (Low/Intermediate/High/Very High) |
| NMIBC Risk (EPSI-based) | Partial | Simplified EAU NMIBC risk groups — EPSI coefficients are EAU-proprietary |

### Renal Cancer

| Calculator | Type | Purpose |
|---|---|---|
| RENAL Nephrometry Score | DIY | Tumor complexity for partial vs radical nephrectomy planning |
| eGFR (CKD-EPI 2021) | DIY | Kidney function — race-free creatinine equation |

### General Oncology / Blood Count

| Calculator | Type | Purpose |
|---|---|---|
| NLR (Neutrophil-to-Lymphocyte Ratio) | DIY | Systemic inflammation marker |
| PLR (Platelet-to-Lymphocyte Ratio) | DIY | Systemic inflammation marker |
| PNI (Prognostic Nutritional Index) | DIY | Nutritional-immune status per EAU 2026 Table 6.1.1 |

## Development

No build step required. Serve the directory:

```bash
python3 -m http.server 8000
```

GitHub Pages deploys the `main` branch automatically at:
https://jhyrachy.github.io/urology-calculators

### Running Tests

```bash
python3 js/tests/run_tests.py
```

Requires Node.js in PATH. Tests are in `js/tests/*.test.mjs`.

## Adding a Calculator

1. Create `js/calculators/my-calc.js` with ES module exports:

```js
// js/calculators/my-calc.js

export const meta = {
  id: 'my-calc',
  name: 'My Calculator',
  shortName: 'MC',
  category: 'prostate-cancer',
  inputs: [
    { id: 'x', label: 'X value', min: 0, step: 0.1, required: true }
  ],
  outputs: [
    { id: 'result', label: 'Result' }
  ],
  references: [
    'Author A et al. J Urol 2020;184:1234-1240'
  ]
};

export function calculate({ x }) {
  if (x < 0) return { error: 'X must be non-negative' };
  return { result: x * 2 };
}
```

2. Add the import to `js/app.js` and register it in the `CALCULATORS` array.

3. (Optional) Add tests in `js/tests/my-calc.test.js`.

## Disclaimer

**For educational and clinical decision support only.** Always verify with clinical judgment, local guidelines, and patient context. The authors accept no responsibility for clinical decisions made using these tools.

## Bibliography

All formulas are sourced from peer-reviewed literature and the [EAU Guidelines 2026](https://uroweb.org/guidelines).
