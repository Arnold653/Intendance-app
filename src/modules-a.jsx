import React, { useState, useEffect } from 'react';
import { Home, Receipt, HandCoins, CreditCard, PiggyBank, Settings as Gear, Plus, Trash2, ChevronLeft, ChevronRight, Check, X, BookOpen, Sparkles, Crown, Compass, Clock, HeartPulse, Gauge, GraduationCap, Users, LayoutGrid, Wallet } from 'lucide-react';
import {
  C, FONT_DISPLAY, FONT_MONO, uid, fmt, pct, todayISO, addMonths, FRUIT_TAGS,
  Card, SectionTitle, TextInput, Select, PrimaryButton, IconBtn, Row, Pill,
} from './core.jsx';

// ---------- Provisions / Lissage ----------
function ProvisionsTab({ provisions, saveProvisions, monthIdx }) {
  const [name, setName] = useState('');
  const [annualAmount, setAnnualAmount] = useState('');

  function addProvision() {
    if (!name || !annualAmount) return;
    saveProvisions([...provisions, { id: uid(), name, annualAmount: Number(annualAmount), reserveCurrent: 0, createdAt: todayISO() }]);
    setName(''); setAnnualAmount('');
  }
  function cotiser(id, monthly) {
    saveProvisions(provisions.map(p => p.id === id ? { ...p, reserveCurrent: p.reserveCurrent + monthly } : p));
  }
  function payer(id) {
    saveProvisions(provisions.map(p => p.id === id ? { ...p, reserveCurrent: Math.max(0, p.reserveCurrent - p.annualAmount) } : p));
  }
  function remove(id) {
    saveProvisions(provisions.filter(p => p.id !== id));
  }

  const monthsElapsed = monthIdx + 1;

  return (
    <div>
      <SectionTitle sub="Lisse les charges annuelles irrégulières (impôts, assurance, vacances) pour éviter les mois rouges.">Provisions</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <TextInput placeholder="Nom (ex: Assurance véhicule)" value={name} onChange={e => setName(e.target.value)} />
          <TextInput type="number" placeholder="Montant annuel (FCFA)" value={annualAmount} onChange={e => setAnnualAmount(e.target.value)} />
          <PrimaryButton onClick={addProvision} disabled={!name || !annualAmount}><Plus size={15}/> Créer la provision</PrimaryButton>
        </div>
      </Card>

      <div style={{ display: 'grid', gap: 10 }}>
        {provisions.map(p => {
          const monthly = p.annualAmount / 12;
          const expected = monthly * monthsElapsed;
          const onTrack = p.reserveCurrent >= expected - 0.5;
          return (
            <Card key={p.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.fade }}>{fmt(monthly)} / mois</div>
                </div>
                <IconBtn onClick={() => remove(p.id)}><Trash2 size={15} /></IconBtn>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, fontFamily: FONT_MONO, color: onTrack ? C.green : C.terracotta }}>{fmt(p.reserveCurrent)}</div>
                  <Pill color={onTrack ? C.green : C.terracotta}>{onTrack ? 'À jour' : 'Sous-provisionné'}</Pill>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => cotiser(p.id, monthly)} style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>+ Cotiser</button>
                  <button onClick={() => payer(p.id)} style={{ background: C.navy, color: '#fff', border: 'none', borderRadius: 6, padding: '6px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Payer facture</button>
                </div>
              </div>
            </Card>
          );
        })}
        {provisions.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune provision créée pour l'instant.</p>}
      </div>
    </div>
  );
}

