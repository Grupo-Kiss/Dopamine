# Gameplay Core Specification

## Purpose

This document defines every global gameplay system.

It is the authoritative specification for gameplay behavior.

If another document contradicts this one, this document takes precedence.

This document intentionally avoids implementation details.

---

## Core Gameplay Philosophy

The player is constantly surrounded by competing sources of stimulation.

The game never forces the player to interact with any particular window.

Instead, every system continuously attempts to attract the player's attention.

The optimal strategy emerges naturally from the interaction between systems rather than being explicitly instructed.

There is no mandatory gameplay loop.

Every mechanic is optional.

The player chooses where to focus.

The challenge comes from deciding what to ignore.

However, mastering optional mechanics produces significantly better scores and longer survival.

---

## Match Structure

A match begins immediately after pressing PLAY.

No countdown is shown.

One minigame is randomly selected.

The remaining windows are initialized.

The Dopamine meter starts full.

Difficulty starts at its minimum value.

Score starts at zero.

All gameplay windows begin in the Normal state.

Focus Chain starts at zero.

Burnout state starts inactive.

The match continues indefinitely until Dopamine reaches zero.

There are no stages.

There are no checkpoints.

There is no victory condition.

The only ending condition is losing.

---

## Competing Priorities

Multiple gameplay systems may simultaneously request attention.

The game never pauses any system.

The player is expected to prioritize.

Missing one opportunity is preferable to trying to complete everything.

The core experience is making impossible attention-allocation decisions.

---

## Gameplay Layers

Gameplay is composed of independent systems running simultaneously.

These layers include:

- Minigame
- Gameplay Windows
- Alerts HUD
- Dopamine System
- Difficulty System
- Focus Chain
- Burnout

No gameplay layer pauses another.

Every layer progresses independently unless explicitly specified otherwise.

---

## Global Gameplay States

The game always exists in exactly one of the following states.

### Loading

Responsibilities

- show a short splash screen
- validate required content manifests
- preload a **starter pack** (~first couple of Match minutes) — see `08_content.md`
- initialize systems
- generate random session values

The player cannot interact with gameplay yet.

After transition to Playing, remaining content continues loading in the background.

Transition

Loading (splash)

↓

Playing

---

### Playing

Default gameplay state.

All gameplay systems remain active.

Difficulty increases continuously.

Every gameplay mechanic may occur.

Transitions

Playing

↓

Burnout

Playing

↓

Game Over

All windows continuously evaluate whether to request the player's attention.

---

### Burnout

A temporary high-intensity gameplay state.

Burnout is optional.

The player may complete an entire match without entering Burnout.

Entering Burnout is determined exclusively by sustained Actions Per Minute (APM).

The minimum APM threshold starts at a base value and permanently increases after every completed Burnout→Recovery cycle for the remainder of the Match.

Burnout does not replace Playing.

It modifies Playing.

All gameplay systems continue functioning.

Additional visual, audio and scoring modifiers become active.

The player must receive a Burnout Telegraph when APM approaches the current threshold so they can ease off or push in. Telegraph presentation is defined in `09_game_feel.md`.

Burnout automatically ends when player APM falls below the required threshold for a configurable period.

After Burnout ends:

the Recovery state begins immediately.

Burnout affects every gameplay system simultaneously.

Individual windows may react differently according to their own specifications.

---

### Recovery

Temporary state immediately following Burnout.

Purpose

Represent mental fatigue after overstimulation.

Effects

- Dopamine drains faster.
- Burnout cannot immediately trigger again.
- Visual intensity decreases.
- Audio gradually returns to normal.

Recovery duration is fixed.

Recovery automatically transitions back to Playing.

After every completed Recovery:

The APM required to trigger the next Burnout permanently increases for the remainder of the match.

Example

Burnout 1

requires 80 APM

↓

Recovery

↓

Burnout 2

requires 100 APM

↓

Recovery

↓

Burnout 3

requires 125 APM

Actual values are defined inside `06_balance.md`.

---

### Game Over

Triggered immediately when Dopamine reaches zero.

All gameplay systems stop.

The final rendered frame remains visible during the dramatic pause.

All audio stops.

Animations stop.

Notifications disappear.

The player avatar turns off the device.

The interface immediately loses all stimulation.

