# Legacy-Workflow: bestehende Lernsequenzen in V3 migrieren

**Stand:** 2026-09-28  
**Status:** Legacy-Dokument – keine neuen `sequence`-Module anlegen.

Mit ARCHITECTURE.md V3 wurde der Sondertyp `sequence` abgeschafft. Mehrteilige Lernangebote werden künftig als **Lernpfade aus den fünf Standardmodultypen** umgesetzt.

Dieses Dokument beschreibt deshalb nicht mehr das Erstellen neuer Lernsequenzen, sondern den kontrollierten Umgang mit vorhandenen HTML-Lernsequenzen.

---

## 1. Bestehende Legacy-Inhalte

Aktuell vorhandene Lernsequenzen können während der Migration weiter erreichbar bleiben. Sie werden in der Registry mit

```json
{
  "status": "legacy",
  "legacy": true
}
```

markiert.

Legacy-Sequenzen:
- zählen nicht zum regulären Modulfortschritt,
- werden nicht als technische Vorlage kopiert,
- erhalten keine neuen Sonderfunktionen,
- dienen als Quelle für Inhalte, Fälle, Aufgaben und Medien.

---

## 2. Zielstruktur

Beispiel Mamma:

```text
Lernpfad Mamma
├── knowledge       Grundlagen / Zielgebiet / OAR
├── case            PLCT und Lagerungsentscheidung
├── case            DIBH-Entscheidung
├── image-analysis  Setup / Bildkontrolle
├── quiz            Wissenssicherung
└── transfer        Fallübergabe / Selbstbewertung
```

Der Lernpfad selbst wird in `content/learning-paths.json` gepflegt und besitzt keine eigene Rendering- oder Persistenzlogik.

---

## 3. Migrationsablauf pro Legacy-Sequenz

1. **Inhaltsinventar erstellen**
   - Lernziele
   - Kernwissen
   - klinische Entscheidungspunkte
   - Bild-/Medienmaterial
   - Quizfragen
   - Transferaufgaben
   - lokale Praxisbesonderheiten

2. **Auf fünf Standardtypen abbilden**
   - keine neue Interaktionsart erfinden, wenn ein Standardtyp genügt
   - lange Sequenzen in mehrere kleine Module teilen

3. **Medien prüfen**
   - Herkunft
   - Rechte
   - Patientenbezug
   - Anonymisierung
   - öffentliche Freigabe
   - Eintrag in `media/MEDIA-REGISTER.md`

4. **Module spezifizieren und implementieren**
   - Registry-Metadaten zuerst
   - Inhalts-JSON danach
   - Itembank statt neuer Inline-Quizlogik

5. **Lernpfad anlegen**
   - ausschließlich existierende Modul-IDs referenzieren

6. **Legacy-Sequenz archivieren**
   - erst wenn alle relevanten Inhalte migriert und fachlich freigegeben sind
   - danach aus der aktiven Registry entfernen

---

## 4. Was ausdrücklich nicht mehr gemacht wird

- keine neuen `content/lernsequenzen/*.html` als Lernmodule
- keine neue eigene Navigation pro Thema
- keine neuen themenspezifischen localStorage-Keys
- keine kopierten Quiz-Engines
- keine neuen Standalone-Mini-Apps
- keine Sonder-Renderer außerhalb der fünf Standardtypen ohne neue Architekturentscheidung

---

## 5. Qualitätscheck vor Abschluss einer Migration

- Sind alle Lernziele der Altsequenz abgedeckt?
- Sind klinische Entscheidungspunkte erhalten oder verbessert?
- Sind redundante Inhalte entfernt?
- Sind Quizitems in der zentralen Itembank?
- Sind Medienrechte dokumentiert?
- Ist der Lernpfad ohne Legacy-Seite vollständig nutzbar?
- Läuft `node tools/validate-content.js` fehlerfrei?

Erst dann wird die alte Lernsequenz archiviert.
