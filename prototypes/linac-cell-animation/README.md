# Vom LINAC zur Zellwirkung · isolierter Animationspilot

Stand: 25.10.2026. Quellenbasierter Lehrentwurf mit zusätzlicher visueller Detailstudie; keine abschließende fachliche oder didaktische Freigabe.


## Aktueller Einstieg: Phase 01 von vier Phasen

**`phase1.html`** ist die neue, quellenbezogen überarbeitete erste Phase: Elektronenquelle und Wanderwellen-Beschleunigung. Vier Ansichten bilden einen 68-sekündigen Abschnitt. Die anschließenden Phasen werden nach dem gemeinsamen Review ausgearbeitet. Der bisherige Gesamtablauf und die ältere Detailstudie bleiben als Vergleich verfügbar.

| Phase | Inhalt | Status |
|---|---|---|
| 01 | Elektronenquelle, Injektion, HF-Zufuhr, Wanderwelle, Energiegewinn | Fassung 3 mit Gesamtgerät und Kamerafahrten; Review offen |
| 02 | Photonenerzeugung, Strahlführung, Monitoring, Feldformung | Detailausbau nach Review 01 |
| 03 | Gewebewechselwirkungen und Strahlenchemie | Danach |
| 04 | DNA-Schäden und Zellreaktion | Danach; anschließend gemeinsamer Gesamtfilm-Review |

**Ansichten der Phase 01:** 00:00 Orientierung; 00:12 Elektronenkanone; 00:28 Wanderwelle; 00:52 Energiegewinn; Ende 01:08. Wiedergabe startet bewusst. Standardmäßig pausiert sie am nächsten Bildwechsel; die Option kann für den zusammenhängenden Film ausgeschaltet werden. Vier Ansichtstasten, Zeitleiste, Tempo und Großansicht sind direkt bedienbar. In der HF-Ansicht setzt ein zusätzlicher Knopf Feld und Pakete gemeinsam um eine Achtelperiode weiter. Beschriftung, E-Feld und Kraft sind separat ausblendbar.

**Fachliche Weiterentwicklung:** Die zuvor rein funktionellen HF-Pfeile sind hier durch ein gemeinsames, idealisiertes Orts-/Zeitmodell für Feld und Pakete ersetzt. Elektrische Feldrichtung und Kraft auf das negative Elektron werden getrennt und mit korrektem Vorzeichen dargestellt. Der gezeigte HF-Ausschnitt setzt bereits gebündelte, relativistische Elektronen voraus; Buncher, Raumladung und Phasenschlupf werden nicht berechnet. Die sichtbare Periode von 8 Sekunden ist eine didaktische Zeitlupe. Das Beispiel 2 → 6 MeV beschreibt einen späteren Beschleunigungsabschnitt, nicht die Injektionsenergie. Die Geschwindigkeit wird relativistisch berechnet; geometrische Maße bleiben illustrativ.

**Quellen und gemeinsames Review:** [SOURCES.md](SOURCES.md) ordnet Funktionen und Gestaltungsgrenzen den Fachquellen zu. [REVIEW.md](REVIEW.md) dokumentiert die vier Phasen, die konkreten Prüffragen, übertragbare Gestaltungsregeln und die abschließende Rückprüfung aller Phasen. Neue Hauptquelle ist Schlegel/Karger/Jäkel (2018), Kap. 20.6.3.3, ergänzt durch IAEA und Krieger. Es werden keine hochgeladenen Bücher oder Quellenbilder im Repository veröffentlicht.

**Prüfung am 23.10.2026:** JS-Syntax; vier Ansichten auf Desktop und mobilem Viewport visuell geprüft; alle Wiedergabe- und Ansichtssteuerungen einschließlich Pausen am Bildwechsel und Ende geprüft. Keine Laufzeitfehler und keine automatischen externen Requests. 320/390/700/850/1120/1440 px ohne horizontalen Überlauf. Mathematische Invarianten für Ladungsvorzeichen, periodischen Feldwechsel, synchrone Pakete und relativistische Geschwindigkeit geprüft. Software-Rendering lokal geprüft; das ist keine Messung auf einem echten Smartphone. Unabhängiger medizinphysikalischer Review und Unterrichtstest bleiben offen.

