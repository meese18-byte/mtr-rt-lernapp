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

## 3. MVP (Phase 1) – Was geht zuerst live

Nicht alle 14 Kapitel entstehen gleichzeitig.
Der MVP besteht aus einem geschlossenen Themenkreis rund um das bestehende Referenzmodul Prostata-Enddarm.

**Ziel**: Eine Azubine kann in 1-2 Lernsitzungen einen realen klinischen Prozess – Planungs-CT bis Bestrahlung Becken – in der App komplett durcharbeiten. Das MVP beweist, ob das Konzept trägt.

| Kapitel | Module (MVP-Phase 1) |
|---|---|
| 01 Orientierung | 01-aufbau-abteilung · 01-rollen-berufsgruppen · 01-tagesablauf |
| 05 Planungs-CT | 05-ablauf-planungsct · 05-lagerung-immobilisierung · 05-enddarmvorbereitung-becken *(bestehendes Referenzmodul, umbenennen)* |
| 09 Indikationen Becken | 09-prostata-grundlagen · 09-rektum-grundlagen |

Zielzahl **MVP: 8 Module**. Arbeitsaufwand realistisch 20-30 Stunden.

### Folgephasen

- **Phase 2 – Grundlagen nachziehen**: Kapitel 02, 03
- **Phase 3 – Weitere Indikationen**: Kapitel 10, 11, 12
- **Phase 4 – Prozessstationen komplettieren**: Kapitel 04, 06, 07, 08
- **Phase 5 – Querschnitt und Prüfung**: Kapitel 13, 14

Phase 2-5 erst starten, wenn MVP in einer echten Testgruppe läuft und Feedback vorliegt.

---

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

**Regel**: Der MVP (Phase 1) besteht zu mindestens 80 % aus `pflicht`-Modulen.

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

**Legende**: ✅ live · 🟡 in Arbeit · ⬜ geplant · ❌ verworfen

| ID | Titel | Typ | Tag | Phase | Status |
|---|---|---|---|---|---|
| 05-enddarmvorbereitung-becken | Planungs-CT Prostata – gefüllter Enddarm | case | pflicht | MVP | ✅ *(umzubenennen, aktuell `prostata-planungs-ct-enddarm`)* |
| 01-aufbau-abteilung | Aufbau einer Strahlentherapie-Abteilung | knowledge | pflicht | MVP | ⬜ |
| 01-rollen-berufsgruppen | Berufsgruppen und ihre Rollen | knowledge | pflicht | MVP | ⬜ |
| 01-tagesablauf | Typischer Tagesablauf einer MTR | knowledge | pflicht | MVP | ⬜ |
| 05-ablauf-planungsct | Ablauf eines Planungs-CT | knowledge | pflicht | MVP | ⬜ |
| 05-lagerung-immobilisierung | Lagerung und Immobilisierung (Grundlagen) | knowledge | pflicht | MVP | ⬜ |
| 09-prostata-grundlagen | Prostata – Grundlagen der Bestrahlung | knowledge | pflicht | MVP | ⬜ |
| 09-rektum-grundlagen | Rektum – Grundlagen der Bestrahlung | knowledge | pflicht | MVP | ⬜ |

---

## 9. Änderungsprotokoll

| Datum | Änderung | Grund |
|---|---|---|
| 2026-04-18 | Curriculum initial angelegt, 14-Kapitel-Struktur, MVP Phase 1 mit 8 Modulen definiert | Roter Faden von Anfang an, Vermeidung Feature-Creep |

---

## 10. Arbeitsprinzipien für Jan

- **Erst Kapitel planen, dann Module bauen.** Kein spontanes Modul außerhalb der Kapitelstruktur.
- **MVP zuerst zu Ende bringen**, bevor Phase 2 beginnt.
- **Jede Kapitel-Änderung** wird zuerst hier im Änderungsprotokoll eingetragen, dann umgesetzt.
- **Pflichtgrad ehrlich vergeben**: Wenn der MVP voll von `vertiefung` ist, ist der MVP falsch.
