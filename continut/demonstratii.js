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
},

"suma-patratelor-primelor-n-numere": {
  demonstratie: `
<p>Notăm S = 1² + 2² + … + n². Pornim de la identitatea, valabilă pentru orice k:</p>
<p class="dem-formula">(k + 1)³ − k³ = 3k² + 3k + 1.</p>
<p><strong>Adunăm pentru k = 1, 2, …, n.</strong> În stânga termenii se reduc doi câte doi (2³ − 1³ + 3³ − 2³ + …), rămânând (n + 1)³ − 1. În dreapta obținem 3S + 3·(1 + 2 + … + n) + n:</p>
<p class="dem-formula">(n + 1)³ − 1 = 3S + 3·n(n + 1)/2 + n.</p>
<p><strong>Izolăm S.</strong> Cum (n + 1)³ − 1 − n = (n + 1)³ − (n + 1) = n(n + 1)(n + 2), avem:</p>
<p class="dem-formula">3S = n(n + 1)(n + 2) − 3n(n + 1)/2 = n(n + 1)(2n + 4 − 3)/2 = n(n + 1)(2n + 1)/2,</p>
<p>deci S = n(n + 1)(2n + 1)/6.</p>
<p><strong>Verificare prin inducție.</strong> Pentru n = 1: 1·2·3/6 = 1. Dacă formula e adevărată pentru n, atunci n(n + 1)(2n + 1)/6 + (n + 1)² = (n + 1)(2n² + 7n + 6)/6 = (n + 1)(n + 2)(2n + 3)/6, adică exact formula pentru n + 1.</p>`,
  greseli: [
    "<strong>Confuzie cu pătratul sumei.</strong> 1² + 2² + … + n² nu este (1 + 2 + … + n)². Pentru n = 3: 1 + 4 + 9 = 14, dar (1 + 2 + 3)² = 36.",
    "<strong>Împărțirea la 6 uitată.</strong> Pentru n = 10, n(n + 1)(2n + 1) = 2310, iar suma este 2310/6 = 385.",
    "<strong>Suma nu pornește de la 1.</strong> Pentru 5² + 6² + … + 10² scazi din suma până la 10 suma până la 4: 385 − 30 = 355.",
    "<strong>Formula cuburilor folosită greșit.</strong> [n(n + 1)/2]² este suma cuburilor, nu a pătratelor."
  ]
},

"teorema-bisectoarei": {
  demonstratie: `
<p>Fie AD bisectoarea unghiului A, cu D pe BC, și α = A/2 fiecare dintre cele două unghiuri egale formate.</p>
<p><strong>Comparăm ariile în două feluri.</strong> Triunghiurile ABD și ACD au aceeași înălțime din A pe dreapta BC, deci raportul ariilor lor este raportul bazelor:</p>
<p class="dem-formula">Aria(ABD) / Aria(ACD) = BD / DC.</p>
<p>Pe de altă parte, cu formula ariei cu sinus, folosind unghiurile egale de la A:</p>
<p class="dem-formula">Aria(ABD) / Aria(ACD) = (½·AB·AD·sin α) / (½·AC·AD·sin α) = AB / AC.</p>
<p><strong>Concluzia.</strong> Cele două rapoarte sunt egale, deci BD/DC = AB/AC.</p>
<p><strong>Consecință utilă.</strong> Cu notațiile a = BC, b = AC, c = AB, rezultă BD = a·c/(b + c) și DC = a·b/(b + c).</p>`,
  greseli: [
    "<strong>Rapoarte inversate.</strong> Segmentul de lângă B corespunde laturii din B: BD/DC = AB/AC, nu AC/AB.",
    "<strong>Bisectoarea confundată cu mediana.</strong> Bisectoarea împarte latura opusă la mijloc doar dacă AB = AC (triunghi isoscel).",
    "<strong>Laturi care nu formează un triunghi.</strong> Verifică inegalitatea triunghiului înainte de calcul: cu AB = 6, AC = 4, BC = 10 nu există triunghi.",
    "<strong>Bisectoarea exterioară.</strong> Bisectoarea unghiului exterior împarte latura opusă tot în raportul AB/AC, dar în exterior, pe prelungirea lui BC."
  ]
},

