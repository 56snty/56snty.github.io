import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './primitives.css';

/* ══════════════════════════════════════════════════════════════════
   Primitives — Button, Card, Field, Pill, Chip, Eyebrow, headings.
   Every one reads from tokens.css; none hardcodes a colour or size.
   ══════════════════════════════════════════════════════════════════ */

/* ── Button ───────────────────────────────────────────────────────
   variant: primary | ghost | quiet | danger
   Hover lifts 2px and deepens the shadow; active drops it back. Both
   are transform/opacity only, so they never trigger layout.        */
export const Button = forwardRef(function Button(
  { variant = 'primary', block, className = '', children, ...rest }, ref
) {
  return (
    <button
      ref={ref}
      type="button"
      className={`btn btn--${variant}${block ? ' btn--block' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
});

/* anchor styled as a button, for real navigation */
export function ButtonLink({ variant = 'primary', block, className = '', children, ...rest }) {
  return (
    <a className={`btn btn--${variant}${block ? ' btn--block' : ''} ${className}`} {...rest}>
      {children}
    </a>
  );
}

/* ── Card ─────────────────────────────────────────────────────────
   elevation: flat | raised | floating. `interactive` adds the hover
   lift, and is only used where the whole card is clickable.        */
export function Card({
  elevation = 'raised', interactive, as: Tag = 'section',
  className = '', children, ...rest
}) {
  return (
    <Tag
      className={`card card--${elevation}${interactive ? ' card--interactive' : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, action, id }) {
  return (
    <div className="card__header">
      <h2 className="h3" id={id}>{title}</h2>
      {action}
    </div>
  );
}

/* ── Field ────────────────────────────────────────────────────────
   Label is always rendered and always tied to the control, so every
   input has an accessible name without relying on placeholders.    */
export const Field = forwardRef(function Field(
  { label, id, hint, error, as = 'input', className = '', ...rest }, ref
) {
  const Tag = as;
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;

  return (
    <div className="field-group">
      <label className="label" htmlFor={id}>{label}</label>
      <Tag
        ref={ref}
        id={id}
        className={`field${error ? ' field--error' : ''} ${className}`}
        aria-describedby={[hintId, errId].filter(Boolean).join(' ') || undefined}
        aria-invalid={error ? 'true' : undefined}
        {...rest}
      />
      {hint && !error && <p className="field__hint" id={hintId}>{hint}</p>}
      {error && <p className="field__error" id={errId} role="alert">{error}</p>}
    </div>
  );
});

/* ── Pill: small secondary action or nav chip ─────────────────── */
export function Pill({ as: Tag = 'button', active, tone, className = '', children, ...rest }) {
  const extra = [
    active ? 'pill--active' : '',
    tone ? `pill--${tone}` : '',
  ].filter(Boolean).join(' ');

  return (
    <Tag
      className={`pill ${extra} ${className}`}
      {...(Tag === 'button' ? { type:'button' } : {})}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/* ── Chip: read-only metadata ─────────────────────────────────── */
export function Chip({ tone = 'default', children }) {
  return <span className={`chip chip--${tone}`}>{children}</span>;
}

/* ── typography helpers ───────────────────────────────────────── */
export function Eyebrow({ children, className = '' }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function Lead({ children, className = '' }) {
  return <p className={`lead ${className}`}>{children}</p>;
}

/* Prose keeps whitespace, because the letters are written with real
   paragraph breaks and must render exactly as typed. */
export function Prose({ children, className = '', dropCap }) {
  return (
    <div className={`prose${dropCap ? ' prose--dropcap' : ''} ${className}`}>
      {children}
    </div>
  );
}

/* ── Skip link ────────────────────────────────────────────────── */
export function SkipLink({ href = '#main' }) {
  return <a className="skip-link" href={href}>Naar de inhoud</a>;
}

/* ── ambient background: one accent wash plus film grain ──────── */
export function Ambient() {
  return (
    <>
      <div className="wash" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
    </>
  );
}

/* ── Stagger helpers ──────────────────────────────────────────────
   Shared Framer variants so entrance timing is identical everywhere:
   80ms between children, 760ms each, on the site's easing curve.   */
export const stagger = {
  hidden: {},
  show: { transition:{ staggerChildren:0.08, delayChildren:0.06 } },
};

export const riseIn = {
  hidden: { opacity:0, y:20 },
  show: {
    opacity:1, y:0,
    transition:{ duration:0.76, ease:[0.16, 1, 0.3, 1] },
  },
};

/* A section that reveals once when scrolled into view. Wraps the
   IntersectionObserver behaviour in Framer's `whileInView`. */
export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity:0, y:18 }}
      whileInView={{ opacity:1, y:0 }}
      viewport={{ once:true, amount:0.2, margin:'0px 0px -8% 0px' }}
      transition={{ duration:0.76, ease:[0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  );
}
