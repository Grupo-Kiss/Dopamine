import { BRAND, n, rng, rr } from './brand.mjs';
import { castDefs, enemyBoss, enemyNormal, fxSharedDefs, soldierRunning, soldierStanding } from './cast.mjs';
import {
  PICKUPS,
  aura,
  bev,
  bevelDefs,
  barrierClip,
  counterPlate,
  explosion,
  fxDefs,
  hazardBarrier,
  hazardMine,
  hitSpark,
  muzzleFlash,
  pickup,
  propSharedDefs,
} from './props.mjs';
import { backdrop, groundTile, laneGuide, noiseDefs } from './tex.mjs';

export function place(markup, x, y, s = 1) {
  return `<g transform="translate(${n(x)} ${n(y)}) scale(${n(s)})">${markup}</g>`;
}

export function playfieldDefs() {
  return (
    fxSharedDefs() +
    castDefs('pf') +
    propSharedDefs() +
    fxDefs() +
    barrierClip() +
    bevelDefs('mine', { base: '#4a5260', light: '#8e9aab', dark: '#222832' }) +
    bevelDefs('mine-spike', { base: '#5a6472', light: '#9aa6b6', dark: '#262d37' }) +
    bevelDefs('barrier', { base: '#c9a227', light: '#f3dc8a', dark: '#6f550c' }) +
    Object.entries(PICKUPS)
      .map(([k, v]) => bevelDefs(`pk-${k}`, v))
      .join('')
  );
}

/** Small arcade float used for score / Dopamine ticks inside the playfield. */
export function float(x, y, text, { positive = true, size = 26, rot = -7 } = {}) {
  const fill = positive ? '#ffe566' : '#ff8fa3';
  return `<g transform="rotate(${rot} ${n(x)} ${n(y)})">
  <text x="${n(x)}" y="${n(y)}" font-family="Teko, Arial Narrow, sans-serif" font-size="${size}" font-weight="600" fill="#10151d" stroke="#10151d" stroke-width="${n(size * 0.28)}" text-anchor="middle" letter-spacing="1">${text}</text>
  <text x="${n(x)}" y="${n(y)}" font-family="Teko, Arial Narrow, sans-serif" font-size="${size}" font-weight="600" fill="${fill}" text-anchor="middle" letter-spacing="1">${text}</text>
</g>`;
}

/* ------------------------------------------------------------------ */
/* Lane Defender — 3:4 top-down board                                  */
/* ------------------------------------------------------------------ */

