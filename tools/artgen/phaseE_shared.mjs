import { svgDoc } from './lib/card.mjs';
import { castDefs, enemyBoss, enemyNormal, fxSharedDefs, soldierStanding } from './lib/cast.mjs';
import { counterPlate, explosion, fxDefs, hitSpark, muzzleFlash, propSharedDefs } from './lib/props.mjs';
import { backdrop, groundTile } from './lib/tex.mjs';
import { writePng, writeSvg } from './lib/render.mjs';
import { NUM, rr } from './lib/brand.mjs';

const R = 'content/minigames/_shared';
const castAll = fxSharedDefs() + castDefs('c');

const sprites = [
  ['player_soldier_cutout', 160, 200, soldierStanding('c'), 'Player soldier cardboard cutout'],
  ['enemy_normal_cutout', 160, 160, enemyNormal('c'), 'Normal enemy cardboard cutout'],
  ['enemy_boss_cutout', 364, 240, enemyBoss('c', { integrity: 24 }), 'Multi-lane boss cardboard cutout'],
];

for (const [name, w, h, body, label] of sprites) {
  const svg = svgDoc(w, h, { defs: castAll, body, label });
  if (name === 'player_soldier_cutout') writeSvg(`${R}/${name}.svg`, svg);
  await writePng(`${R}/${name}.png`, svg, w * 2);
}

const gt = groundTile(256);
await writePng(
  `${R}/textures/ground_tile.png`,
  svgDoc(256, 256, { defs: gt.defs, body: gt.body, label: 'Tileable lane ground' }),
  512
);

const bd = backdrop(512, 320);
await writePng(
  `${R}/textures/backdrop.png`,
  svgDoc(512, 320, { defs: bd.defs, body: bd.body, label: 'Lane depth backdrop' }),
  1024
);

const fxAll = propSharedDefs() + fxDefs();
writeSvg(`${R}/fx/muzzle_flash.svg`, svgDoc(140, 140, { defs: fxAll, body: muzzleFlash(), label: 'Muzzle flash' }));
writeSvg(`${R}/fx/explosion.svg`, svgDoc(200, 200, { defs: fxAll, body: explosion(), label: 'Explosion' }));
writeSvg(`${R}/fx/hit_spark.svg`, svgDoc(88, 88, { defs: fxAll, body: hitSpark(), label: 'Hit spark' }));

/**
 * Numeric indicator style sheets. `04` makes these a universal language, so the
 * plate geometry ships with the samples rather than as loose text styling.
 */
function numberSheet(positive) {
  const w = 470;
  const h = 206;
  const fill = positive ? NUM.posFill : NUM.negFill;
  const samples = positive ? ['+1', '+24', '+860', 'x4'] : ['-1', '-12', '-240', '0'];
  const title = positive ? 'POSITIVE — OPPORTUNITY' : 'NEGATIVE — DANGER';
  let body = `<rect width="${w}" height="${h}" rx="14" fill="#0c1016"/>
<rect x="0.6" y="0.6" width="${w - 1.2}" height="${h - 1.2}" rx="14" fill="none" stroke="${fill}" stroke-width="1.2" stroke-opacity="0.4"/>
<text x="24" y="34" font-family="Public Sans" font-size="12" font-weight="800" fill="${fill}" letter-spacing="2.4">${title}</text>`;
  body += counterPlate(68, 84, 76, 54, samples[0], { positive, size: 28 });
  body += counterPlate(186, 84, 122, 54, samples[1], { positive });
  body += counterPlate(354, 84, 162, 54, samples[2], { positive });
  body += counterPlate(68, 154, 76, 44, samples[3], { positive, size: 24 });
  const note = positive
    ? ['plate grows with the value width;', 'multipliers share the opportunity fill']
    : ['same plate, danger fill;', 'the counter walks up toward zero'];
  body += `<text x="124" y="150" font-family="Public Sans" font-size="12.5" font-weight="500" fill="#8b97a6">${note[0]}</text>`;
  body += `<text x="124" y="170" font-family="Public Sans" font-size="12.5" font-weight="500" fill="#8b97a6">${note[1]}</text>`;
  return svgDoc(w, h, { defs: propSharedDefs(), body, label: title });
}

writeSvg(`${R}/ui/number_positive.svg`, numberSheet(true));
writeSvg(`${R}/ui/number_negative.svg`, numberSheet(false));

console.log('phase E1 shared: done');
