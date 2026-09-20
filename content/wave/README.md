# Wave — music beds

Local files only by default (no streaming API). Owner intent (`defs/15`): **high-pace techno** in `high/`, slower / Recovery-adjacent in `boring/`.

| Path | Role |
| --- | --- |
| `high/` | Energetic / techno / instrumental (`pace: high` by folder) |
| `boring/` | Slow / dull / throw-off (`pace: boring` by folder) |
| `manifest.json` | Shipping inventory (`tracks[]`) — may override pace per track |
| `manifest.example.json` | Schema example |

Each track needs `id`, `path`, `title`, `artistLabel`, `pace`, `license`, `attribution`. Playlist bias ~85% high / 15% boring (provisional, `06` / `08`).

Optional API: Jamendo only if cleared; prefer local drops.