Silence should feel uncomfortable.

After a dramatic pause:

Display

- Survival Time
- Final Score
- Highest Combo
- Longest Focus Chain
- Burnouts Triggered

A large PLAY AGAIN button appears.

The button slowly becomes more visually demanding if ignored.

Examples

- grows
- pulses
- glows
- shakes

The satire intentionally encourages immediate replay.

---

## Dopamine System

Dopamine is the player's primary survival resource.

Maximum value is defined in `06_balance.md`.

Minimum value is zero.

The match immediately ends when Dopamine reaches zero.

There is no health system.

There is no life system.

There is no energy system.

Only Dopamine determines survival.

---

### Passive Drain

Dopamine constantly decreases.

Drain never stops.

Drain speed continuously increases during the match.

The increase is smooth.

Never discrete.

Difficulty controls the drain multiplier.

---

### Positive Gain

Dopamine increases only through successful player interaction.

Different interactions reward different amounts.

Every gameplay window owns an independent reward table.

Remaining inside a single window continuously reduces its reward efficiency.

Changing attention between different gameplay systems generally restores reward efficiency.

Exact reward values are defined in `06_balance.md`.

---

### Diminishing Returns

Repeated interactions with the same target provide progressively smaller rewards.

The purpose is preventing repetitive farming strategies.

The first interaction provides the highest reward.

Subsequent identical interactions reduce efficiency.

The reduction follows a logarithmic curve.

The reward never becomes negative.

The reward approaches zero asymptotically.

Changing the target or interacting with a different system resets reward efficiency.

This rule applies globally to every gameplay window.

Examples:

- Repeated Likes on the same content.
- Repeatedly skipping without consuming content.
- Repeatedly interacting with the same element.
- Repeated actions intended only to farm rewards.

---

### Anticipation Bonus

Anticipation Bonus represents dopamine generated by expecting a future reward.

The player receives increasing excitement while searching, waiting or expecting a valuable outcome.

Examples:

- Skipping songs searching for the ideal track.
- Waiting for a highlighted moment in Echo.
- Waiting for engagement on Pulse.
- Searching for valuable content in Loop.

Anticipation Bonus increases through repeated attempts.

The increase follows a logarithmic curve.

The reward is temporary and resets when:

- the expected reward is obtained;
- the player changes activity;
- the opportunity expires.

Anticipation Bonus must never exceed direct interaction rewards.

Its purpose is creating psychological tension, not replacing gameplay rewards.

---

### Negative Gain

The game never removes Dopamine directly.

Failing to interact simply allows passive drain to continue.

The player should feel they are failing because they stopped earning stimulation rather than because the game punished them.

This distinction is extremely important.

_Pinned for ongoing review:_ if a future mechanic seems to need a direct Dopamine penalty, challenge it against this rule before adding an exception.

---

## Focus Chain System

### Purpose

Focus Chain is the primary skill expression mechanic.

It rewards intelligent attention switching rather than raw interaction speed.

The system encourages the player to continuously redistribute attention across the interface instead of remaining focused on a single activity.

Focus Chain is completely optional.

A player may ignore it entirely.

However, efficient use of Focus Chain dramatically increases score, Dopamine generation and long-term survival.

---

### Definitions

#### Active Window

The window currently receiving player interaction.

Examples

- clicking inside a window
- pressing keys assigned to that window
- scrolling
- dragging
- typing

The active window changes immediately when the player performs an interaction inside another gameplay window.

Simply moving the mouse over another window does not change the active window.

Keyboard focus alone does not change the active window.

Only meaningful gameplay interaction changes focus.

---

#### Focus Change

A Focus Change occurs whenever:

Current Active Window

≠

New Active Window

and

The interaction performed is considered valid.

Invalid interactions never change Focus Chain.

---

#### Valid Interaction

A valid interaction is any action capable of producing gameplay consequences.

Examples

Minigame

- movement
- shooting
- placing blocks
- jumping

Loop

- next video
- like
- comment
- share

Pulse

- publish
- reply
- like
- repost

Wave

- skip
- like
- playlist interaction

Echo

- playback interaction

Alerts

- opening
- dismissing
- accepting reward

Pure UI interactions never count.

Examples

- resizing window
- clicking empty space
- dragging outside components

