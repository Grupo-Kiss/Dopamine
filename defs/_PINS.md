# Design Pins

Short reminders. Remove when done.

## Visual asset pass (current)

- [ ] **Opus agent** executes `defs/14_visual_assets.md` phases A→E; **owner** approves (owner does not hand-draw)
- [ ] Model: Claude Opus 5 (thinking high/xhigh) — not Composer (no vision), not Muse Spark
- [ ] Pause after Phase A (hub screens) unless owner says continue
- [ ] No Vite scaffold / feature code until assets approved
- [ ] Lock Pulse blue / Wave green hexes in `DESIGN.md` when finalized in Phase C
- Visual lock: `PRODUCT.md`, `DESIGN.md`, `.impeccable/` (Collider-inspired blooms; no track-line detector UI)
- Burnout/Recovery: agent may ship provisional overlays from mid-fi + stage language; owner can replace later

## Before coding (after assets)

- [ ] Owner signed acceptance checklist at bottom of `14_visual_assets.md`
- [ ] Hi-fi present under `content/mockups/`, `content/ui/`, `content/icons/`, `content/minigames/`

## Defs series

- [x] `00`–`13` planned defs complete
- [x] `14_visual_assets.md` — Opus production brief for all views / windows / sprites
- [x] Closed stale PRs #1 / #5; design lock on `develop` via #6

## Later development

- [ ] **You:** populate `.env` / `.env.local` when enabling APIs — never commit secrets; providers `enabled: false` until keys + legal OK
- [ ] Run human checklist in `13_credits_and_legal.md` before release / before enabling APIs
- [x] Pulse ~100 template posts (`content/pulse/posts.json` + users/trends/seeds) — expand/tune in playtest
- SFX `.ogg` lists in `09` / `14` out-of-scope note
- APIs (Pixabay/Pexels/Jamendo) only with keys + legal OK
- Create empty media dirs if missing: `content/wave/high|boring`, `loop/clips`, `echo/audio|video`

## Ongoing

- Never direct Dopamine removal
- Balance numbers provisional; ease-in early Match
- TDD after docs (`docs/adr/0001-tdd-after-docs.md`)
- Discovery ≠ Anticipation
- Credits = modal from hub links
- No real-platform logos or identifiable UI clones
- Arcade refs: Broforce / Kung Fury / Metal Slug / Mortal Kombat punch — not cute-childish shell
- Shell refs: GitHub dark + violet; per-window skins keep their own grammar
