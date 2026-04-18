// registry.js - lädt modules-registry.json und einzelne Module

const REGISTRY_URL = './content/modules-registry.json';
let registryCache = null;

export async function loadRegistry() {
  if (registryCache) return registryCache;
  try {
    const res = await fetch(REGISTRY_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    registryCache = await res.json();
    return registryCache;
  } catch (e) {
    console.error('Registry konnte nicht geladen werden.', e);
    return { modules: [] };
  }
}

export async function loadModule(id) {
  const url = `./content/modules/${id}.json`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Modul nicht gefunden: ' + id);
  return await res.json();
}

export async function loadInfotext(id) {
  const url = `./content/infotexte/${id}.md`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Infotext nicht gefunden: ' + id);
  return await res.text();
}
