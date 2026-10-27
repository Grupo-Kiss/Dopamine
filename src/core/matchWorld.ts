import type { MinigameId } from '../content/session'
import type { MatchStarterPack } from '../content/matchPack'
import type { ActiveWindow } from './focusChain'
import type { InputCommand } from './input'
import type { Clock } from '../testing/clock'
import type { MediaPort } from '../testing/media'
import type { Rng } from '../testing/rng'
import {
  createBlockCascade,
  softDrop,
  type BlockCascadeState,
} from '../minigames/block_cascade/sim'
import {
  changeRunnerLane,
  createEndlessRunner,
  tickEndlessRunner,
  type EndlessRunnerState,
} from '../minigames/endless_runner/sim'
import {
  autoFire,
  changeLane,
  createLaneDefender,
  spawnIntervalMs,
  spawnNormalEnemy,
  tickLaneDefender,
  type LaneDefenderState,
} from '../minigames/lane_defender/sim'
import { laneFromKeyboard } from '../minigames/lane_defender/view'
import {
  createAlerts,
  dismissActiveAlert,
  openHighestPriorityAlert,
  type Alert,
  type AlertsState,
} from '../windows/alerts'
import {
  createEcho,
  echoAction,
  nextEchoItem,
  tickEcho,
  type EchoState,
} from '../windows/echo'
import {
  createLoop,
  loopAction,
  nextLoopClip,
  tickLoop,
  type LoopState,
} from '../windows/loop'
import type { Reward } from '../windows/loop'
import {
  createPulse,
  pulseShortcut,
  tickPulse,
  type PulseState,
} from '../windows/pulse'
import {
  createWave,
  likeWaveTrack,
  skipWaveTrack,
  tickWave,
  tickWavePlayback,
  type WaveState,
} from '../windows/wave'
import type { MatchCue } from './matchSession'
import type { FocusChain } from './focusChain'

export type MinigameSimState =
  | { readonly id: 'lane_defender'; readonly sim: LaneDefenderState }
  | { readonly id: 'block_cascade'; readonly sim: BlockCascadeState }
  | { readonly id: 'endless_runner'; readonly sim: EndlessRunnerState }

export type MatchWorld = {
  readonly loop: LoopState
  readonly pulse: PulseState
  readonly wave: WaveState
  readonly echo: EchoState
  readonly alerts: AlertsState
  readonly minigame: MinigameSimState
  readonly spawnSerial: number
}

export type MatchWorldTick = {
  readonly deltaMs: number
  readonly difficultyMultiplier: number
}

export type MatchWorldTickResult = {
  readonly world: MatchWorld
  readonly rewards: readonly Reward[]
  readonly cues: readonly MatchCue[]
}

export type WindowCommandResult = {
  readonly world: MatchWorld
  readonly reward: Reward
  readonly cues: readonly MatchCue[]
}

const NO_REWARD: Reward = { dopamine: 0, score: 0 }

export function createMatchWorld(
  pack: MatchStarterPack,
  minigameId: MinigameId,
  rng: Rng,
  clock: Clock,
): MatchWorld {
  return {
    loop: createLoop(pack.loopClips),
    pulse: createPulse(pack.pulsePosts),
    wave: createWave(pack.waveTracks, rng),
    echo: createEcho(pack.echoItems, clock),
    alerts: createAlerts(),
    minigame: createMinigameSim(minigameId, rng),
    spawnSerial: 0,
  }
}

