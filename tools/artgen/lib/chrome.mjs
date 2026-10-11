import { n, rr } from './brand.mjs';

export const BAR_H = 34;

/** Shared OS-window gradients + shadows. Emit once per document. */
export function chromeDefs() {
  return `
<linearGradient id="ch-panel" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1a212b"/>
  <stop offset="0.45" stop-color="#161b22"/>
  <stop offset="1" stop-color="#11161d"/>
</linearGradient>
<linearGradient id="ch-bar" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#232b36"/>
  <stop offset="1" stop-color="#181f28"/>
</linearGradient>
<linearGradient id="ch-edge" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#454e5a"/>
  <stop offset="0.5" stop-color="#30363d"/>
  <stop offset="1" stop-color="#232a33"/>
</linearGradient>
<linearGradient id="ch-innertop" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.09"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
</linearGradient>
<filter id="ch-drop" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="18" stdDeviation="26" flood-color="#000" flood-opacity="0.66"/>
</filter>
<filter id="ch-drop-sm" x="-40%" y="-40%" width="180%" height="180%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000" flood-opacity="0.7"/>
</filter>
<filter id="ch-vglow" x="-45%" y="-45%" width="190%" height="190%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="0" stdDeviation="22" flood-color="#6e40c9" flood-opacity="0.5"/>
</filter>
<filter id="ch-vglow-strong" x="-55%" y="-55%" width="210%" height="210%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="0" stdDeviation="9" flood-color="#a371f7" flood-opacity="1"/>
  <feDropShadow dx="0" dy="0" stdDeviation="26" flood-color="#6e40c9" flood-opacity="0.85"/>
</filter>`;
}

/** Per-window accent glow used for the Active Window treatment (`07`). */
export function accentGlowDef(id, accent) {
  return `
<filter id="ch-glow-${id}" x="-55%" y="-55%" width="210%" height="210%" color-interpolation-filters="sRGB">
  <feDropShadow dx="0" dy="0" stdDeviation="7" flood-color="${accent}" flood-opacity="0.95"/>
  <feDropShadow dx="0" dy="0" stdDeviation="22" flood-color="${accent}" flood-opacity="0.5"/>
</filter>`;
}

function controls(x2, y, stroke, scale = 1) {
  const s = scale;
  const gy = y;
  return `<g stroke="${stroke}" stroke-width="${n(1.6 * s)}" fill="none" stroke-linecap="round">
  <path d="M${n(x2 - 60 * s)} ${n(gy)} h${n(10 * s)}"/>
  <rect x="${n(x2 - 44 * s)}" y="${n(gy - 5 * s)}" width="${n(10 * s)}" height="${n(10 * s)}" rx="${n(2 * s)}"/>
  <path d="M${n(x2 - 23 * s)} ${n(gy - 5 * s)} l${n(10 * s)} ${n(10 * s)} M${n(x2 - 13 * s)} ${n(gy - 5 * s)} l${n(-10 * s)} ${n(10 * s)}"/>
</g>`;
}

export function trafficLights(x, y, s = 1) {
  const dot = (cx, a, b) =>
    `<circle cx="${n(cx)}" cy="${n(y)}" r="${n(5.1 * s)}" fill="${a}"/><circle cx="${n(cx)}" cy="${n(y - 1.4 * s)}" r="${n(4.6 * s)}" fill="${b}" opacity="0.5"/>`;
  return (
    dot(x, '#ff5f57', '#ff928d') +
    dot(x + 15 * s, '#febc2e', '#fed171') +
    dot(x + 30 * s, '#28c840', '#6dda7d')
  );
}

/**
 * OS window chrome. Returns the chrome markup plus the geometry of the body
 * area, so interiors can be authored independently and clipped into it.
 */