Modelltest lokal: `node tests/phase1-model.test.cjs`. Kein Build und keine Fremdbibliothek für die Animation erforderlich.

Zusätzliche Dateien: `phase1.html`, `phase1.css`, `phase1.js`, `phase1-model.js`, `tests/phase1-model.test.cjs`, `phase1-camera.js`, `tests/phase1-camera.test.cjs`, `REFERENCE-INSTAGRAM.md`, `SOURCES.md` und `REVIEW.md`. Änderungen bleiben innerhalb dieses Prototypverzeichnisses.

## Räumlich zusammenhängende Phase 01 (25.10.2026)

Fassung 3 bettet die Bauteile in eine eigene LINAC-Gesamtgeometrie mit Stativ, Gantryarm, Strahlkopfhülle und Patientenliege ein. Die Kamera fährt vom Gerät zur Beschleunigungsstrecke, zur Elektronenkanone und weiter zur Wanderwelle. Alle Ansichten verwenden dieselben Bauteilkoordinaten; eine dauerhaft sichtbare Gerätekarte markiert den betrachteten Bereich. Die Zeitleiste reproduziert die Kameraposition deterministisch.

„Geführte Kamerafahrt“, „Versorgungswege“ und „Steuern & fokussieren“ bieten verschiedene Zugänge zur Orientierung. „Gesamtgerät“ hält an und führt zurück. Der Schalter „Kamerafahrten“ ermöglicht feste Perspektiven; `prefers-reduced-motion` wird berücksichtigt. Standardmäßige Lernhalte und die 68-Sekunden-Struktur bleiben erhalten.

Die neue Instagram-Referenz und die daraus abgeleiteten Regeln sind in [REFERENCE-INSTAGRAM.md](REFERENCE-INSTAGRAM.md) dokumentiert, einschließlich eines 10–12-minütigen Orientierungstests. Es wurden eigene Geometrie und Beschriftung erstellt. Die neue Referenz ersetzt keine Fachquelle; Strahlkopf, Dosis und Biologie folgen in den späteren Phasen. Die gestrichelte Achse unter dem Kopf ist nur eine Orientierungshilfe.

Neue Modellprüfung: `node tests/phase1-camera.test.cjs` prüft kontinuierliche Position, Zoom und Orientierung an den Übergängen sowie feste Perspektiven bei reduzierter Bewegung. Die Physiktests bleiben getrennt. Browserprüfung umfasst Kameranavigation, Rücksprung, Modusmarkierung, Bewegungsoption, bisherige Bedienung und 320–1440 px. Fachlicher Gegencheck und echter Unterrichtstest stehen weiter aus.

## Technische Ergänzung aus der Video-Transkription (24.10.2026)

Fassung 2 ergänzt ein Makropulsdiagramm für HF, Injektion und dauerhaft heiße Kathode. Sichtbare Elektronen entstehen aus vorherigen Emissionszeitpunkten. In Ansicht 01 lässt sich zwischen Versorgungswegen und einer generischen Steuer-/Fokusansicht wechseln. Resonator-/Irisfunktion, Magnetron/Klystron und Diodeninjektion sind präzisiert. Die vier Hauptansichten und 68 Sekunden bleiben erhalten. Die neuen Zeitskalen und Spulengeometrien sind ausdrücklich illustrativ.

[REFERENCE-VIDEO.md](REFERENCE-VIDEO.md) dokumentiert die fachliche Bewertung der vom Nutzer gelieferten Transkription, die noch ausstehende Sichtprüfung des Films, priorisierte Vorgaben für Phase 02 und einen 12-Minuten-Unterrichtstest. Es werden keine Gerätedimensionen ungeprüft übernommen.

Prüfung am 24.10.2026: Modelltests für Makropulse und zeitlich zugehörige Emission, Syntax, Bedienung und Szenenwechsel bestanden. Alle vier Szenen sowie die neue Spulenansicht auf Desktop und mobilem Viewport geprüft; 320–1440 px ohne horizontalen Überlauf. Neue UI-Integration, Großansicht und Vergleichsansichten ohne Laufzeitfehler. Keine Prüfung auf echter Smartphone-Hardware.

