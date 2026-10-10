// Optionale eigene Begründung innerhalb der vorhandenen Modultypen.
import { esc } from './util.js';

export function mountOwnResponse(parent, body, optionsContainer) {
  if (!body.ownResponsePrompt) return;
  optionsContainer.hidden = true;
  const section = document.createElement('section');
  section.className = 'own-response';
  section.innerHTML = '<h2>Deine Beobachtung und Begründung</h2>'
    + '<label for="own-response-text">' + esc(body.ownResponsePrompt) + '</label>'
    + '<textarea id="own-response-text" rows="4" aria-describedby="own-response-note"></textarea>'
    + '<p id="own-response-note" class="muted">Deine Notiz bleibt während dieser Bearbeitung sichtbar. Sie wird beim Verlassen der Ansicht nicht gespeichert.</p>'
    + '<p class="own-response-error" role="status"></p>'
    + '<button type="button" class="btn secondary">Begründung festhalten und Optionen vergleichen</button>';
  parent.insertBefore(section, optionsContainer);
  const field = section.querySelector('textarea');
  const button = section.querySelector('button');
  button.addEventListener('click', () => {
    const words = field.value.trim().split(/\s+/).filter(Boolean).length;
    const minimum = Number(body.ownResponseMinWords || 10);
    if (words < minimum) {
      section.querySelector('.own-response-error').textContent = 'Formuliere mindestens ' + minimum + ' Wörter; aktuell ' + words + '.';
      field.focus();
      return;
    }
    section.querySelector('.own-response-error').textContent = '';
    field.readOnly = true;
    button.disabled = true;
    optionsContainer.hidden = false;
    optionsContainer.querySelector('button')?.focus();
  });
}