export function lanePlayfield(w = 480, h = 640) {
  const bd = backdrop(w, Math.round(h * 0.3));
  const gt = groundTile(256);
  const lg = laneGuide(w, h, { converge: 0.1 });
  const horizon = Math.round(h * 0.235);

  const defs = `
${playfieldDefs()}
${bd.defs}
${gt.defs}
${lg.defs}
<pattern id="lp-ground" width="256" height="256" patternUnits="userSpaceOnUse">${gt.body}</pattern>
<linearGradient id="lp-depth" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#05070a" stop-opacity="0.95"/>
  <stop offset="0.3" stop-color="#05070a" stop-opacity="0.45"/>
  <stop offset="1" stop-color="#05070a" stop-opacity="0"/>
</linearGradient>
<radialGradient id="lp-playerglow" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#9ccc65" stop-opacity="0.26"/>
  <stop offset="1" stop-color="#9ccc65" stop-opacity="0"/>
</radialGradient>
<clipPath id="lp-box"><rect width="${w}" height="${h}" rx="4"/></clipPath>
${noiseDefs('lp', 0.95, 0.055, 17)}`;

  const laneX = (lane, t) => lg.laneX(t, lane);

  const body = `<g clip-path="url(#lp-box)">
  <rect width="${w}" height="${h}" fill="#0b0f15"/>
  <g>${bd.body}</g>
  <rect y="${horizon}" width="${w}" height="${h - horizon}" fill="url(#lp-ground)"/>
  <rect y="${horizon}" width="${w}" height="${n(h * 0.3)}" fill="url(#lp-depth)"/>
  <g>${lg.body}</g>
  <ellipse cx="${w / 2}" cy="${horizon}" rx="${n(w * 0.6)}" ry="${n(h * 0.1)}" fill="#a371f7" opacity="0.1"/>

  ${place(enemyBoss('pf', { integrity: 24 }), laneX(1, 0.08) - 360 * 0.31, horizon - 16, 0.62)}

  ${place(enemyNormal('pf'), laneX(0, 0.6) - 78 * 0.82, h * 0.6 - 74, 0.82)}
  ${place(hitSpark(), laneX(0, 0.6) - 26, h * 0.6 - 92, 0.86)}
  ${place(enemyNormal('pf'), laneX(2, 0.52) - 78 * 0.68, h * 0.52 - 62, 0.68)}

  ${place(hazardBarrier('pf', { value: '-8' }), laneX(2, 0.68) - 126 * 0.58, h * 0.68 - 36, 0.58)}
  ${place(hazardMine(), laneX(0, 0.78) - 70 * 0.82, h * 0.78 - 58, 0.82)}
  ${place(pickup('rapid_fire'), laneX(1, 0.62) - 56 * 0.8, h * 0.62 - 46, 0.8)}

  <ellipse cx="${n(laneX(1, 1) )}" cy="${n(h - 54)}" rx="${n(w * 0.19)}" ry="${n(h * 0.11)}" fill="url(#lp-playerglow)"/>
  ${place(soldierStanding('pf'), laneX(1, 1) - 80 * 0.86, h - 190, 0.86)}
  ${place(muzzleFlash(), laneX(1, 1) - 80 * 0.86 + 116 - 50, h - 190 + 11 - 50, 0.72)}

  ${float(laneX(0, 0.6) + 2, h * 0.6 - 98, '+120')}
  ${float(laneX(2, 0.68) + 26, h * 0.68 - 44, 'x8', { positive: false, size: 20, rot: 5 })}

  <rect width="${w}" height="${h}" filter="url(#nz-lp)"/>
</g>`;

  return { defs, body, w, h };
}

/* ------------------------------------------------------------------ */
/* Endless Runner — 3:4 forward-scroll board                           */
/* ------------------------------------------------------------------ */

export function runnerDefs() {
  return (
    bevelDefs('ob-a', { base: '#f0564a', light: '#ffa79c', dark: '#8c1c17' }) +
    bevelDefs('ob-b', { base: '#78859a', light: '#c3cdda', dark: '#333c4a' }) +
    bevelDefs('ob-m', { base: '#b06bff', light: '#dcc0ff', dark: '#4e1f8f' }) +
    bevelDefs('coin', { base: '#f5c23a', light: '#fff0b8', dark: '#a9760a' }) +
    bevelDefs('rare', { base: '#35d6e8', light: '#d4fbff', dark: '#116b7a' }) +
    bevelDefs('rail', { base: '#232c3a', light: '#3d4a60', dark: '#121821' })
  );
}

/** Readable obstacle type 1: hazard-striped block. */
export function obstacleStaticA() {
  const body = rr(10, 22, 132, 76, 14);
  return `<g filter="url(#pr-soft)">
${bev(body, 'ob-a', { key: 4 })}
<g clip-path="url(#ob-clip-a)">
  ${[18, 46, 74, 102].map((x) => `<path d="M${x} 26 l20 0 l-24 68 l-20 0 Z" fill="#2a0a08" opacity="0.5"/>`).join('')}
</g>
<path d="${rr(18, 28, 116, 14, 7)}" fill="#ffffff" opacity="0.2"/>
</g>`;
}

/** Readable obstacle type 2: bevelled bollard row. */
export function obstacleStaticB() {
  const post = (x) => bev(rr(x, 18, 34, 84, 16), 'ob-b', { key: 4 });
  return `<g filter="url(#pr-soft)">
${post(10)}${post(58)}${post(106)}
<path d="M14 84 H146" stroke="#f5c23a" stroke-width="10" stroke-opacity="0.9" stroke-linecap="round"/>
<path d="M14 36 H146" stroke="#f5c23a" stroke-width="8" stroke-opacity="0.65" stroke-linecap="round"/>
</g>`;
}

