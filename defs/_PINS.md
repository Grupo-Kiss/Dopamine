# Design Pins

Short reminders agreed during design that belong in a later doc. Remove each pin when the owning document absorbs it.

## For `09_game_feel.md`

- **Burnout Telegraph:** when APM approaches the current Burnout threshold, show a clear arcade-readable warning so the player can ease off (save Burnout) or push to enter it. Threshold ratio constant: `BURNOUT_TELEGRAPH_APM_RATIO` in `06_balance.md`. Sticker-style overlay, not permanent HUD chrome.
- Arcade multipliers for successive actions as Active-Window stickers (`x2`, `x7!!`); Focus Chain uses old-arcade message overlays/stickers.
- **Combo boredom curve:** combo stickers must feel progressively flatter/more boring as diminishing returns apply for staying in the same window — reward is still shown, juice drops.
- Dual art: caricaturesque simple windows vs over-the-top minigame spectacle.
- Persistent Dopamine = vertical edge bar; almost everything else = ephemeral stickers.
- Splash screen: short, branded; must not feel like a long install.

## For later development

- **Pulse posts library:** author a large `content/pulse/posts.json` (and trends/users) after generators are working — explicitly deferred.
- Review/replace SVGs in `content/icons/`.
- Enable Pixabay/Pexels/Jamendo only with keys + legal check (`08_content.md`); Jamendo commercial use needs clearance.

## Ongoing review

- **Negative Gain:** Dopamine is never removed directly — re-check if any future mechanic tempts a penalty exception (`02_gameplay_core.md`).
- **Balance numbers:** all values in `06_balance.md` are provisional; retune by playtest with an ease-in early Match.
