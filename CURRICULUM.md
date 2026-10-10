# Curriculum – MTR RT Lernapp

Dieses Dokument ist die inhaltliche Single Source of Truth.
Technische Regeln stehen in `ARCHITECTURE.md`. Hier steht, **was** die App lehrt und **in welcher Reihenfolge**.

Jede Änderung an der Struktur (neues Kapitel, neue Module, Reihenfolge-Wechsel) wird hier dokumentiert, bevor sie gebaut wird.

---

## 1. Curricularer Rahmen

Die App folgt zwei Achsen, die ineinandergreifen.

**Hauptachse – klinisch-prozessualer Faden (Patient:innenweg)**
Die Module folgen dem tatsächlichen Weg eines Patienten oder einer Patientin durch die Strahlentherapie. Jedes Kapitel behandelt eine Station auf diesem Weg und das, was die MTR dort können muss. So sieht die Zielgruppe an jedem Punkt, wo sie sich im realen Prozess befindet.

**Zweitachse – Prüfungsraster (MTAPrV + schulinterner Rahmenlehrplan)**
Jedes Modul ist zusätzlich einer Kompetenz aus der Ausbildungs- und Prüfungsverordnung für MTR zugeordnet, damit Prüfungsrelevanz jederzeit nachvollziehbar ist. Die App bereitet gleichzeitig auf die Abschlussprüfung vor, ohne dass Prüfungsvorbereitung zum Selbstzweck wird.

**Dritte Achse – indikationsbezogene Vertiefung**
Nach der Prozess-Grundbildung folgen indikationsbezogene Kapitel (Becken, Thorax, Kopf-Hals etc.), in denen die erlernten Prozessschritte auf konkrete klinische Fälle angewendet werden.

**Reihenfolge-Prinzip: vom Allgemeinen ins Spezielle, vom Prozess in die Indikation.**

---

## 2. Kapitelstruktur (14 Kapitel)

Jedes Kapitel hat eine zweistellige Nummer, die sich in Modul-IDs wiederfindet (`05-planungsct-ablauf`).
Ein Kapitel enthält 2-7 Module.

| Nr. | Kapitel | Inhalt | Achse |
|---|---|---|---|
| 01 | Orientierung | Aufbau Abteilung, Rollen, Tagesablauf | Prozess – Einstieg |
| 02 | Grundlagen I – Strahlung und Biologie | Ionisierung, DNA-Schäden, 5 R's, Fraktionierung | MTAPrV-Kern |
| 03 | Grundlagen II – Volumina und Dosis | GTV, CTV, PTV, ITV, Dosiskonzepte | MTAPrV-Kern |
| 04 | Patientenweg 1 – Aufnahme und Aufklärung | Rolle MTR in der Ambulanz, Kommunikation | Prozess |
| 05 | Patientenweg 2 – Planungs-CT | Vorbereitung, Lagerung, Immobilisierung, 4D-CT, Enddarm-Harnblase | Prozess |
| 06 | Patientenweg 3 – Bestrahlungsplanung | Was passiert in der Physik, was muss die MTR wissen | Prozess |
| 07 | Patientenweg 4 – Erstbestrahlung und Verifikation | Set-up, IGRT (CBCT, kV), Toleranzen | Prozess |
| 08 | Patientenweg 5 – Laufende Therapie | Adaptation, Nebenwirkungen, Support | Prozess |
| 09 | Indikationen I – Becken | Prostata, Rektum, Zervix | Indikation |
| 10 | Indikationen II – Thorax und Abdomen | Mamma, Lunge, Leber | Indikation |
| 11 | Indikationen III – Schädel und HNO | Hirn, HNO | Indikation |
| 12 | Sonderverfahren | STX, SBRT, DIBH, IORT, Brachy | Indikation |
| 13 | Strahlenschutz und Qualität | QS Linac, Strahlenschutz Personal, Dokumentation | Querschnitt |
| 14 | Abschluss und Prüfungsvorbereitung | Querschnittsquiz, Transfer-Aufgaben | Prüfung |

---

## 3. Ausbauprinzip V3

Der frühe MVP-Plan (8 Module rund um Prostata/Planungs-CT) hat seinen Zweck als Prototyp erfüllt. Für den geplanten Vollausbau wird nicht mehr nach P2/P3/P4/P5 gesteuert, sondern nach **curricularer Priorität und Modulstatus**.

### Verbindlicher Status pro Modul

