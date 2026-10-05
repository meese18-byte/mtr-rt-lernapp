// renderers/case.js - Fall-Entscheidung
// Klinische Situation mit begründetem Feedback.
// Optional: Follow-Up-Quiz oder offene Transferbegründung.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, renderMedia, moduleContextLabel } from '../util.js';
import { QuizEngine } from '../quiz-engine.js';
import { mountExitSlip } from '../exit-slip.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view case';

  const body = module.body || {};
  const s = body.scenario || {};
  const transferPrompt = body.transferPrompt || null;
  const followUpQuiz = body.followUpQuiz;
  const hasFollowUp = !!followUpQuiz && (
    (Array.isArray(followUpQuiz.itemRefs) && followUpQuiz.itemRefs.length > 0) ||
    (Array.isArray(followUpQuiz.inlineItems) && followUpQuiz.inlineItems.length > 0)
  );

  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(moduleContextLabel(module))}</p>
    <h1>${esc(module.title)}</h1>
    <h2>Situation</h2>
    <p>${esc(s.situation || '')}</p>
    <div class="media-block"></div>
    <h2>${esc(s.question || 'Wie gehst du vor?')}</h2>
    <ul class="options"></ul>
    <div class="feedback-slot"></div>
    <div class="case-transfer" hidden></div>
    <div class="case-followup" hidden></div>
  `;
  container.appendChild(view);

  const mediaBlock = view.querySelector('.media-block');
  (s.media || []).forEach(m => {
    const el = renderMedia(m);
    if (el) mediaBlock.appendChild(el);
  });

  const ul = view.querySelector('.options');
  const options = body.options || [];
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
      fb.innerHTML = `
        <h3>${opt.correct ? 'Richtige Entscheidung' : 'Nicht empfohlen'}</h3>
        <p>${esc(opt.feedback)}</p>
      `;
      slot.appendChild(fb);

      if (body.reinforcement) {
        const rein = document.createElement('div');
        rein.className = 'feedback';
        rein.innerHTML = `<p><strong>Merke:</strong> ${esc(body.reinforcement)}</p>`;
        slot.appendChild(rein);
      }

      if (transferPrompt && transferPrompt.question) {
        startOpenTransfer(view, module, transferPrompt, !!opt.correct);
      } else if (hasFollowUp) {
        startFollowUpQuiz(view, module, followUpQuiz, !!opt.correct);
      } else {
        const nav = document.createElement('div');
        nav.className = 'btn-row';
        nav.innerHTML = '<a class="btn secondary" href="#/">Zurück zur Übersicht</a>';
        slot.appendChild(nav);
        markModuleCompleted(module.id, opt.correct ? 1 : 0);
      }
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  mountExitSlip(view, module);
}

function startOpenTransfer(view, module, transferPrompt, caseCorrect) {
  const host = view.querySelector('.case-transfer');
  host.hidden = false;
  host.innerHTML = `
    <h2>Transfer</h2>
    <p><strong>${esc(transferPrompt.question)}</strong></p>
    <textarea class="case-transfer-input" rows="4"
      placeholder="${esc(transferPrompt.placeholder || 'Deine Begründung …')}"></textarea>
    ${transferPrompt.note ? '<p class="muted">' + esc(transferPrompt.note) + '</p>' : ''}
    <div class="btn-row">
      <button class="btn case-transfer-done" type="button" disabled>Fall abschließen</button>
    </div>
    <div class="case-transfer-feedback"></div>
  `;

  const input = host.querySelector('.case-transfer-input');
  const done = host.querySelector('.case-transfer-done');

  input.addEventListener('input', () => {
    done.disabled = input.value.trim() === '';
  });

  done.addEventListener('click', () => {
    if (input.value.trim() === '' || done.dataset.completed) return;
    done.dataset.completed = '1';
    input.disabled = true;
    done.disabled = true;

    markModuleCompleted(module.id, caseCorrect ? 1 : 0);

    const fb = document.createElement('div');
    fb.className = 'feedback';
    fb.innerHTML = `
      <p><strong>Begründung festgehalten.</strong> Nutze deine Antwort für die gemeinsame Auswertung.</p>
      <p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p>
    `;
    host.querySelector('.case-transfer-feedback').appendChild(fb);
  });

  host.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function startFollowUpQuiz(view, module, followUpQuiz, caseCorrect) {
  const host = view.querySelector('.case-followup');
  host.hidden = false;

  host.innerHTML = `
    <h2>Vertiefung zum Fall</h2>
    <p class="muted">${esc(followUpQuiz.lead || 'Drei Items zur Sicherung des klinischen Transfers.')}</p>
    <div class="quiz-host" id="case-quiz-host"></div>
    <div class="feedback-slot case-followup-slot"></div>
  `;

  const quizHost = host.querySelector('#case-quiz-host');
  const slot = host.querySelector('.case-followup-slot');

  const engineOptions = followUpQuiz.engineOptions || {};
  const passThreshold = typeof followUpQuiz.passThreshold === 'number'
    ? followUpQuiz.passThreshold
    : 0.66;

  const startOptions = {
    moduleId: module.id,
    frames: followUpQuiz.frames || {},
    mode: engineOptions.mode || 'self-first',
    leitner: engineOptions.leitner !== false,
    shuffle: engineOptions.shuffle === true,
    container: quizHost,
    onRunDone: (summary) => {
      const quizRate = summary.gesamt > 0 ? summary.korrekt / summary.gesamt : 0;
      const combined = ((caseCorrect ? 1 : 0) + quizRate) / 2;
      markModuleCompleted(module.id, combined);

      const passed = quizRate >= passThreshold;
      slot.innerHTML = `
        <div class="feedback ${passed ? 'correct' : 'incorrect'}">
          <h3>${passed ? 'Vertiefung bestanden' : 'Vertiefung noch nicht bestanden'}</h3>
          <p>Quiz-Ergebnis: ${summary.korrekt} von ${summary.gesamt} richtig (${Math.round(quizRate * 100)} %).</p>
          <p>Fall-Entscheidung: ${caseCorrect ? 'richtig' : 'nicht richtig'}. Modulwertung: ${Math.round(combined * 100)} %.</p>
          <p><a class="btn secondary" href="#/">Zurück zur Übersicht</a></p>
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
    markModuleCompleted(module.id, caseCorrect ? 0.5 : 0);
  }

  host.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