/** Type 3 telegraphs its sweep direction with chevrons (`04`). */
export function obstacleMoving() {
  const body = rr(28, 26, 112, 70, 18);
  const chev = (x, o) =>
    `<path d="M${x} 42 l16 19 l-16 19" fill="none" stroke="#ffe566" stroke-width="6" stroke-opacity="${o}" stroke-linecap="round" stroke-linejoin="round"/>`;
  return `<g filter="url(#pr-soft)">
${bev(body, 'ob-m', { key: 4 })}
<path d="${rr(36, 32, 96, 14, 7)}" fill="#ffffff" opacity="0.22"/>
<g transform="translate(14 0)">${chev(132, 0.95)}${chev(152, 0.55)}${chev(172, 0.25)}</g>
<g transform="translate(-14 0) rotate(180 20 61)">${chev(0, 0.6)}${chev(20, 0.3)}</g>
</g>`;
}

export function collectible({ rare = false } = {}) {
  const c = 56;
  const id = rare ? 'rare' : 'coin';
  if (!rare) {
    return `<g>
${aura(id, c, c, 40, 0.75)}
${bev(`M${c} ${c - 28} A28 28 0 1 1 ${c - 0.01} ${c - 28} Z`, id, { key: 3.6 })}
<circle cx="${c}" cy="${c}" r="16" fill="#fff3c4" opacity="0.4"/>
<path d="M${c - 7} ${c - 12} l14 0 l-9 14 h9 l-16 20 l5 -16 h-9 Z" fill="#7a5100"/>
</g>`;
  }
  const gem = `M${c} ${c - 34} L${c + 26} ${c - 10} L${c + 16} ${c + 30} L${c - 16} ${c + 30} L${c - 26} ${c - 10} Z`;
  let sparks = '';
  for (const [sx, sy, sr] of [
    [c - 36, c - 30, 5],
    [c + 36, c - 18, 4],
    [c + 26, c + 34, 3.4],
    [c - 30, c + 32, 3],
  ]) {
    sparks += `<path d="M${sx} ${sy - sr * 2.4} L${sx + sr} ${sy} L${sx} ${sy + sr * 2.4} L${sx - sr} ${sy} Z" fill="#eafcff"/>`;
  }
  return `<g>
${aura(id, c, c, 52, 1)}
${bev(gem, id, { key: 4.2 })}
<path d="M${c} ${c - 30} L${c + 11} ${c - 8} L${c} ${c + 24} L${c - 11} ${c - 8} Z" fill="#ffffff" opacity="0.3"/>
${sparks}
</g>`;
}

export function parallaxStrip(w, h, { near = false, seed = 5 } = {}) {
  const r = rng(seed);
  const base = near ? '#131a26' : '#1b2437';
  const top = near ? '#1f2a3d' : '#2b3a58';
  let blocks = '';
  let x = -20;
  while (x < w + 20) {
    const bw = (near ? 46 : 28) + r() * (near ? 86 : 54);
    const bh = (near ? 0.34 : 0.3) * h + r() * h * (near ? 0.6 : 0.52);
    blocks += `<path d="${rr(x, h - bh, bw, bh + 16, near ? 10 : 6)}" fill="${base}"/>`;
    blocks += `<path d="${rr(x + 3, h - bh + 3, bw - 6, 10, 5)}" fill="${top}" opacity="0.7"/>`;
    if (r() > 0.5)
      blocks += `<rect x="${n(x + bw * 0.25)}" y="${n(h - bh + 22)}" width="${n(bw * 0.2)}" height="${n(bh * 0.18)}" rx="2" fill="#ffd27a" opacity="${n(0.12 + r() * 0.2)}"/>`;
    x += bw + 4 + r() * 16;
  }
  return blocks;
}

