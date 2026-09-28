#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const registry = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/modules-registry.json'), 'utf8'));
const itemIndex = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/itembank/index.json'), 'utf8'));

const active = (registry.modules || []).filter(m => m.status !== 'legacy' && !m.legacy);
const items = itemIndex.items || [];

console.log('MTR RT Lernapp – Redundanzcheck');
console.log('-------------------------------');

// 1) Itempaare mit >= 3 gemeinsamen Tags.
let itemWarnings = 0;
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    const a = new Set(items[i].tags || []);
    const shared = (items[j].tags || []).filter(t => a.has(t));
    if (shared.length >= 3) {
      itemWarnings++;
      console.log(`WARN Item-Overlap: ${items[i].id} ↔ ${items[j].id} | gemeinsame Tags: ${shared.join(', ')}`);
    }
  }
}

// 2) Modulpaare mit >= 80 % Tag-Überdeckung bezogen auf die kleinere Tagmenge.
let moduleWarnings = 0;
for (let i = 0; i < active.length; i++) {
  for (let j = i + 1; j < active.length; j++) {
    const a = new Set(active[i].tags || []);
    const b = new Set(active[j].tags || []);
    const minSize = Math.min(a.size, b.size);
    if (!minSize) continue;
    let shared = 0;
    for (const tag of a) if (b.has(tag)) shared++;
    const overlap = shared / minSize;
    if (overlap >= 0.8) {
      moduleWarnings++;
      console.log(`WARN Modul-Overlap: ${active[i].id} ↔ ${active[j].id} | ${Math.round(overlap * 100)} %`);
    }
  }
}

// 3) Wiederverwendung von ItemRefs (Info, kein Fehler).
const refs = new Map();
for (const mod of active) {
  const file = path.join(ROOT, 'content', 'modules', mod.id + '.json');
  if (!fs.existsSync(file)) continue;
  const obj = JSON.parse(fs.readFileSync(file, 'utf8'));
  const body = obj.body || {};
  const found = [
    ...(Array.isArray(body.itemRefs) ? body.itemRefs : []),
    ...(body.followUpQuiz && Array.isArray(body.followUpQuiz.itemRefs) ? body.followUpQuiz.itemRefs : [])
  ];
  for (const id of found) {
    if (!refs.has(id)) refs.set(id, []);
    refs.get(id).push(mod.id);
  }
}
for (const [id, modules] of refs.entries()) {
  if (modules.length >= 2) {
    console.log(`INFO Wiederverwendetes Item: ${id} in ${modules.join(', ')}`);
  }
}

console.log(`\nErgebnis: ${itemWarnings} Item-Warnung(en), ${moduleWarnings} Modul-Warnung(en).`);
