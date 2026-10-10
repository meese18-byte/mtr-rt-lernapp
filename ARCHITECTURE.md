# ARCHITECTURE.md - Lernapp Strahlentherapie MTR

**Version:** 3.1 (V3-Modularchitektur + Referenzpfad-Pilot)
**Letzte Änderung:** 2026-10-10
**Autor:** Jan

Dieses Dokument ist die Single Source of Truth für alle Architekturentscheidungen dieser Lernapp. Jede Änderung, die einer der hier dokumentierten Entscheidungen widerspricht, muss **hier zuerst** diskutiert und dokumentiert werden, bevor Code geschrieben wird.

Die Skills `lernapp-architektur` und `lernapp-implementierung` lesen diese Datei bei jedem Aufruf zuerst.

---

## 1. Projektzweck

Eine webbasierte Lernapp für die fachpraktische Ausbildung der MTR in der Strahlentherapie. Zielgruppe: MTR-Auszubildende, insbesondere während Kleingruppen-Praxisphasen, zur Selbstarbeit, zur Prüfungsvorbereitung und als Nachschlagewerk über den Unterricht hinaus.

**Nicht-Ziele:**
- Kein Ersatz für klinischen Unterricht oder Praxisanleitung.
- Kein Zertifizierungssystem.
- Kein Kommunikations-/Chatwerkzeug.
- Keine Content-Plattform für andere Themengebiete außerhalb der Strahlentherapie-Ausbildung.

---

## 2. Leitprinzipien

1. **Architektur zuerst, Modul zweitens.** Jede neue Idee wird in die bestehende Architektur eingeordnet, bevor sie umgesetzt wird.
2. **Wenig, aber konsequent.** Wir beschränken uns auf fünf Modultypen, einen Stack, einen Hoster.
3. **Laien-wartbar.** Der Code muss von einem Medizinpädagogen mit moderaten Webentwicklungs-Kenntnissen über Jahre hinweg pflegbar sein.
4. **Didaktisch vor technisch.** Jedes Feature muss einen klaren Lerneffekt haben. Gamification und UI-Gimmicks nur, wenn sie Lernen tatsächlich fördern.
5. **Kein Datenabfluss.** Keine Cookies, kein Tracking, keine externen Fonts. DSGVO-Hygiene von Anfang an.

---

## 3. Fester Technischer Stack

| Bereich | Entscheidung | Ausdrücklich NICHT |
|---|---|---|
| Frontend | Vanilla HTML5, CSS3, ES6+ JavaScript | React, Vue, Alpine, Svelte, jQuery |
| Build | Keiner | webpack, vite, parcel, Babel |
| Paketmanager | Keiner | npm, yarn, pnpm |
| Hosting | GitHub Pages | Netlify, Vercel, eigener Server |
| Datenhaltung | localStorage | Firebase, Supabase, IndexedDB, Backend |
| Auth | Keine | OAuth, JWT, Sessions |
| CSS-Framework | Keines, eigene `app.css` | Tailwind, Bootstrap |
| Inhalts-Format | JSON (Module), Markdown (Infotexte) | Word, PDF, proprietär |
| Medien | Bilder JPEG/WebP, Video MP4 | Flash, proprietäre Formate |

**Begründung:** Minimaler Abhängigkeitsbaum = minimale Wartungsschuld. Kein Build-Schritt = sofort verstehbar und änderbar.

---

## 4. Die fünf Modultypen

Genau diese fünf Typen sind zugelassen:

1. **`knowledge`** - Wissenskarte mit Infotext und 2-3 Verständnisfragen.
2. **`case`** - Klinische Fall-Entscheidung mit Medien und begründetem Feedback.
3. **`image-analysis`** - Bildbasierte Aufgabe (Multiple Choice zum Bild oder Klickpunkt).
4. **`quiz`** - Fragenblock mit begründetem Feedback pro Option.
5. **`transfer`** - Freitext-Reflexion mit Selbstbewertungs-Checkliste.

Das verbindliche Inhaltsschema steht in `architecture/MODUL-SCHEMA-V3.md`.

