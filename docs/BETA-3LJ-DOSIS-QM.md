# Beta 3. Lehrjahr – Dosisverteilung & Qualitäts-/Risikomanagement

**Status:** Beta-Spezifikation  
**Zielgruppe:** 3. Lehrjahr MTR – fachpraktische Strahlentherapie  
**Branch:** `beta/3lj-dosis-qm`  
**Grundsatz:** So wenig Technik wie möglich, so viel Wiederverwendung wie sinnvoll.

## 1. Zweck der Beta

Diese Beta soll nicht die gesamte Lernapp ausbauen. Sie soll im realen Unterricht prüfen, ob die neue Unterrichtsarchitektur tatsächlich:

- Vorbereitungszeit reduziert,
- Doppelpflege von Inhalten vermeidet,
- Präsenzunterricht sinnvoll ergänzt,
- für Schülerinnen und Schüler leicht zugänglich ist,
- bei späterer Wiederholung und Vertretung weiterverwendbar bleibt.

Getestet werden zwei bewusst unterschiedliche Themen:

1. **Dosisverteilung & Isodosen** – fachlich-technisches Verständnis, Planlesen, DVH/Isodosen, Transfer.
2. **Qualitätsmanagement & Risikomanagement** – Prozessverständnis, Fehleranalyse, SOP/QS, Risiko- und Fehlermanagement.

## 2. Minimaler Beta-Umfang

Pro Thema werden zunächst nur vier Bausteine benötigt:

1. **Knowledge-Modul** – 8–12 Minuten, Kernwissen.
2. **Case-Modul** – 15–20 Minuten, realitätsnaher Entscheidungsfall.
3. **Zentrale Masterfragen** – in der bestehenden Itembank; keine zweite Fragenliste.
4. **Dozenten-Kurzbriefing** – Ablauf, Lernziele, Einsatzzeitpunkt, Lösungen/Hinweise.

Kahoot wird **nicht synchronisiert**. Bei Bedarf werden ausgewählte Masterfragen als Kahoot-Import abgeleitet.

BookWidgets wird in der Beta **nur dann ergänzt**, wenn eine Aufgabe tatsächlich eingesammelt oder individuell rückgemeldet werden soll.

Wordwall ist **nicht Bestandteil der Beta**.

## 3. Lernpfad A – Dosisverteilung

### 03-dosisverteilung-isodosen
- Typ: `knowledge`
- Zielzeit: 10–12 Min.
- Lehrjahr: 3
- Modus: `hybrid`
- Kern: Konformität/Homogenität, Isodosen, Einflussfaktoren, Grundidee DVH.
- Zweck im Unterricht: gemeinsames Ausgangsniveau schaffen.

### 06-plancheck-dvh-isodosen
- Typ: `case`
- Zielzeit: 15–20 Min.
- Lehrjahr: 3
- Modus: `hybrid`
- Kern: Plan plausibilisieren, relevante von irrelevanten Auffälligkeiten unterscheiden, Eskalationsbedarf erkennen.
- Zweck im Unterricht: Transfer vom Begriffswissen zur MTR-Handlung.

**Primäre Projektquelle:** `LehrLernscript_Dosisverteilung_V1_UPDATED.md`

Wichtig: Technische Grenzwerte, Formeln und klinische Beispielwerte werden vor Aufnahme in die Master-Itembank fachlich verifiziert. Die Beta übernimmt solche Zahlen nicht ungeprüft.

## 4. Lernpfad B – Qualitäts- und Risikomanagement

### 13-qm-risikomanagement
- Typ: `knowledge`
- Zielzeit: 10–12 Min.
- Lehrjahr: 3
- Modus: `hybrid`
- Kern: QM/QS, SOP, Abnahme- und Konstanzprüfung, Interventionsschwelle, Risikoanalyse, FMEA, CIRS.
- Zweck im Unterricht: gemeinsame Begriffsbasis.

### 13-fehlerfall-risikomanagement
- Typ: `case`
- Zielzeit: 15–20 Min.
- Lehrjahr: 3
- Modus: `hybrid`
- Kern: sicherheitsrelevanten Fehler erkennen, unmittelbare Handlung von nachgelagerter Fehleranalyse unterscheiden, Lernmaßnahmen ableiten.
- Zweck im Unterricht: Risikomanagement als praktischen Prozess begreifen.

**Primäre Projektquellen:**
- Bayerischer Lehrplan MTR 2023: Qualitätsmanagement / Risiko- und Fehlermanagement.
- `Medizinische Physik`: Qualität und Sicherheit in der Strahlentherapie.
- vorhandene Arbeitsablauf-/SOP-Unterlagen als Praxisbezug.

## 5. Rolle der Systeme in der Beta

| System | Aufgabe |
|---|---|
| Google Drive / Projektquellen | Fachliche Originale und Unterrichtsmaterial |
| ChatGPT / Friday | Quellen auswerten, didaktisch ableiten, Varianten erzeugen |
| GitHub-Lernapp | Schülerzugang, Module, Fälle, zentrale Itembank |
| Kahoot | optionaler Live-Wissenscheck aus ausgewählten Masterfragen |
| BookWidgets | nur bei notwendiger Abgabe/Rückmeldung |
| Wordwall | nicht Teil der Beta |

