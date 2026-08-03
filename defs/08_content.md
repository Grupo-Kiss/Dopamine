# Content Specification

## Purpose

This document defines **what media and text content** each window needs, where it comes from, how it is licensed, how it is stored locally, optional APIs, splash/preload behaviour, and how Alerts are generated.

Gameplay rules stay in `02`–`05`. Feel/presentation stays in `09_game_feel.md`. Legal attribution is finalized in `13_credits_and_legal.md`.

---

## Hard Rules

1. **No copyright risk.** Only use media you own, that is explicitly licensed for this use, or that comes from an API whose terms allow playback/caching in a web game. When in doubt, use local files you cleared yourself.
2. **No real-platform branding** in content (logos, watermarks, recognizable UI of TikTok/Twitter/Spotify/YouTube/etc.).
3. **Short splash, then play.** `Loading` shows a splash while a **small starter pack** loads — enough for roughly the **first couple of Match minutes**. Remaining items load in the background during `Playing`. Never block the player on a huge download.
4. **Local directories are the default shipping path.** APIs are optional. If an API key is missing, rate-limited, or legally unclear, use `content/` files.

---

## Local Content Root (put files here)

```
content/
├── README.md
├── icons/           ← window logos (SVG, gradient, generic) — review/replace anytime
├── loop/            ← short-form vertical videos
├── pulse/           ← tweet library + generation seeds (posts authored later in dev)
├── wave/
│   ├── high/        ← high-paced / techno / instrumental energy
│   └── boring/      ← slow / dull / throw-off tracks
├── echo/
│   ├── audio/
│   └── video/
└── alerts/          ← optional hand templates only (most alerts are algorithmic)
```

**This is the directory to fill.** One folder per window. Icons live in `content/icons/`.

---

## Splash And Preload Gate

### Splash

While in `Loading`, show a short splash (brand + light motion). It must feel brief — not a long install bar.

### Starter pack (must finish before `Playing`)

Load only what is needed for ~the first **2 minutes** of play, for example (tunable in `06_balance.md`):

| Kind | Starter count (provisional) |
| --- | ---: |
| Loop clips | `4`–`6` short videos |
| Wave tracks | `2`–`3` (bias `high`, at most one `boring`) |
| Echo item | `1` (audio or video) — buffer start only |
| Pulse | seed pool / generator ready in memory (text is cheap) |
| Alerts | generator rules + optional hand templates |
| Icons / UI chrome | window SVGs |

Also validate manifests for the **queued** rest of the Match pack (paths exist, licenses present) even if bytes are not fully buffered yet.

### Runtime preload

After `Playing` starts, continue fetching/decoding the next items on a background queue so the player rarely waits. If a window would need an item that is not ready, keep showing the last safe item or a lightweight placeholder — never freeze the whole game.

If starter-pack validation fails → stay on splash with a clear error; never start a broken Match.

---

## Defined Content APIs (optional)

Keys live in env / `10_tech.md` config — never commit secrets. Always cache per provider rules. Prefer downloading/caching media to our origin rather than permanent hotlinking when the provider forbids it.

### Pixabay API — Loop (video) primary candidate; optional stills

| | |
| --- | --- |
| Docs | https://pixabay.com/api/docs/ |
| Video search | `GET https://pixabay.com/api/videos/` |
| Auth | `key` query param (free account) |
| License | Pixabay Content License — commercial use OK as part of a larger creative work; **no standalone redistribution** of files; depicted trademarks/people still your responsibility |
| API attribution | Pixabay requests showing where results come from when search results are displayed; cache requests ~24h; no mass automated scraping |
| Hotlink | Images: do not permanently hotlink — download to our server. Videos: may embed; downloading preferred |
| Pace / mood | Use `q`, `category`, `video_type`, `safesearch=true`, prefer `orientation` via crop for vertical Loop |
| Dopamine use | **Loop** short clips; optionally **Echo** video if duration is long enough |

### Pexels API — Loop / Echo video alternative

| | |
| --- | --- |
| Docs | https://www.pexels.com/api/documentation |
| Video search | `GET https://api.pexels.com/v1/videos/search` |
| Auth | `Authorization: <API_KEY>` header |
| License | Pexels License — free personal/commercial; attribution not legally required but encouraged (API may expect visible credit for higher limits) |
| Limits | Default rate limits apply; do not abuse |
| Dopamine use | **Loop** (prefer vertical / crop), **Echo** long video |

### Jamendo API — Wave music (caution)

| | |
| --- | --- |
| Docs | https://developer.jamendo.com/v3.0/tracks |
| Auth | `client_id` |
| License | Per-track Creative Commons via `license_ccurl`; filter with `ccnc=false` style flags as needed |
| API terms | Free API use is aimed at **non-commercial**; commercial/monetized use may need a deal with Jamendo (`licensing@jamendo.com`). **Do not enable in production monetized builds until cleared.** |
| Pace | Use `include=musicinfo` + tags (`electronic`, `techno`, `upbeat`, `ambient`, `calm`, BPM if present). Map tags → `high` / `boring` (see Wave pace mapping). |
| Dopamine use | **Wave** only after legal OK; otherwise use `content/wave/high|boring` |

### Freesound API — SFX / short audio only (not primary music bed)

| | |
| --- | --- |
| Docs | https://freesound.org/docs/api/ |
| License | Per-sound CC (respect NC); API itself is free for **non-commercial** unless you negotiate commercial API access |
| Dopamine use | Optional UI/SFX later — **not** the main Wave catalog unless cleared |

### Not allowed as media backends

