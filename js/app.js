// app.js - Bootstrap, Router, Dashboard, Einstellungen

import { loadRegistry, loadModule } from './registry.js';
import { loadProgress, loadSettings, saveSettings, exportProgressAsFile, importProgressFromFile, resetProgress } from './storage.js';
import { getModuleProgress, getOverallProgress } from './progress.js';
import { esc, chapterLabel } from './util.js';
import { buildCard } from './module-card.js';
import { isAvailable } from './learning-paths.js';
import { mountPathOverview, renderPathList, renderLearningPath, renderTraining, mountModuleNavigation } from './path-ui.js';

const viewEl = document.getElementById('view');
let routeVersion = 0;
let disposeModuleNavigation = () => {};

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
  const request = ++routeVersion;
  disposeModuleNavigation();
  disposeModuleNavigation = () => {};
  const raw = location.hash.replace(/^#/, '') || '/';
  const [hash, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  const current = () => request === routeVersion;
  try {
    if (hash === '/' || hash === '') {
      await renderDashboard(false, current);
    } else if (hash === '/themen') {
      await renderDashboard(true, current);
    } else if (hash === '/lernwege') {
      await renderPathList(viewEl, current);
    } else if (hash.startsWith('/lernweg/')) {
      await renderLearningPath(viewEl, decodeURIComponent(hash.slice('/lernweg/'.length)), current);
    } else if (hash === '/trainieren') {
      await renderTraining(viewEl, current);
    } else if (hash.startsWith('/module/')) {
      await renderModule(decodeURIComponent(hash.slice('/module/'.length)), params, current);
    } else if (hash.startsWith('/info/')) {
      await renderInfotextPage(hash.slice('/info/'.length), current);
    } else if (hash === '/pruefung') {
      await renderPruefung(current);
    } else if (hash === '/einstellungen') {
      await renderEinstellungen();
    } else {
      viewEl.innerHTML = '<p>Seite nicht gefunden. <a href="#/">Zur Startseite</a>.</p>';
    }
    if (current()) {
      window.scrollTo(0, 0);
      document.getElementById('main').focus({preventScroll:true});
    }
  } catch (e) {
    if (!current()) return;
    console.error(e);
    viewEl.innerHTML = '<p>Fehler: ' + esc(e.message) + '</p><p><a href="#/">Zur Startseite</a></p>';
  }
}

async function renderDashboard(topicsOnly = false, current = () => true) {
  const registry = await loadRegistry();
  if (!current()) return;
  const settings = loadSettings();
  const overall = getOverallProgress(registry);

  const activeModules = (registry.modules || []).filter(isAvailable);
  const legacyModules = (registry.modules || []).filter(m => m.status === 'legacy' || m.legacy);

  const selectedYear = String(settings.lehrjahr || 'alle');
  const selectedDuty = String(settings.pflichtgrad || 'alle');
  const visibleModules = activeModules.filter(m => {
    const yearMatches = selectedYear === 'alle'
      || (Array.isArray(m.lehrjahr) && m.lehrjahr.map(String).includes(selectedYear));
    const dutyMatches = selectedDuty === 'alle' || m.pflichtgrad === selectedDuty;
    return yearMatches && dutyMatches;
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
    <h1>${topicsOnly ? "Themen" : "Lernapp Strahlentherapie"}</h1>
    <p>Fachpraktischer Unterricht, Prüfungsvorbereitung und Nachschlagewerk für MTR-Auszubildende.</p>

    ${topicsOnly ? "" : '<section id="path-overview" class="module-view path-overview" aria-label="Weiterlernen"></section>'}
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

    <div id="chapters"></div>
    ${legacyModules.length ? '<section id="legacy-modules" class="legacy-block"><h2>Bestehende Lernsequenzen · Migration</h2><p class="muted">Diese älteren Mini-Apps bleiben vorübergehend erreichbar, zählen aber nicht zum regulären Modulfortschritt.</p><div class="module-grid"></div></section>' : ''}
  `;

  viewEl.querySelector('#dashboard-lehrjahr').addEventListener('change', (e) => {
    settings.lehrjahr = e.target.value;
    saveSettings(settings);
    renderDashboard(topicsOnly, current);
  });
  viewEl.querySelector('#dashboard-pflichtgrad').addEventListener('change', (e) => {
    settings.pflichtgrad = e.target.value;
    saveSettings(settings);
    renderDashboard(topicsOnly, current);
  });

  if (!topicsOnly) await mountPathOverview(viewEl.querySelector("#path-overview"), current);
  if (!current()) return;
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
      grid.appendChild(buildCard(mod, getModuleProgress(mod.id), {from:"themen", registryModules:registry.modules}));
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

async function renderModule(id, params = new URLSearchParams(), current = () => true) {
  viewEl.innerHTML = '<p class="loading">Modul wird geladen…</p>';
  const registry = await loadRegistry();
  if (!current()) return;
  const meta = registry.modules.find(m => m.id === id);
  if (meta && meta.type === 'sequence' && meta.file) {
    window.location.href = meta.file;
    return;
  }
  const module = await loadModule(id);
  if (!current()) return;
  if (!isAvailable(module)) throw new Error('Dieses Modul ist noch nicht verfügbar.');
  if (!renderers[module.type]) throw new Error('Unbekannter Modultyp: ' + module.type);
  const renderer = await renderers[module.type]();
  if (!current()) return;
  const staged = document.createElement('div');
  await renderer.render(staged, module);
  if (!current()) return;
  const dispose = await mountModuleNavigation(staged, module, params);
  if (!current()) { dispose(); return; }
  mountPrintTools(module, staged);
  viewEl.replaceChildren(...staged.childNodes);
  disposeModuleNavigation = dispose;
}

function mountPrintTools(module, container = viewEl) {
  if (module.printable === false || module.mode === 'praesenz_gekoppelt') return;
  const view = container.querySelector('.module-view');
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

async function renderInfotextPage(id, current = () => true) {
  viewEl.innerHTML = '<p class="loading">Infotext wird geladen…</p>';
  const { loadInfotext } = await import('./registry.js');
  const { renderMarkdownSimple } = await import('./util.js');
  try {
    const md = await loadInfotext(id);
    if (!current()) return;
    viewEl.innerHTML = `<article class="module-view">
      <p class="breadcrumb"><a href="#/">Start</a></p>
      ${renderMarkdownSimple(md)}
    </article>`;
  } catch (e) {
    if (!current()) return;
    viewEl.innerHTML = `<p>Infotext nicht gefunden.</p>`;
  }
}

async function renderPruefung(current = () => true) {
  const registry = await loadRegistry();
  if (!current()) return;
  const modules = (registry.modules || [])
    .filter(isAvailable)
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
  modules.forEach(m => grid.appendChild(buildCard(m, getModuleProgress(m.id), {from:"pruefung", registryModules:registry.modules})));
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

