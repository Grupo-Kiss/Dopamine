# Handoff — Dopamine (docs complete → asset review → TDD)

Use this file + `CONTEXT.md` + `defs/_PINS.md` so a new chat does not need the old thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- **Canonical docs branch after merge:** `develop` (this arc’s work was `cursor/defs-consistency-pass-d990`, PR #4)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
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
| `00` | Reading order, TDD-early process, structure, asset gate |
| `01` | Vision / pillars |
| `02` | Global rules, states, Dopamine, Focus Chain, Burnout, input (`R`=Repost, `Y`=Echo) |
| `03` | Loop / Pulse / Wave / Echo / Alerts |
| `04` | Lane Defender, Block Cascade, Endless Runner |
| `05` | Continuous difficulty |
| `06` | Provisional balance constants |
| `07` | Layout |
| `08` | Content packs, preload, optional APIs (default off) |
| `09` | Feel, palettes, mockups checklist, asset drop paths |
| `10` | Tech stack / architecture |
| `11` | Testing strategy (coverage map; TDD process already in `00`/ADR) |
| `12` | Coding rules |
| `13` | Credits Modal, attribution, legal checklist |

**Process:** Reading order teaches domain; TDD is mandatory from `00`/ADR before coding. Per feature: owning def → failing test → implement (`11` / `12`).

## Done this arc

- Consistency + full defs `00`–`13`
- Discovery ≠ Anticipation corrected; Start Page in state machine; Credits Modal UX
- Mid-fi mockups + starter icons/minigame SVGs under `content/`
- Pins: asset review, `.env` population, legal checklist
- Gemini prompt was drafted for hi-fi generation but **must not live in the repo** (generate offline / local only)

## Hard gate

**Do not start feature coding / scaffold** until the user finishes **asset review** and supplies **high-fi graphics** into paths in `09` / `08`.

User plan: start broad with **screen hi-fi mockups**, then roll down (windows → HUD → minigames → media). Checklist in `09_game_feel.md`.

## After assets — first coding slice

1. Scaffold Vite + TS + React + Vitest + pnpm (`10`)
2. TDD core state machine (Start Page → Loading → Playing → Game Over)
3. Dopamine → Focus Chain → layout shell → …
4. Follow `11` TDD order; keep core React-free

## Human pins (from `_PINS.md`)

- [ ] Hi-fi asset review / replace mid-fi mockups
- [ ] Populate `.env` when enabling APIs (never commit secrets)
- [ ] Run `13` legal checklist before release / API enable
- Pulse ~100 templates, SFX, `burnout_grunge.png`, empty media dirs as needed
- Palette conscious call (Pulse blue / Wave green) before high-fi lock

## Suggested first message in a new Cursor chat

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Docs 00–13 are on develop. I am still on high-fi asset review — do not scaffold or feature-code until I say go and drop assets.
When I say go: scaffold per 10/11/12 and TDD the state machine first.
```