## Visuelle Detailstudie 01 (23.10.2026)

`detail.html` ist ein eigenständiger 52-Sekunden-Film innerhalb desselben Piloten. Der Gesamtablauf verlinkt ihn prominent; die Rückkehr führt über `index.html?chapter=4` direkt zur Strahlformung. Die übrigen acht Kapitel behalten ihren bisherigen illustrativen Stil. Die neue Detailtiefe ist noch nicht auf Zellbiologie oder den gesamten LINAC ausgedehnt.

| Filmzeit | Visuelle Vertiefung |
|---|---|
| 00:00–00:10 | Perspektivischer Schnitt durch kupferfarbene Resonatorzellen, Iriden, Vakuumraum und Achse. |
| 00:10–00:20 | Kamerafahrt mit Elektronenpaket und funktionellen Feldpfeilen. |
| 00:20–00:29 | Schematischer Wolframkonverter, Träger, bewegte Kühlkanalmarkierungen, Elektronen- und Photonenspuren. |
| 00:29–00:42 | Vergrößerung auf schematische Elektronenhüllen; ausgewähltes Bremsstrahlungsereignis mit bleibender Richtungsänderung der Elektronenspur und geradlinig fortlaufendem Photon. |
| 00:42–00:52 | Ausgewählte Ensembleereignisse und ein qualitativ gezeichnetes Kontinuum. |

Alle Bilder werden prozedural mit Canvas erzeugt: perspektivische Facetten, Materialschattierung, vorab berechnete Dichte-Sprites, Teilchenspuren und Überblendungen. Keine Bilder oder Filmsegmente aus Instagram werden verwendet. Es gibt keine externen Render- oder Medienabhängigkeiten.

**Fachliche Grenzen der zusätzlichen Darstellung:**

- Der Halb-Schnitt legt den Innenraum frei; er ist kein offener Betriebszustand. Abmessungen und Resonatorform sind generisch, keine Konstruktionszeichnung. HF-Pfeile zeigen nur die Funktion.
- Das Target ist eine illustrative Konverter-/Träger-/Kühlkonstruktion. Seine Schichten und Kanäle sind keine realen Herstellerdaten. Kühlmarkierungen sind keine Strömungssimulation.
- Elektronenhüllen sind schematische Dichtebilder, keine quantenmechanische Rechnung oder Sichtbarmachung einzelner Orbitale. Verhältnisse von Hülle, Kern und Atomabstand sind stark verändert.
- Die gekrümmte Elektronenspur wurde für ein Lehrereignis gewählt; kein berechneter Stoß im Coulombpotential. Sie erhält nach der Ablenkung eine geänderte Richtung. Der gezeichnete Photonentransport läuft geradlinig. Wellenpaketsymbole sind keine maßstäbliche Wellenlänge.
- Energiebeispiel: Elektron vorher 6 MeV, Elektron nachher 4 MeV, Photon 2 MeV; Rückstoßenergie des schweren Kerns vernachlässigt. Es wird keine kinematische Stoßrechnung oder Zuordnung zu einer konkreten LINAC-Strahlqualität behauptet.
- Das Kontinuum ist eine qualitative didaktische Zeichnung, ohne Ordinatenskala, Messdaten oder berechnete Statistik. Sichtbare Teilchenzahlen und Emissionen sind ausgewählt. Keine Ableitung von Ausbeute, Dosis, Energiefluenz oder Strahlqualität.
- Die visuelle Referenznähe ist ein Gestaltungsziel; die neue Version wird nicht als fertige vollständige oder die Vorlage übertreffende Animation ausgegeben.

