// exit-slip.js - Wiederverwendbare Exit-Slip-Komponente (Baustelle E)
//
// Querschnittsfunktion gemaess ARCHITECTURE.md §14.1 und MODUL-SCHEMA-V2 §6.
// Default-Slip: 3 Fragen (Freitext / Freitext / Skala 1-5).
// Modul-spezifische Ueberschreibung via module.exitSlip (Top-Level, v2-Schema)
// oder module.body.exitSlip (Uebergangs-Pragmatik).
//
// Persistenz:  localStorage["mtr_rt_exitslips"]
//   {
//     "<moduleId>": [
//       { "ts": "<ISO-Datum>", "antworten": { "<feldId>": <wert>, ... } }
//     ]
//   }
//
// API:
//   mountExitSlip(viewEl, module)        - Footer am Ende des Modul-Containers anhaengen
//   getAllExitSlips()                    - Alle Eintraege (fuer Export)
//   replaceAllExitSlips(obj)             - Komplettersatz (fuer Import)
//   resetAllExitSlips()                  - Alles loeschen (fuer Reset)
//
// Hinweis: Optional auszufuellen. Keine Pflichtfeld-Validierung (nur Skala-Range).
// Mehrfaches Speichern erlaubt - jeder Submit ergibt einen neuen Array-Eintrag.

import { esc } from './util.js';

const KEY_EXITSLIPS = 'mtr_rt_exitslips';

const DEFAULT_SLIP = {
  fragen: [
    { id: 'es-1', label: 'Was war neu fuer dich?',                  type: 'freitext' },
    { id: 'es-2', label: 'Was ist noch unklar?',                    type: 'freitext' },
    { id: 'es-3', label: 'Wie sicher fuehlst du dich jetzt? (1-5)', type: 'skala', min: 1, max: 5 }
  ]
};

// --------------------------------------------------------------------
// Storage-Wrapper
// --------------------------------------------------------------------

function loadExitSlips() {
  try {
    const raw = localStorage.getItem(KEY_EXITSLIPS);
    if (!raw) return {};
    const data = JSON.parse(raw);
    return (data && typeof data === 'object') ? data : {};
  } catch (e) {
    console.warn('[exit-slip] localStorage konnte nicht gelesen werden, starte leer.', e);
    return {};
  }
}

function saveExitSlips(obj) {
  try {
    localStorage.setItem(KEY_EXITSLIPS, JSON.stringify(obj));
  } catch (e) {
    console.warn('[exit-slip] Speichern fehlgeschlagen.', e);
  }
}

export function getAllExitSlips() {
  return loadExitSlips();
}

export function replaceAllExitSlips(obj) {
  if (!obj || typeof obj !== 'object') {
    saveExitSlips({});
    return;
  }
  saveExitSlips(obj);
}

export function resetAllExitSlips() {
  localStorage.removeItem(KEY_EXITSLIPS);
}

// --------------------------------------------------------------------
// Schema-Resolver
// --------------------------------------------------------------------

function resolveSlip(module) {
  // Reihenfolge: Top-Level (v2) -> body (Pragmatik) -> Default.
  const candidates = [
    module && module.exitSlip,
    module && module.body && module.body.exitSlip
  ];
  for (const c of candidates) {
    if (c && Array.isArray(c.fragen) && c.fragen.length > 0) {
      return c;
    }
  }
  return DEFAULT_SLIP;
}

// --------------------------------------------------------------------
// Rendering
// --------------------------------------------------------------------

export function mountExitSlip(viewEl, module) {
  if (!viewEl || !module || !module.id) return;
  // Duplikatsschutz: falls render() einer View mehrfach aufgerufen wird.
  if (viewEl.querySelector('.exit-slip')) return;

  const slip = resolveSlip(module);
  const moduleId = module.id;

  const details = document.createElement('details');
  details.className = 'exit-slip';
  details.innerHTML = `
    <summary>Exit-Slip: Kurze Selbstreflexion (optional)</summary>
    <form class="exit-slip-form" novalidate>
      <p class="exit-slip-intro muted">
        Deine Antworten bleiben nur auf diesem Geraet. Kein Versand, keine Auswertung durch Dritte.
      </p>
      <div class="exit-slip-fields"></div>
      <div class="btn-row">
        <button type="submit" class="btn">Exit-Slip speichern</button>
      </div>
      <p class="exit-slip-status" role="status" aria-live="polite"></p>
    </form>
    <section class="exit-slip-history" aria-label="Frueher gespeicherte Exit-Slips">
      <h3 class="exit-slip-history-head">Frueher gespeichert</h3>
      <ol class="exit-slip-history-list"></ol>
    </section>
  `;

  const fieldsWrap = details.querySelector('.exit-slip-fields');
  slip.fragen.forEach(frage => fieldsWrap.appendChild(buildField(frage)));

  const form = details.querySelector('.exit-slip-form');
  const statusEl = details.querySelector('.exit-slip-status');
  const historyList = details.querySelector('.exit-slip-history-list');

  // History initial befuellen
  renderHistory(historyList, moduleId, slip);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const antworten = collectAnswers(fieldsWrap, slip);
    const skalaCheck = validateSkala(slip, antworten);
    if (!skalaCheck.ok) {
      statusEl.textContent = skalaCheck.error;
      statusEl.className = 'exit-slip-status error';
      return;
    }

    const all = loadExitSlips();
    if (!Array.isArray(all[moduleId])) all[moduleId] = [];
    all[moduleId].push({
      ts: new Date().toISOString(),
      antworten
    });
    saveExitSlips(all);

    // Form zuruecksetzen und Bestaetigung anzeigen
    form.reset();
    statusEl.textContent = 'Gespeichert.';
    statusEl.className = 'exit-slip-status ok';
    setTimeout(() => {
      // Status nach kurzer Zeit ausblenden, History bleibt aktuell.
      if (statusEl.textContent === 'Gespeichert.') {
        statusEl.textContent = '';
        statusEl.className = 'exit-slip-status';
      }
    }, 3000);
    renderHistory(historyList, moduleId, slip);
  });

  viewEl.appendChild(details);
}

