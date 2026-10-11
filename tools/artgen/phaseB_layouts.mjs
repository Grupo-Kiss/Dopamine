/**
 * Phase B1/B2 — Playing layout comps.
 *
 * Every window interior, icon, sticker and Alert card is lifted from its
 * committed Phase C/D/B master (see lib/compose.mjs); only the masonry, the
 * Dopamine meter and the extended Lane Defender world are built here.
 */
import { BRAND, STAGE, mix, n, rr } from './lib/brand.mjs';
import { accentGlowDef, chromeDefs, minigameMark, osWindow } from './lib/chrome.mjs';
import { alertCard, fitInterior, importSvg, liftGroup, placeFragment, region, windowInterior } from './lib/compose.mjs';
import { dopamineMeter } from './lib/meter.mjs';
import { laneSlot } from './lib/playfields.mjs';
import { DISPLAY_FONTS, writeSvg, writeWebp } from './lib/render.mjs';
import { crtDefs, crtOverlay, stageBack, stageDefs } from './lib/stage.mjs';

/* ------------------------------------------------------------------ */
/* shared pieces                                                       */
/* ------------------------------------------------------------------ */

const ICON = Object.fromEntries(
  ['loop', 'pulse', 'wave', 'echo', 'dopamine'].map((k) => [k, importSvg(`content/icons/${k}.svg`, `ic-${k}`)])
);

function iconAt(key, x, y, size) {
  return placeFragment(ICON[key], x, y, size / ICON[key].w);
}

/** Lift one score float out of the B4 sheet, re-origined on its anchor. */
function scoreFloat(index, anchor, p) {
  const g = liftGroup('content/ui/stickers/score_float.svg', p, `filter="url(#fl${index}-g)"`);
  return { defs: g.defs, body: `<g transform="translate(${-anchor[0]} ${-anchor[1]})">${g.body}</g>` };
}

function sticker(rel, p, replace = []) {
  const s = importSvg(rel, p);
  for (const [a, b] of replace) s.body = s.body.replace(a, b);
  return s;
}

/** Place a sticker by its centre. */
function stickerAt(s, cx, cy, scale) {
  return placeFragment(s, cx - (s.w * scale) / 2, cy - (s.h * scale) / 2, scale);
}

/**
 * One permanent window: Phase C chrome language + Phase D icon in the title
 * bar + the authored interior fitted to the slot. Inactive windows keep their
 * skin but drop to a quieter edge; only the Active Window glows (`07`).
 */
function serviceWindow(key, slot, { active = false, barH = 34, fit = {}, interior } = {}) {
  const brand = BRAND[key];
  const iconSize = Math.round(barH * 0.6);
  const g = osWindow({
    id: `w-${key}`,
    ...slot,
    barH,
    r: barH < 30 ? 11 : 14,
    accent: brand.accent,
    edge: active ? brand.accent : mix(brand.accent, '#30363d', 0.52),
    title: key,
    titleFill: active ? brand.light : '#8b949e',
    titleSize: barH < 30 ? 10.5 : 12.5,
    icon: iconAt(key, slot.x + 11, slot.y + (barH - iconSize) / 2, iconSize),
    active,
    glow: `ch-glow-${key}`,
    shadow: 'ch-drop-sm',
  });
  let defs = g.bodyClip + (active ? accentGlowDef(key, brand.accent) : '');
  let inner;
  if (interior) {
    const built = interior(g.inner);
    defs += built.defs;
    inner = built.body;
  } else {
    const it = windowInterior(key, `${key}-${slot.x}`);
    const f = fitInterior(it, g.inner, { ...fit, id: `${key}-${slot.x}` });
    defs += it.defs + f.defs;
    inner = f.body;
  }
  return { defs, body: `${g.chrome}\n<g clip-path="url(#${g.clip})">${inner}</g>\n${g.rim}`, inner: g.inner };
}

