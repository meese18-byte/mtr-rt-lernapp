# Modul-Schema v2 (final)

**Status:** Entwurf zur Aufnahme in ARCHITECTURE.md §4 + §12
**Datum:** 2026-05-18
**Ableitung aus:** SuS-Feedback (n≈10), Übergabe-Notiz, ARCHITECTURE.md v1.0

---

## 1. Zweck

Diese Datei fixiert das endgültige JSON-Schema für alle Modultypen der Lernapp. Sie ist die verbindliche Spec für `lernapp-implementierung` und für jeden Standalone, der sich an die App-Architektur halten soll.

---

## 2. Modultypen (final)

Es bleibt bei den 5 Standard-Typen + Sondertyp `sequence` aus ARCHITECTURE.md §4. **Kein neuer Typ.**

- `knowledge`
- `case`
- `image-analysis`
- `quiz`
- `transfer`
- `sequence` (Sondertyp, ARCH §4.6)

Exit-Slip und Print-View sind **Querschnittsfunktionen**, keine Typen.

---

## 3. Gemeinsame Pflichtfelder (alle Module)

Diese Felder sind in **jedem** Modul-JSON und in `modules-registry.json` Pflicht:

```json
{
  "id": "string (siehe ARCH §12.1)",
  "title": "string",
  "type": "knowledge | case | image-analysis | quiz | transfer | sequence",
  "kapitel": "number (1-14)",
  "reihenfolge": "number",
  "pflichtgrad": "pflicht | vertiefung | exkurs",
  "phase": "MVP | P2 | P3 | P4 | P5",
  "mode": "online_solo | praesenz_gekoppelt | hybrid",
  "lehrjahr": "number[] (z.B. [1,2])",
  "tags": "string[] (für Redundanzcheck und Filter)",
  "estimatedMinutes": "number",
  "voraussetzungen": "string[] (Modul-IDs, optional)",
  "exitSlip": "object (siehe §6)",
  "printable": "boolean (Default true)"
}
```

**Neue Felder gegenüber v1:**

| Feld | Begründung |
|---|---|
| `mode` | SuS-Feedback: Praxisstationen ohne Dozent müssen erkennbar sein. |
| `lehrjahr` | SuS-Feedback: Tiefe lehrjahrsspezifisch. |
| `tags` | Redundanzcheck-Basis (Mamma/Prostata-Blasenfüllung-Problem). |
| `exitSlip` | SuS-Feedback: Selbsteinschätzung am Ende. |
| `printable` | SuS-Feedback: „Skript zum Mitnehmen". |
| `estimatedMinutes` | War bei `sequence` schon Pflicht, wird für alle Typen Pflicht. |

**Modus-Werte:**

- `online_solo`: vollständig allein bearbeitbar (Default für `knowledge`, `quiz`)
- `praesenz_gekoppelt`: braucht Dozent / Klinik / Linac (z.B. CBCT-Bewertung am Gerät)
- `hybrid`: hat Online-Fallback (z.B. Praxisstation mit Musterlösungsvideo)

Bei `hybrid` zusätzlich Pflicht:

```json
"online_fallback": {
  "videoUrl": "string oder leer",
  "alternativeTask": "string (Aufgabenstellung für Online-Modus)"
}
```

---

## 4. Inhaltsbausteine (cross-cutting)

Bausteine sind die kleinste adressierbare Inhalts-Einheit innerhalb eines Moduls. Sie ersetzen formlose `content`-Strings.

```json
{
  "id": "b-<kurzname>",
  "title": "string (optional, nur bei sichtbarer Sektion)",
  "type": "text | image | video | callout | klappbox | decision | mc | freitext",
  "body": "string (Markdown erlaubt)",
  "visibility": "default | deep",
  "lehrjahr": "number[]",
  "schwierigkeit": "basic | advanced",
  "tags": "string[]"
}
```

**Regeln:**

