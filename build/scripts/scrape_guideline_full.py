#!/usr/bin/env python3
"""
scrape_guideline_full.py
Pipeline: given a guideline slug, fetch the full guideline (index + all chapters).
Atomic output: one directory per guideline, one .txt per chapter, meta.json + chapters.json.
Re-run safely — skips chapters already downloaded (checks .chapter_downloaded sentinel).
Requires: scrape_chapter_text.py must be in the same scripts/ directory (imports it).
"""
import urllib.request, re, json, sys, os, time, argparse
from html.parser import HTMLParser

# ── same decode_html + LinkParser + fetch_chapter_text as scrape_chapter_text.py

def decode_html(text):
    replacements = {
        '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
        '&quot;': '"', '&#39;': "'", '&apos;': "'",
        '&ndash;': '–', '&mdash;': '—', '&hellip;': '…',
        '&lsquo;': ''', '&rsquo;': ''', '&ldquo;': '"', '&rdquo;': '"',
        '&deg;': '°', '&plusmn;': '±', '&times;': '×', '&divide;': '÷',
        '&bull;': '•', '&middot;': '·', '&sect;': '§',
    }
    for entity, char in replacements.items():
        text = text.replace(entity, char)
    text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
    text = re.sub(r'&#x([0-9a-fA-F]+);', lambda m: chr(int(m.group(1), 16)), text)
    return text

class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self._curr = None

    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        if tag == 'a' and d.get('href', ''):
            self._curr = {'href': d['href'], 'text': ''}

    def handle_data(self, data):
        if self._curr:
            self._curr['text'] += data

    def handle_endtag(self, tag):
        if tag == 'a' and self._curr:
            t = self._curr['text'].strip()
            h = self._curr['href']
            if '/chapter/' in h and t:
                slug = h.rstrip('/').split('/')[-1]
                # Prepend origin if relative
                href = h if h.startswith('http') else f'https://uroweb.org{h}'
                self.links.append({'href': href, 'text': t, 'chapter_slug': slug})
            self._curr = None

def fetch_index(slug):
    url = f"https://uroweb.org/guidelines/{slug}"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r:
        raw = r.read().decode('utf-8', errors='replace')
    raw = decode_html(raw)
    parser = LinkParser()
    parser.feed(raw)
    # Deduplicate by chapter_slug (page may contain two identical nav sets)
    seen = set()
    unique = []
    for l in parser.links:
        if l['chapter_slug'] not in seen:
            seen.add(l['chapter_slug'])
            unique.append(l)
    return unique, url

def fetch_chapter_text(url):
    """Download a chapter page and return clean plain text.
    Isolates <main class="guideline-layout"> to avoid nav/footer noise.
    """
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req) as r:
        raw = r.read().decode('utf-8', errors='replace')
    raw = decode_html(raw)
    html_clean = re.sub(r'<script[^>]*>.*?</script>', '', raw, flags=re.DOTALL)
    html_clean = re.sub(r'<style[^>]*>.*?</style>', '', html_clean, flags=re.DOTALL)

    # Isolate <main class="guideline-layout"> content
    main_match = re.search(
        r'<main[^>]*\bclass="[^"]*guideline-layout[^"]*"[^>]*>(.*)',
        html_clean, re.DOTALL
    )
    if main_match:
        html_clean = main_match.group(1)
        end = html_clean.find('</main>')
        if end != -1:
            html_clean = html_clean[:end]

    chunks = []

    # Paragraphs (>= 30 chars)
    for p in re.findall(r'<p[^>]*>(.*?)</p>', html_clean, re.DOTALL):
        clean = re.sub(r'<[^>]+>', '', p).strip()
        if clean and len(clean) >= 30:
            chunks.append(clean)

    # List items (>= 15 chars)
    for li in re.findall(r'<li[^>]*>(.*?)</li>', html_clean, re.DOTALL):
        clean = re.sub(r'<[^>]+>', '', li).strip()
        if clean and len(clean) >= 15:
            chunks.append('  • ' + clean)

    # Headings
    for tag in ['h2', 'h3', 'h4', 'h5', 'h6']:
        for h in re.findall(f'<{tag}[^>]*>(.*?)</{tag}>', html_clean, re.DOTALL):
            clean = re.sub(r'<[^>]+>', '', h).strip()
            if clean and len(clean) >= 3:
                chunks.append(f'\n## {clean}\n')

    return '\n\n'.join(chunks)

# ── main pipeline ───────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description='Download a full EAU guideline (index + all chapters).')
    ap.add_argument('slug', help='Guideline slug (e.g. prostate-cancer)')
    ap.add_argument('-o', '--outdir', default=None,
                    help='Output directory (default: same directory as this script/../data)')
    ap.add_argument('--skip', action='store_true',
                    help='Skip already-downloaded chapters (safe resume)')
    args = ap.parse_args()

    script_dir = os.path.dirname(os.path.abspath(__file__))
    default_out = os.path.normpath(os.path.join(script_dir, '..', 'data'))
    outdir = os.path.join(args.outdir if args.outdir else default_out, args.slug)
    os.makedirs(outdir, exist_ok=True)

    # 1. Fetch index
    print(f"Fetching index: https://uroweb.org/guidelines/{args.slug}", file=sys.stderr)
    links, index_url = fetch_index(args.slug)
    print(f"Found {len(links)} chapters", file=sys.stderr)

    # 2. Save meta
    meta = {
        'slug': args.slug,
        'index_url': index_url,
        'downloaded_at': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime()),
        'n_chapters': len(links),
    }
    with open(os.path.join(outdir, 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    # 3. Save chapter list
    with open(os.path.join(outdir, 'chapters.json'), 'w', encoding='utf-8') as f:
        json.dump(links, f, indent=2, ensure_ascii=False)

    # 4. Download each chapter
    for i, ch in enumerate(links, 1):
        slug = ch['chapter_slug']
        txt_path = os.path.join(outdir, f'{slug}.txt')
        flag_path = os.path.join(outdir, f'.{slug}.downloaded')

        if args.skip and os.path.exists(flag_path):
            print(f"  [{i:02d}/{len(links)}] SKIP {slug}", file=sys.stderr)
            continue

        print(f"  [{i:02d}/{len(links)}] {slug}: {ch['text'][:50]}...", file=sys.stderr)
        try:
            text = fetch_chapter_text(ch['href'])
            with open(txt_path, 'w', encoding='utf-8') as f:
                f.write(text)
            with open(flag_path, 'w') as f:
                f.write('ok')
            print(f"          → {len(text)} chars", file=sys.stderr)
        except Exception as e:
            print(f"          → ERROR: {e}", file=sys.stderr)

        time.sleep(0.3)  # polite delay

    print(f"\nDone. Output: {outdir}/", file=sys.stderr)

if __name__ == '__main__':
    main()
