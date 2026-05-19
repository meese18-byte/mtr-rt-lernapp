// renderers/case.js - Fall-Entscheidung
//
// Klinische Situation mit Medien und begruendetem Feedback pro Option.
// Baustelle D: optionaler followUpQuiz-Block am Ende des Fall-Flows.
// Quelle: architecture/MODUL-SCHEMA-V2.md §5.2, QUIZ-ENGINE-SPEC §6.2.
//
// Verhalten:
//   - Ohne followUpQuiz:  markModuleCompleted direkt nach Antwortklick (Legacy).
//   - Mit followUpQuiz:   markModuleStarted bleibt, markModuleCompleted erst,
//                         wenn der Quiz-Run die Engine-Summary geliefert hat.
//                         correctRate = Mittel aus Fall (1/0) und Quiz-Rate.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMedia } from '../util.js';
import { QuizEngine } from '../quiz-engine.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view case';
  const s = (module.body && module.body.scenario) || {};
  const followUpQuiz = module.body && module.body.followUpQuiz;
  const hasFollowUp = !!followUpQuiz && (
    (Array.isArray(followUpQuiz.itemRefs) && followUpQuiz.itemRefs.length > 0) ||
    (Array.isArray(followUpQuiz.inlineItems) && followUpQuiz.inlineItems.length > 0)
  );

  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category || '')}</p>
    <h1>${esc(module.title)}</h1>
    <h2>Situation</h2>
    <p>${esc(s.situation || '')}</p>
    <div class="media-block"></div>
    <h2>${esc(s.question || 'Wie gehen Sie vor?')}</h2>
    <ul class="options"></ul>
    <div class="feedback-slot"></div>
    <div class="case-followup" hidden></div>
  `;
  container.appendChild(view);

  // Medien einfuegen
  const mediaBlock = view.querySelector('.media-block');
  (s.media || []).forEach(m => {
    const el = renderMedia(m);
    if (el) mediaBlock.appendChild(el);
  });

  // Antwortoptionen
  const ul = view.querySelector('.options');
  const options = (module.body && module.body.options) || [];
  let answered = false;

  options.forEach(opt => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
      btn.classList.add(opt.correct ? 'correct' : 'incorrect');

      const slot = view.querySelector('.feedback-slot');
      const fb = document.createElement('div');
      fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
      fb.innerHTML = `<h3>${opt.correct ? 'Richtige Entscheidung' : 'Nicht empfohlen'}</h3>
        <p>${esc(opt.feedback)}</p>`;
      slot.appendChild(fb);

      if (module.body.reinforcement) {
        const rein = document.createElement('div');
        rein.className = 'feedback';
        rein.innerHTML = `<p><strong>Merke:</strong> ${esc(module.body.reinforcement)}</p>`;
        slot.appendChild(rein);
      }

      if (hasFollowUp) {
        // Modul wird NICHT direkt completed - erst nach Quiz-Run.
        startFollowUpQuiz(view, module, followUpQuiz, !!opt.correct);
      } else {
        // Legacy-Verhalten: direkt completed mit Fall-correctRate.
        const nav = document.createElement('div');
        nav.className = 'btn-row';
        nav.innerHTML = `<a class="btn secondary" href="#/">Zurueck zur Uebersicht</a>`;
        slot.appendChild(nav);
        markModuleCompleted(module.id, opt.correct ? 1 : 0);
      }
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

// --------------------------------------------------------------------
// Follow-Up-Quiz: Engine direkt einbetten
// --------------------------------------------------------------------

async function startFollowUpQuiz(view, module, followUpQuiz, caseCorrect) {
  const host = view.querySelector('.case-followup');
  host.hidden = false;

  // Ueberschrift + Engine-Host
  host.innerHTML = `
    <h2>Vertiefung zum Fall</h2>
    <p class="muted">${esc(followUpQuiz.lead || 'Drei Items zur Sicherung des klinischen Transfers.')}</p>
    <div class="quiz-host" id="case-quiz-host"></div>
    <div class="feedback-slot case-followup-slot"></div>
  `;
  const quizHost = host.querySelector('#case-quiz-host');
  const slot = host.querySelector('.case-followup-slot');

  const engineOptions = followUpQuiz.engineOptions || {};
  const passThreshold = (typeof followUpQuiz.passThreshold === 'number') ? followUpQuiz.passThreshold : 0.66;

  const startOptions = {
    moduleId: module.id,
    frames: followUpQuiz.frames || {},
    mode: engineOptions.mode || 'self-first',
    leitner: engineOptions.leitner !== false,
    shuffle: engineOptions.shuffle === true,   // Default false: didaktisch geordnet
    container: quizHost,
    onRunDone: (summary) => {
      // Synchron VOR Summary-Render (siehe QUIZ-ENGINE-SPEC §4 Anti-Bug-Regel).
      const quizRate = summary.gesamt > 0 ? summary.korrekt / summary.gesamt : 0;
      const combined = ((caseCorrect ? 1 : 0) + quizRate) / 2;
      markModuleCompleted(module.id, combined);

      const passed = quizRate >= passThreshold;
      slot.innerHTML = `
        <div class="feedback ${passed ? 'correct' : 'incorrect'}">
          <h3>${passed ? 'Vertiefung bestanden' : 'Vertiefung noch nicht bestanden'}</h3>
          <p>Quiz-Ergebnis: ${summary.korrekt} von ${summary.gesamt} richtig (${Math.round(quizRate * 100)} %).</p>
          <p>Fall-Entscheidung: ${caseCorrect ? 'richtig' : 'nicht richtig'}. Modulwertung: ${Math.round(combined * 100)} %.</p>
          <p><a class="btn secondary" href="#/">Zurueck zur Uebersicht</a></p>
        </div>
      `;
    }
  };

  if (Array.isArray(followUpQuiz.itemRefs) && followUpQuiz.itemRefs.length > 0) {
    startOptions.itemRefs = followUpQuiz.itemRefs.slice();
  } else if (Array.isArray(followUpQuiz.inlineItems) && followUpQuiz.inlineItems.length > 0) {
    startOptions.inlineItems = followUpQuiz.inlineItems.slice();
  }

  try {
    await QuizEngine.start(startOptions);
  } catch (e) {
    quizHost.innerHTML = `<p class="quiz-empty">Follow-Up-Quiz konnte nicht gestartet werden: ${esc(e.message)}</p>`;
    // Fallback-Wertung: nur Fall, damit das Modul nicht "haengt".
    markModuleCompleted(module.id, caseCorrect ? 0.5 : 0);
  }

  // Quiz-Host scrollen, damit der Lernende den neuen Block sieht.
  host.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
