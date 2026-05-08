# Workflow: Neue Lernsequenz aufsetzen

Dieses Dokument beschreibt den vollständigen, erprobten Ablauf zum Aufsetzen einer neuen Lernsequenz in der MTR RT Lernapp – von der Idee bis zur fertigen HTML-Datei mit Bildern.

---

## 1. Voraussetzung: Architektur-Check

Bevor Code entsteht, prüfen:

- Passt das Thema in einen der **5 Standardmodultypen** (knowledge, case, image-analysis, quiz, transfer)?
- Wenn **alle drei** Bedingungen erfüllt sind, ist eine Lernsequenz (`sequence`) gerechtfertigt:
  1. Lerninhalt umfasst >60 Minuten strukturierte Arbeitszeit
  2. Praxisstation/Praxisrotation ist integriert
  3. Dozentenmodus und Export/Drucken sind geplant

Neue Lernsequenz in `ARCHITECTURE.md` §6 dokumentieren (Datum + Begründung).

---

## 2. Curriculareinordnung

In `CURRICULUM.md` prüfen:
- Welchem **Kapitel** (1–14) gehört das Thema?
- Welche **Reihenfolge** hat es innerhalb des Kapitels?
- Welche **Voraussetzungen** (andere Module) sind sinnvoll?

---

## 3. HTML-Datei anlegen

**Pfad:** `content/lernsequenzen/[kapitel]-[kurzname].html`

Beispiel: `content/lernsequenzen/10-mamma-lernsequenz.html`

### Pflicht-Elemente jeder Lernsequenz

| Element | Beschreibung |
|---|---|
| `<html lang="de">` | Pflicht |
| Systemfont-Stack | kein Google Fonts |
| `localStorage`-Key | Präfix `mtr_rt_` |
| Dozentenmodus | Button + CSS-Klasse `show-teacher` |
| Export/Drucken | Button mit `window.print()` oder JSON-Export |
| Fortschrittsanzeige | Missionen zählen, localStorage persistieren |
| Sidebar-Navigation | Links zu allen Missionen |

### Missions-Struktur (bewährt)

```
M1 – Start & Ablauf          (Orientierung, Lernplan)
M2 – Fallakte / Ausgangslage (Fall einlesen, Handlungsrelevanz)
M3 – Grundlagen kompakt      (Epidemiologie, Ätiologie, Klinik)
M4 – Anatomie & OAR          (Zielgebiet, Risikoorgane)
M5 – Therapie-Navi           (Warum RT? Therapielogik)
M6 – RT-Basics               (Dosis, Fraktionierung, PTV)
M7 – Planungs-CT & Techniken (PLCT-Vorbereitung, Techniken mit Bildern)
M8 – Praxisstation           (Rollen, Beobachtungsbogen, Rotation)
M9 – Transfer & Abschluss    (Nebenwirkungen, Fallvorstellung, Lernspiel)
```

Missionen können themenbezogen angepasst oder reduziert werden. Pflicht bleiben M1, M8 (Praxis) und die Abschluss-Mission.

### Aufgaben-Typen pro Mission

```html
<!-- Pflichtauftrag mit Textarea -->
<div class="task">
  <div class="label-line">
    <h4>Aufgabentitel</h4>
    <span class="output-tag">Erwartetes Produkt</span>
  </div>
  <textarea id="mX_tY" data-required="true" data-label="Mission X – Bezeichnung"></textarea>
</div>

<!-- Support-Box (aufklappbar) -->
<div class="support-box">
  <button class="toggle" onclick="toggleBox('mX_helpY')">Support öffnen <span>Kurzhinweis</span></button>
  <div class="toggle-content" id="mX_helpY">...</div>
</div>

<!-- Plus-Aufgabe für schnelle SuS -->
<div class="plus-box"><strong>Plus:</strong> ...</div>

<!-- Praxisanker (grüne Callout am Ende jeder Mission) -->
<div class="callout green"><strong>Praxisanker:</strong> ...</div>

<!-- Dozentenhinweis (nur im Dozentenmodus sichtbar) -->
<div class="teacher-note"><strong>Dozentenhinweis:</strong> ...</div>
```

### Kompaktwissen-Block (für Kerninhalte)

