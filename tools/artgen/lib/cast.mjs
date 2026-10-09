import { CARD, n, rr } from './brand.mjs';
import { cardDefs, contactShadow, cutoutDefs, eye, piece, print } from './card.mjs';

export const CAST = {
  soldier: { art: '#6f9a4a', artLight: '#9ccc65', artDark: '#41632b' },
  skin: { art: '#f0c79a', artLight: '#fbe2c2', artDark: '#c89a6c' },
  gear: { art: '#3b4350', artLight: '#5d697b', artDark: '#242a34' },
  steel: { art: '#8fa3bb', artLight: '#cfdcea', artDark: '#596878' },
  mob: { art: '#36cfc0', artLight: '#86f0e6', artDark: '#1b7b73' },
  boss: { art: '#ff6b4a', artLight: '#ffa78d', artDark: '#9c2f17' },
};

export function castDefs(id) {
  return (
    cutoutDefs(id) +
    Object.entries(CAST)
      .map(([k, v]) => cardDefs(`${id}-${k}`, v))
      .join('')
  );
}

const P = (id, k) => `url(#cd-${id}-${k}-print)`;
const SHEEN = (id, k) => `cd-${id}-${k}-sheen`;
const EDGE = (id) => `cd-${id}-soldier-edge`;

/** Helmet sits above the brow line so the brim never crops the eyes. */
function helmet(id, cx, top) {
  const dome = `M${cx - 36} ${top + 32} C${cx - 36} ${top + 9} ${cx - 20} ${top} ${cx} ${top} C${cx + 20} ${top} ${cx + 36} ${top + 9} ${cx + 36} ${top + 32} L${cx + 36} ${top + 35} L${cx - 36} ${top + 35} Z`;
  const brim = rr(cx - 42, top + 30, 84, 13, 6.5);
  return (
    piece(dome, P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') }) +
    print(
      `M${cx - 32} ${top + 15} C${cx - 19} ${top + 6} ${cx + 19} ${top + 6} ${cx + 32} ${top + 15} L${cx + 32} ${top + 22} C${cx + 17} ${top + 13} ${cx - 17} ${top + 13} ${cx - 32} ${top + 22} Z`,
      '#2f5d2e',
      0.7
    ) +
    piece(brim, `url(#cd-${id}-gear-print)`, { key: 8, cream: 5, edgeId: EDGE(id) }) +
    print(rr(cx - 37, top + 32, 74, 3.6, 1.8), '#ffffff', 0.2)
  );
}

function face(id, cx, top, look = 0) {
  return (
    piece(rr(cx - 28, top, 56, 50, 17), P(id, 'skin'), { edgeId: EDGE(id), sheen: SHEEN(id, 'skin') }) +
    eye(cx - 12, top + 30, 8.5, { look, tilt: 0.08 }) +
    eye(cx + 12, top + 30, 8.5, { look, tilt: 0.08 }) +
    `<path d="M${cx - 9} ${top + 42} q9 7.5 18 0" fill="none" stroke="${CARD.keyline}" stroke-width="3.4" stroke-linecap="round"/>`
  );
}

/** Chunky toony blaster. Auto-firing in `04`, so it reads as equipment. */
function blaster(id, x, y, rot) {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    piece(rr(-5, 32, 15, 26, 7), `url(#cd-${id}-gear-print)`, { key: 6.4, cream: 3.8, edgeId: EDGE(id) }) +
    piece(rr(6, -50, 13, 62, 6), P(id, 'steel'), { key: 6.4, cream: 3.8, edgeId: EDGE(id), sheen: SHEEN(id, 'steel') }) +
    print(rr(8.5, -44, 4.5, 50, 2.2), '#ffffff', 0.3) +
    piece(rr(-4, 4, 29, 34, 9), P(id, 'steel'), { key: 7, cream: 4.2, edgeId: EDGE(id), sheen: SHEEN(id, 'steel') }) +
    print(rr(1, 10, 7, 22, 3.5), '#ffffff', 0.22) +
    print(rr(14, 12, 8, 18, 3.5), '#000000', 0.16) +
    piece(rr(7, -4, 11, 9, 3), `url(#cd-${id}-gear-print)`, { key: 5.4, cream: 3.2, edgeId: EDGE(id) }) +
    piece(rr(1, -60, 23, 13, 6), 'url(#cd-fx-hot)', { key: 6.4, cream: 3.8, edgeId: EDGE(id) }) +
    print(rr(5.5, -56, 14, 5, 2.5), '#fff3d6', 0.65) +
    '</g>'
  );
}

