# Minigame art drop zone

All minigame visuals are first-party. Full file lists: **`defs/14_visual_assets.md` Phase E**. Feel language: `defs/09_game_feel.md`.

| Folder | Game |
| --- | --- |
| `lane_defender/` | Lane Defender — cardboard cutouts + bevelled hazards |
| `endless_runner/` | Endless Runner — same art language |
| `block_cascade/` | Block Cascade — modern-classic Tetris board/skins |
| `_shared/` | Shared cast, FX, ground, burnout grunge, number styles |

“3D” = soft bevelled props + cutout billboards for Canvas 2D — not engine meshes.

## What shipped (Phase E)

Every sprite is a PNG with alpha; the vector master ships alongside where the
shape is worth editing by hand. Aspect boxes are **3:4** for Lane Defender and
Endless Runner, **10:16** for Block Cascade. `mockup_playfield.webp` in each
folder shows the board already pillarboxed into a slot, so the letterbox rule
from `09` is visible rather than described.

| Area | Files |
| --- | --- |
| Shared cast | `_shared/player_soldier_cutout.{svg,png}`, `enemy_normal_cutout.png`, `enemy_boss_cutout.png` |
| Shared textures | `_shared/textures/ground_tile.png` (tileable), `backdrop.png`, `burnout_grunge.png` |
| Shared FX | `_shared/fx/muzzle_flash.svg`, `explosion.svg`, `hit_spark.svg` |
| Numeric language | `_shared/ui/number_positive.svg`, `number_negative.svg` |
| Lane Defender | cast, `hazard_mine.png`, `hazard_barrier.png`, six `pickup_*.png`, `lane_guide.png`, `ground.png`, `backdrop.png` |
| Endless Runner | running cast, three `obstacle_*.png`, `collectible{,_rare}.png`, `ground_strip.png`, `parallax_{far,near}.png` |
| Block Cascade | `skin_blocks.json`, `board_frame.svg`, `board_bg.png`, `tex_{I,O,T,S,Z,J,L}.png`, `tetromino_atlas.png`, `ghost_piece.png`, `fx_clear_row.webp`, `fx_tetris.webp` |

Construction notes worth keeping when this art is replaced:

- **Cutouts are layered card.** Each limb is its own piece with a dark keyline
  ring outside a cream cut edge. That is what makes the cast read as billboards
  standing in lane space instead of as flat vector shapes.
- **Counters live on plates.** Boss integrity and the barrier counter are part
  of the prop, so a number never has to survive being drawn over busy art.
- **One tile language for pickups.** A pickup is told apart by its glyph at
  pickup scale, not by hue alone — six hues would not survive Burnout grading.
- **`fx_clear_row.webp` is a four-frame strip** (400×56 each, top to bottom),
  not a single still. Frame order is flash, blow-out, shards, residue.
