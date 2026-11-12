# Neue visuelle Referenz · 25.10.2026

Der Nutzer stellte ein Instagram-Screenrecording vom 25.10.2026 bereit. Sichtbarer Account: **8bit_sciences**; sichtbarer Titelbeginn: „How LINAC Machine kill cancer …“. Das Recording ist etwa 106 Sekunden lang und enthält keine Audiospur. Die Zuschreibung bezieht sich auf den sichtbaren Account, nicht auf einen unabhängig verifizierten Urhebernachweis.

Ausgewertet wurden zeitmarkierte Einzelbilder über das gesamte Recording sowie engere Bildfolgen für Gerätetechnik und Strahlenchemie. Die Zeitangaben unten beziehen sich auf das Recording. Keine vollständige kontinuierliche Wiedergabe oder Sprechertranskription wird behauptet. Die Quelldatei, Videobilder und Instagram-Oberfläche sind nicht Teil des Repositorys.

## Umsetzung in Fassung 3 der Phase 01

- **Ein räumliches Modell:** Stativ, Gantryarm, Strahlkopfhülle, Liege, Elektronenkanone und Beschleunigungsstruktur bleiben in einem gemeinsamen Koordinatensystem. Detailansichten vergrößern dieselbe Geometrie.
- **Drei Kamerafahrten:** Gesamtgerät → Beschleunigungsstrecke (00:03–00:07), Strecke → Kanone (00:09–00:12), Kanone → HF-Abschnitt (00:25–00:28). Die Perspektive bleibt bei Wanderwelle und Energiebeispiel erhalten. Die Zeitachse ist deterministisch und rückwärts bedienbar.
- **Orientierung bleibt verfügbar:** Gerätekarte markiert den betrachteten Bereich. „Gesamtgerät“ hält an und führt zurück. Versorgungswege und Strahloptik lassen sich weiterhin separat betrachten.
- **Lesbare Lehrgrafik:** Eigene Vektorgeometrie mit klaren Beschriftungen und vorhandener Farbkonvention. Keine Übernahme der Pixelgrafiken. In Kamerafahrten verschwinden Detailbeschriftungen; am nächsten Lernhalt sind sie wieder sichtbar.
- **Bewegung steuerbar:** Kein Autoplay. Pause an Ansichtsgrenzen bleibt Standard. „Kamerafahrten“ kann abgeschaltet werden; `prefers-reduced-motion` startet mit festen Perspektiven. Physikmodell und Kameramodell sind getrennt.

Der Strahlkopf ist in dieser Phase nur eine räumliche Hülle mit Verweis auf Phase 02. Die gestrichelte Referenzachse ist kein eingeschaltetes Strahlenfeld. Dosis, Gewebe und DNA wurden in dieser Fassung noch nicht überarbeitet.

## Übertragbare Entscheidungen für die folgenden Phasen

| Recording, ungefähr | Visuelle Anregung | Fachliche Bedingung für unsere Umsetzung |
|---|---|---|
| 00:24–00:40 | Geräteübersicht, Vergrößerung von Energieversorgung, Kanone und Zellen | HF-Erzeuger und HF-Verstärker unterscheiden; aktueller Funktionsblock legt kein konkretes Fabrikat fest. Größere Abbildungsmaßstäbe dürfen nicht neue, widersprüchliche Bauteilpositionen erzeugen. |
| 00:40–01:03 | Strahltransport, Target, Strahlkopf, Kollimation | Die sichtbare Umlenkung ähnelt einer 270°-Biegung; diese Interpretation ist kein Modellnachweis. Eine spätere Variante auswählen und belegen, nicht mit Elekta-Slalom vermischen. Monitoring von Output/MU ist keine direkte Messung der Tumordosis. |
| Etwa 01:00 | MLC-Öffnung in BEV | Sichtbare gelbe Streifen ober- und unterhalb der Blattbank nicht übernehmen. Nutzfeld durch gemeinsam dargestellte Blenden/MLC begrenzen. Transmission und Streuung getrennt von offenen Primärstrahlwegen behandeln. |
| 01:04–01:26 | Einstrahlungen, Gewebedosis, sekundäre Elektronen, Wasserradiolyse | Qualitative Dosisillustration als solche kennzeichnen. Gesunde Gewebe erhalten ebenfalls Dosis. •OH ist ein Hydroxylradikal, OH⁻ ein Hydroxidion. Reaktionen lokal und konkurrierend darstellen, keine zielgerichtete Wanderung der Radikale zur DNA. |
| 01:26–01:40 | DNA-Schäden, Reparatur und Behandlung über Zeit | Reparatur, Fehlreparatur und verbleibende Schäden unterscheiden. Nicht jede Ionisation trifft DNA; nicht jeder DNA-Schaden bedeutet Zelltod. Keine pauschal höhere Strahlensensibilität aller Tumorzellen behaupten. |

Fachliche Gegenprüfung: [SOURCES.md](SOURCES.md), insbesondere S1/S2 für Technik und S6 für Strahlenbiologie. Die neue Referenz liefert eine visuelle Dramaturgie, keine unabhängige technische Freigabe.

## Kurzer Test des neuen Orientierungsprinzips

**10–12 Minuten, 6–12 Lernende, paarweise an einem Browser; eine Lehrkraft beobachtet.** Kein Vorwissen zu konkreten Herstellergeräten nötig. Der bestehende ausführlichere Physiktest steht in [REFERENCE-VIDEO.md](REFERENCE-VIDEO.md).

1. **0–2 min:** Gesamtgerät betrachten. Jede Person zeigt, wo Elektronen entstehen, wo sie Energie erhalten und wo später Photonen erzeugt werden. Unsicherheiten kurz notieren.
2. **2–5 min:** Bis zum Halt bei 00:12 abspielen. In der Kanonenansicht erklären lassen: „Wo befinden wir uns jetzt im Gerät?“ Danach über „Gesamtgerät“ zurück und den Bauteilort erneut zeigen. Eine Person bedient, die andere erklärt.
3. **5–8 min:** Zu Wanderwelle wechseln, abspielen und anhalten. Rollen tauschen. Beide erläutern Quelle der Teilchen versus Quelle ihrer Energie und die Bedeutung der Pfeilfarben. Nicht mit der Kamera animierte Geschwindigkeit verwechseln.
4. **8–10 min:** Jede Person beantwortet einzeln: „Ist der gestrichelte Weg unter dem Kopf ein aktiver Therapiestrahl?“ und „Wird das Elektron bei 6 statt 2 MeV dreimal so schnell?“ Erwartet: Referenzachse; nein, relativistischer Zusammenhang.
5. **10–12 min:** Schwer lesbare Beschriftungen und störende Kamerafahrten markieren; optional dieselbe Stelle mit ausgeschalteten Kamerafahrten vergleichen.

**Vorläufige Überarbeitungsschwelle:** Wenn mindestens zwei Lernende denselben Bauteilort oder eine der letzten beiden Aussagen falsch zuordnen, diese Darstellung vor Phase 02 ändern. Jede unlesbare zentrale Beschriftung oder nicht auffindbare Pause ebenfalls nacharbeiten. Dies ist ein formativer Verständlichkeitstest, keine validierte Wirksamkeitsstudie. Durchführung und Ergebnisse stehen noch aus.
