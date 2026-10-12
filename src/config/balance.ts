// Starter values mirror defs/06_balance.md, the numeric source of truth.

export const DOPAMINE_MAX = 100
export const DOPAMINE_MIN = 0
export const DOPAMINE_DRAIN_PER_SECOND_BASE = 0.35
export const DOPAMINE_DRAIN_DIFFICULTY_MULT_MIN = 1
export const DOPAMINE_DRAIN_DIFFICULTY_MULT_MAX = 3
export const DOPAMINE_DRAIN_RECOVERY_MULT = 1.5

export const DIMINISH_FIRST_HIT_MULT = 1
export const DIMINISH_LOG_BASE = 2
export const DIMINISH_FLOOR_MULT = 0.05

export const ANTICIPATION_STEP_DOPAMINE = 0.4
export const ANTICIPATION_LOG_BASE = 2
export const ANTICIPATION_CAP_VS_DIRECT_MULT = 0.5

export const DISCOVERY_STEP_DOPAMINE = 0.5
export const DISCOVERY_LOG_BASE = 2
export const DISCOVERY_HEARD_TRACK_MULT = 0
export const DISCOVERY_CAP_VS_DIRECT_MULT = 0.5

export const FOCUS_CHAIN_TIMEOUT_BASE_MS = 4_500
export const FOCUS_CHAIN_TIMEOUT_DECAY_MS = 350
export const FOCUS_CHAIN_TIMEOUT_MIN_MS = 1_500
export const FOCUS_CHAIN_MIN_LENGTH_FOR_COMPLETION_BONUS = 3
export const FOCUS_CHAIN_MAX_LINGER_MS = 8_000
export const WINDOW_REWARD_COOLDOWN_MS = 2_500
export const CHAIN_COMPLETION_DOPAMINE_PER_STEP = 0.5
export const CHAIN_COMPLETION_SCORE_PER_STEP = 25
export const FOCUS_CHAIN_STEP_BONUSES = {
  1: { dopamine: 0.5, score: 10 },
  2: { dopamine: 0.75, score: 20 },
  3: { dopamine: 1, score: 35 },
  5: { dopamine: 1.5, score: 60 },
  10: { dopamine: 3, score: 150 },
  15: { dopamine: 5, score: 300 },
  20: { dopamine: 8, score: 500 },
} as const

export const BURNOUT_APM_THRESHOLD_1 = 80
export const BURNOUT_APM_THRESHOLD_2 = 100
export const BURNOUT_APM_THRESHOLD_3 = 125
export const BURNOUT_APM_THRESHOLD_GROWTH = 1.25
export const BURNOUT_ENTER_SUSTAIN_MS = 2_000
export const BURNOUT_EXIT_BELOW_MS = 1_500
export const BURNOUT_REWARD_MULT = 1.75
export const BURNOUT_TELEGRAPH_APM_RATIO = 0.85
export const RECOVERY_DURATION_MS = 8_000
export const RECOVERY_DOPAMINE_GAIN_MULT = 0.7

export const DIFFICULTY_TIME_TO_MAX_MS = 600_000
export const DIFFICULTY_CURVE_EXPONENT = 1.4
export const EVENT_INTERVAL_EARLY_MS = 10_000
export const EVENT_INTERVAL_LATE_MS = 4_000
export const ATTENTION_REQUEST_DURATION_EARLY_MS = 6_000
export const ATTENTION_REQUEST_DURATION_LATE_MS = 3_000
export const MAX_SIMULTANEOUS_ATTENTION_REQUESTS_EARLY = 1
export const MAX_SIMULTANEOUS_ATTENTION_REQUESTS_LATE = 4

export const COMBO_WINDOW_MS = 1_200
export const COMBO_MULT_STEP = 0.1
export const COMBO_MULT_CAP = 3
export const COMBO_SCORE_BASE = 5

export const PRELOAD_LOOP_CLIPS = 5
export const PRELOAD_WAVE_TRACKS = 3
export const PRELOAD_ECHO_ITEMS = 1
export const PRELOAD_TARGET_MATCH_SECONDS = 120

export const SCORE_FROM_DOPAMINE_GAIN_MULT = 10
export const GAME_OVER_PLAY_AGAIN_DEMAND_DELAY_MS = 3_000

export const FOCUS_CHAIN_FX_POPUP_LENGTH = 3
export const FOCUS_CHAIN_FX_PARTICLES_LENGTH = 5
export const FOCUS_CHAIN_FX_FLASH_LENGTH = 10
export const FOCUS_CHAIN_FX_SHAKE_LENGTH = 15
export const FOCUS_CHAIN_FX_SPECIAL_COLOR_LENGTH = 20

export const WINDOW_REWARDS = {
  Loop: {
    NextVideo: { dopamine: 1.2, score: 15 },
    Like: { dopamine: 0.6, score: 8 },
    Repost: { dopamine: 1, score: 12 },
    InteractiveOpportunity: { dopamine: 4, score: 80 },
  },
  Pulse: {
    Like: { dopamine: 0.7, score: 10 },
    Repost: { dopamine: 1.1, score: 18 },
    ReplyOnTrend: { dopamine: 2.5, score: 40 },
    CreatePostOnTrend: { dopamine: 3, score: 50 },
    Mention: { dopamine: 4.5, score: 90 },
  },
  Wave: {
    SkipUnheard: { dopamine: 0.3, score: 5 },
    SkipHeard: { dopamine: 0.1, score: 2 },
    Like: { dopamine: 1.5, score: 25 },
    SongMoment: { dopamine: 3.5, score: 70 },
    Recommendation: { dopamine: 4, score: 80 },
  },
  Echo: {
    PlayPause: { dopamine: 0.4, score: 5 },
    ChangeContent: { dopamine: 0.5, score: 8 },
    React: { dopamine: 1.2, score: 20 },
    Subscribe: { dopamine: 2, score: 35 },
    HighlightedMoment: { dopamine: 5, score: 100 },
  },
  Noise: { dopamine: 0, score: 0 },
} as const