"suma-cuburilor-primelor-n-numere": {
  demonstratie: `
<p><strong>Prin inducție.</strong> Pentru n = 1: 1³ = 1 = (1·2/2)². Presupunem că 1³ + … + n³ = [n(n + 1)/2]². Atunci:</p>
<p class="dem-formula">[n(n + 1)/2]² + (n + 1)³ = (n + 1)²·(n²/4 + n + 1) = (n + 1)²(n + 2)²/4 = [(n + 1)(n + 2)/2]²,</p>
<p>adică formula pentru n + 1.</p>
<p><strong>O demonstrație „cu numere impare”, a lui Nicomachus.</strong> Scriem numerele impare în rânduri: 1 | 3 + 5 | 7 + 9 + 11 | … Rândul k are k numere, iar suma lor este k³ (de exemplu 3 + 5 = 8 = 2³, 7 + 9 + 11 = 27 = 3³). Primele n rânduri conțin, în total, primele 1 + 2 + … + n = n(n + 1)/2 numere impare, iar suma primelor m numere impare este m². Deci 1³ + … + n³ = [n(n + 1)/2]².</p>`,
  greseli: [
    "<strong>Pătratul uitat.</strong> Suma cuburilor este pătratul sumei 1 + 2 + … + n, nu suma însăși: pentru n = 3, 1 + 8 + 27 = 36 = 6².",
    "<strong>Confuzie cu suma pătratelor.</strong> Formula n(n + 1)(2n + 1)/6 este pentru pătrate, nu pentru cuburi.",
    "<strong>Ridicarea la pătrat greșită.</strong> [n(n + 1)/2]² = n²(n + 1)²/4, nu n²(n + 1)/4."
  ]
},

"teorema-medianei-in-triunghi": {
  demonstratie: `
<p>Fie M mijlocul lui BC, deci BM = MC = a/2, AM = mₐ, iar θ unghiul AMB. Unghiul AMC este suplementar, deci cos(AMC) = −cos θ.</p>
<p><strong>Legea cosinusurilor în cele două triunghiuri:</strong></p>
<p class="dem-formula">c² = mₐ² + a²/4 − 2·mₐ·(a/2)·cos θ (în triunghiul ABM),<br>b² = mₐ² + a²/4 + 2·mₐ·(a/2)·cos θ (în triunghiul ACM).</p>
<p><strong>Adunăm.</strong> Termenii cu cos θ se reduc:</p>
<p class="dem-formula">b² + c² = 2mₐ² + a²/2, deci mₐ² = (2b² + 2c² − a²)/4.</p>
<p>Relația se mai numește și teorema lui Apollonius.</p>`,
  greseli: [
    "<strong>Latura greșită cu minus.</strong> Cu semnul minus apare latura pe care cade mediana (a, pentru mediana din A), nu una dintre celelalte două.",
    "<strong>Radicalul uitat.</strong> Formula dă mₐ²; lungimea medianei este √((2b² + 2c² − a²)/4).",
    "<strong>Mediana confundată cu bisectoarea sau înălțimea.</strong> Ele coincid doar în triunghiul isoscel, pentru vârful dintre laturile egale.",
    "<strong>Centrul de greutate.</strong> G împarte mediana în raportul 2:1 de la vârf: AG = 2mₐ/3, nu jumătate."
  ]
},

