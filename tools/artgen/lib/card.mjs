import { CARD, n } from './brand.mjs';

/**
 * Cardboard cutout construction. Every cast member is a stack of flat card
 * pieces: a keyline ring, the cream cut edge, then the printed art. Pieces are
 * drawn back-to-front so the cream edges read as real layered card.
 */
export function cardDefs(id, { art, artDark, artLight }) {
  return `
<linearGradient id="cd-${id}-print" x1="0.18" y1="0" x2="0.82" y2="1">
  <stop offset="0" stop-color="${artLight}"/>
  <stop offset="0.5" stop-color="${art}"/>
  <stop offset="1" stop-color="${artDark}"/>
</linearGradient>
<linearGradient id="cd-${id}-edge" x1="0" y1="0" x2="0.3" y2="1">
  <stop offset="0" stop-color="${CARD.edge}"/>
  <stop offset="1" stop-color="${CARD.edgeShade}"/>
</linearGradient>
<linearGradient id="cd-${id}-sheen" x1="0.1" y1="0" x2="0.6" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.34"/>
  <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.06"/>
  <stop offset="1" stop-color="#000000" stop-opacity="0.22"/>
</linearGradient>`;
}

export function cutoutDefs(id) {
  return `
<filter id="cd-${id}-cast" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="5" stdDeviation="5" flood-color="${CARD.shadow}" flood-opacity="0.55"/>
</filter>
<radialGradient id="cd-${id}-contact" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#000" stop-opacity="0.62"/>
  <stop offset="0.6" stop-color="#000" stop-opacity="0.22"/>
  <stop offset="1" stop-color="#000" stop-opacity="0"/>
</radialGradient>`;
}

/**
 * One card piece: keyline ring, cream cut edge, then the printed fill.
 * `key`/`cream` are total stroke widths, so the visible rings are half each.
 */
export function piece(d, fill, { key = 10, cream = 6.4, edgeId, sheen } = {}) {
  let s = `<path d="${d}" fill="none" stroke="${CARD.keyline}" stroke-width="${n(key)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `<path d="${d}" fill="none" stroke="${edgeId ? `url(#${edgeId})` : CARD.edge}" stroke-width="${n(cream)}" stroke-linejoin="round" stroke-linecap="round"/>`;
  s += `<path d="${d}" fill="${fill}"/>`;
  if (sheen) s += `<path d="${d}" fill="url(#${sheen})"/>`;
  return s;
}

/** Flat card with no cream edge — used for printed detail inside a piece. */
export function print(d, fill, opacity = 1) {
  return `<path d="${d}" fill="${fill}"${opacity === 1 ? '' : ` opacity="${opacity}"`}/>`;
}

export function contactShadow(cx, cy, rx, ry, id) {
  return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="url(#cd-${id}-contact)"/>`;
}

export function eye(cx, cy, r, { pupil = 0.44, look = 0, tilt = 0 } = {}) {
  return `<g>
  <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 1.08)}" fill="#fdfdff"/>
  <ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r * 1.08)}" fill="none" stroke="${CARD.keyline}" stroke-width="${n(r * 0.3)}"/>
  <circle cx="${n(cx + look * r)}" cy="${n(cy + tilt * r)}" r="${n(r * pupil)}" fill="#141a24"/>
  <circle cx="${n(cx + look * r - r * 0.18)}" cy="${n(cy + tilt * r - r * 0.26)}" r="${n(r * 0.16)}" fill="#fff" opacity="0.9"/>
</g>`;
}

export function svgDoc(w, h, { defs = '', body = '', label = '', bg = '' }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}">
<title>${label}</title>
<defs>${defs}
</defs>
${bg}
${body}
</svg>`;
}
