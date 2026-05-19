// js/quiz-engine.js
// Quiz-Engine v1 fuer die MTR-RT Lernapp Strahlentherapie.
//
// Scope dieser v1 (siehe architecture/QUIZ-ENGINE-SPEC.md):
//   - Item-Typen:   single, multi
//   - Modus:        self-first (Default), instant (Stub fuer Pruefungs-Sim)
//   - Wiederholung: Leitner-light mit 3 Boxen
//   - Persistenz:   localStorage-Key  mtr_rt_quiz_progress
//   - onRunDone:    wird SYNCHRON aufgerufen, NACH dem Persistieren,
//                   VOR dem Render der Run-Summary.
//
// Bewusst NICHT in dieser v1:
//   - cloze / numeric / order (kommt mit Itembank-Auspraegung in Baustelle C)
//   - Bild-Items, Hint-System, adaptive Schwierigkeit, Service Worker.
//
// Stil: vanilla ES6+. Keine externen Abhaengigkeiten. Klassenbasierte CSS-Hooks
// gemaess Spec Abschnitt 7 (siehe app.css).

// --------------------------------------------------------------------
// Modul-State (Engine-weit, NICHT pro Run)
// --------------------------------------------------------------------

const DEFAULT_STORAGE_PREFIX = 'mtr_rt_';
const STORAGE_SUFFIX = 'quiz_progress';
const PROGRESS_VERSION = 1;

const _config = {
  itembankBasePath: 'content/itembank/',
  storagePrefix: DEFAULT_STORAGE_PREFIX,
  storageKey: DEFAULT_STORAGE_PREFIX + STORAGE_SUFFIX
};

let _indexLoaded = false;
let _indexData = { version: 1, items: [] };       // { items: [{id, file, tags?, ...}] }
const _fileCache = new Map();                     // dateiname -> {items:[...]}
const _itemCache = new Map();                     // itemId -> Item

// --------------------------------------------------------------------
// Persistenz-Helpers
// --------------------------------------------------------------------

function _emptyProgress() {
  return { version: PROGRESS_VERSION, items: {}, modulRuns: {} };
}

function _loadProgress() {
  let raw = null;
  try { raw = localStorage.getItem(_config.storageKey); } catch (_) { /* SSR/Inkognito */ }
  if (!raw) return _emptyProgress();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return _emptyProgress();
    if (!parsed.items) parsed.items = {};
    if (!parsed.modulRuns) parsed.modulRuns = {};
    if (!parsed.version) parsed.version = PROGRESS_VERSION;
    return parsed;
  } catch (_) {
    return _emptyProgress();
  }
}

function _saveProgress(progress) {
  try {
    localStorage.setItem(_config.storageKey, JSON.stringify(progress));
  } catch (_) {
    // Quota oder Inkognito: bewusst still scheitern, damit der Run nicht abbricht.
  }
}

// --------------------------------------------------------------------
// Itembank-Helpers
// --------------------------------------------------------------------

async function _ensureIndex() {
  if (_indexLoaded) return _indexData;
  try {
    const res = await fetch(_config.itembankBasePath + 'index.json', { cache: 'no-cache' });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items)) {
        _indexData = data;
      }
    }
  } catch (_) {
    // Itembank-Index optional: Inline-Items funktionieren ohne.
  }
  _indexLoaded = true;
  return _indexData;
}

