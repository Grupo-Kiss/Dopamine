# Visual Assets Production Brief

## Purpose

**Single source of truth for the hi-fi visual asset pass.** A Cursor Cloud Agent (**Claude Opus 5**, thinking high/xhigh) produces all listed graphics into `content/`. The owner **approves**; they do not hand-draw.

Gameplay rules stay in `02`–`05`. Feel language in `09`. Layout slots in `07`. Media beds / APIs in `08`. Legal in `13`. Shell lock in `PRODUCT.md` + `DESIGN.md` + `.impeccable/`.

**This pass is visual only.** Do **not** scaffold Vite, feature-code, or revive closed PR #5’s app tree. SFX / music / video clips are **out of scope** here except where a static thumbnail/cover is needed for mockups.

---

## Agent mandate (read first)

1. Model: **Claude Opus 5** (vision + long art-direction following). Not Composer (no vision). Not Muse Spark (coding flagship).
2. Read before drawing: this file → `HANDOFF.md` → `PRODUCT.md` → `DESIGN.md` → `CONTEXT.md` → `defs/09` → `defs/07` → mid-fi under `content/mockups/` + `.impeccable/mocks/`.
3. Replace mid-fi placeholders with hi-fi files at the **same paths** (or create missing hi-fi targets). Keep mid-fi as `_midfi/` copies only if useful for diff; prefer overwrite after saving a backup is unnecessary in git history.
4. Art must stay **legally distinct**: no real TikTok/Twitter/Spotify/YouTube/iOS/Android chrome, logos, or identifiable UI clones (`00`, `08`, `CONTEXT` Window Art).
5. Dual worlds (`09`): calm **OS window chrome** vs punchy **arcade stickers** vs denser **minigame** spectacle.
6. “3D” means **bevelled soft toony shapes** and **cardboard-cutout billboards** in simple perspective — **not** Blender meshes, glTF, or photoreal 3D. Deliver as PNG/WebP/SVG (and JSON skins where noted) for Canvas 2D.
7. Deliverables go under `content/`. Prefer **SVG** for icons/chrome/vector stickers; **PNG/WebP with alpha** for sprites, cutouts, textures, raster mockups. Name files exactly as listed below.
8. After each phase, leave a short checklist comment in the PR / handoff: what shipped, what’s blocked.
9. Stop for owner approval after **Phase A** (hub screens) before flooding the tree — then continue Phases B→E unless the owner says otherwise in-session.

---

## Visual lock (do not renegotiate)

| Source | Lock |
| --- | --- |
| `DESIGN.md` / `.impeccable/design.json` | GitHub-dark stage `#0d1117`, violet blooms `#6e40c9`→`#a371f7`, PLAY orange `#ff4d1a`/`#ff8c00`, OS window panels, Public Sans + Teko |
| `.impeccable/mocks/start-comp-a-centered.*` | **Approved Start Page composition** (centered collision bloom) |
| `.impeccable/quality-bar/*` | Collider Attention Display *energy* — blooms + grid, **no track lines / ring diagrams** |
| `09` palettes | Per-window brand gradients (finalize Pulse blue / Wave green consciously; document chosen hexes in `DESIGN.md` if you lock them) |
| Stage gutters | Near-black between windows (`#0a0a0c`–`#0d1117`) |

Rejected: heavy CRT nostalgia as the whole brand, childish pinball clutter, corporate marketing Start Page, light theme via Accessibility, real-platform skins.

---

## Production phases

| Phase | Scope | Output root |
| ---: | --- | --- |
| **A** | Hub surfaces (Start, Credits, Splash, Game Over) + shared OS chrome kit | `content/mockups/`, `content/ui/` |
| **B** | Playing layouts (desktop + mobile) + Dopamine bar + stickers + Burnout/Recovery | `content/mockups/`, `content/ui/`, `content/minigames/_shared/` |
| **C** | Service window chrome alone (Loop, Pulse, Wave, Echo, Alerts) | `content/mockups/window_*.svg|webp`, `content/ui/windows/` |
| **D** | Icons (hi-fi replace starters) | `content/icons/` |
| **E** | Minigame sprites / “3D” props / boards (all three games) | `content/minigames/<id>/` |