// ---------- Dettes ----------
function DettesTab({ debts, saveDebts }) {
  const [name, setName] = useState('');
  const [initialBalance, setInitialBalance] = useState('');
  const [currentBalance, setCurrentBalance] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');

  function addDebt() {
    if (!name || !currentBalance || !monthlyPayment) return;
    saveDebts([...debts, { id: uid(), name, initialBalance: Number(initialBalance || currentBalance), currentBalance: Number(currentBalance), monthlyPayment: Number(monthlyPayment) }]);
    setName(''); setInitialBalance(''); setCurrentBalance(''); setMonthlyPayment('');
  }
  function recordPayment(id) {
    saveDebts(debts.map(d => d.id === id ? { ...d, currentBalance: Math.max(0, d.currentBalance - d.monthlyPayment) } : d));
  }
  function removeDebt(id) { saveDebts(debts.filter(d => d.id !== id)); }

  const sorted = [...debts].sort((a,b) => a.currentBalance - b.currentBalance);
  const totalRestant = debts.reduce((s,d) => s + d.currentBalance, 0);

  return (
    <div>
      <SectionTitle>Ajouter une dette</SectionTitle>
      <Card style={{ marginBottom: 14 }}>
        <div style={{ display: 'grid', gap: 8 }}>
          <TextInput placeholder="Nom de la dette" value={name} onChange={e => setName(e.target.value)} />
          <TextInput type="number" placeholder="Solde initial (optionnel)" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} />
          <TextInput type="number" placeholder="Solde actuel (FCFA)" value={currentBalance} onChange={e => setCurrentBalance(e.target.value)} />
          <TextInput type="number" placeholder="Paiement mensuel (FCFA)" value={monthlyPayment} onChange={e => setMonthlyPayment(e.target.value)} />
          <PrimaryButton onClick={addDebt} disabled={!name || !currentBalance || !monthlyPayment}><Plus size={15}/> Ajouter</PrimaryButton>
        </div>
      </Card>
      <Card style={{ marginBottom: 14, background: C.navy, color: '#fff', border: 'none' }}>
        <div style={{ fontSize: 11, opacity: 0.8 }}>Total dettes restantes</div>
        <div style={{ fontSize: 18, fontWeight: 700, fontFamily: FONT_MONO }}>{fmt(totalRestant)}</div>
      </Card>
      <SectionTitle>Stratégie boule de neige</SectionTitle>
      {sorted.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune dette enregistrée — bonne nouvelle !</p>}
      <div style={{ display: 'grid', gap: 10 }}>
        {sorted.map((d, i) => {
          const monthsLeft = d.monthlyPayment > 0 ? Math.ceil(d.currentBalance / d.monthlyPayment) : null;
          const progress = d.initialBalance > 0 ? 1 - (d.currentBalance / d.initialBalance) : 0;
          return (
            <Card key={d.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {i === 0 && <Pill color={C.green}>PRIORITÉ 1</Pill>}
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>{monthsLeft !== null ? `${monthsLeft} mois restants` : ''}</div>
                </div>
                <IconBtn onClick={() => removeDebt(d.id)}><Trash2 size={15} /></IconBtn>
              </div>
              <div style={{ height: 7, background: C.line, borderRadius: 8, marginTop: 8, overflow: 'hidden', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
                <div style={{ height: '100%', width: `${Math.max(0,Math.min(100,progress*100))}%`, background: C.green }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontFamily: FONT_MONO, fontSize: 13, fontWeight: 700, color: C.terracotta }}>{fmt(d.currentBalance)}</span>
                <button onClick={() => recordPayment(d.id)} style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 6, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><Check size={12}/> Paiement du mois</button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Sagesse (Décisions + Journal) ----------
function SagesseTab({ decisions, saveDecisions, journal, saveJournal }) {
  const [subview, setSubview] = useState('decisions');

  // --- decision form state ---
  const [majeure, setMajeure] = useState(false);
  const [objet, setObjet] = useState('');
  const [cout, setCout] = useState('');
  const [note, setNote] = useState('');
  const [pourquoi, setPourquoi] = useState('');
  const [alternatives, setAlternatives] = useState('');
  const [risques, setRisques] = useState('');
  const [valeurs, setValeurs] = useState('');
  const [conseillers, setConseillers] = useState('');
  const [tagFruit, setTagFruit] = useState('');

  function resetForm() {
    setObjet(''); setCout(''); setNote(''); setPourquoi(''); setAlternatives('');
    setRisques(''); setValeurs(''); setConseillers(''); setMajeure(false); setTagFruit('');
  }
  function addDecision() {
    if (!objet) return;
    const date = todayISO();
    const d = {
      id: uid(), date, objet, cout: cout ? Number(cout) : null, note, majeure, tagFruit,
      pourquoi: majeure ? pourquoi : '', alternatives: majeure ? alternatives : '',
      risques: majeure ? risques : '', valeurs: majeure ? valeurs : '', conseillers: majeure ? conseillers : '',
      dateRelecture: majeure ? addMonths(date, 6) : null, resultat: '', statut: 'ouverte',
    };
    saveDecisions([d, ...decisions]);
    resetForm();
  }
  function removeDecision(id) { saveDecisions(decisions.filter(d => d.id !== id)); }
  function submitRelecture(id, resultat) {
    saveDecisions(decisions.map(d => d.id === id ? { ...d, resultat, statut: 'relue' } : d));
  }

  // --- journal form state ---
  const [texte, setTexte] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  function addJournalEntry() {
    if (!texte) return;
    saveJournal([{ id: uid(), date: todayISO(), texte, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) }, ...journal]);
    setTexte(''); setTagsInput('');
  }
  function removeJournalEntry(id) { saveJournal(journal.filter(j => j.id !== id)); }

  const today = todayISO();
  const dueDecisions = decisions.filter(d => d.majeure && d.statut === 'ouverte' && d.dateRelecture && d.dateRelecture <= today);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {[['decisions','Décisions'],['journal','Journal']].map(([k,label]) => (
          <button key={k} onClick={() => setSubview(k)} style={{
            flex: 1, padding: '9px', borderRadius: 8, border: `1px solid ${C.line}`, fontWeight: 700, fontSize: 13, cursor: 'pointer',
            background: subview === k ? C.navy : '#fff', color: subview === k ? '#fff' : C.ink,
          }}>{label}</button>
        ))}
      </div>

      {subview === 'decisions' && (
        <div>
          {dueDecisions.length > 0 && (
            <Card style={{ marginBottom: 14, background: C.cream, borderColor: C.gold }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.navy, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={14} color={C.gold} /> {dueDecisions.length} décision(s) à relire
              </div>
              <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>« Qu'a produit cette décision ? » — 6 mois se sont écoulés.</div>
            </Card>
          )}

          <SectionTitle sub="Pourquoi ? Quel coût ? Quel fruit ? Est-ce aligné ?">Nouvelle décision</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <TextInput placeholder="Objet de la décision" value={objet} onChange={e => setObjet(e.target.value)} />
              <TextInput type="number" placeholder="Coût estimé (FCFA, optionnel)" value={cout} onChange={e => setCout(e.target.value)} />
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={majeure} onChange={e => setMajeure(e.target.checked)} /> Décision majeure — analyse complète
              </label>
              {!majeure && <TextInput placeholder="Note libre (optionnel)" value={note} onChange={e => setNote(e.target.value)} />}
              {majeure && (
                <>
                  <TextInput placeholder="Pourquoi cette décision ?" value={pourquoi} onChange={e => setPourquoi(e.target.value)} />
                  <TextInput placeholder="Alternatives envisagées" value={alternatives} onChange={e => setAlternatives(e.target.value)} />
                  <TextInput placeholder="Risques" value={risques} onChange={e => setRisques(e.target.value)} />
                  <TextInput placeholder="Valeurs concernées" value={valeurs} onChange={e => setValeurs(e.target.value)} />
                  <TextInput placeholder="Conseillers consultés" value={conseillers} onChange={e => setConseillers(e.target.value)} />
                </>
              )}
              <Select value={tagFruit} onChange={e => setTagFruit(e.target.value)}>
                <option value="">Fruit visé (optionnel)</option>
                {FRUIT_TAGS.map(f => <option key={f} value={f}>{f}</option>)}
              </Select>
              <PrimaryButton onClick={addDecision} disabled={!objet} color={majeure ? C.gold : C.navy}>
                <Plus size={15}/> {majeure ? 'Enregistrer (relecture dans 6 mois)' : 'Enregistrer'}
              </PrimaryButton>
            </div>
          </Card>

          <SectionTitle>Registre</SectionTitle>
          {decisions.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune décision enregistrée.</p>}
          <div style={{ display: 'grid', gap: 8 }}>
            {decisions.map(d => (
              <DecisionCard key={d.id} d={d} onDelete={() => removeDecision(d.id)} onRelecture={(r) => submitRelecture(d.id, r)} />
            ))}
          </div>
        </div>
      )}

      {subview === 'journal' && (
        <div>
          <SectionTitle sub="Leçons, erreurs, réflexions — libre, horodaté.">Nouvelle entrée</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <textarea value={texte} onChange={e => setTexte(e.target.value)} placeholder="Qu'as-tu appris aujourd'hui ?" rows={4}
                style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: '9px 10px', fontSize: 14, fontFamily: 'inherit', resize: 'vertical' }} />
              <TextInput placeholder="Tags séparés par des virgules (ex: finances, famille)" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
              <PrimaryButton onClick={addJournalEntry} disabled={!texte}><Plus size={15}/> Ajouter au journal</PrimaryButton>
            </div>
          </Card>
          <SectionTitle>Entrées</SectionTitle>
          {journal.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Le journal est vide.</p>}
          <div style={{ display: 'grid', gap: 8 }}>
            {journal.map(j => (
              <Card key={j.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 11, color: C.fade }}>{j.date}</span>
                  <IconBtn onClick={() => removeJournalEntry(j.id)}><Trash2 size={14} /></IconBtn>
                </div>
                <p style={{ fontSize: 13, margin: '4px 0' }}>{j.texte}</p>
                {j.tags.length > 0 && <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>{j.tags.map((t,i) => <Pill key={i} color={C.purple}>{t}</Pill>)}</div>}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionCard({ d, onDelete, onRelecture }) {
  const [resultat, setResultat] = useState('');
  const [expanded, setExpanded] = useState(false);
  const due = d.majeure && d.statut === 'ouverte' && d.dateRelecture && d.dateRelecture <= todayISO();
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {d.majeure && <Pill color={C.gold}>MAJEURE</Pill>}
            {d.statut === 'relue' && <Pill color={C.green}>RELUE</Pill>}
            {due && <Pill color={C.terracotta}>À RELIRE</Pill>}
            <span style={{ fontSize: 13, fontWeight: 700 }}>{d.objet}</span>
          </div>
          <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>{d.date}{d.cout ? ' · ' + fmt(d.cout) : ''}{d.tagFruit ? ' · fruit visé : ' + d.tagFruit : ''}</div>
        </div>
        <IconBtn onClick={onDelete}><Trash2 size={15} /></IconBtn>
      </div>
      {(d.note || d.pourquoi) && (
        <p style={{ fontSize: 12, color: C.ink, marginTop: 6, cursor: d.majeure ? 'pointer' : 'default' }} onClick={() => d.majeure && setExpanded(!expanded)}>
          {d.note || d.pourquoi}
        </p>
      )}
      {d.majeure && expanded && (
        <div style={{ fontSize: 12, color: C.fade, marginTop: 4, display: 'grid', gap: 3 }}>
          {d.alternatives && <div><b>Alternatives :</b> {d.alternatives}</div>}
          {d.risques && <div><b>Risques :</b> {d.risques}</div>}
          {d.valeurs && <div><b>Valeurs :</b> {d.valeurs}</div>}
          {d.conseillers && <div><b>Conseillers :</b> {d.conseillers}</div>}
        </div>
      )}
      {due && (
        <div style={{ marginTop: 10, display: 'grid', gap: 6 }}>
          <TextInput placeholder="Qu'a produit cette décision ?" value={resultat} onChange={e => setResultat(e.target.value)} />
          <PrimaryButton onClick={() => onRelecture(resultat)} disabled={!resultat} color={C.gold}><Check size={14}/> Enregistrer la relecture</PrimaryButton>
        </div>
      )}
      {d.statut === 'relue' && d.resultat && (
        <div style={{ fontSize: 12, marginTop: 6, padding: 8, background: C.cream, borderRadius: 6 }}>
          <b>Résultat :</b> {d.resultat}
        </div>
      )}
    </Card>
  );
}

// ---------- Vision & Plan stratégique ----------
const HORIZONS = [
  { id: '10ans', label: '10 ans' },
  { id: 'annuel', label: 'Annuel' },
  { id: 'trimestriel', label: 'Trimestriel' },
];

function VisionTab({ visionDoc, saveVisionDoc, objectifs, saveObjectifs, revues, saveRevues }) {
  const [subview, setSubview] = useState('vision');

  const [appel, setAppel] = useState(visionDoc.appel || '');
  const [mission, setMission] = useState(visionDoc.mission || '');
  const [valeurs, setValeurs] = useState(visionDoc.valeurs || '');
  const [heritage, setHeritage] = useState(visionDoc.heritage || '');
  const [editingVision, setEditingVision] = useState(false);

  function saveVision() {
    saveVisionDoc({ appel, mission, valeurs, heritage, lastUpdated: todayISO() });
    setEditingVision(false);
  }

  const [horizon, setHorizon] = useState('annuel');
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [echeance, setEcheance] = useState('');
  const [filterHorizon, setFilterHorizon] = useState('annuel');

  function addObjectif() {
    if (!titre) return;
    saveObjectifs([{ id: uid(), horizon, titre, description, echeance, statut: 'en cours' }, ...objectifs]);
    setTitre(''); setDescription(''); setEcheance('');
  }
  function cycleStatut(id) {
    const order = ['en cours', 'atteint', 'abandonné'];
    saveObjectifs(objectifs.map(o => o.id === id ? { ...o, statut: order[(order.indexOf(o.statut) + 1) % order.length] } : o));
  }
  function removeObjectif(id) { saveObjectifs(objectifs.filter(o => o.id !== id)); }

  const [fruits, setFruits] = useState('');
  const [gaspillage, setGaspillage] = useState('');
  const [arreter, setArreter] = useState('');
  const [deleguer, setDeleguer] = useState('');
  const [portes, setPortes] = useState('');
  const [decisionFinale, setDecisionFinale] = useState('');

  function addRevue() {
    if (!decisionFinale) return;
    saveRevues([{ id: uid(), date: todayISO(), fruits, gaspillage, arreter, deleguer, portes, decisionFinale }, ...revues]);
    setFruits(''); setGaspillage(''); setArreter(''); setDeleguer(''); setPortes(''); setDecisionFinale('');
  }

  const statutColor = { 'en cours': C.navy, 'atteint': C.green, 'abandonné': C.fade };

  return (
    <div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        {[['vision','Vision'],['objectifs','Objectifs'],['revue','Cour du Royaume']].map(([k,label]) => (
          <button key={k} onClick={() => setSubview(k)} style={{
            flex: 1, padding: '8px 4px', borderRadius: 8, border: `1px solid ${C.line}`, fontWeight: 700, fontSize: 11.5, cursor: 'pointer',
            background: subview === k ? C.navy : '#fff', color: subview === k ? '#fff' : C.ink,
          }}>{label}</button>
        ))}
      </div>

      {subview === 'vision' && (
        <div>
          <SectionTitle sub={visionDoc.lastUpdated ? `Dernière mise à jour : ${visionDoc.lastUpdated}` : "Document vivant, révisé rarement, jamais improvisé."}>
            Vision du Royaume
          </SectionTitle>
          {!editingVision ? (
            <div style={{ display: 'grid', gap: 10 }}>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4 }}>APPEL</div><p style={{ fontSize: 13, margin: 0 }}>{visionDoc.appel || '—'}</p></Card>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4 }}>MISSION</div><p style={{ fontSize: 13, margin: 0 }}>{visionDoc.mission || '—'}</p></Card>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4 }}>VALEURS</div><p style={{ fontSize: 13, margin: 0 }}>{visionDoc.valeurs || '—'}</p></Card>
              <Card><div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 4 }}>HÉRITAGE VISÉ</div><p style={{ fontSize: 13, margin: 0 }}>{visionDoc.heritage || '—'}</p></Card>
              <PrimaryButton onClick={() => setEditingVision(true)} color={C.gold}>Modifier</PrimaryButton>
            </div>
          ) : (
            <Card>
              <div style={{ display: 'grid', gap: 8 }}>
                <label style={{ fontSize: 11, fontWeight: 700, color: C.fade }}>Appel</label>
                <textarea value={appel} onChange={e => setAppel(e.target.value)} rows={2} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <label style={{ fontSize: 11, fontWeight: 700, color: C.fade }}>Mission</label>
                <textarea value={mission} onChange={e => setMission(e.target.value)} rows={2} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <label style={{ fontSize: 11, fontWeight: 700, color: C.fade }}>Valeurs</label>
                <textarea value={valeurs} onChange={e => setValeurs(e.target.value)} rows={2} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <label style={{ fontSize: 11, fontWeight: 700, color: C.fade }}>Héritage visé</label>
                <textarea value={heritage} onChange={e => setHeritage(e.target.value)} rows={2} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ flex: 1 }}><PrimaryButton onClick={saveVision} color={C.green}><Check size={14}/> Enregistrer</PrimaryButton></div>
                  <div style={{ flex: 1 }}><PrimaryButton onClick={() => setEditingVision(false)} color={C.fade}>Annuler</PrimaryButton></div>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {subview === 'objectifs' && (
        <div>
          <SectionTitle sub="La vision guide les objectifs, les objectifs guident les actions.">Nouvel objectif</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <Select value={horizon} onChange={e => setHorizon(e.target.value)}>
                {HORIZONS.map(h => <option key={h.id} value={h.id}>{h.label}</option>)}
              </Select>
              <TextInput placeholder="Titre de l'objectif" value={titre} onChange={e => setTitre(e.target.value)} />
              <TextInput placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />
              <TextInput type="date" placeholder="Échéance" value={echeance} onChange={e => setEcheance(e.target.value)} />
              <PrimaryButton onClick={addObjectif} disabled={!titre}><Plus size={15}/> Ajouter</PrimaryButton>
            </div>
          </Card>

          <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
            {HORIZONS.map(h => (
              <button key={h.id} onClick={() => setFilterHorizon(h.id)} style={{
                flex: 1, padding: '6px', borderRadius: 6, border: `1px solid ${C.line}`, fontSize: 11, fontWeight: 700, cursor: 'pointer',
                background: filterHorizon === h.id ? C.gold : '#fff', color: filterHorizon === h.id ? '#fff' : C.ink,
              }}>{h.label}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gap: 8 }}>
            {objectifs.filter(o => o.horizon === filterHorizon).map(o => (
              <Card key={o.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{o.titre}</div>
                    {o.description && <div style={{ fontSize: 12, color: C.fade, marginTop: 2 }}>{o.description}</div>}
                    {o.echeance && <div style={{ fontSize: 11, color: C.fade, marginTop: 2 }}>Échéance : {o.echeance}</div>}
                  </div>
                  <IconBtn onClick={() => removeObjectif(o.id)}><Trash2 size={14} /></IconBtn>
                </div>
                <button onClick={() => cycleStatut(o.id)} style={{ marginTop: 8, background: statutColor[o.statut], color: '#fff', border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                  {o.statut}
                </button>
              </Card>
            ))}
            {objectifs.filter(o => o.horizon === filterHorizon).length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucun objectif à cet horizon.</p>}
          </div>
        </div>
      )}

      {subview === 'revue' && (
        <div>
          <SectionTitle sub="Tous les trois mois : ce qui porte du fruit, ce qui n'en porte pas, ce qu'il faut arrêter ou déléguer.">Cour du Royaume</SectionTitle>
          <Card style={{ marginBottom: 14 }}>
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ fontSize: 12, fontWeight: 700 }}>Qu'est-ce qui produit le plus de fruit ?</label>
              <TextInput value={fruits} onChange={e => setFruits(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 700 }}>Qu'est-ce qui consomme beaucoup sans résultat ?</label>
              <TextInput value={gaspillage} onChange={e => setGaspillage(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 700 }}>Quelles activités dois-je arrêter ?</label>
              <TextInput value={arreter} onChange={e => setArreter(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 700 }}>Quels projets dois-je déléguer ?</label>
              <TextInput value={deleguer} onChange={e => setDeleguer(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 700 }}>Où Dieu semble-t-il ouvrir une porte ?</label>
              <TextInput value={portes} onChange={e => setPortes(e.target.value)} />
              <label style={{ fontSize: 12, fontWeight: 700 }}>Décision officielle de ce trimestre</label>
              <textarea value={decisionFinale} onChange={e => setDecisionFinale(e.target.value)} rows={3} style={{ width: '100%', border: `1px solid ${C.line}`, borderRadius: 8, padding: 8, fontFamily: 'inherit', fontSize: 13 }} />
              <PrimaryButton onClick={addRevue} disabled={!decisionFinale} color={C.gold}><Check size={15}/> Clôturer la revue</PrimaryButton>
            </div>
          </Card>
          <SectionTitle>Historique des revues</SectionTitle>
          {revues.length === 0 && <p style={{ fontSize: 13, color: C.fade }}>Aucune revue trimestrielle enregistrée.</p>}
          <div style={{ display: 'grid', gap: 8 }}>
            {revues.map(r => (
              <Card key={r.id}>
                <div style={{ fontSize: 11, color: C.fade }}>{r.date}</div>
                <p style={{ fontSize: 13, margin: '4px 0', fontWeight: 700 }}>{r.decisionFinale}</p>
                {r.fruits && <div style={{ fontSize: 11, color: C.fade }}>Fruit : {r.fruits}</div>}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export { ProvisionsTab, DettesTab, SagesseTab, VisionTab };
