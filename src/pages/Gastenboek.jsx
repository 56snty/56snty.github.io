import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import { Button, Card, Eyebrow, Field, Pill } from '../components/primitives';
import { EmptyState, useToast } from '../components/feedback';
import { useReducedMotion, useStorageSync } from '../lib/hooks';
import {
  USERS, log, readBook, relTime, sessionKey, withSession, writeBook,
} from '../lib/ggz';
import './Gastenboek.css';

/* ══════════════════════════════════════════════════════════════════
   Gastenboek — the visitor register, reversed.

   Text is rendered as text, never as HTML: these are free-form
   messages from other people, and the only safe assumption is that
   whatever arrives is not markup.
   ══════════════════════════════════════════════════════════════════ */

const MAX = 600;

export default function Gastenboek() {
  const toast = useToast();
  const reduced = useReducedMotion();

  const key = sessionKey();
  const user = key ? USERS[key] : null;

  const [entries, setEntries] = useState(() => readBook());
  const [name, setName] = useState(() => (user && key !== 'admin' ? user.name : ''));
  const [message, setMessage] = useState('');
  const [nameError, setNameError] = useState('');

  const refresh = useCallback(() => setEntries(readBook()), []);
  useStorageSync('guestbook', refresh);

  useEffect(() => { log('page_view', { page:'gastenboek' }, key); }, [key]);

  function sign() {
    const n = name.trim();
    const m = message.trim();

    if (!n) {
      setNameError('Vul even je naam in, anders weet ik niet wie ik moet missen.');
      return;
    }
    setNameError('');

    if (!m) {
      toast('Een leeg register telt niet. Schrijf iets liefs. Of iets geks.');
      return;
    }

    const next = [...readBook(), {
      name:n,
      msg:m,
      user:(key && USERS[key]) ? key : null,
      ts:new Date().toISOString(),
    }];

    if (!writeBook(next)) {
      toast('Opslaan lukte niet op dit apparaat.', { tone:'error' });
      return;
    }

    log('guestbook_sign', { name:n }, key);
    setMessage('');
    setEntries(next);
    toast('Getekend. Dankjewel ♥', { tone:'ok' });
  }

  function remove(ts) {
    if (!window.confirm('Dit bericht verwijderen?')) return;
    const next = readBook().filter((x) => x.ts !== ts);
    writeBook(next);
    setEntries(next);
  }

  function exportBook() {
    const blob = new Blob([JSON.stringify(readBook(), null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `gastenboek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const shown = [...entries].reverse();   // newest first

  return (
    <PageShell title="Gastenboek · Bezoekersregister" accent={user?.accent} skipTo="#register">
      <div className="topbar">
        <div className="brandmark">
          <span className="brandmark__dot" aria-hidden="true">G</span>
          <span className="brandmark__label">Bezoekersregister</span>
        </div>
        <a className="pill" href={user ? withSession('units.html', key) : 'index.html'}>
          ← Dossier
        </a>
      </div>

      <main className="gb">
        <header className="gb__head">
          <Eyebrow>Registratie verplicht · zegt het systeem</Eyebrow>
          <h1 className="display gb__title">Gasten<em className="accent">boek</em></h1>
          <p className="lead">
            Tien maanden lang hield deze plek alles van mij bij. Nu draaien we het om:
            dit is de enige registratie die ík bewaar, jullie woorden, voor onderweg.
          </p>
        </header>

        <Card id="register" elevation="floating" aria-labelledby="registerTitle">
          <h2 className="visually-hidden" id="registerTitle">Teken het gastenboek</h2>
          <div className="register__k">
            <span>Formulier GB-56</span>
            <span>Invullen in blokletters mag, hoeft niet</span>
          </div>

          <Field
            id="gname"
            label="Naam"
            maxLength={40}
            autoComplete="name"
            placeholder="Wie ben je?"
            value={name}
            error={nameError}
            onChange={(e) => { setName(e.target.value); if (nameError) setNameError(''); }}
          />

          <Field
            as="textarea"
            id="gmsg"
            label="Bericht voor Emal"
            maxLength={MAX}
            placeholder="Een herinnering, een wens, Alles mag."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <p className="counter" aria-live="polite">
            <span className={message.length > MAX - 60 ? 'is-near' : ''}>{message.length}</span> / {MAX}
          </p>

          <Button block onClick={sign} className="gb__signbtn">
            Onderteken het register
          </Button>
          <p className="devicenote">
            Berichten worden bewaard op dit apparaat, teken dus op het toestel van 56 zelf.
          </p>
        </Card>

        <section className="gb__wall" aria-labelledby="wallTitle">
          <div className="wallhead">
            <h2 className="h3" id="wallTitle">Het register</h2>
            <span className="mono">
              {shown.length} {shown.length === 1 ? 'handtekening' : 'handtekeningen'}
            </span>
          </div>

          {key === 'admin' && (
            <div className="adminrow">
              <Pill onClick={exportBook}>⬇ exporteer gastenboek</Pill>
            </div>
          )}

          {shown.length === 0 ? (
            <EmptyState
              icon="✍"
              title="Nog niemand heeft getekend."
              body="Wees de eerste, eeuwige roem in het logboek gegarandeerd."
            />
          ) : (
            <ul>
              <AnimatePresence initial={false}>
                {shown.map((item) => (
                  <motion.li
                    key={item.ts}
                    className="entry"
                    layout={!reduced}
                    initial={reduced ? false : { opacity:0, y:12, scale:.99 }}
                    animate={{ opacity:1, y:0, scale:1 }}
                    exit={{ opacity:0, scale:.97 }}
                    transition={{ duration:.4, ease:[0.16, 1, 0.3, 1] }}
                  >
                    <span
                      className="entry__stamp"
                      style={item.user && USERS[item.user]
                        ? { background:USERS[item.user].accent }
                        : undefined}
                      aria-hidden="true"
                    >
                      {(item.name || '?').trim().charAt(0).toUpperCase() || '?'}
                    </span>

                    <div className="entry__body">
                      <div className="entry__who">
                        <span className="entry__name">{item.name || 'Anoniem'}</span>
                        <span className="entry__when">{relTime(item.ts)}</span>
                      </div>
                      <div className="entry__msg">{item.msg || ''}</div>
                    </div>

                    {key === 'admin' && (
                      <button
                        type="button"
                        className="entry__del"
                        aria-label={`Bericht van ${item.name || 'Anoniem'} verwijderen`}
                        title="Verwijderen"
                        onClick={() => remove(item.ts)}
                      >
                        ✕
                      </button>
                    )}
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </section>

        <p className="foot">
          Patiënt Informatiesysteem · Register GB-56<br />
          blijf in contact:{' '}
          <a href="https://instagram.com/56isk" target="_blank" rel="noopener noreferrer">@56isk</a> ·{' '}
          <a href="https://github.com/56snty" target="_blank" rel="noopener noreferrer">github.com/56snty</a> ·{' '}
          <a href="https://emal.dev" target="_blank" rel="noopener noreferrer">emal.dev</a>
        </p>
      </main>
    </PageShell>
  );
}