Optional later (not blocking scaffold): placeholder stills for Loop/Echo/Wave covers under `content/*/placeholders/` — **not** full video/audio catalogs.

---

## Shared OS chrome kit

Create a reusable kit so every surface shares the same window language.

| File | What |
| --- | --- |
| `content/ui/os_window_frame.svg` | Title bar + traffic-light dots + body; ~14px radius; panel `#161b22`, edge `#30363d` |
| `content/ui/os_window_frame_active.svg` | Stronger stroke / violet-tinged outer glow (Active Window) |
| `content/ui/crt_overlay_preview.webp` | Full-screen scanlines + barrel vignette + lo-fi noise (reference for implementers; not stamped onto controls) |
| `content/ui/stage_grid_bloom_preview.webp` | Soft animated-grid + blurred violet blooms (static frame OK) |
| `content/ui/play_button.svg` | Beveled PLAY CTA (Teko face, orange fill) |
| `content/ui/play_again_button.svg` | Same language, “PLAY AGAIN” |
| `content/ui/accessibility_toggle.svg` | Low-contrast corner control (on/off states) |
| `content/ui/credits_link.svg` | Quiet text-link treatment |
| `content/brand/title-dopamine.webp` | Raster wordmark **Dopamine** (arcade punch; replaceable if title changes) |

---

## Phase A — Hub surfaces

### A1. Start Page

**Mockup:** `content/mockups/start_page.svg` **and** `content/mockups/start_page.webp` (hi-fi raster of final look).

Must show:

- Centered OS window on bloom + grid stage (match `.impeccable/mocks/start-comp-a-centered`)
- Brand wordmark / title (hero-level, not nav-only)
- One short how-to line (Focus Chain + Dopamine drain + switch windows)
- Accessibility toggle (corner, dim)
- Credits link (corner, dim)
- Hungry PLAY CTA (dominant)
- Ghost windows / chaos stickers / streaks in negative space (sparse, not cluttered)
- Full-screen CRT as top glass (preview)

**Do not** put stats, feature cards, or dense marketing copy on this screen.

### A2. Credits Modal

**Mockup:** `content/mockups/credits_modal.svg` (+ `.webp` optional).

- Same OS window chrome over **dimmed** Start Page stage
- Scrollable long attribution body (placeholder lorem sections: Game / Media / OSS / Fonts / Providers / Satire disclaimer)
- Close affordance; Esc implied in notes

### A3. Loading / Splash

**Mockup:** `content/mockups/splash.svg` (+ `.webp`).

- Arcade cabinet-boot energy (not installer)
- Bold title
- Progress hint / glow bar
- Five service icons lighting up: Loop, Pulse, Wave, Echo, Alerts (`content/icons/` once hi-fi)
- Same stage language (grid, blooms, CRT)

### A4. Game Over

**Mockup:** `content/mockups/game_over.svg` (+ `.webp`).

- Survival stats block (Score, time, Focus Chain peak — placeholder numbers)
- PLAY AGAIN (demanding / hungry if ignored — show default hungry state)
- Credits link + Accessibility reminder (same corner language as Start)
- Hard silence mood (no busy music viz); stage still present but colder

---

## Phase B — Playing HUD & layouts

### B1. Desktop Playing layout

**Mockup:** `content/mockups/desktop_layout.svg` (+ `.webp`).

Per `07`:

- Near-black gutters
- Top: Minigame | Loop-over-Wave (equal height column match)
- Bottom: Pulse | Echo
- Vertical **Dopamine bar** on right edge (outside masonry)
- Stickers floating (combo / chain samples)
- One Alert card overlapping (Alerts are not a masonry slot)
- Each window uses Phase C chrome + Phase D icons