function torsoRig(id, cx, top, bottom) {
  const h = bottom - top;
  const torso = `M${cx - 30} ${top + 16} C${cx - 30} ${top + 6} ${cx - 18} ${top} ${cx} ${top} C${cx + 18} ${top} ${cx + 30} ${top + 6} ${cx + 30} ${top + 16} L${cx + 34} ${bottom - 14} C${cx + 34} ${bottom - 4} ${cx + 20} ${bottom} ${cx} ${bottom} C${cx - 20} ${bottom} ${cx - 34} ${bottom - 4} ${cx - 34} ${bottom - 14} Z`;
  const badge = rr(cx - 15, top + h * 0.42, 30, 24, 7);
  return (
    piece(torso, P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') }) +
    print(`M${cx - 26} ${top + 12} L${cx - 6} ${bottom - 2} L${cx - 18} ${bottom - 2} L${cx - 34} ${top + 28} Z`, '#2f5d2e', 0.5) +
    print(`M${cx + 26} ${top + 12} L${cx + 6} ${bottom - 2} L${cx + 18} ${bottom - 2} L${cx + 34} ${top + 28} Z`, '#2f5d2e', 0.4) +
    print(badge, '#f5d14a') +
    print(badge, 'url(#cd-fx-sheen)', 0.45) +
    `<path d="${badge}" fill="none" stroke="${CARD.keyline}" stroke-width="2.6"/>` +
    `<path d="M${cx - 7} ${top + h * 0.42 + 12} l6 6 l9 -12" fill="none" stroke="#3b2a05" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/>`
  );
}

/** Lane Defender player — standing cutout at the bottom of the three lanes. */
export function soldierStanding(id, { look = 0 } = {}) {
  const cx = 80;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 190, 50, 12, id)}
