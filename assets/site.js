/* ══════════════════════════════════════════════════════════════════
   GGzE — shared runtime
   One copy of the things every page needs: the activity log, the
   toast, the confetti, the scroll reveals, the konami handler.
   Previously duplicated across five files.

   Exposes a single global: window.GGZ
   56 · @56isk · github.com/56snty
   ══════════════════════════════════════════════════════════════════ */
(function (window, document) {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');
  var LOG_KEY = 'activityLogs';
  var LOG_CAP = 500;

  /* ── the shared user directory ──────────────────────────────────
     Single source of truth. Pages used to each carry their own copy,
     which is how the unit numbers drifted apart between files.
     `pass` lives only on the gate; it is a joke between friends, not
     a secret — see the note in index.html.                          */
  var USERS = {
    gebruiker162: { name:'Sabine N.', first:'Sabine',    clientId:'CLI-1998-0162', unit:1, accent:'#d8674a' },
    gebruiker726: { name:'Nienke V.', first:'Nienke',    clientId:'CLI-1998-0726', unit:1, accent:'#4fa89b' },
    gebruiker492: { name:'Demian',    first:'Demian',    clientId:'CLI-1998-0492', unit:2, accent:'#e0566f', bff:true },
    gebruiker892: { name:'Leonie',    first:'Leonie',    clientId:'CLI-1998-0892', unit:3, accent:'#c98686' },
    gebruiker83:  { name:'Bram',      first:'Bram',      clientId:'CLI-1998-0083', unit:3, accent:'#8b6bff' },
    gebruiker744: { name:'Esther',    first:'Esther',    clientId:'CLI-1998-0744', unit:3, accent:'#f0709a' },
    gebruiker56:  { name:'Meike',     first:'Meike',     clientId:'CLI-1998-0056', unit:3, accent:'#e5674b' },
    gebruiker729: { name:'Veronique', first:'Veronique', clientId:'CLI-1998-0729', unit:3, accent:'#b0698c' },
    admin:        { name:'Systeembeheerder', first:'Beheer', clientId:'ADM-SYS-ROOT', unit:0, accent:'#5c9ce0' }
  };

  var DEFAULT_ACCENT = '#d8674a';

  /* ── activity log ───────────────────────────────────────────────
     Best-effort: private mode and quota errors are swallowed, since
     a broken log should never break the page.                       */
  function log(action, details, username) {
    try {
      var logs = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      if (!Array.isArray(logs)) logs = [];
      logs.push({
        timestamp: new Date().toISOString(),
        username: username || '(anoniem)',
        action: action,
        details: details || {}
      });
      localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-LOG_CAP)));
    } catch (e) { /* no-op */ }
  }

  function readLogs() {
    try {
      var l = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
      return Array.isArray(l) ? l : [];
    } catch (e) { return []; }
  }

  /* ── session ────────────────────────────────────────────────────
     URL param wins over localStorage so a shared link always opens
     the right person's page.                                        */
  function sessionKey() {
    var fromUrl = new URLSearchParams(location.search).get('user');
    var stored = null;
    try { stored = localStorage.getItem('currentUser'); } catch (e) { /* no-op */ }
    return String(fromUrl || stored || '').toLowerCase() || null;
  }

  function currentUser() {
    var k = sessionKey();
    return k && USERS[k] ? USERS[k] : null;
  }

  /* ── accent ─────────────────────────────────────────────────────
     The single accent token. Everything else in the palette is the
     shared neutral ramp, so this one line re-skins a whole page.    */
  function setAccent(hex) {
    document.documentElement.style.setProperty('--accent', hex || DEFAULT_ACCENT);
  }

  function applyUserAccent(user) {
    setAccent(user && user.accent ? user.accent : DEFAULT_ACCENT);
  }

  /* ── toast ──────────────────────────────────────────────────────
     Creates its own node on first use, so pages don't each need the
     markup.                                                         */
  var toastEl = null;
  var toastTimer = null;

  function toast(message, ms) {
    if (!toastEl) {
      toastEl = document.querySelector('.toast');
      if (!toastEl) {
        toastEl = document.createElement('div');
        toastEl.className = 'toast';
        toastEl.setAttribute('role', 'status');
        document.body.appendChild(toastEl);
      }
    }
    toastEl.textContent = message;
    toastEl.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-shown');
    }, ms || 3400);
  }

  /* ── confetti ───────────────────────────────────────────────────
     Web Animations API, no dependency. Skipped entirely under
     reduced-motion rather than just shortened.                      */
  function confetti(count) {
    if (REDUCED.matches) return;
    var accent = getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || DEFAULT_ACCENT;
    var cols = [accent, '#eef1f2', '#828d94'];
    var n = count || 80;
    var frag = document.createDocumentFragment();
    var made = [];

    for (var i = 0; i < n; i++) {
      var s = document.createElement('span');
      s.style.cssText =
        'position:fixed;z-index:300;top:-14px;left:' + (Math.random() * 100) +
        'vw;width:' + (5 + Math.random() * 6) + 'px;height:' + (8 + Math.random() * 8) +
        'px;background:' + cols[i % cols.length] +
        ';border-radius:2px;pointer-events:none;will-change:transform';
      frag.appendChild(s);
      made.push(s);
    }
    document.body.appendChild(frag);

    made.forEach(function (s) {
      s.animate(
        [
          { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
          { transform: 'translate3d(' + ((Math.random() - .5) * 280) + 'px,105vh,0) rotate(' +
              (Math.random() * 720) + 'deg)', opacity: .85 }
        ],
        { duration: 2300 + Math.random() * 1700, easing: 'cubic-bezier(.2,.6,.4,1)' }
      ).onfinish = function () { s.remove(); };
    });
  }

  /* ── scroll reveals ─────────────────────────────────────────────
     Elements translate up and fade in once, then stop being watched.
     Under reduced-motion they are simply shown.                     */
  function initReveals(selector) {
    var nodes = document.querySelectorAll(selector || '.reveal');
    if (!nodes.length) return;

    if (REDUCED.matches || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: .2, rootMargin: '0px 0px -8% 0px' });

    nodes.forEach(function (n) { io.observe(n); });
  }

  /* ── hero parallax ──────────────────────────────────────────────
     Transform + opacity only, rAF-throttled, and it detaches once
     the hero is off screen.                                         */
  function initHeroParallax(sel) {
    var hero = document.querySelector(sel || '.hero__inner');
    if (!hero || REDUCED.matches) return;

    var ticking = false;

    function frame() {
      var y = window.scrollY;
      var vh = window.innerHeight;
      if (y < vh) {
        var p = y / vh;
        hero.style.transform = 'translate3d(0,' + (y * 0.18).toFixed(2) + 'px,0)';
        hero.style.opacity = String(Math.max(0, 1 - p * 1.35));
      }
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }, { passive: true });
  }

  /* ── smooth anchor scrolling ────────────────────────────────────
     scroll-behavior is not set globally so reduced-motion users get
     an instant jump without needing an override.                    */
  function initSmoothAnchors() {
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id === '#' || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({
        behavior: REDUCED.matches ? 'auto' : 'smooth',
        block: 'start'
      });
      // move focus so keyboard users land where the page just scrolled
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  }

  /* ── konami ─────────────────────────────────────────────────────  */
  var KONAMI = ['arrowup','arrowup','arrowdown','arrowdown',
                'arrowleft','arrowright','arrowleft','arrowright','b','a'];

  function initKonami(onUnlock) {
    var idx = 0;
    window.addEventListener('keydown', function (e) {
      if (!e.key) return;
      idx = (e.key.toLowerCase() === KONAMI[idx]) ? idx + 1 : 0;
      if (idx === KONAMI.length) { idx = 0; onUnlock(); }
    });
  }

  /* ── click-n-times helper (logo easter eggs) ────────────────────  */
  function initClickStreak(el, times, onHit) {
    if (!el) return;
    var n = 0, t = null;
    el.addEventListener('click', function () {
      n++;
      clearTimeout(t);
      t = setTimeout(function () { n = 0; }, 1200);
      if (n === times) { n = 0; onHit(); }
    });
  }

  /* ── relative time, nl-NL ───────────────────────────────────────  */
  function relTime(iso) {
    var d = new Date(iso);
    var s = Math.floor((Date.now() - d) / 1000);
    if (isNaN(s)) return '—';
    if (s < 10) return 'zojuist';
    if (s < 60) return s + ' sec geleden';
    var m = Math.floor(s / 60); if (m < 60) return m + ' min geleden';
    var h = Math.floor(m / 60); if (h < 24) return h + ' uur geleden';
    var dd = Math.floor(h / 24); if (dd < 7) return dd + ' dag' + (dd > 1 ? 'en' : '') + ' geleden';
    return d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
  }

  function absTime(iso) {
    var d = new Date(iso);
    return isNaN(d) ? '' : d.toLocaleString('nl-NL');
  }

  /* ── boot: everything that every page wants ─────────────────────  */
  function init(opts) {
    opts = opts || {};
    initReveals();
    initSmoothAnchors();
    if (opts.accent !== false) applyUserAccent(currentUser());
    if (opts.page) log('page_view', { page: opts.page }, sessionKey());
  }

  window.GGZ = {
    USERS: USERS,
    DEFAULT_ACCENT: DEFAULT_ACCENT,
    reducedMotion: REDUCED,
    log: log,
    readLogs: readLogs,
    sessionKey: sessionKey,
    currentUser: currentUser,
    setAccent: setAccent,
    applyUserAccent: applyUserAccent,
    toast: toast,
    confetti: confetti,
    initReveals: initReveals,
    initHeroParallax: initHeroParallax,
    initSmoothAnchors: initSmoothAnchors,
    initKonami: initKonami,
    initClickStreak: initClickStreak,
    relTime: relTime,
    absTime: absTime,
    init: init
  };
})(window, document);
