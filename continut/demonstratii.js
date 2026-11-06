// ∑ Teoreme - demonstrații și greșeli frecvente, pentru teoremele care au aceste secțiuni.
// Fișierul e folosit doar de scripts/build.js (nu se încarcă în browser).
// Fiecare intrare: demonstratie (HTML) și greseli (listă de texte HTML).

var DEMONSTRATII = {

"criteriul-dalembert": {
  demonstratie: `
<p>Fie aₙ &gt; 0 și L = lim aₙ₊₁/aₙ.</p>
<p><strong>Cazul L &lt; 1.</strong> Alegem un număr q cu L &lt; q &lt; 1. Pentru că rapoartele aₙ₊₁/aₙ se apropie de L, există un rang N de la care aₙ₊₁/aₙ ≤ q, adică aₙ₊₁ ≤ q·aₙ. Aplicând inegalitatea de mai multe ori:</p>
<p class="dem-formula">aₙ ≤ a_N · q<sup>n−N</sup> pentru orice n ≥ N.</p>
<p>Seria ∑ a_N·q<sup>n−N</sup> este o serie geometrică cu rația q &lt; 1, deci converge. Prin criteriul comparației, converge și ∑aₙ (primii N termeni nu schimbă natura seriei).</p>
<p><strong>Cazul L &gt; 1.</strong> Există un rang N de la care aₙ₊₁/aₙ ≥ 1, adică aₙ₊₁ ≥ aₙ. Șirul termenilor e crescător de la N încolo, deci aₙ ≥ a_N &gt; 0 și termenii nu tind la 0. O serie ai cărei termeni nu tind la 0 diverge.</p>
<p><strong>Cazul L = 1 nu decide.</strong> Pentru ∑1/n și pentru ∑1/n² raportul tinde la 1 în ambele cazuri, dar prima serie diverge, iar a doua converge.</p>`,
  greseli: [
    "<strong>Concluzia „diverge” când L = 1.</strong> L = 1 nu spune nimic; folosește alt criteriu (comparație, Raabe-Duhamel, criteriul integral).",
    "<strong>Termeni de semne diferite fără modul.</strong> Pentru serii cu termeni oarecare se aplică criteriul lui |aₙ₊₁/aₙ| și se obține convergența absolută; pentru L &gt; 1 seria diverge, iar pentru L = 1 nu se poate trage nicio concluzie.",
    "<strong>Raportul inversat.</strong> Se calculează aₙ₊₁/aₙ (termenul următor supra cel curent), nu aₙ/aₙ₊₁; inversarea schimbă concluzia.",
    "<strong>Simplificarea greșită a factorialelor.</strong> (n+1)!/n! = n+1, iar n!/(n+1)! = 1/(n+1); la puteri, aⁿ⁺¹/aⁿ = a.",
    "<strong>Limita nu există.</strong> Dacă raportul oscilează, criteriul în forma de mai sus nu se aplică direct; se folosește varianta cu limita superioară (lim sup)."
  ]
},

"teorema-lui-weierstrass-functii-continue": {
  demonstratie: `
<p>Demonstrația are doi pași și folosește teorema Bolzano–Weierstrass: orice șir mărginit de numere reale are un subșir convergent.</p>
<p><strong>Pasul 1: f este mărginită.</strong> Presupunem că nu. Atunci pentru fiecare n există xₙ ∈ [a,b] cu |f(xₙ)| &gt; n. Șirul (xₙ) e mărginit (stă în [a,b]), deci are un subșir x<sub>n<sub>k</sub></sub> → c. Cum [a,b] e închis, c ∈ [a,b]. Din continuitate, f(x<sub>n<sub>k</sub></sub>) → f(c), un număr finit; dar |f(x<sub>n<sub>k</sub></sub>)| &gt; n<sub>k</sub> → ∞. Contradicție.</p>
<p><strong>Pasul 2: marginea superioară este atinsă.</strong> Fie M = sup f(x) pe [a,b], finit după pasul 1. Pentru fiecare n există xₙ cu f(xₙ) &gt; M − 1/n. Din nou, un subșir converge la un c ∈ [a,b], iar din continuitate f(c) = lim f(x<sub>n<sub>k</sub></sub>) ≥ M. Cum f(c) ≤ M, rezultă f(c) = M: maximul este atins în c.</p>
<p><strong>Minimul</strong> se obține aplicând același raționament funcției −f.</p>`,
  greseli: [
    "<strong>Interval deschis.</strong> f(x) = 1/x pe (0,1] e continuă, dar nemărginită; f(x) = x pe (0,1) nu își atinge nici minimul, nici maximul.",
    "<strong>Funcție discontinuă.</strong> f(x) = x pe [0,1) și f(1) = 0 are supremul 1, dar nu îl atinge nicăieri.",
    "<strong>Interval nemărginit.</strong> arctg x pe ℝ e continuă și mărginită, dar nu își atinge marginile ±π/2.",
    "<strong>„Mărginită” nu înseamnă „își atinge extremele”.</strong> Teorema spune mai mult decât mărginirea: există puncte în care valorile extreme sunt chiar luate.",
    "<strong>Teorema nu spune unde sunt extremele.</strong> Ca să le găsești, compari valorile în punctele critice (f′ = 0 sau f′ nu există) și în capetele a și b."
  ]
},

"inegalitatea-mediilor-am-gm": {
  demonstratie: `
<p><strong>Cazul a două numere.</strong> Pentru a, b &gt; 0:</p>
<p class="dem-formula">0 ≤ (√a − √b)² = a − 2√(ab) + b, deci (a + b)/2 ≥ √(ab),</p>
<p>cu egalitate exact când √a = √b, adică a = b.</p>
<p><strong>Cazul general, prin concavitatea logaritmului.</strong> Funcția ln este concavă pe (0, ∞), deci, după inegalitatea lui Jensen pentru funcții concave:</p>
<p class="dem-formula">ln((a₁ + … + aₙ)/n) ≥ (ln a₁ + … + ln aₙ)/n = ln ⁿ√(a₁·…·aₙ).</p>
<p>Cum ln este crescătoare, rezultă (a₁ + … + aₙ)/n ≥ ⁿ√(a₁·…·aₙ). Pentru că ln este strict concavă, egalitatea are loc doar când toate numerele sunt egale.</p>
<p><strong>Varianta lui Cauchy (fără analiză).</strong> Din cazul n = 2 se obține, prin dublare repetată, inegalitatea pentru n = 4, 8, …, 2ᵏ. Pentru un n oarecare se completează lista până la o putere a lui 2 cu termeni egali cu media aritmetică, ceea ce nu schimbă media și dă inegalitatea pentru n.</p>`,
  greseli: [
    "<strong>Numere negative.</strong> Inegalitatea cere numere pozitive: pentru −1 și −4, media aritmetică e −2,5, iar √((−1)(−4)) = 2.",
    "<strong>Minim fără caz de egalitate.</strong> Când folosești AM–GM ca să afli un minim, verifică dacă egalitatea (toate numerele egale) se poate atinge; altfel minimul real e mai mare.",
    "<strong>Produsul nu e constant.</strong> Pentru a minimiza o sumă cu AM–GM, produsul termenilor trebuie să fie constant (sau invers, pentru maximizarea produsului, suma).",
    "<strong>Rădăcina greșită.</strong> Pentru n numere media geometrică este rădăcina de ordinul n a produsului, nu rădăcina pătrată."
  ]
},

"descompunerea-in-fractii-simple": {
  demonstratie: `
<p>Schițăm demonstrația existenței pentru cazul în care Q are rădăcini reale (rădăcinile complexe se tratează la fel, grupate în factori de gradul 2).</p>
<p><strong>Pasul de bază.</strong> Fie r o rădăcină a lui Q de multiplicitate m: Q(x) = (x − r)<sup>m</sup>·R(x), cu R(r) ≠ 0. Alegem A = P(r)/R(r). Atunci:</p>
<p class="dem-formula">P(x)/Q(x) − A/(x − r)<sup>m</sup> = [P(x) − A·R(x)] / [(x − r)<sup>m</sup>·R(x)].</p>
<p>Numărătorul P(x) − A·R(x) se anulează în x = r, deci se divide cu (x − r). După simplificare rămâne o fracție cu numitorul (x − r)<sup>m−1</sup>·R(x), de grad mai mic, iar gradul numărătorului rămâne mai mic decât al numitorului.</p>
<p><strong>Repetarea pasului.</strong> Aplicăm același pas până când factorul (x − r) dispare din numitor, apoi trecem la următoarea rădăcină. La fiecare pas gradul numitorului scade, deci procedeul se oprește, iar ce s-a extras formează exact suma de fracții simple.</p>
<p><strong>Unicitatea.</strong> Dacă două descompuneri ar fi diferite, diferența lor ar fi o sumă nenulă de fracții simple egală cu 0; înmulțind cu Q și comparând comportamentul lângă fiecare rădăcină, se obține că toți coeficienții coincid.</p>`,
  greseli: [
    "<strong>Grad(P) ≥ grad(Q).</strong> Mai întâi împarți polinoamele: P/Q = câtul + rest/Q, și descompui doar rest/Q.",
    "<strong>Rădăcină multiplă scrisă o singură dată.</strong> Pentru (x − a)² în numitor sunt necesari doi termeni: A/(x − a) + B/(x − a)².",
    "<strong>Factor de gradul 2 cu numărător constant.</strong> Un factor ireductibil x² + px + q cere numărător de forma Bx + C, nu doar o constantă.",
    "<strong>Factorizare incompletă.</strong> x² − 1 nu e ireductibil: (x − 1)(x + 1). Factorizează complet numitorul înainte de descompunere.",
    "<strong>Fără verificare.</strong> Adună la loc fracțiile obținute (sau dă o valoare lui x): e cel mai rapid mod de a prinde o greșeală de semn."
  ]
},

"teorema-punctului-fix-banach": {
  demonstratie: `
<p>Fie f : X → X o contracție, d(f(x), f(y)) ≤ q·d(x, y) cu 0 ≤ q &lt; 1, și șirul xₙ₊₁ = f(xₙ), pornind din x₀.</p>
<p><strong>Șirul este Cauchy.</strong> Din condiția de contracție, d(xₙ₊₁, xₙ) ≤ qⁿ·d(x₁, x₀). Pentru m &gt; n, din inegalitatea triunghiului:</p>
<p class="dem-formula">d(xₘ, xₙ) ≤ (qⁿ + qⁿ⁺¹ + … + q<sup>m−1</sup>)·d(x₁, x₀) ≤ qⁿ/(1 − q) · d(x₁, x₀),</p>
<p>care tinde la 0 când n → ∞.</p>
<p><strong>Limita este punct fix.</strong> X fiind complet, xₙ → x* ∈ X. O contracție este continuă, deci f(x*) = lim f(xₙ) = lim xₙ₊₁ = x*.</p>
<p><strong>Unicitatea.</strong> Dacă și f(y) = y, atunci d(x*, y) = d(f(x*), f(y)) ≤ q·d(x*, y). Cum q &lt; 1, rezultă d(x*, y) = 0, adică y = x*.</p>
<p><strong>Bonus: viteza de convergență.</strong> Trecând la limită în estimarea de mai sus: d(xₙ, x*) ≤ qⁿ/(1 − q) · d(x₁, x₀).</p>`,
  greseli: [
    "<strong>„Strict mai mic” în loc de q &lt; 1.</strong> d(f(x), f(y)) &lt; d(x, y) nu ajunge: f(x) = x + 1/x pe [1, ∞) apropie punctele, dar nu are punct fix.",
    "<strong>Spațiu incomplet.</strong> f(x) = x/2 pe (0, 1] e contracție, dar punctul fix 0 nu aparține spațiului.",
    "<strong>f nu rămâne în spațiu.</strong> Teorema cere f : X → X; dacă imaginea iese din X, iterațiile nu mai sunt definite.",
    "<strong>Constanta depinde de punct.</strong> Constanta q trebuie să fie aceeași pentru toate perechile x, y; o derivată cu |f′| &lt; 1, dar care se apropie de 1, nu garantează o contracție."
  ]
},

"teorema-heine-borel": {
  demonstratie: `
<p>O mulțime K este compactă dacă din orice acoperire a ei cu mulțimi deschise se poate extrage o subacoperire finită.</p>
<p><strong>Compact ⇒ mărginit.</strong> Bilele deschise B(0, k), k = 1, 2, …, acoperă ℝⁿ, deci și K. O subacoperire finită înseamnă că K stă într-o singură bilă B(0, k).</p>
<p><strong>Compact ⇒ închis.</strong> Fie p ∉ K. Mulțimile Uₖ = {x : |x − p| &gt; 1/k} acoperă K. O subacoperire finită dă un k cu K ⊂ Uₖ, deci bila B(p, 1/k) nu intersectează K. Așadar complementul lui K e deschis.</p>
<p><strong>Închis și mărginit ⇒ compact.</strong> K stă într-un cub C = [−R, R]ⁿ. Arătăm întâi că C e compact: dacă o acoperire a lui C nu ar avea subacoperire finită, împărțim C în 2ⁿ cuburi egale; măcar unul nu poate fi acoperit finit. Repetând, obținem cuburi incluse unul în altul, cu latura tinzând la 0, care se strâng spre un punct p. Punctul p se află într-o mulțime deschisă U a acoperirii, iar cuburile suficient de mici din jurul lui p intră complet în U: sunt acoperite de o singură mulțime. Contradicție.</p>
<p>În final, K e închis în C, iar o submulțime închisă a unei mulțimi compacte este compactă: la o acoperire a lui K adăugăm complementul deschis al lui K și obținem o acoperire a lui C.</p>`,
  greseli: [
    "<strong>În afara lui ℝⁿ teorema nu mai e adevărată.</strong> În spațiul ℓ² (dimensiune infinită), bila unitate închisă e închisă și mărginită, dar nu e compactă.",
    "<strong>Definiția compacității inversată.</strong> Nu ajunge să existe o acoperire finită; trebuie ca orice acoperire deschisă să aibă o subacoperire finită.",
    "<strong>Doar una dintre condiții.</strong> (0, 1] e mărginită, dar nu e închisă; ℕ e închisă, dar nu e mărginită. Niciuna nu e compactă.",
    "<strong>Mărginit ca „are un maxim”.</strong> Mărginit înseamnă inclus într-o bilă; (0, 1) e mărginit chiar dacă nu are maxim."
  ]
},

"inegalitatea-lui-jensen": {
  demonstratie: `
<p>Fie φ convexă și μ = E[X], finit.</p>
<p><strong>Dreapta de sprijin.</strong> O funcție convexă stă deasupra unei drepte care o atinge în orice punct dat: există un număr c (de exemplu panta tangentei, dacă φ e derivabilă în μ) astfel încât</p>
<p class="dem-formula">φ(x) ≥ φ(μ) + c·(x − μ) pentru orice x.</p>
<p><strong>Media.</strong> Punem x = X și luăm media în ambele părți. Media păstrează inegalitățile și e liniară:</p>
<p class="dem-formula">E[φ(X)] ≥ φ(μ) + c·(E[X] − μ) = φ(μ) = φ(E[X]).</p>
<p><strong>Forma cu ponderi.</strong> Pentru o variabilă care ia valorile x₁, …, xₙ cu probabilitățile p₁, …, pₙ, inegalitatea devine φ(p₁x₁ + … + pₙxₙ) ≤ p₁φ(x₁) + … + pₙφ(xₙ).</p>
<p><strong>Pentru φ concavă</strong> inegalitatea se inversează (se aplică rezultatul funcției −φ).</p>`,
  greseli: [
    "<strong>Sensul pentru funcții concave.</strong> Pentru φ concavă (de exemplu ln sau √), inegalitatea este φ(E[X]) ≥ E[φ(X)].",
    "<strong>„Media funcției = funcția mediei”.</strong> În general E[X²] ≠ (E[X])² și E[1/X] ≠ 1/E[X]; Jensen spune în ce sens diferă.",
    "<strong>Media nu există.</strong> Inegalitatea cere ca E[X] (și E[φ(X)]) să fie finite.",
    "<strong>Egalitatea.</strong> Pentru φ strict convexă, egalitate are loc doar dacă X este constantă (cu probabilitate 1)."
  ]
},

"inegalitatea-lui-chebyshev": {
  demonstratie: `
<p>Fie X cu media μ și varianța σ² &gt; 0 finită, și k &gt; 0. Notăm cu A evenimentul |X − μ| ≥ kσ.</p>
<p><strong>Se pornește de la definiția varianței</strong> și se păstrează doar partea în care se produce A (termenii lăsați deoparte sunt pozitivi):</p>
<p class="dem-formula">σ² = E[(X − μ)²] ≥ E[(X − μ)²·1<sub>A</sub>].</p>
<p><strong>Pe A</strong> avem (X − μ)² ≥ k²σ², deci:</p>
<p class="dem-formula">E[(X − μ)²·1<sub>A</sub>] ≥ k²σ²·P(A).</p>
<p><strong>Concluzia.</strong> Rezultă σ² ≥ k²σ²·P(A), adică P(|X − μ| ≥ kσ) ≤ 1/k².</p>
<p>Aceeași inegalitate se obține aplicând inegalitatea lui Markov variabilei pozitive (X − μ)².</p>`,
  greseli: [
    "<strong>k ≤ 1.</strong> Pentru k ≤ 1 marginea 1/k² e cel puțin 1, deci nu spune nimic util.",
    "<strong>Confuzie cu regula 68–95–99,7.</strong> Regula aceea e valabilă doar pentru distribuția normală; Cebîșev e valabil pentru orice distribuție, dar e mult mai slab (de exemplu 1/4 = 25% pentru k = 2, față de aproximativ 5% la normală).",
    "<strong>Varianță infinită.</strong> Inegalitatea cere varianță finită.",
    "<strong>O singură coadă.</strong> Marginea 1/k² e pentru ambele cozi împreună (|X − μ| ≥ kσ), nu doar pentru X ≥ μ + kσ.",
    "<strong>kσ confundat cu k.</strong> Abaterea se măsoară în deviații standard: pentru σ = 5 și o abatere de 20, k = 4, nu 20."
  ]
},

"teorema-lui-baire": {
  demonstratie: `
<p>Fie (X, d) complet și U₁, U₂, … deschise și dense. Arătăm că orice mulțime deschisă nevidă W intersectează ⋂Uₙ; asta înseamnă exact că intersecția este densă.</p>
<p><strong>Primul pas.</strong> U₁ e densă, deci W ∩ U₁ e deschisă și nevidă. Alegem o bilă închisă B̄(x₁, r₁) ⊂ W ∩ U₁, cu r₁ &lt; 1.</p>
<p><strong>Pasul n.</strong> Uₙ e densă, deci B(xₙ₋₁, rₙ₋₁) ∩ Uₙ e deschisă și nevidă. Alegem B̄(xₙ, rₙ) inclusă în ea, cu rₙ &lt; 1/n.</p>
<p><strong>Limita.</strong> Bilele sunt incluse una în alta, deci pentru m &gt; n, xₘ ∈ B̄(xₙ, rₙ) și d(xₘ, xₙ) ≤ rₙ &lt; 1/n. Șirul (xₙ) e Cauchy și, X fiind complet, are o limită x. Pentru fiecare n, toți termenii de la n încolo stau în bila închisă B̄(xₙ, rₙ), deci și x stă în ea.</p>
<p><strong>Concluzia.</strong> Rezultă x ∈ W și x ∈ Uₙ pentru orice n, adică W ∩ ⋂Uₙ ≠ ∅.</p>`,
  greseli: [
    "<strong>Dense, dar nu deschise.</strong> ℚ și mulțimea iraționalelor sunt amândouă dense în ℝ, dar intersecția lor e vidă; ℚ nu e deschisă, deci teorema nu se aplică.",
    "<strong>Spațiu incomplet.</strong> În ℚ, mulțimile Uₙ = ℚ \\ {qₙ} (unde q₁, q₂, … enumeră raționalele) sunt deschise și dense, dar intersecția lor e vidă.",
    "<strong>Intersecții nenumărabile.</strong> Teorema e despre familii numărabile; intersecția mulțimilor ℝ \\ {x}, pentru toți x reali, este vidă.",
    "<strong>„Nicăieri densă” confundat cu „are interior vid”.</strong> O mulțime e nicăieri densă dacă închiderea ei are interior vid; ℚ are interior vid, dar nu e nicăieri densă (închiderea ei e ℝ)."
  ]
}

};
