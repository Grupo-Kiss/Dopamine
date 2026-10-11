import type { Rng } from '../../testing/rng'

export const BOARD_COLUMNS = 10
export const BOARD_ROWS = 16
export const TETROMINO_TYPES = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'] as const

export type TetrominoType = (typeof TETROMINO_TYPES)[number]
export type BoardCell = TetrominoType | null
export type Board = readonly (readonly BoardCell[])[]

export type ActivePiece = {
  readonly type: TetrominoType
  readonly x: number
  readonly y: number
  readonly rotation: 0 | 1 | 2 | 3
}

export type BlockCascadeEvent =
  | { readonly type: 'Failure' }
  | { readonly type: 'LinesCleared'; readonly lines: number }

export type BlockCascadeState = {
  readonly board: Board
  readonly bag: readonly TetrominoType[]
  readonly bagIndex: number
  readonly activePiece: ActivePiece | null
  readonly resetCount: number
  readonly events: readonly BlockCascadeEvent[]
}

export function createBlockCascade(rng: Rng): BlockCascadeState {
  const offset = Math.floor(rng.next() * TETROMINO_TYPES.length)
  const bag = [
    ...TETROMINO_TYPES.slice(offset),
    ...TETROMINO_TYPES.slice(0, offset),
  ]

  return {
    board: emptyBoard(),
    bag,
    bagIndex: 1,
    activePiece: createPiece(bag[0]!),
    resetCount: 0,
    events: [],
  }
}

export function movePiece(
  state: BlockCascadeState,
  direction: 'left' | 'right',
): BlockCascadeState {
  if (!state.activePiece) return state
  const delta = direction === 'left' ? -1 : 1
  const x = Math.max(
    0,
    Math.min(BOARD_COLUMNS - 4, state.activePiece.x + delta),
  )
  return { ...state, activePiece: { ...state.activePiece, x } }
}

export function rotatePiece(state: BlockCascadeState): BlockCascadeState {
  if (!state.activePiece) return state
  const rotation = ((state.activePiece.rotation + 1) % 4) as 0 | 1 | 2 | 3
  return {
    ...state,
    activePiece: { ...state.activePiece, rotation },
  }
}

export function softDrop(state: BlockCascadeState): BlockCascadeState {
  if (!state.activePiece) return state
  return {
    ...state,
    activePiece: { ...state.activePiece, y: state.activePiece.y + 1 },
  }
}

export function spawnNextPiece(
  state: BlockCascadeState,
  rng: Rng,
): BlockCascadeState {
  if (state.bagIndex < state.bag.length) {
    return {
      ...state,
      activePiece: createPiece(state.bag[state.bagIndex]!),
      bagIndex: state.bagIndex + 1,
    }
  }

  const refill = createBlockCascade(rng)
  return {
    ...state,
    bag: refill.bag,
    bagIndex: 1,
    activePiece: refill.activePiece,
  }
}

export function clearCompletedLines(board: Board): {
  readonly board: Board
  readonly lines: number
  readonly reward: BlockCascadeEvent | null
} {
  validateBoard(board)
  const remaining = board.filter((row) => row.some((cell) => cell === null))
  const lines = BOARD_ROWS - remaining.length
  const replacement = Array.from({ length: lines }, () =>
    Array<BoardCell>(BOARD_COLUMNS).fill(null),
  )

  return {
    board: [...replacement, ...remaining],
    lines,
    reward: lines > 0 ? { type: 'LinesCleared', lines } : null,
  }
}

export function handleBlockOverflow(
  state: BlockCascadeState,
): BlockCascadeState {
  return {
    ...state,
    board: emptyBoard(),
    bagIndex: Math.min(1, state.bag.length),
    activePiece: state.bag[0] ? createPiece(state.bag[0]) : null,
    resetCount: state.resetCount + 1,
    events: [{ type: 'Failure' }],
  }
}

export function fallIntervalMs(difficultyMultiplier: number): number {
  if (!Number.isFinite(difficultyMultiplier) || difficultyMultiplier <= 0) {
    throw new RangeError('Difficulty multiplier must be positive')
  }
  return 1_000 / difficultyMultiplier
}

function emptyBoard(): Board {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array<BoardCell>(BOARD_COLUMNS).fill(null),
  )
}

function createPiece(type: TetrominoType): ActivePiece {
  return { type, x: 3, y: 0, rotation: 0 }
}

function validateBoard(board: Board): void {
  if (
    board.length !== BOARD_ROWS ||
    board.some((row) => row.length !== BOARD_COLUMNS)
  ) {
    throw new RangeError(
      `Block Cascade board must be ${BOARD_COLUMNS}x${BOARD_ROWS}`,
    )
  }
}