**Prüfung am 23.10.2026:** Syntax beider JS-Dateien; fünf Abschnitte und 52 Sekunden; mehrere Standbilder je Abschnitt auf Desktop und 390 px gesichtet; Wiedergabe, Pause, Zeitleiste, Abschnittswechsel, Label-/Spurenschalter und Ende ohne Loop geprüft. Keine Laufzeitfehler oder automatischen externen Requests. 320/390/700/850/1440 px ohne horizontalen Überlauf. Software-Chromium-Renderzeiten wurden zur internen Performance-Einschätzung gemessen; daraus wird keine Framerate für echte Smartphones abgeleitet. Querverweis zum Kapitel 4 des Gesamtablaufs geprüft. Medizinphysikalischer Gegencheck, Beamer-Lesbarkeit und Unterrichtstest bleiben ausstehend.

Zusätzliche Dateien: `detail.html`, `detail.css`, `detail.js`. Die gesamte Änderung bleibt unter `prototypes/linac-cell-animation/`.

## Ziel und didaktische Entscheidung

Die Energieübertragung vom technischen Gerät bis zu möglichen Zellfolgen verständlich machen. Ein 140-sekündiger stummer Gesamtablauf ist mit acht direkt anwählbaren Kapiteln verbunden. Die Filmzeit ist keine physikalische Zeitskala. Die Darstellung soll im Unterricht angehalten, erklärt und hinterfragt werden können.

Zielgruppe: MTR-Ausbildung. Basistext für das 2. Lehrjahr; zuschaltbare Vertiefung für das 3. Lehrjahr. Jede Station enthält einen Merksatz, einen Hinweis gegen Fehlvorstellungen und eine Denkfrage mit aufklappbarer Erklärung. Kein neuer Modultyp und keine Fortschritts-/Prüfungslogik.

Das hochgeladene Instagram-Recording `Screen_Recording_20261022_150206_Instagram.mp4` wurde als visuelle Referenz gesichtet: Geräteübersicht, Glühemission, Beschleunigung, Bremsstrahlung/charakteristische Strahlung, Gewebedurchtritt und Detektion. Übernommen wird das didaktische Prinzip des Ebenenwechsels. Bilder, Videosegmente, Texte und Audiomaterial werden nicht kopiert oder eingebettet. Alle Pilotgrafiken und Texte sind neu erstellt.

Eine diagnostische Röntgenröhre ist keine Vorlage für eine unveränderte LINAC-Mechanik: Beschleunigung durch HF-Felder, Target, MV-Spektrum, Strahlmonitoring und therapeutische Wirkung brauchen eine eigene Darstellung. Bilddetektion wird durch den für diesen Lehrzweck relevanten Weg zur chemischen und biologischen Wirkung ersetzt.

## Storyboard

| Filmzeit | Station | Visueller Schwerpunkt | Fachlicher Prüfpunkt |
|---|---|---|---|
| 00:00–00:16 | Elektronenquelle | Geräteübersicht, Übergang zur geheizten Kathode, gebündelte Elektronen | Glühemission und Injektion von der späteren Photonenerzeugung unterscheiden. |
| 00:16–00:34 | Beschleunigung | Elektronen entlang der Achse; HF-Feldsymbole und beispielhafte Umlenkung | Elektrisches Feld überträgt Energie; ideales statisches Magnetfeld lenkt ab. |
| 00:34–00:50 | Target | Elektronenbahn im Coulombfeld und symbolisch emittiertes Photon | Bremsstrahlung, Spektrum und Energiedeposition im Target; kein 1:1-Teilchenumwandlungsmodell. |
| 00:50–01:08 | Strahlkopf | Target, Primärkollimator, FF-Filter, Monitor, Blenden, MLC, Gewebe | Beispielkonfiguration; keine allgemeine Geräteanordnung und keine Dosisrechnung. |
| 01:08–01:26 | Gewebe | Compton-Beispiel mit Streuphoton, Elektronenspur und lokalen Ereignissen | Sekundäre geladene Teilchen vermitteln die Energieabgabe; keine Ereignisstatistik. |
| 01:26–01:44 | Strahlenchemie | Wassermoleküle vor/nach beispielhafter Ionisation und Protonentransfer | Ladungen, Wasserstoffzahl und Radikalpunkt; •OH und OH⁻ unterscheiden. |
| 01:44–02:02 | DNA | Direkter und indirekter Weg, symbolische Strangschäden | Sekundäre Elektronen können direkte Wirkung vermitteln; Schaden ist nicht gleich Zelltod. |
| 02:02–02:20 | Zellfolgen | Verzweigung in alternative Verläufe | Reparatur, Fehlreparatur, Verlust der Teilungsfähigkeit; keine Häufigkeiten oder Sofortauflösung. |

