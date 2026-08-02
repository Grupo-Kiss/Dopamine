# Gameplay Minigames Specification

## Minigame Philosophy

Every play session selects one minigame.

The selected minigame remains active for the entire Match.

The minigame never changes during a Match.

When the player loses the Match (Dopamine reaches zero), a new minigame is randomly selected for the next Match.

The player may receive the same minigame multiple Matches in a row.

## Input System

### Lane Defender and Endless Runner

1 = Left lane

2 = Center lane

3 = Right lane

### Block Cascade

← = Move Left

→ = Move Right

↑ = Rotate

↓ = Soft Drop

---

## Lane Defender

### Purpose

Lane Defender is a fast-paced arcade shooter.

The player constantly switches between lanes while shooting enemies and collecting upgrades.

The game is intentionally simple.

Its purpose is generating continuous micro-decisions while competing for attention with the other gameplay windows.

---

### Camera

Fixed top-down view.

The player is positioned at the bottom of the playfield.

Three lanes extend toward the top of the screen.

Enemies, Hazards and Pickups spawn at the far end of the lanes and move toward the player.

The camera never moves or zooms.

---

### Controls

#### Desktop

- Mouse movement changes lane.
- Shooting is fully automatic.

#### Mobile

- Tap a lane to move.
- Shooting is fully automatic.

The player only controls lane selection.

Removing manual shooting allows the player to divide attention between gameplay windows.

---

### Playfield

The playfield contains three lanes.

Left

Center

Right

The player always occupies exactly one lane.

Changing lanes is instantaneous.

---

### Core Loop

Enemies continuously advance toward the player.

The player must:

- destroy enemies
- avoid hazards
- collect upgrades

The game has no stages.

It continues forever.

---

### Enemy Types

#### Normal Enemy

Moves toward the player.

Destroyed with one hit.

---

#### Boss

Appears periodically.

Occupies multiple lanes visually.

Has significantly more health.

Creates a strong visual Attention Request inside the minigame.

Defeating a Boss grants:

- large Score
- large Dopamine
- temporary score multiplier

The game immediately continues after the Boss.

---

### Hazard Types

Hazards occupy lanes like enemies.

Unlike enemies, Hazards display a numeric counter.

Negative values indicate remaining shots required.

Examples:

Mine

Explodes when activated.

Destroys nearby enemies.

Barrier

Starts with a negative counter.

Every shot increases the counter.

Example:

-8

↓

-7

↓

...

↓

0

↓

+1

↓

+2

If the Barrier reaches the player while still negative:

The player loses the minigame.

If the Barrier reaches the player with a positive value:

It blocks that many enemies before disappearing.

Hazards intentionally create short-term tactical decisions.

---

### Pickups

Examples:

Score Multiplier

Rapid Fire

Piercing Shot

Wide Shot

Temporary Shield

Magnet

Pickups disappear after a short duration.

---

### Failure

If an enemy reaches the player:

- the minigame immediately resets

The global game does NOT end.

The following remain unchanged:

- Score
- Dopamine
- Difficulty
- Burnout
- Focus Chain

Only the internal state of the minigame restarts.

---

### Numeric Indicators

Numeric indicators are a universal visual language.

They are used for:

- Boss health
- Hazard state
- Upgrade levels
- Temporary effects

Positive values use positive colors.

Negative values use negative colors.

The player should immediately understand whether a value represents danger or opportunity.

Numeric values must always remain readable.

Scaling should prioritize gameplay clarity over realism.

Large values should never clutter the interface.

---

### Difficulty Scaling

Difficulty increases by:

- enemy density
- enemy movement speed
- Boss frequency
- Hazard frequency
- Pickup frequency
- Numeric indicators

Enemy density is the primary difficulty mechanic.

The game should gradually evolve from isolated enemies into dense streams requiring upgraded weapons.


Numeric values/indicators also scale with global difficulty.

This includes:

- Boss health
- Hazard counters
- Upgrade effectiveness
- Enemy density

Scaling should remain gradual.

Numeric values should increase slowly enough that upgraded weapons remain meaningful throughout the Match.

---

### Attention Requests

Bosses.

Large upgrade drops.

Rare pickups.

These events should visually compete with every other gameplay window.

---

### Focus Chain

Entering the minigame may begin or extend a Focus Chain.

Remaining inside too long gradually reduces reward efficiency.

Leaving and returning later is encouraged.

---

### Burnout

During Burnout:

- more enemies
- more pickups
- more bosses

Reward density increases significantly.

---

### Visual Feedback

Normal enemies produce minimal feedback.

Examples:

- tiny hit flash
- small explosion
- subtle particle burst

Normal gameplay should remain visually readable even with hundreds of enemies.

Only significant events may compete for attention.

Examples:

- Boss appears
- Boss defeated
- Rare Pickup
- Large Combo
- Focus Chain completion

These events receive exaggerated arcade feedback.

---

### Audio Feedback

Enemy hit

Enemy destroyed

Boss warning

Boss defeated

Pickup collected

These sounds are specified in 09_game_feel.md.

---

### Acceptance Criteria

