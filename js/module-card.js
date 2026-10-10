import { esc } from './util.js';
import { moduleLink } from './learning-paths.js';

export function buildCard(mod, progress, context = {}) {
  const a = document.createElement('a');
  a.className = 'module-card';

  const isLegacy = mod.status === 'legacy' || mod.legacy;
  a.href = isLegacy && mod.file ? mod.file : moduleLink(mod.id, context);

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
    ? `<p class="module-prereq muted">Vorher sinnvoll: ${esc(mod.voraussetzungen.map(id => (context.registryModules || []).find(m => m.id === id)?.title || 'Grundlagenmodul').join(', '))}</p>`
    : '';

  a.innerHTML = `
    <h3>${esc(mod.title)}</h3>
    <div class="meta">
      <span class="badge type-${esc(isLegacy ? 'legacy' : mod.type)}">${esc(isLegacy ? 'Legacy-Lernsequenz' : typeLabel(mod.type))}</span>
      ${dutyBadge}
      ${yearBadge}
      ${timeBadge}
      ${statusBadge}
      ${mod.status === "review" ? '<span class="badge">Pilotfassung</span>' : ""}
    </div>
    ${prereqHint}
  `;
  return a;
}

export function typeLabel(t) {
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

