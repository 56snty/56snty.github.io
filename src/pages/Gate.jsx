import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button, Chip, Eyebrow, Field } from '../components/primitives';
import { Select, useToast } from '../components/feedback';
import { useClickStreak, useKonami, useReducedMotion } from '../lib/hooks';
import {
  USERS, PASSWORDS, DEFAULT_ACCENT,
  log, setAccent, setSession, confetti,
} from '../lib/ggz';
import './Gate.css';

/* ══════════════════════════════════════════════════════════════════
   The gate.

   UX notes on the two-step flow, which is kept from the original:
   asking for the username first lets the page greet the person by
   name before asking for a password. On a goodbye card that warmth
   is the entire point, and it also means a typo in the username is
   caught before someone starts guessing passwords.

   The page re-skins to the recognised person's accent at step two,
   so the card feels addressed to them.
   ══════════════════════════════════════════════════════════════════ */

const LOCATIONS = [
  { value:'opsy',       label:'Eindhoven — OPSY' },
  { value:'hoofd',      label:'Eindhoven — Hoofdlocatie' },
  { value:'woensel',    label:'Woensel' },
  { value:'veldhoven',  label:'Veldhoven' },
];

const FAIL_LINES = [
  (p) => `Onjuist wachtwoord. Poging ${p} van 3.`,
  (p) => `Nog steeds niet. Even goed nadenken… poging ${p} van 3.`,
  (p) => `Laatste poging (${p}/3). Geen druk. Oké, een beetje druk.`,
];

const DEST = { admin:'admin.html' };

const slide = {
  enter:  (dir) => ({ opacity:0, x:dir > 0 ? 28 : -28 }),
  center: { opacity:1, x:0 },
  exit:   (dir) => ({ opacity:0, x:dir > 0 ? -28 : 28 }),
};

