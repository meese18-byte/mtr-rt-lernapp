# Modul-Schema V3

**Stand:** 2026-09-28  
**Status:** verbindlich für neue und migrierte Module

Dieses Dokument konkretisiert `ARCHITECTURE.md` V3. Es ersetzt V2 für neue Implementierungen. V2 bleibt nur als historische Migrationsreferenz bestehen.

---

## 1. Grundsatz

Die Lernapp kennt genau fünf aktive Modultypen:

- `knowledge`
- `case`
- `image-analysis`
- `quiz`
- `transfer`

`sequence` ist **kein Modultyp mehr**. Mehrteilige Lernszenarien werden als Lernpfade in `content/learning-paths.json` aus Standardmodulen zusammengesetzt.

---

## 2. Trennung Metadaten ↔ Inhalt

### 2.1 Registry = kanonische Metadaten

`content/modules-registry.json` enthält:

```json
{
  "id": "10-mamma-plct",
  "title": "Mammakarzinom: Planungs-CT und Lagerung",
  "type": "case",
  "kapitel": 10,
  "reihenfolge": 2,
  "pflichtgrad": "pflicht",
  "status": "live",
  "mode": "online_solo",
  "lehrjahr": [2, 3],
  "tags": ["mamma", "plct", "lagerung"],
  "estimatedMinutes": 15,
  "printable": true,
  "voraussetzungen": ["10-mamma-grundlagen"]
}
```

Pflichtfelder für aktive Module:
`id`, `title`, `type`, `kapitel`, `reihenfolge`, `pflichtgrad`, `status`, `mode`, `lehrjahr`, `tags`, `estimatedMinutes`.

### 2.2 Moduldatei = Lerninhalt

`content/modules/<id>.json` enthält mindestens:

```json
{
  "id": "10-mamma-plct",
  "learningGoals": [
    "..."
  ],
  "examRelevance": "...",
  "relatedModules": [],
  "relatedInfotexte": [],
  "body": {}
}
```

Metadaten aus der Registry dürfen in Legacy-Dateien vorübergehend doppelt vorkommen. Beim Laden gewinnt immer die Registry.

---

## 3. Inhaltsbausteine

Wenn ein Modul in Bausteine gegliedert wird, gilt:

```json
{
  "id": "b-lagerung",
  "type": "text",
  "body": "...",
  "visibility": "default",
  "lehrjahr": [2, 3],
  "schwierigkeit": "basic",
  "tags": ["lagerung"]
}
```

Zulässige Bausteintypen:
`text`, `image`, `video`, `callout`, `klappbox`, `decision`, `mc`, `freitext`.

Maximal 150 Wörter im direkt sichtbaren Bereich eines Bausteins.

---

## 4. Modultypen

### 4.1 knowledge

Zweck: fokussiertes Grundlagenwissen mit 2–3 Verständnisfragen.

Zielzeit: 8–12 Minuten.  
Maximal ca. 400 Wörter sichtbarer Kerninhalt.

### 4.2 case

Zweck: klinische Entscheidungssituation mit differenziertem Feedback.

Maximal 5 Handlungsoptionen.  
Optional ein `followUpQuiz` über die zentrale Quiz-Engine.

### 4.3 image-analysis

Zweck: klinisch relevante Bildbeurteilung.

Zulässig:
- MC zum Bild
- `click-region` mit DOM-Overlay

Canvas nur nach ARCHITECTURE.md §11.

### 4.4 quiz

Standardweg: `body.itemRefs[]` auf zentrale Itembank.

Inline-Items sind nur als Migrationsfallback erlaubt.  
Legacy-`body.questions[]` darf gelesen, aber nicht neu erzeugt werden.

### 4.5 transfer

Offene Antwort + strukturierte Selbstbewertung.

Maximal 8 Checklistenpunkte.

---

## 5. Exit-Slip

Jedes Standardmodul erhält am Ende den gemeinsamen Exit-Slip. Fehlt ein modul-spezifischer Block, gelten die drei Default-Fragen aus `ARCHITECTURE.md`.

Die Speicherung erfolgt ausschließlich unter `mtr_rt_exitslips`.

---

## 6. Print-View

Für `online_solo` und `hybrid` gilt `printable: true` als Default.

Die Druckansicht:
- zeigt alle relevanten Lerninhalte,
- blendet Navigation und Bedienelemente aus,
- öffnet Klappinhalte,
- druckt Lösungen/Rationales nur in einer ausdrücklich als Skriptansicht erzeugten Darstellung.

---

## 7. Lernpfade

Datei: `content/learning-paths.json`

```json
{
  "id": "lp-mamma",
  "title": "Mammakarzinom",
  "lehrjahr": [2, 3],
  "moduleIds": [
    "10-mamma-grundlagen",
    "10-mamma-plct",
    "10-mamma-dibh",
    "10-mamma-setup",
    "10-mamma-quiz",
    "10-mamma-transfer"
  ]
}
```

Regeln:
- nur vorhandene Standardmodul-IDs,
- keine eigene Fortschrittsspeicherung,
- Fortschritt wird aus den referenzierten Modulen berechnet,
- Lernpfade dürfen Module teilen.

---

## 8. Legacy-Migration

Während der V3-Migration dürfen alte `sequence`-Einträge in der Registry verbleiben, wenn gleichzeitig gilt:

```json
{
  "type": "sequence",
  "status": "legacy",
  "legacy": true
}
```

Sie:
- zählen nicht zum regulären Modulfortschritt,
- werden nicht als Vorlage für neue Inhalte verwendet,
- werden schrittweise in Standardmodule zerlegt,
- werden danach aus der aktiven Registry entfernt.

---

## 9. Validierung

Vor Releases muss `node tools/validate-content.js` ohne Fehler durchlaufen.

Fehler sind u. a.:
- doppelte IDs,
- fehlende Moduldateien,
- ungültige Voraussetzungen,
- aktive unbekannte Modultypen,
- ungültige Kapitel,
- Lernpfade mit fehlenden Modulreferenzen.

Legacy-`sequence` wird während der Migration als Warnung behandelt.
