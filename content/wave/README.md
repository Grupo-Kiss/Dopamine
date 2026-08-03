# Wave — local music

## Where to put files

| Directory | Pace |
| --- | --- |
| `high/` | High-paced (techno / instrumental / energetic) — **primary** |
| `boring/` | Slow / dull / throw-off — occasional |

The folder name sets default `pace`. Optional `manifest.json` can override.

## API pace

If using Jamendo (only when legally cleared): map tags/BPM/query buckets to `high` vs `boring` as in `defs/08_content.md`. Unknown → do not auto-play; drop the file into `high/` or `boring/` yourself.