- `planned` – curricular vorgesehen, noch nicht ausgearbeitet
- `draft` – fachlich/didaktisch in Bearbeitung
- `review` – zur fachlichen Freigabe bereit
- `live` – produktiv in der Haupt-App
- `legacy` – Altinhalt während der V3-Migration; kein neuer Ausbau

### Ausbau-Reihenfolge

1. Architektur V3 und Datenmodell stabilisieren.
2. Vollständige Ausbildungs-Landkarte für Lehrjahr 1–3 erstellen.
3. Einen Referenz-Lernpfad vollständig als Standardmodule umsetzen und testen.
4. Danach themenweise Serienproduktion entlang des realen Unterrichts und der klinischen Relevanz.
5. Legacy-Standalones werden als Content-Quelle ausgeschlachtet und anschließend archiviert.

**Regel:** Neue Inhalte entstehen nur noch in der Haupt-App und ausschließlich in einem der fünf Standardmodultypen.


## 4. Modul-ID-Schema

Format: `<kapitelnummer>-<kurzname>`
- Kapitelnummer: zwei Ziffern, führende Null (`01`, `05`, `14`).
- Kurzname: kleingeschrieben, Bindestriche statt Leerzeichen, maximal 40 Zeichen, kein Umlaut.

**Gültig**
```
01-aufbau-abteilung
05-lagerung-immobilisierung
09-prostata-grundlagen
```

**Ungültig**
```
AufbauAbteilung             (keine Nummer, CamelCase)
05-Lagerung_Immobilisierung (Großschreibung, Unterstrich)
05-lagerung-und-immobilisierung-bei-beckenbestrahlung (zu lang)
```

---

## 5. Pflichtgrad-Tagging

Jedes Modul bekommt genau einen Tag zur Prüfungsrelevanz:

| Tag | Bedeutung | Darstellung |
|---|---|---|
| `pflicht` | MTAPrV-relevant, im ersten Durchgang zu bearbeiten | grünes Badge |
| `vertiefung` | Über MTAPrV-Kern hinaus, stärkt Verständnis und Praxis | blaues Badge |
| `exkurs` | Fachliche Anreicherung ohne direkte Prüfungsrelevanz | graues Badge |

**Regel:** Kerncurriculare Lernpfade bestehen überwiegend aus `pflicht`-Modulen. `vertiefung` und `exkurs` dürfen den Pflichtpfad ergänzen, aber nicht verdecken.

---

## 6. Voraussetzungen (optional pro Modul)

Ein Modul kann eine Liste von Modul-IDs angeben, die **sinnvollerweise vorher** bearbeitet wurden. Die App zeigt diese als Empfehlung, sperrt aber nicht.

Beispiel: `09-prostata-grundlagen` hat als Voraussetzungen `03-zielvolumina-gtv-ctv-ptv` und `05-ablauf-planungsct`.

Voraussetzungen verhindern **Feature-Creep auf Modulebene**: Wenn ein Modul sinnvoll nur mit drei Vorgängern funktioniert, hat man beim Schreiben schon drei andere Module planen müssen – das zwingt zu Disziplin.

---

## 7. Durchschnittliche Bearbeitungszeit pro Modultyp

Damit Azubis wissen, was auf sie zukommt, und damit wir nicht Module bauen, die ausufern:

| Typ | Zielzeit Azubi | Inhaltsobergrenze |
|---|---|---|
| `knowledge` | 8-12 Min | Infotext max. 1 Druckseite (ca. 400 Wörter), 2-3 Fragen |
| `case` | 15-20 Min | Ein Fall, 3-5 Entscheidungsoptionen, eine Abbildung |
| `image-analysis` | 8-12 Min | Eine Abbildung, max. 6 Klickregionen oder 4 MC-Optionen |
| `quiz` | 12-18 Min | 8-15 Fragen, MC oder Multi-Select |
| `transfer` | 20-30 Min | Eine offene Aufgabe, 5-8 Selbstbewertungspunkte |

Module, die die Obergrenze sprengen, werden **geteilt**.

---

## 8. Modul-Statusliste

Diese Liste ist das lebende Inventar. Status wird bei jedem Push aktualisiert.

**Legende**: ✅ live · 🟡 draft/review · ⬜ planned · ❌ verworfen

