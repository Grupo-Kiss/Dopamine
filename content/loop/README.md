# Loop — short-form clips

Drop vertical / croppable clips in `clips/`.

| File | Role |
| --- | --- |
| `manifest.json` | Shipping inventory (`clips[]`) — starter + expanded pack (E24) |
| Regen | `python3 tools/mediagen/generate.py` |
| `manifest.example.json` | Schema example |
| `clips/` | Media files (`.webm` / `.mp4`, etc.) |

Each clip needs `id`, `path`, `title`, `creatorLabel`, `license`, `attribution` (`defs/08`, `13`). Missing `license` → fail closed on Loading.

Optional API: Pixabay / Pexels (default off). Placeholders for mockups may live under `placeholders/` when the visual pass adds them.
