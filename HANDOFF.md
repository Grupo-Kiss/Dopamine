# Handoff — continue Dopamine docs/dev in a new chat

Use this file so you don’t need the old long thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- Work branch: `cursor/defs-consistency-pass-d990` (PR toward `develop`)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Specs: `defs/00` … `defs/09` (next: refresh `00`, then `10_tech` → `13`)
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. Match ends when **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop: masonry Minigame | Loop-over-Wave + Pulse|Echo, Dopamine vertical bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window), combo stickers with boredom curve, Burnout→Recovery (escalating APM). Three minigames all built; one random per Match. Docs first, then **TDD**.

## Done this arc

- Setup Matt Pocock skills + grill-with-docs
- Consistency pass on early defs; `05`–`09` written
- Mid-fi mockups: `content/mockups/*.svg`
- Starter icons/minigame SVGs
- APIs documented (Pixabay/Pexels/Jamendo); local-first

## Next asks for the new agent

1. Refresh `defs/00_IMPLEMENTATION_GUIDE.md` (pinned)
2. Continue `10_tech.md` → `13_credits_and_legal.md`
3. Wait for user high-fi assets before implementation; review `content/` first
4. Keep working on branch / PR as appropriate; prefer `develop` as base when merging

## Suggested first message in a new Cursor chat

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Branch: cursor/defs-consistency-pass-d990.
Next: refresh defs/00_IMPLEMENTATION_GUIDE.md, then write 10_tech.md.
Do not start feature coding until I finish asset review; I will supply high-fi graphics.
```
