# Dopamine

Frontend-only web arcade game that satirizes the attention economy by making the player survive on constant stimulation across competing fictional digital services.

## Language

**Match**:
One continuous play session from pressing PLAY until Dopamine reaches zero. There are no stages, checkpoints, or victory — only survival until loss. At Match start, one Minigame is chosen at random and kept for the whole Match.
_Avoid_: Round, run (as the canonical doc term — informal speech may still say these)

**Dopamine**:
The player's sole survival resource — their need for constant stimulation. It rises from successful actions and Focus Chains, and depletes constantly via passive drain only — never by direct penalty subtraction. The Match ends when it reaches zero. It is not health, lives, mana, or energy.
_Avoid_: Health, lives, energy, mana; direct Dopamine penalties

**Player**:
The person at the controls, inhabiting the addicted agent who must keep seeking stimulation by switching focus across windows. Survival comes from continuous attention-seeking, not from mastering one activity.
_Avoid_: Observer, manager, operator (of someone else's addiction)

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
Music streaming with continuous background audio, skip-discovery, and occasional song moments.
_Avoid_: Spotify, Apple Music

**Echo**:
Long-form video and podcasts — slower, persistent background consumption with sparse high-value moments.
_Avoid_: YouTube, podcast apps

**Alerts**:
OS-style notifications that float above the layout and interrupt. The only element allowed to overlap other windows. Not a permanent layout slot.
_Avoid_: System notifications (as a branded OS imitation)

**Desktop Layout**:
Masonry playfield beside a persistent vertical Dopamine bar (default right): top band is Minigame beside Loop-over-Wave (equal height, fill masonry width); bottom band is Pulse | Echo. Other HUD (score, Focus Chain, Burnout telegraph, combo `xN`) are event stickers — combo over Active Window. Small gutters; no internal gaps. Details in `07_layout.md`.

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
