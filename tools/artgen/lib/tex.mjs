import { n, rng, rr } from './brand.mjs';
import { bev, bevelDefs } from './props.mjs';

export function noiseDefs(id, freq = 0.9, slope = 0.12, seed = 4) {
  return `
<filter id="nz-${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="3" seed="${seed}" stitchTiles="stitch" result="n"/>
  <feColorMatrix type="saturate" values="0" in="n" result="g"/>
  <feComponentTransfer in="g">
    <feFuncA type="linear" slope="${slope}" intercept="0"/>
  </feComponentTransfer>
</filter>`;
}

/** Lane ground: tileable slate panel so the scroll never shows a seam. */
export function groundTile(size = 256) {
  const h = size;
  const defs = `
<linearGradient id="gt-base" x1="0" y1="0" x2="0.3" y2="1">
  <stop offset="0" stop-color="#232e3d"/>
  <stop offset="1" stop-color="#131a24"/>
</linearGradient>
${noiseDefs('gt', 1.1, 0.14, 11)}`;
  const seams = [];
  for (let i = 1; i < 4; i++) {
    seams.push(`<path d="M0 ${n((i * h) / 4)} H${size}" stroke="#3a4a60" stroke-width="2" stroke-opacity="0.8"/>`);
    seams.push(`<path d="M0 ${n((i * h) / 4) + 2} H${size}" stroke="#070a0f" stroke-width="2" stroke-opacity="0.6"/>`);
  }
  seams.push(`<path d="M${size / 2} 0 V${h}" stroke="#3a4a60" stroke-width="2" stroke-opacity="0.55"/>`);
  seams.push(`<path d="M${size / 2 + 2} 0 V${h}" stroke="#070a0f" stroke-width="2" stroke-opacity="0.45"/>`);
  const r = rng(23);
  let scuff = '';
  for (let i = 0; i < 26; i++) {
    const x = r() * size;
    const y = r() * h;
    scuff += `<rect x="${n(x)}" y="${n(y)}" width="${n(10 + r() * 46)}" height="${n(1 + r() * 2)}" rx="1" fill="#7d8ea6" opacity="${n(0.05 + r() * 0.1)}"/>`;
  }
  return { defs, body: `<rect width="${size}" height="${h}" fill="url(#gt-base)"/>${seams.join('')}${scuff}<rect width="${size}" height="${h}" filter="url(#nz-gt)"/>` };
}

/** Simple depth backdrop: horizon glow + bevelled distant blocks. */
export function backdrop(w = 512, h = 320) {
  const defs = `
<linearGradient id="bd-sky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a0f18"/>
  <stop offset="0.52" stop-color="#14203a"/>
  <stop offset="0.78" stop-color="#2a2150"/>
  <stop offset="1" stop-color="#120d20"/>
</linearGradient>
<radialGradient id="bd-sun" cx="0.5" cy="1" r="0.75">
  <stop offset="0" stop-color="#ffb36b" stop-opacity="0.6"/>
  <stop offset="0.35" stop-color="#c9589b" stop-opacity="0.3"/>
  <stop offset="1" stop-color="#6e40c9" stop-opacity="0"/>
</radialGradient>
${bevelDefs('bd-far', { base: '#1c2740', light: '#33436b', dark: '#101728' })}
${bevelDefs('bd-near', { base: '#141b2b', light: '#26314a', dark: '#0a0e17' })}
${noiseDefs('bd', 0.8, 0.07, 5)}`;
  const r = rng(91);
  let stars = '';
  for (let i = 0; i < 70; i++) {
    stars += `<circle cx="${n(r() * w)}" cy="${n(r() * h * 0.6)}" r="${n(0.6 + r() * 1.3)}" fill="#dfe8ff" opacity="${n(0.1 + r() * 0.4)}"/>`;
  }
  let far = '';
  let x = -20;
  while (x < w + 20) {
    const bw = 24 + r() * 48;
    const bh = 30 + r() * 86;
    far += `<g>${bev(rr(x, h * 0.66 - bh, bw, bh + 20, 7), 'bd-far', { key: 2 })}</g>`;
    x += bw + 6 + r() * 18;
  }
  let near = '';
  x = -30;
  while (x < w + 30) {
    const bw = 40 + r() * 70;
    const bh = 22 + r() * 54;
    near += `<g>${bev(rr(x, h * 0.84 - bh, bw, bh + 30, 9), 'bd-near', { key: 2.2 })}</g>`;
    x += bw + 10 + r() * 22;
  }
  return {
    defs,
    body: `<rect width="${w}" height="${h}" fill="url(#bd-sky)"/>
<ellipse cx="${w / 2}" cy="${n(h * 0.7)}" rx="${n(w * 0.62)}" ry="${n(h * 0.5)}" fill="url(#bd-sun)"/>
${stars}
${far}
${near}
<rect y="${n(h * 0.9)}" width="${w}" height="${n(h * 0.1)}" fill="#07090d"/>
<rect width="${w}" height="${h}" filter="url(#nz-bd)"/>`,
  };
}

/**
 * Three-lane markings. Drawn with a slight converge so the top-down board
 * still reads as depth without becoming a perspective camera (`04`).
 */
export function laneGuide(w = 480, h = 640, { converge = 0.1 } = {}) {
  const defs = `
<linearGradient id="lg-fade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#ffffff" stop-opacity="0.05"/>
  <stop offset="0.42" stop-color="#ffffff" stop-opacity="0.45"/>
  <stop offset="1" stop-color="#ffffff" stop-opacity="0.9"/>
</linearGradient>
<linearGradient id="lg-edge" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#93a1b2" stop-opacity="0.12"/>
  <stop offset="1" stop-color="#b9c6d6" stop-opacity="0.8"/>
</linearGradient>`;
  const topInset = w * converge;
  const lx = (t, frac) => {
    const top = topInset + (w - 2 * topInset) * frac;
    const bot = w * frac;
    return top + (bot - top) * t;
  };
  const edge = (frac, sw, grad) => {
    let d = `M${n(lx(0, frac))} 0 `;
    for (let i = 1; i <= 12; i++) d += `L${n(lx(i / 12, frac))} ${n((i / 12) * h)} `;
    return `<path d="${d}" fill="none" stroke="url(#${grad})" stroke-width="${sw}"/>`;
  };
  let dashes = '';
  for (const frac of [1 / 3, 2 / 3]) {
    let y = 18;
    let step = 20;
    while (y < h) {
      const t = y / h;
      const wdt = 3 + 4 * t;
      dashes += `<rect x="${n(lx(t, frac) - wdt / 2)}" y="${n(y)}" width="${n(wdt)}" height="${n(step * 0.55)}" rx="${n(wdt / 2)}" fill="url(#lg-fade)" opacity="${n(0.4 + 0.55 * t)}"/>`;
      y += step;
      step *= 1.11;
    }
  }
  let rungs = '';
  let y = 30;
  let step = 26;
  while (y < h) {
    const t = y / h;
    rungs += `<path d="M${n(lx(t, 0))} ${n(y)} H${n(lx(t, 1))}" stroke="#93a1b2" stroke-width="1.2" stroke-opacity="${n(0.04 + 0.1 * t)}"/>`;
    y += step;
    step *= 1.09;
  }
  return {
    defs,
    body: `${rungs}${edge(0, 3.4, 'lg-edge')}${edge(1, 3.4, 'lg-edge')}${dashes}`,
    laneX: (t, lane) => lx(t, (lane + 0.5) / 3),
    laneW: (t) => (lx(t, 1) - lx(t, 0)) / 3,
  };
}
