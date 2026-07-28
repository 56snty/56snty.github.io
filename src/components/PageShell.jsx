import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Ambient, SkipLink } from './primitives';
import { ToastProvider } from './feedback';
import { useReducedMotion } from '../lib/hooks';
import { setAccent, DEFAULT_ACCENT } from '../lib/ggz';

/* ══════════════════════════════════════════════════════════════════
   PageShell — one wrapper every page mounts inside.
   Owns the ambient background, toast region, skip link, the accent
   for the current user, and the page-transition animation.

   These are six separate documents rather than an SPA, so the
   "transition" is an entrance animation plus a short fade-out on the
   way to the next page. It gives the flow continuity without giving
   up shareable URLs or making people download all six pages.
   ══════════════════════════════════════════════════════════════════ */

/* Fades the current document out, then follows the link. Runs on a
   real <a> so middle-click, ctrl-click and "open in new tab" keep
   working — we only intercept a plain left click. */
function useExitTransition(enabled) {
  useEffect(() => {
    if (!enabled) return undefined;

    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const a = e.target.closest('a[href]');
      if (!a) return;
      if (a.target === '_blank' || a.hasAttribute('download')) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (!url.pathname.endsWith('.html') && url.pathname !== '/') return;
      if (url.href === window.location.href) return;

      e.preventDefault();
      const root = document.getElementById('root');
      if (root) {
        root.style.transition = 'opacity 180ms cubic-bezier(.22,.61,.36,1)';
        root.style.opacity = '0';
      }
      setTimeout(() => { window.location.href = url.href; }, 170);
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [enabled]);
}

export default function PageShell({
  accent, title, skipTo = '#main', children, wide = false,
}) {
  const reduced = useReducedMotion();
  useExitTransition(!reduced);

  useEffect(() => { setAccent(accent || DEFAULT_ACCENT); }, [accent]);
  useEffect(() => { if (title) document.title = title; }, [title]);

  return (
    <ToastProvider>
      <SkipLink href={skipTo} />
      <Ambient />
      <motion.div
        className="page"
        initial={reduced ? false : { opacity:0, y:8 }}
        animate={{ opacity:1, y:0 }}
        transition={{ duration:.42, ease:[0.16, 1, 0.3, 1] }}
      >
        <div className={`container${wide ? '' : ' container--narrow'}`}>
          {children}
        </div>
      </motion.div>
    </ToastProvider>
  );
}
