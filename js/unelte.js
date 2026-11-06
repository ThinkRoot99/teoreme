// ∑ Teoreme - logica comună pentru paginile din /unelte/
// (rezolvitor ecuații de gradul II + grafic, convertor cifre romane,
// calculator viteză/distanță/timp). Fiecare funcție e testată separat
// înainte de a ajunge aici - vezi scripts/ din scratchpad-ul de lucru.

function fmt(n) {
  if (Object.is(n, -0)) n = 0;
  var r = Math.round(n * 10000) / 10000;
  return r.toString().replace('.', ',');
}

function fmtSigned(n) {
  var s = fmt(n);
  return n < 0 ? '(' + s + ')' : s;
}

function step(html) {
  return '<div class="step"><div class="dot"></div><p>' + html + '</p></div>';
}

function parseCoef(str) {
  str = str.trim().replace(',', '.');
  if (str === '' || str === '-' || str === '+') return null;
  var n = Number(str);
  return isFinite(n) ? n : null;
}

// ---------- Ecuație de gradul II ----------
function solveQuadratic(a, b, c) {
  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
    return { type: 'error', message: 'Coeficienții trebuie să fie numere valide.' };
  }
  var scale = Math.max(Math.abs(a), Math.abs(b), Math.abs(c), 1);
  var EPS = 1e-12 * scale * scale;

  if (a === 0) {
    if (b === 0) {
      if (c === 0) return { type: 'identity' };
      return { type: 'no-solution' };
    }
    return { type: 'linear', x: -c / b };
  }

  var D = b * b - 4 * a * c;

  if (Math.abs(D) <= EPS) {
    return { type: 'double', x: -b / (2 * a), discriminant: D };
  }

  if (D > 0) {
    var sqrtD = Math.sqrt(D);
    var q = -0.5 * (b + (b >= 0 ? 1 : -1) * sqrtD);
    var x1, x2;
    if (q !== 0) { x1 = q / a; x2 = c / q; }
    else { x1 = sqrtD / (2 * a); x2 = -sqrtD / (2 * a); }
    return { type: 'real', x1: Math.min(x1, x2), x2: Math.max(x1, x2), discriminant: D };
  }

  var re = -b / (2 * a);
  var im = Math.sqrt(-D) / (2 * a);
  return { type: 'complex', re: re, im: Math.abs(im), discriminant: D };
}

function computeGraphView(a, b, c) {
  var vx = -b / (2 * a);
  var vy = a * vx * vx + b * vx + c;
  var D = b * b - 4 * a * c;

  var halfRange;
  if (D >= 0) {
    var spread = Math.sqrt(D) / Math.abs(a);
    halfRange = spread / 2 * 1.4;
  } else {
    var H = Math.max(Math.abs(vy) * 2, 10);
    halfRange = Math.sqrt(H / Math.abs(a));
  }
  halfRange = Math.max(halfRange, Math.abs(vx) * 0.1, 1);
  if (!isFinite(halfRange) || halfRange <= 0) halfRange = 5;
  halfRange *= 1.15;

  var xMin = vx - halfRange, xMax = vx + halfRange;
  var yEdge = a * halfRange * halfRange + vy;
  var yTop = Math.max(vy, yEdge), yBot = Math.min(vy, yEdge);
  var pad = (yTop - yBot) * 0.12;
  if (!(pad > 0)) pad = Math.max(Math.abs(yTop), 1) * 0.1;
  var yMin = yBot - pad, yMax = yTop + pad;
  if (!(yMax - yMin > 0)) { yMin -= 1; yMax += 1; }

  return { xMin: xMin, xMax: xMax, yMin: yMin, yMax: yMax, vx: vx, vy: vy, D: D };
}

