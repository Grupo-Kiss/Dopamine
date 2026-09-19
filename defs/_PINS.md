# Design Pins

Short reminders. Remove when done.

## Before development (asset gate)

- [ ] **Agent** produces hi-fi graphics into paths in `09_game_feel.md` / `08_content.md`; **owner** reviews and approves (owner is not hand-drawing)
- [ ] Replace or approve mid-fi mockups in `content/mockups/`
- [ ] Start with **screen hi-fi mockups**, then roll down (windows → HUD → minigames → media) — full checklist in `09`
- [ ] Prefer Cursor Cloud Agent + **Impeccable** (see `PRODUCT.md` / `DESIGN.md` / `.impeccable/`) over ad-hoc image dumps; keep one-off gen prompts out of the repo
- [ ] Visual lock already salvaged from closed PR #5 — Collider-inspired bloom on GitHub-dark violet stage; sparse Start Page; no track-line detector UI

## Defs series

- [x] `00`–`13` planned defs complete
- [x] Docs tidy pass (Credits Modal; Discovery≠Anticipation slips; Loop Focus Ready; Wave queue vs playlist; structure sync)
- [x] Closed stale PRs #1 (skills on `develop`) and #5 (prototype not merged; design lock kept)

## Later development

- [ ] **You:** populate `.env` / `.env.local` with provider keys when enabling APIs (`PIXABAY_API_KEY`, `PEXELS_API_KEY`, `JAMENDO_CLIENT_ID` per `10_tech.md` / `08`) — never commit secrets; keep providers `enabled: false` until keys + legal OK
- [ ] Run human checklist in `13_credits_and_legal.md` before release / before enabling APIs
- Pulse ~100 template posts (`content/pulse/posts.json`)
- SFX + `burnout_grunge.png` where listed in `09`
- APIs (Pixabay/Pexels/Jamendo) only with keys + legal OK
- Create empty drop dirs if missing: `content/wave/high|boring`, `loop/clips`, `echo/audio|video`, `minigames/_shared/`
- [ ] **Burnout overlay + Recovery overlay:** defer design; owner will supply **external visual references** before those surfaces are designed (do not invent their look from mid-fi alone)

## Ongoing

- Never direct Dopamine removal
- Balance numbers provisional; ease-in early Match
- TDD after docs (`docs/adr/0001-tdd-after-docs.md`) — process locked in `00`; `11` is the coverage map
- Conscious call on brand-adjacent palette hexes in `09` (Pulse/Wave) before high-fi lock
- Discovery (unheard novelty) ≠ Anticipation (waiting for payoff) — keep separate in code/tests
- Credits = modal from hub links (not a full-page dump)
- **Cross-surface look:** dark stage; soft grid; blurred glowing gradient blooms; OS-window chrome; subtle CRT overlay; Start Page framed as a window; PLAY/title dominate
- **Arcade layer refs:** Broforce, Kung Fury, Metal Slug, Mortal Kombat — punchy retro-action, not cute/childish
- **Shell UI refs:** GitHub dark landing — structured dark chrome + violet glows
- **Per-window skins:** each window keeps its own grammar (Wave ≈ Spotify-like dark player — style only, no logos/wordmarks)
- **Tunables home:** game title string and balance numbers in one easy-to-find config area — default **Dopamine**
