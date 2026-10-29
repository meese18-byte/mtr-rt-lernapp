# LINAC verstehen – Unterrichtsansicht Gerätekunde 2. Lehrjahr

Separate, statische Auswahl für AB01 A1–A3 der 160-Minuten-Unterrichtseinheit. Einstieg: `index.html`; direkte Aufgaben: `index.html#a1`, `index.html#a2`, `index.html#a3`. Keine Installation, keine externen Bibliotheken, keine Erfassung oder Übertragung von Antworten. Über HTTP(S) bereitstellen, etwa über denselben GitHub/githack-Weg wie die Originale.

## Umfang

- A1: Elektronenquelle/HF-Energie, Umlenkung, Target in drei begrenzten Clips.
- A2: MLC-Bewegung und Vergleich Rechteck/angepasste Öffnung; klar als geometrische Vorschau gekennzeichnet.
- A3: Monitor im Kopf, Demo-Sollwert und Abschaltung. Keine Anzeige einer Patientendosis.
- Ein Beobachtungsauftrag, eine eingeklappte Hilfe und ein Rückverweis zum AB01 je Ansicht.
- Hinweise für Vertretungslehrkräfte: `lehrkraft.html`.

Die vollständigen Animationen und die aktive Lernapp werden nicht verändert. Dieses isolierte Prototype-Verzeichnis wird nicht in die Modulregistry eingebunden.

## Herkunft und Grenzen

Visualisierungen und Modelle stammen aus den vom Auftraggeber angegebenen festen Commits; siehe `provenance.json`. `phase1-model.js`, `phase1-camera.js`, `phase1-surface.js` und `phase2-model.js` sind unveränderte Kopien. Die Zeichner wurden um begrenzte Clip-Steuerung, Ausschnitte und reduzierte Beschriftungen ergänzt. Ausgeblendete Original-DOM-Elemente bleiben als technische Referenzen der Zeichner erhalten; sie sind `hidden`, `inert` und für assistive Technik ausgeblendet. Sie sind kein zusätzlicher Lerninhalt.

Die Darstellung ist exemplarisch, nicht maßstäblich, keine klinische Simulation und keine Gerätebedienungsanleitung. Der MLC-Vergleich bildet keine vollständige IMRT-/VMAT-Sequenz ab. Keine berechnete Dosis, Streuung oder Transmission.

## Prüfung

JavaScript-Syntaxprüfung; Browserprüfung der Navigation, der fünf Ausschnitte, Start/Pause/Zurücksetzen, Rechteck/angepasste Öffnung und des Monitor-Abschaltzustands. Desktopansicht und schmale 390-Pixel-Ansicht im Browser geprüft (kein horizontaler Überlauf). Eine Erprobung im Unterricht steht noch aus.
