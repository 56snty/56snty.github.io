import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEscape, useFocusTrap } from '../lib/hooks';
import { Button } from './primitives';
import './feedback.css';

/* ══════════════════════════════════════════════════════════════════
   Feedback — Skeleton, EmptyState, ErrorState, Toast, Modal, Select.
   These are the states a UI spends most of its life in, so they get
   the same care as the happy path.
   ══════════════════════════════════════════════════════════════════ */

/* ── Skeleton ─────────────────────────────────────────────────────
   Shows the *shape* of the content that is coming, so the layout
   does not jump when it arrives. That is the CLS win: the skeleton
   reserves the same box the real content will occupy.              */
export function Skeleton({ w = '100%', h = 16, radius = 'var(--r-sm)', className = '' }) {
  return (
    <span
      className={`skeleton ${className}`}
      style={{ width:w, height:typeof h === 'number' ? `${h}px` : h, borderRadius:radius }}
      aria-hidden="true"
    />
  );
}

/* A few lines of text, last one short — reads as a paragraph. */
export function SkeletonText({ lines = 3 }) {
  return (
    <span className="skeleton-stack" aria-hidden="true">
      {Array.from({ length:lines }, (_, i) => (
        <Skeleton key={i} w={i === lines - 1 ? '62%' : '100%'} h={14} />
      ))}
    </span>
  );
}

/* Mirrors the admin log row grid so rows do not shift on load. */
export function SkeletonRows({ rows = 6 }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length:rows }, (_, i) => (
        <div className="skeleton-row" key={i}>
          <Skeleton w="72px" h={12} />
          <Skeleton w="96px" h={18} radius="var(--r-sm)" />
          <Skeleton w={`${45 + ((i * 13) % 40)}%`} h={12} />
        </div>
      ))}
    </div>
  );
}

/* Screen-reader users get a polite announcement instead of shapes. */
export function LoadingRegion({ label = 'Bezig met laden', children }) {
  return (
    <div role="status" aria-live="polite">
      <span className="visually-hidden">{label}</span>
      {children}
    </div>
  );
}

/* ── EmptyState ───────────────────────────────────────────────────
   An empty list is a moment to explain and invite, not a blank box. */
export function EmptyState({ icon, title, body, action }) {
  return (
    <div className="state state--empty">
      {icon && <div className="state__icon" aria-hidden="true">{icon}</div>}
      <p className="h3">{title}</p>
      {body && <p className="state__body">{body}</p>}
      {action && <div className="state__action">{action}</div>}
    </div>
  );
}

/* ── ErrorState ───────────────────────────────────────────────────
   Always offers the way out (retry), never blames the user, and
   never shows a raw stack trace.                                   */
export function ErrorState({ title = 'Er ging iets mis', body, onRetry, retryLabel = 'Opnieuw proberen' }) {
  return (
    <div className="state state--error" role="alert">
      <div className="state__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="22" height="22">
          <circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" strokeLinecap="round" />
        </svg>
      </div>
      <p className="h3">{title}</p>
      {body && <p className="state__body">{body}</p>}
      {onRetry && (
        <div className="state__action">
          <Button variant="ghost" onClick={onRetry}>{retryLabel}</Button>
        </div>
      )}
    </div>
  );
}

/* ── Toast ────────────────────────────────────────────────────────
   Context so any component can call toast() without prop drilling.
   Framer handles enter/exit; aria-live announces without stealing
   focus.                                                           */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setItems((cur) => cur.filter((t) => t.id !== id));
    const t = timers.current.get(id);
    if (t) { clearTimeout(t); timers.current.delete(id); }
  }, []);

  const toast = useCallback((message, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    const ttl = opts.duration ?? 3600;
    setItems((cur) => [...cur, { id, message, tone:opts.tone || 'default' }]);
    timers.current.set(id, setTimeout(() => dismiss(id), ttl));
    return id;
  }, [dismiss]);

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              className={`toast toast--${t.tone}`}
              initial={{ opacity:0, y:24, scale:.96 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:12, scale:.97 }}
              transition={{ duration:.32, ease:[0.16, 1, 0.3, 1] }}
              onClick={() => dismiss(t.id)}
            >
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ── Modal ────────────────────────────────────────────────────────
   Focus is trapped while open and restored on close; Escape and
   backdrop both dismiss. Scroll is locked so the page behind does
   not move under the dialog.                                       */