function renderGraph(a, b, c, r) {
  var W = 480, H = 280;
  var view = computeGraphView(a, b, c);
  function mapX(x) { return (x - view.xMin) / (view.xMax - view.xMin) * W; }
  function mapY(y) { return H - (y - view.yMin) / (view.yMax - view.yMin) * H; }

  var N = 80, d = '';
  for (var i = 0; i <= N; i++) {
    var x = view.xMin + (view.xMax - view.xMin) * i / N;
    var y = a * x * x + b * x + c;
    d += (i === 0 ? 'M' : 'L') + mapX(x).toFixed(2) + ',' + mapY(y).toFixed(2) + ' ';
  }

  var parts = [];
  if (view.yMin <= 0 && view.yMax >= 0) {
    var y0 = mapY(0).toFixed(2);
    parts.push('<line x1="0" y1="' + y0 + '" x2="' + W + '" y2="' + y0 + '" stroke="#ddd1b8" stroke-width="1.5"/>');
  }
  if (view.xMin <= 0 && view.xMax >= 0) {
    var x0 = mapX(0).toFixed(2);
    parts.push('<line x1="' + x0 + '" y1="0" x2="' + x0 + '" y2="' + H + '" stroke="#ddd1b8" stroke-width="1.5"/>');
  }
  parts.push('<path d="' + d + '" fill="none" stroke="#c8922a" stroke-width="2.5"/>');

  var hasRealRoots = false;
  if (r.type === 'real') {
    hasRealRoots = true;
    parts.push('<circle cx="' + mapX(r.x1).toFixed(2) + '" cy="' + mapY(0).toFixed(2) + '" r="5" fill="#a3461c"/>');
    parts.push('<circle cx="' + mapX(r.x2).toFixed(2) + '" cy="' + mapY(0).toFixed(2) + '" r="5" fill="#a3461c"/>');
  } else if (r.type === 'double') {
    hasRealRoots = true;
    parts.push('<circle cx="' + mapX(r.x).toFixed(2) + '" cy="' + mapY(0).toFixed(2) + '" r="5" fill="#a3461c"/>');
  }
  parts.push('<circle cx="' + mapX(view.vx).toFixed(2) + '" cy="' + mapY(view.vy).toFixed(2) + '" r="5" fill="#1a1510"/>');

  document.getElementById('qfGraphSvg').innerHTML = parts.join('');
  document.getElementById('qfLegendRoots').style.display = hasRealRoots ? '' : 'none';
}

function initQuadraticTool() {
  var inputA = document.getElementById('qfA');
  var inputB = document.getElementById('qfB');
  var inputC = document.getElementById('qfC');
  var resultBox = document.getElementById('qfResult');
  var statusEl = document.getElementById('qfStatus');
  var rootsEl = document.getElementById('qfRoots');
  var graphEl = document.getElementById('qfGraph');

  function render() {
    var rawA = inputA.value, rawB = inputB.value, rawC = inputC.value;
    if (rawA.trim() === '' && rawB.trim() === '' && rawC.trim() === '') {
      resultBox.className = 'qf-result empty';
      return;
    }
    var a = parseCoef(rawA);
    var b = parseCoef(rawB);
    var c = parseCoef(rawC);

    if (a === null || b === null || c === null) {
      resultBox.className = 'qf-result';
      statusEl.innerHTML = '';
      rootsEl.innerHTML = '<div class="qf-error">Completează toți cei trei coeficienți (a, b, c) cu numere.</div>';
      return;
    }

    var r = solveQuadratic(a, b, c);
    resultBox.className = 'qf-result';
    graphEl.style.display = 'none';

    if (r.type === 'error') {
      statusEl.innerHTML = '';
      rootsEl.innerHTML = '<div class="qf-error">' + r.message + '</div>';
    } else if (r.type === 'no-solution') {
      statusEl.innerHTML = 'Cu a = 0 și b = 0, ecuația devine „' + fmt(c) + ' = 0”, ceea ce e fals.';
      rootsEl.innerHTML = '<div class="qf-roots">Nicio soluție.</div>';
    } else if (r.type === 'identity') {
      statusEl.innerHTML = 'Cu a = 0, b = 0 și c = 0, ecuația devine „0 = 0”, adevărat mereu.';
      rootsEl.innerHTML = '<div class="qf-roots">Orice număr x este soluție.</div>';
    } else if (r.type === 'linear') {
      statusEl.innerHTML =
        step('Cu a = 0, nu mai e o ecuație de gradul II, ci una liniară: ' + fmt(b) + 'x + (' + fmt(c) + ') = 0.') +
        step('x = −c/b = −' + fmtSigned(c) + '/' + fmtSigned(b) + ' = ' + fmt(r.x));
      rootsEl.innerHTML = '<div class="qf-roots">x = ' + fmt(r.x) + '</div>';
    } else if (r.type === 'double') {
      statusEl.innerHTML =
        step('Δ = b² − 4ac = ' + fmtSigned(b) + '² − 4·' + fmtSigned(a) + '·' + fmtSigned(c) + ' = ' + fmt(r.discriminant)) +
        step('Δ = 0 → o rădăcină dublă (reală).');
      rootsEl.innerHTML = '<div class="qf-roots">x₁ = x₂ = ' + fmt(r.x) + '</div>';
      graphEl.style.display = '';
      renderGraph(a, b, c, r);
    } else if (r.type === 'real') {
      statusEl.innerHTML =
        step('Δ = b² − 4ac = ' + fmtSigned(b) + '² − 4·' + fmtSigned(a) + '·' + fmtSigned(c) + ' = ' + fmt(r.discriminant)) +
        step('Δ = ' + fmt(r.discriminant) + ' &gt; 0 → două rădăcini reale distincte.');
      rootsEl.innerHTML = '<div class="qf-roots">x₁ = ' + fmt(r.x1) + '<br>x₂ = ' + fmt(r.x2) + '</div>';
      graphEl.style.display = '';
      renderGraph(a, b, c, r);
    } else if (r.type === 'complex') {
      statusEl.innerHTML =
        step('Δ = b² − 4ac = ' + fmtSigned(b) + '² − 4·' + fmtSigned(a) + '·' + fmtSigned(c) + ' = ' + fmt(r.discriminant)) +
        step('Δ = ' + fmt(r.discriminant) + ' &lt; 0 → nicio rădăcină reală, doar complexe.');
      rootsEl.innerHTML = '<div class="qf-roots">x₁ = ' + fmt(r.re) + ' + ' + fmt(r.im) + 'i<br>x₂ = ' + fmt(r.re) + ' − ' + fmt(r.im) + 'i</div>';
      graphEl.style.display = '';
      renderGraph(a, b, c, r);
    }
  }

  inputA.addEventListener('input', render);
  inputB.addEventListener('input', render);
  inputC.addEventListener('input', render);
}

