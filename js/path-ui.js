// Gemeinsame Ansichten für den Referenzpfad; Module bleiben die Inhaltsquelle.
import { loadRegistry } from './registry.js';
import { loadSettings, saveSettings } from './storage.js';
import { getModuleProgress } from './progress.js';
import { esc } from './util.js';
import { buildCard, typeLabel } from './module-card.js';
import { loadLearningPaths, getPathContext, getPathSummary, matchesYear, isAvailable, moduleLink } from './learning-paths.js';

function pathLink(pathId) { return '#/lernweg/' + encodeURIComponent(pathId); }

function summaryHTML(path, modules) {
  const summary = getPathSummary(path, modules);
  return '<h2>' + esc(path.title) + '</h2>'
    + '<p>' + esc(path.clinicalGoal || '') + '</p>'
    + '<p>' + summary.completed + ' von ' + summary.total + ' Stationen bearbeitet · ca. '
    + summary.minutes + ' Min · Lehrjahr ' + esc((path.lehrjahr || []).join('/')) + '</p>'
    + (summary.pilot ? '<p class="pilot-note">Pilotfassung · zur fachlichen und didaktischen Prüfung.</p>' : '')
    + '<div class="btn-row"><a class="btn" href="' + esc(moduleLink(summary.next.id, {path:path.id})) + '">'
    + (summary.completed === summary.total ? 'Lernpfad wiederholen' : (summary.started ? 'Weiterlernen' : 'Lernpfad beginnen'))
    + '</a><a class="btn secondary" href="' + esc(pathLink(path.id)) + '">Alle Stationen ansehen</a></div>';
}

export async function mountPathOverview(container, isCurrent = () => true) {
  const [paths, registry] = await Promise.all([loadLearningPaths(), loadRegistry()]);
  if (!isCurrent()) return;
  const settings = loadSettings();
  const eligible = paths.filter(p => matchesYear(p, settings));
  const preferred = eligible.find(p => p.id === settings.activeLearningPath) || eligible[0];
  if (!preferred) {
    container.innerHTML = '<p>Für das gewählte Lehrjahr ist noch kein Lernpfad vorhanden. '
      + '<a href="#/themen">Themen direkt öffnen</a>.</p>';
    return;
  }
  const modules = preferred.moduleIds.map(id => registry.modules.find(m => m.id === id));
  if (modules.some(m => !isAvailable(m))) {
    container.innerHTML = '<p>Dieser Lernpfad ist noch nicht vollständig verfügbar.</p>';
    return;
  }
  container.innerHTML = '<h2>Dein Lernweg</h2>' + summaryHTML(preferred, modules);
}

export async function renderPathList(container, isCurrent = () => true) {
  const [paths, registry] = await Promise.all([loadLearningPaths(), loadRegistry()]);
  if (!isCurrent()) return;
  container.innerHTML = '<h1>Lernwege</h1><p>Empfohlene Reihenfolgen verbinden Grundlagen, klinische Entscheidungen und Transfer. Alle verfügbaren Stationen sind direkt erreichbar.</p><div class="path-list"></div>';
  const list = container.querySelector('.path-list');
  const visible = paths.filter(p => matchesYear(p));
  if (!visible.length) list.innerHTML = '<p>Für dein gewähltes Lehrjahr gibt es noch keinen Lernpfad. <a href="#/themen">Themen öffnen</a>.</p>';
  visible.forEach(path => {
    const modules = path.moduleIds.map(id => registry.modules.find(m => m.id === id));
    if (modules.some(m => !isAvailable(m))) return;
    const section = document.createElement('section');
    section.className = 'module-view path-overview';
    section.innerHTML = summaryHTML(path, modules);
    list.appendChild(section);
  });
}

export async function renderLearningPath(container, id, isCurrent = () => true) {
  const context = await getPathContext(id);
  if (!isCurrent()) return;
  if (!context) throw new Error('Dieser Lernpfad ist nicht verfügbar.');
  const {path, modules} = context;
  saveSettings({...loadSettings(), activeLearningPath:path.id});
  container.innerHTML = '<p><a href="#/lernwege">Alle Lernwege</a></p><h1>' + esc(path.title)
    + '</h1><p>' + esc(path.clinicalGoal || '') + '</p>'
    + '<div class="path-summary"></div>'
    + '<p>Die Reihenfolge ist eine Empfehlung. Bearbeitungsstatus und Ergebnisse werden aus den einzelnen Modulen übernommen. Ein abgeschlossenes Modul ist kein Kompetenznachweis.</p>'
    + '<ol class="learning-path"></ol>';
  container.querySelector('.path-summary').innerHTML = summaryHTML(path, modules);
  container.querySelector('.path-summary h2')?.remove();
  container.querySelector('.path-summary > p')?.remove();
  container.querySelector('.path-summary a.secondary')?.remove();
  const list = container.querySelector('.learning-path');
  modules.forEach((module, index) => {
    const li = document.createElement('li');
    li.innerHTML = '<p class="path-step">Station ' + (index + 1) + ' · ' + esc(typeLabel(module.type)) + '</p>';
    li.appendChild(buildCard(module, getModuleProgress(module.id), {path:path.id, registryModules:modules}));
    list.appendChild(li);
  });
}

