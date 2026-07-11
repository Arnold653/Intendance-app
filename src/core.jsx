import React, { useState, useEffect, useMemo } from 'react';
import { Home, Receipt, HandCoins, CreditCard, PiggyBank, Settings as Gear, Plus, Trash2, ChevronLeft, ChevronRight, Check, X, BookOpen, Sparkles, Crown, Compass, Clock, HeartPulse, Gauge, GraduationCap, Users, LayoutGrid, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

const C = {
  navy: '#0B2F4E', gold: '#C98A2B', goldLight: '#EFDBA8', cream: '#F7F3EA',
  ink: '#1F2421', green: '#2F6B3A', terracotta: '#B5482A', line: '#E5DFCC',
  purple: '#8A6FB0', gray: '#6B7280', fade: '#8C8474',
};
const FONT_DISPLAY = "'Iowan Old Style', 'Palatino Linotype', Palatino, Georgia, 'Times New Roman', serif";
const FONT_MONO = "ui-monospace, 'SF Mono', 'Cambria Math', monospace";
const PALETTE = [C.gold, C.green, C.navy, C.terracotta, C.purple, C.gray, '#4A6FA5', '#A5674A'];
const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

function uid() { return Date.now() + '-' + Math.random().toString(36).slice(2, 8); }
function fmt(n) { return (Math.round(Number(n) || 0)).toLocaleString('fr-FR') + ' FCFA'; }
function pct(n) { return ((Number(n) || 0) * 100).toFixed(1) + ' %'; }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function inMonth(dateStr, m, y) { const d = new Date(dateStr); return d.getMonth() === m && d.getFullYear() === y; }
function addMonths(dateStr, n) { const d = new Date(dateStr); d.setMonth(d.getMonth() + n); return d.toISOString().slice(0, 10); }
const FRUIT_TAGS = ['Rien', 'Confort', 'Apprentissage', 'Relation', 'Revenu', 'Ministère', 'Santé'];

function defaultSettings() {
  const g = [
    { id: 'g-royaume', name: 'Royaume', color: C.gold },
    { id: 'g-epargne', name: 'Épargne', color: C.green },
    { id: 'g-besoins', name: 'Besoins essentiels', color: C.navy },
    { id: 'g-dettes', name: 'Dettes', color: C.terracotta },
    { id: 'g-desirs', name: 'Désirs', color: C.purple },
    { id: 'g-divers', name: 'Divers', color: C.gray },
  ];
  const cats = [
    ["Fonds d'urgence", 'g-epargne'], ['Épargne long terme', 'g-epargne'], ['Investissement', 'g-epargne'],
    ['Logement / Loyer', 'g-besoins'], ['Électricité & Eau', 'g-besoins'], ['Alimentation', 'g-besoins'],
    ['Transport', 'g-besoins'], ['Santé', 'g-besoins'], ['Éducation / Enfants', 'g-besoins'],
    ['Prévoyance (assurance décès)', 'g-besoins'],
    ['Remboursement dettes', 'g-dettes'],
    ['Loisirs & Sorties', 'g-desirs'], ['Vêtements', 'g-desirs'], ['Abonnements', 'g-desirs'],
    ['Imprévus', 'g-divers'], ['Autres', 'g-divers'],
  ].map(([name, groupId]) => ({ id: uid(), name, groupId, target: null }));
  const donTypes = [
    { id: 'd-dime', name: 'Dîme', isTithe: true },
    { id: 'd-offrande', name: 'Offrande', isTithe: false },
    { id: 'd-semence', name: 'Semence / Mission', isTithe: false },
  ];
  const comptes = [
    { id: uid(), name: 'Compte principal', type: 'banque' },
    { id: uid(), name: 'Épargne', type: 'banque' },
    { id: uid(), name: 'Caisse', type: 'caisse' },
  ];
  const disciplines = [
    { id: uid(), name: 'Prière', unit: 'jours', monthlyTarget: 26 },
    { id: uid(), name: 'Lecture biblique', unit: 'chapitres', monthlyTarget: 30 },
    { id: uid(), name: 'Jeûne', unit: 'jours', monthlyTarget: 2 },
    { id: uid(), name: 'Évangélisation', unit: 'personnes', monthlyTarget: 4 },
    { id: uid(), name: 'Service', unit: 'heures', monthlyTarget: 8 },
  ];
  const timeCategories = [
    { id: uid(), name: 'Dieu', color: C.gold, weeklyTarget: 7 },
    { id: uid(), name: 'Famille', color: C.terracotta, weeklyTarget: 14 },
    { id: uid(), name: 'Travail', color: C.navy, weeklyTarget: 40 },
    { id: uid(), name: 'Vision', color: C.purple, weeklyTarget: 5 },
    { id: uid(), name: 'Repos', color: C.green, weeklyTarget: 10 },
  ];
  const healthMetrics = [
    { id: uid(), name: 'Sommeil', unit: 'h/nuit', weeklyTarget: 49 },
    { id: uid(), name: 'Sport', unit: 'h', weeklyTarget: 3 },
    { id: uid(), name: 'Hydratation', unit: 'L', weeklyTarget: 14 },
    { id: uid(), name: 'Énergie', unit: '/10', weeklyTarget: 49 },
  ];
  const growthHabits = [
    { id: uid(), name: 'Lecture personnelle', unit: 'pages', weeklyTarget: 50 },
    { id: uid(), name: 'Pratique compétence', unit: 'heures', weeklyTarget: 3 },
  ];
  const relationCategories = [
    { id: uid(), name: 'Famille' }, { id: uid(), name: 'Amis' }, { id: uid(), name: 'Mentors' },
    { id: uid(), name: 'Disciples' }, { id: uid(), name: 'Autre' },
  ];
  return { groups: g, categories: cats, donTypes, comptes, disciplines, timeCategories, healthMetrics, growthHabits, relationCategories, objectifZero: false };
}

// ---------- shared UI ----------
function Card({ children, style }) {
  return <div style={{
    background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: 14,
    boxShadow: '0 1px 2px rgba(11,47,78,0.04), 0 4px 14px rgba(11,47,78,0.05)',
    ...style,
  }}>{children}</div>;
}
function SectionTitle({ children, sub }) {
  return (
    <div style={{ margin: '4px 0 10px' }}>
      <h2 style={{ fontFamily: FONT_DISPLAY, color: C.navy, fontSize: 18, fontWeight: 700, margin: 0, letterSpacing: -0.2 }}>{children}</h2>
      <div style={{ width: 30, height: 2.5, background: `linear-gradient(90deg, ${C.gold} 0%, transparent 100%)`, borderRadius: 2, margin: '5px 0' }} />
      {sub && <p style={{ fontSize: 11, color: C.fade, margin: 0 }}>{sub}</p>}
    </div>
  );
}
function TextInput(props) {
  return <input {...props} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: '9px 10px', fontSize: 14, fontFamily: 'inherit', color: C.ink, ...(props.style||{}) }} />;
}
function Select(props) {
  return <select {...props} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: '9px 10px', fontSize: 14, fontFamily: 'inherit', color: C.ink, background: '#fff', ...(props.style||{}) }} />;
}
function PrimaryButton({ children, onClick, disabled, color }) {
  const base = disabled ? C.fade : (color || C.navy);
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%',
      background: disabled ? base : `linear-gradient(155deg, ${base} 0%, ${shade(base, -14)} 100%)`,
      color: '#fff', border: 'none', borderRadius: 10,
      padding: '12px 14px', fontSize: 14, fontWeight: 700, fontFamily: 'inherit', letterSpacing: 0.2,
      cursor: disabled ? 'default' : 'pointer',
      boxShadow: disabled ? 'none' : `0 3px 10px ${base}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>{children}</button>
  );
}
function shade(hex, pct) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + Math.round(2.55 * pct)));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + Math.round(2.55 * pct)));
  const b = Math.max(0, Math.min(255, (n & 255) + Math.round(2.55 * pct)));
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
}
function IconBtn({ onClick, children, color }) {
  return <button onClick={onClick} style={{ background: 'none', border: 'none', color: color || C.fade, cursor: 'pointer', padding: 4 }}>{children}</button>;
}
function Row({ label, value, valueColor }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: `1px solid ${C.line}` }}>
      <span style={{ fontSize: 13, color: C.fade }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: valueColor || C.ink, fontFamily: FONT_MONO }}>{value}</span>
    </div>
  );
}
function Pill({ children, color }) {
  return <span style={{
    background: color || C.line, color: '#fff', fontSize: 8.5, fontWeight: 700, padding: '3px 8px', borderRadius: 20,
    textTransform: 'uppercase', letterSpacing: 0.6, boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
  }}>{children}</span>;
}
function Watermark({ Icon, size = 90, top = -18, right = -18, opacity = 0.08, color = '#fff' }) {
  return (
    <Icon size={size} color={color} style={{ position: 'absolute', top, right, opacity, pointerEvents: 'none' }} />
  );
}

// ---------- Header ----------
function Header({ monthIdx, year, onPrev, onNext, tauxDime, onOpenSettings }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${C.navy} 0%, #072238 100%)`, color: '#fff', padding: '18px 16px 16px',
      boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <button onClick={onOpenSettings} style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 9, padding: 8, color: '#fff', cursor: 'pointer' }}>
          <Gear size={17} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 700, letterSpacing: 0.3 }}>Intendance</div>
          <div style={{ fontSize: 10, color: C.goldLight, fontStyle: 'italic', marginTop: 1 }}>Gouverne fidèlement ce que Dieu t'a confié</div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: `radial-gradient(circle at 35% 30%, ${C.goldLight} 0%, ${C.gold} 45%, #8a611b 100%)`,
          border: `2px solid rgba(255,255,255,0.5)`, boxShadow: '0 3px 8px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', flexShrink: 0,
        }}>
          <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1, color: '#3a2a08', textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}>{(tauxDime*100).toFixed(0)}%</span>
          <span style={{ fontSize: 6.5, color: '#3a2a08', opacity: 0.85 }}>dîme</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 12 }}>
        <button onClick={onPrev} style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: 4, color: '#fff', cursor: 'pointer' }}><ChevronLeft size={16} /></button>
        <span style={{ fontSize: 14, fontWeight: 700, minWidth: 140, textAlign: 'center' }}>{MONTHS_FR[monthIdx]} {year}</span>
        <button onClick={onNext} style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 7, padding: 4, color: '#fff', cursor: 'pointer' }}><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

