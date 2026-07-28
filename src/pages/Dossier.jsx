import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import {
  Button, ButtonLink, Card, Chip, Eyebrow, Prose, Reveal,
} from '../components/primitives';
import { useToast } from '../components/feedback';
import { useClickStreak, useKonami, useReducedMotion } from '../lib/hooks';
import {
  USERS, confetti, endSession, log, sessionKey, withSession,
} from '../lib/ggz';
import { LETTERS, OWN_STATEMENT } from './letters';
import './Dossier.css';

/* ══════════════════════════════════════════════════════════════════
   The dossier — one person's discharge letter.

   Progressive disclosure is the whole design here: the letter stays
   sealed until it is opened. That single tap turns a web page into
   something addressed to you, and it means the first thing on screen
   is your own name rather than a wall of text.
   ══════════════════════════════════════════════════════════════════ */

const SOCIALS = [
  { id:'ig',  href:'https://instagram.com/56isk', label:'Instagram', handle:'@56isk',
    icon:(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></>), stroke:true },
  { id:'gh',  href:'https://github.com/56snty', label:'GitHub', handle:'56snty',
    icon:(<path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49l-.01-1.72c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.86.09-.66.35-1.12.63-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.34 9.34 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9l-.01 2.82c0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />), stroke:false },
  { id:'web', href:'https://emal.dev', label:'emal.dev', handle:null,
    icon:(<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></>), stroke:true },
];

function NoSession() {
  return (
    <main className="dossier" id="main">
      <div className="center" style={{ padding:'var(--s-16) 0' }}>
        <h1 className="h2">Geen actieve sessie</h1>
        <p className="lead" style={{ margin:'var(--s-2) auto var(--s-4)' }}>
          Log opnieuw in om je dossier te bekijken.
        </p>
        <ButtonLink href="index.html">← Terug naar inloggen</ButtonLink>
      </div>
    </main>
  );
}