// ---------- Convertor cifre arabe-romane ----------
var ROMAN_VALUES_TABLE = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

function toRoman(n) {
  if (!Number.isInteger(n) || n < 1 || n > 3999) {
    return { ok: false, message: 'Numărul trebuie să fie întreg, între 1 și 3999.' };
  }
  var result = '';
  var rest = n;
  for (var i = 0; i < ROMAN_VALUES_TABLE.length; i++) {
    var value = ROMAN_VALUES_TABLE[i][0], symbol = ROMAN_VALUES_TABLE[i][1];
    while (rest >= value) { result += symbol; rest -= value; }
  }
  return { ok: true, roman: result };
}

var ROMAN_RE = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
var ROMAN_SYMBOL_VALUES = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

function fromRoman(s) {
  var str = (s || '').trim().toUpperCase();
  if (str === '') return { ok: false, message: '' };
  if (!ROMAN_RE.test(str)) {
    return { ok: false, message: '„' + str + '” nu este o cifră romană validă.' };
  }
  var total = 0;
  for (var i = 0; i < str.length; i++) {
    var cur = ROMAN_SYMBOL_VALUES[str[i]];
    var next = i + 1 < str.length ? ROMAN_SYMBOL_VALUES[str[i + 1]] : 0;
    total += cur < next ? -cur : cur;
  }
  return { ok: true, value: total };
}

function initRomanTool() {
  var rcArabic = document.getElementById('rcArabic');
  var rcRoman = document.getElementById('rcRoman');
  var rcError = document.getElementById('rcError');

  function updateRomanFromArabic() {
    var raw = rcArabic.value.trim();
    if (raw === '') { rcRoman.value = ''; rcError.innerHTML = ''; return; }
    var n = Number(raw);
    var r = toRoman(n);
    if (r.ok) { rcRoman.value = r.roman; rcError.innerHTML = ''; }
    else { rcError.innerHTML = '<div class="qf-error">' + r.message + '</div>'; }
  }
  function updateArabicFromRoman() {
    var raw = rcRoman.value.trim();
    if (raw === '') { rcArabic.value = ''; rcError.innerHTML = ''; return; }
    var r = fromRoman(raw);
    if (r.ok) { rcArabic.value = String(r.value); rcError.innerHTML = ''; }
    else { rcError.innerHTML = r.message ? '<div class="qf-error">' + r.message + '</div>' : ''; }
  }
  rcArabic.addEventListener('input', updateRomanFromArabic);
  rcRoman.addEventListener('input', updateArabicFromRoman);
}

