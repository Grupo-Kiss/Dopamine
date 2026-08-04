# Difficulty Specification

## Purpose

Difficulty controls the overall intensity of the Match.

It never changes gameplay rules.

Instead, it continuously increases the frequency, urgency and overlap of gameplay events.

The player should feel progressively overwhelmed without feeling cheated.

Difficulty should increase smoothly throughout the entire Match.

There are no discrete levels.

There are no difficulty transitions.

Only continuous escalation.

Exact numeric curves and intervals belong in `06_balance.md`.

---

## Difficulty Variables

Difficulty modifies global systems.

Examples include:

- Dopamine drain
- Event frequency
- Attention Request / FOMO-like urgency frequency
- Notification frequency
- Minigame intensity
- Visual stimulation
- Audio density

Difficulty never changes player controls.

Difficulty never changes gameplay rules.

Difficulty never changes scoring formulas.

---

## Continuous Scaling

Difficulty starts at its minimum value.

It continuously increases during gameplay.

The increase is smooth.

The player should never notice a specific moment where the game becomes harder.

Instead they should slowly realize:

"There is too much happening."

---

## Event Frequency

Every gameplay window owns its own Event Generator.

Difficulty modifies the interval between generated events.

Example:

Early Match — Loop — new interesting event every 10 seconds.

Late Match — new interesting event every 4 seconds.

(Illustrative only; authoritative intervals live in `06_balance.md`.)

The same principle applies independently to every gameplay window.

---

## Simultaneous Events

Difficulty should not only increase event frequency.

It should also increase event overlap.

Example:

Early Match — one window requests attention.

Late Match — three or four windows simultaneously request attention.

This creates natural decision making.

The player cannot satisfy everything.

---

## Window Competition

As difficulty increases, windows compete more aggressively.

Examples:

Loop requests attention.

At the same moment:

Pulse receives a mention.

Wave recommends a new track.

An Alert appears.

The minigame spawns additional enemies.

The player must prioritize.

No single correct decision exists.

---

## Visual Escalation

Difficulty gradually increases visual stimulation.

Possible variables include:

- particle density
- animation frequency
- UI movement
- reward effects
- screen activity

The interface should feel increasingly alive.

Never visually broken.

Window chrome stays caricaturesque and readable; minigame spectacle may escalate more aggressively. Detailed art rules belong in `09_game_feel.md` and related content docs.

---

## Audio Escalation

Difficulty also increases audio density.

Examples:

- more notification sounds
- more reward sounds
- more overlapping music layers
- more ambient interface sounds

Audio should contribute to cognitive overload.

---

## Information Density

Difficulty should increase the amount of information competing for attention.

Not simply the speed.

Examples — more of:

- notifications
- mentions
- likes
- recommendations
- enemies
- opportunities

Rather than only faster animations.

The player should lose because they cannot process everything.

Not because they cannot physically react.

---

## Difficulty And Focus Chain

Difficulty indirectly increases Focus Chain value.

Higher event density creates more opportunities for intelligent attention switching.

Focus Chain mechanics themselves never change.

---

## Difficulty And Burnout

Higher difficulty naturally makes Burnout easier to enter because the player performs more actions.

Burnout APM thresholds never decrease during a Match.

After every completed Burnout→Recovery cycle, the minimum APM required to enter the next Burnout permanently increases for the remainder of the Match.

Only player activity determines Burnout activation.

Difficulty scaling and Burnout threshold escalation are independent systems that both increase pressure over a long Match.

---

## Difficulty And Dopamine

Difficulty continuously increases passive Dopamine drain.

This forces the player to:

- optimize routes
- improve Focus Chains
- utilize Burnout efficiently

Without increasing mechanical complexity.

Difficulty never applies direct Dopamine penalties.

---

## Difficulty Ceiling

Difficulty should never become mathematically impossible.

The game should remain theoretically survivable indefinitely by an expert player.

The limiting factor should always be human attention.

Not unavoidable system failure.

---

## Acceptance Criteria

The implementation satisfies this specification if:

- Difficulty scales continuously.
- No gameplay rules change.
- Only event density and related pressure change.
- Cognitive load increases naturally.
- Expert players can theoretically survive indefinitely.
- Failure results from attention overload rather than unfair mechanics.
- No discrete difficulty levels or sudden transitions exist.