export function tickMatchWorld(
  world: MatchWorld,
  tick: MatchWorldTick,
  clock: Clock,
  rng: Rng,
): MatchWorldTickResult {
  const nowMs = clock.now()
  const rewards: Reward[] = []
  const cues: MatchCue[] = []

  const loop = tickLoop(world.loop, nowMs)
  const pulse = tickPulse(world.pulse, nowMs)
  let wave = tickWave(world.wave, nowMs)
  const wavePlayback = tickWavePlayback(wave, tick.deltaMs)
  wave = wavePlayback.state
  if (wavePlayback.reward.dopamine > 0 || wavePlayback.reward.score > 0) {
    rewards.push(wavePlayback.reward)
  }

  const echoTick = tickEcho(world.echo, clock)
  const echo = echoTick.state
  if (echoTick.reward.dopamine > 0 || echoTick.reward.score > 0) {
    rewards.push(echoTick.reward)
  }

  let minigame = world.minigame
  let spawnSerial = world.spawnSerial

  if (minigame.id === 'lane_defender') {
    const interval = spawnIntervalMs(tick.difficultyMultiplier)
    const beforeMs = minigame.sim.elapsedMs
    let sim = autoFire(
      tickLaneDefender(minigame.sim, {
        deltaMs: tick.deltaMs,
        difficultyMultiplier: tick.difficultyMultiplier,
      }),
    )

    for (const event of sim.events) {
      if (event.type === 'Failure') {
        cues.push('minigameHit')
        sim = createLaneDefender()
      }
    }
    sim = { ...sim, events: [] }

    const spawnsDue =
      Math.floor(sim.elapsedMs / interval) - Math.floor(beforeMs / interval)
    for (let index = 0; index < spawnsDue && sim.entities.length < 6; index++) {
      spawnSerial += 1
      sim = spawnNormalEnemy(sim, rng, `enemy-${spawnSerial}`, 1)
    }

    minigame = { id: 'lane_defender', sim }
  } else if (minigame.id === 'block_cascade') {
    let sim = minigame.sim
    for (const event of sim.events) {
      if (event.type === 'Failure') cues.push('minigameHit')
    }
    sim = { ...sim, events: [] }
    if (tick.deltaMs > 0) {
      sim = softDrop(sim)
    }
    minigame = { id: 'block_cascade', sim }
  } else {
    let sim = tickEndlessRunner(minigame.sim, {
      deltaMs: tick.deltaMs,
      difficultyMultiplier: tick.difficultyMultiplier,
    })
    for (const event of sim.events) {
      if (event.type === 'Failure') cues.push('minigameHit')
    }
    sim = { ...sim, events: [] }
    minigame = { id: 'endless_runner', sim }
  }

  return {
    world: {
      loop,
      pulse,
      wave,
      echo,
      alerts: world.alerts,
      minigame,
      spawnSerial,
    },
    rewards,
    cues,
  }
}

export function applyWindowCommand(
  world: MatchWorld,
  activeWindow: ActiveWindow,
  command: InputCommand,
  clock: Clock,
  rng: Rng,
  media: MediaPort,
): WindowCommandResult | Promise<WindowCommandResult> {
  if (command.type === 'Handled') {
    return { world, reward: NO_REWARD, cues: [] }
  }

  switch (activeWindow) {
    case 'Loop':
      return applyLoopCommand(world, command, clock, media)
    case 'Pulse':
      return applyPulseCommand(world, command)
    case 'Wave':
      return applyWaveCommand(world, command, clock, rng, media)
    case 'Echo':
      return applyEchoCommand(world, command, clock, media)
    case 'Minigame':
      return applyMinigameCommand(world, command)
    default:
      return { world, reward: NO_REWARD, cues: [] }
  }
}

export function applyMinigameLaneInput(
  world: MatchWorld,
  code: string,
): MatchWorld {
  const lane = laneFromKeyboard(code)
  if (!lane) {
    return world
  }

  if (world.minigame.id === 'lane_defender') {
    return {
      ...world,
      minigame: {
        id: 'lane_defender',
        sim: changeLane(world.minigame.sim, lane),
      },
    }
  }

  if (world.minigame.id === 'endless_runner') {
    return {
      ...world,
      minigame: {
        id: 'endless_runner',
        sim: changeRunnerLane(world.minigame.sim, lane),
      },
    }
  }

  return world
}

export function enqueueDemoAlert(
  world: MatchWorld,
  alert: Alert,
): MatchWorld {
  return {
    ...world,
    alerts: {
      ...world.alerts,
      pending: [...world.alerts.pending, alert],
    },
  }
}

export function openNextAlert(
  world: MatchWorld,
  focusChain: FocusChain,
  clock: Clock,
): {
  readonly world: MatchWorld
  readonly focusChain: FocusChain
  readonly reward: Reward
  readonly cues: readonly MatchCue[]
} {
  const opened = openHighestPriorityAlert(world.alerts, focusChain, clock.now())
  const cues: MatchCue[] =
    opened.state.activeAlert && opened.reward.dopamine + opened.reward.score > 0
      ? ['alertOpen']
      : opened.state.activeAlert
        ? ['alertOpen']
        : []

  return {
    world: { ...world, alerts: opened.state },
    focusChain: opened.focusChain,
    reward: opened.reward,
    cues,
  }
}

