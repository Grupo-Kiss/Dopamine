# Gemini Canvas prompt — Dopamine hi-fi UI mockups

Copy everything below the line into Gemini Canvas. Ask it to generate **one screen at a time** (or a consistent set), desktop 16:9 and mobile 9:16 where noted. English UI only.

---

You are designing **high-fidelity UI/UX mockups** for a web arcade game called **Dopamine**.

## What the game is

**Dopamine** is a frontend-only browser arcade game that **satirizes the attention economy**. The player survives by constantly seeking stimulation across several fictional digital services that all run at once and compete for attention.

There is **no victory**. A play session is a **Match**: it starts after PLAY and ends only when the survival meter **Dopamine** hits zero. Dopamine drains passively all the time; successful actions and smart window-switching refill it. The game **never** subtracts Dopamine as a direct “damage” penalty — failure feels like boredom winning because you stopped earning stimulation.

The player is not a manager watching someone else; they **are** the addicted agent, hopping between windows.

Tone: **cute, colorful, readable satire** — exaggerated digital addiction, not grimdark depression. Arcade juice on feedback; clean caricature UI on the “desktop apps.”

Fictional services (do **NOT** use real brand names, logos, or identifiable UI clones of TikTok/Reels/Shorts, Twitter/X, Spotify, YouTube, etc.):

| Name | What it parodies (concept only) |
| --- | --- |
| **Loop** | Short-form vertical video feed |
| **Pulse** | Microblogging / outrage / trends |
| **Wave** | Music streaming player |
| **Echo** | Long-form video / podcasts |
| **Alerts** | Fake OS notifications (overlay only) |
| **Minigame** | One of three arcade games fills the biggest window |

## Core systems the UI must support (show in mockups where relevant)

1. **Dopamine bar** — persistent **vertical** meter on the screen edge (default **right**). Color shifts continuously: **orange + radioactive glow** when full/high → **violet/purple** when empty/low. Not a heart/HP bar; no “health” wording.
2. **Focus Chain** — skill of switching between windows with valid actions especially when a window is “calling” for attention. Celebrated with **big arcade stickers/banners**, not quiet HUD chrome.
3. **Combo `xN`** — separate from Focus Chain. Sticky arcade multiplier pops **over the Active Window**. Early hits look juicy; staying too long in one window makes combo visuals **flatter / more boring** but still readable.
4. **Burnout / Recovery** — optional high-APM boost (hotter, red vignette + grunge overlay) then sleepy Recovery (violet desaturated overlay). Show as overlay states on the playing layout.
5. **Active Window** — stronger border/glow in that window’s brand color. **Focus Ready** windows get a soft in-brand shimmer (subtle).
6. **Accessibility Mode** — toggle on Start Page; mockups can note “reduced motion” but still show full hi-fi for the default look.

## Look and feel (strict)

### Dual visual worlds

1. **Desktop / window chrome** — minimal, **rounded corners**, stroked borders, clean caricaturesque “fake apps.” Low visual density. Near-black stage/gutter background (`#0a0a0c` range) between windows.
2. **Arcade stickers / FX** — high energy (snappy squash/stretch pops like Balatro *motion energy*, **not** Balatro’s card art style). Event-only; don’t cover the whole UI in stickers permanently.
3. **Minigames** — cute Supercell-friendly toony for shooter/runner; dark modern harmonious Tetris-like board for Block Cascade. Higher spectacle **inside** the minigame slot only.

### Window brand palettes (use consistently)

| Window | Primary / feel | Accent |
| --- | --- | --- |
| Loop | Hot pink `#ff4d6d` → `#ff8fa3`, light playful feed | White / hot pink highlights |
| Pulse | Blue `#1da1f2` → `#6ec6ff`, clean microblog | White buttons on blue |
| Wave | **Dark player** chrome `#0b3d2e` + green `#1db954` | Green accents |
| Echo | Deep red `#990022` → `#ff0033` | White |
| Alerts | Orange `#f5a623` → `#f76b1c` | White |
| Minigame frame | Neutral dark stroke | Per-game; don’t steal Loop pink |
| Dopamine bar | Orange full → violet empty + glow | — |

Typography: expressive arcade for title/stickers; clean readable UI for window chrome. **No Inter/Roboto/Arial as the hero display.** English labels.

**Forbidden:** photoreal OS chrome, real platform logos/wordmarks, purple-on-white generic AI-slop gradients as the whole theme, dumping stats into the first hero of Start Page, card-grid dashboard look for the Start Page.

---

## Desktop Playing layout (must match exactly)

Viewport = masonry playfield + **Dopamine vertical bar on the right**.

**Top band:** Minigame column beside a stack of **Loop (taller) over Wave (shorter)**. Loop height + gutter + Wave height = Minigame height. Minigame ≈ 60% width of masonry; Loop/Wave column ≈ 40%.

**Bottom band:** **Pulse | Echo** side by side, full remaining width.

Small gutters (~8px) between windows; no empty gaps. Alerts and stickers **float above** — they do not resize the masonry.

