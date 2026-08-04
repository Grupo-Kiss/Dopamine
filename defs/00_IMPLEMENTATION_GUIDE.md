# Implementation Guide

## Reading Order

**Read this file first.**

Then read the remaining documents in the specified order.

Do not begin implementation before reading every specification that exists for the current slice.

Open design reminders live in `_PINS.md` until absorbed.

Canonical glossary: `CONTEXT.md` (repo root).

Hard process choices: `docs/adr/` (notably TDD-after-docs).

### How development uses this order

The numbered defs teach **what to build** (domain → feel → stack). That is intentional: an agent must understand Dopamine, Focus Chain, windows, and layout before writing useful tests.

**How to build** is fixed up front, not discovered at `11`:

1. Finish / respect the docs slice (`00`–relevant specs).
2. Every behavior change is **TDD**: failing test → minimal code → refactor (`docs/adr/0001-tdd-after-docs.md`).
3. `11_testing_strategy.md` is the **coverage map** (what to lock, pyramid, determinism) — read it before scaffolding tests, but do not wait until “the end of the handbook” to adopt TDD. The Pre-Implementation Gate below already requires it.
4. `12_coding_rules.md` is daily code practice while staying on that cadence.

During a coding slice: re-read the **owning** gameplay/balance doc for the feature, then write the failing test (`11` order), then implement (`10` / `12`). Do not implement from memory of `01`–`09` alone without a test.

| Doc | Status | Responsibility |
| --- | --- | --- |
| `01_project.md` | Done | Vision, pillars, platform, success criteria |
| `02_gameplay_core.md` | Done | Global rules, states, Dopamine, Focus Chain, Burnout, input |
| `03_gameplay_windows.md` | Done | Loop / Pulse / Wave / Echo / Alerts behaviour |
| `04_gameplay_minigames.md` | Done | Lane Defender, Block Cascade, Endless Runner |
| `05_difficulty.md` | Done | Continuous pressure scaling (no discrete levels) |
| `06_balance.md` | Done | Provisional numeric constants only |
| `07_layout.md` | Done | Desktop masonry + mobile stack + Dopamine bar |
| `08_content.md` | Done | `content/` packs, splash preload, optional APIs |
| `09_game_feel.md` | Done | Start Page, stickers, palettes, audio mix, mockups |
| `10_tech.md` | Done | Stack, architecture, audio, content load, env, deploy |
| `11_testing_strategy.md` | Done | TDD map, pyramid, determinism, CI |
| `12_coding_rules.md` | Done | Code conventions, boundaries, TDD daily practice |
| `13_credits_and_legal.md` | Done | Attribution, licenses, credits UI, release checklist |

Handoff for fresh chats: `HANDOFF.md`.

---

## Naming Convention

The project intentionally avoids using the names, branding, icons, logos or identifiable UI of existing platforms.

All gameplay systems use fictional services.

Current mapping:

- Loop: short-form videos
- Pulse: microblogging social network
- Wave: music streaming
- Echo: long-form video and podcasts
- Alerts: operating system notifications

The goal is parody, not imitation.

The implementation must remain legally distinct from any existing platform.

Use glossary terms from `CONTEXT.md` in code, issues, and tests. Do not revive avoided synonyms (health, TikTok, combo-as-Focus-Chain, etc.).

---

## Single Source of Truth

Every gameplay rule must exist in only one document.

Avoid duplicating gameplay rules across multiple files.

If a rule changes, update the defining document instead of copying the change elsewhere.

Hard process and architecture choices are recorded as ADRs in `docs/adr/`.

Document responsibilities:

| Concern | Authority |
| --- | --- |
| Glossary / vocabulary | `CONTEXT.md` |
| Global gameplay rules & states | `02_gameplay_core.md` |
| Per-window behaviour | `03_gameplay_windows.md` |
| Minigame mechanics | `04_gameplay_minigames.md` |
| Difficulty progression | `05_difficulty.md` |
| Numeric constants | `06_balance.md` |
| Spatial layout / HUD chrome | `07_layout.md` |
| Media libraries, preload, APIs | `08_content.md` + repo-root `content/` |
| Visual/audio feel, Start Page, mockups | `09_game_feel.md` + `content/mockups/` |
| Implementation stack | `10_tech.md` |
| Testing approach | `11_testing_strategy.md` + ADR-0001 |
| Code conventions | `12_coding_rules.md` |
| Credits / legal | `13_credits_and_legal.md` |

---

## High-Level State Flow

