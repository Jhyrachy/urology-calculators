#!/usr/bin/env python3
"""
scrape_chapter_text.py
Atomic: given a chapter URL, fetch it and extract plain text.
No beautifulsoup4 — stdlib only (urllib + re + html.parser).
Isolates <main class="guideline-layout"> to avoid nav/footer noise.
"""
import urllib.request, re, sys, argparse
from html.parser import HTMLParser

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

    # ── isolate guideline content (avoid nav/footer) ──────────────────────
    # Match the main content area: <main ... class="...guideline-layout...">
    main_match = re.search(
        r'<main[^>]*\bclass="[^"]*guideline-layout[^"]*"[^>]*>(.*)',
        html_clean, re.DOTALL
    )
    if main_match:
        html_clean = main_match.group(1)
        # Stop at </main>
        end = html_clean.find('</main>')
        if end != -1:
            html_clean = html_clean[:end]

    text_chunks = []

    # Paragraphs (require >= 30 chars to filter nav/footer noise)
    for p in re.findall(r'<p[^>]*>(.*?)</p>', html_clean, re.DOTALL):
        clean = re.sub(r'<[^>]+>', '', p).strip()
        if clean and len(clean) >= 30:
            text_chunks.append(clean)

    # List items (require >= 15 chars)
    for li in re.findall(r'<li[^>]*>(.*?)</li>', html_clean, re.DOTALL):
        clean = re.sub(r'<[^>]+>', '', li).strip()
        if clean and len(clean) >= 15:
            text_chunks.append('  • ' + clean)

    # Headings
    for tag in ['h2', 'h3', 'h4', 'h5', 'h6']:
        for h in re.findall(f'<{tag}[^>]*>(.*?)</{tag}>', html_clean, re.DOTALL):
            clean = re.sub(r'<[^>]+>', '', h).strip()
            if clean and len(clean) >= 3:
                text_chunks.append(f'\n## {clean}\n')

    return '\n\n'.join(text_chunks)

def main():
    ap = argparse.ArgumentParser(description='Fetch a EAU guideline chapter and extract plain text.')
    ap.add_argument('url', help='Full chapter URL (e.g. https://uroweb.org/guidelines/prostate-cancer/chapter/methods)')
    ap.add_argument('-o', '--out', help='Output .txt file path')
    args = ap.parse_args()

    print(f"Fetching: {args.url}", file=sys.stderr)
    text = fetch_chapter_text(args.url)
    print(f"Extracted {len(text)} chars", file=sys.stderr)

    if args.out:
        with open(args.out, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Saved to {args.out}", file=sys.stderr)
    else:
        print(text)

if __name__ == '__main__':
    main()
