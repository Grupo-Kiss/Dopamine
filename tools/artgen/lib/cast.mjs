import { CARD, n, rr } from './brand.mjs';
import { cardDefs, contactShadow, cutoutDefs, piece, print } from './card.mjs';

/**
 * Shared cast for Lane Defender / Endless Runner.
 *
 * Abstract readable silhouettes — helmeted wedge, geometric mob, armored boss —
 * not cute cartoon faces. Still cardboard-cutout construction (cream edge +
 * keyline) so the Arcade world stays distinct from the OS chrome.
 */
export const CAST = {
  soldier: { art: '#5f8f3f', artLight: '#8fbf5a', artDark: '#355824' },
  gear: { art: '#2f3642', artLight: '#4d5868', artDark: '#1a1f27' },
  steel: { art: '#7e92a8', artLight: '#b8c8d8', artDark: '#4a5868' },
  mob: { art: '#2eb8b0', artLight: '#6ee0d8', artDark: '#176e6a' },
  boss: { art: '#e85a3a', artLight: '#ff8f70', artDark: '#8a2410' },
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

/** Visored helmet — no face. Bucket silhouette + one optic slit. */
function helmet(id, cx, top) {
  const dome = `M${cx - 28} ${top + 50} L${cx - 24} ${top + 6} L${cx - 8} ${top} L${cx + 8} ${top} L${cx + 24} ${top + 6} L${cx + 28} ${top + 50} Z`;
  const slit = rr(cx - 18, top + 24, 36, 10, 2);
  return (
    piece(dome, P(id, 'soldier'), { key: 8, cream: 4.4, edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') }) +
    piece(rr(cx - 30, top + 46, 60, 8, 2), `url(#cd-${id}-gear-print)`, { key: 6, cream: 3.2, edgeId: EDGE(id) }) +
    print(slit, '#0a0e14') +
    print(rr(cx - 16, top + 26.5, 32, 3.5, 1), '#7af0a8', 0.95)
  );
}

/** Short rectangular blaster — silhouette, not a detailed toy. */
function blaster(id, x, y, rot) {
  return (
    `<g transform="translate(${x} ${y}) rotate(${rot})">` +
    piece(rr(0, -8, 48, 14, 5), P(id, 'steel'), { key: 6, cream: 3.4, edgeId: EDGE(id), sheen: SHEEN(id, 'steel') }) +
    piece(rr(40, -4, 18, 6, 2.5), 'url(#cd-fx-hot)', { key: 5, cream: 2.8, edgeId: EDGE(id) }) +
    piece(rr(6, 4, 12, 16, 4), `url(#cd-${id}-gear-print)`, { key: 5.4, cream: 3, edgeId: EDGE(id) }) +
    '</g>'
  );
}

function torso(id, cx, top, bottom) {
  const body = `M${cx - 26} ${top} L${cx + 26} ${top} L${cx + 30} ${bottom} L${cx - 30} ${bottom} Z`;
  return (
    piece(body, P(id, 'soldier'), { key: 8, cream: 4.4, edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') }) +
    print(`M${cx - 20} ${top + 10} L${cx - 8} ${bottom - 6} L${cx - 16} ${bottom - 6} L${cx - 26} ${top + 16} Z`, '#2f5d2e', 0.4) +
    // rank mark: abstract chevron, not a badge face
    print(`M${cx - 10} ${top + 34} L${cx} ${top + 26} L${cx + 10} ${top + 34} L${cx + 10} ${top + 40} L${cx} ${top + 32} L${cx - 10} ${top + 40} Z`, '#f5d14a') +
    `<path d="M${cx - 10} ${top + 34} L${cx} ${top + 26} L${cx + 10} ${top + 34} L${cx + 10} ${top + 40} L${cx} ${top + 32} L${cx - 10} ${top + 40} Z" fill="none" stroke="${CARD.keyline}" stroke-width="2"/>`
  );
}

/** Lane Defender player — standing cutout at the bottom of the three lanes. */
export function soldierStanding(id) {
  const cx = 80;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 190, 46, 11, id)}
${piece(rr(cx - 26, 148, 20, 38, 8), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx + 6, 148, 20, 38, 8), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx - 42, 88, 16, 48, 8), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}
${torso(id, cx, 72, 152)}
${piece(rr(cx + 26, 88, 16, 48, 8), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}
${helmet(id, cx, 8)}
${blaster(id, 98, 96, 0)}
</g>`;
}

/** Endless Runner player — forward lean, split stride, same abstract helmet. */
export function soldierRunning(id) {
  const cx = 84;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx + 2, 190, 54, 10, id)}
<g transform="rotate(-38 ${cx + 4} 148)">${piece(rr(cx - 8, 142, 20, 46, 9), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}</g>
<g transform="rotate(-36 ${cx + 26} 96)">${piece(rr(cx + 18, 92, 16, 44, 8), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}</g>
<g transform="rotate(-10 ${cx} 148)">${torso(id, cx, 74, 150)}</g>
<g transform="rotate(42 ${cx - 4} 148)">${piece(rr(cx - 16, 142, 20, 46, 9), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}</g>
<g transform="rotate(58 ${cx - 26} 96)">${piece(rr(cx - 34, 92, 16, 44, 8), P(id, 'soldier'), { edgeId: EDGE(id), sheen: SHEEN(id, 'soldier') })}</g>
<g transform="rotate(-10 ${cx} 56)">
${print(`M${cx + 16} 22 L${cx + 22} 40 C${cx + 44} 34 ${cx + 62} 42 ${cx + 74} 56 L${cx + 56} 68 C${cx + 46} 56 ${cx + 32} 52 ${cx + 12} 56 Z`, 'url(#cd-fx-hot)')}
${helmet(id, cx, 6)}
</g>
</g>`;
}

/**
 * One-hit enemy: geometric diamond body + single optic slit.
 * Readable at high density without reading as a cartoon mascot.
 */
export function enemyNormal(id) {
  const cx = 78;
  const body = `M${cx} 18 L${cx + 48} 70 L${cx + 34} 128 L${cx - 34} 128 L${cx - 48} 70 Z`;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 136, 40, 9, id)}
${piece(body, P(id, 'mob'), { edgeId: EDGE(id), sheen: SHEEN(id, 'mob') })}
${print(`M${cx} 34 L${cx + 28} 70 L${cx + 18} 108 L${cx - 18} 108 L${cx - 28} 70 Z`, '#d6fffa', 0.16)}
${print(rr(cx - 18, 58, 36, 10, 4), '#0a0e14')}
${print(rr(cx - 14, 60.5, 28, 3.5, 1.5), '#7af0a8', 0.95)}
${piece(`M${cx - 10} 128 L${cx - 22} 148 L${cx - 2} 140 Z`, P(id, 'mob'), { key: 6, cream: 3.4, edgeId: EDGE(id) })}
${piece(`M${cx + 10} 128 L${cx + 22} 148 L${cx + 2} 140 Z`, P(id, 'mob'), { key: 6, cream: 3.4, edgeId: EDGE(id) })}
</g>`;
}

/**
 * Boss: multi-lane armored slab. Integrity sits on a plate so the number
 * never floats over busy art (`04`). Eyes are LED slits, not cartoon faces.
 */
export function enemyBoss(id, { integrity = 24 } = {}) {
  const cx = 180;
  const plate = rr(cx - 58, 108, 116, 58, 12);
  const rivet = (x, y) =>
    `<circle cx="${n(x)}" cy="${n(y)}" r="4.2" fill="#6d1f0d"/><circle cx="${n(x)}" cy="${n(y - 1)}" r="2.6" fill="#ffb59f" opacity="0.55"/>`;
  const hull = `M${cx - 110} 70 C${cx - 110} 40 ${cx - 60} 24 ${cx} 24 C${cx + 60} 24 ${cx + 110} 40 ${cx + 110} 70 L${cx + 118} 170 C${cx + 118} 192 ${cx + 60} 206 ${cx} 206 C${cx - 60} 206 ${cx - 118} 192 ${cx - 118} 170 Z`;
  return `<g filter="url(#cd-${id}-cast)">
${contactShadow(cx, 220, 140, 15, id)}
${piece(rr(cx - 150, 90, 48, 90, 18), P(id, 'boss'), { key: 10, cream: 6, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(rr(cx + 102, 90, 48, 90, 18), P(id, 'boss'), { key: 10, cream: 6, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(hull, P(id, 'boss'), { key: 12, cream: 7, edgeId: EDGE(id), sheen: SHEEN(id, 'boss') })}
${piece(`M${cx - 40} 8 L${cx - 18} 48 L${cx - 58} 48 Z`, P(id, 'boss'), { key: 8, cream: 4.5, edgeId: EDGE(id) })}
${piece(`M${cx} 0 L${cx + 18} 48 L${cx - 18} 48 Z`, P(id, 'boss'), { key: 8, cream: 4.5, edgeId: EDGE(id) })}
${piece(`M${cx + 40} 8 L${cx + 58} 48 L${cx + 18} 48 Z`, P(id, 'boss'), { key: 8, cream: 4.5, edgeId: EDGE(id) })}
${print(rr(cx - 70, 62, 140, 12, 4), '#0a0e14')}
${print(rr(cx - 64, 65, 38, 5, 2), '#ffb59f', 0.9)}
${print(rr(cx - 16, 65, 32, 5, 2), '#ffb59f', 0.9)}
${print(rr(cx + 26, 65, 38, 5, 2), '#ffb59f', 0.9)}
${piece(rr(cx - 70, 188, 48, 34, 10), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
${piece(rr(cx + 22, 188, 48, 34, 10), `url(#cd-${id}-gear-print)`, { edgeId: EDGE(id) })}
<path d="${plate}" fill="#3a1208"/>
<path d="${plate}" fill="url(#cd-fx-sheen)" opacity="0.45"/>
<path d="${plate}" fill="none" stroke="${CARD.keyline}" stroke-width="3"/>
${rivet(cx - 46, 118)}${rivet(cx + 46, 118)}${rivet(cx - 46, 152)}${rivet(cx + 46, 152)}
<text x="${cx}" y="128" font-family="Teko, Arial Narrow, sans-serif" font-size="13" font-weight="600" fill="#ffb59f" text-anchor="middle" letter-spacing="3" opacity="0.9">INTEGRITY</text>
<text x="${cx}" y="158" font-family="Teko, Arial Narrow, sans-serif" font-size="36" font-weight="600" fill="#ffd9ce" text-anchor="middle" letter-spacing="1">${integrity}</text>
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
