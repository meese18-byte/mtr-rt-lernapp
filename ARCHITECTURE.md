# ARCHITECTURE.md - Lernapp Strahlentherapie MTR

**Version:** 1.0 (initiales Skelett)
**Letzte Änderung:** 2026-04-18
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

Die JSON-Schemas sind verbindlich und in `references/modul-schemas.md` im `lernapp-implementierung`-Skill dokumentiert.

**Erweiterungs-Regel:** Ein neuer Modultyp wird nur dann ergänzt, wenn eine konkrete didaktische Notwendigkeit in mindestens **drei unterschiedlichen geplanten Modulen** besteht, die sich nachweislich nicht mit einem bestehenden Typ abbilden lassen. Die Ergänzung wird hier in diesem Dokument dokumentiert, bevor Code entsteht.

---

## 5. Dateistruktur

```
radiotherapy-learning-app/
├── index.html              # Dashboard und Haupt-Einstiegspunkt
├── ARCHITECTURE.md         # Dieses Dokument
├── README.md               # Kurzanleitung für Autorin/Nutzer
├── .nojekyll               # Verhindert Jekyll-Verarbeitung durch GitHub Pages
├── css/
│   └── app.css             # Das einzige Stylesheet
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
│   ├── modules-registry.json   # Liste aller Module
│   ├── modules/                # Ein JSON pro Modul
│   └── infotexte/              # Ein Markdown pro Infotext
└── media/
    ├── images/
    └── clips/                  # Nur Clips <20 MB und <=30 Sek
```

---

## 6. Navigation und Routing

Hash-basierter Router (z.B. `#/module/prostata-planungs-ct-enddarm`). Kein pushState, keine Server-Rewrites nötig. Funktioniert zuverlässig unter GitHub Pages auch bei Seiten-Reloads.

Haupt-Routen:
- `#/` - Dashboard mit Kategorien und Fortschritt
- `#/module/:id` - Ein Modul anzeigen
- `#/info/:id` - Ein Infotext
- `#/pruefung` - Prüfungs-Pfad (gefilterte Ansicht von Quiz-Modulen)
- `#/einstellungen` - Export/Import, Fortschritt zurücksetzen

---

## 7. Fortschritt und Speicherung

**Speicherort:** Browser-`localStorage`, Präfix `mtr_rt_`.

**Format (in `mtr_rt_progress`):**
```json
{
  "version": 1,
  "modules": {
    "prostata-planungs-ct-enddarm": {
      "status": "completed",
      "lastAccess": "2026-04-18T10:23:00Z",
      "attempts": 2,
      "correctRate": 0.85
    }
  },
  "settings": {
    "anrede": "du"
  }
}
```

**Gerätegebundenheit** ist bewusst akzeptierte Grenze.
**Export/Import** als JSON-Datei ist Pflichtfunktion der v1, erreichbar unter `#/einstellungen`. So können Lernende ihren Fortschritt zwischen Schul-PC und Privatgerät übertragen.

---

## 8. Medien-Policy

**Bilder:** JPEG oder WebP, max. 300 KB, max. 1600 px Breite. Dateinamen nur `[a-z0-9\-]`. Alt-Text Pflicht.

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
- 