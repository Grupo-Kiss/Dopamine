# Design Pins

Short reminders. Remove when done.

## Before development (your review)

- [ ] Review **all assets** before coding starts: `content/icons/`, `content/mockups/`, `content/minigames/` starters
- [ ] You will supply **high-fidelity graphics** (specs to develop + ready-to-use files) — drop into the paths in `09_game_feel.md` / `08_content.md`
- [ ] Replace or approve mid-fi mockups in `content/mockups/`

## Docs review pass

- [x] `00_IMPLEMENTATION_GUIDE.md` — re-populated for current structure (`content/`, Start Page, mockups, SSOT)
- [x] Spot-check `01`–`09` vs `CONTEXT.md` (Focus Chain quality tiers; `Y`=Echo / `R`=Repost; Start Page state; Discovery ≠ Anticipation)

## Next docs

- [x] `10_tech.md`
- [x] `11_testing_strategy.md`
- [x] `12_coding_rules.md`
- [ ] `13_credits_and_legal.md`

## Later development

- [ ] **You:** populate `.env` / `.env.local` with provider keys when enabling APIs (`PIXABAY_API_KEY`, `PEXELS_API_KEY`, `JAMENDO_CLIENT_ID` per `10_tech.md` / `08`) — never commit secrets; keep providers `enabled: false` until keys + legal OK
- Pulse ~100 template posts (`content/pulse/posts.json`)
- SFX + `burnout_grunge.png` where listed in `09`
- APIs (Pixabay/Pexels/Jamendo) only with keys + legal OK
- Create empty drop dirs if missing: `content/wave/high|boring`, `loop/clips`, `echo/audio|video`, `minigames/_shared/`

## Ongoing

- Never direct Dopamine removal
- Balance numbers provisional; ease-in early Match
- TDD after docs (`docs/adr/0001-tdd-after-docs.md`) — process locked in `00`; `11` is the coverage map
- Conscious call on brand-adjacent palette hexes in `09` (Pulse/Wave) before high-fi lock
- Discovery (unheard novelty) ≠ Anticipation (waiting for payoff) — keep separate in code/tests
