import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PageShell from '../components/PageShell';
import { Field, Pill } from '../components/primitives';
import {
  EmptyState, LoadingRegion, Select, SkeletonRows, useToast,
} from '../components/feedback';
import ActivityChart from '../components/ActivityChart';
import { useStorageSync } from '../lib/hooks';
import {
  ACTIONS, TONE_COLOR, USERS,
  absTime, clearLogs, endSession, log, readLogs, relTime, sessionKey,
} from '../lib/ggz';
import './Admin.css';

/* ══════════════════════════════════════════════════════════════════
   Systeembeheer — the activity log console.

   Stats are computed over the whole log; the table shows the filtered
   view. Keeping those separate means filtering never makes the
   headline numbers lie.
   ══════════════════════════════════════════════════════════════════ */

const userLabel = (u) => (USERS[u] && USERS[u].name) || u || '(anoniem)';

function fmtDetails(det) {
  if (!det || typeof det !== 'object') return '';
  return Object.entries(det)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .map(([k, v]) => `${k}: ${v}`)
    .join('  ·  ');
}

export default function Admin() {
  const toast = useToast();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fAction, setFAction] = useState('');
  const [fUser, setFUser] = useState('');
  const [search, setSearch] = useState('');
  const [live, setLive] = useState(true);

  const cur = sessionKey();

  const refresh = useCallback(() => setLogs(readLogs()), []);

  /* One deliberate frame of skeleton on first paint. localStorage is
     synchronous, so without it the skeleton would flash for 0ms and
     the layout would still jump. */
  useEffect(() => {
    const t = setTimeout(() => { refresh(); setLoading(false); }, 260);
    log('admin_view', {}, cur || 'admin');
    return () => clearTimeout(t);
  }, [refresh, cur]);

  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(refresh, 2000);
    return () => clearInterval(id);
  }, [live, refresh]);

  useStorageSync('activityLogs', refresh);

  /* filter options come from what the log actually contains */
  const actionOptions = useMemo(() => {
    const seen = [...new Set(logs.map((l) => l.action))];
    return [
      { value:'', label:'Alle gebeurtenissen' },
      ...seen.map((a) => ({ value:a, label:(ACTIONS[a] && ACTIONS[a].label) || a })),
    ];
  }, [logs]);

  const userOptions = useMemo(() => {
    const seen = [...new Set(logs.map((l) => l.username))];
    return [
      { value:'', label:'Alle gebruikers' },
      ...seen.map((u) => ({ value:u, label:userLabel(u) })),
    ];
  }, [logs]);

  const stats = useMemo(() => {
    const users = new Set(
      logs.map((l) => l.username).filter((u) => u && u !== '(anoniem)')
    );
    const count = (a) => logs.filter((l) => l.action === a).length;
    return [
      ['Totaal', logs.length],
      ['Gebruikers', users.size],
      ['Logins', count('login_success')],
      ['Mislukte pogingen', count('login_fail')],
      ['Easter eggs', count('easter_egg')],
    ];
  }, [logs]);

  const rows = useMemo(() => {
    let r = [...logs].reverse();   // newest first
    if (fAction) r = r.filter((l) => l.action === fAction);
    if (fUser) r = r.filter((l) => l.username === fUser);
    if (search) {
      const q = search.trim().toLowerCase();
      r = r.filter((l) => JSON.stringify(l).toLowerCase().includes(q));
    }
    return r;
  }, [logs, fAction, fUser, search]);

  const filtered = Boolean(fAction || fUser || search);

  function exportLogs() {
    const blob = new Blob([JSON.stringify(readLogs(), null, 2)], { type:'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `logboek-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast('Logboek geëxporteerd.', { tone:'ok' });
  }

  function wipe() {
    if (!window.confirm('Weet je zeker dat je het volledige logboek wilt wissen? Dit kan niet ongedaan worden gemaakt.')) return;
    clearLogs();
    refresh();
    toast('Logboek gewist.');
  }

  return (
    <PageShell title="Systeembeheer · Logboek" wide skipTo="#stream">
      <div className="topbar">
        <div className="brandmark">
          <span className="brandmark__dot" aria-hidden="true">G</span>
          <span className="brandmark__label">Systeembeheer</span>
        </div>
        <div className="row">
          <span className="operator">
            <span className="live-dot" aria-hidden="true" />
            operator: <span>{cur || 'admin'}</span>
          </span>
          <a
            className="pill"
            href="index.html"
            onClick={() => { endSession(); log('logout', {}, cur || 'admin'); }}
          >
            Uitloggen →
          </a>
        </div>
      </div>

      <main className="console">
        <header className="console__head">
          <h1 className="h1">Activiteitenlogboek</h1>
          <p className="lead console__lede">
            Alle sessies en gebeurtenissen binnen het patiëntportaal, geregistreerd
            conform beveiligingsbeleid.
          </p>
        </header>

        <h2 className="visually-hidden">Statistieken</h2>
        <div className="stats">
          {stats.map(([k, v], i) => (
            <motion.div
              className="stat"
              key={k}
              initial={{ opacity:0, y:12 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:.5, delay:i * 0.05, ease:[0.16, 1, 0.3, 1] }}
            >
              <div className="stat__k">{k}</div>
              <div className="stat__v">{v}</div>
            </motion.div>
          ))}
        </div>

        <h2 className="visually-hidden">Activiteit over tijd</h2>
        <div className="console__chart">
          <ActivityChart logs={logs} days={14} />
        </div>

        <h2 className="visually-hidden">Filters</h2>
        <div className="controls">
          <div className="controls__field">
            <Select
              id="fAction"
              label="Gebeurtenis"
              value={fAction}
              onChange={setFAction}
              options={actionOptions}
            />
          </div>
          <div className="controls__field">
            <Select
              id="fUser"
              label="Gebruiker"
              value={fUser}
              onChange={setFUser}
              options={userOptions}
            />
          </div>
          <div className="controls__field controls__field--search">
            <Field
              id="fSearch"
              label="Zoeken"
              placeholder="zoeken…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="controls__actions">
            <Pill
              active={live}
              aria-pressed={live}
              onClick={() => setLive((v) => !v)}
            >
              {live ? '↻ live' : '⏸ gepauzeerd'}
            </Pill>
            <span className="mono controls__count">
              {rows.length} regel{rows.length === 1 ? '' : 's'}
            </span>
            <Pill onClick={exportLogs}>⬇ export</Pill>
            <Pill tone="danger" onClick={wipe}>✕ wissen</Pill>
          </div>
        </div>

        <h2 className="visually-hidden">Gebeurtenissen</h2>
        <div className="stream" id="stream">
          {loading ? (
            <LoadingRegion label="Logboek wordt geladen">
              <SkeletonRows rows={6} />
            </LoadingRegion>
          ) : rows.length === 0 ? (
            <EmptyState
              icon={logs.length === 0 ? '◔' : '⌕'}
              title={logs.length === 0 ? 'Nog geen activiteit geregistreerd' : 'Geen resultaten'}
              body={logs.length === 0
                ? 'Log in via het patiëntportaal en open een dossier, gebeurtenissen verschijnen hier realtime.'
                : 'Pas je filters aan om meer regels te zien.'}
              action={filtered ? (
                <Pill onClick={() => { setFAction(''); setFUser(''); setSearch(''); }}>
                  Filters wissen
                </Pill>
              ) : undefined}
            />
          ) : (
            rows.map((l, i) => {
              const meta = ACTIONS[l.action] || { label:l.action, tone:'neutral' };
              const color = TONE_COLOR[meta.tone] || TONE_COLOR.neutral;
              const known = Boolean(USERS[l.username]);
              const det = fmtDetails(l.details);

              return (
                <div className="row-log" key={`${l.timestamp}-${i}`}>
                  <div className="row-log__time" title={absTime(l.timestamp)}>
                    {relTime(l.timestamp)}
                  </div>
                  <div>
                    <span
                      className="badge"
                      style={{
                        color,
                        borderColor:color,
                        background:`color-mix(in srgb, ${color} 12%, transparent)`,
                      }}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <div>
                    <span className="row-log__who">{userLabel(l.username)}</span>
                    {known && <span className="row-log__id"> {l.username}</span>}
                    {det && <div className="row-log__det">{det}</div>}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <p className="foot">
          Patiënt Informatiesysteem · NEN-7510 · logboek opgeslagen op dit apparaat (localStorage)<br />
          Systeembeheer-console, gemaakt door 56 · @56isk
        </p>
      </main>
    </PageShell>
  );
}