- Jeder Baustein hat eigene `lehrjahr`- und `schwierigkeit`-Tags. Renderer blendet Bausteine aus, deren Tags nicht zur globalen LJ-Einstellung passen.
- `visibility: "deep"` wird in `<details>` gerendert (SuS-Feedback: „150 Wörter sichtbar, Tiefe in Klappbox").
- **Pro Baustein max. 150 Wörter im sichtbaren Bereich.** Mehr → Inhalt in `visibility: "deep"`.
- Bausteine sind in `content/modules/<id>.json` unter `content.bausteine[]` strukturiert.

---

## 5. Typ-spezifische Schemas

### 5.1 `knowledge`

```json
{
  "type": "knowledge",
  "content": {
    "bausteine": [
      { "id": "b-intro", "type": "text", "body": "...", ... },
      { "id": "b-anatomie", "type": "image", "image": "...", ... },
      { "id": "b-vertiefung", "type": "klappbox", "visibility": "deep", ... }
    ],
    "verstaendnisfragen": ["q-item-id-1", "q-item-id-2", "q-item-id-3"]
  }
}
```

`verstaendnisfragen` ist eine Liste von Item-IDs aus der Itembank. Max. 3.

### 5.2 `case`

```json
{
  "type": "case",
  "content": {
    "fallakte": {
      "patient": "string",
      "anamnese": "string",
      "befund": "string",
      "media": ["..."]
    },
    "bausteine": [...],
    "entscheidungen": [
      {
        "id": "d-1",
        "frage": "string",
        "optionen": [
          { "id": "o-a", "text": "...", "korrekt": true, "feedback": "..." },
          ...
        ],
        "lehrjahr": [2,3],
        "schwierigkeit": "advanced"
      }
    ]
  }
}
```

Max. 5 Optionen pro Entscheidung (ARCH §12.3).

### 5.3 `image-analysis`

```json
{
  "type": "image-analysis",
  "content": {
    "image": "media/images/...",
    "alt": "string (Pflicht)",
    "aufgabe": "string",
    "regionen": [
      { "id": "r-1", "shape": "rect|circle", "coords": [x,y,w,h], "korrekt": true, "feedback": "..." }
    ],
    "alternative_mc": [
      { "text": "...", "korrekt": true, "feedback": "..." }
    ]
  }
}
```

Max. 6 Klickregionen ODER 4 MC-Optionen (ARCH §12.3). `alternative_mc` ist Barrierefreiheits-Fallback für Tastaturnutzer.

### 5.4 `quiz`

```json
{
  "type": "quiz",
  "content": {
    "itemRefs": ["q-prostata-blase-01", "q-prostata-rektum-03", ...],
    "frames": {
      "q-prostata-blase-01": {
        "vor": "Im Rahmen unserer Prostata-Sequenz:",
        "nach": ""
      }
    },
    "engineOptions": {
      "mode": "self-first",
      "leitner": true,
      "shuffle": true
    }
  }
}
```

**Wichtig:** `itemRefs` referenziert die Itembank. Inline-Items sind verboten – sonst geht die Wiederverwendung verloren. `frames` ist optional und modul-spezifisch.

Max. 15 Item-Refs pro Modul (ARCH §12.3).

### 5.5 `transfer`

```json
{
  "type": "transfer",
  "content": {
    "prompt": "string",
    "bausteine": [...],
    "selbstbewertung": [
      { "kriterium": "string", "kurzhilfe": "string" }
    ]
  }
}
```

Max. 8 Selbstbewertungspunkte (ARCH §12.3).

### 5.6 `sequence`

Unverändert gemäß ARCH §4 Sondertyp 6. Lernsequenzen sind eigene HTML-Dateien, einbettbar via Engine-Aufruf für ihre Quiz-Phasen.

---

## 6. Exit-Slip (Querschnitt, Pflicht)

```json
"exitSlip": {
  "fragen": [
    { "id": "es-1", "label": "Was war neu für dich?", "type": "freitext" },
    { "id": "es-2", "label": "Was ist noch unklar?", "type": "freitext" },
    { "id": "es-3", "label": "Wie sicher fühlst du dich jetzt? (1-5)", "type": "skala", "min": 1, "max": 5 }
  ]
}
```

**Default-Slip** für alle Module: genau diese 3 Fragen. Modul-spezifische Überschreibung möglich.

Persistenz: `localStorage` Key `mtr_rt_exitslips`, Format:

```json
{
  "<moduleId>": [
    { "ts": "ISO-Datum", "antworten": { "es-1": "...", "es-2": "...", "es-3": 4 } }
  ]
}
```

Exit-Slip-Antworten **bleiben gerätelokal**. Kein Versand, kein Sammelmechanismus.

---

## 7. Print-View (Querschnitt, Pflicht)

- Jedes Modul (außer `mode: praesenz_gekoppelt`-only-Module) hat einen „Skript drucken"-Button im Footer.
- Render-Funktion: `renderPrintView(moduleId)` baut druckoptimierte HTML-Variante:
  - alle Bausteine sichtbar (auch `visibility: "deep"`)
  - alle Klappboxen aufgeklappt
  - Antworten zu Quiz-Items inline mit Lösung
  - Header: Modul-Titel, Lehrjahr-Marker, Datum
  - Footer: „Stand: <Datum>, Lernapp Strahlentherapie MTR"
- Stylesheet: `css/print.css`, eingebunden via `<link media="print">`.

---

## 8. Registry-Beispiel (modules-registry.json) – Migrationsschritt

```json
{
  "id": "01-aufbau-abteilung",
  "title": "Aufbau einer Strahlentherapie-Abteilung",
  "type": "knowledge",
  "kapitel": 1,
  "reihenfolge": 1,
  "pflichtgrad": "pflicht",
  "phase": "MVP",
  "mode": "online_solo",
  "lehrjahr": [1],
  "tags": ["orientierung", "abteilung", "rollen"],
  "estimatedMinutes": 15,
  "printable": true
}
```

Bestehende Einträge in `modules-registry.json` müssen um `mode`, `lehrjahr`, `tags`, `estimatedMinutes`, `printable` ergänzt werden. Migrationsskript optional.

---

## 9. Was sich gegenüber v1 NICHT ändert

- Vanilla-Stack (ARCH §3).
- Modul-ID-Schema (ARCH §12.1).
- Bearbeitungszeit-Obergrenzen (ARCH §12.3).
- Canvas-Policy (ARCH §11).
- DSGVO-Hygiene (ARCH §10).

---

## 10. Migrationsweg

1. ARCHITECTURE.md um neue Felder erweitern (siehe Patch-Vorschlag).
2. `quiz-engine.js` bauen (siehe QUIZ-ENGINE-SPEC.md).
3. `content/itembank/` aufsetzen.
4. Prostata-Standalone als erstes Modul auf v2-Schema migrieren.
5. Restliche Standalones nachziehen.
6. Lernapp-Renderer auf v2-Schema umstellen.

---

## 11. Offene Punkte (kein Showstopper, aber zu klären)

- Wie wird `lehrjahr` im Dashboard sichtbar? Vorschlag: Filter-Chips „1. LJ | 2. LJ | 3. LJ | Alle".
- Wie groß darf die Itembank werden, bevor sie geteilt wird? Vorschlag: pro Thema-Datei max. 50 Items.
- Sollen Exit-Slip-Antworten exportierbar sein? Vorschlag: ja, gemeinsam mit Progress-Export (ARCH §7).
