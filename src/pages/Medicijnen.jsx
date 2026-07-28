import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import { Button, Card, Eyebrow, Field, Pill } from '../components/primitives';
import {
  EmptyState, ErrorState, Modal, Skeleton, useToast,
} from '../components/feedback';
import { useAsync, useClock, useReducedMotion } from '../lib/hooks';
import {
  USERS, endSession, loadFor, log, saveFor, sessionKey, withSession,
} from '../lib/ggz';
import { BANNERS } from './letters';
import './Medicijnen.css';

/* ══════════════════════════════════════════════════════════════════
   Cliëntdossier — medication list, moments, thanks.

   Everything lives in localStorage under a per-user key. Tabs follow
   the WAI-ARIA tabs pattern so they work from the keyboard, which the
   original div-with-onclick version did not.
   ══════════════════════════════════════════════════════════════════ */

const TABS = [
  { id:'med',  label:'Medicijnen' },
  { id:'mom',  label:'Mooie momenten' },
  { id:'dank', label:'Dankwoord' },
];

const DEFAULT_MOMENTS = [
  { text:'De eerste ochtend dat ik me rustiger voelde' },
  { text:'Een gesprek dat echt goed voelde' },
  { text:'Koffie drinken zonder haast' },
];

function CatFact() {
  const { status, data, retry } = useAsync(() =>
    fetch('https://catfact.ninja/fact')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => d.fact)
  );

  if (status === 'loading') {
    return (
      <div role="status" aria-live="polite">
        <span className="visually-hidden">Kattenfeitje wordt geladen</span>
        <div className="skeleton-stack" aria-hidden="true">
          <Skeleton w="100%" h={15} />
          <Skeleton w="88%" h={15} />
          <Skeleton w="54%" h={15} />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <ErrorState
        title="Kattenfeitje niet opgehaald"
        body="De kattenserver reageert even niet. Katten slapen ongeveer 70% van hun leven, dus mogelijk slaapt hij."
        onRetry={retry}
      />
    );
  }

  return <p className="lead">{data}</p>;
}

