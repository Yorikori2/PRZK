#!/usr/bin/env python3
"""Write app/update.json: the game files the Android app keeps up to date, with a SHA-1 each.
The version number goes up only when a file changed. Run after changing the game, then commit and push."""
import hashlib, json, os, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
files = ['index.html', 'manifest.webmanifest', 'app/icon-192.png', 'app/icon-512.png', 'app/icon-180.png']
files += sorted(set(re.findall(r'src="([^"]+\.js)"', html)))
entries = []
for f in files:
    with open(os.path.join(ROOT, f), 'rb') as fh:
        entries.append({'p': f, 'h': hashlib.sha1(fh.read()).hexdigest()})
path = os.path.join(ROOT, 'app', 'update.json')
old = {}
if os.path.exists(path):
    old = json.load(open(path, encoding='utf-8'))
v = old.get('v', 0)
if old.get('files') != entries:
    v += 1
json.dump({'v': v, 'files': entries}, open(path, 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('update.json v%d · %d files' % (v, len(entries)))