"aria-trapezului": {
  demonstratie: `
<p>Fie trapezul ABCD cu bazele paralele AB = a și CD = b, iar h distanța dintre ele (înălțimea).</p>
<p><strong>Tăiem trapezul cu diagonala AC.</strong> Se formează două triunghiuri:</p>
<ul>
<li>ABC, cu baza AB = a și înălțimea h (distanța de la C la dreapta AB);</li>
<li>ACD, cu baza CD = b și aceeași înălțime h (distanța de la A la dreapta CD).</li>
</ul>
<p><strong>Adunăm ariile:</strong></p>
<p class="dem-formula">S = a·h/2 + b·h/2 = (a + b)·h/2.</p>
<p><strong>Altă privire.</strong> Două trapeze identice, unul întors, alăturate formează un paralelogram cu baza a + b și înălțimea h; trapezul este jumătate din el.</p>`,
  greseli: [
    "<strong>Latura oblică în loc de înălțime.</strong> h este distanța perpendiculară dintre baze, nu lungimea laturii neparalele.",
    "<strong>Împărțirea la 2 uitată.</strong> (a + b)·h este aria paralelogramului dublu, nu a trapezului.",
    "<strong>Baze care nu sunt paralele.</strong> Formula folosește cele două laturi paralele; în trapez, laturile oblice nu sunt baze.",
    "<strong>Unități amestecate.</strong> Bazele și înălțimea trebuie să fie în aceeași unitate de măsură (de exemplu toate în cm)."
  ]
},

"formula-lui-taylor": {
  demonstratie: `
<p>Demonstrăm formula cu restul lui Lagrange: dacă f este derivabilă de n + 1 ori, atunci există c între a și x cu</p>
<p class="dem-formula">Rₙ = f⁽ⁿ⁺¹⁾(c)·(x − a)ⁿ⁺¹/(n + 1)!.</p>
<p><strong>Funcția ajutătoare.</strong> Fixăm x ≠ a și definim, pentru t între a și x:</p>
<p class="dem-formula">g(t) = f(x) − ∑<sub>k=0</sub><sup>n</sup> f⁽ᵏ⁾(t)·(x − t)ᵏ/k! − K·(x − t)ⁿ⁺¹/(n + 1)!,</p>
<p>unde constanta K este aleasă astfel încât g(a) = 0. Evident și g(x) = 0.</p>
<p><strong>Derivata se simplifică.</strong> La derivarea sumei, termenii se reduc doi câte doi și rămâne doar ultimul:</p>
<p class="dem-formula">g′(t) = −f⁽ⁿ⁺¹⁾(t)·(x − t)ⁿ/n! + K·(x − t)ⁿ/n!.</p>
<p><strong>Rolle.</strong> Cum g(a) = g(x) = 0, există c strict între a și x cu g′(c) = 0, adică K = f⁽ⁿ⁺¹⁾(c). Din g(a) = 0 rezultă exact formula lui Taylor cu restul de mai sus.</p>`,
  greseli: [
    "<strong>k! uitat.</strong> Coeficientul lui (x − a)ᵏ este f⁽ᵏ⁾(a)/k!, nu f⁽ᵏ⁾(a). De exemplu, pentru eˣ, termenul de gradul 3 este x³/6.",
    "<strong>Derivatele calculate în x în loc de a.</strong> Coeficienții folosesc derivatele în punctul de dezvoltare a.",
    "<strong>„Seria Taylor converge mereu la funcție”.</strong> Fals: f(x) = e^(−1/x²), cu f(0) = 0, are toate derivatele 0 în 0, deci seria ei e 0, deși f nu e 0.",
    "<strong>Raza de convergență ignorată.</strong> Seria lui 1/(1 + x²) în jurul lui 0 converge doar pentru |x| &lt; 1, deși funcția e definită peste tot.",
    "<strong>Punctul c considerat cunoscut.</strong> În restul lui Lagrange c nu se află; se folosește doar pentru a mărgini eroarea (de exemplu |sin⁽ⁿ⁺¹⁾(c)| ≤ 1)."
  ]
},

