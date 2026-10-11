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
| Issues | GitHub Issues (`docs/agents/issue-tracker.md`) |

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
| Specs `00`–`15` + design lock | `defs/`, `PRODUCT.md`, `DESIGN.md`, `.impeccable/` |
| Hi-fi visual assets A→E incl. B1/B2 | `content/` — [#8](https://github.com/Grupo-Kiss/Dopamine/pull/8), [#14](https://github.com/Grupo-Kiss/Dopamine/pull/14), [#15](https://github.com/Grupo-Kiss/Dopamine/pull/15) |
| Art generators | `tools/artgen/` (`npm run minigames` / `layouts` / `verify`) |
| Pulse text library | `content/pulse/` — [#9](https://github.com/Grupo-Kiss/Dopamine/pull/9) |
| Alerts hand templates | `content/alerts/templates.json` — [#10](https://github.com/Grupo-Kiss/Dopamine/pull/10) |
| SFX brief + missing-cue manifest | `defs/15_sfx_audio.md`, `content/sfx/` — [#12](https://github.com/Grupo-Kiss/Dopamine/pull/12) (**`.ogg` files not produced yet**) |
| Credits store + schema (fonts seeded) | `content/credits/` |
| Media drop zones (empty manifests) | `loop/clips/`, `wave/high\|boring/`, `echo/audio\|video/` |

### In progress — do not collide

| Work | Branch / PR | Owner | Touch only |
| --- | --- | --- | --- |
| — | — | — | — |

### Next (pick in order)

Owner wants **epics → TDD tasks → MVP** before a big scaffold dump (`_PINS.md`).

1. **Epic / task board (do this next)** — GitHub Issues: epics for MVP vertical slices, ordered TDD tasks under each (state machine → Dopamine → Focus Chain → layout shell → windows → one minigame → …). Use `docs/agents/issue-tracker.md`. No feature code in this step.
2. **Scaffold + first failing tests** — only after the board exists: Vite + TS + React + Vitest + pnpm (`defs/10`), then TDD the first epic task (`defs/11`, `12`). Fresh; do not revive closed PR #5 wholesale.
3. **Safe parallel content** (can run beside 1–2 if paths don’t collide):
   - SFX `.ogg` production (`defs/15`)
   - Wave / Loop / Echo media into empty drop zones + credits rows
   - Balance pass on `defs/06_balance.md` only

### Hard rules going forward

- **Minigame runtime is asset-agnostic** — load via manifests/stable ids; a later version will re-style sprites (`_PINS.md`).
- Never invent real-platform brands/UI clones. Never commit secrets. Never subtract Dopamine as a direct penalty.
- “3D” = bevelled Canvas 2D cutouts, not Blender.

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

1. Branch from latest `origin/develop`: `cursor/<short-name>-dc00` (lowercase) — or the suffix the cloud run assigns.
2. One concern per PR. Prefer draft until ready; say what’s in/out of scope in the PR body.
3. Before editing `content/`, check open PRs so you don’t overlay.
4. When you finish a slice: update **this file’s Status board**, commit, push, open/update the PR.
5. GitHub Issues are the formal tracker (`docs/agents/issue-tracker.md`) — **this handoff is the live status SSOT for agents**.

---

## Paste snippets

### Lay out MVP epics / TDD tasks (next)

```
Read @HANDOFF.md @defs/_PINS.md @docs/adr/0001-tdd-after-docs.md @docs/agents/issue-tracker.md
and the gameplay defs (@defs/02 @defs/03 @defs/04 @defs/05 @defs/07 @defs/10 @defs/11 @defs/12).

Visual stage is accepted. Before scaffolding, create a GitHub Issues epic/task board for an MVP
under strict TDD: epics as vertical slices, ordered tasks that each start with a failing test.
Pin: minigame runtime must stay asset-agnostic (restyle later). Do not write feature code yet.
```

### Start scaffold after the board exists

```
Read @HANDOFF.md. Confirm the MVP epic/task board exists on GitHub Issues.
Branch off develop. Scaffold Vite + TS + React + Vitest + pnpm per @defs/10, then TDD the first
unblocked task only. Asset-agnostic minigames. No real-platform clones.
```