Show **one** minigame (Lane Defender preferred for the hero mockup).

### B2. Mobile Playing layout

**Mockup:** `content/mockups/mobile_layout.svg` (+ `.webp`) — **create** (hi-fi target missing today).

- Stack: Minigame (largest) + two service windows
- Edge Dopamine meter
- Alert overlay sample
- Same brand language, tighter

### B3. Dopamine bar

| File | What |
| --- | --- |
| `content/mockups/dopamine_bar.svg` | Full (orange radioactive glow) vs empty (violet) side-by-side |
| `content/ui/dopamine_bar_full.webp` | Vertical meter strip — high fill |
| `content/ui/dopamine_bar_empty.webp` | Vertical meter strip — empty |
| `content/ui/dopamine_bar_mid.webp` | Mid interpolate |

Hue continuously orange → violet; high = pulse/bloom; low = quieter.

### B4. Arcade stickers

| File | What |
| --- | --- |
| `content/mockups/stickers_combo.svg` | Juicy `x7!!` vs bored flat `x2` |
| `content/mockups/stickers_chain.svg` | Focus Chain banner tiers |
| `content/ui/stickers/combo_juicy.svg` | Production sticker |
| `content/ui/stickers/combo_bored.svg` | Flattened / boring variant |
| `content/ui/stickers/combo_xN_sheet.svg` | Optional sheet `x2`…`x9` + `!!` |
| `content/ui/stickers/focus_chain_tier1.svg` | Small chain pop |
| `content/ui/stickers/focus_chain_tier2.svg` | Mid |
| `content/ui/stickers/focus_chain_tier3.svg` | Big arcade banner |
| `content/ui/stickers/score_float.svg` | Tiny `+N` / Dopamine float |
| `content/ui/stickers/burnout_telegraph.svg` | Edge warning when APM near threshold |

Energy = Balatro-*motion* punch, **not** Balatro art theft. Readable under Accessibility (no reliance on shake alone).

### B5. Burnout / Recovery overlays

| File | What |
| --- | --- |
| `content/mockups/overlay_burnout.svg` | Red vignette + pulsing grunge preview |
| `content/mockups/overlay_recovery.svg` | Violet sleepy desaturate preview |
| `content/minigames/_shared/textures/burnout_grunge.png` | Colorized **transparent** grunge (alpha), tileable-ish |
| `content/ui/overlays/burnout_vignette.png` | Reddish radial vignette alpha |
| `content/ui/overlays/recovery_vignette.png` | Cool violet vignette alpha |
| `content/ui/overlays/recovery_desaturate_preview.webp` | Full-frame sleepy mute example |

Agent **may** invent provisional overlays from mid-fi + stage language; mark `PROVISIONAL` in PR notes if owner wants to swap later.

---

## Phase C — In-game window chrome (each alone)

Produce a **solo hi-fi mockup** plus a **production chrome kit** per window. Chrome = caricaturesque Window Art (`CONTEXT`): rounded, stroked, minimal — not photoreal apps.

### C1. Loop (short-form video)

**Mockup:** `content/mockups/window_loop.svg` (+ `.webp`).

Palette: `#ff4d6d` → `#ff8fa3`, hot pink accents, light playful feed.

| Asset | Path | Notes |
| --- | --- | --- |
| Frame | `content/ui/windows/loop/frame.svg` | Vertical video stage + chrome |
| Avatar placeholder | `content/ui/windows/loop/avatar_placeholder.svg` | Generic creator disc |
| Like / Repost controls | `content/ui/windows/loop/controls.svg` | Distinct from real apps |
| Progress pill | `content/ui/windows/loop/progress.svg` | Clip progress |
| Focus Ready shimmer | `content/ui/windows/loop/focus_ready.svg` | Soft in-brand shimmer |
| Attention burst FX | `content/ui/windows/loop/attention_burst.svg` | Particles / icon burst for Interactive Opportunities |
| Placeholder clip still | `content/loop/placeholders/clip_01.webp` … `clip_03.webp` | Vertical 9:16 satire stills (no real logos) — optional Phase C |

