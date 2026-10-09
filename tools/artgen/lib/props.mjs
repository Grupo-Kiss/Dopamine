import { NUM, n, rr } from './brand.mjs';

/**
 * Bevelled toony primitives (`09`: "bevelled edges, no sharp razor corners").
 * Every prop is one shape stack: keyline, graded face, specular sheen, rim.
 */
export function bevelDefs(id, { base, light, dark, keyline = '#10151d' }) {
  return `
<linearGradient id="bv-${id}-face" x1="0.15" y1="0" x2="0.7" y2="1">
  <stop offset="0" stop-color="${light}"/>
  <stop offset="0.46" stop-color="${base}"/>
  <stop offset="1" stop-color="${dark}"/>
</linearGradient>
<radialGradient id="bv-${id}-sheen" cx="0.3" cy="0.16" r="0.82">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.38"/>
  <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.05"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</radialGradient>
<linearGradient id="bv-${id}-rim" x1="0.2" y1="0" x2="0.6" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.62"/>
  <stop offset="0.34" stop-color="#ffffff" stop-opacity="0.12"/>
  <stop offset="0.66" stop-color="${keyline}" stop-opacity="0.18"/>
  <stop offset="1" stop-color="${keyline}" stop-opacity="0.72"/>
</linearGradient>
<radialGradient id="bv-${id}-aura" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="${light}" stop-opacity="0.55"/>
  <stop offset="0.55" stop-color="${base}" stop-opacity="0.2"/>
  <stop offset="1" stop-color="${base}" stop-opacity="0"/>
</radialGradient>`;
}

export function bev(d, id, { key = 3.4, outline = '#10151d' } = {}) {
  return `<path d="${d}" fill="none" stroke="${outline}" stroke-width="${n(key + 3)}" stroke-linejoin="round" stroke-linecap="round"/>
<path d="${d}" fill="url(#bv-${id}-face)"/>
<path d="${d}" fill="url(#bv-${id}-sheen)"/>
<path d="${d}" fill="none" stroke="url(#bv-${id}-rim)" stroke-width="${n(key)}" stroke-linejoin="round" stroke-linecap="round"/>`;
}

export function aura(id, cx, cy, r, opacity = 1) {
  return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(r)}" ry="${n(r)}" fill="url(#bv-${id}-aura)" opacity="${opacity}"/>`;
}

export function groundShadow(cx, cy, rx, ry) {
  return `<ellipse cx="${n(cx)}" cy="${n(cy)}" rx="${n(rx)}" ry="${n(ry)}" fill="url(#pr-contact)"/>`;
}

export function propSharedDefs() {
  return `
<radialGradient id="pr-contact" cx="0.5" cy="0.5" r="0.5">
  <stop offset="0" stop-color="#000" stop-opacity="0.6"/>
  <stop offset="0.6" stop-color="#000" stop-opacity="0.2"/>
  <stop offset="1" stop-color="#000" stop-opacity="0"/>
</radialGradient>
<filter id="pr-soft" x="-50%" y="-50%" width="200%" height="200%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#04060a" flood-opacity="0.6"/>
</filter>
<filter id="pr-hotglow" x="-70%" y="-70%" width="240%" height="240%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="#ff8c00" flood-opacity="0.9"/>
</filter>`;
}

/**
 * Counter plate used for every numeric indicator (`04`: positive values read as
 * opportunity, negative as danger, and both stay readable over busy art).
 */
export function counterPlate(cx, cy, w, h, value, { positive, size } = {}) {
  const pos = positive ?? !String(value).startsWith('-');
  const fill = pos ? NUM.posFill : NUM.negFill;
  const ink = pos ? NUM.posInk : NUM.negInk;
  const plate = rr(cx - w / 2, cy - h / 2, w, h, Math.min(h / 2.6, 12));
  const fs = size || h * 0.62;
  return `<g>
  <path d="${plate}" fill="${NUM.plate}"/>
  <path d="${plate}" fill="${fill}" opacity="0.14"/>
  <path d="${plate}" fill="none" stroke="${fill}" stroke-width="${n(h * 0.09)}"/>
  <path d="${rr(cx - w / 2 + h * 0.12, cy - h / 2 + h * 0.1, w - h * 0.24, h * 0.3, h * 0.12)}" fill="#ffffff" opacity="0.07"/>
  <text x="${n(cx)}" y="${n(cy + fs * 0.35)}" font-family="Public Sans" font-size="${n(fs)}" font-weight="800" fill="${fill}" text-anchor="middle" letter-spacing="-0.5">${value}</text>
  <text x="${n(cx)}" y="${n(cy + fs * 0.35)}" font-family="Public Sans" font-size="${n(fs)}" font-weight="800" fill="${ink}" text-anchor="middle" letter-spacing="-0.5" opacity="0.001">${value}</text>
</g>`;
}

