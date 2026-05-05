#!/usr/bin/env python3
"""
scrape_guideline_index.py
Atomic: given a guideline slug, fetch its index page and extract all chapter links.
Output: JSON list of {href, text, chapter_slug} saved to stdout / file.
No dependencies beyond stdlib.
"""
import urllib.request, re, json, sys, argparse
from html.parser import HTMLParser

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
                href = h if h.startswith('http') else f'https://uroweb.org{h}'
                self.links.append({'href': href, 'text': t, 'chapter_slug': slug})
            self._curr = None

def decode_html(text):
    replacements = {
        '&nbsp;': ' ', '&amp;': '&', '&lt;': '<', '&gt;': '>',
        '&quot;': '"', '&#39;': "'", '&apos;': "'",
        '&ndash;': '–', '&mdash;': '—', '&hellip;': '…',
        '&lsquo;': ''', '&rsquo;': ''', '&ldquo;': '"', '&rdquo;': '"',
        '&deg;': '°', '&plusmn;': '±', '&times;': '×', '&divide;': '÷',
    }
    for entity, char in replacements.items():
        text = text.replace(entity, char)
    text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
    text = re.sub(r'&#x([0-9a-fA-F]+);', lambda m: chr(int(m.group(1), 16)), text)
    return text

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

def main():
    ap = argparse.ArgumentParser(description='Extract chapter links from a EAU guideline index page.')
    ap.add_argument('slug', help='Guideline slug (e.g. prostate-cancer, renal-cell-carcinoma)')
    ap.add_argument('-o', '--out', help='Output JSON file path')
    args = ap.parse_args()

    links, url = fetch_index(args.slug)
    print(f"Found {len(links)} chapters for '{args.slug}': {url}", file=sys.stderr)
    for i, l in enumerate(links, 1):
        print(f"  [{i:02d}] {l['chapter_slug']}: {l['text'][:60]}", file=sys.stderr)

    out = json.dumps(links, indent=2, ensure_ascii=False)
    if args.out:
        with open(args.out, 'w', encoding='utf-8') as f:
            f.write(out)
        print(f"Saved to {args.out}", file=sys.stderr)
    else:
        print(out)

if __name__ == '__main__':
    main()
