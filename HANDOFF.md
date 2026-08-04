# Handoff — continue Dopamine docs/dev in a new chat

Use this file so you don’t need the old long thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- Work branch: `cursor/defs-consistency-pass-d990` (PR toward `develop`)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Specs: `defs/00` … `defs/12` done; next `13_credits_and_legal.md`
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. Match ends when **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop: masonry Minigame | Loop-over-Wave + Pulse|Echo, Dopamine vertical bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window; Focus Ready improves quality but is not required), combo stickers with boredom curve, Burnout→Recovery (escalating APM). Wave: **Discovery** (unheard tracks) ≠ **Anticipation** (wait for beat drop). Three minigames all built; one random per Match. Docs first, then **TDD** (process in `00`/ADR; coverage map in `11`). Stack: Vite + TS + React + canvas + Web Audio (`10`). Coding practice: `12`.

## Done this arc

- Setup Matt Pocock skills + grill-with-docs
- Consistency pass; `05`–`12` written; `00` refreshed (incl. how-to-use-docs / TDD early)
- Mid-fi mockups + starter icons/minigame SVGs
- APIs documented; local-first; `.env` population pinned for you
- Discovery vs Anticipation split; Start Page; `Y`=Echo / `R`=Repost

## Next asks for the new agent

1. Write `13_credits_and_legal.md` (last planned def)
2. Wait for user high-fi assets before implementation; review `content/` first
3. Keep working on branch / PR as appropriate; prefer `develop` as base when merging

## Suggested first message in a new Cursor chat

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Branch: cursor/defs-consistency-pass-d990.
Next: write defs/13_credits_and_legal.md.
Do not start feature coding until I finish asset review; I will supply high-fi graphics.
```
