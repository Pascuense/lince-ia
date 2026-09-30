#!/usr/bin/env node
// Downloads every files.manuscdn.com asset referenced by the app into
// client/public/assets/ and rewrites the references to local paths.
// Needs network access to the CDN; run it once and commit the result.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "client", "public", "assets");
const SCAN_DIRS = ["client/src", "shared", "client/public"];
const SCAN_FILES = ["client/index.html"];
const EXT = /\.(tsx?|jsx?|css|html|json|webmanifest)$/;
const URL_RE = /https:\/\/files\.manuscdn\.com\/[^\s"'`)<>]+/g;

function walk(dir, acc) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (EXT.test(entry.name)) acc.push(p);
  }
  return acc;
}

const files = SCAN_DIRS.flatMap(d => walk(path.join(ROOT, d), [])).concat(
  SCAN_FILES.map(f => path.join(ROOT, f))
);

const urls = new Set();
for (const f of files) {
  for (const m of fs.readFileSync(f, "utf8").matchAll(URL_RE)) urls.add(m[0]);
}
console.log(`Found ${urls.size} unique CDN URLs in ${files.length} files`);
if (urls.size === 0) process.exit(0);

fs.mkdirSync(OUT_DIR, { recursive: true });
const mapping = new Map();
const failed = [];

for (const url of urls) {
  const name = path.basename(new URL(url).pathname);
  const dest = path.join(OUT_DIR, name);
  if (!fs.existsSync(dest)) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
      console.log(`  ok   ${name}`);
    } catch (err) {
      failed.push(`${url} (${err.message})`);
      console.log(`  FAIL ${name}: ${err.message}`);
      continue;
    }
  }
  mapping.set(url, `/assets/${name}`);
}

let rewritten = 0;
for (const f of files) {
  const before = fs.readFileSync(f, "utf8");
  let after = before;
  for (const [url, local] of mapping) after = after.split(url).join(local);
  if (after !== before) {
    fs.writeFileSync(f, after);
    rewritten++;
  }
}

console.log(`\nDownloaded ${mapping.size}/${urls.size}, rewrote ${rewritten} files`);
if (failed.length) {
  console.log(`\n${failed.length} downloads failed; their references were left untouched:`);
  failed.forEach(f => console.log(`  - ${f}`));
  process.exit(1);
}