## 6. Unterrichtseinsatz

Die Lernapp ersetzt den 160-Minuten-Unterricht nicht.

Empfohlene Funktion:

```
Aktivierung / kurzer Input
        ↓
Knowledge-Modul
        ↓
Lehrgespräch / Demonstration / Gruppenarbeit
        ↓
Case-Modul
        ↓
gemeinsame Auswertung
        ↓
optional Kahoot / Wiederholung
```

Die digitale Zeit soll gezielt bleiben. Der Mehrwert entsteht aus Vorbereitung, Strukturierung, Transfer und Wiederholung – nicht aus möglichst viel Bildschirmzeit.

## 7. Beta-Erfolgskriterien

Die Beta gilt nur dann als Erfolg, wenn sie im realen Unterricht mindestens diese Punkte erfüllt:

1. **Einfacher Zugang:** Ein Link oder QR-Code reicht; keine technische Einweisung nötig.
2. **Keine Doppelpflege:** Masterfragen werden nur in der GitHub-Itembank fachlich gepflegt.
3. **Unterrichtsnutzen:** Die digitalen Bausteine unterstützen eine konkrete Unterrichtsphase.
4. **Wiederverwendbarkeit:** Das Modul ist im nächsten Jahr ohne Neubau verwendbar.
5. **Vertretbarkeit:** Eine fachkundige Vertretung kann anhand des Dozenten-Briefings verstehen, was zu tun ist.
6. **Aktualisierbarkeit:** Eine fachliche Änderung lässt sich an einer definierten Stelle korrigieren.
7. **Plattformdisziplin:** Eine externe Plattform bleibt nur im Prozess, wenn ihr Mehrwert den Pflegeaufwand klar übersteigt.
8. **Verstaendliche Aufgabensprache:** Arbeitsauftraege sind kurz, eindeutig und handlungsorientiert formuliert. Fachliche Tiefe darf nicht durch unnoetig akademische Sprache verdeckt werden.
9. **Retrieval vor Erklärung:** Lernende beobachten, ordnen oder entscheiden zuerst. Infotext, Lösung und ausführliche Erklärung folgen danach.

## 8. Bewusst nicht Teil der Beta

- automatische Vollsynchronisation Drive ↔ GitHub,
- automatische Kahoot-/BookWidgets-Synchronisation,
- Benutzerkonten oder Cloud-Lernstandsverwaltung,
- vollständiger Ausbau des 3. Lehrjahres,
- neue technische Frameworks,
- Gamification um ihrer selbst willen.

## 9. Auswertung nach beiden Einheiten

Nach Dosisverteilung und QM/Risikomanagement werden fünf Fragen beantwortet:

1. Wo hat das System dem Dozenten messbar Arbeit erspart?
2. Wo hat es zusätzliche Arbeit erzeugt?
3. Welche digitalen Bausteine wurden von den Schülern tatsächlich genutzt?
4. Was könnte eine Vertretung ohne zusätzliche Erklärung übernehmen?
5. Was wird für Beta 2 gestrichen, vereinfacht oder ausgebaut?

**Entscheidungsregel:** Nur Funktionen mit erkennbarem Unterrichts- oder Effizienzgewinn werden weitergeführt.


## 10. Konkreter Pilot-Unterricht

Der 160-Minuten-Pilot fuer Dosisverteilung ist dokumentiert unter:

- `docs/UNTERRICHTSPLAN-DOSISVERTEILUNG-3LJ-BETA.md`


## 11. Didaktische Regel: Antworten nicht vorwegnehmen

Die Beta folgt dem Prinzip **Versuch -> Rueckmeldung -> Erklaerung -> Transfer**.

Verbindlich:
- Eine Frage darf nicht unmittelbar durch Text, Bildbeschriftung oder Legende davor beantwortet werden.
- Definitionen, Loesungen und beschriftete Grafiken werden erst **nach einem ersten eigenen Versuch** gezeigt, wenn die Aufgabe genau dieses Wissen prueft.
- Vorwissen wird aktiv abgerufen, bevor die Kurzinfo erscheint.
- Nach einer Erklaerung folgen **Transferfragen**, keine wortgleichen Wiederholungsfragen.
- Bilder erhalten bei Zuordnungsaufgaben eine **Schuelerversion ohne Loesungslabels** und bei Bedarf eine Loesungsversion.
- Offene Aufgaben wie *entscheiden, begruenden, zeichnen, vergleichen* werden bevorzugt, wenn sie zum Lernziel passen.

Qualitaetsfrage vor Freigabe:
> Kann ein Lernender die richtige Antwort finden, ohne den Inhalt verstanden zu haben, nur weil sie direkt davor steht?

Wenn ja, wird der Baustein umgebaut.
