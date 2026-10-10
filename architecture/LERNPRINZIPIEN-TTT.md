# Bewertung: Übernahme hilfreicher Lernprinzipien aus Tumor Target Therapy

Stand: 2026-10-10. Entscheidung: vom Nutzer zur Übernahme autorisiert.
Geltung: neue und überarbeitete Module, Pilotbranch vor Zusammenführung nach main.
Kanonischer Bezug: ARCHITECTURE.md §§6.2, 13.5, 15.4 und MODUL-SCHEMA-V3.md.
Klassifikation: Feature-/Architektur-Bewertung, Inhaltsstruktur und UI/UX.

## Didaktischer Wert

Kurze, klar abgegrenzte Lerneinheiten verbinden Grundlagen mit klinischen
Entscheidungen. Für die MTR-Ausbildung ist die Zielhandlung entscheidend:
beobachten, Bedeutung einschätzen, Vorgehen begründen, Rücksprache und Übergabe.
Wiederholung, Selbstarbeit und Abschlussvorbereitung verwenden dieselben Inhalte.

Bei neuem Grundlagenwissen ist Erklärung vor der Verständnisfrage sinnvoll.
Bei einer Transfer- oder Entscheidungsaufgabe steht der eigene Versuch vor der
vollständigen Lösung. Es gibt keine pauschale Regel, jedes Modul mit einer
Freitext-Eingabe zu beginnen. Die Reihenfolge folgt Lernziel und Vorwissen.

## Technischer Wert

Die bestehende Architektur bietet genau fünf passende Modultypen. Lernpfade
komponieren stabile Modul-IDs; die Registry bleibt die einzige organisatorische
Metadatenquelle. Eine gemeinsame Hilfenkomponente ist langfristig einfacher als
eigene SOS-Systeme pro Fall. Hilfe und Feedback gehören in DOM-Oberflächen,
nicht in Canvas.

## Hosting-Fit (GitHub Pages)

Die Prinzipien sind mit Vanilla HTML/CSS/JavaScript und statischen JSON-/Markdown-
Dateien umsetzbar. Sie benötigen weder Backend noch Benutzerkonten oder externe
KI-Bewertung. Hilfen werden redaktionell erstellt und lokal angezeigt.
Für die nächste Hilfen-Erweiterung ist keine zusätzliche Persistenz vorgesehen.

## Übernahmematrix

| Prinzip | Entscheidung | Anwendung in unserer App | Stand auf dem Pilotbranch |
|---|---|---|---|
| Kleine Lerneinheiten | Core | Maximal drei Lernziele, begrenzter Arbeitsauftrag, vorhandene Umfangsgrenzen | Inhaltlich/architektonisch vorhanden; Autorenregel präzisiert |
| Eine Inhaltsbasis mit mehreren Zugängen | Core | Lernwege, Themen, Training, Abschluss verwenden gleiche IDs und Bearbeitungsdaten | Im Prostata-Pilot implementiert |
| Geführte klinische Lernwege | Core | Empfohlene Reihenfolge, klinisches Ziel und Rückweg; Stationen frei wählbar | Im Prostata-Pilot implementiert |
| Grundlagen und Vertiefung | Core | Pflichtgrad in Registry, Bausteintiefe mit vorhandenen Feldern; Kennzeichnung in Text und Farbe | Architektur vorhanden; vollständige Rendererabdeckung gesondert prüfen |
| Gestufte Hilfe | Core bei anspruchsvollen Aufgaben | Denkimpuls, fachlicher Hinweis, dann Feedback nach eigenem Versuch | Autorenstandard übernommen; gemeinsame Hilfen-UI offen |
| Differenziertes Handlungsfeedback | Core | Relevanter Befund, Bedeutung der Option, nächster Schritt und Zuständigkeitsgrenze | Feedbackfunktion vorhanden; redaktionelle Prüfung je Modul |
| Kurze eigene Begründung | Optional, nach Lernziel | Beobachtung/Begründung vor Auswahloptionen; kein automatisches Qualitätsurteil | In Pilotfällen und MC-Bildanalyse implementiert |
| Übersichtsgrafik oder Kurzvideo | Optional | Grafik bei echtem Orientierungsgewinn; Video mit Textalternative | Bestehende Medienwege verwenden |
| Richtige Antwort als Zugangscode zum nächsten Modul | Ablehnen | Freie Stationsnavigation; Wiederholung bei Fehlern | Freie Navigation im Pilot vorhanden |
| Escape-Room-Rahmen als App-Grundstruktur | Ablehnen für den aktuellen Ausbau | Klinischer Handlungsablauf trägt die Orientierung | Kein zusätzlicher Modultyp, keine Spielwelt |

## Verbindlicher Modulaufbau