---

### Window Reward Cooldown

Every gameplay window owns an independent Reward Cooldown.

Purpose

Prevent repeatedly alternating between only two windows.

Example

Loop

↓

Pulse

↓

Loop

↓

Pulse

↓

Loop

This should not generate an infinite Focus Chain.

Each window only becomes "Focus Ready" after its Reward Cooldown expires.

Reward Cooldown begins immediately after leaving that window.

Cooldown durations are defined in `06_balance.md`.

---

### Focus Ready

A window is considered Focus Ready when:

- its Reward Cooldown has expired
- it is not currently active

Only Focus Ready windows may extend Focus Chain.

#### Focus Ready Visual Indicator

A Focus Ready window must communicate its state visually.

The indicator must be subtle.

The game should never explicitly explain its meaning.

Examples may include:

- soft glow
- border pulse
- brief shimmer
- animated highlight
- tiny particle effect

The visual should become recognizable only after repeated play.

The player should gradually learn that these windows are currently the most rewarding targets.

---

### Building Focus Chain

Focus Chain increases by one when ALL conditions are true.

Condition 1

The player interacts with a different gameplay window.

Condition 2

The interaction is valid.

Condition 3

The destination window may be in one of the following states:

- Normal
- Focus Ready
- Attention Request

Every state may extend Focus Chain.

However, chain quality depends on the current state.

Normal

Base reward.

Focus Ready

Bonus reward.

Attention Request

Highest reward.

Condition 4

The interaction occurs before the current chain timeout expires.

If every condition is satisfied:

Focus Chain +1

Combo may increase.

Multipliers are recalculated.

Visual feedback is played.

Audio feedback is played.

Score bonus is granted.

Dopamine bonus is granted.

---

### Chain Timeout

Focus Chain cannot remain active indefinitely.

Every successful Focus Change refreshes a timer for the **next** Focus Change.

The continue-window starts generous at low chain lengths and **decreases as the chain grows**, down to a minimum floor (values in `06_balance.md`).

If the timer expires:

Focus Chain immediately resets to zero.

The early steps should feel readable; long chains should feel urgently paced.

---

### Breaking Focus Chain

Focus Chain immediately resets when:

- timeout expires
- the player remains too long in one window
- the player repeatedly farms a window before its Reward Cooldown ends
- Game Over occurs

Burnout does NOT break Focus Chain.

Recovery does NOT break Focus Chain.

---

### Chain Quality

Not every Focus Change has equal value.

The game should distinguish between:

Poor

Good

Excellent

Perfect

Quality depends on:

- timing
- destination
- reward cooldown
- current difficulty

Quality affects:

- score bonus
- dopamine bonus
- visual intensity

Exact values belong in `06_balance.md`.

---

### Visual Progression

Focus Chain should always feel visible.

Higher chains progressively increase visual excitement.

Examples

Chain 3

Small popup.

Chain 5

Particles.

Chain 10

Screen flash.

Chain 15

Camera shake.

Chain 20+

Special color treatment.

The player should immediately recognize they are entering a highly rewarding state.

---

### Audio Progression

Every successful Focus Chain step plays feedback.

Longer chains progressively enhance audio.

Examples

- higher pitch
- additional layers
- stronger impact sounds

Feedback should never become annoying.

Instead it should become increasingly satisfying.

---

### Relationship With Dopamine

Focus Chain is the main Dopamine generation multiplier.

Normal interactions provide small Dopamine rewards.

Focus Chain increases the value of successful interactions.

Higher Focus Chains generate increasingly larger Dopamine rewards.

When a Focus Chain ends after reaching the minimum required length, the player receives a Chain Completion Bonus.

The Chain Completion Bonus grants:

- Dopamine
- Score
- Arcade feedback

The player should discover that surviving only through individual interactions becomes progressively harder.

Long-term survival requires efficient Focus Chain management.

---

### Relationship With Burnout

Focus Chain remains active during Burnout.

Burnout increases the rewards generated by Focus Chain.

Focus Chain is one of the fastest ways to maximize Burnout score.

Burnout never guarantees high Focus Chains.

Likewise, high Focus Chains never guarantee Burnout.

Both systems are independent but complementary.

---

### Relationship With Difficulty

