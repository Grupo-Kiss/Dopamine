# Balance Specification

## Status

All numbers in this document are **provisional starter values**.

They exist so implementation and tests have concrete constants to bind to. They are **not** final canon.

Balance is tuned by **trial-and-error / playtest**. Prefer an early Match that **eases and lures** the player in; late-Match pressure may become theoretically harsh — do not front-load that harshness.

When a value changes after playtest, update **this file only** (SSOT for numbers). Gameplay rules stay in `02`–`05`.

Legend:

- **Starter** — initial guess safe to ship in first builds
- **From core example** — already cited illustratively in gameplay docs; promoted here as the authority
- **Tune** — expect to change soon

---

## Dopamine

| Constant | Starter | Notes |
| --- | ---: | --- |
| `DOPAMINE_MAX` | `100` | Full meter at Match start |
| `DOPAMINE_MIN` | `0` | Game Over at or below |
| `DOPAMINE_DRAIN_PER_SECOND_BASE` | `0.35` | Early Match; ease-in. **Tune** |
| `DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN` | `1.0` | At Match start |
| `DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX` | `3.0` | Soft ceiling; expert survivable. **Tune** |
| `DOPAMINE_DRAIN_RECOVERY_MULT` | `1.5` | Extra drain during Recovery. **Tune** |

Passive drain formula (conceptual):

`drainPerSecond = DOPAMINE_DRAIN_PER_SECOND_BASE × difficultyMult × (Recovery ? DOPAMINE_DRAIN_RECOVERY_MULT : 1)`

Difficulty mult scales smoothly from min → max over Match time (curve in Difficulty section). No discrete steps.

Direct Dopamine subtraction from failed actions: **never** (see Negative Gain in `02`).

---

## Diminishing Returns

Repeated identical interactions on the same target.

| Constant | Starter | Notes |
| --- | ---: | --- |
| `DIMINISH_FIRST_HIT_MULT` | `1.0` | First interaction full value |
| `DIMINISH_LOG_BASE` | `2` | Logarithmic falloff shape. **Tune** |
| `DIMINISH_FLOOR_MULT` | `0.05` | Approaches floor asymptotically; never ≤ 0 |

Reset when the player changes target or switches gameplay system (per core).

---

## Anticipation Bonus

| Constant | Starter | Notes |
| --- | ---: | --- |
| `ANTICIPATION_STEP_DOPAMINE` | `0.4` | Per consecutive expect/skip beat. **Tune** |
| `ANTICIPATION_LOG_BASE` | `2` | Growth slows each step |
| `ANTICIPATION_CAP_VS_DIRECT_MULT` | `0.5` | Must stay below comparable direct interaction reward |

Resets when expected reward obtained, activity changes, or opportunity expires.

---

## Focus Chain

| Constant | Starter | Notes |
| --- | ---: | --- |
| `FOCUS_CHAIN_TIMEOUT_BASE_MS` | `4500` | Time allowed to make the **next** Focus Change when chain length is 1. Generous early. **Tune** |
| `FOCUS_CHAIN_TIMEOUT_DECAY_MS` | `350` | Subtracted from the continue-window per additional chain step. **Tune** |
| `FOCUS_CHAIN_TIMEOUT_MIN_MS` | `1500` | Floor — never tighter than this. **Tune** |
| `FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS` | `3` | Below this, ending the chain grants **no** completion cash-out |
| `FOCUS_CHAIN_MAX_LINGER_MS` | `8000` | Too long in one window breaks chain. **Tune** |
| `WINDOW_REWARD_COOLDOWN_MS` | `2500` | Per-window cooldown before Focus Ready. **Tune** |

### Continue-window (decaying timeout)

After each successful Focus Change that sets chain length to `L`, the timer to perform the **next** Focus Change is:

```
timeoutMs(L) = max(
  FOCUS_CHAIN_TIMEOUT_MIN_MS,
  FOCUS_CHAIN_TIMEOUT_BASE_MS - (L - 1) × FOCUS_CHAIN_TIMEOUT_DECAY_MS
)
```

Examples (starter values):

| Current length `L` | Time to reach `L+1` |
| ---: | ---: |
| 1 | `4500` ms |
| 2 | `4150` ms |
| 3 | `3800` ms |
| 5 | `3100` ms |
| 10 | `1500` ms (hit floor) |
| 15+ | `1500` ms |

Early chain steps stay readable; long chains demand faster switching. If the timer expires, the chain breaks (resets to 0).

### Focus Change quality multipliers (Dopamine + Score)