export function dismissAlert(world: MatchWorld): MatchWorld {
  return {
    ...world,
    alerts: dismissActiveAlert(world.alerts),
  }
}

function applyLoopCommand(
  world: MatchWorld,
  command: InputCommand,
  _clock: Clock,
  media: MediaPort,
): WindowCommandResult | Promise<WindowCommandResult> {
  if (command.type === 'Like') {
    const result = loopAction(world.loop, 'Like')
    return { world: { ...world, loop: result.state }, reward: result.reward, cues: [] }
  }
  if (command.type === 'Repost') {
    const result = loopAction(world.loop, 'Repost')
    return { world: { ...world, loop: result.state }, reward: result.reward, cues: [] }
  }
  if (command.type === 'Next') {
    return nextLoopClip(world.loop, media).then((result) => ({
      world: { ...world, loop: result.state },
      reward: result.reward,
      cues: [],
    }))
  }
  return { world, reward: NO_REWARD, cues: [] }
}

function applyPulseCommand(
  world: MatchWorld,
  command: InputCommand,
): WindowCommandResult {
  const postId = world.pulse.timeline[0]?.id
  if (!postId) {
    return { world, reward: NO_REWARD, cues: [] }
  }

  if (command.type === 'Like') {
    const result = pulseShortcut(world.pulse, 'KeyL', postId)
    return { world: { ...world, pulse: result.state }, reward: result.reward, cues: [] }
  }
  if (command.type === 'Repost') {
    const result = pulseShortcut(world.pulse, 'KeyR', postId)
    return { world: { ...world, pulse: result.state }, reward: result.reward, cues: [] }
  }
  return { world, reward: NO_REWARD, cues: [] }
}

function applyWaveCommand(
  world: MatchWorld,
  command: InputCommand,
  _clock: Clock,
  rng: Rng,
  media: MediaPort,
): WindowCommandResult | Promise<WindowCommandResult> {
  if (command.type === 'Like') {
    const result = likeWaveTrack(world.wave)
    return { world: { ...world, wave: result.state }, reward: result.reward, cues: [] }
  }
  if (command.type === 'Next') {
    return skipWaveTrack(world.wave, media, rng).then((result) => ({
      world: { ...world, wave: result.state },
      reward: result.reward,
      cues: [],
    }))
  }
  return { world, reward: NO_REWARD, cues: [] }
}

function applyEchoCommand(
  world: MatchWorld,
  command: InputCommand,
  clock: Clock,
  media: MediaPort,
): WindowCommandResult | Promise<WindowCommandResult> {
  if (command.type === 'Like') {
    const result = echoAction(world.echo, 'React')
    return { world: { ...world, echo: result.state }, reward: result.reward, cues: [] }
  }
  if (command.type === 'Next') {
    return nextEchoItem(world.echo, media, clock).then((result) => ({
      world: { ...world, echo: result.state },
      reward: result.reward,
      cues: [],
    }))
  }
  if (command.type === 'Repost') {
    const result = echoAction(world.echo, 'Subscribe')
    return { world: { ...world, echo: result.state }, reward: result.reward, cues: [] }
  }
  return { world, reward: NO_REWARD, cues: [] }
}

function applyMinigameCommand(
  world: MatchWorld,
  command: InputCommand,
): WindowCommandResult {
  if (world.minigame.id === 'block_cascade' && command.type === 'Next') {
    const sim = softDrop(world.minigame.sim)
    return { world: { ...world, minigame: { id: 'block_cascade', sim } }, reward: NO_REWARD, cues: [] }
  }
  if (world.minigame.id === 'endless_runner') {
    if (command.type === 'Navigate') return { world, reward: NO_REWARD, cues: [] }
  }
  return { world, reward: NO_REWARD, cues: [] }
}

function createMinigameSim(minigameId: MinigameId, rng: Rng): MinigameSimState {
  switch (minigameId) {
    case 'lane_defender':
      return { id: 'lane_defender', sim: createLaneDefender() }
    case 'block_cascade':
      return { id: 'block_cascade', sim: createBlockCascade(rng) }
    case 'endless_runner':
      return { id: 'endless_runner', sim: createEndlessRunner() }
  }
}