**Erweiterungs-Regel:** Ein neuer Modultyp wird nur dann ergänzt, wenn eine konkrete didaktische Notwendigkeit in mindestens **drei unterschiedlichen geplanten Modulen** besteht, die sich nachweislich nicht mit einem bestehenden Typ abbilden lassen. Die Ergänzung wird hier in diesem Dokument dokumentiert, bevor Code entsteht.

**Querschnittsfunktionen (kein eigener Typ):**

- **Exit-Slip** – Pflicht-Footer in jedem Modul (siehe §14).
- **Print-View** – druckbare Skript-Ansicht jedes Moduls (siehe §14).
- **Lehrjahr-Filter** – globale Tiefen-Steuerung auf Baustein-Ebene (siehe §15).
- **Itembank + Quiz-Engine** – wiederverwendbare Items, gemeinsame Engine für Lernapp und Standalones (siehe §13).

Diese Funktionen sind kein eigener Modultyp, sondern werden von allen Typen geteilt.

---

### Lernpfade (kein Modultyp)

Ein **Lernpfad** bündelt mehrere Module zu einer fachlich sinnvollen Abfolge, z. B. Mamma, Prostata oder Bronchial-Ca. Lernpfade sind **keine Module** und erzeugen keine sechste Renderer- oder Fortschrittslogik.

**Verbindliche Regeln:**
1. Zulässig bleiben genau die fünf Standardmodultypen `knowledge`, `case`, `image-analysis`, `quiz`, `transfer`.
2. Lernpfade werden in `content/learning-paths.json` definiert und referenzieren ausschließlich vorhandene Modul-IDs.
3. Der Fortschritt eines Lernpfads wird aus dem Fortschritt seiner Module berechnet; kein eigener localStorage-Key.
4. Bestehende HTML-Lernsequenzen bleiben während der V3-Migration als **Legacy-Inhalte** erreichbar, dürfen aber nicht mehr als Vorlage für neue Module dienen.
5. Nach fachlicher Zerlegung in Standardmodule werden Legacy-Lernsequenzen aus der aktiven Registry entfernt und archiviert.

**Begründung:** Die früheren `sequence`-Seiten entwickelten sich zu eigenständigen Mini-Apps mit eigener Navigation, Persistenz und UI. Das widerspricht dem Ziel einer langfristig wartbaren, einheitlichen Lernplattform.


---

## 5. Dateistruktur

```
radiotherapy-learning-app/
├── index.html              # Dashboard und Haupt-Einstiegspunkt
├── ARCHITECTURE.md         # Dieses Dokument
├── README.md               # Kurzanleitung für Autorin/Nutzer
├── .nojekyll               # Verhindert Jekyll-Verarbeitung durch GitHub Pages
├── css/
│   ├── app.css             # Haupt-Stylesheet
│   └── print.css           # Druckansicht
├── js/
│   ├── app.js              # Bootstrap, Router, Navigation
│   ├── storage.js          # localStorage + Export/Import
│   ├── progress.js         # Fortschrittsverwaltung
│   ├── registry.js         # Modulregistry laden
│   └── renderers/          # Ein Renderer pro Modultyp
│       ├── knowledge.js
│       ├── case.js
│       ├── image-analysis.js
│       ├── quiz.js
│       └── transfer.js
├── content/
│   ├── modules-registry.json   # Kanonische Metadaten aller Module
│   ├── learning-paths.json     # Zusammensetzung curricularer Lernpfade
│   ├── modules/                # Ein JSON pro Modul
│   └── infotexte/              # Ein Markdown pro Infotext
├── media/
│   ├── MEDIA-REGISTER.md       # Rechte-/Anonymisierungsstatus aller öffentlichen Medien
│   ├── images/
│   ├── clips/
│   └── documents/
└── tools/
    ├── validate-content.js     # Struktur- und Referenzprüfung
    ├── redundanz-check.js      # Inhalts-/Tag-Redundanzen
    └── check-root.sh           # Schutz zentraler Root-Dateien
```

### 5.1 Push-Disziplin (Standalone ↔ Root)

