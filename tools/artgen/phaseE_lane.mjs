import { svgDoc } from './lib/card.mjs';
import { castDefs, enemyBoss, enemyNormal, fxSharedDefs, soldierStanding } from './lib/cast.mjs';
import {
  counterPlate,
  PICKUPS,
  barrierClip,
  bevelDefs,
  explosion,
  fxDefs,
  hazardBarrier,
  hazardMine,
  hitSpark,
  muzzleFlash,
  pickup,
  propSharedDefs,
} from './lib/props.mjs';
import { backdrop, groundTile, laneGuide } from './lib/tex.mjs';
import { lanePlayfield, letterbox, place } from './lib/playfields.mjs';
import { caption, railPanel, reviewSheet } from './lib/mockup.mjs';
import { BRAND, n, rr } from './lib/brand.mjs';
import { writePng, writeSvg, writeWebp } from './lib/render.mjs';

const R = 'content/minigames/lane_defender';
const castAll = fxSharedDefs() + castDefs('c');
const propAll =
  propSharedDefs() +
  fxDefs() +
  barrierClip() +
  bevelDefs('mine', { base: '#4a5260', light: '#8e9aab', dark: '#222832' }) +
  bevelDefs('mine-spike', { base: '#5a6472', light: '#9aa6b6', dark: '#262d37' }) +
  bevelDefs('barrier', { base: '#c9a227', light: '#f3dc8a', dark: '#6f550c' }) +
  Object.entries(PICKUPS)
    .map(([k, v]) => bevelDefs(`pk-${k}`, v))
    .join('');

/* ---- cast (hi-fi replacements for the starter SVGs) ---- */
const cast = [
  ['player_soldier', 160, 200, soldierStanding('c'), 'Lane Defender player soldier'],
  ['enemy_normal', 160, 160, enemyNormal('c'), 'Lane Defender normal enemy'],
  ['enemy_boss', 364, 240, enemyBoss('c', { integrity: 24 }), 'Lane Defender boss'],
];
for (const [name, w, h, body, label] of cast) {
  const svg = svgDoc(w, h, { defs: castAll, body, label });
  writeSvg(`${R}/${name}.svg`, svg);
  await writePng(`${R}/${name}.png`, svg, w * 2);
}

/* ---- hazards ---- */
await writePng(
  `${R}/hazard_mine.png`,
  svgDoc(140, 140, { defs: propAll, body: hazardMine(), label: 'Bevelled mine hazard' }),
  280
);
await writePng(
  `${R}/hazard_barrier.png`,
  svgDoc(252, 140, { defs: propAll, body: hazardBarrier('b', { value: '-8' }), label: 'Bevelled barrier hazard with counter' }),
  504
);

/* ---- pickups ---- */
for (const kind of Object.keys(PICKUPS)) {
  await writePng(
    `${R}/pickup_${kind}.png`,
    svgDoc(112, 112, { defs: propAll, body: pickup(kind), label: `${PICKUPS[kind].label} pickup` }),
    224
  );
}

/* ---- board layers ---- */
const lg = laneGuide(480, 640, { converge: 0.1 });
await writePng(
  `${R}/lane_guide.png`,
  svgDoc(480, 640, { defs: lg.defs, body: lg.body, label: 'Three-lane markings' }),
  960
);

const gt = groundTile(256);
await writePng(
  `${R}/ground.png`,
  svgDoc(480, 480, {
    defs: `${gt.defs}<pattern id="ld-gt" width="256" height="256" patternUnits="userSpaceOnUse">${gt.body}</pattern>`,
    body: '<rect width="480" height="480" fill="url(#ld-gt)"/>',
    label: 'Lane Defender ground fill',
  }),
  960
);

const bd = backdrop(480, 200);
await writePng(
  `${R}/backdrop.png`,
  svgDoc(480, 200, { defs: bd.defs, body: bd.body, label: 'Lane Defender backdrop' }),
  960
);

/* ---- hero playfield (letterboxed, never stretched) ---- */
const pf = lanePlayfield(480, 640);
const slotW = 620;
const slotH = 640;
await writeWebp(
  `${R}/mockup_playfield.webp`,
  svgDoc(slotW, slotH, {
    defs: pf.defs,
    body: letterbox(pf, slotW, slotH),
    label: 'Lane Defender playfield letterboxed into its slot',
  }),
  slotW * 2,
  94
);

