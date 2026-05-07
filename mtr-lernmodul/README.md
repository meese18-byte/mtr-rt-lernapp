# MTR-Lernmodul — Strahlentherapie

Standalone-HTML-Lernmodul für MTR-Auszubildende.
Themen: Aufbau einer Strahlentherapieabteilung, Strahlenphysik/-biologie als Kausalkette,
Zielvolumenkonzept, Dosisverteilung & DVH, Bestrahlungstechniken, Plancheck, klinische Fälle.

**Aktuelle Version:** V10 · A11y-Stand · 2026-05-07

## Verzeichnisstruktur

```
mtr-lernmodul/
├── index.html           ← Einstiegspunkt
├── README.md            ← diese Datei
├── .nojekyll            ← verhindert Jekyll-Verarbeitung auf GitHub Pages
├── .gitignore
├── css/
│   └── app.css          ← Styling
├── js/
│   └── app.js           ← Navigation, Renderer, Quiz/Match-/Transfer-Logik
└── media/
    └── images/          ← 22 Bilder (CT-Schnitte, TPS-Screenshots, Schemata)
```

## Lokal öffnen

Doppelklick auf `index.html` öffnet das Modul im Browser.

> **Hinweis:** Manche Browser blockieren beim Öffnen über `file://` das Laden externer
> JS-/CSS-Dateien aus Sicherheitsgründen. Falls Bilder oder Funktionen nicht laden:
> die Datei über einen lokalen Webserver ausliefern, z. B. mit Python im Modulordner:
>
> ```
> python -m http.server 8080
> ```
>
> Danach im Browser: <http://localhost:8080>

## Deployment auf GitHub Pages

1. Den gesamten Ordnerinhalt in ein GitHub-Repo pushen (siehe Anleitung unten).
2. Im Repo unter **Settings → Pages**: Source = Branch `main`, Folder `/ (root)`.
3. „Save" klicken — nach 1–2 Minuten ist das Modul unter
   `https://<dein-account>.github.io/<repo-name>/` erreichbar.

Alle Pfade im Modul sind relativ (`./css/...`, `./media/...`) — funktioniert sowohl
auf der GitHub-Pages-Subdomain als auch in einem Unterordner-Deployment.

## Lernpfade

Auf der Startseite stehen vier Pfade zur Auswahl:

- **Orientierung** — 1. Lehrjahr · ~45 min · 11 Sections
- **Vollkurs** — 2.–3. Lehrjahr · ~2 h · 19 Sections
- **Examensfokus** — Aufgaben & Fälle · ~60 min · 12 Sections
- **Frei navigieren** — alle Sections sichtbar

In der Sidebar markieren farbige Punkte das Niveau jeder Section
(grün = Basis, gelb = Vertiefung, rot = Anwendung/Examen).

## Fortschritt und Praxisnotizen

- Bearbeitungsstand wird im `localStorage` gespeichert
  (Key: `mtr_rt_bestrahlungstechniken_plancheck_hybrid_v5_erweitert`).
- Praxistransfer-Notizen am Modulende werden separat gespeichert
  (Key: `mtr_rt_praxis_notes_v1`) und überleben den
  „Fortschritt zurücksetzen"-Button bewusst.

## Barrierefreiheit (A11y)

- WCAG 2.1 AA — Tastaturbedienung, Screenreader-Support, sichtbarer Fokus
- Skip-Link zum Hauptinhalt
- ARIA-Live-Region für Quiz-/Match-Feedback
- `prefers-reduced-motion` wird respektiert

## Wartung

- Inhalte stehen vollständig in `js/app.js` in den `r…()`-Renderer-Funktionen pro Section.
- Bilder werden mit relativen Pfaden referenziert. Neues Bild → in `media/images/` ablegen,
  im Renderer einbinden.
- Stylesheet `css/app.css` ist in Themenblöcke kommentiert (Layout, Sidebar, Cards,
  Quiz, Match, Niveau-Badges, Pfad-Auswahl, A11y).

## Versionshistorie

- **V10** — A11y: Tastaturbedienung, ARIA-Roles, Live-Regions, Skip-Link, sichtbarer Fokus
- **V9** — Plancheck-Tabelle mit Beispieltoleranzen, Praxistransfer am Modulende
- **V8** — File-Split: HTML/CSS/JS getrennt, base64-Bilder als externe Dateien
- **V7** — Inhaltskorrekturen (CI-Konvention, DIBH-Werte, BET-CTV) + MTR-Block-Konsistenz
- **V6** — Vier Lernpfade, Niveau-Badges in der Sidebar
- **V5** — Erweiterung um Abteilungsprozess und Physik/Biologie-Kausalkette (Ausgangsbasis)

