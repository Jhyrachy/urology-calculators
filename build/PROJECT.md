# Urology Calculators — Project Board

> Ultimo aggiornamento: 2026-05-05
> Branch: `master` · Commit: `4543553`

---

## 📋 Stato del Progetto

**Obiettivo:** Allineare tutti i calcolatori della PWA [Jhyrachy/urology-calculators](https://github.com/Jhyrachy/urology-calculators) alle **EAU Guidelines 2026** scaricate da [uroweb.org](https://uroweb.org/guidelines).

**Dove siamo:** Prostate-cancer ✅ — una linea guida completata su 19.

---

## 📁 Struttura Progetto

```
urology-calculators/
├── index.html, css/, js/, manifest.json, sw.js   ← PWA (pubblicata su GitHub Pages)
├── build/
│   ├── PROJECT.md                                  ← Questo file
│   ├── SCRIPTS.md                                  ← Documentazione script di scraping
│   ├── scripts/
│   │   ├── scrape_guideline_index.py              ← Atomic: slug → chapter links (JSON)
│   │   ├── scrape_chapter_text.py                  ← Atomic: URL chapter → plain text
│   │   └── scrape_guideline_full.py                ← Pipeline completa con --skip
│   └── data/
│       ├──EAU-GUIDELINE-SLUGS.json                 ← 19 slug EAU
│       ├──EAU-OUTPUT/
│       │   └── prostate-cancer-calculator-reference.md  ← Tutti i 27 tool citati
│       └── <slug>/                                 ← Dati grezzi scaricati (12 capitoli)
└── docs/
    └── TODO.md                                     ← Todo e backlog dettagliato
```

**Dati grezzi:** `/opt/data/home/data/<slug>/` (solo ambiente locale, non committati per dimensione)
**Scripts:** `/opt/data/home/scripts/` (ambiente locale) e `build/scripts/` (in repo)

---

## ✅ Fatto

### Pipeline di scraping (build/scripts/)

| Script | Funzione |
|---|---|
| `scrape_guideline_index.py` | Dato uno slug, scarica index page EAU → JSON con tutti i chapter links |
| `scrape_chapter_text.py` | Dato URL chapter, estrae solo `<main class="guideline-layout">` (no nav/footer) |
| `scrape_guideline_full.py` | Pipeline completa: index + tutti i chapters; `--skip` per re-run sicuri |

Tutti: **stdlib only** (urllib + re + html.parser), **nessun pip/beautifulsoup4**.

### Calcolatori corretti (EAU 2026)

| Calcolatore | Correzione |
|---|---|
| `psa-density.js` | Aggiunto input PI-RADS slider (1–5); implementata matrice Table 5.5 EAU 2026 con cut-off PSAD stratificati (0.2/0.25/0.3 cc⁻¹) |
| `eau-risk-groups.js` | Corretta logica "Favourable Intermediate": richiede ISUP GG 2 **AND** PSA <10 ng/mL (non solo GG2) |
| `briganti.js` | `isDIY: false`; link a nomogram.org; disclaimer EAU 2026 |
| `gandaglia.js` | `isDIY: false`; link a nomogram.org; citazione separata |
| `phi.js` | Rimosso `isDIY: false` (è un input da lab, non un web calculator) |

### Calcolatori nuovi (EAU 2026)

| Calcolatore | Tipo | Link |
|---|---|---|
| `erspc-risk-calculator.js` | External | prostatecancer-riskcalculator.com (citato EAU 2026 Sect. 5.4) |
| `pcptrc-20.js` | External | myprostatecancerrisk.com (citato EAU 2026 Sect. 5.4) |

### UI/UX

- `app.js` → import ERSPC + PCPTRC2; registro; logica **"Open official calculator ↗"** per `isDIY: false`
- `css/style.css` → stile `.ext-btn` per pulsante esterno

### Documentazione

- `README.md` aggiornato: 20 calcolatori, taxonomy DIY/External/Commercial, EAU 2026
- `build/PROJECT.md` (questo file)
- `build/SCRIPTS.md` (documentazione pipeline)
- `build/docs/TODO.md` (backlog dettagliato)

---

## 🔜 Da Fare

### Immediato — Allineare i calcolatori DIY rimanenti

Verificare che la logica esistente sia allineata alle soglie EAU 2026:

- [ ] `psa-doubling-time.js` — verifica formula e interpretazione EAU 2026
- [ ] `psa-velocity.js` — verifica cut-off EAU 2026 (threshold per sospetto)
- [ ] `fpsa.js` — verifica cut-off % Free PSA EAU 2026
- [ ] `capsra.js` → **CAPRA-S** (rinomina? il file attuale è CAPSRA, le linee guida usano CAPRA-S)
- [ ] `capsra.js` logica — verifica se le linee guida EAU 2026 citano il CAPRA-S
- [ ] `nlr.js` — verifica cut-off infiammazione/sopravvivenza EAU 2026
- [ ] `plr.js` — verifica cut-off EAU 2026
- [ ] `pni.js` — verifica formula e cut-off EAU 2026
- [ ] `egfr.js` — CKD-EPI 2021 è già aggiornato? Verificare se EAU 2026 usa eq. diversa
- [ ] `nmibc-risk.js` — verifica stratification EAU 2026 (recurrence/progression)
- [ ] `renal-nephrometry.js` — verifica sistema di scoring EAU 2026
- [ ] `eau-bcr-risk.js` — verifica gruppi EAU 2026 per BCR post-RP/RT

### Immediato — Rimuovere dllarepo

- [ ] Rimuovere riferimenti a **Stockholm3** (test di laboratorio commerciale, non un calculator)
- [ ] Rimuovere **cPSA** e **ePSi** se non usati come input in nessun altro calcolatore (al momento sono elencati nel README ma non sono chiari come vengono usati)

### Prossimo — Processare le altre 18 linee guida EAU

Per ogni linea guida (dalla lista slug):

```
1. scrape_guideline_full.py --slug <slug>
2. Analizzare i tool/calculator/nomogrammi citati
3. Correggere o creare calcolatori dove necessario
4. Commit per ogni linea guida
```

**Slugs rimanenti (19 totali, 1 completata):**

```
bladder-cancer
chronic-pelvic-pain
infection-and-sti
male-infertility
male-sexual-and-reproductive-health
muscle-invasive-and-metastatic-bladder-cancer
neuro-urology
non-muscle-invasive-bladder-cancer
non-neurogenic-female-luts
non-neurogenic-male-luts
paediatric-urology
penile-cancercarcinoma
primary-care-urology
renal-cell-carcinoma
testicular-cancer
upper-urinary-tract-masses
urinary-stones
urothelial-cell-carcinoma-upper-tract
```

### Mid-term

- [ ] Validare ogni calcolatore contro le tabelle/formule delle linee guida EAU 2026 (non solo il testo, ma i cut-off numerici)
- [ ] Aggiungere test unitari per i calcolatori DIY (almeno un caso per ogni output atteso)
- [ ] GitHub Actions: auto-deploy su push a `master`
- [ ] Aggiungere `manifest.json` con icone PWA完整的
- [ ] Service Worker: cache strategy per offline

### Nice-to-have

- [ ] Dark mode
- [ ] Linguaggio i18n (en/it)
- [ ] Print-friendly view per ogni calcolatore
- [ ] Export risultati (PDF/CSV)
- [ ] Integrazione con Evidencio API (se diventa accessibile)

---

## 📖 Riferimenti

- **Live PWA:** https://jhyrachy.github.io/urology-calculators
- **Repo:** https://github.com/Jhyrachy/urology-calculators
- **EAU Guidelines:** https://uroweb.org/guidelines
- **EA U Guidelines 2026 (prostate-cancer):** `/opt/data/home/data/prostate-cancer/`
- **Slugs EAU:** `/opt/data/home/data/eau-guideline-slugs.json`

---

## 🔑 Regole Chiave

1. **Non fidarsi mai dei file in `Urology-RAG/guidelines/`** — sono pre-2026. Usare sempre i dati scaricati in `/opt/data/home/data/<slug>/`
2. **Script stdlib only** — nessun beautifulsoup4, nessun pip
3. **Non committare dati grezzi** (file .txt enormi) — restano in `/opt/data/home/data/`
4. **Non includere mai chiavi API o secret** nei file di output
5. **isDIY: false + isCommercial: true** sono flag separati — PHI/4Kscore sono `isCommercial: true` (lab test); Briganti/Gandaglia sono `isDIY: false` (web nomogram)
