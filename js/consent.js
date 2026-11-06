(function(){
  // Nimic de la Google (Analytics, AdSense) nu se încarcă înainte ca vizitatorul
  // să apese „Accept”: fără scripturi, fără preconnect, fără cookie-uri. După
  // „Refuz” site-ul nu contactează deloc serverele Google.
  var GA_ID = 'G-XXXXXXXXXX';
  var ADSENSE_CLIENT = 'ca-pub-XXXXXXXXXXXXXXXX';
  var STORAGE_KEY = 'cookie-consent';
  // alegerea se cere din nou după 6 luni, ca vizitatorul să o poată reconsidera
  var MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182;
  var googleLoaded = false;

  // adâncimea căii decide prefixul relativ (ex. /teoreme/x sau /unelte/x
  // au nevoie de "../", paginile de nivel 1 ca /despre nu au nevoie)
  var pathDepth = window.location.pathname.split('/').filter(Boolean).length;
  var prefix = pathDepth >= 2 ? '../' : '';

  // valoarea salvată e „granted|<timestamp>” sau „denied|<timestamp>”;
  // valorile vechi, fără dată, se cer din nou
  function getConsent(){
    var raw = null;
    try { raw = window.localStorage.getItem(STORAGE_KEY); } catch(e){}
    if (!raw) return null;
    var parts = String(raw).split('|');
    var time = parseInt(parts[1], 10);
    if ((parts[0] !== 'granted' && parts[0] !== 'denied') || !time || new Date().getTime() - time > MAX_AGE_MS) return null;
    return parts[0];
  }
  function setConsent(value){
    try { window.localStorage.setItem(STORAGE_KEY, value + '|' + new Date().getTime()); } catch(e){}
  }

  function addScript(src, crossorigin){
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (crossorigin) s.crossOrigin = 'anonymous';
    document.head.appendChild(s);
  }

  function loadGoogle(){
    if (googleLoaded) return;
    googleLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted',
      'analytics_storage': 'granted'
    });
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
    addScript('https://www.googletagmanager.com/gtag/js?id=' + GA_ID, false);
    // reclame automate AdSense (Auto ads)
    addScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + ADSENSE_CLIENT, true);
  }

  // la retragerea consimțământului: oprește Analytics (altfel rescrie cookie-ul
  // _ga_* chiar când pagina se reîncarcă), șterge cookie-urile și reîncarcă pagina
  function revokeGoogle(){
    window['ga-disable-' + GA_ID] = true;
    window.gtag('consent', 'update', {
      'ad_storage': 'denied',
      'ad_user_data': 'denied',
      'ad_personalization': 'denied',
      'analytics_storage': 'denied'
    });
    deleteAnalyticsCookies();
    window.location.reload();
  }

  // cookie-urile Google Analytics de pe acest domeniu (cele de reclame sunt pe
  // domeniile Google și nu pot fi șterse de aici)
  function deleteAnalyticsCookies(){
    var names = document.cookie.split(';');
    var host = window.location.hostname;
    var domains = ['', host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    for (var i = 0; i < names.length; i++) {
      var name = names[i].split('=')[0].replace(/^\s+|\s+$/g, '');
      if (name === '_ga' || name.indexOf('_ga_') === 0 || name === '_gid' || name === '_gat') {
        for (var j = 0; j < domains.length; j++) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (domains[j] ? '; domain=' + domains[j] : '');
        }
      }
    }
  }

  function removeBanner(banner){
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
    updateBackToTopPosition();
  }

  function showBanner(){
    if (document.getElementById('cookieBanner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consimțământ cookie-uri');
    banner.innerHTML =
      '<p>Cu acordul tău, folosim Google Analytics (statistici) și Google AdSense (reclame, posibil personalizate), care salvează cookie-uri și trimit date către Google. ' +
      'Dacă refuzi, nu se încarcă nimic de la Google. Poți schimba alegerea oricând, din „Setări cookie-uri”. Sub 16 ani? Cere acordul unui părinte. ' +
      '<a href="' + prefix + 'confidentialitate">Detalii și drepturile tale</a></p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookieDecline" class="cookie-btn cookie-btn-decline">Refuz</button>' +
      '<button type="button" id="cookieAccept" class="cookie-btn cookie-btn-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);
    updateBackToTopPosition();

    document.getElementById('cookieAccept').addEventListener('click', function(){
      setConsent('granted');
      removeBanner(banner);
      loadGoogle();
    });
    document.getElementById('cookieDecline').addEventListener('click', function(){
      setConsent('denied');
      removeBanner(banner);
      if (googleLoaded) revokeGoogle();
    });
  }

  window.openCookieSettings = function(){
    showBanner();
  };

  function protectEmails(){
    var nodes = document.querySelectorAll('.email-protected');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var user = el.getAttribute('data-user');
      var domain = el.getAttribute('data-domain');
      if (!user || !domain) continue;
      var address = user + String.fromCharCode(64) + domain;
      var link = document.createElement('a');
      link.href = 'mailto' + String.fromCharCode(58) + address;
      link.textContent = address;
      link.className = el.className.replace('email-protected', '').trim();
      el.parentNode.replaceChild(link, el);
    }
  }

  // bannerul de cookie-uri (z-index mai mare) ar acoperi butonul "sus" în
  // colțul din dreapta jos cât timp e vizibil - îl urcăm deasupra lui
  function updateBackToTopPosition(){
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    var banner = document.getElementById('cookieBanner');
    if (banner) btn.style.bottom = (banner.offsetHeight + 16) + 'px';
    else btn.style.bottom = '';
  }

  function initBackToTop(){
    var btn = document.getElementById('backToTop');
    if (!btn) return;
    function onScroll(){
      if (window.scrollY > 500) btn.classList.add('visible');
      else btn.classList.remove('visible');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateBackToTopPosition, { passive: true });
    onScroll();
    updateBackToTopPosition();
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init(){
    var consent = getConsent();
    if (consent === 'granted') {
      loadGoogle();
    } else if (consent === 'denied') {
      // plasă de siguranță: dacă a rămas vreun cookie Analytics de dinainte de refuz
      deleteAnalyticsCookies();
    } else {
      showBanner();
    }
    protectEmails();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
