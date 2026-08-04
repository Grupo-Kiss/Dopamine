# Game Feel Specification

## Purpose

This document defines **how the game looks, sounds, and feedbacks** — start/splash/game-over surfaces, window branding, arcade stickers (Balatro-level energy, not Balatro art), Dopamine bar, Burnout/Recovery overlays, audio mix (including focus muffling), minigame art direction, and mid-fi mockups for review.

Gameplay: `02`–`05`. Layout: `07`. Content: `08`. Numbers: `06`.

**Mockups live in** `content/mockups/` — mid-fidelity references you can pull offline and rework.

---

## Product Surfaces

### Start Page (before PLAY)

Not an instant jump into the Match. Includes:

- Title / brand (arcade energy)
- Brief how-to-play (Focus Chain idea in one sentence, Dopamine drains, switch windows)
- **Accessibility mode** toggle (reduced motion: less shake/flash/pulsing; stickers stay readable)
- **Credits** link → opens **Credits Modal** (long attribution list; see `13`)
- PLAY

English-only UI strings for v1. Player-typed Pulse text may be any language; the game does not localize or judge it.

### Credits Modal

Scrollable overlay over Start Page or Game Over. Opened by the Credits link; Esc / close returns to the hub. Holds game blurb, third-party media list, OSS/fonts, provider notices, satire disclaimer. Not a separate full-page route that replaces the hub.

### Splash (`Loading`)

Arcade-like short splash while the starter pack loads (`08`). Bold title treatment, light sticker motion, window icons. Must feel like a cabinet boot, not an installer.

### Game Over

Reuse the same informational blocks as the Start Page (brief instructions reminder, **Credits** link → modal, accessibility) adapted around survival stats + **PLAY AGAIN** (demanding if ignored). Hard silence under the hold frame.

---

## Dual Visual Worlds

| Surface | Look | Density |
| --- | --- | --- |
| **Desktop chrome / windows** | Minimal, rounded, stroked, clean caricaturesque UI | Low |
| **Arcade stickers / FX** | High energy (Balatro-*motion* energy: snappy squash/stretch, punchy pops) — not Balatro’s art style | Event-only |
| **Minigames** | Cute Supercell-friendly toony (Lane/Runner) or harmonious modern-classic Tetris (Block Cascade) | High in-slot |

Overall satire stays **cute / readable**, not depressive-dark. Individual windows may use **darker palettes** (e.g. Wave “dark player”, Block Cascade dark board) without gloomy styling.

**Gutter / stage background:** near-black (`#0a0a0c` range) visible between windows.

---

## Window Branding Palettes

Rounded corners + stroke + minimal controls. Accent color for primary actions (Like, Publish, Skip). Derived from `content/icons/` gradients:

| Window | Primary | Accent | Notes |
| --- | --- | --- | --- |
| Loop | `#ff4d6d` → `#ff8fa3` | `#fff` / hot pink highlight | Light playful feed |
| Pulse | `#1da1f2` → `#6ec6ff` | `#ffffff` buttons on blue | Clean microblog (parody-adjacent blue — finalize in high-fi) |
| Wave | `#0b3d2e` / `#1db954` | `#1db954` | **Dark player** chrome (fictional; finalize green in high-fi) |
| Echo | `#990022` → `#ff0033` | `#ffffff` | Long-form; video or audio chrome |
| Alerts | `#f5a623` → `#f76b1c` | `#fff` | Urgent cards |
| Dopamine bar | See below | — | Edge meter |
| Minigame frame | Neutral dark stroke | Per-game | Doesn’t steal Loop pink |

Active Window: stronger stroke / subtle glow in that window’s primary. Focus Ready: soft shimmer in-brand.

---

## Dopamine Bar

Vertical edge meter (`07`).

| Fill level | Color |
| --- | --- |
| Full / high | **Orange** (`#ff8c00` → `#ffb347`), **radioactive glow + pulsating** |
| Mid | Interpolate orange → violet |
| Low / empty | **Purple / violet** (`#7b2cbf` → `#5b1d8a`), glow dies down |

Fill amount drives both height/amount **and** hue continuously. High Dopamine = stronger pulse + bloom. Low = quieter, colder bar.

Mockup: `content/mockups/dopamine_bar.svg`

---

## Arcade Stickers And Motion (Balatro energy)

Snappy pops, brief overshoot, satisfying settle. Not constant chaos on chrome.

