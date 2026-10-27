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
| **MVP code P1–P14 (E00–E21)** | App scaffold + core systems + windows + minigames + audio/stickers — [#161](https://github.com/Grupo-Kiss/Dopamine/pull/161) |
| **E22 Full game-feel polish** (T01–T03) | Focus Chain FX tiers `src/components/focusChainFx.ts`; Combo boredom curve `src/components/comboJuice.ts`; focus muffling matrix `src/audio/muffling.ts` + real Web Audio graph `src/audio/webAudioPort.ts` (fake `AudioContext` in `src/testing/audio.ts`); knobs in `06` → Feel Presentation — [#163](https://github.com/Grupo-Kiss/Dopamine/pull/163) |
| **E23 SFX production + cue integration** (T01–T02) | Generative `.ogg` cues via `tools/sfxgen/`; `content/sfx/manifest.json` `final`; `mixer.playCue(id)` + `DOMAIN_CUE_IDS` (`src/audio/cues.ts`) — [#164](https://github.com/Grupo-Kiss/Dopamine/pull/164) |
| **E24 Media pack expansion + credits** (T01–T02) | Loop/Wave/Echo drop zones filled (`tools/mediagen/`); credits rows for CC0 attributed assets — [#164](https://github.com/Grupo-Kiss/Dopamine/pull/164) |
| **Playing shell** | `PlayingView` mounts `Layout` + `StickerHost`; `applyFeelState` each rAF tick; `playShellCue` wires Focus Chain / alert / hit → `DOMAIN_CUE_IDS`; PLAY preload → Playing — [#165](https://github.com/Grupo-Kiss/Dopamine/pull/165) |
| **Match systems on shell** | `matchSession` + `MatchPlaying`: Dopamine drain → Game Over; Focus Chain nav (Q/W/E/Y/T) → stickers/feel + step cue; alert/hit cue hooks; Recovery `recoveryProgress` — [#166](https://github.com/Grupo-Kiss/Dopamine/pull/166) |
| **Match testground (windows + minigame)** | `matchWorld` + Layout slot panels + Lane Defender canvas; L/R/N window actions, demo alert, passive Wave/Echo ticks — branch `cursor/match-testground-948a` |

### In progress — do not collide

| Work | Branch / PR | Owner | Touch only |
| --- | --- | --- | --- |
| — | — | — | — |

### Next (pick in order)

1. **Combo stickers from window farming** — wire `Combo` sticker events + `highestCombo` on repeated same-window rewards.
2. **Safe parallel content:**
   - Wordmark kerning — **E27.T01** (effort **S**)
   - Balance tune on `defs/06_balance.md` only — **E28** (peak **M**, after playable)
   - Optional media APIs — **E25** (peak **M**)
   - Playwright smoke — **E26** (peak **M**, shell exists)

**Housekeeping:** close probe issues [#16](https://github.com/Grupo-Kiss/Dopamine/issues/16) / [#17](https://github.com/Grupo-Kiss/Dopamine/issues/17) when convenient. Close MVP task issues #19–#136 now that #161 is merged.

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

### Start the next post-MVP pack

```
Read @HANDOFF.md @docs/agents/effort-model-map.md @docs/agents/mvp-board.md
and board task #<N> (effort <S|M|L|XL>, epic E2x).

ADR-0001: write the failing test named in the issue first.
Asset-agnostic minigames. No real-platform clones. No direct Dopamine penalties.
Stay on this epic — do not start the next one unless parallel content paths are agreed.
```
