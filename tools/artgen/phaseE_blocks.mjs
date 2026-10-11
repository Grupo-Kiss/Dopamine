import { writeFileSync } from 'node:fs';
import { svgDoc } from './lib/card.mjs';
import { bev, bevelDefs, propSharedDefs } from './lib/props.mjs';
import { TETRO, blocksBoard, boardBg, ghostTile, letterbox, place, tetroDefs, tetroFace } from './lib/playfields.mjs';
import { caption, railPanel, reviewSheet } from './lib/mockup.mjs';
import { BRAND, n, rr } from './lib/brand.mjs';
import { out, writePng, writeSvg, writeWebp } from './lib/render.mjs';

const R = 'content/minigames/block_cascade';
const COLS = 10;
const ROWS = 16;
const BOARD_W = 400;
const BOARD_H = 640;
const CELL = BOARD_W / COLS;

/* ---- skin ---- */
const skin = {
  comment:
    'Block Cascade skin. Dark modern well, bright bevelled faces. Face textures live beside this file as tex_<piece>.png (and tetromino_atlas.png, 7 tiles of 128px in I O T S Z J L order). Colours below are the flat fallbacks and the tint used by the bevel gradients.',
  cell: { size: 40, radius: 7, bevel: 2.2 },
  board: { cols: COLS, rows: ROWS, aspect: '10:16' },
  pieces: Object.fromEntries(
    Object.entries(TETRO).map(([k, v]) => [k, { base: v.base, light: v.light, dark: v.dark, tex: `tex_${k}.png` }])
  ),
  atlas: { file: 'tetromino_atlas.png', tile: 128, order: Object.keys(TETRO) },
  ghost: { file: 'ghost_piece.png', opacity: 0.22 },
  boardBackground: '#0f131b',
  boardBackgroundFile: 'board_bg.png',
  gridLine: '#1d2430',
  frame: 'board_frame.svg',
  clearFx: { row: 'fx_clear_row.webp', rowFrames: 4, rowFrameSize: [400, 56], tetris: 'fx_tetris.webp' },
};
writeFileSync(out(`${R}/skin_blocks.json`), JSON.stringify(skin, null, 2) + '\n');

/* ---- face textures + atlas ---- */
const faceDefs = tetroDefs() + propSharedDefs();
for (const kind of Object.keys(TETRO)) {
  await writePng(
    `${R}/tex_${kind}.png`,
    svgDoc(128, 128, { defs: faceDefs, body: tetroFace(kind, 128), label: `Tetromino ${kind} face` }),
    128
  );
}
const order = Object.keys(TETRO);
await writePng(
  `${R}/tetromino_atlas.png`,
  svgDoc(128 * order.length, 128, {
    defs: faceDefs,
    body: order.map((k, i) => place(tetroFace(k, 128), i * 128, 0, 1)).join(''),
    label: 'Tetromino face atlas — I O T S Z J L',
  }),
  128 * order.length
);
await writePng(
  `${R}/ghost_piece.png`,
  svgDoc(128, 128, { defs: '', body: ghostTile(128), label: 'Ghost piece tile' }),
  128
);

/* ---- well ---- */
const bb = boardBg(BOARD_W, BOARD_H, { cols: COLS, rows: ROWS });
await writePng(
  `${R}/board_bg.png`,
  svgDoc(BOARD_W, BOARD_H, { defs: bb.defs, body: bb.body, label: 'Block Cascade well' }),
  BOARD_W * 2
);

/* ---- frame chrome ---- */
const FR_W = 456;
const FR_H = 740;
const WELL_X = 28;
const WELL_Y = 68;