**Pflicht-Check vor jedem Push, der `fallmodule-standalone/`, `mtr-lernmodul/` oder
einen anderen Standalone-Ordner anfasst:** Vor dem Commit prüfen, ob durch den Diff
versehentlich Root-Dateien (insbesondere `index.html`, `css/app.css`, Dateien unter
`js/`, `content/`, `media/`) gelöscht oder verschoben wurden. Standalone-Ordner sind
abgeschottete Mini-Apps; an der Root liegt die Haupt-App-Auslieferung für
GitHub Pages.

**Konkretes Vorgehen (Soll-Routine):**

1. `git status` und `git diff --stat` lesen, bevor `git add -A` ausgeführt wird.
2. Bei Standalone-Änderungen gezielt `git add fallmodule-standalone/...` o.ä.
   statt pauschalem `add -A`.
3. Nach `git add` ein `git status` zur Kontrolle – tauchen unter "deleted:"
   Root-Dateien auf, wird der Commit abgebrochen und der Diff geprüft.
4. Erst dann `git commit` und `git push`.

**Hintergrund:** Commit `e63211a` (2026-05-18) hat im Zuge einer Standalone-Aktualisierung
das Root-`index.html` stillschweigend gelöscht. Folge: 404 auf
https://meese18-byte.github.io/mtr-rt-lernapp/ bis zur Wiederherstellung am 2026-05-19.
Das Risiko bleibt strukturell, weil Standalones und Haupt-App im selben Pages-Branch liegen.

**Sekundär-Schutz:** `tools/check-root.sh` als manueller Pre-Push-Check, der die
Existenz von `index.html`, `js/app.js`, `css/app.css` prüft und bei Fehlen den Push
verweigert. Bis dahin gilt die manuelle Routine als verbindlich.

---

## 6. Navigation und Routing

Hash-basierter Router (z.B. `#/module/05-enddarmvorbereitung-becken`). Kein pushState, keine Server-Rewrites nötig. Funktioniert zuverlässig unter GitHub Pages auch bei Seiten-Reloads.

Haupt-Routen:
- `#/` - Dashboard nach Curriculum-Kapiteln mit Lehrjahr-/Pflichtgrad-Filter und Fortschritt
- `#/module/:id` - Ein Modul anzeigen
- `#/info/:id` - Ein Infotext
- `#/pruefung` - Prüfungsvorbereitung (alle aktiven Kapitel-14- bzw. `pruefung`-Module)
- `#/einstellungen` - Export/Import, Fortschritt zurücksetzen

---

### 6.1 Referenzpfad-Pilot Prostata (2026-10-10)

Der Pilot setzt eine additive Navigation auf die V3-Modularchitektur:
- #/lernwege – verfügbare Lernpfade für das gewählte Lehrjahr
- #/lernweg/:id – vertikale, frei zugängliche Modulliste mit abgeleitetem Fortschritt
- #/themen – bestehendes Kapitel-Dashboard als Direktzugriff
- #/trainieren – vorhandene case-/image-analysis-/quiz-Module mit Aufgabenart-Filter
- #/module/:id?path=:pathId – Modul im Kontext eines Lernpfads
- #/module/:id?from=themen|trainieren|pruefung – Modul mit Rückweg zum gewählten Einstieg

Alle Einstiege verwenden dieselben Modul-IDs und dieselben Bearbeitungsdaten.
Weiterlernen priorisiert begonnene Stationen im gewählten Pfad, danach die erste noch
nicht abgeschlossene Station. Bei vollständig bearbeitetem Pfad wird Wiederholung angeboten.
Der gewählte Pfad liegt als activeLearningPath in den vorhandenen Einstellungen;
es gibt keinen eigenen Fortschritts-Key für Lernpfade.

Status live und review sind im Pilot zugänglich; review wird als Pilotfassung markiert.
planned/draft werden nicht als bearbeitbare Module gezählt. Voraussetzungen empfehlen
eine Reihenfolge und sperren keine anderen Module.

Optionales body.ownResponsePrompt in case und image-analysis (MC) fordert eine eigene
Begründung an, bevor Optionen gezeigt werden. Dies ist eine Ergänzung vorhandener Typen.
Die Eingabe wird in diesem Pilot nicht gespeichert; dieser Umstand steht an der Eingabe.

