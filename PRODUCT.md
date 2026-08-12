# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Casual browser / itch.io–style arcade players who want a short, chaotic satire session. They are not a productivity-tool audience and not a native-app audience. In play they inhabit an addicted agent who must keep seeking stimulation across competing fictional digital services.

## Product Purpose

**Dopamine** is a frontend-only web arcade game that satirizes the attention economy. A Match runs from Playing until Dopamine reaches zero. Survival comes from continuous stimulation-seeking: frequent, meaningful interaction with multiple always-running windows (one Minigame plus Loop, Pulse, Wave, Echo; Alerts overlay). Success is lasting under escalating pressure; there is no victory condition.

## Positioning

Neighboring arcade or idle games cannot truthfully claim this mechanism: the player must **act often across parody attention services**, not merely switch focus or master one activity. Valid interactions, Focus Chains, and timed responses to Attention Requests drive reward; passive watching alone fails because Dopamine only drains passively and never by direct penalty subtraction. Satire emerges from gameplay conditioning, not narration.

## Operating Context

- Browser session, no install, no account/login/backend/database; deployable as static files.
- Flow: Boot → Start Page → Loading → Playing ⇄ Burnout → Recovery → Game Over → PLAY AGAIN or hub.
- Desktop masonry: Minigame | Loop-over-Wave + Pulse|Echo beside a persistent vertical Dopamine bar. Mobile: Minigame + two random service windows.
- Domain language is pinned in `CONTEXT.md` (Match, Dopamine, Gameplay Window, Focus Chain, Burnout/Recovery, Discovery vs Anticipation, etc.).
- Process: documentation-first, then TDD (`docs/adr/0001-tdd-after-docs.md`). Planned stack: Vite + TypeScript + React + Canvas 2D minigames + Web Audio (`defs/10_tech.md`).

## Capabilities and Constraints

- Frontend only; English system UI; Accessibility Mode persists locally and reduces motion intensity while keeping information readable.
- Three minigames (Lane Defender, Block Cascade, Endless Runner) all ship; one is chosen at random per Match.
- Content packs validate and preload in Loading before Playing; optional media APIs default off; secrets never committed.
- No real-platform branding or identifiable UI clones; fictional services only (Loop, Pulse, Wave, Echo, Alerts).
- Credits are a scrollable modal from Start Page / Game Over — not a full-page dump and not in-Match watermark bars.
- Open: hi-fi brand-adjacent palette lock (Pulse/Wave) and final balance numbers remain provisional per defs pins.

## Brand Commitments

- Product name: **Dopamine**.
- Voice: arcade-first satire through exaggeration; stylized, cartoon, colorful, expressive — not photorealistic OS/app clones.
- Any third-party or stock-platform media must remain attributable; attribution lives in the Credits Modal (and credits data model in `defs/13_credits_and_legal.md`).

## Evidence on Hand

- Specs and glossary: `CONTEXT.md`, `HANDOFF.md`, `defs/00`–`13`, `defs/_PINS.md`.
- Working mid-fi under `content/` (icons, mockups, minigame starters, window drop zones).
- **Approved for forward work:** produce hi-fi UI and graphics as far as needed for design and implementation; treat them as working assets the owner may replace later. Do not fabricate testimonials, press, customers, or licensing claims.
- Stock/API media, when later included, must carry license + attribution into the credits store so the Credits Modal can declare them.

## Product Principles

1. **Frequent action, not idle focus** — reward valid interactions across windows; context-switching without activity is not the skill.
2. **Attention is the resource** — Dopamine is stimulation need; it drains passively only; never subtract it as a direct penalty.
3. **Controlled chaos** — overwhelm without unreadability; every window feels alive while gameplay stays understandable.
4. **Positive reinforcement over punishment** — condition addictive habits through reward; failure is rare and dramatic.
5. **Parody with clean legal surfaces** — exaggerate platform behaviors without real brands; keep attribution reachable whenever third-party assets appear.