1. Orientierung: Worum geht es, was soll ich leisten, was ist sinnvoll vorausgesetzt?
2. Ein klarer Arbeitsauftrag mit den nötigen Fallinformationen oder einem kurzen Wissenskern.
3. Eigenständige Bearbeitung; Hilfen bei Bedarf, vollständige Lösung erst nach Versuch.
4. Feedback, das fachliches Denken erklärt und erneute Bearbeitung ermöglicht.
5. Kurzer Transfer oder bestehender Exit-Slip; verständlicher Rückweg zum Einstieg.

Dies ist eine Autoren-Blaupause, keine zusätzliche Rendererlogik. Nicht jede
Lerneinheit benötigt ein Video, eine Grafik oder alle fünf Modultypen.
Zeitangaben sind Schätzungen ohne Zeitlimit. Klinische Fristen in einem Fall
werden bei Bedarf als Fallinformation erläutert.

## Hilfestufen: nächste konkrete Umsetzung

Zunächst wird ein bestehender Prostatafall erweitert; erst danach wird der
Baustein auf weitere anspruchsvolle Aufgaben übertragen.

| Stufe | Zeitpunkt | Inhalt | Grenze |
|---|---|---|---|
| Denkimpuls | Auf Abruf vor oder während des eigenen Versuchs | Lenkt die Aufmerksamkeit auf eine Beobachtung oder einen Vergleich | Nennt keine richtige Option |
| Fachlicher Hinweis | Auf weiteren Abruf | Gibt ein relevantes Prinzip oder eine gezielte Quellenstelle | Enthält keine vollständige Handlungsantwort |
| Feedback/Erwartungshorizont | Nach eigenem Versuch | Erklärt Entscheidung und Folgen; bietet Vergleich mit eigener Antwort | Behauptet keine automatische Bewertung des Freitextes |

Beispiel für den vorhandenen Fall 05-enddarmvorbereitung-becken:
- Denkimpuls: „Welche Information beschreibt den aktuellen Befund, welche die Vorbereitungsvorgabe?“
- Fachlicher Hinweis: „Vergleiche den Befund mit der im Fall genannten Vorgabe. Trenne Beobachtung und mögliche Bedeutung.“
- Feedback: nutzt die vorhandenen optionenspezifischen Rückmeldungen und klärt Vorgehen sowie offene Zuständigkeit.

Technischer Auftrag für lernapp-implementierung:
- Optionale Hilfedaten zuerst in MODUL-SCHEMA-V3.md definieren; Bestandsmodule ohne Hilfen weiter unterstützen.
- Ein gemeinsamer DOM-Baustein für abrufbare Hinweise, schrittweise Freigabe und Tastaturbedienung.
- Vorhandene Feedbackfelder weiterverwenden; keine zweite Musterlösungsablage.
- Hinweise in aktuellem Modulkontext halten; kein globales SOS-Menü und kein neuer Fortschritts-Key.
- Feedback oder Lösung nicht unbeabsichtigt über Hilfen vor eigener Abgabe sichtbar machen.
- Vor breiter Übertragung: Beobachten, ob Lernende danach ihre eigene Begründung verbessern können.

## Feedback als Autorenstandard

Jede Handlungsoption erhält eine eigene, kurze Rückmeldung:
- Welcher Fallbefund ist für diese Option relevant?
- Warum ist die Handlung hier passend oder problematisch?
- Was muss als Nächstes geprüft, getan oder geklärt werden?
- Welche Aussage lässt die vorliegende Information noch nicht zu?

Die vorhandenen Feedback-/Rationale-Felder bleiben die technische Form.
Für einfache Wissensfragen genügt eine knappe fachliche Erklärung; klinische
Folgen werden nicht künstlich ergänzt. Plausible alternative Formulierungen im
Transfer sind zulässig. Korrektheitsquote, Bearbeitungsstatus und Wortzahl bleiben
von einer beobachteten praktischen Kompetenz getrennt.

## Content-Produktion mit geringem Pflegeaufwand

Vor jedem neuen Modul:
1. Vorhandene Registry-Einträge, Infotexte und Items prüfen; erst Wiederverwendung, dann Neuanlage.
2. Maximal drei Lernziele und eine konkrete Zielhandlung definieren.
3. Lerninhalt im Modul/Infotext, Metadaten in der Registry, Reihenfolge im Lernpfad pflegen.
4. Pflichtkern von Vertiefung unterscheiden; notwendige Fallinformationen nicht verstecken.
5. Feedback und gegebenenfalls zwei Hilfen zusammen mit dem Arbeitsauftrag verfassen.
6. Bei Medien: Herkunft, Rechte, Anonymisierung und zugängliche Alternative prüfen.
7. Zeitabhängige Aussagen vor Freigabe anhand aktueller fachlicher Quellen prüfen; lokale SOPs ausdrücklich als Fallvorgaben kennzeichnen.
8. Fachlichen Review und kurzen Einsatztest durchführen; ungeprüfte Inhalte bleiben review.

