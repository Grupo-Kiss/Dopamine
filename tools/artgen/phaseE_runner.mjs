import { svgDoc } from './lib/card.mjs';
import { castDefs, fxSharedDefs, soldierRunning } from './lib/cast.mjs';
import { fxDefs, propSharedDefs } from './lib/props.mjs';
import {
  collectible,
  letterbox,
  obstacleMoving,
  obstacleStaticA,
  obstacleStaticB,
  parallaxStrip,
  place,
  playfieldDefs,
  runnerDefs,
  runnerPlayfield,
} from './lib/playfields.mjs';
import { caption, railPanel, reviewSheet } from './lib/mockup.mjs';
import { BRAND, rr } from './lib/brand.mjs';
import { writePng, writeSvg, writeWebp } from './lib/render.mjs';

const R = 'content/minigames/endless_runner';
const castAll = fxSharedDefs() + castDefs('c');
const propAll = propSharedDefs() + fxDefs() + runnerDefs();
const obClip = `<clipPath id="ob-clip-a"><path d="${rr(10, 22, 132, 76, 14)}"/></clipPath>`;

/* ---- cast ---- */
const runnerSvg = svgDoc(180, 200, { defs: castAll, body: soldierRunning('c'), label: 'Endless Runner player soldier' });
writeSvg(`${R}/player_soldier.svg`, runnerSvg);
await writePng(`${R}/player_soldier.png`, runnerSvg, 360);

/* ---- obstacles: three readable types, one of which telegraphs motion ---- */
const obstacles = [
  ['obstacle_static_a', 152, 120, obstacleStaticA(), 'Static obstacle — hazard-striped block'],
  ['obstacle_static_b', 160, 120, obstacleStaticB(), 'Static obstacle — bollard row'],
  ['obstacle_moving', 196, 122, obstacleMoving(), 'Moving obstacle — sweep telegraphed by chevrons'],
];
for (const [name, w, h, body, label] of obstacles) {
  await writePng(`${R}/${name}.png`, svgDoc(w, h, { defs: propAll + obClip, body, label }), w * 2);
}

/* ---- collectibles ---- */
await writePng(
  `${R}/collectible.png`,
  svgDoc(112, 112, { defs: propAll, body: collectible(), label: 'Ordinary collectible' }),
  224
);
await writePng(
  `${R}/collectible_rare.png`,
  svgDoc(112, 112, { defs: propAll, body: collectible({ rare: true }), label: 'Rare collectible' }),
  224
);

/* ---- scrolling strips ---- */
const stripW = 480;
const stripH = 320;
const roadTop = stripW * 0.3;
let rungs = '';
let y = 6;
let step = 10;
while (y < stripH) {
  const t = y / stripH;
  rungs += `<path d="M${(roadTop + (0 - roadTop) * t).toFixed(2)} ${y.toFixed(2)} H${(stripW - roadTop + roadTop * t).toFixed(2)}" stroke="#55657a" stroke-width="${(1 + t * 1.6).toFixed(2)}" stroke-opacity="${(0.05 + 0.13 * t).toFixed(3)}"/>`;
  y += step;
  step *= 1.17;
}
await writePng(
  `${R}/ground_strip.png`,
  svgDoc(stripW, stripH, {
    defs: `<linearGradient id="gs-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101723"/><stop offset="1" stop-color="#1d2735"/></linearGradient>
<linearGradient id="gs-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.1"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.8"/></linearGradient>`,
    body: `<path d="M${roadTop} 0 H${stripW - roadTop} L${stripW} ${stripH} H0 Z" fill="url(#gs-road)"/>
<path d="M${roadTop} 0 L0 ${stripH}" stroke="#93a1b2" stroke-width="3" stroke-opacity="0.3"/>
<path d="M${stripW - roadTop} 0 L${stripW} ${stripH}" stroke="#93a1b2" stroke-width="3" stroke-opacity="0.3"/>
${rungs}`,
    label: 'Scrolling ground strip',
  }),
  960
);

for (const [name, h, near, seed] of [
  ['parallax_far', 150, false, 13],
  ['parallax_near', 190, true, 41],
]) {
  await writePng(
    `${R}/${name}.png`,
    svgDoc(960, h, { defs: '', body: parallaxStrip(960, h, { near, seed }), label: `${name} strip` }),
    960
  );
}

