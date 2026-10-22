# MLC-Pixelanimation · isolierter Demonstrator

**Stand:** Revision 02 – geometrisch gekoppelter Strahlweg und geschlossene Außenpaare.  
**Status:** Konzept- und Technikpilot; Unterrichtstest mit MTR-Auszubildenden weiterhin ausstehend.

## Starten

`index.html` in einem modernen Browser öffnen. Kein Build-Schritt, kein Backend, keine Fremdbibliotheken und keine externen Ressourcen.

## Funktion

- 28 Sekunden, vier Abschnitte: Feld offen → Positionieren bei Strahl aus → angepasstes Feld → schematische Einstrahlung.
- 20 Lamellenpaare. Linke und rechte Lamellenspitzen werden aus derselben synthetischen Zielprojektion unabhängig bestimmt.
- Paare ohne Zielanteil in ihrem Streifen schließen im idealisierten Modell vollständig. Es bleibt kein durchgehender Mittelspalt ober-/unterhalb des Ziels.
- Die goldene BEV-Fläche entspricht der tatsächlichen geometrischen Öffnung der gezeichneten Lamellen; keine schräg interpolierten Feldkanten.
- Der türkis markierte Streifen ist auswählbar (Paare 01–20). Rechts wird der zugehörige Längsschnitt durch seine Mitte gezeigt.
- Quelle, MLC-Öffnung und geradlinig divergierende Randstrahlen haben eine gemeinsame Projektionsgeometrie. Die Feldbreite springt an der Gewebeoberfläche nicht um.
- Bei einem geschlossenen Paar verschwindet der direkte Primärstrahl hinter dem MLC im idealisierten Modell.
- Ein synthetisches Tiefenziel wird aus derselben BEV-Kontur abgeleitet; keine anatomische Rekonstruktion.
- Gold und Schraffur markieren den Strahlweg, keine Dosishöhe. Keine Tumor-Leuchtwolke und kein vorgetäuschter Tiefendosisverlauf.
- Steuerung: Abspielen/Pause, Neustart, nächste Phase, Zeitleiste, Streifenauswahl, Zielkontur und Strahlwegmarkierung.
- Bei `prefers-reduced-motion` kein Autoplay und kein Lauf der gestrichelten Strahllinien.

## Fachliche Grenzen

- **Kein Treatment-Planning-System und kein klinisches Dosismodell.** Reale Fluenz, Dosis, Penumbra, Streuung, MLC-Transmission, Materialinhomogenitäten und Dosis-Wirkung sind nicht modelliert.
- Geschlossen bedeutet in der Realität nicht Dosis null. Zusätzliche Blenden können je nach Gerät ebenfalls begrenzen; im Pilot wird die Variante mit geschlossenen Außenpaaren gezeigt. Keine allgemeine Vorgabe für reale MLC-Sequenzen.
- Die rote Kontur ist ein synthetisches Planungsziel, keine anatomische Tumorkontur und keine konkrete GTV-/CTV-/PTV-Vorgabe.
- Die sechs SVG-Einheiten grafischer Abstand um die Zielprojektion haben keine klinische Bedeutung. Daraus darf kein Feldrand oder Sicherheitssaum abgeleitet werden.
- Die rechte Ansicht ist ein geometrisch gekoppeltes Schema eines synthetischen Volumens. Sie ist kein CT-Schnitt und keine Patientenanatomie. Tiefenausdehnung und Abstände sind frei gewählt; keine realen Geräteabmessungen.
- Die BEV zeigt die gesamte Zielprojektion; ein einzelner Längsschnitt kann nur einen Streifen erklären. Der MLC umschließt das Ziel nicht dreidimensional in der Tiefe.
- Eine Lamelle deckt einen Streifen endlicher Breite ab. Auch bei korrekter Begrenzung bleibt darin geometrisch gesundes Gewebe mit erfasst. Das Modell zeigt statische Feldformung; IMRT/VMAT sind nicht enthalten.
- Keine Patientenbilder oder DICOM-Daten; nur synthetische Geometrie.

## Didaktisches Minimalziel

Die Lernenden erklären, wie ein MLC die Feldprojektion begrenzt, wie nicht benötigte Streifen abgeschirmt werden und weshalb durchstrahltes Gewebe vor und hinter dem Ziel weiterhin betroffen ist. Sie unterscheiden Feldgeometrie von Dosis.

Anschlussfragen:

1. Warum bleibt Gewebe hinter dem Ziel im Strahlweg?
2. Was verändert sich rechts, wenn ein geschlossenes Außenpaar ausgewählt wird?
3. Welche Aussage über die Dosis lässt die goldene Markierung ausdrücklich nicht zu?

## Prüfstand

Am 22.10.2026 lokal in Chromium überprüft:

- JS-Syntax und keine Laufzeitfehler.
- 20 Paare, kein offener Mittelspalt außerhalb der Zielprojektion; auch reine Eckpunktberührungen öffnen keine Außenreihe.
- Rasterprobe der gezeichneten Zielprojektion vollständig innerhalb der geometrischen Öffnung (keine dosimetrische Aussage).
- Alle 20 auswählbaren Streifen: geschlossene Paare ohne direkten Primärstrahl; Gewebemarkierung und Strahlweg mit identischer Begrenzungsgeometrie; Randstrahlen laufen auf denselben Fokus zurück.
- Phasensprünge, Zeitleiste sowie Anzeigeoptionen überprüft.
- Desktop (1440 px) und mobile Viewports (390/320 px) sowie 850 px: kein horizontaler Überlauf; offene und geschlossene Darstellung visuell geprüft.

**Noch offen:** Unterrichtstest, tatsächliche Smartphone-Bedienung und Lesbarkeit am Beamer. Die Browserprüfung stellt keine klinische Validierung dar.

## Architektur / Integration

Nur `prototypes/mlc-pixel-animation/{index.html,style.css,animation.js,README.md}`. Keine Änderungen an App-Root, Renderern, Registry, Lernpfaden, Fortschritt oder `ARCHITECTURE.md`. Der PR bleibt Draft; keine Freigabe durch Merge.

## Dateien

- `index.html` – Lernrahmen und SVG-Darstellungen.
- `style.css` – responsiver Stil.
- `animation.js` – gemeinsame Ziel-/Öffnungsgeometrie, gekoppelte Projektion und Steuerung.
