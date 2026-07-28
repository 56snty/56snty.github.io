/* ══════════════════════════════════════════════════════════════════
   Shared data + business logic.
   Framework-agnostic on purpose: the React components read from here,
   so the auth flow, the activity log and the user directory stay in
   one place rather than being reimplemented per page.
   ══════════════════════════════════════════════════════════════════ */

const LOG_KEY = 'activityLogs';
const LOG_CAP = 500;

/* ── the shared user directory ────────────────────────────────────
   Single source of truth. Units used to be duplicated per page,
   which is how medicijnen.html drifted to units 2/3/4 while the
   login assigned 0-3.                                              */
export const USERS = {
  gebruiker483: { name: 'Esmee', first: 'Esmee', clientId: 'CLI-1998-0483', unit: 1, accent: '#4fa89b' },
  gebruiker162: { name:'Sabine.', first:'Sabine',    clientId:'CLI-1998-0162', unit:1, accent:'#d8674a' },
  gebruiker726: { name:'Nienke.', first:'Nienke',    clientId:'CLI-1998-0726', unit:1, accent:'#4fa89b' },
  gebruiker492: { name:'Demian',    first:'Demian',    clientId:'CLI-1998-0492', unit:2, accent:'#e0566f', bff:true },
  gebruiker892: { name:'Leonie',    first:'Leonie',    clientId:'CLI-1998-0892', unit:3, accent:'#c98686' },
  gebruiker83:  { name:'Bram',      first:'Bram',      clientId:'CLI-1998-0083', unit:3, accent:'#8b6bff' },
  gebruiker744: { name:'Ester',    first:'Ester',    clientId:'CLI-1998-0744', unit:3, accent:'#f0709a' },
  gebruiker56:  { name:'Meike',     first:'Meike',     clientId:'CLI-1998-0056', unit:3, accent:'#e5674b' },
  gebruiker729: { name:'Veronique', first:'Veronique', clientId:'CLI-1998-0729', unit:3, accent:'#b0698c' },
  gebruiker839: { name: 'Daan', first: 'Daan', clientId: 'CLI-1998-0839', unit: 3, accent: '#7fb069' },
  admin:        { name:'Systeembeheerder', first:'Beheer', clientId:'ADM-SYS-ROOT', unit:0, accent:'#5c9ce0' },
};

/* Passwords are deliberately client-side. This is a goodbye card
   between friends, not an authentication system — there is nothing
   behind it worth protecting. */
export const PASSWORDS = {
  gebruiker483:'Esmee123!',
  gebruiker839:'Daan123!',
  gebruiker162:'Spanje2026!',     gebruiker726:'ZW1!',
  gebruiker492:'Wateentoestand!', gebruiker892:'Tanteleo!',
  gebruiker83:'House1!',          gebruiker744:'Estherrr!',
  gebruiker56:'Viaplay!',         gebruiker729:'Veronique!',
  admin:'Poep123!',
};

export const DEFAULT_ACCENT = '#d8674a';

/* ── activity log ─────────────────────────────────────────────────
   Best-effort: private mode and quota errors are swallowed, because
   a broken log must never break the page.                          */
export function log(action, details = {}, username = null) {
  try {
    const raw = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    const logs = Array.isArray(raw) ? raw : [];
    logs.push({
      timestamp: new Date().toISOString(),
      username: username || '(anoniem)',
      action,
      details,
    });
    localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(-LOG_CAP)));
  } catch { /* no-op */ }
}

export function readLogs() {
  try {
    const l = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    return Array.isArray(l) ? l : [];
  } catch { return []; }
}

export function clearLogs() {
  try { localStorage.removeItem(LOG_KEY); } catch { /* no-op */ }
}

/* ── session ──────────────────────────────────────────────────────
   URL param wins over localStorage, so a shared link always opens
   the right person's page.                                         */
export function sessionKey() {
  const fromUrl = new URLSearchParams(window.location.search).get('user');
  let stored = null;
  try { stored = localStorage.getItem('currentUser'); } catch { /* no-op */ }
  return String(fromUrl || stored || '').toLowerCase() || null;
}

export function currentUser() {
  const k = sessionKey();
  return k && USERS[k] ? USERS[k] : null;
}

export function setSession(key) {
  try { localStorage.setItem('currentUser', key); } catch { /* no-op */ }
}

export function endSession() {
  try { localStorage.removeItem('currentUser'); } catch { /* no-op */ }
}

