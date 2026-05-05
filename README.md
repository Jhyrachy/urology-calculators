# 🧮 Urology Calculators

Evidence-based clinical calculators for urology practice. Mobile-first PWA with offline support.

**Live:** https://jhyrachy.github.io/urology-calculators

## Features

- **16 clinical calculators** covering prostate cancer, bladder cancer, renal cancer, and general oncology
- **PWA** — installable, works offline
- **Mobile-first** — responsive, works on any device
- **Evidence-based** — every formula cites peer-reviewed literature and EAU Guidelines
- **Zero dependencies** — pure vanilla HTML/CSS/JS, no build step
- **Open source** — MIT License

## Calculators

### Prostate Cancer
| Calculator | Purpose |
|---|---|
| PSA Doubling Time | Biochemical recurrence kinetics after RP |
| PSA Velocity | Annual PSA rise rate |
| % Free PSA | PCa detection in grey zone (4–10 ng/mL) |
| PSA Density | Distinguishes BPH from PCa |
| PHI (Prostate Health Index) | Enhanced PCa detection with p2PSA |
| cPSA (Complexed PSA) | Stable PSA fraction for PCa detection |
| Briganti Nomogram | Lymph node invasion risk before RP |
| CAPSRA Score | Radiotherapy outcome prediction |

### Bladder Cancer
| Calculator | Purpose |
|---|---|
| EAU NMIBC Risk Score | Recurrence/progression stratification |
| EAU NMIBC Risk Stratification | BCG/cystectomy decision guide |

### Renal Cancer
| Calculator | Purpose |
|---|---|
| RENAL Nephrometry Score | Tumor complexity for PN vs RN planning |

### General Oncology
| Calculator | Purpose |
|---|---|
| NLR | Systemic inflammation marker |
| PLR | Systemic inflammation marker |
| PNI | Nutritional-immune status |

### Renal Function
| Calculator | Purpose |
|---|---|
| eGFR (CKD-EPI 2021) | Kidney function assessment |

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

Then add the import to `js/app.js` — that's it.

## Disclaimer

⚠️ **For educational and clinical decision support only.** Always verify with clinical judgment, local guidelines, and patient context. The authors accept no responsibility for clinical decisions made using these tools.

## Bibliography

All formulas are sourced from peer-reviewed literature and the [EAU Guidelines](https://uroweb.org/guidelines).