ASCII reference:

```
+---------------------------+---+---------------------------+----+
|                           |   |           LOOP            | D  |
|        MINIGAME           |   |        (taller)           | O  |
|                           |   +---------------------------+ P  |
|                           |   |           WAVE            | A  |
|                           |   |        (smaller)          | M  |
+---------------------------+   +---------------------------+ I  |
|          PULSE            |   |           ECHO            | N  |
+---------------------------+---+---------------------------+ E  |
                                                            |bar |
```

Mobile: vertical stack — Minigame largest on top, then two random service windows; Dopamine still an edge meter.

---

## MOCKUPS TO GENERATE

Generate each as a separate high-fidelity mockup. Label filename suggestions. Show realistic fake content (fictional usernames, absurd satire posts, abstract video stills — no real celebs/brands).

### A. Product hubs

#### A1 — `start_page` (desktop + mobile)

Full first viewport as **one composition**, brand-first:

- Huge **DOPAMINE** title / logo treatment (arcade energy; brand must survive if you removed a nav)
- One short how-to line: survive by switching windows; Dopamine drains; Focus Chain rewards timed switching
- **Accessibility Mode** toggle (clear on/off)
- Text link **Credits** (does not show the full list on this page)
- Large primary **PLAY** button
- Atmospheric near-black / subtle pattern or gradient background — not flat white, not purple-AI default
- No stats strip, no schedule, no secondary marketing clutter

#### A2 — `credits_modal` (over Start Page)

- Dimmed Start Page visible behind
- Modal/dialog, scrollable
- Sections: Game blurb + authors; long list of third-party media (title, creator, license); Fonts/libraries; Provider notices; Satire disclaimer (“Not affiliated with any real platform”)
- Close control; feels like a link-opened overlay, not a separate website page

#### A3 — `splash_loading`

- Short arcade “cabinet boot” splash
- Bold title, light sticker motion cues, small window icons (Loop/Pulse/Wave/Echo)
- Subtle progress — must feel brief, not an installer with many steps

#### A4 — `game_over` (desktop + mobile)

- Frozen last-frame of play faintly behind OR held dramatic still
- Hard silence vibe (no busy animation density)
- Stats: Survival Time, Final Score, Highest Combo, Longest Focus Chain, Burnouts Triggered
- Huge **PLAY AGAIN** (can look slightly “demanding” — pulse/glow)
- Same secondary links as Start: short how-to reminder, Accessibility, **Credits**
- Not cheerful victory — boredom won

---

### B. Full playing layouts

#### B1 — `desktop_playing_default`

Full desktop layout as above with:

- Minigame = **Lane Defender** visible (see minigame section)
- Loop showing a vertical video + actions
- Wave dark compact player under Loop
- Pulse feed + Echo player on bottom
- Dopamine bar ~70% full (orange glow)
- One **Alert** floating top-right
- One combo sticker `x3!!` over Active Window (e.g. Loop)
- Optional small Focus Chain banner mid-pop
- All five permanent windows readable at once

#### B2 — `desktop_playing_shuffled`

Same rules but Minigame on the **right** of top band; Pulse/Echo swapped. Dopamine bar still right edge.

#### B3 — `mobile_playing`

Phone frame. Minigame top (largest). Two services below (show e.g. Loop + Wave, Loop above Wave). Dopamine edge meter. One alert overlay. Touch-friendly controls.

#### B4 — `desktop_burnout`

Same as B1 with Burnout feel: reddish vignette, semi-transparent colorized **grunge** overlay pulsating, hotter stickers, denser particles; Dopamine still visible.

#### B5 — `desktop_recovery`

Same layout with Recovery feel: violet/cooler vignette, desaturated app colors, quieter stickers, sleepy mood; Dopamine mid-low.

---

### C. Window close-ups (each window alone, hi-fi chrome + all actions visible)

Design each as a rounded, stroked “fake app” panel on near-black. Show **Active** state (stronger brand stroke). Label controls clearly.

#### C1 — `window_loop`

**Purpose:** endless short vertical video; fast small rewards.

**Visible chrome:**

- Vertical video area (abstract/cute still, not a real platform UI)
- Creator avatar + fictional `@handle`
- Title + hashtags
- Like count, comment count (comment count is display-only)
- Progress / scrub indicator for the looping clip
- Brand pink accents

**Player actions to show as controls (must be visible):**

| Action | UI |
| --- | --- |
| **Next video** | Primary control (also keyboard N in game — show icon/button) |
| **Like** | Heart/like control (L) |
| **Repost** | Repost control (R) — not a branded “share to Twitter” |

**Also show one Attention Request state variant** (badge/banner): e.g. “Interactive opportunity — reply to this sound” / limited-time highlight that’s hard to ignore, still on-brand pink.

#### C2 — `window_pulse`

**Purpose:** microblog — trends, ragebait, validation.

**Visible chrome:**

- Feed of short posts (3–5 fake satirical posts)
- Trending topics rail or chips (fictional trends)
- Compose area for a new post
- Blue clean microblog look