async function _loadFile(fileName) {
  if (_fileCache.has(fileName)) return _fileCache.get(fileName);
  const res = await fetch(_config.itembankBasePath + fileName, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Itembank-Datei nicht ladbar: ' + fileName);
  const data = await res.json();
  _fileCache.set(fileName, data);
  if (Array.isArray(data.items)) {
    for (const it of data.items) _itemCache.set(it.id, it);
  }
  return data;
}

async function _resolveItem(itemId) {
  if (_itemCache.has(itemId)) return _itemCache.get(itemId);
  await _ensureIndex();
  const entry = (_indexData.items || []).find(e => e.id === itemId);
  if (!entry || !entry.file) {
    throw new Error('Item nicht im Itembank-Index: ' + itemId);
  }
  await _loadFile(entry.file);
  const item = _itemCache.get(itemId);
  if (!item) throw new Error('Item im Index, aber nicht in Datei: ' + itemId);
  return item;
}

// --------------------------------------------------------------------
// Run-interne Helpers (rein funktional)
// --------------------------------------------------------------------

function _shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _itemBox(progress, itemId) {
  const p = progress.items[itemId];
  return p && p.box ? p.box : 1;
}

// Leitner-Sortierung: Box 1 zuerst, dann 2, dann 3. Innerhalb der Box optional gemischt.
function _sortByLeitner(items, progress, shuffle) {
  const enriched = items.map((it, idx) => ({ it, idx, box: _itemBox(progress, it.id) }));
  const grouped = { 1: [], 2: [], 3: [] };
  for (const e of enriched) grouped[e.box].push(e);
  const order = [];
  for (const box of [1, 2, 3]) {
    const group = shuffle ? _shuffle(grouped[box]) : grouped[box].sort((a, b) => a.idx - b.idx);
    for (const e of group) order.push(e.it);
  }
  return order;
}

function _updateItemProgress(itemId, korrekt) {
  const progress = _loadProgress();
  const prev = progress.items[itemId] || {
    box: 1,
    lastCorrect: null,
    lastSeen: null,
    attempts: 0,
    correctCount: 0,
    streakKorrekt: 0
  };
  const next = { ...prev };
  next.attempts = (prev.attempts || 0) + 1;
  next.lastSeen = new Date().toISOString();
  next.lastCorrect = korrekt;
  if (korrekt) {
    next.correctCount = (prev.correctCount || 0) + 1;
    next.streakKorrekt = (prev.streakKorrekt || 0) + 1;
    next.box = Math.min(3, (prev.box || 1) + 1);
  } else {
    next.streakKorrekt = 0;
    next.box = 1;
  }
  progress.items[itemId] = next;
  _saveProgress(progress);
  return next;
}

function _appendModulRun(moduleId, runSummary) {
  if (!moduleId) return;
  const progress = _loadProgress();
  if (!progress.modulRuns[moduleId]) progress.modulRuns[moduleId] = [];
  progress.modulRuns[moduleId].push({
    ts: new Date().toISOString(),
    korrekt: runSummary.korrekt,
    gesamt: runSummary.gesamt
  });
  _saveProgress(progress);
}

function _isCorrect(item, selectedIds) {
  const correct = new Set(item.correct || []);
  if (item.type === 'single') {
    return selectedIds.size === 1 && correct.has([...selectedIds][0]);
  }
  if (item.type === 'multi') {
    if (selectedIds.size !== correct.size) return false;
    for (const id of selectedIds) if (!correct.has(id)) return false;
    return true;
  }
  // Andere Typen in dieser v1 explizit nicht unterstuetzt.
  return false;
}

// --------------------------------------------------------------------
// Rendering (DOM, kein Inline-Style)
// --------------------------------------------------------------------

function _el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text != null) e.textContent = text;
  return e;
}

function _renderItem(run) {
  const item = run.items[run.current];
  const frame = run.frames[item.id] || {};
  const container = run.container;
  const selected = new Set();

  const wrap = _el('div', 'quiz');
  wrap.setAttribute('data-item-id', item.id);
  wrap.setAttribute('data-item-type', item.type || '');

  // Fortschritt + Leitner-Badge
  const progressBar = _el('div', 'quiz-progress');
  progressBar.textContent = 'Frage ' + (run.current + 1) + ' von ' + run.items.length;
  const persisted = _loadProgress();
  const persistedItem = persisted.items[item.id];
  const badge = _el('span', 'quiz-leitner-badge');
  badge.textContent = persistedItem ? ('Box ' + persistedItem.box) : 'Neu';
  progressBar.appendChild(badge);
  wrap.appendChild(progressBar);

  // Frame vor
  if (frame.vor) {
    wrap.appendChild(_el('div', 'quiz-frame-vor', frame.vor));
  }

  // Stem
  wrap.appendChild(_el('p', 'quiz-stem', item.stem || ''));

  // Hinweis fuer Multi
  if (item.type === 'multi') {
    const hint = _el('p', 'quiz-hint', 'Mehrfachauswahl moeglich. Pruefen, wenn fertig.');
    wrap.appendChild(hint);
  }

  // Options
  const list = _el('ul', 'quiz-options');
  for (const opt of (item.options || [])) {
    const li = document.createElement('li');
    const btn = _el('button', 'quiz-option', opt.text);
    btn.type = 'button';
    btn.setAttribute('data-option-id', opt.id);
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', () => {
      if (btn.disabled) return;
      if (item.type === 'single') {
        wrap.querySelectorAll('.quiz-option.is-selected').forEach(b => {
          b.classList.remove('is-selected');
          b.setAttribute('aria-pressed', 'false');
        });
        selected.clear();
        selected.add(opt.id);
        btn.classList.add('is-selected');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        if (selected.has(opt.id)) {
          selected.delete(opt.id);
          btn.classList.remove('is-selected');
          btn.setAttribute('aria-pressed', 'false');
        } else {
          selected.add(opt.id);
          btn.classList.add('is-selected');
          btn.setAttribute('aria-pressed', 'true');
        }
      }
      submitBtn.disabled = selected.size === 0;
    });
    li.appendChild(btn);
    list.appendChild(li);
  }
  wrap.appendChild(list);

  // Submit
  const btnRow = _el('div', 'quiz-btn-row');
  const submitBtn = _el('button', 'btn quiz-submit', 'Antwort pruefen');
  submitBtn.type = 'button';
  submitBtn.disabled = true;
  submitBtn.addEventListener('click', () => {
    if (selected.size === 0) return;
    _evaluate(run, item, selected, wrap, btnRow, submitBtn);
  });
  btnRow.appendChild(submitBtn);
  wrap.appendChild(btnRow);

  container.innerHTML = '';
  container.appendChild(wrap);
}