export default function Medicijnen() {
  const toast = useToast();
  const reduced = useReducedMotion();
  const clock = useClock();

  const key = sessionKey();
  const user = key ? USERS[key] : null;

  const [tab, setTab] = useState('med');
  const [meds, setMeds] = useState([]);
  const [moments, setMoments] = useState([]);
  const [medOpen, setMedOpen] = useState(false);
  const [momOpen, setMomOpen] = useState(false);
  const [form, setForm] = useState({ name:'', dosage:'', times:'' });
  const [momentText, setMomentText] = useState('');

  const tabRefs = useRef({});

  /* no valid session goes back to the gate. Lowercase filename:
     GitHub Pages is case-sensitive and this used to 404. */
  useEffect(() => {
    if (!user) window.location.replace('index.html');
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setMeds(loadFor('medications', key, []));
    setMoments(loadFor('moments', key, null) || DEFAULT_MOMENTS);
    log('page_view', { page:'medicijnen' }, key);
  }, [key, user]);

  if (!user) return null;

  const banner = BANNERS[key];
  const peers = Object.keys(USERS).filter(
    (k) => k !== key && k !== 'admin' && USERS[k].unit === user.unit
  );

  function selectTab(id) {
    setTab(id);
    tabRefs.current[id]?.focus();
  }

  function onTabKey(e, i) {
    let next = null;
    if (e.key === 'ArrowRight') next = TABS[(i + 1) % TABS.length];
    else if (e.key === 'ArrowLeft') next = TABS[(i - 1 + TABS.length) % TABS.length];
    else if (e.key === 'Home') next = TABS[0];
    else if (e.key === 'End') next = TABS[TABS.length - 1];
    if (next) { e.preventDefault(); selectTab(next.id); }
  }

  function saveMed() {
    const name = form.name.trim();
    const dosage = form.dosage.trim();
    const times = form.times.split(',').map((t) => t.trim()).filter(Boolean);

    if (!name || !dosage || times.length === 0) {
      toast('Vul alle velden in.');
      return;
    }

    const next = [...meds, { name, dosage, times }];
    setMeds(next);
    saveFor('medications', key, next);
    setForm({ name:'', dosage:'', times:'' });
    setMedOpen(false);
    toast('Medicatie toegevoegd.', { tone:'ok' });
  }

  function removeMed(i) {
    if (!window.confirm(`Weet je zeker dat je ${meds[i].name} wilt verwijderen?`)) return;
    const next = meds.filter((_, idx) => idx !== i);
    setMeds(next);
    saveFor('medications', key, next);
  }

  function saveMoment() {
    const text = momentText.trim();
    if (!text) { toast('Vul een beschrijving in.'); return; }
    const next = [{ text }, ...moments];
    setMoments(next);
    saveFor('moments', key, next);
    setMomentText('');
    setMomOpen(false);
    toast('Moment toegevoegd.', { tone:'ok' });
  }

  return (
    <PageShell title={`Dossier · ${user.name}`} accent={user.accent}>
      <div className="topbar">
        <div className="whoami">
          <span className="whoami__avatar" aria-hidden="true">{user.name.charAt(0)}</span>
          <span>
            <span className="whoami__name">{user.name}</span>
            <span className="whoami__meta">Afdeling {user.unit} · {clock}</span>
          </span>
        </div>
        <div className="row">
          <a className="pill" href={withSession('units.html', key)}>← Dossier</a>
          <Pill
            tone="danger"
            onClick={() => {
              if (!window.confirm('Weet je zeker dat je wilt uitloggen?')) return;
              endSession();
              log('logout', {}, key);
              window.location.href = 'index.html';
            }}
          >
            Uitloggen
          </Pill>
        </div>
      </div>

      <main className="med" id="main">
        <header className="med__head">
          <Eyebrow>Cliëntdossier</Eyebrow>
          <h1 className="h1 med__title">Mijn dossier</h1>
        </header>

        {banner && (
          <motion.div
            className="banner"
            initial={reduced ? false : { opacity:0, y:12 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:.55, ease:[0.16, 1, 0.3, 1] }}
          >
            <img
              className="banner__img"
              src={banner.src}
              alt={banner.alt}
              width="76"
              height="76"
              decoding="async"
            />
            <div>
              <div className="banner__text">{banner.text}</div>
              <div className="banner__sub">{banner.sub}</div>
            </div>
          </motion.div>
        )}

        <div className="tablist" role="tablist" aria-label="Dossieronderdelen">
          {TABS.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              className="tab"
              aria-controls={`panel-${t.id}`}
              aria-selected={tab === t.id}
              tabIndex={tab === t.id ? 0 : -1}
              ref={(el) => { tabRefs.current[t.id] = el; }}
              onClick={() => setTab(t.id)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={reduced ? false : { opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={reduced ? undefined : { opacity:0, y:-6 }}
            transition={{ duration:.28, ease:[0.22, .61, .36, 1] }}
          >
            {tab === 'med' && (
              <div id="panel-med" role="tabpanel" aria-labelledby="tab-med" tabIndex={0}>
                <Card elevation="raised">
                  <div className="card__header">
                    <h2 className="h3">Mijn medicatielijst</h2>
                    <Button onClick={() => setMedOpen(true)}>+ Toevoegen</Button>
                  </div>

                  {meds.length === 0 ? (
                    <EmptyState
                      icon="💊"
                      title="Nog geen medicatie toegevoegd"
                      body="Voeg je medicatie toe om een overzicht bij te houden. Alles blijft op dit apparaat."
                      action={<Button variant="ghost" onClick={() => setMedOpen(true)}>Eerste toevoegen</Button>}
                    />
                  ) : (
                    <ul>
                      <AnimatePresence initial={false}>
                        {meds.map((m, i) => (
                          <motion.li
                            className="item"
                            key={`${m.name}-${i}`}
                            layout={!reduced}
                            initial={reduced ? false : { opacity:0, y:8 }}
                            animate={{ opacity:1, y:0 }}
                            exit={{ opacity:0, x:-8 }}
                            transition={{ duration:.3, ease:[0.16, 1, 0.3, 1] }}
                          >
                            <div>
                              <div className="item__name">{m.name} · {m.dosage}</div>
                              <div className="item__sub">Tijden: {m.times.join(', ')}</div>
                            </div>
                            <button
                              type="button"
                              className="item__del"
                              aria-label={`${m.name} verwijderen`}
                              onClick={() => removeMed(i)}
                            >
                              ×
                            </button>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </Card>

                <Card elevation="raised" className="med__peers">
                  <h2 className="h3 med__peerstitle">Anderen op je afdeling</h2>
                  {peers.length === 0 ? (
                    <p className="med__empty">Geen anderen op deze afdeling.</p>
                  ) : (
                    <div className="peers">
                      {peers.map((k) => (
                        <span className="peer" key={k}>
                          <span
                            className="peer__avatar"
                            style={{ background:USERS[k].accent }}
                            aria-hidden="true"
                          >
                            {USERS[k].name.charAt(0)}
                          </span>
                          {USERS[k].name}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}

            {tab === 'mom' && (
              <div id="panel-mom" role="tabpanel" aria-labelledby="tab-mom" tabIndex={0}>
                <Card elevation="raised">
                  <div className="card__header">
                    <h2 className="h3">Mijn mooie momenten</h2>
                    <Button onClick={() => setMomOpen(true)}>+ Toevoegen</Button>
                  </div>
                  <ul>
                    <AnimatePresence initial={false}>
                      {moments.map((m, i) => (
                        <motion.li
                          className="moment"
                          key={`${m.text}-${i}`}
                          layout={!reduced}
                          initial={reduced ? false : { opacity:0, y:8 }}
                          animate={{ opacity:1, y:0 }}
                          transition={{ duration:.3, ease:[0.16, 1, 0.3, 1] }}
                        >
                          ✦ {m.text}
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </Card>
              </div>
            )}

            {tab === 'dank' && (
              <div id="panel-dank" role="tabpanel" aria-labelledby="tab-dank" tabIndex={0}>
                <Card elevation="raised">
                  <h2 className="h3 med__peerstitle">Dankwoord</h2>
                  <div className="thanks lead">
                    <p><strong>Beste team,</strong></p>
                    <p>
                      Na tien maanden wil ik jullie bedanken voor alles wat jullie voor mij
                      hebben betekend. De zorg, de aandacht, de momenten van menselijkheid:
                      het heeft allemaal verschil gemaakt.
                    </p>
                    <p>
                      Jullie hebben mij geholpen om mezelf beter te begrijpen en om stappen
                      vooruit te zetten. Dat vergeet ik niet.
                    </p>
                    <p><strong>Met oprechte dank,</strong><br /><em>Emal</em></p>
                  </div>
                </Card>

                <Card elevation="raised" className="med__peers">
                  <div className="card__header">
                    <h2 className="h3">Kattenfeitje van de dag</h2>
                  </div>
                  <CatFact />
                </Card>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <p className="foot">
          Patiënt Informatiesysteem · Dossier {user.clientId}<br />
          Alles op deze pagina staat alleen op dit apparaat.
        </p>
      </main>

      <Modal
        open={medOpen}
        onClose={() => setMedOpen(false)}
        title="Medicatie toevoegen"
        actions={(
          <>
            <Button variant="quiet" onClick={() => setMedOpen(false)}>Annuleren</Button>
            <Button onClick={saveMed}>Opslaan</Button>
          </>
        )}
      >
        <Field
          id="medName"
          label="Naam"
          value={form.name}
          onChange={(e) => setForm({ ...form, name:e.target.value })}
        />
        <Field
          id="medDosage"
          label="Dosering"
          value={form.dosage}
          onChange={(e) => setForm({ ...form, dosage:e.target.value })}
        />
        <Field
          id="medTimes"
          label="Tijden"
          placeholder="bijv. 08:00, 20:00"
          hint="Gescheiden door komma's."
          value={form.times}
          onChange={(e) => setForm({ ...form, times:e.target.value })}
        />
      </Modal>

      <Modal
        open={momOpen}
        onClose={() => setMomOpen(false)}
        title="Mooi moment toevoegen"
        actions={(
          <>
            <Button variant="quiet" onClick={() => setMomOpen(false)}>Annuleren</Button>
            <Button onClick={saveMoment}>Opslaan</Button>
          </>
        )}
      >
        <Field
          as="textarea"
          id="momentText"
          label="Beschrijving"
          rows={4}
          value={momentText}
          onChange={(e) => setMomentText(e.target.value)}
        />
      </Modal>
    </PageShell>
  );
}