| Sticker | Behavior |
| --- | --- |
| Combo `xN` / `xN!!` | Over Active Window; **juicy → bored** as same-window diminishing returns rise |
| Focus Chain | Bigger arcade banners; tiered punch |
| Score / Dopamine `+N` | Tiny floats; bigger on Attention Requests |
| Burnout telegraph | Edge + sticker when near APM threshold |

Reduced-motion (accessibility): replace shake/big pulse with opacity/color transitions; keep information.

Mockups: `content/mockups/stickers_combo.svg`, `content/mockups/stickers_chain.svg`

---

## Burnout And Recovery Overlays

### Burnout (more stressful)

- Hotter reward pops / denser particles (as before)
- **Reddish vignette** over the playfield
- **Semi-transparent grunge texture** overlay (colorized, not B&W), **pulsating** opacity
- Wave bed may **saturate / bother** (real-life overload) — still respect master limiter slightly so hardware isn’t harsh-clipped into pain, but it should feel dirty
- **No focus muffling** — everything competes equally

Reference energy for grunge: textured overlay similar to grunge stock (e.g. Texturelabs-style) with alpha — place final texture at `content/minigames/_shared/textures/burnout_grunge.png` (you supply; see Audio/Assets asks below).

Mockup: `content/mockups/overlay_burnout.svg`

### Recovery (sleepy opposite)

- **Violet / cooler vignette**
- **Darker desaturating overlay** over apps (mutes color)
- Stickers less celebratory; slower pulse
- Extra muffling on almost everything, easing back to normal as Recovery ends

Mockup: `content/mockups/overlay_recovery.svg`

---

## Minigame Framing (aspect)

Minigame **playable content** sits in a **fixed aspect box** inside its layout slot. Letterbox / pillarbox (or extend non-playable ground) with near-black or in-world ground fill — do **not** stretch sprites.

Aspect is chosen to fit the `07` masonry slot (not assumed 16:9 fullscreen). Author art for that box; scale uniformly.

3D primitives (hazards/props): **bevelled edges**, no sharp razor corners — soft toony blocks.

### Lane Defender / Endless Runner

Cute Supercell-friendly soldier + monsters as **cardboard cutout** billboards in simple 3D space. Shared cast OK. Hazards = bevelled basic shapes.

### Block Cascade

Dark modern board, crisp bright tetrominoes (starter `skin_blocks.json`), soft bevels — harmonious with Wave’s dark-but-fun energy, not out of place next to Loop/Pulse pastels.

Mockups: `content/mockups/minigame_lane.svg`, `content/mockups/minigame_blocks.svg`

---

## Audio Mix

### Priority (unchanged order)

1. Critical Alerts / Burnout telegraph / Game Over sting  
2. Focus Chain / big arcade rewards  
3. Combo SFX (boredom curve)  
4. Minigame action SFX  
5. Wave music bed  
6. Echo playback  
7. Ambient UI  

Silence only after Game Over.

### Focus muffling (yes — feasible)

**Real-time programmatic mixing is possible** in browsers via the **Web Audio API** (`GainNode`, lowpass/`BiquadFilterNode` per bus). Complexity is **moderate**, not huge: one small mixer module, not a DAW.

Intended behaviour:

| State | Non-focused window audio | Focused |
| --- | --- | --- |
| Playing (normal) | Slightly muffled / lower gain | Clear |
| Burnout | **No muffling** — all competing | All hot |
| Recovery | **Extra muffled** globally, ease back to normal | Still muted relative |

If scheduling pressure appears during TDD, ship priority ducks first and muffling second — but **design intent includes muffling**.

Wave in Burnout may saturate/bother on purpose.

---

## English

All system UI, alerts templates, and Pulse *library* strings: English. Free-typed Pulse content: unrestricted.

---

## Accessibility Mode

Toggle on Start Page (persisted locally). When on:

- Reduce/disable shake, heavy pulse, radioactive bar throb intensity
- Prefer fade/color for Burnout telegraph
- Keep stickers readable
- Do not remove information — only motion intensity

---

## Mid-Fi Mockups (review offline)

