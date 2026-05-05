# 🧮 Urology Calculators

Evidence-based clinical calculators for urology practice. All formulas are aligned with **EAU Guidelines 2026**. Mobile-first PWA with offline support.

**Live:** https://jhyrachy.github.io/urology-calculators

## Features

- **20 clinical calculators** covering prostate cancer, bladder cancer, renal cancer, and general oncology
- **PWA** — installable, works offline
- **Mobile-first** — responsive, works on any device
- **EAU 2026 aligned** — every formula cites the latest EAU Guidelines (https://uroweb.org/guidelines)
- **DIY + External** — DIY tools implement the full calculation; non-DIY tools open the official web calculator
- **Zero dependencies** — pure vanilla HTML/CSS/JS, no build step
- **Open source** — MIT License

## Calculators

### Prostate Cancer

| Calculator | Type | Purpose |
|---|---|---|
| PSA Doubling Time | DIY | Biochemical recurrence kinetics after RP |
| PSA Velocity | DIY | Annual PSA rise rate |
| % Free PSA | DIY | PCa detection in grey zone (4–10 ng/mL) |
| PSA Density | DIY | Distinguishes BPH from PCa using PI-RADS |
| PHI (Prostate Health Index) | Commercial | Enhanced PCa detection with p2PSA (lab test) |
| EAU Risk Groups | DIY | Initial risk stratification per EAU 2026 |
| EAU BCR Risk Groups | DIY | Biochemical recurrence risk after radical treatment |
| CAPRA-S | DIY | Post-operative adjuvant/adjuvant risk assessment |
| Briganti Nomogram | External | Lymph node invasion risk before RP → [nomogram.org](https://www.nomogram.org) |
| ERSPC Risk Calculator | External | Population-based PCa risk → [prostatecancer-riskcalculator.com](https://www.prostatecancer-riskcalculator.com) |
| PCPTRC Risk Calculator | External | 20-item PCa risk estimation → [myprostatecancerrisk.com](https://www.myprostatecancerrisk.com) |
| Gandaglia Nomogram | External | Long-term oncological outcomes after RP → [nomogram.org](https://www.nomogram.org) |

### Bladder Cancer

| Calculator | Type | Purpose |
|---|---|---|
| EAU NMIBC Risk Score | DIY | Recurrence/progression stratification |
| NM IBC Risk Stratification | DIY | BCG/cystectomy decision guide |

### Renal Cancer

| Calculator | Type | Purpose |
|---|---|---|
| RENAL Nephrometry Score | DIY | Tumor complexity for PN vs RN planning |
| eGFR (CKD-EPI 2021) | DIY | Kidney function assessment |

### General Oncology

| Calculator | Type | Purpose |
|---|---|---|
| NLR (Neutrophil-to-Lymphocyte Ratio) | DIY | Systemic inflammation marker |
| PLR (Platelet-to-Lymphocyte Ratio) | DIY | Systemic inflammation marker |
| PNI (Prognostic Nutritional Index) | DIY | Nutritional-immune status |

### Laboratory Inputs

These are **not** standalone calculators — they are clinical parameters (typically from lab reports) used as inputs for other tools:

| Parameter | Type | Note |
|---|---|---|
| cPSA (Complexed PSA) | Lab input | Stable PSA fraction |
| ePSi (Early Prostate Specific Antigen) | Lab input | Precursor form |
| fPSA (Free PSA) | Lab input | Used in % Free PSA ratio |

## Development

No build step required. Just serve the directory:

```bash
python3 -m http.server 8000
# or
npx serve .
```

GitHub Pages serves the `main` branch automatically at:
`https://jhyrachy.github.io/urology-calculators`

## Adding a Calculator

Create a new file in `js/calculators/` and import it in `js/app.js`:

```js
// js/calculators/my-calc.js
export const id          = 'my-calc';
export const name        = 'My Calculator';
export const category    = 'Prostate Cancer';
export const tags        = ['tag1', 'tag2'];
export const isDIY       = true;        // false = opens external website
export const isCommercial = false;       // true for lab tests (PHI, 4Kscore, etc.)
export const description = 'One-line description.';
export const inputs      = [{ id: 'x', label: 'X value', type: 'number' }];
export const formula     = 'Formula in plain text';
export const howToUse    = 'Clinical instructions';
export const refs        = [{ text: 'Author. J 2020', url: 'https://...' }];

export function calculate(vals) {
  return { value: vals.x * 2, unit: 'unit', interpretation: '...', risk: 'low' };
}
export function renderResult(result) {
  return `<div class="result-box">${result.value}</div>`;
}
```

For **non-DIY** calculators, also include:

```js
export const output = [
  { id: 'resource', label: 'Official Calculator', type: 'text',
    value: 'https://www.example.com/calculator' }
];
```

Then add the import to `js/app.js` — that's it.

## Disclaimer

⚠️ **For educational and clinical decision support only.** Always verify with clinical judgment, local guidelines, and patient context. The authors accept no responsibility for clinical decisions made using these tools.

## Bibliography

All formulas are sourced from peer-reviewed literature and the [EAU Guidelines 2026](https://uroweb.org/guidelines).
