// renderers/knowledge.js - Wissenskarte
// Zeigt einen Infotext + 2-3 Verständnisfragen mit begründetem Feedback.

import { loadInfotext } from '../registry.js';
import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMarkdownSimple , moduleContextLabel } from '../util.js';
import { mountExitSlip } from '../exit-slip.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(moduleContextLabel(module))}</p>
    <h1>${esc(module.title)}</h1>
    <p class="muted">${esc(module.body.intro || '')}</p>
    <div id="kn-prechecks"></div>
    <div id="kn-infotext"><p class="loading">Infotext wird geladen…</p></div>
    <h2>Transferfragen</h2>
    <div id="kn-checks"></div>
  `;
  container.appendChild(view);

  const pre = view.querySelector('#kn-prechecks');
  const preQuestions = module.body.preQuestions || [];
  const attemptFirst = module.body.mode === 'attempt-first' && preQuestions.length > 0;

  if (attemptFirst) {
    const head = document.createElement('div');
    head.className = 'feedback';
    head.innerHTML = '<p><strong>Erst selbst denken.</strong> Beantworte die kurzen Fragen. Danach wird die Erklärung eingeblendet.</p>';
    pre.appendChild(head);
  } else {
    pre.remove();
  }

  // Infotext laden
  if (module.body.infotext) {
    try {
      const md = await loadInfotext(module.body.infotext);
      view.querySelector('#kn-infotext').innerHTML = renderMarkdownSimple(md);
      if (attemptFirst) view.querySelector('#kn-infotext').hidden = true;
    } catch (e) {
      view.querySelector('#kn-infotext').innerHTML = '<p class="muted">Infotext nicht verfügbar.</p>';
    }
  } else {
    view.querySelector('#kn-infotext').remove();
  }

  if (attemptFirst) {
    let preAnswered = 0;
    preQuestions.forEach(q => {
      const wrap = document.createElement('section');
      wrap.innerHTML = `<p><strong>${esc(q.question)}</strong></p><ul class="options"></ul><div class="feedback-slot"></div>`;
      const ul = wrap.querySelector('.options');
      q.options.forEach(opt => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          if (wrap.dataset.answered) return;
          wrap.dataset.answered = '1';
          ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
          btn.classList.add(opt.correct ? 'correct' : 'incorrect');
          const fb = document.createElement('div');
          fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
          fb.innerHTML = `<p>${esc(opt.feedback || (opt.correct ? 'Richtig.' : 'Nicht ganz.'))}</p>`;
          wrap.querySelector('.feedback-slot').appendChild(fb);
          preAnswered++;
          if (preAnswered === preQuestions.length) {
            const info = view.querySelector('#kn-infotext');
            if (info) info.hidden = false;
          }
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
      pre.appendChild(wrap);
    });
  }

  // Transferfragen
  const checks = view.querySelector('#kn-checks');
  const questions = module.body.checkQuestions || [];
  let correctCount = 0;
  const total = questions.length;

  questions.forEach((q, qi) => {
    const wrap = document.createElement('section');
    wrap.innerHTML = `
      <p><strong>${esc(q.question)}</strong></p>
      <ul class="options" data-question="${qi}"></ul>
      <div class="feedback-slot"></div>
    `;
    const ul = wrap.querySelector('.options');
    q.options.forEach((opt, oi) => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        // Alle Buttons dieser Frage deaktivieren
        ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        btn.classList.add(opt.correct ? 'correct' : 'incorrect');
        // Feedback einblenden
        const slot = wrap.querySelector('.feedback-slot');
        const fb = document.createElement('div');
        fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
        fb.innerHTML = `<p>${esc(opt.feedback)}</p>`;
        slot.appendChild(fb);
        if (opt.correct) correctCount++;
        if (countAnswered() === total) finish();
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    checks.appendChild(wrap);
  });

  // Exit-Slip-Footer (Baustelle E)
  mountExitSlip(view, module);

  function countAnswered() {
    return checks.querySelectorAll('.feedback').length;
  }

  function finish() {
    const rate = total > 0 ? correctCount / total : 1;
    markModuleCompleted(module.id, rate);
    const done = document.createElement('div');
    done.className = 'feedback';
    done.innerHTML = `<p><strong>Modul abgeschlossen.</strong> ${correctCount} von ${total} Verständnisfragen korrekt.</p>
      <p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p>`;
    checks.appendChild(done);
    const infoWrap = view.querySelector('#kn-info-wrap');
    if (questionFirst && infoWrap) {
      infoWrap.classList.remove('hidden');
      const note = document.createElement('div');
      note.className = 'feedback';
      note.innerHTML = '<p><strong>Jetzt vergleichen:</strong> Lies die Kurzinfo und prüfe, was du schon richtig begründet hast.</p>';
      infoWrap.prepend(note);
    }
  }
}