Visible UI per `03`: avatar, title, hashtags, like count, comment count (display), repost, progress. Video never auto-advances in gameplay — mockup may show one paused/playing frame.

### C2. Pulse (microblog)

**Mockup:** `content/mockups/window_pulse.svg` (+ `.webp`).

Palette: finalize conscious blue (starter `#1da1f2` → `#6ec6ff`); white buttons on blue. **Not** Twitter/X clone.

| Asset | Path | Notes |
| --- | --- | --- |
| Frame | `content/ui/windows/pulse/frame.svg` | Feed column |
| Post card | `content/ui/windows/pulse/post_card.svg` | Avatar + text + actions |
| Compose box | `content/ui/windows/pulse/compose.svg` | Publish affordance |
| Trend chip | `content/ui/windows/pulse/trend_chip.svg` | |
| Like / Repost / Reply icons | `content/ui/windows/pulse/action_icons.svg` | Fictional marks |
| Ad/spam card treatment | `content/ui/windows/pulse/ad_card.svg` | Visually identifiable `rewardable: false` |
| Focus Ready / Attention | `content/ui/windows/pulse/focus_ready.svg` | |

### C3. Wave (music)

**Mockup:** `content/mockups/window_wave.svg` (+ `.webp`).

Palette: dark player `#0b3d2e` / finalize green `#1db954`-adjacent (conscious lock). Spotify-*grammar* only — **no** logos/wordmarks.

| Asset | Path | Notes |
| --- | --- | --- |
| Frame | `content/ui/windows/wave/frame.svg` | Compact dark player |
| Artwork disc / abstract cover | `content/ui/windows/wave/cover_abstract.svg` | Generated abstract OK |
| Waveform | `content/ui/windows/wave/waveform.svg` | |
| Transport controls | `content/ui/windows/wave/transport.svg` | Play/pause, skip, like |
| Discovery badge | `content/ui/windows/wave/discovery_badge.svg` | Unheard-track novelty |
| Anticipation / Song Moment FX | `content/ui/windows/wave/song_moment.svg` | Beat-drop telegraph |
| Reco card | `content/ui/windows/wave/recommendation.svg` | |

### C4. Echo (long-form)

**Mockup:** `content/mockups/window_echo.svg` (+ `.webp`).

Palette: `#990022` → `#ff0033`.

| Asset | Path | Notes |
| --- | --- | --- |
| Frame video | `content/ui/windows/echo/frame_video.svg` | Long video chrome |
| Frame audio | `content/ui/windows/echo/frame_audio.svg` | Podcast-style |
| Scrub / chapter marks | `content/ui/windows/echo/scrub.svg` | Highlight moments |
| Highlight burst | `content/ui/windows/echo/highlight_moment.svg` | Sparse high-value FX |
| Avatar / show art placeholder | `content/ui/windows/echo/show_art.svg` | |

### C5. Alerts (overlay cards)

**Mockup:** `content/mockups/window_alerts.svg` (+ `.webp`).

Palette: `#f5a623` → `#f76b1c`. Float above layout; only overlapping element.

| Asset | Path | Notes |
| --- | --- | --- |
| Card template | `content/ui/windows/alerts/card.svg` | OS-like, not real OS |
| Icon slot | `content/ui/windows/alerts/icon_slot.svg` | |
| Priority variants | `content/ui/windows/alerts/card_urgent.svg`, `card_soft.svg` | Intensity tiers |
| Stack peek | `content/ui/windows/alerts/stack.webp` | Multiple stacked |

---

## Phase D — Window icons

Replace starters in `content/icons/`. Gradient, generic, readable at 24–64px and on Splash.