/* keeps ?user= on internal links so the session survives navigation */
export function withSession(path, key) {
  return key ? `${path}?user=${encodeURIComponent(key)}` : path;
}

/* ── accent ───────────────────────────────────────────────────────
   Everything else is the shared neutral ramp, so this one property
   re-skins an entire page.                                         */
export function setAccent(hex) {
  document.documentElement.style.setProperty('--accent', hex || DEFAULT_ACCENT);
}

/* ── guestbook ────────────────────────────────────────────────── */
export function readBook() {
  try {
    const b = JSON.parse(localStorage.getItem('guestbook') || '[]');
    return Array.isArray(b) ? b : [];
  } catch { return []; }
}

export function writeBook(entries) {
  try {
    localStorage.setItem('guestbook', JSON.stringify(entries.slice(-200)));
    return true;
  } catch { return false; }
}

/* ── per-user namespaced storage (meds, moments) ──────────────── */
export function loadFor(name, key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(`${name}_${key}`) || 'null');
    return Array.isArray(v) ? v : fallback;
  } catch { return fallback; }
}

export function saveFor(name, key, value) {
  try { localStorage.setItem(`${name}_${key}`, JSON.stringify(value)); } catch { /* no-op */ }
}

/* ── time formatting, nl-NL ───────────────────────────────────── */
export function relTime(iso) {
  const d = new Date(iso);
  const s = Math.floor((Date.now() - d) / 1000);
  if (Number.isNaN(s)) return '—';
  if (s < 10) return 'zojuist';
  if (s < 60) return `${s} sec geleden`;
  const m = Math.floor(s / 60); if (m < 60) return `${m} min geleden`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} uur geleden`;
  const dd = Math.floor(h / 24); if (dd < 7) return `${dd} dag${dd > 1 ? 'en' : ''} geleden`;
  return d.toLocaleDateString('nl-NL', { day:'numeric', month:'short' });
}

export function absTime(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleString('nl-NL');
}

/* ── confetti: Web Animations API, no library ─────────────────── */
export function confetti(count = 80) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue('--accent').trim() || DEFAULT_ACCENT;
  const cols = [accent, '#eef1f2', '#828d94'];
  const frag = document.createDocumentFragment();
  const made = [];

  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.style.cssText =
      `position:fixed;z-index:300;top:-14px;left:${Math.random() * 100}vw;` +
      `width:${5 + Math.random() * 6}px;height:${8 + Math.random() * 8}px;` +
      `background:${cols[i % cols.length]};border-radius:2px;` +
      `pointer-events:none;will-change:transform`;
    frag.appendChild(s);
    made.push(s);
  }
  document.body.appendChild(frag);

  made.forEach((s) => {
    s.animate(
      [
        { transform:'translate3d(0,0,0) rotate(0deg)', opacity:1 },
        { transform:`translate3d(${(Math.random() - .5) * 280}px,105vh,0) rotate(${Math.random() * 720}deg)`,
          opacity:.85 },
      ],
      { duration: 2300 + Math.random() * 1700, easing:'cubic-bezier(.2,.6,.4,1)' }
    ).onfinish = () => s.remove();
  });
}

/* ── action metadata for the admin console ────────────────────── */
export const ACTIONS = {
  page_view:          { label:'page view',          tone:'neutral' },
  auth_username_ok:   { label:'gebruiker herkend',  tone:'info' },
  auth_username_fail: { label:'gebruiker onbekend', tone:'warn' },
  login_success:      { label:'login ok',           tone:'ok' },
  login_fail:         { label:'login mislukt',      tone:'danger' },
  account_locked:     { label:'geblokkeerd',        tone:'danger' },
  letter_opened:      { label:'brief geopend',      tone:'violet' },
  connect_click:      { label:'contact',            tone:'info' },
  theme_change:       { label:'weergave',           tone:'neutral' },
  easter_egg:         { label:'easter egg',         tone:'warn' },
  guestbook_sign:     { label:'gastenboek',         tone:'ok' },
  reis_finished:      { label:'reis voltooid',      tone:'violet' },
  logout:             { label:'uitgelogd',          tone:'neutral' },
  admin_view:         { label:'beheer',             tone:'ok' },
};

export const TONE_COLOR = {
  neutral:'var(--n-600)',
  info:'#5c9ce0',
  ok:'#4ade96',
  warn:'#e8bd7a',
  danger:'#f0616e',
  violet:'#8b6bff',
};
