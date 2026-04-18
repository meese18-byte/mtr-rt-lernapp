// storage.js - localStorage-Wrapper + Export/Import
// Alle Keys mit Präfix mtr_rt_.

const PREFIX = 'mtr_rt_';
const KEY_PROGRESS = PREFIX + 'progress';
const SCHEMA_VERSION = 1;

function defaultProgress() {
  return {
    version: SCHEMA_VERSION,
    modules: {},
    settings: { anrede: 'du' }
  };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY_PROGRESS);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    // Einfache Migrations-Fallback-Logik
    if (!data.version || data.version < SCHEMA_VERSION) {
      return { ...defaultProgress(), ...data, version: SCHEMA_VERSION };
    }
    return data;
  } catch (e) {
    console.warn('Progress konnte nicht geladen werden, wird zurückgesetzt.', e);
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(KEY_PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.warn('Progress konnte nicht gespeichert werden.', e);
  }
}

export function resetProgress() {
  localStorage.removeItem(KEY_PROGRESS);
}

export function exportProgressAsFile() {
  const data = loadProgress();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `mtr-rt-fortschritt-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importProgressFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object' || !data.modules) {
          reject(new Error('Datei hat nicht das erwartete Format.'));
          return;
        }
        saveProgress({ ...defaultProgress(), ...data, version: SCHEMA_VERSION });
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
