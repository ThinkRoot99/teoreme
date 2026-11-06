"""Verifică articolele Wikipedia din surse-wikipedia.json și scrie surse.json cu adresele finale (RO dacă există, altfel EN).

Rulare: python3 scripts/verifica-surse.py   (cere acces la internet; scrie scripts/surse.json)
"""
import json, pathlib, time, urllib.parse, urllib.request

AICI = pathlib.Path(__file__).resolve().parent
harta = json.loads((AICI / 'surse-wikipedia.json').read_text(encoding='utf-8'))
UA = {'User-Agent': 'teoreme.ro-verificare-surse/1.0 (https://teoreme.ro/contact)'}


def api(params):
    url = 'https://en.wikipedia.org/w/api.php?' + urllib.parse.urlencode({**params, 'format': 'json', 'formatversion': 2})
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30) as r:
        return json.load(r)


titluri = sorted(set(harta.values()))
info = {}
for i in range(0, len(titluri), 40):
    lot = titluri[i:i + 40]
    d = api({'action': 'query', 'titles': '|'.join(lot), 'redirects': 1,
             'prop': 'pageprops|langlinks', 'lllang': 'ro', 'lllimit': 'max', 'ppprop': 'disambiguation'})
    q = d['query']
    redir = {x['from']: x['to'] for x in q.get('redirects', [])}
    norm = {x['from']: x['to'] for x in q.get('normalized', [])}
    pagini = {p['title']: p for p in q['pages']}
    for t in lot:
        final = redir.get(norm.get(t, t), norm.get(t, t))
        p = pagini.get(final, {})
        if p.get('missing') or not p:
            info[t] = {'eroare': 'nu există'}
        elif 'disambiguation' in p.get('pageprops', {}):
            info[t] = {'eroare': 'pagină de dezambiguizare'}
        else:
            ro = (p.get('langlinks') or [{}])[0].get('title')
            info[t] = {'en': final, 'ro': ro}
    time.sleep(1)

surse, erori = {}, []
for tid, t in harta.items():
    x = info[t]
    if 'eroare' in x:
        erori.append(f'{tid}: „{t}” – {x["eroare"]}')
        continue
    if x['ro']:
        surse[tid] = {'titlu': x['ro'], 'url': 'https://ro.wikipedia.org/wiki/' + urllib.parse.quote(x['ro'].replace(' ', '_')), 'limba': 'ro'}
    else:
        surse[tid] = {'titlu': x['en'], 'url': 'https://en.wikipedia.org/wiki/' + urllib.parse.quote(x['en'].replace(' ', '_')), 'limba': 'en'}

(AICI / 'surse.json').write_text(json.dumps(surse, ensure_ascii=False, indent=1), encoding='utf-8')
print(f'teoreme: {len(harta)} | cu sursă: {len(surse)} | în română: {sum(s["limba"] == "ro" for s in surse.values())} | erori: {len(erori)}')
for e in erori:
    print('  ' + e)
