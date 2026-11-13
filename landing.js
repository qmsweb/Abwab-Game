/* ============================================================
   أبواب — تفاعلات صفحة الهبوط
   بلا أي مكتبات أو طلبات شبكة.
   ============================================================ */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

  /* ===== الشريط العلوي عند التمرير ===== */
  var header = doc.getElementById('siteHeader');
  var navLinks = Array.prototype.slice.call(doc.querySelectorAll('.nav__link'));
  var spySections = navLinks.map(function (link) {
    var key = link.getAttribute('data-spy');
    var el = key === 'top' ? doc.querySelector('.hero') : doc.getElementById(key);
    return { key: key, el: el, link: link };
  }).filter(function (item) { return item.el; });

  var ticking = false;

  function setActiveNav() {
    if (!header) return;
    var offset = header.offsetHeight + 120;
    var current = null;
    var nearest = -Infinity;
    spySections.forEach(function (item) {
      if (!item.el) return;
      var top = item.el.getBoundingClientRect().top;
      if (top <= offset && top > nearest) {
        nearest = top;
        current = item;
      }
    });
    if (!current) current = spySections[0];
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', !!current && link === current.link);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
      setActiveNav();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ===== قائمة الجوال ===== */
  var menu = doc.getElementById('mobileMenu');
  var menuBtn = doc.getElementById('menuBtn');
  var menuClose = doc.getElementById('menuClose');
  var lastFocused = null;

  function isMenuOpen() {
    return !!menu && menu.classList.contains('is-open');
  }

  function trapFocus(event) {
    if (event.key !== 'Tab' || !isMenuOpen()) return;
    var focusable;
    if (menu.inert) menu.inert = false;
    focusable = menu.querySelectorAll('a[href], button:not([disabled])');
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function openMenu() {
    if (!menu || !menuBtn) return;
    lastFocused = doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : menuBtn;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    menu.inert = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'إغلاق القائمة');
    doc.body.classList.add('menu-open');
    if (menuClose) menuClose.focus();
  }

  function closeMenu(restoreFocus) {
    if (!menu || !menuBtn) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'فتح القائمة');
    doc.body.classList.remove('menu-open');
    if (menuClose) menuClose.blur();
    window.setTimeout(function () {
      if (!isMenuOpen()) menu.inert = true;
    }, 420);
    if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    } else if (restoreFocus) {
      menuBtn.focus();
    }
  }

  if (menu) menu.inert = true;
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (isMenuOpen()) closeMenu(true);
      else openMenu();
    });
  }
  if (menuClose) menuClose.addEventListener('click', function () { closeMenu(true); });

  if (menu) {
    menu.addEventListener('click', function (event) {
      var target = event.target.closest ? event.target.closest('a[href]') : null;
      if (target) closeMenu(true);
    });
  }

  doc.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isMenuOpen()) {
      closeMenu(true);
      return;
    }
    trapFocus(event);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 980 && isMenuOpen()) closeMenu(false);
  });

  /* ===== الظهور عند التمرير ===== */
  var revealItems = Array.prototype.slice.call(doc.querySelectorAll('[data-reveal]'));

  function showAll() {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    showAll();
  } else {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  }

  /* ===== العدّاد ===== */
  var counters = Array.prototype.slice.call(doc.querySelectorAll('[data-count]'));

  function finalValue(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    return isNaN(target) ? el.textContent : target;
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduceMotion.matches) {
      el.textContent = String(target);
      return;
    }
    var duration = 1300;
    var start = null;

    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = String(Math.round(target * eased));
      if (progress < 1) window.requestAnimationFrame(step);
      else el.textContent = String(target);
    }
    el.textContent = '0';
    window.requestAnimationFrame(step);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { el.textContent = String(finalValue(el)); });
    } else {
      var counterObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { counterObserver.observe(el); });
    }
  }

  /* ===== السنة في التذييل ===== */
  var year = doc.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

})();