| Quality | Condition (summary) | Dopamine mult | Score mult |
| --- | --- | ---: | ---: |
| Poor | Normal destination, awkward timing | `1.0` | `1.0` |
| Good | Focus Ready destination | `1.25` | `1.25` |
| Excellent | Attention Request destination | `1.6` | `1.6` |
| Perfect | Attention Request + tight timing. **Tune** | `2.0` | `2.0` |

### Chain step bonuses (on successful extend)

Granted **when the chain successfully increases** to that length — not when it breaks.

| Chain length reached | Extra Dopamine | Extra Score | Notes |
| --- | ---: | ---: | --- |
| `1` | `0.5` | `10` | Awarded on first valid Focus Change |
| `2` | `0.75` | `20` | |
| `3` | `1.0` | `35` | |
| `5` | `1.5` | `60` | |
| `10` | `3.0` | `150` | |
| `15` | `5.0` | `300` | |
| `20+` | `8.0` | `500` | Soft cap feel; **Tune** |

Interpolate or use nearest lower tier until a formula replaces the table.

### Chain Completion Bonus (on chain end only)

Granted **once when the chain ends**, and **only if** final length ≥ `FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS` (starter: `3`).

| Constant | Starter |
| --- | ---: |
| `CHAIN_COMPLETION_DOPAMINE_PER_STEP` | `0.5` |
| `CHAIN_COMPLETION_SCORE_PER_STEP` | `25` |

```
if finalLength >= FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS:
  completionDopamine = finalLength × CHAIN_COMPLETION_DOPAMINE_PER_STEP
  completionScore    = finalLength × CHAIN_COMPLETION_SCORE_PER_STEP
else:
  completionDopamine = 0
  completionScore    = 0
```

**Breaking at length 1 or 2 does not reduce Dopamine** and does **not** pay completion. Any step bonuses already earned when the chain grew remain; there is no clawback.

Example: chain reaches 1 (player already got `+0.5` Dopamine step bonus), then times out → completion = `0`. Net from the chain mechanics ≈ that earlier step bonus only.

---

## Burnout And Recovery

Values marked **From core example** were already shown in `02`; this table is now authoritative.

| Constant | Starter | Notes |
| --- | ---: | --- |
| `BURNOUT_APM_THRESHOLD_1` | `80` | **From core example** — first Burnout |
| `BURNOUT_APM_THRESHOLD_2` | `100` | **From core example** — after 1st Recovery |
| `BURNOUT_APM_THRESHOLD_3` | `125` | **From core example** — after 2nd Recovery |
| `BURNOUT_APM_THRESHOLD_GROWTH` | `1.25` | From 4th Burnout onward: `prev × growth`. **Tune** |
| `BURNOUT_ENTER_SUSTAIN_MS` | `2000` | APM must stay ≥ threshold this long to enter. **Tune** |
| `BURNOUT_EXIT_BELOW_MS` | `1500` | APM below threshold this long ends Burnout. **Tune** |
| `BURNOUT_REWARD_MULT` | `1.75` | Dopamine/Score while in Burnout. **Tune** |
| `BURNOUT_TELEGRAPH_APM_RATIO` | `0.85` | Telegraph when `currentAPM ≥ threshold × ratio`. Presentation in `09`. |
| `RECOVERY_DURATION_MS` | `8000` | Fixed Recovery length. **Tune** |
| `RECOVERY_DOPAMINE_GAIN_MULT` | `0.7` | Optional softer gains during Recovery (drain already boosted). **Tune** |

After each completed Recovery, advance to the next APM threshold (never decrease within a Match).

---

## Difficulty Scaling

Smooth continuous escalation. No discrete levels.

| Constant | Starter | Notes |
| --- | ---: | --- |
| `DIFFICULTY_TIME_TO_MAX_MS` | `600000` | ~10 min toward max pressure. **Tune** — keep early Match gentle |
| `DIFFICULTY_CURVE_EXPONENT` | `1.4` | `t^exp` ease-in (slow start, faster later). **Tune** |
| `EVENT_INTERVAL_EARLY_MS` | `10000` | **From core/05 example** — early interesting event |
| `EVENT_INTERVAL_LATE_MS` | `4000` | **From core/05 example** — late |
| `ATTENTION_REQUEST_DURATION_EARLY_MS` | `6000` | **Tune** |
| `ATTENTION_REQUEST_DURATION_LATE_MS` | `3000` | **Tune** |
| `MAX_SIMULTANEOUS_ATTENTION_REQUESTS_EARLY` | `1` | |
| `MAX_SIMULTANEOUS_ATTENTION_REQUESTS_LATE` | `4` | Desktop; mobile may cap lower in `07` |

Per-window generators interpolate their interval between early and late using the same difficulty `t`.

---

## Window Base Rewards

Small early rewards; Focus Chain / quality / Burnout multiply on top.

