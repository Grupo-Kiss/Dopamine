# HANDOFF — Dopamine (agent entrypoint)

**Read this first** on any new agent session. Keep it short and current when you finish work.

| | |
| --- | --- |
| Repo | `Grupo-Kiss/Dopamine` |
| Canonical branch | `develop` |
| Owner pins (do not restructure) | `defs/_PINS.md` |
| Glossary | `CONTEXT.md` |
| Specs | `defs/00` … `defs/15` |
| Visual lock | `PRODUCT.md`, `DESIGN.md`, `.impeccable/` |
| Process ADR | `docs/adr/0001-tdd-after-docs.md` — docs first, then TDD |

---

## Product (30 seconds)

Frontend-only web arcade satire of the attention economy. A **Match** runs until **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop masonry: Minigame \| Loop-over-Wave + Pulse\|Echo + vertical Dopamine bar. Mobile: Minigame + 2 random service windows. Focus Chain, combo stickers, Burnout→Recovery. Wave: **Discovery ≠ Anticipation**. Three minigames ship; one random per Match. Credits = scrollable modal. Stack (when coding): Vite + TS + React + Canvas 2D + Web Audio (`defs/10`).

```
Boot → Start Page → Loading → Playing ⇄ Burnout → Recovery
  → Game Over → PLAY AGAIN → Loading → Playing
              → hub → Start Page
```

---

## Status board (update when you land work)

### Done (on `develop`)

