#!/usr/bin/env node
/**
 * Script de build pentru ∑ Teoreme.
 *
 * Regenerează, pornind exclusiv din date.js + continut/*.js:
 *  - teoreme/*.html      -- o pagină statică completă per teoremă (merge și fără JS)
 *  - index.html          -- secțiunea de carduri (doar prima pagină, 24 de teoreme) + statistici
 *  - arhiva.html         -- lista completă grupată pe litere + bara A-Z + numărul total
 *  - sitemap.xml          -- regenerat complet din date.js + lista de pagini statice de mai jos
 *
 * index.html și arhiva.html folosesc marcaje HTML (<!--BUILD:...:START/END-->) în jurul
 * secțiunilor generate, ca acest script să poată fi rulat oricând, de oricâte ori, în siguranță -
 * nu contează ce conțin acele zone înainte de rulare, sunt înlocuite complet de fiecare dată.
 *
 * Rulare: node scripts/build.js
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'teoreme');
const PAGE_SIZE = 24; // trebuie să corespundă cu PAGE_SIZE din <script> din index.html

// Pagini statice (în afară de cele 188 de teoreme) incluse în sitemap.xml
const STATIC_PAGES = [
  { loc: '', lastmod: '2026-05-17', priority: '1.0' },
  { loc: 'arhiva.html', lastmod: '2026-05-17', priority: '0.9' },
  { loc: 'despre.html', lastmod: '2026-09-30', priority: '0.5' },
  { loc: 'contact.html', lastmod: '2026-09-30', priority: '0.5' },
  { loc: 'confidentialitate.html', lastmod: '2026-09-30', priority: '0.3' },
  { loc: 'termeni.html', lastmod: '2026-09-30', priority: '0.3' },
];

// ---------- încarcă date.js ----------
const dateSrc = fs.readFileSync(path.join(ROOT, 'date.js'), 'utf8').replace('var TEOREME = ', 'module.exports = ');
const TMP_DATA = path.join(require('os').tmpdir(), '_teoreme_build_data_' + process.pid + '.js');
fs.writeFileSync(TMP_DATA, dateSrc);
const TEOREME = require(TMP_DATA);
fs.unlinkSync(TMP_DATA);

// ---------- încarcă toate fișierele de conținut ----------
const domainFiles = {
  geometrie: 'continut/geometrie.js', aritmetica: 'continut/aritmetica.js',
  analiza: 'continut/analiza.js', algebra: 'continut/algebra.js',
  probabilitate: 'continut/probabilitate.js', topologie: 'continut/topologie.js',
  combinatorica: 'continut/combinatorica.js', logica: 'continut/logica.js'
};
const domainVars = {
  geometrie: 'CONTINUT_GEOMETRIE', aritmetica: 'CONTINUT_ARITMETICA',
  analiza: 'CONTINUT_ANALIZA', algebra: 'CONTINUT_ALGEBRA',
  probabilitate: 'CONTINUT_PROBABILITATE', topologie: 'CONTINUT_TOPOLOGIE',
  combinatorica: 'CONTINUT_COMBINATORICA', logica: 'CONTINUT_LOGICA'
};
const stores = {};
Object.keys(domainFiles).forEach(function (dom) {
  const src = fs.readFileSync(path.join(ROOT, domainFiles[dom]), 'utf8');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  stores[dom] = ctx[domainVars[dom]];
});

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildExercitii(exercitii) {
  return (exercitii || []).map(function (ex, i) {
    const pasHtml = (ex.pasi || []).map(function (p) {
      return '<div class="step"><div class="dot"></div><p>' + p + '</p></div>';
    }).join('');
    return '<div class="ex-card">' +
      '<div class="ex-head"><div class="ex-num">' + (i + 1) + '</div><div class="ex-q">' + ex.q + '</div></div>' +
      '<div class="ex-body">' + pasHtml + '<div class="result">' + ex.r + '</div></div>' +
      '</div>';
  }).join('');
}

function cardHtml(t, prefix) {
  prefix = prefix || '';
  return '<a href="' + prefix + t.url + '" class="t-card">' +
    '<div class="tc-top">' +
    '<div class="tc-num">' + t.numar + '</div>' +
    '<div>' +
    '<div class="tc-tags">' +
    '<span class="card-tag ' + t.domeniu_tag + '">' + t.domeniu_label + '</span>' +
    '<span class="badge-level ' + t.nivel_cls + '">' + t.nivel_label + '</span>' +
    '</div>' +
    '<div class="tc-title">' + t.titlu + '</div>' +
    '<div class="tc-author">' + t.autor + '</div>' +
    '</div>' +
    '</div>' +
    '<p class="tc-desc">' + t.descriere + '</p>' +
    '<div class="tc-formula">' + t.formula + '</div>' +
    '<div class="tc-footer">' +
    '<div style="display:flex;gap:7px"></div>' +
    '<span class="tc-cta">Vezi teorema →</span>' +
    '</div>' +
    '</a>';
}

function replaceBetween(content, tag, newInner) {
  const re = new RegExp('(<!--BUILD:' + tag + ':START-->)[\\s\\S]*?(<!--BUILD:' + tag + ':END-->)');
  if (!re.test(content)) {
    throw new Error('Marcajele BUILD:' + tag + ' nu au fost găsite - nu pot regenera în siguranță.');
  }
  return content.replace(re, '$1' + newInner + '$2');
}

let stats = { teoreme: 0, index: false, arhiva: false, sitemap: false };

// =====================================================================
// 1. teoreme/*.html
// =====================================================================
(function generateTheoremPages() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

  TEOREME.forEach(function (m, idx) {
    const store = stores[m.domeniu];
    const c = store ? store[m.id] : null;
    const prev = idx > 0 ? TEOREME[idx - 1] : null;
    const next = idx < TEOREME.length - 1 ? TEOREME[idx + 1] : null;
    const tagCls = m.domeniu_tag || 'tag-geo';

    const fullTitle = m.titlu + ' - ∑ Teoreme';
    const desc = m.descriere || ('Teorema ' + m.titlu + ': definiție formală, diagramă, exerciții rezolvate și explicație intuitivă.');
    const canon = 'https://teoreme.ro/teoreme/' + encodeURIComponent(m.id) + '.html';

    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'Article',
      name: m.titlu, description: desc,
      author: { '@type': 'Person', name: m.autor },
      inLanguage: 'ro', educationalLevel: m.nivel_label, url: canon,
      isPartOf: { '@type': 'WebSite', name: '∑ Teoreme', url: 'https://teoreme.ro/' }
    });

    let bodyHtml;
    if (c) {
      const exHtml = buildExercitii(c.exercitii);
      const diagHtml = c.diagrama ? '<div class="diagram-area" aria-hidden="true">' + c.diagrama + '</div>' : '';
      const related = TEOREME.filter(function (t) { return t.domeniu === m.domeniu && t.id !== m.id; }).slice(0, 4);
      const relHtml = related.map(function (t) {
        return '<a href="' + encodeURIComponent(t.id) + '.html" class="related-link">' +
          '<span class="card-tag ' + t.domeniu_tag + '">' + t.domeniu_label + '</span> ' + t.titlu + '</a>';
      }).join('');

      bodyHtml =
        '<nav class="breadcrumb" aria-label="Navigare ierarhică">' +
        '<a href="../index.html">Acasă</a><span class="sep" aria-hidden="true">›</span>' +
        '<a href="../arhiva.html">Arhivă</a><span class="sep" aria-hidden="true">›</span>' +
        '<span>' + m.domeniu_label + '</span><span class="sep" aria-hidden="true">›</span>' +
        '<span aria-current="page">' + m.titlu + '</span>' +
        '</nav>' +
        '<article itemscope itemtype="https://schema.org/Article">' +
        '<div class="tp-head">' +
        '<div class="tag-row">' +
        '<span class="card-tag ' + tagCls + '">' + m.domeniu_label + '</span>' +
        '<span class="badge-level ' + m.nivel_cls + '">' + m.nivel_label + '</span>' +
        '</div>' +
        '<h1 itemprop="name">' + m.titlu + '</h1>' +
        '<p class="author" itemprop="author">' + m.autor + ' · nr. ' + m.numar + '</p>' +
        '</div>' +
        '<div class="tp-tabs" role="tablist">' +
        '<button class="tab-btn active" id="tabDef" type="button" role="tab" aria-selected="true" aria-controls="panelDef" onclick="showTab(this,\'panelDef\')">📖 Definiție</button>' +
        '<button class="tab-btn" id="tabEx" type="button" role="tab" aria-selected="false" aria-controls="panelEx" onclick="showTab(this,\'panelEx\')">✏️ Exerciții rezolvate</button>' +
        '</div>' +
        '<div class="panel active" id="panelDef" role="tabpanel" aria-labelledby="tabDef" itemprop="articleBody">' +
        (c.definitie || '') +
        '<div class="formula-block"><span class="formula-label">Formulă</span>' + c.formula_display + '</div>' +
        diagHtml +
        (c.nota_text ? '<p class="note-text">' + c.nota_text + '</p>' : '') +
        '<div class="intuitive-block">' +
        '<div class="intuitive-title">Imaginea din spatele formulei</div>' +
        '<div class="intuitive-story">' + c.intuitiv_text + '</div>' +
        '<div class="intuitive-note">' + c.intuitiv_nota + '</div>' +
        '</div>' +
        '</div>' +
        '<div class="panel active" id="panelEx" role="tabpanel" aria-labelledby="tabEx">' +
        '<div class="exercises-list">' + exHtml + '</div>' +
        '</div>' +
        '</article>' +
        (relHtml ? '<div class="tp-related"><h3>Din același domeniu - ' + m.domeniu_label + '</h3><div class="related-links">' + relHtml + '</div></div>' : '') +
        '<nav class="theorem-nav" aria-label="Navigare teoreme">' +
        (prev ? '<a href="' + encodeURIComponent(prev.id) + '.html" class="tn-link prev">' + prev.titlu + '</a>' : '<a href="../arhiva.html" class="tn-link prev">Arhivă</a>') +
        (next ? '<a href="' + encodeURIComponent(next.id) + '.html" class="tn-link next">' + next.titlu + '</a>' : '<a href="../arhiva.html" class="tn-link next">Arhivă</a>') +
        '</nav>';
      stats.teoreme++;
    } else {
      bodyHtml =
        '<nav class="breadcrumb"><a href="../index.html">Acasă</a><span class="sep">›</span>' +
        '<a href="../arhiva.html">Arhivă</a><span class="sep">›</span>' +
        '<span>' + m.domeniu_label + '</span><span class="sep">›</span>' +
        '<span aria-current="page">' + m.titlu + '</span></nav>' +
        '<article><div class="tp-head">' +
        '<div class="tag-row"><span class="card-tag ' + tagCls + '">' + m.domeniu_label + '</span>' +
        '<span class="badge-level ' + m.nivel_cls + '">' + m.nivel_label + '</span></div>' +
        '<h1>' + m.titlu + '</h1><p class="author">' + m.autor + ' · nr. ' + m.numar + '</p></div>' +
        '<div class="def-box"><strong>Descriere:</strong> ' + m.descriere + '<br><br>' +
        '<strong>Formulă:</strong> ' + m.formula + '</div>' +
        '<div class="formula-block"><span class="formula-label">Formulă</span>' + m.formula + '</div></article>' +
        '<nav class="theorem-nav">' +
        (prev ? '<a href="' + encodeURIComponent(prev.id) + '.html" class="tn-link prev">' + prev.titlu + '</a>' : '<a href="../arhiva.html" class="tn-link prev">Arhivă</a>') +
        (next ? '<a href="' + encodeURIComponent(next.id) + '.html" class="tn-link next">' + next.titlu + '</a>' : '<a href="../arhiva.html" class="tn-link next">Arhivă</a>') +
        '</nav>';
    }

    const page = '<!DOCTYPE html>\n<html lang="ro">\n<head>\n' +
      '<meta charset="UTF-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
      '<meta name="robots" content="index, follow">\n' +
      '<title>' + esc(fullTitle) + '</title>\n' +
      '<meta name="description" content="' + esc(desc) + '">\n' +
      '<meta property="og:title" content="' + esc(fullTitle) + '">\n' +
      '<meta property="og:description" content="' + esc(desc) + '">\n' +
      '<meta property="og:type" content="article">\n' +
      '<meta property="og:locale" content="ro_RO">\n' +
      '<meta property="og:site_name" content="∑ Teoreme">\n' +
      '<meta name="twitter:card" content="summary">\n' +
      '<link rel="canonical" href="' + canon + '">\n' +
      '<link rel="icon" href="../favicon.svg" type="image/svg+xml">\n' +
      '<link rel="icon" href="../favicon-32.png" type="image/png">\n' +
      '<link rel="apple-touch-icon" href="../apple-touch-icon.png">\n' +
      '<link rel="manifest" href="../manifest.json">\n' +
      '<meta name="theme-color" content="#1a1510">\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=Source+Serif+4:ital,wght@0,300;0,400;0,600;1,300&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">\n' +
      '<link rel="stylesheet" href="../style.css">\n' +
      '<script type="application/ld+json">' + jsonLd + '</script>\n' +
      '</head>\n<body>\n' +
      '<nav class="site-nav">\n  <div class="nav-inner">\n' +
      '    <a href="../index.html" class="logo">∑ <span>Teoreme</span></a>\n' +
      '    <div class="nav-search-wrap">\n' +
      '      <span class="ns-icon" aria-hidden="true">🔍</span>\n' +
      '      <label for="navSearch" class="sr-only">Caută o teoremă</label>\n' +
      '      <input type="search" id="navSearch" placeholder="Caută o teoremă..."\n' +
      '        onkeydown="if(event.key===\'Enter\'&&this.value.trim())window.location=\'../index.html?q=\'+encodeURIComponent(this.value.trim())"\n' +
      '        aria-label="Caută o teoremă">\n' +
      '    </div>\n' +
      '    <div class="nav-links">\n' +
      '      <a href="../index.html">Acasă</a>\n' +
      '      <a href="../arhiva.html">Arhivă</a>\n' +
      '      <a href="../despre.html">Despre</a>\n' +
      '      <a href="../contact.html">Contact</a>\n' +
      '    </div>\n' +
      '  </div>\n</nav>\n\n' +
      '<div class="page-wrap" id="pageWrap">\n' + bodyHtml + '\n</div>\n\n' +
      '<footer>\n  <p>∑ Teoreme · un proiect <a href="https://thinkroot.xyz/">ThinkRoot</a> · <a href="https://code.linuxromania.ro/thinkroot/teoreme">Cod sursă</a></p>\n' +
      '  <p>Copyleft 🄯 2026 · cod licențiat sub <a href="https://opensource.org/license/mit">MIT</a>, text și imagini sub <a href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</a> · <a href="../confidentialitate.html">Confidențialitate</a> · <a href="../termeni.html">Termeni</a></p>\n</footer>\n\n' +
      '<style>.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}</style>\n\n' +
      '<script>\n' +
      'if (window.NodeList && !NodeList.prototype.forEach) {\n' +
      '  NodeList.prototype.forEach = function (callback, thisArg) {\n' +
      '    thisArg = thisArg || window;\n' +
      '    for (var i = 0; i < this.length; i++) { callback.call(thisArg, this[i], i, this); }\n' +
      '  };\n' +
      '}\n' +
      'function showTab(btn, panelId){\n' +
      '  var article = btn;\n' +
      '  while(article && article.tagName !== "ARTICLE"){ article = article.parentNode; }\n' +
      '  article.querySelectorAll(".tab-btn").forEach(function(b){\n' +
      '    b.classList.remove("active");\n' +
      '    b.setAttribute("aria-selected","false");\n' +
      '  });\n' +
      '  article.querySelectorAll(".panel").forEach(function(p){ p.classList.remove("active"); });\n' +
      '  btn.classList.add("active");\n' +
      '  btn.setAttribute("aria-selected","true");\n' +
      '  document.getElementById(panelId).classList.add("active");\n' +
      '}\n' +
      '</script>\n' +
      '</body>\n</html>\n';

    fs.writeFileSync(path.join(OUT_DIR, m.id + '.html'), page);
  });
})();

// =====================================================================
// 2. index.html - prima pagină de carduri (24) + statistici
// =====================================================================
(function generateIndex() {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');

  const firstPage = TEOREME.slice(0, PAGE_SIZE);
  const cardsHtml = '\n' + firstPage.map(function (t) { return cardHtml(t); }).join('\n') + '\n';

  html = replaceBetween(html, 'CARDS', cardsHtml);

  const domenii = {};
  TEOREME.forEach(function (t) { domenii[t.domeniu] = 1; });
  const nd = Object.keys(domenii).length;

  html = html.replace(/(id="statTotal">)[^<]*(<)/, '$1' + TEOREME.length + '$2');
  html = html.replace(/(id="statDomenii">)[^<]*(<)/, '$1' + nd + '$2');
  html = html.replace(/(id="statEx">)[^<]*(<)/, '$1' + (TEOREME.length * 5) + '$2');

  fs.writeFileSync(file, html);
  stats.index = true;
})();

// =====================================================================
// 3. arhiva.html - lista completă + bara A-Z
// =====================================================================
(function generateArhiva() {
  const file = path.join(ROOT, 'arhiva.html');
  let html = fs.readFileSync(file, 'utf8');

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const letterMap = {};
  TEOREME.forEach(function (t) {
    const l = t.litera;
    if (!letterMap[l]) letterMap[l] = [];
    letterMap[l].push(t);
  });
  Object.keys(letterMap).forEach(function (l) {
    letterMap[l].sort(function (a, b) { return a.titlu.localeCompare(b.titlu, 'ro'); });
  });

  const azHtml = ALPHABET.map(function (l) {
    const has = !!letterMap[l];
    return '<button type="button" class="az-btn' + (has ? ' has-items' : '') + '"' +
      (has ? ' onclick="document.getElementById(\'letter-' + l + '\').scrollIntoView({behavior:\'smooth\',block:\'start\'})"' : ' disabled') +
      '>' + l + '</button>';
  }).join('');

  const listHtml = '\n' + Object.keys(letterMap).sort().map(function (l) {
    const items = letterMap[l];
    const rows = items.map(function (t) {
      return '<a href="' + t.url + '" class="arch-row">' +
        '<span class="ar-num">' + t.numar + '</span>' +
        '<span class="ar-title">' + t.titlu + '</span>' +
        '<span class="ar-author">' + t.autor + '</span>' +
        '<div class="ar-meta">' +
        '<span class="card-tag ' + t.domeniu_tag + '">' + t.domeniu_label + '</span>' +
        '<span class="badge-level ' + t.nivel_cls + '">' + t.nivel_label + '</span>' +
        '</div>' +
        '<span class="ar-arrow">→</span>' +
        '</a>';
    }).join('\n');
    return '<div class="letter-group" id="letter-' + l + '">' +
      '<div class="letter-heading">' + l + '<span>' + items.length + ' teorem' + (items.length === 1 ? 'ă' : 'e') + '</span></div>' +
      rows + '</div>';
  }).join('\n') + '\n';

  html = replaceBetween(html, 'AZBAR', azHtml);
  html = replaceBetween(html, 'ARCHLIST', listHtml);
  html = html.replace(
    /(<p id="archCount">Sortate alfabetic · )\d+( teoreme disponibile<\/p>)/,
    '$1' + TEOREME.length + '$2'
  );

  fs.writeFileSync(file, html);
  stats.arhiva = true;
})();

// =====================================================================
// 4. sitemap.xml
// =====================================================================
(function generateSitemap() {
  const file = path.join(ROOT, 'sitemap.xml');
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  STATIC_PAGES.forEach(function (p) {
    lines.push('<url><loc>https://teoreme.ro/' + p.loc + '</loc><lastmod>' + p.lastmod + '</lastmod><priority>' + p.priority + '</priority></url>');
  });
  TEOREME.forEach(function (t) {
    lines.push('<url><loc>https://teoreme.ro/' + t.url + '</loc><lastmod>2026-09-30</lastmod><priority>0.8</priority></url>');
  });
  lines.push('</urlset>');

  fs.writeFileSync(file, lines.join('\n') + '\n');
  stats.sitemap = true;
})();

console.log('Build complet:');
console.log('  teoreme/*.html  ->', stats.teoreme, '/', TEOREME.length, 'pagini');
console.log('  index.html      ->', stats.index ? 'OK (prima pagină, ' + PAGE_SIZE + ' carduri)' : 'EȘUAT');
console.log('  arhiva.html     ->', stats.arhiva ? 'OK (' + TEOREME.length + ' teoreme, toate literele)' : 'EȘUAT');
console.log('  sitemap.xml     ->', stats.sitemap ? 'OK (' + (STATIC_PAGES.length + TEOREME.length) + ' URL-uri)' : 'EȘUAT');