// ---------- Viteză, distanță, timp ----------
function solveSDT(d, t, v) {
  var filled = [d, t, v].filter(function (x) { return x !== null; }).length;
  if (filled !== 2) {
    return { ok: false, message: 'Completează exact două din cele trei câmpuri.' };
  }
  var vals = [d, t, v].filter(function (x) { return x !== null; });
  for (var i = 0; i < vals.length; i++) {
    if (!isFinite(vals[i])) return { ok: false, message: 'Valorile trebuie să fie numere.' };
    if (vals[i] <= 0) return { ok: false, message: 'Valorile trebuie să fie numere pozitive (mai mari ca 0).' };
  }
  if (d === null) return { ok: true, field: 'd', value: v * t };
  if (t === null) return { ok: true, field: 't', value: d / v };
  return { ok: true, field: 'v', value: d / t };
}

// ---------- Conversii de unități (distanță km/m, viteză km/h - m/s, timp h/min/s) ----------
function distanceToKm(value, unit) { return unit === 'm' ? value / 1000 : value; }
function kmToDistance(km, unit) { return unit === 'm' ? km * 1000 : km; }
function speedToKmh(value, unit) { return unit === 'm/s' ? value * 3.6 : value; }
function kmhToSpeed(kmh, unit) { return unit === 'm/s' ? kmh / 3.6 : kmh; }
function timeToHours(h, m, s) {
  if (h === null && m === null && s === null) return null;
  return (h || 0) + (m || 0) / 60 + (s || 0) / 3600;
}
function hoursToTime(hoursDecimal) {
  var totalSeconds = Math.round(hoursDecimal * 3600);
  var h = Math.floor(totalSeconds / 3600);
  var m = Math.floor((totalSeconds % 3600) / 60);
  var s = totalSeconds % 60;
  return { h: h, m: m, s: s };
}

function initSdtTool() {
  var sdtD = document.getElementById('sdtD');
  var sdtDUnit = document.getElementById('sdtDUnit');
  var sdtH = document.getElementById('sdtH');
  var sdtM = document.getElementById('sdtM');
  var sdtS = document.getElementById('sdtS');
  var sdtV = document.getElementById('sdtV');
  var sdtVUnit = document.getElementById('sdtVUnit');
  var resultBox = document.getElementById('sdtResult');
  var statusEl = document.getElementById('sdtStatus');

  function parseOrNull(str) {
    str = str.trim();
    if (str === '') return null;
    return Number(str.replace(',', '.'));
  }

  function render() {
    var dRaw = parseOrNull(sdtD.value);
    var hRaw = parseOrNull(sdtH.value);
    var mRaw = parseOrNull(sdtM.value);
    var sRaw = parseOrNull(sdtS.value);
    var vRaw = parseOrNull(sdtV.value);
    var dUnit = sdtDUnit.value, vUnit = sdtVUnit.value;

    var dProvided = dRaw !== null;
    var timeProvided = hRaw !== null || mRaw !== null || sRaw !== null;
    var vProvided = vRaw !== null;
    var filledCount = [dProvided, timeProvided, vProvided].filter(Boolean).length;

    if (filledCount === 0) { resultBox.className = 'qf-result empty'; return; }
    resultBox.className = 'qf-result';

    if (filledCount !== 2) {
      statusEl.innerHTML = '<div class="qf-error">Completează exact două din cele trei câmpuri (distanță, timp, viteză).</div>';
      return;
    }

    var rawVals = [dRaw, hRaw, mRaw, sRaw, vRaw].filter(function (x) { return x !== null; });
    for (var i = 0; i < rawVals.length; i++) {
      if (!isFinite(rawVals[i])) {
        statusEl.innerHTML = '<div class="qf-error">Valorile trebuie să fie numere.</div>';
        return;
      }
    }
    // componentele de timp nu pot fi negative individual (chiar dacă suma ar ieși pozitivă)
    if ((hRaw !== null && hRaw < 0) || (mRaw !== null && mRaw < 0) || (sRaw !== null && sRaw < 0)) {
      statusEl.innerHTML = '<div class="qf-error">Orele, minutele și secundele nu pot fi negative.</div>';
      return;
    }

    var dKm = dProvided ? distanceToKm(dRaw, dUnit) : null;
    var tHours = timeProvided ? timeToHours(hRaw, mRaw, sRaw) : null;
    var vKmh = vProvided ? speedToKmh(vRaw, vUnit) : null;

    var r = solveSDT(dKm, tHours, vKmh);
    if (!r.ok) {
      statusEl.innerHTML = '<div class="qf-error">' + r.message + '</div>';
      return;
    }

    if (r.field === 'd') {
      statusEl.innerHTML = '<div class="qf-roots">Distanța = ' + fmt(kmToDistance(r.value, dUnit)) + ' ' + dUnit + '</div>';
    } else if (r.field === 'v') {
      statusEl.innerHTML = '<div class="qf-roots">Viteza = ' + fmt(kmhToSpeed(r.value, vUnit)) + ' ' + vUnit + '</div>';
    } else {
      var t = hoursToTime(r.value);
      statusEl.innerHTML = '<div class="qf-roots">Timpul = ' + t.h + ' h ' + t.m + ' min ' + t.s + ' s</div>';
    }
  }

  sdtD.addEventListener('input', render);
  sdtH.addEventListener('input', render);
  sdtM.addEventListener('input', render);
  sdtS.addEventListener('input', render);
  sdtV.addEventListener('input', render);
  sdtDUnit.addEventListener('change', render);
  sdtVUnit.addEventListener('change', render);
}