/* ---- review mockup ---- */
const W = 1600;
const H = 1000;
const win = { x: 92, y: 158, w: slotW, h: slotH + 34, title: 'minigame — lane defender' };

function iconMark(x, y, s) {
  return `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="${rr(0, 0, 24, 24, 7)}" fill="#1d2430" stroke="${BRAND.minigame.accent}" stroke-width="1.6"/>
  <path d="M6 19 V8 M12 19 V5 M18 19 V11" stroke="${BRAND.minigame.light}" stroke-width="2.4" stroke-linecap="round"/>
</g>`;
}

const railX = win.x + win.w + 40;
const railW = W - railX - 92;
let rail = railPanel(railX, 158, railW, 222, 'CAST — CARDBOARD CUTOUTS');
rail += place(soldierStanding('c'), railX + 26, 186, 0.66);
rail += caption(railX + 26 + 53, 350, 'player');
rail += place(enemyNormal('c'), railX + 148, 216, 0.66);
rail += caption(railX + 148 + 51, 350, 'enemy');
rail += place(enemyBoss('c', { integrity: 24 }), railX + 240, 198, 0.55);
rail += caption(railX + 240 + 100, 350, 'boss — integrity on the chest plate');

rail += railPanel(railX, 392, railW, 176, 'HAZARDS — BEVELLED PRIMITIVES');
rail += place(hazardMine(), railX + 26, 416, 0.76);
rail += caption(railX + 26 + 53, 545, 'mine');
rail += place(hazardBarrier('b', { value: '-8' }), railX + 150, 440, 0.8);
rail += caption(railX + 150 + 100, 545, 'barrier — counter walks up per shot');

rail += railPanel(railX, 580, railW, 126, 'PICKUPS');
let px = railX + 22;
for (const kind of Object.keys(PICKUPS)) {
  rail += place(pickup(kind), px, 598, 0.6);
  rail += caption(px + 34, 690, PICKUPS[kind].label, { size: 9.5 });
  px += 84;
}

rail += railPanel(railX, 718, railW, 116, 'FX — ONLY BIG EVENTS COMPETE');
rail += place(muzzleFlash(), railX + 26, 742, 0.5);
rail += caption(railX + 61, 824, 'muzzle flash');
rail += place(explosion(), railX + 134, 738, 0.37);
rail += caption(railX + 171, 824, 'boss explosion');
rail += place(hitSpark(), railX + 248, 754, 0.68);
rail += caption(railX + 278, 824, 'hit spark');
rail += place(counterSample(), railX + 340, 748, 1);
rail += caption(railX + 420, 824, 'numeric indicators');

function counterSample() {
  return `<g>${counterPlate(40, 22, 76, 40, '+24', { positive: true })}${counterPlate(136, 22, 76, 40, '-12', { positive: false })}</g>`;
}

const svg = reviewSheet({
  w: W,
  h: H,
  title: 'LANE DEFENDER',
  subtitle: 'three lanes, automatic fire, numeric hazards — 3:4 playfield letterboxed in its slot',
  brand: BRAND.minigame,
  window: { ...win, icon: iconMark(win.x + 12, win.y + 5, 1) },
  interior: (inner) => place(letterbox(pf, slotW, slotH), inner.x, inner.y, inner.w / slotW),
  rail,
  defs: pf.defs + castAll + propAll,
  legend: [
    'Playfield is authored at 3:4 and pillarboxed in near-black — never stretched',
    'Boss integrity and hazard counters sit on their own plates, not on the art',
    'Normal enemies get a hit spark only; bosses and rare drops get the spectacle',
    'Cutouts share one cast with Endless Runner; hazards are bevelled primitives',
  ],
  footer: 'neutral slate frame #93a1b2 — the minigame never borrows a service window accent',
  seed: 31,
});

writeSvg('content/mockups/minigame_lane.svg', svg);
await writeWebp('content/mockups/minigame_lane.webp', svg, W, 92);

console.log('phase E2 lane defender: done');