```
Boot → Start Page → (PLAY) → Loading (splash + starter pack)
  → Playing ⇄ Burnout → Recovery → Playing
  → Game Over → (PLAY AGAIN) → Loading → Playing
              → (full hub) → Start Page
```

- **Start Page**: how-to, Accessibility Mode, credits, PLAY — no Match drain.
- **Loading**: short arcade splash; validate manifests; preload ~2 minutes of content (`08` / `06`).
- **Playing**: sole survival resource is Dopamine (passive drain only — never direct penalties).
- **Burnout / Recovery**: modify Playing; escalating APM thresholds per Match.
- **Game Over**: silence, stats, demanding PLAY AGAIN, reused Start Page info blocks.

Match clock and Dopamine begin at Playing, not at PLAY press.

---

## Pre-Implementation Gate

Do **not** start feature coding until:

1. User finishes **asset review** and supplies high-fi graphics into the paths in `08` / `09`.
2. Docs slice for the work is complete enough (this guide + relevant `01`–`09`; `10`+ as needed).
3. Delivery follows **TDD** (`docs/adr/0001-tdd-after-docs.md`): failing test → minimal code → refactor.

Mid-fi references live under `content/mockups/`. Starter icons/minigame SVGs under `content/icons/` and `content/minigames/` are placeholders until replaced.

---

## Implementation Priority

After the asset gate and docs/TDD readiness:

1. Project scaffold + test runner (`10` / `11` / `12`)
2. Core state machine (Start Page → Loading → Playing → Game Over)
3. Dopamine system (passive drain, gains, diminishing returns, Anticipation + Discovery bonuses)
4. Focus Chain (decaying continue-window, quality tiers, completion bonus)
5. Layout shell (desktop masonry + Dopamine bar + mobile)
6. All three minigames (one random per Match; all must ship)
7. Window systems (Loop, Pulse, Wave, Echo, Alerts)
8. Burnout / Recovery + telegraph
9. Difficulty scaling
10. Content pack loading + progressive preload
11. Game feel (stickers, overlays, audio buses / muffling)
12. Credits surfaces + attribution data
13. Content expansion / optional APIs (keys + legal OK only)

Do not implement advanced visual polish before gameplay systems are functional — except integrating user-supplied high-fi assets when they arrive.

Keyboard: action keys own meanings globally (**R = Repost**); Echo navigation is **Y** (see `02`).

---

## Project Structure

Authoring media/text libraries (human drop zone) live at repo-root `content/` — see `08_content.md`. Build may bundle them into `src/assets/` or `public/`.

```
content/                    ← authoring drop zone (local-first)
├── icons/
├── mockups/
├── minigames/
├── loop/
├── pulse/
├── wave/high|boring/
├── echo/audio|video/
└── alerts/

src/                        ← application (stack in `10_tech.md`)
├── core/
│   ├── gameState/
│   ├── dopamine/
│   ├── scoring/
│   ├── difficulty/
│   ├── focusChain/
│   ├── burnout/
│   ├── events/
│   └── input/
├── windows/
│   ├── Loop/
│   ├── Pulse/
│   ├── Wave/
│   ├── Echo/
│   └── Alerts/
├── minigames/
│   ├── lane_defender/
│   ├── endless_runner/
│   └── block_cascade/
├── components/
│   ├── HUD/                ← Dopamine bar + sticker hosts
│   ├── Layout/
│   ├── StartPage/
│   ├── GameOver/
│   ├── CreditsModal/       ← long attribution list (`13`)
│   └── Effects/
├── audio/                  ← Web Audio mixer buses
├── content/                ← manifest loaders / preload queue
├── config/
├── assets/                 ← built/bundled media (from content/ or generated)
├── testing/                ← shared fakes (clock, rng, media, audio)
└── utils/

docs/
├── adr/
└── agents/

CONTEXT.md
HANDOFF.md
defs/
```

Co-locate `*.test.ts(x)` next to modules (`11` / `12`).
---

## Credits and Attribution

Credits must be accessible from:

- **Start Page** — Credits link opens **Credits Modal** (long scrollable list)
- **Game Over** — same link among adapted info blocks
- settings/about section if implemented later (same modal)

Do not treat the Loading splash as the only credits surface. Do not dump the full attribution wall onto the hub itself.

All third-party assets must carry attribution data in manifests / credits store.

Detailed attribution rules: `13_credits_and_legal.md`. Content hard rules also in `08_content.md` (no copyright risk; APIs default off).

---

## Balance And Pins

- Balance numbers in `06` are **provisional**; tune by playtest; ease-in early Match.
- Never apply direct Dopamine removal.
- Check `_PINS.md` at the start of each docs or implementation slice.
