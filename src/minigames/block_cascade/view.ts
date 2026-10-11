import { TETROMINO_TYPES, type TetrominoType } from './sim'

export type BlockCascadeSkin = {
  resolve(piece: TetrominoType): string
}

export function loadBlockCascadeSkin(value: unknown): BlockCascadeSkin {
  if (!isRecord(value) || !isRecord(value.pieces)) {
    throw new TypeError('Block Cascade skin requires piece assets')
  }

  const textures = Object.fromEntries(
    TETROMINO_TYPES.map((piece) => {
      const definition = value.pieces[piece]
      if (!isRecord(definition) || typeof definition.tex !== 'string') {
        throw new TypeError(`Block Cascade skin requires ${piece} texture`)
      }
      return [piece, definition.tex]
    }),
  ) as Record<TetrominoType, string>

  return {
    resolve(piece) {
      return textures[piece]
    },
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