function frameBody({ score = '12,480', lines = '34', next = 'T' } = {}) {
  const outer = rr(2, 2, FR_W - 4, FR_H - 4, 20);
  const wellCut = rr(WELL_X - 6, WELL_Y - 6, BOARD_W + 12, BOARD_H + 12, 12);
  const nextBox = rr(FR_W - 90, 12, 76, 46, 11);
  return `
${bev(outer, 'bcf', { key: 5 })}
<path d="${wellCut}" fill="#070a0f"/>
<path d="${wellCut}" fill="none" stroke="#000" stroke-width="2" stroke-opacity="0.6"/>
<path d="${rr(WELL_X - 2.5, WELL_Y - 2.5, BOARD_W + 5, BOARD_H + 5, 8)}" fill="none" stroke="${BRAND.minigame.accent}" stroke-width="1.4" stroke-opacity="0.55"/>
<text x="${WELL_X}" y="28" font-family="Public Sans" font-size="10.5" font-weight="800" fill="${BRAND.minigame.accent}" letter-spacing="2.4">SCORE</text>
<text x="${WELL_X}" y="52" font-family="Public Sans" font-size="21" font-weight="800" fill="#e6edf5" letter-spacing="-0.4">${score}</text>
<text x="${WELL_X + 150}" y="28" font-family="Public Sans" font-size="10.5" font-weight="800" fill="${BRAND.minigame.accent}" letter-spacing="2.4">LINES</text>
<text x="${WELL_X + 150}" y="52" font-family="Public Sans" font-size="21" font-weight="800" fill="#e6edf5" letter-spacing="-0.4">${lines}</text>
<path d="${nextBox}" fill="#0d1218"/>
<path d="${nextBox}" fill="none" stroke="${BRAND.minigame.accent}" stroke-width="1.2" stroke-opacity="0.5"/>
<text x="${FR_W - 52}" y="26" font-family="Public Sans" font-size="9" font-weight="800" fill="${BRAND.minigame.accent}" text-anchor="middle" letter-spacing="2">NEXT</text>
${place(tetroFace(next, 128), FR_W - 81, 35, 18 / 128)}${place(tetroFace(next, 128), FR_W - 62, 35, 18 / 128)}${place(tetroFace(next, 128), FR_W - 43, 35, 18 / 128)}${place(tetroFace(next, 128), FR_W - 62, 17, 18 / 128)}
<path d="${rr(WELL_X, FR_H - 22, BOARD_W, 6, 3)}" fill="${BRAND.minigame.accent}" opacity="0.18"/>`;
}

const frameDefs =
  faceDefs + bevelDefs('bcf', { base: '#1b2330', light: '#36425a', dark: '#0c1118' }) + tetroDefs();
writeSvg(
  `${R}/board_frame.svg`,
  svgDoc(FR_W, FR_H, { defs: frameDefs, body: frameBody(), label: 'Block Cascade board frame' })
);

/* ---- clear FX ---- */
function clearRowFrame(i) {
  const w = BOARD_W;
  const h = 56;
  // 0: row flashes white  1: bar blows out  2: shards fly, bar dims  3: residue
  const core = [0.35, 1, 0.55, 0.14][i];
  const barH = [6, 26, 16, 4][i];
  const spread = [0, 7, 15, 20][i];
  const shardOp = [0, 0.95, 0.7, 0.22][i];
  let shards = '';
  const count = 13;
  for (let k = 0; k < count; k++) {
    const x = (k + 0.5) * (w / count);
    const dy = (k % 2 ? -1 : 1) * spread;
    shards += `<rect x="${n(x - 6)}" y="${n(h / 2 - 4 + dy)}" width="${n(13 - i * 2)}" height="${n(8 - i)}" rx="3" fill="#fff3d6" opacity="${n(shardOp)}"/>`;
  }
  return `<g>
<rect y="${n(h / 2 - 20)}" width="${w}" height="40" fill="url(#fx-row)" opacity="${n(core)}"/>
<rect y="${n(h / 2 - barH / 2)}" width="${w}" height="${n(barH)}" fill="#ffffff" opacity="${n(core)}"/>
${shards}
<text x="10" y="${n(h - 8)}" font-family="Public Sans" font-size="11" font-weight="800" fill="#ffd27a" opacity="0.7">${i + 1}</text>
<path d="M0 ${n(h - 0.5)} H${w}" stroke="#1d2430" stroke-width="1"/>
</g>`;
}

const fxRowDefs = `
<linearGradient id="fx-row" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffd27a" stop-opacity="0"/>
  <stop offset="0.5" stop-color="#fff3d6" stop-opacity="0.9"/>
  <stop offset="1" stop-color="#ffd27a" stop-opacity="0"/>
</linearGradient>`;
await writeWebp(
  `${R}/fx_clear_row.webp`,
  svgDoc(BOARD_W, 56 * 4, {
    defs: fxRowDefs,
    bg: `<rect width="${BOARD_W}" height="224" fill="#0b0f16"/>`,
    body: [0, 1, 2, 3].map((i) => place(clearRowFrame(i), 0, i * 56, 1)).join(''),
    label: 'Line clear FX — four frames top to bottom',
  }),
  BOARD_W * 2,
  95
);

