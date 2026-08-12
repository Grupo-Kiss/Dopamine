---
version: 1
slug: "startpage"
primary_target: "StartPage"
related_targets: []
---

# Surface brief: Start Page

## Scope & mode
Start Page hub before PLAY. Visitor mode: Persuade (decide to play immediately).

## Audience / job / action
Casual browser arcade player; smash PLAY with minimal reading; learn by doing.

## Proof / content / constraints
Tunable title (default Dopamine). Required: Accessibility Mode toggle, Credits link → modal (modal can be stub), PLAY. How-to omitted (CTA-first). English UI. Reduced-motion Accessibility Mode (not light theme).

## Direction
Collider Attention Display as inspiration only — concentric bloom energy, no track lines. Centered collision bloom composition approved (`.impeccable/mocks/start-comp-a-centered.webp`). Dark GH shell + violet blooms + subtle CRT; punchy arcade title/PLAY; secondary UI dim in corners; OS window frame.

## Memorable moment
Title + PLAY inside one centered OS window on a quiet bloom field — the Match starts with one action.

## Approved composition inventory
| Ingredient | Medium |
| --- | --- |
| Stage dark + violet/magenta blooms | CSS gradients + blur |
| Concentric rings (no connectors) | SVG circles |
| Subtle CRT vignette/scanlines | CSS overlay |
| OS window chrome + traffic lights | HTML/CSS |
| DOPAMINE 3D wordmark | Raster `public/brand/title-dopamine.webp` (alt from `GAME_TITLE`) |
| PLAY metallic beveled CTA | HTML/CSS |
| Accessibility switch (corners) | HTML/CSS |
| Credits link → modal | HTML/CSS dialog |
| Primary action PLAY | CSS face with scanline treatment (signature) |

## Tunables
`src/config/tunables.ts` — `GAME_TITLE`, whisper, storage keys; balance constants join here later.

## Unresolved
Credits Modal full attribution store; Loading transition; replace title raster when renaming.
