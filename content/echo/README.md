# Echo — long-form audio / video

| Path | Role |
| --- | --- |
| `audio/` | Podcast-style long audio |
| `video/` | Long-form video (fictional player chrome — no YouTube brand) |
| `manifest.json` | Shipping inventory (`items[]`) — start empty |
| `manifest.example.json` | Schema example |

Each item needs `id`, `kind` (`audio` \| `video`), `path`, `title`, `creatorLabel`, `license`, `attribution`, optional `moments[]` (`atSec`, `label`).

Optional API: Pixabay / Pexels long videos; audio local-first (`08`).
