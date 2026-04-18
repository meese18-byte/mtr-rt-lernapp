// renderers/image-analysis.js - Bildanalyse
// Unterstützt zwei Modi: Multiple-Choice (default) und Klickpunkt ("click-region").

import { markModuleStarted, markModuleCompleted } from '../progress.js';
import { esc } from '../util.js';

export async function render(container, module) {
  markModuleStarted(module.id);
  container.innerHTML = '';

  const view = document.createElement('article');
  view.className = 'module-view image-analysis';
  const body = module.body || {};
  const img = body.image || {};

  const mode = body.mode === 'click-region' ? 'click' : 'mc';

  view.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → ${esc(module.category)}</p>
    <h1>${esc(module.title)}</h1>
    <p>${esc(body.question || '')}</p>
    <div class="image-slot"></div>
    <div class="interaction-slot"></div>
    <div class="feedback-slot"></div>
  `;
  container.appendChild(view);

  const imageSlot = view.querySelector('.image-slot');
  const interact = view.querySelector('.interaction-slot');
  const feedbackSlot = view.querySelector('.feedback-slot');

  if (mode === 'click') {
    renderClickMode(imageSlot, feedbackSlot, img, body, module);
  } else {
    renderMCMode(imageSlot, interact, feedbackSlot, img, body, module);
  }
}

function renderMCMode(imageSlot, interact, feedbackSlot, img, body, module) {
  const fig = document.createElement('figure');
  fig.innerHTML = `<img src="${esc(img.src)}" alt="${esc(img.alt || '')}">`;
  if (img.caption) fig.innerHTML += `<figcaption>${esc(img.caption)}</figcaption>`;
  imageSlot.appendChild(fig);

  const ul = document.createElement('ul');
  ul.className = 'options';
  let answered = false;
  (body.options || []).forEach(opt => {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      if (answered) return;
      answered = true;
      ul.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
      btn.classList.add(opt.correct ? 'correct' : 'incorrect');
      const fb = document.createElement('div');
      fb.className = 'feedback ' + (opt.correct ? 'correct' : 'incorrect');
      fb.innerHTML = `<p>${esc(opt.feedback)}</p>`;
      feedbackSlot.appendChild(fb);
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
  interact.appendChild(ul);
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
      fail.innerHTML = `<p>Maximale Versuche erreicht. Die korrekte Zielregion ist jetzt markiert.</p>`;
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
