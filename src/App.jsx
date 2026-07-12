import React, { useState, useEffect, useMemo } from 'react';
import { Home, Receipt, HandCoins, CreditCard, PiggyBank, Settings as Gear, Plus, Trash2, ChevronLeft, ChevronRight, Check, X, BookOpen, Sparkles, Crown, Compass, Clock, HeartPulse, Gauge, GraduationCap, Users, LayoutGrid, Wallet } from 'lucide-react';
import {
  C, FONT_DISPLAY, PALETTE, MONTHS_FR, uid, fmt, todayISO, inMonth, defaultSettings,
  Card, SectionTitle, TextInput, Select, PrimaryButton, shade, IconBtn, Row, Pill, Watermark,
  Header, Dashboard, TransactionsTab, RoyaumeTab,
} from './core.jsx';
import { ProvisionsTab, DettesTab, SagesseTab, VisionTab } from './modules-a.jsx';
import { TempsTab, HealthTab, IndiceIntendanceTab, CroissanceTab, RelationsTab } from './modules-b.jsx';

// ---------- Paramètres ----------
function ParametresPanel({ settings, saveSettings, onClose }) {
  const [newGroup, setNewGroup] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatGroup, setNewCatGroup] = useState(settings.groups[0]?.id || '');
  const [newCompte, setNewCompte] = useState('');
  const [newCompteType, setNewCompteType] = useState('banque');
  const [newDonType, setNewDonType] = useState('');
  const [newDiscName, setNewDiscName] = useState('');
  const [newDiscUnit, setNewDiscUnit] = useState('jours');
  const [newDiscTarget, setNewDiscTarget] = useState('');
  const [newTimeName, setNewTimeName] = useState('');
  const [newTimeTarget, setNewTimeTarget] = useState('');
  const [newHealthName, setNewHealthName] = useState('');
  const [newHealthUnit, setNewHealthUnit] = useState('');
  const [newHealthTarget, setNewHealthTarget] = useState('');
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitUnit, setNewHabitUnit] = useState('');
  const [newHabitTarget, setNewHabitTarget] = useState('');
  const [newRelCat, setNewRelCat] = useState('');

  function addGroup() {
    if (!newGroup) return;
    const color = PALETTE[settings.groups.length % PALETTE.length];
    saveSettings({ ...settings, groups: [...settings.groups, { id: uid(), name: newGroup, color }] });
    setNewGroup('');
  }
  function removeGroup(id) {
    saveSettings({ ...settings, groups: settings.groups.filter(g => g.id !== id), categories: settings.categories.filter(c => c.groupId !== id) });
  }
  function addCategory() {
    if (!newCatName || !newCatGroup) return;
    saveSettings({ ...settings, categories: [...settings.categories, { id: uid(), name: newCatName, groupId: newCatGroup, target: null }] });
    setNewCatName('');
  }
  function removeCategory(id) {
    saveSettings({ ...settings, categories: settings.categories.filter(c => c.id !== id) });
  }
  function addCompte() {
    if (!newCompte) return;
    saveSettings({ ...settings, comptes: [...settings.comptes, { id: uid(), name: newCompte, type: newCompteType }] });
    setNewCompte('');
  }
  function removeCompte(id) {
    saveSettings({ ...settings, comptes: settings.comptes.filter(c => c.id !== id) });
  }
  function addDonType() {
    if (!newDonType) return;
    saveSettings({ ...settings, donTypes: [...settings.donTypes, { id: uid(), name: newDonType, isTithe: false }] });
    setNewDonType('');
  }
  function removeDonType(id) {
    saveSettings({ ...settings, donTypes: settings.donTypes.filter(d => d.id !== id) });
  }
  function addDiscipline() {
    if (!newDiscName || !newDiscTarget) return;
    saveSettings({ ...settings, disciplines: [...settings.disciplines, { id: uid(), name: newDiscName, unit: newDiscUnit, monthlyTarget: Number(newDiscTarget) }] });
    setNewDiscName(''); setNewDiscTarget('');
  }
  function removeDiscipline(id) {
    saveSettings({ ...settings, disciplines: settings.disciplines.filter(d => d.id !== id) });
  }
  function addTimeCategory() {
    if (!newTimeName || !newTimeTarget) return;
    const color = PALETTE[(settings.timeCategories||[]).length % PALETTE.length];
    saveSettings({ ...settings, timeCategories: [...(settings.timeCategories||[]), { id: uid(), name: newTimeName, color, weeklyTarget: Number(newTimeTarget) }] });
    setNewTimeName(''); setNewTimeTarget('');
  }
  function removeTimeCategory(id) {
    saveSettings({ ...settings, timeCategories: (settings.timeCategories||[]).filter(t => t.id !== id) });
  }
  function addHealthMetric() {
    if (!newHealthName || !newHealthTarget) return;
    saveSettings({ ...settings, healthMetrics: [...(settings.healthMetrics||[]), { id: uid(), name: newHealthName, unit: newHealthUnit || '', weeklyTarget: Number(newHealthTarget) }] });
    setNewHealthName(''); setNewHealthUnit(''); setNewHealthTarget('');
  }
  function removeHealthMetric(id) {
    saveSettings({ ...settings, healthMetrics: (settings.healthMetrics||[]).filter(h => h.id !== id) });
  }
  function addHabit() {
    if (!newHabitName || !newHabitTarget) return;
    saveSettings({ ...settings, growthHabits: [...(settings.growthHabits||[]), { id: uid(), name: newHabitName, unit: newHabitUnit || '', weeklyTarget: Number(newHabitTarget) }] });
    setNewHabitName(''); setNewHabitUnit(''); setNewHabitTarget('');
  }
  function removeHabit(id) {
    saveSettings({ ...settings, growthHabits: (settings.growthHabits||[]).filter(h => h.id !== id) });
  }
  function addRelCat() {
    if (!newRelCat) return;
    saveSettings({ ...settings, relationCategories: [...(settings.relationCategories||[]), { id: uid(), name: newRelCat }] });
    setNewRelCat('');
  }
  function removeRelCat(id) {
    saveSettings({ ...settings, relationCategories: (settings.relationCategories||[]).filter(c => c.id !== id) });
  }
  function toggleObjectifZero() {
    saveSettings({ ...settings, objectifZero: !settings.objectifZero });
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: C.cream, zIndex: 20, overflowY: 'auto', paddingBottom: 40 }}>
      <div style={{ background: C.navy, color: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700 }}>Paramètres</span>
        <IconBtn onClick={onClose} color="#fff"><X size={20} /></IconBtn>
      </div>
      <div style={{ padding: 16 }}>

        <SectionTitle sub="Rien n'est figé : ajoute, renomme, retire librement.">Comptes</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {settings.comptes.map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{c.name} <span style={{ color: C.fade, fontSize: 11 }}>({c.type})</span></span>
              <IconBtn onClick={() => removeCompte(c.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nom du compte" value={newCompte} onChange={e => setNewCompte(e.target.value)} />
            <Select value={newCompteType} onChange={e => setNewCompteType(e.target.value)}>
              <option value="banque">Banque</option>
              <option value="caisse">Caisse (liquide)</option>
            </Select>
            <PrimaryButton onClick={addCompte} disabled={!newCompte}><Plus size={14}/> Ajouter un compte</PrimaryButton>
          </div>
        </Card>

        <SectionTitle sub="Rien n'est figé : ajoute, renomme, retire librement. Le budget mensuel alimente l'indicateur de Discipline.">Groupes & Catégories</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {settings.groups.map(g => (
            <div key={g.id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: g.color }}>{g.name}</span>
                <IconBtn onClick={() => removeGroup(g.id)}><Trash2 size={14} /></IconBtn>
              </div>
              {settings.categories.filter(c => c.groupId === g.id).map(c => (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '3px 0 3px 10px', gap: 6 }}>
                  <span style={{ fontSize: 12, color: C.fade, flex: 1 }}>· {c.name}</span>
                  <input type="number" placeholder="budget/mois" value={c.target || ''} onChange={e => {
                    const val = e.target.value ? Number(e.target.value) : null;
                    saveSettings({ ...settings, categories: settings.categories.map(cc => cc.id === c.id ? { ...cc, target: val } : cc) });
                  }} style={{ width: 80, fontSize: 11, border: `1px solid ${C.line}`, borderRadius: 6, padding: '2px 6px' }} />
                  <IconBtn onClick={() => removeCategory(c.id)}><Trash2 size={12} /></IconBtn>
                </div>
              ))}
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 10 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nouveau groupe" value={newGroup} onChange={e => setNewGroup(e.target.value)} />
            <PrimaryButton onClick={addGroup} disabled={!newGroup} color={C.gold}><Plus size={14}/> Ajouter un groupe</PrimaryButton>
          </div>
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nouvelle catégorie" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
            <Select value={newCatGroup} onChange={e => setNewCatGroup(e.target.value)}>
              {settings.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
            <PrimaryButton onClick={addCategory} disabled={!newCatName}><Plus size={14}/> Ajouter une catégorie</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Types de dons</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {settings.donTypes.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{d.name}{d.isTithe ? ' (compte pour la dîme)' : ''}</span>
              <IconBtn onClick={() => removeDonType(d.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nouveau type de don" value={newDonType} onChange={e => setNewDonType(e.target.value)} />
            <PrimaryButton onClick={addDonType} disabled={!newDonType}><Plus size={14}/> Ajouter un type</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Disciplines (Royaume)</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {settings.disciplines.map(d => (
            <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{d.name} <span style={{ color: C.fade, fontSize: 11 }}>({d.monthlyTarget} {d.unit}/mois)</span></span>
              <IconBtn onClick={() => removeDiscipline(d.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nom (ex: Méditation)" value={newDiscName} onChange={e => setNewDiscName(e.target.value)} />
            <Select value={newDiscUnit} onChange={e => setNewDiscUnit(e.target.value)}>
              <option value="jours">jours</option>
              <option value="chapitres">chapitres</option>
              <option value="heures">heures</option>
              <option value="personnes">personnes</option>
              <option value="fois">fois</option>
            </Select>
            <TextInput type="number" placeholder="Objectif mensuel" value={newDiscTarget} onChange={e => setNewDiscTarget(e.target.value)} />
            <PrimaryButton onClick={addDiscipline} disabled={!newDiscName || !newDiscTarget} color={C.gold}><Plus size={14}/> Ajouter une discipline</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Catégories de temps</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {(settings.timeCategories||[]).map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13, color: t.color, fontWeight: 700 }}>{t.name} <span style={{ color: C.fade, fontSize: 11, fontWeight: 400 }}>({t.weeklyTarget} h/semaine)</span></span>
              <IconBtn onClick={() => removeTimeCategory(t.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nom (ex: Formation)" value={newTimeName} onChange={e => setNewTimeName(e.target.value)} />
            <TextInput type="number" placeholder="Objectif hebdomadaire (heures)" value={newTimeTarget} onChange={e => setNewTimeTarget(e.target.value)} />
            <PrimaryButton onClick={addTimeCategory} disabled={!newTimeName || !newTimeTarget} color={C.gold}><Plus size={14}/> Ajouter une catégorie de temps</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Indicateurs de santé</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {(settings.healthMetrics||[]).map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{h.name} <span style={{ color: C.fade, fontSize: 11 }}>({h.weeklyTarget} {h.unit}/semaine)</span></span>
              <IconBtn onClick={() => removeHealthMetric(h.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nom (ex: Méditation active)" value={newHealthName} onChange={e => setNewHealthName(e.target.value)} />
            <TextInput placeholder="Unité (ex: h, L, /10)" value={newHealthUnit} onChange={e => setNewHealthUnit(e.target.value)} />
            <TextInput type="number" placeholder="Objectif hebdomadaire" value={newHealthTarget} onChange={e => setNewHealthTarget(e.target.value)} />
            <PrimaryButton onClick={addHealthMetric} disabled={!newHealthName || !newHealthTarget} color={C.green}><Plus size={14}/> Ajouter un indicateur</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Habitudes de croissance</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {(settings.growthHabits||[]).map(h => (
            <div key={h.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{h.name} <span style={{ color: C.fade, fontSize: 11 }}>({h.weeklyTarget} {h.unit}/semaine)</span></span>
              <IconBtn onClick={() => removeHabit(h.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nom (ex: Langue étrangère)" value={newHabitName} onChange={e => setNewHabitName(e.target.value)} />
            <TextInput placeholder="Unité (ex: h, pages)" value={newHabitUnit} onChange={e => setNewHabitUnit(e.target.value)} />
            <TextInput type="number" placeholder="Objectif hebdomadaire" value={newHabitTarget} onChange={e => setNewHabitTarget(e.target.value)} />
            <PrimaryButton onClick={addHabit} disabled={!newHabitName || !newHabitTarget} color={C.purple}><Plus size={14}/> Ajouter une habitude</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Catégories de relations</SectionTitle>
        <Card style={{ marginBottom: 10 }}>
          {(settings.relationCategories||[]).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0' }}>
              <span style={{ fontSize: 13 }}>{c.name}</span>
              <IconBtn onClick={() => removeRelCat(c.id)}><Trash2 size={14} /></IconBtn>
            </div>
          ))}
        </Card>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <TextInput placeholder="Nouvelle catégorie (ex: Église)" value={newRelCat} onChange={e => setNewRelCat(e.target.value)} />
            <PrimaryButton onClick={addRelCat} disabled={!newRelCat} color={C.terracotta}><Plus size={14}/> Ajouter une catégorie</PrimaryButton>
          </div>
        </Card>

        <SectionTitle>Préférences</SectionTitle>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Mode Objectif Zéro</div>
              <div style={{ fontSize: 11, color: C.fade, maxWidth: 220 }}>Affiche si chaque franc du mois a une destination. Désactivé par défaut.</div>
            </div>
            <button onClick={toggleObjectifZero} style={{
              width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
              background: settings.objectifZero ? C.green : C.line, position: 'relative',
            }}>
              <span style={{ position: 'absolute', top: 2, left: settings.objectifZero ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.15s' }} />
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ---------- Modules launcher (grouped by capital) ----------
const CAPITALS = [
  { id: 'financier', name: 'Capital financier', icon: Wallet, color: C.gold,
    modules: [
      { id: 'transactions', label: 'Mouvements', icon: Receipt },
      { id: 'provisions', label: 'Provisions', icon: PiggyBank },
      { id: 'dettes', label: 'Dettes', icon: CreditCard },
    ] },
  { id: 'spirituel', name: 'Capital spirituel', icon: Crown, color: C.gold,
    modules: [
      { id: 'royaume', label: 'Royaume', icon: Crown },
      { id: 'sagesse', label: 'Sagesse', icon: BookOpen },
    ] },
  { id: 'temporel', name: 'Capital temporel', icon: Clock, color: C.navy,
    modules: [
      { id: 'temps', label: 'Temps', icon: Clock },
      { id: 'vision', label: 'Vision', icon: Compass },
    ] },
  { id: 'physique', name: 'Capital physique', icon: HeartPulse, color: C.terracotta,
    modules: [ { id: 'sante', label: 'Santé', icon: HeartPulse } ] },
  { id: 'intellectuel', name: 'Capital intellectuel', icon: GraduationCap, color: C.purple,
    modules: [ { id: 'croissance', label: 'Croissance', icon: GraduationCap } ] },
  { id: 'relationnel', name: 'Capital relationnel', icon: Users, color: C.green,
    modules: [ { id: 'relations', label: 'Relations', icon: Users } ] },
];

function ModulesLauncher({ onSelect, onClose }) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.cream, zIndex: 25, overflowY: 'auto', paddingBottom: 30 }}>
      <div style={{ background: `linear-gradient(160deg, ${C.navy} 0%, #072238 100%)`, color: '#fff', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 700 }}>Modules</span>
        <IconBtn onClick={onClose} color="#fff"><X size={20} /></IconBtn>
      </div>
      <div style={{ padding: 16 }}>
        {CAPITALS.map(cap => {
          const CapIcon = cap.icon;
          return (
            <div key={cap.id} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: cap.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CapIcon size={14} color="#fff" />
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: C.navy, letterSpacing: 0.2 }}>{cap.name}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {cap.modules.map(m => {
                  const MIcon = m.icon;
                  return (
                    <button key={m.id} onClick={() => onSelect(m.id)} style={{
                      background: '#fff', border: `1px solid ${C.line}`, borderRadius: 14, padding: '16px 12px',
                      boxShadow: '0 1px 2px rgba(11,47,78,0.04), 0 4px 14px rgba(11,47,78,0.05)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer',
                    }}>
                      <MIcon size={22} color={cap.color} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: C.ink }}>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Tab bar (minimal: Accueil · Intendance · Modules) ----------
function TabBar({ tab, setTab, onOpenModules }) {
  const items = [
    { id: 'dashboard', label: 'Accueil', icon: Home },
    { id: 'intendance', label: 'Intendance', icon: Gauge },
  ];
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: `1px solid ${C.line}`, display: 'flex', alignItems: 'center', padding: '10px 10px 12px', boxShadow: '0 -4px 14px rgba(11,47,78,0.04)' }}>
      {items.map(it => {
        const Icon = it.icon; const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{ flex: 1, background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, cursor: 'pointer' }}>
            <Icon size={19} strokeWidth={active ? 2.4 : 2} color={active ? C.gold : C.fade} />
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? C.navy : C.fade }}>{it.label}</span>
          </button>
        );
      })}
      <button onClick={onOpenModules} style={{
        width: 52, height: 52, borderRadius: '50%', border: 'none', cursor: 'pointer', flexShrink: 0,
        background: `linear-gradient(155deg, ${C.gold} 0%, ${shade(C.gold, -18)} 100%)`,
        boxShadow: `0 4px 12px ${C.gold}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 6,
      }}>
        <LayoutGrid size={20} color="#fff" />
      </button>
    </div>
  );
}

// ---------- App ----------
export default function App() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(defaultSettings());
  const [transactions, setTransactions] = useState([]);
  const [debts, setDebts] = useState([]);
  const [provisions, setProvisions] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [journal, setJournal] = useState([]);
  const [disciplineLogs, setDisciplineLogs] = useState([]);
  const [visionDoc, setVisionDoc] = useState({});
  const [objectifs, setObjectifs] = useState([]);
  const [revues, setRevues] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [healthLogs, setHealthLogs] = useState([]);
  const [poidsLogs, setPoidsLogs] = useState([]);
  const [manualScores, setManualScores] = useState({});
  const [lectures, setLectures] = useState([]);
  const [growthLogs, setGrowthLogs] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [tab, setTab] = useState('dashboard');
  const [showSettings, setShowSettings] = useState(false);
  const [showModules, setShowModules] = useState(false);
  const now = new Date();
  const [monthIdx, setMonthIdx] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    (async () => {
      try { const s = await window.storage.get('settings'); if (s) setSettings(JSON.parse(s.value)); } catch (e) {}
      try { const t = await window.storage.get('transactions'); setTransactions(t ? JSON.parse(t.value) : []); } catch (e) { setTransactions([]); }
      try { const d = await window.storage.get('debts'); setDebts(d ? JSON.parse(d.value) : []); } catch (e) { setDebts([]); }
      try { const p = await window.storage.get('provisions'); setProvisions(p ? JSON.parse(p.value) : []); } catch (e) { setProvisions([]); }
      try { const dc = await window.storage.get('decisions'); setDecisions(dc ? JSON.parse(dc.value) : []); } catch (e) { setDecisions([]); }
      try { const jr = await window.storage.get('journal'); setJournal(jr ? JSON.parse(jr.value) : []); } catch (e) { setJournal([]); }
      try { const dl = await window.storage.get('disciplineLogs'); setDisciplineLogs(dl ? JSON.parse(dl.value) : []); } catch (e) { setDisciplineLogs([]); }
      try { const vd = await window.storage.get('visionDoc'); setVisionDoc(vd ? JSON.parse(vd.value) : {}); } catch (e) { setVisionDoc({}); }
      try { const ob = await window.storage.get('objectifs'); setObjectifs(ob ? JSON.parse(ob.value) : []); } catch (e) { setObjectifs([]); }
      try { const rv = await window.storage.get('revues'); setRevues(rv ? JSON.parse(rv.value) : []); } catch (e) { setRevues([]); }
      try { const tl = await window.storage.get('timeLogs'); setTimeLogs(tl ? JSON.parse(tl.value) : []); } catch (e) { setTimeLogs([]); }
      try { const hl = await window.storage.get('healthLogs'); setHealthLogs(hl ? JSON.parse(hl.value) : []); } catch (e) { setHealthLogs([]); }
      try { const pl = await window.storage.get('poidsLogs'); setPoidsLogs(pl ? JSON.parse(pl.value) : []); } catch (e) { setPoidsLogs([]); }
      try { const ms = await window.storage.get('manualScores'); setManualScores(ms ? JSON.parse(ms.value) : {}); } catch (e) { setManualScores({}); }
      try { const lc = await window.storage.get('lectures'); setLectures(lc ? JSON.parse(lc.value) : []); } catch (e) { setLectures([]); }
      try { const gl = await window.storage.get('growthLogs'); setGrowthLogs(gl ? JSON.parse(gl.value) : []); } catch (e) { setGrowthLogs([]); }
      try { const ct = await window.storage.get('contacts'); setContacts(ct ? JSON.parse(ct.value) : []); } catch (e) { setContacts([]); }
      setLoading(false);
    })();
  }, []);

  async function saveSettings(next) {
    setSettings(next);
    try { await window.storage.set('settings', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveTransactions(next) {
    setTransactions(next);
    try { await window.storage.set('transactions', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveDebts(next) {
    setDebts(next);
    try { await window.storage.set('debts', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveProvisions(next) {
    setProvisions(next);
    try { await window.storage.set('provisions', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveDecisions(next) {
    setDecisions(next);
    try { await window.storage.set('decisions', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveJournal(next) {
    setJournal(next);
    try { await window.storage.set('journal', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveDisciplineLogs(next) {
    setDisciplineLogs(next);
    try { await window.storage.set('disciplineLogs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveVisionDoc(next) {
    setVisionDoc(next);
    try { await window.storage.set('visionDoc', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveObjectifs(next) {
    setObjectifs(next);
    try { await window.storage.set('objectifs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveRevues(next) {
    setRevues(next);
    try { await window.storage.set('revues', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveTimeLogs(next) {
    setTimeLogs(next);
    try { await window.storage.set('timeLogs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveHealthLogs(next) {
    setHealthLogs(next);
    try { await window.storage.set('healthLogs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function savePoidsLogs(next) {
    setPoidsLogs(next);
    try { await window.storage.set('poidsLogs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveManualScores(next) {
    setManualScores(next);
    try { await window.storage.set('manualScores', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveLectures(next) {
    setLectures(next);
    try { await window.storage.set('lectures', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveGrowthLogs(next) {
    setGrowthLogs(next);
    try { await window.storage.set('growthLogs', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  async function saveContacts(next) {
    setContacts(next);
    try { await window.storage.set('contacts', JSON.stringify(next)); } catch (e) { console.error(e); }
  }
  function addTransaction(tx) { saveTransactions([{ ...tx, id: uid() }, ...transactions]); }
  function deleteTransaction(id) { saveTransactions(transactions.filter(t => t.id !== id)); }
  function prevMonth() { if (monthIdx === 0) { setMonthIdx(11); setYear(year - 1); } else setMonthIdx(monthIdx - 1); }
  function nextMonth() { if (monthIdx === 11) { setMonthIdx(0); setYear(year + 1); } else setMonthIdx(monthIdx + 1); }

  const monthTx = useMemo(() => transactions.filter(t => inMonth(t.date, monthIdx, year)), [transactions, monthIdx, year]);
  const revenuMois = useMemo(() => monthTx.filter(t=>t.type==='revenu').reduce((s,t)=>s+Number(t.amount||0),0), [monthTx]);
  const donsMois = useMemo(() => monthTx.filter(t=>t.type==='don').reduce((s,t)=>s+Number(t.amount||0),0), [monthTx]);
  const depensesMois = useMemo(() => monthTx.filter(t=>t.type==='depense').reduce((s,t)=>s+Number(t.amount||0),0), [monthTx]);
  const soldeMois = revenuMois - donsMois - depensesMois;
  const titheTypeIds = settings.donTypes.filter(d => d.isTithe).map(d => d.id);
  const dimeMois = useMemo(() => monthTx.filter(t=>t.type==='don' && titheTypeIds.includes(t.donTypeId)).reduce((s,t)=>s+Number(t.amount||0),0), [monthTx, settings.donTypes]);
  const tauxDime = revenuMois > 0 ? dimeMois / revenuMois : 0;

  const catById = Object.fromEntries(settings.categories.map(c => [c.id, c]));
  const groupTotals = useMemo(() => {
    const totals = {};
    settings.groups.forEach(g => { totals[g.id] = 0; });
    totals['g-royaume'] = donsMois;
    monthTx.filter(t => t.type === 'depense').forEach(t => {
      const cat = catById[t.categoryId];
      if (cat) totals[cat.groupId] = (totals[cat.groupId] || 0) + Number(t.amount || 0);
    });
    return totals;
  }, [monthTx, donsMois, settings]);
  const pieData = settings.groups.map(g => ({ name: g.name, value: groupTotals[g.id] || 0, color: g.color })).filter(d => d.value > 0);

  const comptesSoldes = useMemo(() => settings.comptes.map(c => {
    const rev = transactions.filter(t => t.compteId === c.id && t.type === 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
    const out = transactions.filter(t => t.compteId === c.id && t.type !== 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
    return { ...c, balance: rev - out };
  }), [transactions, settings.comptes]);

  const last6 = useMemo(() => {
    const arr = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, monthIdx - i, 1);
      const m = d.getMonth(), y = d.getFullYear();
      const tx = transactions.filter(t => inMonth(t.date, m, y));
      const rev = tx.filter(t => t.type === 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
      const dep = tx.filter(t => t.type !== 'revenu').reduce((s,t) => s + Number(t.amount||0), 0);
      arr.push({ mois: MONTHS_FR[m].slice(0,3), Revenus: rev, Dépenses: dep });
    }
    return arr;
  }, [transactions, monthIdx, year]);

  if (loading) {
    return <div style={{ background: C.cream, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: C.navy, fontFamily: FONT_DISPLAY }}>Chargement...</p></div>;
  }

  return (
    <div style={{ background: C.cream, minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 460, margin: '0 auto', minHeight: '100vh', background: '#fff', boxShadow: '0 0 30px rgba(0,0,0,0.08)', position: 'relative', paddingBottom: 76 }}>
        <Header monthIdx={monthIdx} year={year} onPrev={prevMonth} onNext={nextMonth} tauxDime={tauxDime} onOpenSettings={() => setShowSettings(true)} />
        <div style={{ padding: '16px 16px 8px' }}>
          {tab === 'dashboard' && <Dashboard revenuMois={revenuMois} donsMois={donsMois} depensesMois={depensesMois} soldeMois={soldeMois} tauxDime={tauxDime} pieData={pieData} last6={last6} comptesSoldes={comptesSoldes} objectifZero={settings.objectifZero} />}
          {tab === 'transactions' && <TransactionsTab settings={settings} monthTx={monthTx} addTransaction={addTransaction} deleteTransaction={deleteTransaction} groupTotals={groupTotals} />}
          {tab === 'royaume' && <RoyaumeTab settings={settings} transactions={transactions} addTransaction={addTransaction} deleteTransaction={deleteTransaction} year={year} disciplineLogs={disciplineLogs} saveDisciplineLogs={saveDisciplineLogs} />}
          {tab === 'provisions' && <ProvisionsTab provisions={provisions} saveProvisions={saveProvisions} monthIdx={monthIdx} />}
          {tab === 'dettes' && <DettesTab debts={debts} saveDebts={saveDebts} />}
          {tab === 'sagesse' && <SagesseTab decisions={decisions} saveDecisions={saveDecisions} journal={journal} saveJournal={saveJournal} />}
          {tab === 'vision' && <VisionTab visionDoc={visionDoc} saveVisionDoc={saveVisionDoc} objectifs={objectifs} saveObjectifs={saveObjectifs} revues={revues} saveRevues={saveRevues} />}
          {tab === 'temps' && <TempsTab settings={settings} timeLogs={timeLogs} saveTimeLogs={saveTimeLogs} />}
          {tab === 'sante' && <HealthTab settings={settings} healthLogs={healthLogs} saveHealthLogs={saveHealthLogs} poidsLogs={poidsLogs} savePoidsLogs={savePoidsLogs} />}
          {tab === 'croissance' && <CroissanceTab settings={settings} lectures={lectures} saveLectures={saveLectures} growthLogs={growthLogs} saveGrowthLogs={saveGrowthLogs} />}
          {tab === 'relations' && <RelationsTab settings={settings} contacts={contacts} saveContacts={saveContacts} />}
          {tab === 'intendance' && <IndiceIntendanceTab settings={settings} transactions={transactions} debts={debts} timeLogs={timeLogs} healthLogs={healthLogs} decisions={decisions} objectifs={objectifs} revues={revues} monthIdx={monthIdx} year={year} manualScores={manualScores} saveManualScores={saveManualScores} />}
        </div>
        <TabBar tab={tab} setTab={setTab} onOpenModules={() => setShowModules(true)} />
        {showSettings && <ParametresPanel settings={settings} saveSettings={saveSettings} onClose={() => setShowSettings(false)} />}
        {showModules && <ModulesLauncher onSelect={(id) => { setTab(id); setShowModules(false); }} onClose={() => setShowModules(false)} />}
      </div>
    </div>
  );
}
