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
| Mid-fi placeholders | `content/` (being replaced by hi-fi on PR #8) |
| Pulse text library (~123 posts + users/trends/seeds) | `content/pulse/` — merged [#9](https://github.com/Grupo-Kiss/Dopamine/pull/9) |
| Alerts hand templates (66 lines) | `content/alerts/templates.json` — merged [#10](https://github.com/Grupo-Kiss/Dopamine/pull/10) |
| SFX / short-audio brief + missing-cue manifest | `defs/15_sfx_audio.md`, `content/sfx/` — owner decisions locked; **produce `.ogg` after #8** |

### In progress — do not collide

| Work | Branch / PR | Owner | Touch only |
| --- | --- | --- | --- |
| **Hi-fi visual assets** Phases A→E | [`cursor/visual-assets-hifi-e117`](https://github.com/Grupo-Kiss/Dopamine/tree/cursor/visual-assets-hifi-e117) · [#8](https://github.com/Grupo-Kiss/Dopamine/pull/8) (draft) | Claude Opus 5 | Paths listed in `defs/14_visual_assets.md` |

**PR #8 progress (as of last commits on that branch):**

| Phase | State |
| ---: | --- |
| A — Hub + shared OS chrome / brand | Done (owner approved) |
| B — Playing layouts, Dopamine bar, stickers, Burnout/Recovery | Partial (B3–B5 + `desktop_layout.svg` landed; **no `mobile_layout` yet**) |
| C — Window chrome kits + solo mockups; Pulse/Wave hex lock | Done on branch |
| D — Icons | Done on branch |
| E — Minigame sprites / bevelled props | **In progress / incomplete** — finish here |

**Hard rules for #8:** visual files only — no Vite scaffold, no feature code. Pause was after Phase A (already cleared). “3D” = bevelled Canvas 2D cutouts, not Blender.

**Do not edit while #8 is open** (merge conflicts):

- `content/ui/**`
- `content/mockups/**`
- `content/icons/**`
- `content/brand/**`
- `content/minigames/**` (art/sprites/textures)
- `DESIGN.md` / `.impeccable/**` (hex lock / visual lock lives with the art pass)

### Next (safe parallel — pick one, new `cursor/…` branch off `develop`)

These do **not** overlap PR #8:

1. **Credits data model** — typed credits-store shape + OSS/font inventory from `defs/13` (data only, no modal mockup).
2. **Media drop-zone scaffolding** — empty dirs + real `manifest.json` schemas: `content/loop/clips/`, `wave/high|boring/`, `echo/audio|video/` (`defs/08`). No copyrighted media.
3. **Balance pass** — tighten provisional constants in `defs/06_balance.md` only.
4. **SFX file production** — after #8; generative local `.ogg` (no stream API) or Freesound/CC0 per `defs/15_sfx_audio.md` owner decisions.
5. **Wave music pack** (related, not SFX) — local techno beds in `wave/high/` + slower `wave/boring/`; per-item licenses (`08`).

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
| Credits / legal | `defs/13_credits_and_legal.md` |
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
Continue Dopamine hi-fi from @HANDOFF.md and @defs/14_visual_assets.md on branch cursor/visual-assets-hifi-e117 / PR #8.
Also read @PRODUCT.md @DESIGN.md @CONTEXT.md @defs/09_game_feel.md @defs/07_layout.md.

Phases A, C, D are done on that branch; finish remaining Phase B (esp. mobile Playing layout if missing) then Phase E minigame sprites.
Drop files at the exact paths in 14. No real-platform UI clones. “3D” = bevelled Canvas 2D cutouts — not Blender.
Do NOT scaffold the game or write feature code.
```

### Start a safe parallel content/docs task

```
Read @HANDOFF.md Status board. Branch off develop. Do not touch paths reserved by PR #8.
Pick the next safe-parallel item listed in HANDOFF (or the owner’s choice) and ship a focused PR.
Update HANDOFF Status board when done.
```
