// app.js - Bootstrap, Router, Dashboard, Einstellungen

import { loadRegistry, loadModule } from './registry.js';
import { loadProgress, exportProgressAsFile, importProgressFromFile, resetProgress } from './storage.js';
import { getModuleProgress, getOverallProgress } from './progress.js';
import { esc } from './util.js';

const viewEl = document.getElementById('view');

// Renderer-Lookup für Modultypen
const renderers = {
  'knowledge':       () => import('./renderers/knowledge.js'),
  'case':            () => import('./renderers/case.js'),
  'image-analysis':  () => import('./renderers/image-analysis.js'),
  'quiz':            () => import('./renderers/quiz.js'),
  'transfer':        () => import('./renderers/transfer.js'),
};

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);

async function route() {
  const hash = location.hash.replace(/^#/, '') || '/';
  try {
    if (hash === '/' || hash === '') {
      await renderDashboard();
    } else if (hash.startsWith('/module/')) {
      const id = hash.substring('/module/'.length);
      await renderModule(id);
    } else if (hash.startsWith('/info/')) {
      const id = hash.substring('/info/'.length);
      await renderInfotextPage(id);
    } else if (hash === '/pruefung') {
      await renderPruefung();
    } else if (hash === '/einstellungen') {
      await renderEinstellungen();
    } else {
      viewEl.innerHTML = '<p>Seite nicht gefunden. <a href="#/">Zur Startseite</a>.</p>';
    }
  } catch (e) {
    console.error(e);
    viewEl.innerHTML = `<p>Fehler: ${esc(e.message)}</p><p><a href="#/">Zur Startseite</a></p>`;
  }
}

async function renderDashboard() {
  const registry = await loadRegistry();
  const overall = getOverallProgress(registry);

  // Gruppierung nach Kategorie
  const byCategory = {};
  registry.modules.forEach(m => {
    if (!byCategory[m.category]) byCategory[m.category] = [];
    byCategory[m.category].push(m);
  });
  Object.values(byCategory).forEach(arr => arr.sort((a, b) => (a.order || 0) - (b.order || 0)));

  const hasModules = registry.modules.length > 0;

  viewEl.innerHTML = `
    <h1>Willkommen in der Lernapp Strahlentherapie</h1>
    <p>Fachpraktischer Unterricht, Prüfungsvorbereitung und Nachschlagewerk für MTR-Auszubildende.</p>

    <section class="progress-overview" aria-label="Dein Fortschritt">
      <strong>Fortschritt:</strong> ${overall.completed} von ${overall.total} Modulen abgeschlossen (${overall.percent}%).
      <div class="progress-bar" role="progressbar" aria-valuenow="${overall.percent}" aria-valuemin="0" aria-valuemax="100">
        <span style="width: ${overall.percent}%"></span>
      </div>
    </section>

    ${hasModules ? '' : `<p class="muted">Noch keine Module vorhanden. Lege das erste Modul unter <code>content/modules/</code> an und ergänze es in <code>content/modules-registry.json</code>.</p>`}

    <div id="categories"></div>
  `;

  const catBlock = viewEl.querySelector('#categories');
  Object.keys(byCategory).sort().forEach(cat => {
    const block = document.createElement('section');
    block.className = 'category-block';
    block.innerHTML = `<h2>${esc(cat)}</h2><div class="module-grid"></div>`;
    const grid = block.querySelector('.module-grid');
    byCategory[cat].forEach(mod => {
      const progress = getModuleProgress(mod.id);
      grid.appendChild(buildCard(mod, progress));
    });
    catBlock.appendChild(block);
  });
}

function buildCard(mod, progress) {
  const a = document.createElement('a');
  a.className = 'module-card';
  a.href = `#/module/${mod.id}`;
  a.setAttribute('aria-label', `Modul öffnen: ${mod.title}`);
  const statusBadge = progress.status === 'completed'
    ? '<span class="badge status-completed">abgeschlossen</span>'
    : (progress.status === 'in-progress' ? '<span class="badge status-in-progress">begonnen</span>' : '');
  a.innerHTML = `
    <h3>${esc(mod.title)}</h3>
    <div class="meta">
      <span class="badge type-${esc(mod.type)}">${esc(typeLabel(mod.type))}</span>
      <span class="badge">${esc(difficultyLabel(mod.difficulty))}</span>
      ${statusBadge}
    </div>
  `;
  return a;
}

function typeLabel(t) {
  return {
    'knowledge': 'Wissenskarte',
    'case': 'Fall',
    'image-analysis': 'Bildanalyse',
    'quiz': 'Quiz',
    'transfer': 'Transfer'
  }[t] || t;
}
function difficultyLabel(d) {
  return { 'grundlagen': 'Grundlagen', 'fortgeschritten': 'Fortgeschritten', 'pruefungsreife': 'Prüfungsniveau' }[d] || d;
}

async function renderModule(id) {
  viewEl.innerHTML = '<p class="loading">Modul wird geladen…</p>';
  const module = await loadModule(id);
  const type = module.type;
  if (!renderers[type]) {
    viewEl.innerHTML = `<p>Unbekannter Modultyp: ${esc(type)}</p>`;
    return;
  }
  const r = await renderers[type]();
  await r.render(viewEl, module);
}

async function renderInfotextPage(id) {
  viewEl.innerHTML = '<p class="loading">Infotext wird geladen…</p>';
  const { loadInfotext } = await import('./registry.js');
  const { renderMarkdownSimple } = await import('./util.js');
  try {
    const md = await loadInfotext(id);
    viewEl.innerHTML = `<article class="module-view">
      <p class="breadcrumb"><a href="#/">Start</a></p>
      ${renderMarkdownSimple(md)}
    </article>`;
  } catch (e) {
    viewEl.innerHTML = `<p>Infotext nicht gefunden.</p>`;
  }
}

async function renderPruefung() {
  const registry = await loadRegistry();
  const quizzes = registry.modules.filter(m => m.type === 'quiz');
  viewEl.innerHTML = `
    <h1>Prüfungsvorbereitung</h1>
    <p>Gefilterte Ansicht aller Quiz-Module für gezieltes Prüfungstraining.</p>
    <div class="module-grid"></div>
  `;
  const grid = viewEl.querySelector('.module-grid');
  if (quizzes.length === 0) {
    grid.innerHTML = '<p class="muted">Noch keine Quiz-Module vorhanden.</p>';
    return;
  }
  quizzes.forEach(m => grid.appendChild(buildCard(m, getModuleProgress(m.id))));
}

async function renderEinstellungen() {
  const progress = loadProgress();
  const count = Object.keys(progress.modules || {}).length;
  viewEl.innerHTML = `
    <h1>Einstellungen</h1>

    <section class="module-view">
      <h2>Fortschritt exportieren und importieren</h2>
      <p>Du hast aktuell Fortschritts-Daten zu ${count} Modul(en) gespeichert. Du kannst sie als JSON-Datei speichern und auf einem anderen Gerät wieder laden.</p>
      <div class="btn-row">
        <button class="btn" id="export">Als Datei exportieren</button>
        <label class="btn secondary" for="importFile">Datei importieren</label>
        <input type="file" id="importFile" accept=".json,application/json" class="hidden">
      </div>
      <p class="muted">Hinweis: Der Import ersetzt deinen aktuellen lokalen Fortschritt.</p>
    </section>

    <section class="module-view">
      <h2>Fortschritt zurücksetzen</h2>
      <p>Löscht alle gespeicherten Fortschrittsdaten aus diesem Browser. Diese Aktion ist nicht rückgängig zu machen.</p>
      <div class="btn-row">
        <button class="btn secondary" id="reset">Fortschritt zurücksetzen</button>
      </div>
    </section>

    <section class="module-view">
      <h2>Datenschutz</h2>
      <p>Diese Lernapp läuft vollständig im Browser. Es werden keine Daten an Server übertragen, keine Cookies gesetzt und keine Analyse-Tools eingebunden. Dein Fortschritt liegt nur in deinem Browser (<code>localStorage</code>).</p>
    </section>
  `;

  viewEl.querySelector('#export').addEventListener('click', exportProgressAsFile);
  viewEl.querySelector('#importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importProgressFromFile(file);
      alert('Fortschritt erfolgreich importiert.');
      location.reload();
    } catch (err) {
      alert('Import fehlgeschlagen: ' + err.message);
    }
  });
  viewEl.querySelector('#reset').addEventListener('click', () => {
    if (confirm('Wirklich den gesamten Fortschritt zurücksetzen?')) {
      resetProgress();
      location.reload();
    }
  });
}
