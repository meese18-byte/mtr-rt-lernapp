// renderers/knowledge.js - Wissenskarte
// Unterstützt optional "attempt-first": freie Abrufaufgabe + kurze MC-Fragen vor dem Infotext.

import { loadInfotext } from '../registry.js';
import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMarkdownSimple, moduleContextLabel } from '../util.js';
import { mountExitSlip } from '../exit-slip.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const body = module.body || {};
  const preRecall = body.preRecall || null;
  const preQuestions = Array.isArray(body.preQuestions) ? body.preQuestions : [];
  const postQuestions = Array.isArray(body.checkQuestions) ? body.checkQuestions : [];
  const attemptFirst = body.mode === 'attempt-first' && (!!preRecall || preQuestions.length > 0);

  const view = document.createElement('article');
  view.className = 'module-view';
  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(moduleContextLabel(module))}</p>
    <h1>${esc(module.title)}</h1>
    <p class="muted">${esc(body.intro || '')}</p>
    <div id="kn-prechecks"></div>
    <div id="kn-infotext"><p class="loading">Infotext wird geladen…</p></div>
    <div id="kn-postblock">
      <h2>Transferfragen</h2>
      <div id="kn-checks"></div>
    </div>
  `;
  container.appendChild(view);

  const pre = view.querySelector('#kn-prechecks');
  const info = view.querySelector('#kn-infotext');
  const postBlock = view.querySelector('#kn-postblock');
  const checks = view.querySelector('#kn-checks');

  if (attemptFirst) {
    const head = document.createElement('div');
    head.className = 'feedback';
    head.innerHTML = '<p><strong>Erst selbst denken.</strong> Bearbeite die kurzen Aufgaben. Danach wird die Erklärung eingeblendet.</p>';
    pre.appendChild(head);
  } else {
    pre.remove();
  }

  if (body.infotext) {
    try {
      const md = await loadInfotext(body.infotext);
      info.innerHTML = renderMarkdownSimple(md);
      if (attemptFirst) info.hidden = true;
    } catch (e) {
      info.innerHTML = '<p class="muted">Infotext nicht verfügbar.</p>';
    }
  } else {
    info.remove();
  }

  let preDone = 0;
  let preCorrect = 0;
  let preCompleted = false;
  const preTotal = (preRecall ? 1 : 0) + preQuestions.length;

  function completePre(correct = null) {
    preDone++;
    if (correct === true) preCorrect++;
    if (preDone !== preTotal || preCompleted) return;
    preCompleted = true;

    if (info) {
      info.hidden = false;
      const note = document.createElement('div');
      note.className = 'feedback';
      note.innerHTML = '<p><strong>Jetzt vergleichen:</strong> Lies die Kurzinfo und prüfe deine Antworten.</p>';
      info.prepend(note);
    }

    if (postQuestions.length === 0) {
      const rate = preQuestions.length > 0 ? preCorrect / preQuestions.length : 1;
      markModuleCompleted(module.id, rate);
    }
  }

  if (attemptFirst && preRecall) {
    const wrap = document.createElement('section');
    wrap.className = 'knowledge-recall';
    wrap.innerHTML = `
      <p><strong>${esc(preRecall.question || '')}</strong></p>
      <div class="recall-row">
        <input type="text" class="recall-input" autocomplete="off"
          placeholder="${esc(preRecall.placeholder || 'Antwort eingeben …')}"
          aria-label="${esc(preRecall.question || 'Antwort eingeben')}">
        <button class="btn recall-compare" type="button" disabled>Antwort vergleichen</button>
      </div>
      <div class="feedback-slot"></div>
    `;

    const input = wrap.querySelector('.recall-input');
    const compare = wrap.querySelector('.recall-compare');
    input.addEventListener('input', () => {
      compare.disabled = input.value.trim() === '';
    });
    compare.addEventListener('click', () => {
      if (input.value.trim() === '' || wrap.dataset.answered) return;
      wrap.dataset.answered = '1';
      input.disabled = true;
      compare.disabled = true;
      const fb = document.createElement('div');
      fb.className = 'feedback correct';
      fb.innerHTML = `
        <p><strong>${esc(preRecall.answer || '')}</strong></p>
        <p>${esc(preRecall.feedback || '')}</p>
      `;
      wrap.querySelector('.feedback-slot').appendChild(fb);
      completePre(null);
    });
    pre.appendChild(wrap);
  }

  if (attemptFirst) {
    preQuestions.forEach(q => {
      const wrap = document.createElement('section');
      wrap.innerHTML = `
        <p><strong>${esc(q.question)}</strong></p>
        <ul class="options"></ul>
        <div class="feedback-slot"></div>
      `;
      const ul = wrap.querySelector('.options');

      (q.options || []).forEach(opt => {
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
          completePre(!!opt.correct);
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
      pre.appendChild(wrap);
    });
  }

  if (postQuestions.length === 0) {
    postBlock.remove();
  } else {
    let correctCount = 0;
    const total = postQuestions.length;
    let answeredCount = 0;

    postQuestions.forEach((q, qi) => {
      const wrap = document.createElement('section');
      wrap.innerHTML = `
        <p><strong>${esc(q.question)}</strong></p>
        <ul class="options" data-question="${qi}"></ul>
        <div class="feedback-slot"></div>
      `;
      const ul = wrap.querySelector('.options');

      (q.options || []).forEach(opt => {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = opt.label;
        btn.addEventListener('click', () => {
          if (wrap.dataset.answered) return;
          wrap.dataset.answered = '1';
          answeredCount++;
          ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
          btn.classList.add(opt.correct ? 'correct' : 'incorrect');

          const fb = document.createElement('div');
          fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
          fb.innerHTML = `<p>${esc(opt.feedback)}</p>`;
          wrap.querySelector('.feedback-slot').appendChild(fb);

          if (opt.correct) correctCount++;
          if (answeredCount === total) finishPost(correctCount, total);
        });
        li.appendChild(btn);
        ul.appendChild(li);
      });
      checks.appendChild(wrap);
    });
  }

  mountExitSlip(view, module);

  function finishPost(correct, total) {
    const rate = total > 0 ? correct / total : 1;
    markModuleCompleted(module.id, rate);
    const done = document.createElement('div');
    done.className = 'feedback';
    done.innerHTML = `
      <p><strong>Modul abgeschlossen.</strong> ${correct} von ${total} Verständnisfragen korrekt.</p>
      <p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p>
    `;
    checks.appendChild(done);
  }
}
