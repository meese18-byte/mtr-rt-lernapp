// storage.js - localStorage-Wrapper + Combined Export/Import
//
// Baustelle E: Export/Import umfasst jetzt alle vier App-Keys
// (ARCHITECTURE.md §7.1):
//   - mtr_rt_progress         (Modul-Fortschritt)
//   - mtr_rt_settings         (globale Einstellungen, separater Key)
//   - mtr_rt_quiz_progress    (Quiz-Engine, Leitner-Boxen)
//   - mtr_rt_exitslips        (Exit-Slip-Antworten)
//
// Backward-Compat:
//   Alte Exports enthielten direkt das mtr_rt_progress-Objekt
//   ({version, modules, settings}). Diese werden beim Import erkannt und
//   ausschliesslich in mtr_rt_progress gespiegelt.

const PREFIX = 'mtr_rt_';
const KEY_PROGRESS      = PREFIX + 'progress';
const KEY_SETTINGS      = PREFIX + 'settings';
const KEY_QUIZ_PROGRESS = PREFIX + 'quiz_progress';
const KEY_EXITSLIPS     = PREFIX + 'exitslips';

const SCHEMA_VERSION = 1;
const EXPORT_SCHEMA = 'mtr-rt-export';
const EXPORT_SCHEMA_VERSION = 2;

function defaultProgress() {
  return {
    version: SCHEMA_VERSION,
    modules: {},
    settings: { anrede: 'du' }
  };
}

// --------------------------------------------------------------------
// Progress (mtr_rt_progress)
// --------------------------------------------------------------------

export function loadProgress() {
  try {
    const raw = localStorage.getItem(KEY_PROGRESS);
    if (!raw) return defaultProgress();
    const data = JSON.parse(raw);
    if (!data.version || data.version < SCHEMA_VERSION) {
      return { ...defaultProgress(), ...data, version: SCHEMA_VERSION };
    }
    return data;
  } catch (e) {
    console.warn('Progress konnte nicht geladen werden, wird zurueckgesetzt.', e);
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

// --------------------------------------------------------------------
// Reset: alle vier App-Keys loeschen
// --------------------------------------------------------------------

export function resetProgress() {
  // Bewusst alle vier App-Keys, damit "Reset" auch tatsaechlich "alles" loescht.
  localStorage.removeItem(KEY_PROGRESS);
  localStorage.removeItem(KEY_SETTINGS);
  localStorage.removeItem(KEY_QUIZ_PROGRESS);
  localStorage.removeItem(KEY_EXITSLIPS);
}

// --------------------------------------------------------------------
// Combined Export
// --------------------------------------------------------------------

function readRaw(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`[storage] Konnte ${key} nicht parsen, exportiere null.`, e);
    return null;
  }
}

function buildCombinedExport() {
  return {
    schema: EXPORT_SCHEMA,
    schemaVersion: EXPORT_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    progress:      readRaw(KEY_PROGRESS)      || defaultProgress(),
    settings:      readRaw(KEY_SETTINGS)      || null,
    quiz_progress: readRaw(KEY_QUIZ_PROGRESS) || null,
    exitslips:     readRaw(KEY_EXITSLIPS)     || {}
  };
}

export function exportProgressAsFile() {
  const data = buildCombinedExport();
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

// --------------------------------------------------------------------
// Combined Import (mit Legacy-Erkennung)
// --------------------------------------------------------------------

function writeRaw(key, value) {
  if (value === null || value === undefined) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storage] Konnte ${key} nicht schreiben.`, e);
  }
}

function applyCombinedImport(data) {
  // Neuer Container (Baustelle E): selektiv pro Key schreiben.
  if (data.progress && typeof data.progress === 'object') {
    saveProgress({ ...defaultProgress(), ...data.progress, version: SCHEMA_VERSION });
  }
  if (data.settings && typeof data.settings === 'object') {
    writeRaw(KEY_SETTINGS, data.settings);
  }
  if (data.quiz_progress && typeof data.quiz_progress === 'object') {
    writeRaw(KEY_QUIZ_PROGRESS, data.quiz_progress);
  }
  if (data.exitslips && typeof data.exitslips === 'object') {
    writeRaw(KEY_EXITSLIPS, data.exitslips);
  }
}

function applyLegacyImport(data) {
  // Legacy-Export hatte direkt das mtr_rt_progress-Objekt: {version?, modules, settings?}.
  console.warn('[storage] Legacy-Importformat erkannt. Es wird nur der Modul-Fortschritt uebernommen, Quiz- und Exit-Slip-Daten fehlen in dieser Datei.');
  saveProgress({ ...defaultProgress(), ...data, version: SCHEMA_VERSION });
}

export function importProgressFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!data || typeof data !== 'object') {
          reject(new Error('Datei hat nicht das erwartete Format.'));
          return;
        }
        if (data.schema === EXPORT_SCHEMA) {
          applyCombinedImport(data);
        } else if (data.modules && typeof data.modules === 'object') {
          applyLegacyImport(data);
        } else {
          reject(new Error('Datei hat nicht das erwartete Format.'));
          return;
        }
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
