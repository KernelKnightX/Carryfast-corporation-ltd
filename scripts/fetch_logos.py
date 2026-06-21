#!/usr/bin/env python3
import re
import os
import sys
from urllib.parse import quote

try:
    import requests
except Exception:
    requests = None
    import urllib.request

ROOT = os.path.dirname(os.path.dirname(__file__))
CLIENTS_FILE = os.path.join(ROOT, 'frontend', 'src', 'pages', 'Clients.jsx')
OUT_DIR = os.path.join(ROOT, 'frontend', 'public', 'logos')

COMMON_SUFFIXES = ['.com', '.co.in', '.in', '.co', '.net', '.org']
STOP_WORDS = {'pvt', 'pvtltd', 'pvtltd.', 'pvt.', 'ltd', 'limited', 'india', 'corp', 'corporation', 'private'}

def read_clients():
    with open(CLIENTS_FILE, 'r', encoding='utf-8') as f:
        text = f.read()
    m = re.search(r'const\s+CLIENTS\s*=\s*\[([\s\S]*?)\];', text)
    if not m:
        print('Could not find CLIENTS array in', CLIENTS_FILE)
        sys.exit(1)
    block = m.group(1)
    names = re.findall(r'"([^"]+)"', block)
    return names

def slug(name):
    s = re.sub(r'[^a-z0-9]+', '-', name.lower())
    return s.strip('-')

def base_candidates(name):
    parts = re.findall(r"[A-Za-z0-9]+", name)
    parts = [p.lower() for p in parts if p.lower() not in STOP_WORDS]
    if not parts:
        return []
    candidates = []
    joined = ''.join(parts)
    hyphen = '-'.join(parts)
    candidates.append(joined)
    if hyphen != joined:
        candidates.append(hyphen)
    # try first token and first two tokens
    if len(parts) > 0:
        candidates.append(parts[0])
    if len(parts) > 1:
        candidates.append(parts[0] + parts[1])
    return list(dict.fromkeys(candidates))

def try_fetch(domain):
    url = f'https://logo.clearbit.com/{quote(domain)}?size=800'
    alt_url = f'https://logo.clearbit.com/www.{quote(domain)}?size=800'
    try:
        if requests:
            for u in (url, alt_url):
                r = requests.get(u, timeout=10)
                print('    tried', u, 'status', r.status_code)
                if r.status_code == 200 and r.headers.get('content-type','').startswith('image'):
                    return r.content, r.headers.get('content-type')
        else:
            for u in (url, alt_url):
                req = urllib.request.Request(u, headers={'User-Agent': 'logo-fetcher/1.0'})
                try:
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        ctype = resp.getheader('Content-Type','')
                        data = resp.read()
                        print('    tried', u, 'status', resp.status)
                        if ctype.startswith('image'):
                            return data, ctype
                except Exception:
                    print('    tried', u, '-> error')
    except Exception:
        return None
    return None

def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    names = read_clients()
    summary = []
    for name in names:
        s = slug(name)
        print('Processing:', name)
        candidates = base_candidates(name)
        found = False
        for base in candidates:
            for suf in COMMON_SUFFIXES:
                domain = base + suf
                res = try_fetch(domain)
                if res:
                    data, ctype = res
                    ext = 'png'
                    if 'svg' in ctype:
                        ext = 'svg'
                    out_path = os.path.join(OUT_DIR, f'{s}.{ext}')
                    with open(out_path, 'wb') as out:
                        out.write(data)
                    print('  -> saved', out_path, 'from', domain)
                    summary.append((name, domain, out_path))
                    found = True
                    break
            if found:
                break
        if not found:
            print('  -> NOT FOUND for', name)
            summary.append((name, None, None))

    print('\nSummary:')
    for name, domain, path in summary:
        print('-', name, '->', domain or 'MISSING', '->', path or '')

if __name__ == '__main__':
    main()