| File | Shows |
| --- | --- |
| `content/mockups/start_page.svg` | Title, short instructions, accessibility, Credits link, PLAY |
| `content/mockups/credits_modal.svg` | **Hi-fi target** — scrollable Credits Modal over hub |
| `content/mockups/desktop_layout.svg` | Near-black gutters, branded windows, Dopamine bar |
| `content/mockups/mobile_layout.svg` | **Hi-fi target** — Minigame + 2 services + edge Dopamine |
| `content/mockups/dopamine_bar.svg` | High orange glow vs low violet |
| `content/mockups/stickers_combo.svg` | Juicy vs bored combo |
| `content/mockups/stickers_chain.svg` | Focus Chain arcade banner |
| `content/mockups/overlay_burnout.svg` | Red vignette + grunge pulse |
| `content/mockups/overlay_recovery.svg` | Violet sleepy mute |
| `content/mockups/game_over.svg` | Stats + PLAY AGAIN + Credits link |
| `content/mockups/minigame_lane.svg` | Cutout soldier/monster lanes |
| `content/mockups/minigame_runner.svg` | **Hi-fi target** — Endless Runner lanes |
| `content/mockups/minigame_blocks.svg` | Dark modern Tetris board |
| `content/mockups/splash.svg` | Arcade splash |
| `content/mockups/window_loop.svg` | **Hi-fi target** — Loop chrome alone |
| `content/mockups/window_pulse.svg` | **Hi-fi target** — Pulse chrome alone |
| `content/mockups/window_wave.svg` | **Hi-fi target** — Wave dark player |
| `content/mockups/window_echo.svg` | **Hi-fi target** — Echo player |
| `content/mockups/window_alerts.svg` | **Hi-fi target** — Alert cards |

Existing mid-fi SVGs are placeholders until high-fi replaces them. Rows marked **Hi-fi target** may not exist yet — create during asset review.

---

## Assets To Supply (final art / audio)

Do not invent final SFX or music beds in code — drop files into these paths.

### Shared / feel

| Path | What |
| --- | --- |
| `content/minigames/_shared/textures/burnout_grunge.png` | Colorized transparent grunge (alpha) |
| `content/minigames/_shared/sfx_sticker_*.ogg` | combo juicy, combo bored, chain step, chain complete, burnout telegraph |
| `content/icons/*.svg` | Replace starters: loop, pulse, wave, echo, alerts, dopamine |

### Minigame SFX

| Path | What |
| --- | --- |
| `content/minigames/lane_defender/sfx_*.ogg` | hit, destroy, boss_warn, boss_down, pickup |
| `content/minigames/endless_runner/sfx_*.ogg` | lane, collect, crash, rare |
| `content/minigames/block_cascade/sfx_*.ogg` | place, rotate, clear, tetris, reset |

### Minigame visuals (first-party)

Produce under `content/minigames/<id>/`. Bevel 3D props. Cute, not grim. Letterbox to fixed aspect (`07` slot).

**Lane Defender**

- `player_soldier` (cutout)
- `enemy_normal`, `enemy_boss` (cutouts)
- hazard meshes/sprites: mine, barrier (bevelled primitives OK)
- pickups: score mult, rapid fire, pierce, wide, shield, magnet
- lane/ground/backdrop fills

**Endless Runner**

- shared or sibling soldier cutout
- obstacles set (at least 3 readable types)
- collectibles + rare pickup
- ground / parallax strips

**Block Cascade**

- `skin_blocks.json` + tetromino face textures / colors (dark board, bright pieces)
- ghost piece, clear FX frames (optional sprites)
- board frame chrome

### Window media beds (`08`)

| Path | What |
| --- | --- |
| `content/wave/high/*` | High-paced tracks + manifest license/attribution |
| `content/wave/boring/*` | Slow / throw-off tracks |
| `content/loop/clips/*` | Short vertical/croppable videos + `manifest.json` |
| `content/echo/audio/*` and/or `video/*` | Long-form items + `manifest.json` |
| `content/pulse/*.json` | Expand from `*.example.json` during mid-dev (~100 templates) |
| `content/alerts/templates.json` | Optional |

Starter **visual** SVGs already under `content/icons/` and `content/minigames/` — replace anytime.

---

## Acceptance Criteria

- Start Page exists with instructions, accessibility, Credits link → Credits Modal, PLAY.
- Credits Modal scrolls a long attribution list without replacing the hub layout.
- Dopamine bar hue-shifts orange→violet with radioactive high-end glow.
- Stage background near-black; windows branded, rounded, stroked, minimal.
- Stickers carry Balatro-*energy* motion; combo boredom curve visible.
- Burnout = red vignette + pulsing grunge; Recovery = violet/sleepy mute.
- Focus muffling in normal/recovery; none in Burnout — via Web Audio buses.
- Minigame content fixed-aspect letterboxed; 3D edges bevelled.
- Mockups present under `content/mockups/` for offline rework (mid-fi OK until high-fi).
- English system strings; accessibility toggle honored.
