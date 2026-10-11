# Design Pins

Short reminders. Remove when done.

## Visual asset pass (current)

- [x] **Opus agent** executes `defs/14_visual_assets.md` phases A→E; **owner** approves (owner does not hand-draw)
- [x] Model: Claude Opus 5 (thinking high/xhigh) — not Composer (no vision), not Muse Spark
- [x] Phase A approved by owner (hub surfaces + shared OS chrome kit, PR #8)
- [x] Phase B3/B4/B5 shipped — Dopamine bar, arcade stickers, Burnout/Recovery overlays
- [x] Phase C shipped — Loop/Pulse/Wave/Echo/Alerts chrome kits + solo mockups
- [x] Phase D shipped — six window icons + 128px PNG exports
- [x] Phase E shipped — shared cast/FX/numbers + all three minigame sprite sets, boards and playfield mockups
- [x] **Phase B1/B2 shipped** — `content/mockups/desktop_layout.svg|webp` + `mobile_layout.svg|webp` (PR #15)
- [x] Phases A→E owner-accepted (wrap visual stage; PRs #8 + #14 + #15)
- **Generators live in `tools/artgen/`** — see its README. `npm run minigames` / `npm run layouts` / `npm run verify`.
- [x] Locked Pulse `#2f81f7` / Wave `#2ee07a` in `DESIGN.md`; propagated to `09` and `14`
- Visual lock: `PRODUCT.md`, `DESIGN.md`, `.impeccable/` (Collider-inspired blooms; no track-line detector UI)
- Burnout/Recovery: agent may ship provisional overlays from mid-fi + stage language; owner can replace later
- **Minigame runtime is asset-agnostic.** Game code loads sprites/textures/skins through manifests and stable ids (`content/minigames/<id>/…`). Do not hard-code art dimensions, palette, or cutout construction into gameplay logic — a later version will re-style the minigames. Swap files + manifests; keep behaviours.
- **Board laid out; implement task-by-task under TDD.** Do not jump into a Vite scaffold dump — follow [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158) / packs in `docs/agents/effort-model-map.md` (`docs/adr/0001-tdd-after-docs.md`).

### Decisions taken during the Phase B→E pass (flag if you disagree)

- **Echo icon** is an echoing play wedge, not a framed play button on red. The framed version read as one specific real video platform; the brief forbids clones (`13`).
- **Minigame frame accent** is now neutral slate `#93a1b2` in the palette, matching “Neutral dark stroke” in `09`. It previously held a green that competed with Wave.
- **Layout slot fitting** cover-fits and top-anchors each authored window interior, then fades the cut edge in that window's own skin. Overflow reads as a panel that scrolls further rather than as clipping, and nothing is stretched.
- **Burnout / Recovery overlays** weight their vignette and grit toward the frame edges. A full-frame wash made the playfield unreadable, which `09` forbids. Still marked PROVISIONAL.
- **Wave** shows its Discovery badge **spent** while Anticipation is live, so the mockup does not imply the two systems run together (`Discovery ≠ Anticipation`).
- **Minigame mockups are review sheets, not viewport comps.** Each is a window showing the letterboxed playfield plus a captioned rail of every shipped sprite, because the sprite set is the thing being signed off here — the full-viewport read belongs to B1/B2.
- **Pickups are told apart by glyph, not hue.** Six saturated hues would not survive the Burnout grade, so each pickup carries a distinct mark on one shared bevelled tile.
- **Desktop layout keeps `07`'s 60/40 split and 8px gutters.** Each window interior sits in its slot at a fixed scale chosen so the row it can't lose survives (Loop's clip progress, Wave's transport, Echo's reactions). Pulse is the one allowed to run off the bottom, because a feed reads as scrolling on.
- **Lane Defender letterboxes with retro-neon pillar bars** (not plain black, not an extension of the play world). Authored 3:4 board stays centred; leftover width is an Outrun-style neon city + perspective grid so the slot keeps arcade intensity.
- **Minigame cast is abstract cutouts, not cute mascots.** Visored helmet (no face), diamond mob with one optic slit, boss as an armored slab with LED slits + integrity plate. Owner overruled the earlier goofy Supercell-leaning soldier.
- **Mobile windows show panels of the desktop interior, not the whole thing shrunk.** At phone width the full interior would put body text near 5px. Each window shows clipped regions of its shipped interior instead: Loop's clip beside its info column, Wave's player half, Pulse's compose and post, and Echo's video and scrub. Nothing is redrawn.
- **Mobile Dopamine meter stays vertical on the right edge** (18px), matching desktop rather than moving to a top strip. Sheet shows it hot (82%) on one draw and cooling violet (30%) on the other.
- **Playing comps soften the CRT corner vignette** (to 55% strength). Playing screens put live UI in the corners (meter cap, bottom-band controls) that hub screens leave empty. Scanlines, aperture and noise are unchanged.
- **Only the Active Window glows.** Desktop: the Minigame, with the juicy `x7!!`. Mobile: the Minigame on one draw, and Pulse with a bored `x2` on the other, so the comps also show a service window taking focus and the combo boredom curve.
- **Brand fonts must be loaded for rasterization and the future app.** Missing Public Sans Medium/SemiBold made resvg fall back to a system serif — that was the "traditional fonts" look on mockups. Artgen now vendors Teko SemiBold + Public Sans Regular/Medium/SemiBold/Bold/ExtraBold under `tools/artgen/fonts/` (OFL). The game app should load the same faces (Google Fonts or self-host); never leave a serif in the fallback stack (`DESIGN.md`).
- **Block Cascade piece hexes moved off the starter neon** (`#00e5ff`/`#ff1744` etc.) onto softer saturations that sit beside Wave's dark-but-fun green without screaming. Flat fallbacks and the atlas order now live in `skin_blocks.json`.

### Deferred from Phase A review (do not fix mid-pass)

- [ ] **Wordmark kerning:** `P`→`A` in `content/brand/title-dopamine.*` reads too open. The letterforms use one uniform tracking value with no kerning pairs, and that gap compounds two receding shapes — `P`'s stem falls back under its bowl while `A`'s left diagonal leans away. Needs per-pair kerning on `P`→`A` (then audit `D`→`O`, `A`→`M`, `I`→`N`). Re-export the WebP from the SVG master after the fix.
- [ ] **Start Page floating stickers → animated:** owner keeps the background `x4` / `+120` / `CHAIN 3` / `x2` stickers but wants them to **pop in and fade out like arcade stickers** rather than sit static. They stay a quiet secondary background layer (well under the title + PLAY), reusing the Phase B combo/chain sticker motion language from `09_game_feel.md`. Motion is **feature code** — belongs in the TDD pass, not the asset pass. Must respect Accessibility Mode (opacity/colour transitions instead of pop + shake).

## Before coding (after assets)

- [x] Owner accepted visual stage (checklist in `14_visual_assets.md` — “good enough to build against”; restyle later is expected)
- [x] Hi-fi present under `content/ui/`, `content/icons/`, `content/minigames/`, `content/mockups/` (B1/B2 layout comps included)
- [x] **Epic / task board laid out** (GitHub Issues) for MVP under TDD — [#158](https://github.com/Grupo-Kiss/Dopamine/issues/158); `docs/agents/mvp-board.md` + `tools/issue-board/`; effort/model packs in `docs/agents/effort-model-map.md`
- [ ] Scaffold Vite + TS + React + Vitest + pnpm; first failing tests at **E00.T01** (#19), pack **P1** (effort M)

## Defs series

- [x] `00`–`13` planned defs complete
- [x] `14_visual_assets.md` — Opus production brief for all views / windows / sprites
- [x] Closed stale PRs #1 / #5; design lock on `develop` via #6

## Later development

- [ ] **You:** populate `.env` / `.env.local` when enabling APIs — never commit secrets; providers `enabled: false` until keys + legal OK
- [ ] Run human checklist in `13_credits_and_legal.md` before release / before enabling APIs
- [x] Pulse ~100 template posts (`content/pulse/posts.json` + users/trends/seeds) — expand/tune in playtest
- [x] SFX production brief + owner decisions: `defs/15_sfx_audio.md` (generate local `.ogg` after #8; Freesound/CC0 fallback; Wave = high techno + boring slower)
- APIs (Pixabay/Pexels/Jamendo) only with keys + legal OK
- [x] Create empty media dirs: `content/wave/high|boring`, `loop/clips`, `echo/audio|video` (+ empty manifests)
- Credits store scaffold: `content/credits/store.json` (append rows when media/SFX land)

## Ongoing

- Never direct Dopamine removal
- Balance numbers provisional; ease-in early Match
- TDD after docs (`docs/adr/0001-tdd-after-docs.md`)
- Discovery ≠ Anticipation
- Credits = modal from hub links
- No real-platform logos or identifiable UI clones
- Arcade refs: Broforce / Kung Fury / Metal Slug / Mortal Kombat punch — not cute-childish shell
- Shell refs: GitHub dark + violet; per-window skins keep their own grammar
