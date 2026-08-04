# Layout Specification

## Purpose

This document defines visual arrangement only: how gameplay windows are placed on Desktop and Mobile, spacing, size priorities, and Match-to-Match layout variation.

Gameplay rules live in `02`–`05`. Numbers that are not spatial (rewards, timers) live in `06_balance.md`.

---

## Global Layout Rules

- The playfield fills the browser viewport (minus any thin chrome for HUD / Dopamine meter if present).
- Permanent windows never overlap each other.
- **Alerts** are not permanent slots; they float above the layout and must not participate in masonry packing.
- A small **gutter** (margin) separates every pair of adjacent windows so the layout can breathe. Attention should not be hurt by cramped packing.
- Window chrome is caricaturesque and simple; the minigame playfield may use denser arcade spectacle inside its slot (`CONTEXT.md` / `09_game_feel.md`).
- Layout does not pause gameplay. Resizing the browser reflows slots but does not reset Match state.

### Gutter

| Constant | Starter | Notes |
| --- | ---: | --- |
| `LAYOUT_GUTTER_PX` | `8` | Breathing space between windows. **Tune** in feel pass if needed |
| `LAYOUT_OUTER_INSET_PX` | `8` | Inset from viewport edges |

---

## Size Priorities

| Priority | Window | Role |
| ---: | --- | --- |
| 1 (largest) | **Minigame** | Primary arcade surface; dominant column in the top band |
| 2 | **Loop** | Tall short-video panel stacked above Wave |
| 3 | **Pulse** | Medium feed / text (bottom band) |
| 3 | **Echo** | Medium long-form player (bottom band; same band as Pulse) |
| 4 (smallest) | **Wave** | Compact music player stacked under Loop |

On Mobile, the two randomly selected service windows keep these relative priorities among themselves; Minigame remains largest.

---

## Match Layout Variation

At Match start:

1. Choose the Minigame (existing rule).
2. **Desktop structural pairs stay fixed:**
   - Top band: Minigame column beside a **Loop-over-Wave** stack.
   - Bottom band: **Pulse** and **Echo** side by side.
3. Allowed shuffle (variation without breaking size intent):
   - Minigame column on the **left or right** of the top band.
   - Pulse / Echo swap left/right in the bottom band.
4. Loop always sits above Wave in their shared column. Wave never becomes a full-width strip under the Minigame.

Desktop always shows all four service windows. Mobile picks **two** of {Loop, Pulse, Wave, Echo} at random, then stacks them with the Minigame under the same size priorities (if both Loop and Wave are selected, keep Loop above Wave).

---

## Desktop Layout

### Rules

- Five permanent windows: Minigame + Loop + Pulse + Wave + Echo.
- **Masonry packing:** different heights/widths; tile with **no leftover gaps** (gutters only).
- **Top band (fills content width):**
  - One column = **Minigame**.
  - Other column = **Loop** (taller) stacked over **Wave** (shorter).
  - **Loop height + gutter + Wave height = Minigame height.**
  - Minigame column width + Loop/Wave column width = full content width (plus gutters).
- **Bottom band (fills remaining height and full width):**
  - **Pulse** and **Echo** side by side (equal weight unless tuned later).
- Prefer this stable region map over free-form reflow every frame.

### ASCII — canonical desktop (Minigame left)

```
+----------------------------------------------------------------+----+
|  +---------------------------+ g +---------------------------+ | D  |
|  |                           | u |           LOOP            | | O  |
|  |                           | t |        (taller)           | | P  |
|  |        MINIGAME           | t +---------------------------+ | A  |
|  |                           | e |           WAVE            | | M  |
|  |                           | r |        (smaller)          | | I  |
|  +---------------------------+   +---------------------------+ | N  |
|  +---------------------------+ g +---------------------------+ | E  |
|  |          PULSE            | u |           ECHO            | |    |
|  +---------------------------+ t +---------------------------+ | || |
|                                                                | \/ |
|  [ Alerts + stickers (combo xN / chain / score) float above ]  |bar |
+----------------------------------------------------------------+----+
  Minigame height == Loop + gutter + Wave
  Masonry width + Dopamine bar = viewport (minus outer inset)
```

### ASCII — shuffled desktop (Minigame right, Pulse/Echo swapped)

