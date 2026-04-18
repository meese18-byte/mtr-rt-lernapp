// util.js - kleine Helferfunktionen

/**
 * HTML-escape für beliebige Strings. Pflicht vor Einfügen in innerHTML.
 */
export function esc(s) {
  if (s === undefined || s === null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Bewusst minimaler Markdown-Renderer für Infotexte.
 * Unterstützt: #-Überschriften, Absätze, Aufzählungen (-), **fett**, *kursiv*, [Link](url), Bilder ![alt](src).
 * Kein XSS-Schutz über Nutzereingaben - Infotexte sind vertrauenswürdige Projektdateien.
 */
export function renderMarkdownSimple(md) {
  // YAML-Frontmatter entfernen
  md = md.replace(/^---[\s\S]*?---\s*/m, '');

  const lines = md.split(/\r?\n/);
  const out = [];
  let inList = false;
  let para = [];

  const flushPara = () => {
    if (para.length) {
      out.push('<p>' + inlineFormat(para.join(' ')) + '</p>');
      para = [];
    }
  };
  const closeList = () => {
    if (inList) { out.push('</ul>'); inList = false; }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushPara(); closeList(); continue; }

    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flushPara(); closeList();
      const level = m[1].length;
      out.push(`<h${level}>${inlineFormat(m[2])}</h${level}>`);
      continue;
    }
    if ((m = line.match(/^[-*]\s+(.*)$/))) {
      flushPara();
      if (!inList) { out.push('<ul>'); inList = true; }
      out.push('<li>' + inlineFormat(m[1]) + '</li>');
      continue;
    }
    closeList();
    para.push(line);
  }
  flushPara(); closeList();
  return out.join('\n');
}

function inlineFormat(s) {
  // Bilder vor Links verarbeiten
  s = s.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => `<img src="${esc(src)}" alt="${esc(alt)}">`);
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, t, u) => `<a href="${esc(u)}">${esc(t)}</a>`);
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return s;
}

/**
 * Rendert ein Medien-Objekt (Bild, lokales Video, Embed, Link) als DOM-Element.
 */
export function renderMedia(m) {
  if (!m || !m.type) return null;

  if (m.type === 'image') {
    const fig = document.createElement('figure');
    fig.innerHTML = `<img src="${esc(m.src)}" alt="${esc(m.alt || '')}" loading="lazy">`;
    if (m.caption) fig.innerHTML += `<figcaption>${esc(m.caption)}</figcaption>`;
    return fig;
  }

  if (m.type === 'video-local') {
    const fig = document.createElement('figure');
    const vid = document.createElement('video');
    vid.controls = true;
    vid.preload = 'metadata';
    if (m.poster) vid.poster = m.poster;
    vid.innerHTML = `<source src="${esc(m.src)}" type="video/mp4">
      Ihr Browser unterstützt das Video-Tag nicht.`;
    fig.appendChild(vid);
    if (m.caption) fig.innerHTML += `<figcaption>${esc(m.caption)}</figcaption>`;
    return fig;
  }

  if (m.type === 'video-embed') {
    const fig = document.createElement('figure');
    fig.innerHTML = `<iframe src="${esc(m.embedUrl)}" loading="lazy"
        width="100%" height="400" frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen title="${esc(m.caption || 'Video')}"></iframe>
      <noscript>Video nur mit aktivem JavaScript verfügbar. Direkter Link: <a href="${esc(m.embedUrl)}">${esc(m.embedUrl)}</a></noscript>`;
    if (m.caption) fig.innerHTML += `<figcaption>${esc(m.caption)}</figcaption>`;
    return fig;
  }

  if (m.type === 'link') {
    const p = document.createElement('p');
    p.innerHTML = `<a href="${esc(m.href)}" target="_blank" rel="noopener noreferrer">${esc(m.label || m.href)}</a>`;
    return p;
  }

  return null;
}

/**
 * Fisher-Yates-Shuffle. Gibt ein neues Array zurück.
 */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