Die visuelle Gestaltung nutzt die bestehende Oberfläche. Die drei Designsprachen aus
PR #2 bleiben offen; der Pilot erklärt nicht das gesamte UX-CONCEPT-V1 zur kanonischen
Architektur. Weitere Pfade werden erst nach Review dieses Referenzpfads produziert.

## 7. Fortschritt und Speicherung

**Speicherort:** Browser-`localStorage`, Präfix `mtr_rt_`.

**Format (in `mtr_rt_progress`):**
```json
{
  "version": 1,
  "modules": {
    "05-enddarmvorbereitung-becken": {
      "status": "completed",
      "lastAccess": "2026-04-18T10:23:00Z",
      "attempts": 2,
      "correctRate": 0.85
    }
  },
  "settings": {
    "anrede": "du",
    "lehrjahr": "alle",
    "pflichtgrad": "alle"
  }
}
```

**Gerätegebundenheit** ist bewusst akzeptierte Grenze.
**Export/Import** als JSON-Datei ist Pflichtfunktion der v1, erreichbar unter `#/einstellungen`. So können Lernende ihren Fortschritt zwischen Schul-PC und Privatgerät übertragen.

### 7.1 Übersicht aller localStorage-Keys

Alle Keys tragen den Präfix `mtr_rt_` und werden gemeinsam exportiert/importiert.

| Key | Inhalt | Eingeführt |
|---|---|---|
| `mtr_rt_progress` | Modul-Fortschritt (Status, Versuche, correctRate) | v1.0 |
| `mtr_rt_settings` | Globale Einstellungen inkl. `lehrjahr`, `anrede` | v1.0 |
| `mtr_rt_quiz_progress` | Item-Status der Quiz-Engine (Leitner-Boxen, Stats) | v2.0 |
| `mtr_rt_exitslips` | Exit-Slip-Antworten pro Modul | v2.0 |

---

## 8. Medien-Policy

**Bilder:** JPEG/WebP bevorzugt für Fotos; PNG für verlustarme technische Darstellungen; SVG für selbst erstellte Schemata ohne eingebettete externe Inhalte. Richtwert max. 300 KB und max. 1600 px Breite bei Rasterbildern; begründete Ausnahmen für fachlich notwendige Detailbilder. Dateinamen künftig nur `[a-z0-9\-]`. Alt-Text Pflicht.

**Videos lokal:** Nur bei <20 MB und <=30 Sek. Sonst automatisch als Embed einbinden.

**Videos embed:** YouTube (unlisted, `youtube-nocookie.com`) oder Vimeo. Immer mit `loading="lazy"` und Fallback-Text.

**Rechte und Patientenbezug:** Kein klinisches Material ohne dokumentierten Rechte-Check und vollständige Anonymisierung. Kein DICOM-Material mit Originalmetadaten.

---

## 9. Barrierefreiheit (Mindeststandard)

- Alle Bilder mit Alt-Text.
- Tastaturnavigation für alle interaktiven Elemente.
- Kontrastverhältnis mindestens WCAG AA (4.5:1 für Fließtext).
- Keine farbabhängigen Aussagen ohne textuelle Ergänzung.
- `<html lang="de">` gesetzt.
- Schriftgröße min. 16 px für Fließtext.

---

## 10. DSGVO-Hygiene

- Keine Cookies.
- Keine externen Scripts (Analytics, Tag-Manager, Fonts von Google etc.).
- localStorage nur für Lern-Fortschritt, keine personenbezogenen Daten.
- Kein Kontaktformular in v1 (würde Impressum und Datenschutzerklärung in besonderem Umfang nötig machen).
- **Impressum und Datenschutzerklärung** sind trotzdem auf der Seite verlinkt - auch als private Bildungsplattform ist das sicherer.

---

## 11. Canvas-Policy (verbindlich)

Diese Policy ist bindend für alle Implementierungen. Sie entstand aus der Erkenntnis, dass Canvas in Lernapps häufig überbeansprucht wird und dann Wartbarkeit, Barrierefreiheit und Responsivität kostet.

### Grundentscheidung

