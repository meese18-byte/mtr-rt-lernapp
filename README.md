# MTR RT Lernapp – Strahlentherapie

Webbasierte Lernapp für die fachpraktische Ausbildung der MTR in der Strahlentherapie.
Statisch, ohne Frameworks, GitHub-Pages-tauglich.

## Schnellstart

### 1. Repo anlegen
Auf GitHub ein neues Repository erstellen, z. B. `mtr-rt-lernapp`. Public oder privat – Public ist Voraussetzung für kostenlose GitHub-Pages-Veröffentlichung im Free-Plan.

### 2. Dateien hochladen
- Mit GitHub Desktop das leere Repo klonen.
- Alle Dateien aus diesem Skelett in den lokalen Ordner kopieren.
- In GitHub Desktop: Commit + Push.

### 3. GitHub Pages aktivieren
Im Repo unter **Settings → Pages**:
- Source: **Deploy from a branch**
- Branch: **main**, Ordner: **/ (root)**
- Speichern. Nach ein bis zwei Minuten ist die Seite unter `https://<dein-user>.github.io/<repo-name>/` erreichbar.

### 4. Lokal testen (optional, aber empfohlen)
Öffnet man `index.html` per Doppelklick, blockieren viele Browser `fetch()` auf lokale Dateien. Deshalb lokal einen kleinen Server starten:

```
# mit Python (vorinstalliert auf macOS/Linux, auf Windows als "Python Launcher")
python -m http.server 8080
```

Dann im Browser `http://localhost:8080` öffnen.

## Ordnerstruktur

```
.
├── index.html
├── ARCHITECTURE.md          <- Technische Single Source of Truth. Vor jeder Änderung lesen.
├── CURRICULUM.md            <- Inhaltliche Single Source of Truth.
├── .nojekyll                <- Verhindert Jekyll-Verarbeitung auf GitHub Pages
├── css/
│   ├── app.css
│   └── print.css            <- V3-Druckansicht (wird schrittweise vervollständigt)
├── js/
│   ├── app.js               <- Router, Dashboard, Einstellungen
│   ├── storage.js           <- localStorage + Export/Import
│   ├── progress.js          <- Fortschritts-Logik
│   ├── registry.js          <- lädt Modulregistry und Einzel-Module
│   ├── util.js              <- Helfer (esc, Markdown, Medien, Shuffle)
│   └── renderers/           <- Ein Renderer pro Modultyp
│       ├── knowledge.js
│       ├── case.js
│       ├── image-analysis.js
│       ├── quiz.js
│       └── transfer.js
├── content/
│   ├── modules-registry.json <- kanonische Modul-Metadaten
│   ├── learning-paths.json   <- Komposition mehrerer Standardmodule
│   ├── modules/              <- Ein JSON pro Modul
│   └── infotexte/           <- Ein Markdown pro Infotext
├── media/
│   ├── MEDIA-REGISTER.md     <- Rechte-/Anonymisierungsstatus
│   ├── images/
│   ├── clips/
│   └── documents/
└── tools/
    ├── validate-content.js
    ├── redundanz-check.js
    └── check-root.sh
```

## Ein neues Modul anlegen

1. Mit dem Skill `lernapp-architektur` eine Modul-Spec erstellen.
2. Mit dem Skill `lernapp-implementierung` die Spec in Code umsetzen. Das erzeugt:
   - eine neue Datei unter `content/modules/<id>.json`
   - ggf. einen Markdown-Infotext unter `content/infotexte/<id>.md`
   - einen neuen Eintrag in `content/modules-registry.json`
   - ggf. Mediendateien unter `media/`
3. Vor dem Push `node tools/validate-content.js` ausführen.
4. Änderungen committen und pushen. GitHub Pages übernimmt die statische Auslieferung.

## Die fünf Modultypen

| Typ | Zweck |
|---|---|
| `knowledge` | Kurzer Infotext + 2–3 Verständnisfragen |
| `case` | Klinische Fall-Entscheidung mit Medien und begründetem Feedback |
| `image-analysis` | Bildbasierte Aufgabe (Multiple Choice oder Klickpunkt) |
| `quiz` | Fragenliste zum Prüfungstraining mit Feedback pro Antwort |
| `transfer` | Offene Reflexionsaufgabe mit Selbstbewertungs-Checkliste |

Mehr Details in `ARCHITECTURE.md` und `architecture/MODUL-SCHEMA-V3.md`.

## Lernpfade

Lernpfade (z. B. Mamma oder Prostata) sind **keine zusätzlichen Modultypen**. Sie werden in `content/learning-paths.json` als geordnete Folge vorhandener Module definiert. Bestehende HTML-Lernsequenzen sind Legacy-Inhalte und werden schrittweise in Standardmodule migriert.

## Datenschutz

Die App setzt keine Cookies, überträgt keine Daten an externe Server und bindet keine Tracker ein. Der Lernfortschritt liegt ausschließlich im `localStorage` des jeweiligen Browsers und kann unter *Einstellungen* exportiert und importiert werden.

## Lizenz

Die technische Grundstruktur ist für private Bildungsnutzung freigegeben. Inhalte (Texte, Bilder, Videos) unterliegen eigenen Urheberrechten – Rechteklärung liegt bei der Autorin/dem Autor.


## Referenzpfad-Pilot Prostata

Unter Lernwege steht ein vollständiger Teilpfad mit sechs Stationen (ca. 77 Minuten).
Themen, Trainieren und Abschluss greifen auf dieselben Module und Bearbeitungsdaten zu.
Die Stationen sind als Pilotfassung gekennzeichnet und benötigen fachlichen/didaktischen Review.
Hinweise und Erwartungshorizont: architecture/REFERENZPFAD-PROSTATA.md.

Eigene Kurzbegründungen in Fällen/Bildanalyse bleiben nur in der aktuellen Ansicht erhalten.
Der Modulfortschritt wird weiterhin gerätelokal gespeichert und kann exportiert/importiert werden.
