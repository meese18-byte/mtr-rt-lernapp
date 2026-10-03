// app.js - Bootstrap, Router, Dashboard, Einstellungen

import { loadRegistry, loadModule, loadLearningPaths } from './registry.js';
import { loadProgress, loadSettings, saveSettings, exportProgressAsFile, importProgressFromFile, resetProgress } from './storage.js';
import { getModuleProgress, getOverallProgress } from './progress.js';
import { esc, chapterLabel } from './util.js';

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
    } else if (hash.startsWith('/path/')) {
      const id = hash.substring('/path/'.length);
      await renderLearningPath(id);
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
  const [registry, learningPaths] = await Promise.all([loadRegistry(), loadLearningPaths()]);
  const settings = loadSettings();
  const overall = getOverallProgress(registry);

  const activeModules = (registry.modules || []).filter(m => ['draft', 'review', 'live'].includes(m.status) && !m.legacy);
  const legacyModules = (registry.modules || []).filter(m => m.status === 'legacy' || m.legacy);

  const selectedYear = String(settings.lehrjahr || 'alle');
  const selectedDuty = String(settings.pflichtgrad || 'alle');
  const visibleModules = activeModules.filter(m => {
    const yearMatches = selectedYear === 'alle'
      || (Array.isArray(m.lehrjahr) && m.lehrjahr.map(String).includes(selectedYear));
    const dutyMatches = selectedDuty === 'alle' || m.pflichtgrad === selectedDuty;
    return yearMatches && dutyMatches;
  });

  const visiblePaths = (learningPaths.paths || []).filter(path => {
    return selectedYear === 'alle'
      || (Array.isArray(path.lehrjahr) && path.lehrjahr.map(String).includes(selectedYear));
  });

  // V3: primär nach Kapitel, sekundär nach reihenfolge.
  const byChapter = {};
  visibleModules.forEach(m => {
    const key = Number(m.kapitel) || 0;
    if (!byChapter[key]) byChapter[key] = [];
    byChapter[key].push(m);
  });
  Object.values(byChapter).forEach(arr => arr.sort((a, b) => (a.reihenfolge || 0) - (b.reihenfolge || 0)));

  viewEl.innerHTML = `
    <h1>Willkommen in der Lernapp Strahlentherapie</h1>
    <p>Fachpraktischer Unterricht, Prüfungsvorbereitung und Nachschlagewerk für MTR-Auszubildende.</p>

    <section class="progress-overview" aria-label="Dein Fortschritt">
      <strong>Fortschritt:</strong> ${overall.completed} von ${overall.total} aktiven Modulen abgeschlossen (${overall.percent}%).
      <div class="progress-bar" role="progressbar" aria-valuenow="${overall.percent}" aria-valuemin="0" aria-valuemax="100">
        <span style="width: ${overall.percent}%"></span>
      </div>
    </section>

    <section class="dashboard-filter module-view" aria-label="Module filtern">
      <label for="dashboard-lehrjahr"><strong>Lehrjahr:</strong></label>
      <select id="dashboard-lehrjahr">
        <option value="alle" ${selectedYear === 'alle' ? 'selected' : ''}>Alle</option>
        <option value="1" ${selectedYear === '1' ? 'selected' : ''}>1. Lehrjahr</option>
        <option value="2" ${selectedYear === '2' ? 'selected' : ''}>2. Lehrjahr</option>
        <option value="3" ${selectedYear === '3' ? 'selected' : ''}>3. Lehrjahr</option>
      </select>
      <label for="dashboard-pflichtgrad"><strong>Pflichtgrad:</strong></label>
      <select id="dashboard-pflichtgrad">
        <option value="alle" ${selectedDuty === 'alle' ? 'selected' : ''}>Alle</option>
        <option value="pflicht" ${selectedDuty === 'pflicht' ? 'selected' : ''}>Pflicht</option>
        <option value="vertiefung" ${selectedDuty === 'vertiefung' ? 'selected' : ''}>Vertiefung</option>
        <option value="exkurs" ${selectedDuty === 'exkurs' ? 'selected' : ''}>Exkurs</option>
      </select>
    </section>

    ${visiblePaths.length ? '<section id="learning-paths" class="category-block"><h2>Lernpfade</h2><p class="muted">Module in sinnvoller Reihenfolge bearbeiten.</p><div class="module-grid"></div></section>' : ''}

    <div id="chapters"></div>
    ${legacyModules.length ? '<section id="legacy-modules" class="legacy-block"><h2>Bestehende Lernsequenzen · Migration</h2><p class="muted">Diese älteren Mini-Apps bleiben vorübergehend erreichbar, zählen aber nicht zum regulären Modulfortschritt.</p><div class="module-grid"></div></section>' : ''}
  `;

  viewEl.querySelector('#dashboard-lehrjahr').addEventListener('change', (e) => {
    settings.lehrjahr = e.target.value;
    saveSettings(settings);
    renderDashboard();
  });
  viewEl.querySelector('#dashboard-pflichtgrad').addEventListener('change', (e) => {
    settings.pflichtgrad = e.target.value;
    saveSettings(settings);
    renderDashboard();
  });

  const pathGrid = viewEl.querySelector('#learning-paths .module-grid');
  if (pathGrid) {
    const activeIds = new Set(activeModules.map(m => m.id));
    visiblePaths.forEach(path => {
      const modules = (path.moduleIds || [])
        .filter(id => activeIds.has(id))
        .map(id => registry.modules.find(m => m.id === id))
        .filter(Boolean);
      if (!modules.length) return;

      const completed = modules.filter(m => getModuleProgress(m.id).status === 'completed').length;
      const card = document.createElement('a');
      card.className = 'module-card';
      card.href = '#/path/' + path.id;
      card.setAttribute('aria-label', 'Lernpfad öffnen: ' + path.title);
      card.innerHTML = `
        <h3>${esc(path.title)}</h3>
        <div class="meta">
          <span class="badge">Lernpfad</span>
          <span class="badge">${modules.length} Module</span>
          <span class="badge">${completed}/${modules.length} abgeschlossen</span>
        </div>
        <p class="muted">In festgelegter Reihenfolge bearbeiten.</p>
      `;
      pathGrid.appendChild(card);
    });
  }
  const chapterBlock = viewEl.querySelector('#chapters');
  const chapterNumbers = Object.keys(byChapter).map(Number).sort((a, b) => a - b);

  if (chapterNumbers.length === 0) {
    chapterBlock.innerHTML = '<p class="muted">Für diesen Lehrjahr-Filter sind noch keine aktiven Module vorhanden.</p>';
  }

  chapterNumbers.forEach(chapter => {
    const block = document.createElement('section');
    block.className = 'category-block';
    block.innerHTML = `<h2>${String(chapter).padStart(2, '0')} · ${esc(chapterLabel(chapter))}</h2><div class="module-grid"></div>`;
    const grid = block.querySelector('.module-grid');
    byChapter[chapter].forEach(mod => {
      grid.appendChild(buildCard(mod, getModuleProgress(mod.id)));
    });
    chapterBlock.appendChild(block);
  });

  if (legacyModules.length) {
    const grid = viewEl.querySelector('#legacy-modules .module-grid');
    legacyModules
      .sort((a, b) => (a.kapitel || 0) - (b.kapitel || 0) || (a.reihenfolge || 0) - (b.reihenfolge || 0))
      .forEach(mod => grid.appendChild(buildCard(mod, { status: 'legacy' })));
  }
}

