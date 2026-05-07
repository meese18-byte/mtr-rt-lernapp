// ─────────────────────────────────────────────
// ACCESSIBILITY (A11y) — Helpers
// ─────────────────────────────────────────────

// Globaler Tastatur-Handler:
// Enter und Space lösen Click auf [role="button"][tabindex="0"] aus.
// Wird einmal an document gebunden — gilt für alle aktuellen und zukünftigen Elemente.
document.addEventListener('keydown', function(e) {
  if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
  const t = e.target;
  if (!t || !t.matches) return;
  if (t.matches('[role="button"][tabindex], [role="checkbox"][tabindex], [role="radio"][tabindex]')) {
    if (t.getAttribute('aria-disabled') === 'true') return;
    e.preventDefault();
    t.click();
  }
});

// Live-Region: Screenreader-Ankündigung
function srAnnounce(msg) {
  const el = document.getElementById('srLive');
  if (!el) return;
  // Trick: Inhalt zuerst leeren, damit Wiederholungen auch angesagt werden
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 30);
}

// ARIA-Aufräumer: nach jedem Render alle interaktiven divs mit Rolle/Tabindex versehen
function applyAriaRoles(scope) {
  const root = scope || document.getElementById('main-content') || document;

  // Quiz: Block als radiogroup, Optionen als radio
  root.querySelectorAll('.quiz-block').forEach((block, idx) => {
    if (block.dataset.ariaInit === '1') return;
    const q = block.querySelector('.quiz-q');
    if (q) {
      const qid = q.id || `qq-${Math.random().toString(36).slice(2,8)}`;
      q.id = qid;
      block.setAttribute('role', 'radiogroup');
      block.setAttribute('aria-labelledby', qid);
    }
    block.querySelectorAll('.qopt').forEach(opt => {
      opt.setAttribute('role', 'radio');
      opt.setAttribute('tabindex', '0');
      opt.setAttribute('aria-checked', 'false');
    });
    const fb = block.querySelector('.qfeedback');
    if (fb) {
      fb.setAttribute('role', 'status');
      fb.setAttribute('aria-live', 'polite');
      fb.setAttribute('aria-atomic', 'true');
    }
    block.dataset.ariaInit = '1';
  });

  // Match-Items als button
  root.querySelectorAll('.mi').forEach(mi => {
    if (mi.dataset.ariaInit === '1') return;
    mi.setAttribute('role', 'button');
    mi.setAttribute('tabindex', '0');
    const side = mi.dataset.side === 'left' ? 'links' : 'rechts';
    const txt = (mi.textContent || '').trim().slice(0, 80);
    mi.setAttribute('aria-label', `${txt} — Spalte ${side}, Enter zum Auswählen`);
    mi.dataset.ariaInit = '1';
  });
  root.querySelectorAll('.match-score').forEach(el => {
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
  });

  // Checklist-Items als checkbox
  root.querySelectorAll('.citem').forEach(c => {
    if (c.dataset.ariaInit === '1') return;
    c.setAttribute('role', 'checkbox');
    c.setAttribute('tabindex', '0');
    c.setAttribute('aria-checked', 'false');
    c.dataset.ariaInit = '1';
  });

  // Path-Tiles als button mit aria-pressed
  root.querySelectorAll('.path-tile').forEach(t => {
    t.setAttribute('role', 'button');
    t.setAttribute('tabindex', '0');
    t.setAttribute('aria-pressed', t.classList.contains('path-active') ? 'true' : 'false');
  });

  // Intro-Tiles als button
  root.querySelectorAll('.itile').forEach(t => {
    if (t.dataset.ariaInit === '1') return;
    t.setAttribute('role', 'button');
    t.setAttribute('tabindex', '0');
    const title = (t.querySelector('.itile-title') || {}).textContent || 'Section öffnen';
    t.setAttribute('aria-label', title.trim());
    t.dataset.ariaInit = '1';
  });

  // Word-Hint live
  root.querySelectorAll('.word-hint').forEach(el => {
    el.setAttribute('aria-live', 'polite');
  });

  // Praxis-Textareas mit aria-labelledby an die praxis-label binden
  root.querySelectorAll('.praxis-block').forEach((block, idx) => {
    const lbl = block.querySelector('.praxis-label');
    const ta  = block.querySelector('textarea');
    if (lbl && ta) {
      const id = lbl.id || `praxis-lbl-${idx}`;
      lbl.id = id;
      ta.setAttribute('aria-labelledby', id);
    }
  });
}