export function runnerPlayfield(w = 480, h = 640) {
  const defs = `
${playfieldDefs()}
${runnerDefs()}
<linearGradient id="rn-sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a0f18"/>
  <stop offset="0.45" stop-color="#1b1a3c"/>
  <stop offset="0.8" stop-color="#3b2358"/>
  <stop offset="1" stop-color="#160e26"/>
</linearGradient>
<radialGradient id="rn-sun" cx="0.5" cy="1" r="0.8">
  <stop offset="0" stop-color="#ffb36b" stop-opacity="0.72"/>
  <stop offset="0.4" stop-color="#c9589b" stop-opacity="0.32"/>
  <stop offset="1" stop-color="#6e40c9" stop-opacity="0"/>
</radialGradient>
<linearGradient id="rn-road" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#101723"/>
  <stop offset="1" stop-color="#1d2735"/>
</linearGradient>
<linearGradient id="rn-fade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.08"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0.8"/>
</linearGradient>
<clipPath id="rn-box"><rect width="${w}" height="${h}" rx="4"/></clipPath>
${noiseDefs('rn', 0.95, 0.055, 29)}
<clipPath id="ob-clip-a"><path d="${rr(10, 22, 132, 76, 14)}"/></clipPath>`;

  const horizon = Math.round(h * 0.3);
  const roadTop = w * 0.3;
  const rx = (t, frac) => {
    const top = roadTop + (w - 2 * roadTop) * frac;
    return top + (w * frac - top) * t;
  };
  const lane = (i, t) => rx(t, (i + 0.5) / 3);
  const scaleAt = (t) => 0.28 + 0.62 * t;

  let rungs = '';
  let y = horizon + 6;
  let step = 12;
  while (y < h) {
    const t = (y - horizon) / (h - horizon);
    rungs += `<path d="M${n(rx(t, 0))} ${n(y)} H${n(rx(t, 1))}" stroke="#55657a" stroke-width="${n(1 + t * 1.6)}" stroke-opacity="${n(0.05 + 0.13 * t)}"/>`;
    y += step;
    step *= 1.14;
  }
  let dashes = '';
  for (const frac of [1 / 3, 2 / 3]) {
    let dy = horizon + 10;
    let ds = 14;
    while (dy < h) {
      const t = (dy - horizon) / (h - horizon);
      const wd = 2.4 + 5 * t;
      dashes += `<rect x="${n(rx(t, frac) - wd / 2)}" y="${n(dy)}" width="${n(wd)}" height="${n(ds * 0.6)}" rx="${n(wd / 2)}" fill="url(#rn-fade)" opacity="${n(0.25 + 0.6 * t)}"/>`;
      dy += ds;
      ds *= 1.15;
    }
  }

  const body = `<g clip-path="url(#rn-box)">
  <rect width="${w}" height="${h}" fill="url(#rn-sky)"/>
  <ellipse cx="${w / 2}" cy="${n(horizon + 10)}" rx="${n(w * 0.7)}" ry="${n(h * 0.3)}" fill="url(#rn-sun)"/>
  <g transform="translate(0 ${n(horizon - 118)})" opacity="0.85">${parallaxStrip(w, 128, { seed: 13 })}</g>
  <g transform="translate(0 ${n(horizon - 74)})">${parallaxStrip(w, 84, { near: true, seed: 41 })}</g>
  <path d="M${n(roadTop)} ${horizon} H${n(w - roadTop)} L${w} ${h} H0 Z" fill="url(#rn-road)"/>
  <path d="M${n(roadTop)} ${horizon} L0 ${h}" stroke="#93a1b2" stroke-width="3" stroke-opacity="0.3"/>
  <path d="M${n(w - roadTop)} ${horizon} L${w} ${h}" stroke="#93a1b2" stroke-width="3" stroke-opacity="0.3"/>
  ${rungs}${dashes}

  ${place(obstacleStaticB(), lane(0, 0.46) - 80 * scaleAt(0.46), horizon + (h - horizon) * 0.46 - 70 * scaleAt(0.46), scaleAt(0.46))}
  ${place(obstacleStaticA(), lane(2, 0.56) - 76 * scaleAt(0.56), horizon + (h - horizon) * 0.56 - 64 * scaleAt(0.56), scaleAt(0.56))}
  ${place(obstacleMoving(), lane(1, 0.45) - 84 * scaleAt(0.45), horizon + (h - horizon) * 0.45 - 62 * scaleAt(0.45), scaleAt(0.45))}

  ${place(collectible(), lane(0, 0.58) - 56 * 0.46, horizon + (h - horizon) * 0.58 - 56 * 0.46, 0.46)}
  ${place(collectible(), lane(0, 0.68) - 56 * 0.54, horizon + (h - horizon) * 0.68 - 56 * 0.54, 0.54)}
  ${place(collectible(), lane(0, 0.78) - 56 * 0.62, horizon + (h - horizon) * 0.78 - 56 * 0.62, 0.62)}
  ${place(collectible({ rare: true }), lane(2, 0.76) - 56 * 0.8, horizon + (h - horizon) * 0.76 - 56 * 0.8, 0.8)}

  ${place(soldierRunning('pf'), lane(1, 1) - 88 * 0.82, h - 184, 0.82)}
  ${float(lane(2, 0.76) + 20, horizon + (h - horizon) * 0.76 + 54, 'RARE!')}
  ${float(lane(0, 0.68) + 38, horizon + (h - horizon) * 0.68 + 4, '+8', { size: 20, rot: 6 })}
  <rect width="${w}" height="${h}" filter="url(#nz-rn)"/>
</g>`;
  return { defs, body, w, h };
}

