# Game Feel Specification

## Purpose

This document defines **how the game looks, sounds, and feedbacks** — arcade juice, HUD stickers, window chrome vs minigame spectacle, audio mix priority, splash, and the art direction + asset inventory for each minigame.

Gameplay rules: `02`–`05`. Layout: `07`. Content sources: `08`. Numbers: `06`.

---

## Dual Visual Worlds

| Surface | Look | Density |
| --- | --- | --- |
| **Desktop / window UI** (Loop, Pulse, Wave, Echo, Alerts, layout chrome) | Minimal, simple, clean caricaturesque “computer screen” | Low — readable first |
| **Arcade feedback** (combos, Focus Chain, score stickers, Burnout telegraph) | Classic arcade pop — bold type, short-lived stickers | Medium — only when events fire |
| **Minigames** | Fun, toony, caricaturesque; Supercell-adjacent (Lane Defender / Endless Runner) or modern-classic Tetris (Block Cascade) | High inside the minigame slot only |

Do not paint window chrome with minigame spectacle. Do not make the Dopamine bar or layout gutters noisy.

---

## Global UI Chrome (clean / minimal)

- Thin window frames, clear Active Window highlight, soft Focus Ready shimmer (discovered, not labeled).
- **Dopamine:** persistent vertical edge bar only (see `07`).
- **No permanent score/combo/chain HUD strip** — those are stickers.
- Icons: `content/icons/*.svg` (gradient tiles, generic marks).
- Motion on UI: small (pulse, shimmer, slide-in stickers). No constant screen shake outside minigame / major arcade events.

---

## Arcade Feedback Stickers

All of these are ephemeral overlays. They appear, celebrate, then clear.

### Combo / Multiplier

- Shows over the **Active Window** as `x2`, `x3`, … `x7!!` style marks.
- Early hits in a fresh window: juicy (scale punch, bright color, strong SFX).
- As **diminishing returns** apply for staying in the same window: the sticker stays correct numerically but **looks and sounds flatter** (less scale, duller color, quieter / thinner SFX) — “boring reward” telegraph.
- Switching windows restores juice on the next combo sequence.

### Focus Chain

- Old-arcade message stickers (`CHAIN 5`, `NICE SWITCH`, completion cash-out burst).
- Stronger than combo stickers; may briefly use screen flash / light shake at high chain tiers (see visual progression in `02`).
- Distinct language from combo so players learn both systems.

### Score / Dopamine ticks

- Tiny floating `+N` near the action; Dopamine bar fills react smoothly.
- Prefer quiet ticks for routine actions; bigger pops for Attention Requests / bosses / chain completion.

### Burnout Telegraph

- Sticker + optional edge glow when APM ≥ `threshold × BURNOUT_TELEGRAPH_APM_RATIO`.
- Readable enough to choose: ease off or push in.
- Not a permanent meter chrome (APM itself is not a full-time HUD).

### Burnout / Recovery

- Burnout: denser particles, stronger reward pops, hotter color grade inside windows/minigame — still controllable.
- Recovery: cooler, quieter, drained feel; stickers less celebratory.

### Game Over

- Hard cut to silence (see Audio).
- Final frame holds; then stats + demanding PLAY AGAIN (grows/pulses if ignored).

---

## Splash

- Short branded splash during `Loading` starter-pack preload (`08`).
- Light motion only; must not feel like an installer.
- May show window icons + Dopamine mark from `content/icons/`.

---

## Window Surface Feel (non-minigame)

| Window | Feel notes |
| --- | --- |
| Loop | Vertical video stage; instant like/repost pops; Attention Requests dominate without covering the whole clip |
| Pulse | Clean text feed; exaggerated engagement numbers on viral events; ads/spam visually “cheap” |
| Wave | Compact player; waveform/abstract art; boring tracks can look visually flatter too |
| Echo | Video → long-form player chrome (fictional, not YouTube). Audio → Wave-like chrome |
| Alerts | OS-like cards; priority drives size/urgency; spam looks dismissible and dull |

---

## Audio Mix Priority

From highest to lowest ducking priority:

1. Critical Alerts / Burnout telegraph / Game Over sting  
2. Focus Chain / big arcade rewards  
3. Combo SFX (subject to boredom curve)  
4. Minigame action SFX  
5. Wave music bed  
6. Echo playback  
7. Ambient UI loops  

Rules:

- Mix gets **denser** as the Match and difficulty rise (`05`).
- **Silence only after Game Over** — then it should feel uncomfortable.
- Wave never becomes painful in Burnout; intensify without clipping into noise torture.
- Detailed bus levels tuned in implementation; this doc owns priority order.

---

## Minigame Art Direction

All minigame art is **first-party produced** for this project (no ripped commercial packs). Drop zones: `content/minigames/<id>/` (see Asset Inventory). Starter placeholders may ship as SVG/PNG for review and be replaced.

Shared rules for Lane Defender + Endless Runner:

- **Supercell-like** readability: chunky silhouettes, saturated colors, friendly-toony menace — think Clash family energy, **not** photoreal, **not** Doom texture cloning.
- Characters/enemies: **2D sprites as cardboard cutouts** billboarded in a simple 3D lane space (Doom-like *technique*, different aesthetic).
- Mild idle/animation on cutouts (sway, frame swap) — paper/cardboard feel welcome.
- Hazards / props: **basic 3D primitives** (boxes, cylinders, cones) with flat toony materials — no complex PBR texturing.
- Camera: fixed; playfield always readable with many entities.

### Lane Defender

| Element | Direction |
| --- | --- |
| Player | Toony **soldier** cutout at bottom of three lanes |
| Enemies | Toony **monsters** cutouts advancing down lanes |
| Boss | Larger cutout / multi-lane presence; big readable tell |
| Hazards | Basic 3D shapes + numeric counters (Mine, Barrier, etc.) |
| Pickups | Bright simple 3D or cutout icons (shield, rapid fire, …) |
| FX | Small hits for fodder; big arcade bursts only for boss/rare |

### Endless Runner

Same world language as Lane Defender (soldier / obstacles / toony props).

| Element | Direction |
| --- | --- |
| Player | Soldier cutout running in place / lane hops |
| Obstacles | Mix of cutout blockers + basic 3D shapes; gaps readable |
| Collectibles | Bright, simple; rare ones get sticker-level juice |
| Motion | World scrolls toward player; keep silhouette clarity at speed |

### Block Cascade

| Element | Direction |
| --- | --- |
| Reference feel | Modern-classic mobile Tetris — clean board, satisfying clears (PLAYSTUDIOS Tetris energy: polished, contemporary, still instantly Tetris) |
| Pieces | Seven tetrominoes; crisp colors; soft bevel or clean flat — not muddy |
| Board | High contrast grid; ghost piece subtle |
| Clears | Minimal FX on single; escalating arcade celebration on multi / four-line |
| No | Skeuo plastic overload or dark “realistic blocks” |

---

## Asset Inventory (produce all)

Paths are authoring drop zones. Replace starters after review.

### `content/minigames/lane_defender/`

| Asset | Notes |
| --- | --- |
| `player_soldier.svg` (+ optional anim frames) | Cardboard cutout |
| `enemy_normal.svg` | Monster cutout |
| `enemy_boss.svg` | Larger monster |
| `hazard_mine.*` / `hazard_barrier.*` | Basic 3D or simple mesh refs + icons |
| `pickup_*.svg` | One per pickup type in `04` |
| `bg_lanes.*` | Simple ground / sky / lane marks |
| `sfx_hit`, `sfx_destroy`, `sfx_boss_warn`, `sfx_boss_down`, `sfx_pickup` | Short arcade WAV/OGG |

### `content/minigames/endless_runner/`

| Asset | Notes |
| --- | --- |
| `player_soldier.svg` | Can share style with Lane Defender; may reuse with tint |
| `obstacle_*.svg` / basic mesh | Static, moving, gap markers |
| `collectible_*.svg` | Coin, shield, magnet, rare |
| `bg_scroll.*` | Looping ground / horizon |
| `sfx_lane`, `sfx_collect`, `sfx_crash`, `sfx_rare` | |

### `content/minigames/block_cascade/`

| Asset | Notes |
| --- | --- |
| `skin_blocks.json` + textures/colors | Seven piece colors / optional soft atlases |
| `board_frame.svg` | Clean modern frame |
| `sfx_place`, `sfx_rotate`, `sfx_clear`, `sfx_tetris`, `sfx_reset` | |

### Shared arcade stickers (`content/minigames/_shared/` or UI pack)

| Asset | Notes |
| --- | --- |
| Combo type styles | Juicy vs bored variants |
| Focus Chain banner frames | |
| Burnout telegraph mark | |
| Floating `+N` glyph set | |

Audio files follow `08` license rules; prefer owned/CC0.

---

## Motion Budget (intentional)

Ship at least:

1. Sticker spawn (combo / chain / telegraph)  
2. Dopamine bar reactive fill  
3. Active Window focus treat + Focus Ready shimmer  
4. Minigame hit/clear feedback scaled by importance  
5. Game Over silence + PLAY AGAIN demand motion  

Avoid constant non-stop shake or particle fog on the desktop chrome.

---

## Acceptance Criteria

- Window UI stays clean; arcade juice is sticker-based and event-driven.
- Combo boredom curve is visible/audible under diminishing returns.
- Burnout telegraph is readable before threshold cross.
- Lane Defender / Endless Runner read as toony cardboard cutouts in simple 3D space with primitive hazards.
- Block Cascade reads as modern-classic Tetris, not a clone of a branded skin.
- Asset drop zones exist; all listed minigame assets are produced in-project (starters OK pending review).
- Audio priority order is respected; silence only at Game Over.