Increasing difficulty never changes Focus Chain rules.

Instead it indirectly increases difficulty by:

- creating more simultaneous opportunities
- increasing event frequency
- increasing attention demand

The mechanic remains predictable.

Only the environment becomes more chaotic.

---

### Player Learning

The player should gradually discover that:

switching attention

>

staying focused

without the game explicitly explaining this strategy.

The mechanic should feel discovered rather than taught.

---

### Chain Completion Bonus

When Focus Chain ends after reaching at least the minimum configurable length, the player immediately receives a Completion Bonus.

Purpose

Reward maintaining long chains.

The reward is granted only once.

Completion Bonus includes:

- Score
- Dopamine
- Arcade visual celebration

The reward should feel similar to "cashing out" a combo in classic arcade games.

Exact values belong in `06_balance.md`.

---

### Acceptance Criteria

The implementation satisfies this specification if:

- Focus Chain can always be calculated deterministically.
- Every interaction either increases, preserves or resets the chain.
- No ambiguous situations exist.
- Farming a single window is never optimal.
- Alternating between only two windows is suboptimal.
- Intelligent attention distribution consistently produces higher scores.
- Focus Chain remains readable through visual and audio feedback alone.

---

## Input System

### Purpose

The Input System defines all keyboard shortcuts and interaction rules.

Keyboard shortcuts exist to reward advanced players and improve efficiency.

Mouse and touch interactions remain fully supported.

Keyboard shortcuts must never be required to complete the game.

### Shortcut Philosophy

Shortcuts should:

- remain consistent across all systems
- use the same key for the same action whenever possible
- minimize hand movement
- reward mastery

The same action must always use the same shortcut.

Examples:

Like always uses L.

Next content always uses N.

Repost always uses R.

### Shortcut Priority

When multiple systems could receive the same input, priority order is:

1. Active text input
2. Active Alert
3. Active Window
4. Global Navigation

Examples:

If the player is writing a Pulse post:

Enter publishes the post.

It does not trigger another action.

If an Alert is visible:

Esc dismisses the Alert.

It does not cancel another operation.

### Window Navigation

Window navigation allows experienced players to rapidly switch focus.

Q = Loop

W = Pulse

E = Wave

R = Echo

T = Minigame

Changing window focus:

- updates the active window
- counts as a Focus Change
- follows normal Focus Chain rules

### Global Actions

#### Alert Interaction

A = Open the highest priority available Alert.

Esc = Dismiss the currently active Alert.

Alerts always have priority over normal window shortcuts.

---

#### Confirmation

Enter = Confirm the current action.

Examples:

- publish a Pulse post
- confirm a selection
- submit text input

---

### Window Actions

#### Loop

N = Next video

L = Like

R = Repost

---

#### Pulse

L = Like

R = Repost

C = Reply

P = Create Post

Enter = Publish

---

#### Wave

N = Next Song

L = Like Song

---

#### Echo

N = Next Content

L = React

S = Subscribe

---

#### Minigame Actions

Minigame-specific controls are defined in:

04_gameplay_minigames.md

Shared shortcuts should be reused whenever possible.

### Input Consistency Rule

New gameplay systems must reuse existing shortcuts.

New shortcuts should only be introduced when no existing shortcut can represent the action.

---

## Attention Model

Every gameplay window continuously requests attention.

Attention requests occur independently.

Each request belongs exclusively to its originating window.

The player chooses which requests deserve immediate response.

The game never explicitly recommends the correct decision.

Instead, the player gradually learns patterns that maximize reward.

This learning process is intended to mirror modern attention-driven digital platforms.

---

## Difficulty Overview

Difficulty scales continuously throughout a Match by increasing event density and pressure without changing gameplay rules.

Detailed progression rules live in `05_difficulty.md`.

Difficulty affects:

- passive Dopamine drain rate
- event frequency across all gameplay windows
- simultaneous event overlap and window competition
- visual stimulation density (particles, animation, UI movement)
- audio density (notifications, rewards, overlapping layers)
- information density (notifications, mentions, recommendations, enemies, opportunities)

Difficulty never changes player controls, gameplay rules, or scoring formulas. It should remain theoretically survivable indefinitely by an expert player; failure results from attention overload rather than unavoidable system failure.