**DOM ist Standard. Canvas ist Ausnahme.** Die komplette App-Oberfläche – Navigation, Dashboard, Texte, Formulare, Buttons, Feedback, Fortschritt, Modul-Rahmen – wird ausschließlich mit HTML/CSS/JavaScript im DOM umgesetzt. Kein Canvas für UI-Hüllen.

### Zulässige Canvas-Einsatzfelder

Canvas ist nur erlaubt für:

- freies Einzeichnen (Linien, Konturen, Pfade auf einem Bild),
- räumliche Zuordnung mit Drag-Verhalten,
- Animationen (Atembewegung, Organverschiebung, Dosisaufbau),
- Simulationen mit Echtzeit-Reaktion,
- spielerische Module mit pixelgenauen Trefferzonen.

### Prüfpflicht vor jedem Canvas-Einsatz

Vor jedem geplanten Canvas-Modul müssen diese sieben Fragen mit "ja" beantwortet werden können:

1. Kann die didaktische Aufgabe nicht genauso gut mit DOM/SVG umgesetzt werden?
2. Entsteht durch Canvas ein echter didaktischer Mehrwert (Interaktion, nicht Optik)?
3. Gibt es eine barrierefreie DOM-Alternative für Nutzer ohne Mausinteraktion?
4. Ist die Canvas-Oberfläche responsiv auf mindestens 3 Breakpoints (Handy, Tablet, Desktop) bedienbar?
5. Kann der Canvas-Zustand serialisierbar gespeichert und exportiert werden (oder ist er bewusst flüchtig)?
6. Lässt sich die Trefferlogik von der Zeichenlogik sauber trennen?
7. Ist die Performance auf schwachen Klinik-Laptops ausreichend (< 16 ms pro Frame)?

Wird auch nur eine Frage verneint, bleibt die Umsetzung bei DOM.

### Hybride Struktur als Pflicht

Auch wenn Canvas eingesetzt wird: Der Rahmen bleibt DOM.
- Fragestellung, Auswahloptionen, Feedback, Weiter-Button, Fortschritt → DOM.
- Nur die reine Interaktionsfläche → Canvas.
- Canvas bekommt immer einen DOM-Alternativweg ("Ich kann das nicht per Maus" → Textauswahl).

### NIEMALS

- Ganze Module im Canvas rendern.
- Text im Canvas ausgeben, der inhaltlich zählt.
- Canvas für Navigation, Dashboard, Einstellungen.
- Canvas als Ersatz für Layout oder Animation, die mit CSS möglich wäre.

---

## 12. Konsistenzregeln für Curriculum und Module

Diese Regeln ergänzen die Inhaltsstruktur in `CURRICULUM.md` um technische Konsequenzen.

### 12.1 Modul-ID-Schema

- Format: `<kapitelnummer>-<kurzname>`
- Kapitelnummer: zwei Ziffern mit führender Null (`01`, `05`, `14`)
- Kurzname: kleingeschrieben, Bindestriche, keine Umlaute, max. 40 Zeichen
- IDs sind unveränderlich — einmal in der Registry, nie mehr umbenennen (würde localStorage-Fortschritt von Nutzern zerstören)
- Ausnahme: Migration. Dann `umbenannt_von`-Feld im Modul-JSON setzen und Fortschritt in `progress.js` mitmigrieren

### 12.2 Registry als Single Source of Truth (verbindlich)

`content/modules-registry.json` ist die **einzige kanonische Quelle für organisatorische Modul-Metadaten**. Moduldateien enthalten primär Lerninhalt und dürfen diese Werte nicht als zweite Wahrheit pflegen.

Pflichtfelder pro aktivem Modul:

| Feld | Typ | Pflicht | Beschreibung |
|---|---|---|---|
| `id` | string | ja | stabile Modul-ID nach §12.1 |
| `title` | string | ja | kanonischer Modultitel |
| `type` | enum | ja | einer der fünf Standardmodultypen |
| `kapitel` | number | ja | Kapitelnummer 1-14 aus CURRICULUM.md |
| `reihenfolge` | number | ja | Sortierung innerhalb des Kapitels |
| `pflichtgrad` | enum | ja | `pflicht`, `vertiefung` oder `exkurs` |
| `status` | enum | ja | `planned`, `draft`, `review`, `live` oder `legacy` |
| `mode` | enum | ja | `online_solo`, `praesenz_gekoppelt`, `hybrid` |
| `lehrjahr` | number[] | ja | sinnvolle Lehrjahre |
| `tags` | string[] | ja | Filter, Suche, Redundanzcheck |
| `estimatedMinutes` | number | ja | erwartete Bearbeitungszeit |
| `printable` | boolean | nein | Default: true |
| `voraussetzungen` | array | nein | sinnvoll vorher bearbeitete Modul-IDs |

**Migrationsregel:** Legacy-`sequence`-Einträge dürfen während der V3-Umstellung noch mit `status: "legacy"` und `legacy: true` in der Registry stehen. Sie zählen nicht zum regulären Modulfortschritt und werden nicht als sechster Modultyp weiterentwickelt.

Beim Laden eines Standardmoduls werden Registry-Metadaten mit dem Inhalts-JSON zusammengeführt; bei Doppelungen gewinnt die Registry.


### 12.3 Bearbeitungszeit-Obergrenzen pro Modultyp

Wird in `CURRICULUM.md §7` inhaltlich festgelegt. Technisch gilt:
- `knowledge`: Infotext max. 400 Wörter, max. 3 Fragen
- `case`: max. 5 Optionen, max. 1 Bild/Clip
- `image-analysis`: max. 6 Klickregionen ODER max. 4 MC-Optionen
- `quiz`: max. 15 Fragen
- `transfer`: max. 8 Selbstbewertungspunkte

Werden diese Grenzen in einem Modul gesprengt, wird das Modul geteilt — **nicht** die Grenze erhöht.

### 12.4 Pflichtgrad-Darstellung im Dashboard

Pro Modul zeigt das Dashboard ein Badge:
- `pflicht` → grün (CSS-Klasse `.badge-pflicht`)
- `vertiefung` → blau (`.badge-vertiefung`)
- `exkurs` → grau (`.badge-exkurs`)

Filter auf dem Dashboard: `Alle | Pflicht | Vertiefung | Exkurs`; Auswahl wird in `mtr_rt_settings.pflichtgrad` gespeichert.

### 12.5 Kapitel-Gruppierung im Dashboard

Das Dashboard gruppiert Module primär nach `kapitel`, sekundär nach `reihenfolge`. Innerhalb eines Kapitels werden Module auch ohne vollständige Voraussetzungen angezeigt, aber mit Empfehlungshinweis ("Vorher sinnvoll: X, Y").

---

## 13. Itembank und Quiz-Engine

Quiz-Items werden modul-unabhängig in einer zentralen Itembank gepflegt und über eine wiederverwendbare Engine ausgespielt. Detail-Spec: `architecture/QUIZ-ENGINE-SPEC.md`.

### 13.1 Itembank

Speicherort: `content/itembank/`

```
content/itembank/
├── index.json              # Übersicht aller Items mit Tags (für Redundanzcheck)
├── prostata.json           # Items je Themenfeld, max. 50 Items pro Datei
├── mamma.json
├── bronchial.json
└── ...
```

- Item-IDs nach Schema `q-<thema>-<lfdnr>`, unveränderlich (gleiche Logik wie Modul-IDs in §12.1).
- Items sind **kontextfrei**. Der Stem muss ohne Modul-Frame Sinn ergeben (`kontext_neutral: true` als Pflichtfeld).
- Modul-spezifischer Kontext wird über `frames`-Feld im Modul-JSON ergänzt, nie im Item selbst.
- Pro Item Pflicht: `lehrjahr[]`, `schwierigkeit`, `tags[]`.

### 13.2 Quiz-Engine

Datei: `js/quiz-engine.js`

