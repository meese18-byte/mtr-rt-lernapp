# UX-CONCEPT-V1 – Lernapp Strahlentherapie MTR

**Stand:** 2026-09-28  
**Status:** Entwurf / Entscheidungsgrundlage, noch nicht kanonisch  
**Ziel:** Festlegen, wie Lernende die App wahrnehmen, navigieren und nutzen, bevor die Ausbildungs-Landkarte und Serienproduktion beginnen.

---

## 1. Produktthese

Die Lernapp soll sich **nicht wie ein digitales Skript** und **nicht wie eine reine Quiz-App** anfühlen.

Das Kernprodukt ist eine **klinische Lernreise**:

> Wissen verstehen → klinische Situation beurteilen → Bild/Setup analysieren → Entscheidung begründen → Wissen sichern → Transfer reflektieren.

Die fünf Standardmodultypen bleiben unverändert. UX und Navigation ordnen diese Module lediglich sinnvoll an.

---

## 2. Zielbild für Lernende

Die App muss vier unterschiedliche Nutzungssituationen gleichzeitig unterstützen:

1. **Ich lerne systematisch weiter.**  
   Ein klarer Lernpfad zeigt, was als Nächstes sinnvoll ist.

2. **Ich muss schnell etwas nachsehen.**  
   Themen und Kapitel müssen direkt erreichbar sein, ohne durch einen Lernpfad zu navigieren.

3. **Ich möchte gezielt trainieren.**  
   Fälle, Bildanalysen und Quizitems sollen thematisch und später auch nach Schwierigkeit auswählbar sein.

4. **Ich bereite mich auf den Abschluss vor.**  
   Prüfungsvorbereitung bündelt relevante Module, ohne eine zweite Content-Welt zu erzeugen.

Diese vier Nutzungssituationen sind die Grundlage der Informationsarchitektur.

---

## 3. Inspiration – Prinzipien, nicht Kopien

### Duolingo
Nützliches Prinzip: klarer geführter Pfad, kleine Einheiten, Wiederholung als Teil des Weges statt separater Nacharbeit.

Übernehmen:
- sichtbarer nächster Schritt,
- Fortschritt entlang eines Pfades,
- kurze, klar abgegrenzte Einheiten.

Nicht übernehmen:
- Streak-Druck,
- Herzen/Leben,
- Ligawettbewerbe,
- starke Comic-/Belohnungsmechanik.

Quelle: https://blog.duolingo.com/new-duolingo-home-screen-design/

### Brilliant
Nützliches Prinzip: Lernpfade verbinden Erklärung und aktive Problemlösung; Checkpoints sind in den Lernweg eingebaut.

Übernehmen:
- Lernen und Anwenden eng verzahnen,
- aktive Aufgaben früh einsetzen,
- Lernpfade mit unterschiedlichen Interaktionsformen.

Nicht übernehmen:
- XP als zentrale Leistungsmetrik,
- komplexe Spezialinteraktionen ohne didaktischen Mehrwert.

Quelle: https://brilliant.org/help/features/what-are-learning-paths/

### AMBOSS
Nützliches Prinzip: Wissen und Fragenbank sind direkt miteinander verknüpft; Inhalte können sowohl zum systematischen Lernen als auch zum schnellen Nachschlagen genutzt werden.

Übernehmen:
- Lernmodus und Nachschlagemodus parallel,
- direkte Verknüpfung von Wissen ↔ Fall ↔ Frage,
- Fokus auf klinisch relevante Kernaussagen,
- schneller Einstieg in ein Thema.

Nicht übernehmen:
- Informationsdichte einer professionellen Vollbibliothek,
- Funktionen, die Backend, Benutzerkonto oder große Redaktion voraussetzen.

Quelle: https://www.amboss.com/de/studierende-uebersicht

### Khan Academy
Nützliches Prinzip: Fortschritt kann als zunehmende Beherrschung von Fähigkeiten gedacht werden und nicht nur als „abgehakt“.

Für später interessant:
- Kompetenzfelder,
- Wiederholungsbedarf,
- gemischte Checkpoints.

Für V1 bewusst noch nicht:
- komplexer Mastery-Score,
- scheinpräzise Kompetenzberechnung bei kleiner Itembasis.

---

## 4. Drei UX-Richtungen

## Variante A – Clinical Journey

### Idee
Die Startseite ist primär eine visuelle Lernlandschaft. Die Lernenden bewegen sich durch reale Bereiche der Strahlentherapie.

Beispiel:

```text
Orientierung
     │
Grundlagen
     │
Ambulanz
     │
Planungs-CT
     │
Planung
     │
LINAC
     │
laufende Therapie
     │
Indikationen / Sonderverfahren
     │
Abschluss
```

Innerhalb einer Indikation kann der Lernweg verzweigen:

```text
Mamma
  │
Grundlagen
  │
Planungs-CT
 ├──────────┐
DIBH    Lagerung
 └────┬─────┘
   Bildanalyse
       │
     Fall
       │
   Transfer
```

### Didaktischer Wert
Sehr hoch für Orientierung und Zusammenhang. Der Patient:innenweg wird sichtbar.

### Technischer Wert
Gut. Mit DOM + CSS + optional SVG-Linien umsetzbar. Kein Canvas erforderlich.

### Risiko
Wenn die Lernlandschaft alleinige Navigation wäre, würde schnelles Nachschlagen unnötig langsam.

### Bewertung
Stark als **Lernmodus**, zu schwach als alleinige Gesamtstruktur.

---

## Variante B – Hybrid Clinical Navigator

### Idee
Die App besitzt mehrere gleichberechtigte Einstiege, aber einen klaren Hauptfokus.

Startseite:

```text
┌─────────────────────────────────────────────┐
│ MTR Strahlentherapie                        │
│                                             │
│ Weiterlernen                                │
│ [ aktuelles Modul / Lernpfad ]              │
│                                             │
│ Mein Lernweg                                │
│ ●──●──◉──○──○                               │
│                                             │
│ Themen        Trainieren       Abschluss    │
│                                             │
│ Für dich sinnvoll als Nächstes              │
│ [Modul] [Fall] [Wiederholung]               │
└─────────────────────────────────────────────┘
```

Vier Hauptbereiche:

**Mein Lernweg**  
Geführte klinische Lernreise mit Fortschritt.

**Themen**  
Schneller Zugriff nach Kapitel, Indikation oder Prozessschritt.

**Trainieren**  
Quiz, Fälle und Bildanalysen; später Filter nach Thema und Schwierigkeit.

**Abschluss**  
Fallvorstellung, PLCT-Störfälle, Transfer und gemischtes Wissen.

### Didaktischer Wert
Sehr hoch: Orientierung ohne Zwang. Lernende können systematisch lernen oder gezielt nachschlagen.

### Technischer Wert
Sehr hoch: nutzt Registry, Lernpfade und Itembank ohne zusätzliche Content-Architektur.

### Risiko
Die Startseite darf nicht mit zu vielen Auswahlmöglichkeiten überladen werden.

### Bewertung
**Bevorzugte Arbeitsrichtung.**

---

## Variante C – Medical Library

### Idee
Klassische, sehr schnelle medizinische Wissensplattform.

Startseite:

```text
Suche ______________________

Zuletzt bearbeitet
[ ... ]

Themen
Planungs-CT
IGRT
Mamma
Prostata
HNO
...

Trainieren
[Quiz] [Fälle] [Bildanalyse]
```

### Didaktischer Wert
Gut für selbstständige ältere Lernende und als Nachschlagewerk.

### Technischer Wert
Sehr gut und einfach.

### Risiko
Der klinische rote Faden verschwindet. Die App könnte wieder wie eine Sammlung einzelner Lernmaterialien wirken.

### Bewertung
Sehr gut als **Themenansicht**, aber nicht als alleinige Produktidee.

---

## 5. Empfohlene Kombination

Die Arbeitsannahme für die weitere Planung lautet:

> **Hybrid Clinical Navigator mit Clinical Journey als zentralem Lernmodus und Medical Library als schnellem Zweitzugang.**

Das bedeutet:

- Startseite priorisiert „Weiterlernen“ und den Lernweg.
- Themen bleiben jederzeit direkt erreichbar.
- Training erhält einen eigenen Bereich.
- Abschlussvorbereitung erhält einen eigenen Einstieg.
- Ein Lernpfad sperrt keine Inhalte. Voraussetzungen bleiben Empfehlungen.
- Keine klassische Fantasy-Dungeon-Grafik; die „Dungeon“-Logik wird in eine klinische Lernlandschaft übersetzt.

---

## 6. Navigationsmodell

Vorgeschlagene Hauptnavigation:

```text
Start
Lernweg
Themen
Trainieren
Abschluss
Einstellungen
```

Auf kleinen Displays kann die Navigation reduziert werden:

```text
Start | Lernweg | Themen | Mehr
```

Unter „Mehr“ liegen Trainieren, Abschluss und Einstellungen.

Keine Navigation wird in Canvas umgesetzt.

---

## 7. Startseite – Prioritäten

Reihenfolge von oben nach unten:

1. **Weiterlernen**
   - zuletzt bearbeitetes oder empfohlenes nächstes Modul
   - Modulart + Dauer
   - klarer „Weiter“-Button

2. **Mein Lernweg**
   - kompakte visuelle Darstellung
   - aktueller Standort
   - nächster sinnvoller Schritt
   - Prozentzahl nur ergänzend

3. **Schnellzugriff**
   - Themen
   - Trainieren
   - Abschlussvorbereitung

4. **Aktuell relevant**
   - begonnen
   - noch nicht abgeschlossen
   - später: Wiederholung empfohlen

