import skinFixture from '../../../content/minigames/block_cascade/skin_blocks.json'
import { loadBlockCascadeSkin } from './view'

describe('Block Cascade skin adapter', () => {
  it('resolves block textures by stable piece id', () => {
    const skin = loadBlockCascadeSkin(skinFixture)

    expect(skin.resolve('I')).toBe('tex_I.png')
    expect(skin.resolve('T')).toBe('tex_T.png')
    expect(skin.resolve('Z')).toBe('tex_Z.png')
    expect(skin).not.toHaveProperty('ruleColor')
  })
})