/* ------------------------------------------------------------------ */
/* Block Cascade — 10:16 board                                         */
/* ------------------------------------------------------------------ */

export const TETRO = {
  I: { base: '#35d6e8', light: '#bdf6fd', dark: '#116b7a' },
  O: { base: '#ffcf3d', light: '#fff0b0', dark: '#a37c00' },
  T: { base: '#b06bff', light: '#e3cfff', dark: '#54219b' },
  S: { base: '#44dd8a', light: '#c4f8da', dark: '#13733f' },
  Z: { base: '#ff5470', light: '#ffc0cb', dark: '#9b1230' },
  J: { base: '#4a8cff', light: '#bed6ff', dark: '#1a4499' },
  L: { base: '#ff9f3d', light: '#ffd9ab', dark: '#a85200' },
};

export function tetroDefs() {
  return Object.entries(TETRO)
    .map(([k, v]) => bevelDefs(`tt-${k}`, v))
    .join('');
}

/** Soft-bevel face tile. Authored once, reused by the atlas and the board. */
export function tetroFace(kind, size = 128) {
  const pad = size * 0.045;
  const s = size - pad * 2;
  const tile = rr(pad, pad, s, s, size * 0.17);
  const inner = rr(pad + s * 0.16, pad + s * 0.16, s * 0.68, s * 0.68, size * 0.1);
  return `<g>
${bev(tile, `tt-${kind}`, { key: size * 0.055 })}
<path d="${inner}" fill="#ffffff" opacity="0.07"/>
<path d="${rr(pad + s * 0.1, pad + s * 0.1, s * 0.8, s * 0.2, size * 0.075)}" fill="#ffffff" opacity="0.18"/>
</g>`;
}

export function ghostTile(size = 128) {
  const pad = size * 0.045;
  const s = size - pad * 2;
  return `<g>
<path d="${rr(pad, pad, s, s, size * 0.17)}" fill="#c9d1d9" opacity="0.1"/>
<path d="${rr(pad + 2, pad + 2, s - 4, s - 4, size * 0.15)}" fill="none" stroke="#c9d1d9" stroke-width="${n(size * 0.05)}" stroke-opacity="0.42" stroke-dasharray="${n(size * 0.14)} ${n(size * 0.1)}"/>
</g>`;
}

export function boardBg(w = 400, h = 640, { cols = 10, rows = 16 } = {}) {
  const cw = w / cols;
  const ch = h / rows;
  let grid = '';
  for (let c = 1; c < cols; c++) grid += `<path d="M${n(c * cw)} 0 V${h}" stroke="#1d2430" stroke-width="1.4"/>`;
  for (let r = 1; r < rows; r++) grid += `<path d="M0 ${n(r * ch)} H${w}" stroke="#1d2430" stroke-width="1.4"/>`;
  const defs = `
<linearGradient id="bb-well" x1="0" y1="0" x2="0.4" y2="1">
  <stop offset="0" stop-color="#121722"/>
  <stop offset="1" stop-color="#0b0f16"/>
</linearGradient>
<radialGradient id="bb-vig" cx="0.5" cy="0.42" r="0.78">
  <stop offset="0" stop-color="#2a2150" stop-opacity="0.3"/>
  <stop offset="0.6" stop-color="#120d20" stop-opacity="0.1"/>
  <stop offset="1" stop-color="#000" stop-opacity="0.6"/>
</radialGradient>
${noiseDefs('bb', 1.0, 0.045, 7)}`;
  return {
    defs,
    body: `<rect width="${w}" height="${h}" fill="url(#bb-well)"/>
${grid}
<rect width="${w}" height="${h}" fill="url(#bb-vig)"/>
<rect width="${w}" height="${h}" filter="url(#nz-bb)"/>`,
    cw,
    ch,
  };
}