export default function Dossier() {
  const toast = useToast();
  const reduced = useReducedMotion();
  const [opened, setOpened] = useState(false);
  const leadRef = useRef(null);

  const key = sessionKey();
  const user = key ? USERS[key] : null;
  const letter = key ? LETTERS[key] : null;

  /* admin has no personal letter; its home is the console */
  useEffect(() => {
    if (key === 'admin') window.location.replace('admin.html');
  }, [key]);

  useEffect(() => {
    if (user && letter) log('page_view', { page:'dossier' }, key);
    else log('page_view', { page:'dossier', session:'none' }, null);
  }, [key, user, letter]);

  useKonami(() => {
    confetti();
    toast('🕹️ Cheatcode geaccepteerd.');
    log('easter_egg', { egg:'konami' }, key);
  });

  const dotClick = useClickStreak(5, () => {
    confetti();
    toast('💚 Bedankt dat je er was.');
    log('easter_egg', { egg:'sysdot5' }, key);
  });

  if (key === 'admin') return null;

  if (!user || !letter) {
    return (
      <PageShell title="Ontslagdossier">
        <NoSession />
      </PageShell>
    );
  }

  function openLetter() {
    if (opened) return;
    setOpened(true);
    log('letter_opened', {}, key);
    setTimeout(() => leadRef.current?.focus({ preventScroll:true }), reduced ? 0 : 320);
  }

  return (
    <PageShell title={`Ontslagbrief · ${user.name}`} accent={user.accent}>
      <div className="topbar">
        <div className="brandmark">
          <button type="button" className="brandmark__dot" onClick={dotClick} aria-label="Logo">
            {user.first.charAt(0)}
          </button>
          <span className="brandmark__label">Ontslagdossier</span>
        </div>
        <a
          className="pill"
          href="index.html"
          onClick={() => { endSession(); log('logout', {}, key); }}
        >
          Uitloggen →
        </a>
      </div>

      <main className="dossier" id="main">
        <header className="dossier__head">
          <Eyebrow>Ontslagdossier · Afdeling {user.unit}</Eyebrow>
          <h1 className="display dossier__greeting">
            Dag <em className="accent">{user.first}</em>.
          </h1>
          {letter.label && <p className="mono">{letter.label}</p>}

          <div className="meta">
            <Chip>{user.clientId}</Chip>
            <Chip>Afdeling {user.unit}</Chip>
            {user.bff && <Chip tone="strong">★ Beste vriend</Chip>}
            <Chip>Verblijf: 10 maanden</Chip>
            <Chip>Ontslag: 27 augustus 2026</Chip>
            <Chip tone="accent">✓ Ontslagen</Chip>
          </div>
        </header>

        <h2 className="visually-hidden">Verblijf</h2>
        <Reveal as="ol" className="timeline">
          {[
            ['Fase 01', 'Intake'],
            ['Fase 02', '10 maanden'],
            ['Fase 03', 'Ontslag'],
          ].map(([k, v]) => (
            <li className="tstep" key={k}>
              <span className="tnode" aria-hidden="true" />
              <span className="tk">{k}</span>
              <span className="tv">{v}</span>
            </li>
          ))}
        </Reveal>

        <h2 className="visually-hidden">Je ontslagbrief</h2>

        <AnimatePresence mode="wait">
          {!opened && (
            <motion.button
              key="seal"
              type="button"
              className="seal"
              onClick={openLetter}
              exit={reduced ? { opacity:0 } : { opacity:0, scale:.97 }}
              transition={{ duration:.28, ease:[0.16, 1, 0.3, 1] }}
            >
              <span className="seal__wax" aria-hidden="true">{user.first.charAt(0)}</span>
              <span className="seal__k">Je persoonlijke ontslagbrief</span>
              <span className="seal__t">tik om te openen</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {opened && (
            <motion.article
              key="letter"
              className="letter"
              initial={reduced ? false : { opacity:0, y:16 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:.6, ease:[0.16, 1, 0.3, 1] }}
            >
              <p className="letter__lead" ref={leadRef} tabIndex={-1}>
                Beste {user.first},
              </p>

              <Reveal delay={0.06}>
                <Prose dropCap>{letter.msg}</Prose>
              </Reveal>

              <Reveal delay={0.12}>
                <div className="letter__sign">
                  <div className="letter__sig">56</div>
                  <div className="letter__sigmeta">Emal · lowkey</div>
                </div>
              </Reveal>

              <Reveal>
                <Card className="block" elevation="raised">
                  <div className="pov__tag">
                    <span>Behandelverslag · ingevuld door de patiënt zelf</span>
                    <span>Dossier 56</span>
                  </div>
                  <h2 className="h3">Mijn kant van het verhaal</h2>
                  <Prose className="pov__prose">{OWN_STATEMENT}</Prose>
                  <p className="pov__sig">— Emal</p>
                </Card>
              </Reveal>

              <Reveal>
                <Card className="block" elevation="raised">
                  <h2 className="h3">Blijf in contact na OPSY</h2>
                  <p className="muted dossier__connectsub">
                    De muren zijn tijdelijk, jij niet. Voor als je zin hebt om te appen,
                    te delen of gewoon hoi te zeggen:
                  </p>
                  <div className="links">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.id}
                        className="link"
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => log('connect_click', { platform:s.id }, key)}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill={s.stroke ? 'none' : 'currentColor'}
                          stroke={s.stroke ? 'currentColor' : undefined}
                          strokeWidth={s.stroke ? 2 : undefined}
                          aria-hidden="true"
                        >
                          {s.icon}
                        </svg>
                        {s.label}
                        {s.handle && <span className="link__handle">{s.handle}</span>}
                      </a>
                    ))}
                  </div>
                </Card>
              </Reveal>

              <Reveal>
                <nav className="nextup" aria-label="Verder lezen">
                  <ButtonLink href={withSession('reis.html', key)}>Lees de reis →</ButtonLink>
                  <ButtonLink variant="ghost" href={withSession('gastenboek.html', key)}>
                    Teken het gastenboek
                  </ButtonLink>
                  <ButtonLink variant="ghost" href={withSession('medicijnen.html', key)}>
                    Mijn dossier
                  </ButtonLink>
                </nav>
              </Reveal>
            </motion.article>
          )}
        </AnimatePresence>

        <p className="foot">
          Patiënt Informatiesysteem · Dossier {user.clientId} ·{' '}
          <button
            type="button"
            className="secret"
            title="tik voor een geheimpje"
            onClick={() => {
              toast(`🔑 Psst ${user.first}, je code was: ${key}`);
              log('easter_egg', { egg:'secret_id' }, key);
            }}
          >
            status: ontslagen
          </button>
          <br />
          Met dank aan iedereen die deze tien maanden dragelijk maakte.
        </p>
      </main>
    </PageShell>
  );
}