## Fachliche Leitplanken

- Photonenmodus eines konventionellen FF-LINACs. FFF und Elektronenmodus werden als Varianten erklärt, aber nicht vollständig animiert. Keine herstellerspezifische Geräteabbildung.
- Geräte-, Teilchen-, Molekül- und Zellansichten haben unterschiedliche Maßstäbe. Farben, Wellenlinien, Teilchenzahlen, Abstände und Zeitraffung sind Symbole.
- Keine gemessenen Spektren, Streuwinkel, physikalischen Flugbahnen oder Energie-/Dosis-/Überlebensberechnungen. Das Targetbild ist keine maßstäbliche Atomdarstellung.
- Die HF-Pfeile sind ein Funktionsschema, keine zeit-/ortsaufgelöste Simulation einer konkreten stehenden oder laufenden Welle.
- Coulombwechselwirkungen im Target, Energieabgabe im Gewebe und biologische Konsequenzen werden kausal verbunden, nicht als maßstäblicher Film eines einzelnen durchgehenden Teilchens ausgegeben.
- Die gezeichneten Teilchen sind ausgewählte Beispiele. Nicht jede Photonwechselwirkung erzeugt einen DNA-Schaden, nicht jedes Radikal reagiert mit DNA und nicht jeder Schaden führt zum Verlust klonogener Teilungsfähigkeit.
- Beispielzweig der Radiolyse: Energiezufuhr/Ionisation `H₂O → H₂O•⁺ + e⁻`; Protonentransfer `H₂O•⁺ + H₂O → H₃O⁺ + •OH`. Die erste Gleichung ist eine reduzierte Ionisationsdarstellung, keine vollständige Elektronenstoßbilanz. Weitere Produkte und Konkurrenzreaktionen sind in der Vertiefung benannt.
- Bei der Visualisierung des Protonentransfers verliert das erste Wassermolekül einen Wasserstoff; das zweite erhält ihn. Es bleibt kein unverändertes H₂O-Bild stehen, während Produkte zusätzlich gezählt werden.
- Die indirekte Wirkung wird nicht mit der gesamten Photonwirkung gleichgesetzt. Direkte Wirkung an DNA kann durch geladene Sekundärteilchen vermittelt werden.
- DNA-Schäden können repariert werden; Doppelstrangbrüche werden nicht pauschal als irreparabel dargestellt. Zellreaktionen sind kontextabhängig und häufig verzögert.
- Gesundes Gewebe kann betroffen sein. Keine pauschale Gegenüberstellung „Tumorzellen reparieren nie / gesunde Zellen immer“.
- Vakuum, Kühlung, Steuerung, Sicherheitssysteme, Gantry und Tisch sind im Gesamtkontext benannt. Diese Systeme sowie Planung, IGRT, VMAT und Mehrfeldertechnik sind keine vollständigen Animationskapitel dieses ersten Piloten.

## Primäre und institutionelle Fachquellen

1. IAEA, *Radiation Oncology Physics: A Handbook for Teachers and Students*, 2005: Kapitel 1 (Wechselwirkungen), 5 (LINAC), 6 (Photonenstrahl), 14 (Radiobiologie). https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf
2. IAEA, *Radiation Biology: A Handbook for Teachers and Students*, 2010: Abschnitte 2.2.7, 2.3 und molekulare/zelluläre Strahlenwirkung; Sauerstoffeffekt und Reparatur. https://www-pub.iaea.org/MTCD/Publications/PDF/TCS-42_web.pdf
3. SLAC / Argonne, Bericht zur zugrunde liegenden experimentellen Arbeit über Protonentransfer nach Wasserionisation, 09.01.2020. https://www6.slac.stanford.edu/news/2020-01-09-scientists-observe-ultrafast-birth-free-radicals-water
4. NCI, *Radiation Therapy to Treat Cancer*: zeitverzögerte Wirkung und Normalgewebebelastung. https://www.cancer.gov/about-cancer/treatment/types/radiation-therapy