// ---------- Dashboard ----------
function Dashboard({ revenuMois, donsMois, depensesMois, soldeMois, tauxDime, pieData, last6, comptesSoldes, objectifZero }) {
  return (
    <div>
      <SectionTitle>Résumé du mois</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <Card style={{ background: `linear-gradient(160deg, ${C.navy} 0%, #072238 100%)`, color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <Watermark Icon={Wallet} size={56} top={-12} right={-8} opacity={0.14} />
          <div style={{ fontSize: 11, opacity: 0.8 }}>Revenu du mois</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, fontVariantNumeric: 'tabular-nums' }}>{fmt(revenuMois)}</div>
        </Card>
        <Card style={{ background: `linear-gradient(155deg, ${C.gold} 0%, ${shade(C.gold,-18)} 100%)`, color: '#fff', border: 'none', position: 'relative', overflow: 'hidden' }}>
          <Watermark Icon={Crown} size={56} top={-12} right={-8} opacity={0.18} />
          <div style={{ fontSize: 11, opacity: 0.9 }}>Dîmes + offrandes</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, fontVariantNumeric: 'tabular-nums' }}>{fmt(donsMois)}</div>
        </Card>
        <Card><div style={{ fontSize: 11, color: C.fade }}>Dépenses</div><div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO }}>{fmt(depensesMois)}</div></Card>
        <Card style={{ background: soldeMois >= 0 ? '#EAF2EA' : '#F7E8E4' }}>
          <div style={{ fontSize: 11, color: C.fade }}>Solde</div>
          <div style={{ fontSize: 16, fontWeight: 700, fontFamily: FONT_MONO, color: soldeMois >= 0 ? C.green : C.terracotta }}>{fmt(soldeMois)}</div>
        </Card>
      </div>

      {objectifZero && (
        <Card style={{ marginBottom: 14, background: C.cream, borderColor: C.gold }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.navy }}>Mode Objectif Zéro actif</div>
          <div style={{ fontSize: 12, color: C.fade, marginTop: 2 }}>
            {soldeMois === 0 ? 'Chaque franc a une destination ce mois-ci.' :
             soldeMois > 0 ? `${fmt(soldeMois)} n'ont pas encore d'affectation.` :
             `Le mois dépasse le revenu de ${fmt(-soldeMois)}.`}
          </div>
        </Card>
      )}

      <SectionTitle>Comptes</SectionTitle>
      <div style={{ display: 'grid', gap: 8, marginBottom: 14 }}>
        {comptesSoldes.map(c => (
          <Card key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{c.name}</span>
            <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: C.navy }}>{fmt(c.balance)}</span>
          </Card>
        ))}
      </div>

      {pieData.length > 0 && (
        <Card style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Répartition (mois en cours)</div>
          <div style={{ height: 170 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={38} outerRadius={68} paddingAngle={2}>
                  {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      )}

      <Card style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, marginBottom: 4 }}>Revenus vs dépenses — 6 mois</div>
        <div style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last6}>
              <XAxis dataKey="mois" tick={{ fontSize: 10 }} />
              <YAxis hide />
              <Tooltip formatter={(v) => fmt(v)} />
              <Bar dataKey="Revenus" fill={C.navy} radius={[3,3,0,0]} />
              <Bar dataKey="Dépenses" fill={C.terracotta} radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <Row label="Taux de dîme (mois)" value={pct(tauxDime)} valueColor={tauxDime >= 0.10 ? C.green : C.terracotta} />
        <Row label="Objectif dîme" value="10.0 %" />
      </Card>
    </div>
  );
}

