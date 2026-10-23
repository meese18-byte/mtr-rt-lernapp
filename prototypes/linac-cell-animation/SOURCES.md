# Quellenzuordnung: LINAC bis Zellwirkung

Stand 23.10.2026. Dieser Nachweis gehört zum isolierten Lehrprototyp. Er dokumentiert Funktionsbelege und Gestaltungsgrenzen; er ist keine technische Freigabe eines Gerätemodells.

## Verwendete Quellen

**S1:** W. Schlegel, C. P. Karger, O. Jäkel (Hrsg.): *Medizinische Physik. Grundlagen – Bildgebung – Therapie – Technik*. Springer Spektrum, 2018. ISBN 978-3-662-54800-4; DOI 10.1007/978-3-662-54801-1. Vom Nutzer bereitgestelltes PDF, 745 PDF-Seiten. Buchseite = PDF-Seite minus 23 im hier genutzten Kapitel. Kap. 20.6.3.3, besonders Buchseiten 415–421 / PDF-Seiten 438–444, einschließlich der Abbildungen visuell geprüft.

**S2:** E. B. Podgorsak (Hrsg.): *Radiation Oncology Physics: A Handbook for Teachers and Students*. IAEA, 2005. Abschnitte 5.5.5–5.5.9, Buchseiten 140–145 / PDF-Seiten 178–183. https://www-pub.iaea.org/MTCD/Publications/PDF/Pub1196_web.pdf

**S3:** H. Krieger: *Grundlagen der Strahlungsphysik und des Strahlenschutzes*. 3., überarbeitete und erweiterte Auflage, Vieweg+Teubner, 2009. ISBN 978-3-8348-0801-1. Vom Nutzer bereitgestelltes PDF, 728 PDF-Seiten. Kap. 1.2.1: relativistische Energie; Kap. 7.1.2–7.1.4: Bremsstrahlung; Kap. 11.2: biologische Wirkungskette. Die Seitenzählung des bereitgestellten PDFs weicht von der Buchzählung ab; bei Zitaten beides angeben.

**S4:** Medizinphysik.wiki: „Linearbeschleuniger“, gelesen am 23.10.2026. https://medizinphysik.wiki/teletherapie/linearbeschleuniger/ . Ergänzender Bauteil-/Terminologieabgleich. Keine alleinige Belegquelle für Dimensionen, Gerätestandards oder chemische Reaktionen.

**S5:** J. Greenberger: *Radioonkologie und Strahlenbiologie. Die nächsten 100 Jahre*. Deutsche Ausgabe 2025, englisches Original 2024. DOI 10.1007/978-3-031-92467-5. Die vom Nutzer benannte Datei „Radioonkologie und Strahlentherapie 100 Jahre.pdf“ enthält dieses Werk. Inhaltsverzeichnis, Konzept und Impressum gesichtet; Schwerpunkt Zukunftsperspektiven, Weltraumstrahlung und Spätfolgen. Keine Konstruktionsgrundlage für Phase 01; mögliche Vertiefungsquelle für spätere biologische Themen.

**S6:** IAEA: *Radiation Biology: A Handbook for Teachers and Students*. Training Course Series 42, 2010, besonders 2.2.7 und 2.3. https://www-pub.iaea.org/MTCD/Publications/PDF/TCS-42_web.pdf . Bestehende Grundlage für die spätere Strahlenchemie und Zellwirkung.

Die PDFs und Quellenbilder sind nicht Bestandteil des öffentlichen Repositorys. Alle hier enthaltenen Grafiken und Texte sind eigene Ausarbeitungen. Abbildungsnummern verweisen auf die fachliche Vorlage, nicht auf übernommene Bilddateien.

## Phase 01: Nachweis pro Ansicht

