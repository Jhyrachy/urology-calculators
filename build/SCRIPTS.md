# Scripts — EAU Guidelines Scraping Pipeline

> Documentazione degli script di scraping per scaricare le linee guida EAU da uroweb.org.
> Tutti gli script sono **stdlib only**: nessun pip, nessun beautifulsoup4.
> Usano solo `urllib`, `re`, `html.parser`, `argparse`, `json`, `pathlib`.

---

## Panoramica Pipeline

```
scrape_guideline_index.py     →  dato uno slug, restituisce tutti i chapter links (JSON)
         ↓
scrape_chapter_text.py        →  dato un URL chapter, estrae il testo pulito
         ↓
scrape_guideline_full.py      →  orchestratore: index + tutti i chapters
```

---

## `scrape_guideline_index.py`

**Uso:** dato uno slug EAU, scarica la pagina indice e restituisce tutti i link ai capitoli.

```bash
python3 scrape_guideline_index.py <slug>
python3 scrape_guideline_index.py prostate-cancer
python3 scrape_guideline_index.py renal-cell-carcinoma --output chapters.json
```

**Output:** JSON su stdout (o file se `--output`):

```json
{
  "slug": "prostate-cancer",
  "title": " Prostate Cancer",
  "chapters": [
    {
      "title": "5.4 Screening and Early Detection",
      "url": "https://uroweb.org/guideline/prostate-cancer/?chapter=5678"
    }
  ]
}
```

**Deduplicazione:** i link vengono deduplicati per URL; URL relativi vengono ricostruiti in assoluti.

---

## `scrape_chapter_text.py`

**Uso:** dato un URL di un capitolo, estrae solo il contenuto di `<main class="guideline-layout">`.

```bash
# Da URL singolo a stdout
python3 scrape_chapter_text.py "https://uroweb.org/guideline/prostate-cancer/?chapter=5678"

# Salva su file
python3 scrape_chapter_text.py "https://uroweb.org/guideline/prostate-cancer/?chapter=5678" \
  --output /path/to/save/chapter-5678.txt

# Con encoding detection (gestisce caratteri speciali)
python3 scrape_chapter_text.py "https://uroweb.org/guideline/prostate-cancer/?chapter=5678" \
  --output save.txt --encoding utf-8
```

**Come funziona:**
1. Scarica la pagina HTML
2. Trova `<main class="guideline-layout">`
3. Rimuove nav, footer, sidebar, script, style
4. Estrae solo il testo visibile (no HTML)
5. Pulisce whitespace eccessivo

**Output:** testo plain su stdout (o file), codifica UTF-8.

---

## `scrape_guideline_full.py`

**Uso:** scarica un'intera linea guida (index + tutti i chapters) in una directory.

```bash
# Scarica prostate-cancer in ./data/prostate-cancer/
python3 scrape_guideline_full.py prostate-cancer

# Con path personalizzato
python3 scrape_guideline_full.py prostate-cancer --output-dir /opt/data/home/data/

# Re-run sicuro (skippa capitoli già scaricati)
python3 scrape_guideline_full.py prostate-cancer --skip

# Solo index (no chapters)
python3 scrape_guideline_full.py prostate-cancer --index-only

# Skip con timeout esteso
python3 scrape_guideline_full.py prostate-cancer --skip --timeout 30
```

**Struttura output:**

```
/opt/data/home/data/prostate-cancer/
├── index.json                          ← Output di scrape_guideline_index.py
├── chapter-5678.txt                    ← Testo capitolo 5678
├── chapter-5679.txt
├── ...
└── scrape.log                          ← Log del download
```

**Opzioni:**

| Opzione | Descrizione |
|---|---|
| `--slug` | Slug della linea guida (default: args[1]) |
| `--output-dir` | Directory output (default: `./data/<slug>/`) |
| `--skip` | Salta capitoli già presenti (per re-run sicuri) |
| `--index-only` | Scarica solo l'indice (no chapters) |
| `--timeout` | Timeout in secondi per request (default: 20) |
| `--delay` | Delay in secondi tra request (default: 1) per rispetto server |
| `--log` | File di log (default: `<output_dir>/scrape.log`) |

---

## Gestione Errori

- **Timeout:** retry automatico fino a 3 volte con backoff esponenziale
- **404/404:** skippa il capitolo, registra in log, continua
- **Encoding errato:** try/except con fallback a `latin-1` → `utf-8` ignorando errori
- **Href relativi:** ricostruiti in URL assoluti usando la URL base di uroweb.org

---

## Slugs EAU Disponibili

```bash
# Stampare la lista degli slug EAU
curl -s https://uroweb.org/guidelines | grep -oP 'href="/guideline/[^"]+' | sed 's/href="\/guideline\///' | tr -d '/' | sort -u
```

Oppure consultare `/opt/data/home/data/eau-guideline-slugs.json`.

---

## Note per lo Sviluppo

1. **Non pipare mai** — questi script devono funzionare su qualsiasi sistema con solo Python stdlib
2. **testing locale:** eseguire `python3 scrape_guideline_full.py prostate-cancer --skip` per verificare che lo skip funzioni (non ri-scarica nulla)
3. **Capire la struttura EAU:** le linee guida EAU hanno tutte la stessa struttura URL: `https://uroweb.org/guideline/<slug>/?chapter=<number>`
4. **File di log:** ogni run scrive in `<output_dir>/scrape.log` con timestamp, capitoli scaricati, errori
5. **Numerosità:** prostate-cancer ha 12 capitoli; altre linee guida possono avere 5–20 capitoli

---

## Esempio Workflow Completo

```bash
# 1. Scaricare una nuova linea guida
python3 build/scripts/scrape_guideline_full.py bladder-cancer --output-dir /opt/data/home/data/

# 2. Leggere i capitoli scaricati
ls /opt/data/home/data/bladder-cancer/
cat /opt/data/home/data/bladder-cancer/chapter-*.txt | less

# 3. Analizzare i calcolatori citati e cercare in:
grep -i -E 'calculator|nomogram|score|risk|tool' /opt/data/home/data/bladder-cancer/chapter-*.txt

# 4. Creare il reference document per quella linea guida
# (vedere build/docs/TODO.md per il template)
```
