# Content Specification

## Purpose

This document defines **what media and text content** each window needs, where it comes from, how it is licensed, how it is stored locally, and when it must be ready for a Match.

Gameplay rules stay in `02`–`05`. Feel/presentation of players and stickers stays in `09_game_feel.md`. Legal attribution detail is finalized in `13_credits_and_legal.md`.

---

## Hard Rules

1. **No copyright risk.** Only use media you own, that is explicitly licensed for this use (e.g. CC0 / public domain / clear free-for-commercial terms), or that comes from an API whose terms allow redistribution/playback in a game. When in doubt, use local files you cleared yourself.
2. **No real-platform branding** in content (logos, watermarks, recognizable UI chrome of TikTok/Twitter/Spotify/YouTube/etc.). Fictional services only.
3. **Preload before PLAY.** A Match must not start until required content for that Match is validated and loaded (see Preload Gate). The existing `Loading` state owns this.
4. **Local directories are the default shipping path.** APIs are optional enhancers. If an API is unavailable, offline, or legally unclear, the game uses `content/` files.

---

## Local Content Root (put files here)

All hand-placed media and text libraries live under the repo root:

```
content/
├── README.md
├── loop/          ← short-form vertical videos for Loop
├── pulse/         ← tweet/post library + generation seeds for Pulse
├── wave/          ← music tracks for Wave
├── echo/          ← long-form audio and/or video for Echo
│   ├── audio/
│   └── video/
└── alerts/        ← notification copy templates (and optional icons)
```

**This is the directory to fill.** One folder per window that needs local files. Easy to find: top-level `content/`, named after the window.

Runtime code may copy or bundle these into `src/assets/` or `public/` during build — that is an implementation detail in `10_tech.md`. Authors always drop source files into `content/<window>/`.

Each folder includes a `README.md` describing accepted formats and a `manifest.example.json` shape.

---

## Source Modes Per Window

| Window | Primary source | Optional API | Notes |
| --- | --- | --- | --- |
| **Loop** | `content/loop/` | Free stock video API only if license is clear for games | Short vertical clips |
| **Pulse** | `content/pulse/` text library + runtime generators | None required | All text; no media API needed |
| **Wave** | `content/wave/` | Free/legal music API only (see below) | High-paced bias |
| **Echo** | `content/echo/audio/` and `content/echo/video/` | Free/legal long-form only | Audio **or** video per item |
| **Alerts** | `content/alerts/` templates + runtime fills from other windows | None | Copy tied to Attention Requests |

### Music / long-form APIs (if used later)

Allowed only when terms explicitly permit use in an interactive web game (playback + caching as needed). Prefer:

- Tracks/podcasts you downloaded yourself under a clear free license into `content/wave/` or `content/echo/`
- APIs that return **license metadata** with every item (store it for credits)

Do **not** wire Spotify, YouTube Data downloads, or other commercial catalog APIs for raw media. If no safe API is configured, **local directories only**.

---

## Preload Gate

Before transitioning `Loading` → `Playing`:

1. Resolve the Match content pack (which Loop clips, Wave tracks, Echo items, Pulse pool, Alert templates will be used).
2. Validate manifests (required fields, file exists, license tag present for third-party media).
3. Load enough buffered media to start smoothly (at least: first Loop clip, first Wave track, first Echo item, Pulse pool in memory, Alert templates).
4. If validation fails → stay in Loading with a clear error; never start a broken Match.

Optional progressive fetch of *later* queue items is allowed **after** start only if the first N items are already safe; prefer full pack preload for the MVP.

---

## Loop (`content/loop/`)

### Needs

- Short vertical (or croppable) video clips that can loop
- Metadata: id, title, creatorLabel (fictional), tags/hashtags, optional mood (`funny` / `ragebait` / `brainrot` / `calm` / …)

### Local layout

```
content/loop/
  README.md
  manifest.json          ← list of clips
  clips/
    clip_001.webm
    clip_002.webm
    …
```

### Formats

Prefer `webm` or `mp4` (browser-decodable). Keep files small for fast preload.

### API

Only if license-safe. Otherwise local only.

### Notifications tied to Loop

Templates that can fire Attention Requests / Alerts, e.g. “LIVE NOW”, “Breaking trend”, “Limited challenge” — stored under `content/alerts/` with `source: loop` or generated from Loop metadata.

---

## Pulse (`content/pulse/`)

### Needs

**All text.** No video/audio required.

Two complementary approaches (both allowed):

1. **Library** — large JSON/CSV of posts, trends, usernames, reply snippets  
2. **Runtime generation** — rules/templates that compose posts from seeds (ragebait patterns, trend slots, spam/ad fillers)

### Local layout