// ---------- Teorema lui Pitagora ----------
// Primește catetele a, b și ipotenuza c (null = necunoscută). Calculează latura lipsă sau verifică un triunghi complet.
function solvePitagora(a, b, c) {
  var vals = [a, b, c];
  var filled = vals.filter(function (x) { return x !== null; }).length;
  if (vals.some(function (x) { return x !== null && !(x > 0); })) return { type: 'error', message: 'Lungimile trebuie să fie numere pozitive.' };
  if (filled < 2) return { type: 'incomplete' };
  if (filled === 3) {
    var diff = a * a + b * b - c * c;
    var ok = Math.abs(diff) <= 1e-9 * Math.max(c * c, 1);
    return { type: 'check', ok: ok, sum: a * a + b * b, c2: c * c };
  }
  if (c === null) return { type: 'c', c: Math.sqrt(a * a + b * b), a: a, b: b };
  var known = a !== null ? a : b;
  if (known >= c) return { type: 'error', message: 'Ipotenuza trebuie să fie mai lungă decât fiecare catetă.' };
  return { type: a === null ? 'a' : 'b', x: Math.sqrt(c * c - known * known), known: known, c: c };
}

function initPitagoraTool() {
  var inA = document.getElementById('ptA'), inB = document.getElementById('ptB'), inC = document.getElementById('ptC');
  var box = document.getElementById('ptResult'), stepsEl = document.getElementById('ptSteps'), outEl = document.getElementById('ptOut');
  function render() {
    if (inA.value.trim() === '' && inB.value.trim() === '' && inC.value.trim() === '') { box.className = 'qf-result empty'; return; }
    var r = solvePitagora(parseCoef(inA.value), parseCoef(inB.value), parseCoef(inC.value));
    box.className = 'qf-result';
    if (r.type === 'error') { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">' + r.message + '</div>'; return; }
    if (r.type === 'incomplete') { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">Completează oricare două laturi.</div>'; return; }
    if (r.type === 'check') {
      stepsEl.innerHTML = step('a² + b² = ' + fmt(r.sum)) + step('c² = ' + fmt(r.c2));
      outEl.innerHTML = '<div class="qf-roots">' + (r.ok ? 'a² + b² = c²: triunghiul <strong>este dreptunghic</strong>.' : 'a² + b² ≠ c²: triunghiul <strong>nu este dreptunghic</strong>.') + '</div>';
      return;
    }
    if (r.type === 'c') {
      stepsEl.innerHTML = step('c² = a² + b² = ' + fmt(r.a) + '² + ' + fmt(r.b) + '² = ' + fmt(r.a * r.a) + ' + ' + fmt(r.b * r.b) + ' = ' + fmt(r.a * r.a + r.b * r.b)) +
        step('c = √' + fmt(r.a * r.a + r.b * r.b));
      outEl.innerHTML = '<div class="qf-roots">c = ' + fmt(r.c) + '</div>';
      return;
    }
    var nume = r.type;
    stepsEl.innerHTML = step(nume + '² = c² − ' + (nume === 'a' ? 'b' : 'a') + '² = ' + fmt(r.c) + '² − ' + fmt(r.known) + '² = ' + fmt(r.c * r.c) + ' − ' + fmt(r.known * r.known) + ' = ' + fmt(r.c * r.c - r.known * r.known)) +
      step(nume + ' = √' + fmt(r.c * r.c - r.known * r.known));
    outEl.innerHTML = '<div class="qf-roots">' + nume + ' = ' + fmt(r.x) + '</div>';
  }
  [inA, inB, inC].forEach(function (el) { el.addEventListener('input', render); });
}

// ---------- Aria triunghiului (formula lui Heron) ----------
function solveHeron(a, b, c) {
  if (!(a > 0 && b > 0 && c > 0)) return { type: 'error', message: 'Laturile trebuie să fie numere pozitive.' };
  var max = Math.max(a, b, c);
  if (max >= a + b + c - max) return { type: 'error', message: 'Aceste lungimi nu formează un triunghi: cea mai lungă latură trebuie să fie mai mică decât suma celorlalte două.' };
  var s = (a + b + c) / 2;
  var p = s * (s - a) * (s - b) * (s - c);
  var x = [a, b, c].sort(function (u, v) { return u - v; });
  var d = x[0] * x[0] + x[1] * x[1] - x[2] * x[2];
  var tip = Math.abs(d) <= 1e-9 * x[2] * x[2] ? 'dreptunghic' : (d > 0 ? 'ascuțitunghic' : 'obtuzunghic');
  return { type: 'ok', s: s, produs: p, arie: Math.sqrt(p), tip: tip };
}

function initHeronTool() {
  var inA = document.getElementById('hrA'), inB = document.getElementById('hrB'), inC = document.getElementById('hrC');
  var box = document.getElementById('hrResult'), stepsEl = document.getElementById('hrSteps'), outEl = document.getElementById('hrOut');
  function render() {
    if (inA.value.trim() === '' && inB.value.trim() === '' && inC.value.trim() === '') { box.className = 'qf-result empty'; return; }
    var a = parseCoef(inA.value), b = parseCoef(inB.value), c = parseCoef(inC.value);
    box.className = 'qf-result';
    if (a === null || b === null || c === null) { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">Completează toate cele trei laturi.</div>'; return; }
    var r = solveHeron(a, b, c);
    if (r.type === 'error') { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">' + r.message + '</div>'; return; }
    stepsEl.innerHTML = step('Semiperimetrul: s = (a + b + c)/2 = (' + fmt(a) + ' + ' + fmt(b) + ' + ' + fmt(c) + ')/2 = ' + fmt(r.s)) +
      step('s(s−a)(s−b)(s−c) = ' + fmt(r.s) + '·' + fmt(r.s - a) + '·' + fmt(r.s - b) + '·' + fmt(r.s - c) + ' = ' + fmt(r.produs)) +
      step('S = √' + fmt(r.produs));
    outEl.innerHTML = '<div class="qf-roots">S = ' + fmt(r.arie) + '<br><small>Triunghiul este ' + r.tip + '.</small></div>';
  }
  [inA, inB, inC].forEach(function (el) { el.addEventListener('input', render); });
}

// ---------- CMMDC și CMMMC (algoritmul lui Euclid) ----------
function parseIntPos(str) {
  str = str.trim();
  if (!/^\d+$/.test(str)) return null;
  var n = Number(str);
  return n > 0 && n <= 1e12 ? n : null;
}

function solveCmmdc(a, b) {
  var x = Math.max(a, b), y = Math.min(a, b), pasi = [];
  while (y !== 0) {
    var q = Math.floor(x / y), r = x - q * y;
    pasi.push([x, q, y, r]);
    x = y; y = r;
  }
  var cmmdc = x;
  return { cmmdc: cmmdc, cmmmc: (a / cmmdc) * b, pasi: pasi };
}

function initCmmdcTool() {
  var inA = document.getElementById('cdA'), inB = document.getElementById('cdB');
  var box = document.getElementById('cdResult'), stepsEl = document.getElementById('cdSteps'), outEl = document.getElementById('cdOut');
  function render() {
    if (inA.value.trim() === '' && inB.value.trim() === '') { box.className = 'qf-result empty'; return; }
    var a = parseIntPos(inA.value), b = parseIntPos(inB.value);
    box.className = 'qf-result';
    if (a === null || b === null) { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">Scrie două numere naturale nenule (cel mult 1.000.000.000.000).</div>'; return; }
    var r = solveCmmdc(a, b);
    var html = step('Împărțim succesiv, până când restul devine 0 (algoritmul lui Euclid):');
    r.pasi.forEach(function (p) { html += step(p[0] + ' = ' + p[1] + ' · ' + p[2] + ' + ' + p[3]); });
    html += step('Ultimul rest nenul este cmmdc: ' + r.cmmdc + '.');
    html += step('cmmmc = a · b / cmmdc = ' + a + ' · ' + b + ' / ' + r.cmmdc + ' = ' + r.cmmmc);
    stepsEl.innerHTML = html;
    var safe = r.cmmmc <= 9007199254740991;
    outEl.innerHTML = '<div class="qf-roots">cmmdc(' + a + ', ' + b + ') = ' + r.cmmdc + '<br>cmmmc(' + a + ', ' + b + ')' + (safe ? ' = ' + r.cmmmc : ' ≈ ' + r.cmmmc.toExponential(6)) +
      (r.cmmdc === 1 ? '<br><small>Numerele sunt prime între ele.</small>' : '') + '</div>';
  }
  [inA, inB].forEach(function (el) { el.addEventListener('input', render); });
}

// ---------- Combinări, aranjamente, permutări ----------
// Calculează exact cât timp rezultatul încape în întregii sigur reprezentabili; altfel dă o aproximare prin logaritmi.
function logFact(n) { var s = 0; for (var i = 2; i <= n; i++) s += Math.log(i); return s; }
function fmtBig(logVal) {
  var e = Math.floor(logVal / Math.LN10), m = Math.exp(logVal - e * Math.LN10);
  if (m >= 9.9999995) { m = 1; e += 1; }
  return '≈ ' + fmt(Math.round(m * 1e6) / 1e6) + ' × 10<sup>' + e + '</sup>';
}
function exactOrApprox(prodFn, logVal) {
  if (logVal < Math.log(9007199254740991)) return String(prodFn());
  return fmtBig(logVal);
}

function solveCombinari(n, k) {
  if (k > n) return { type: 'error', message: 'k nu poate fi mai mare decât n.' };
  var kk = Math.min(k, n - k);
  var C = exactOrApprox(function () { var r = 1; for (var i = 1; i <= kk; i++) r = r * (n - kk + i) / i; return Math.round(r); },
    logFact(n) - logFact(k) - logFact(n - k));
  var A = exactOrApprox(function () { var r = 1; for (var i = n - k + 1; i <= n; i++) r *= i; return r; },
    logFact(n) - logFact(n - k));
  var P = exactOrApprox(function () { var r = 1; for (var i = 2; i <= n; i++) r *= i; return r; }, logFact(n));
  return { type: 'ok', C: C, A: A, P: P };
}

function initCombinariTool() {
  var inN = document.getElementById('cbN'), inK = document.getElementById('cbK');
  var box = document.getElementById('cbResult'), stepsEl = document.getElementById('cbSteps'), outEl = document.getElementById('cbOut');
  function render() {
    if (inN.value.trim() === '' && inK.value.trim() === '') { box.className = 'qf-result empty'; return; }
    var nS = inN.value.trim(), kS = inK.value.trim();
    box.className = 'qf-result';
    if (!/^\d+$/.test(nS) || !/^\d+$/.test(kS) || Number(nS) > 1000) {
      stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">Scrie două numere naturale, cu n de cel mult 1000.</div>'; return;
    }
    var n = Number(nS), k = Number(kS);
    var r = solveCombinari(n, k);
    if (r.type === 'error') { stepsEl.innerHTML = ''; outEl.innerHTML = '<div class="qf-error">' + r.message + '</div>'; return; }
    stepsEl.innerHTML = step('Combinări (ordinea nu contează): C(n,k) = n! / (k!·(n−k)!) = ' + n + '! / (' + k + '!·' + (n - k) + '!)') +
      step('Aranjamente (ordinea contează): A(n,k) = n! / (n−k)! = ' + n + '! / ' + (n - k) + '!') +
      step('Permutări (toate cele n elemente, în orice ordine): P(n) = n! = ' + n + '!');
    function eg(v) { return (v.charAt(0) === '≈' ? ' ' : ' = ') + v; }
    outEl.innerHTML = '<div class="qf-roots">C(' + n + ', ' + k + ')' + eg(r.C) + '<br>A(' + n + ', ' + k + ')' + eg(r.A) + '<br>P(' + n + ')' + eg(r.P) + '</div>';
  }
  [inN, inK].forEach(function (el) { el.addEventListener('input', render); });
}
