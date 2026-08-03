# Design Pins

Short reminders agreed during design that belong in a later doc. Remove each pin when the owning document absorbs it.

## For `09_game_feel.md`

- **Burnout Telegraph:** when APM approaches the current Burnout threshold, show a clear arcade-readable warning so the player can ease off (save Burnout) or push to enter it. Threshold ratio constant: `BURNOUT_TELEGRAPH_APM_RATIO` in `06_balance.md`.
- Arcade multipliers for successive actions; Focus Chain uses old-arcade message overlays.
- Dual art: caricaturesque simple windows vs over-the-top minigame spectacle.

## Ongoing review

- **Negative Gain:** Dopamine is never removed directly — re-check if any future mechanic tempts a penalty exception (`02_gameplay_core.md`).
- **Balance numbers:** all values in `06_balance.md` are provisional; retune by playtest with an ease-in early Match.