export async function renderTraining(container, isCurrent = () => true) {
  const registry = await loadRegistry();
  if (!isCurrent()) return;
  const modules = registry.modules.filter(m => isAvailable(m) && matchesYear(m))
    .filter(m => ['case','image-analysis','quiz'].includes(m.type));
  container.innerHTML = '<h1>Trainieren</h1><p>Wähle einen Fall, einen Bildvergleich oder einen Wissenscheck. Die Module und ihr Bearbeitungsstatus sind dieselben wie im Lernweg.</p>'
    + '<div class="dashboard-filter"><label for="training-type">Aufgabenart:</label>'
    + '<select id="training-type"><option value="alle">Alle</option><option value="case">Fall</option>'
    + '<option value="image-analysis">Bildanalyse</option><option value="quiz">Wissenscheck</option></select></div>'
    + '<div class="module-grid"></div>';
  const filter = container.querySelector('#training-type');
  const grid = container.querySelector('.module-grid');
  const refresh = () => {
    grid.replaceChildren();
    const selected = modules.filter(m => filter.value === 'alle' || m.type === filter.value);
    selected.forEach(m => grid.appendChild(buildCard(m, getModuleProgress(m.id), {from:'trainieren', registryModules:registry.modules})));
    if (!selected.length) grid.innerHTML = '<p>Für diese Auswahl ist noch kein Training verfügbar.</p>';
  };
  filter.addEventListener('change', refresh);
  refresh();
}

export async function mountModuleNavigation(container, module, params) {
  const view = container.querySelector('.module-view');
  if (!view) return () => {};
  const pathId = params.get('path');
  const context = pathId ? await getPathContext(pathId) : null;
  const validPath = context && context.path.moduleIds.includes(module.id);
  const origins = {themen:['#/themen','Themen'], trainieren:['#/trainieren','Training'], pruefung:['#/pruefung','Abschlussvorbereitung']};
  const origin = origins[params.get('from')] || ['#/themen','Themen'];
  const panel = document.createElement('section');
  panel.className = 'module-context';
  panel.setAttribute('aria-label', 'Dein Standort');
  let back = origin[0];
  let backLabel = origin[1];
  if (validPath) {
    const {path, modules} = context;
    const index = path.moduleIds.indexOf(module.id);
    back = pathLink(path.id);
    backLabel = 'Zum Lernpfad';
    saveSettings({...loadSettings(), activeLearningPath:path.id});
    panel.innerHTML = '<p><a href="' + esc(back) + '">' + esc(path.title) + '</a> · Station '
      + (index + 1) + ' von ' + modules.length + '</p><p class="module-path-status"></p>'
      + '<nav class="btn-row" aria-label="Stationen im Lernpfad">'
      + (index > 0 ? '<a class="btn secondary" href="' + esc(moduleLink(modules[index-1].id, {path:path.id})) + '">Vorherige Station</a>' : '')
      + (index < modules.length-1 ? '<a class="btn secondary" href="' + esc(moduleLink(modules[index+1].id, {path:path.id})) + '">Nächste Station</a>' : '<a class="btn secondary" href="' + esc(back) + '">Lernpfad ansehen</a>')
      + '</nav>';
  } else {
    const paths = await loadLearningPaths();
    panel.innerHTML = '<p><a href="' + esc(back) + '">' + esc(backLabel) + '</a></p>';
    paths.filter(p => p.moduleIds.includes(module.id)).forEach(path => {
      const p = document.createElement('p');
      p.innerHTML = 'Auch im Lernpfad: <a href="' + esc(moduleLink(module.id, {path:path.id})) + '">' + esc(path.title) + '</a>';
      panel.appendChild(p);
    });
  }
  panel.innerHTML += '<p class="muted">' + esc(typeLabel(module.type)) + ' · '
    + Number(module.estimatedMinutes || 0) + ' Min · LJ ' + esc((module.lehrjahr || []).join('/'))
    + (module.status === 'review' ? ' · Pilotfassung' : '') + '</p>';
  if (module.learningGoals?.length) {
    const details = document.createElement('details');
    details.innerHTML = '<summary>Das lernst du hier</summary><ul>' + module.learningGoals.map(g => '<li>' + esc(g) + '</li>').join('') + '</ul>';
    panel.appendChild(details);
  }
  view.insertBefore(panel, view.firstChild);
  const update = () => {
    if (validPath) {
      const state = panel.querySelector('.module-path-status');
      const label = getModuleProgress(module.id).status === 'completed'
        ? 'Station bearbeitet. Du kannst zum nächsten Schritt wechseln oder erneut üben.'
        : 'Bearbeite die Station oder wähle einen anderen Schritt. Die Reihenfolge ist eine Empfehlung.';
      if (state.textContent !== label) state.textContent = label;
    }
    view.querySelectorAll('a[href="#/"]').forEach(a => {
      if (a.closest('.breadcrumb') || a.closest('.module-context')) return;
      a.setAttribute('href', back);
      a.textContent = backLabel;
    });
  };
  const observer = new MutationObserver(update);
  update();
  observer.observe(view, {childList:true, subtree:true});
  window.addEventListener('mtr:module-completed', update);
  return () => { observer.disconnect(); window.removeEventListener('mtr:module-completed', update); };
}

