// renderers/quiz.js - Prüfungs-Quiz
// Fragenliste mit begründetem Feedback pro Antwort.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, shuffleArray } from '../util.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const body = module.body || {};
  const view = document.createElement('article');
  view.className = 'module-view quiz';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category)}</p>
    <h1>${esc(module.title)}</h1>
    <p class="muted">Quiz mit ${(body.questions || []).length} Fragen.</p>
    <div id="questions"></div>
    <div class="feedback-slot"></div>
  `;
  container.appendChild(view);

  const qContainer = view.querySelector('#questions');
  let questions = [...(body.questions || [])];
  if (body.shuffle) questions = shuffleArray(questions);

  let correctCount = 0;
  const total = questions.length;

  questions.forEach((q, qi) => {
    const section = document.createElement('section');
    section.innerHTML = `
      <p><strong>Frage ${qi + 1}.</strong> ${esc(q.text)}</p>
      <ul class="options"></ul>
      <div class="q-feedback"></div>
    `;
    const ul = section.querySelector('.options');
    q.options.forEach(opt => {
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt.label;
      btn.addEventListener('click', () => {
        ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
        btn.classList.add(opt.correct ? 'correct' : 'incorrect');
        const qfb = section.querySelector('.q-feedback');
        qfb.innerHTML = `<div class="feedback ${opt.correct ? 'correct' : 'incorrect'}"><p>${esc(opt.feedback)}</p></div>`;
        if (opt.correct) correctCount++;
        if (answeredCount() === total) finish();
      });
      li.appendChild(btn);
      ul.appendChild(li);
    });
    qContainer.appendChild(section);
  });

  function answeredCount() {
    return qContainer.querySelectorAll('.feedback').length;
  }

  function finish() {
    const rate = total > 0 ? correctCount / total : 0;
    markModuleCompleted(module.id, rate);
    const threshold = body.passThreshold || 0.75;
    const passed = rate >= threshold;
    const slot = view.querySelector('.feedback-slot');
    slot.innerHTML = `<div class="feedback ${passed ? 'correct' : 'incorrect'}">
      <h3>${passed ? 'Bestanden' : 'Nicht bestanden'}</h3>
      <p>Ergebnis: ${correctCount} von ${total} richtig (${Math.round(rate * 100)}%). Bestehensgrenze: ${Math.round(threshold * 100)}%.</p>
      <p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p>
    </div>`;
  }
}