- Vanilla ES6+, keine externen Abhängigkeiten.
- Wird in der Lernapp **und** in Standalones (Lernsequenzen) gleichermaßen genutzt.
- Default-Modus: **`self-first`** – Lernende antwortet zuerst, dann erscheinen Lösung + Rationale. Kein Lösungs-Button vor Submit.
- Ausnahme `mode: "instant"` nur für Prüfungs-Simulation.
- **Leitner-light** mit 3 Boxen: 1 = neu/falsch, 2 = 1× korrekt, 3 = 2× korrekt in Folge (gemeistert).
- Persistenz in `mtr_rt_quiz_progress` (siehe §7.1).
- Synchroner `onRunDone`-Callback **vor** Re-Render des Dashboards, um den Bug „nicht bearbeitet nach Abschluss" zu vermeiden.

### 13.3 Legacy-Standalone-Anbindung

Bestehende Standalones dürfen die gemeinsame `quiz-engine.js` während der Migration weiterverwenden. Neue Lerninhalte entstehen jedoch ausschließlich in der Haupt-App. Inline-Items bleiben nur als Migrationsbrücke zulässig; Ziel ist die zentrale Itembank.

### 13.4 Redundanzcheck

Pflicht-Tool: `tools/redundanz-check.js` (Node, kein Build-Step). Wird manuell vor Releases ausgeführt und meldet:

- Items mit ≥3 überlappenden Tags
- Items, die in ≥2 Modulen referenziert sind (Info, kein Fehler)
- Module mit ≥80% Tag-Überschneidung (Warnung)

---

## 14. Exit-Slip und Print-View

### 14.1 Exit-Slip (Pflicht in jedem Modul)

Footer-Komponente am Ende **jedes** Moduls. Default-Slip (genau drei Fragen):

1. Was war neu für dich? (Freitext)
2. Was ist noch unklar? (Freitext)
3. Wie sicher fühlst du dich jetzt? (Skala 1-5)

Modul-spezifische Überschreibung möglich über `exitSlip`-Feld im Modul-JSON.

**Persistenz:** `mtr_rt_exitslips`. Gerätelokal, kein Versand, keine Sammelstelle. Exportierbar zusammen mit Modul-Fortschritt unter `#/einstellungen`.

### 14.2 Print-View (Pflicht bei `mode: online_solo` und `mode: hybrid`)

„Skript drucken"-Button im Footer jedes Moduls (außer rein `praesenz_gekoppelt`).

Render-Funktion `renderPrintView(moduleId)` erzeugt druckoptimierte HTML-Variante:

- Alle Bausteine sichtbar, auch `visibility: "deep"`
- Alle Klappboxen aufgeklappt
- Quiz-Items inline mit Lösung und Rationale
- Header: Modul-Titel, Lehrjahr-Marker, Datum
- Footer: „Stand: <Datum>, Lernapp Strahlentherapie MTR"

Stylesheet: `css/print.css`, eingebunden via `<link media="print">`.

---

## 15. Lehrjahr-Filter und Bausteine

### 15.1 Bausteine

Inhalte innerhalb eines Moduls werden in **Bausteinen** strukturiert. Ein Baustein ist die kleinste adressierbare Inhalts-Einheit mit eigener ID.

```json
{
  "id": "b-<kurzname>",
  "type": "text | image | video | callout | klappbox | decision | mc | freitext",
  "body": "...",
  "visibility": "default | deep",
  "lehrjahr": [1, 2, 3],
  "schwierigkeit": "basic | advanced",
  "tags": ["..."]
}
```

**Regeln:**

- Pro Baustein **max. 150 Wörter im sichtbaren Bereich**. Mehr → `visibility: "deep"` (wird in `<details>` gerendert).
- Jeder Baustein hat eigene `lehrjahr`- und `schwierigkeit`-Tags. Diese sind unabhängig von den Modul-Tags.

### 15.2 Lehrjahr-Filter

Globale Einstellung in `mtr_rt_settings.lehrjahr` (Werte: `1`, `2`, `3`, `"alle"`).

Renderer blendet Bausteine aus, deren `lehrjahr`-Array das gewählte LJ nicht enthält. Modul-Liste im Dashboard zeigt zusätzlich LJ-Marker.

### 15.3 Praxis-Module ohne Dozent

Bei `mode: "hybrid"` Pflichtfeld `online_fallback` (siehe §12.2). Inhalt: Musterlösungsvideo + alternative Aufgabe für die Online-Bearbeitung. Verhindert Sackgassen bei Praxisstationen ohne Klinik-Zugang.

