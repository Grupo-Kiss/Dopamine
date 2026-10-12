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
| Issues | GitHub Issues (`docs/agents/issue-tracker.md`) — MVP board [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158) |
| Effort → model | `docs/agents/effort-model-map.md` — pick LLM by pack peak (S/M/L/XL) |

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
| MVP epic/task board (TDD) | [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158) — 29 epics / 111 tasks; landed via [#159](https://github.com/Grupo-Kiss/Dopamine/pull/159); `docs/agents/mvp-board.md` + `docs/agents/effort-model-map.md` |

### In progress — do not collide

| Work | Branch / PR | Owner | Touch only |
| --- | --- | --- | --- |
| *(none — merge [#161](https://github.com/Grupo-Kiss/Dopamine/pull/161) into `develop` to land MVP code)* | | | |

### Done pending merge

| Work | Branch / PR | Notes |
| --- | --- | --- |
| P1–P14 MVP implementation (E00–E21) | [`cursor/p1-scaffold-state-machine-aa9c` / #161](https://github.com/Grupo-Kiss/Dopamine/pull/161) | Mergeable; owner merge required (agent has read-only GitHub). After merge, delete remote branch if not auto-deleted. |

### Next (pick in order)

1. **Merge #161** into `develop`, then close/delete `cursor/p1-scaffold-state-machine-aa9c`.
2. **Critical-path post-MVP:** **E22** Full game-feel polish (peak **L** / strong model) — [#137](https://github.com/Grupo-Kiss/Dopamine/issues/137), start [#138](https://github.com/Grupo-Kiss/Dopamine/issues/138) `E22.T01`.
3. **Safe parallel content** (paths must not collide with E22 feel/audio work):
   - SFX `.ogg` production (`defs/15`) — **E23** (peak **M**)
   - Wave / Loop / Echo media + credits rows — **E24** (peak **M**)
   - Wordmark kerning — **E27.T01** (effort **S**)
   - Balance tune on `defs/06_balance.md` only — **E28** (peak **M**, after playable)

**Housekeeping:** close probe issues [#16](https://github.com/Grupo-Kiss/Dopamine/issues/16) / [#17](https://github.com/Grupo-Kiss/Dopamine/issues/17) when convenient (bot cannot close). Close MVP task issues #19–#136 when #161 lands.

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
| Effort / which LLM | `docs/agents/effort-model-map.md` (packs P1–P14) |
| MVP board summary | `docs/agents/mvp-board.md` + [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158) |

---

## Agent operating rules

1. Branch from latest `origin/develop`: `cursor/<short-name>-dc00` (lowercase) — or the suffix the cloud run assigns.
2. One concern per PR. Prefer draft until ready; say what’s in/out of scope in the PR body.
3. Before editing `content/`, check open PRs so you don’t overlay.
4. When you finish a slice: update **this file’s Status board**, commit, push, open/update the PR.
5. GitHub Issues are the formal tracker (`docs/agents/issue-tracker.md`) — **this handoff is the live status SSOT for agents**.

---

## Paste snippets

### Start post-MVP E22 (next coding pack)

```
Read @HANDOFF.md @docs/agents/effort-model-map.md @docs/agents/mvp-board.md
and board task #138 (effort L, epic E22 / post-MVP feel polish).

ADR-0001: write the failing test named in the issue first.
Asset-agnostic minigames. No real-platform clones. No direct Dopamine penalties.
Stay on E22 this chat — do not start E23+ unless parallel content paths are agreed.
```
