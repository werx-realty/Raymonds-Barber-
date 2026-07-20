/* ==========================================================================
   Raymond's Barbershop — interaction + GSAP motion layer
   ========================================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasGSAP = typeof window.gsap !== 'undefined';

  /* ---------- Sticky header ---------- */
  var header = document.querySelector('.site-header');
  if (header && !header.classList.contains('is-solid')) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile menu ---------- */
  var menu = document.getElementById('mobileMenu');
  var openBtn = document.querySelector('[data-menu-open]');
  var closeBtn = document.querySelector('[data-menu-close]');

  function setMenu(open) {
    if (!menu) return;
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = menu.querySelector('a');
      if (first) first.focus();
    } else if (openBtn) {
      openBtn.focus();
    }
  }
  if (openBtn) openBtn.addEventListener('click', function () { setMenu(true); });
  if (closeBtn) closeBtn.addEventListener('click', function () { setMenu(false); });
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setMenu(false);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('is-open')) setMenu(false);
  });

  /* ---------- Flip cards ----------
     Desktop: hover flips (CSS). Click anywhere navigates to the profile.
     Touch:   first tap flips the card, second tap (or the CTA) navigates.
  ------------------------------------------------------------------------ */
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.querySelectorAll('.flip').forEach(function (card) {
    var href = card.getAttribute('data-href');

    function go() { if (href) window.location.href = href; }

    card.addEventListener('click', function (e) {
      // Let real links inside the card behave normally.
      if (e.target.closest('a')) return;
      if (canHover) { go(); return; }
      if (card.classList.contains('is-flipped')) { go(); }
      else {
        document.querySelectorAll('.flip.is-flipped').forEach(function (c) {
          if (c !== card) c.classList.remove('is-flipped');
        });
        card.classList.add('is-flipped');
      }
    });

    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });

  if (!hasGSAP || reduced) {
    // Make sure nothing stays invisible if GSAP fails to load.
    document.querySelectorAll('[data-anim]').forEach(function (el) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Hero entrance ---------- */
  var heroBits = gsap.utils.toArray('[data-hero]');
  if (heroBits.length) {
    gsap.set(heroBits, { opacity: 0, y: 34 });
    gsap.to(heroBits, {
      opacity: 1, y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.09,
      delay: 0.12
    });
  }

  /* ---------- Generic scroll reveals ---------- */
  gsap.utils.toArray('[data-anim="up"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.75, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      }
    );
  });

  gsap.utils.toArray('[data-anim="left"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: -46 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      }
    );
  });

  gsap.utils.toArray('[data-anim="right"]').forEach(function (el) {
    gsap.fromTo(el,
      { opacity: 0, x: 46 },
      {
        opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      }
    );
  });

  /* ---------- Staggered groups (cards, price rows) ---------- */
  gsap.utils.toArray('[data-stagger]').forEach(function (group) {
    var kids = group.querySelectorAll('[data-stagger-item]');
    if (!kids.length) return;
    gsap.fromTo(kids,
      { opacity: 0, y: 48 },
      {
        opacity: 1, y: 0,
        duration: 0.7, ease: 'power2.out', stagger: 0.09,
        scrollTrigger: { trigger: group, start: 'top 82%', once: true }
      }
    );
  });

  /* ---------- Counting stats ---------- */
  gsap.utils.toArray('[data-count]').forEach(function (el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var obj = { v: 0 };
    gsap.to(obj, {
      v: end,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: function () { el.textContent = Math.round(obj.v) + suffix; }
    });
  });

  /* ---------- Marquee band ---------- */
  var track = document.querySelector('.band__track');
  if (track) {
    var half = track.scrollWidth / 2;
    gsap.to(track, {
      x: -half,
      duration: 26,
      ease: 'none',
      repeat: -1,
      modifiers: { x: gsap.utils.unitize(function (x) { return parseFloat(x) % half; }) }
    });
  }

  /* ---------- Subtle brick parallax ---------- */
  gsap.utils.toArray('[data-parallax]').forEach(function (el) {
    gsap.to(el, {
      backgroundPositionY: '160px',
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.6 }
    });
  });
})();
