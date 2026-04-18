// renderers/transfer.js - Transfer-Aufgabe (offene Reflexion mit Selbstbewertung)

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc } from '../util.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const body = module.body || {};
  const view = document.createElement('article');
  view.className = 'module-view transfer';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category)}</p>
    <h1>${esc(module.title)}</h1>
    <h2>Aufgabe</h2>
    <p>${esc(body.prompt || '')}</p>
    <textarea id="answer" placeholder="Deine Antwort…" aria-label="Eigene Antwort"></textarea>
    <p class="word-count" id="wc">0 Wörter</p>
    <div class="btn-row">
      <button class="btn" id="submit">Eigene Antwort abschließen</button>
    </div>
    <div id="eval" class="hidden"></div>
  `;
  container.appendChild(view);

  const ta = view.querySelector('#answer');
  const wc = view.querySelector('#wc');
  const submit = view.querySelector('#submit');
  const evalBox = view.querySelector('#eval');

  ta.addEventListener('input', () => {
    const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
    wc.textContent = `${words} Wörter`;
  });

  submit.addEventListener('click', () => {
    const words = ta.value.trim().split(/\s+/).filter(Boolean).length;
    const min = body.minWords || 0;
    const max = body.maxWords || Infinity;
    if (words < min) {
      alert(`Bitte mindestens ${min} Wörter schreiben (aktuell ${words}).`);
      return;
    }
    if (words > max) {
      alert(`Bitte nicht mehr als ${max} Wörter schreiben (aktuell ${words}).`);
      return;
    }

    ta.readOnly = true;
    submit.disabled = true;
    evalBox.classList.remove('hidden');

    const sa = body.selfAssessment || {};
    const items = (sa.checklist || []).map((t, i) => `
      <li><label><input type="checkbox" data-idx="${i}"> ${esc(t)}</label></li>
    `).join('');

    evalBox.innerHTML = `
      <h2>Selbstbewertung</h2>
      <p>${esc(sa.intro || 'Vergleiche deine Antwort mit diesen Leitpunkten.')}</p>
      <ul class="checklist">${items}</ul>
      <button class="btn secondary" id="show-sample">Musterantwort anzeigen</button>
      <div id="sample" class="hidden feedback">
        <h3>Musterantwort</h3>
        <p>${esc(body.sampleAnswer || '')}</p>
      </div>
      <div class="btn-row">
        <button class="btn" id="done">Modul abschließen</button>
      </div>
    `;

    evalBox.querySelector('#show-sample').addEventListener('click', () => {
      evalBox.querySelector('#sample').classList.remove('hidden');
    });
    evalBox.querySelector('#done').addEventListener('click', () => {
      const checks = evalBox.querySelectorAll('input[type="checkbox"]');
      const ticked = Array.from(checks).filter(c => c.checked).length;
      const total = checks.length || 1;
      markModuleCompleted(module.id, ticked / total);
      evalBox.innerHTML += `<div class="feedback"><p>Abgeschlossen. ${ticked} von ${total} Leitpunkten selbst bestätigt.</p><p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p></div>`;
    });
  });
}