Spotify, YouTube download/stream scraping, Apple Music, Twitter/X media firehose, or any service that forbids game embedding / redistribution.

### Provider config shape (implementation)

```json
{
  "providers": {
    "pixabay": { "enabled": false, "apiKeyEnv": "PIXABAY_API_KEY" },
    "pexels": { "enabled": false, "apiKeyEnv": "PEXELS_API_KEY" },
    "jamendo": { "enabled": false, "clientIdEnv": "JAMENDO_CLIENT_ID", "commercialCleared": false }
  }
}
```

Default: all `enabled: false` → local `content/` only.

---

## Source Modes Per Window

| Window | Primary | Optional API |
| --- | --- | --- |
| **Loop** | `content/loop/` | Pixabay videos, Pexels videos |
| **Pulse** | generators + later `posts.json` | none |
| **Wave** | `content/wave/high/` + `content/wave/boring/` | Jamendo only if cleared |
| **Echo** | `content/echo/audio|video/` | Pixabay/Pexels long videos; audio local-first |
| **Alerts** | **algorithmic from metadata** (+ optional hand templates) | none |

---

## Loop (`content/loop/`)

Unchanged needs: short vertical/croppable clips + metadata.

```
content/loop/
  README.md
  manifest.json
  clips/
```

API queries should bias short duration, safesearch on, tags suitable for satire without real logos.

---

## Pulse (`content/pulse/`)

All text. **Hand-authored post library is deferred to later development** (pin). Ship generators + seeds first so Matches can run.

```
content/pulse/
  posts.json             ← fill later in development
  trends.json
  users.json
  generators/seeds.json
```

---

## Wave (`content/wave/`) — pace by folder + API mapping

### Local (authoritative for dropped files)

```
content/wave/
  README.md
  manifest.json          ← optional overrides; folder implies default pace
  high/                  ← PUT HIGH-PACED TRACKS HERE
    track_001.mp3
  boring/                ← PUT SLOW / THROW-OFF TRACKS HERE
    track_boring_001.mp3
```

- Anything under `high/` defaults to `pace: "high"`.
- Anything under `boring/` defaults to `pace: "boring"`.
- Manifest may override a single file’s pace if needed.

Playlist bias: mostly `high`, occasional `boring` (~85% / ~15% provisional).

### How we know pace from an API

APIs rarely give a single “BPM for games” flag. Pipeline:

1. **Query buckets** — separate searches: e.g. `techno instrumental`, `electronic upbeat` → candidate `high`; `ambient calm`, `lofi slow`, `elevator` → candidate `boring`.
2. **Tag / musicinfo map** (Jamendo `musicinfo`, Pixabay tags if music used):

| Signals → `high` | Signals → `boring` |
| --- | --- |
| techno, electronic, dance, upbeat, energetic, drum, bass, intens | ambient, calm, slow, quiet, piano soft, boring, lounge, elevator |

3. **Optional BPM** if present: e.g. ≥ `120` → `high`, ≤ `90` → `boring`, else `mid` (prefer not to schedule `mid` often).
4. **Manual curation list** — optional allowlist IDs in config forcing pace.
5. If still unknown → **do not auto-schedule**; download into `high/` or `boring/` by hand and use local.

---

## Echo (`content/echo/`)

Audio → Wave-like chrome. Video → fictional long-form video player (no YouTube brand).

```
content/echo/
  audio/
  video/
  manifest.json
```

Starter pack buffers **one** Echo item deeply; further items progressive.

---

## Alerts — algorithmic first, hand templates optional

### Default: generate from content metadata

When a window creates an Attention Request or the Alerts system needs a notification, **compose copy from the active item’s metadata** (title, creatorLabel, tags, pace, kind, trend topic, etc.) using small rule templates in code, for example:

- Loop: `"{creatorLabel} just dropped: {title}"` / `"Everyone is looping {tag}"`
- Pulse: `"{user} mentioned you about {topic}"` (from generator)
- Wave: `"New {pace} track: {title}"` / `"Nobody asked for this lullaby: {title}"` when `boring`
- Echo: `"Highlight in {title}"` / `"Debate moment — {momentLabel}"`
- System satire: rotate a tiny built-in list (storage full, update available, …)

No need to pre-author every alert for every file.

### Optional hand templates

You may still add curated lines in:

```
content/alerts/templates.json
```

Hand templates are merged with algorithmic ones (hand templates can override by `id` or add rare specials). **Empty/missing file is fine** — game runs on algorithmic alerts only.

### Icons

Window logos (and generic alert mark) live in:

```
content/icons/
  loop.svg
  pulse.svg
  wave.svg
  echo.svg
  alerts.svg
  dopamine.svg
```

Style: simple, generic, **SVG + gradient background**. Replace anytime after review.

---

## Manifest Requirements

Media manifests need `id`, `path`, `license`, `attribution`, display labels. For Wave local files, folder (`high`/`boring`) sets default pace.

API-ingested items must persist license + attribution + resolved `pace` into the Match cache for credits (`13`).

---

## Acceptance Criteria

- Splash stays short; only a ~2-minute starter pack blocks `Playing`.
- Runtime progressive preload continues without freezing the game.
- `content/wave/high` and `content/wave/boring` are the author drop zones for pace.
- API pace uses query buckets + tag/BPM mapping; unknowns are not auto-played.
- Pixabay / Pexels / Jamendo are documented with enable flags; default off → local.
- Alerts are mostly algorithmic from metadata; `templates.json` is optional.
- Window SVGs exist under `content/icons/` for review.
- Pulse hand posts are explicitly deferred; generators cover early Matches.