function tetrisFx() {
  const w = BOARD_W;
  const h = BOARD_H;
  const cy = h - CELL * 2.5;
  let rays = '';
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    rays += `<path d="M${n(w / 2)} ${n(cy)} L${n(w / 2 + Math.cos(a - 0.05) * 420)} ${n(cy + Math.sin(a - 0.05) * 420)} L${n(w / 2 + Math.cos(a + 0.05) * 420)} ${n(cy + Math.sin(a + 0.05) * 420)} Z" fill="#fff3d6" opacity="0.12"/>`;
  }
  let shards = '';
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + 0.2;
    const d = 90 + (i % 5) * 34;
    const x = w / 2 + Math.cos(a) * d;
    const y = cy + Math.sin(a) * d * 0.8;
    shards += `<g transform="rotate(${n((a * 180) / Math.PI)} ${n(x)} ${n(y)})">${bev(rr(x - 11, y - 6, 22, 12, 6), 'bcfx', { key: 2.4 })}</g>`;
  }
  return `<g clip-path="url(#fx-t-clip)">
<rect width="${w}" height="${h}" fill="url(#fx-t-wash)"/>
${rays}
<rect y="${n(h - CELL * 4)}" width="${w}" height="${n(CELL * 4)}" fill="url(#fx-t-rows)"/>
${[0, 1, 2, 3].map((i) => `<rect y="${n(h - CELL * (i + 1) + 2)}" width="${w}" height="${n(CELL - 4)}" fill="#ffffff" opacity="${n(0.55 - i * 0.08)}"/>`).join('')}
<ellipse cx="${n(w / 2)}" cy="${n(cy)}" rx="${n(w * 0.62)}" ry="${n(CELL * 4)}" fill="url(#fx-t-core)"/>
${shards}
<g transform="rotate(-6 ${n(w / 2)} ${n(h * 0.5)})">
  <path d="${rr(w / 2 - 152, h * 0.5 - 50, 304, 100, 18)}" fill="#1b1206" opacity="0.9"/>
  <path d="${rr(w / 2 - 152, h * 0.5 - 50, 304, 100, 18)}" fill="none" stroke="#ffd27a" stroke-width="4"/>
  <text x="${n(w / 2)}" y="${n(h * 0.5 + 2)}" font-family="Public Sans" font-size="54" font-weight="800" fill="#fff3d6" text-anchor="middle" letter-spacing="-1">4 LINES</text>
  <text x="${n(w / 2)}" y="${n(h * 0.5 + 34)}" font-family="Public Sans" font-size="15" font-weight="800" fill="#ffd27a" text-anchor="middle" letter-spacing="4.5">MAJOR EVENT</text>
</g>
</g>`;
}

await writeWebp(
  `${R}/fx_tetris.webp`,
  svgDoc(BOARD_W, BOARD_H, {
    defs: `${bevelDefs('bcfx', { base: '#ffd27a', light: '#fff9e8', dark: '#b45a00' })}
<radialGradient id="fx-t-wash" cx="0.5" cy="0.84" r="0.8"><stop offset="0" stop-color="#ff8c00" stop-opacity="0.45"/><stop offset="0.6" stop-color="#a371f7" stop-opacity="0.16"/><stop offset="1" stop-color="#6e40c9" stop-opacity="0"/></radialGradient>
<linearGradient id="fx-t-rows" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d6" stop-opacity="0.1"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0.75"/></linearGradient>
<radialGradient id="fx-t-core" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.45" stop-color="#ffd27a" stop-opacity="0.4"/><stop offset="1" stop-color="#ff8c00" stop-opacity="0"/></radialGradient>
<clipPath id="fx-t-clip"><rect width="${BOARD_W}" height="${BOARD_H}" rx="6"/></clipPath>`,
    bg: `<rect width="${BOARD_W}" height="${BOARD_H}" fill="#0b0f16"/>`,
    body: tetrisFx(),
    label: 'Four-line clear celebration',
  }),
  BOARD_W * 2,
  94
);

/* ---- hero playfield ---- */
const board = blocksBoard(BOARD_W, BOARD_H);
const framed = {
  w: FR_W,
  h: FR_H,
  body: `${frameBody()}${place(board.body, WELL_X, WELL_Y, 1)}`,
};
await writeWebp(
  `${R}/mockup_playfield.webp`,
  svgDoc(FR_W, FR_H, {
    defs: board.defs + frameDefs,
    bg: `<rect width="${FR_W}" height="${FR_H}" fill="#07090d"/>`,
    body: framed.body,
    label: 'Block Cascade playfield',
  }),
  FR_W * 2,
  94
);

