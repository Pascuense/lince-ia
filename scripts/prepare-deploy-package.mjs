#!/usr/bin/env node
// Prepares dist/package.json for Azure deployment:
// - Adds start script pointing to the bundled index.js
import fs from "node:fs";

const pkgPath = process.argv[2] || "dist/package.json";
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.scripts = { ...(pkg.scripts || {}), start: "node index.js" };
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log(`Updated ${pkgPath}`);
