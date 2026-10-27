import { grantDopamine } from './dopamine'
import type { MatchSession } from './matchSession'
import type { Reward } from '../windows/loop'

export function applyMatchReward(
  session: MatchSession,
  reward: Reward,
): MatchSession {
  if (reward.dopamine === 0 && reward.score === 0) {
    return session
  }

  return {
    ...session,
    dopamine: grantDopamine(session.dopamine, reward.dopamine),
    score: session.score + reward.score,
  }
}
