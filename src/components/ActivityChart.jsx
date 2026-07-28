import { useId, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../lib/hooks';
import './ActivityChart.css';

/* ══════════════════════════════════════════════════════════════════
   ActivityChart — events per day, inline SVG, no charting library.

   Bars rather than a line: the data is a count per discrete day, and
   bars encode "how many in this bucket" honestly. A line would imply
   a continuous signal between days that does not exist.

   The y-axis starts at zero. Cropping it would exaggerate small
   differences, which on a log of nine people is most of the data.
   ══════════════════════════════════════════════════════════════════ */

const DAY_MS = 86400000;
const DAY_LABEL = ['zo','ma','di','wo','do','vr','za','zo'];

function buildBuckets(logs, days) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const buckets = Array.from({ length:days }, (_, i) => {
    const d = new Date(start.getTime() - (days - 1 - i) * DAY_MS);
    return { date:d, count:0 };
  });

  logs.forEach((l) => {
    const t = new Date(l.timestamp);
    if (Number.isNaN(t.getTime())) return;
    const day = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    const idx = days - 1 - Math.round((start - day) / DAY_MS);
    if (idx >= 0 && idx < days) buckets[idx].count += 1;
  });

  return buckets;
}

export default function ActivityChart({ logs, days = 14, height = 132 }) {
  const reduced = useReducedMotion();
  const gradId = useId();
  const [hover, setHover] = useState(null);

  const buckets = useMemo(() => buildBuckets(logs, days), [logs, days]);
  const max = Math.max(1, ...buckets.map((b) => b.count));
  const total = buckets.reduce((s, b) => s + b.count, 0);

  // geometry in a fixed viewBox; SVG scales it to the container
  const W = 560;
  const H = height;
  const padB = 22;         // room for day labels
  const plotH = H - padB;
  const gap = 6;
  const barW = (W - gap * (buckets.length - 1)) / buckets.length;

  if (total === 0) {
    return (
      <div className="chart chart--empty">
        <p className="chart__emptytext">Nog geen activiteit om te tonen.</p>
      </div>
    );
  }

  return (
    <figure className="chart">
      <figcaption className="visually-hidden">
        Gebeurtenissen per dag over de laatste {days} dagen. Totaal {total}.
      </figcaption>

      <svg
        className="chart__svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Staafdiagram: ${total} gebeurtenissen over ${days} dagen`}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity=".95" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity=".35" />
          </linearGradient>
        </defs>

        {/* baseline */}
        <line
          x1="0" y1={plotH + .5} x2={W} y2={plotH + .5}
          stroke="var(--line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke"
        />

        {buckets.map((b, i) => {
          const h = b.count === 0 ? 2 : Math.max(3, (b.count / max) * (plotH - 8));
          const x = i * (barW + gap);
          const y = plotH - h;
          const isHover = hover === i;

          return (
            <g key={b.date.toISOString()}>
              {/* generous invisible hit area, so hover works on thin bars */}
              <rect
                x={x} y={0} width={barW} height={plotH}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
              <motion.rect
                x={x} width={barW} rx="3"
                fill={b.count === 0 ? 'var(--n-300)' : `url(#${gradId})`}
                opacity={isHover ? 1 : .88}
                initial={reduced ? false : { y:plotH, height:0 }}
                animate={{ y, height:h }}
                transition={{
                  duration:.55,
                  delay:reduced ? 0 : i * 0.022,
                  ease:[0.16, 1, 0.3, 1],
                }}
                style={{ pointerEvents:'none' }}
              />
            </g>
          );
        })}

        {/* day labels, thinned on small ranges to avoid collisions */}
        {buckets.map((b, i) => {
          const show = buckets.length <= 8 || i % 2 === 1 || i === buckets.length - 1;
          if (!show) return null;
          return (
            <text
              key={`l-${b.date.toISOString()}`}
              x={i * (barW + gap) + barW / 2}
              y={H - 6}
              textAnchor="middle"
              className="chart__label"
            >
              {DAY_LABEL[b.date.getDay()]}
            </text>
          );
        })}
      </svg>

      <div className="chart__readout" aria-live="polite">
        {hover !== null ? (
          <>
            <strong>{buckets[hover].count}</strong>
            {' '}
            {buckets[hover].count === 1 ? 'gebeurtenis' : 'gebeurtenissen'}
            {' · '}
            {buckets[hover].date.toLocaleDateString('nl-NL', { day:'numeric', month:'short' })}
          </>
        ) : (
          <>
            <strong>{total}</strong> gebeurtenissen in {days} dagen
          </>
        )}
      </div>
    </figure>
  );
}
