# Quiz-Engine-Spec (final)

**Status:** Entwurf zur Aufnahme in ARCHITECTURE.md
**Datum:** 2026-05-18
**Datei (zukünftig):** `js/quiz-engine.js`

---

## 1. Zweck

Eine wiederverwendbare, kontextfreie JavaScript-Engine, die in der Lernapp **und** in jedem Standalone (Lernsequenz) gleichermaßen Quiz-Items abspielt. Implementiert die SuS-Anforderungen self-first, Leitner-light, persistenter Item-Status.

---

## 2. Designprinzipien

1. **Keine externen Abhängigkeiten.** Reines ES6+, läuft in jedem modernen Browser.
2. **Keine DOM-Annahmen außer Container.** Engine bekommt ein `HTMLElement` als Container und rendert hinein.
3. **Trennung Daten ↔ Logik ↔ Rendering.** Items liefert der Aufrufer, Engine kümmert sich um Reihenfolge/Persistenz/UI.
4. **Self-first als Default.** Auch in Standalones.
5. **Persistenz unabhängig vom Modul.** Item-Status ist global, Modul-Status ist separat.
6. **Engine ruft Callbacks synchron**, um Race-Condition bei „nicht bearbeitet"-Anzeige zu vermeiden.

---

## 3. Datenmodell

### 3.1 Item (kleinste Einheit)

```json
{
  "id": "q-prostata-blase-01",
  "type": "single | multi | cloze | numeric | order",
  "stem": "Welche Blasenfüllung ist beim PLCT Prostata Standard?",
  "options": [
    { "id": "o-a", "text": "Leere Blase", "korrekt": false, "rationale": "Erhöht Bewegungsanfälligkeit der Prostata." },
    { "id": "o-b", "text": "Definiert gefüllte Blase (~250 ml)", "korrekt": true, "rationale": "Schiebt Dünndarm aus dem Strahlengang." }
  ],
  "correct": ["o-b"],
  "rationale_global": "Standard im UKR: 250 ml ca. 30 min vor PLCT.",
  "lehrjahr": [2, 3],
  "schwierigkeit": "basic",
  "tags": ["prostata", "blasenfuellung", "plct", "lagerung"],
  "kontext_neutral": true
}
```

**Felder:**

| Feld | Pflicht | Beschreibung |
|---|---|---|
| `id` | ja | Unveränderlich, Schema `q-<thema>-<lfdnr>` |
| `type` | ja | Aufgabentyp |
| `stem` | ja | Fragestellung, **modul-unabhängig** |
| `options` | bei single/multi | Antwortoptionen mit eigener Rationale |
| `correct` | ja | Liste richtiger Option-IDs (single: genau 1, multi: 1+) |
| `rationale_global` | ja | Begründung der Gesamtlösung |
| `lehrjahr` | ja | Lehrjahr-Tags |
| `schwierigkeit` | ja | basic / advanced |
| `tags` | ja | Inhalts-Tags für Redundanzcheck |
| `kontext_neutral` | ja | Bestätigt, dass der Item-Stem ohne Modul-Frame Sinn macht |

**Item-Typen-Verhalten:**

- `single`: Eine Option richtig. Engine bewertet automatisch.
- `multi`: Mehrere richtig. Submit erst bei „Fertig"-Klick.
- `cloze`: Lückentext. `stem` enthält `{{1}}`-Platzhalter. `correct` ist Array von akzeptierten Antworten je Lücke (case-insensitive, getrimmt).
- `numeric`: Eingabe einer Zahl mit Toleranz. Felder: `correct: { value: 250, tolerance: 50, unit: "ml" }`.
- `order`: Reihenfolge wählen. `options` enthält Elemente in falscher Reihenfolge, `correct` ist die richtige Reihenfolge.

### 3.2 Frame (modul-spezifischer Kontext, optional)

```json
{
  "vor": "Im Rahmen unserer Prostata-Sequenz vor dem PLCT:",
  "nach": "Diese Frage taucht auch im Quiz Becken-Anatomie auf."
}
```

Frames werden vom Modul (`itemRefs` + `frames`) geliefert. Engine zeigt sie um den Item-Stem herum, aber ohne sie für die Bewertung zu verwenden.

### 3.3 Itembank-Struktur (Dateilayout)

```
content/itembank/
├── index.json                # Übersicht aller Items mit Tags (für Redundanzcheck)
├── prostata.json             # Items rund um Prostata
├── mamma.json
├── bronchial.json
├── grundlagen-physik.json
├── lagerung.json
└── ...
```

Pro Datei: `{ "items": [ ... ] }`. Engine lädt zentralen Index einmal beim Start und einzelne Dateien on-demand bei Modul-Aufruf.