Keine Quellenbilder oder längeren Textpassagen übernommen. Texte sind didaktische Eigenformulierungen, Abbildungen eigene Schemata.

## Lokal öffnen

`index.html` in einem modernen Browser öffnen. Kein Build, kein Server, keine Installation. Keine Fremdbibliotheken, externen Schriften, externen Medien oder Tracking. Fachquellen werden erst beim bewussten Öffnen ihrer Links aufgerufen.

Bedienung: Gesamtablauf, Pause, Vor/Zurück, Kapitelwiederholung, Zeitleiste, Tempo und Auswahl Basis/Vertiefung. Kein Autoplay und keine Endlosschleife. Bei reduzierter Bewegung bleibt der Start pausiert; Wiedergabe ist eine bewusste Nutzeraktion. Tastaturbedienung über native Buttons, Inputs und Selects. Canvas-Inhalte sind durch Bildbeschreibung und HTML-Texte ergänzt; kein vollständiger Screenreader-Ersatz einer visuellen Untersuchung.

## Durchgeführte technische Prüfung

Am 22.10.2026 lokal in Chromium:

- JS-Syntax, keine Laufzeitfehler und keine automatischen externen Requests.
- Acht Kapitel, korrekte Grenzen und Gesamtdauer 140 Sekunden.
- Alle Kapitel mit mehreren Zeitpositionen auf Desktop und mobilem Viewport aufgerufen.
- Wiedergabe, Pause, Zeitleistensprung, Kapitelwechsel, Basis/Vertiefung und Denkfragen überprüft.
- Wiedergabe endet am Schluss; keine unbeabsichtigte Endlosschleife.
- 320/390/760/850/1440 px ohne horizontalen Seitenüberlauf.
- Alle acht Szenen auf Desktop und bei 390 px visuell gesichtet; Textbegrenzungen im Canvas zusätzlich geprüft.

Die technische Prüfung ersetzt keine fachliche oder didaktische Freigabe. Smartphone-Viewport ist kein Test auf einem echten Smartphone.

## Nächster Unterrichtstest (20 Minuten)

1. 4 Min.: Gesamtablauf mit einer orientierenden Frage: „Welche Teilchen transportieren hier Energie?“
2. 8 Min.: Partnerarbeit in vier Themenpaaren: Quelle/HF; Target/Strahlkopf; Gewebe/Radiolyse; DNA/Zellfolgen. Jeweils Ursache, beobachteter Vorgang und Folge erklären.
3. 4 Min.: Jede Person erläutert einzeln die Kette Photon → Elektron → Ionisation/Anregung → chemische Veränderung → mögliche DNA-/Zellfolge.
4. 4 Min.: Fehlvorstellungen sofort klären. Notieren, an welcher Szene die Erklärung ins Stocken gerät.

Zentrale Prüffragen: Werden Elektronen- und Photonenerzeugung getrennt? Wird direkt/indirekt richtig eingeordnet? Wird •OH nicht als OH⁻ bezeichnet? Wird DNA-Schaden nicht mit unvermeidlichem sofortigem Zelltod gleichgesetzt? Wiederkehrende falsche Deutungen sind Überarbeitungsgründe; das ist ein Pilotkriterium, kein Wirksamkeitsnachweis.

Vor regulärem Einsatz: Review durch Medizinphysik und strahlenbiologisch fachkundige Lehrkraft; Beamer-Lesbarkeit und tatsächliche mobile Bedienung prüfen. Optionaler späterer Ausbau: Sprechertext, MP4-Export, vertiefte Fraktionierung und Herstellerbezug. Diese Leistungen sind im aktuellen Pilot nicht enthalten.

## Architektur

Nur Dateien unter `prototypes/linac-cell-animation/`: Gesamtablauf, Detailstudie und README. Keine Änderung der produktiven Lernapp, der Architektur, Registry, Lernpfade oder des MLC-Piloten. Separater Draft-PR, keine Freigabe durch Merge.