function _evaluate(run, item, selectedIds, wrap, btnRow, submitBtn) {
  const korrekt = _isCorrect(item, selectedIds);
  const correctSet = new Set(item.correct || []);

  // Optionen markieren und sperren
  wrap.querySelectorAll('.quiz-option').forEach(btn => {
    btn.disabled = true;
    const oid = btn.getAttribute('data-option-id');
    const isCorrectOpt = correctSet.has(oid);
    const wasSelected = selectedIds.has(oid);
    if (isCorrectOpt) btn.classList.add('is-correct');
    if (wasSelected && !isCorrectOpt) btn.classList.add('is-wrong');
  });

  // Rationale pro relevanter Option (gewaehlt ODER richtig)
  const rationaleWrap = _el('div', 'quiz-rationale');
  const rationaleHead = _el('h3', 'quiz-rationale-head', korrekt ? 'Richtig.' : 'Nicht korrekt.');
  rationaleWrap.appendChild(rationaleHead);
  for (const opt of (item.options || [])) {
    if (!opt.rationale) continue;
    if (!selectedIds.has(opt.id) && !correctSet.has(opt.id)) continue;
    const p = document.createElement('p');
    const tag = _el('strong', 'quiz-rationale-label',
      opt.text + (correctSet.has(opt.id) ? ' (richtig): ' : ' (gewaehlt): '));
    p.appendChild(tag);
    p.appendChild(document.createTextNode(opt.rationale));
    rationaleWrap.appendChild(p);
  }
  wrap.appendChild(rationaleWrap);

  // Globale Rationale
  if (item.rationale_global) {
    wrap.appendChild(_el('div', 'quiz-rationale-global', item.rationale_global));
  }

  // Frame nach
  const frame = run.frames[item.id] || {};
  if (frame.nach) {
    wrap.appendChild(_el('div', 'quiz-frame-nach', frame.nach));
  }

  // Persistenz: Item-Box updaten
  _updateItemProgress(item.id, korrekt);

  // Run-Stats
  run.perItemResults[item.id] = { korrekt };
  if (korrekt) run.ergebnis.korrekt++;
  else run.ergebnis.falsch++;

  // onItemDone synchron
  try { run.onItemDone(item.id, korrekt); } catch (e) { /* Callback-Fehler nicht eskalieren */ }

  // Submit gegen Weiter-Button tauschen
  submitBtn.remove();
  const isLast = run.current >= run.items.length - 1;
  const nextBtn = _el('button', 'btn quiz-next', isLast ? 'Run abschliessen' : 'Weiter');
  nextBtn.type = 'button';
  nextBtn.addEventListener('click', () => {
    run.current++;
    if (run.current >= run.items.length) {
      _finishRun(run);
    } else {
      _renderItem(run);
    }
  });
  btnRow.appendChild(nextBtn);
  nextBtn.focus();
}