| Item | Where |
| --- | --- |
| Specs `00`–`14` + design lock | `defs/`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/` |
| Hi-fi visual assets — Phases A, B3–B5, C, D, E | `content/` — merged [#8](https://github.com/Grupo-Kiss/Dopamine/pull/8) |
| Art generators (`tools/artgen/`) | merged [#14](https://github.com/Grupo-Kiss/Dopamine/pull/14) into `develop` |
| Pulse text library (~123 posts + users/trends/seeds) | `content/pulse/` — merged [#9](https://github.com/Grupo-Kiss/Dopamine/pull/9) |
| Alerts hand templates (66 lines) | `content/alerts/templates.json` — merged [#10](https://github.com/Grupo-Kiss/Dopamine/pull/10) |
| SFX / short-audio brief + missing-cue manifest | `defs/15_sfx_audio.md`, `content/sfx/` — owner decisions locked; **produce `.ogg` after #8** — merged [#12](https://github.com/Grupo-Kiss/Dopamine/pull/12) |
| Credits store + schema (fonts seeded) | `content/credits/` |
| Media drop zones (empty manifests) | `loop/clips/`, `wave/high\|boring/`, `echo/audio\|video/` + `manifest.json` |

### In progress — do not collide

| Work | Branch / PR | Owner | Touch only |
| --- | --- | --- | --- |
| **B1/B2 Playing layout comps** (+ cast simplify, neon letterbox, font lock) | [`cursor/b1-b2-layout-comps-cf4f`](https://github.com/Grupo-Kiss/Dopamine/tree/cursor/b1-b2-layout-comps-cf4f) · [#15](https://github.com/Grupo-Kiss/Dopamine/pull/15) (draft) | Claude Opus 5 | `content/mockups/{desktop,mobile}_layout.*`, `content/minigames/**`, `tools/artgen/**` |

**Visual pass status:**

| Phase | State |
| ---: | --- |
| A — Hub + shared OS chrome / brand | Done (owner approved) |
| B — Playing layouts, Dopamine bar, stickers, Burnout/Recovery | B3–B5 merged (#8); **B1 desktop + B2 mobile comps on `cursor/b1-b2-layout-comps-cf4f`** |
| C — Window chrome kits + solo mockups; Pulse/Wave hex lock | Merged (#8) |
| D — Icons | Merged (#8) |
| E — Minigame sprites / bevelled props | Merged (#8) |

**Hard rules for the visual pass:** visual files only — no Vite scaffold, no feature code. “3D” = bevelled Canvas 2D cutouts, not Blender. Regenerate Phase E with `npm run minigames` and B1/B2 with `npm run layouts` in `tools/artgen/` rather than hand-editing their outputs.

**Do not edit while the visual pass awaits sign-off** (merge conflicts):

- `content/ui/**`
- `content/mockups/**`
- `content/icons/**`
- `content/brand/**`
- `content/minigames/**` (art/sprites/textures)
- `DESIGN.md` / `.impeccable/**` (hex lock / visual lock lives with the art pass)

### Next (safe parallel — pick one, new `cursor/…` branch off `develop`)

These do **not** overlap the visual pass:

1. **Balance pass** — tighten provisional constants in `defs/06_balance.md` only.
2. **SFX file production** — generative local `.ogg` (no stream API) or Freesound/CC0 per `defs/15_sfx_audio.md`.
3. **Wave / Loop / Echo media files** — drop licensed local files into the empty dirs; update manifests + `content/credits/store.json`.
4. **OSS library credit rows** — append `kind: "library"` when Vite deps exist (after scaffold).

### Blocked until owner accepts visuals

Do **not** start until `defs/14_visual_assets.md` acceptance checklist is signed and hi-fi is on `develop`:

1. Scaffold Vite + TS + React + Vitest + pnpm (`defs/10`) — fresh; do not revive closed PR #5 app tree wholesale
2. TDD: state machine → Dopamine → Focus Chain → layout shell (`defs/11`, `12`)

---

## Doc map (what to open for what)

| Need | Open |
| --- | --- |
| Domain language | `CONTEXT.md` |
| Owner’s personal later-thoughts | `defs/_PINS.md` (**owner-owned** — agents may check off facts they completed, not rewrite the file’s role) |
| Visual production checklist + exact paths | `defs/14_visual_assets.md` |
| SFX / short-audio cue sheet | `defs/15_sfx_audio.md` + `content/sfx/manifest.json` |
| Layout slots | `defs/07_layout.md` |
| Window / minigame behaviour | `defs/03`, `defs/04` |
| Feel / SFX path lists | `defs/09_game_feel.md` |
| Content / manifests / APIs | `defs/08_content.md` |
| Credits / legal data | `defs/13_credits_and_legal.md` + `content/credits/store.json` |
| Tech stack | `defs/10_tech.md` |
| Testing / coding rules | `defs/11`, `defs/12` |

---

## Agent operating rules

1. Branch from latest `origin/develop`: `cursor/<short-name>-dc00` (lowercase).
2. One concern per PR. Prefer draft until ready; say what’s in/out of scope in the PR body.
3. Before editing `content/`, check open PRs — especially **#8** — so you don’t overlay.
4. Never invent real-platform brands/UI clones. Never commit secrets. Never subtract Dopamine as a direct penalty.
5. When you finish a slice: update **this file’s Status board**, commit, push, open/update the PR.
6. GitHub Issues are the formal tracker (`docs/agents/issue-tracker.md`) but may be empty — **this handoff is the live status SSOT for agents**.

---

## Paste snippets

### Resume visual assets (Opus)

```
Continue Dopamine visual assets from @HANDOFF.md and @defs/14_visual_assets.md.
Also read @PRODUCT.md @DESIGN.md @CONTEXT.md @defs/_PINS.md @defs/09_game_feel.md @defs/07_layout.md.

All phases A–E have shipped; apply owner review notes. Regenerate through tools/artgen/ (npm run minigames / layouts)
rather than hand-editing generated files. Drop files at the exact paths in 14. No real-platform UI clones.
“3D” = bevelled Canvas 2D cutouts — not Blender. Do NOT scaffold the game or write feature code.
```

### Start a safe parallel content/docs task

```
Read @HANDOFF.md Status board. Branch off develop. Do not touch paths reserved by PR #8.
Pick the next safe-parallel item listed in HANDOFF (or the owner’s choice) and ship a focused PR.
Update HANDOFF Status board when done.
```