${piece(rr(cx - 28, 146, 24, 40, 10), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx + 4, 146, 24, 40, 10), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
<g transform="rotate(-9 46 96)">${piece(rr(36, 92, 21, 52, 10.5), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}</g>
${torsoRig(id, cx, 76, 154)}
<g transform="rotate(16 114 94)">${piece(rr(104, 90, 21, 50, 10.5), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}</g>
${face(id, cx, 28, look)}
${helmet(id, cx, 2)}
${blaster(id, 109, 66, 14)}
</g>`;
}

/** Endless Runner player — sibling pose: forward lean, split stride, scarf. */
export function soldierRunning(id) {
  const cx = 84;
  const limb = (d) => piece(d, P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') });
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx + 2, 190, 58, 11, id)}
<g transform="rotate(-40 ${cx + 6} 146)">${piece(rr(cx - 6, 140, 24, 50, 11), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}</g>
<g transform="rotate(-42 ${cx + 28} 94)">${limb(rr(cx + 20, 90, 20, 48, 10))}</g>
<g transform="rotate(-11 ${cx} 150)">${torsoRig(id, cx, 78, 152)}</g>
<g transform="rotate(46 ${cx - 6} 146)">${piece(rr(cx - 18, 140, 24, 50, 11), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}</g>
<g transform="rotate(68 ${cx - 28} 94)">${limb(rr(cx - 38, 90, 20, 48, 10))}</g>
<g transform="rotate(-11 ${cx} 56)">
${piece(`M${cx + 18} 18 L${cx + 26} 42 C${cx + 48} 36 ${cx + 68} 44 ${cx + 82} 60 L${cx + 62} 74 C${cx + 50} 60 ${cx + 34} 56 ${cx + 14} 60 Z`, 'url(#cd-fx-hot)', { key: 8, cream: 5, edgeId: EDGE(id) })}
${face(id, cx, 28, -0.3)}
${helmet(id, cx, 2)}
</g>
</g>`;
}

/** One-hit enemy: cute toony blob, cheap to feedback at high density (`04`). */
export function enemyNormal(id) {
  const cx = 78;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 142, 46, 10, id)}
${piece(`M${cx - 34} 42 L${cx - 30} 6 L${cx - 6} 34 Z`, P(id, 'mob'), { key: 8, cream: 5, edgeId: EDGE(id) })}
${piece(`M${cx + 34} 42 L${cx + 30} 6 L${cx + 6} 34 Z`, P(id, 'mob'), { key: 8, cream: 5, edgeId: EDGE(id) })}
${piece(rr(cx - 38, 116, 25, 22, 10), P(id, 'mob'), { key: 8, cream: 5, edgeId: EDGE(id) })}
${piece(rr(cx + 13, 116, 25, 22, 10), P(id, 'mob'), { key: 8, cream: 5, edgeId: EDGE(id) })}
${piece(`M${cx - 56} 86 C${cx - 56} 46 ${cx - 32} 26 ${cx} 26 C${cx + 32} 26 ${cx + 56} 46 ${cx + 56} 86 C${cx + 56} 114 ${cx + 34} 128 ${cx} 128 C${cx - 34} 128 ${cx - 56} 114 ${cx - 56} 86 Z`, P(id, 'mob'), { edgeId: EDGE(id), sheen: SHEEN(id, 'mob') })}
${print(`M${cx - 31} 106 C${cx - 31} 94 ${cx - 16} 88 ${cx} 88 C${cx + 16} 88 ${cx + 31} 94 ${cx + 31} 106 C${cx + 31} 118 ${cx + 16} 124 ${cx} 124 C${cx - 16} 124 ${cx - 31} 118 ${cx - 31} 106 Z`, '#d6fffa', 0.24)}
${eye(cx - 18, 70, 16.5, { look: -0.12, tilt: 0.1 })}
${eye(cx + 18, 70, 16.5, { look: 0.12, tilt: 0.1 })}
<path d="M${cx - 19} 100 q19 17 38 0" fill="none" stroke="${CARD.keyline}" stroke-width="4.4" stroke-linecap="round"/>
${print(`M${cx - 5} 101 L${cx + 7} 101 L${cx + 1} 112 Z`, '#fdfdff')}
</g>`;
}

/**
 * Boss: spans multiple lanes, and carries its integrity counter on a riveted
 * chest plate so the number never floats over busy art (`04` numeric clarity).
 */
export function enemyBoss(id, { integrity = 24 } = {}) {
  const cx = 180;
  const plate = rr(cx - 62, 100, 124, 64, 15);
  const rivet = (x, y) =>
    `<circle cx="${n(x)}" cy="${n(y)}" r="4.8" fill="#6d1f0d"/><circle cx="${n(x)}" cy="${n(y - 1.2)}" r="3.3" fill="#ffb59f" opacity="0.6"/>`;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 224, 152, 17, id)}
${piece(rr(cx - 76, 190, 52, 40, 13), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx + 24, 190, 52, 40, 13), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx - 148, 94, 56, 96, 24), P(id, 'boss'), { key: 11, cream: 7, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(rr(cx + 92, 94, 56, 96, 24), P(id, 'boss'), { key: 11, cream: 7, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(rr(cx - 154, 166, 62, 58, 26), P(id, 'boss'), { key: 11, cream: 7, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(rr(cx + 92, 166, 62, 58, 26), P(id, 'boss'), { key: 11, cream: 7, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(`M${cx - 98} 106 C${cx - 98} 68 ${cx - 55} 48 ${cx} 48 C${cx + 55} 48 ${cx + 98} 68 ${cx + 98} 106 L${cx + 98} 162 C${cx + 98} 188 ${cx + 55} 202 ${cx} 202 C${cx - 55} 202 ${cx - 98} 188 ${cx - 98} 162 Z`, P(id, 'boss'), { key: 13, cream: 8, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(`M${cx - 46} 8 L${cx - 26} 46 L${cx - 64} 50 Z`, P(id, 'boss'), { key: 9, cream: 5.5, edgeId: EDGE(id) })}
${piece(`M${cx} 0 L${cx + 21} 46 L${cx - 21} 46 Z`, P(id, 'boss'), { key: 9, cream: 5.5, edgeId: EDGE(id) })}
${piece(`M${cx + 46} 8 L${cx + 64} 50 L${cx + 26} 46 Z`, P(id, 'boss'), { key: 9, cream: 5.5, edgeId: EDGE(id) })}
${eye(cx - 33, 80, 12, { look: 0.18 })}
${eye(cx - 11, 74, 12, { look: 0.18 })}
${eye(cx + 11, 74, 12, { look: -0.18 })}
${eye(cx + 33, 80, 12, { look: -0.18 })}
<path d="M${cx - 42} 184 q42 -22 84 0" fill="none" stroke="${CARD.keyline}" stroke-width="5" stroke-linecap="round"/>
<path d="${plate}" fill="#3a1208"/>
<path d="${plate}" fill="url(#cd-fx-sheen)" opacity="0.5"/>
<path d="${plate}" fill="none" stroke="${CARD.keyline}" stroke-width="3.4"/>
${rivet(cx - 50, 112)}${rivet(cx + 50, 112)}${rivet(cx - 50, 152)}${rivet(cx + 50, 152)}
<text x="${cx}" y="${121}" font-family="Public Sans" font-size="11" font-weight="800" fill="#ffb59f" text-anchor="middle" letter-spacing="2.6" opacity="0.85">INTEGRITY</text>
<text x="${cx}" y="${155}" font-family="Public Sans" font-size="34" font-weight="800" fill="#ffd9ce" text-anchor="middle" letter-spacing="-0.5">${integrity}</text>
</g>`;
}

/** Shared gradients the cast leans on for hot accents and bevel sheen. */
export function fxSharedDefs() {
  return `
<linearGradient id="cd-fx-hot" x1="0" y1="0" x2="0.4" y2="1">
  <stop offset="0" stop-color="#ffc24a"/>
  <stop offset="0.5" stop-color="#ff8c00"/>
  <stop offset="1" stop-color="#d14a00"/>
</linearGradient>
<linearGradient id="cd-fx-sheen" x1="0.1" y1="0" x2="0.6" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.3"/>
  <stop offset="0.45" stop-color="#ffffff" stop-opacity="0.05"/>
  <stop offset="1" stop-color="#000000" stop-opacity="0.26"/>
</linearGradient>`;
}
