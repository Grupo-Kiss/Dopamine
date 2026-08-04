# Handoff — continue Dopamine docs/dev in a new chat

Use this file so you don’t need the old long thread.

## Repo / branch

- Repo: `Grupo-Kiss/Dopamine`
- Work branch: `cursor/defs-consistency-pass-d990` (PR toward `develop`)
- Glossary: `CONTEXT.md`
- Pins: `defs/_PINS.md`
- Specs: `defs/00` … `defs/13` — planned documentation series complete
- Content drop zones: `content/` (icons, mockups, minigames, loop/pulse/wave/echo/alerts)

## Product (one paragraph)

Frontend-only web arcade satire of the attention economy. Match ends when **Dopamine** hits 0 (passive drain only — never direct penalties). Desktop: masonry Minigame | Loop-over-Wave + Pulse|Echo, Dopamine vertical bar (orange full → violet empty + glow). Mobile: Minigame + 2 random service windows. Focus Chain (decaying continue-window; Focus Ready improves quality but is not required), combo stickers with boredom curve, Burnout→Recovery (escalating APM). Wave: **Discovery** (unheard tracks) ≠ **Anticipation** (wait for beat drop). Three minigames **all specified / must ship**; one random per Match. Docs first, then **TDD**. Stack: Vite + TS + React + canvas + Web Audio. Credits = **modal** from Start/Game Over links (`13`).

## Done this arc

- Full defs `00`–`13` + glossary + pins + mid-fi mockups / starter assets
- Docs tidy pass: Credits Modal, Discovery/Anticipation slips, Loop Focus Ready, playlists, etc.
- `.env` + legal checklist pinned for you

## Next asks for the new agent

1. **Do not start feature coding** until user finishes asset review and supplies high-fi graphics
2. After assets: scaffold per `10` / `11` / `12` (Vitest first, state machine, …)
3. Prefer `develop` as merge base

## Suggested first message

```
Continue Dopamine from @HANDOFF.md and @CONTEXT.md and @defs/_PINS.md.
Branch: cursor/defs-consistency-pass-d990.
Docs 00–13 complete. Wait for my high-fi asset review before scaffolding/coding.
```