```
+----------------------------------------------------------------+----+
|  +---------------------------+ g +---------------------------+ | D  |
|  |           LOOP            | u |                           | | O  |
|  +---------------------------+ t |        MINIGAME           | | P  |
|  |           WAVE            | t |                           | | A  |
|  +---------------------------+ e +---------------------------+ | M  |
|  +---------------------------+ r +---------------------------+ | I  |
|  |           ECHO            |   |          PULSE            | | N  |
|  +---------------------------+   +---------------------------+ | E  |
+----------------------------------------------------------------+----+
```

Starter width hint (tunable): of the masonry content area (excluding Dopamine bar), Minigame ≈ `60%`; Loop/Wave column ≈ `40%`. Loop ≈ `70%` of the top-band column height; Wave ≈ `30%` (after gutter).

Gutters (`LAYOUT_GUTTER_PX`) sit between every adjacent edge. Masonry must close the rectangle: no orphan empty panels.

### Desktop HUD

**Dopamine meter** is a persistent **vertical bar** on the screen edge (default: **right**). It is reserved chrome outside the masonry content rectangle — the Minigame | Loop/Wave + Pulse | Echo pack fills the remaining width beside it.

All other HUD readouts are **event stickers**, not a permanent top band:

- Score ticks, Focus Chain steps / completion, Burnout telegraph, Recovery cues, and similar feedback appear as short-lived overlay stickers when they happen, then clear.
- They must not permanently occupy layout slots or resize masonry.

**Combo / Multiplier** stickers (e.g. `x2`, `x7!!`) appear over the **Active Window**, not in a global chrome strip. Presentation must also reflect diminishing returns for staying in one window — early hits feel juicy; repeated same-window hits look and feel progressively flatter / more boring while still readable. Full motion/audio language belongs in `09_game_feel.md`.

Starter inset: masonry content width = viewport − `LAYOUT_OUTER_INSET_PX` − Dopamine bar width − gutters.

---

## Mobile Layout

### Rules

- Three permanent windows: Minigame + two randomly selected from {Loop, Pulse, Wave, Echo}.
- Vertical stack or simple split: Minigame still largest (typically top or dominant half).
- The two service windows share the remaining space according to size priority (e.g. if Wave is selected, it gets the smaller of the two service slots).
- Alerts still overlay on top.
- Dopamine remains a persistent edge meter (may sit top or side on narrow viewports as long as it stays continuous and readable); other readouts stay event stickers.
- Touch targets must remain usable; gutters still apply.

### ASCII — example (Minigame + Loop + Wave)

```
+----------------------+
|                      |
|      MINIGAME        |
|      (largest)       |
|                      |
+----------------------+
|                      |
|        Loop          |
|                      |
+----------------------+
|        Wave          |
|      (smallest)      |
+----------------------+
|  [ Alerts overlay ]  |
+----------------------+
```

### ASCII — example (Minigame + Pulse + Echo)

```
+----------------------+
|                      |
|      MINIGAME        |
|                      |
+----------------------+
|        Pulse         |
+----------------------+
|        Echo          |
+----------------------+
```

Exact split ratios are implementation details as long as priority order and gutters hold.

---

## Alerts Overlay

- May appear top-center, top-right, or edge positions depending on viewport.
- Never change masonry slot sizes when they appear or expire.
- Must remain readable without fully blocking the Minigame’s critical playfield for long; presentation polish in `09_game_feel.md`.

---

## Active Window Chrome

The Active Window may receive a stronger border / focus treatment. Inactive windows stay visible and alive. This is chrome only — it does not resize slots.

---

## Acceptance Criteria

- Desktop always shows five permanent windows + overlay Alerts.
- Desktop top band: Minigame beside Loop-over-Wave; Loop+Wave height equals Minigame height; that pair fills masonry width beside the Dopamine bar.
- Desktop Dopamine meter is a persistent vertical edge bar; other HUD feedback is sticker overlays (including Active-Window combo `xN`).
- Desktop bottom band: Pulse and Echo side by side filling remaining space.
- Mobile always shows Minigame + exactly two service windows + overlay Alerts.
- Masonry tiles without internal empty gaps; gutters provide breathing space.
- Minigame is the dominant region; Wave is the smallest panel when present; Loop stays above Wave when both are shown.
- Allowed shuffle: Minigame left/right; Pulse/Echo left/right — not free reassignment of Loop/Wave away from their stacked column.
- Layout reflow never ends the Match or resets Dopamine / Focus Chain / score.
