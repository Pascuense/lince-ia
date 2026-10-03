#!/usr/bin/env node
// Writes a resized .webp next to every PNG/JPEG in client/public/{assets,avatars}.
// The server serves the .webp transparently to browsers that accept it.
// Re-run after adding images; existing up-to-date .webp files are skipped.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..", "client", "public");
const DIRS = ["assets", "avatars"];
const MAX_SIDE = 1600;
const QUALITY = 80;

let before = 0;
let after = 0;
let count = 0;
const failed = [];

for (const dir of DIRS) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) continue;
  for (const name of fs.readdirSync(abs)) {
    if (!/\.(png|jpe?g)$/i.test(name)) continue;
    const src = path.join(abs, name);
    const dest = src.replace(/\.(png|jpe?g)$/i, ".webp");
    const srcStat = fs.statSync(src);
    before += srcStat.size;
    if (fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= srcStat.mtimeMs) {
      after += fs.statSync(dest).size;
      continue;
    }
    try {
      // failOn "none": some source PNGs have minor CRC/stream errors but decode fine
      await sharp(src, { failOn: "none" })
        .resize(MAX_SIDE, MAX_SIDE, { fit: "inside", withoutEnlargement: true })
        .webp({ quality: QUALITY, alphaQuality: 90, effort: 5 })
        .toFile(dest);
      after += fs.statSync(dest).size;
      count++;
    } catch (err) {
      failed.push(`${dir}/${name}: ${err.message}`);
      after += srcStat.size;
    }
  }
}

const mb = n => (n / 1024 / 1024).toFixed(1);
console.log(`${count} webp generated. Originals ${mb(before)} MB -> webp ${mb(after)} MB`);
if (failed.length) {
  console.log(`${failed.length} left as original (served as-is):`);
  failed.forEach(f => console.log(`  - ${f}`));
}
