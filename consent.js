(function(){
  var STORAGE_KEY = 'cookie-consent';
  var inTheoremPage = /\/teoreme\//.test(window.location.pathname);
  var prefix = inTheoremPage ? '../' : '';

  function getConsent(){
    try { return window.localStorage.getItem(STORAGE_KEY); } catch(e){ return null; }
  }
  function setConsent(value){
    try { window.localStorage.setItem(STORAGE_KEY, value); } catch(e){}
  }

  function updateConsent(granted){
    if (typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {
      'ad_storage': granted ? 'granted' : 'denied',
      'ad_user_data': granted ? 'granted' : 'denied',
      'ad_personalization': granted ? 'granted' : 'denied',
      'analytics_storage': granted ? 'granted' : 'denied'
    });
  }

  function removeBanner(banner){
    if (banner && banner.parentNode) banner.parentNode.removeChild(banner);
  }

  function showBanner(){
    if (document.getElementById('cookieBanner')) return;
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consimțământ cookie-uri');
    banner.innerHTML =
      '<p>Folosim Google Analytics pentru statistici de trafic și afișăm reclame Google AdSense. Poți accepta sau refuza oricând. ' +
      '<a href="' + prefix + 'confidentialitate">Detalii și drepturile tale</a></p>' +
      '<div class="cookie-banner-actions">' +
      '<button type="button" id="cookieDecline" class="cookie-btn cookie-btn-decline">Refuz</button>' +
      '<button type="button" id="cookieAccept" class="cookie-btn cookie-btn-accept">Accept</button>' +
      '</div>';
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', function(){
      setConsent('granted');
      updateConsent(true);
      removeBanner(banner);
    });
    document.getElementById('cookieDecline').addEventListener('click', function(){
      setConsent('denied');
      updateConsent(false);
      removeBanner(banner);
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

  function init(){
    var consent = getConsent();
    if (consent !== 'granted' && consent !== 'denied') {
      showBanner();
    }
    protectEmails();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