// level: 'basis' | 'vertiefung' | 'examen' (Niveau-Badge in Sidebar)
// paths: in welchen Lernpfaden diese Section erscheint
const NAV = [
  { id:'intro',           label:'Start & Übersicht',        group:null,    groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
  { id:'dept-info',       label:'0.1 Abteilung als Prozess',group:'teil0', groupLabel:'Teil 0 – Orientierung & Kausalkette',     level:'basis',      paths:['all','orientierung','vollkurs'] },
  { id:'dept-aufgaben',   label:'0.2 Aufgaben Abteilung',   group:'teil0', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs'] },
  { id:'physbio-info',    label:'0.3 Physik + Biologie',    group:'teil0', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs'] },
  { id:'physbio-aufgaben',label:'0.4 Aufgaben Kausalkette', group:'teil0', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs'] },
  { id:'zv-info',         label:'1.1 Zielvolumenkonzept',   group:'teil1', groupLabel:'Teil 1 – Planungsgrundlagen',             level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
  { id:'zv-aufgaben',     label:'1.2 Aufgaben ZV',          group:'teil1', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
  { id:'dosis-info',      label:'2.1 Isodosen & Dosislogik',group:'teil1', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs'] },
  { id:'dvh-info',        label:'2.2 DVH lesen',            group:'teil1', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs','examen'] },
  { id:'dvh-aufgaben',    label:'2.3 Aufgaben DVH',         group:'teil1', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs','examen'] },
  { id:'dosis-aufgaben',  label:'2.4 Aufgaben Isodosen',    group:'teil1', groupLabel:null,                                       level:'examen',     paths:['all','vollkurs','examen'] },
  { id:'tech-info',       label:'3.1 Technikwahl verstehen',group:'teil1', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs'] },
  { id:'tech-aufgaben',   label:'3.2 Aufgaben Techniken',   group:'teil1', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs','examen'] },
  { id:'plancheck',       label:'3.3 MTR-Plancheck',        group:'teil1', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs','examen'] },
  { id:'fall1-info',      label:'Fall 1: Mamma-Ca',         group:'teil2', groupLabel:'Teil 2 – Fallarbeit',                     level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
  { id:'fall1-aufgaben',  label:'↳ Aufgaben Fall 1',        group:'teil2', groupLabel:null,                                       level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
  { id:'fall2-info',      label:'Fall 2: Prostata-Ca',      group:'teil2', groupLabel:null,                                       level:'vertiefung', paths:['all','vollkurs','examen'] },
  { id:'fall2-aufgaben',  label:'↳ Aufgaben Fall 2',        group:'teil2', groupLabel:null,                                       level:'examen',     paths:['all','vollkurs','examen'] },
  { id:'abschluss',       label:'Abschluss & Reflexion',    group:'end',   groupLabel:'Abschluss',                                level:'basis',      paths:['all','orientierung','vollkurs','examen'] },
];

// Lernpfade
const PATHS = {
  all:           { label:'Frei navigieren', icon:'🔓', desc:'Alle Sections, eigene Reihenfolge', meta:'19 Sections' },
  orientierung:  { label:'Orientierung',    icon:'🌱', desc:'1. Lehrjahr · Erstkontakt · Grundlagen + ein Fall', meta:'~45 min · 11 Sections' },
  vollkurs:      { label:'Vollkurs',        icon:'🎓', desc:'2.–3. Lehrjahr · alle Inhalte in voller Tiefe',     meta:'~2 h · 19 Sections' },
  examen:        { label:'Examensfokus',    icon:'🎯', desc:'Aufgaben + beide Fälle + Plancheck, Theorie nur kurz', meta:'~60 min · 12 Sections' },
};
const LEVEL_LABEL = { basis:'Basis', vertiefung:'Vertiefung', examen:'Anwendung/Examen' };

// ─────────────────────────────────────────────
// APP STATE
// ─────────────────────────────────────────────
const STATE_KEY = 'mtr_rt_bestrahlungstechniken_plancheck_hybrid_v5_erweitert';
let state = { current: 'intro', done: [], path: null };

function loadState() {
  try { const s = localStorage.getItem(STATE_KEY); if(s) state = Object.assign({ current:'intro', done:[], path:null }, JSON.parse(s)); } catch(e){}
}
function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch(e){}
}
function markDone(id) {
  if(!state.done.includes(id)) { state.done.push(id); saveState(); }
  renderNav();
}

// ─────────────────────────────────────────────
// PFAD-LOGIK
// ─────────────────────────────────────────────
function activePath() { return state.path || 'all'; }

function pathSections() {
  const p = activePath();
  return NAV.filter(s => s.paths.includes(p));
}

function setPath(p) {
  state.path = (p === 'all') ? null : p;
  saveState();
  // Wenn aktuelle Section nicht mehr im neuen Pfad: zur ersten Section springen
  const list = pathSections();
  if (!list.find(s => s.id === state.current)) {
    state.current = list[0].id;
    saveState();
    renderSection(state.current);
    document.getElementById('main-content').scrollTop = 0;
    window.scrollTo(0,0);
  } else if (state.current === 'intro') {
    // Intro neu rendern, damit Pfad-Auswahl-Highlight aktualisiert
    renderSection('intro');
  }
  renderNav();
}

// ─────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────
function renderNav() {
  const nb = document.getElementById('navBody');
  const list = pathSections();
  let html = '';
  list.forEach(s => {
    if(s.groupLabel) html += `<div class="nav-group-label" role="presentation">${s.groupLabel}</div>`;
    const active = state.current === s.id ? 'active' : '';
    const done = state.done.includes(s.id) ? 'done' : '';
    const lvl = s.level ? `<span class="nav-lvl lvl-${s.level}" title="${LEVEL_LABEL[s.level]}" aria-hidden="true"></span><span class="sr-only">Niveau ${LEVEL_LABEL[s.level]}.</span>` : '';
    const ariaCurrent = active ? ' aria-current="page"' : '';
    const doneAria = done ? '<span class="sr-only">bearbeitet.</span>' : '';
    html += `<div class="nav-item ${active} ${done}" role="button" tabindex="0" onclick="navigate('${s.id}')"${ariaCurrent} aria-label="${s.label}${done ? ' (bearbeitet)' : ''}"><span class="nav-dot" aria-hidden="true"></span><span class="nav-label">${s.label}</span>${lvl}${doneAria}</div>`;
  });
  nb.innerHTML = html;
  // progress bezogen auf aktuellen Pfad
  const total = list.length;
  const doneInPath = state.done.filter(id => list.find(s => s.id === id)).length;
  document.getElementById('progText').textContent = `${doneInPath} / ${total}`;
  const pct = total ? (doneInPath/total)*100 : 0;
  document.getElementById('progFill').style.width = `${pct}%`;
  // ARIA progressbar
  const track = document.querySelector('.progress-track');
  if (track) { track.setAttribute('aria-valuenow', Math.round(pct)); track.setAttribute('aria-valuetext', `${doneInPath} von ${total} Sections bearbeitet`); }
  // Pfad-Anzeige im Sidebar-Header
  const pl = document.getElementById('pathLabel');
  if (pl) {
    const p = PATHS[activePath()];
    pl.innerHTML = `<span class="path-icon" aria-hidden="true">${p.icon}</span><span class="path-name">${p.label}</span>`;
  }
}

function navigate(id) {
  matchState = {};
  state.current = id;
  saveState();
  renderNav();
  renderSection(id);
  document.getElementById('main-content').scrollTop = 0;
  window.scrollTo(0,0);
}

function nextSection() {
  const list = pathSections();
  const idx = list.findIndex(s => s.id === state.current);
  if(idx >= 0 && idx < list.length - 1) { navigate(list[idx+1].id); }
}
function prevSection() {
  const list = pathSections();
  const idx = list.findIndex(s => s.id === state.current);
  if(idx > 0) { navigate(list[idx-1].id); }
}

// ─────────────────────────────────────────────
// QUIZ LOGIC
// ─────────────────────────────────────────────
function handleQuizClick(el) {
  const block = el.closest('.quiz-block');
  if(block.querySelector('.qdone')) return;
  const correct = el.dataset.correct === '1';
  const opts = block.querySelectorAll('.qopt');
  opts.forEach(o => {
    o.classList.add('qdone');
    o.setAttribute('aria-disabled', 'true');
    o.setAttribute('tabindex', '-1');
    if(o.dataset.correct === '1') o.classList.add('qcorrect');
  });
  el.setAttribute('aria-checked', 'true');
  if(!correct) el.classList.add('qwrong');
  const fb = block.querySelector('.qfeedback');
  if(fb) {
    fb.classList.add('show', correct ? 'fb-ok' : 'fb-err');
    fb.innerHTML = correct
      ? '<strong>✓ Richtig.</strong> ' + (fb.dataset.ok || '')
      : '<strong>✗ Nicht korrekt.</strong> ' + (fb.dataset.err || '');
  }
  srAnnounce(correct ? 'Richtige Antwort. Begründung wird angezeigt.' : 'Antwort nicht korrekt. Erklärung wird angezeigt.');
  // check if all quizzes on page done
  checkPageQuizzes();
}

function checkPageQuizzes() {
  const blocks = document.querySelectorAll('.quiz-block');
  if(!blocks.length) return;
  const allDone = Array.from(blocks).every(b => b.querySelector('.qdone'));
  if(allDone) markDone(state.current);
}

// ─────────────────────────────────────────────
// MATCH LOGIC
// ─────────────────────────────────────────────
let matchState = {};

function initMatch(containerId) {
  matchState[containerId] = { selLeft: null, selRight: null };
}

function handleMatchClick(el, side, containerId) {
  if(!el) return;
  const ms = matchState[containerId] || (matchState[containerId] = { selLeft: null, selRight: null });
  if(el.classList.contains('mmatched') || el.classList.contains('mok')) return;

  // deselect prev
  const container = document.getElementById(containerId);
  if(!container) return;
  container.querySelectorAll('.mi.msel').forEach(m => {
    if(m !== el) { m.classList.remove('msel'); m.setAttribute('aria-pressed', 'false'); }
  });
  el.classList.toggle('msel');
  el.setAttribute('aria-pressed', el.classList.contains('msel') ? 'true' : 'false');

  if(side === 'left') ms.selLeft = el.classList.contains('msel') ? el : null;
  else ms.selRight = el.classList.contains('msel') ? el : null;

  matchState[containerId] = ms;

  if(ms.selLeft && ms.selRight) {
    const correct = ms.selLeft.dataset.pair === ms.selRight.dataset.pair;
    const L = ms.selLeft, R = ms.selRight;
    ms.selLeft = null; ms.selRight = null;
    if(!L || !R) return;
    if(correct) {
      [L,R].forEach(n => {
        n.classList.remove('msel');
        n.classList.add('mok','mmatched');
        n.setAttribute('aria-pressed', 'false');
        n.setAttribute('aria-disabled', 'true');
        n.setAttribute('tabindex', '-1');
      });
    } else {
      [L,R].forEach(n => {
        n.classList.remove('msel');
        n.classList.add('merr');
        n.setAttribute('aria-pressed', 'false');
      });
      setTimeout(() => {
        if(L) L.classList.remove('merr');
        if(R) R.classList.remove('merr');
      }, 600);
    }
    // check done
    const lefts = container.querySelectorAll('[data-side="left"]');
    const allOk = Array.from(lefts).every(m => m.classList.contains('mok'));
    const scoreEl = container.querySelector('.match-score');
    const matched = container.querySelectorAll('.mi.mok').length / 2;
    const total = lefts.length;
    if(scoreEl) scoreEl.textContent = `${matched} / ${total} Paare korrekt zugeordnet`;
    if (correct) { srAnnounce(`Richtig zugeordnet. ${matched} von ${total}.`); }
    else { srAnnounce('Paar nicht korrekt — Auswahl wird zurückgesetzt.'); }
    if(allOk) { markDone(state.current); if(scoreEl) scoreEl.textContent = `✓ Alle ${total} Paare korrekt zugeordnet!`; srAnnounce(`Alle ${total} Paare korrekt.`); }
  }
}

// ─────────────────────────────────────────────
// CHECKLIST
// ─────────────────────────────────────────────
function toggleCheck(el) {
  el.classList.toggle('checked');
  const isChecked = el.classList.contains('checked');
  const check = el.querySelector('.ccheck');
  if(check) check.textContent = isChecked ? '✓' : '';
  el.setAttribute('aria-checked', isChecked ? 'true' : 'false');
}


function wordCount(text) {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}

function revealExpectation(btn, minWords = 20) {
  const block = btn.closest('.transfer-block') || btn.closest('.card');
  if(!block) return;
  const ta = block.querySelector('textarea');
  const hint = block.querySelector('.word-hint');
  const exp = block.querySelector('.expectation');
  const words = ta ? wordCount(ta.value) : minWords;
  if(ta && words < minWords) {
    if(hint) {
      hint.textContent = `Noch zu knapp: ${words}/${minWords} Wörter. Eine vollständige Begründung enthält Ursache, Konsequenz und Handlung.`;
      hint.style.color = 'var(--warning)';
    }
    ta.focus();
    srAnnounce(`Antwort zu kurz: ${words} von ${minWords} Wörtern.`);
    return;
  }
  if(exp) {
    exp.style.display = 'block';
    exp.setAttribute('role', 'region');
    exp.setAttribute('aria-label', 'Erwartungshorizont');
    exp.setAttribute('tabindex', '-1');
    exp.focus({ preventScroll: false });
  }
  if(hint) {
    hint.textContent = 'Erwartungshorizont eingeblendet — vergleiche kritisch mit deiner eigenen Antwort.';
    hint.style.color = 'var(--success)';
  }
  srAnnounce('Erwartungshorizont eingeblendet.');
}

function completeTransferPage(minWords = 20) {
  const tas = document.querySelectorAll('.transfer-ta[data-required-words]');
  let ok = true;
  tas.forEach(ta => {
    const need = parseInt(ta.dataset.requiredWords || minWords, 10);
    if(wordCount(ta.value) < need) {
      ok = false;
      ta.style.borderColor = 'var(--warning)';
    } else {
      ta.style.borderColor = 'var(--success)';
    }
  });
  if(!ok) {
    alert('Bitte fülle zuerst alle Pflicht-Freitextfelder aus. Eine nachvollziehbare Begründung enthält Ursache, Konsequenz und Handlung — mindestens etwa 20 Wörter.');
    return;
  }
  markDone(state.current);
  nextSection();
}

// ─────────────────────────────────────────────
// SVG HELPERS
// ─────────────────────────────────────────────
function svgVolumes() {
  return `<svg viewBox="0 0 320 260" width="320" height="260" style="max-width:100%">
  <defs>
    <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- IV -->
  <ellipse cx="160" cy="132" rx="145" ry="115" fill="rgba(59,130,246,0.04)" stroke="#60a5fa" stroke-width="1.2" stroke-dasharray="5,4"/>
  <!-- TV -->
  <ellipse cx="160" cy="128" rx="118" ry="94" fill="rgba(16,185,129,0.05)" stroke="#34d399" stroke-width="1.4"/>
  <!-- PTV -->
  <ellipse cx="158" cy="126" rx="94" ry="76" fill="rgba(245,158,11,0.07)" stroke="#fbbf24" stroke-width="1.6" stroke-dasharray="6,3"/>
  <!-- CTV -->
  <path d="M158,56 C192,50 218,76 224,112 C230,148 214,180 180,188 C146,196 116,178 102,150 C88,122 92,82 118,66 Z" fill="rgba(249,115,22,0.08)" stroke="#fb923c" stroke-width="1.6"/>
  <!-- GTV -->
  <path d="M158,88 C175,84 192,100 195,120 C198,140 184,158 164,161 C144,164 128,149 126,131 C124,113 132,94 158,88 Z" fill="rgba(239,68,68,0.18)" stroke="#f87171" stroke-width="2" filter="url(#glow)"/>
  <!-- Labels -->
  <text x="160" y="128" text-anchor="middle" font-family="'Fira Code',monospace" font-size="13" fill="#f87171" font-weight="600">GTV</text>
  <text x="110" y="74" font-family="'Fira Code',monospace" font-size="11" fill="#fb923c">CTV</text>
  <text x="222" y="60" font-family="'Fira Code',monospace" font-size="11" fill="#fbbf24">PTV</text>
  <text x="268" y="95" font-family="'Fira Code',monospace" font-size="11" fill="#34d399">TV</text>
  <text x="288" y="125" font-family="'Fira Code',monospace" font-size="11" fill="#60a5fa">IV</text>
  <!-- Margin arrow CTV → PTV -->
  <line x1="130" y1="190" x2="104" y2="210" stroke="#fbbf24" stroke-width="1" stroke-dasharray="2,2" opacity="0.6"/>
  <text x="48" y="225" font-family="'Outfit',sans-serif" font-size="9" fill="#fbbf24" opacity="0.8">+ Setup-Marge</text>
  <!-- OAR hint -->
  <ellipse cx="52" cy="100" rx="22" ry="30" fill="rgba(139,92,246,0.1)" stroke="#a78bfa" stroke-width="1.2" stroke-dasharray="3,2"/>
  <text x="52" y="104" text-anchor="middle" font-family="'Fira Code',monospace" font-size="9" fill="#a78bfa">OAR</text>
</svg>`;
}

function svgIsodose() {
  return `<svg viewBox="0 0 300 260" width="300" height="260" style="max-width:100%">
  <!-- Body outline -->
  <ellipse cx="150" cy="130" rx="138" ry="118" fill="rgba(17,24,39,0.8)" stroke="#1f3050" stroke-width="1.5"/>
  <!-- Isodose fills + lines from outside in -->
  <ellipse cx="148" cy="128" rx="115" ry="100" fill="rgba(59,130,246,0.04)" stroke="#60a5fa" stroke-width="1" opacity="0.7"/>
  <ellipse cx="148" cy="126" rx="92" ry="82" fill="rgba(16,185,129,0.06)" stroke="#10b981" stroke-width="1.3"/>
  <ellipse cx="148" cy="124" rx="70" ry="62" fill="rgba(132,204,22,0.06)" stroke="#84cc16" stroke-width="1.5"/>
  <ellipse cx="148" cy="122" rx="50" ry="44" fill="rgba(245,158,11,0.09)" stroke="#f59e0b" stroke-width="1.8"/>
  <ellipse cx="146" cy="120" rx="34" ry="29" fill="rgba(239,68,68,0.14)" stroke="#ef4444" stroke-width="2"/>
  <ellipse cx="144" cy="118" rx="18" ry="16" fill="rgba(220,38,38,0.28)" stroke="#dc2626" stroke-width="2.2"/>
  <!-- PTV dashed -->
  <ellipse cx="146" cy="120" rx="32" ry="27" fill="none" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="5,3"/>
  <!-- Labels on right side -->
  <text x="268" y="35" font-family="'Fira Code',monospace" font-size="10" fill="#dc2626">107%</text>
  <text x="268" y="53" font-family="'Fira Code',monospace" font-size="10" fill="#ef4444">95%</text>
  <text x="268" y="71" font-family="'Fira Code',monospace" font-size="10" fill="#f59e0b">80%</text>
  <text x="268" y="89" font-family="'Fira Code',monospace" font-size="10" fill="#84cc16">50%</text>
  <text x="268" y="107" font-family="'Fira Code',monospace" font-size="10" fill="#10b981">20%</text>
  <text x="268" y="125" font-family="'Fira Code',monospace" font-size="10" fill="#60a5fa">10%</text>
  <!-- Legend lines -->
  <line x1="240" y1="32" x2="260" y2="32" stroke="#dc2626" stroke-width="2.2"/>
  <line x1="240" y1="50" x2="260" y2="50" stroke="#ef4444" stroke-width="2"/>
  <line x1="240" y1="68" x2="260" y2="68" stroke="#f59e0b" stroke-width="1.8"/>
  <line x1="240" y1="86" x2="260" y2="86" stroke="#84cc16" stroke-width="1.5"/>
  <line x1="240" y1="104" x2="260" y2="104" stroke="#10b981" stroke-width="1.3"/>
  <line x1="240" y1="122" x2="260" y2="122" stroke="#60a5fa" stroke-width="1"/>
  <!-- PTV label -->
  <text x="115" y="118" font-family="'Fira Code',monospace" font-size="10" fill="#fbbf24">PTV</text>
  <line x1="126" y1="115" x2="144" y2="108" stroke="#fbbf24" stroke-width="0.8" stroke-dasharray="2,2"/>
</svg>`;
}

function svgBeams(type) {
  const c = 120, r = 90;
  const body = `<ellipse cx="${c}" cy="${c}" rx="55" ry="45" fill="rgba(22,32,50,0.8)" stroke="#1f3050" stroke-width="1.5"/>
  <ellipse cx="${c}" cy="${c}" rx="20" ry="16" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" stroke-width="1.5"/>`;
  const beam = (ang, color='rgba(6,182,212,0.3)') => {
    const rad = ang * Math.PI / 180;
    const x1 = c + Math.sin(rad)*r, y1 = c - Math.cos(rad)*r;
    const x2 = c + Math.sin(rad)*22, y2 = c - Math.cos(rad)*18;
    const pw = 14;
    const px1 = x1 + Math.cos(rad)*pw/2, py1 = y1 + Math.sin(rad)*pw/2;
    const px2 = x1 - Math.cos(rad)*pw/2, py2 = y1 - Math.sin(rad)*pw/2;
    return `<polygon points="${px1},${py1} ${px2},${py2} ${x2+Math.cos(rad)*4},${y2+Math.sin(rad)*4} ${x2-Math.cos(rad)*4},${y2-Math.sin(rad)*4}" fill="${color}" stroke="#06b6d4" stroke-width="0.8" opacity="0.9"/>`;
  };
  const configs = {
    'steh': [0],
    'gegen': [0, 180],
    '4fb': [0, 90, 180, 270],
    'tan': [45, 135],
    'vmat': null
  };
  let beams = '';
  if(type === 'vmat') {
    beams = `<circle cx="${c}" cy="${c}" r="${r-5}" fill="none" stroke="rgba(6,182,212,0.3)" stroke-width="8" stroke-dasharray="3,2"/>`;
    for(let a=0;a<360;a+=30) beams += beam(a,'rgba(6,182,212,0.15)');
  } else {
    (configs[type]||[0]).forEach(a => { beams += beam(a); });
  }
  return `<svg viewBox="0 0 240 240" width="110" height="110"><g>${body}${beams}</g></svg>`;
}


function svgDepartmentFlow() {
  return `<svg viewBox="0 0 760 250" width="760" height="250" style="max-width:100%">
  <defs>
    <marker id="arrowDept" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#06b6d4"/>
    </marker>
    <linearGradient id="deptGrad" x1="0" x2="1">
      <stop offset="0%" stop-color="rgba(6,182,212,0.22)"/>
      <stop offset="100%" stop-color="rgba(139,92,246,0.22)"/>
    </linearGradient>
  </defs>
  <rect x="10" y="20" width="740" height="205" rx="14" fill="rgba(17,24,39,0.72)" stroke="#1f3050"/>
  <g font-family="'Outfit',system-ui,sans-serif" font-size="12">
    <g>
      <rect x="35" y="68" width="120" height="74" rx="10" fill="url(#deptGrad)" stroke="#06b6d4"/>
      <text x="95" y="95" text-anchor="middle" fill="#e2eaf6" font-weight="700">Ambulanz</text>
      <text x="95" y="115" text-anchor="middle" fill="#6b87a8">Indikation</text>
      <text x="95" y="132" text-anchor="middle" fill="#6b87a8">Aufklärung</text>
    </g>
    <g>
      <rect x="185" y="68" width="120" height="74" rx="10" fill="rgba(245,158,11,0.13)" stroke="#f59e0b"/>
      <text x="245" y="95" text-anchor="middle" fill="#e2eaf6" font-weight="700">Planungs-CT</text>
      <text x="245" y="115" text-anchor="middle" fill="#6b87a8">Lagerung</text>
      <text x="245" y="132" text-anchor="middle" fill="#6b87a8">Bilddaten</text>
    </g>
    <g>
      <rect x="335" y="68" width="120" height="74" rx="10" fill="rgba(139,92,246,0.14)" stroke="#8b5cf6"/>
      <text x="395" y="95" text-anchor="middle" fill="#e2eaf6" font-weight="700">Planung</text>
      <text x="395" y="115" text-anchor="middle" fill="#6b87a8">Konturen</text>
      <text x="395" y="132" text-anchor="middle" fill="#6b87a8">DVH / QA</text>
    </g>
    <g>
      <rect x="485" y="68" width="120" height="74" rx="10" fill="rgba(16,185,129,0.13)" stroke="#10b981"/>
      <text x="545" y="95" text-anchor="middle" fill="#e2eaf6" font-weight="700">Bunker</text>
      <text x="545" y="115" text-anchor="middle" fill="#6b87a8">Setup / IGRT</text>
      <text x="545" y="132" text-anchor="middle" fill="#6b87a8">Fraktionen</text>
    </g>
    <g>
      <rect x="625" y="68" width="100" height="74" rx="10" fill="rgba(239,68,68,0.11)" stroke="#ef4444"/>
      <text x="675" y="95" text-anchor="middle" fill="#e2eaf6" font-weight="700">Support</text>
      <text x="675" y="115" text-anchor="middle" fill="#6b87a8">Neben-</text>
      <text x="675" y="132" text-anchor="middle" fill="#6b87a8">wirkungen</text>
    </g>
    <line x1="156" y1="105" x2="180" y2="105" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowDept)"/>
    <line x1="306" y1="105" x2="330" y2="105" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowDept)"/>
    <line x1="456" y1="105" x2="480" y2="105" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowDept)"/>
    <line x1="606" y1="105" x2="620" y2="105" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowDept)"/>
    <text x="380" y="183" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="700">Jeder Übergabepunkt ist ein möglicher Sicherheits- und Kommunikationspunkt.</text>
    <text x="380" y="204" text-anchor="middle" fill="#6b87a8" font-size="12">Daten, Lagerung, Planfreigabe, Bildführung, Nebenwirkungen und Dokumentation müssen zusammenpassen.</text>
  </g>
</svg>`;
}

function svgPhysBioChain() {
  return `<svg viewBox="0 0 760 300" width="760" height="300" style="max-width:100%">
  <defs>
    <marker id="arrowPB" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
      <path d="M0,0 L0,6 L9,3 z" fill="#06b6d4"/>
    </marker>
  </defs>
  <rect x="12" y="22" width="736" height="244" rx="14" fill="rgba(17,24,39,0.72)" stroke="#1f3050"/>
  <g font-family="'Outfit',system-ui,sans-serif">
    <text x="380" y="50" text-anchor="middle" fill="#e2eaf6" font-size="17" font-weight="800">Kausalkette: Physik wird Biologie wird MTR-Handlung</text>
    <g font-size="12">
      <rect x="35" y="92" width="105" height="70" rx="10" fill="rgba(6,182,212,0.13)" stroke="#06b6d4"/>
      <text x="87" y="120" text-anchor="middle" fill="#e2eaf6" font-weight="700">Strahlung</text>
      <text x="87" y="139" text-anchor="middle" fill="#6b87a8">Photon / Elektron</text>

      <rect x="165" y="92" width="105" height="70" rx="10" fill="rgba(96,165,250,0.13)" stroke="#60a5fa"/>
      <text x="217" y="115" text-anchor="middle" fill="#e2eaf6" font-weight="700">Energie-</text>
      <text x="217" y="132" text-anchor="middle" fill="#e2eaf6" font-weight="700">deposition</text>
      <text x="217" y="149" text-anchor="middle" fill="#6b87a8">Ionisation</text>

      <rect x="295" y="92" width="105" height="70" rx="10" fill="rgba(245,158,11,0.13)" stroke="#f59e0b"/>
      <text x="347" y="118" text-anchor="middle" fill="#e2eaf6" font-weight="700">Radiolyse</text>
      <text x="347" y="139" text-anchor="middle" fill="#6b87a8">freie Radikale</text>

      <rect x="425" y="92" width="105" height="70" rx="10" fill="rgba(239,68,68,0.13)" stroke="#ef4444"/>
      <text x="477" y="118" text-anchor="middle" fill="#e2eaf6" font-weight="700">DNA-Schaden</text>
      <text x="477" y="139" text-anchor="middle" fill="#6b87a8">SSB / DSB</text>

      <rect x="555" y="92" width="105" height="70" rx="10" fill="rgba(139,92,246,0.13)" stroke="#8b5cf6"/>
      <text x="607" y="118" text-anchor="middle" fill="#e2eaf6" font-weight="700">4 Rs</text>
      <text x="607" y="139" text-anchor="middle" fill="#6b87a8">Repair usw.</text>

      <line x1="141" y1="127" x2="160" y2="127" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowPB)"/>
      <line x1="271" y1="127" x2="290" y2="127" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowPB)"/>
      <line x1="401" y1="127" x2="420" y2="127" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowPB)"/>
      <line x1="531" y1="127" x2="550" y2="127" stroke="#06b6d4" stroke-width="2" marker-end="url(#arrowPB)"/>

      <rect x="115" y="198" width="145" height="44" rx="10" fill="rgba(16,185,129,0.11)" stroke="#10b981"/>
      <text x="187" y="225" text-anchor="middle" fill="#e2eaf6" font-weight="700">Tumorkontrolle</text>
      <rect x="308" y="198" width="145" height="44" rx="10" fill="rgba(245,158,11,0.11)" stroke="#f59e0b"/>
      <text x="380" y="225" text-anchor="middle" fill="#e2eaf6" font-weight="700">Nebenwirkung</text>
      <rect x="500" y="198" width="160" height="44" rx="10" fill="rgba(6,182,212,0.11)" stroke="#06b6d4"/>
      <text x="580" y="225" text-anchor="middle" fill="#e2eaf6" font-weight="700">MTR-Handlung</text>
      <path d="M607 164 C607 188,580 188,580 196" fill="none" stroke="#8b5cf6" stroke-width="2" marker-end="url(#arrowPB)"/>
      <path d="M477 164 C477 188,380 188,380 196" fill="none" stroke="#ef4444" stroke-width="2" marker-end="url(#arrowPB)"/>
      <path d="M477 164 C477 188,187 188,187 196" fill="none" stroke="#10b981" stroke-width="2" marker-end="url(#arrowPB)"/>
    </g>
  </g>
</svg>`;
}

function svgTherapeuticBalance() {
  return `<svg viewBox="0 0 560 250" width="560" height="250" style="max-width:100%">
  <rect x="20" y="20" width="520" height="205" rx="14" fill="rgba(17,24,39,0.72)" stroke="#1f3050"/>
  <line x1="70" y1="190" x2="500" y2="190" stroke="#6b87a8" stroke-width="1.5"/>
  <line x1="70" y1="190" x2="70" y2="50" stroke="#6b87a8" stroke-width="1.5"/>
  <text x="505" y="207" fill="#6b87a8" font-size="11" font-family="'Outfit',sans-serif">Dosis</text>
  <text x="38" y="47" fill="#6b87a8" font-size="11" font-family="'Outfit',sans-serif" transform="rotate(-90 38,47)">Wahrscheinlichkeit</text>
  <path d="M75 178 C155 172,195 126,240 88 C290 50,370 47,490 45" fill="none" stroke="#10b981" stroke-width="4"/>
  <path d="M75 186 C185 182,250 168,310 125 C360 88,420 65,490 55" fill="none" stroke="#ef4444" stroke-width="4"/>
  <rect x="250" y="62" width="82" height="118" fill="rgba(6,182,212,0.10)" stroke="#06b6d4" stroke-dasharray="4,3"/>
  <text x="291" y="77" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="700" font-family="'Outfit',sans-serif">therap.</text>
  <text x="291" y="93" text-anchor="middle" fill="#06b6d4" font-size="12" font-weight="700" font-family="'Outfit',sans-serif">Fenster</text>
  <text x="405" y="44" fill="#10b981" font-size="13" font-weight="700" font-family="'Outfit',sans-serif">Tumorkontrolle</text>
  <text x="377" y="86" fill="#ef4444" font-size="13" font-weight="700" font-family="'Outfit',sans-serif">Normalgewebsrisiko</text>
  <text x="280" y="218" text-anchor="middle" fill="#6b87a8" font-size="12" font-family="'Outfit',sans-serif">Didaktisches Schema: Ziel ist nicht maximale Dosis, sondern ein gutes therapeutisches Verhältnis.</text>
</svg>`;
}


// ─────────────────────────────────────────────
// SECTION RENDERERS
// ─────────────────────────────────────────────
function renderSection(id) {
  const main = document.getElementById('main-content');
  const renderers = { 'intro':rIntro,'dept-info':rDeptInfo,'dept-aufgaben':rDeptAufgaben,'physbio-info':rPhysBioInfo,'physbio-aufgaben':rPhysBioAufgaben,'zv-info':rZVInfo,'zv-aufgaben':rZVAufgaben,'dosis-info':rDosisInfo,'dvh-info':rDVHInfo,'dvh-aufgaben':rDVHAufgaben,'dosis-aufgaben':rDosisAufgaben,'tech-info':rTechInfo,'tech-aufgaben':rTechAufgaben,'plancheck':rPlancheck,'fall1-info':rFall1Info,'fall1-aufgaben':rFall1Aufgaben,'fall2-info':rFall2Info,'fall2-aufgaben':rFall2Aufgaben,'abschluss':rAbschluss };
  const fn = renderers[id];
  if(fn) { main.innerHTML = `<div class="section-view">${fn()}</div>`; postRender(id); }
}

function postRender(id) {
  // init matches
  document.querySelectorAll('[data-match-id]').forEach(el => { initMatch(el.id); });
  // restore praxis notes on Abschluss page
  if (id === 'abschluss') { restorePraxisNotes(); }
  // ARIA-Rollen auf alle interaktiven divs
  applyAriaRoles();
  // Fokus auf main-content setzen, damit Tastaturnutzer am Anfang der neuen Section landen
  const main = document.getElementById('main-content');
  if (main) { main.focus({ preventScroll: true }); }
}

// ── Nav buttons helper (pfad-aware)
function navBtns(showPrev=true) {
  const list = pathSections();
  const idx = list.findIndex(s => s.id === state.current);
  const hasPrev = idx > 0;
  const hasNext = idx >= 0 && idx < list.length - 1;
  return `<div class="btn-row">
    ${hasPrev && showPrev ? `<button class="btn btn-ghost" onclick="prevSection()">← Zurück</button>` : ''}
    ${hasNext ? `<button class="btn btn-primary" onclick="nextSection()">Weiter →</button>` : `<button class="btn btn-primary" onclick="navigate('abschluss')">Abschluss →</button>`}
  </div>`;
}

// ─────────────────────────────────────────────
// 0. INTRO
// ─────────────────────────────────────────────
function rIntro() {
  return `
<div class="section-tag">📚 Lernmodul · Strahlentherapie</div>
<div class="section-title">Strahlentherapie verstehen: Abteilung · Physik/Biologie · Technik · Plancheck</div>
<div class="section-lead">Dieses Modul zeigt Strahlentherapie als zusammenhängende Versorgungskette: vom Erstkontakt über Planungs-CT, Planung und tägliche Bestrahlung bis zur biologischen Wirkung, Nebenwirkung und sicheren MTR-Entscheidung.</div>

<div class="card">
  <div class="card-label">🎯 Lernziele dieses Moduls</div>
  <div class="lz-list">
    <div class="lz-item"><div class="lz-dot">1</div><span>Den Aufbau einer Strahlentherapieabteilung als Prozesssystem mit Übergabepunkten, Berufsrollen und Sicherheitsrisiken erklären können</span></div>
    <div class="lz-item"><div class="lz-dot">2</div><span>Die Kausalkette von Energiedeposition über Radiolyse, DNA-Schaden, 4 Rs und klinische Nebenwirkung praxisnah erklären können</span></div>
    <div class="lz-item"><div class="lz-dot">3</div><span>Das Zielvolumenkonzept nach ICRU erklären und Volumina klinisch zuordnen können</span></div>
    <div class="lz-item"><div class="lz-dot">4</div><span>Dosisverteilungen, Isodosen und DVH-Grundparameter interpretieren und beurteilen können</span></div>
    <div class="lz-item"><div class="lz-dot">5</div><span>Bestrahlungstechniken anhand von Zielvolumen, OAR, Bewegung und Reproduzierbarkeit begründet auswählen können</span></div>
    <div class="lz-item"><div class="lz-dot">6</div><span>Plan-, DVH-, Setup- und Patientenauffälligkeiten erkennen, korrekt einordnen und als MTR angemessen eskalieren können</span></div>
  </div>
</div>

<div class="card path-card">
  <div class="card-label">🧭 Lernpfad wählen — bestimmt, welche Sections die Sidebar zeigt</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.9rem">Du kannst den Pfad jederzeit oben in der Sidebar wechseln. Der Fortschritt bleibt erhalten.</p>
  <div class="path-grid">
    <div class="path-tile ${activePath()==='orientierung'?'path-active':''}" onclick="setPath('orientierung')">
      <div class="path-tile-icon">🌱</div>
      <div class="path-tile-name">Orientierung</div>
      <div class="path-tile-meta">1. Lehrjahr · ~45 min · 11 Sections</div>
      <div class="path-tile-desc">Abteilung, Kausalkette, ZV-Grundlagen, Technik-Überblick, ein klinischer Fall. Ohne DVH-Tiefe und ohne Plancheck.</div>
    </div>
    <div class="path-tile ${activePath()==='vollkurs'?'path-active':''}" onclick="setPath('vollkurs')">
      <div class="path-tile-icon">🎓</div>
      <div class="path-tile-name">Vollkurs</div>
      <div class="path-tile-meta">2.–3. Lehrjahr · ~2 h · 19 Sections</div>
      <div class="path-tile-desc">Alle Inhalte in voller Tiefe: Abteilung, Physik/Biologie, ZV, Dosis, DVH, Techniken, Plancheck, beide Fälle.</div>
    </div>
    <div class="path-tile ${activePath()==='examen'?'path-active':''}" onclick="setPath('examen')">
      <div class="path-tile-icon">🎯</div>
      <div class="path-tile-name">Examensfokus</div>
      <div class="path-tile-meta">~60 min · 12 Sections · Aufgabenfokus</div>
      <div class="path-tile-desc">ZV + DVH + Dosis + Tech-Aufgaben, Plancheck, beide Fälle. Theorie-Kapitel sind ausgeblendet — vorausgesetzt, du kennst sie.</div>
    </div>
    <div class="path-tile ${activePath()==='all'?'path-active':''}" onclick="setPath('all')">
      <div class="path-tile-icon">🔓</div>
      <div class="path-tile-name">Frei navigieren</div>
      <div class="path-tile-meta">alle 19 Sections sichtbar</div>
      <div class="path-tile-desc">Kein Filter. Du wählst selbst, was du wann anschaust.</div>
    </div>
  </div>
  <div class="callout callout-info" style="margin-top:1rem">
    <span class="callout-icon">💡</span>
    <div><strong>Niveau-Punkte in der Sidebar:</strong> <span class="lvl-legend lvl-basis"></span> Basis · <span class="lvl-legend lvl-vertiefung"></span> Vertiefung · <span class="lvl-legend lvl-examen"></span> Anwendung/Examen. Sie zeigen Schwierigkeitssprünge — unabhängig vom gewählten Pfad.</div>
  </div>
</div>

<div class="intro-tiles">
  <div class="itile" onclick="navigate('dept-info')">
    <div class="itile-tag tag-amber">Teil 0 · Prozess</div>
    <div class="itile-icon">🏥</div>
    <div class="itile-title">Aufbau einer Strahlentherapieabteilung</div>
    <div class="itile-desc">Ambulanz, Planungs-CT, Planung, Bunker und Support nicht als Raumliste, sondern als Patient*innenreise und Sicherheitskette verstehen.</div>
  </div>
  <div class="itile" onclick="navigate('physbio-info')">
    <div class="itile-tag tag-amber">Teil 0 · Kausalkette</div>
    <div class="itile-icon">🧬</div>
    <div class="itile-title">Strahlenphysik + Strahlenbiologie</div>
    <div class="itile-desc">Von Energiedeposition über Radiolyse und DNA-Schäden bis zu Nebenwirkungen und konkretem MTR-Handeln.</div>
  </div>
  <div class="itile" onclick="navigate('zv-info')">
    <div class="itile-tag tag-blue">Teil 1 · Kapitel 1</div>
    <div class="itile-icon">🎯</div>
    <div class="itile-title">Zielvolumenkonzept</div>
    <div class="itile-desc">GTV, CTV, PTV, TV, IV und OAR — die ICRU-Hierarchie verstehen und anwenden.</div>
  </div>
  <div class="itile" onclick="navigate('dosis-info')">
    <div class="itile-tag tag-blue">Teil 1 · Kapitel 2</div>
    <div class="itile-icon">📈</div>
    <div class="itile-title">Dosisverteilung & Isodosen</div>
    <div class="itile-desc">Konformität, Homogenität, Isodosenkurven und DVH — was ein guter Plan leisten muss.</div>
  </div>
  <div class="itile" onclick="navigate('tech-info')">
    <div class="itile-tag tag-blue">Teil 1 · Kapitel 3</div>
    <div class="itile-icon">⚙️</div>
    <div class="itile-title">Bestrahlungstechniken</div>
    <div class="itile-desc">Von Stehfeld bis VMAT — nicht als Technikliste, sondern als begründete Entscheidung nach Anatomie, OAR und Reproduzierbarkeit.</div>
  </div>
  <div class="itile" onclick="navigate('fall1-info')">
    <div class="itile-tag tag-purple">Teil 2 · Fall 1</div>
    <div class="itile-icon">👩</div>
    <div class="itile-title">Mamma-Karzinom</div>
    <div class="itile-desc">BET-Nachbestrahlung, Tangentialfelder, DIBH — Wissen auf einen realen Fall anwenden.</div>
  </div>
  <div class="itile" onclick="navigate('fall2-info')">
    <div class="itile-tag tag-purple">Teil 2 · Fall 2</div>
    <div class="itile-icon">👨</div>
    <div class="itile-title">Prostatakarzinom</div>
    <div class="itile-desc">4-Felder-Box vs. VMAT, OAR-Compliance, Setup-Variabilität — definitiver Einsatz der RT.</div>
  </div>
</div>

<div class="callout callout-info">
  <span class="callout-icon">💡</span>
  <div><strong>Hinweis zur Nutzung:</strong> Bearbeite die Kapitel in Teil 1 der Reihe nach. Die Aufgaben prüfen dein Verständnis sofort — schau erst nach dem eigenen Versuch auf das Feedback. Die Fälle in Teil 2 setzen die Grundlagen voraus.</div>
</div>
${navBtns(false)}`;
}


// ─────────────────────────────────────────────
// 0.1 DEPARTMENT INFO
// ─────────────────────────────────────────────
function rDeptInfo() {
  return `
<div class="section-tag">🏥 Teil 0 · Orientierung</div>
<div class="section-title">Aufbau einer Strahlentherapieabteilung: nicht Raumliste, sondern Versorgungskette</div>
<div class="section-lead">Eine Strahlentherapieabteilung ist ein interprofessionelles Prozesssystem. Für die MTR ist entscheidend, an welchen Übergabepunkten Daten, Lagerung, Planfreigabe, Patientenzustand und Dokumentation zusammenpassen müssen.</div>

<div class="card">
  <div class="card-label">🧭 Patient*innenreise durch die Abteilung</div>
  <p>Der häufige Anfängerfehler lautet: <strong>Ambulanz, Planungs-CT, Planung und Bunker werden als einzelne Räume gelernt.</strong> Das reicht nicht. In der Praxis entsteht Behandlungsqualität durch die Übergabe zwischen diesen Bereichen. Jeder Übergang kann Sicherheit schaffen oder Fehler weitertragen.</p>
  <div class="svgwrap">${svgDepartmentFlow()}</div>
  <div class="callout callout-info">
    <span class="callout-icon">💡</span>
    <div><strong>Kernidee:</strong> Ein schlechter PLCT-Setup ist nicht nur ein schlechter PLCT-Setup. Er wird zur Planungsgrundlage und später zum täglichen Bestrahlungsproblem. Genau hier entsteht berufliche Handlungskompetenz.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">🏗️ Bereiche, Aufgaben, Risiken</div>
  <table class="dt">
    <thead><tr><th>Bereich</th><th>Kernaufgabe</th><th>Beteiligte Berufsgruppen</th><th>Typisches Risiko</th><th>MTR-Fokus</th></tr></thead>
    <tbody>
      <tr><td><strong>Ambulanz / Leitstelle</strong></td><td>Erstkontakt, Anamnese, Aufklärung, Sichtung von Befunden, Termin- und Therapiekoordination</td><td>Ärztlicher Dienst, Leitstelle, Patientenlotsen, ggf. Pflege</td><td>Unvollständige Informationen, falsche Terminlogik, fehlende Vorbefunde</td><td>Patientenidentität, Informationsfluss und organisatorische Plausibilität ernst nehmen</td></tr>
      <tr><td><strong>Planungs-CT</strong></td><td>CT in Bestrahlungsposition, Lagerung, Lagerungshilfen, Referenzpunkte, ggf. Kontrastmittel/Bewegungsmanagement</td><td>MTR, ärztlicher Dienst, ggf. Medizinphysik</td><td>Nicht reproduzierbare Lagerung, falscher Scanbereich, ungeeignete Lagerungshilfe</td><td>„Pionierarbeit“: Was hier schlecht angelegt wird, ist später schwer sauber zu bestrahlen</td></tr>
      <tr><td><strong>Planungsräume</strong></td><td>Konturierung, Technikentscheidung, Dosisplanung, DVH-Bewertung, Isozentrum, Freigaben</td><td>Ärztlicher Dienst, Medizinphysik, ggf. MTR</td><td>OAR-Dosis zu hoch, Technik praktisch schwer umsetzbar, Plan nicht robust</td><td>Planunterlagen verstehen, keine eigenmächtigen Änderungen, Auffälligkeiten rückmelden</td></tr>
      <tr><td><strong>Bunker / Linac</strong></td><td>Tägliche Bestrahlung, Identitätskontrolle, Lagerung, Bildführung, Bestrahlungsdurchführung, Dokumentation</td><td>MTR, ärztlicher Dienst, Medizinphysik</td><td>Setupfehler, falsche Hilfsmittel, unplausibles CBCT, Patient kann Lage nicht halten</td><td>Stoppen, prüfen, kommunizieren, dokumentieren — nicht „durchziehen“</td></tr>
      <tr><td><strong>Supportbereiche</strong></td><td>Tagesklinik, Station, Sozialdienst, Ernährungsberatung, Psychoonkologie, Seelsorge, Werkstatt</td><td>Pflege, Ärzt*innen, MTR, Supportdienste</td><td>Nebenwirkungen, Schmerzen, Angst, Transportprobleme, Therapieunterbrechungen</td><td>Patientenzustand beobachten und die richtige Schnittstelle aktivieren</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">👩‍⚕️ Aufgaben einer MTR: Vorbereitung · Durchführung · Organisation</div>
  <p>Die MTR-Aufgabe ist nicht auf Gerätebedienung reduzierbar. Gerade für Auszubildende muss sichtbar werden, dass technische Genauigkeit, Patientenkontakt, Strahlenschutz, Dokumentation und Teamkommunikation eine Einheit bilden.</p>
  <div class="matrix-grid">
    <div class="matrix-card">
      <div class="matrix-num">V</div>
      <div class="matrix-title">Vorbereitung</div>
      <div class="matrix-text">Planungs-CT vorbereiten, Lagerungshilfen korrekt wählen, Patient informieren, Planunterlagen und Hilfsmittel prüfen.</div>
    </div>
    <div class="matrix-card">
      <div class="matrix-num">D</div>
      <div class="matrix-title">Durchführung</div>
      <div class="matrix-text">Identität sichern, Setup reproduzieren, Bildführung anwenden, Bestrahlung nach Plan durchführen, Auffälligkeiten erkennen.</div>
    </div>
    <div class="matrix-card">
      <div class="matrix-num">O</div>
      <div class="matrix-title">Organisation</div>
      <div class="matrix-text">Termine, Rücksprachen, Dokumentation, Nebenwirkungsmanagement, Schnittstellen mit Station/Tagesklinik/Ärzt*innen koordinieren.</div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-label">🎯 Therapiestrategie verändert den Arbeitsalltag</div>
  <table class="dt">
    <thead><tr><th>Strategie</th><th>Ziel</th><th>Was bedeutet das für die MTR?</th></tr></thead>
    <tbody>
      <tr><td><strong>kurativ</strong></td><td>Heilung / lokale Kontrolle</td><td>Sehr hohe Reproduzierbarkeit, konsequente Bildführung, langfristige Dokumentation, hohe Bedeutung kleiner Abweichungen</td></tr>
      <tr><td><strong>adjuvant</strong></td><td>Risikoreduktion nach Haupttherapie</td><td>Patient versteht oft nicht, warum trotz „Tumor entfernt“ bestrahlt wird — gute Erklärungskompetenz nötig</td></tr>
      <tr><td><strong>neoadjuvant</strong></td><td>Vorbehandlung vor OP / Tumorverkleinerung</td><td>Koordination mit OP-Zeitfenster und weiteren Therapien relevant</td></tr>
      <tr><td><strong>palliativ</strong></td><td>Symptomlinderung / Lebensqualität</td><td>Kurze, tolerierbare Lagerung; Schmerzmanagement; pragmatische Kommunikation; Nutzen-Belastung täglich mitdenken</td></tr>
    </tbody>
  </table>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>Praxispunkt:</strong> Palliativ bedeutet nicht „ungenau“. Es bedeutet: sicher, zielgerichtet und patientenschonend. Kurativ bedeutet nicht „Patient aushalten lassen“. Es bedeutet: Präzision und Belastbarkeit müssen gemeinsam organisiert werden.</div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 0.2 DEPARTMENT TASKS
// ─────────────────────────────────────────────
function rDeptAufgaben() {
  return `
<div class="section-tag">✏️ Teil 0 · Aufgaben</div>
<div class="section-title">Aufgaben: Abteilung, Übergaben und MTR-Rolle</div>
<div class="section-lead">Hier wird geprüft, ob du die Abteilung als Sicherheits- und Handlungssystem verstanden hast — nicht nur als Liste von Räumen.</div>

<div class="card" data-match-id="match-dept">
  <div class="card-label">📌 Aufgabe 1 — Bereich ↔ kritischer Fokus</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.5rem">Ordne jedem Bereich den wichtigsten Sicherheits- oder Handlungsschwerpunkt zu.</p>
  <div class="match-wrap" id="match-dept" data-match-id="match-dept">
    <div class="match-grid">
      <div>
        <div class="match-col-label">Bereich</div>
        <div class="match-items">
          <div class="mi" data-side="left" data-pair="amb" onclick="handleMatchClick(this,'left','match-dept')">Ambulanz / Leitstelle</div>
          <div class="mi" data-side="left" data-pair="plct" onclick="handleMatchClick(this,'left','match-dept')">Planungs-CT</div>
          <div class="mi" data-side="left" data-pair="plan" onclick="handleMatchClick(this,'left','match-dept')">Planungsräume</div>
          <div class="mi" data-side="left" data-pair="bunker" onclick="handleMatchClick(this,'left','match-dept')">Bunker / Linac</div>
          <div class="mi" data-side="left" data-pair="support" onclick="handleMatchClick(this,'left','match-dept')">Supportbereiche</div>
        </div>
      </div>
      <div>
        <div class="match-col-label">Fokus</div>
        <div class="match-items">
          <div class="mi" data-side="right" data-pair="bunker" onclick="handleMatchClick(this,'right','match-dept')">Tägliche Reproduktion von Setup, IGRT, Parametern und Dokumentation</div>
          <div class="mi" data-side="right" data-pair="plct" onclick="handleMatchClick(this,'right','match-dept')">Lagerung, Lagerungshilfe, Scanbereich und Referenz für die gesamte Behandlung</div>
          <div class="mi" data-side="right" data-pair="support" onclick="handleMatchClick(this,'right','match-dept')">Nebenwirkungen, Belastbarkeit, Transport, Ernährung, Schmerz und psychosoziale Unterstützung</div>
          <div class="mi" data-side="right" data-pair="amb" onclick="handleMatchClick(this,'right','match-dept')">Indikation, Aufklärung, Vorbefunde, Termin- und Therapiekoordination</div>
          <div class="mi" data-side="right" data-pair="plan" onclick="handleMatchClick(this,'right','match-dept')">Konturierung, Technikentscheidung, Dosisplanung, DVH, Isozentrum, Freigaben</div>
        </div>
      </div>
    </div>
    <div class="match-score">0 / 5 Paare korrekt zugeordnet</div>
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Warum ist das Planungs-CT im Lernmodul als „Pionierarbeit“ bezeichnet?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Weil die MTR dort erstmals die Dosis berechnet</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Weil Lagerung, Hilfsmittel, Scanbereich und Bilddaten die Grundlage für Planung und tägliche Reproduktion bilden</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Weil das PLCT grundsätzlich diagnostisch besser ist als ein radiologisches CT</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Weil am PLCT keine ärztliche/physikalische Rücksprache nötig ist</div>
  </div>
  <div class="qfeedback"
    data-ok="Genau. Das Planungs-CT setzt die Referenz für Lagerung, Konturierung, Dosisberechnung und spätere Bildführung. Fehler in dieser Phase werden in die Behandlungskette weitergetragen."
    data-err="Das PLCT ist keine reine Diagnostik und keine Dosisfreigabe. Seine Stärke liegt in der reproduzierbaren Bestrahlungsposition und in den Bilddaten für Planung und tägliche Umsetzung.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Ein palliativer Patient mit schmerzhaften Knochenmetastasen kann kaum flach liegen. Was ist fachlich am besten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Die Lagerung exakt wie beim kurativen Prostata-Patienten erzwingen, sonst ist die Bestrahlung wertlos</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Patientenschonende, reproduzierbare Lagerung organisieren, Schmerzen berücksichtigen und bei Bedarf Rücksprache halten</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Auf Bildführung und Dokumentation kann verzichtet werden, weil palliativ bestrahlt wird</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Die MTR entscheidet selbst, die Fraktionszahl zu reduzieren</div>
  </div>
  <div class="qfeedback"
    data-ok="Richtig. Palliativ heißt: Nutzen, Belastung, Lagerungszeit und Symptomkontrolle zusammen denken. Reproduzierbarkeit bleibt wichtig, aber die Umsetzung muss patientenschonend organisiert werden."
    data-err="Palliativ bedeutet nicht ungenau und nicht regellos. Die MTR verändert keine Fraktionierung, sondern organisiert eine sichere, tolerierbare und reproduzierbare Durchführung mit Rücksprache, wenn nötig.">
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Transferfrage</div>
  <div class="transfer-q">Formuliere in mindestens 20 Wörtern: Warum ist eine schlecht angefertigte Lagerungshilfe im Planungs-CT später ein Problem am Linac?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Deine Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation">
    <div class="expectation-title">Erwartungshorizont</div>
    Eine starke Antwort nennt: Die Lagerungshilfe definiert die spätere Reproduzierbarkeit. Wenn sie unpassend oder unbequem ist, stimmen Planungsposition, tägliches Setup, Bildführung und tatsächliche Dosislage schlechter überein. Folge: mehr Korrekturen, längere Lagerungszeit, Unsicherheit, Patient*innenbelastung und ggf. Rücksprache/Umplanung.
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 0.3 PHYSICS + BIOLOGY INFO
// ─────────────────────────────────────────────
function rPhysBioInfo() {
  return `
<div class="section-tag">🧬 Teil 0 · Kausalkette</div>
<div class="section-title">Strahlenphysik + Strahlenbiologie: ein gemeinsamer Effekt</div>
<div class="section-lead">Physik erklärt, wo und wie Energie im Körper deponiert wird. Biologie erklärt, was diese Energie im Gewebe auslöst. Berufliche Handlungskompetenz entsteht, wenn du beides auf Patient*innenbeobachtung und sichere Entscheidungen übertragen kannst.</div>

<div class="card">
  <div class="card-label">🔗 Die Kausalkette</div>
  <p>Strahlentherapie ist nicht „Maschine macht Dosis“. Strahlentherapie ist eine kontrollierte Kette: <strong>Strahlung trifft Gewebe → Energie wird deponiert → Ionisation/Radiolyse entsteht → DNA wird geschädigt → Zellen reagieren → Tumor und Normalgewebe zeigen klinische Effekte → die MTR beobachtet, kommuniziert und handelt.</strong></p>
  <div class="svgwrap">${svgPhysBioChain()}</div>
</div>

<div class="card">
  <div class="card-label">⚛️ Strahlenphysik: Was kommt im Gewebe an?</div>
  <table class="dt">
    <thead><tr><th>Begriff</th><th>Verständliche Einordnung</th><th>Praxisbezug</th></tr></thead>
    <tbody>
      <tr><td><strong>Photonenstrahlung</strong></td><td>Ungeladene Wellenstrahlung; Wirkung im Gewebe über Wechselwirkungen und Sekundärelektronen</td><td>Häufige externe Bestrahlung am Linac; relevant für Tiefendosis, Feldanordnung und OAR-Schonung</td></tr>
      <tr><td><strong>Elektronenstrahlung</strong></td><td>Geladene Teilchen mit begrenzter Reichweite und hoher Oberflächendosis</td><td>Oberflächliche Zielgebiete, Narben-/Hautbereiche, Bolus/Moulage beachten</td></tr>
      <tr><td><strong>direkte Ionisation</strong></td><td>Geladene Teilchen geben Energie direkt an Atome/Moleküle ab</td><td>Wichtig für Verständnis von LET und Teilchenwirkung</td></tr>
      <tr><td><strong>indirekte Ionisation</strong></td><td>Ungeladene Strahlung erzeugt geladene Sekundärteilchen, die dann ionisieren</td><td>Für Photonen klinisch zentral: Sekundärelektronen tragen die Wirkung weiter</td></tr>
      <tr><td><strong>LET</strong></td><td>Energieabgabe pro Wegstrecke</td><td>Hilft zu verstehen, warum Strahlenarten biologisch unterschiedlich wirken können</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">💧 Radiolyse, Sauerstoffeffekt und DNA-Schäden</div>
  <p>Der Mensch besteht zu einem großen Teil aus Wasser. Ionisierende Strahlung spaltet Wassermoleküle; dabei entstehen <strong>freie Radikale</strong>. Diese können DNA schädigen. Sauerstoff kann Strahlenschäden chemisch „fixieren“: Gut oxygenierte Zellen sind deshalb oft strahlensensibler, hypoxische Tumorareale eher radioresistenter.</p>
  <table class="dt">
    <thead><tr><th>Schaden</th><th>Bedeutung</th><th>Klinische Deutung</th></tr></thead>
    <tbody>
      <tr><td><strong>Einzelstrangbruch</strong></td><td>Ein DNA-Strang ist betroffen</td><td>Häufig besser reparierbar</td></tr>
      <tr><td><strong>Doppelstrangbruch</strong></td><td>Beide DNA-Stränge sind betroffen</td><td>Biologisch kritischer; fehlerhafte Reparatur kann Zelluntergang oder Fehlfunktionen auslösen</td></tr>
      <tr><td><strong>Hypoxie</strong></td><td>Sauerstoffarme Zellareale</td><td>Kann die Strahlenempfindlichkeit senken; Reoxygenierung zwischen Fraktionen ist deshalb relevant</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">🔁 Die 4 Rs der fraktionierten Strahlentherapie</div>
  <div class="matrix-grid">
    <div class="matrix-card"><div class="matrix-num">R</div><div class="matrix-title">Repair</div><div class="matrix-text">Zellen können subletale Schäden zwischen Fraktionen reparieren. Normalgewebsschonung hängt stark daran.</div></div>
    <div class="matrix-card"><div class="matrix-num">R</div><div class="matrix-title">Repopulation</div><div class="matrix-text">Zellen vermehren sich während der Therapie. Bei Tumoren kann lange Gesamtbehandlungszeit problematisch sein.</div></div>
    <div class="matrix-card"><div class="matrix-num">R</div><div class="matrix-title">Redistribution</div><div class="matrix-text">Zellen wandern durch Zellzyklusphasen. G2/M ist besonders strahlensensibel.</div></div>
    <div class="matrix-card"><div class="matrix-num">R</div><div class="matrix-title">Reoxygenierung</div><div class="matrix-text">Hypoxische Tumorbereiche können zwischen Fraktionen besser oxygeniert werden und dadurch empfindlicher werden.</div></div>
  </div>
</div>

<div class="card">
  <div class="card-label">⚖️ Therapeutisches Verhältnis</div>
  <p>Das Ziel ist nicht „möglichst viel Dosis“, sondern ein möglichst günstiges Verhältnis aus <strong>Tumorkontrolle</strong> und <strong>Normalgewebsschonung</strong>. Technik, Lagerung, Bildführung, Fraktionierung und Patient*innenkommunikation dienen genau diesem Verhältnis.</p>
  <div class="svgwrap">${svgTherapeuticBalance()}</div>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>MTR-Brücke:</strong> Wenn eine Patientin den geplanten DIBH-Atemhalt nicht reproduzierbar erreicht, ist das nicht nur ein Kommunikationsthema. Physikalisch verschiebt sich die Dosislage gegenüber dem Plan. Klinisch-biologisch bedeutet das: Normalgewebe (z.B. Herz) kann höhere Dosen erhalten, was das langfristige Nebenwirkungsrisiko verändert. Die MTR sieht den Atemwert in Echtzeit und ist die Person, die hier stoppen oder eine Rücksprache anstoßen muss.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">🩺 Akut- und Spätreaktionen: warum Zeitpunkt wichtig ist</div>
  <table class="dt">
    <thead><tr><th>Reaktion</th><th>Typische Zeitlogik</th><th>Beispiele</th><th>MTR-Handlung</th></tr></thead>
    <tbody>
      <tr><td><strong>Akutreaktion</strong></td><td>während oder kurz nach der RT; häufig in Geweben mit hohem Zellumsatz</td><td>Mukositis, Erythem, Haarausfall, Fatigue</td><td>Beobachten, aktiv nachfragen, dokumentieren, Nebenwirkungsmanagement anstoßen</td></tr>
      <tr><td><strong>Spätreaktion</strong></td><td>Monate bis Jahre später; oft in langsam reagierenden Geweben</td><td>Fibrose, Nekrose, Organfunktionsverlust</td><td>Dosimetrische Sorgfalt, OAR-Verständnis, Langzeitrisiken in Kommunikation einordnen</td></tr>
    </tbody>
  </table>
  <div class="callout callout-info">
    <span class="callout-icon">💡</span>
    <div><strong>Merksatz:</strong> Akutreaktionen bedeuten nicht automatisch „Gerät falsch“. Sie können erwartbar sein. Entscheidend ist, ob Ausmaß, Zeitpunkt, Lokalisation und Patientenzustand plausibel sind.</div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 0.4 PHYSICS + BIOLOGY TASKS
// ─────────────────────────────────────────────
function rPhysBioAufgaben() {
  return `
<div class="section-tag">✏️ Teil 0 · Aufgaben</div>
<div class="section-title">Aufgaben: Kausalkette Physik → Biologie → Handlung</div>
<div class="section-lead">Diese Aufgaben zwingen dich, abstrakte Begriffe mit Patient*innenbeobachtung und MTR-Entscheidungen zu verbinden.</div>

<div class="card" data-match-id="match-physbio">
  <div class="card-label">📌 Aufgabe 1 — Begriff ↔ Funktion in der Kausalkette</div>
  <div class="match-wrap" id="match-physbio" data-match-id="match-physbio">
    <div class="match-grid">
      <div>
        <div class="match-col-label">Begriff</div>
        <div class="match-items">
          <div class="mi" data-side="left" data-pair="dep" onclick="handleMatchClick(this,'left','match-physbio')">Energiedeposition</div>
          <div class="mi" data-side="left" data-pair="rad" onclick="handleMatchClick(this,'left','match-physbio')">Radiolyse</div>
          <div class="mi" data-side="left" data-pair="o2" onclick="handleMatchClick(this,'left','match-physbio')">Sauerstoffeffekt</div>
          <div class="mi" data-side="left" data-pair="dsb" onclick="handleMatchClick(this,'left','match-physbio')">Doppelstrangbruch</div>
          <div class="mi" data-side="left" data-pair="reo" onclick="handleMatchClick(this,'left','match-physbio')">Reoxygenierung</div>
        </div>
      </div>
      <div>
        <div class="match-col-label">Funktion</div>
        <div class="match-items">
          <div class="mi" data-side="right" data-pair="reo" onclick="handleMatchClick(this,'right','match-physbio')">Hypoxische Tumorzellen können zwischen Fraktionen besser oxygeniert und sensibler werden</div>
          <div class="mi" data-side="right" data-pair="rad" onclick="handleMatchClick(this,'right','match-physbio')">Ionisation von Wasser bildet freie Radikale</div>
          <div class="mi" data-side="right" data-pair="dsb" onclick="handleMatchClick(this,'right','match-physbio')">Biologisch besonders kritischer DNA-Schaden</div>
          <div class="mi" data-side="right" data-pair="dep" onclick="handleMatchClick(this,'right','match-physbio')">Physikalischer Startpunkt: Energie wird im Gewebe abgegeben</div>
          <div class="mi" data-side="right" data-pair="o2" onclick="handleMatchClick(this,'right','match-physbio')">Sauerstoff kann DNA-Schäden chemisch fixieren und Strahlenwirkung verstärken</div>
        </div>
      </div>
    </div>
    <div class="match-score">0 / 5 Paare korrekt zugeordnet</div>
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Ein HNO-Patient berichtet nach zwei Wochen über schmerzhafte Rötung der Mundschleimhaut und Schluckbeschwerden. Welche Erklärung verbindet Physik und Biologie am besten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Die Beschwerden beweisen, dass die Tagesdosis zu hoch eingestellt wurde</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Ionisation/Radiolyse führt zu DNA-Schäden; Schleimhaut reagiert wegen hoher Zellumsatzrate früh</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Schleimhaut reagiert spät, deshalb sind Beschwerden nach zwei Wochen unplausibel</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Solche Reaktionen sind ausschließlich psychisch bedingt</div>
  </div>
  <div class="qfeedback"
    data-ok="Richtig. Die physikalische Energiedeposition löst biologische Schäden aus. Schleimhaut ist ein früh reagierendes Gewebe mit hohem Zellumsatz; Beschwerden nach etwa zwei Wochen können plausibel sein und müssen beobachtet, dokumentiert und kommuniziert werden."
    data-err="Akutreaktionen sind nicht automatisch Gerätefehler. Die richtige Kette lautet: Energiedeposition → Ionisation/Radiolyse → DNA-Schäden → Gewebereaktion → Beobachtung und Handlung.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Warum ist tägliche Reproduzierbarkeit bei IMRT/VMAT besonders kritisch?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Weil moderne Techniken Lagerungsfehler automatisch vollständig ausgleichen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Weil steile Dosisgradienten physikalisch kleine Lageänderungen biologisch relevant machen können</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Weil bei IMRT/VMAT keine Risikoorgane berücksichtigt werden</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Weil bei modernen Techniken keine Bildführung nötig ist</div>
  </div>
  <div class="qfeedback"
    data-ok="Genau. Moderne Techniken können OAR besser schonen, aber oft mit steilen Gradienten. Tagesanatomie, Lagerung und Bildführung sichern den geplanten biologischen Effekt."
    data-err="IMRT/VMAT kompensieren nicht automatisch jede Abweichung. Präzise Technik erzeugt hohe Anforderungen an präzise Durchführung.">
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Falltransfer HNO</div>
  <div class="transfer-q">Beschreibe in mindestens 20 Wörtern die Kette: Warum kann ein HNO-Patient nach zwei Wochen Mukositis entwickeln, und was ist deine MTR-Handlung?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Physik → Biologie → Klinik → Handlung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation">
    <div class="expectation-title">Erwartungshorizont</div>
    Gute Antwort: Strahlung deponiert Energie, es entstehen Ionisation/Radiolyse und DNA-Schäden. Schleimhaut hat hohen Zellumsatz und reagiert früh. Die MTR fragt aktiv nach Beschwerden, beobachtet Lagerungsfähigkeit, dokumentiert, informiert nach Hausstandard ärztliches Team/Pflege und unterstützt Nebenwirkungsmanagement.
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Falltransfer DIBH / Mamma links</div>
  <div class="transfer-q">Formuliere in mindestens 20 Wörtern: Warum ist ein nicht reproduzierbarer Atemhalt bei DIBH gleichzeitig ein physikalisches und biologisches Problem?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Deine Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation">
    <div class="expectation-title">Erwartungshorizont</div>
    Gute Antwort: DIBH verändert die Lage von Brustwand, Herz und Lunge. Wenn der Atemhalt nicht reproduzierbar ist, stimmt die physikalische Dosislage nicht zuverlässig mit dem Plan überein. Biologisch kann dadurch die Normalgewebsschonung schlechter werden. Die MTR übt an, prüft Reproduzierbarkeit und hält bei Unsicherheit Rücksprache.
  </div>
</div>
${navBtns()}`;
}


// ─────────────────────────────────────────────
// 1. ZV INFO
// ─────────────────────────────────────────────
function rZVInfo() {
  return `
<div class="section-tag">📖 Kapitel 1 · Grundlagenwissen</div>
<div class="section-title">Zielvolumenkonzept</div>
<div class="section-lead">Das Zielvolumenkonzept trennt klinisch-anatomische Volumina von geometrischen Planungsvolumina und von dosisbezogenen Auswertevolumina. Genau diese Trennung verhindert Missverständnisse beim Lesen eines Bestrahlungsplans.</div>

<div class="card">
  <div class="card-label">📐 Volumen sauber getrennt: Anatomie · Geometrie · Dosis</div>
  <p>Die Begriffe sehen im Plan nebeneinander aus, beschreiben aber nicht dasselbe. <strong>GTV und CTV</strong> sind primär klinisch-onkologische Zielvolumina. <strong>PTV</strong> ist ein geometrisches Planungsvolumen. <strong>TV und IV</strong> entstehen erst aus der gewählten Dosisverteilung und dienen der Planbeurteilung.</p>

  <div class="svgwrap">
    ${svgVolumes()}
    <div style="font-size:0.83rem; max-width:270px; line-height:1.6;">
      <div style="margin-bottom:0.5rem"><span class="vbadge vb-gtv">GTV</span> → sicht-/messbarer Tumor</div>
      <div style="margin-bottom:0.5rem"><span class="vbadge vb-ctv">CTV</span> → klinisches Risikovolumen</div>
      <div style="margin-bottom:0.5rem"><span class="vbadge vb-ptv">PTV</span> → geometrisches Planungsvolumen</div>
      <div style="margin-bottom:0.5rem"><span class="vbadge vb-tv">TV</span> &nbsp;→ dosisbezogenes Behandlungsvolumen</div>
      <div style="margin-bottom:0.5rem"><span class="vbadge vb-iv">IV</span> &nbsp;→ dosisbezogenes bestrahltes Volumen</div>
      <div><span class="vbadge vb-oar">OAR</span> → Risikoorgan mit Dosisgrenzen</div>
      <div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.7rem">Schema: didaktisch vereinfacht, keine klinisch exakte Konturierung.</div>
    </div>
  </div>

  <table class="dt">
    <thead><tr><th>Volumen</th><th>Saubere Definition</th><th>Klinischer Hinweis</th></tr></thead>
    <tbody>
      <tr><td><span class="vbadge vb-gtv">GTV</span> Gross Tumor Volume</td><td>Makroskopisch nachweisbarer Tumor bzw. sichtbare Tumormanifestation, z. B. in CT, MRT, PET oder klinischem Befund.</td><td>Nicht jede adjuvante Situation hat ein sichtbares GTV.</td></tr>
      <tr><td><span class="vbadge vb-ctv">CTV</span> Clinical Target Volume</td><td>Gewebevolumen, das sichtbaren Tumor und/oder vermutete mikroskopische Tumorausbreitung enthält und therapeutisch erfasst werden soll.</td><td>Klinisch-ärztliche Entscheidung; abhängig von Tumorbiologie, OP-Situation, Lymphabflusswegen und Leitlinien/Hausstandard.</td></tr>
      <tr><td><span class="vbadge vb-ptv">PTV</span> Planning Target Volume</td><td>Geometrisches Planungsvolumen um das CTV bzw. ITV, damit das klinische Zielvolumen trotz Bewegungs- und Setupunsicherheiten mit der geplanten Dosis erfasst wird.</td><td>Keine reine Rechenregel. Margins hängen u. a. von Immobilisation, Organbewegung, Bildführung, Setupgenauigkeit und Hausstandard ab.</td></tr>
      <tr><td><span class="vbadge vb-tv">TV</span> Treated Volume</td><td>Volumen, das eine für das Therapieziel relevante Dosis erhält. Welche Isodose dafür herangezogen wird, muss im jeweiligen Plan-/Bewertungskontext definiert sein.</td><td>Nicht pauschal gleich 95%-Isodose. Im Unterricht kann eine Referenzisodose benutzt werden, muss aber als Vereinfachung gekennzeichnet sein.</td></tr>
      <tr><td><span class="vbadge vb-iv">IV</span> Irradiated Volume</td><td>Volumen, das eine für Normalgewebe relevante Dosis erhält. Die Schwelle ist kontext- und organabhängig.</td><td>Nicht automatisch „50%-Volumen“. Bei manchen Fragestellungen sind deutlich niedrigere oder höhere Dosisbereiche relevant.</td></tr>
      <tr><td><span class="vbadge vb-oar">OAR</span> Organs at Risk</td><td>Normalgewebe, dessen Strahlenbelastung die Planung, Fraktionierung oder Durchführung beeinflussen kann.</td><td>Beispiel: Herz, Lunge, Rückenmark, Rektum, Blase, Parotis, kontralaterale Brust.</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">📏 Margin-Bildung: klinisch-physikalisches Konzept, keine einfache Formel</div>
  <p>Der Übergang von CTV zu PTV beschreibt eine <strong>geometrische Sicherheitsstrategie</strong>. Er soll Bewegungen und Unsicherheiten im gesamten Behandlungspfad berücksichtigen. In Lehrbüchern wird das häufig als IM + SM erklärt; in der klinischen Realität wird die konkrete Marge aber nach Lokalisation, Lagerung, IGRT-Konzept, Atem-/Organbewegung, Immobilisation und Hausstandard festgelegt.</p>
  <table class="dt">
    <thead><tr><th>Einflussfaktor</th><th>Beispiele</th><th>MTR-Bedeutung</th></tr></thead>
    <tbody>
      <tr><td><strong>Interne Bewegung</strong></td><td>Atmung, Blasenfüllung, Rektumfüllung, Peristaltik, Schlucken</td><td>Tagesanatomie prüfen; Füllungs-/Atemprotokolle nicht als Formalität behandeln.</td></tr>
      <tr><td><strong>Immobilisation</strong></td><td>Maske, Vakuummatratze, Mammazange, Knie-/Fußfixierung, Bellyboard</td><td>Hilfsmittel exakt reproduzieren; Abweichungen nicht „weginterpretieren“.</td></tr>
      <tr><td><strong>Setup und Bildführung</strong></td><td>Hautmarken, Lasersetup, kV/kV, CBCT, SGRT, 6D-Korrektur</td><td>Planlogik und Matchstrategie nach Hausstandard anwenden.</td></tr>
      <tr><td><strong>Hausstandard / Protokoll</strong></td><td>indikationsspezifische Margins, IGRT-Frequenz, Toleranzgrenzen</td><td>MTR kompensiert Margen nicht eigenständig, sondern erkennt Abweichungen und eskaliert korrekt.</td></tr>
    </tbody>
  </table>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>MTR-Relevanz:</strong> Das PTV ist keine Einladung, ungenau zu lagern. Es ist eine geplante Sicherheitsstrategie. Wiederholte Setupfehler, falsche Hilfsmittel oder unplausible Tagesanatomie können diese Sicherheitsstrategie aushebeln und müssen kommuniziert und dokumentiert werden.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">🔗 Weiterführende Quellen</div>
  <div class="res-links">
    <a class="rlink" href="https://www.estro.org/Science/E-Learning" target="_blank">🌐 ESTRO E-Learning</a>
    <a class="rlink" href="https://www.iaea.org/resources/rpop/health-professionals/radiotherapy" target="_blank">🌐 IAEA Radiotherapy Resources</a>
    <a class="rlink" href="https://www.icru.org/report/prescribing-recording-and-reporting-intensity-modulated-photon-beam-therapy-imrticru-report-83/" target="_blank">🌐 ICRU Report 83</a>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 2. ZV AUFGABEN
// ─────────────────────────────────────────────
function rZVAufgaben() {
  return `
<div class="section-tag">✏️ Kapitel 1 · Aufgaben</div>
<div class="section-title">Zielvolumen — Aufgaben</div>
<div class="section-lead">Teste dein Verständnis: Zuordnungen und Fallszenarien zum Zielvolumenkonzept.</div>

<div class="card" data-match-id="match-zv">
  <div class="card-label">📌 Aufgabe 1 — Zuordnung: Volumen ↔ Definition</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.5rem">Klicke zuerst ein Volumen (links), dann die passende Definition (rechts). Alle 5 Paare müssen korrekt zugeordnet werden.</p>
  <div class="match-wrap" id="match-zv" data-match-id="match-zv">
    <div class="match-grid">
      <div>
        <div class="match-col-label">Volumen</div>
        <div class="match-items">
          <div class="mi" data-side="left" data-pair="gtv" onclick="handleMatchClick(this,'left','match-zv')"><span class="vbadge vb-gtv">GTV</span></div>
          <div class="mi" data-side="left" data-pair="ctv" onclick="handleMatchClick(this,'left','match-zv')"><span class="vbadge vb-ctv">CTV</span></div>
          <div class="mi" data-side="left" data-pair="ptv" onclick="handleMatchClick(this,'left','match-zv')"><span class="vbadge vb-ptv">PTV</span></div>
          <div class="mi" data-side="left" data-pair="tv" onclick="handleMatchClick(this,'left','match-zv')"><span class="vbadge vb-tv">TV</span></div>
          <div class="mi" data-side="left" data-pair="iv" onclick="handleMatchClick(this,'left','match-zv')"><span class="vbadge vb-iv">IV</span></div>
        </div>
      </div>
      <div>
        <div class="match-col-label">Definition</div>
        <div class="match-items">
          <div class="mi" data-side="right" data-pair="ptv" onclick="handleMatchClick(this,'right','match-zv')">CTV + geometrische Sicherheitssäume (Setup, Bewegung)</div>
          <div class="mi" data-side="right" data-pair="gtv" onclick="handleMatchClick(this,'right','match-zv')">Makroskopisch nachweisbarer Tumor + befallene LK</div>
          <div class="mi" data-side="right" data-pair="iv" onclick="handleMatchClick(this,'right','match-zv')">Volumen mit einer für Normalgewebe relevanten Dosis</div>
          <div class="mi" data-side="right" data-pair="ctv" onclick="handleMatchClick(this,'right','match-zv')">GTV + subklinische Ausbreitung + regionäre LK</div>
          <div class="mi" data-side="right" data-pair="tv" onclick="handleMatchClick(this,'right','match-zv')">Volumen mit einer für das Therapieziel relevanten Dosis</div>
        </div>
      </div>
    </div>
    <div class="match-score" id="match-zv-score">0 / 5 Paare zugeordnet</div>
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Welches Volumen bildet geometrische Unsicherheiten (Atemhub, tägliche Lagerungsvariabilität) ab?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>GTV — Gross Tumor Volume</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>CTV — Clinical Target Volume</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">C</span>PTV — Planning Target Volume</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>TV — Treated Volume</div>
  </div>
  <div class="qfeedback"
    data-ok="Das PTV entsteht durch Addition geometrischer Sicherheitssäume (Internal Margin + Setup Margin) auf das CTV. Es ist kein biologisches, sondern ein planungsgeometrisches Konzept."
    data-err="Zur Erinnerung: GTV = makroskopischer Tumor; CTV = biologisches Risikovolumen; TV = Dosisvolumen aus dem Plan. Geometrische Unsicherheiten werden ausschließlich im PTV berücksichtigt.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Nach brusterhaltender Operation (BET) eines Mamma-Karzinoms wird eine adjuvante Radiotherapie geplant. Was gehört primär in das <strong>Ganzbrust-CTV</strong>?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Nur das ehemalige Tumorbett (Boost-Region)</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Die verbliebene gesamte Brustdrüse inklusive Resektionsbett</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Die gesamte ipsilaterale Thoraxwand</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Immer: Brust + axilläre + supraklavikuläre Lymphknoten</div>
  </div>
  <div class="qfeedback"
    data-ok="Bei BET-Nachbestrahlung umfasst das Ganzbrust-CTV die verbliebene Brustdrüse inkl. Resektionsbett. Das ehemalige Tumorbett wird häufig zusätzlich als eigenes Boost-CTV definiert (mit eigenem Sicherheitssaum) und erhält eine höhere Dosis. Wichtig zur Begriffsklärung: Da nach R0-Resektion kein makroskopisch sichtbarer Tumor mehr vorliegt, gibt es kein GTV. Das Tumorbett ist also kein GTV, sondern Ausgangspunkt des Boost-CTV. Regionäre Lymphknoten werden nur bei nodal positivem Befund oder hohem Rezidivrisiko einbezogen."
    data-err="Differenzierung: (A) Das Tumorbett ist Ausgangspunkt des Boost-CTV — ein zweites Zielvolumen, nicht das Ganzbrust-CTV. (C) Thoraxwand-CTV nur nach Mastektomie. (D) Lymphknoten-Bestrahlung ist nicht Standard, sondern Indikation-abhängig.">
  </div>
</div>

<div class="callout callout-success">
  <span class="callout-icon">✓</span>
  <div>Sobald alle Aufgaben bearbeitet sind, erscheint automatisch der Fortschritt. Weiter zu Kapitel 2: Dosisverteilung und Isodosen.</div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 3. DOSIS INFO
// ─────────────────────────────────────────────
function rDosisInfo() {
  return `
<div class="section-tag">📖 Kapitel 2 · Grundlagenwissen</div>
<div class="section-title">Dosisverteilung & Isodosen</div>
<div class="section-lead">Ein guter Bestrahlungsplan muss zwei übergeordnete Ziele gleichzeitig erfüllen: das Zielvolumen vollständig mit therapeutischer Dosis erfassen und umliegendes Gewebe maximal schonen.</div>

<div class="card">
  <div class="card-label">⚖️ Planqualität: Konformität, Homogenität und klinischer Kontext</div>
  <p>Konformität und Homogenität sind hilfreiche Denkmodelle, aber keine alleinige Planfreigabe. Ein Plan wird immer zusammen mit Zielvolumenabdeckung, DVH, OAR-Dosen, Dosisgradienten, Bildführung und klinischer Zielsetzung beurteilt.</p>
  <table class="dt">
    <thead><tr><th>Ziel</th><th>Saubere Einordnung</th><th>Im Modul verwendete Vereinfachung</th><th>Grenze der Aussage</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>Konformität</strong></td>
        <td>Wie eng passt ein definiertes Hochdosis-/Referenzvolumen räumlich zum PTV?</td>
        <td><span class="hpill hp-cyan">CI<sub>Modul</sub> = TV<sub>ref</sub> / PTV</span></td>
        <td>TV<sub>ref</sub> muss vorher definiert sein, z. B. als ausgewählte Referenzisodose. Nicht jedes TV ist automatisch 95%.</td>
      </tr>
      <tr>
        <td><strong>Homogenität</strong></td>
        <td>Wie gleichmäßig ist die Dosis innerhalb des PTV bzw. Zielvolumens verteilt?</td>
        <td>Lehrregel: keine ausgeprägten Coldspots/Hotspots; häufig Orientierung an D95/D98 und D2/Dmax.</td>
        <td>Grenzen wie 95–107% sind didaktische Orientierung und plan-/indikationsabhängig zu bewerten.</td>
      </tr>
    </tbody>
  </table>
  <div class="formula">
    <div class="formula-label">Nur in diesem Modul verwendete CI-Definition</div>
    <div class="formula-body">CI_Modul = TV_ref / PTV &nbsp;|&nbsp; TV_ref = vorher definierte Referenzisodose, nicht automatisch jedes Treated Volume</div>
  </div>
  <div class="callout callout-info">
    <span class="callout-icon">ℹ️</span>
    <div><strong>Gilt nur unter dieser Voraussetzung:</strong> Die CI-Aufgaben im Modul benutzen eine vereinfachte Definition. Klinisch existieren unterschiedliche Konformitätsindizes; deshalb darf aus dieser Zahl allein keine Planqualität abgeleitet werden.</div>
  </div>
  <div style="margin:1rem 0"><img src="media/images/konformitaet-isodose-ptv.jpg" alt="Didaktisches Schema Konformität: Referenzisodose und PTV" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Didaktisches Schema: TV<sub>ref</sub> größer/kleiner als PTV. Ein echter klinischer Plan muss zusätzlich über DVH, OAR-Dosen und Zielvolumenabdeckung beurteilt werden.</div></div>
  <div class="callout callout-warn">
    <span class="callout-icon">⚠️</span>
    <div><strong>CI-Interpretation im Modul:</strong> <span class="hpill hp-red">CI<sub>Modul</sub> &lt; 1</span> weist darauf hin, dass das definierte Referenzdosisvolumen kleiner als das PTV ist. <span class="hpill hp-amber">CI<sub>Modul</sub> &gt; 1</span> weist darauf hin, dass das Referenzdosisvolumen über das PTV hinausreicht. Beides ist ein Warnsignal, aber keine vollständige Planbewertung.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">📉 Die Isodosenkurve</div>
  <p><strong>Definition:</strong> Eine Isodose verbindet alle Punkte gleicher Dosis im Bestrahlungsfeld, dargestellt in Prozent der Verschreibungsdosis (% VD) oder in absoluten Gray.</p>

  <div class="svgwrap">
    ${svgIsodose()}
    <div class="iso-legend">
      <div class="iso-row"><div class="iso-line" style="background:#dc2626"></div><span class="iso-pct" style="color:#dc2626">107%</span><span>möglicher Hochdosisbereich; Bewertung planabhängig</span></div>
      <div class="iso-row"><div class="iso-line" style="background:#ef4444"></div><span class="iso-pct" style="color:#ef4444">95%</span><span>häufige Referenzisodose; Kontext beachten</span></div>
      <div class="iso-row"><div class="iso-line" style="background:#f59e0b"></div><span class="iso-pct" style="color:#f59e0b">80%</span><span>bei Elektronen häufig relevant; energie- und feldabhängig</span></div>
      <div class="iso-row"><div class="iso-line" style="background:#84cc16"></div><span class="iso-pct" style="color:#84cc16">50%</span><span>niedrigere Dosisbereiche; nicht pauschal IV-Grenze</span></div>
      <div class="iso-row"><div class="iso-line" style="background:#10b981"></div><span class="iso-pct" style="color:#10b981">20%</span><span>OAR-Monitoring</span></div>
      <div class="iso-row"><div class="iso-line" style="background:#60a5fa"></div><span class="iso-pct" style="color:#60a5fa">10%</span><span>Fernfeld</span></div>
      <div class="iso-row" style="margin-top:0.5rem"><div class="iso-line" style="background:#fbbf24;border: 1px dashed"></div><span class="iso-pct" style="color:#fbbf24">PTV</span><span>Planungszielvolumen (gestrichelt)</span></div>
    </div>
  </div>

  <div class="callout callout-info">
    <span class="callout-icon">ℹ️</span>
    <div><strong>Farbkodierung und Bildsprache:</strong> Isodosenfarben, Linienabstände, Layout und Legenden sind TPS- und zentrumsspezifisch. Die Abbildung ist ein didaktisches Schema. Ein echtes Isodosenbild beweist allein keine Planqualität; es muss immer zusammen mit DVH, Zielvolumenabdeckung, OAR-Bewertung und klinischer Fragestellung gelesen werden.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">📊 Einflussfaktoren auf die Dosisverteilung</div>
  <table class="dt">
    <thead><tr><th>Faktor</th><th>Auswirkung</th><th>MTR-Konsequenz</th></tr></thead>
    <tbody>
      <tr><td><strong>Feldgeometrie</strong> (Winkel, Anzahl, Größe)</td><td>Dosisakkumulation im Isozentrum durch Überlagerung</td><td>Korrekte Gantry-/Kollimatorwinkel aus Plan übernehmen</td></tr>
      <tr><td><strong>Gewebeinhomogenitäten</strong> (Lunge, Knochen, Luft)</td><td>Lokale Dosisabweichungen durch unterschiedliche Dichten</td><td>CT-basierte Berechnung und korrekte Material-/Hilfsmittelanlage beachten; Bolus nur nach Planvorgabe</td></tr>
      <tr><td><strong>Feldformung</strong> (MLC, Keilfilter)</td><td>Modifiziert Isodosenform und -homogenität gezielt</td><td>MLC-Position aus DICOM-Plan abgleichen</td></tr>
      <tr><td><strong>Strahlungsenergie</strong></td><td>Tiefendosiskurve: hohe Energie → tiefer liegendes D<sub>max</sub></td><td>Energie aus Plan korrekt am Gerät einstellen</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">📐 Dosisgrenzen: Lehrregel statt Automatismus</div>
  <div class="formula">
    <div class="formula-label">Didaktische Orientierung für Photonenpläne</div>
    <div class="formula-body">Coldspot / Hotspot immer im Kontext bewerten: Lage, Volumenanteil, OAR-Nähe, Fraktionierung und Planvorgabe beachten</div>
  </div>
  <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem">In Lehrsituationen wird häufig mit Orientierungswerten wie etwa 95–107% gearbeitet. Klinisch sind jedoch Dosis-Volumen-Parameter wie D95/D98 und D2, Hotspot-Lage, Zielvolumenabdeckung und OAR-Dosen entscheidend. Ein Dmax-/Hotspot-Hinweis ist für die MTR ein Plausibilitäts- und Kommunikationssignal, aber keine eigenständige Planfreigabe.</p>
  <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.5rem"><strong>Elektronen:</strong> Die therapeutische Reichweite und Oberflächendosis hängen u. a. von Energie, Feldgröße, SSD, Kontur, Bolus/Moulage, Luftspalt und klinischer Zielsetzung ab. Bolus erhöht die Oberflächendosis und reduziert den Buildup-Effekt; die tatsächliche Wirkung darf nicht mit einer starren Zentimeterregel erklärt werden.</p>
</div>
${navBtns()}`;
}


// ─────────────────────────────────────────────
// 3b. DVH INFO
// ─────────────────────────────────────────────
function rDVHInfo() {
  return `
<div class="section-tag">📊 Kapitel 2 · Planbewertung</div>
<div class="section-title">DVH lesen: vom schönen Bild zur Planqualität</div>
<div class="section-lead">Isodosen zeigen dir, wo Dosis liegt. Das Dosis-Volumen-Histogramm (DVH) zeigt dir, wie viel Volumen welche Dosis erhält. Für die MTR ist das kein Planfreigabeinstrument, aber ein wichtiges Verständnis- und Plausibilitätswerkzeug: Auffälligkeiten erkennen, einordnen, weitergeben und dokumentieren.</div>

<div class="card">
  <div class="card-label">🔎 Isodose vs. DVH — zwei Blickrichtungen</div>
  <table class="dt">
    <thead><tr><th>Werkzeug</th><th>Was sehe ich?</th><th>Typische MTR-Frage</th></tr></thead>
    <tbody>
      <tr><td><strong>Isodosenbild</strong></td><td>Räumliche Dosisverteilung im CT-Schnitt: Hotspots, Coldspots, Dosisgradient, Nähe zu OAR</td><td>Passt die definierte Referenzisodose plausibel zum PTV? Gibt es auffällige Hochdosisbereiche nahe an Risikoorganen? Muss etwas nach Hausstandard rückgefragt werden?</td></tr>
      <tr><td><strong>DVH</strong></td><td>Volumenbezogene Dosisinformation: welcher Anteil eines Volumens erhält mindestens eine bestimmte Dosis?</td><td>Welche PTV-/OAR-Werte wirken auffällig und müssen nach Hausstandard rückgefragt werden?</td></tr>
    </tbody>
  </table>
  <div class="callout callout-info">
    <span class="callout-icon">💡</span>
    <div><strong>Merksatz:</strong> Ein Plan kann optisch „schön“ wirken und trotzdem DVH-seitig problematisch sein. Umgekehrt erklärt das Isodosenbild, <em>wo</em> ein DVH-Problem räumlich entsteht.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">📐 DVH-Vokabeln, die eine MTR verstehen sollte</div>
  <table class="dt">
    <thead><tr><th>Parameter</th><th>Bedeutung</th><th>Warum relevant?</th></tr></thead>
    <tbody>
      <tr><td><span class="hpill hp-cyan">D95</span></td><td>Dosis, die mindestens 95 % des Volumens erhalten</td><td>Orientierung für Zielvolumenabdeckung</td></tr>
      <tr><td><span class="hpill hp-cyan">D98</span></td><td>Dosis, die nahezu das gesamte Zielvolumen erhält</td><td>Hinweis auf Coldspots / Unterdosierung</td></tr>
      <tr><td><span class="hpill hp-red">D2</span></td><td>Dosis, die nur ein kleines Hochdosisvolumen erhält</td><td>Näherung für Hotspots, nicht einfach ignorieren</td></tr>
      <tr><td><span class="hpill hp-purple">Dmean</span></td><td>mittlere Dosis eines Organs</td><td>z. B. bei Herz/Lunge klinisch relevant</td></tr>
      <tr><td><span class="hpill hp-amber">Vx</span></td><td>Volumenanteil, der mindestens x Gy erhält</td><td>z. B. Rektum/Blase/Lunge: wie viel Organ liegt im kritischen Dosisbereich?</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">⚠️ Abgrenzung der MTR-Rolle</div>
  <p>Die MTR gibt den Plan nicht frei und verändert keine Dosisparameter. Aber sie muss fachlich erkennen, wann Planunterlagen, Setup oder Tagesanatomie nicht plausibel zur geplanten Technik passen und eine Rücksprache notwendig ist.</p>
  <table class="dt">
    <thead><tr><th>MTR muss</th><th>MTR darf nicht</th></tr></thead>
    <tbody>
      <tr><td>Planparameter, Lagerung, Hilfsmittel und Bildführung kritisch gegenprüfen</td><td>Isozentrum, MLC, Dosis, Fraktionierung oder DIBH-Level eigenmächtig ändern</td></tr>
      <tr><td>auffällige DVH-/Isodosen-/CBCT-Befunde nach Hausstandard kommunizieren</td><td>OAR-Grenzen selbst klinisch freigeben</td></tr>
      <tr><td>bei unklarer Abweichung stoppen, zweite Kontrolle einholen und dokumentieren</td><td>mit bekannt fehlerhafter Lagerung, falschem Bolus oder unplausibler Anatomie bestrahlen</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">🔗 Fachliche Einordnung</div>
  <p>Für IMRT/VMAT sind präzise 3D-Volumendefinition, steile Dosisgradienten, DVH-basierte Dosisangaben und QA besonders relevant. Genau deshalb gehört DVH-Grundverständnis zur Technikkompetenz — auch wenn die finale Planbewertung ärztlich/physikalisch erfolgt.</p>
  <div class="res-links">
    <a class="rlink" href="https://www.icru.org/report/prescribing-recording-and-reporting-intensity-modulated-photon-beam-therapy-imrticru-report-83/" target="_blank">🌐 ICRU 83</a>
    <a class="rlink" href="https://www.degro.org/akademie/die-degro-akademie/curriculum/" target="_blank">🌐 DEGRO Curriculum</a>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 3c. DVH AUFGABEN
// ─────────────────────────────────────────────
function rDVHAufgaben() {
  return `
<div class="section-tag">✏️ Kapitel 2 · Aufgaben</div>
<div class="section-title">DVH — Aufgaben</div>
<div class="section-lead">Hier geht es nicht um Rechnen um des Rechnens willen. Du sollst erkennen, welche Planinformation eine MTR im klinischen Workflow aufmerksam machen muss.</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">1</span>Ein Prostata-Plan zeigt: PTV D95 liegt deutlich unter der geplanten Verschreibungsdosis. Was ist die fachlich richtige Einordnung?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Unkritisch, solange die 107%-Grenze nicht überschritten wird</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Hinweis auf unzureichende Zielvolumenabdeckung / Coldspot — Rücksprache vor Bestrahlung</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Typisch bei VMAT und daher automatisch akzeptabel</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Die MTR kann den Tisch verschieben, um die Dosisabdeckung zu verbessern</div>
  </div>
  <div class="qfeedback"
    data-ok="Richtig. Ein zu niedriger D95-Wert im PTV spricht für eine relevante Unterdeckung. Die MTR korrigiert den Plan nicht, muss aber bei unklarer oder auffälliger Planinformation Rücksprache halten."
    data-err="D95 beschreibt die Dosis, die 95 % des Volumens erhalten. Wenn dieser Wert zu niedrig ist, geht es um Zielvolumenabdeckung — nicht um Hotspots. Eigenmächtige Tischverschiebungen sind keine Lösung.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Im DVH eines linksseitigen Mamma-Plans fällt eine erhöhte mittlere Herzdosis auf. Welche Aussage ist aus MTR-Sicht am besten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Das ist rein ärztlich/physikalisch und für die MTR grundsätzlich irrelevant</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Die MTR sollte den Zusammenhang mit Technik, Lagerung und ggf. DIBH verstehen und Auffälligkeiten kommunizieren</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Die MTR kann den Atem-Sollbereich tiefer einstellen, um die Herzdosis zu senken</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Herzdosis ist nur bei Ganzhirn relevant</div>
  </div>
  <div class="qfeedback"
    data-ok="Genau. Die MTR entscheidet nicht über Grenzwerte, aber sie muss verstehen, warum DIBH, Armposition, Brustwandabstand und Technik die Herzdosis beeinflussen."
    data-err="Herzdosis ist bei linksseitiger Mamma-Bestrahlung relevant. Der Atem-Sollbereich darf nicht eigenmächtig verändert werden. Aber die MTR muss die Techniklogik verstehen und Auffälligkeiten adressieren.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Was beschreibt V65 beim Rektum in einem Prostata-Plan am ehesten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">A</span>Welcher Anteil des Rektums mindestens 65 Gy erhält</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>Die maximale Tagesdosis im Rektum</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Die Lagerungsabweichung des Rektums in Millimetern</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Den Abstand zwischen Rektum und Prostata in der DRR</div>
  </div>
  <div class="qfeedback"
    data-ok="Richtig. Vx bedeutet: Wie viel Volumen erhält mindestens x Gy. Genau solche Werte erklären, warum Rektumfüllung und CBCT-Kontrolle im Alltag nicht nebensächlich sind."
    data-err="V65 ist ein Volumen-Dosis-Parameter: Anteil/Volumen des Rektums, das mindestens 65 Gy erhält. Es ist kein Millimetermaß und kein Tagesdosiswert.">
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Transfer</div>
  <div class="transfer-q">Formuliere in mindestens 20 Wörtern: Warum reicht ein farblich unauffälliges Isodosenbild allein nicht aus, um Planqualität zu beurteilen?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Deine Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation">
    <div class="expectation-title">Erwartungshorizont</div>
    Ein starkes Antwortmuster nennt: Isodosen zeigen die räumliche Verteilung, DVH zeigt Volumenanteile und Dosisparameter. Planqualität erfordert beides: PTV-Abdeckung, Hotspots, OAR-Dosen und klinische Plausibilität.
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 4. DOSIS AUFGABEN
// ─────────────────────────────────────────────
function rDosisAufgaben() {
  return `
<div class="section-tag">✏️ Kapitel 2 · Aufgaben</div>
<div class="section-title">Dosisverteilung — Aufgaben</div>
<div class="section-lead">Isodosen interpretieren, Konformitätsindex beurteilen und Qualitätsgrenzen kennen.</div>

  <div class="quiz-block">
  <div class="quiz-q"><span class="qnum">1</span>Für diese Übungsaufgabe ist TV<sub>ref</sub> als das Volumen der ausgewählten Referenzisodose definiert. Im Plan steht: TV<sub>ref</sub> = 185 cm³, PTV = 160 cm³. Wie lautet der im Modul verwendete Konformitätsindex, und was zeigt er an?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>CI = 0,86 — 14 % des PTV werden nicht erfasst → Unterdosierungsrisiko</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>CI<sub>Modul</sub> = 1,16 — das Referenzdosisvolumen ist größer als das PTV → Hinweis auf Dosis außerhalb des PTV</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>CI<sub>Modul</sub> = 1,16 — automatisch ausgezeichneter Plan, weil TV<sub>ref</sub> > PTV</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>CI = 0,86 — der Plan ist optimal, weil TV < PTV eine Überdosierung verhindert</div>
  </div>
  <div class="qfeedback"
    data-ok="CI&lt;sub&gt;Modul&lt;/sub&gt; = TV&lt;sub&gt;ref&lt;/sub&gt;/PTV = 185/160 = 1,16. In dieser vereinfachten Moduldefinition bedeutet das: Das Referenzdosisvolumen ist größer als das PTV — Hinweis auf Dosis außerhalb des PTV. Wichtig für die Praxis: In der Klinik (z.B. Eclipse, Monaco, RayStation) gibt es mehrere CI-Definitionen (RTOG, Paddick u.a.) mit teils umgekehrten Verhältnissen. Beim Plancheck immer auf die Konvention der jeweiligen Plansoftware achten."
    data-err="Rechne in dieser Übung: CI&lt;sub&gt;Modul&lt;/sub&gt; = TV&lt;sub&gt;ref&lt;/sub&gt; / PTV = 185 / 160 = 1,16. Hinweis: Diese Konvention ist eine didaktische Vereinfachung. In der Klinik existieren mehrere CI-Definitionen — die Software-Konvention immer mitprüfen, bevor du den Wert deutest.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Im Planausdruck eines Mamma-Plans steht: <span class="hpill hp-amber">D_max = 108,5 %</span> der Verschreibungsdosis im PTV. Als Lehrorientierung wird häufig ein Bereich um 95–107 % diskutiert. Was bedeutet dieser Befund für dein Vorgehen als MTR?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Kein Problem — D_max über 107 % ist üblich und klinisch irrelevant</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>Das PTV wird unterdosiert — es besteht ein Rezidivrisiko</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">C</span>Es gibt einen auffälligen Hochdosiswert — Planunterlagen/Planfreigabe prüfen und nach Hausstandard Rücksprache halten</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Als MTR kann ich den Plan selbst korrigieren</div>
  </div>
  <div class="qfeedback"
    data-ok="Richtig. D_max = 108,5 % ist in dieser Lehrsituation ein auffälliger Hochdosiswert. Ob er klinisch akzeptabel ist, hängt von Lage, Volumen, OAR-Nähe, Fraktionierung und freigegebenem Plan ab. Die MTR korrigiert nicht selbst, sondern prüft Planunterlagen/Freigabestatus und hält bei Unklarheit Rücksprache nach Hausstandard."
    data-err="Ein Dmax-Wert oberhalb der Lehrorientierung ist kein Grund für eigenmächtige Planänderung. Die MTR erkennt die Auffälligkeit, prüft die Planfreigabe und eskaliert nach Hausstandard. Die klinische Bewertung liegt bei Arzt/Physik.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Im Isodosenbild eines Prostataplans fällt auf: Die ausgewählte Referenzisodose liegt 3 mm <em>innerhalb</em> der dorsalen PTV-Grenze. Was ist die fachlich saubere Konsequenz?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Kein Problem — die 95%-Isodose muss nicht genau an der PTV-Grenze liegen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Teile des CTV am dorsalen Rand erhalten weniger als 95 % der Zieldosis → erhöhtes Lokalrezidivrisiko</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Der Sicherheitssaum des PTV gleicht das problemlos aus</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Nur relevant, wenn der DVH-Wert auch auffällig ist</div>
  </div>
  <div class="qfeedback"
    data-ok="Wenn die definierte Referenzisodose innerhalb der PTV-Grenze liegt, ist das ein Hinweis auf mögliche Unterdeckung des Planungszielvolumens. Der PTV-Sicherheitssaum ist für geometrische Unsicherheiten gedacht — er kompensiert keine dosimetrische Unterdeckung. Die MTR bewertet den Plan nicht final, sondern erkennt die Auffälligkeit und hält Rücksprache; DVH und Planfreigabe sind mit zu prüfen."
    data-err="Der PTV-Sicherheitssaum ist ein geometrisches Konzept — er schützt nicht vor einer dosimetrischen Unterdeckung. Wenn die definierte Referenzisodose nicht plausibel zum PTV passt, darf das nicht mit dem PTV-Saum „erklärt“ werden. Es braucht Rücksprache und Blick auf DVH/Planfreigabe.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">4</span>Eine Patientin erhält nach Mastektomie eine Brustwandbestrahlung mit Elektronen. Der Bestrahlungsplan sieht einen 1 cm dicken Bolus vor. Du legst ihn an und bemerkst einen deutlichen Luftspalt zwischen Bolus und der narbigen Brustwand. Was tust du?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Bestrahlen — der Plan hat einen Sicherheitssaum, der das kompensiert</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Nicht bestrahlen — Luftspalt korrigieren (Bolus anpassen/neu anlegen), ggf. Physiker/Arzt informieren</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Bolus entfernen und ohne Bolus bestrahlen — das ergibt mindestens die gleiche Oberflächendosis</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Luftspalt mit Wasser füllen</div>
  </div>
  <div class="qfeedback"
    data-ok="Ein Luftspalt zwischen Bolus und Haut kann die geplante Oberflächendosis und Dosisverteilung relevant verändern. Bolus soll die Oberflächendosis erhöhen und den Buildup-Effekt reduzieren; die tatsächliche Wirkung hängt aber von Energie, Feldgröße, Kontur, Bolusdicke, Material und Anlage ab. Konsequenz: Bolus anpassen/neu anlegen, ggf. alternative Moulage; bei persistierendem Problem Rücksprache mit Physik/Arzt. Nicht mit bekannt unplausibler Boluslage bestrahlen."
    data-err="Ohne plausible Bolus-/Hautanlage ist die Dosisabgabe nicht sicher plangemäß. Der PTV-Saum kompensiert keine dosimetrischen Änderungen durch fehlerhafte Hilfsmittelanlage. Bolus nicht eigenmächtig weglassen oder improvisieren; Rücksprache nach Hausstandard.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">5</span>Bei der Kombination Ganzhirn-RT + C-Spine-Feld wird zur Feldnaht eine Gantrykippung eingesetzt. Warum reicht es nicht, einfach die Felder direkt aneinanderzustoßen (ohne Kippung)?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Weil dann das C-Spine-Feld zu kurz wäre</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Weil beide Felder divergente Feldkanten haben — an der Naht entsteht eine Überlappungszone mit Überdosierung</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Weil Ganzhirn-Felder immer eine Gantrykippung von genau 10° benötigen</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Weil der Tisch rotiert werden muss und das die Gantrykippung erzwingt</div>
  </div>
  <div class="qfeedback"
    data-ok="Strahlen divergieren — die Feldkanten verlaufen nicht parallel, sondern laufen auseinander. Wenn zwei Felder ohne Korrektur aneinanderstoßen, überschneiden sich die divergenten Ränder in der Tiefe → Überdosierung an der Naht. Gantrykippung, Tischrotation oder Halbfeldtechnik sind geometrische Lösungen, um die Feldkanten an der Naht so auszurichten, dass Überlappung oder Lücke vermieden werden. Das ist keine allgemeine Dosisoptimierung, sondern eine feldgeometrische Maßnahme."
    data-err="Das Problem ist die Divergenz der Strahlen. Jeder Strahl läuft von der Quelle fächerförmig auseinander. An der Feldnaht zweier benachbarter Felder überlappt diese Divergenz in der Tiefe — Überdosierung ist die Folge. Gantrykippung, Tischrotation oder Halbfeldtechnik sind mögliche geometrische Lösungen nach Planvorgabe.">
  </div>
</div>

<div class="callout callout-mtr">
  <span class="callout-icon">🔬</span>
  <div><strong>Praxistipp für die MTR:</strong> Plan-Freigabe ist Aufgabe von Arzt und Medizinphysik — den Planausdruck lesen können musst du trotzdem. Beim täglichen Gegenprüfen helfen drei Fragen: (1) Liegt die Referenzisodose plausibel um das PTV? (2) Stehen Hochdosis-Bereiche dicht an einem OAR, das ich beim Setup besonders im Blick haben muss? (3) Stimmen Lagerung, Füllung und Bildführung an meinem Bestrahlungsplatz mit den Annahmen des Plans überein? Wenn etwas nicht passt: Rücksprache, nicht Routine.</div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 5. TECH INFO
// ─────────────────────────────────────────────
function rTechInfo() {
  return `
<div class="section-tag">📖 Kapitel 3 · Grundlagenwissen</div>
<div class="section-title">Bestrahlungstechniken</div>
<div class="section-lead">Die Wahl der Technik bestimmt, wie gut Zielvolumen und Risikoorgane gleichzeitig behandelt bzw. geschont werden können. Jede Technik hat spezifische Setup-Anforderungen für den MTR.</div>

<div class="callout callout-warn" style="margin-bottom:1.25rem">
  <span class="callout-icon">💡</span>
  <div><strong>Merksatz:</strong> Je präziser und komplexer die Technik und ihre Planung, desto empfindlicher reagiert sie auf Abweichungen — in Lagerung, Füllung und Setup. Technische Präzision und MTR-Präzision bedingen einander.</div>
</div>

<div class="card">
  <div class="card-label">🧭 Technikentscheidung in 5 Fragen</div>
  <p>Die Frage ist nicht: „Welche Technik ist modern?“ Die richtige Frage lautet: <strong>Welche Technik ist unter den konkreten Bedingungen aus Zielvolumen, Risikoorganen, Bewegung, Reproduzierbarkeit, Bildführung und Hausstandard fachlich vertretbar?</strong></p>
  <div class="matrix-grid">
    <div class="matrix-card"><div class="matrix-num">1</div><div class="matrix-title">Wo liegt das Zielvolumen?</div><div class="matrix-text">oberflächlich, tief, gekrümmt, groß, klein, komplex?</div></div>
    <div class="matrix-card"><div class="matrix-num">2</div><div class="matrix-title">Welche OAR sind kritisch?</div><div class="matrix-text">Herz, Lunge, Rektum, Blase, Rückenmark, kontralaterale Brust?</div></div>
    <div class="matrix-card"><div class="matrix-num">3</div><div class="matrix-title">Was bewegt sich?</div><div class="matrix-text">Atmung, Blasenfüllung, Rektumfüllung, Schlucken, Gewichtsverlust?</div></div>
    <div class="matrix-card"><div class="matrix-num">4</div><div class="matrix-title">Wie komplex muss die Dosisform sein?</div><div class="matrix-text">einfaches Feld, 3D-CRT, IMRT, VMAT, SRS/SBRT?</div></div>
    <div class="matrix-card"><div class="matrix-num">5</div><div class="matrix-title">Was muss die MTR täglich reproduzieren?</div><div class="matrix-text">Lagerung, Hilfsmittel, Füllungszustand, CBCT-Match, DIBH-Level, Boluslage?</div></div>
  </div>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>Praxiskern für die MTR:</strong> Je steiler der Dosisgradient und je stärker die Modulation einer Technik, desto empfindlicher reagiert sie auf Abweichungen in Lagerung, Anatomie und Bildführung. Konkret heißt das: Die zulässigen Toleranzen für Setup, Füllungszustände und IGRT-Match sind bei VMAT/IMRT/SBRT enger als bei einem Stehfeld. Das Ziel ist nicht „komplexer = besser“, sondern: Reproduzierbarkeit muss zur gewählten Technik passen. Wenn sie das im Alltag nicht tut, ist Rücksprache statt Routine angesagt.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">🗺️ Übersicht aller Bestrahlungstechniken</div>
  <img src="media/images/uebersicht-techniken.jpg" alt="Übersicht Bestrahlungstechniken alle Techniken" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Schematische Übersicht gängiger RT-Techniken — von einfach (Stehfeld) bis komplex (VMAT)</div>
</div>

<div class="card">
  <div class="card-label">📈 Komplexitätsprogression: Von einfach nach fortgeschritten</div>
  <div class="svgwrap" style="gap:1rem;flex-wrap:wrap;">
    <div style="text-align:center">
      ${svgBeams('steh')}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Stehfeld</div>
    </div>
    <div style="text-align:center">
      ${svgBeams('gegen')}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Gegenfelder</div>
    </div>
    <div style="text-align:center">
      ${svgBeams('4fb')}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">4-Felder-Box</div>
    </div>
    <div style="text-align:center">
      ${svgBeams('tan')}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">Tangentialfelder</div>
    </div>
    <div style="text-align:center">
      ${svgBeams('vmat')}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">VMAT (Arc)</div>
    </div>
  </div>
</div>

<div class="card">
  <div class="card-label">🧱 Einordnung: Pflichtwissen vs. Vertiefung</div>
  <p>Für die berufliche Handlungskompetenz ist nicht entscheidend, dass du jede Technik akademisch vollständig erklären kannst. Entscheidend ist, dass du erkennst: <strong>Welche technische Logik steckt dahinter, welche Unsicherheit ist kritisch und welche MTR-Kontrolle folgt daraus?</strong></p>
  <table class="dt">
    <thead><tr><th>Ebene</th><th>Techniken</th><th>Was SuS sicher können müssen</th></tr></thead>
    <tbody>
      <tr><td><strong>Pflicht</strong></td><td>3D-CRT, Stehfeld, Gegenfelder, 4-Felder-Box, Tangentialfelder, IMRT, VMAT</td><td>Prinzip, typische Indikation, OAR-Risiko und tägliche MTR-Kontrolle benennen</td></tr>
      <tr><td><strong>Praxis-Transfer</strong></td><td>DIBH/SGRT, Halbfeldtechnik, Bolus/Moulage, Divergenzausgleich</td><td>Setup-Fehler erkennen, stoppen, kommunizieren und dokumentieren</td></tr>
      <tr><td><strong>Vertiefung</strong></td><td>SRS/SBRT, Tracking, Fiducials, adaptive RT</td><td>Hochpräzisionsprinzip verstehen und erhöhte Toleranzanforderungen ableiten</td></tr>
    </tbody>
  </table>
</div>

<div class="tgrid">

  <div class="tcard">
    <div class="tbadge tb-basic">Basis · 3D-CRT</div>
    <div class="tname">3D-konformale Strahlentherapie</div>
    <div class="tshort">Feste Felder, Feldform nach Zielvolumen</div>
    <div class="trow"><strong>Prinzip:</strong> Feste Gantrywinkel; die Feldform wird mit Blenden/MLC an das Zielvolumen aus der jeweiligen Strahlrichtung angepasst. Typisch ist eine Vorwärtsplanung.</div>
    <div class="trow"><strong>Indikation:</strong> Robuste Standardtechnik für einfache bis mittelkomplexe Zielvolumina, palliative Situationen und klassische Becken-/Thorax-Setups.</div>
    <div class="trow"><strong>Stärke:</strong> Verständlich, robust, kurze Behandlungszeit und geringer Modulationsgrad.</div>
    <div class="trow"><strong>Grenze:</strong> OAR-Schonung wird schwierig, wenn Risikoorgane sehr eng am Zielvolumen liegen oder die Zielvolumenform stark gekrümmt ist.</div>
    <div class="tmtr">⚠️ MTR: Planparameter, Feldform, Energie, SSD/SAD, Gantry- und Kollimatorwinkel exakt nach Plan einstellen. Lagerung und Lagerungshilfen wie im Planungs-CT reproduzieren. Auch eine technisch einfache Behandlung verlangt Genauigkeit — sie hat nur weniger Korrekturmöglichkeiten, wenn Abweichungen entstehen.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-basic">Basis</div>
    <div class="tname">Stehfeld</div>
    <div class="tshort">1 Bestrahlungsfeld · keine Rotation</div>
    <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><img src="media/images/stehfeld-dorsal-ct.jpg" alt="Dorsales Stehfeld CT" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/><img src="media/images/elektronen-stehfeld.jpg" alt="Elektronenstehfeld" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/></div><div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.35rem">Links: dorsales Stehfeld (CT+Isodosen) · Rechts: Elektronenstehfeld</div>
    <div class="trow"><strong>Felder:</strong> 1 (Photonen oder Elektronen)</div>
    <div class="trow"><strong>Indikation:</strong> Oberflächliche Befunde, Knochenmetastasen, palliativ, Fersensporn</div>
    <div class="trow"><strong>Vorteil:</strong> Schnell, einfach, robust, geringe Planungskomplexität</div>
    <div class="trow"><strong>Nachteil:</strong> begrenzte Tiefenreichweite; Oberflächendosis, Reichweite und Dosisabfall hängen von Energie, Feldgröße, SSD, Bolus und Kontur ab</div>
    <div class="tmtr">⚠️ MTR: Feldgröße, SSD, Energie, Applikator/Tubus, Bolus und Haut-/Oberflächenbedingungen exakt aus Plan prüfen — kein "Schätzwert"</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-basic">Basis</div>
    <div class="tname">Gegenfeldtechnik</div>
    <div class="tshort">2 antiparallele Felder (0° + 180°)</div>
    <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><img src="media/images/gegenfeld-prinzip.jpg" alt="Gegenfeld Erklärung" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/><img src="media/images/ganzhirn-dosisverteilung.jpg" alt="Ganzhirn-RT Dosisverteilung" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/></div><div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.35rem">Links: Prinzip Gegenfeld · Rechts: Ganzhirn-RT Dosisverteilung</div>
    <div class="trow"><strong>Felder:</strong> 2 opponierende Felder</div>
    <div class="trow"><strong>Indikation:</strong> Ganzhirn-RT, Wirbelsäulenmetastasen, einfache Rumpfbestrahlung</div>
    <div class="trow"><strong>Vorteil:</strong> Homogene Durchstrahlung des ZV, einfache Planung</div>
    <div class="trow"><strong>Nachteil:</strong> Sanduhrprofil bei großem Körperdurchmesser; keine selektive OAR-Schonung</div>
    <div class="tmtr">⚠️ MTR: Bei Ganzhirn-Bestrahlung mit zwei seitlichen Gegenfeldern: Maskensetup exakt reproduzieren, Lasersetup und Bildkontrolle (z.B. kV/kV oder CBCT) zur Verifikation der Isozentrumslage nutzen. Symmetrische Lagerung des Kopfes prüfen — Verkippung verschiebt das Isozentrum gegen den Plan.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-mid">Mittel</div>
    <div class="tname">4-Felder-Box</div>
    <div class="tshort">4 Felder in 90°-Abständen</div>
    <img src="media/images/4-felder-box-abdomen.jpg" alt="4-Felder-Box Schematik Abdomen" style="width:100%;border-radius:6px;border:1px solid var(--border);margin-bottom:0.5rem;display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Schematik: 4 Felder 0°/90°/180°/270° — Dosisakkumulation im Isozentrum</div>
    <div class="trow"><strong>Felder:</strong> Anterior, posterior, links lateral, rechts lateral</div>
    <div class="trow"><strong>Indikation:</strong> Prostata, Rektum, Harnblase (pelvine Tumoren)</div>
    <div class="trow"><strong>Vorteil:</strong> Gute Dosisakkumulation im Isozentrum, einfaches MLC-Setup</div>
    <div class="trow"><strong>Nachteil:</strong> Höhere Integraldosis; schlechtere Konformität als VMAT bei komplexen PTV-Formen</div>
    <div class="tmtr">⚠️ MTR: Rektum-/Blasenfüllung nach Protokoll — tägliche Kontrolle!</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-mid">Mittel</div>
    <div class="tname">Tangentialfelder</div>
    <div class="tshort">2 tangentiale Felder zur Brustkontur</div>
    <div class="trow"><strong>Felder:</strong> Mediales + laterales Tangentialfeld (nicht antiparallel!)</div>
    <div class="trow"><strong>Indikation:</strong> Mamma-Karzinom (BET oder Mastektomie)</div>
    <div class="trow"><strong>Vorteil:</strong> häufig gute Schonung von Herz/Lunge durch tangentialen Eintritt; abhängig von Anatomie, Seite, Atemtechnik und Planqualität</div>
    <div class="trow"><strong>Nachteil:</strong> Dosishomogenität im konvexen Gewebe und Oberflächendosis können herausfordernd sein; Bewertung immer planabhängig</div>
    <div class="tmtr">⚠️ MTR: Armposition (Mammazange / Wingboard), Brustlagerung und Hautmarken exakt nach Plan einrichten. Bei kombiniertem DIBH-Setup zusätzlich: Atemfenster überwachen und Compliance dokumentieren — sonst stimmen Planungs- und Behandlungsanatomie nicht überein.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-mid">Mittel</div>
    <div class="tname">Halbfeldtechnik</div>
    <div class="tshort">Abgeschnittene Feldkante (halbe Blende)</div>
    <img src="media/images/halbfeld-prinzip.jpg" alt="Halbfeld Prinzip Isozentrum" style="width:100%;border-radius:6px;border:1px solid var(--border);margin-bottom:0.5rem;display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Halbfeldtechnik: Isozentrum an der Feldkante — Divergenz abgeschnitten</div>
    <div class="trow"><strong>Prinzip:</strong> Eine Blendenbacke auf Feldmitte → Divergenz abschneiden</div>
    <div class="trow"><strong>Indikation:</strong> Aneinanderstoßende Felder: Mamma + Supraklavikula, Ganzhirn + C-Spine</div>
    <div class="trow"><strong>Vorteil:</strong> Keine Dosisüberlappung an der Feldnaht; scharfe Feldgrenze</div>
    <div class="trow"><strong>Nachteil:</strong> Komplexes Setup; Kollimatorrotation exakt einhalten</div>
    <div class="tmtr">⚠️ MTR: Kollimatorwinkel und Halbfeld-Seite exakt aus Plan — jede Abweichung erzeugt Über-/Unterdosierung an der Naht!</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-adv">Fortgeschritten</div>
    <div class="tname">IMRT</div>
    <div class="tshort">Intensitätsmodulierte Radiotherapie</div>
    <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><img src="media/images/imrt-mlc-segmentierung.jpg" alt="IMRT MLC-Segmentierung Strahlenfeld" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/><img src="media/images/imrt-vmat-vergleich.jpg" alt="IMRT vs VMAT PTV OAR Dosisverteilung Vergleich" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/></div><div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.35rem">Links: IMRT — MLC-Segmente erzeugen inhomogene Intensitätsverteilung · Rechts: IMRT vs. VMAT Dosisverteilung im Vergleich (PTV rot, OAR grün)</div>
    <div class="trow"><strong>Prinzip:</strong> Feste Gantrywinkel wie bei der 3D-CRT, aber die Dosisintensität wird innerhalb jedes Feldes moduliert. Die Optimierung erfolgt typischerweise über inverse Planung.</div>
    <div class="trow"><strong>MLC-Dynamik:</strong> Je nach Verfahren fährt der MLC segmentweise (<em>Step-and-Shoot</em>: Beam aus → MLC fährt → Beam an) oder kontinuierlich (<em>Sliding Window</em>: MLC bewegt sich während Beam-on).</div>
    <div class="trow"><strong>Indikation:</strong> HNO-Tumoren, Prostata, komplexe Volumina mit engen OAR-Anforderungen</div>
    <div class="trow"><strong>Vorteil:</strong> Hohes Konformitätspotenzial; gezielte Dosismodulation</div>
    <div class="trow"><strong>Nachteil:</strong> Längere Bestrahlungszeit als VMAT, mehr Segmente/MU und höhere Anforderungen an QA und Reproduzierbarkeit.</div>
    <div class="tmtr">⚠️ MTR: Steile Dosisgradienten bedeuten: Lagerung, Maske/Vakuumhilfe, Füllungszustände und IGRT-Match müssen konsequent reproduziert werden. Kleine anatomische Abweichungen können dosimetrisch relevant werden.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-mid">Mittel</div>
    <div class="tname">3-Felder-Technik (Mercedes Stern)</div>
    <div class="tshort">2 schräge Felder + 1 ventrales Feld</div>
    <div style="display:flex;gap:0.5rem;margin-bottom:0.5rem"><img src="media/images/6-felder-mercedes-schema.jpg" alt="6-Felder Mercedes-Stern Schema" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/><img src="media/images/6-felder-pelvis-isodosen.jpg" alt="6-Felder CT Isodosen Pelvis" style="flex:1;min-width:0;border-radius:6px;border:1px solid var(--border)"/></div><div style="font-size:0.7rem;color:var(--text-muted);margin-top:0.35rem">Links: Mercedes-Stern Schema (3 Felder: 0°/120°/240°) · Rechts: CT-Isodosen Pelvis (60 Gy)</div>
    <div class="trow"><strong>Felder:</strong> 1 ventrales Feld (0°) + 2 schräge Felder (z.B. 120°/240°) — ergibt Mercedes-Stern-Muster</div>
    <div class="trow"><strong>Indikation:</strong> Becken-/Abdomentumoren (Rektum, Blase, gynäk. Tumore), Ösophagus</div>
    <div class="trow"><strong>Vorteil:</strong> Gegenüber 4-FB bessere OAR-Schonung; homogenere Dosisverteilung durch schräge Einstrahlwinkel</div>
    <div class="trow"><strong>Nachteil:</strong> Höhere Integraldosis; mehr Planungsaufwand als 4-FB</div>
    <div class="tmtr">⚠️ MTR: alle geplanten Gantrywinkel und Tisch-/Kollimatorwerte verifizieren; bei Beckenplänen Füllungsprotokoll und tägliches CBCT konsequent beachten</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-adv">Fortgeschritten</div>
    <div class="tname">VMAT</div>
    <div class="tshort">Volumetric Modulated Arc Therapy</div>
    <img src="media/images/vmat-ganzhirn-raystation.jpg" alt="VMAT Ganzhirn RayStation 3D und Isodosen" style="width:100%;border-radius:6px;border:1px solid var(--border);margin-bottom:0.5rem;display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">RayStation: VMAT Ganzhirn mit HC-Schonung — Isodosen (links) + 3D-Arc-Ansicht (rechts)</div>
    <div class="trow"><strong>Prinzip:</strong> Weiterentwicklung der IMRT: Die Gantry rotiert kontinuierlich um den Patienten, während gleichzeitig MLC-Positionen, Dosisleistung und Rotationsgeschwindigkeit variiert werden.</div>
    <div class="trow"><strong>Indikation:</strong> Prostata, Rektum, Lunge, HNO und komplexe Zielvolumina mit relevanter OAR-Nähe — abhängig von Hausstandard und Planungsziel.</div>
    <div class="trow"><strong>Vorteil:</strong> Hohe Konformität, häufig kurze Beam-on-Zeit und gute Möglichkeit zur OAR-Schonung bei komplexen Volumina.</div>
    <div class="trow"><strong>Nachteil:</strong> Niedrigdosisanteile im Arc-Bereich, hohe Abhängigkeit von korrekter Anatomie/Reproduzierbarkeit und aufwändige patientenspezifische QA.</div>
    <div class="tmtr">⚠️ MTR: Tägliches CBCT/IGRT ist bei vielen VMAT-Workflows Standard. Entscheidend ist nicht nur „Bild passt“, sondern: passt die relevante Anatomie für genau diesen Plan?</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-adv">Fortgeschritten</div>
    <div class="tname">SRS / SBRT</div>
    <div class="tshort">Stereotaktische Radiochirurgie / SBRT</div>
    <img src="media/images/stereotaxie-hirnmetastase.jpg" alt="Stereotaxie MRT Hirnmetastase Dosisverteilung" style="width:100%;border-radius:6px;border:1px solid var(--border);margin-bottom:0.5rem;display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Didaktisches Beispiel SRS: hochkonformale Dosisverteilung. Klinische Pläne variieren je nach Lokalisation, System, OAR und Protokoll</div>
    <div class="trow"><strong>Prinzip:</strong> Hochpräzise stereotaktische Behandlung mit sehr kleinen Margins, steilem Dosisabfall und wenigen Fraktionen. Umsetzung je nach Lokalisation als SRS (intrakraniell) oder SBRT (extrakraniell).</div>
    <div class="trow"><strong>Indikation:</strong> z. B. Hirnmetastasen, Lungenfrühstadium, Leberläsionen oder Wirbelsäulenläsionen — immer mit strengem Indikations-, Immobilisations- und IGRT-Konzept.</div>
    <div class="trow"><strong>Vorteil:</strong> Sehr hohe Konformität und hohe Einzeldosen können bei geeigneter Indikation Vorteile bieten; Patientenauswahl, OAR-Abstand, Immobilisation und IGRT sind entscheidend.</div>
    <div class="trow"><strong>Nachteil:</strong> Sehr kleine Felder und steile Gradienten → Abweichungen im Millimeterbereich können relevant sein; Toleranzen richten sich nach Lokalisation, Technik und Hausstandard.</div>
    <div class="tmtr">⚠️ MTR: Hochpräzisionsmodus: Immobilisation, 6D-Korrekturen, CBCT-/Soft-Tissue-/Fiducial-Match und ggf. intrafraktionelle Kontrolle strikt nach Protokoll. Keine „ungefähre“ Lagerung.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-adv">Atemmanagement · SGRT</div>
    <div class="tname">DIBH / Atemgating / SGRT</div>
    <div class="tshort">Atemlage als Teil der Bestrahlungstechnik</div>
    <div class="trow"><strong>Prinzip:</strong> Bei DIBH (<em>Deep Inspiration Breath Hold</em>) hält die Patientin oder der Patient in tiefer Inspiration die Luft an. Dadurch ändern sich Organabstände, besonders bei linksseitiger Mamma-Bestrahlung kann das Herz aus dem Hochdosisbereich rücken.</div>
    <div class="trow"><strong>SGRT:</strong> Surface-Guided Radiotherapy nutzt optische Oberflächenüberwachung. Je nach System und Hausworkflow kann SGRT die Atemlage überwachen, ein definiertes Atemfenster unterstützen und bei Abweichung einen Beam-Hold auslösen.</div>
    <div class="trow"><strong>Grenze:</strong> SGRT ersetzt nicht automatisch CT-/CBCT- oder Planlogik. Es überwacht die Oberfläche; die klinische Aussage hängt von Korrelation, Atemtraining, Setup und Protokoll ab.</div>
    <div class="tmtr">⚠️ MTR: Atemtraining, Reproduzierbarkeit des DIBH-Levels, Kamerafreigabe, Lagerung, Hautmarker/Oberflächenreferenz und Abbruchkriterien aktiv überwachen. Nicht bestrahlen, wenn das Atemfenster nicht stabil erreicht wird.</div>
  </div>
</div>


<div style="margin-top:1.5rem">
  <div class="card-label" style="padding:0 0 0.5rem">⚙️ Dosismodifikation & Lagerungshilfsmittel</div>
</div>

<div class="tgrid">

  <div class="tcard">
    <div class="tbadge tb-basic">Basis · Hilfsmittel</div>
    <div class="tname">Keilfilter</div>
    <div class="tshort">Dosismodifikation durch physikalische oder virtuelle Keilung</div>
    <img src="media/images/mammazange-keilfilter.jpg" alt="Mammazange mit Keilfiltern Tangentialfelder" style="width:100%;border-radius:6px;border:1px solid var(--border);margin:0.5rem 0"/>
    <div class="trow"><strong>Funktion:</strong> Kippung der Isodosen durch keilförmige Abschwächung — Ausgleich inhomogener Dosisverteilung</div>
    <div class="trow"><strong>Typen:</strong>
      <ul style="margin:0.3rem 0 0.3rem 1.1rem;font-size:0.82rem;line-height:1.6">
        <li><strong>Physikalischer Keilfilter:</strong> Metallkeil im Strahlgang — fester Keilwinkel (15°/30°/45°/60°)</li>
        <li><strong>Dynamischer Keilfilter (EDW):</strong> Blendenbacke fährt während Bestrahlung — softwaregesteuert, flexibler</li>
        <li><strong>Virtueller Keilfilter:</strong> Intensitätsmodulation ohne physikalischen Filter — über MLC realisiert</li>
      </ul>
    </div>
    <div class="trow"><strong>Typische Indikation:</strong> Mamma (Tangentialfelder), schiefe Körperoberflächen, Ausgleich von Dosisgradienten</div>
    <div class="trow"><strong>Keilrichtung & Winkel:</strong> Richtet sich nach Planvorgabe — Keilwinkel und Richtung exakt aus dem Plan übernehmen</div>
    <div class="tmtr">⚠️ MTR: Keilfiltertyp (physikalisch / dynamisch / virtuell), -winkel und -richtung aus dem Plan übernehmen. An modernen Linacs wird der Keil meist software-/MLC-gesteuert (kein manueller Einbau mehr). Wo physikalische Keile noch genutzt werden: korrekten Einbau und Orientierung kontrollieren. Verwechslung von Winkel oder Richtung führt zu Falschdosierung.</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-basic">Basis · Hilfsmittel</div>
    <div class="tname">Moulagen / Bolus / Flaps</div>
    <div class="tshort">Gewebeäquivalentes Material zur Dosisoptimierung an der Körperoberfläche</div>
    <div class="trow"><strong>Funktion:</strong> Gewebeäquivalentes Material erhöht die Oberflächendosis und reduziert den Buildup-Effekt. Die tatsächliche Verschiebung der Tiefendosiskurve ist energie-, feld- und anlageabhängig</div>
    <div class="trow"><strong>Materialien:</strong>
      <ul style="margin:0.3rem 0 0.3rem 1.1rem;font-size:0.82rem;line-height:1.6">
        <li><strong>Bolus:</strong> Konfektioniertes gewebeäquivalentes Gel, direkt auf die Haut aufgelegt</li>
        <li><strong>Moulage:</strong> Individuell angefertigte Schale/Auflage (z. B. Wachs, Thermoplast) — passt sich Körperkontur an</li>
        <li><strong>Flap / Gewebelappen:</strong> Nach OP über das Bestrahlungsgebiet gelegte Eigengewebsstruktur (z. B. nach Hauttransplantation)</li>
      </ul>
    </div>
    <div class="trow"><strong>Typische Indikation:</strong> Hauttumoren, Narbenbestrahlung, Brustwandbestrahlung nach Mastektomie, oberflächliche Lymphome</div>
    <div class="trow"><strong>Dicke & Wirkung:</strong> Bolus erhöht die Oberflächendosis und reduziert den Buildup-Effekt. Wie stark sich die Tiefendosiskurve verändert, hängt von Energie, Feldgröße, Kontur, Material, Bolusdicke und Luftspalt ab. Im Plan definiert — im Setup reproduzierbar anlegen</div>
    <div class="callout callout-warn" style="margin-top:0.75rem;padding:0.6rem 0.875rem;font-size:0.82rem">
      <span class="callout-icon">⚠️</span>
      <div>Luftspalten zwischen Bolus und Haut können die geplante Oberflächendosis und Tiefendosis relevant verändern. Tägliche Kontrolle der Anlage ist deshalb obligat.</div>
    </div>
    <div class="tmtr">⚠️ MTR: Bolus/Moulage täglich nach Planvorgabe anlegen, Luftspalt aktiv prüfen, Dicke/Material/Lage dokumentieren. Bei unplausibler Anlage: nicht improvisieren, sondern Rücksprache nach Hausstandard</div>
  </div>

  <div class="tcard">
    <div class="tbadge tb-mid">Mittel · Technik</div>
    <div class="tname">Divergenzausgleich</div>
    <div class="tshort">Geometrische Feldkantenlösung bei aneinandergrenzenden Feldern</div>
    <div class="trow"><strong>Problem:</strong> Jeder Strahl hat eine geometrische Divergenz — an der Feldkante laufen die Feldgrenzen auseinander. Bei aneinanderstoßenden Feldern (z. B. Mamma + Supraklavikula, Ganzhirn + C-Spine) kann ohne passende Geometrie an der Naht eine Überlappung oder Lücke entstehen</div>
    <div class="trow"><strong>Lösung A — Gantrykippung (Couch-Technik):</strong>
      <ul style="margin:0.3rem 0 0.3rem 1.1rem;font-size:0.82rem;line-height:1.6">
        <li>Gantry wird so geneigt, dass die Feldkante senkrecht zur Feldnaht verläuft</li>
        <li>Kippwinkel wird planungsseitig berechnet und ist als Planparameter zu übernehmen</li>
        <li>Einsatz: z. B. Ganzhirn + C-Spine Übergang</li>
      </ul>
    </div>
    <div class="trow"><strong>Lösung B — Tischrotation:</strong>
      <ul style="margin:0.3rem 0 0.3rem 1.1rem;font-size:0.82rem;line-height:1.6">
        <li>Bestrahlungstisch wird nach Planvorgabe gedreht, um die Feldkante geometrisch passend auszurichten</li>
        <li>Einsatz: alternativ oder kombiniert mit Gantrykippung</li>
      </ul>
    </div>
    <div class="trow"><strong>Lösung C — Halbfeldtechnik:</strong> Blende auf Feldmitte → Divergenz wird abgeschnitten (→ separater Technikabschnitt oben)</div>
    <div class="trow"><strong>Toleranz:</strong> Abweichungen vom Planwert können an der Naht Überlappung oder Lücke erzeugen. Deshalb: Planparameter exakt übernehmen und bei Unklarheit stoppen</div>
    <div class="tmtr">⚠️ MTR: Gantry- und Tischwinkel exakt aus Plan übernehmen. An Feldnähten wirken sich kleine Winkel- oder Lagerungsabweichungen direkt als Über- oder Unterdosierung aus — die zulässigen Toleranzen werden im Hausstandard definiert (typischerweise im einstelligen Grad- bzw. Millimeter-Bereich). Nicht schätzen, sondern Plan-Werte einstellen und dokumentieren.</div>
  </div>

</div>

<div class="card" data-match-id="match-tech-transfer">
  <div class="card-label">🧩 Theorie-Praxis-Transfer: Technik passend begründen</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.75rem">Klicke zuerst die klinische Situation links an und danach die fachlich passende Technik bzw. Kontrolllogik rechts. Ziel ist nicht Raten, sondern die Begründung im Kopf: Zielvolumen + OAR + Bewegung + MTR-Kontrolle.</p>
  <div class="match-wrap" id="match-tech-transfer" data-match-id="match-tech-transfer">
    <div class="match-grid">
      <div>
        <div class="match-col-label">Klinisches Problem / Indikation</div>
        <div class="match-items">
          <div class="mi" data-side="left" data-pair="sbrt" onclick="handleMatchClick(this,'left','match-tech-transfer')">Extrem hohe Einzeldosis, wenige Fraktionen, sehr kleiner Sicherheitssaum</div>
          <div class="mi" data-side="left" data-pair="dibh" onclick="handleMatchClick(this,'left','match-tech-transfer')">Linksseitiges Mamma-Ca: Herzdosis soll reduziert werden</div>
          <div class="mi" data-side="left" data-pair="naht" onclick="handleMatchClick(this,'left','match-tech-transfer')">Ganzhirn + C-Spine: Risiko einer Über-/Unterdosierung an der Feldnaht</div>
          <div class="mi" data-side="left" data-pair="vmat" onclick="handleMatchClick(this,'left','match-tech-transfer')">Komplexes Zielvolumen liegt eng an Risikoorganen</div>
          <div class="mi" data-side="left" data-pair="bolus" onclick="handleMatchClick(this,'left','match-tech-transfer')">Oberflächliches Ziel / Brustwand: Dosismaximum soll zur Haut verlagert werden</div>
        </div>
      </div>
      <div>
        <div class="match-col-label">Passende Technik / Kontrolllogik</div>
        <div class="match-items">
          <div class="mi" data-side="right" data-pair="dibh" onclick="handleMatchClick(this,'right','match-tech-transfer')">DIBH/Atemgating, ggf. SGRT; stabiles Atemfenster vor Beam-on prüfen</div>
          <div class="mi" data-side="right" data-pair="naht" onclick="handleMatchClick(this,'right','match-tech-transfer')">Halbfeldtechnik, Gantrykippung oder Tischrotation; Nahtparameter exakt übernehmen</div>
          <div class="mi" data-side="right" data-pair="bolus" onclick="handleMatchClick(this,'right','match-tech-transfer')">Bolus/Moulage; Dicke, Lage und Luftspaltfreiheit täglich prüfen</div>
          <div class="mi" data-side="right" data-pair="sbrt" onclick="handleMatchClick(this,'right','match-tech-transfer')">SRS/SBRT mit engem Immobilisations-, IGRT- und Toleranzkonzept</div>
          <div class="mi" data-side="right" data-pair="vmat" onclick="handleMatchClick(this,'right','match-tech-transfer')">IMRT/VMAT wegen komplexer Dosisformung und OAR-Schonung; tägliche Anatomie kritisch prüfen</div>
        </div>
      </div>
    </div>
    <div class="match-score">0 / 5 Paare korrekt zugeordnet</div>
  </div>
</div>

<div class="callout callout-success">
  <span class="callout-icon">✓</span>
  <div><strong>Transfergedanke:</strong> Eine moderne Technik ist nur dann gut, wenn die tägliche Durchführung die Planannahmen reproduziert. Genau hier liegt die berufliche Verantwortung der MTR.</div>
</div>

<div class="callout callout-info">
  <span class="callout-icon">🎥</span>
  <div><strong>Empfohlene Videos:</strong>
  <div class="res-links" style="margin-top:0.5rem">
    <a class="rlink" href="https://www.youtube-nocookie.com/watch?v=5yFrEZzM_6U" target="_blank">▶ VMAT erklärt (englisch)</a>
    <a class="rlink" href="https://www.estro.org/Science/E-Learning" target="_blank">🌐 ESTRO e-learning Techniken</a>
    <a class="rlink" href="https://www.iaea.org/resources/rpop/health-professionals/radiotherapy/external-beam-radiotherapy" target="_blank">🌐 IAEA: External Beam RT</a>
  </div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 6. TECH AUFGABEN
// ─────────────────────────────────────────────
function rTechAufgaben() {
  return `
<div class="section-tag">✏️ Kapitel 3 · Aufgaben</div>
<div class="section-title">Bestrahlungstechniken — Aufgaben</div>
<div class="section-lead">Techniken klinischen Situationen zuordnen und Besonderheiten kennen.</div>

<div class="card" data-match-id="match-tech">
  <div class="card-label">📌 Aufgabe 1 — Zuordnung: Klinische Situation ↔ Technik</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.5rem">Klicke links auf eine klinische Situation, rechts auf die passende Technik.</p>
  <div class="match-wrap" id="match-tech" data-match-id="match-tech">
    <div class="match-grid">
      <div>
        <div class="match-col-label">Klinische Situation</div>
        <div class="match-items">
          <div class="mi" data-side="left" data-pair="p1" onclick="handleMatchClick(this,'left','match-tech')">Ganzhirn-RT bei Hirnmetastasen (palliativ)</div>
          <div class="mi" data-side="left" data-pair="p2" onclick="handleMatchClick(this,'left','match-tech')">Mamma-Ca links (BET), adjuvante RT</div>
          <div class="mi" data-side="left" data-pair="p3" onclick="handleMatchClick(this,'left','match-tech')">Prostata-Ca, definitiv, konformale Planung</div>
          <div class="mi" data-side="left" data-pair="p4" onclick="handleMatchClick(this,'left','match-tech')">WS-Metastase Th6, palliativ, Schmerzen</div>
          <div class="mi" data-side="left" data-pair="p5" onclick="handleMatchClick(this,'left','match-tech')">Mamma (BET) + Supraklavikula-LK gleichzeitig</div>
        </div>
      </div>
      <div>
        <div class="match-col-label">Bestrahlungstechnik</div>
        <div class="match-items">
          <div class="mi" data-side="right" data-pair="p3" onclick="handleMatchClick(this,'right','match-tech')">VMAT oder 4-Felder-Box — abhängig von Ziel, OAR, Planqualität und Hausstandard</div>
          <div class="mi" data-side="right" data-pair="p4" onclick="handleMatchClick(this,'right','match-tech')">Stehfeld (posterior) oder Gegenfelder</div>
          <div class="mi" data-side="right" data-pair="p1" onclick="handleMatchClick(this,'right','match-tech')">Gegenfeldtechnik (lateral)</div>
          <div class="mi" data-side="right" data-pair="p5" onclick="handleMatchClick(this,'right','match-tech')">Tangentialfelder + Halbfeldtechnik als geometrische Nahtlösung</div>
          <div class="mi" data-side="right" data-pair="p2" onclick="handleMatchClick(this,'right','match-tech')">Tangentialfelder (± DIBH)</div>
        </div>
      </div>
    </div>
    <div class="match-score" id="match-tech-score">0 / 5 Paare zugeordnet</div>
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Was ist das primäre Ziel der Halbfeldtechnik beim kombinierten Mamma- und Supraklavikula-Setup?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>die Gesamtdosis unabhängig von der Feldgeometrie automatisch zu optimieren</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Dosisüberlappung (und damit Überdosierung) an der Feldnaht zu verhindern</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Zwei separate Isozentra für jedes Zielvolumen zu verwenden</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Die Bestrahlungszeit zu halbieren</div>
  </div>
  <div class="qfeedback"
    data-ok="Angrenzende Felder (Mamma + Supraklavikula) haben durch divergente Feldkanten normalerweise Überlappungszonen — und damit Überdosierungen an der Naht. Die Halbfeldtechnik schneidet die Divergenz ab: Beide Feldkanten sind gerade und stoßen exakt ohne Überlappung aneinander. Fehler beim Kollimatorwinkel oder der Halbfeld-Seite erzeugen Über- oder Unterdosierung — deshalb ist die Präzision des MTR hier entscheidend."
    data-err="Die Halbfeldtechnik ist keine Dosisverteilungstechnik — sie ist eine geometrische Lösung für das Divergenzproblem an Feldnähten. Ziel: Felder stoßen ohne Überlappung sauber aneinander.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>VMAT vs. 4-Felder-Box bei Prostatakarzinom: Welche Aussage ist korrekt?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>VMAT ist immer dem 4-Felder-Box vorzuziehen, da einfacher durchzuführen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>VMAT ermöglicht eine bessere Konformität und OAR-Schonung bei komplexen PTV-Formen, aber mit höherer Niedrigdosis-Integraldosis</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>4-Felder-Box ist bei Prostata obsolet und wird nicht mehr eingesetzt</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Beide Techniken sind äquivalent — die Entscheidung liegt ausschließlich beim MTR</div>
  </div>
  <div class="qfeedback"
    data-ok="VMAT-Vorteile: Höhere Konformität (PTV-Abdeckung), bessere OAR-Schonung (Rektum, Blase), kürzere Bestrahlungszeit. Nachteil: Durch den Arc entsteht eine breitere Niedrigdosis-Verteilung im Becken (höhere Integraldosis). 4-Felder-Box ist einfacher, robuster und in manchen Situationen (z.B. bei sehr homogenem PTV) ebenfalls optimal. Die Entscheidung trifft der Radioonkologe/Physiker — nicht der MTR."
    data-err="VMAT hat klinische Vorteile bei komplexen Volumina, aber auch den Nachteil der höheren Integraldosis. Die Technikentscheidung liegt beim Planungsteam (Physiker + Arzt).">
  </div>
</div>
${navBtns()}`;
}


// ─────────────────────────────────────────────
// 6b. MTR PLANCHECK
// ─────────────────────────────────────────────
function rPlancheck() {
  return `
<div class="section-tag">🧩 Kapitel 3 · Handlungskompetenz</div>
<div class="section-title">MTR-Plancheck: Was kontrolliere ich warum?</div>
<div class="section-lead">Diese Station verbindet Technik, Planlogik und tägliche Behandlung. Ziel ist nicht Planfreigabe, sondern sichere Durchführung: Plausibilität prüfen, Auffälligkeiten erkennen, bei Bedarf stoppen, rückfragen und dokumentieren.</div>

<div class="card">
  <div class="card-label">✅ MTR-Plancheck vor erster Fraktion</div>
  <table class="dt">
    <thead><tr><th>Checkpunkt</th><th>Warum?</th><th>Typische Auffälligkeit</th><th>Größenordnung Beispieltoleranz</th></tr></thead>
    <tbody>
      <tr><td>Identität, Indikation, Seite, Fraktionierung</td><td>Verwechslungen verhindern</td><td>links/rechts, Boost vs. Ganzbrust, alte Serie</td><td><strong>Null-Toleranz.</strong> Jede Unstimmigkeit = Stop und Klärung.</td></tr>
      <tr><td>Lagerung und Immobilisation</td><td>PTV-Marge setzt reproduzierbares Setup voraus</td><td>falsches Lagerungshilfsmittel, Armposition, Maske, Knie-/Fußfixierung</td><td>Lagerungshilfen identisch zum PLCT; Hautmarken passen zum Lasersetup im Millimeterbereich.</td></tr>
      <tr><td>Technikparameter</td><td>Feld-/Arc-Geometrie bestimmt Dosisverteilung</td><td>falscher Gantry-/Kollimatorwinkel, Keilrichtung, Bolusvorgabe</td><td>Plan-Werte werden 1:1 übernommen — Bedienoberfläche zeigt Soll/Ist. Abweichung = Klärung.</td></tr>
      <tr><td>Bildführung / Matchstrategie</td><td>Setup-Abweichungen erkennen und nach freigegebenem Match-/Korrekturprotokoll handeln</td><td>Knochenmatch vs. Weichteilmatch, unplausible Tagesanatomie, Rektum-/Blasenfüllung</td><td>Aktionsschwellen je nach Region typischerweise: Translation einstellige Millimeter, Rotation einstellige Grad — exakter Wert nach Hausstandard.</td></tr>
      <tr><td>OAR- und Planbesonderheiten</td><td>kritische Risiken im Alltag präsent halten</td><td>Herz bei Mamma links, Rektum/Blase bei Prostata, Rückenmark bei HNO</td><td>Plan-DVH-Grenzen sind ärztlich/physikalisch festgelegt; die MTR sichert die Voraussetzungen (Füllung, Atemlage, Lagerung), unter denen sie eingehalten werden.</td></tr>
      <tr><td>Abbruch-/Rücksprachekriterien</td><td>Patientensicherheit vor Durchsatz</td><td>unpassendes CBCT, Luftspalt unter Bolus, falsche Feldnaht, Atemfenster-Drift, DIBH-Level nicht erreichbar</td><td><strong>Im Zweifel Stop.</strong> Eine pausierte Sitzung ist immer besser rückzuholen als eine fehlerhaft applizierte Dosis.</td></tr>
    </tbody>
  </table>
  <div class="callout callout-warn" style="margin-top:1rem">
    <span class="callout-icon">⚠️</span>
    <div><strong>Wichtig zur Toleranzspalte:</strong> Die genannten Größenordnungen sind <strong>Orientierungsbeispiele</strong>, keine verbindlichen Grenzwerte. Verbindlich ist immer der jeweilige Hausstandard / das schriftliche Korrektur- und Aktionsschwellenprotokoll deiner Abteilung — diese unterscheiden sich zwischen Zentren teils deutlich. Nutze diese Spalte als Größenordnungsgefühl, nicht als Zahl, die du im Bunker auswendig anwendest.</div>
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Fallentscheidung 1 — Prostata VMAT</div>
  <div class="transfer-q">Im CBCT ist das Rektum deutlich stärker gefüllt als im Planungs-CT. Die Prostata liegt dadurch ventral verschoben. Was ist dein Vorgehen als MTR?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Beschreibe dein Vorgehen mit Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation"><div class="expectation-title">Erwartungshorizont</div>
    Nicht blind bestrahlen. CBCT gegen Planungsanatomie prüfen, Matchstrategie nach Hausstandard anwenden und die Verschiebung/Anatomie plausibilisieren. Je nach Protokoll: Patient entleeren lassen, neu lagern und neues CBCT durchführen. Bei persistierender oder unklarer Abweichung Rücksprache mit Arzt/Physik. Begründung: Bei Prostata kann Rektumfüllung Ziel- und OAR-Lage verändern; VMAT/IMRT reagieren wegen steiler Dosisgradienten empfindlich auf unplausible Tagesanatomie.
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Fallentscheidung 2 — Mamma links mit DIBH</div>
  <div class="transfer-q">Die Patientin erreicht heute das geplante DIBH-Atemniveau nicht stabil. Der Atemkurvenbereich wird mehrfach verlassen. Was tust du?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Beschreibe dein Vorgehen mit Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation"><div class="expectation-title">Erwartungshorizont</div>
    Training/Anleitung wiederholen, Lagerung und Atemsignal prüfen, Bestrahlung nur im freigegebenen Atemfenster. Den Sollbereich nicht eigenmächtig ändern. Wenn reproduzierbares DIBH nicht möglich ist: Rücksprache nach Hausstandard. Begründung: DIBH reduziert Herzexposition nur, wenn das Planungsniveau reproduziert wird.
  </div>
</div>

<div class="transfer-block">
  <div class="card-label">🧠 Fallentscheidung 3 — Elektronen mit Bolus</div>
  <div class="transfer-q">Bei einer Brustwandbestrahlung mit Elektronen liegt der Bolus nicht flächig an; unter einer Narbe ist ein Luftspalt sichtbar. Was ist fachlich korrekt?</div>
  <textarea class="transfer-ta" data-required-words="20" placeholder="Beschreibe dein Vorgehen mit Begründung..."></textarea>
  <div class="word-hint">Mindestens etwa 20 Wörter — Ursache · Konsequenz · Handlung.</div>
  <button class="btn btn-ghost" style="margin-top:0.75rem" onclick="revealExpectation(this,20)">Erwartungshorizont anzeigen</button>
  <div class="expectation"><div class="expectation-title">Erwartungshorizont</div>
    Nicht mit bekanntem Luftspalt bestrahlen. Bolus korrigieren/anpassen, ggf. alternative Moulage oder Rücksprache. Begründung: Bolus soll Oberflächendosis gezielt erhöhen; Luftspalten führen zu nicht plangemäßer Dosisverteilung.
  </div>
</div>

<div class="card">
  <div class="card-label">🔚 Abschluss dieser Station</div>
  <p>Markiere diese Station erst als abgeschlossen, wenn du alle drei Situationen fachlich begründet hast. Entscheidend ist nicht die Länge, sondern die nachvollziehbare MTR-Handlung.</p>
  <button class="btn btn-primary" onclick="completeTransferPage(8)">Station abschließen →</button>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 7. FALL 1 INFO
// ─────────────────────────────────────────────
function rFall1Info() {
  return `
<div class="section-tag">📋 Teil 2 · Fall 1</div>
<div class="section-title">Fall 1: Mamma-Karzinom</div>
<div class="section-lead">Adjuvante Radiotherapie nach brusterhaltender Operation — ein Standardfall der Strahlentherapie, der alle Grundlagen aus Teil 1 verknüpft.</div>

<div class="case-header">
  <div class="case-pill">🏥 Fallvorstellung · Fall 1</div>
  <div class="case-name">Frau K., 54 Jahre</div>
  <div class="case-desc">Zustand nach brusterhaltender Operation (BET) bei linksseitigem Mamma-Karzinom. Adjuvante Radiotherapie der linken Brust geplant.</div>
  <div class="case-grid">
    <div class="case-item"><div class="case-item-label">Diagnose</div><div class="case-item-val">Mamma-Ca links</div></div>
    <div class="case-item"><div class="case-item-label">Stadium</div><div class="case-item-val">pT1c N0 M0</div></div>
    <div class="case-item"><div class="case-item-label">Histologie</div><div class="case-item-val">invasiv-duktal, G2</div></div>
    <div class="case-item"><div class="case-item-label">OP</div><div class="case-item-val">BET, Sentinel-LK neg.</div></div>
    <div class="case-item"><div class="case-item-label">Therapieziel</div><div class="case-item-val">adjuvante RT</div></div>
    <div class="case-item"><div class="case-item-label">Rezeptor</div><div class="case-item-val">ER+, PR+, HER2–</div></div>
  </div>
</div>

<div class="card">
  <div class="card-label">🎯 Planungskontext: Was ist zu bestrahlen?</div>
  <p>Nach BET wird die verbliebene linke Brust bestrahlt (<strong>adjuvante Radiotherapie</strong>). Das Ziel: verbliebene Tumorzellen im Resektionsbett und in der gesamten Brustdrüse abtöten, das Lokalrezidivrisiko senken — ohne das linksseitige Herz unnötig zu belasten.</p>
  <table class="dt">
    <thead><tr><th>ICRU-Volumen</th><th>Inhalt bei diesem Fall</th></tr></thead>
    <tbody>
      <tr><td><span class="vbadge vb-gtv">GTV</span></td><td>Nicht mehr vorhanden nach R0-Resektion — oder: Tumorbett für Boost-Planung (Clips sichtbar im CT)</td></tr>
      <tr><td><span class="vbadge vb-ctv">CTV</span></td><td>Verbliebene linke Brust (Brustdrüsengewebe inkl. Resektionsbett)</td></tr>
      <tr><td><span class="vbadge vb-ptv">PTV</span></td><td>CTV + Sicherheitssaum (je nach Immobilisation 5–10 mm); Herzgrenze berücksichtigen</td></tr>
      <tr><td><span class="vbadge vb-oar">OAR</span></td><td><strong>Herz</strong> (links!), <strong>ipsilaterale Lunge</strong>, kontralaterale Brust, Thoraxwand</td></tr>
    </tbody>
  </table>
</div>

<div class="card">
  <div class="card-label">💨 DIBH: Deep Inspiration Breath Hold</div>
  <p>Bei linksseitigem Mamma-Ca besteht das Risiko einer Herzbelastung durch die Tangentialfelder. <strong>DIBH</strong> (tiefe Inspiration mit Atemstillstand) vergrößert den Abstand zwischen Brustwand und Herz durch die eingeatmete Luft — der Herzeinschluss in die Bestrahlungsfelder sinkt deutlich.</p>
  <img src="media/images/dibh-setup-atemkurve.jpg" alt="DIBH Setup Atemkurve Sollbereich" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">DIBH-Setup: Atemkurve mit Sollbereich — Bestrahlung nur im grünen Fenster (tiefer Inspirationsstop)</div>
  <div class="callout callout-info">
    <span class="callout-icon">💡</span>
    <div><strong>Prinzip:</strong> Bei tiefer Inspiration sinkt das Zwerchfell → Herz wandert kaudal → Abstand Brustwand–Herz vergrößert sich → weniger Herzgewebe im Strahlengang. Typische Herzreduktion: Dmean Herz von 4–5 Gy auf 1–2 Gy.</div>
  </div>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>Hinweis:</strong> DIBH ist keine eigene Bestrahlungstechnik, sondern eine Atemmanagement-Methode. Sie kann je nach Hausstandard und Zielvolumen mit Tangentialfeldern, Feld-in-Feld/IMRT oder VMAT kombiniert werden. Die Atemgating-Logik bleibt davon getrennt.<br><br><strong>MTR-Aufgabe bei DIBH:</strong> Atemgating-System bedienen, Atemkurve monitoren, Compliance der Patientin sicherstellen, DIBH-Level aus Planungs-CT reproduzieren, Abbruchkriterien kennen.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">⚙️ Technikwahl: Warum Tangentialfelder?</div>
  <p>Tangentialfelder treten tangential (nicht senkrecht) an die Brustkurve heran. Beide Felder (mediales + laterales Tangentialfeld) überlappen im Zielvolumen, schonen aber durch ihren schrägen Eintrittswinkel das dahinterliegende Herzgewebe und die Lunge.</p>
  <div style="display:flex;gap:1.25rem;flex-wrap:wrap;align-items:flex-start;margin:1rem 0">
    <img src="media/images/mammazange-tangential.jpg" alt="Mammazange Tangentialfelder mit Keilfiltern" style="max-width:340px;width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Mammazange: medialer + lateraler Tangentialstrahl mit Keilfiltern</div>
    <div style="font-size:0.84rem;max-width:260px;line-height:1.7;color:var(--text-muted);align-self:center">
      <strong style="color:var(--text)">Mammazange mit Keilfiltern:</strong><br>
      ↳ Feld 1: medialer Tangentialstrahl<br>
      ↳ Feld 2: lateraler Tangentialstrahl<br><br>
      Keilfilter gleichen die konvexe Brustoberfläche aus → verbesserte Dosishomogenität im PTV.
    </div>
  </div>
</div>
  <div class="card">
    <div class="card-label">🖥️ TPS-Screenshot: VMAT Mamma-Ca (L2Synergy · 6X)</div>
    <img src="media/images/vmat-mamma-tps.jpg" alt="VMAT Mamma-Ca TPS Isodosen Arc-Ebenenansicht" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Arc-Ebenenansicht VMAT Mamma-Ca: PTV (gelb), 95–105%-Isodosen im Brustgewebe, 50%-Isodose (blau) zeigt Herzabstand. 2 Bögen: 340°UZ179° + 179°GUZ340°, VMAT 6X</div>
  </div>
  <div class="card">
    <div class="card-label">📡 IGRT: CBCT vs. Planungs-CT bei Mamma-Ca.</div>
    <img src="media/images/igrt-cbct-mamma.jpg" alt="IGRT CBCT Mamma-Ca Vergleich Planungs-CT" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">CBCT (links) vs. Planungs-CT (rechts) bei Mamma-Ca. — PTV-Kontur (magenta), Herz (grün). Tägl. Verifikation prüft Lagerung und DIBH-Reproduzierbarkeit.</div>
    <p style="font-size:0.84rem;margin-top:0.5rem">Vor jedem Fx wird bei VMAT-Mamma ein CBCT angefertigt. Es zeigt ob die Lage der Brust, die DIBH-Position und der Herzabstand dem Planungs-CT entsprechen. Bei relevanter Abweichung: Bestrahlung stoppen, korrigieren, erneut messen.</p>
  </div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 8. FALL 1 AUFGABEN
// ─────────────────────────────────────────────
function rFall1Aufgaben() {
  return `
<div class="section-tag">✏️ Teil 2 · Fall 1 · Aufgaben</div>
<div class="section-title">Fall 1 — Aufgaben: Mamma-Ca</div>
<div class="section-lead">Wende dein Wissen auf den Fall von Frau K. an. Alle Fragen beziehen sich auf die Fallvorstellung.</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">1</span>Frau K. erhält eine adjuvante Radiotherapie nach BET. Warum wird bei linksseitigem Mamma-Ca standardmäßig der Einsatz von DIBH geprüft?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Zur Verbesserung der CT-Planungsbildqualität</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Um den Abstand zwischen Brustwand und Herz zu vergrößern und die kardiale Dosis zu reduzieren</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Zur Ruhigstellung der Patientin während der Bestrahlung</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Weil das linksseitige Herz strahlenresistenter ist als das rechte</div>
  </div>
  <div class="qfeedback"
    data-ok="DIBH (tiefe Inspiration) senkt das Zwerchfell, das Herz wandert kaudal und der Abstand zwischen Brustwand und Herzoberfläche wächst. Damit sinkt der Herzeinschluss in die tangentialen Bestrahlungsfelder. Realistisch erreichbar ist je nach Anatomie eine Reduktion der mittleren Herzdosis (Dmean) um etwa 1–2 Gy gegenüber Standard-Tangential ohne Atemkontrolle. Die exakte Größenordnung hängt von Brustkurve, Herzlage, Tumorseite und Plan ab. Klinischer Hintergrund: Das langfristige Risiko für ischämische Herzerkrankungen steigt mit der Herzdosis — die Risikoreduktion durch DIBH ist deshalb relevant, auch wenn die absolute Differenz klein wirkt."
    data-err="DIBH hat nichts mit Bildqualität oder Compliance zu tun — es ist eine dosimetrische Schutztechnik. Das linke Herz liegt anatomisch direkt hinter dem linken Brustzielvolumen — das rechte nicht. Deshalb wird DIBH vor allem bei linker Mamma standardmäßig geprüft.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Im Isodosenbild des Behandlungsplans von Frau K. fällt auf: Die 95%-Isodose überragt die dorsale PTV-Grenze um ca. 4 mm. Das Herzvolumen mit D > 30 Gy beträgt 8 %. Wie bewertest du diesen Plan?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Plan optimal — 95%-Isodose außerhalb PTV = gute Abdeckung, Herz 8% ist akzeptabel</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>Plan optimal bezüglich Konformität, aber Herzdosis ist kritisch zu hinterfragen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">C</span>PTV-Abdeckung ist sichergestellt (CI > 1), aber der Herzeinschluss muss mit DIBH oder Plan-Anpassung reduziert werden</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Plan ist abzulehnen, weil CI > 1 automatisch einen schlechten Plan bedeutet</div>
  </div>
  <div class="qfeedback"
    data-ok="95%-Isodose außerhalb PTV: Das TV > PTV → CI > 1 → das PTV ist vollständig abgedeckt (positiv), aber gesundes Gewebe jenseits des PTV erhält Zieldosis (negativ). Der Herzeinschluss von 8% V30Gy ist abhängig von der Protokollgrenze (viele Zentren fordern V30Gy < 15–20%, andere < 5%). Liegt ein DIBH-Plan daneben, der V30Gy auf 2% reduziert, ist die Umplanung klinisch indiziert. Fazit: PTV-Abdeckung OK, OAR-Optimierung prüfen."
    data-err="CI > 1 bedeutet nicht automatisch Ablehnung — es zeigt Überdeckung (PTV vollständig drin, aber TV > PTV). Das Herzproblem ist das eigentliche klinische Risiko: 8% V30Gy ist zu evaluieren und ggf. durch DIBH zu optimieren.">
  </div>
</div>

<div class="transfer-block">
  <div class="transfer-q"><span class="qnum">3</span>Transferaufgabe: Frau K. kommt zum ersten Bestrahlungstag. Sie erklärt, dass ihr das DIBH-Training schwerfällt und sie den Atemstop nicht lange halten kann. Wie gehst du als MTR mit dieser Situation um?</div>
  <textarea class="transfer-ta" placeholder="Schreibe deine Antwort hier… (mindestens 3–4 Punkte)"></textarea>
  <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.4rem">➡ Vergleiche mit der Musterlösung:</div>
  <div class="checklist">
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ruhig und empathisch kommunizieren; Patientin nicht unter Druck setzen</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>DIBH-Technik nochmals erklären und gemeinsam üben (Atemübung vor Bestrahlung)</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Atemhub-Kurve am Monitor beobachten; Schwellenwert aus Plan notieren</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Wenn DIBH-Level nicht reproduzierbar: Arzt/Physiker informieren vor Bestrahlungsstart</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Nie bei unzureichendem DIBH bestrahlen — dokumentieren und Rücksprache halten</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Freie Atmung als Fallback-Option erst nach expliziter ärztlicher Freigabe</div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 9. FALL 2 INFO
// ─────────────────────────────────────────────
function rFall2Info() {
  return `
<div class="section-tag">📋 Teil 2 · Fall 2</div>
<div class="section-title">Fall 2: Prostatakarzinom</div>
<div class="section-lead">Definitive Radiotherapie ohne Operation — ein komplexer Fall mit hohen Anforderungen an Setup-Stabilität, OAR-Compliance und Technikwahl.</div>

<div class="case-header">
  <div class="case-pill">🏥 Fallvorstellung · Fall 2</div>
  <div class="case-name">Herr M., 68 Jahre</div>
  <div class="case-desc">Prostatakarzinom, keine Operation geplant. Definitive Radiotherapie der Prostata ± proximale Samenblasen.</div>
  <div class="case-grid">
    <div class="case-item"><div class="case-item-label">Diagnose</div><div class="case-item-val">Prostata-Ca</div></div>
    <div class="case-item"><div class="case-item-label">Stadium</div><div class="case-item-val">cT2b N0 M0</div></div>
    <div class="case-item"><div class="case-item-label">Gleason</div><div class="case-item-val">3+4=7 (ISUP 2)</div></div>
    <div class="case-item"><div class="case-item-label">PSA</div><div class="case-item-val">9,2 ng/ml</div></div>
    <div class="case-item"><div class="case-item-label">Therapieziel</div><div class="case-item-val">definitiv, kurativ</div></div>
    <div class="case-item"><div class="case-item-label">Risiko</div><div class="case-item-val">intermediär</div></div>
  </div>
</div>

<div class="card">
  <div class="card-label">🎯 Zielvolumen und OAR bei Prostata-RT</div>
  <table class="dt">
    <thead><tr><th>Volumen</th><th>Inhalt</th><th>Besonderheit</th></tr></thead>
    <tbody>
      <tr><td><span class="vbadge vb-gtv">GTV</span></td><td>Prostata (+ Tumorherd soweit MRT-sichtbar)</td><td>Prostatabewegung durch Rektum-/Blasenfüllung!</td></tr>
      <tr><td><span class="vbadge vb-ctv">CTV</span></td><td>Prostata + proximale Samenblasen</td><td>Samenblasen bei intermediärem Risiko 1–2 cm einbezogen</td></tr>
      <tr><td><span class="vbadge vb-ptv">PTV</span></td><td>CTV + 5–8 mm (IGRT-basiert reduzierbar)</td><td>Tägliches CBCT ermöglicht kleinere Margins</td></tr>
      <tr><td><span class="vbadge vb-oar">OAR</span></td><td><strong>Rektum, Harnblase, Femurkopf bds., Darme</strong></td><td>Rektum: D<sub>max</sub> &lt; 75 Gy; V65Gy &lt; 17% (QUANTEC)</td></tr>
    </tbody>
  </table>
  <div style="margin:1rem 0"><img src="media/images/4-felder-prostata-isodosen.jpg" alt="4-Felder-Box Prostata-Ca CT Isodosen 60 Gy" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">4-Felder-Box Prostata-Ca (60 Gy): Femurkopf (oliv), Rektumbogen (rot), Hochdosis zentral</div></div>
  <img src="media/images/vmat-prostata-tps.jpg" alt="VMAT Prostata-Ca TPS Isodosen Arc-Ebenenansicht L2Synergy" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">Arc-Ebenenansicht VMAT Prostata-Ca: PTV1 (Prostata+SB, grün), 95–106%-Hochdosisareal, 50%-Isodose (blau) begrenzt auf Becken. 2 Bögen: 181°UZ179° + 179°GUZ181°, VMAT 6X</div>
  <div class="callout callout-warn">
    <span class="callout-icon">⚠️</span>
    <div><strong>Setup-Kritikalität:</strong> Die Prostata bewegt sich täglich je nach Rektum- und Blasenfüllung um 3–10 mm. Deshalb: Standardisiertes Füllungsprotokoll (Rektum leer, Blase halbgefüllt) + tägliches CBCT zum Isozentrumsabgleich obligat.</div>
  </div>
</div>

<div class="card">
  <div class="card-label">⚙️ Technikvergleich: 4-Felder-Box vs. VMAT</div>
  <table class="dt">
    <thead><tr><th>Kriterium</th><th>4-Felder-Box</th><th>VMAT</th></tr></thead>
    <tbody>
      <tr><td>Konformität</td><td>Mittel — rechteckige Felder</td><td>Hoch — PTV-konforme Arc-Abdeckung</td></tr>
      <tr><td>OAR-Schonung (Rektum, Blase)</td><td>Gut — 4 Richtungen verteilen Dosis</td><td>Sehr gut — präzise Dosismodulation möglich</td></tr>
      <tr><td>Niedrigdosis-Integraldosis</td><td>Geringer (4 diskrete Eintrittsfenster)</td><td>Höher (Arc-Strahlung 360°)</td></tr>
      <tr><td>Behandlungszeit</td><td>Mittel (4 Felder, Gantry-Pausen)</td><td>Kurz (1–2 Bögen, kontinuierlich)</td></tr>
      <tr><td>Planungsaufwand</td><td>Gering</td><td>Hoch (inverse Optimierung)</td></tr>
      <tr><td>Typische Anwendung heute</td><td>Noch in manchen Zentren; einfaches PTV</td><td>Standard bei komplexen PTV-Formen</td></tr>
    </tbody>
  </table>
  <div class="card-label" style="margin-top:1rem">📡 IGRT: CBCT vs. Planungs-CT Prostata</div>
  <img src="media/images/cbct-prostata-becken.jpg" alt="CBCT vs Planungs-CT Prostata Becken IGRT" style="width:100%;border-radius:8px;border:1px solid var(--border);display:block"/><div style="font-size:0.72rem;color:var(--text-muted);margin-top:0.35rem;text-align:center">CBCT/Planungs-CT Vergleich Prostata-Ca. (Becken): Prostata-Kontur (grün), Blase (blau), Rektum (dunkelblau). Gut sichtbar: Prostataverschiebung durch variierende Rektum-/Blasenfüllung.</div>
  <div class="callout callout-mtr">
    <span class="callout-icon">⚠️</span>
    <div><strong>MTR-Aufgaben bei Prostata-VMAT:</strong> Rektumfüllung nach Hausprotokoll prüfen (ggf. Klistier nach Vorgabe), Blasenfüllungsprotokoll umsetzen, CBCT vor jedem Fx mit Match nach Hausstandard (Knochen vs. Weichteil/Marker), Korrekturen nach Aktionsschwellen ausführen, sich vergewissern, dass die Pre-Treatment-QA durch Physik freigegeben ist, Patientenkommunikation und Dokumentation der täglichen Routine.</div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 10. FALL 2 AUFGABEN
// ─────────────────────────────────────────────
function rFall2Aufgaben() {
  return `
<div class="section-tag">✏️ Teil 2 · Fall 2 · Aufgaben</div>
<div class="section-title">Fall 2 — Aufgaben: Prostata-Ca</div>
<div class="section-lead">Technikwahl, Setup-Management und OAR-Compliance bei der Prostata-Radiotherapie.</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">1</span>Herr M. kommt täglich zur Bestrahlung. Am 12. Fx zeigt das tägliche CBCT eine Verschiebung der Prostata um 8 mm posterior (Rektum deutlich gefüllt). Was tust du?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>8 mm sind im PTV-Sicherheitssaum — sofort bestrahlen</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>Verschiebung klingt normal — Bestrahlung auf ursprünglichem Isozentrum fortführen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">C</span>Bestrahlung pausieren, Patienten Rektum entleeren lassen, CBCT wiederholen — erst dann bestrahlen</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Isozentrum manuell um 8 mm verschieben und bestrahlen</div>
  </div>
  <div class="qfeedback"
    data-ok="Eine 8 mm-Verschiebung durch Rektumfüllung ist eine systematische, korrigierbare Ursache — nicht einfach tolerierbar. Protokollkonform: Rektum entleeren lassen (ggf. Klistier nach Protokoll), anschließend Kontroll-CBCT. Erst bei akzeptabler Lage bestrahlen. Eine unkritische Verschiebung im Sicherheitssaum akzeptieren ist falsch: Der Sicherheitssaum deckt zufällige, nicht systematische korrigierbare Fehler ab. Manuelle Verschiebung ohne Arztfreigabe und neues CBCT ist nicht zulässig."
    data-err="8 mm durch eine vermeidbare Ursache (volles Rektum) ist kein 'normaler' Setup-Fehler. Das Protokoll sieht eine definierte Rektumfüllung vor — wird sie nicht eingehalten, verändert sich die Organposition systematisch. Korrektur: Ursache beheben, erneut messen, dann bestrahlen.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">2</span>Welcher Vorteil der VMAT-Technik gegenüber 4-Felder-Box ist bei Prostatakarzinom dosimetrisch am relevantesten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>VMAT ist einfacher für den MTR durchzuführen</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">B</span>Bessere Anpassung der Hochdosis-Isodose an die komplexe PTV-Form + präzisere OAR-Schonung</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">C</span>Niedrigere Gesamtintegraldosis als beim 4-Felder-Box</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Kein CBCT erforderlich bei VMAT</div>
  </div>
  <div class="qfeedback"
    data-ok="VMAT erlaubt eine inverse Optimierung: Das TPS passt die Dosisverteilung kontinuierlich an die PTV-Form an und kann gleichzeitig Dosisgrenzen für Rektum, Blase und Femurkopf berücksichtigen. Das Ergebnis: Engere Konformitätsindizes und bessere OAR-DVH-Compliance. Nachteil: Die 360°-Arc-Strahlung verteilt niedrige Dosen über einen größeren Körperbereich (höhere Integraldosis). CBCT ist bei VMAT erst recht obligat."
    data-err="Die Integraldosis ist bei VMAT durch den Arc tendenziell höher, nicht niedriger. CBCT ist bei jeder präzisen Technik erforderlich. Der Kernvorteil von VMAT ist die konforme, OAR-schonende Dosisformung bei komplexen Volumina.">
  </div>
</div>

<div class="quiz-block">
  <div class="quiz-q"><span class="qnum">3</span>Vergleich der beiden Fälle: Was unterscheidet das ZV-Konzept bei Mamma-Ca (Frau K.) und Prostata-Ca (Herr M.) strukturell am deutlichsten?</div>
  <div class="quiz-opts">
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">A</span>Beim Mamma-Ca existiert kein PTV</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">B</span>Beim Prostata-Ca wird kein GTV definiert</div>
    <div class="qopt" data-correct="1" onclick="handleQuizClick(this)"><span class="qletter">C</span>Beim Mamma-Ca (postop.) fehlt das GTV (Tumor entfernt), beim Prostata-Ca ist das GTV (Prostata in situ) Grundlage der gesamten CTV-Konstruktion</div>
    <div class="qopt" data-correct="0" onclick="handleQuizClick(this)"><span class="qletter">D</span>Das PTV ist immer gleich groß, unabhängig von der Lokalisation</div>
  </div>
  <div class="qfeedback"
    data-ok="Kerndifferenz: Frau K. hat nach R0-Resektion keinen sichtbaren Resttumor mehr — das GTV ist weggefallen. Das CTV definiert sich über das verbleibende Brustgewebe (adjuvante Strategie). Bei Herrn M. ist die Prostata in situ — das GTV (Prostata ± Tumorherd) ist der Ausgangspunkt für CTV und PTV (definitive Strategie). Diese konzeptionelle Unterschied spiegelt sich direkt in der Zielvolumendefinition und Dosisplanung wider."
    data-err="GTV wird beim Prostata-Ca immer definiert (Prostata ist sichtbar, in situ). Beim postoperativen Mamma-Ca nach BET entfällt das GTV, weil der Tumor entfernt wurde. Das PTV-Volumen variiert stark je nach Lokalisation, Technik und Immobilisation.">
  </div>
</div>

<div class="transfer-block">
  <div class="transfer-q"><span class="qnum">4</span>Reflexion: Was haben die beiden Fälle gemeinsam? Was unterscheidet sie? Formuliere 3–4 Punkte.</div>
  <textarea class="transfer-ta" placeholder="Vergleiche Mamma-Ca (Frau K.) und Prostata-Ca (Herr M.) hinsichtlich: Zielvolumenkonzept, Technikwahl, OAR, Setup-Herausforderungen…"></textarea>
  <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.4rem">➡ Vergleiche mit dieser Checkliste:</div>
  <div class="checklist">
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Beide: PTV aus CTV + Sicherheitssaum — Margen unterscheiden sich (Mamma ~5–10 mm; Prostata 5–8 mm mit IGRT)</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Mamma: adjuvant (GTV weg), Prostata: definitiv (GTV vorhanden in situ)</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Mamma: Herzschonung durch DIBH + Tangentialfeld; Prostata: Rektum-/Blasenprotokoll + tägliches CBCT</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Beide: IGRT erforderlich; Compliance der Patienten ist MTR-Aufgabe</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Technikwahl folgt OAR-Anforderungen: Tangential (Herz) vs. VMAT/4FB (Rektum, Blase)</div>
  </div>
</div>
${navBtns()}`;
}

// ─────────────────────────────────────────────
// 11. ABSCHLUSS
// ─────────────────────────────────────────────
function rAbschluss() {
  markDone('abschluss');
  return `
<div class="section-tag">🏁 Abschluss & Reflexion</div>
<div class="section-title">Modul abgeschlossen</div>
<div class="section-lead">Du hast alle Inhalte dieses Moduls bearbeitet. Jetzt Zeit für eine strukturierte Selbstreflexion.</div>

<div class="callout callout-success">
  <span class="callout-icon">✓</span>
  <div><strong>Gut gemacht!</strong> Du hast Zielvolumenkonzept, Dosisverteilung und Bestrahlungstechniken als Grundlagen erarbeitet und auf zwei klinische Fälle transferiert.</div>
</div>

<div class="card">
  <div class="card-heading">📝 Selbstreflexion: Was habe ich gelernt?</div>
  <div class="checklist">
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kann GTV, CTV, PTV, TV und IV definieren und voneinander abgrenzen</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich verstehe, warum PTV ≠ CTV und was Setup-Margen bedeuten</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kann den Konformitätsindex berechnen und klinisch interpretieren</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kann Lehrorientierungen zur Dosishomogenität einordnen und weiß, dass Hotspots/Coldspots plan- und kontextabhängig bewertet werden</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kann Isodosenkurven grundlegend interpretieren und mit DVH, OAR-Dosen und Planfreigabe zusammendenken</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kenne die wichtigsten Bestrahlungstechniken und ihre typischen Indikationen</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich verstehe die MTR-relevanten Besonderheiten von DIBH, Halbfeld und CBCT-Setup</div>
    <div class="citem" onclick="toggleCheck(this)"><div class="ccheck"></div>Ich kann Technikwahl und ZV-Konzept auf einen klinischen Fall anwenden</div>
  </div>
</div>

<div class="card">
  <div class="card-heading">🎯 Praxistransfer — zwei konkrete Punkte für den nächsten Einsatz</div>
  <p style="font-size:0.86rem;color:var(--text-muted);margin-bottom:0.9rem">Theorie wird erst dann zu Können, wenn sie an einer konkreten Situation andockt. Wähle zwei Punkte aus diesem Modul und mache sie konkret. Schreib sie kurz auf — die Texte werden lokal gespeichert und sind beim nächsten Modulaufruf noch da.</p>

  <div class="praxis-block">
    <div class="praxis-label">1 · Eine MTR-Handlung, die ich beim nächsten Praxiseinsatz <strong>bewusster und genauer</strong> durchführen will</div>
    <textarea id="praxis-handlung" class="transfer-ta" placeholder="Beispiel: Ich werde bei der Mamma-Patientin nicht erst auf das Atemfenster blicken, wenn der Beam läuft, sondern den DIBH-Trainingsteil schon vor der Lagerung am Linac aktiv mit ihr durchgehen — und das im Bestrahlungsprotokoll dokumentieren."></textarea>
  </div>

  <div class="praxis-block" style="margin-top:1rem">
    <div class="praxis-label">2 · Eine Beobachtung oder Frage, die ich mit meinem Praxisanleiter / der Praxisanleiterin <strong>klären</strong> will</div>
    <textarea id="praxis-frage" class="transfer-ta" placeholder="Beispiel: Wie genau ist bei uns am Haus die Aktionsschwelle für Rotation im CBCT-Match bei Prostata definiert? Ab wann wird der Plan überdacht, ab wann nur korrigiert?"></textarea>
  </div>

  <button class="btn btn-primary" style="margin-top:1rem" onclick="savePraxisNotes()">💾 Praxispunkte speichern</button>
  <span id="praxisSaveHint" style="margin-left:0.75rem;font-size:0.8rem;color:var(--text-muted)"></span>
</div>

<div class="card">
  <div class="card-heading">🔗 Weiterführend</div>
  <div class="res-links">
    <a class="rlink" href="https://www.estro.org/Science/E-Learning" target="_blank">🌐 ESTRO E-Learning</a>
    <a class="rlink" href="https://www.iaea.org/resources/rpop/health-professionals/radiotherapy" target="_blank">🌐 IAEA Radiotherapy</a>
    <a class="rlink" href="https://www.quantec.info" target="_blank">🌐 QUANTEC (OAR-Toleranzen)</a>
    <a class="rlink" href="https://www.ncbi.nlm.nih.gov/books/NBK540985/" target="_blank">🌐 ICRU Report 83</a>
    <a class="rlink" href="https://radiopaedia.org/articles/radiotherapy-target-volumes" target="_blank">🌐 Radiopaedia: Target Volumes</a>
  </div>
</div>

<div style="margin-top:1.75rem;padding-top:1.25rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;">
  <button class="btn btn-ghost" onclick="navigate('intro')">↩ Zurück zur Übersicht</button>
  <button class="btn btn-ghost" onclick="resetProgress()" style="color:var(--error);border-color:rgba(239,68,68,0.3)">🔄 Fortschritt zurücksetzen</button>
</div>`;
}

// ─────────────────────────────────────────────
// PRAXIS-NOTES (zwei Praxispunkte am Modulende)
// ─────────────────────────────────────────────
const PRAXIS_KEY = 'mtr_rt_praxis_notes_v1';

function savePraxisNotes() {
  const handlung = document.getElementById('praxis-handlung');
  const frage = document.getElementById('praxis-frage');
  if (!handlung || !frage) return;
  const data = { handlung: handlung.value.trim(), frage: frage.value.trim(), savedAt: new Date().toISOString() };
  try {
    localStorage.setItem(PRAXIS_KEY, JSON.stringify(data));
    const hint = document.getElementById('praxisSaveHint');
    if (hint) {
      const ok = data.handlung.length > 0 && data.frage.length > 0;
      hint.textContent = ok ? '✓ gespeichert' : '✓ gespeichert (Felder noch leer)';
      hint.style.color = ok ? 'var(--success)' : 'var(--warning)';
    }
  } catch(e) {
    const hint = document.getElementById('praxisSaveHint');
    if (hint) { hint.textContent = 'Konnte nicht speichern.'; hint.style.color = 'var(--error)'; }
  }
}

function restorePraxisNotes() {
  try {
    const raw = localStorage.getItem(PRAXIS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    const handlung = document.getElementById('praxis-handlung');
    const frage = document.getElementById('praxis-frage');
    if (handlung && data.handlung) handlung.value = data.handlung;
    if (frage && data.frage) frage.value = data.frage;
    if (data.savedAt) {
      const hint = document.getElementById('praxisSaveHint');
      if (hint) {
        const d = new Date(data.savedAt);
        hint.textContent = `Zuletzt gespeichert: ${d.toLocaleString('de-DE')}`;
        hint.style.color = 'var(--text-muted)';
      }
    }
  } catch(e){}
}

// ─────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────
function resetProgress() {
  if(confirm('Fortschritt und Pfad-Auswahl wirklich zurücksetzen? Praxispunkte bleiben erhalten.')) {
    state = { current: 'intro', done: [], path: null };
    saveState();
    navigate('intro');
  }
}

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
loadState();
renderNav();
renderSection(state.current);