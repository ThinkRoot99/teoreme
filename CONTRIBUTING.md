# Ghid de instalare și contribuție

## Structura sitului

```
teoreme.ro/
├── index.html                 ← pagina principală (hero + căutare + prima pagină de carduri)
├── arhiva.html                ← arhiva completă, statică, grupată pe litere A-Z
├── despre.html                ← despre proiect
├── contact.html                ← contact
├── confidentialitate.html      ← politica de confidențialitate
├── termeni.html                 ← termeni și condiții
├── 404.html                    ← pagină de eroare personalizată
├── style.css                   ← stiluri comune tuturor paginilor
├── date.js                     ← metadatele tuturor teoremelor (array TEOREME)
├── sitemap.xml, robots.txt, manifest.json, .htaccess
├── favicon.svg, favicon-32.png, icon-192.png, icon-512.png, apple-touch-icon.png
├── LICENSE                     ← licența codului sursă (MIT)
├── LICENSE-CONTENT              ← licența conținutului (CC BY-SA 4.0)
├── continut/                    ← conținutul complet, câte un fișier per domeniu
│   ├── geometrie.js, aritmetica.js, analiza.js, algebra.js,
│   └── probabilitate.js, topologie.js, combinatorica.js, logica.js
├── teoreme/                     ← 188 de pagini HTML statice, una per teoremă
│   └── *.html                   (generate automat, nu se editează manual)
└── scripts/
    └── build.js                 ← scriptul care regenerează tot ce e mai jos
```

O teoremă se accesează la `teoreme/slug-teorema.html` - fiecare e un
fișier HTML real, static, cu tot conținutul deja în pagină (merge fără
JavaScript). JavaScript-ul adaugă doar interactivitate: comutare
Definiție/Exerciții, căutare live, filtrare, paginare.

`favicon.svg` e iconița principală; `favicon-32.png` și
`apple-touch-icon.png` sunt fallback-uri PNG pentru browsere și
dispozitive care nu suportă favicon SVG, iar `icon-192.png`/
`icon-512.png` sunt folosite de `manifest.json` la instalarea site-ului
ca PWA. Dacă schimbi `favicon.svg`, regenerează și PNG-urile (ex. cu
`rsvg-convert -w <mărime> -h <mărime> favicon.svg -o <fișier>.png`).

## Instalare pe hosting shared

1. Rulează `node scripts/build.js` local (vezi mai jos) ca să te asiguri
   că tot ce e generat e la zi.
2. Încarcă **tot conținutul folderului** în rădăcina domeniului (sau
   într-un subdirector, ex. `public_html/matematica/`) - inclusiv
   `.htaccess`, dacă hostingul e Apache.
3. Gata - nu necesită PHP, baze de date sau alte configurații.

Nu urca folderul `scripts/` dacă vrei un deploy minimal - nu e necesar
pentru afișarea site-ului, doar pentru regenerarea lui.

## Cum adaugi o teoremă nouă

Trei pași, în ordine. Primii doi editează sursele de date; al treilea
generează efectiv pagina nouă - fără el, `teoreme/teorema-lui-rolle.html`
din exemplul de mai jos pur și simplu nu există, nu apare în index,
arhivă sau sitemap.

### Pasul 1 - Actualizează `date.js`

Adaugă un obiect nou în array-ul `TEOREME`:

```javascript
{
  id:      'teorema-lui-rolle',          // slug unic, folosit și ca cheie în continut/[domeniu].js
  numar:   '189',                        // numărul de ordine
  titlu:   'Teorema lui Rolle',
  autor:   'Michel Rolle, 1691',
  domeniu: 'analiza',                    // geometrie / aritmetica / algebra / analiza / probabilitate / topologie / combinatorica / logica
  domeniu_label: 'Analiză',
  domeniu_tag:   'tag-anal',             // tag-geo / tag-arit / tag-alg / tag-anal / tag-prob / tag-topo / tag-comb / tag-log
  nivel:   'avansat',                    // fundamental / intermediar / avansat
  nivel_label: 'Avansat',
  nivel_cls:   'bl-adv',                 // bl-fund / bl-med / bl-adv
  descriere: 'Dacă o funcție derivabilă ...',   // 1-2 propoziții scurte, text simplu (fără < sau > folosite ca semne matematice - vezi nota de mai jos)
  formula: 'f\'(c) = 0',                 // formula principală, text simplu
  url:     'teoreme/teorema-lui-rolle.html',
  litera:  'T'                           // prima literă a titlului (pentru bara A-Z)
}
```

### Pasul 2 - Adaugă conținutul în `continut/[domeniu].js`

Adaugă o intrare nouă în obiectul `CONTINUT_[DOMENIU]`, cu cheia egală
cu `id`-ul din `date.js`:

```javascript
CONTINUT_ANALIZA['teorema-lui-rolle'] = {
  definitie:      '<div class="def-box">...</div>',   // HTML: ipoteză + concluzie
  formula_display:'f\'(c) = 0',
  diagrama:       '<svg ...>...</svg>',   // sau null dacă nu are sens o diagramă
  intuitiv_text:  '...',                  // explicație intuitivă simplă (poate conține <span class="hl">, <strong>, <em>)
  intuitiv_nota:  '...',                  // context istoric / notă
  exercitii: [
    { q: 'Enunț exercițiu', pasi: ['pas 1', 'pas 2'], r: '✓ Rezultat cu <strong>evidențiere</strong>' },
    // ... total 5 exerciții, de tipuri diferite, cu pași explicați în propoziții complete
  ]
};
```