Die beigefügten Markdown-Skripte sind Ausgangsmaterial für die Zerlegung in
Lernziele und Handlungen. Die konvertierten Fachbücher sind keine pauschal
freigegebene oder automatisch aktuelle öffentliche Inhaltsquelle.
Diese Übernahme importiert weder Buchtexte noch fremde Grafiken oder Videos.

## Risiken

- Zu viele Hilfen können die Lösung vorwegnehmen: maximal zwei kurze vorbereitende Stufen, danach reguläres Feedback.
- Zu viele kleine Module zerlegen den Zusammenhang: der klinische Lernpfad hält die Handlungskette zusammen.
- Videoproduktion kann zum Engpass werden: Text/Schema bildet den Kern, Video bleibt optional.
- Eine Oberfläche kann Fortschritt wie Kompetenz aussehen lassen: bearbeitet, Quizergebnis und Selbstbewertung getrennt benennen.
- Die zusätzliche Mindestwortzahl kann bloße Fülltexte erzeugen: nur bei begründeter Aufgabe verwenden.
- Dokumentierte Prinzipien sind nicht automatisch vorhandene Funktionen: Umsetzungsstatus offen ausweisen.

## Einfachere Alternative

Bestehende fünf Modultypen, Registry, Lernpfade und Feedbackfelder konsequent
nutzen. Eine kleine gemeinsame Hilfenkomponente ergänzen. Das ist für einen
Einzelautor wartbarer als eine zweite Fallengine, komplexe adaptive Lernwege
oder eine umfassende Videobibliothek.

## Endempfehlung

**Core:** kleine wiederverwendbare Lerneinheiten, gemeinsame Inhaltsbasis,
freie geführte Lernwege, gekennzeichnete Vertiefung, MTR-Handlungsfeedback und
gestufte Unterstützung bei anspruchsvollen Aufgaben.
**Optional:** eigene Kurzbegründung, Übersichtsgrafik und Video nach Lernziel.

## Konsistenz-Check und betroffene Dateien

**Passt es in die bestehende Architektur? Ja.** Alle Prinzipien nutzen die
fünf vorhandenen Typen; Lernwege sind Komposition. DOM, GitHub Pages und die
vorhandenen Daten-/Fortschrittsquellen bleiben die Grundlage.

**In diesem Arbeitsschritt geändert:**
- ARCHITECTURE.md: v3.2, Regeln in §§6.2, 13.5 und 15.4 sowie Online-Fallback.
- architecture/MODUL-SCHEMA-V3.md: Autorenregeln und Implementierungsgrenze.
- architecture/LERNPRINZIPIEN-TTT.md: Übernahmematrix und Umsetzungsauftrag.
- architecture/REFERENZPFAD-PROSTATA.md: vorhandene und ausstehende Funktionen.
- README.md: Einstieg in die verbindlichen Regeln.

**Später durch lernapp-implementierung betroffen:**
- architecture/MODUL-SCHEMA-V3.md: Datenvertrag der optionalen Hinweise vor Code.
- Gemeinsame Hilfenkomponente unter js/ und passende Renderer (zunächst case).
- css/app.css: zugängliche Hilfendarstellung.
- content/modules/05-enddarmvorbereitung-becken.json: erster Hinweis-Pilot.
- tools/validate-content.js: Prüfung des dokumentierten optionalen Datenfelds.

**Registry:** Für diese Architektur-/Autorenregeln keine neuen Einträge oder
Felder. Erst neue reale Module erfordern neue Einträge; der Pilot bleibt review.
**ARCHITECTURE.md:** Die Regeln und die noch offene Hilfen-UI sind dokumentiert.
Kein Merge oder Deployment ist Teil dieses Arbeitsschritts.

## Referenz und Evidenzgrenze

Die öffentliche Referenz wurde am 2026-10-10 untersucht:
- [Interaktives E-Book: Einführung und Inhaltsstruktur](https://kmed.uni-giessen.de/ilias.php?baseClass=illmpresentationgui&cmd=layout&obj_id=42676&ref_id=172102)
- [Universität Marburg: Falltour, Unterstützung und Lehrkonzept (2021)](https://www.uni-marburg.de/de/aktuelles/news/2021/hilke-vorwerk-erhaelt-preis-fuer-exzellente-hochschullehre)

Die Referenz stützt Inspirationen wie kurze Erklärungen, Verständnisfragen,
Differenzierung und geführte Fälle. Freie Navigation, die hier definierte
Hilfenfolge und MTR-Handlungsfeedback sind eigene Anpassungen unseres Projekts.
Geschützte Patientenfälle und der vollständige aktuelle Interaktionsablauf
wurden nicht geprüft. Eine fachliche Validierung aller Referenzinhalte oder
ein nachgewiesener Lernerfolg wird daraus nicht abgeleitet.
