# TODO — Urology Calculators

> Aggiornato: 2026-05-05
> Inspired by: make.com workflow logic

---

## 🔴 Fatto ✅

### 2026-05-05 — Ciclo Prostate Cancer (commit `4543553`)

- [x] Scaricare prostate-cancer EAU 2026 (12 capitoli, ~1MB)
- [x] `psa-density.js` — riscritto: PI-RADS input + Table 5.5 matrix EAU 2026
- [x] `eau-risk-groups.js` — corretto: Favourable Intermediate = ISUP GG2 AND PSA<10
- [x] `briganti.js` — `isDIY: false` + link nomogram.org
- [x] `gandaglia.js` — `isDIY: false` + link nomogram.org
- [x] `phi.js` — rimosso `isDIY: false` (è un lab input)
- [x] `erspc-risk-calculator.js` — creato, External, link prostatecancer-riskcalculator.com
- [x] `pcptrc-20.js` — creato, External, link myprostatecancerrisk.com
- [x] `app.js` — import ERSPC+PCPTRC2, registro, logica ext-btn
- [x] `css/style.css` — stile `.ext-btn`
- [x] `README.md` — aggiornato a 20 calcolatori, taxonomy DIY/External/Commercial
- [x] Push GitHub (`4a3aa92` → `4543553`)
- [x] Creata cartella `build/` con PROJECT.md, SCRIPTS.md, scripts/

---

## 🟡 In Corso

(Nessun task in corso — aspetta input utente per proseguire)

---

## 🟢 Da Fare

### Immediato — QA Calcolatori DIY esistenti

#### psa-doubling-time.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare formula del doubling time; confrontare cut-off EAU 2026
         per sospetto di recurrenza biochimica
```

#### psa-velocity.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare cut-off EAU 2026 per PSA velocity (threshold di sospetto)
```

#### fpsa.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare cut-off % Free PSA EAU 2026 nella zona grigia 4-10 ng/mL
```

#### capsra.js (→ CAPRA-S?)
```
Tags:    DIY
Status:  Probabilmente da rinominare/reimplementare
Issue:   File si chiama "CAPSRA" ma le linee guida EAU 2026 usano "CAPRA-S"
Action:  Verificare se è il CAPRA-S corretto o il CAPSRA radioterapia
         (le linee guida citano CAPRA-S per outcomes post-RP)
```

#### nlr.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare cut-off NLR per infiammazione sistemica / prognosi
         (alcuni studi usano cut-off 2-3, altri 3-5)
```

#### plr.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare cut-off PLR EAU 2026
```

#### pni.js
```
Tags:    DIY
Status:  Non verificato EAU 2026
Action:  Verificare formula PNI (albumina + 5 × linfociti) e cut-off prognostico
```

#### egfr.js
```
Tags:    DIY
Status:  Da verificare
Action:  Verificare se EAU 2026 usa CKD-EPI 2021 o altra equazione;
         CKD-EPI 2021 include nuova equazione per fascia 18-25 anni
```

#### nmibc-risk.js
```
Tags:    DIY, Bladder Cancer
Status:  Non verificato EAU 2026
Action:  Verificare stratification EAU 2026 per recurrence/progression NMIBC
         (EORTC Risk Tables vs nuova versione)
```

#### renal-nephrometry.js
```
Tags:    DIY, Renal Cancer
Status:  Non verificato EAU 2026
Action:  Verificare se RENAL score è ancora quello utilizzato o se
         EAU 2026 preferisce PADUA o altri sistemi
```

#### eau-bcr-risk.js
```
Tags:    DIY, Prostate Cancer
Status:  Non verificato EAU 2026
Action:  Verificare gruppi EAU 2026 per BCR post-RP/RT;
         verificare cut-off PSA post-trattamento
```

### Immediato — Cleanup Repo

- [ ] Rimuovere riferimenti **Stockholm3** (test commerciale, non calculator)
  → Cercare ovunque: `grep -ri stockholm3 js/`
- [ ] Chiarire se **cPSA** e **ePSi** sono effettivamente utilizzati come input
  → Cercare: `grep -r "cPSA\|ePSi\|complexed\|early.*psa" js/`
- [ ] Valutare se **CAPRA-S** deve sostituire **CAPSRA** (o se sono entrambi necessari per contesti diversi)

### Immediato — Deploy

- [ ] GitHub Actions: configurare auto-deploy su push a `master` (attualmente il push è manuale)

---

## 🟠 Prossime 18 Linee Guida EAU

### Priority 1 (subito dopo QA calcolatori)

#### bladder-cancer
```
Slugs EAU:   bladder-cancer, muscle-invasive-and-metastatic-bladder-cancer,
             non-muscle-invasive-bladder-cancer, urothelial-cell-carcinoma-upper-tract
Azione:      1. Scaricare con scrape_guideline_full.py
             2. Cercare: nomogrammi, risk scores, calculator citati
             3. Verificare/creare calcolatori per NMIBC, MIBC, UTUC
             4. Verificare nmibc-risk.js esistente
```

#### renal-cell-carcinoma
```
Azione:      1. Scaricare
             2. Cercare: nomogrammi, prognostic scores, staging tools
             3. Verificare renal-nephrometry.js
             4. Cercare: eGFR usato per staging RCC? Altre equazioni?
```

### Priority 2

#### testicular-cancer
```
Azione:      1. Scaricare
             2. Cercare: staging, risk groups (IGCCCG), calculator/nomogrammi
```

#### penile-cancercarcinoma
```
Azione:      1. Scaricare
             2. Cercare: staging, lymph node management tools
```

#### upper-urinary-tract-masses
```
Azione:      1. Scaricare
             2. Cercare: scoring, risk stratification
```

### Priority 3 ( Urology generale)

#### male-infertility
#### male-sexual-and-reproductive-health
#### infection-and-sti

### Priority 4 ( LUTS / Neuro-urology)

#### non-neurogenic-male-luts
#### non-neurogenic-female-luts
#### neuro-urology
#### chronic-pelvic-pain

### Priority 5 (Paediatric + Primary Care)

#### paediatric-urology
#### primary-care-urology
#### urinary-stones

---

## 🟣 Nice-to-Have (senza urgenza)

- [ ] Dark mode
- [ ] i18n en/it
- [ ] Print-friendly view
- [ ] Export risultati PDF/CSV
- [ ] PWA icons (manca `manifest.json` con icone)
- [ ] Service Worker: cache strategy avanzata
- [ ] Test unitari (Jest o semplice test runner)
- [ ] Integrazione Evidencio API (se accessibile)
- [ ] Ci，哪个 calculator è effettivamente il più usato? (per prioritizzare QA)

---

## 📝 Template — Reference Document per Nuova Linea Guida

Quando si analizza una nuova linea guida, creare un file:

```
build/data/<slug>-calculator-reference.md
```

con questo contenuto:

```markdown
# <Slug> — Calculator/Tool Reference (EAU 2026)

## Calcolatori citati nelle linee guida

| Tool | Tipo | DIY? | Commercial? | URL / Note |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

## Note di analisi

- Quali tool sono effettivamente implementabili come DIY
- Quali sono nomogrammi esterni
- Quali sono test commerciali (lab)
- Eventuali discrepanze con l'implementazione attuale
```
