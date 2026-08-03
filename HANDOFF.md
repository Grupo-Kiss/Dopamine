# Handoff — continue Dopamine docs/dev in a new chat

Use this file so you don’t need the old long thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- Work branch: `cursor/defs-consistency-pass-d990` (PR toward `develop`)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Specs: `defs/00` … `defs/10` done; next `11_testing_strategy.md` → `13`
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. Match ends when **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop: masonry Minigame | Loop-over-Wave + Pulse|Echo, Dopamine vertical bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window; Focus Ready improves quality but is not required), combo stickers with boredom curve, Burnout→Recovery (escalating APM). Wave: **Discovery** (unheard tracks) ≠ **Anticipation** (wait for beat drop). Three minigames all built; one random per Match. Docs first, then **TDD**. Stack: Vite + TS + React + canvas minigames + Web Audio (`10_tech.md`).

## Done this arc

- Setup Matt Pocock skills + grill-with-docs
- Consistency pass; `05`–`10` written; `00` refreshed
- Mid-fi mockups + starter icons/minigame SVGs
- APIs documented; local-first
- Contradictions: Focus Chain quality tiers; `Y`=Echo / `R`=Repost; Start Page in state machine
- Discovery vs Anticipation split corrected (not the same system)

## Next asks for the new agent

1. Write `11_testing_strategy.md` → `12_coding_rules.md` → `13_credits_and_legal.md`
2. Wait for user high-fi assets before implementation; review `content/` first
3. Keep working on branch / PR as appropriate; prefer `develop` as base when merging

## Suggested first message in a new Cursor chat

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Branch: cursor/defs-consistency-pass-d990.
Next: write defs/11_testing_strategy.md (then 12–13).
Do not start feature coding until I finish asset review; I will supply high-fi graphics.
```