---

## 16. Offene Entscheidungen

| Punkt | Status |
|---|---|
| Itembank-Versionierung: Item-Update vs. Item-Replace bei Inhaltsänderung | offen, entscheiden sobald ≥30 Items existieren |
| Lehrjahr-Filter im Dashboard-UI | V3: Dropdown als einfache, wartbare Standardlösung |
| Redundanzcheck als GitHub Action statt nur lokal | später; lokales Tool bleibt Pflicht vor Releases |
| Bilder-Support direkt in Quiz-Items (zusätzlich zu `image-analysis`-Typ) | offen, vorerst nein |

---

## 17. Änderungsprotokoll

| Datum | Änderung | Grund |
|---|---|---|
| 2026-04-18 | Initialversion mit §§ 1-10 | Projektstart |
| 2026-04-18 | §11 Canvas-Policy ergänzt | Verbindliche DOM-vs-Canvas-Leitlinie, Prüfbogen-Pflicht, hybride Architektur |
| 2026-04-18 | §12 Konsistenzregeln für Curriculum und Module ergänzt, CURRICULUM.md als zweite Source of Truth eingeführt | Roter Faden von Anfang bis Ende, Feature-Creep-Vermeidung, gemeinsame Felder Kapitel/Pflichtgrad/Voraussetzungen |
| 2026-05-18 | v2.0: §4 Querschnittsfunktionen, §7.1 Key-Übersicht, §12.2 neue Pflichtfelder (`mode`, `lehrjahr`, `tags`, `estimatedMinutes`, `printable`, `online_fallback`), §§ 13-15 neu (Itembank/Quiz-Engine, Exit-Slip/Print-View, Bausteine/Lehrjahr-Filter). Alte §§ 13-14 zu §§ 16-17 verschoben. | SuS-Feedback (n≈10): self-first, Leitner-light, Wiederverwendung, Lehrjahr-Tiefe, Exit-Slip, Print-View. Detail-Specs: `architecture/MODUL-SCHEMA-V2.md`, `architecture/QUIZ-ENGINE-SPEC.md`. |
| 2026-05-19 | Baustelle D: Quiz-Renderer auf Itembank/Engine umgestellt (`itemRefs` + Inline-Fallback im Engine-Format gemäß QUIZ-ENGINE-SPEC §6.2, Legacy-Adapter für v1-`body.questions`). Case-Schema um optionales `followUpQuiz` ergänzt (MODUL-SCHEMA-V2 §5.2): eingebetteter Quiz-Block am Ende des Fall-Flows, `completed` erst nach `onRunDone`. Anker-Modul `05-enddarmvorbereitung-becken` nutzt q-prostata-05/03/12 mit Fall-spezifischen Frames. | Erste produktive Anbindung der Itembank an einen Case-Flow. Strukturentscheidung: Inline-Block im Case-Modul, kein separates Quiz-Modul, damit Fall und Vertiefung als eine Lerneinheit zählen. |
| 2026-05-20 | §5.1 Push-Disziplin (Standalone ↔ Root) ergänzt: verpflichtender Pre-Push-Check auf gelöschte Root-Dateien bei Änderungen in Standalone-Ordnern. | Reaktion auf Incident 2026-05-19: Commit `e63211a` hat `index.html` im Root stillschweigend gelöscht, GitHub Pages lieferte bis zur Wiederherstellung 404. Strukturelle Schutzregel statt Einzelfall-Reparatur. |
| 2026-10-10 | V3.1: Referenzpfad Prostata, kontextbezogene Navigation, Themen-/Trainingsansicht und optionale eigene Begründung. | Sechs Standardmodule als prüfbarer Pilot; keine neue Content-Welt oder Fortschrittspersistenz. |
| 2026-09-28 | v3.0: `sequence` als aktiver Modultyp abgeschafft; Lernpfade als Komposition eingeführt; Registry zur kanonischen Metadatenquelle erklärt; Legacy-Migration, Medienregister und Content-Validator verbindlich ergänzt. | Vorbereitung des Vollausbaus auf die gesamte fachpraktische MTR-Ausbildung ohne Architektur-Drift. |

