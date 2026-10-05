// renderers/image-analysis.js - Bildanalyse
// Unterstützt Multiple-Choice, optionale offene Vorbearbeitung und Klickpunkt.

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc, moduleContextLabel } from '../util.js';
import { mountExitSlip } from '../exit-slip.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view image-analysis';
  const body = module.body || {};
  const img = body.image || {};
  const mobileView = body.mobileView || '';
  if (mobileView) view.dataset.mobileView = mobileView;

  const mode = body.mode === 'click-region' ? 'click' : 'mc';

  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(moduleContextLabel(module))}</p>
    <h1>${esc(module.title)}</h1>
    ${body.intro ? '<p class="feedback task-result"><strong>' + esc(body.intro) + '</strong></p>' : ''}
    <div class="image-slot"></div>
    <div class="analysis-prompts"></div>
    <div class="interaction-slot"></div>
    <div class="feedback-slot"></div>
  `;
  container.appendChild(view);

  const imageSlot = view.querySelector('.image-slot');
  const prompts = view.querySelector('.analysis-prompts');
  const interact = view.querySelector('.interaction-slot');
  const feedbackSlot = view.querySelector('.feedback-slot');

  renderTeachingImage(imageSlot, img, mobileView, false);

  const analysisPrompts = Array.isArray(body.analysisPrompts) ? body.analysisPrompts : [];
  const analysisHints = Array.isArray(body.analysisHints) ? body.analysisHints : [];
  const requireResponses = body.requirePromptResponses === true;
  const promptInputs = [];

  if (analysisPrompts.length) {
    const box = document.createElement('section');
    box.className = 'learning-prompts';
    box.innerHTML = '<h2>Schau genau hin</h2>';
    const ol = document.createElement('ol');

    analysisPrompts.forEach((prompt, index) => {
      const li = document.createElement('li');
      const p = document.createElement('p');
      p.className = 'analysis-prompt-text';
      p.textContent = prompt;
      li.appendChild(p);

      const hint = analysisHints[index];
      if (hint) {
        const hp = document.createElement('p');
        hp.className = 'task-hint muted';
        hp.innerHTML = '<strong>Tipp:</strong> ' + esc(hint);
        li.appendChild(hp);
      }

      if (requireResponses) {
        const ta = document.createElement('textarea');
        ta.className = 'analysis-response';
        ta.rows = 3;
        ta.placeholder = 'Deine Antwort …';
        ta.setAttribute('aria-label', 'Antwort zu Aufgabe ' + (index + 1));
        li.appendChild(ta);
        promptInputs.push(ta);
      }

      ol.appendChild(li);
    });

    box.appendChild(ol);
    prompts.appendChild(box);
  } else {
    prompts.remove();
  }

  if (mode === 'click') {
    renderClickMode(imageSlot, feedbackSlot, img, body, module);
  } else {
    renderMCMode(interact, feedbackSlot, body, module, promptInputs, mobileView);
  }

  mountExitSlip(view, module);
}

function renderTeachingImage(host, img, mobileView, isSolution) {
  if (!img || !img.src) return;

  const fig = document.createElement('figure');
  if (img.layout === 'wide-scroll') fig.classList.add('wide-image-figure');

  if (mobileView === 'tech-four') {
    fig.classList.add('mobile-overview');
  } else if (mobileView === 'plan-pair') {
    fig.classList.add('mobile-hide');
  }

  fig.innerHTML = `<img src="${esc(img.src)}" alt="${esc(img.alt || '')}">`;
  if (img.caption) fig.innerHTML += `<figcaption>${esc(img.caption)}</figcaption>`;
  host.appendChild(fig);

  if (mobileView === 'tech-four') {
    host.appendChild(buildTechMobileSplit(img.src, isSolution));
  } else if (mobileView === 'plan-pair') {
    host.appendChild(buildPlanMobileSplit(img.src, isSolution));
  } else if (img.layout === 'wide-scroll') {
    const hint = document.createElement('p');
    hint.className = 'muted wide-image-hint';
    hint.textContent = 'Auf kleinen Bildschirmen: seitlich wischen.';
    host.appendChild(hint);
  }
}

function buildTechMobileSplit(src, isSolution) {
  const wrap = document.createElement('div');
  wrap.className = 'mobile-split mobile-tech-four';

  const title = document.createElement('p');
  title.className = 'muted';
  title.textContent = isSolution
    ? 'Lösung auf dem Smartphone: die vier Darstellungen einzeln.'
    : 'Auf dem Smartphone: Gesamtübersicht oben, anschließend A–D einzeln.';
  wrap.appendChild(title);

  ['A', 'B', 'C', 'D'].forEach(letter => {
    const card = document.createElement('section');
    card.className = 'mobile-image-card';
    card.innerHTML = `
      <h3>Technik ${letter}</h3>
      <div class="mobile-crop tech-crop tech-${letter.toLowerCase()}">
        <img src="${esc(src)}" alt="Technik ${letter}">
      </div>
    `;
    wrap.appendChild(card);
  });

  return wrap;
}

function buildPlanMobileSplit(src, isSolution) {
  const wrap = document.createElement('div');
  wrap.className = 'mobile-split mobile-plan-pair';

  const title = document.createElement('p');
  title.className = 'muted';
  title.textContent = isSolution
    ? 'Aufgelöste Darstellung auf dem Smartphone.'
    : 'Auf dem Smartphone werden DVH und Isodosenbild untereinander gezeigt.';
  wrap.appendChild(title);

  const dvh = document.createElement('section');
  dvh.className = 'mobile-image-card';
  dvh.innerHTML = `
    <h3>1. DVH</h3>
    <div class="mobile-crop plan-crop plan-dvh">
      <img src="${esc(src)}" alt="DVH-Ausschnitt">
    </div>
  `;

  const iso = document.createElement('section');
  iso.className = 'mobile-image-card';
  iso.innerHTML = `
    <h3>2. Isodosenbild</h3>
    <div class="mobile-crop plan-crop plan-iso">
      <img src="${esc(src)}" alt="Isodosen-Ausschnitt">
    </div>
  `;

  wrap.appendChild(dvh);
  wrap.appendChild(iso);
  return wrap;
}

function renderMCMode(interact, feedbackSlot, body, module, promptInputs, mobileView) {
  const gate = document.createElement('div');
  gate.className = 'analysis-gate';

  const question = document.createElement('h2');
  question.textContent = body.question || 'Welche Aussage stimmt?';
  gate.appendChild(question);

  const requireResponses = body.requirePromptResponses === true && promptInputs.length > 0;
  const gateNote = document.createElement('p');
  gateNote.className = 'muted gate-note';
  if (requireResponses) {
    gateNote.textContent = 'Bearbeite zuerst alle offenen Aufgaben.';
    gate.appendChild(gateNote);
  }

  const ul = document.createElement('ul');
  ul.className = 'options';
  gate.appendChild(ul);

  let answered = false;
  const buttons = [];

  (body.options || []).forEach(opt => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.disabled = requireResponses;
    buttons.push(btn);

    btn.addEventListener('click', () => {
      if (answered || btn.disabled) return;
      answered = true;
      ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
      btn.classList.add(opt.correct ? 'correct' : 'incorrect');

      const fb = document.createElement('div');
      fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
      fb.innerHTML = `<p>${esc(opt.feedback)}</p>`;
      feedbackSlot.appendChild(fb);

      if (body.solutionImage && body.solutionImage.src) {
        renderTeachingImage(feedbackSlot, body.solutionImage, mobileView, true);
      }

      if (body.reinforcement) {
        const rein = document.createElement('div');
        rein.className = 'feedback';
        rein.innerHTML = `<p><strong>Merke:</strong> ${esc(body.reinforcement)}</p>`;
        feedbackSlot.appendChild(rein);
      }

      markModuleCompleted(module.id, opt.correct ? 1 : 0);
    });

    li.appendChild(btn);
    ul.appendChild(li);
  });

  if (requireResponses) {
    const updateGate = () => {
      const ready = promptInputs.every(input => input.value.trim() !== '');
      if (!answered) buttons.forEach(btn => { btn.disabled = !ready; });
      gate.classList.toggle('is-locked', !ready);
      gateNote.textContent = ready
        ? 'Alle offenen Aufgaben sind bearbeitet. Jetzt kannst du deine Einordnung prüfen.'
        : 'Bearbeite zuerst alle offenen Aufgaben.';
    };
    promptInputs.forEach(input => input.addEventListener('input', updateGate));
    updateGate();
  }

  interact.appendChild(gate);
}

function renderClickMode(imageSlot, feedbackSlot, img, body, module) {
  const wrap = document.createElement('div');
  wrap.className = 'image-click-wrap';
  const imageEl = document.createElement('img');
  imageEl.src = img.src;
  imageEl.alt = img.alt || '';
  wrap.appendChild(imageEl);
  imageSlot.appendChild(wrap);

  let attempts = 0;
  const maxAttempts = body.maxAttempts || 3;
  let solved = false;

  wrap.addEventListener('click', (e) => {
    if (solved) return;
    const rect = imageEl.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    attempts++;

    const marker = document.createElement('div');
    marker.className = 'click-marker';
    marker.style.left = (x * 100) + '%';
    marker.style.top = (y * 100) + '%';
    wrap.appendChild(marker);

    const target = body.targetRegion || { x: 0.5, y: 0.5, radius: 0.05 };
    const dx = x - target.x;
    const dy = y - target.y;
    const hit = Math.sqrt(dx * dx + dy * dy) <= target.radius;

    const fb = document.createElement('div');
    fb.className = 'feedback ' + (hit ? 'correct' : 'incorrect');
    fb.innerHTML = `<p>${esc(hit ? (body.hitFeedback || 'Getroffen.') : (body.missFeedback || 'Nicht getroffen.'))}</p>`;
    feedbackSlot.appendChild(fb);

    if (hit) {
      solved = true;
      markModuleCompleted(module.id, 1);
    } else if (attempts >= maxAttempts) {
      solved = true;
      const fail = document.createElement('div');
      fail.className = 'feedback incorrect';
      fail.innerHTML = '<p>Maximale Versuche erreicht. Die korrekte Zielregion ist jetzt markiert.</p>';
      feedbackSlot.appendChild(fail);
      const show = document.createElement('div');
      show.className = 'click-marker';
      show.style.borderColor = '#16a34a';
      show.style.left = (target.x * 100) + '%';
      show.style.top = (target.y * 100) + '%';
      wrap.appendChild(show);
      markModuleCompleted(module.id, 0);
    }
  });
}