// --------------------------------------------------------------------
// Hilfsfunktionen
// --------------------------------------------------------------------

function buildField(frage) {
  const wrap = document.createElement('div');
  wrap.className = 'exit-slip-field';
  const id = `es-field-${frage.id}`;

  if (frage.type === 'skala') {
    const min = Number.isFinite(frage.min) ? frage.min : 1;
    const max = Number.isFinite(frage.max) ? frage.max : 5;
    const options = [];
    for (let v = min; v <= max; v++) {
      const optId = `${id}-${v}`;
      options.push(`
        <label class="exit-slip-skala-opt" for="${optId}">
          <input type="radio" id="${optId}" name="${id}" value="${v}" data-field="${esc(frage.id)}" data-type="skala">
          <span>${v}</span>
        </label>
      `);
    }
    wrap.innerHTML = `
      <fieldset class="exit-slip-skala">
        <legend>${esc(frage.label)}</legend>
        <div class="exit-slip-skala-row">${options.join('')}</div>
      </fieldset>
    `;
    return wrap;
  }

  // Default: Freitext
  wrap.innerHTML = `
    <label for="${id}">${esc(frage.label)}</label>
    <textarea id="${id}" rows="3" data-field="${esc(frage.id)}" data-type="freitext"></textarea>
  `;
  return wrap;
}

function collectAnswers(fieldsWrap, slip) {
  const antworten = {};
  slip.fragen.forEach(frage => {
    if (frage.type === 'skala') {
      const checked = fieldsWrap.querySelector(`input[data-field="${cssEscape(frage.id)}"]:checked`);
      antworten[frage.id] = checked ? Number(checked.value) : null;
    } else {
      const ta = fieldsWrap.querySelector(`textarea[data-field="${cssEscape(frage.id)}"]`);
      antworten[frage.id] = ta ? ta.value.trim() : '';
    }
  });
  return antworten;
}

function validateSkala(slip, antworten) {
  for (const frage of slip.fragen) {
    if (frage.type !== 'skala') continue;
    const v = antworten[frage.id];
    if (v === null || v === undefined || v === '') continue; // optional
    const min = Number.isFinite(frage.min) ? frage.min : 1;
    const max = Number.isFinite(frage.max) ? frage.max : 5;
    if (!Number.isFinite(v) || v < min || v > max) {
      return { ok: false, error: `Skala "${frage.label}" muss zwischen ${min} und ${max} liegen.` };
    }
  }
  return { ok: true };
}

function renderHistory(listEl, moduleId, slip) {
  const all = loadExitSlips();
  const entries = Array.isArray(all[moduleId]) ? all[moduleId].slice() : [];
  if (entries.length === 0) {
    listEl.innerHTML = '<li class="muted">Noch keine Eintraege.</li>';
    return;
  }
  // Neueste zuerst
  entries.sort((a, b) => (b.ts || '').localeCompare(a.ts || ''));
  listEl.innerHTML = '';
  entries.forEach(entry => {
    const li = document.createElement('li');
    li.className = 'exit-slip-history-item';
    const dt = formatDate(entry.ts);
    const rows = slip.fragen.map(frage => {
      const wert = entry.antworten ? entry.antworten[frage.id] : '';
      const wertEsc = (wert === null || wert === undefined || wert === '') ? '<em class="muted">leer</em>' : esc(String(wert));
      return `<div class="exit-slip-history-row"><strong>${esc(frage.label)}</strong><span>${wertEsc}</span></div>`;
    }).join('');
    li.innerHTML = `<time class="exit-slip-history-ts">${esc(dt)}</time>${rows}`;
    listEl.appendChild(li);
  });
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const mi = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy}, ${hh}:${mi}`;
  } catch (e) {
    return iso;
  }
}

// CSS.escape ist breit unterstuetzt, aber wir bauen einen schmalen Fallback,
// falls ein alter Browser den nicht hat. Felder kommen aus dem Modul-JSON,
// nicht aus Nutzereingaben - dennoch sauber escapen.
function cssEscape(s) {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') return CSS.escape(s);
  return String(s).replace(/[^a-zA-Z0-9_-]/g, c => '\\' + c);
}
