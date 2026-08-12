---
name: Dopamine
description: Dark GitHub-shell arcade stage with violet collision blooms and punchy PLAY hierarchy
colors:
  stage: "#0d1117"
  panel: "#161b22"
  panel-edge: "#30363d"
  text: "#c9d1d9"
  text-dim: "#6e7681"
  violet: "#6e40c9"
  violet-hot: "#a371f7"
  play: "#ff4d1a"
  play-hot: "#ff8c00"
typography:
  ui:
    fontFamily: "Public Sans, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  display-play:
    fontFamily: "Teko, Arial Narrow, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.6rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.12em"
  label-dim:
    fontFamily: "Public Sans, Segoe UI, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  window: "14px"
  control: "10px"
  chip: "8px"
spacing:
  stage-pad: "clamp(1.5rem, 4vw, 3rem)"
  window-body: "clamp(1.75rem, 4vw, 2.75rem)"
  corner: "1.1rem 1.35rem"
components:
  play-button:
    backgroundColor: "{colors.play}"
    textColor: "#f5f0ea"
    typography: "{typography.display-play}"
    rounded: "{rounded.control}"
    padding: "4px"
    width: "min(100%, 280px)"
    height: "auto"
  os-window:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text}"
    rounded: "{rounded.window}"
    padding: "0"
    width: "min(520px, 92vw)"
---

## Overview

Dopamine’s shell is a **GitHub-dark stage** with **violet/magenta collision blooms** and a **subtle CRT overlay**. Content lives in **OS-window chrome**. Arcade punch (title wordmark + PLAY) sits on top of calm dark panels. Start Page establishes the world: sparse, CTA-first, centered window.

## Colors

- **Stage** `#0d1117` is the full-bleed ground.
- **Violet** blooms (`#6e40c9` → `#a371f7`) are atmospheric only — never track-line diagrams.
- **Play** orange/red (`#ff8c00` → `#ff4d1a`) is reserved for primary action and title heat.
- **Dim text** `#6e7681` is for corner secondary controls only.

## Typography

- **UI:** Public Sans for chrome, credits, labels.
- **PLAY:** Teko condensed for the CTA face.
- **Title:** raster wordmark (`public/brand/title-dopamine.webp`); alt text comes from `GAME_TITLE` in `src/config/tunables.ts`. Replace the raster when renaming.

## Layout

- Start Page: single centered OS window; Accessibility bottom-left; Credits bottom-right.
- Stage effects (blooms, rings, CRT) are full-bleed and non-interactive.
- Mobile keeps the same topology; window width fluid to ~420px.

## Elevation & Depth

- Window: soft deep shadow + faint violet outer glow.
- PLAY: metallic frame + inset face glow.
- CRT: light vignette + fine scanlines over the whole stage (`soft-light`).

## Shapes

- Windows ~14px radius; controls ~10px; chips ~8px.
- Traffic-light dots are circular OS affordances, decorative (non-functional on Start Page).

## Components

- **OS window:** chrome bar + traffic lights + body.
- **PLAY button:** beveled frame wrapping a scanlined orange face.
- **Accessibility switch:** low-contrast corner control; persists to `localStorage`.
- **Credits modal:** dialog over dimmed backdrop; Esc/Close dismisses.

## Do's and Don'ts

- Do keep secondary UI quiet in corners; let title + PLAY dominate.
- Do keep CRT subtle; do not rebuild heavy tube nostalgia.
- Do keep concentric blooms as glow rings only — **no connecting track lines**.
- Don’t ship corporate marketing sections, feature cards, or info-dense Start Page copy.
- Don’t introduce a light theme via Accessibility Mode (motion only).
- Don’t put real-platform logos in window skins.
