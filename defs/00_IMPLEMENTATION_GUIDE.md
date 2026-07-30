**Read this file first.**

Then read the remaining documents in the specified order.

Do not begin implementation before reading every specification.

00_IMPLEMENTATION_GUIDE.md

01_project.md

02_gameplay_core.md
    - Game states
    - Dopamine
    - Focus Chain
    - Burnout
    - Scoring

03_gameplay_windows.md
    - Loop
    - Pulse
    - Wave
    - Echo
    - Alerts

04_gameplay_minigames.md

05_difficulty.md

06_balance.md

07_layout.md

08_content.md

09_game_feel.md

10_tech.md

11_testing_strategy.md

12_coding_rules.md

13_credits_and_legal.md


## Naming Convention

The project intentionally avoids using the names, branding, icons, logos or identifiable UI of existing platforms.

All gameplay systems use fictional services.

Current mapping:

- Loop: short-form videos
- Pulse: microblogging social network
- Wave: music streaming
- Echo: long-form video and podcasts
- Alerts: operating system notifications

The goal is parody, not imitation.

The implementation must remain legally distinct from any existing platform.

## Single Source of Truth

Every gameplay rule must exist in only one document.

Avoid duplicating gameplay rules across multiple files.

If a rule changes, update the defining document instead of copying the change elsewhere.

Document responsibilities:

- Gameplay Core: global gameplay rules.
- Gameplay Windows: individual window behavior.
- Gameplay Minigames: minigame mechanics.
- Difficulty: global scaling.
- Balance: numerical values only.
- Layout: visual arrangement only.
- Content: assets and media.
- Game Feel: visual/audio feedback.
- Tech: implementation details.
- Testing: validation requirements.

## Implementation Priority

The project should be implemented in this order:

1. Core game loop
2. Dopamine system
3. Focus Chain
4. One complete minigame
5. Window systems
6. Difficulty scaling
7. Visual effects
8. Audio
9. Content expansion

Do not implement advanced visual polish before gameplay systems are functional.


# Project Structure

The implementation should follow this structure:

src/

├── core/
│   ├── gameState/
│   ├── dopamine/
│   ├── scoring/
│   ├── difficulty/
│   └── events/

├── windows/
│   ├── Loop/
│   ├── Pulse/
│   ├── Wave/
│   ├── Echo/
│   └── Alerts/

├── minigames/
│   ├── lane_runner/
│   ├── arcade_shooter/
│   └── block_puzzle/

├── components/
│   ├── HUD/
│   ├── Layout/
│   └── Effects/

├── assets/

│   ├── audio/
│   ├── video/
│   ├── images/
│   └── data/

├── tests/

└── utils/


## Legal Requirements

The implementation must include a credits system.

Credits must be accessible from:

- initial splash screen
- Game Over screen
- settings/about section if implemented

All third-party assets must have attribution data stored.

All legal and attribution details are specified in: 13_credits_and_legal.md