```html
<div class="card">
  <h3>Titel des Wissensblocks</h3>
  <div class="wissen-block">
    <h5>Unterabschnitt</h5>
    <ul>
      <li>Stichpunkt</li>
    </ul>
    <!-- optional: Bilder direkt nach dem Listenende -->
    <div class="img-row">
      <figure class="img-figure">
        <img src="../../media/images/eigene/dateiname.jpg" alt="Beschreibung" loading="lazy">
        <figcaption class="img-caption">Bildunterschrift</figcaption>
      </figure>
    </div>
  </div>
</div>
```

---

## 4. Bilder einbinden

### Ordnerstruktur

```
media/images/
├── eigene/          → selbst erstellt/gezeichnet, Hilfsmittel-Fotos ohne Patient
├── cc-lizenz/       → externe Bilder mit Lizenznachweis (→ BILDRECHTE.md)
└── klinik-intern/   → TPS-Screenshots, Klinikfotos (gitignored, nur lokal)
```

### Entscheidungsregel (eine Frage)

> **Hast du dieses Bild in einem klinischen System erstellt oder aus einer externen Quelle bezogen?**
> - Nein, selbst gezeichnet / Hilfsmittel-Foto ohne Patient → `eigene/` → GitHub ✅
> - Ja, TPS-Screenshot / Klinikfoto → `klinik-intern/` → nur lokal ✅
> - Ja, externer Download mit CC-Lizenz → `cc-lizenz/` + BILDRECHTE.md-Eintrag ✅

### Dateinamen-Konvention

Nur `[a-z0-9-]`, keine Umlaute, keine Leerzeichen, keine Sonderzeichen.
Beispiel: `mamma-dibh.jpg`, `lagerung-breaststep.jpg`

### Technische Anforderungen

| Kriterium | Grenzwert |
|---|---|
| Dateigröße | max. 300 KB |
| Breite | max. 1600 px |
| Format | JPEG oder PNG (kein .jfif, kein .gif für Fotos) |
| Alt-Text | Pflicht, beschreibend |
| Lazy Loading | `loading="lazy"` immer setzen |

### Bild-CSS (bereits in app-style enthalten, für neue Sequenzen kopieren)

```css
.img-row { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 0.75rem 0 0; }
.img-figure { flex: 1; min-width: 130px; margin: 0; }
.img-figure img { border-radius: 6px; border: 1px solid #e3e7eb; height: 160px; width: 100%; object-fit: contain; background: #f6f7f9; }
.img-caption { font-size: 0.75rem; color: #7b8794; text-align: center; margin-top: 0.3rem; line-height: 1.3; }
```

### Relativer Pfad aus einer Lernsequenz-HTML

```
../../media/images/eigene/dateiname.jpg
../../media/images/klinik-intern/dateiname.jpg
../../media/images/cc-lizenz/dateiname.jpg
```

---

## 5. Registry-Eintrag

In `content/modules-registry.json` ergänzen:

```json
{
  "id": "10-mamma-lernsequenz",
  "title": "Vollständiger Modultitel",
  "type": "sequence",
  "category": "Indikationen II – Thorax und Abdomen",
  "order": 10,
  "difficulty": "fortgeschritten",
  "kapitel": 10,
  "reihenfolge": 1,
  "pflichtgrad": "pflicht",
  "voraussetzungen": [],
  "phase": "P3",
  "file": "content/lernsequenzen/10-mamma-lernsequenz.html",
  "estimatedMinutes": 90,
  "tags": ["thema", "stichwort"]
}
```

**Pflichtfelder:** `id`, `title`, `type`, `category`, `kapitel`, `reihenfolge`, `pflichtgrad`, `phase`, `file`

---

## 6. Dashboard-Integration (einmalig, bereits erledigt)

`js/app.js` erkennt `type: "sequence"` automatisch und verlinkt direkt auf die HTML-Datei. Kein weiterer Code nötig.

Das Dashboard-Badge für Lernsequenzen (`type-sequence`) ist in `css/app.css` bereits definiert.

---

## 7. Qualitätssicherung vor Deployment

- [ ] localStorage-Key beginnt mit `mtr_rt_`
- [ ] Keine externen Schriftarten (kein Google Fonts)
- [ ] Alle `<figure>`-Tags korrekt geschlossen
- [ ] Alle Bilder: Alt-Text vorhanden, `loading="lazy"` gesetzt
- [ ] Bilder in `klinik-intern/` in `.gitignore` eingetragen (bereits global erledigt)
- [ ] Registry-Eintrag vollständig
- [ ] Dozentenmodus und Export-Button funktionieren
- [ ] Fortschritt wird in localStorage gespeichert und wiederhergestellt
- [ ] Responsive: auf Handy und Tablet bedienbar