const STACK = [
  // [row from bottom, cols…] — a believable mid-match well with one near-complete row
  { row: 0, cells: [['J', 0], ['J', 1], ['L', 2], ['L', 3], ['L', 4], ['O', 5], ['O', 6], ['S', 7], ['S', 8]] },
  { row: 1, cells: [['J', 0], ['T', 2], ['T', 3], ['T', 4], ['O', 5], ['O', 6], ['S', 8]] },
  { row: 2, cells: [['J', 0], ['Z', 1], ['T', 3], ['I', 7], ['I', 8]] },
  { row: 3, cells: [['Z', 0], ['Z', 1]] },
];

export function blocksBoard(w = 400, h = 640) {
  const bb = boardBg(w, h);
  const { cw, ch } = bb;
  const cell = (kind, col, rowFromBottom) =>
    place(tetroFace(kind, 128), col * cw, h - (rowFromBottom + 1) * ch, cw / 128);
  let stack = '';
  for (const row of STACK) for (const [k, c] of row.cells) stack += cell(k, c, row.row);

  // Active L piece mid-fall with its ghost landing slot — an Attention Request.
  const active = [
    ['L', 4, 11],
    ['L', 4, 10],
    ['L', 4, 9],
    ['L', 5, 9],
  ];
  let act = '';
  for (const [k, c, r] of active) act += cell(k, c, r);
  let ghost = '';
  for (const [, c, r] of active)
    ghost += place(ghostTile(128), c * cw, h - (r - 7 + 1) * ch, cw / 128);

  const nearlyRow = `<g>
  <rect y="${n(h - ch)}" width="${w}" height="${n(ch)}" fill="#ffe566" opacity="0.1"/>
  <rect x="${n(9 * cw)}" y="${n(h - ch)}" width="${n(cw)}" height="${n(ch)}" fill="none" stroke="#ffe566" stroke-width="3" stroke-opacity="0.75" stroke-dasharray="7 6"/>
</g>`;

  return {
    defs: `${bb.defs}${tetroDefs()}${propSharedDefs()}<clipPath id="bc-box"><rect width="${w}" height="${h}" rx="4"/></clipPath>`,
    body: `<g clip-path="url(#bc-box)">${bb.body}${stack}${nearlyRow}${ghost}${act}</g>`,
    w,
    h,
    cw,
    ch,
  };
}

/**
 * Letterbox a fixed-aspect playfield into a slot (`09`: never stretch; fill the
 * dead space with near-black so the board keeps its authored proportions).
 */
export function letterbox(pf, slotW, slotH, { pad = 0, label = '' } = {}) {
  const s = Math.min((slotW - pad * 2) / pf.w, (slotH - pad * 2) / pf.h);
  const dw = pf.w * s;
  const dh = pf.h * s;
  const dx = (slotW - dw) / 2;
  const dy = (slotH - dh) / 2;
  const bars =
    dx > 1
      ? `<rect width="${n(dx)}" height="${slotH}" fill="#07090d"/><rect x="${n(dx + dw)}" width="${n(slotW - dx - dw)}" height="${slotH}" fill="#07090d"/>
<path d="M${n(dx)} 0 V${slotH}" stroke="#93a1b2" stroke-width="1" stroke-opacity="0.22"/><path d="M${n(dx + dw)} 0 V${slotH}" stroke="#93a1b2" stroke-width="1" stroke-opacity="0.22"/>`
      : `<rect width="${slotW}" height="${n(dy)}" fill="#07090d"/><rect y="${n(dy + dh)}" width="${slotW}" height="${n(slotH - dy - dh)}" fill="#07090d"/>
<path d="M0 ${n(dy)} H${slotW}" stroke="#93a1b2" stroke-width="1" stroke-opacity="0.22"/><path d="M0 ${n(dy + dh)} H${slotW}" stroke="#93a1b2" stroke-width="1" stroke-opacity="0.22"/>`;
  return `<rect width="${slotW}" height="${slotH}" fill="#07090d"/>
${place(pf.body, dx, dy, s)}
${bars}${label}`;
}