"formula-lui-euler-eipi": {
  demonstratie: `
<p>Identitatea este cazul θ = π al formulei lui Euler, e^(iθ) = cos θ + i·sin θ, pe care o obținem din serii de puteri.</p>
<p><strong>Seriile cunoscute</strong>, valabile pentru orice număr real sau complex:</p>
<p class="dem-formula">eᶻ = 1 + z + z²/2! + z³/3! + …<br>cos θ = 1 − θ²/2! + θ⁴/4! − …<br>sin θ = θ − θ³/3! + θ⁵/5! − …</p>
<p><strong>Punem z = iθ.</strong> Puterile lui i se repetă: i² = −1, i³ = −i, i⁴ = 1. Grupând separat termenii reali și cei cu i (lucru permis, pentru că seria converge absolut):</p>
<p class="dem-formula">e^(iθ) = (1 − θ²/2! + θ⁴/4! − …) + i·(θ − θ³/3! + θ⁵/5! − …) = cos θ + i·sin θ.</p>
<p><strong>Pentru θ = π:</strong> e^(iπ) = cos π + i·sin π = −1 + 0·i = −1, deci e^(iπ) + 1 = 0.</p>`,
  greseli: [
    "<strong>e^(iπ) tratat ca o putere reală.</strong> Un exponent imaginar nu „mărește” numărul: e^(iθ) e un punct pe cercul unitate, la unghiul θ.",
    "<strong>Unghiul în grade.</strong> În formula lui Euler θ este în radiani: e^(i·180) nu este −1.",
    "<strong>Logaritmul complex considerat unic.</strong> Cum e^(2πi) = 1, ecuația eᶻ = 1 are infinit de soluții (z = 2kπi); logaritmul complex are mai multe valori.",
    "<strong>Modulul.</strong> |e^(iθ)| = 1 pentru orice θ real; doar partea reală a exponentului schimbă mărimea numărului."
  ]
},

"limita-lui-e": {
  demonstratie: `
<p>Fie eₙ = (1 + 1/n)ⁿ. Arătăm că șirul e crescător și mărginit, deci convergent, și că limita lui este ∑1/k!.</p>
<p><strong>Dezvoltarea cu binomul lui Newton:</strong></p>
<p class="dem-formula">eₙ = ∑<sub>k=0</sub><sup>n</sup> C(n,k)/nᵏ = ∑<sub>k=0</sub><sup>n</sup> (1/k!)·(1 − 1/n)(1 − 2/n)…(1 − (k−1)/n).</p>
<p><strong>Crescător.</strong> Când n crește, fiecare factor (1 − j/n) crește, iar suma primește termeni noi, pozitivi. Deci eₙ &lt; eₙ₊₁.</p>
<p><strong>Mărginit.</strong> Fiecare produs de paranteze e cel mult 1, iar k! ≥ 2ᵏ⁻¹, deci eₙ ≤ ∑1/k! ≤ 1 + 1 + 1/2 + 1/4 + … = 3.</p>
<p><strong>Limita.</strong> Un șir crescător și mărginit converge; limita lui se notează e. Din eₙ ≤ ∑1/k! rezultă e ≤ ∑1/k!. Invers, pentru un m fixat și n ≥ m, păstrând doar primii m + 1 termeni, eₙ ≥ ∑<sub>k=0</sub><sup>m</sup> (1/k!)·(1 − 1/n)…(1 − (k−1)/n); trecând la limită după n, e ≥ ∑<sub>k=0</sub><sup>m</sup> 1/k! pentru orice m. Deci e = ∑1/k!.</p>`,
  greseli: [
    "<strong>„1 la puterea infinit este 1”.</strong> 1^∞ este o nedeterminare: baza (1 + 1/n) e puțin peste 1, iar exponentul crește, iar rezultatul tinde la e ≈ 2,718.",
    "<strong>Expresii inversate.</strong> (1 + n)^(1/n) tinde la 1, nu la e.",
    "<strong>Convergență rapidă presupusă.</strong> (1 + 1/n)ⁿ se apropie încet: pentru n = 100 dă 2,7048 (eroare ≈ e/(2n)); seria ∑1/k! e mult mai rapidă.",
    "<strong>Generalizarea uitată.</strong> (1 + x/n)ⁿ → eˣ, nu e·x."
  ]
},

