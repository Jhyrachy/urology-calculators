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
Status:  ✅ Fatto (commit 321e869)
Action:  Aggiunti threshold EAU 2026: <6 mo (ADT), ≤9 mo (nmCRPC/EMBARK),
         <12 mo (WW/watchful waiting), >18 mo (BCR Low-Risk Table 6.4.1).
         Note cliniche più dettagliate. Formula OK.
```

#### psa-velocity.js
```
Tags:    DIY
Status:  ✅ Fatto (commit 321e869)
Action:  Bug fix interpretazione: threshold AS è >0.75 ng/mL/yr (NON <0.75).
         Aggiunto case PSA in calo. Note Movember consensus.
         Formula OK.
```

#### fpsa.js
```
Tags:    DIY
Status:  ✅ Verificato OK
Action:  Cut-off 25/15/10 corretti per zona grigia 4-10 ng/mL (EAU 2026 Sect. 5.2.5).
         Formula %fPSA = (fPSA/tPSA)×100 OK. Nessuna modifica necessaria.
```

#### capra-s.js (rinominato da capsra.js)
```
Tags:    DIY
Status:  ✅ Verificato OK (commit 321e869)
Action:  Rinominato capsra.js → capra-s.js. Logica CAPRA-S post-RP corretta
         (pSA 0.2-0.49=1 … ≥3.0=5; pT2a=1…pT3b-T4=4; margins+LNI+GG).
         Totale 0-10 → Low/Intermediate/High/Very High. Riferimento EAU 2026 [614].
```

#### nlr.js
```
Tags:    DIY
Status:  ✅ Verificato OK
Action:  Formula NLR = ANC/ALC OK. Cut-off <3/3-5/>5 allineati a letteratura
         EAU 2026 Sect. 6.6+. Nessuna modifica necessaria.
```

#### plr.js
```
Tags:    DIY
Status:  ✅ Verificato OK
Action:  Formula PLR = PLT/ALC OK. Cut-off <150/150-250/>250. EAU non definisce
         cut-off specifici per PLR. Nessuna modifica necessaria.
```

#### pni.js
```
Tags:    DIY
Status:  ✅ Verificato OK
Action:  Formula PNI = 10×Albumin + 0.005×Lymphocytes OK. Cut-off ≥40/35-39/30-34/<30
         allineati a Table 6.1.1 EAU 2026. Nessuna modifica necessaria.
```

#### egfr.js
```
Tags:    DIY
Status:  ✅ Verificato OK
Action:  CKD-EPI 2021 già implementato (no race coefficient). Equazione corretta
         con κ/a diversi per sesso. Stadi CKD G1-G5 OK.
         EAU 2026: thresholds per dosaggio farmaci (eGFR <45 abiraterone,
         <30 ajustes, <15 cisplatino). Nessuna modifica necessaria.
```

#### nmibc-risk.js
```
Tags:    DIY, Bladder Cancer
Status:  ✅ Verificato OK
Action:  Logica risk groups (Low/Intermediate/High/Very High) corretta per
         EAU 2026 NMIBC. EPSI è proprietario EAU; il simplified classifier
         nel file riflette i gruppi EAU 2026. Disclaimer appropriato presente.
```

#### renal-nephrometry.js
```
Tags:    DIY, Renal Cancer
Status:  ✅ Verificato OK
Action:  RENAL score (R=1-3, E=1-3, N=1-3, L=1-2, totale 4-12) OK.
         Cut-off ≥7 per considerare PN quando fattibile (EAU 2026).
         Nessuna modifica necessaria.
```

#### eau-bcr-risk.js
```
Tags:    DIY, Prostate Cancer
Status:  ✅ Verificato OK
Action:  Logica ISUP ≥4 OR interval ≤18 → High Risk; altrimenti Low Risk.
         Allineata a Table 6.4.1 EAU 2026. Imaging e management advice OK.
```

### Immediato — Cleanup Repo

- [x] Riferimenti **Stockholm3** → cercare nel repo (risultato: non presente nei file JS)
- [x] **cPSA / ePSi** → sono elencati nel README come "Laboratory Inputs"; il loro utilizzo reale
  come input in altri calcolatori va verificato nel contesto delle altre linee guida EAU
- [x] **CAPRA-S** → già rinominato da capsra.js → capra-s.js (commit 321e869)
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