function minigameWindow(slot, { active = true, barH = 34 } = {}) {
  const brand = BRAND.minigame;
  const g = osWindow({
    id: `w-mg-${slot.x}-${slot.y}`,
    ...slot,
    barH,
    r: barH < 30 ? 11 : 14,
    accent: brand.accent,
    edge: active ? brand.accent : mix(brand.accent, '#30363d', 0.52),
    title: 'minigame — lane defender',
    titleFill: active ? brand.light : '#8b949e',
    titleSize: barH < 30 ? 10.5 : 12.5,
    icon: minigameMark(slot.x + 11, slot.y + (barH - 24 * (barH / 34)) / 2, barH / 34),
    active,
    glow: 'ch-glow-minigame',
    shadow: 'ch-drop-sm',
  });
  const ls = laneSlot(g.inner.w, g.inner.h);
  return {
    defs: g.bodyClip + (active ? accentGlowDef('minigame', brand.accent) : '') + ls.defs,
    body: `${g.chrome}\n<g clip-path="url(#${g.clip})"><g transform="translate(${n(g.inner.x)} ${n(g.inner.y)})">${ls.body}</g></g>\n${g.rim}`,
    inner: g.inner,
    board: { x: g.inner.x + ls.box.x, y: g.inner.y, w: ls.box.w, h: ls.box.h },
  };
}

/** Persistent edge meter: Dopamine mark on top, continuous tube below. */
function meterColumn(id, x, y, w, h, fill, { iconSize, tube = 0.74, gap: g } = {}) {
  const ic = iconSize ?? w * 0.78;
  const gap = g ?? Math.round(w * 0.22);
  const tubeW = Math.round(w * tube);
  const m = dopamineMeter({ id, x: x + (w - tubeW) / 2, y: y + ic + gap, w: tubeW, h: h - ic - gap, fill });
  return {
    defs: m.defs,
    body: `${iconAt('dopamine', x + (w - ic) / 2, y, ic)}\n${m.body}`,
    top: m.top,
  };
}

/* ------------------------------------------------------------------ */
/* B1 — desktop                                                        */
/* ------------------------------------------------------------------ */