export default function Gate() {
  const toast = useToast();
  const reduced = useReducedMotion();

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [username, setUsername] = useState('');
  const [location, setLocation] = useState('opsy');
  const [password, setPassword] = useState('');
  const [userKey, setUserKey] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [locked, setLocked] = useState(false);
  const [busy, setBusy] = useState(false);
  const [win95, setWin95] = useState(false);

  const userRef = useRef(null);
  const passRef = useRef(null);
  const user = userKey ? USERS[userKey] : null;

  useEffect(() => { userRef.current?.focus(); }, []);
  useEffect(() => { log('page_view', { page:'gate' }); }, []);

  /* theme toggle (the Win95 easter egg) */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('siteTheme');
      if (saved === 'win95') setWin95(true);
    } catch { /* no-op */ }
  }, []);

  useEffect(() => {
    document.body.classList.toggle('win95', win95);
    try { localStorage.setItem('siteTheme', win95 ? 'win95' : 'premium'); } catch { /* no-op */ }
  }, [win95]);

  /* accent follows the recognised person */
  useEffect(() => {
    setAccent(user ? user.accent : DEFAULT_ACCENT);
  }, [user]);

  function identify() {
    const key = username.trim().toLowerCase();
    if (!key) { setError('Voer een gebruikersnaam in.'); userRef.current?.focus(); return; }

    if (USERS[key]) {
      setUserKey(key);
      setError('');
      setDir(1);
      setStep(2);
      log('auth_username_ok', { name:USERS[key].name }, key);
      setTimeout(() => passRef.current?.focus(), 60);
    } else {
      setError('Gebruikersnaam niet gevonden. Controleer de spelling.');
      log('auth_username_fail', { attempted:key }, key);
    }
  }

  function authenticate() {
    if (!password) { setError('Voer een wachtwoord in.'); passRef.current?.focus(); return; }

    if (password === PASSWORDS[userKey]) {
      setError('');
      setSuccess('Authenticatie geslaagd — sessie wordt gestart…');
      setBusy(true);
      setSession(userKey);
      log('login_success', { name:user.name, clientId:user.clientId }, userKey);

      const dest = DEST[userKey] || 'units.html';
      setTimeout(() => {
        window.location.href = `${dest}?user=${encodeURIComponent(userKey)}`;
      }, 800);
      return;
    }

    const next = attempts + 1;
    setAttempts(next);
    log('login_fail', { attempt:next }, userKey);

    if (next >= 3) {
      setError('Account tijdelijk geblokkeerd. Neem contact op met IT-beheer. (Grapje. Probeer gewoon opnieuw.)');
      setLocked(true);
      log('account_locked', {}, userKey);
      // gentle self-unlock — it is a goodbye card, not Fort Knox
      setTimeout(() => {
        setLocked(false);
        setAttempts(0);
        setPassword('');
        setError('');
        passRef.current?.focus();
      }, 4000);
    } else {
      setError(FAIL_LINES[next - 1](next));
    }
  }

  function back() {
    setDir(-1);
    setStep(1);
    setUserKey(null);
    setPassword('');
    setAttempts(0);
    setError('');
    setLocked(false);
    setBusy(false);
    setTimeout(() => userRef.current?.focus(), 60);
  }

  /* ── easter eggs ── */
  useKonami(() => {
    confetti();
    toast('🕹️ Afdeling 0 ontgrendeld — je hebt goede ogen.');
    log('easter_egg', { egg:'konami' });
  });

  const markClick = useClickStreak(5, () => {
    toast('☕ Gebouwd met te veel koffie door 56 · @56isk');
    log('easter_egg', { egg:'logo5' });
  });

  return (
    <main className="gate" id="main">
      <div className="gate__toggle" role="group" aria-label="Weergave">
        <button
          type="button"
          className={`gate__tbtn${!win95 ? ' is-active' : ''}`}
          aria-pressed={!win95}
          aria-label="Moderne weergave"
          onClick={() => { setWin95(false); log('theme_change', { theme:'premium' }); }}
        >✦</button>
        <button
          type="button"
          className={`gate__tbtn${win95 ? ' is-active' : ''}`}
          aria-pressed={win95}
          aria-label="Windows 95-weergave"
          onClick={() => { setWin95(true); log('theme_change', { theme:'win95' }); }}
        >🖥️</button>
      </div>

      <motion.div
        className="gate__card"
        initial={reduced ? false : { opacity:0, y:22, scale:.985 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:.72, ease:[0.16, 1, 0.3, 1] }}
      >
        <div className="win95-title">Patiëntportaal</div>

        <header className="gate__head">
          <button
            type="button"
            className="gate__mark"
            onClick={markClick}
            aria-label="Logo"
          >
            G
          </button>
          <Eyebrow>Patiëntportaal</Eyebrow>
          <h1 className="h3 gate__title">
            {user ? `Dag ${user.first}` : 'Welkom terug'}
          </h1>
          <p className="gate__sub">
            {user ? 'Voer uw wachtwoord in om verder te gaan' : 'Log in om verder te gaan'}
          </p>
        </header>

        <div className="gate__body">
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={error}
                className="msg msg--error"
                role="alert"
                initial={{ opacity:0, height:0, marginBottom:0 }}
                animate={{ opacity:1, height:'auto', marginBottom:16 }}
                exit={{ opacity:0, height:0, marginBottom:0 }}
                transition={{ duration:.22 }}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                key="ok"
                className="msg msg--ok"
                role="status"
                initial={{ opacity:0, height:0, marginBottom:0 }}
                animate={{ opacity:1, height:'auto', marginBottom:16 }}
                transition={{ duration:.22 }}
              >
                {success}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="gate__steps">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              {step === 1 ? (
                <motion.section
                  key="step1"
                  custom={dir}
                  variants={reduced ? undefined : slide}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration:.32, ease:[0.22, .61, .36, 1] }}
                >
                  <Field
                    id="username"
                    label="Gebruikersnaam"
                    placeholder="Uw gebruikerscode"
                    autoComplete="username"
                    spellCheck="false"
                    ref={userRef}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') identify(); }}
                  />
                  <Select
                    id="location"
                    label="Locatie"
                    value={location}
                    onChange={setLocation}
                    options={LOCATIONS}
                  />
                  <div className="gate__actions">
                    <Button block onClick={identify}>Volgende</Button>
                  </div>
                </motion.section>
              ) : (
                <motion.section
                  key="step2"
                  custom={dir}
                  variants={reduced ? undefined : slide}
                  initial="enter" animate="center" exit="exit"
                  transition={{ duration:.32, ease:[0.22, .61, .36, 1] }}
                >
                  <div className="identity">
                    <span className="identity__avatar" aria-hidden="true">
                      {user?.name.charAt(0)}
                    </span>
                    <span>
                      <span className="identity__name">{user?.name}</span>
                      <span className="identity__id">{user?.clientId}</span>
                    </span>
                  </div>

                  <Field
                    id="password"
                    label="Wachtwoord"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    ref={passRef}
                    disabled={locked || busy}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') authenticate(); }}
                  />

                  <div className="gate__actions">
                    <Button block disabled={locked || busy} onClick={authenticate}>
                      {busy ? 'Bezig…' : 'Inloggen'}
                    </Button>
                    <Button variant="quiet" block onClick={back}>← Terug</Button>
                  </div>

                  <p className="gate__attempts">
                    Pogingen: <span>{attempts}</span>/3
                  </p>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <div className="dots" aria-hidden="true">
            <span className={`dot${step === 1 ? ' is-active' : ''}`} />
            <span className={`dot${step === 2 ? ' is-active' : ''}`} />
          </div>

          <p className="gate__foot">
            Patiënt Informatiesysteem · NEN-7510 gecertificeerd<br />
            Alle activiteiten worden gelogd conform beveiligingsbeleid.
          </p>
        </div>
      </motion.div>
    </main>
  );
}
