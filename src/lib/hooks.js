import { useEffect, useRef, useState, useCallback } from 'react';
import { confetti, log } from './ggz';

/* ── prefers-reduced-motion, live ─────────────────────────────────
   Read as state rather than once at import, so a user toggling the
   OS setting mid-session gets the fallback immediately.            */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = (e) => setReduced(e.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return reduced;
}

/* ── konami ─────────────────────────────────────────────────────── */
const KONAMI = ['arrowup','arrowup','arrowdown','arrowdown',
                'arrowleft','arrowright','arrowleft','arrowright','b','a'];

export function useKonami(onUnlock) {
  const idx = useRef(0);
  const cb = useRef(onUnlock);
  cb.current = onUnlock;

  useEffect(() => {
    const onKey = (e) => {
      if (!e.key) return;
      idx.current = e.key.toLowerCase() === KONAMI[idx.current] ? idx.current + 1 : 0;
      if (idx.current === KONAMI.length) {
        idx.current = 0;
        cb.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

/* ── click N times within a window (logo easter eggs) ──────────── */
export function useClickStreak(times, onHit, windowMs = 1200) {
  const n = useRef(0);
  const t = useRef(null);
  const cb = useRef(onHit);
  cb.current = onHit;

  useEffect(() => () => clearTimeout(t.current), []);

  return useCallback(() => {
    n.current += 1;
    clearTimeout(t.current);
    t.current = setTimeout(() => { n.current = 0; }, windowMs);
    if (n.current === times) {
      n.current = 0;
      cb.current();
    }
  }, [times, windowMs]);
}

/* ── celebrate: confetti + toast + log, the combination used by
      every easter egg on the site ─────────────────────────────── */
export function useCelebrate(toast) {
  return useCallback((message, egg, key) => {
    confetti();
    if (message) toast(message);
    if (egg) log('easter_egg', { egg }, key);
  }, [toast]);
}

/* ── a ticking clock, formatted nl-NL ─────────────────────────── */
export function useClock(intervalMs = 1000) {
  const [time, setTime] = useState(() =>
    new Date().toLocaleTimeString('nl-NL', { hour12:false }));

  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date().toLocaleTimeString('nl-NL', { hour12:false }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return time;
}

/* ── cross-tab sync for a localStorage key ────────────────────── */
export function useStorageSync(key, onChange) {
  const cb = useRef(onChange);
  cb.current = onChange;

  useEffect(() => {
    const on = (e) => { if (e.key === key) cb.current(); };
    window.addEventListener('storage', on);
    return () => window.removeEventListener('storage', on);
  }, [key]);
}

/* ── escape to dismiss ────────────────────────────────────────── */
export function useEscape(onEscape, active = true) {
  const cb = useRef(onEscape);
  cb.current = onEscape;

  useEffect(() => {
    if (!active) return undefined;
    const on = (e) => { if (e.key === 'Escape') cb.current(); };
    document.addEventListener('keydown', on);
    return () => document.removeEventListener('keydown', on);
  }, [active]);
}

/* ── focus trap for modals and listboxes ──────────────────────── */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return undefined;

    const node = ref.current;
    const prev = document.activeElement;
    const sel = 'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

    const first = node.querySelector(sel);
    if (first) first.focus();

    const onKey = (e) => {
      if (e.key !== 'Tab') return;
      const items = [...node.querySelectorAll(sel)].filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault(); lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault(); firstEl.focus();
      }
    };

    node.addEventListener('keydown', onKey);
    return () => {
      node.removeEventListener('keydown', onKey);
      if (prev && prev.focus) prev.focus();
    };
  }, [ref, active]);
}

/* ── async data with real loading and error states ─────────────
      Returns status rather than a bare boolean so the UI can show a
      skeleton, an error with retry, or the data.                  */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ status:'loading', data:null, error:null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    let alive = true;
    setState({ status:'loading', data:null, error:null });

    Promise.resolve()
      .then(() => fnRef.current())
      .then((data) => { if (alive) setState({ status:'success', data, error:null }); })
      .catch((error) => { if (alive) setState({ status:'error', data:null, error }); });

    return () => { alive = false; };
  }, []);

  useEffect(run, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return { ...state, retry: run };
}
