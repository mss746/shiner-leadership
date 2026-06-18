(function () {
  function normalizePageId(id) {
    const validPages = ['home', 'investors', 'ceos', 'engagements', 'about', 'book', 'contact'];
    return validPages.includes(id) ? id : 'home';
  }

  function showPage(id, pushState = true) {
    const pageId = normalizePageId(id);

    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
    });

    const target = document.getElementById('page-' + pageId);
    if (target) {
      target.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const navLink = document.getElementById('nav-' + pageId);
    if (navLink) {
      navLink.classList.add('active');
    }

    const newHash = '#' + pageId;
    if (pushState && window.location.hash !== newHash) {
      history.pushState({ page: pageId }, '', newHash);
    }
  }

  function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const hamburger = document.querySelector('.hamburger');
    if (!menu) return;

    const isOpen = menu.classList.toggle('open');
    if (hamburger) {
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }
  }

  window.showPage = showPage;
  window.toggleMobileMenu = toggleMobileMenu;

  document.addEventListener('DOMContentLoaded', () => {
    // Make hash links work even if inline onclick handlers fail or are stripped.
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', event => {
        const pageId = link.getAttribute('href').slice(1);
        if (document.getElementById('page-' + pageId)) {
          event.preventDefault();
          showPage(pageId);

          const mobileMenu = document.getElementById('mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            toggleMobileMenu();
          }
        }
      });
    });

    const initialPage = window.location.hash ? window.location.hash.slice(1) : 'home';
    showPage(initialPage, false);
    history.replaceState({ page: normalizePageId(initialPage) }, '', '#' + normalizePageId(initialPage));

    const nav = document.getElementById('main-nav');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if (nav) {
            nav.style.background = window.scrollY > 40
              ? 'rgba(10,8,6,0.98)'
              : 'rgba(12,10,8,0.94)';
          }
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('popstate', event => {
      const page = event.state?.page || window.location.hash.slice(1) || 'home';
      showPage(page, false);
    });

    window.addEventListener('hashchange', () => {
      showPage(window.location.hash.slice(1) || 'home', false);
    });

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', async event => {
        if (!window.fetch || !window.FormData) {
          return;
        }

        event.preventDefault();

        const submitButton = contactForm.querySelector('[type="submit"]');
        const successMessage = contactForm.querySelector('[data-fs-success]');
        const errorMessage = contactForm.querySelector('[data-fs-error]');

        if (successMessage) {
          successMessage.classList.remove('visible');
        }
        if (errorMessage) {
          errorMessage.textContent = '';
        }
        if (submitButton) {
          submitButton.disabled = true;
        }

        try {
          const response = await fetch(contactForm.action, {
            method: contactForm.method || 'POST',
            body: new FormData(contactForm),
            headers: { Accept: 'application/json' }
          });

          if (response.ok) {
            contactForm.reset();
            if (successMessage) {
              successMessage.classList.add('visible');
            }
          } else if (errorMessage) {
            errorMessage.textContent = 'There was a problem sending your message. Please try again or email michael@shinerleadership.com.';
          } else {
            alert('There was a problem sending your message. Please try again or email michael@shinerleadership.com.');
          }
        } catch (error) {
          // If the enhanced JavaScript submission fails, fall back to a normal HTML form post.
          HTMLFormElement.prototype.submit.call(contactForm);
        } finally {
          if (submitButton) {
            submitButton.disabled = false;
          }
        }
      });
    }
  });
})();
