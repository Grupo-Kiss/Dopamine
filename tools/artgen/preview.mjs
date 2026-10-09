/**
 * Scratch renderer for eyeballing art while iterating. Writes PNGs to
 * /tmp/artgen-preview/ and never touches content/.
 *
 *   node tools/artgen/preview.mjs cast props playfields
 *   node tools/artgen/preview.mjs            # all of them
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { rasterize } from './lib/render.mjs';
import { svgDoc } from './lib/card.mjs';
import { castDefs, enemyBoss, enemyNormal, fxSharedDefs, soldierRunning, soldierStanding } from './lib/cast.mjs';
import * as PR from './lib/props.mjs';
import { blocksBoard, lanePlayfield, place, runnerPlayfield } from './lib/playfields.mjs';

const OUT = '/tmp/artgen-preview';
mkdirSync(OUT, { recursive: true });

const want = process.argv.slice(2);
const on = (name) => want.length === 0 || want.includes(name);

function emit(name, w, h, defs, body, scale = 1) {
  const doc = svgDoc(w, h, {
    defs,
    bg: `<rect width="${w}" height="${h}" fill="#121820"/>`,
    body,
    label: name,
  });
  writeFileSync(`${OUT}/${name}.png`, rasterize(doc, w * scale));
  console.log(`${OUT}/${name}.png`);
}

if (on('cast')) {
  emit(
    'cast',
    760,
    230,
    fxSharedDefs() + castDefs('p'),
    `${place(soldierStanding('p'), 0, 16, 1)}
${place(soldierRunning('p'), 170, 16, 1)}
${place(enemyNormal('p'), 360, 60, 1)}
${place(enemyBoss('p'), 470, 0, 0.78)}`,
    2
  );
}

if (on('props')) {
  const defs =
    PR.propSharedDefs() +
    PR.fxDefs() +
    PR.barrierClip() +
    PR.bevelDefs('mine', { base: '#4a5260', light: '#8e9aab', dark: '#222832' }) +
    PR.bevelDefs('mine-spike', { base: '#5a6472', light: '#9aa6b6', dark: '#262d37' }) +
    PR.bevelDefs('barrier', { base: '#c9a227', light: '#f3dc8a', dark: '#6f550c' }) +
    Object.entries(PR.PICKUPS)
      .map(([k, v]) => PR.bevelDefs(`pk-${k}`, v))
      .join('');
  let body = place(PR.hazardMine(), 10, 10, 1) + place(PR.hazardBarrier(), 170, 20, 1);
  body += place(PR.explosion(), 440, 10, 0.8) + place(PR.muzzleFlash(), 640, 20, 1);
  let x = 10;
  for (const k of Object.keys(PR.PICKUPS)) {
    body += place(PR.pickup(k), x, 170, 1);
    x += 120;
  }
  body += place(PR.hitSpark(), 740, 180, 1);
  body += place(PR.counterPlate(60, 30, 120, 56, '+240'), 600, 290, 1);
  body += place(PR.counterPlate(60, 30, 120, 56, '-12'), 740, 290, 1);
  emit('props', 880, 360, defs, body, 1.5);
}

if (on('playfields')) {
  const lane = lanePlayfield(480, 640);
  const run = runnerPlayfield(480, 640);
  const bc = blocksBoard(400, 640);
  emit(
    'playfields',
    1430,
    660,
    lane.defs + run.defs + bc.defs,
    `${place(lane.body, 10, 10, 1)}${place(run.body, 510, 10, 1)}${place(bc.body, 1010, 10, 1)}`
  );
}
