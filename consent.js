(function(){
  var GA_ID = 'G-XXXXXXXXXX';
  var STORAGE_KEY = 'cookie-consent';
  var inTheoremPage = /\/teoreme\//.test(window.location.pathname);
  var prefix = inTheoremPage ? '../' : '';

  function getConsent(){
    try { return window.localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }
  function setConsent(value){
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch(e){}
  }

  function loadAnalytics(){
    if (window.gtagLoaded) return;
    window.gtagLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  }

  function removeBanner(banner){
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

  function showBanner(){
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consimțământ cookie-uri');
    banner.innerHTML =
      '<p>Folosim Google Analytics pentru statistici de trafic și afișăm reclame Google AdSense. Poți accepta sau refuza. ' +
      '<a href="' + prefix + 'confidentialitate.html">Detalii</a></p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookieDecline" class="cookie-btn cookie-btn-decline">Refuz</button>' +
      '<button type="button" id="cookieAccept" class="cookie-btn cookie-btn-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', function(){
      setConsent('granted');
      removeBanner(banner);
      loadAnalytics();
    });
    document.getElementById('cookieDecline').addEventListener('click', function(){
      setConsent('denied');
      removeBanner(banner);
    });
  }

  function init(){
    var consent = getConsent();
    if (consent === 'granted') {
      loadAnalytics();
    } else if (consent !== 'denied') {
      showBanner();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