| ID | Titel | Typ | Tag | Priorität | Status |
|---|---|---|---|---|---|
| 05-enddarmvorbereitung-becken | Planungs-CT Prostata – gefüllter Enddarm | case | pflicht | Core | 🟡 review |
| 01-aufbau-abteilung | Aufbau einer Strahlentherapie-Abteilung | knowledge | pflicht | Core | ✅ |
| 01-rollen-berufsgruppen | Berufsgruppen und ihre Rollen | knowledge | pflicht | Core | ⬜ |
| 01-tagesablauf | Typischer Tagesablauf einer MTR | knowledge | pflicht | Core | ⬜ |
| 05-ablauf-planungsct | Ablauf eines Planungs-CT | knowledge | pflicht | Core | ⬜ |
| 05-lagerung-immobilisierung | Lagerung und Immobilisierung (Grundlagen) | knowledge | pflicht | Core | ⬜ |
| 09-prostata-grundlagen | Prostata: Vorbereitung und reproduzierbare Geometrie | knowledge | pflicht | Core | 🟡 review |
| 07-prostata-bildvergleich | Prostata: Referenz und Tagesbild vergleichen | image-analysis | pflicht | Core | 🟡 review |
| 14-plct-stoerfall-prostata | Tagesbestrahlung Prostata: abweichende Blasenfüllung | case | pflicht | Core | 🟡 review |
| 09-prostata-reproduzierbarkeit-quiz | Prostata: Wissenscheck zur Reproduzierbarkeit | quiz | pflicht | Core | 🟡 review |
| 09-prostata-teamuebergabe | Prostata: eine klare Teamübergabe formulieren | transfer | pflicht | Core | 🟡 review |
| 09-rektum-grundlagen | Rektum – Grundlagen der Bestrahlung | knowledge | pflicht | Core | ⬜ |

---

## 9. Änderungsprotokoll

| Datum | Änderung | Grund |
|---|---|---|
| 2026-04-18 | Curriculum initial angelegt, 14-Kapitel-Struktur, MVP Phase 1 mit 8 Modulen definiert | Roter Faden von Anfang an, Vermeidung Feature-Creep |
| 2026-04-18 | Modul 01-aufbau-abteilung live (knowledge, 3 Verständnisfragen) | Erstes echtes MVP-Modul, Blaupause-Charakter für alle weiteren |
| 2026-10-10 | Referenzpfad Prostata mit sechs Stationen für LJ 2–3 angelegt; vier Module ergänzt und zwei Fälle präzisiert. | Erster vollständiger Pilot vor Serienproduktion; Status review. |
| 2026-09-28 | V3-Ausbauprinzip eingeführt; altes Phasenmodell durch Modulstatus ersetzt; kanonische Prostata-ID migriert. | Vollausbau der fachpraktischen Ausbildung mit stabiler Architektur statt Prototyp-Phasen. |

---

## 10. Arbeitsprinzipien für Jan

- **Erst Kapitel planen, dann Module bauen.** Kein spontanes Modul außerhalb der Kapitelstruktur.
- **Referenz-Lernpfad zuerst vollständig testen**, bevor themenweise Serienproduktion beginnt.
- **Jede Kapitel-Änderung** wird zuerst hier im Änderungsprotokoll eingetragen, dann umgesetzt.
- **Pflichtgrad ehrlich vergeben**: Kernmodule bleiben klar von Vertiefung und Exkurs getrennt.


## 11. Referenzpfad Prostata – Pilot

Titel: Prostata: vom Planungs-CT zur täglichen Verifikation.
Ziel: Vorbereitung und Bildbefund beurteilen, Vorgehen begründen, offene Schritte übergeben.
Zielgruppe: LJ 2–3. Umfang: ca. 77 Minuten einschließlich Transfer, ohne gemeinsame Auswertung.
Es handelt sich um einen thematischen Teilpfad, nicht um die vollständige Prostata-Onkologie.

Reihenfolge:
1. 09-prostata-grundlagen
2. 05-enddarmvorbereitung-becken
3. 07-prostata-bildvergleich
4. 14-plct-stoerfall-prostata
5. 09-prostata-reproduzierbarkeit-quiz
6. 09-prostata-teamuebergabe

Alle sechs Stationen stehen zunächst auf review. Die bestehende ID des Blasenfalls
bleibt stabil, obwohl sein Titel korrekt die Tagesbestrahlung benennt.
Fachlicher und didaktischer Review sowie Einsatz mit Lernenden stehen aus.
Orientierung und Erwartungshorizont: architecture/REFERENZPFAD-PROSTATA.md.