"criteriul-leibniz": {
  demonstratie: `
<p>Scriem seria ca a₁ − a₂ + a₃ − a₄ + … (semnul primului termen nu contează), cu aₙ &gt; 0 descrescător și aₙ → 0. Fie Sₙ suma primilor n termeni.</p>
<p><strong>Sumele de rang par cresc.</strong> S₂ₘ = (a₁ − a₂) + (a₃ − a₄) + … + (a₂ₘ₋₁ − a₂ₘ), iar fiecare paranteză e ≥ 0 (șirul descrește). Deci S₂ₘ ≤ S₂ₘ₊₂.</p>
<p><strong>Sunt mărginite.</strong> Grupând altfel, S₂ₘ = a₁ − (a₂ − a₃) − … − (a₂ₘ₋₂ − a₂ₘ₋₁) − a₂ₘ ≤ a₁.</p>
<p><strong>Limita.</strong> Un șir crescător și mărginit converge: S₂ₘ → S. Apoi S₂ₘ₊₁ = S₂ₘ + a₂ₘ₊₁ → S + 0 = S. Sumele pare și impare au aceeași limită, deci seria converge la S.</p>
<p><strong>Estimarea erorii.</strong> S se află mereu între două sume parțiale consecutive, deci |S − Sₙ| ≤ aₙ₊₁: eroarea nu depășește primul termen omis.</p>`,
  greseli: [
    "<strong>Monotonia neverificată.</strong> Fără ea criteriul poate da greș: cu termenii 1, 1, 1/2, 1/4, 1/3, 1/9, … (1/k urmat de 1/k²), seria alternantă diverge, deși termenii tind la 0.",
    "<strong>Convergent înseamnă absolut convergent.</strong> ∑(−1)ⁿ/n converge, dar ∑1/n diverge: convergența e doar condiționată.",
    "<strong>Rearanjarea termenilor.</strong> La o serie condiționat convergentă, schimbarea ordinii termenilor poate schimba suma (teorema lui Riemann).",
    "<strong>Termeni care nu tind la 0.</strong> ∑(−1)ⁿ·n/(n + 1) diverge: termenii se apropie de ±1, nu de 0."
  ]
},

"numere-perfecte": {
  demonstratie: `
<p>Folosim funcția σ (suma divizorilor), care este multiplicativă: σ(m·n) = σ(m)·σ(n) dacă m și n sunt prime între ele.</p>
<p><strong>Euclid: forma 2<sup>p−1</sup>(2<sup>p</sup> − 1) dă numere perfecte.</strong> Fie q = 2<sup>p</sup> − 1 prim și n = 2<sup>p−1</sup>·q. Atunci σ(2<sup>p−1</sup>) = 1 + 2 + … + 2<sup>p−1</sup> = 2<sup>p</sup> − 1 și σ(q) = q + 1 = 2<sup>p</sup>, deci:</p>
<p class="dem-formula">σ(n) = (2<sup>p</sup> − 1)·2<sup>p</sup> = 2·2<sup>p−1</sup>(2<sup>p</sup> − 1) = 2n.</p>
<p><strong>Euler: orice număr perfect par are această formă.</strong> Scriem n = 2ᵏ·m, cu m impar și k ≥ 1. Din σ(n) = 2n:</p>
<p class="dem-formula">(2ᵏ⁺¹ − 1)·σ(m) = 2ᵏ⁺¹·m.</p>
<p>Cum 2ᵏ⁺¹ − 1 este impar, el divide m: m = (2ᵏ⁺¹ − 1)·M. Înlocuind, σ(m) = 2ᵏ⁺¹·M = m + M. Dar m și M sunt doi divizori diferiți ai lui m (M &lt; m), iar suma lor este deja σ(m). Deci m nu are alți divizori: M = 1 și m = 2ᵏ⁺¹ − 1 este prim.</p>`,
  greseli: [
    "<strong>„2<sup>p</sup> − 1 e prim pentru orice p prim”.</strong> Fals: 2¹¹ − 1 = 2047 = 23·89. Formula dă un număr perfect doar când 2<sup>p</sup> − 1 este chiar prim.",
    "<strong>Numere perfecte impare.</strong> Nu se știe dacă există; nu s-a găsit niciunul, dar nici nu s-a demonstrat că nu există.",
    "<strong>σ(n) cu sau fără n.</strong> σ(n) include și pe n: perfect înseamnă σ(n) = 2n, adică suma divizorilor proprii (fără n) este n.",
    "<strong>1 nu e perfect.</strong> Suma divizorilor proprii ai lui 1 este 0, nu 1."
  ]
}

};