/** Mine — bevelled bomb that clears nearby enemies when it is shot (`04`). */
export function hazardMine(id = 'mine') {
  const cx = 70;
  const cy = 74;
  const spikes = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
    const x = cx + Math.cos(a) * 36;
    const y = cy + Math.sin(a) * 36;
    spikes.push(
      `<g transform="rotate(${n((a * 180) / Math.PI + 90)} ${n(x)} ${n(y)})">${bev(rr(x - 7, y - 20, 14, 30, 6), 'mine-spike', { key: 2.6 })}</g>`
    );
  }
  return `<g filter="url(#pr-soft)">
${groundShadow(cx, 128, 44, 10)}
${spikes.join('')}
${bev(`M${cx} ${cy - 40} A40 40 0 1 1 ${cx - 0.01} ${cy - 40} Z`, 'mine', { key: 4 })}
<circle cx="${cx}" cy="${cy}" r="17" fill="#2a0b10"/>
<circle cx="${cx}" cy="${cy}" r="17" fill="none" stroke="#10151d" stroke-width="3.6"/>
<circle cx="${cx}" cy="${cy}" r="11" fill="#ff3355" filter="url(#pr-hotglow)"/>
<circle cx="${n(cx - 3)}" cy="${n(cy - 4)}" r="4" fill="#ffd3dc" opacity="0.85"/>
<path d="M${cx - 26} ${cy - 24} A36 36 0 0 1 ${cx + 4} ${cy - 39}" fill="none" stroke="#ffffff" stroke-width="5" stroke-opacity="0.26" stroke-linecap="round"/>
</g>`;
}

/**
 * Barrier — starts negative, every shot walks the counter up. The plate is part
 * of the prop so the number never collides with lane art (`04`).
 */
export function hazardBarrier(id = 'barrier', { value = '-8' } = {}) {
  const w = 232;
  const h = 96;
  const x = 10;
  const y = 18;
  const body = rr(x, y, w, h, 16);
  const stripe = (sx) =>
    `<path d="M${n(sx)} ${y + 6} l22 0 l-26 ${h - 12} l-22 0 Z" fill="#141922" opacity="0.5"/>`;
  return `<g filter="url(#pr-soft)">
${groundShadow(x + w / 2, y + h + 12, w * 0.42, 11)}
${bev(body, 'barrier', { key: 4.4 })}
<g clip-path="url(#pr-clip-barrier)">
  ${stripe(x + 20)}${stripe(x + 56)}${stripe(x + w - 36)}${stripe(x + w - 72)}
</g>
<path d="${rr(x + 8, y + 7, w - 16, 16, 8)}" fill="#ffffff" opacity="0.16"/>
${counterPlate(x + w / 2, y + h / 2, 108, 52, value, { positive: false })}
</g>`;
}

export function barrierClip() {
  return `<clipPath id="pr-clip-barrier"><path d="${rr(10, 18, 232, 96, 16)}"/></clipPath>`;
}

const GLYPH = {
  score_mult: (c) =>
    `<text x="${c}" y="${c + 13}" font-family="Public Sans" font-size="38" font-weight="800" fill="#2a1a00" text-anchor="middle" letter-spacing="-1">x2</text>`,
  rapid_fire: (c) =>
    `<g fill="#2a1a00"><path d="M${c - 20} ${c - 24} h18 l-8 16 h12 l-24 32 l6 -22 h-12 Z"/><path d="M${c + 6} ${c - 24} h16 l-8 16 h11 l-22 32 l6 -22 h-11 Z"/></g>`,
  pierce: (c) =>
    `<g stroke="#04212a" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M${c} ${c + 26} V${c - 24}"/><path d="M${c - 13} ${c - 11} l13 -14 l13 14"/></g><circle cx="${c}" cy="${c + 4}" r="15" fill="none" stroke="#04212a" stroke-width="5" stroke-opacity="0.45"/>`,
  wide: (c) =>
    `<g stroke="#2a0520" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M${c} ${c + 26} V${c - 20}"/><path d="M${c - 24} ${c + 26} L${c - 12} ${c - 14}"/><path d="M${c + 24} ${c + 26} L${c + 12} ${c - 14}"/></g>`,
  shield: (c) =>
    `<path d="M${c} ${c - 26} l24 10 v14 c0 16 -11 26 -24 30 c-13 -4 -24 -14 -24 -30 v-14 Z" fill="#03182e" opacity="0.9"/><path d="M${c} ${c - 19} l17 7 v10 c0 11 -8 19 -17 22 c-9 -3 -17 -11 -17 -22 v-10 Z" fill="#9ed3ff"/>`,
  magnet: (c) =>
    `<g fill="none" stroke="#1b0533" stroke-width="13" stroke-linecap="butt"><path d="M${c - 19} ${c + 22} V${c - 2} a19 19 0 0 1 38 0 V${c + 22}"/></g><g fill="#ff5470"><rect x="${c - 26}" y="${c + 15}" width="14" height="14" rx="3"/><rect x="${c + 12}" y="${c + 15}" width="14" height="14" rx="3"/></g>`,
};