/* ---- review mockup ---- */
const W = 1600;
const H = 1000;
const slotW = 620;
const slotH = 640;
const win = { x: 92, y: 158, w: slotW, h: slotH + 34, title: 'minigame — block cascade' };
const iconMark = `<g transform="translate(${win.x + 12} ${win.y + 5})">
  <path d="${rr(0, 0, 24, 24, 7)}" fill="#1d2430" stroke="${BRAND.minigame.accent}" stroke-width="1.6"/>
  <rect x="5" y="5" width="7" height="7" rx="1.8" fill="${BRAND.minigame.light}"/>
  <rect x="12" y="12" width="7" height="7" rx="1.8" fill="${BRAND.minigame.light}"/>
  <rect x="5" y="12" width="7" height="7" rx="1.8" fill="${BRAND.minigame.light}" opacity="0.5"/>
</g>`;

const railX = win.x + win.w + 40;
const railW = W - railX - 92;
let rail = railPanel(railX, 158, railW, 250, 'SEVEN FACES — SOFT BEVEL, BRIGHT ON DARK');
let fx = railX + 26;
for (const k of order) {
  rail += place(tetroFace(k, 128), fx, 196, 0.66);
  rail += caption(fx + 42, 310, k);
  fx += 98;
}
rail += place(ghostTile(128), railX + 40, 322, 0.42);
rail += caption(railX + 67, 394, 'ghost piece', { size: 10.5 });
rail += place(tetroFace('I', 128), railX + 200, 322, 0.42);
rail += place(tetroFace('I', 128), railX + 227, 322, 0.42);
rail += place(tetroFace('I', 128), railX + 254, 322, 0.42);
rail += place(tetroFace('I', 128), railX + 281, 322, 0.42);
rail += caption(railX + 254, 394, 'atlas order — I O T S Z J L', { size: 10.5 });

rail += railPanel(railX, 420, railW, 180, 'LINE CLEAR — FOUR FRAMES');
rail += `<g transform="translate(${railX + 20} 450) scale(${((railW - 40) / BOARD_W).toFixed(4)} 0.5)">
<rect width="${BOARD_W}" height="224" fill="#0b0f16"/>
${[0, 1, 2, 3].map((i) => place(clearRowFrame(i), 0, i * 56, 1)).join('')}
</g>`;
rail += caption(railX + railW / 2, 584, 'single clears stay quiet; the strip is the shape of the pop');

rail += railPanel(railX, 612, railW, 222, 'FOUR-LINE CLEAR — THE ONLY MAJOR EVENT');
rail += `<g transform="translate(${railX + 274} 638) scale(0.26)">${tetrisFx()}</g>`;
rail += caption(railX + railW / 2, 822, 'fx_tetris — the one clear allowed to compete with the other windows', { size: 10.5 });

const svg = reviewSheet({
  w: W,
  h: H,
  title: 'BLOCK CASCADE',
  subtitle: 'dark modern well, bright bevelled pieces — 10:16 board letterboxed in its slot',
  brand: BRAND.minigame,
  window: { ...win, icon: iconMark },
  interior: (inner) =>
    place(letterbox(framed, slotW, slotH), inner.x, inner.y, inner.w / slotW),
  rail,
  defs:
    board.defs +
    frameDefs +
    fxRowDefs +
    bevelDefs('bcfx', { base: '#ffd27a', light: '#fff9e8', dark: '#b45a00' }) +
    `<radialGradient id="fx-t-wash" cx="0.5" cy="0.84" r="0.8"><stop offset="0" stop-color="#ff8c00" stop-opacity="0.45"/><stop offset="0.6" stop-color="#a371f7" stop-opacity="0.16"/><stop offset="1" stop-color="#6e40c9" stop-opacity="0"/></radialGradient>
<linearGradient id="fx-t-rows" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d6" stop-opacity="0.1"/><stop offset="1" stop-color="#fff3d6" stop-opacity="0.75"/></linearGradient>
<radialGradient id="fx-t-core" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="0.45" stop-color="#ffd27a" stop-opacity="0.4"/><stop offset="1" stop-color="#ff8c00" stop-opacity="0"/></radialGradient>
<clipPath id="fx-t-clip"><rect width="${BOARD_W}" height="${BOARD_H}" rx="6"/></clipPath>`,
  legend: [
    'Board is authored at 10:16 and pillarboxed — the well never stretches',
    'One near-complete row is left visible: the natural Attention Request',
    'Ghost piece shows the landing slot so precision is never required',
    'Piece faces are soft-bevelled so they sit beside Wave without clashing',
  ],
  footer: 'skin_blocks.json carries the flat fallbacks, the atlas order and the FX manifest',
  seed: 83,
});

writeSvg('content/mockups/minigame_blocks.svg', svg);
await writeWebp('content/mockups/minigame_blocks.webp', svg, W, 92);

console.log('phase E4 block cascade: done');
