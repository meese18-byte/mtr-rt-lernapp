#!/usr/bin/env node
'use strict';

/**
 * V3 content validator.
 * Run from repository root:
 *   node tools/validate-content.js
 *
 * No dependencies, no build step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'content', 'modules-registry.json');
const LEARNING_PATHS_PATH = path.join(ROOT, 'content', 'learning-paths.json');
const ITEMBANK_INDEX_PATH = path.join(ROOT, 'content', 'itembank', 'index.json');
const MODULE_DIR = path.join(ROOT, 'content', 'modules');

const ACTIVE_TYPES = new Set(['knowledge', 'case', 'image-analysis', 'quiz', 'transfer']);
const STATUSES = new Set(['planned', 'draft', 'review', 'live', 'legacy']);
const DUTY = new Set(['pflicht', 'vertiefung', 'exkurs']);
const MODES = new Set(['online_solo', 'praesenz_gekoppelt', 'hybrid']);

const errors = [];
const warnings = [];

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    errors.push(`JSON nicht lesbar: ${path.relative(ROOT, file)} – ${err.message}`);
    return null;
  }
}

function exists(rel) {
  return fs.existsSync(path.join(ROOT, rel));
}

function err(msg) { errors.push(msg); }
function warn(msg) { warnings.push(msg); }

const registry = readJson(REGISTRY_PATH);
if (!registry || !Array.isArray(registry.modules)) {
  err('content/modules-registry.json muss ein modules[]-Array enthalten.');
  finish();
}

const ids = new Set();
const positionKeys = new Set();
const required = [
  'id', 'title', 'type', 'kapitel', 'reihenfolge', 'pflichtgrad',
  'status', 'mode', 'lehrjahr', 'tags', 'estimatedMinutes'
];

for (const mod of registry.modules) {
  const id = mod && mod.id ? String(mod.id) : '(ohne id)';

  for (const field of required) {
    if (mod[field] === undefined || mod[field] === null) {
      err(`${id}: Registry-Pflichtfeld fehlt: ${field}`);
    }
  }

  if (ids.has(id)) err(`Doppelte Modul-ID: ${id}`);
  ids.add(id);

  const isLegacy = mod.status === 'legacy' || mod.legacy === true;

  if (!STATUSES.has(mod.status)) err(`${id}: ungültiger status "${mod.status}"`);

  if (isLegacy) {
    if (mod.type !== 'sequence') {
      warn(`${id}: Legacy-Eintrag nutzt Typ "${mod.type}". Prüfen, ob Archivierung statt Registry-Eintrag sinnvoll ist.`);
    } else {
      warn(`${id}: Legacy-sequence vorhanden – in Standardmodule migrieren.`);
    }
  } else {
    if (!ACTIVE_TYPES.has(mod.type)) err(`${id}: aktiver Modultyp "${mod.type}" ist in V3 nicht erlaubt.`);
    if (!/^\d{2}-[a-z0-9-]{1,40}$/.test(id)) {
      err(`${id}: Modul-ID verletzt das V3-Schema <NN>-<kurzname>.`);
    }
  }

  const chapter = Number(mod.kapitel);
  if (!Number.isInteger(chapter) || chapter < 1 || chapter > 14) {
    err(`${id}: kapitel muss eine Ganzzahl von 1 bis 14 sein.`);
  }

  const order = Number(mod.reihenfolge);
  if (!Number.isInteger(order) || order < 1) {
    err(`${id}: reihenfolge muss eine positive Ganzzahl sein.`);
  } else if (!isLegacy) {
    const pos = `${chapter}:${order}`;
    if (positionKeys.has(pos)) err(`${id}: doppelte aktive Kapitelposition ${pos}.`);
    positionKeys.add(pos);
  }

  if (!DUTY.has(mod.pflichtgrad)) err(`${id}: ungültiger pflichtgrad "${mod.pflichtgrad}".`);
  if (!MODES.has(mod.mode)) err(`${id}: ungültiger mode "${mod.mode}".`);
  if (!Array.isArray(mod.lehrjahr) || mod.lehrjahr.some(y => ![1, 2, 3].includes(Number(y)))) {
    err(`${id}: lehrjahr muss ein Array aus 1, 2, 3 sein.`);
  }
  if (!Array.isArray(mod.tags) || mod.tags.length === 0) err(`${id}: tags[] fehlt oder ist leer.`);
  if (!(Number(mod.estimatedMinutes) > 0)) err(`${id}: estimatedMinutes muss > 0 sein.`);

  for (const prereq of (mod.voraussetzungen || [])) {
    if (!registry.modules.some(m => m.id === prereq)) {
      err(`${id}: Voraussetzung verweist auf unbekannte Modul-ID "${prereq}".`);
    }
  }

  if (isLegacy && mod.file) {
    if (!exists(mod.file)) err(`${id}: Legacy-Datei fehlt: ${mod.file}`);
    continue;
  }

  const moduleRel = `content/modules/${id}.json`;
  if (['planned'].includes(mod.status) && !exists(moduleRel)) {
    continue;
  }
  if (!exists(moduleRel)) {
    err(`${id}: Moduldatei fehlt: ${moduleRel}`);
    continue;
  }

  const moduleJson = readJson(path.join(ROOT, moduleRel));
  if (!moduleJson) continue;
  if (moduleJson.id !== id) {
    err(`${id}: id in Moduldatei ist "${moduleJson.id}".`);
  }
}

// Verwaiste Moduldateien melden.
if (fs.existsSync(MODULE_DIR)) {
  for (const file of fs.readdirSync(MODULE_DIR).filter(f => f.endsWith('.json'))) {
    const id = file.replace(/\.json$/i, '');
    if (!ids.has(id)) warn(`Verwaiste Moduldatei ohne Registry-Eintrag: content/modules/${file}`);
  }
}

// ItemRefs prüfen.
const itemIndex = readJson(ITEMBANK_INDEX_PATH);
const itemIds = new Set(itemIndex && Array.isArray(itemIndex.items) ? itemIndex.items.map(i => i.id) : []);

for (const mod of registry.modules.filter(m => m.status !== 'legacy' && !m.legacy)) {
  const file = path.join(MODULE_DIR, `${mod.id}.json`);
  if (!fs.existsSync(file)) continue;
  const obj = readJson(file);
  if (!obj) continue;
  const refs = new Set();
  const body = obj.body || {};
  for (const ref of (body.itemRefs || [])) refs.add(ref);
  for (const ref of ((body.followUpQuiz && body.followUpQuiz.itemRefs) || [])) refs.add(ref);
  for (const ref of refs) {
    if (!itemIds.has(ref)) err(`${mod.id}: unbekannte Itembank-Referenz "${ref}".`);
  }
  if (mod.type === 'quiz' && Array.isArray(body.questions) && body.questions.length) {
    warn(`${mod.id}: nutzt Legacy-Quizformat body.questions[]; auf itemRefs migrieren.`);
  }
}

// Lernpfade prüfen.
if (fs.existsSync(LEARNING_PATHS_PATH)) {
  const lp = readJson(LEARNING_PATHS_PATH);
  if (lp && Array.isArray(lp.paths)) {
    const pathIds = new Set();
    for (const learningPath of lp.paths) {
      if (!learningPath.id) {
        err('Lernpfad ohne id.');
        continue;
      }
      if (pathIds.has(learningPath.id)) err(`Doppelte Lernpfad-ID: ${learningPath.id}`);
      pathIds.add(learningPath.id);
      if (!Array.isArray(learningPath.moduleIds) || learningPath.moduleIds.length === 0) {
        warn(`${learningPath.id}: Lernpfad hat noch keine moduleIds.`);
      }
      for (const moduleId of (learningPath.moduleIds || [])) {
        const target = registry.modules.find(m => m.id === moduleId);
        if (!target) {
          err(`${learningPath.id}: verweist auf unbekanntes Modul "${moduleId}".`);
        } else if (target.status === 'legacy' || target.legacy) {
          err(`${learningPath.id}: darf kein Legacy-Modul referenzieren ("${moduleId}").`);
        }
      }
    }
  }
}

finish();

function finish() {
  console.log('MTR RT Lernapp – V3 Content Validator');
  console.log('-------------------------------------');

  for (const msg of warnings) console.log('WARN  ' + msg);
  for (const msg of errors) console.error('ERROR ' + msg);

  console.log(`\nErgebnis: ${errors.length} Fehler, ${warnings.length} Warnung(en).`);
  process.exitCode = errors.length ? 1 : 0;
}
