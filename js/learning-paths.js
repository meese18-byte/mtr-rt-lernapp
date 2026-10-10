// Lernpfade komponieren Standardmodule; keine eigene Fortschrittsspeicherung.
import { loadRegistry } from './registry.js';
import { loadProgress, loadSettings } from './storage.js';

export function isAvailable(module) {
  return !!module && !module.legacy && ['live', 'review'].includes(module.status);
}

export async function loadLearningPaths() {
  const response = await fetch('./content/learning-paths.json', { cache: 'no-cache' });
  if (!response.ok) throw new Error('Lernpfade konnten nicht geladen werden.');
  const data = await response.json();
  return Array.isArray(data.paths) ? data.paths : [];
}

export async function getPathContext(pathId) {
  const [paths, registry] = await Promise.all([loadLearningPaths(), loadRegistry()]);
  const path = paths.find(p => p.id === pathId);
  if (!path) return null;
  const modules = path.moduleIds.map(id => registry.modules.find(m => m.id === id));
  if (modules.some(m => !isAvailable(m))) return null;
  return { path, modules };
}

export function getPathSummary(path, modules, progress = loadProgress()) {
  const entries = modules.map(m => ({ module: m, progress: progress.modules[m.id] || {} }));
  const completed = entries.filter(e => e.progress.status === 'completed').length;
  const begun = entries.filter(e => e.progress.status === 'in-progress')
    .sort((a, b) => String(b.progress.lastAccess || '').localeCompare(String(a.progress.lastAccess || '')));
  const next = begun[0]?.module || entries.find(e => e.progress.status !== 'completed')?.module || modules[0];
  return { completed, started: completed > 0 || begun.length > 0, total: modules.length, next,
    percent: modules.length ? Math.round(completed / modules.length * 100) : 0,
    minutes: modules.reduce((sum, m) => sum + Number(m.estimatedMinutes || 0), 0),
    pilot: modules.some(m => m.status === 'review') };
}

export function matchesYear(module, settings = loadSettings()) {
  const year = String(settings.lehrjahr || 'alle');
  return year === 'alle' || (module.lehrjahr || []).map(String).includes(year);
}

export function moduleLink(moduleId, context = {}) {
  const query = new URLSearchParams();
  if (context.path) query.set('path', context.path);
  else if (context.from) query.set('from', context.from);
  return '#/module/' + encodeURIComponent(moduleId) + (query.size ? '?' + query : '');
}

