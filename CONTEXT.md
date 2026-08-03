# Dopamine

Frontend-only web arcade game that satirizes the attention economy by making the player survive on constant stimulation across competing fictional digital services.

## Language

**Match**:
One continuous play session from entering **Playing** (after Start Page PLAY and Loading) until Dopamine reaches zero. There are no stages, checkpoints, or victory — only survival until loss. At Match start (during Loading), one Minigame is chosen at random and kept for the whole Match.
_Avoid_: Round, run (as the canonical doc term — informal speech may still say these)

**Dopamine**:
The player's sole survival resource — their need for constant stimulation. It rises from successful actions and Focus Chains, and depletes constantly via passive drain only — never by direct penalty subtraction. The Match ends when it reaches zero. UI: vertical bar that shifts **orange (full, radioactive glow)** → **violet (empty)**. It is not health, lives, mana, or energy.
_Avoid_: Health, lives, energy, mana; direct Dopamine penalties

**Player**:
The person at the controls, inhabiting the addicted agent who must keep seeking stimulation by switching focus across windows. Survival comes from continuous attention-seeking, not from mastering one activity.
_Avoid_: Observer, manager, operator (of someone else's addiction)

**Start Page**:
Pre-Match hub (global game state): title, brief how-to-play, Accessibility Mode toggle, credits, and PLAY. English system UI. No Dopamine drain. Feel in `09_game_feel.md`; state machine in `02_gameplay_core.md`.
_Avoid_: Instant boot into Playing with no options

**Loading**:
Splash + starter-pack preload after PLAY / PLAY AGAIN. Validates manifests, picks Minigame and layout shuffle, then transitions to Playing. Details in `02` / `08`.
_Avoid_: Treating Loading as the Start Page; long installer-style waits

**Accessibility Mode**:
Start Page toggle that reduces motion intensity (shake/heavy pulse) while keeping stickers and information readable.

**Gameplay Window**:
An independent, always-running attention competitor (the selected Minigame, Loop, Pulse, Wave, or Echo). Windows never pause each other. Alerts are not a permanent window; they overlay on top.
_Avoid_: App, tab, panel (as the domain term)

**Minigame**:
One of three programmed arcade activities (Lane Defender, Block Cascade, Endless Runner). At match start exactly one is chosen at random and stays for the whole match until the player loses.
_Avoid_: Mode, level, stage (for the minigame selection)

**Loop**:
Short-form vertical video stream. Fast, frequent, small rewards; strong novelty temptation.
_Avoid_: TikTok, Reels, Shorts

**Pulse**:
Microblogging social network — trends, outrage, validation, engagement farming.
_Avoid_: Twitter, X, Bluesky

**Wave**:
Music streaming with continuous background audio. **Discovery** = novelty of unheard tracks (skips / new recommendations). **Anticipation** = staying with a track waiting for Song Moment / beat drop. Occasional recommendations and song moments compete for attention.
_Avoid_: Spotify, Apple Music; conflating Discovery with Anticipation

**Echo**:
Long-form video and podcasts — slower, persistent background consumption with sparse high-value moments.
_Avoid_: YouTube, podcast apps

**Alerts**:
OS-style notifications that float above the layout and interrupt. The only element allowed to overlap other windows. Not a permanent layout slot.
_Avoid_: System notifications (as a branded OS imitation)

**Anticipation Bonus**:
Dopamine from waiting for an expected payoff while already engaged (e.g. Wave beat drop, Echo highlight). Distinct from Discovery.
_Avoid_: Using Anticipation for skip-to-new-song novelty

**Discovery Bonus**:
Dopamine from encountering content that has not played yet this Match (especially Wave skips onto unheard tracks). Distinct from Anticipation.
_Avoid_: Using Discovery for waiting-for-the-drop tension

**Desktop Layout**:
Masonry playfield beside a persistent vertical Dopamine bar (default right): top band is Minigame beside Loop-over-Wave (equal height, fill masonry width); bottom band is Pulse | Echo. Other HUD (score, Focus Chain, Burnout telegraph, combo `xN`) are event stickers — combo over Active Window. Small gutters; no internal gaps. Details in `07_layout.md`.

**Mobile Layout**:
Three permanent windows: Minigame plus two randomly chosen from Loop/Pulse/Wave/Echo, stacked with the same size priorities and gutters. Dopamine stays a persistent edge meter; other readouts are stickers. Alerts still overlay. Details in `07_layout.md`.

**Focus Chain**:
Skill expression from doing a few valid actions across many windows in succession, especially when a window is demanding attention (Attention Request / notification). Rewards timed switching, not farming one window. The continue-window starts generous and **shortens as the chain grows**. Celebrated with old-arcade style message stickers/overlays (not quiet UI chrome).
_Avoid_: Treating Focus Chain as the same system as Combo/Multiplier

**Burnout**:
Optional high-intensity boost entered by sustained high APM. While active the player must keep APM up and receives bonus Dopamine. Modifies Playing; does not replace it. Ends into Recovery. After each Burnout→Recovery cycle, the minimum APM required for the next Burnout permanently increases for the rest of the Match.
_Avoid_: Rage mode, frenzy (unless later defined as distinct)

**Burnout Telegraph**:
A readable warning sticker that current APM is approaching the Burnout threshold, so the player can ease off (save Burnout for later) or push harder to enter it. Visual/audio language belongs in `09_game_feel.md`.
_Avoid_: Surprise Burnout with no approach signal

**Recovery**:
State immediately after Burnout where gaining/keeping Dopamine is harder (faster drain and related penalties). Burnout cannot retrigger until Recovery ends. Completing Recovery raises the next Burnout APM threshold.
_Avoid_: Cooldown (as the domain name for this state)

**Active Window**:
The window currently receiving meaningful gameplay interaction. Hover or bare keyboard focus alone does not change it; valid interactions and window-navigation shortcuts do.
_Avoid_: Focused window, hovered window

**Combo / Multiplier**:
Arcade-style successive-action feedback shown as stickers like `x2` / `x7!!` over the Active Window. Distinct from Focus Chain. Visual intensity should flatten (“get more boring”) as diminishing returns kick in for staying in the same window — still readable, less juicy. Feel details in `09_game_feel.md`.
_Avoid_: Using "combo" as a synonym for Focus Chain; permanent combo chrome in the HUD bar

**Window Art**:
Caricaturesque, simple graphics for Loop/Pulse/Wave/Echo/Alerts — readable as a stylized computer screen, not high-fidelity UI clones.
_Avoid_: Photoreal OS/app chrome, brand-accurate platform UI

**Minigame Art**:
Over-the-top arcade presentation for the selected minigame — exaggerated arcade feedback, particles, and spectacle versus the simpler window chrome.
_Avoid_: Matching the flat “desktop window” look for the playfield

**TDD**:
After documentation is finished, implementation proceeds test-driven: write a failing test for the intended behavior, then the minimal code to pass, then refactor. Documentation-first, then TDD — not the reverse.
_Avoid_: Tests-after, coverage-only testing (as the delivery method)

**Content Pack**:
The Match’s resolved library of Loop clips, Pulse posts, Wave tracks, Echo items, and Alert templates. Must be validated and preloaded in `Loading` before `Playing`. Local authoring root: `content/<window>/`.
_Avoid_: Streaming uncleared commercial catalogs; starting a Match with missing media