function _finishRun(run) {
  const dauerSek = Math.max(0, Math.round((Date.now() - run.startedAt) / 1000));

  // Boxen-Verteilung NACH Persistenz aller Item-Updates lesen
  const persisted = _loadProgress();
  const boxen = { 1: 0, 2: 0, 3: 0 };
  for (const it of run.items) {
    const box = _itemBox(persisted, it.id);
    boxen[box] = (boxen[box] || 0) + 1;
  }

  const summary = {
    runId: run.runId,
    moduleId: run.moduleId,
    korrekt: run.ergebnis.korrekt,
    falsch: run.ergebnis.falsch,
    gesamt: run.ergebnis.gesamt,
    dauerSek,
    boxen,
    perItem: { ...run.perItemResults }
  };

  // Modul-Run persistieren (vor Callback, damit Aufrufer frisch lesen kann)
  _appendModulRun(run.moduleId, summary);

  // Synchroner Callback VOR dem Render der Summary.
  // Anti-Bug-Regel: localStorage ist zu diesem Zeitpunkt aktuell.
  try { run.onRunDone(summary); } catch (e) { /* Callback-Fehler nicht eskalieren */ }

  _renderSummary(run, summary);
}

function _renderSummary(run, summary) {
  const wrap = _el('div', 'quiz quiz-summary');
  wrap.appendChild(_el('h3', 'quiz-summary-head', 'Run abgeschlossen'));

  const score = _el('p', 'quiz-summary-score');
  score.textContent = summary.korrekt + ' von ' + summary.gesamt + ' korrekt.';
  wrap.appendChild(score);

  const meta = _el('p', 'quiz-summary-meta');
  meta.textContent = 'Dauer: ' + summary.dauerSek + ' s';
  wrap.appendChild(meta);

  const ul = _el('ul', 'quiz-summary-boxen');
  for (const b of [1, 2, 3]) {
    const li = document.createElement('li');
    li.textContent = 'Box ' + b + ': ' + summary.boxen[b] + ' Item' + (summary.boxen[b] === 1 ? '' : 's');
    ul.appendChild(li);
  }
  wrap.appendChild(ul);

  run.container.innerHTML = '';
  run.container.appendChild(wrap);
}

// --------------------------------------------------------------------
// Oeffentliche API
// --------------------------------------------------------------------

/**
 * Engine initialisieren. Optional; start() funktioniert auch ohne init(),
 * solange entweder inlineItems uebergeben werden ODER die Defaults passen.
 */
export async function init(config = {}) {
  if (config.itembankBasePath) _config.itembankBasePath = config.itembankBasePath;
  if (config.storagePrefix) {
    _config.storagePrefix = config.storagePrefix;
    _config.storageKey = config.storagePrefix + STORAGE_SUFFIX;
  }
  if (config.storageKey) _config.storageKey = config.storageKey;
  await _ensureIndex();
  return { ..._config };
}

/**
 * Einen Quiz-Run starten.
 *
 * options:
 *   itemRefs:    string[]  - Item-IDs aus der Itembank
 *   inlineItems: Item[]    - alternativ direkt mitgegebene Item-Objekte
 *   moduleId:    string    - fuer Persistenz unter modulRuns
 *   frames:      { [itemId]: { vor?, nach? } }
 *   mode:        'self-first' (Default) | 'instant' (in v1 wie self-first behandelt)
 *   leitner:     boolean   - Default true, sortiert Box 1 vor Box 2 vor Box 3
 *   shuffle:     boolean   - Default true, mischt innerhalb der Boxen
 *   container:   HTMLElement (Pflicht)
 *   onItemDone:  (itemId, korrekt) => void
 *   onRunDone:   (summary) => void  (SYNCHRON, NACH Persistenz, VOR Summary-Render)
 */
