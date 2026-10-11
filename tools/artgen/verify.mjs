import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..', 'content');
const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else files.push(p);
  }
})(ROOT);

const errs = [];
let svg = 0;
let png = 0;
let webp = 0;

for (const f of files) {
  if (f.endsWith('.svg')) {
    svg++;
    const src = readFileSync(f, 'utf8');
    try {
      new Resvg(src, { font: { loadSystemFonts: true } }).render().asPng();
    } catch (e) {
      errs.push(`${f}: render failed — ${e.message}`);
      continue;
    }
    // every url(#id) reference must resolve to a declared id
    const ids = new Set([...src.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
    for (const m of src.matchAll(/url\(#([^)]+)\)/g)) {
      if (!ids.has(m[1])) errs.push(`${f}: dangling reference url(#${m[1]})`);
    }
    for (const m of src.matchAll(/clip-path="url\(#([^)]+)\)"/g)) {
      if (!ids.has(m[1])) errs.push(`${f}: dangling clip-path #${m[1]}`);
    }
  } else if (f.endsWith('.png') || f.endsWith('.webp')) {
    f.endsWith('.png') ? png++ : webp++;
    try {
      const m = await sharp(f).metadata();
      if (!m.width || !m.height) errs.push(`${f}: no dimensions`);
    } catch (e) {
      errs.push(`${f}: unreadable — ${e.message}`);
    }
  } else if (f.endsWith('.json')) {
    try {
      JSON.parse(readFileSync(f, 'utf8'));
    } catch (e) {
      errs.push(`${f}: bad JSON — ${e.message}`);
    }
  }
}

console.log(`svg ${svg}  png ${png}  webp ${webp}`);
if (errs.length) {
  console.log(`\n${errs.length} problem(s):`);
  for (const e of errs) console.log('  ' + e);
  process.exitCode = 1;
} else {
  console.log('all clean');
}
