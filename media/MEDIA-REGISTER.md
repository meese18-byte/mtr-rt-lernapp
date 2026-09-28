# MEDIA-REGISTER – MTR RT Lernapp

**Stand:** 2026-09-28  
**Zweck:** Nachweis von Herkunft, Rechten, Patientenbezug, Anonymisierung und Freigabe für alle öffentlich ausgelieferten Lernmedien.

> Die bloße Ablage im öffentlichen Repository gilt **nicht** als Freigabenachweis. Bei klinischem Material ist vor produktiver Nutzung eine dokumentierte Prüfung erforderlich.

## Statuswerte

- `approved-public` – Rechte und Anonymisierung geprüft; öffentliche Nutzung freigegeben
- `approved-nonclinical` – eigenes/sicheres Material ohne Patientenbezug
- `pending-review` – Prüfung noch nicht dokumentiert
- `internal-only` – darf nicht über GitHub Pages ausgeliefert werden
- `remove` – aus öffentlichem Repository zu entfernen

## Pflichtangaben pro Medium

| Feld | Inhalt |
|---|---|
| Pfad | exakter Repository-Pfad |
| Typ | Bild / Video / PDF |
| Herkunft | Eigenmaterial / Klinik / externe Quelle / generiert |
| Rechte | Urheber-/Lizenzstatus |
| Patientenbezug | ja / nein / unklar |
| Anonymisierung | geprüft / nicht erforderlich / offen |
| Öffentliche Freigabe | ja / nein / offen |
| Status | einer der Statuswerte oben |
| Notiz | Verwendungszweck / Prüfhinweis |

---

## Bereits dokumentiertes, nicht-klinisches Eigenmaterial

Die Detailnachweise der bisherigen Eigenbilder bleiben in `media/images/BILDRECHTE.md` erhalten. Diese Datei wird bei der nächsten Medienbereinigung in dieses Register überführt.

## Prioritäre Prüfung – öffentlich vorhandenes klinik-/fallnahes Material

| Pfad / Gruppe | Typ | Herkunft | Patientenbezug | Anonymisierung | Öffentliche Freigabe | Status | Notiz |
|---|---|---|---|---|---|---|---|
| `media/Fallbeispiel _PCA_01/*.mp4` | Video | offen | unklar | offen | offen | pending-review | PLCT-/OBI-Fallmaterial; vor Einsatz einzeln prüfen |
| `media/Fallbeispiel _PCA_01/Fallbeispiel_PCA_01.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_BC_01.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_GanzhirnbisC2_01.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_HNO_03.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_Mamma_03.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_Oesophagus_distal_AEG_01.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_PCA_02.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/documents/Fall_Rektum_BL_02.pdf` | PDF | offen | unklar | offen | offen | pending-review | Falldokument |
| `media/images/eigene/prostata/dvh-pca.jpg` | Bild | offen | unklar | offen | offen | pending-review | TPS-/DVH-nahes Material |
| `media/images/eigene/prostata/isodosen-arc-pca.jpg` | Bild | offen | unklar | offen | offen | pending-review | TPS-/Dosisplan-nahes Material |
| `media/images/eigene/prostata/lymphknoten-pca.jpg` | Bild | offen | unklar | offen | offen | pending-review | Herkunft/Freigabe dokumentieren |

---

## Neue Medien

Neue öffentliche Medien werden **vor** Einbindung in ein Live-Modul hier dokumentiert.

Vorlage:

| Pfad | Typ | Herkunft | Rechte | Patientenbezug | Anonymisierung | Öffentliche Freigabe | Status | Notiz |
|---|---|---|---|---|---|---|---|---|
| `media/...` | Bild | ... | ... | nein | nicht erforderlich | ja | approved-nonclinical | ... |
