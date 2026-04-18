// renderers/knowledge.js - Wissenskarte
// Zeigt einen Infotext + 2-3 Verständnisfragen mit begründetem Feedback.

import { loadInfotext } from '../registry.js';
import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMarkdownSimple } from '../util.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category)}</p>
    <h1>${esc(module.title)}</h1>
    <p class="muted">${esc(module.body.intro || '')}</p>
    <div id="kn-infotext"><p class="loading">Infotext wird geladen…</p></div>
    <h2>Verständnisfragen</h2>
    <div id="kn-checks"></div>
  `;
  container.appendChild(view);

  // Infotext laden
  if (module.body.infotext) {
    try {
      const md = await loadInfotext(module.body.infotext);
      view.querySelector('#kn-infotext').innerHTML = renderMarkdownSimple(md);
    } catch (e) {
      view.querySelector('#kn-infotext').innerHTML = '<p class="muted">Infotext nicht verfügbar.</p>';
    }
  } else {
    view.querySelector('#kn-infotext').remove();
  }

  // Verständnisfragen
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
  }
}
