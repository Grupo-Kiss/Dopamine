import { createSequenceRng } from '../../testing/rng'
import * as blockCascade from './sim'

describe('Block Cascade', () => {
  it('creates a fixed board and a balanced seven-piece bag', () => {
    const state = blockCascade.createBlockCascade(
      createSequenceRng([0.4]),
    )

    expect(state.board).toHaveLength(16)
    expect(state.board.every((row) => row.length === 10)).toBe(true)
    expect(new Set(state.bag)).toEqual(
      new Set(['I', 'J', 'L', 'O', 'S', 'T', 'Z']),
    )
    expect(state.activePiece).not.toBeNull()
  })

  it('supports move, rotate, and soft drop with no hard-drop API', () => {
    const state = blockCascade.createBlockCascade(
      createSequenceRng([0]),
    )
    const moved = blockCascade.movePiece(state, 'left')
    const rotated = blockCascade.rotatePiece(moved)
    const dropped = blockCascade.softDrop(rotated)

    expect(moved.activePiece?.x).toBe(state.activePiece!.x - 1)
    expect(rotated.activePiece?.rotation).toBe(1)
    expect(dropped.activePiece?.y).toBe(rotated.activePiece!.y + 1)
    expect(Object.keys(blockCascade)).not.toContain('hardDrop')
  })

  it('clears lines with reward hooks and overflow resets only local state', () => {
    const initial = blockCascade.createBlockCascade(
      createSequenceRng([0]),
    )
    const board = initial.board.map((row, index) =>
      index >= 14 ? row.map(() => 'I' as const) : row,
    )
    const cleared = blockCascade.clearCompletedLines(board)

    expect(cleared.lines).toBe(2)
    expect(cleared.reward).toEqual({ type: 'LinesCleared', lines: 2 })

    const overflowed = blockCascade.handleBlockOverflow(initial)
    expect(overflowed.resetCount).toBe(1)
    expect(overflowed.events).toContainEqual({ type: 'Failure' })
    expect(overflowed).not.toHaveProperty('dopamine')
    expect(overflowed).not.toHaveProperty('score')
  })

  it('increases fall speed continuously with difficulty', () => {
    expect(blockCascade.fallIntervalMs(2)).toBeLessThan(
      blockCascade.fallIntervalMs(1),
    )
    expect(blockCascade.fallIntervalMs(2)).toBeGreaterThan(0)
  })
})
