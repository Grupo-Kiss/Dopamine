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

- Product name: **Dopamine** (string must be a single tunable; owner may rename later).
- Voice: arcade-first satire with punchy retro-action energy (Broforce / Kung Fury / Metal Slug / Mortal Kombat) — not cute/childish. Not a traditional website or corporate-minimal look; energizing hierarchy.
- Shell UI: dark, structured chrome in the vein of GitHub’s dark landing (violet glows, calm panels) carrying the arcade layer on top.
- Shared stage: dark theme; soft **animated grid** (cursor-reactive glow patches; not concentric rings); **blurred glowing gradient blooms** in the background (with gentle motion); content in OS-window chrome; a **subtle full-screen CRT overlay** (scanlines + tube vignette/convex glass + lo-fi noise) above all UI — never localized onto controls.
- Start Page: CTA-first dopamine rush (learn by doing); brief how-to / Accessibility / Credits stay low-contrast in corners; title + PLAY carry the punch; surface may itself be framed as a window. Prefer Phosphor-like tight structure with Pinball-like name/CTA impact — without stiff mono CTAs or childish lamp clutter. Credits Modal uses the **same OS window chrome** as the Start window over a dimmed stage.
- Playing: Active Window uses a highlighted outer glow (slight animation); stage chaos is intentional. Each window keeps its own skin (Wave follows Spotify-like dark player grammar without real logos/wordmarks).
- Accessibility Mode is **reduced motion only** (per `defs/09`) — not a light-theme switch unless the owner later decides otherwise.
- Any third-party or stock-platform media must remain attributable; attribution lives in the Credits Modal (and credits data model in `defs/13_credits_and_legal.md`).
- Rejected flavors while searching the world: heavy CRT nostalgia, childish pinball clutter, stiff phosphor-only CTAs, corporate website plainness.
- **Locked visual world (Start Page establishes):** Collider Attention Display as *inspiration* — bloom energy on a GitHub-dark violet stage with an interactive grid — **not** a literal particle-detector UI. **No track lines / concentric ring diagrams.** Start Page stays sparse (title + PLAY lead; secondary UI quiet in corners). Quality bar: `.impeccable/quality-bar/particle-detector-event-display.webp`.

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