// ---------- Dépenses & Revenus (combined, toggle) ----------
function TransactionsTab({ settings, monthTx, addTransaction, deleteTransaction, groupTotals }) {
  const [kind, setKind] = useState('depense');
  const [categoryId, setCategoryId] = useState(settings.categories[0]?.id || '');
  const [compteId, setCompteId] = useState(settings.comptes[0]?.id || '');
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');

  useEffect(() => { if (!settings.categories.find(c => c.id === categoryId)) setCategoryId(settings.categories[0]?.id || ''); }, [settings.categories]);
  useEffect(() => { if (!settings.comptes.find(c => c.id === compteId)) setCompteId(settings.comptes[0]?.id || ''); }, [settings.comptes]);

  const catById = Object.fromEntries(settings.categories.map(c => [c.id, c]));
  const groupById = Object.fromEntries(settings.groups.map(g => [g.id, g]));
  const compteById = Object.fromEntries(settings.comptes.map(c => [c.id, c]));

  function submit() {
    if (!amount) return;
    if (kind === 'revenu' && !source) return;
    if (kind === 'depense' && !categoryId) return;
    addTransaction({ type: kind, categoryId: kind === 'depense' ? categoryId : undefined, source: kind === 'revenu' ? source : undefined, compteId, amount: Number(amount), date, note });
    setAmount(''); setNote(''); setSource('');
  }

  const list = monthTx.filter(t => t.type === kind).sort((a,b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {['depense','revenu'].map(k => (
          <button key={k} onClick={() => setKind(k)} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${C.line}`, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: kind === k ? C.navy : '#fff', color: kind === k ? '#fff' : C.ink,
          }}>{k === 'depense' ? 'Dépense' : 'Revenu'}</button>
        ))}
      </div>

      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          {kind === 'depense' ? (
            <Select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {settings.groups.map(g => (
                <optgroup key={g.id} label={g.name}>
                  {settings.categories.filter(c => c.groupId === g.id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </optgroup>
              ))}
            </Select>
          ) : (
            <TextInput placeholder="Source (ex: Salaire, Ventes Chariow)" value={source} onChange={e => setSource(e.target.value)} />
          )}
          <Select value={compteId} onChange={e => setCompteId(e.target.value)}>
            {settings.comptes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <TextInput type="number" placeholder="Montant (FCFA)" value={amount} onChange={e => setAmount(e.target.value)} />
          <TextInput type="date" value={date} onChange={e => setDate(e.target.value)} />
          {kind === 'depense' && <TextInput placeholder="Note (optionnel)" value={note} onChange={e => setNote(e.target.value)} />}
          <PrimaryButton onClick={submit} disabled={!amount}><Plus size={15}/> Enregistrer</PrimaryButton>
        </div>
      </Card>

      {kind === 'depense' && (
        <>
          <SectionTitle>Par groupe (mois en cours)</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            {settings.groups.filter(g => g.id !== 'g-royaume').map(g => (
              <Row key={g.id} label={g.name} value={fmt(groupTotals[g.id] || 0)} />
            ))}
          </Card>
        </>
      )}

      <SectionTitle>{kind === 'depense' ? 'Détail des dépenses' : 'Revenus du mois'}</SectionTitle>
      {list.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Rien d'enregistré ce mois.</p>}
      <div style={{ display: 'grid', gap: 8 }}>
        {list.map(t => (
          <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{kind === 'depense' ? (catById[t.categoryId]?.name || 'Catégorie supprimée') : t.source}</div>
              <div style={{ fontSize: 11, color: C.fade }}>{t.date} · {compteById[t.compteId]?.name || '—'}{t.note ? ' · ' + t.note : ''}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: kind === 'depense' ? C.terracotta : C.navy }}>{fmt(t.amount)}</span>
              <IconBtn onClick={() => deleteTransaction(t.id)}><Trash2 size={15} /></IconBtn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---------- Royaume (Dons + Disciplines) ----------
function RoyaumeTab({ settings, transactions, addTransaction, deleteTransaction, year, disciplineLogs, saveDisciplineLogs }) {
  const [subview, setSubview] = useState('dons');
  const [donTypeId, setDonTypeId] = useState(settings.donTypes[0]?.id || '');
  const [beneficiary, setBeneficiary] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(todayISO());
  const [receipt, setReceipt] = useState(false);

  useEffect(() => { if (!settings.donTypes.find(d => d.id === donTypeId)) setDonTypeId(settings.donTypes[0]?.id || ''); }, [settings.donTypes]);

  const typeById = Object.fromEntries(settings.donTypes.map(d => [d.id, d]));
  const yearDons = transactions.filter(t => t.type === 'don' && new Date(t.date).getFullYear() === year);
  const revenuAnnuel = transactions.filter(t => t.type === 'revenu' && new Date(t.date).getFullYear() === year).reduce((s,t) => s + Number(t.amount||0), 0);
  const totalGeneral = yearDons.reduce((s,t) => s + Number(t.amount||0), 0);

  function submit() {
    if (!amount || !donTypeId) return;
    addTransaction({ type: 'don', donTypeId, beneficiary, amount: Number(amount), date, receipt });
    setAmount(''); setBeneficiary(''); setReceipt(false);
  }

  const list = yearDons.sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 30);
  const byType = settings.donTypes.map(dt => ({
    ...dt, total: yearDons.filter(t => t.donTypeId === dt.id).reduce((s,t) => s + Number(t.amount||0), 0),
  }));

  // --- disciplines logging ---
  const now = new Date();
  const [logValue, setLogValue] = useState({});
  function logToday(discId) {
    const val = Number(logValue[discId] || 1);
    if (!val) return;
    saveDisciplineLogs([{ id: uid(), disciplineId: discId, date: todayISO(), value: val }, ...disciplineLogs]);
    setLogValue({ ...logValue, [discId]: '' });
  }
  function monthTotal(discId) {
    return disciplineLogs.filter(l => l.disciplineId === discId && inMonth(l.date, now.getMonth(), now.getFullYear())).reduce((s,l) => s + Number(l.value||0), 0);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['dons','Dons'],['disciplines','Disciplines']].map(([k,label]) => (
          <button key={k} onClick={() => setSubview(k)} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${C.line}`, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: subview === k ? C.navy : '#fff', color: subview === k ? '#fff' : C.ink,
          }}>{label}</button>
        ))}
      </div>

      {subview === 'dons' && (
        <div>
          <SectionTitle>Ajouter un don</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <Select value={donTypeId} onChange={e => setDonTypeId(e.target.value)}>
                {settings.donTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </Select>
              <TextInput placeholder="Bénéficiaire / église" value={beneficiary} onChange={e => setBeneficiary(e.target.value)} />
              <TextInput type="number" placeholder="Montant (FCFA)" value={amount} onChange={e => setAmount(e.target.value)} />
              <TextInput type="date" value={date} onChange={e => setDate(e.target.value)} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={receipt} onChange={e => setReceipt(e.target.checked)} /> Reçu obtenu
              </label>
              <PrimaryButton onClick={submit} disabled={!amount}><Plus size={15}/> Enregistrer</PrimaryButton>
            </div>
          </Card>

          <SectionTitle>Récapitulatif {year}</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {byType.map(t => (
              <Card key={t.id}><div style={{fontSize:11,color:C.fade}}>{t.name}</div><div style={{fontFamily:FONT_MONO, fontWeight:700}}>{fmt(t.total)}</div></Card>
            ))}
            <Card style={{ background: `linear-gradient(155deg, ${C.gold} 0%, ${shade(C.gold,-18)} 100%)`, border: 'none', color: '#fff', position: 'relative', overflow: 'hidden' }}>
              <Watermark Icon={Crown} size={64} top={-14} right={-10} opacity={0.18} />
              <div style={{fontSize:11, opacity:0.9}}>% du revenu annuel</div>
              <div style={{fontFamily:FONT_MONO, fontWeight:700, fontVariantNumeric: 'tabular-nums'}}>{revenuAnnuel > 0 ? pct(totalGeneral/revenuAnnuel) : '—'}</div>
            </Card>
          </div>

          <SectionTitle>Historique</SectionTitle>
          {list.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucun don enregistré cette année.</p>}
          <div style={{ display: 'grid', gap: 8 }}>
            {list.map(t => (
              <Card key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{typeById[t.donTypeId]?.name || '—'}{t.beneficiary ? ' · ' + t.beneficiary : ''}</div>
                  <div style={{ fontSize: 11, color: C.fade }}>{t.date}{t.receipt ? ' · reçu ✓' : ''}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: FONT_MONO, fontWeight: 700, color: C.gold }}>{fmt(t.amount)}</span>
                  <IconBtn onClick={() => deleteTransaction(t.id)}><Trash2 size={15} /></IconBtn>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {subview === 'disciplines' && (
        <div>
          <SectionTitle sub="Indicateurs de régularité aux engagements pris — pas une mesure de maturité spirituelle.">Disciplines du mois</SectionTitle>
          <div style={{ display: 'grid', gap: 10 }}>
            {settings.disciplines.map(d => {
              const total = monthTotal(d.id);
              const progress = d.monthlyTarget > 0 ? Math.min(1, total / d.monthlyTarget) : 0;
              return (
                <Card key={d.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</span>
                    <span style={{ fontSize: 12, color: C.fade }}>{total} / {d.monthlyTarget} {d.unit}</span>
                  </div>
                  <div style={{ height: 7, background: C.line, borderRadius: 8, marginTop: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                    <div style={{ height: '100%', width: `${progress*100}%`, background: C.gold }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <TextInput type="number" placeholder="Valeur" value={logValue[d.id] || ''} onChange={e => setLogValue({ ...logValue, [d.id]: e.target.value })} style={{ flex: 1 }} />
                    <button onClick={() => logToday(d.id)} style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 8, padding: '0 14px', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>+ Ajouter</button>
                  </div>
                </Card>
              );
            })}
            {settings.disciplines.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune discipline définie — ajoute-en dans Paramètres.</p>}
          </div>
        </div>
      )}
    </div>
  );
}


export {
  C, FONT_DISPLAY, FONT_MONO, PALETTE, MONTHS_FR,
  uid, fmt, pct, todayISO, inMonth, addMonths, FRUIT_TAGS, defaultSettings,
  Card, SectionTitle, TextInput, Select, PrimaryButton, shade, IconBtn, Row, Pill, Watermark,
  Header, Dashboard, TransactionsTab, RoyaumeTab,
};
