// renderers/quiz.js - Quiz-Modul
//
// Baustelle D: Renderer ist auf Itembank + QuizEngine umgestellt.
// Quelle der Wahrheit: architecture/QUIZ-ENGINE-SPEC.md §6.2 und
// architecture/MODUL-SCHEMA-V2.md §5.4.
//
// Eingangsformate (in Reihenfolge der Praeferenz):
//   1. body.itemRefs:    string[]  - Item-IDs aus der Itembank (Standard)
//   2. body.inlineItems: Item[]    - Engine-konforme Items inline (Fallback,
//                                   Spec §6.2; in v2-Modulen vermeiden, in
//                                   Standalones erlaubt)
//   3. body.questions:   Legacy    - altes Format (label/feedback ohne IDs).
//                                   Wird hier on-the-fly in Engine-Items
//                                   uebersetzt, damit bestehende Module nicht
//                                   brechen. Migrationshinweis als Konsolen-
//                                   Warnung.
//
// body.frames:        { [itemId]: { vor?, nach? } }
// body.engineOptions: { mode?, leitner?, shuffle? }
// body.passThreshold: number       (Default 0.75)
// body.shuffle:       boolean      (Legacy-Feld, ueberschreibt engineOptions.shuffle)
//
// Modul-Fortschritt:
//   - markModuleStarted() beim Render.
//   - markModuleCompleted() synchron im onRunDone-Callback der Engine, damit
//     die Anti-Bug-Regel aus QUIZ-ENGINE-SPEC §4 eingehalten wird.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc } from '../util.js';
import { QuizEngine } from '../quiz-engine.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const body = module.body || {};
  const resolved = resolveItemsSource(body);

  const view = document.createElement('article');
  view.className = 'module-view quiz';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category || '')}</p>
    <h1>${esc(module.title)}</h1>
    <p class="muted">${esc(resolved.lead)}</p>
    <div class="quiz-host" id="quiz-host"></div>
    <div class="feedback-slot"></div>
  `;
  container.appendChild(view);

  const host = view.querySelector('#quiz-host');
  const slot = view.querySelector('.feedback-slot');

  if (!resolved.ok) {
    host.innerHTML = `<p class="quiz-empty">${esc(resolved.error)}</p>`;
    return;
  }

  const engineOptions = body.engineOptions || {};
  // Legacy body.shuffle ueberschreibt engineOptions.shuffle, wenn explizit gesetzt.
  const shuffle = (typeof body.shuffle === 'boolean')
    ? body.shuffle
    : (typeof engineOptions.shuffle === 'boolean' ? engineOptions.shuffle : true);

  const startOptions = {
    moduleId: module.id,
    frames: body.frames || {},
    mode: engineOptions.mode || 'self-first',
    leitner: engineOptions.leitner !== false,
    shuffle,
    container: host,
    onRunDone: (summary) => {
      const rate = summary.gesamt > 0 ? summary.korrekt / summary.gesamt : 0;
      markModuleCompleted(module.id, rate);

      const threshold = (typeof body.passThreshold === 'number') ? body.passThreshold : 0.75;
      const passed = rate >= threshold;
      slot.innerHTML = `
        <div class="feedback ${passed ? 'correct' : 'incorrect'}">
          <h3>${passed ? 'Bestanden' : 'Nicht bestanden'}</h3>
          <p>Ergebnis: ${summary.korrekt} von ${summary.gesamt} richtig (${Math.round(rate * 100)} %). Bestehensgrenze: ${Math.round(threshold * 100)} %.</p>
          <p><a class="btn secondary" href="#/">Zurueck zur Uebersicht</a></p>
        </div>
      `;
    }
  };

  if (resolved.kind === 'itemRefs') {
    startOptions.itemRefs = resolved.itemRefs;
  } else {
    startOptions.inlineItems = resolved.inlineItems;
  }

  try {
    await QuizEngine.start(startOptions);
  } catch (e) {
    host.innerHTML = `<p class="quiz-empty">Quiz konnte nicht gestartet werden: ${esc(e.message)}</p>`;
  }
}

// --------------------------------------------------------------------
// Hilfsfunktionen
// --------------------------------------------------------------------

function resolveItemsSource(body) {
  // 1. itemRefs aus der Itembank (Standardpfad)
  if (Array.isArray(body.itemRefs) && body.itemRefs.length > 0) {
    return {
      ok: true,
      kind: 'itemRefs',
      itemRefs: body.itemRefs.slice(),
      lead: `Quiz mit ${body.itemRefs.length} Item${body.itemRefs.length === 1 ? '' : 's'} aus der Itembank.`
    };
  }

  // 2. inlineItems im Engine-Format (Fallback)
  if (Array.isArray(body.inlineItems) && body.inlineItems.length > 0) {
    return {
      ok: true,
      kind: 'inlineItems',
      inlineItems: body.inlineItems.slice(),
      lead: `Quiz mit ${body.inlineItems.length} Inline-Item${body.inlineItems.length === 1 ? '' : 's'}.`
    };
  }

  // 3. Legacy: body.questions (label/feedback ohne IDs) -> on-the-fly in Engine-Items konvertieren
  if (Array.isArray(body.questions) && body.questions.length > 0) {
    console.warn('[quiz-renderer] Legacy-Format body.questions erkannt. Bitte auf itemRefs (Itembank) migrieren. ARCH §13, MODUL-SCHEMA-V2 §5.4.');
    const inline = body.questions.map((q, qi) => legacyQuestionToItem(q, qi));
    return {
      ok: true,
      kind: 'inlineItems',
      inlineItems: inline,
      lead: `Quiz mit ${inline.length} Frage${inline.length === 1 ? '' : 'n'} (Legacy-Format).`
    };
  }

  return {
    ok: false,
    error: 'Quiz-Modul ohne itemRefs / inlineItems / questions. Bitte Modul-Schema (§5.4) pruefen.',
    lead: 'Keine Items gefunden.'
  };
}

// Konvertiert ein Legacy-Question-Objekt (label/correct/feedback ohne IDs) in ein
// Engine-konformes Item gemaess QUIZ-ENGINE-SPEC §3.1. Unterstuetzt nur single/multi.
function legacyQuestionToItem(q, qi) {
  const opts = Array.isArray(q.options) ? q.options : [];
  const items = opts.map((opt, oi) => ({
    id: `o-${oi}`,
    text: opt.label || '',
    korrekt: !!opt.correct,
    rationale: opt.feedback || ''
  }));
  const correctIds = items.filter(o => o.korrekt).map(o => o.id);
  const type = correctIds.length > 1 ? 'multi' : 'single';
  return {
    id: `legacy-${qi + 1}`,
    type,
    stem: q.text || '',
    options: items,
    correct: correctIds,
    rationale_global: q.rationale || '',
    lehrjahr: q.lehrjahr || [],
    schwierigkeit: q.schwierigkeit || 'basic',
    tags: q.tags || [],
    kontext_neutral: false
  };
}
