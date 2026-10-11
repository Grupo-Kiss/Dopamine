# Effort → model map

**Read this** when starting any coding chat / Cloud Agent run.  
Pairs with the MVP board ([#158](https://github.com/Grupo-Kiss/Dopamine/issues/158), `docs/agents/mvp-board.md`).  
Machine data: `tools/issue-board/board.json` (`effort` on each task) · `tools/issue-board/effort-chunks.json`.

---

## How to use (every instance)

1. Open board index [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158) → pick the first **unblocked** task (or the pack below that contains it).
2. Look up that task’s **effort** in the tables here (or `board.json`).
3. Pick the model for that pack’s **peak** effort (do **not** switch mid-pack unless a task is upgraded to a higher tier).
4. Stay on that model until the pack is done or you hit a higher-effort task that warrants a new chat.
5. Paste into the agent prompt: effort letter + issue number + “failing test first (ADR-0001)”.

**Default rule:** one model per **pack** (adjacent epics that share the same peak effort).  
Inside a pack, smaller `S` tasks still ride the pack’s model — switching for a single `S` wastes context.

---

## Effort scale

| Effort | Meaning | Typical work | Model class (Cursor) |
| --- | --- | --- | --- |
| **S** | Small / mechanical | Constants export, thin transitions, obvious fakes, guard tests | **Light / fast** — Composer or equivalent low-cost coding model |
| **M** | Medium / standard TDD | Clear domain rules, React smoke, ports with one invariant | **Default mid** — solid coding model, normal thinking |
| **L** | Large / easy to get wrong | Multi-invariant domain, layout model, minigame sims, asset-agnostic pins | **Strong** — high-reasoning coding model (elevated thinking) |
| **XL** | Critical pin / architecture debt if wrong | Wave **Discovery ≠ Anticipation**; systems that redefine product invariants | **Beefiest available** — max/high thinking; short focused chats |

### Pins that force L / XL

| Pin | Min effort |
| --- | --- |
| Never direct Dopamine removal | cover with `S`/`M` tests, but any API design around Dopamine fail-paths → **L** |
| Discovery ≠ Anticipation | **XL** (`E15.T02`, `E15.T03`) |
| Minigame runtime asset-agnostic | **L** (`E11.*`, canvas adapters) |
| R = Repost / Y = Echo | at least **M** (`E05.T02`) |
| Focus Chain ≠ Combo | **M**+ (`E04`, `E21.T02`) |

---

## MVP model packs (same peak effort)

Work **top to bottom**. Each pack = one model choice for multiple sequential tasks. Issue numbers from `published.json`.

| Pack | Peak | Model | Epics | Epic issues | Task issues | Why this model |
| --- | --- | --- | --- | --- | --- | --- |
| **P1** Scaffold + state machine | **M** | Mid | E00–E01 | [#18](https://github.com/Grupo-Kiss/Dopamine/issues/18), [#25](https://github.com/Grupo-Kiss/Dopamine/issues/25) | #19–#32 | Toolchain + state union shape |
| **P2** Balance constants | **S** | Light | E02 | [#33](https://github.com/Grupo-Kiss/Dopamine/issues/33) | #34–#35 | Pure named exports from `06` |
| **P3** Dopamine + Focus Chain | **L** | Strong | E03–E04 | [#36](https://github.com/Grupo-Kiss/Dopamine/issues/36), [#43](https://github.com/Grupo-Kiss/Dopamine/issues/43) | #37–#50 | Diminishing / Anticipation / chain edges |
| **P4** Input + Difficulty | **M** | Mid | E05–E06 | [#51](https://github.com/Grupo-Kiss/Dopamine/issues/51), [#56](https://github.com/Grupo-Kiss/Dopamine/issues/56) | #52–#59 | Router + continuous mults |
| **P5** Burnout / Recovery | **L** | Strong | E07 | [#60](https://github.com/Grupo-Kiss/Dopamine/issues/60) | #61–#65 | APM sustain + Recovery invariants |
| **P6** Content preload gate | **M** | Mid | E08 | [#66](https://github.com/Grupo-Kiss/Dopamine/issues/66) | #67–#70 | Manifest fail-closed |
| **P7** Layout shell | **L** | Strong | E09 | [#71](https://github.com/Grupo-Kiss/Dopamine/issues/71) | #72–#75 | Masonry SSOT in code |
| **P8** Hub surfaces | **M** | Mid | E10 | [#76](https://github.com/Grupo-Kiss/Dopamine/issues/76) | #77–#81 | Start/Loading/GameOver/Credits |
| **P9** Minigame runtime + Lane Defender | **L** | Strong | E11–E12 | [#82](https://github.com/Grupo-Kiss/Dopamine/issues/82), [#87](https://github.com/Grupo-Kiss/Dopamine/issues/87) | #83–#93 | Asset-agnostic pin + first full sim |
| **P10** Loop + Pulse | **M** | Mid | E13–E14 | [#94](https://github.com/Grupo-Kiss/Dopamine/issues/94), [#99](https://github.com/Grupo-Kiss/Dopamine/issues/99) | #95–#103 | Window reward paths |
| **P11** Wave (Discovery ≠ Anticipation) | **XL** | Beefiest | E15 | [#104](https://github.com/Grupo-Kiss/Dopamine/issues/104) | #105–#108 | Product pin — dedicated strong chat |
| **P12** Echo + Alerts | **M** | Mid | E16–E17 | [#109](https://github.com/Grupo-Kiss/Dopamine/issues/109), [#113](https://github.com/Grupo-Kiss/Dopamine/issues/113) | #110–#117 | Core paths / overlay |
| **P13** Block Cascade | **L** | Strong | E18 | [#118](https://github.com/Grupo-Kiss/Dopamine/issues/118) | #119–#122 | Board model + overflow contract |
| **P14** Runner + audio + stickers | **M** | Mid | E19–E21 | [#123](https://github.com/Grupo-Kiss/Dopamine/issues/123), [#128](https://github.com/Grupo-Kiss/Dopamine/issues/128), [#132](https://github.com/Grupo-Kiss/Dopamine/issues/132) | #124–#136 | Third minigame + baseline feel |

**First playable gate:** finish **P1–P11** (through Wave). **P12–P14** finish MVP ship.

### MVP effort mix

| Effort | MVP tasks | Role |
| --- | --- | --- |
| S | 27 | Fill with light model inside mid/strong packs, or solo pack P2 |
| M | 51 | Majority of window/hub/runner work |
| L | 17 | Core systems + layout + minigame foundations |
| XL | 2 | Wave Discovery + Anticipation only |

---

## Parallel tracks (different model, non-blocking)

These do **not** block the MVP critical path and can run in a **light/mid** chat while a strong pack is elsewhere — if file paths do not collide.

| Track | Effort | Model | Board | Notes |
| --- | --- | --- | --- | --- |
| SFX `.ogg` production | M | Mid (or non-code) | E23 | `content/sfx/` — post-MVP |
| Media pack fill | M | Light/mid | E24 | drop zones + credits rows |
| Wordmark kerning | S | Light | E27.T01 | asset-only |
| Balance number tune | M | Mid | E28 | only after playable; edit `06` + constants together |

Do **not** parallelize two agents on the same epic’s open task chain.

---

## Same-effort consecutive runs (critical path)

When you want a chat that only does **one effort letter**, use these runs (tasks remain dependency-ordered — you cannot skip blockers). Prefer **packs P1–P14** unless you are optimizing cost on a long same-letter streak. Full machine list: `tools/issue-board/effort-chunks.json`.

| Run | Effort | n | Tasks |
| --- | --- | ---: | --- |
| R1 | M | 1 | E00.T01 (#19) |
| R2 | S | 3 | E00.T02–T04 (#20–#22) |
| R3 | M | 1 | E00.T05 (#23) |
| R4 | S | 1 | E00.T06 (#24) |
| R5 | M | 1 | E01.T01 (#26) |
| R6 | S | 1 | E01.T02 (#27) |
| R7 | M | 1 | E01.T03 (#28) |
| R8 | S | 3 | E01.T04–T06 (#29–#31) |
| R9 | M | 1 | E01.T07 (#32) |
| R10 | S | 3 | E02.T01–T02 + E03.T01 (#34–#37) |
| R11 | M | 1 | E03.T02 (#38) |
| R12 | S | 1 | E03.T03 (#39) |
| R13 | L | 2 | E03.T04–T05 (#40–#41) |
| R14 | S | 1 | E03.T06 (#42) |
| R15 | L | 3 | E04.T01–T03 (#44–#46) |
| R16 | M | 2 | E04.T04–T05 (#47–#48) |
| R17 | S | 2 | E04.T06–T07 (#49–#50) |
| R18 | M | 3 | E05.T01–T03 (#52–#54) |
| R19 | S | 1 | E05.T04 (#55) |
| R20 | M | 1 | E06.T01 (#57) |
| R21 | S | 2 | E06.T02–T03 (#58–#59) |
| R22 | M | 3 | E07.T01–T03 (#61–#63) |
| R23 | L | 1 | E07.T04 (#64) |
| R24 | M | 4 | E07.T05 + E08.T01–T03 (#65–#69) |
| R25 | S | 1 | E08.T04 (#70) |
| R26 | L | 2 | E09.T01–T02 (#72–#73) |
| R27 | M | 3 | E09.T03–T04 + E10.T01 (#74–#77) |
| R28 | S | 1 | E10.T02 (#78) |
| R29 | M | 1 | E10.T03 (#79) |
| R30 | S | 1 | E10.T04 (#80) |
| R31 | M | 1 | E10.T05 (#81) |
| R32 | L | 2 | E11.T01–T02 (#83–#84) |
| R33 | M | 1 | E11.T03 (#85) |
| R34 | L | 1 | E11.T04 (#86) |
| R35 | M | 1 | E12.T01 (#88) |
| R36 | L | 3 | E12.T02–T04 (#89–#91) |
| R37 | M | 1 | E12.T05 (#92) |
| R38 | L | 1 | E12.T06 (#93) |
| R39 | M | 7 | E13.T01–E14.T03 (#95–#102) |
| R40 | S | 1 | E14.T04 (#103) |
| R41 | M | 1 | E15.T01 (#105) |
| R42 | XL | 2 | E15.T02–T03 (#106–#107) |
| R43 | M | 2 | E15.T04 + E16.T01 (#108–#110) |
| R44 | S | 1 | E16.T02 (#111) |
| R45 | M | 4 | E16.T03 + E17.T01–T03 (#112–#116) |
| R46 | S | 1 | E17.T04 (#117) |
| R47 | L | 1 | E18.T01 (#119) |
| R48 | M | 1 | E18.T02 (#120) |
| R49 | L | 1 | E18.T03 (#121) |
| R50 | M | 5 | E18.T04 + E19.T01–T04 (#122–#127) |
| R51 | S | 1 | E20.T01 (#129) |
| R52 | M | 1 | E20.T02 (#130) |
| R53 | S | 1 | E20.T03 (#131) |
| R54 | M | 3 | E21.T01–T03 (#133–#135) |
| R55 | S | 1 | E21.T04 (#136) |

> Early MVP flickers between S/M (R1–R9). **Stay on pack P1 mid model** instead of hopping. Use pure same-effort runs when a streak is long (e.g. R39, R42, R50).

---

## Full MVP task → effort lookup

| Task | # | Effort | Title |
| --- | --- | --- | --- |
| E00.T01 | 19 | M | pnpm + Vite + TS strict project boots |
| E00.T02 | 20 | S | React 19 app shell mounts without Match drain |
| E00.T03 | 21 | S | Injected clock fake for domain tests |
| E00.T04 | 22 | S | Injected RNG fake for Match picks |
| E00.T05 | 23 | M | Media + AudioContext port fakes |
| E00.T06 | 24 | S | CI script: lint + unit test + build stubs |
| E01.T01 | 26 | M | Boot lands on Start Page |
| E01.T02 | 27 | S | PLAY transitions Start Page → Loading |
| E01.T03 | 28 | M | Loading success → Playing starts Match |
| E01.T04 | 29 | S | Loading validation failure stays on Loading |
| E01.T05 | 30 | S | Dopamine ≤ 0 → Game Over immediately |
| E01.T06 | 31 | S | PLAY AGAIN → Loading; hub → Start Page |
| E01.T07 | 32 | M | Playing can enter Burnout and Recovery modifiers |
| E02.T01 | 34 | S | Export Dopamine + drain named constants |
| E02.T02 | 35 | S | Export Focus Chain + Burnout + Discovery/Anticipation constants |
| E03.T01 | 37 | S | Meter starts full; clamps to [MIN, MAX] |
| E03.T02 | 38 | M | Passive drain uses difficulty × Recovery mult |
| E03.T03 | 39 | S | Positive gain from interactions |
| E03.T04 | 40 | L | Diminishing returns logarithmic floor |
| E03.T05 | 41 | L | Anticipation builds and resets correctly |
| E03.T06 | 42 | S | No direct penalty subtraction API |
| E04.T01 | 44 | L | Valid Focus Change extends chain by 1 |
| E04.T02 | 45 | L | Waiting destination does not extend; farming breaks |
| E04.T03 | 46 | L | Focus Ready improves quality not eligibility |
| E04.T04 | 47 | M | Decaying continue-window timeoutMs(L) |
| E04.T05 | 48 | M | Completion bonus only when length ≥ min |
| E04.T06 | 49 | S | Burnout/Recovery do not break chain |
| E04.T07 | 50 | S | Hover alone does not change Active Window |
| E05.T01 | 52 | M | Priority: text → Alert → Active Window → navigation |
| E05.T02 | 53 | M | R is always Repost; Y navigates to Echo |
| E05.T03 | 54 | M | Nav shortcuts count as Focus Change when they switch windows |
| E05.T04 | 55 | S | Pointer/touch paths share valid-interaction helpers |
| E06.T01 | 57 | M | Difficulty starts at minimum and rises continuously |
| E06.T02 | 58 | S | Difficulty feeds Dopamine drain mult only as multiplier |
| E06.T03 | 59 | S | Event-interval multipliers available to windows/minigames |
| E07.T01 | 61 | M | APM tracking with injected clock |
| E07.T02 | 62 | M | Telegraph when APM approaches threshold |
| E07.T03 | 63 | M | Enter Burnout after sustain above threshold |
| E07.T04 | 64 | L | Exit Burnout → Recovery for fixed duration |
| E07.T05 | 65 | M | APM threshold escalates after each completed Recovery |
| E08.T01 | 67 | M | Manifest schema validation fail-closed |
| E08.T02 | 68 | M | Starter-pack count gate from 06 |
| E08.T03 | 69 | M | Injected RNG picks Minigame + layout shuffle at Loading |
| E08.T04 | 70 | S | Providers default disabled without env |
| E09.T01 | 72 | L | Desktop slot model: five permanent windows + bar |
| E09.T02 | 73 | L | Desktop structural pairs + allowed shuffle |
| E09.T03 | 74 | M | Mobile: Minigame + exactly two services |
| E09.T04 | 75 | M | React layout smoke: roles/slot counts |
| E10.T01 | 77 | M | Start Page shows brand, how-to, Accessibility, Credits, PLAY |
| E10.T02 | 78 | S | Accessibility Mode persists in localStorage |
| E10.T03 | 79 | M | Credits Modal opens from Start Page and lists store rows |
| E10.T04 | 80 | S | Loading splash shows until gate passes |
| E10.T05 | 81 | M | Game Over shows stats + PLAY AGAIN + hub path |
| E11.T01 | 83 | L | Minigame manifest loader resolves stable asset ids |
| E11.T02 | 84 | L | Minigame host mounts selected id; reports actions into core |
| E11.T03 | 85 | M | Minigame failure preserves Match resources |
| E11.T04 | 86 | L | Skin swap test: alternate manifest does not change rules |
| E12.T01 | 88 | M | Three lanes + instantaneous lane change |
| E12.T02 | 89 | L | Enemies advance and die in one hit; reach = fail |
| E12.T03 | 90 | L | Hazards counters and Barrier semantics |
| E12.T04 | 91 | L | Boss integrity + rewards hooks |
| E12.T05 | 92 | M | Pickups expire; difficulty densifies spawns |
| E12.T06 | 93 | L | Canvas adapter letterboxes playfield; uses asset ids |
| E13.T01 | 95 | M | Clip loops until player Next |
| E13.T02 | 96 | M | Like / Repost grant Dopamine+Score via tables |
| E13.T03 | 97 | M | Attention Request opportunity expires without penalty |
| E13.T04 | 98 | M | Window states Normal/Waiting/Focus Ready |
| E14.T01 | 100 | M | Feed renders posts from content pack |
| E14.T02 | 101 | M | Like / Repost / Reply / Create Post actions |
| E14.T03 | 102 | M | Mention / trend Attention Requests |
| E14.T04 | 103 | S | Spam/ads reward 0 Dopamine when present |
| E15.T01 | 105 | M | Continuous playback + Next song |
| E15.T02 | 106 | XL | Discovery Bonus on unheard tracks only |
| E15.T03 | 107 | XL | Anticipation toward Song Moment |
| E15.T04 | 108 | M | Recommendations as Attention Requests |
| E16.T01 | 110 | M | Playback + Next content |
| E16.T02 | 111 | S | React / Subscribe rewards |
| E16.T03 | 112 | M | Highlight moment Anticipation path |
| E17.T01 | 114 | M | Alert overlay above layout; not a masonry slot |
| E17.T02 | 115 | M | A opens highest priority; Esc dismisses |
| E17.T03 | 116 | M | Open can extend Focus Chain; spam = 0 Dopamine |
| E17.T04 | 117 | S | Ignore/dismiss never subtracts Dopamine |
| E18.T01 | 119 | L | Board + seven tetrominoes spawn |
| E18.T02 | 120 | M | Move/rotate/soft drop; no hard drop |
| E18.T03 | 121 | L | Line clears grant rewards; overflow resets minigame only |
| E18.T04 | 122 | M | Fall speed scales with difficulty; skin from manifest ids |
| E19.T01 | 124 | M | Auto-forward + three-lane selection |
| E19.T02 | 125 | M | Obstacles collide → minigame reset only |
| E19.T03 | 126 | M | Collectibles + rare pickup Attention Request |
| E19.T04 | 127 | M | Canvas adapter uses asset ids |
| E20.T01 | 129 | S | AudioContext unlock on PLAY gesture |
| E20.T02 | 130 | M | Bus stub records duck/muffle messages |
| E20.T03 | 131 | S | Game Over suspends/stops graph (silence) |
| E21.T01 | 133 | M | Focus Chain step sticker host |
| E21.T02 | 134 | M | Combo sticker distinct from Focus Chain |
| E21.T03 | 135 | M | Accessibility Mode reduces motion intensity path |
| E21.T04 | 136 | S | Burnout telegraph + Recovery cues as stickers |

### Why some tasks are L / XL

| Task | Effort | Why |
| --- | --- | --- |
| E03.T04 | L | Log falloff + reset rules easy to get wrong |
| E03.T05 | L | Anticipation must stay distinct from Discovery |
| E04.T01–T03 | L | Core Focus Chain edges / quality vs eligibility |
| E07.T04 | L | Recovery drain + no-retrigger |
| E09.T01–T02 | L | Layout SSOT |
| E11.T01–T02, T04 | L | Asset-agnostic runtime pin |
| E12.T02–T04, T06 | L | Sim + canvas without baking art into rules |
| E15.T02–T03 | XL | Discovery ≠ Anticipation product pin |
| E18.T01, T03 | L | Board foundation + Match-safe overflow |

---

## Post-MVP (peak by epic)

| Epic | Peak | Model | Notes |
| --- | --- | --- | --- |
| E22 Full feel | L | Strong | FX intents + muffling matrix |
| E23 SFX | M | Mid | Parallel-safe content |
| E24 Media packs | M | Light/mid | Parallel-safe content |
| E25 Optional APIs | M | Mid | Keys + legal gate |
| E26 Playwright | M | Mid | After Playing shell |
| E27 Deferred art | M | Light→mid | Kerning S, animated stickers M |
| E28 Balance playtest | M | Mid | After playable MVP |

---

## Prompt snippet (copy into a new chat)

```
Read @HANDOFF.md @docs/agents/effort-model-map.md @docs/agents/mvp-board.md
and board task #<N> (effort <S|M|L|XL>, pack <P#>).

ADR-0001: write the failing test named in the issue first.
Asset-agnostic minigames. No real-platform clones. No direct Dopamine penalties.
Stay on this effort pack — do not start the next pack in this chat.
```
