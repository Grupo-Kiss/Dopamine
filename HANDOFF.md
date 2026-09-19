# Handoff — Dopamine (docs complete → agent hi-fi → TDD)

Use this file + `CONTEXT.md` + `defs/_PINS.md` + `PRODUCT.md` + `DESIGN.md` so a new chat does not need the old thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- **Canonical docs branch:** `develop`
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Visual lock: `PRODUCT.md`, `DESIGN.md`, `.impeccable/` (salvaged from closed PR #5)
- Specs: `defs/00_IMPLEMENTATION_GUIDE.md` … `defs/13_credits_and_legal.md` — **planned series complete**
- ADR: `docs/adr/0001-tdd-after-docs.md`
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. A **Match** runs from Playing until **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop masonry: Minigame | Loop-over-Wave + Pulse|Echo, vertical Dopamine bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window; Focus Ready = better quality, not required to extend). Combo stickers with boredom curve. Burnout→Recovery with escalating APM. Wave: **Discovery** (unheard tracks) ≠ **Anticipation** (wait for beat drop). Three minigames specified and must all ship; one random per Match. Credits = **scrollable modal** via link on Start Page / Game Over (`13`). Docs first, then **TDD**. Stack: Vite + TypeScript + React + Canvas 2D minigames + Web Audio (`10`).

## State flow

```
Boot → Start Page → (PLAY) → Loading (splash + starter pack)
  → Playing ⇄ Burnout → Recovery → Playing
  → Game Over → (PLAY AGAIN) → Loading → Playing
              → (hub) → Start Page
```

Match clock / Dopamine drain start in **Playing**, not at PLAY press.

## Docs map (SSOT)

| Doc | Role |
| --- | --- |
| `CONTEXT.md` | Glossary |
| `PRODUCT.md` / `DESIGN.md` | Impeccable product + visual lock |
| `00` | Reading order, TDD-early process, structure, asset gate |
| `01`–`13` | Vision through credits/legal (see prior map) |

**Process:** Reading order teaches domain; TDD is mandatory from `00`/ADR before coding. Per feature: owning def → failing test → implement (`11` / `12`).

## Done this arc

- Consistency + full defs `00`–`13`
- Mid-fi mockups + starter icons/minigame SVGs under `content/`
- Closed stale drafts: PR #1 (skills already on `develop`), PR #5 (Start Page prototype — design lock salvaged; scaffold not merged)
- Owner cannot produce hi-fi alone — **agent produces**, owner **approves**

## Hard gate

**Do not start feature coding / scaffold** until hi-fi mockups replace mid-fi under `content/mockups/` (and icons/minigame starters as needed) and the owner has approved them.

**Who makes assets:** a Cursor Cloud Agent with the **Impeccable** design harness (same approach as the closed PR #5 Start Page pass), using `PRODUCT.md` / `DESIGN.md` / `.impeccable/` + mid-fi refs in `content/mockups/`. Owner reviews screenshots / dropped files; does not hand-draw.

Order (from `09`): screen hi-fi mockups → windows → HUD → minigames → media beds. Burnout/Recovery overlays still need external visual refs before design (`_PINS`).

## After assets — first coding slice

1. Scaffold Vite + TS + React + Vitest + pnpm (`10`) — fresh TDD scaffold; do not revive the closed PR #5 app tree wholesale
2. TDD core state machine (Start Page → Loading → Playing → Game Over)
3. Dopamine → Focus Chain → layout shell → …
4. Follow `11` TDD order; keep core React-free

## Pins summary

- [ ] Agent hi-fi pass → owner approve → replace mid-fi
- [ ] Populate `.env` when enabling APIs (never commit secrets)
- [ ] Run `13` legal checklist before release / API enable
- Pulse ~100 templates, SFX, `burnout_grunge.png`, empty media dirs as needed
- Palette conscious call (Pulse blue / Wave green) before high-fi lock

## Suggested first message — hi-fi asset agent

```
Continue Dopamine from @HANDOFF.md @CONTEXT.md @PRODUCT.md @DESIGN.md @defs/_PINS.md @defs/09_game_feel.md.
Produce hi-fi screen mockups into content/mockups/ (and icons as needed), starting with Start Page / splash / desktop layout / Game Over.
Use Impeccable + the locked Collider-inspired GitHub-dark violet stage. Mid-fi SVGs are refs to replace, not keep.
Do not scaffold the Vite app or feature-code until I approve the mockups.
```

## Suggested first message — after assets approved

```
Continue Dopamine from @HANDOFF.md. Hi-fi mockups are approved under content/mockups/.
Scaffold per defs/10–12 and TDD the state machine first. Do not revive closed PR #5's app tree wholesale.
```