Legacy-Inhalte erscheinen nicht prominent auf der normalen Startseite.

---

## 8. Lernpfad-Ansicht

Ein Lernpfad zeigt:

- Titel und klinisches Ziel,
- geschätzte Gesamtzeit,
- Lehrjahr,
- Module als Knoten,
- Modulart durch Icon + Text,
- Status: offen / begonnen / abgeschlossen,
- empfohlene Reihenfolge,
- optionale Verzweigungen.

Beispiel:

```text
Mammakarzinom · Lehrjahr 2–3

[✓] Grundlagen              knowledge
 │
[✓] Anatomie & OAR          knowledge
 │
[●] Planungs-CT             case
 ├───────────────┐
[ ] DIBH       [ ] Setup    case / image-analysis
 └───────┬───────┘
       [ ] Fall             case
         │
       [ ] Check            quiz
         │
       [ ] Transfer         transfer
```

Mobile: vertikaler Pfad.  
Desktop/Tablet: räumlichere Darstellung möglich.

---

## 9. Modulansicht – gemeinsamer Rahmen

Jeder Modultyp erhält dieselbe Hülle:

```text
Kapitel / Lernpfad
Titel
Modulart · Dauer · Lehrjahr · Pflichtgrad

Warum ist das klinisch relevant?

[ eigentlicher Modulinhalt ]

Feedback / Merke

Weiter:
[ nächstes Modul ]

Exit-Slip
Drucken
```

Das reduziert kognitive Last: Die Interaktion ändert sich, nicht die gesamte Oberfläche.

---

## 10. Motivation und Gamification

### In V1 sinnvoll

- sichtbarer Fortschritt,
- „Weiterlernen“,
- abgeschlossene Stationen,
- kleine Meilensteine,
- Wiederholung als normaler Bestandteil des Weges,
- positives, sachliches Feedback.

### In V1 nicht sinnvoll

- Streaks,
- Ranglisten,
- virtuelle Währungen,
- Lootbox-/Chest-Mechaniken,
- Leben/Herzen,
- künstliche Sperren,
- Punkte als Hauptziel.

Die Zielgruppe soll sich fachlich kompetenter fühlen – nicht primär spielerisch belohnt.

---

## 11. Kompetenzdarstellung – spätere Ausbaustufe

Langfristig denkbar:

```text
Planungs-CT              sicher
Lagerung                 im Aufbau
IGRT                     noch üben
Bildanalyse              im Aufbau
klinische Entscheidungen sicher
Fallvorstellung          noch üben
```

Voraussetzung dafür ist eine ausreichend große und mehrfach messende Item-/Aufgabenbasis. Vorher wäre ein Kompetenzstatus zu ungenau.

---

## 12. Visuelle Designsprache – noch offen

Die Informationsarchitektur wird vor Farbe und Dekoration entschieden.

Für den nächsten Designvergleich sollen drei visuelle Richtungen als Low-Fidelity-Entwurf gegenübergestellt werden:

### A – Clinical Clean
Hell, medizinisch, ruhig, sachlich. Klare Karten, wenig Dekoration.

### B – Clinical Mission
Etwas stärker visuell: Pfad, Stationen, leichte räumliche Tiefe, klinische Icons. Motivierende Lernreise ohne Spielzeug-Optik.

### C – Technical Radiotherapy
Dunklere/technische Anmutung, inspiriert von Bildgebung/TPS/Control-Room-Interfaces, aber deutlich heller und zugänglicher als echte Geräteoberflächen.

Die finale Richtung soll aus Nutzbarkeit + Lernwirkung gewählt werden, nicht aus reiner Optik.

---

## 13. Accessibility / Hosting-Fit

Verbindlich:

- DOM für Navigation, Karten und Pfade,
- SVG höchstens für dekorative/verbindende Linien,
- vollständige Tastaturbedienung,
- Status nie nur über Farbe,
- responsive Smartphone-/Tablet-/Desktop-Darstellung,
- keine externen UI-Bibliotheken,
- keine externen Fonts,
- kein Canvas für Lernpfad oder Dashboard.

---

## 14. Entscheidungspunkt vor Implementierung

Bevor das UX-Konzept in `ARCHITECTURE.md` übernommen und implementiert wird, werden drei Low-Fidelity-Varianten derselben vier Screens verglichen:

1. Startseite
2. Lernpfad
3. Modulansicht
4. Trainingsbereich

Erst danach wird die visuelle Richtung verbindlich.

---

## 15. Arbeitsentscheidung V1

**Empfehlung:** Hybrid Clinical Navigator.

**Status:** bevorzugte Hypothese, noch keine endgültige Architekturentscheidung.

**Warum:** Er verbindet geführtes Lernen, schnellen Wissenszugriff, aktives Training und Abschlussvorbereitung, ohne zusätzliche Modultypen oder parallele Content-Welten zu erzeugen.