async function desktop() {
  const W = 1920;
  const H = 1080;
  const INSET = 8; // `07` LAYOUT_OUTER_INSET_PX
  const GUT = 8; // `07` LAYOUT_GUTTER_PX
  const BAR_W = 56;

  const cw = W - INSET * 2 - GUT - BAR_W;
  const ch = H - INSET * 2;
  const mgW = Math.round((cw - GUT) * 0.6);
  const colW = cw - GUT - mgW;
  const topH = 680;
  const loopH = 450;
  const waveH = topH - GUT - loopH;
  const botH = ch - GUT - topH;
  const halfW = (cw - GUT) / 2;

  const x0 = INSET;
  const y0 = INSET;
  const colX = x0 + mgW + GUT;
  const botY = y0 + topH + GUT;
  const slot = {
    mg: { x: x0, y: y0, w: mgW, h: topH },
    loop: { x: colX, y: y0, w: colW, h: loopH },
    wave: { x: colX, y: y0 + loopH + GUT, w: colW, h: waveH },
    pulse: { x: x0, y: botY, w: halfW, h: botH },
    echo: { x: x0 + halfW + GUT, y: botY, w: halfW, h: botH },
    bar: { x: W - INSET - BAR_W, y: y0, w: BAR_W, h: ch },
  };

  const mg = minigameWindow(slot.mg);
  // Scales chosen so each authored interior keeps its load-bearing row
  // (Loop progress pill, Wave transport, Echo reactions); Pulse is the one
  // allowed to run off the bottom, because a feed reads as scrolling on.
  const loop = serviceWindow('loop', slot.loop, { fit: { scale: 0.7, fade: 22 } });
  const wave = serviceWindow('wave', slot.wave, { fit: { scale: 0.668 } });
  const pulse = serviceWindow('pulse', slot.pulse, { fit: { fade: 46 } });
  const echo = serviceWindow('echo', slot.echo, { fit: { scale: 0.79 } });
  const meter = meterColumn('dm', slot.bar.x, slot.bar.y, slot.bar.w, slot.bar.h, 0.74, { iconSize: 40 });

  const combo = sticker('content/ui/stickers/combo_juicy.svg', 'cj');
  const chain = sticker('content/ui/stickers/focus_chain_tier2.svg', 'fc2', [['>x7<', '>x5<']]);
  const plusDop = scoreFloat(2, [508, 120], 'fd');
  const alert = alertCard(0, 'al0');

  const alertS = 0.8;
  const alertX = mg.board.x + mg.board.w + 64;
  const alertY = 50;

  const defs = [
    stageDefs(W, H),
    chromeDefs(),
    crtDefs(),
    ...[ICON.loop, ICON.pulse, ICON.wave, ICON.echo, ICON.dopamine].map((i) => i.defs),
    mg.defs,
    loop.defs,
    wave.defs,
    pulse.defs,
    echo.defs,
    meter.defs,
    combo.defs,
    chain.defs,
    plusDop.defs,
    alert.defs,
  ].join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dopamine — desktop Playing layout">
<title>Dopamine — desktop Playing layout</title>
<defs>
${defs}
</defs>
<rect width="${W}" height="${H}" fill="${STAGE.gutter}"/>
<g opacity="0.55">${stageBack(W, H, { seed: 53, streaks: 0, bloom: 0.4 })}</g>

<!-- masonry: Minigame | Loop-over-Wave, then Pulse | Echo (07). Active Window first so neighbours sit over its glow spill. -->
${mg.body}
${loop.body}
${wave.body}
${pulse.body}
${echo.body}

<!-- Dopamine: reserved edge chrome outside the masonry -->
${meter.body}

<!-- event stickers + the one overlapping Alert -->
${stickerAt(combo, slot.mg.x + 168, slot.mg.y + 196, 0.74)}
${placeFragment(plusDop, slot.bar.x - 66, meter.top + 22, 0.62)}
${stickerAt(chain, colX - GUT / 2 + 12, botY - GUT / 2 - 6, 0.6)}
${placeFragment(alert, alertX, alertY, alertS)}

${crtOverlay(W, H, { vignette: 0.55 })}
</svg>`;

  writeSvg('content/mockups/desktop_layout.svg', svg);
  await writeWebp('content/mockups/desktop_layout.webp', svg, W, 92, { fonts: DISPLAY_FONTS });
  return svg;
}

/* ------------------------------------------------------------------ */
/* B2 — mobile                                                         */
/* ------------------------------------------------------------------ */

/**
 * A compact window body assembled from panels of the desktop interior.
 * Each panel is one authored region, clipped and uniformly scaled; nothing is
 * redrawn and nothing is stretched.
 */
function compact(key, panels) {
  return (inner) => {
    const it = windowInterior(key, `m-${key}`);
    let defs = it.defs;
    let body = `<rect x="${n(inner.x)}" y="${n(inner.y)}" width="${n(inner.w)}" height="${n(inner.h)}" fill="url(#${it.bgId})"/>`;
    panels(inner).forEach((p, i) => {
      const r = region(it, p.src, p.x, p.y, p.s, `m-${key}-${i}`);
      defs += r.defs;
      body += r.body;
    });
    return { defs, body };
  };
}

const VW = 430; // viewport, CSS px
const VH = 932;

function mobileViewport(variant) {
  const INSET = 8;
  const GUT = 8;
  const METER_W = 18;
  const BAR = 26;
  const cw = VW - INSET * 2 - GUT - METER_W;
  const ch = VH - INSET * 2;
  const mgH = BAR + 470;
  const restH = ch - mgH - GUT * 2;
  const x0 = INSET;
  const mgSlot = { x: x0, y: INSET, w: cw, h: mgH };
  const y1 = INSET + mgH + GUT;
  const p = variant.id;

  const mg = minigameWindow(mgSlot, { active: variant.active === 'minigame', barH: BAR });
  const [aKey, bKey] = variant.windows;
  const aH = Math.round(restH * variant.split);
  const aSlot = { x: x0, y: y1, w: cw, h: aH };
  const bSlot = { x: x0, y: y1 + aH + GUT, w: cw, h: restH - aH };
  const a = serviceWindow(aKey, aSlot, { active: variant.active === aKey, barH: BAR, interior: compact(aKey, variant.panels[aKey]) });
  const b = serviceWindow(bKey, bSlot, { active: variant.active === bKey, barH: BAR, interior: compact(bKey, variant.panels[bKey]) });
  const meter = meterColumn(`${p}-dm`, VW - INSET - METER_W, INSET, METER_W, ch, variant.fill, { iconSize: 18, tube: 0.78, gap: 6 });

  const alert = alertCard(variant.alert, `${p}-al`);
  const alertS = (cw - 28) / alert.w;
  const slots = { minigame: mgSlot, [aKey]: aSlot, [bKey]: bSlot };

  const stickers = variant.stickers({ slots, meter, cw, x0, GUT, a: aSlot, b: bSlot, mg });
  const defs = [mg.defs, a.defs, b.defs, meter.defs, alert.defs, stickers.defs].join('\n');
  const body = `<rect width="${VW}" height="${VH}" fill="${STAGE.gutter}"/>
<g opacity="0.5">${stageBack(VW, VH, { seed: variant.seed, streaks: 0, bloom: 0.38 })}</g>
${variant.active === 'minigame' ? mg.body + a.body + b.body : a.body + b.body + mg.body}
${meter.body}
${stickers.body}
${placeFragment(alert, x0 + 14, INSET + BAR + 12, alertS)}
${crtOverlay(VW, VH, { vignette: 0.55 })}`;
  return { defs, body };
}

const MOBILE_VARIANTS = [
  {
    id: 'ma',
    caption: 'LOOP + WAVE DRAWN',
    note: 'Loop keeps its place above Wave; Wave takes the smaller slot',
    windows: ['loop', 'wave'],
    split: 0.6,
    active: 'minigame',
    fill: 0.82,
    alert: 1,
    seed: 61,
    panels: {
      // vertical clip beside the creator / caption / LIVE NOW column
      loop: (box) => {
        const vs = (box.h - 16) / 577;
        const vw = 328 * vs;
        const is = Math.min((box.w - 26 - vw) / 545, (box.h - 14) / 395);
        return [
          { src: { x: 24, y: 24, w: 328, h: 577 }, x: box.x + 8, y: box.y + 8, s: vs },
          { src: { x: 440, y: 10, w: 545, h: 395 }, x: box.x + 18 + vw, y: box.y + 7, s: is },
        ];
      },
      // the left 70% of the desktop player is already a complete compact player
      wave: (box) => {
        const s = Math.min(box.w / 705, (box.h - 6) / 258);
        return [{ src: { x: 0, y: 12, w: 705, h: 258 }, x: box.x + (box.w - 705 * s) / 2, y: box.y + 3, s }];
      },
    },
    // beside the boss, clear of the lanes' hazards and of the Alert above
    stickers: ({ slots }) => {
      const combo = sticker('content/ui/stickers/combo_juicy.svg', 'ma-cj');
      const mg = slots.minigame;
      return { defs: combo.defs, body: stickerAt(combo, mg.x + mg.w - 54, mg.y + 26 + 158, 0.34) };
    },
  },
  {
    id: 'mb',
    caption: 'PULSE + ECHO DRAWN',
    note: 'equal priority — Pulse is the Active Window, combo going flat',
    windows: ['pulse', 'echo'],
    split: 0.45,
    active: 'pulse',
    fill: 0.3,
    alert: 0,
    seed: 67,
    panels: {
      pulse: (box) => {
        const s = Math.min(box.w / 652, (box.h - 6) / 278);
        return [{ src: { x: 4, y: 0, w: 652, h: 278 }, x: box.x + (box.w - 652 * s) / 2, y: box.y + 2, s }];
      },
      echo: (box) => {
        const s = Math.min((box.w - 8) / 624, (box.h - 6) / 330);
        return [{ src: { x: 10, y: 56, w: 624, h: 330 }, x: box.x + (box.w - 624 * s) / 2, y: box.y + 4, s }];
      },
    },
    stickers: ({ slots, GUT }) => {
      const bored = sticker('content/ui/stickers/combo_bored.svg', 'mb-cb');
      const chain = sticker('content/ui/stickers/focus_chain_tier1.svg', 'mb-fc1');
      const pulse = slots.pulse;
      const echo = slots.echo;
      return {
        defs: bored.defs + chain.defs,
        body: `${stickerAt(bored, pulse.x + pulse.w - 42, pulse.y + 26 + 112, 0.34)}
${stickerAt(chain, pulse.x + pulse.w / 2 + 40, echo.y - GUT / 2, 0.5)}`,
      };
    },
  },
];

async function mobile() {
  const W = 1100;
  const H = 1216;
  const GAP = 100;
  const vx = [(W - VW * 2 - GAP) / 2, (W + GAP) / 2];
  const vy = 150;
  const views = MOBILE_VARIANTS.map(mobileViewport);

  let frames = '';
  views.forEach((v, i) => {
    const x = vx[i];
    const m = MOBILE_VARIANTS[i];
    frames += `
<path d="${rr(x, vy, VW, VH, 26)}" fill="#05070a" filter="url(#ch-drop)"/>
<path d="${rr(x, vy, VW, VH, 26)}" fill="none" stroke="#6e40c9" stroke-width="2" stroke-opacity="0.5" filter="url(#ch-vglow)"/>
<g clip-path="url(#vp-${i})"><g transform="translate(${n(x)} ${vy})">${v.body}</g></g>
<path d="${rr(x + 0.75, vy + 0.75, VW - 1.5, VH - 1.5, 25.25)}" fill="none" stroke="#454e5a" stroke-width="1.5"/>
<text x="${n(x + VW / 2)}" y="${vy + VH + 40}" font-family="Public Sans" font-size="13" font-weight="800" fill="#c9d1d9" text-anchor="middle" letter-spacing="2.6">${m.caption}</text>
<text x="${n(x + VW / 2)}" y="${vy + VH + 62}" font-family="Public Sans" font-size="13" font-weight="500" fill="#6e7681" text-anchor="middle">${m.note}</text>`;
  });

  const defs = [
    stageDefs(W, H),
    chromeDefs(),
    crtDefs(),
    ...Object.values(ICON).map((i) => i.defs),
    ...views.map((v) => v.defs),
    ...vx.map((x, i) => `<clipPath id="vp-${i}"><path d="${rr(x, vy, VW, VH, 26)}"/></clipPath>`),
  ].join('\n');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Dopamine — mobile Playing layout">
<title>Dopamine — mobile Playing layout</title>
<defs>
${defs}
</defs>
${stageBack(W, H, { seed: 59, streaks: 7 })}
<text x="${W / 2}" y="84" font-family="Teko" font-size="62" font-weight="600" fill="#c9d1d9" text-anchor="middle" letter-spacing="16">MOBILE PLAYING</text>
<text x="${W / 2}" y="114" font-family="Public Sans" font-size="16" font-weight="500" fill="#6e7681" text-anchor="middle">Minigame stays largest; two of Loop, Pulse, Wave, Echo are drawn each Match — ${VW}×${VH} viewports at 1:1</text>
${frames}
<text x="${W / 2}" y="${H - 22}" font-family="Public Sans" font-size="13" font-weight="500" fill="#4b535d" text-anchor="middle">8px inset and gutters as on desktop · Dopamine stays a continuous edge meter · Alerts are the only overlap · CRT glass lives inside each viewport</text>
</svg>`;

  writeSvg('content/mockups/mobile_layout.svg', svg);
  await writeWebp('content/mockups/mobile_layout.webp', svg, W * 2, 92, { fonts: DISPLAY_FONTS });
}

const want = process.argv.slice(2);
if (!want.length || want.includes('desktop')) {
  await desktop();
  console.log('phase B1 desktop layout: done');
}
if (!want.length || want.includes('mobile')) {
  await mobile();
  console.log('phase B2 mobile layout: done');
}
