# BILDRECHTE – MTR RT Lernapp

Nachweisdatei für alle Bilder in `media/images/`.
Letzte Aktualisierung: 2026-04-23 — Klassifikation durch Jan bestätigt.

---

## Ordnerstruktur

| Ordner | Bedeutung | GitHub-Repo | In HTML referenziert |
|---|---|---|---|
| `eigene/` | Selbst erstellt, gezeichnet oder Hilfsmittel-Fotos ohne Patientenbezug | ✅ ja | ✅ ja – lädt auf GitHub Pages |
| `cc-lizenz/` | Creative Commons – externe Quellen mit Freigabe | ✅ ja | ✅ ja |
| `klinik-intern/` | TPS-Screenshots, Klinikfotos, Dosispläne | ❌ via `.gitignore` ausgeschlossen | ⚠️ ja – lädt nur lokal, nicht auf GitHub Pages |

> Bilder in `klinik-intern/` sind via `.gitignore` vom GitHub-Upload ausgeschlossen.
> Im HTML bleiben ihre Referenzen erhalten → **graceful degradation**: lokal sichtbar, auf GitHub Pages zeigt der Alt-Text.

---

## Ordner: eigene/ — 6 Bilder ✅ (GitHub-safe, bestätigt 2026-04-23)

| Dateiname | Beschreibung | Herkunft |
|---|---|---|
| `dibh-grafik.jpg` | Vergleichsgrafik Herzabstand freie Atmung vs. DIBH | selbst erstellt |
| `lagerung-armschiene.jpg` | Foto Armschiene (Lagerungshilfsmittel) | eigenes Foto, kein Patient |
| `lagerung-breaststep.jpg` | Foto BreastStep-Rampe | eigenes Foto, kein Patient |
| `lagerung-wingstep.jpg` | Foto Wingstep | eigenes Foto, kein Patient |
| `mamma-dibh.jpg` | DIBH-Grafik/Foto Herzabstand | selbst erstellt |
| `mamma-mercedesstern.png` | Schema Mercedesstern-Technik | selbst gezeichnet |

---

## Ordner: klinik-intern/ — 22 Bilder ⚠️ (nur lokal, bestätigt 2026-04-23)

Alle TPS-Screenshots und Klinikfotos. Gitignored, nicht auf GitHub Pages.
Im HTML referenziert → lokal vollständig funktional.

| Dateiname | Beschreibung |
|---|---|
| `mamma-zange.jpg` | TPS-Screenshot: Mamma-Zange Draufsicht |
| `mamma-zange-detail.jpg` | TPS-Screenshot: Zange Detail |
| `mamma-zange-keilfilter.png` | TPS-Screenshot: Zange mit Keilfiltern |
| `mamma-zange-keilfilter-foto.jpg` | Klinikfoto: Keilfilter |
| `mamma-zange-supra-tischdrehung.jpg` | TPS-Screenshot: Tischdrehung Zange+Supra |
| `mamma-isozentren-zange-supra.jpg` | TPS-Screenshot: Isozentren Zange+Supra |
| `mamma-narbenboost.png` | TPS-Dosisplan: Narbenboost |
| `mamma-elektronen-stehfeld.jpg` | TPS-Screenshot: Elektronen-Stehfeld |
| `mamma-imrt-thoraxwand.png` | TPS-Screenshot: IMRT Thoraxwand |
| `mamma-bewegungsbestrahlung.jpg` | Klinikbild: Bewegungsbestrahlung |
| `mamma-thoraxwand-anzeichnung.jpg` | Klinikfoto: Thoraxwand-Anzeichnung vor PLCT |
| `mamma-thoraxwand-roentgen-bloecke.jpg` | Röntgenbild: Thoraxwand mit Blöcken |
| `dosisverteilung-heidelberg.jpg` | TPS-Screenshot: Dosisverteilung Heidelberg-Technik |
| `mamma-zange-dosisverteilung.jpg` | TPS-Screenshot: Mamma-Zange Dosisverteilung |
| `mamma-zange-drr.jpg` | DRR aus TPS |
| `mamma-zange-drr-beschriftet.jpg` | DRR mit Beschriftung |
| `mamma-sib.jpg` | Klinikbild: SIB |
| `mamma-vmat.jpg` | Klinikbild: VMAT |
| `mamma-intrabeam.png` | Klinikbild: INTRABEAM |
| `anatomie-mamma-lk.jpg` | Anatomie Mamma + Lymphknoten (Herkunft unklar) |
| `anatomie-lymphknoten-brust.jpg` | Anatomie Lymphknoten Brust (Herkunft unklar) |
| `anatomie-sentinel-node.jpg` | Sentinel Node (Herkunft unklar) |

---

## Ordner: cc-lizenz/ — 0 Bilder

*(noch leer – bei Bedarf Bild hinzufügen und unten dokumentieren)*

### Vorlage für neuen Eintrag

```
### dateiname.jpg
- Titel:       [Bildtitel laut Quelle]
- Urheber:     [Name / Institution]
- Quelle:      [vollständige URL]
- Lizenz:      [z. B. CC BY 4.0 / CC0 / Public Domain]
- Lizenz-URL:  [z. B. https://creativecommons.org/licenses/by/4.0/]
- Abrufdatum:  [JJJJ-MM-TT]
- Änderungen:  [keine / zugeschnitten / Beschriftung ergänzt]
```

---

## Erlaubte Lizenztypen

| Lizenz | Verwendung | Namensnennung | Änderungen |
|---|---|---|---|
| CC0 / Public Domain | ✅ | ❌ | ✅ |
| CC BY 4.0 | ✅ | ✅ | ✅ |
| CC BY-SA 4.0 | ✅ | ✅ | ✅ (gleiche Lizenz) |
| CC BY-NC 4.0 | ✅ nicht kommerziell | ✅ | ✅ |

## Empfohlene Quellen für CC-Bilder

- [Wikimedia Commons](https://commons.wikimedia.org) — Anatomie, Schemata
- [OpenStax](https://openstax.org) — Anatomie-Illustrationen (CC BY)
- [NCI Visuals Online](https://visualsonline.cancer.gov) — Krebsbilder (meist Public Domain)