```
content/pulse/
  README.md
  posts.json             ← hand-authored posts
  trends.json            ← trend topics + lifetimes hints
  users.json             ← display names / handles (fictional)
  generators/
    seeds.json           ← fragments for algorithmic posts
    README.md
```

### Generation rules (high level)

- Posts may be library picks, generated, or mixed.
- Categories from gameplay docs: harmless trends, absurd debates, ragebait, memes, controversial opinions, fake news, internet drama, advertising, spam.
- **Advertising / spam** must be identifiable in data (`rewardable: false`) so Dopamine stays `0`.
- Never include real people’s private data or real brand slogans that imply endorsement.

### Notifications tied to Pulse

Mentions, replies, “your post is trending”, ragebait spikes — from `content/alerts/` with `source: pulse`, filled with generated names/topics.

---

## Wave (`content/wave/`)

### Needs

- Streamable audio tracks
- Metadata: id, title, artistLabel (fictional ok), duration, **pace** (`high` | `mid` | `boring`), license

### Pacing intent

- **Primarily high-paced** — instrumental / techno / electronic energy that supports arcade stimulation
- **Random boring tracks** occasionally — slower, dull, or mismatched — to throw the player off (satire + Wave discovery tension)

Manifest should tag `pace` so the Match playlist can bias high with sparse boring inserts (ratios in `06_balance.md` later if needed; default e.g. ~85% high / ~15% boring).

### Local layout

```
content/wave/
  README.md
  manifest.json
  tracks/
    track_001.mp3
    track_002.ogg
    …
```

### Formats

`mp3`, `ogg`, or `wav` (prefer compressed for preload size).

### API

Optional free/legal music API with per-track license fields. If unused or unsafe → **local only** in this folder.

### Notifications tied to Wave

“Everyone is listening”, “New viral sound”, recommendation ready — `content/alerts/` with `source: wave`.

---

## Echo (`content/echo/`)

### Needs

Long-form items that are **either audio or video** (flexible per item).

| Media kind | Player chrome | Notes |
| --- | --- | --- |
| `video` | Long-form **video player** look (YouTube-*like*, fictional — no YT brand) | Shows picture + controls |
| `audio` | **Wave-like** audio player chrome | No video frame; waveform / abstract art ok |

### Local layout

```
content/echo/
  README.md
  manifest.json
  audio/
    ep_001.mp3
    …
  video/
    ep_001.webm
    …
```

`manifest.json` entries include `kind: "audio" | "video"`, path, title, creatorLabel, optional chapter/moment markers for Attention Requests, license.

### Formats

Audio: same as Wave. Video: `webm` / `mp4`, longer allowed but keep preload budget sane (lazy-buffer after first item if needed — still validate presence in Loading).

### API

Same legal bar as Wave. Default: local folders above.

### Notifications tied to Echo

“Everyone reacted to this moment”, debate/quote moments, sponsor segments (noise, `rewardable: false`) — `content/alerts/` with `source: echo`.

---

## Alerts (`content/alerts/`)

### Needs

Copy templates and optional simple icons for:

- Social (from Pulse)
- Media (from Loop / Wave / Echo)
- Fake system / standalone satire
- Spam (no Dopamine)

### Local layout

```
content/alerts/
  README.md
  templates.json
  icons/                 ← optional caricaturesque PNGs/SVGs
```

Templates reference `source`, `priority`, `rewardable`, and placeholder slots (`{user}`, `{topic}`, `{track}`).

Window Attention Requests may use the same template pool or window-local strings; Alerts is the shared notification content SSOT for copy.

---

## Manifest Requirements (all media windows)

Every third-party or dropped-in media file listed in a manifest must include:

- `id` (stable string)
- `path` (relative to that window’s content folder)
- `license` (`CC0` | `CC-BY` | `owned` | …)
- `attribution` (who to credit; may be empty only for `owned` original work)
- `title` / display labels as needed by the window

Missing license on non-owned media → **fail Loading**.

---

## Minigame Art / SFX

Not player “catalog” content. Ship under `src/assets/` (or later `content/minigames/` if you prefer parity). Rules for spectacle vs window chrome stay in art direction / `09_game_feel.md`. Attribution still required for third-party packs (`13`).

---

## Acceptance Criteria

- Top-level `content/loop|pulse|wave|echo|alerts` exist and are the authoring drop zones.
- Pulse can run on text library and/or generators with no media API.
- Wave playlist biases high-paced with occasional boring tracks via metadata.
- Echo supports audio-only (Wave-like chrome) and video (long-form player chrome) per item.
- Match cannot enter Playing until preload/validation succeeds.
- Alert/Attention Request copy is template-driven and can bind to window events.
- No real-platform brands or uncleared commercial media in shipped content.
