# Dopamine

## Purpose

**Dopamine** is a frontend-only web arcade game that satirizes the attention economy, social media, and modern dopamine addiction.

The game intentionally overwhelms the player with simultaneous sources of stimulation, rewarding constant context switching rather than mastery of a single activity.

The player survives by continuously seeking stimulation. When stimulation stops, boredom wins.

---

## Vision

The game should initially feel exciting, rewarding and satisfying.

As the session progresses it should become increasingly exhausting, noisy and chaotic without ever becoming unfair.

The satire should emerge naturally from gameplay rather than explicit narration.

The player should eventually realize they have been conditioned into the exact behavior the game criticizes.

---

## Design Pillars

### 1. Attention is the main resource

The player is not managing health, mana or energy.

The primary resource is **dopamine**, representing the player's need for constant stimulation.

Everything in the game exists to compete for the player's attention.

---

### 2. Constant context switching

The optimal strategy is never remaining focused on one activity.

The game rewards switching between different activities at the appropriate moment.

The player should constantly feel that something else deserves immediate attention.

---

### 3. Controlled chaos

The interface should appear overwhelming without becoming unreadable.

Every window should feel alive.

At almost every moment:

- something moves
- something animates
- something requests attention
- something can be rewarded

Despite the visual chaos, gameplay must always remain understandable.

---

### 4. Positive reinforcement over punishment

The game should avoid frequent direct punishment.

Failure should feel dramatic and meaningful when it happens.

Instead, it should constantly reward desirable behavior.

Players should voluntarily develop addictive habits because those habits are consistently rewarded.

---

### 5. Escalating stimulation

Difficulty should increase through pressure, not complexity.

Difficulty should increase primarily by increasing the frequency of events rather than making interactions mechanically harder.

As the game progresses:

- events occur more frequently
- visual effects become more intense
- audio becomes denser
- opportunities become more numerous

The player gradually loses the ability to comfortably process everything.

---

### 6. Arcade first

The game should always feel like an arcade game.

Every meaningful interaction should produce satisfying feedback.

Examples include:

- score popups
- combo indicators
- particles
- screen shake
- flashes
- scaling animations
- satisfying sounds
- multiplier effects

---

### 7. Satire through exaggeration

Every system should exaggerate behaviors commonly found on modern digital platforms.

Examples:

- ragebait
- endless scrolling
- notification anxiety
- trending topics
- engagement farming
- fake urgency
- algorithmic recommendations
- clickbait
- brainrot content
- productivity obsession

Nothing should feel realistic.

Everything should feel intentionally excessive.

---

## Target Session Length

There is no time limit.

A match ends only when Dopamine reaches zero.

Session duration depends on player skill and system balance.

---

## Platform

Primary platform:

Desktop web browser.

Secondary platform:

Mobile web browser.

The game must function without installation.

No account system.

No login.

No backend.

No database.

### Desktop Layout

Five permanent windows at once: the selected Minigame plus Loop, Pulse, Wave, and Echo. Alerts overlay on top and are not a permanent layout slot.

### Mobile Layout

Three permanent windows at once: the selected Minigame plus two other gameplay windows chosen at random from Loop, Pulse, Wave, and Echo. Alerts still overlay on top when they appear.

Full visual arrangement details belong in `07_layout.md`.

---

## Technical Scope

The project must remain intentionally small.

Priorities:

- fast loading
- responsive controls
- keyboard accessibility
- consistent shortcut system
- maintainable architecture
- modular systems
- frontend only

The project should be deployable as static files to any common web hosting provider.

---

## Art Direction

Style:

- stylized
- cartoon
- colorful
- expressive
- exaggerated

Avoid:

- photorealism
- realistic lighting
- realistic proportions
- realistic physics

Visual feedback is more important than visual fidelity.

Detailed split between clean window UI, arcade stickers, and minigame spectacle (including Lane Defender / Endless Runner / Block Cascade art direction) lives in `09_game_feel.md`.

---

## Audio Direction

Audio should constantly reinforce stimulation.

Every system may generate audio feedback.

The final audio mix should intentionally become increasingly dense during long sessions.

Audio priority and mixing rules are defined in 09_game_feel.md.

The overall mix should intentionally become increasingly dense during long sessions.

Silence should only exist after Game Over.

That silence should feel dramatic.

---

## Player Fantasy

The player should gradually become:

- distracted
- reactive
- impulsive
- reward-seeking
- unable to comfortably ignore notifications

Without noticing, they should optimize their behavior around maximizing stimulation rather than enjoying any individual activity.

---

## Core Experience

The player experience should be:

1. Discover stimulation.
2. Switch attention rapidly.
3. Receive immediate rewards.
4. Handle increasing pressure.
5. Lose dramatically when stimulation is no longer maintained.
6. Restart immediately.

The game loop must communicate this without requiring explanation.

---

## Success Criteria

The project is successful if:

- the gameplay is immediately understandable
- the player constantly changes focus
- the interface feels alive
- the player experiences increasing mental overload
- the satire is communicated through gameplay rather than dialogue
- every match naturally produces memorable moments
- replayability emerges from system interaction rather than scripted content
- the game remains lightweight and deployable as a static frontend application
