# MLC-Pixelanimation · isolierter Demonstrator

**Status:** Konzept- und Technikpilot, keine Freigabe für den regulären Unterricht.  
**Zweck:** Kurzanimation im Stil minimalistischer Wissenschafts-Reels zur MLC-Feldformung, technisch unabhängig von der MTR-Lernapp.

## Starten

`index.html` in einem modernen Browser öffnen. Kein Build-Schritt, kein Backend, keine Fremdbibliotheken, keine externen Ressourcen.

## Funktion

- 28 Sekunden, vier Abschnitte: Feld offen → Lamellenbewegung → angepasstes Feld → schematische Einstrahlung.
- 20 unabhängig positionierte Lamellenpaare formen **vereinfacht** die projizierte Zielfläche in Beam's Eye View.
- Rechts: qualitatives, unskalierbares Schema der Bestrahlung durch Gewebe entlang **einer** Einstrahlrichtung.
- Steuerung: Abspielen/Pause, Neustart, nächster Abschnitt, Scrubber, Zielkontur, schematische Dosis ein/aus.
- Responsives Layout und native Tastaturbedienung der Controls; bei `prefers-reduced-motion` kein Autoplay.

## Fachliche Grenzen (verbindlich kommunizieren)

- **Kein Treatment-Planning-System und kein klinisches Dosismodell.** Weder reale Fluenz noch Isodosen, Penumbra, Streuung, Materialhomogenitäten, Dosis-Wirkung oder MLC-Transmission werden modelliert.
- Das gezeichnete Zielfeld ist eine freie stilisierte *Projektion* und keine anatomische Kontur oder echte MLC-Sequenz.
- Der rechte Gewebeblock ist **keine räumlich konsistente Rekonstruktion** des linken Beam's-Eye-View. Er illustriert nur prinzipiell, dass Eintritts- und Austrittsdosis nicht durch den MLC verschwinden.
- Auch unter dem MLC abgeschirmte Bereiche erhalten in der Realität nicht notwendigerweise Dosis 0.
- Keine Patientenbilder, keine DICOM-Daten. Nur synthetische Grafik.

## Didaktisches Minimalziel

Die Lernenden sollen erklären, dass der MLC eine **Strahlenfeldprojektion** formt und seitlich außerhalb der Öffnung liegendes Gewebe besser abschirmen kann, während durchstrahltes Gewebe auch außerhalb des Ziels Dosis erhält.

Eine mögliche Anschlussfrage für den Unterricht:  
*„Warum ist die MLC-Feldformung allein keine Garantie, dass nur im Tumor Dosis ankommt?“*

## Prüfstand

Automatisierte Logikprobe: JS-Syntax, 20 Lamellenpaare, Phasenwechsel, Zeitleisten-Sprung und Dosis-Toggle erfolgreich. **Noch nicht durchgeführt:** visuelle Prüfung in Chromium auf Desktop/Smartphone, fachlich-didaktische Pilotierung mit MTR-Auszubildenden. Nicht als klinisch valide Darstellung verwenden.

## Architektur / Integration

- Isolierte Dateien in `prototypes/mlc-pixel-animation/`; **keine** Änderungen an App-Root, Renderern, Registry, Lernpfaden oder Fortschritt.
- Bestehende fünf Modultypen bleiben unverändert.
- Später bei Eignung als Medien-/Interaktionsbaustein in ein bestehendes `knowledge`-Modul integrieren; vorab Medienregistrierung und fachlichen Review durchführen.
- Vor einer solchen Integration ggf. Architektur- und Medienschema-Eignung dokumentieren.

## Dateien

- `index.html` – semantischer Lernrahmen und beide SVG-Darstellungen.
- `style.css` – mobilefähiger, retro-inspirierter Stil.
- `animation.js` – unabhängig berechnete Lamellen und Ablaufsteuerung.
