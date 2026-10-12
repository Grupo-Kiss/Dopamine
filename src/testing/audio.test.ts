import { createFakeAudioContext, createFakeAudioPort } from './audio'

describe('audio port fake', () => {
  it('records graph and bus messages without an AudioContext', async () => {
    const audio = createFakeAudioPort()

    await audio.unlock()
    audio.setBusGain('wave', 0.5)
    audio.setBusMuffle('wave', { gain: 0.7, lowpassHz: 2_200 })
    await audio.suspend()

    expect(audio.calls).toEqual([
      { operation: 'unlock' },
      { operation: 'setBusGain', bus: 'wave', gain: 0.5 },
      { operation: 'setBusMuffle', bus: 'wave', gain: 0.7, lowpassHz: 2_200 },
      { operation: 'suspend' },
    ])
  })
})

describe('AudioContext fake', () => {
  it('records nodes, connections, param ramps, and resume/suspend', async () => {
    const context = createFakeAudioContext()
    const gain = context.createGain()
    const filter = context.createBiquadFilter!()

    gain.connect(filter)
    filter.connect(context.destination)
    context.currentTime = 2
    filter.frequency.setTargetAtTime(800, context.currentTime, 0.04)
    await context.resume()
    await context.suspend()

    expect(context.nodes).toEqual([gain, filter])
    expect(gain.connections).toEqual([filter])
    expect(filter.connections).toEqual([context.destination])
    expect(filter.frequency.automation).toEqual([
      { target: 800, startTime: 2, timeConstant: 0.04 },
    ])
    expect(context.calls).toEqual(['resume', 'suspend'])
    expect(context.state).toBe('suspended')
  })

  it('can omit BiquadFilterNode to exercise gain-only fallbacks', () => {
    expect(
      createFakeAudioContext({ biquadFilters: false }).createBiquadFilter,
    ).toBeUndefined()
  })
})