export async function start(options = {}) {
  const {
    itemRefs = null,
    inlineItems = null,
    moduleId = null,
    frames = {},
    mode = 'self-first',
    leitner = true,
    shuffle = true,
    container,
    onItemDone = () => {},
    onRunDone = () => {}
  } = options;

  if (!(container instanceof HTMLElement)) {
    throw new Error('QuizEngine.start: container muss ein HTMLElement sein.');
  }

  // Items aufloesen
  let items = [];
  if (Array.isArray(inlineItems) && inlineItems.length) {
    items = inlineItems.slice();
  } else if (Array.isArray(itemRefs) && itemRefs.length) {
    await _ensureIndex();
    for (const id of itemRefs) {
      const it = await _resolveItem(id);
      if (it) items.push(it);
    }
  } else {
    throw new Error('QuizEngine.start: itemRefs oder inlineItems erforderlich.');
  }

  // Nur in v1 unterstuetzte Typen filtern
  const supported = items.filter(it => it.type === 'single' || it.type === 'multi');
  if (supported.length !== items.length) {
    // Stiller Filter: nicht unterstuetzte Typen werden in v1 uebersprungen.
    // (cloze/numeric/order kommen mit Baustelle C.)
    items = supported;
  }

  if (items.length === 0) {
    container.innerHTML = '';
    container.appendChild(_el('p', 'quiz-empty', 'Keine fuer diesen Run geeigneten Items gefunden.'));
    return;
  }

  // Reihenfolge bestimmen
  const persisted = _loadProgress();
  let ordered = leitner
    ? _sortByLeitner(items, persisted, shuffle)
    : (shuffle ? _shuffle(items) : items.slice());

  // Mode 'instant' wird in v1 behandelt wie 'self-first'. Markierung im DOM via data-Attribut.
  container.setAttribute('data-quiz-mode', mode === 'instant' ? 'instant' : 'self-first');

  const run = {
    runId: 'run-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
    items: ordered,
    current: 0,
    ergebnis: { korrekt: 0, falsch: 0, gesamt: ordered.length },
    perItemResults: {},
    startedAt: Date.now(),
    mode,
    leitner,
    frames,
    moduleId,
    container,
    onItemDone,
    onRunDone
  };

  _renderItem(run);
  return run.runId;
}

/** Item-Objekt holen (aus Cache, Itembank-Datei oder Index nachladen). */
export async function getItem(itemId) {
  return _resolveItem(itemId);
}

/** Persistierten Fortschritt eines Items lesen oder null. */
export function getProgress(itemId) {
  const p = _loadProgress();
  return p.items[itemId] || null;
}

/** Fortschritt zuruecksetzen. Ohne Argument: alles. Mit itemId: nur dieses Item. */
export function resetProgress({ itemId } = {}) {
  const p = _loadProgress();
  if (itemId) {
    delete p.items[itemId];
  } else {
    p.items = {};
    p.modulRuns = {};
  }
  _saveProgress(p);
}

/** Gesamten Fortschritt als JSON-String exportieren (fuer Export/Import). */
export function exportProgress() {
  return JSON.stringify(_loadProgress(), null, 2);
}

/** Fortschritt aus JSON-String importieren. Wirft bei ungueltigem JSON. */
export function importProgress(jsonString) {
  const data = JSON.parse(jsonString);
  if (!data || typeof data !== 'object') throw new Error('Ungueltiges Fortschritts-JSON.');
  if (!data.items) data.items = {};
  if (!data.modulRuns) data.modulRuns = {};
  if (!data.version) data.version = PROGRESS_VERSION;
  _saveProgress(data);
}

/** Item-IDs zurueckgeben, die mindestens einen der gesuchten Tags tragen. */
export function findByTags(tagsArray) {
  if (!_indexLoaded || !Array.isArray(_indexData.items)) return [];
  const set = new Set(tagsArray || []);
  return _indexData.items
    .filter(e => (e.tags || []).some(t => set.has(t)))
    .map(e => e.id);
}

/**
 * Minimaler Redundanz-Report fuer die Itembank:
 * listet Item-Paare mit >=3 ueberlappenden Tags.
 * Voller Report inkl. Modul-Ueberlappung kommt in tools/redundanz-check.js.
 */
export function redundanzReport() {
  const items = (_indexData.items || []);
  const overlapping = [];
  for (let i = 0; i < items.length; i++) {
    const a = new Set(items[i].tags || []);
    if (a.size === 0) continue;
    for (let j = i + 1; j < items.length; j++) {
      const b = items[j].tags || [];
      const intersection = b.filter(t => a.has(t));
      if (intersection.length >= 3) {
        overlapping.push({ a: items[i].id, b: items[j].id, tags: intersection });
      }
    }
  }
  return { overlapping };
}

// Namespace-Export, damit Aufrufer wahlweise
//   import QuizEngine from './quiz-engine.js'    -> QuizEngine.start(...)
// oder
//   import { start } from './quiz-engine.js'     -> start(...)
// nutzen koennen.
export const QuizEngine = {
  init,
  start,
  getItem,
  getProgress,
  resetProgress,
  exportProgress,
  importProgress,
  findByTags,
  redundanzReport
};

export default QuizEngine;
