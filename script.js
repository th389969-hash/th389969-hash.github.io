// Vanilla interactions: mobile menu, scrollspy, reveal-on-scroll, placeholder guards.
(function () {
  'use strict';

  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Scrollspy
  var navAnchors = Array.prototype.slice.call(document.querySelectorAll('.nav-link'));
  var sections = navAnchors
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navAnchors.forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Subtle fade-in
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // Transcript modal: open/close + VI/EN toggle
  var modal = document.getElementById('transcriptModal');
  var openBtn = document.getElementById('transcriptOpen');
  var closeBtn = document.getElementById('transcriptClose');
  var langBtn = document.getElementById('langToggle');
  var lang = 'vi';

  function openModal() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }
  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (openBtn) openBtn.focus();
  }
  if (openBtn) openBtn.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
  });
  if (langBtn) langBtn.addEventListener('click', function () {
    lang = (lang === 'vi') ? 'en' : 'vi';
    document.querySelectorAll('#transcriptModal [data-vi]').forEach(function (el) {
      el.textContent = el.dataset[lang];
    });
    langBtn.textContent = (lang === 'vi') ? 'English' : 'Tiếng Việt';
  });
  // Guard: buttons marked data-soon show a non-navigation notice instead of jumping
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-soon]');
    if (t) {
      e.preventDefault();
      var msg = t.getAttribute('data-soon') || 'Coming soon';
      // Small accessible toast without any library
      var toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.textContent = msg + ' — replace the placeholder link in index.html.';
      toast.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111827;color:#F8FAFC;border:1px solid rgba(34,211,238,.5);padding:10px 16px;border-radius:10px;font-size:.85rem;z-index:2000';
      document.body.appendChild(toast);
      setTimeout(function () { toast.remove(); }, 2600);
    }
  });
})();
