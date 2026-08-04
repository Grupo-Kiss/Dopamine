# Handoff — continue Dopamine docs/dev in a new chat

Use this file so you don’t need the old long thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- Work branch: `cursor/defs-consistency-pass-d990` (PR toward `develop`)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Specs: `defs/00` … `defs/13` — **planned documentation series complete**
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. Match ends when **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop: masonry Minigame | Loop-over-Wave + Pulse|Echo, Dopamine vertical bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window; Focus Ready improves quality but is not required), combo stickers with boredom curve, Burnout→Recovery (escalating APM). Wave: **Discovery** (unheard tracks) ≠ **Anticipation** (wait for beat drop). Three minigames all built; one random per Match. Docs first, then **TDD** (`00`/ADR; map in `11`). Stack: Vite + TS + React + canvas + Web Audio (`10`). Coding: `12`. Credits/legal: `13`.

## Done this arc

- Full defs `00`–`13` + glossary + pins + mid-fi mockups / starter assets
- TDD-early process clarified; Discovery ≠ Anticipation; Start Page; `Y`=Echo / `R`=Repost
- `.env` population + release legal checklist pinned for you

## Next asks for the new agent

1. **Do not start feature coding** until user finishes asset review and supplies high-fi graphics
2. After assets: scaffold per `10` / `11` / `12` (Vitest first, state machine, …)
3. Keep working on branch / PR as appropriate; prefer `develop` as base when merging

## Suggested first message in a new Cursor chat

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Branch: cursor/defs-consistency-pass-d990.
Docs 00–13 are complete. Wait for my high-fi asset review before scaffolding/coding.
When I say go: scaffold Vite/TS/React + Vitest and TDD the state machine first.
```