| File | Window |
| --- | --- |
| `content/icons/loop.svg` | Loop |
| `content/icons/pulse.svg` | Pulse |
| `content/icons/wave.svg` | Wave |
| `content/icons/echo.svg` | Echo |
| `content/icons/alerts.svg` | Alerts |
| `content/icons/dopamine.svg` | Dopamine / meter mark |

Also export `content/icons/png/loop.png` (etc.) at 128px if raster consumers need them.

---

## Phase E — Minigame art (sprites + “3D”)

**Rules (`09`, `04`):**

- Playable content in a **fixed-aspect** box; letterbox with near-black / in-world ground — never stretch.
- Lane / Runner: cute Supercell-friendly **cardboard cutouts** (2D billboards) in simple 3D lane space.
- Hazards/props: **bevelled** primitives (soft corners), readable silhouette.
- Block Cascade: dark modern board, bright bevelled tetrominoes.
- Shared cast OK between Lane Defender and Endless Runner.
- Numeric indicators must stay readable (boss integrity, hazard counters).

Aspect targets (author to these; tune later with `07` slot):

| Game | Suggested art box | Notes |
| --- | --- | --- |
| Lane Defender | 3:4 portrait playfield | Top-down three lanes |
| Endless Runner | 3:4 portrait | Forward scroll lanes |
| Block Cascade | 10:16 board (classic tetromino feel) | Dark board |

### E1. Shared minigame / cast

| File | What |
| --- | --- |
| `content/minigames/_shared/player_soldier_cutout.png` | Master soldier cardboard cutout (alpha) |
| `content/minigames/_shared/player_soldier_cutout.svg` | Vector master if practical |
| `content/minigames/_shared/enemy_normal_cutout.png` | Toony monster |
| `content/minigames/_shared/enemy_boss_cutout.png` | Larger multi-lane boss |
| `content/minigames/_shared/textures/ground_tile.png` | Lane ground |
| `content/minigames/_shared/textures/backdrop.png` | Simple depth backdrop |
| `content/minigames/_shared/fx/muzzle_flash.svg` | |
| `content/minigames/_shared/fx/explosion.svg` | |
| `content/minigames/_shared/fx/hit_spark.svg` | |
| `content/minigames/_shared/ui/number_positive.svg` | Style for +counters |
| `content/minigames/_shared/ui/number_negative.svg` | Style for hazard counters |
| `content/minigames/_shared/textures/burnout_grunge.png` | (also Phase B) |

### E2. Lane Defender — `content/minigames/lane_defender/`

Replace existing starter SVGs with hi-fi.

| File | What |
| --- | --- |
| `player_soldier.png` (+ `.svg` optional) | Bottom-lane player cutout |
| `enemy_normal.png` | One-hit enemy |
| `enemy_boss.png` | Multi-lane boss |
| `hazard_mine.png` | Bevelled mine (“3D” prop) |
| `hazard_barrier.png` | Bevelled barrier with counter space |
| `pickup_score_mult.png` | |
| `pickup_rapid_fire.png` | |
| `pickup_pierce.png` | |
| `pickup_wide.png` | |
| `pickup_shield.png` | |
| `pickup_magnet.png` | |
| `lane_guide.png` | Three-lane markings |
| `ground.png` / `backdrop.png` | Or symlink/_shared |
| `mockup_playfield.webp` | Full playfield hero shot |
| Update `content/mockups/minigame_lane.svg` | Hi-fi mockup |

### E3. Endless Runner — `content/minigames/endless_runner/`

| File | What |
| --- | --- |
| `player_soldier.png` | Same cast or sibling pose (running) |
| `obstacle_static_a.png` | Readable type 1 |
| `obstacle_static_b.png` | Type 2 |
| `obstacle_moving.png` | Type 3 (telegraphs motion) |
| `collectible.png` | Ordinary pickup |
| `collectible_rare.png` | Rare — juicier |
| `ground_strip.png` | Scrolling ground |
| `parallax_far.png` / `parallax_near.png` | Simple strips |
| `mockup_playfield.webp` | |
| Create `content/mockups/minigame_runner.svg` (+ `.webp`) | **Missing hi-fi target** |

