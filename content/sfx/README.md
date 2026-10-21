# SFX drop zone

Short one-shots and stingers for UI / Alerts / shared arcade feel.

**Brief (SSOT):** `defs/15_sfx_audio.md`  
**Inventory:** `manifest.json` (`status: final` for generative first-party cues)  
**Regen:** `python3 tools/sfxgen/generate.py`

| Folder | What |
| --- | --- |
| `ui/` | PLAY, toggles, modal, game over / burnout / recovery stings |
| `alerts/` | Soft / normal / high / critical / dismiss |

Minigame + shared sticker SFX live under `content/minigames/**` (same manifest).

Do not invent final audio in code. Do not commit fake silent “final” files.