function buildCard(mod, progress) {
  const a = document.createElement('a');
  a.className = 'module-card';

  const isLegacy = mod.status === 'legacy' || mod.legacy;
  a.href = isLegacy && mod.file ? mod.file : `#/module/${mod.id}`;

  if (isLegacy && mod.file) {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  }

  a.setAttribute('aria-label', `Modul öffnen: ${mod.title}`);

  const statusBadge = progress.status === 'completed'
    ? '<span class="badge status-completed">abgeschlossen</span>'
    : (progress.status === 'in-progress'
      ? '<span class="badge status-in-progress">begonnen</span>'
      : (isLegacy ? '<span class="badge badge-legacy">Legacy</span>' : ''));

  const yearBadge = Array.isArray(mod.lehrjahr) && mod.lehrjahr.length
    ? `<span class="badge">LJ ${esc(mod.lehrjahr.join('/'))}</span>`
    : '';

  const dutyBadge = mod.pflichtgrad
    ? `<span class="badge badge-${esc(mod.pflichtgrad)}">${esc(pflichtgradLabel(mod.pflichtgrad))}</span>`
    : '';

  const timeBadge = Number.isFinite(Number(mod.estimatedMinutes))
    ? `<span class="badge">${Number(mod.estimatedMinutes)} Min</span>`
    : '';

  const prereqHint = Array.isArray(mod.voraussetzungen) && mod.voraussetzungen.length
    ? `<p class="module-prereq muted">Vorher sinnvoll: ${esc(mod.voraussetzungen.join(', '))}</p>`
    : '';

  a.innerHTML = `
    <h3>${esc(mod.title)}</h3>
    <div class="meta">
      <span class="badge type-${esc(isLegacy ? 'legacy' : mod.type)}">${esc(isLegacy ? 'Legacy-Lernsequenz' : typeLabel(mod.type))}</span>
      ${dutyBadge}
      ${yearBadge}
      ${timeBadge}
      ${statusBadge}
    </div>
    ${prereqHint}
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

function pflichtgradLabel(value) {
  return {
    'pflicht': 'Pflicht',
    'vertiefung': 'Vertiefung',
    'exkurs': 'Exkurs'
  }[value] || value;
}

async function renderLearningPath(id) {
  const [registry, learningPaths] = await Promise.all([loadRegistry(), loadLearningPaths()]);
  const path = (learningPaths.paths || []).find(p => p.id === id);

  if (!path) {
    viewEl.innerHTML = '<p>Lernpfad nicht gefunden. <a href="#/">Zur Startseite</a>.</p>';
    return;
  }

  const modules = (path.moduleIds || [])
    .map(moduleId => registry.modules.find(m => m.id === moduleId))
    .filter(m => m && ['draft', 'review', 'live'].includes(m.status) && !m.legacy);

  viewEl.innerHTML = `
    <p class="breadcrumb"><a href="#/">Start</a> → Lernpfad</p>
    <h1>${esc(path.title)}</h1>
    <p>Bearbeite die Module in dieser Reihenfolge. Dein Fortschritt wird lokal in diesem Browser gespeichert.</p>
    <div class="module-grid" id="path-modules"></div>
  `;

  const grid = viewEl.querySelector('#path-modules');
  if (!modules.length) {
    grid.innerHTML = '<p class="muted">Für diesen Lernpfad sind noch keine nutzbaren Module vorhanden.</p>';
    return;
  }

  modules.forEach((mod, index) => {
    const wrap = document.createElement('div');
    const step = document.createElement('p');
    step.className = 'muted';
    step.innerHTML = '<strong>Schritt ' + (index + 1) + '</strong>';
    wrap.appendChild(step);
    wrap.appendChild(buildCard(mod, getModuleProgress(mod.id)));
    grid.appendChild(wrap);
  });
}
async function renderModule(id) {
  viewEl.innerHTML = '<p class="loading">Modul wird geladen…</p>';

  // Lernsequenzen: Registry-Eintrag prüfen, dann zur HTML-Seite weiterleiten
  const registry = await loadRegistry();
  const meta = registry.modules.find(m => m.id === id);
  if (meta && meta.type === 'sequence' && meta.file) {
    window.location.href = meta.file;
    return;
  }

  const module = await loadModule(id);
  const type = module.type;
  if (!renderers[type]) {
    viewEl.innerHTML = `<p>Unbekannter Modultyp: ${esc(type)}</p>`;
    return;
  }
  const r = await renderers[type]();
  await r.render(viewEl, module);
  mountPrintTools(module);
}

function mountPrintTools(module) {
  if (module.printable === false || module.mode === 'praesenz_gekoppelt') return;
  const view = viewEl.querySelector('.module-view');
  if (!view || view.querySelector('.print-tools')) return;

  const tools = document.createElement('div');
  tools.className = 'print-tools btn-row';
  tools.innerHTML = '<button class="btn secondary" type="button">Modul drucken</button>';
  const button = tools.querySelector('button');

  button.addEventListener('click', () => {
    const details = Array.from(view.querySelectorAll('details'));
    const states = details.map(d => d.open);
    details.forEach(d => { d.open = true; });
    window.print();
    details.forEach((d, i) => { d.open = states[i]; });
  });

  view.appendChild(tools);
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
  const modules = (registry.modules || [])
    .filter(m => m.status !== 'legacy' && !m.legacy)
    .filter(m => Number(m.kapitel) === 14 || (Array.isArray(m.tags) && m.tags.includes('pruefung')))
    .sort((a, b) => (a.reihenfolge || 0) - (b.reihenfolge || 0));

  viewEl.innerHTML = `
    <h1>Prüfungsvorbereitung</h1>
    <p>Fallvorstellungen, Störfälle, Quiz- und Transfermodule für die gezielte Abschlussvorbereitung.</p>
    <div class="module-grid"></div>
  `;

  const grid = viewEl.querySelector('.module-grid');
  if (modules.length === 0) {
    grid.innerHTML = '<p class="muted">Noch keine Module für die Prüfungsvorbereitung vorhanden.</p>';
    return;
  }
  modules.forEach(m => grid.appendChild(buildCard(m, getModuleProgress(m.id))));
}

async function renderEinstellungen() {
  const progress = loadProgress();
  const settings = loadSettings();
  const count = Object.keys(progress.modules || {}).length;
  viewEl.innerHTML = `
    <h1>Einstellungen</h1>

    <section class="module-view">
      <h2>Lernansicht</h2>
      <label for="settings-lehrjahr"><strong>Lehrjahr filtern:</strong></label>
      <select id="settings-lehrjahr">
        <option value="alle" ${String(settings.lehrjahr) === 'alle' ? 'selected' : ''}>Alle Lehrjahre</option>
        <option value="1" ${String(settings.lehrjahr) === '1' ? 'selected' : ''}>1. Lehrjahr</option>
        <option value="2" ${String(settings.lehrjahr) === '2' ? 'selected' : ''}>2. Lehrjahr</option>
        <option value="3" ${String(settings.lehrjahr) === '3' ? 'selected' : ''}>3. Lehrjahr</option>
      </select>
      <label for="settings-pflichtgrad"><strong>Pflichtgrad filtern:</strong></label>
      <select id="settings-pflichtgrad">
        <option value="alle" ${String(settings.pflichtgrad) === 'alle' ? 'selected' : ''}>Alle</option>
        <option value="pflicht" ${String(settings.pflichtgrad) === 'pflicht' ? 'selected' : ''}>Pflicht</option>
        <option value="vertiefung" ${String(settings.pflichtgrad) === 'vertiefung' ? 'selected' : ''}>Vertiefung</option>
        <option value="exkurs" ${String(settings.pflichtgrad) === 'exkurs' ? 'selected' : ''}>Exkurs</option>
      </select>
      <p class="muted">Die Filter steuern die Modulauswahl auf dem Dashboard. Baustein-Tiefenfilter werden im weiteren V3-Ausbau ergänzt.</p>
    </section>

    <section class="module-view">
      <h2>Fortschritt exportieren und importieren</h2>
      <p>Du hast aktuell Fortschritts-Daten zu ${count} Modul(en) gespeichert. Du kannst sie als JSON-Datei speichern und auf einem anderen Gerät wieder laden.</p>
      <div class="btn-row">
        <button class="btn" id="export">Als Datei exportieren</button>
        <label class="btn secondary" for="importFile">Datei importieren</label>
        <input type="file" id="importFile" accept=".json,application/json" class="hidden">
      </div>
      <p class="muted">Der Export enthält Modul-Fortschritt, Quiz-Status (Leitner-Boxen) und Exit-Slip-Antworten. Der Import ersetzt deinen aktuellen lokalen Stand. Ältere Export-Dateien (nur Modul-Fortschritt) werden weiterhin akzeptiert.</p>
    </section>

    <section class="module-view">
      <h2>Fortschritt zurücksetzen</h2>
      <p>Löscht alle gespeicherten Daten dieser Lernapp aus diesem Browser: Modul-Fortschritt, Einstellungen, Quiz-Status und Exit-Slip-Antworten. Diese Aktion ist nicht rückgängig zu machen.</p>
      <div class="btn-row">
        <button class="btn secondary" id="reset">Fortschritt zurücksetzen</button>
      </div>
    </section>

    <section class="module-view">
      <h2>Datenschutz</h2>
      <p>Diese Lernapp läuft vollständig im Browser. Es werden keine Daten an Server übertragen, keine Cookies gesetzt und keine Analyse-Tools eingebunden. Dein Fortschritt liegt nur in deinem Browser (<code>localStorage</code>).</p>
    </section>
  `;

  viewEl.querySelector('#settings-lehrjahr').addEventListener('change', (e) => {
    settings.lehrjahr = e.target.value;
    saveSettings(settings);
  });
  viewEl.querySelector('#settings-pflichtgrad').addEventListener('change', (e) => {
    settings.pflichtgrad = e.target.value;
    saveSettings(settings);
  });

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