Units: Dopamine / Score per successful base action.

| Window | Action | Dopamine | Score | Notes |
| --- | --- | ---: | ---: | --- |
| Loop | Next video | `1.2` | `15` | Frequent, small |
| Loop | Like | `0.6` | `8` | Dimishes per video |
| Loop | Repost | `1.0` | `12` | |
| Loop | Interactive opportunity | `4.0` | `80` | Attention Request |
| Pulse | Like | `0.7` | `10` | |
| Pulse | Repost | `1.1` | `18` | |
| Pulse | Reply (on-trend) | `2.5` | `40` | |
| Pulse | Create post (on-trend) | `3.0` | `50` | |
| Pulse | Mention / viral respond | `4.5` | `90` | Attention Request |
| Wave | Skip (anticipation path) | `0.3` | `5` | Plus anticipation table |
| Wave | Like track | `1.5` | `25` | Once per track |
| Wave | Song Moment | `3.5` | `70` | |
| Wave | Accept recommendation | `4.0` | `80` | |
| Echo | Play/pause | `0.4` | `5` | Dimishes if toggled |
| Echo | Change content | `0.5` | `8` | Not primary |
| Echo | React | `1.2` | `20` | |
| Echo | Subscribe | `2.0` | `35` | Limited per item |
| Echo | Highlighted moment | `5.0` | `100` | Attention Request |
| Alerts | Open valuable | `2.0`–`5.0` | `30`–`100` | By priority |
| Alerts | Spam / noise | `0` | `0` | |
| Alerts | Comedic dismiss | `0.2` | `5` | Rare flavour |
| Minigame | Standard success beat | `0.8` | `12` | Per design of each game |
| Minigame | Boss / rare clear | `6.0` | `200` | Attention Request tier |

Advertising, spam, and sponsor segments: **0 Dopamine** (noise only).

---

## Combo / Multiplier (arcade successive actions)

Distinct from Focus Chain. Tunable arcade juice for rapid successive valid actions (often within one window).

| Constant | Starter | Notes |
| --- | ---: | --- |
| `COMBO_WINDOW_MS` | `1200` | Gap allowed between successive actions |
| `COMBO_MULT_STEP` | `0.1` | Added per step after first |
| `COMBO_MULT_CAP` | `3.0` | **Tune** |
| `COMBO_SCORE_BASE` | `5` | Flat score drip per combo tick |

Presentation (popups, sounds): `09_game_feel.md`.

---

## Content Starter Pack (splash)

Provisional counts that may block `Loading` → `Playing`. Keep small so the splash stays short. Runtime preload fills the rest (`08_content.md`).

| Constant | Starter | Notes |
| --- | ---: | --- |
| `PRELOAD_LOOP_CLIPS` | `5` | **Tune** |
| `PRELOAD_WAVE_TRACKS` | `3` | Bias high; ≤1 boring |
| `PRELOAD_ECHO_ITEMS` | `1` | Deep-buffer one item |
| `PRELOAD_TARGET_MATCH_SECONDS` | `120` | Soft goal for starter coverage |

---

## Minigame Intensity (difficulty-linked)

Shared knobs; each minigame maps these onto its own spawners in code.

| Constant | Early | Late | Notes |
| --- | ---: | ---: | --- |
| Lane Defender enemy density | low | high | Primary difficulty lever |
| Lane Defender enemy speed mult | `1.0` | `1.8` | **Tune** |
| Block Cascade fall speed mult | `1.0` | `2.2` | **Tune** |
| Endless Runner speed mult | `1.0` | `2.0` | **Tune** |
| Boss / rare event interval | long | shorter | Still Attention Requests |

Exact spawn tables can grow here as minigames are implemented under TDD.

---

## Scoring (global)

| Constant | Starter | Notes |
| --- | ---: | --- |
| `SCORE_FROM_DOPAMINE_GAIN_MULT` | `10` | Optional mirror: some gains also add score via window tables above |
| `GAME_OVER_PLAY_AGAIN_DEMAND_DELAY_MS` | `3000` | When PLAY AGAIN starts escalating demand. Feel in `09` |

Final Game Over stats (Survival Time, Final Score, Highest Combo, Longest Focus Chain, Burnouts Triggered) use live counters — no extra balance constants.

---

## Acceptance Criteria

- Every gameplay rule that says “defined in balance” has a named constant here.
- Values are labeled provisional; changing them does not require editing rule docs.
- Early Match constants bias gentle (`DIFFICULTY_CURVE_EXPONENT` > 1, modest base drain).
- Burnout thresholds escalate `80 → 100 → 125 → ×1.25…` and never decrease mid-Match.
- Spam/ad content remains at zero Dopamine.