**Player actions to show:**

| Action | UI |
| --- | --- |
| **Like** | On a post |
| **Repost** | On a post |
| **Reply** | Reply affordance / open reply |
| **Create Post** | Compose + Publish |
| **Trend participation** | Tap/join a trend chip |

**Show one event state:** Mention / viral / ragebait Attention Request (e.g. “@you got mentioned” banner).

Mark one post as **ad/spam** visually distinct (no reward vibe) for satire.

#### C3 — `window_wave`

**Purpose:** always-on music; fewer clicks; discovery vs waiting for the drop.

**Visible chrome (dark player):**

- Abstract generated artwork / waveform
- Track title + artist (fictional)
- Playback cannot show a Pause that stops the stream for long — game rule: music keeps going; emphasize **Skip** and **Like**
- Compact height (smallest window)

**Player actions to show:**

| Action | UI |
| --- | --- |
| **Skip track** | Skip control (N) — discovery of new tracks |
| **Like track** | Like (L) — once per track |
| **Accept recommendation** | “Recommended for you” card / Attention Request CTA |

**Optional callouts in the mockup (labels, not clutter):**

- Discovery = skipping to an **unheard** track
- Anticipation = staying for **Song Moment / beat drop** (show a subtle “moment incoming” or chorus highlight on the waveform)

No playlist library UI — only queue / recommendations.

#### C4 — `window_echo`

**Purpose:** long-form video or podcast; sparse high-value moments.

**Visible chrome:**

- Large content stage (video frame OR audio-centric podcast art)
- Title, creator
- Timeline with a **highlighted moment** marker
- Red accent brand

**Player actions to show:**

| Action | UI |
| --- | --- |
| **Play / Pause** | Transport |
| **Change content** | Next item |
| **React** | Reaction control (funny / interesting / surprising / disagree — simple) |
| **Subscribe** | Subscribe CTA |

**Show Attention Request:** “Interesting moment — everyone is talking about this part” on the timeline.

Optional sponsor segment as muted satire noise (visually “ad,” not rewarding).

#### C5 — `window_alerts`

**Not a permanent layout slot** — floating cards over a dimmed fragment of the desktop layout.

Show a stack of 2–3 alert styles:

- Social (“Pulse mentioned you…”)
- Media (“New Loop sound…”)
- Fake system (“Storage almost full — delete memories?”) satire
- One spam alert (dismissible junk)

**Actions:** Open / Dismiss (and ignore = do nothing). Urgent orange branding. Must not fully block the minigame forever — place so Minigame stays partly visible.

---

### D. HUD / stickers / meter (detail sheets)

#### D1 — `dopamine_bar`

Two or three states side by side: full orange radioactive glow; mid blend; empty violet quiet. Vertical bar only. Label “Dopamine” not Health.

#### D2 — `stickers_combo`

Juicy `x2` / `x7!!` vs bored flat `x12` (same-window diminishing returns). Over a sample window corner.

#### D3 — `stickers_focus_chain`

Arcade banner style: “FOCUS CHAIN 8”, completion cash-out celebration variant.

#### D4 — `stickers_burnout_telegraph`

Warning that APM is near Burnout — readable, not a surprise.

---

### E. Minigame playfields (inside the minigame window frame)

Fixed aspect letterboxed in a dark frame; near-black letterbox OK. Cute, not grim. Bevelled simple 3D props where noted.

#### E1 — `minigame_lane_defender`

- Top-down, player at **bottom**, 3 lanes up
- Toony **cardboard-cutout** soldier + monsters
- Auto-shooting implied (projectiles)
- Hazards with numeric counters (mine / barrier)
- Pickup icons
- Boss spanning lanes as Attention Request spectacle
- Player only changes lanes (show 1/2/3 or lane highlight)

#### E2 — `minigame_endless_runner`

- Same art language as Lane (shared soldier OK)
- Auto-run forward; lane switch left/center/right
- Obstacles + collectibles + rare pickup
- Readable at small mobile size

#### E3 — `minigame_block_cascade`

- Dark modern board, bright tetrominoes, soft bevels
- Ghost piece optional
- Harmonious with Wave’s dark-but-fun energy
- Show controls hint: move / rotate / soft drop

---

## Output instructions for the model

1. Prefer **one mockup per response** for maximum fidelity, then continue through the list A→E.
2. Keep **visual identity consistent** across all screens (palette, corner radius, stroke weight, icon style).
3. Use only fictional brand marks for Loop/Pulse/Wave/Echo/Alerts/Dopamine.
4. Desktop playing mockups must remain **legible** with five windows + bar — avoid tiny unreadable text; caricature clarity over realism.
5. Start Page must pass the brand test: remove any nav chrome and it still reads as Dopamine.
6. Deliver images suitable as **hi-fi design references** for implementation (not wireframes).

When ready, begin with **A1 start_page (desktop)**, then **A1 mobile**, then **B1 desktop_playing_default**.
