// registry.js - lädt Registry, Module und Infotexte

const REGISTRY_URL = './content/modules-registry.json';
const LEARNING_PATHS_URL = './content/learning-paths.json';
const MODULE_ID_ALIASES = {
  'prostata-planungs-ct-enddarm': '05-enddarmvorbereitung-becken'
};
let registryCache = null;
let learningPathsCache = null;

export function resolveModuleId(id) {
  return MODULE_ID_ALIASES[id] || id;
}

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
  const resolvedId = resolveModuleId(id);
  const [registry, res] = await Promise.all([
    loadRegistry(),
    fetch(`./content/modules/${resolvedId}.json`, { cache: 'no-cache' })
  ]);
  if (!res.ok) throw new Error('Modul nicht gefunden: ' + resolvedId);

  const raw = await res.json();
  const meta = registry.modules.find(m => m.id === resolvedId) || {};

  // V3: Registry ist die kanonische Quelle für organisatorische Metadaten.
  // Legacy-Doppelungen in Moduldateien werden dadurch kontrolliert überschrieben.
  return {
    ...raw,
    ...meta,
    id: resolvedId,
    body: raw.body || {}
  };
}

export async function loadInfotext(id) {
  const url = `./content/infotexte/${id}.md`;
  const res = await fetch(url, { cache: 'no-cache' });
  if (!res.ok) throw new Error('Infotext nicht gefunden: ' + id);
  return await res.text();
}


export async function loadLearningPaths() {
  if (learningPathsCache) return learningPathsCache;
  try {
    const res = await fetch(LEARNING_PATHS_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    learningPathsCache = await res.json();
    return learningPathsCache;
  } catch (e) {
    console.error('Lernpfade konnten nicht geladen werden.', e);
    return { paths: [] };
  }
}
