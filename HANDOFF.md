# Handoff — Dopamine (docs complete → Opus hi-fi assets → TDD)

Use this file + `CONTEXT.md` + `defs/14_visual_assets.md` + `defs/_PINS.md` + `PRODUCT.md` + `DESIGN.md` so a new chat does not need the old thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- **Canonical branch:** `develop`
- Glossary: `CONTEXT.md`
- **Visual asset brief (SSOT for this pass):** `defs/14_visual_assets.md`
- Pins: `defs/_PINS.md`
- Visual lock: `PRODUCT.md`, `DESIGN.md`, `.impeccable/`
- Specs: `defs/00` … `defs/13` + `14_visual_assets.md`
- ADR: `docs/adr/0001-tdd-after-docs.md`
- Content drop zones: `content/`

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. A **Match** runs from Playing until **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop masonry: Minigame | Loop-over-Wave + Pulse|Echo, vertical Dopamine bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain, Combo stickers, Burnout→Recovery. Wave: **Discovery** ≠ **Anticipation**. Three minigames all ship; one random per Match. Credits = scrollable modal. Docs first, then **TDD**. Stack: Vite + TypeScript + React + Canvas 2D + Web Audio (`10`).

## State flow

```
Boot → Start Page → (PLAY) → Loading (splash + starter pack)
  → Playing ⇄ Burnout → Recovery → Playing
  → Game Over → (PLAY AGAIN) → Loading → Playing
              → (hub) → Start Page
```

## Current phase: Opus visual assets

**Status:** Specs `00`–`13` complete. Mid-fi placeholders exist. Design lock salvaged. Owner will **not** hand-draw hi-fi.

**Agent:** Cursor Cloud Agent · **Claude Opus 5** (thinking high/xhigh) · follow `defs/14_visual_assets.md` phases **A→E**.

| Phase | What |
| ---: | --- |
| A | Start Page, Credits Modal, Splash, Game Over + shared OS chrome / brand |
| B | Desktop + mobile Playing layouts, Dopamine bar, stickers, Burnout/Recovery |
| C | Loop / Pulse / Wave / Echo / Alerts window chrome kits + solo mockups |
| D | Replace `content/icons/*` |
| E | Lane Defender, Endless Runner, Block Cascade sprites + bevelled “3D” props |

**Hard rules:** No Vite scaffold / feature code. No real-platform UI clones. “3D” = cardboard cutouts + soft bevelled props for Canvas 2D (not Blender). Pause after Phase A for owner approval unless told to continue.

**Out of scope now:** SFX, music beds, Loop/Echo video files (optional still placeholders only).

## Docs map

| Doc | Role |
| --- | --- |
| `14_visual_assets.md` | **Asset production checklist + paths** |
| `PRODUCT.md` / `DESIGN.md` / `.impeccable/` | Shell visual lock |
| `09` | Feel language / palettes |
| `07` | Layout slots |
| `03` / `04` | Window & minigame behaviour (what chrome must support) |
| `08` | Later media packs |
| `00`–`13` | Rest of handbook |

## After assets approved — coding

1. Scaffold Vite + TS + React + Vitest + pnpm (`10`) — fresh; do not revive closed PR #5 app tree wholesale
2. TDD state machine → Dopamine → Focus Chain → layout shell
3. Follow `11` / `12`

## Paste this to start the Opus session

```
Take over Dopamine visual assets from @HANDOFF.md and @defs/14_visual_assets.md.
Also read @PRODUCT.md @DESIGN.md @CONTEXT.md @defs/_PINS.md @defs/09_game_feel.md @defs/07_layout.md.

You are Claude Opus producing hi-fi graphics for every hub view and every in-game window + minigame sprites.
Follow phases A→E in 14_visual_assets.md. Drop files at the exact paths listed.
Use the locked GitHub-dark + violet bloom stage; Start Page matches .impeccable/mocks/start-comp-a-centered.
Mid-fi SVGs in content/mockups/ are references to replace. No real-platform UI clones.
“3D” = bevelled toony props + cardboard cutouts for Canvas 2D — not Blender/glTF.
Do NOT scaffold the game or write feature code. Pause after Phase A for my approval unless I say continue.
```
