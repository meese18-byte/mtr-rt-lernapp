// progress.js - Fortschritts-Logik pro Modul

import { loadProgress, saveProgress } from './storage.js';

export function getModuleProgress(moduleId) {
  const p = loadProgress();
  return p.modules[moduleId] || { status: 'not-started', attempts: 0 };
}

export function markModuleStarted(moduleId) {
  const p = loadProgress();
  const m = p.modules[moduleId] || {};
  if (m.status !== 'completed') m.status = 'in-progress';
  m.lastAccess = new Date().toISOString();
  p.modules[moduleId] = m;
  saveProgress(p);
}

export function markModuleCompleted(moduleId, correctRate = null) {
  const p = loadProgress();
  const m = p.modules[moduleId] || { attempts: 0 };
  m.status = 'completed';
  m.lastAccess = new Date().toISOString();
  m.attempts = (m.attempts || 0) + 1;
  if (correctRate !== null) m.correctRate = correctRate;
  p.modules[moduleId] = m;
  saveProgress(p);
}

export function getOverallProgress(registry) {
  const p = loadProgress();
  const total = registry.modules.length;
  if (total === 0) return { total: 0, completed: 0, percent: 0 };
  const completed = registry.modules.filter(m => {
    const entry = p.modules[m.id];
    return entry && entry.status === 'completed';
  }).length;
  return { total, completed, percent: Math.round((completed / total) * 100) };
}
