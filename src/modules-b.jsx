import React, { useState, useEffect } from 'react';
import { Home, Receipt, HandCoins, CreditCard, PiggyBank, Settings as Gear, Plus, Trash2, ChevronLeft, ChevronRight, Check, X, BookOpen, Sparkles, Crown, Compass, Clock, HeartPulse, Gauge, GraduationCap, Users, LayoutGrid, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import {
  C, FONT_DISPLAY, FONT_MONO, uid, fmt, todayISO, inMonth,
  Card, SectionTitle, TextInput, Select, PrimaryButton, shade, IconBtn, Row, Pill, Watermark,
} from './core.jsx';

// ---------- Temps ----------
function startOfWeek(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Monday start
  date.setDate(date.getDate() + diff);
  return date.toISOString().slice(0, 10);
}
function inCurrentWeek(dateStr) {
  const start = new Date(startOfWeek(new Date()));
  const end = new Date(start); end.setDate(end.getDate() + 7);
  const d = new Date(dateStr);
  return d >= start && d < end;
}

function TempsTab({ settings, timeLogs, saveTimeLogs }) {
  const [logValue, setLogValue] = useState({});
  const [note, setNote] = useState({});

  function logTime(catId) {
    const val = Number(logValue[catId] || 0);
    if (!val) return;
    saveTimeLogs([{ id: uid(), categoryId: catId, date: todayISO(), hours: val, note: note[catId] || '' }, ...timeLogs]);
    setLogValue({ ...logValue, [catId]: '' });
    setNote({ ...note, [catId]: '' });
  }
  function weekTotal(catId) {
    return timeLogs.filter(l => l.categoryId === catId && inCurrentWeek(l.date)).reduce((s,l) => s + Number(l.hours||0), 0);
  }

  const pieData = (settings.timeCategories || []).map(c => ({ name: c.name, value: weekTotal(c.id), color: c.color })).filter(d => d.value > 0);
  const totalWeek = pieData.reduce((s,d) => s + d.value, 0);

  return (
    <div>
      <SectionTitle sub="Dieu · Famille · Travail · Vision · Repos — la semaine qui suit la vision.">Cette semaine</SectionTitle>

      {pieData.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Répartition ({totalWeek.toFixed(1)} h enregistrées)</div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={36} outerRadius={64} paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => v + ' h'} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <div style={{ display: 'grid', gap: 10 }}>
        {(settings.timeCategories || []).map(c => {
          const total = weekTotal(c.id);
          const progress = c.weeklyTarget > 0 ? Math.min(1, total / c.weeklyTarget) : 0;
          return (
            <Card key={c.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.color }}>{c.name}</span>
                <span style={{ fontSize: 12, color: C.fade }}>{total.toFixed(1)} / {c.weeklyTarget} h</span>
              </div>
              <div style={{ height: 7, background: C.line, borderRadius: 8, marginTop: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                <div style={{ height: '100%', width: `${progress*100}%`, background: c.color }} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <TextInput type="number" placeholder="Heures aujourd'hui" value={logValue[c.id] || ''} onChange={e => setLogValue({ ...logValue, [c.id]: e.target.value })} style={{ flex: 1 }} />
                <button onClick={() => logTime(c.id)} style={{ background: c.color, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
              </div>
            </Card>
          );
        })}
        {(!settings.timeCategories || settings.timeCategories.length === 0) && <p style={{ fontSize: 13, color: C.fade }}>Aucune catégorie de temps définie — ajoute-en dans Paramètres.</p>}
      </div>
    </div>
  );
}

// ---------- Santé ----------
function HealthTab({ settings, healthLogs, saveHealthLogs, poidsLogs, savePoidsLogs }) {
  const [logValue, setLogValue] = useState({});
  const [poidsValue, setPoidsValue] = useState('');

  function logMetric(id) {
    const val = Number(logValue[id] || 0);
    if (!val) return;
    saveHealthLogs([{ id: uid(), metricId: id, date: todayISO(), value: val }, ...healthLogs]);
    setLogValue({ ...logValue, [id]: '' });
  }
  function weekTotal(id) {
    return healthLogs.filter(l => l.metricId === id && inCurrentWeek(l.date)).reduce((s,l) => s + Number(l.value||0), 0);
  }
  function logPoids() {
    if (!poidsValue) return;
    savePoidsLogs([{ id: uid(), date: todayISO(), value: Number(poidsValue) }, ...poidsLogs]);
    setPoidsValue('');
  }
  const poidsChart = [...poidsLogs].sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-12).map(p => ({ date: p.date.slice(5), poids: p.value }));

  return (
    <div>
      <SectionTitle sub="Sommeil, sport, hydratation, énergie — le corps confié, lui aussi.">Cette semaine</SectionTitle>
      <div style={{ display: 'grid', gap: 10, marginBottom: 14 }}>
        {(settings.healthMetrics || []).map(m => {
          const total = weekTotal(m.id);
          const progress = m.weeklyTarget > 0 ? Math.min(1, total / m.weeklyTarget) : 0;
          return (
            <Card key={m.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</span>
                <span style={{ fontSize: 12, color: C.fade }}>{total.toFixed(1)} / {m.weeklyTarget} {m.unit}</span>
              </div>
              <div style={{ height: 7, background: C.line, borderRadius: 8, marginTop: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                <div style={{ height: '100%', width: `${progress*100}%`, background: C.green }} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                <TextInput type="number" placeholder={`Valeur (${m.unit})`} value={logValue[m.id] || ''} onChange={e => setLogValue({ ...logValue, [m.id]: e.target.value })} style={{ flex: 1 }} />
                <button onClick={() => logMetric(m.id)} style={{ background: C.green, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
              </div>
            </Card>
          );
        })}
      </div>

      <SectionTitle sub="Le poids se suit en tendance, jamais en objectif chiffré imposé.">Poids</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
          <TextInput type="number" placeholder="Poids (kg)" value={poidsValue} onChange={e => setPoidsValue(e.target.value)} style={{ flex: 1 }} />
          <button onClick={logPoids} style={{ background: C.navy, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
        </div>
        {poidsChart.length > 1 && (
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={poidsChart}>
                <XAxis dataKey="date" tick={{ fontSize: 9 }} />
                <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip formatter={(v) => v + ' kg'} />
                <Line type="monotone" dataKey="poids" stroke={C.navy} strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </Card>
    </div>
  );
}

// ---------- Indice d'Intendance (capstone) ----------
function computeFinances(settings, transactions, debts, year) {
  const yearTx = transactions.filter(t => new Date(t.date).getFullYear() === year);
  const revenuAnnuel = yearTx.filter(t => t.type === 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
  if (revenuAnnuel === 0) return null;
  const titheIds = settings.donTypes.filter(d => d.isTithe).map(d => d.id);
  const dimeAnnuelle = yearTx.filter(t => t.type === 'don' && titheIds.includes(t.donTypeId)).reduce((s,t) => s + Number(t.amount||0), 0);
  const ptsDime = Math.min(1, (dimeAnnuelle / revenuAnnuel) / 0.10) * 25;

  const epargneGroupId = settings.groups.find(g => g.name.toLowerCase().includes('épargne') || g.name.toLowerCase().includes('epargne'))?.id;
  const epargneCatIds = settings.categories.filter(c => c.groupId === epargneGroupId).map(c => c.id);
  const epargneAnnuelle = yearTx.filter(t => t.type === 'depense' && epargneCatIds.includes(t.categoryId)).reduce((s,t) => s + Number(t.amount||0), 0);
  const ptsEpargne = Math.min(1, (epargneAnnuelle / revenuAnnuel) / 0.15) * 25;

  let positiveMonths = 0;
  for (let m = 0; m < 12; m++) {
    const mtx = transactions.filter(t => inMonth(t.date, m, year));
    const rev = mtx.filter(t => t.type === 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
    const out = mtx.filter(t => t.type !== 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
    if (rev > 0 && rev - out >= 0) positiveMonths++;
    if (rev > 0) {}
  }
  const activeMonths = Array.from({length:12}, (_,m) => transactions.some(t => inMonth(t.date, m, year))).filter(Boolean).length || 1;
  const ptsSolde = Math.min(1, positiveMonths / activeMonths) * 25;

  const totalInit = debts.reduce((s,d) => s + Number(d.initialBalance||0), 0);
  const totalCur = debts.reduce((s,d) => s + Number(d.currentBalance||0), 0);
  const ptsDettes = totalInit > 0 ? Math.max(0, (1 - totalCur/totalInit)) * 25 : 25;

  return Math.min(100, ptsDime + ptsEpargne + ptsSolde + ptsDettes);
}

function computeDiscipline(settings, transactions, monthIdx, year) {
  const targeted = settings.categories.filter(c => c.target && c.target > 0);
  if (targeted.length === 0) return null;
  const overspends = targeted.map(c => {
    const spent = transactions.filter(t => t.type === 'depense' && t.categoryId === c.id && inMonth(t.date, monthIdx, year)).reduce((s,t) => s + Number(t.amount||0), 0);
    return Math.max(0, (spent - c.target) / c.target);
  });
  const avgOver = overspends.reduce((s,v) => s+v, 0) / overspends.length;
  return Math.max(0, Math.min(100, 100 - avgOver * 100));
}

function computeTemps(settings, timeLogs) {
  if (!settings.timeCategories || settings.timeCategories.length === 0) return null;
  const scores = settings.timeCategories.map(c => {
    const total = timeLogs.filter(l => l.categoryId === c.id && inCurrentWeek(l.date)).reduce((s,l) => s + Number(l.hours||0), 0);
    return c.weeklyTarget > 0 ? Math.min(1, total / c.weeklyTarget) : 0;
  });
  if (scores.every(s => s === 0)) return null;
  return (scores.reduce((s,v) => s+v, 0) / scores.length) * 100;
}

function computeSante(settings, healthLogs) {
  if (!settings.healthMetrics || settings.healthMetrics.length === 0) return null;
  const scores = settings.healthMetrics.map(m => {
    const total = healthLogs.filter(l => l.metricId === m.id && inCurrentWeek(l.date)).reduce((s,l) => s + Number(l.value||0), 0);
    return m.weeklyTarget > 0 ? Math.min(1, total / m.weeklyTarget) : 0;
  });
  if (scores.every(s => s === 0)) return null;
  return (scores.reduce((s,v) => s+v, 0) / scores.length) * 100;
}

function computeSagesse(decisions, monthIdx, year) {
  const monthDecisions = decisions.filter(d => inMonth(d.date, monthIdx, year));
  if (decisions.length === 0) return null;
  const ptsVolume = Math.min(1, monthDecisions.length / 4) * 70;
  const majeuresDues = decisions.filter(d => d.majeure && d.dateRelecture && d.dateRelecture <= todayISO());
  const majeuresRelues = majeuresDues.filter(d => d.statut === 'relue');
  const ptsRelecture = majeuresDues.length > 0 ? (majeuresRelues.length / majeuresDues.length) * 30 : 30;
  return Math.min(100, ptsVolume + ptsRelecture);
}

function computeVision(objectifs, revues) {
  if (objectifs.length === 0) return null;
  const actifs = objectifs.filter(o => o.statut !== 'abandonné');
  const atteints = objectifs.filter(o => o.statut === 'atteint');
  const ptsObjectifs = actifs.length > 0 ? (atteints.length / actifs.length) * 70 : 0;
  const now = new Date();
  const currentQuarter = Math.floor(now.getMonth() / 3);
  const revueThisQuarter = revues.some(r => {
    const d = new Date(r.date);
    return d.getFullYear() === now.getFullYear() && Math.floor(d.getMonth()/3) === currentQuarter;
  });
  return Math.min(100, ptsObjectifs + (revueThisQuarter ? 30 : 0));
}

function DimScore({ label, weight, score, manualValue, onManualChange }) {
  const isManual = score === null;
  const displayed = isManual ? Number(manualValue) || 0 : score;
  return (
    <Card style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{label}</span>
          <span style={{ fontSize: 10, color: C.fade, marginLeft: 6 }}>({(weight*100).toFixed(0)}%)</span>
        </div>
        {isManual ? (
          <TextInput type="number" placeholder="Saisie manuelle /100" value={manualValue} onChange={e => onManualChange(e.target.value)} style={{ width: 100 }} />
        ) : (
          <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: C.navy }}>{displayed.toFixed(0)} /100</span>
        )}
      </div>
      {isManual && <div style={{ fontSize: 10, color: C.terracotta, marginTop: 4 }}>Pas assez de données — saisie temporaire</div>}
    </Card>
  );
}

function IndiceIntendanceTab({ settings, transactions, debts, timeLogs, healthLogs, decisions, objectifs, revues, monthIdx, year, manualScores, saveManualScores }) {
  const finances = computeFinances(settings, transactions, debts, year);
  const discipline = computeDiscipline(settings, transactions, monthIdx, year);
  const temps = computeTemps(settings, timeLogs);
  const sante = computeSante(settings, healthLogs);
  const sagesse = computeSagesse(decisions, monthIdx, year);
  const vision = computeVision(objectifs, revues);

  const dims = [
    { key: 'finances', label: 'Finances', weight: 0.20, score: finances },
    { key: 'temps', label: 'Temps', weight: 0.20, score: temps },
    { key: 'discipline', label: 'Discipline', weight: 0.15, score: discipline },
    { key: 'sante', label: 'Santé', weight: 0.10, score: sante },
    { key: 'sagesse', label: 'Sagesse', weight: 0.20, score: sagesse },
    { key: 'vision', label: 'Vision', weight: 0.15, score: vision },
  ];

  function setManual(key, val) {
    saveManualScores({ ...manualScores, [key]: val });
  }

  const total = dims.reduce((s,d) => {
    const val = d.score === null ? (Number(manualScores[d.key]) || 0) : d.score;
    return s + val * d.weight;
  }, 0);

  const niveau = total >= 90 ? '👑 Roi Sage' : total >= 75 ? '👑 Intendant fidèle' : total >= 60 ? '🌱 En croissance' : total >= 40 ? '⚠️ Vigilance requise' : '🔴 Alerte intendance';

  return (
    <div>
      <Card style={{ marginBottom: 16, background: `linear-gradient(160deg, ${C.navy} 0%, #072238 100%)`, color: '#fff', border: 'none', textAlign: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
        <Watermark Icon={Crown} size={120} top={-30} right={-24} opacity={0.07} />
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 700, letterSpacing: -1, fontVariantNumeric: 'tabular-nums' }}>{total.toFixed(0)}</div>
        <div style={{ fontSize: 10, opacity: 0.75, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1.5 }}>sur 100</div>
        <div style={{ background: `linear-gradient(155deg, ${C.gold} 0%, ${shade(C.gold,-18)} 100%)`, display: 'inline-block', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.25)' }}>{niveau}</div>
      </Card>

      <SectionTitle sub="Calculé à partir des données réelles quand elles existent ; saisie manuelle temporaire sinon, toujours indiquée comme telle.">Détail par dimension</SectionTitle>
      {dims.map(d => (
        <DimScore key={d.key} label={d.label} weight={d.weight} score={d.score} manualValue={manualScores[d.key] || ''} onManualChange={(v) => setManual(d.key, v)} />
      ))}

      <Card style={{ marginTop: 10, background: C.cream }}>
        <p style={{ fontSize: 11, color: C.fade, margin: 0 }}>
          Le Royaume (dîme, offrandes, disciplines) n'entre pas dans ce score : c'est un indicateur de régularité, jamais une mesure de communion avec Dieu. Consulte-le dans l'onglet Royaume.
        </p>
      </Card>
    </div>
  );
}

// ---------- Croissance ----------
function CroissanceTab({ settings, lectures, saveLectures, growthLogs, saveGrowthLogs }) {
  const [subview, setSubview] = useState('lectures');
  const [titre, setTitre] = useState('');
  const [typeL, setTypeL] = useState('Livre');
  const [logValue, setLogValue] = useState({});

  function addLecture() {
    if (!titre) return;
    saveLectures([{ id: uid(), titre, type: typeL, statut: 'à lire', dateAjout: todayISO() }, ...lectures]);
    setTitre('');
  }
  function cycleStatut(id) {
    const order = ['à lire', 'en cours', 'terminé'];
    saveLectures(lectures.map(l => l.id === id ? { ...l, statut: order[(order.indexOf(l.statut) + 1) % order.length] } : l));
  }
  function removeLecture(id) { saveLectures(lectures.filter(l => l.id !== id)); }

  function logHabit(id) {
    const val = Number(logValue[id] || 0);
    if (!val) return;
    saveGrowthLogs([{ id: uid(), habitId: id, date: todayISO(), value: val }, ...growthLogs]);
    setLogValue({ ...logValue, [id]: '' });
  }
  function weekTotal(id) {
    return growthLogs.filter(l => l.habitId === id && inCurrentWeek(l.date)).reduce((s,l) => s + Number(l.value||0), 0);
  }

  const statutColor = { 'à lire': C.fade, 'en cours': C.navy, 'terminé': C.green };

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['lectures','Lectures'],['habitudes','Habitudes']].map(([k,label]) => (
          <button key={k} onClick={() => setSubview(k)} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${C.line}`, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: subview === k ? C.navy : '#fff', color: subview === k ? '#fff' : C.ink,
          }}>{label}</button>
        ))}
      </div>

      {subview === 'lectures' && (
        <div>
          <SectionTitle>Ajouter une lecture</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <TextInput placeholder="Titre du livre / cours" value={titre} onChange={e => setTitre(e.target.value)} />
              <Select value={typeL} onChange={e => setTypeL(e.target.value)}>
                <option value="Livre">Livre</option>
                <option value="Cours">Cours</option>
              </Select>
              <PrimaryButton onClick={addLecture} disabled={!titre}><Plus size={15}/> Ajouter</PrimaryButton>
            </div>
          </Card>
          <div style={{ display: 'grid', gap: 8 }}>
            {lectures.map(l => (
              <Card key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{l.titre}</div>
                  <div style={{ fontSize: 11, color: C.fade }}>{l.type}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button onClick={() => cycleStatut(l.id)} style={{ background: statutColor[l.statut], color: '#fff', border: 'none', borderRadius: 6, padding: '4px 8px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>{l.statut}</button>
                  <IconBtn onClick={() => removeLecture(l.id)}><Trash2 size={14} /></IconBtn>
                </div>
              </Card>
            ))}
            {lectures.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune lecture enregistrée.</p>}
          </div>
        </div>
      )}

      {subview === 'habitudes' && (
        <div>
          <SectionTitle sub="Développement personnel — compétences, disciplines d'apprentissage.">Cette semaine</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {(settings.growthHabits || []).map(h => {
              const total = weekTotal(h.id);
              const progress = h.weeklyTarget > 0 ? Math.min(1, total / h.weeklyTarget) : 0;
              return (
                <Card key={h.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{h.name}</span>
                    <span style={{ fontSize: 12, color: C.fade }}>{total.toFixed(1)} / {h.weeklyTarget} {h.unit}</span>
                  </div>
                  <div style={{ height: 7, background: C.line, borderRadius: 8, marginTop: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: '100%', width: `${progress*100}%`, background: C.purple }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <TextInput type="number" placeholder="Valeur" value={logValue[h.id] || ''} onChange={e => setLogValue({ ...logValue, [h.id]: e.target.value })} style={{ flex: 1 }} />
                    <button onClick={() => logHabit(h.id)} style={{ background: C.purple, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
                  </div>
                </Card>
              );
            })}
            {(!settings.growthHabits || settings.growthHabits.length === 0) && <p style={{ fontSize: 13, color: C.fade }}>Aucune habitude définie — ajoute-en dans Paramètres.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Relations ----------
function RelationsTab({ settings, contacts, saveContacts }) {
  const [nom, setNom] = useState('');
  const [categorieId, setCategorieId] = useState(settings.relationCategories?.[0]?.id || '');
  const [frequenceCible, setFrequenceCible] = useState('30');
  const [notes, setNotes] = useState('');

  useEffect(() => { if (!settings.relationCategories.find(c => c.id === categorieId)) setCategorieId(settings.relationCategories[0]?.id || ''); }, [settings.relationCategories]);

  function addContact() {
    if (!nom) return;
    saveContacts([{ id: uid(), nom, categorieId, frequenceCible: Number(frequenceCible), dernierContact: todayISO(), notes }, ...contacts]);
    setNom(''); setNotes('');
  }
  function marquerContacte(id) {
    saveContacts(contacts.map(c => c.id === id ? { ...c, dernierContact: todayISO() } : c));
  }
  function removeContact(id) { saveContacts(contacts.filter(c => c.id !== id)); }

  const catById = Object.fromEntries((settings.relationCategories||[]).map(c => [c.id, c]));
  const today = new Date();
  const withStatus = contacts.map(c => {
    const jours = Math.floor((today - new Date(c.dernierContact)) / 86400000);
    const enRetard = jours > c.frequenceCible;
    return { ...c, jours, enRetard };
  }).sort((a,b) => b.jours - a.jours);

  return (
    <div>
      <SectionTitle sub="Famille, amis, mentors, disciples — la fidélité relationnelle, pas seulement financière.">Ajouter un contact</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <TextInput placeholder="Nom" value={nom} onChange={e => setNom(e.target.value)} />
          <Select value={categorieId} onChange={e => setCategorieId(e.target.value)}>
            {(settings.relationCategories||[]).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <TextInput type="number" placeholder="Fréquence souhaitée (jours)" value={frequenceCible} onChange={e => setFrequenceCible(e.target.value)} />
          <TextInput placeholder="Note (optionnel)" value={notes} onChange={e => setNotes(e.target.value)} />
          <PrimaryButton onClick={addContact} disabled={!nom}><Plus size={15}/> Ajouter</PrimaryButton>
        </div>
      </Card>

      <SectionTitle>Fidélité relationnelle</SectionTitle>
      <div style={{ display: 'grid', gap: 8 }}>
        {withStatus.map(c => (
          <Card key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {c.enRetard && <Pill color={C.terracotta}>À RECONTACTER</Pill>}
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{c.nom}</span>
                </div>
                <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>{catById[c.categorieId]?.name || '—'} · dernier contact il y a {c.jours} j (objectif : {c.frequenceCible} j)</div>
                {c.notes && <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>{c.notes}</div>}
              </div>
              <IconBtn onClick={() => removeContact(c.id)}><Trash2 size={14} /></IconBtn>
            </div>
            <button onClick={() => marquerContacte(c.id)} style={{ marginTop: 8, background: C.green, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Contacté aujourd'hui</button>
          </Card>
        ))}
        {withStatus.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucun contact enregistré.</p>}
      </div>
    </div>
  );
}


export { TempsTab, HealthTab, IndiceIntendanceTab, CroissanceTab, RelationsTab };
