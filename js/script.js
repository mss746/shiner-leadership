(function() {
  var validPages = ['home','work','research','about','contact'];

  function normalizePageId(id) {
    return validPages.includes(id) ? id : 'home';
  }

  function showPage(id, pushState) {
    if (pushState === undefined) pushState = true;
    var pageId = normalizePageId(id);
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    document.querySelectorAll('.nav-links a').forEach(function(a) { a.classList.remove('active'); });
    var target = document.getElementById('page-' + pageId);
    if (target) { target.classList.add('active'); window.scrollTo({top:0, behavior:'smooth'}); }
    var navLink = document.getElementById('nav-' + pageId);
    if (navLink) navLink.classList.add('active');
    if (pushState && window.location.hash !== '#' + pageId)
      history.pushState({page: pageId}, '', '#' + pageId);
  }

  function toggleMobileMenu() {
    var menu = document.getElementById('mobile-menu');
    var btn = document.querySelector('.hamburger');
    if (menu) {
      var isOpen = menu.classList.toggle('open');
      if (btn) btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  window.showPage = showPage;
  window.toggleMobileMenu = toggleMobileMenu;

  document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        var pageId = link.getAttribute('href').slice(1);
        if (document.getElementById('page-' + pageId)) {
          e.preventDefault();
          showPage(pageId);
          var m = document.getElementById('mobile-menu');
          if (m && m.classList.contains('open')) toggleMobileMenu();
        }
      });
    });

    document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    var menu = document.getElementById('mobile-menu');
    if (menu && menu.classList.contains('open')) {
      toggleMobileMenu();
    }
  }
});

    var initial = window.location.hash ? window.location.hash.slice(1) : 'home';
    showPage(initial, false);

    var nav = document.getElementById('main-nav');
    var ticking = false;
    window.addEventListener('scroll', function() {
      if (!ticking) {
        requestAnimationFrame(function() {
          if (nav) nav.style.background = window.scrollY > 40
            ? 'rgba(10,8,6,0.98)'
            : 'rgba(12,10,8,0.94)';
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('popstate', function(e) {
      var page = (e.state && e.state.page) || window.location.hash.slice(1) || 'home';
      showPage(page, false);
    });
  });
})();