### E4. Block Cascade — `content/minigames/block_cascade/`

| File | What |
| --- | --- |
| `skin_blocks.json` | Update colors/UVs for seven tetrominoes (dark board, bright pieces) |
| `board_frame.svg` | Chrome around grid |
| `board_bg.png` | Dark modern well |
| `tex_I.png` … `tex_O.png` (or single atlas `tetromino_atlas.png`) | Soft-bevel face textures |
| `ghost_piece.png` | Transparent ghost |
| `fx_clear_row.webp` or frame strip | Line clear |
| `fx_tetris.webp` | Big clear celebration |
| `mockup_playfield.webp` | |
| Update `content/mockups/minigame_blocks.svg` | Hi-fi |

---

## Out of scope this visual pass

| Item | Where it lives later |
| --- | --- |
| Wave audio beds, Loop/Echo video files | `08` + APIs / local packs |
| SFX `.ogg` | `09` asset tables — separate audio pass |
| Pulse ~100 text templates | `content/pulse/*.json` mid-dev |
| Vite scaffold / React Start Page | After owner approves Phases A–E |

Placeholder **stills** for Loop/Wave/Echo are optional in Phase C to make mockups believable; do not invent copyrighted media.

---

## Directory tree (create as you go)

```
content/
├── brand/
│   └── title-dopamine.webp
├── ui/
│   ├── os_window_frame.svg
│   ├── os_window_frame_active.svg
│   ├── crt_overlay_preview.webp
│   ├── stage_grid_bloom_preview.webp
│   ├── play_button.svg
│   ├── play_again_button.svg
│   ├── accessibility_toggle.svg
│   ├── credits_link.svg
│   ├── dopamine_bar_*.webp
│   ├── stickers/
│   ├── overlays/
│   └── windows/
│       ├── loop/
│       ├── pulse/
│       ├── wave/
│       ├── echo/
│       └── alerts/
├── icons/                    ← replace starters
├── mockups/                  ← hi-fi replace + missing targets
├── minigames/
│   ├── _shared/
│   ├── lane_defender/
│   ├── endless_runner/
│   └── block_cascade/
├── loop/placeholders/        ← optional stills
├── …
```

---

## Acceptance checklist (owner sign-off)

- [ ] Phase A: Start, Credits, Splash, Game Over hi-fi mockups match visual lock
- [ ] Phase B: Desktop + mobile Playing layouts; Dopamine bar; stickers; Burnout/Recovery
- [ ] Phase C: Solo chrome for Loop, Pulse, Wave, Echo, Alerts — no real-platform clones
- [ ] Phase D: All six icons replaced
- [ ] Phase E: Lane Defender, Endless Runner, Block Cascade sprite sets + playfield mockups
- [ ] “3D” props are bevelled soft shapes / cutouts — no raw 3D engine assets required
- [ ] Files land on paths in this doc; `DESIGN.md` updated if Pulse/Wave hexes were locked
- [ ] No app scaffold committed

---

## Suggested Opus takeover message

```
Take over Dopamine visual assets from @HANDOFF.md and @defs/14_visual_assets.md.
Also read @PRODUCT.md @DESIGN.md @CONTEXT.md @defs/_PINS.md @defs/09_game_feel.md @defs/07_layout.md.

You are Claude Opus producing hi-fi graphics for every hub view and every in-game window + minigame sprites.
Follow the phase order A→E in 14_visual_assets.md. Drop files at the exact paths listed.
Use the locked GitHub-dark + violet bloom stage; Start Page matches .impeccable/mocks/start-comp-a-centered.
Mid-fi SVGs in content/mockups/ are references to replace. No real-platform UI clones.
“3D” = bevelled toony props + cardboard cutouts for Canvas 2D — not Blender/glTF.
Do NOT scaffold the game or write feature code. Pause after Phase A for my approval unless I say continue.
```