/**
 * Retro-neon / Outrun pillar panel for letterbox bars. Authored in a unit
 * square and stretched into each bar: vanishing grid under a striped sun and
 * neon skyline. Intensity without stealing focus from the playfield.
 */
export function neonPillar(w, h, { seed = 11, flip = false } = {}) {
  const r = rng(seed);
  const horizon = h * 0.48;
  const sunCx = w * (flip ? 0.58 : 0.42);
  const sunR = Math.min(w * 0.9, h * 0.22);
  let stars = '';
  for (let i = 0; i < 28; i++) {
    stars += `<circle cx="${n(r() * w)}" cy="${n(r() * horizon * 0.85)}" r="${n(0.4 + r() * 1.1)}" fill="#ffe6ff" opacity="${n(0.15 + r() * 0.55)}"/>`;
  }
  let buildings = '';
  let x = -6;
  while (x < w + 10) {
    const bw = 8 + r() * (w * 0.14);
    const bh = horizon * (0.12 + r() * 0.38);
    buildings += `<rect x="${n(x)}" y="${n(horizon - bh)}" width="${n(bw)}" height="${n(bh + 2)}" fill="#140822"/>`;
    const cols = 1 + Math.floor(r() * 3);
    const rows = 2 + Math.floor(r() * 5);
    for (let c = 0; c < cols; c++) {
      for (let row = 0; row < rows; row++) {
        if (r() > 0.55) continue;
        buildings += `<rect x="${n(x + 2 + c * (bw / cols))}" y="${n(horizon - bh + 4 + row * (bh / (rows + 1)))}" width="${n(Math.max(1.2, bw / cols - 3))}" height="${n(Math.max(1.2, bh / (rows + 2)))}" fill="#ff4fd8" opacity="${n(0.35 + r() * 0.55)}"/>`;
      }
    }
    x += bw + 2 + r() * 6;
  }
  let grid = '';
  const vanishX = w * 0.5;
  for (let i = 1; i <= 8; i++) {
    const t = i / 8;
    const y = horizon + (h - horizon) * (t * t);
    grid += `<path d="M0 ${n(y)} H${w}" stroke="#3de8ff" stroke-width="${n(0.8 + t)}" stroke-opacity="${n(0.12 + 0.45 * t)}"/>`;
  }
  for (let i = -6; i <= 6; i++) {
    const x0 = vanishX + i * (w * 0.08);
    grid += `<path d="M${n(vanishX)} ${n(horizon)} L${n(x0 + i * w * 0.35)} ${h}" stroke="#3de8ff" stroke-width="1.1" stroke-opacity="${n(0.18 + (1 - Math.abs(i) / 7) * 0.35)}"/>`;
  }
  let streaks = '';
  for (let i = 0; i < 5; i++) {
    const sx = r() * w;
    const sy = horizon + r() * (h - horizon) * 0.7;
    streaks += `<rect x="${n(sx)}" y="${n(sy)}" width="${n(w * (0.2 + r() * 0.35))}" height="${n(1 + r() * 1.6)}" rx="1" fill="#ff4fd8" opacity="${n(0.2 + r() * 0.35)}" transform="rotate(${n((r() - 0.5) * 18)} ${n(sx)} ${n(sy)})"/>`;
  }
  const defs = `
<linearGradient id="np-sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#12061f"/>
  <stop offset="0.45" stop-color="#3a0f5c"/>
  <stop offset="0.78" stop-color="#a11d6e"/>
  <stop offset="1" stop-color="#1a0530"/>
</linearGradient>
<radialGradient id="np-sun" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#ffe566"/>
  <stop offset="0.45" stop-color="#ff9a3c"/>
  <stop offset="1" stop-color="#ff4d8d" stop-opacity="0"/>
</radialGradient>
<linearGradient id="np-floor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#14082a"/>
  <stop offset="1" stop-color="#05030c"/>
</linearGradient>
<linearGradient id="np-haze" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#05070a" stop-opacity="0.35"/>
  <stop offset="0.55" stop-color="#05070a" stop-opacity="0.08"/>
  <stop offset="1" stop-color="#05070a" stop-opacity="0"/>
</linearGradient>
<clipPath id="np-box"><rect width="${w}" height="${h}"/></clipPath>`;
  const sunCy = horizon - sunR * 0.15;
  let sunBands = '';
  for (let i = 0; i < 6; i++) {
    const y = sunCy + sunR * 0.05 + i * (sunR * 0.2);
    sunBands += `<rect x="${n(sunCx - sunR)}" y="${n(y)}" width="${n(sunR * 2)}" height="${n(sunR * 0.07)}" fill="#3a0f5c" opacity="0.55"/>`;
  }
  const body = `<g clip-path="url(#np-box)">
  <rect width="${w}" height="${h}" fill="url(#np-sky)"/>
  ${stars}
  <circle cx="${n(sunCx)}" cy="${n(sunCy)}" r="${n(sunR)}" fill="url(#np-sun)" opacity="0.95"/>
  ${sunBands}
  <ellipse cx="${n(sunCx)}" cy="${n(horizon)}" rx="${n(sunR * 1.6)}" ry="${n(sunR * 0.28)}" fill="#ff9a3c" opacity="0.35"/>
  ${buildings}
  <path d="M0 ${n(horizon)} H${w}" stroke="#ffe566" stroke-width="2" stroke-opacity="0.75"/>
  <rect y="${n(horizon)}" width="${w}" height="${n(h - horizon)}" fill="url(#np-floor)"/>
  ${grid}
  ${streaks}
  <rect width="${w}" height="${h}" fill="url(#np-haze)"${flip ? ' transform="scale(-1 1) translate(-' + w + ' 0)"' : ''}/>
</g>`;
  return { defs, body };
}