Implementation satisfies this specification if:

- gameplay is endless
- three lanes exist
- enemies continuously spawn
- hazards reward precision
- bosses create high-intensity moments
- failure only resets the minigame

---

## Block Cascade

### Purpose

Block Cascade is an endless block-stacking puzzle inspired by classic falling block games like Tetris.

Its purpose is creating periodic bursts of attention rather than continuous action.

Unlike Lane Defender, this minigame alternates between calm planning and urgent decision making.

---

### Camera

Fixed top-down playfield.

The entire board is always visible.

No camera movement.

---

### Controls

#### Desktop

- Move piece left
- Move piece right
- Rotate
- Soft drop

#### Mobile

- Swipe left/right
- Tap to rotate
- Swipe down for soft drop

No hard drop mechanic.

The player should never need extremely high precision.

---

### Board

Standard rectangular playfield.

Pieces spawn continuously.

There are no levels.

The game is endless.

---

### Core Loop

The player places pieces.

Completing horizontal lines removes them.

New pieces immediately appear.

The game never pauses.

---

### Piece Types

Use the seven classic tetrominoes.

Piece probabilities should remain balanced.

No special pieces.

---

### Line Clear

Removing lines grants:

- Score
- Dopamine

Rewards increase with:

- multiple simultaneous lines
- Focus Chain
- active multipliers

---

### Overflow

If pieces reach the top:

The minigame immediately resets.

The global game continues unchanged.

---

### Difficulty Scaling

Difficulty increases by:

- falling speed
- piece frequency

The increase should remain gradual.

The player should survive for several minutes before the highest speeds are reached.

---

### Attention Requests

Examples:

- nearly completed line
- multiple line opportunity
- long piece appears
- rare perfect placement

These naturally compete for attention with the other gameplay windows.

---

### Focus Chain

Leaving Block Cascade for a short time is often safe.

Leaving for too long creates risk.

Returning at the correct moment creates valuable Focus Chains.

---

### Burnout

During Burnout:

- pieces fall faster
- line rewards increase
- score multipliers increase

Controls never change.

---

### Visual Feedback

Single line clears:

minimal feedback.

Double or greater:

moderate arcade feedback.

Four-line clears:

major visual event.

Only major clears should compete with the other gameplay windows.

---

### Audio Feedback

Piece placed.

Rotation.

Line clear.

Four-line clear.

Game reset.

Detailed audio rules are defined in 09_game_feel.md.

---

### Acceptance Criteria

The implementation satisfies this specification if:

- gameplay is endless
- pieces continuously spawn
- overflow only resets the minigame
- difficulty scales gradually
- high-value line clears generate meaningful rewards

---

## Endless Runner

### Purpose

Endless Runner is a continuous obstacle avoidance game.

Its purpose is creating rapid movement decisions while demanding very little cognitive effort.

Unlike Lane Defender, the player focuses on survival instead of combat.

---

### Camera

Fixed third-person camera.

The player continuously runs toward the horizon.

The camera never rotates.

The player always remains near the bottom of the playfield.

---

### Controls

#### Desktop

- Left lane
- Center lane
- Right lane

#### Mobile

- Swipe left
- Swipe right

The player constantly moves forward automatically.

---

### Playfield

Three lanes.

The environment scrolls toward the player.

Objects continuously spawn ahead.

The game never ends.

---

### Core Loop

Avoid obstacles.

Collect rewards.

Continue running.

Objects become denser over time.

---

### Obstacle Types

Static obstacle.

Moving obstacle.

Gap.

Every obstacle occupies one or more lanes.

Touching any obstacle immediately resets the minigame.

---

### Collectibles

Coins.

Score multipliers.

Temporary shield.

Magnet.

Rare pickup.

Collectibles disappear after a short duration.

---

### Difficulty Scaling

Difficulty increases through:

- running speed
- obstacle density
- collectible density

The player should constantly make lane-change decisions.

---

### Attention Requests

Examples:

Rare pickup.

Large coin trail.

Temporary multiplier.

Shield.

These moments should tempt the player to temporarily ignore other gameplay windows.

---

### Focus Chain

Because movement is continuous, leaving the runner even briefly creates risk.

Returning at the correct moment produces valuable Focus Chains.

---

### Burnout

During Burnout:

- speed increases
- pickups become more frequent
- score multipliers become larger

The player experiences intense pressure with proportionally larger rewards.

---

### Visual Feedback

Ordinary collectibles produce minimal feedback.

Rare collectibles produce:

- particles
- screen flash
- multiplier animation

Only significant rewards should compete with the other gameplay windows.

---

### Audio Feedback

Jump is intentionally omitted.

Only:

- lane change
- collectible
- collision
- rare pickup

Detailed rules belong in 09_game_feel.md.

---

### Failure

Colliding with any obstacle immediately resets the minigame.

The global game continues unchanged.

Only the runner state resets.

---

### Acceptance Criteria

The implementation satisfies this specification if:

- running is endless
- movement is automatic
- only lane selection is controlled
- collisions only reset the minigame
- difficulty scales continuously
- rare pickups create meaningful attention conflicts
