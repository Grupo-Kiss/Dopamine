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
- Window chrome is caricaturesque and simple; the minigame playfield may use denser arcade spectacle inside its slot (`CONTEXT.md` / later `09_game_feel.md`).
- Layout does not pause gameplay. Resizing the browser reflows slots but does not reset Match state.

### Gutter

| Constant | Starter | Notes |
| --- | ---: | --- |
| `LAYOUT_GUTTER_PX` | `8` | Breathing space between windows. **Tune** in feel pass if needed |
| `LAYOUT_OUTER_INSET_PX` | `8` | Inset from viewport edges |

---

## Size Priorities

Relative slot weight for packing (higher = larger area). Used when assigning masonry cells or mobile stack heights.

| Priority | Window | Role |
| ---: | --- | --- |
| 1 (largest) | **Minigame** | Primary arcade surface; always the biggest slot |
| 2 | **Loop** | Tall short-video column |
| 3 | **Pulse** | Medium feed / text |
| 3 | **Echo** | Medium long-form player (same band as Pulse; packer may swap) |
| 4 (smallest) | **Wave** | Compact music player |

On Mobile, the two randomly selected service windows keep these relative priorities among themselves; Minigame remains largest.

---

## Match Layout Variation

At Match start:

1. Choose the Minigame (existing rule).
2. **Shuffle placement order** of the service windows among the non-minigame slots so Matches feel varied.
3. Size priorities still apply — shuffle changes **which region** a window occupies, not its relative size class.
4. Minigame always claims the largest region.

Desktop always shows all four service windows. Mobile picks **two** of {Loop, Pulse, Wave, Echo} at random, then shuffles those two plus the Minigame into the mobile regions under the same size priorities.

---

## Desktop Layout

### Rules

- Five permanent windows: Minigame + Loop + Pulse + Wave + Echo.
- **Masonry packing:** windows may have different heights and widths; they tile the playfield so the composed block has **no leftover gaps** inside the content area (gutters only, not empty cells).
- Prefer a stable region map with weighted areas rather than a chaotic reflow every frame.

### ASCII — example region map (one Match)

Illustrative only; shuffled Matches may swap which service window sits in S1–S4, but weights stay: Minigame largest, Wave smallest.

```
+------------------------------------------------------------------+
|  OUTER INSET                                                     |
|  +---------------------------+  +-------------+  +-------------+ |
|  |                           |  |             |  |             | |
|  |                           |  |     S1      |  |     S2      | |
|  |        MINIGAME           |  |  (e.g. Loop)|  | (e.g. Pulse)| |
|  |        (largest)          |  |             |  |             | |
|  |                           |  +-------------+  +-------------+ |
|  |                           |  +-----------------------------+ |
|  |                           |  |            S3               | |
|  |                           |  |        (e.g. Echo)          | |
|  +---------------------------+  +-----------------------------+ |
|  +------------------------------------------------------------+ |
|  |                     S4  Wave (smallest, wide strip)          | |
|  +------------------------------------------------------------+ |
|                                                                  |
|  [ Alerts float above this grid — not packed into masonry ]      |
+------------------------------------------------------------------+
```

Alternate shuffle example (same weights, different service assignment):

```
+------------------------------------------------------------------+
|  +---------------------------+  +-------------+  +-------------+ |
|  |                           |  |    Pulse    |  |    Echo     | |
|  |        MINIGAME           |  +-------------+  +-------------+ |
|  |                           |  +-----------------------------+ |
|  |                           |  |           Loop                | |
|  +---------------------------+  +-----------------------------+ |
|  +------------------------------------------------------------+ |
|  |                         Wave                                 | |
|  +------------------------------------------------------------+ |
+------------------------------------------------------------------+
```

Gutters (`LAYOUT_GUTTER_PX`) sit between every adjacent edge. Masonry must close the rectangle: no orphan empty panels at the bottom or side.

### Desktop HUD

Dopamine meter, score, Focus Chain readout, and Burnout telegraph occupy a thin reserved band (top or edge) that is **outside** the masonry content rectangle, so packing math stays simple.

---

## Mobile Layout

### Rules

- Three permanent windows: Minigame + two randomly selected from {Loop, Pulse, Wave, Echo}.
- Vertical stack or simple split: Minigame still largest (typically top or dominant half).
- The two service windows share the remaining space according to size priority (e.g. if Wave is selected, it gets the smaller of the two service slots).
- Alerts still overlay on top.
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
- Mobile always shows Minigame + exactly two service windows + overlay Alerts.
- Masonry (desktop) tiles without internal empty gaps; gutters provide breathing space.
- Minigame is always the largest region; Wave is the smallest when present.
- Service window **positions** can shuffle each Match; size priority classes do not.
- Layout reflow never ends the Match or resets Dopamine / Focus Chain / score.