export function osWindow({
  id,
  x,
  y,
  w,
  h,
  r = 14,
  barH = BAR_H,
  accent = '#30363d',
  edge,
  title = '',
  titleFill = '#6e7681',
  titleSize = 12.5,
  icon = '',
  lights = false,
  active = false,
  showControls = true,
  shadow = 'ch-drop',
  glow,
}) {
  const edgeStroke = edge || accent;
  const body = rr(x, y, w, h, r);
  const barClip = `M${n(x + r)} ${n(y)} H${n(x + w - r)} A${r} ${r} 0 0 1 ${n(x + w)} ${n(y + r)} V${n(y + barH)} H${n(x)} V${n(y + r)} A${r} ${r} 0 0 1 ${n(x + r)} ${n(y)} Z`;
  const barClip2 = `M${n(x + r)} ${n(y)} H${n(x + w - r)} A${r} ${r} 0 0 1 ${n(x + w)} ${n(y + r)} V${n(y + barH + 14)} H${n(x)} V${n(y + r)} A${r} ${r} 0 0 1 ${n(x + r)} ${n(y)} Z`;

  let out = `<g>\n  <path d="${body}" fill="#05070a" filter="url(#${shadow})"/>\n`;
  if (active) {
    out += `  <path d="${body}" fill="none" stroke="${accent}" stroke-width="3" filter="url(#${glow || 'ch-vglow-strong'})"/>\n`;
  }
  out += `  <path d="${body}" fill="url(#ch-panel)"/>\n`;
  out += `  <path d="${barClip2}" fill="url(#ch-bar)"/>\n`;
  out += `  <path d="${barClip}" fill="url(#ch-bar)"/>\n`;
  out += `  <path d="M${n(x + 0.5)} ${n(y + barH)} H${n(x + w - 0.5)}" stroke="#0b0f14" stroke-width="1"/>\n`;
  out += `  <path d="M${n(x + 0.5)} ${n(y + barH + 1)} H${n(x + w - 0.5)}" stroke="#39414d" stroke-width="0.8" stroke-opacity="0.5"/>\n`;
  out += `  <path d="M${n(x + r)} ${n(y + 1)} H${n(x + w - r)} A${r - 1} ${r - 1} 0 0 1 ${n(x + w - 1)} ${n(y + r)} V${n(y + r - 1)} H${n(x + 1)} V${n(y + r)} A${r - 1} ${r - 1} 0 0 1 ${n(x + r)} ${n(y + 1)} Z" fill="url(#ch-innertop)"/>\n`;
  if (lights) out += trafficLights(x + 17, y + 17, barH / 34) + '\n';
  if (title)
    out += `<text x="${n(x + w / 2)}" y="${n(y + barH * 0.55 + titleSize * 0.36)}" font-family="Public Sans" font-size="${titleSize}" font-weight="500" fill="${titleFill}" text-anchor="middle" letter-spacing="0.6">${title}</text>\n`;
  if (icon) out += icon + '\n';
  if (showControls) out += controls(x + w - 13, y + barH / 2, mutedStroke(accent), barH / 34) + '\n';
  out += `  <path d="${rr(x + 0.7, y + 0.7, w - 1.4, h - 1.4, r - 0.7)}" fill="none" stroke="${edgeStroke}" stroke-width="1.4"/>\n`;
  out += `  <path d="${rr(x + 2, y + 2, w - 4, h - 4, r - 2)}" fill="none" stroke="#000" stroke-width="1" stroke-opacity="0.35"/>\n`;
  out += `</g>`;

  const bodyClip = `<clipPath id="fr-${id}"><path d="M${n(x)} ${n(y + barH)} H${n(x + w)} V${n(y + h - r)} A${r} ${r} 0 0 1 ${n(x + w - r)} ${n(y + h)} H${n(x + r)} A${r} ${r} 0 0 1 ${n(x)} ${n(y + h - r)} V${n(y + barH)} Z"/></clipPath>`;

  return {
    chrome: out,
    bodyClip,
    clip: `fr-${id}`,
    inner: { x, y: y + barH, w, h: h - barH },
    rim: `<path d="${rr(x + 0.7, y + 0.7, w - 1.4, h - 1.4, r - 0.7)}" fill="none" stroke="${edgeStroke}" stroke-width="1.6"/>`,
  };
}

function mutedStroke(accent) {
  if (accent === '#30363d' || accent === '#93a1b2') return '#4b535d';
  // Darkened accent so the window controls read as chrome, not as a brand action.
  const p = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16));
  return (
    '#' +
    p.map((v) => Math.round(v * 0.62).toString(16).padStart(2, '0')).join('')
  );
}