/**
 * Lane Defender in a slot wider than 3:4. The board stays letterboxed at its
 * authored 3:4; the leftover bars are not empty black and are not an extension
 * of the play world — they carry a retro-neon city / infinite-grid stage so the
 * slot still reads as arcade intensity.
 */
export function laneSlot(slotW, slotH, { pfW = 480, pfH = 640 } = {}) {
  const pf = lanePlayfield(pfW, pfH);
  const s = slotH / pfH;
  const dw = pfW * s;
  const dx = (slotW - dw) / 2;
  const left = neonPillar(Math.max(1, dx), slotH, { seed: 11, flip: false });
  const right = neonPillar(Math.max(1, slotW - dx - dw), slotH, { seed: 29, flip: true });
  // Prefix right-hand defs so the two panels don't collide on gradient ids.
  const rightDefs = right.defs
    .replace(/\sid="np-/g, ' id="npR-')
    .replace(/url\(#np-/g, 'url(#npR-');
  const rightBody = right.body
    .replace(/url\(#np-/g, 'url(#npR-')
    .replace(/id="np-box"/g, 'id="npR-box"');
  const defs = `${pf.defs}${left.defs}${rightDefs}`;
  const body = `<rect width="${slotW}" height="${slotH}" fill="#07090d"/>
${dx > 1 ? place(left.body, 0, 0, 1) : ''}
${place(pf.body, dx, 0, s)}
${dx > 1 ? place(rightBody, dx + dw, 0, 1) : ''}
<path d="M${n(dx)} 0 V${slotH}" stroke="#a371f7" stroke-width="1.4" stroke-opacity="0.45"/>
<path d="M${n(dx + dw)} 0 V${slotH}" stroke="#a371f7" stroke-width="1.4" stroke-opacity="0.45"/>`;
  return {
    defs,
    body,
    box: { x: dx, y: 0, w: dw, h: slotH, s },
  };
}

export { svgDoc } from './card.mjs';