| Ansicht / Element | Beleg | Umsetzung | Bewusste Vereinfachung / offene Prüfung |
|---|---|---|---|
| Überblick: Elektronenkanone und HF-Zufuhr getrennt | S1 S. 419–420, Abb. 20.35 / Tab. 20.1; S2 5.5.5–5.5.8 | Elektronen auf der Achse; HF-Zufuhr separat von oben | Funktionsblock für HF-Quelle; weder Magnetron noch Klystron im Inneren konstruiert |
| Hohlleiter und Einkopplung | S2 5.5.7–5.5.8 | Äußerer Zufuhrweg mit Einlass in die Kupferstruktur | Anschlussform, Maße und Montage illustrativ; keine Kopplungsrechnung |
| Vakuum und Kühlung | S1 Tab. 20.1; S2 5.5.9 | Angeschlossene Pumpe und farblich getrennte Kühlanschlüsse | Funktionsanschlüsse, keine realen Pumpen-/Kanalkonstruktionen; keine Strömungsrechnung |
| Dioden-Elektronenkanone | S2 5.5.5, S. 140–141 | Heizung, emittierende Kathode, geformte Fokussierelektrode, Anodenöffnung, gepulste Injektion | Generische Elektrodengeometrie; keine Herstellerkanone und keine berechneten elektrostatischen Bahnen |
| Emission und Beschleunigung unterscheiden | S2 5.5.5 | Wärme an Kathode; gerichtete Bewegung im E-Feld | Keine Temperatur-, Austrittsarbeits- oder Stromsimulation; sichtbare Injektionspulse stark verlangsamt |
| Resonatoren und Irisöffnungen | S1 S. 415–416, Abb. 20.23–20.27; S2 5.5.7 | Kupferfarbene, axial durchbohrte Kammern im Halbschnitt | Maße, Anzahl und Materialoberflächen illustrativ; der Halbschnitt ist kein offener Betriebszustand |
| Wandernde HF-Phase | S1 S. 415–416; S2 5.5.7 | Idealisierte axiale Feldkomponente E(x,t) = −cos(2π[x/4 − t/8]) in Bildkoordinaten | Ausgewählte Darstellung mit 90° Phasenvorschub je Zelle; kein allgemeiner Standard aller Wanderwellenstrukturen und keine Maxwell-Lösung |
| Feldrichtung und Kraft | Lorentzkraft im rein elektrischen Anteil, F = qE; q = −e | Rosa E-Pfeile; grüne Kraftpfeile am Paket zeigen entgegengesetzt | Pfeile zeigen nur den axialen Anteil; radiale Fokussierung im HF-Ausschnitt nicht modelliert |
| Bereits gebündelter Abschnitt | S1 Erläuterungen zur Phasenlage; S2 5.5.7 | Elektronenpakete befinden sich auf einer beschleunigenden Phase | Buncher-/Einfangdynamik, Raumladung und Phasenschlupf nicht berechnet; v ≈ c ist eine Näherung |
| Energiegewinn 2 → 6 MeV | S3 Kap. 1.2.1; relativistische Energiebeziehung | Gewählter linearer Verlauf; Geschwindigkeit aus Ekin berechnet | Rechenbeispiel eines bereits relativistischen Abschnitts, keine Kanonen-Injektionsenergie, keine Photonenstrahlqualität |

## Methodischer Gegencheck

- E ist definiert als elektrische Feldrichtung, nicht als Elektronenkraftrichtung. Ein Elektron gewinnt bei Bewegung nach +x Energie, wenn E_x negativ ist. Auch vereinfachte Pfeilbilder aus Lehrquellen werden daran geprüft.
- Die HF-Zeit ist auf eine sichtbare Periode von 8 Sekunden gestreckt. Das ist keine reale RF-Frequenz. Die Teilchenbewegung und die Feldphase verwenden dieselbe Modellzeit.
- Ein halber Modellzyklus kehrt das Feld an einem festen Ort um. Ein mitlaufendes, passend platziertes Paket bleibt dagegen im beschleunigenden Bereich. Diese Beziehungen sind mit unabhängigen Invarianten automatisiert geprüft.
- Die Geschwindigkeit wird aus der kinetischen Energie mit der konstanten Ruheenergie m_e c² = 0,51099895 MeV bestimmt. Bei 2 MeV ergeben sich etwa 97,91 % c, bei 6 MeV etwa 99,69 % c. Keine Aussage über einen Anstieg der Ruhemasse.
- Die Festlegung eines bereits relativistischen Ausschnitts ist wesentlich: Eine vom Kathodenstart an mit c gezeichnete Bahn wäre irreführend. Die Kanonenansicht verwendet deshalb eine separate, illustrative Injektionsbewegung; der Schnitt zur HF-Ansicht wird benannt.
- Die früheren generischen HF-Pfeile in `detail.html` sind historische Gestaltungsstudie. `phase1.html` ist der aktuelle, quellenbezogen überarbeitete Einstieg für Phase 01.

## Quellenkritik für spätere Phasen

Im Wiki-Artikel „Biologische Strahlenwirkung“ wurden am 23.10.2026 OH⁻, H₂O₂ und H₂ in einer Aufzählung freier Radikale gefunden. Diese Zuordnung wird nicht übernommen. Hydroxylradikal •OH und Hydroxidion OH⁻ sind getrennt zu behandeln; S6 2.2.7 liefert den fachlichen Gegencheck. Auch ältere Lehrbücher werden nicht als Nachweis aktueller Geräteausführungen oder aktueller Strahlenschutzvorgaben verwendet.

Weitere Quellen der bestehenden Gesamtübersicht stehen im README. Der SLAC/Argonne-Text ist ein institutioneller Forschungsbericht; die vollständige zugehörige Originalstudie wurde für den bisherigen Pilot nicht ausgewertet.
