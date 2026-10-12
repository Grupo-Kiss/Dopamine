import {
  MUFFLE_OPEN_LOWPASS_HZ,
  MUFFLE_PLAYING_GAIN,
  MUFFLE_PLAYING_LOWPASS_HZ,
  MUFFLE_RAMP_MS,
  MUFFLE_RECOVERY_FOCUSED_GAIN,
  MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
  MUFFLE_RECOVERY_GAIN,
  MUFFLE_RECOVERY_LOWPASS_HZ,
  RECOVERY_DURATION_MS,
} from '../config/balance'
import { busMuffling, recoveryProgress, type BusMuffle } from './muffling'

const OPEN: BusMuffle = { gain: 1, lowpassHz: MUFFLE_OPEN_LOWPASS_HZ }
const PLAYING_MUFFLED: BusMuffle = {
  gain: MUFFLE_PLAYING_GAIN,
  lowpassHz: MUFFLE_PLAYING_LOWPASS_HZ,
}

describe('audio/feel: focus muffling matrix', () => {
  it('pins the 06 muffling starters', () => {
    expect({
      MUFFLE_OPEN_LOWPASS_HZ,
      MUFFLE_PLAYING_LOWPASS_HZ,
      MUFFLE_PLAYING_GAIN,
      MUFFLE_RECOVERY_LOWPASS_HZ,
      MUFFLE_RECOVERY_GAIN,
      MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
      MUFFLE_RECOVERY_FOCUSED_GAIN,
      MUFFLE_RAMP_MS,
    }).toEqual({
      MUFFLE_OPEN_LOWPASS_HZ: 20_000,
      MUFFLE_PLAYING_LOWPASS_HZ: 2_200,
      MUFFLE_PLAYING_GAIN: 0.7,
      MUFFLE_RECOVERY_LOWPASS_HZ: 700,
      MUFFLE_RECOVERY_GAIN: 0.45,
      MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ: 1_600,
      MUFFLE_RECOVERY_FOCUSED_GAIN: 0.75,
      MUFFLE_RAMP_MS: 120,
    })
  })

  it('Playing: non-focused window buses are slightly muffled, the focused one is clear', () => {
    expect(busMuffling({ mode: 'Playing', activeWindow: 'Wave' })).toEqual({
      master: OPEN,
      sfx: OPEN,
      loop: PLAYING_MUFFLED,
      pulse: PLAYING_MUFFLED,
      wave: OPEN,
      echo: PLAYING_MUFFLED,
    })
  })

  it('Playing: Minigame or no Active Window muffles every window bus but keeps SFX clear', () => {
    for (const activeWindow of ['Minigame', null]) {
      const muffling = busMuffling({ mode: 'Playing', activeWindow })
      expect(muffling.sfx).toEqual(OPEN)
      expect(muffling.master).toEqual(OPEN)
      for (const bus of ['loop', 'pulse', 'wave', 'echo'] as const) {
        expect(muffling[bus]).toEqual(PLAYING_MUFFLED)
      }
    }
  })

  it('Burnout: no muffling — every bus competes hot', () => {
    const muffling = busMuffling({ mode: 'Burnout', activeWindow: 'Loop' })
    for (const bus of Object.values(muffling)) {
      expect(bus).toEqual(OPEN)
    }
  })

  it('Recovery: extra muffling on almost everything, focused still muted relative', () => {
    const muffling = busMuffling({
      mode: 'Recovery',
      activeWindow: 'Echo',
      recoveryProgress: 0,
    })

    expect(muffling.master).toEqual(OPEN)
    expect(muffling.loop).toEqual({
      gain: MUFFLE_RECOVERY_GAIN,
      lowpassHz: MUFFLE_RECOVERY_LOWPASS_HZ,
    })
    expect(muffling.echo).toEqual({
      gain: MUFFLE_RECOVERY_FOCUSED_GAIN,
      lowpassHz: MUFFLE_RECOVERY_FOCUSED_LOWPASS_HZ,
    })
    expect(muffling.sfx).toEqual(muffling.echo)

    expect(muffling.loop.lowpassHz).toBeLessThan(PLAYING_MUFFLED.lowpassHz)
    expect(muffling.loop.gain).toBeLessThan(PLAYING_MUFFLED.gain)
    expect(muffling.echo.lowpassHz).toBeLessThan(MUFFLE_OPEN_LOWPASS_HZ)
    expect(muffling.echo.lowpassHz).toBeGreaterThan(muffling.loop.lowpassHz)
    expect(muffling.echo.gain).toBeGreaterThan(muffling.loop.gain)
  })

  it('Recovery eases back to the Playing mix as it ends', () => {
    const input = { mode: 'Recovery', activeWindow: 'Pulse' } as const
    const playing = busMuffling({ mode: 'Playing', activeWindow: 'Pulse' })

    expect(busMuffling({ ...input, recoveryProgress: 1 })).toEqual(playing)

    const steps = [0, 0.25, 0.5, 0.75, 1].map((recoveryProgressValue) =>
      busMuffling({ ...input, recoveryProgress: recoveryProgressValue }),
    )
    for (let index = 1; index < steps.length; index += 1) {
      for (const bus of ['sfx', 'loop', 'pulse', 'wave', 'echo'] as const) {
        expect(steps[index][bus].lowpassHz).toBeGreaterThanOrEqual(
          steps[index - 1][bus].lowpassHz,
        )
        expect(steps[index][bus].gain).toBeGreaterThanOrEqual(
          steps[index - 1][bus].gain,
        )
      }
    }

    const halfway = steps[2].loop.lowpassHz
    expect(halfway).toBeCloseTo(
      Math.sqrt(MUFFLE_RECOVERY_LOWPASS_HZ * MUFFLE_PLAYING_LOWPASS_HZ),
      6,
    )
  })

  it('derives Recovery progress from the Burnout system clock', () => {
    const endsAt = 50_000
    expect(recoveryProgress(endsAt, endsAt - RECOVERY_DURATION_MS)).toBe(0)
    expect(recoveryProgress(endsAt, endsAt - RECOVERY_DURATION_MS / 2)).toBe(
      0.5,
    )
    expect(recoveryProgress(endsAt, endsAt)).toBe(1)
    expect(recoveryProgress(endsAt, endsAt + 1_000)).toBe(1)
    expect(recoveryProgress(endsAt, 0)).toBe(0)
    expect(recoveryProgress(null, 10)).toBe(1)
  })

  it('rejects out-of-range Recovery progress', () => {
    expect(() =>
      busMuffling({
        mode: 'Recovery',
        activeWindow: null,
        recoveryProgress: 1.5,
      }),
    ).toThrow(RangeError)
  })
})
