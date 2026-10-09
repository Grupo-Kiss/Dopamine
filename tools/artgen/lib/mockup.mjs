import { BRAND, n, rr } from './brand.mjs';
import { accentGlowDef, chromeDefs, osWindow } from './chrome.mjs';
import { crtDefs, crtOverlay, stageBack, stageDefs } from './stage.mjs';

/** Review sheet: stage + titled window + caption rail + legend, as in Phase C. */
export function reviewSheet({
  w,
  h,
  title,
  subtitle,
  brand = BRAND.minigame,
  titleFill,
  window: win,
  interior,
  rail = '',
  legend = [],
  footer = '',
  defs = '',
  seed = 7,
}) {
  const g = osWindow({
    id: 'mg',
    x: win.x,
    y: win.y,
    w: win.w,
    h: win.h,
    accent: brand.accent,
    title: win.title,
    titleFill: brand.light,
    active: true,
    glow: 'ch-glow-mg',
    icon: win.icon || '',
  });

  const legendRows = legend
    .map((text, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? win.x : win.x + (w - win.x * 2) / 2 + 10;
      const y = h - 118 + row * 32;
      return `<g>
  <circle cx="${n(x + 5)}" cy="${n(y)}" r="4.5" fill="${brand.light}"/>
  <circle cx="${n(x + 5)}" cy="${n(y)}" r="8.5" fill="none" stroke="${brand.light}" stroke-width="1.2" stroke-opacity="0.4"/>
  <text x="${n(x + 26)}" y="${n(y + 5)}" font-family="Public Sans" font-size="15" font-weight="500" fill="#c9d1d9">${text}</text>
</g>`;
    })
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${title}">
<title>${title}</title>
<defs>
${stageDefs(w, h)}
${chromeDefs()}
${accentGlowDef('mg', brand.accent)}
${crtDefs()}
${defs}
${g.bodyClip}
</defs>
${stageBack(w, h, { seed })}

<text x="${n(w / 2)}" y="92" font-family="Teko" font-size="62" font-weight="600" fill="${titleFill || brand.light}" text-anchor="middle" letter-spacing="16">${title}</text>
<text x="${n(w / 2)}" y="122" font-family="Public Sans" font-size="16" font-weight="500" fill="#6e7681" text-anchor="middle">${subtitle}</text>

${g.chrome}
<g clip-path="url(#${g.clip})">${interior(g.inner)}</g>
${g.rim}

${rail}

<path d="M${win.x} ${h - 152} H${w - win.x}" stroke="${brand.light}" stroke-width="1.2" stroke-opacity="0.35"/>
${legendRows}
<text x="${n(w / 2)}" y="${h - 22}" font-family="Public Sans" font-size="13" font-weight="500" fill="#4b535d" text-anchor="middle">${footer}</text>

${crtOverlay(w, h)}
</svg>`;
}

/** Caption rail used to show individual sprites beside the playfield. */
export function railPanel(x, y, w, h, heading, { accent = BRAND.minigame.light } = {}) {
  return `<g>
  <path d="${rr(x, y, w, h, 12)}" fill="#0c1016" fill-opacity="0.82"/>
  <path d="${rr(x, y, w, h, 12)}" fill="none" stroke="${accent}" stroke-width="1.1" stroke-opacity="0.3"/>
  <text x="${n(x + 16)}" y="${n(y + 24)}" font-family="Public Sans" font-size="11.5" font-weight="800" fill="${accent}" letter-spacing="2.4">${heading}</text>
</g>`;
}

export function caption(cx, y, text, { fill = '#8b97a6', size = 11 } = {}) {
  return `<text x="${n(cx)}" y="${n(y)}" font-family="Public Sans" font-size="${size}" font-weight="600" fill="${fill}" text-anchor="middle" letter-spacing="0.8">${text}</text>`;
}