export const PICKUPS = {
  score_mult: { base: '#f5c23a', light: '#ffeaa0', dark: '#a9760a', label: 'SCORE x2' },
  rapid_fire: { base: '#ff9f3d', light: '#ffd3a0', dark: '#aa520a', label: 'RAPID FIRE' },
  pierce: { base: '#35d6e8', light: '#a8f3fb', dark: '#146d7c', label: 'PIERCE' },
  wide: { base: '#ff5fb3', light: '#ffb6dd', dark: '#9c1f63', label: 'WIDE SHOT' },
  shield: { base: '#4a8cff', light: '#a9c9ff', dark: '#1b4499', label: 'SHIELD' },
  magnet: { base: '#b06bff', light: '#dcc0ff', dark: '#5b2a9c', label: 'MAGNET' },
};

/** Pickups: one bevelled tile language, one glyph each, readable at 56px. */
export function pickup(kind, { size = 112 } = {}) {
  const c = size / 2;
  const tile = rr(14, 14, size - 28, size - 28, 22);
  return `<g filter="url(#pr-soft)">
${aura(`pk-${kind}`, c, c, size * 0.48, 0.85)}
${bev(tile, `pk-${kind}`, { key: 4.6 })}
<path d="${rr(24, 22, size - 48, 20, 10)}" fill="#ffffff" opacity="0.22"/>
${GLYPH[kind](c)}
</g>`;
}

export function muzzleFlash() {
  const c = 70;
  const pts = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const r = i % 2 ? 24 : 62;
    pts.push(`${n(c + Math.cos(a) * r)} ${n(c + Math.sin(a) * r * 0.92)}`);
  }
  return `<g>
<circle cx="${c}" cy="${c}" r="58" fill="url(#bv-flash-aura)"/>
<path d="M${pts.join(' L')} Z" fill="url(#bv-flash-face)" opacity="0.95"/>
<path d="M${pts.join(' L')} Z" fill="none" stroke="#fff6dc" stroke-width="2.4" stroke-opacity="0.55"/>
<circle cx="${c}" cy="${c}" r="22" fill="#fff8e4"/>
<circle cx="${c}" cy="${c}" r="31" fill="#ffd27a" opacity="0.5"/>
</g>`;
}

export function explosion() {
  const c = 100;
  const puff = (cx, cy, r, op) =>
    `<circle cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}" fill="url(#bv-boom-face)" opacity="${op}"/>`;
  let shards = '';
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2 + 0.3;
    const d = 72 + (i % 3) * 12;
    const x = c + Math.cos(a) * d;
    const y = c + Math.sin(a) * d;
    shards += `<g transform="rotate(${n((a * 180) / Math.PI)} ${n(x)} ${n(y)})">${bev(rr(x - 9, y - 5, 18, 10, 5), 'shard', { key: 2.2 })}</g>`;
  }
  return `<g>
<circle cx="${c}" cy="${c}" r="96" fill="url(#bv-boom-aura)"/>
<circle cx="${c}" cy="${c}" r="70" fill="none" stroke="#ffd27a" stroke-width="5" stroke-opacity="0.45"/>
${puff(c - 26, c - 14, 40, 0.95)}${puff(c + 24, c - 20, 34, 0.9)}${puff(c + 8, c + 24, 42, 0.95)}${puff(c - 30, c + 22, 30, 0.85)}
<circle cx="${c}" cy="${c}" r="34" fill="#fff4d2" opacity="0.92"/>
<circle cx="${c}" cy="${c}" r="20" fill="#ffffff"/>
${shards}
</g>`;
}

export function hitSpark() {
  const c = 44;
  const arm = (rot, len) =>
    `<path d="M${c} ${c} l${n(len)} -3.4 l6 3.4 l-6 3.4 Z" transform="rotate(${rot} ${c} ${c})" fill="#fff6dc"/>`;
  return `<g>
<circle cx="${c}" cy="${c}" r="26" fill="url(#bv-flash-aura)" opacity="0.8"/>
${arm(0, 30)}${arm(90, 22)}${arm(180, 30)}${arm(270, 22)}
${arm(45, 15)}${arm(135, 15)}${arm(225, 15)}${arm(315, 15)}
<circle cx="${c}" cy="${c}" r="8.5" fill="#ffffff"/>
<circle cx="${n(c + 20)}" cy="${n(c - 16)}" r="3.2" fill="#ffd27a"/>
<circle cx="${n(c - 18)}" cy="${n(c + 18)}" r="2.6" fill="#ffd27a"/>
</g>`;
}

export function fxDefs() {
  return (
    bevelDefs('flash', { base: '#ffb02e', light: '#fff3cf', dark: '#ff6a00' }) +
    bevelDefs('boom', { base: '#ff8c00', light: '#ffe0a0', dark: '#c02f00' }) +
    bevelDefs('shard', { base: '#ffd27a', light: '#fff6dc', dark: '#b45a00' })
  );
}