### 3.4 Run (eine Quiz-Sitzung)

In-Memory-Struktur, nicht persistiert:

```js
{
  runId: "uuid",
  items: [Item, Item, ...],
  current: 0,
  boxen: { 1: [...], 2: [...], 3: [...] },  // Leitner während Run
  ergebnis: { korrekt: 0, falsch: 0, gesamt: 0 }
}
```

### 3.5 Progress (persistent, localStorage)

**Key:** `mtr_rt_quiz_progress`

```json
{
  "version": 1,
  "items": {
    "q-prostata-blase-01": {
      "box": 3,
      "lastCorrect": true,
      "lastSeen": "2026-05-18T10:23:00Z",
      "attempts": 4,
      "correctCount": 3,
      "streakKorrekt": 2
    }
  },
  "modulRuns": {
    "10-mamma-lernsequenz": [
      { "ts": "...", "korrekt": 8, "gesamt": 10 }
    ]
  }
}
```

**Modul-Progress** (`mtr_rt_progress`, ARCH §7) bleibt unverändert. Beide Strukturen kompatibel.

---

## 4. Leitner-Light-Logik

3 Boxen:

| Box | Bedeutung | Verhalten |
|---|---|---|
| 1 | Neu oder zuletzt falsch | Wird in jedem Run bevorzugt gezogen |
| 2 | 1× korrekt | Wird nur gezogen, wenn Box 1 leer / am Ende des Runs |
| 3 | 2× korrekt in Folge (= „gemeistert") | Nur im Wiederholungsmodus, nicht im regulären Run |

**Übergangsregeln:**

- Korrekte Antwort: Box hochzählen (max. 3).
- Falsche Antwort: Box zurück auf 1, `streakKorrekt = 0`.
- Eine **Runde** endet, wenn alle in den Run aufgenommenen Items mind. einmal korrekt waren (also nicht mehr in Box 1).
- Reset über Einstellungen möglich (`#/einstellungen` → „Quiz-Fortschritt zurücksetzen").

**Anti-Bug-Regel** (SuS-Feedback „nicht bearbeitet nach Abschluss"):

- Engine ruft `onRunDone(summary)` **synchron** vor Re-Render.
- Persistenz erfolgt **vor** dem Callback.
- Renderer/Dashboard liest erst nach Callback aus `localStorage` neu.

---

## 5. Self-first-Flow

Verbindlicher Default-Ablauf pro Item:

1. **Anzeige:** Frame (vor) + Stem + Eingabeelement (Auswahl/Feld/Drag) + „Antwort prüfen"-Button.
2. **Lösung verborgen.** Kein Button „Lösung zeigen" während Eingabephase.
3. **Submit** durch Lernende.
4. **Auswertung:**
   - Auto-bewertung für `single`, `multi`, `numeric`, `cloze`, `order`.
   - Visuelle Markierung der gewählten und korrekten Optionen.
   - Anzeige `rationale` der gewählten Option(en) **und** `rationale_global`.
5. **Frame (nach)** wird angezeigt, falls vorhanden.
6. **„Weiter"-Button.** Bei Leitner-Modus: Item wandert in entsprechende Box.

**Ausnahme:** Wenn Engine mit `mode: "instant"` aufgerufen wird (Prüfungs-Simulationsmodus), wird Lösung erst nach komplettem Durchgang gezeigt.

---

## 6. JavaScript-API

### 6.1 Initialisierung

```js
// Lädt Index und cached Items
QuizEngine.init({
  itembankBasePath: "content/itembank/",
  storagePrefix: "mtr_rt_"
});
```

### 6.2 Run starten

```js
QuizEngine.start({
  // Items per ID aus Bank ODER inline (in Standalones)
  itemRefs: ["q-prostata-blase-01", "q-prostata-rektum-03"],
  inlineItems: null,  // alternativ: Array von Item-Objekten
  
  // Modul-Kontext für Persistenz
  moduleId: "prostata-planungs-ct-enddarm",
  
  // Optionale Frames
  frames: { "q-prostata-blase-01": { vor: "...", nach: "..." } },
  
  // Engine-Optionen
  mode: "self-first",          // oder "instant"
  leitner: true,
  shuffle: true,
  
  // Wo gerendert wird
  container: document.getElementById("quiz-host"),
  
  // Callbacks
  onItemDone: (itemId, korrekt) => {},
  onRunDone: (summary) => {
    // summary = { korrekt, gesamt, dauerSek, boxen }
  }
});
```

### 6.3 Hilfsfunktionen

```js
QuizEngine.getItem(itemId);                 // Item aus Bank holen
QuizEngine.getProgress(itemId);             // Box, Stats
QuizEngine.resetProgress({ itemId? });      // einzelnes Item oder alles
QuizEngine.exportProgress();                // JSON
QuizEngine.importProgress(jsonString);
QuizEngine.findByTags(tagsArray);           // gibt Item-IDs zurück
QuizEngine.redundanzReport();               // listet Items mit überlappenden Tags
```

---

## 7. UI-Konvention (CSS-Klassen, in app.css)

Engine setzt definierte CSS-Klassen, kein Inline-Styling:

| Klasse | Zweck |
|---|---|
| `.quiz` | Wrapper |
| `.quiz-frame-vor` / `.quiz-frame-nach` | Modul-Frame |
| `.quiz-stem` | Fragetext |
| `.quiz-options` | Antworten-Liste |
| `.quiz-option` | Eine Antwortzeile |
| `.quiz-option.is-selected` | Gewählt |
| `.quiz-option.is-correct` / `.is-wrong` | Nach Submit |
| `.quiz-rationale` | Begründung-Box |
| `.quiz-rationale-global` | Globale Begründung |
| `.quiz-progress` | Fortschrittsanzeige innerhalb Run |
| `.quiz-leitner-badge` | Box-Anzeige am Item |

Alle Klassen werden in `css/app.css` definiert und sind Engine-Vertrag.

---

## 8. Standalone-Nutzung (Lernsequenzen, Standalones)

Damit Standalones (Mamma, Bronchial, Prostata, MTR-Lernmodul V1) dieselbe Engine nutzen können, gilt:

1. Standalone bindet `<script src="../js/quiz-engine.js"></script>` ein (relativer Pfad in Repo).
2. Standalone ruft `QuizEngine.init({...})`.
3. Standalone kann entweder Item-IDs (aus zentraler Bank) oder **inline-Items** übergeben:

```js
QuizEngine.start({
  inlineItems: [ { id: "...", type: "single", ... } ],
  moduleId: "10-mamma-lernsequenz",
  mode: "self-first",
  container: document.getElementById("quiz-host"),
  onRunDone: showResultPage
});
```

4. Persistenz funktioniert auch im Standalone (gleicher `localStorage`-Key).
5. Empfehlung: Auch in Standalones langfristig **kein** inline-Items, sondern Itembank-Referenzen – um Wiederverwendung zu sichern. Inline nur als Übergangslösung.

---

## 9. Redundanzcheck

Pflicht-Tool: `tools/redundanz-check.js` (Node, kein Build-Step).

```bash
node tools/redundanz-check.js
```

Output:
- Liste der Items mit ≥3 überlappenden Tags
- Liste der Items, die in ≥2 Modulen referenziert sind (kein Fehler, nur Info)
- Liste der Module mit ≥80% Tag-Überschneidung (Warnung)

Wird nicht automatisch in CI ausgeführt – Jan ruft das Tool vor jedem Release manuell auf.

---

## 10. Was die Engine NICHT macht

- Keine Server-Synchronisierung.
- Keine adaptive Schwierigkeit (über Leitner hinaus).
- Kein Gamification-Layer (Punkte, Badges, Streaks außerhalb Leitner).
- Keine Text-Antworten frei bewerten – Freitext kommt nur in `transfer`-Modulen, dort selbst-bewertet.
- Kein Hosting von Bildern – Bilder kommen aus dem Item via Bild-URL-Feld (Erweiterung wenn nötig).

---

## 11. Implementierungs-Reihenfolge (für `lernapp-implementierung`)

1. Itembank-Skeleton anlegen (`content/itembank/index.json`).
2. `js/quiz-engine.js` v1 implementieren – nur `single` und `multi` zuerst.
3. CSS-Klassen in `app.css` ergänzen.
4. Prostata-Items in `content/itembank/prostata.json` migrieren.
5. Prostata-Standalone auf Engine umstellen.
6. Weitere Item-Typen (`cloze`, `numeric`, `order`) nachziehen.
7. Restliche Standalones migrieren.

---

## 12. Verbleibende offene Architektur-Punkte

- Soll Engine **Bilder** in Items unterstützen (für Bild-Quiz)? Aktuell nein, dafür `image-analysis`-Typ. Nochmal prüfen, ob das so bleibt.
- Wie wird Itembank versioniert? Vorschlag: jedes Item bekommt `lastUpdated`-Feld. Bei Inhaltsänderung wird ein Item entweder updated (bei Tippfehlern) oder durch neues Item mit neuer ID ersetzt (bei inhaltlicher Änderung), Altes wird `deprecated: true`.
- Soll Engine offline-fähig sein (Service Worker)? Aktuell ist die Lernapp komplett statisch und damit ohnehin offline-fähig nach erstem Laden. Reicht.
