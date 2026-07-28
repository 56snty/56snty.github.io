import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageShell from '../components/PageShell';
import { ButtonLink, Eyebrow } from '../components/primitives';
import { useToast } from '../components/feedback';
import { useReducedMotion } from '../lib/hooks';
import { USERS, confetti, log, sessionKey, withSession } from '../lib/ggz';
import { CHAPTERS, FINALE_TEXT, HERO_SUB } from './letters';
import './Reis.css';

/* ══════════════════════════════════════════════════════════════════
   De reis — ten months as one scroll.

   The hero is full-viewport with a single dominant headline and a
   staggered entrance, then parallaxes and fades as you scroll past.
   Each chapter reveals once on entry. The rail on the left is both
   a progress indicator and a jump target.
   ══════════════════════════════════════════════════════════════════ */

const MONTHS = [...CHAPTERS.map((c) => c.month), '27 AUG'];
const TARGET = new Date(2026, 7, 27);   // months are 0-based, 7 = augustus

function countdownText(days) {
  if (days > 1)  return { pre:'nog ', n:days, post:' dagen tot buiten' };
  if (days === 1) return { pre:'nog ', n:1, post:' dag. Morgen.' };
  if (days === 0) return { pre:'', n:'Vandaag.', post:' De deur staat open.' };
  return { pre:'hij is buiten ', n:'✦', post:'' };
}

export default function Reis() {
  const toast = useToast();
  const reduced = useReducedMotion();
  const heroRef = useRef(null);
  const sectionRefs = useRef([]);

  const [active, setActive] = useState(-1);
  const [days, setDays] = useState(() => Math.ceil((TARGET - new Date()) / 86400000));

  const key = sessionKey();
  const user = key ? USERS[key] : null;

  /* hero parallax: transform + opacity only, driven by scroll offset */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  /* page-wide progress bar */
  const { scrollYProgress: pageProgress } = useScroll();

  useEffect(() => { log('page_view', { page:'reis' }, key); }, [key]);

  useEffect(() => {
    const id = setInterval(() => {
      setDays(Math.ceil((TARGET - new Date()) / 86400000));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  /* which month is on screen */
  useEffect(() => {
    const els = sectionRefs.current.filter(Boolean);
    if (!els.length) return undefined;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = els.indexOf(e.target);
        if (i >= 0) setActive(i);
        if (e.target.id === 'finale' && !window.__reisDone) {
          window.__reisDone = true;
          log('reis_finished', {}, key);
        }
      });
    }, { threshold:0.45 });

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [key]);

  const cd = useMemo(() => countdownText(days), [days]);

  function jumpTo(i) {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block:'center',
    });
  }

  function celebrate() {
    confetti();
    toast('✦ Tot buiten.');
    log('easter_egg', { egg:'bigdate' }, key);
  }

  return (
    <PageShell title="De reis · oktober 2025 tot 27 augustus 2026" accent={user?.accent} skipTo="#chapters">
      <motion.div className="progress" style={{ scaleX:pageProgress }} aria-hidden="true" />

      <div className="railbar">
        <div className="topbar">
          <div className="brandmark">
            <span className="brandmark__dot" aria-hidden="true">56</span>
            <span className="brandmark__label">Behandelverloop</span>
          </div>
          <a className="pill" href={user ? withSession('units.html', key) : 'index.html'}>
            ← Dossier
          </a>
        </div>
      </div>

      <nav aria-label="Maanden">
        <ul className="rail">
          {MONTHS.map((m, i) => (
            <li key={m}>
              <button
                type="button"
                className={`rdot${i === active ? ' is-active' : ''}`}
                data-m={m}
                aria-label={`Ga naar ${m}`}
                aria-current={i === active ? 'true' : undefined}
                onClick={() => jumpTo(i)}
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <header className="hero" ref={heroRef}>
        <motion.div
          className="hero__inner"
          style={reduced ? undefined : { y:heroY, opacity:heroOpacity }}
        >
          {[
            <Eyebrow key="e">Behandelverloop · dossier 56</Eyebrow>,
            <h1 key="h" className="display hero__title">De <em className="accent">reis</em></h1>,
            <p key="s" className="lead hero__sub">{HERO_SUB}</p>,
            <p key="d" className="hero__dates">OKT 2025 → 27 AUG 2026</p>,
          ].map((child, i) => (
            <motion.div
              key={child.key}
              initial={reduced ? false : { opacity:0, y:24 }}
              animate={{ opacity:1, y:0 }}
              transition={{
                duration:0.82,
                delay:0.08 + i * 0.1,
                ease:[0.16, 1, 0.3, 1],
              }}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="hero__cue"
          aria-hidden="true"
          initial={reduced ? false : { opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ duration:0.8, delay:0.9 }}
        >
          <span className="hero__cue-line" />
          <span>scroll</span>
        </motion.div>
      </header>

      {/* ══ DE MAANDEN ════════════════════════════════════════════ */}
      <main id="chapters">
        {CHAPTERS.map((c, i) => (
          <section
            className="chapter"
            key={c.stage}
            ref={(el) => { sectionRefs.current[i] = el; }}
          >
            <motion.p
              className="chapter__k"
              initial={reduced ? false : { opacity:0, y:16 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.7, ease:[0.16, 1, 0.3, 1] }}
            >
              {c.k}
            </motion.p>
            <motion.h2
              className="h2 chapter__title"
              initial={reduced ? false : { opacity:0, y:18 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.7, delay:0.08, ease:[0.16, 1, 0.3, 1] }}
            >
              {c.title}
            </motion.h2>
            <motion.p
              className="prose"
              initial={reduced ? false : { opacity:0, y:18 }}
              whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.7, delay:0.16, ease:[0.16, 1, 0.3, 1] }}
            >
              {c.body}
            </motion.p>
            <motion.div
              className="chapter__rule"
              aria-hidden="true"
              initial={reduced ? false : { opacity:0, scaleX:0 }}
              whileInView={{ opacity:.5, scaleX:1 }}
              viewport={{ once:true, amount:0.2 }}
              transition={{ duration:0.6, delay:0.24, ease:[0.16, 1, 0.3, 1] }}
            />
          </section>
        ))}

        <section
          className="finale"
          id="finale"
          ref={(el) => { sectionRefs.current[CHAPTERS.length] = el; }}
        >
          <motion.div
            initial={reduced ? false : { opacity:0, y:20 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true, amount:0.3 }}
            transition={{ duration:0.8, ease:[0.16, 1, 0.3, 1] }}
          >
            <Eyebrow>Ontslag</Eyebrow>
            <h2
              className="display bigdate"
              role="button"
              tabIndex={0}
              aria-label="27 augustus 2026"
              onClick={celebrate}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); celebrate(); }
              }}
            >
              27 <em className="accent">augustus</em> 2026
            </h2>
            <p className="lead center finale__out">{FINALE_TEXT}</p>
            <p className="countpill">
              {cd.pre}<b>{cd.n}</b>{cd.post}
            </p>
            <div className="row row--center finale__cta">
              <ButtonLink href={withSession('gastenboek.html', key)}>
                Teken het gastenboek
              </ButtonLink>
              <ButtonLink
                variant="ghost"
                href={user ? withSession('units.html', key) : 'index.html'}
              >
                Naar je dossier
              </ButtonLink>
            </div>
          </motion.div>
        </section>
      </main>

      <p className="foot">
        Patiënt Informatiesysteem · Behandelverloop dossier 56<br />
        gemaakt door 56 · @56isk · github.com/56snty
      </p>
    </PageShell>
  );
}
