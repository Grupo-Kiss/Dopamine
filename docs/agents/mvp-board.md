# MVP epic / task board

**Formal tracker:** GitHub Issues (created from `tools/issue-board/board.json` via `tools/issue-board/publish.mjs`).  
**Board index:** [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158)  
**Number map:** `tools/issue-board/published.json`  
**Process:** ADR-0001 — docs first, then strict TDD (failing test → minimal code → refactor).  
**Pin:** Minigame runtime stays **asset-agnostic** — load via manifests / stable ids under `content/minigames/<id>/`; restyle later by swapping files, not rewriting gameplay.

Ignore probe issues `#16` / `#17` (permission checks; close when possible).  
First coding task: [#19](https://github.com/Grupo-Kiss/Dopamine/issues/19) `E00.T01`.

---

## MVP scope

### Goal

Ship a **playable frontend Match** that proves the attention-economy satire loop under strict TDD, with asset-agnostic minigames, before content-API and polish expansion.

### In MVP (v1 ship)

| Area | What “done” means |
| --- | --- |
| Scaffold | Vite + TS (strict) + React 19 + Vitest + Testing Library + pnpm; `src/testing` clock/rng/media/audio fakes (`10`, `11`) |
| State machine | Boot → Start Page → Loading → Playing ⇄ Burnout → Recovery → Game Over; PLAY AGAIN → Loading; hub → Start Page (`02`) |
| Dopamine | Passive drain + gains + diminishing + Anticipation; **never** direct penalty APIs (`02`, `06`) |
| Focus Chain | Valid Focus Change, Waiting breaks, Focus Ready quality, decaying timeout, completion bonus (`02`, `06`) |
| Input | Priority text → Alert → Active Window → nav; **R = Repost**, **Y = Echo** (`02`) |
| Balance | Single module exporting `06` constant names |
| Layout | Desktop masonry + mobile stack + vertical Dopamine bar; Alerts overlay (`07`) |
| Content gate | Local manifest validation + starter-pack preload; fail closed (`08`, `06`) |
| Hub UI | Start Page, Loading splash, Game Over stats, Credits Modal from store (`09`, `13`) |
| Minigames | Asset-agnostic runtime + **Lane Defender**, **Block Cascade**, **Endless Runner** (one random per Match; failure resets minigame only) (`04`) |
| Windows | Loop, Pulse, Wave, Echo, Alerts with core actions / rewards / Attention Requests; Wave **Discovery ≠ Anticipation** (`03`) |
| Difficulty | Continuous pressure multipliers only — no rule changes (`05`) |
| Burnout | Telegraph, enter/exit, Recovery drain mult, escalating APM threshold (`02`, `06`) |
| Audio | Unlock on PLAY; bus stub; Game Over hard silence (`09`, `10`) |
| Feel (baseline) | Readable Focus Chain / Combo stickers; Accessibility Mode persisted (`09`) |

**First playable gate:** after epics E00–E14 (Lane Defender + Loop/Pulse/Wave + layout + core). Remaining MVP epics finish the v1 ship bar (other minigames, Echo/Alerts depth, feel/audio baseline).

### Out of MVP (post-MVP backlog)

- Optional Pixabay / Pexels / Jamendo providers (`08`, `10`)
- Full media library population beyond starter fixtures (Wave/Loop/Echo packs)
- SFX `.ogg` production + full cue wiring (`15` — brief already exists)
- Full game-feel choreography beyond readable feedback (`09`)
- Deferred art: wordmark kerning; animated Start Page stickers (`_PINS.md`)
- Playwright E2E smoke (optional after Playing shell)
- Deploy/hosting hardening beyond static `pnpm build`
- Live balance playtest retunes (constants stay provisional in `06`)

### Hard rules (every MVP task)

1. **TDD:** each task’s first commit is a **failing** test encoding the owning def.
2. **Glossary:** `CONTEXT.md` terms in types/tests (no health/lives; no real-platform brands).
3. **Asset-agnostic minigames:** no hard-coded art dimensions/palette/cutout construction in gameplay logic.
4. **No feature code in the board-creation PR** — issues only; scaffold starts on the next slice.

---

## Epic order (vertical slices)

| ID | Scope | Epic |
| --- | --- | --- |
| E00 | MVP | Scaffold & test harness |
| E01 | MVP | Match state machine |
| E02 | MVP | Balance constants module |
| E03 | MVP | Dopamine system |
| E04 | MVP | Focus Chain |
| E05 | MVP | Input router |
| E06 | MVP | Difficulty multipliers |
| E07 | MVP | Burnout / Recovery / Telegraph |
| E08 | MVP | Content preload gate |
| E09 | MVP | Layout shell + Dopamine bar |
| E10 | MVP | Hub surfaces (Start Page / Loading / Game Over / Credits) |
| E11 | MVP | Asset-agnostic minigame runtime |
| E12 | MVP | Lane Defender |
| E13 | MVP | Loop window |
| E14 | MVP | Pulse window |
| E15 | MVP | Wave window (Discovery ≠ Anticipation) |
| E16 | MVP | Echo window (core) |
| E17 | MVP | Alerts (core) |
| E18 | MVP | Block Cascade |
| E19 | MVP | Endless Runner |
| E20 | MVP | Audio mixer stub + Game Over silence |
| E21 | MVP | Baseline stickers + Accessibility Mode |
| E22 | Post-MVP | Full game-feel polish |
| E23 | Post-MVP | SFX production + cue integration |
| E24 | Post-MVP | Media pack expansion + credits rows |
| E25 | Post-MVP | Optional media APIs |
| E26 | Post-MVP | Playwright E2E smoke |
| E27 | Post-MVP | Deferred visual polish (kerning, animated hub stickers) |
| E28 | Post-MVP | Balance playtest passes |

Machine-readable task list (failing-test titles, blockers, defs): `tools/issue-board/board.json`.

After publish, the **board index** GitHub issue links every epic/task by number.