**Important:** dacă vreun text (formulă, descriere, pas de exercițiu)
conține `<` sau `>` ca semne matematice (ex. „n < p”), scrie-le direct
ca `&lt;` / `&gt;` - altfel rup randarea HTML a paginii. Singurele
tag-uri HTML reale permise în text sunt `<div>`, `<span>`, `<strong>`,
`<em>`, `<br>`, `<p>`.

### Pasul 3 - Rulează scriptul de build

```
node scripts/build.js
```

Acesta e pasul care creează efectiv pagina teoremei - fără el, intrările
din `date.js`/`continut/*.js` nu există nicăieri pe site. Regenerează
automat, din `date.js` + `continut/*.js`:
- `teoreme/teorema-lui-rolle.html` (pagina nouă) și restul paginilor din
  `teoreme/*.html` (toate cele 188+ pagini statice)
- secțiunea de carduri din `index.html` (prima pagină, 24 de teoreme)
- lista completă și bara A-Z din `arhiva.html`
- `sitemap.xml`

Scriptul e sigur de rulat oricând, de oricâte ori - folosește marcaje
`<!--BUILD:...:START/END-->` în `index.html`/`arhiva.html` ca să știe
exact ce să înlocuiască, indiferent ce conțin ele înainte de rulare.

Nimic din breadcrumb, header, tab-uri, exerciții, teoreme înrudite sau
navigarea prev/next nu se editează manual - toate se generează din
datele de mai sus.

## Diagrame SVG

Diagramele sunt incluse direct în HTML ca SVG inline.
Dimensiune recomandată: `viewBox="0 0 340 220"`, `width="320"`.

Culori principale (potrivite cu eticheta de domeniu):
- Geometrie: `#1e3a5f` (albastru) · Aritmetică: `#8b1a1a` (roșu)
- Algebră: `#2d5a3d` (verde) · Analiză: `#4a1a7a` (mov)
- Probabilitate: `#b06000` · Topologie: `#1a6040`
- Combinatorică: `#5a1a8a` · Logică: `#8a3010`
- Evidențiere: `#c8922a` (auriu)

Pentru domenii abstracte (logică, topologie, algebră), unde nu există
un desen geometric natural, foloseam diagrame conceptuale/metaforice
(cutii, săgeți, diagrame Venn) în același stil vizual.

## Modificarea stilurilor

Toate stilurile sunt în `style.css`. **Nu folosește variabile CSS
(`var(--x)`)** - au fost eliminate intenționat pentru compatibilitate
cu browsere vechi (IE11 și altele dinainte de ~2017 nu le suportă).
Culorile sunt valori literale, repetate acolo unde e nevoie.

Din același motiv, `gap` pe flexbox e însoțit peste tot de un fallback
cu `margin`, activat doar dacă `gap` chiar nu e suportat
(`@supports (gap:1px)`) - păstrează acest tipar dacă adaugi cod nou cu
`display:flex` + `gap`.

## Stilul de scris al conținutului

Textele (`definitie`, `intuitiv_text`, `intuitiv_nota`, pașii din
`exercitii`) trebuie să sune ca scrise de un profesor, nu de o mașină.
Reguli urmate consecvent în tot `continut/*.js`:

- **Fără liniuță lungă (—)** - folosește liniuța scurtă (`-`) sau
  reformulează fără liniuță. (Liniuța en-dash (–) din nume compuse
  istorice, ex. „De Moivre–Laplace”, e diferită și corectă.)
- **Fără spații duble** și **fără spațiu înainte de semne de
  punctuație** (`.`, `,`, `!`, `?`, `:`, `;`).
- **Ghilimelele de citat sunt cele românești: „ la deschidere, ” la
  închidere** - nu ghilimele drepte (`"`) și nu ghilimele cu backslash
  escapat (`\"` folosit ca închidere în loc de `”`).
- **Notele istorice** (`intuitiv_nota`) se scriu ca proză curgătoare,
  cu conectori naturali - nu ca fraze telegrafice fără verb, de tipul
  „Nume (an). A făcut X. A demonstrat Y.”
- **Pașii din exerciții** sunt propoziții complete, cu punct final -
  nu fragmente legate prin săgeți (`→`) folosite ca substitut de verb
  (săgeata rămâne corectă doar ca notație matematică, ex. `n→∞`).
- Evită să repeți același cuvânt sau aceeași structură de propoziție
  de mai multe ori în aceeași teoremă (ex. mai mulți pași care încep
  toți cu „Aceasta e...”).

## Fonturi folosite (Google Fonts)

- **Playfair Display** - titluri și numere decorative
- **Source Serif 4** - text curent
- **JetBrains Mono** - formule, etichete tehnice, cod

Fonturile se încarcă din CDN-ul Google Fonts (vezi și
`confidentialitate.html` pentru implicațiile de confidențialitate ale
acestui lucru). Pentru funcționare offline, descarcă-le local și
actualizează link-urile din `<head>` în toate fișierele HTML.
