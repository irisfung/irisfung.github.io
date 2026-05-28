/* Shared nav behaviour — loaded on every page with defer */
document.addEventListener('DOMContentLoaded', function () {

  /* ── Image lightbox (.zoomable) ──────────────────────── */
  var zoomables = document.querySelectorAll('.zoomable');
  if (zoomables.length) {
    var overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML =
      '<div class="lightbox-content">' +
        '<img class="lightbox-img" alt="">' +
        '<p class="lightbox-caption"></p>' +
      '</div>';
    document.body.appendChild(overlay);
    var lbImg     = overlay.querySelector('.lightbox-img');
    var lbCaption = overlay.querySelector('.lightbox-caption');

    zoomables.forEach(function (img) {
      img.addEventListener('click', function () {
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;

        /* Find caption: check next sibling of the image, or of its
           parent wrapper (e.g. inside .before-after-item).        */
        var next = img.nextElementSibling;
        if (!next || !next.classList.contains('caption')) {
          var parentNext = img.parentElement && img.parentElement.nextElementSibling;
          next = (parentNext && parentNext.classList.contains('caption')) ? parentNext : null;
        }
        var text = next ? next.textContent.trim() : '';
        lbCaption.textContent = text;
        lbCaption.hidden = !text;

        overlay.classList.add('open');
      });
    });

    overlay.addEventListener('click', function () {
      overlay.classList.remove('open');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') overlay.classList.remove('open');
    });
  }

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