/* ---- hero playfield ---- */
const pf = runnerPlayfield(480, 640);
const slotW = 620;
const slotH = 640;
await writeWebp(
  `${R}/mockup_playfield.webp`,
  svgDoc(slotW, slotH, { defs: pf.defs, body: letterbox(pf, slotW, slotH), label: 'Endless Runner playfield' }),
  slotW * 2,
  94
);

/* ---- review mockup ---- */
const W = 1600;
const H = 1000;
const win = { x: 92, y: 158, w: slotW, h: slotH + 34, title: 'minigame — endless runner' };
const iconMark = `<g transform="translate(${win.x + 12} ${win.y + 5})">
  <path d="${rr(0, 0, 24, 24, 7)}" fill="#1d2430" stroke="${BRAND.minigame.accent}" stroke-width="1.6"/>
  <path d="M5 18 L12 6 L19 18" fill="none" stroke="${BRAND.minigame.light}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
</g>`;

const railX = win.x + win.w + 40;
const railW = W - railX - 92;
let rail = railPanel(railX, 158, railW, 216, 'CAST — SIBLING RUNNING POSE');
rail += place(soldierRunning('c'), railX + 26, 182, 0.7);
rail += caption(railX + 88, 344, 'player — shared cast, running pose');
rail += place(collectible(), railX + 286, 212, 0.78);
rail += caption(railX + 330, 344, 'collectible');
rail += place(collectible({ rare: true }), railX + 452, 206, 0.9);
rail += caption(railX + 502, 344, 'rare — juicier, attention request');

rail += railPanel(railX, 386, railW, 206, 'OBSTACLES — THREE READABLE TYPES');
rail += place(obstacleStaticA(), railX + 22, 416, 0.86);
rail += caption(railX + 88, 566, 'static A');
rail += place(obstacleStaticB(), railX + 186, 416, 0.86);
rail += caption(railX + 254, 566, 'static B');
rail += place(obstacleMoving(), railX + 340, 416, 0.86);
rail += caption(railX + 424, 566, 'moving — chevrons telegraph the sweep');

rail += railPanel(railX, 604, railW, 230, 'PARALLAX + GROUND STRIPS');
const sx = (railW - 40) / 960;
rail += `<g transform="translate(${railX + 20} 638) scale(${sx.toFixed(4)} 0.31)">${parallaxStrip(960, 150, { seed: 13 })}</g>`;
rail += caption(railX + railW / 2, 698, 'parallax_far');
rail += `<g transform="translate(${railX + 20} 706) scale(${sx.toFixed(4)} 0.29)">${parallaxStrip(960, 190, { near: true, seed: 41 })}</g>`;
rail += caption(railX + railW / 2, 772, 'parallax_near');
rail += `<g transform="translate(${railX + 20} 778) scale(${((railW - 40) / 480).toFixed(4)} 0.088)"><path d="M${roadTop} 0 H${stripW - roadTop} L${stripW} ${stripH} H0 Z" fill="#1a2330"/><path d="M${roadTop} 0 L0 ${stripH}" stroke="#93a1b2" stroke-width="18" stroke-opacity="0.3"/><path d="M${stripW - roadTop} 0 L${stripW} ${stripH}" stroke="#93a1b2" stroke-width="18" stroke-opacity="0.3"/></g>`;
rail += caption(railX + railW / 2, 824, 'ground_strip — scrolls toward the player');

const svg = reviewSheet({
  w: W,
  h: H,
  title: 'ENDLESS RUNNER',
  subtitle: 'forward scroll, lane-only control, survival over combat — 3:4 playfield letterboxed in its slot',
  brand: BRAND.minigame,
  window: { ...win, icon: iconMark },
  interior: (inner) => place(letterbox(pf, slotW, slotH), inner.x, inner.y, inner.w / slotW),
  rail,
  defs: pf.defs + castAll + propAll + obClip,
  legend: [
    'Same cast as Lane Defender in a running pose — one cutout language',
    'Obstacle types stay distinguishable by silhouette, not just by colour',
    'The moving type telegraphs its sweep before it reaches the player',
    'Rare collectibles are the only pickups allowed to steal attention',
  ],
  footer: 'no jump — lane selection is the whole input surface (04); neutral slate frame #93a1b2',
  seed: 57,
});

writeSvg('content/mockups/minigame_runner.svg', svg);
await writeWebp('content/mockups/minigame_runner.webp', svg, W, 92);

console.log('phase E3 endless runner: done');
