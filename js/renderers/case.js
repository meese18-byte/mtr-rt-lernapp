// renderers/case.js - Fall-Entscheidung
// Klinische Situation mit Medien und begründetem Feedback pro Option.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMedia } from '../util.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view case';
  const s = module.body.scenario || {};

  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category)}</p>
    <h1>${esc(module.title)}</h1>
    <h2>Situation</h2>
    <p>${esc(s.situation || '')}</p>
    <div class="media-block"></div>
    <h2>${esc(s.question || 'Wie gehen Sie vor?')}</h2>
    <ul class="options"></ul>
    <div class="feedback-slot"></div>
  `;
  container.appendChild(view);

  // Medien einfügen
  const mediaBlock = view.querySelector('.media-block');
  (s.media || []).forEach(m => {
    const el = renderMedia(m);
    if (el) mediaBlock.appendChild(el);
  });

  // Antwortoptionen
  const ul = view.querySelector('.options');
  const options = module.body.options || [];
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

      const nav = document.createElement('div');
      nav.className = 'btn-row';
      nav.innerHTML = `<a class="btn secondary" href="#/">Zurück zur Übersicht</a>`;
      slot.appendChild(nav);

      markModuleCompleted(module.id, opt.correct ? 1 : 0);
    });
    li.appendChild(btn);
    ul.appendChild(li);
  });
}
