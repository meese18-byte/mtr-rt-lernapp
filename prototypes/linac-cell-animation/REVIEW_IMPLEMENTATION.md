# Umsetzung des Reviews vom 12.11.2026

Basis: Review für Commit `b524ea0` (vier Phasen). Umsetzung auf dem bestehenden Draft-PR #6; Originalmodell und ursprüngliche Phasenzeiten bleiben als Vertiefung verfügbar.

## Umgesetzt und codebasiert geprüft

- **P0 B1–B7:** Weglängenparametrisierung für Elektronen in Umlenkmagneten und Photonen im Gewebe; feste Strecke je Sekunde für Photonen im Strahlkopf; Compton-Photon vor/nach Stoß gleich schnell (Bildmaßstab), Rückstoßelektron entsprechend `beta(E)`; geringere Elektronengeschwindigkeit nach Target- bzw. DNA-Energieabgabe; Radikale mit lokaler, nicht geradlinig zielgerichteter Bewegung.
- **P1:** Überladene Lernseiten entschlackt; Quellen und technische Modellgrenzen auf `lehrkraft.html` verlagert; kurze Zusammenfassungen je Szene, getrennte Basis- und Vertiefungsansichten; ein Zielsatz pro Phase; heller Standardmodus, vergrößerte Texte; funktionierende Weiterknöpfe auch am Phasenende.
- **P1 Gesamtfilm:** `gesamtfilm.html` führt automatisch durch alle vier Originalphasen mit zentraler Steuerung und einem gemeinsamen ca. 4:45 min langen Zeitraster. Die Filmspur verwendet denselben Code wie die Einzelansichten, sie ist keine zweite unabhängig gepflegte Physikanimation.
- **P2:** ISOZENTRUMSEBENE (modelliert mit 100 cm Fokusabstand), Lichtfeldbezug, zwei Monitorkanäle in MU (Beispiel-Abschaltung 200 MU, **kein klinischer Sollwert**); FFF-Profil und Hinweis auf höhere mögliche Dosisleistung; Stehwelle als alternative Bauart benannt; Radiolyse der Basis vereinfacht; ca. zwei Drittel indirekter Wirkung bei Niedrig-LET-Photonen als Näherungswert; mitotischer Zelltod als primär animierte Zellfolge, Apoptose weiter als Vertiefung.
- **P2 klinische Brücken:** Phase 03 enthält ein interaktives Schema zu Energiedosis in Gy, Tiefendosis und Bolus. Phase 04 führt eine schematische Bestrahlungsserie mit Reparaturphasen und verzögert auftretenden Nebenwirkungen vor Augen.
- **P3 teilweise:** Heller Darstellungsmodus mit UKR-orientierter Farbpalette und dunkler Alternative; Kurzaufträge statt offener Metafragen.

## Technische Prüfungen

`node motion-review.test.cjs` enthält reproduzierbare Prüfungen für alle vier Phasen, inklusive arclength-Test der Umlenkbahn, Compton-Werten, Elektronentempo, Lernernavigation und Existenz der neuen Transferansichten.

Beim Code-Review am 12.11.2026 bestanden **23 automatisierte Assertions** sowie die Parse-Prüfung aller zehn relevanten JavaScript-Dateien. Die Umlenkbahnsimulation ergab eine maximale relative Geschwindigkeitsabweichung von **0,04 %** bei 1000 gleich großen Zeitschritten (Grenze laut Review 5 %). Ein statischer Abgleich aller `getElementById`-Bezüge zeigte keine fehlenden Elemente außer den absichtlich dynamisch erzeugten Elementen des Strahlkopfes.

## Offen / vor Unterrichtsfreigabe

1. **Visueller Browser- und Beamer-Test**, Prüfung des 4:45-min-Gesamtfilms auf verschiedenen Bildschirmgrößen und der phasenübergreifenden Übergänge; der erfolgreiche Parser-Test ersetzt keine Laufzeit- und Layoutprüfung im echten Browser.
2. **Medizinphysikalischer Gegencheck** der sichtbaren Bewegungen und der bewusst vereinfachten Dosis- und Radiobiologie-Bilder. Die bildliche Geschwindigkeit ist ausdrücklich keine gemeinsame reale Zeitskala über atomare, apparative und zellbiologische Maßstäbe hinweg.
3. **Gerätespezifische Strahlkopf-Geometrie:** Die vorhandenen Backup-Blenden orientieren sich an einer älteren Bauart. Vor dem klinischen Transfer am Lernort gegen die eingesetzten Elekta-/Varian-Geräte prüfen und ggf. hardwareabhängige Darstellung trennen.
4. **Ausbaustufe nach Unterrichtstest:** Sauerstoffeffekt als gesondertes Bild, interaktive Fragen mit Feedback, optionale Sprecherspur, bessere Größenverteilung der Phase-02-Schnitte und weitere Regressionstests.
5. **Didaktische Erprobung:** 12-Minuten-Test mit einer Lerngruppe; insbesondere prüfen, ob das MTR-Handlungsziel erreicht wird und ob die neuen Brücken zeitlich überfrachten.

### Keine klinische Verwendung

Feldöffnungen, MU-Beispiel, Tiefendosis, zeitliche Zellreaktionen und Fraktionsserie sind schematische Lehrbeispiele und ersetzen weder TPS, Dosisberechnung noch gerätespezifische SOPs.
