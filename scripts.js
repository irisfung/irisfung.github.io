/* Shared nav behaviour — loaded on every page with defer */
document.addEventListener('DOMContentLoaded', function () {
  const nav    = document.querySelector('.nav');
  const toggle = document.querySelector('.menu-toggle');
  const links  = document.querySelector('.nav-links');

  /* ── Mobile hamburger ─────────────────────────────────── */
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!isOpen));
      links.classList.toggle('open');
    });

    /* Close menu when a link is tapped on mobile */
    links.querySelectorAll('.nav-item').forEach(function (item) {
      item.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('open');
      });
    });
  }

  /* ── Scroll-aware nav (hide on down, reveal on up) ───── */
  if (nav) {
    let lastScrollY   = 0;
    let ticking       = false;

    function updateNav () {
      const currentScrollY = window.scrollY;
      const menuOpen       = toggle && toggle.getAttribute('aria-expanded') === 'true';

      /* Never hide while the mobile menu is open */
      if (!menuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 80) {
          /* Scrolling DOWN past 80 px — slide nav away */
          nav.classList.add('nav-hidden');
        } else {
          /* Scrolling UP or near the top — bring nav back */
          nav.classList.remove('nav-hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking     = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        /* requestAnimationFrame keeps the scroll handler off the main thread */
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }, { passive: true });
  }
});