export function Modal({ open, onClose, title, children, actions }) {
  const ref = useRef(null);
  const titleId = useId();

  useEscape(onClose, open);
  useFocusTrap(ref, open);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:.2 }}
          onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            ref={ref}
            className="modal__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ opacity:0, y:18, scale:.97 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:10, scale:.98 }}
            transition={{ duration:.28, ease:[0.16, 1, 0.3, 1] }}
          >
            <h2 className="h3" id={titleId}>{title}</h2>
            <div className="modal__body">{children}</div>
            <div className="modal__actions">{actions}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Select ───────────────────────────────────────────────────────
   Custom listbox following the WAI-ARIA combobox pattern: full
   keyboard support (arrows, Home/End, Enter, Escape, type-ahead),
   proper roles, and aria-activedescendant so screen readers track
   the highlighted option. A native <select> cannot be styled to
   match the rest of the system, which is the only reason to replace
   it — so it must not lose any behaviour.                          */
export function Select({ label, value, onChange, options, id: idProp, hint }) {
  const reactId = useId();
  const id = idProp || reactId;
  const listId = `${id}-list`;

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const typeahead = useRef({ str:'', t:null });

  const selectedIdx = useMemo(
    () => Math.max(0, options.findIndex((o) => o.value === value)),
    [options, value]
  );
  const selected = options[selectedIdx] || options[0];

  const openList = useCallback(() => { setActive(selectedIdx); setOpen(true); }, [selectedIdx]);
  const closeList = useCallback((focusBtn = true) => {
    setOpen(false);
    if (focusBtn && btnRef.current) btnRef.current.focus();
  }, []);

  const commit = useCallback((idx) => {
    const opt = options[idx];
    if (opt) onChange(opt.value);
    closeList();
  }, [options, onChange, closeList]);

  useEscape(() => closeList(), open);

  // close on outside click
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!listRef.current || listRef.current.contains(e.target)) return;
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  // keep the active option scrolled into view
  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${active}"]`);
    if (el) el.scrollIntoView({ block:'nearest' });
  }, [open, active]);

  const onKeyDown = (e) => {
    // jump to an option by typing its first letters
    if (e.key.length === 1 && /\S/.test(e.key)) {
      const ta = typeahead.current;
      clearTimeout(ta.t);
      ta.str += e.key.toLowerCase();
      ta.t = setTimeout(() => { ta.str = ''; }, 600);
      const hit = options.findIndex((o) => o.label.toLowerCase().startsWith(ta.str));
      if (hit >= 0) { if (open) setActive(hit); else onChange(options[hit].value); }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case 'Home': if (open) { e.preventDefault(); setActive(0); } break;
      case 'End':  if (open) { e.preventDefault(); setActive(options.length - 1); } break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (open) commit(active); else openList();
        break;
      case 'Tab': if (open) setOpen(false); break;
      default: break;
    }
  };

  return (
    <div className="field-group">
      {label && <label className="label" htmlFor={id}>{label}</label>}

      <div className="select">
        <button
          ref={btnRef}
          id={id}
          type="button"
          className={`field select__button${open ? ' is-open' : ''}`}
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          onClick={() => (open ? closeList(false) : openList())}
          onKeyDown={onKeyDown}
        >
          <span className="select__value">{selected ? selected.label : ''}</span>
          <motion.span
            className="select__chevron"
            aria-hidden="true"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration:.2, ease:[0.22, .61, .36, 1] }}
          >
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M3 5l4 4 4-4" />
            </svg>
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id={listId}
              className="select__list"
              role="listbox"
              aria-labelledby={id}
              tabIndex={-1}
              initial={{ opacity:0, y:-6, scale:.985 }}
              animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:-4, scale:.99 }}
              transition={{ duration:.18, ease:[0.22, .61, .36, 1] }}
              onKeyDown={onKeyDown}
            >
              {options.map((o, i) => (
                <li
                  key={o.value}
                  id={`${id}-opt-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={o.value === value}
                  className={`select__option${i === active ? ' is-active' : ''}${o.value === value ? ' is-selected' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => { e.preventDefault(); commit(i); }}
                >
                  <span>{o.label}</span>
                  {o.value === value && (
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none"
                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                         strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8.5l3.2 3.2L13 5" />
                    </svg>
                  )}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
