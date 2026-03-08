import fs from "fs";
import path from "path";
import https from "https";
import http from "http";

import { AVATAR_FRONTAL, AVATAR_BG, AVATAR_EDU, AVATAR_EXPRESSIONS, MUNDO_IMAGES, RAIDS_IMAGES } from "../client/src/lib/avatarConstants";

// collect all URLs from objects
const collectUrls = (...objs: any[]) => {
  const urls: Set<string> = new Set();
  const walk = (obj: any) => {
    if (!obj) return;
    if (typeof obj === "string") {
      if (obj.startsWith("http")) urls.add(obj);
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach(walk);
      return;
    }
    if (typeof obj === "object") {
      Object.values(obj).forEach(walk);
    }
  };
  objs.forEach(walk);
  return Array.from(urls);
};

const urls = collectUrls(AVATAR_FRONTAL, AVATAR_EDU, AVATAR_BG, AVATAR_EXPRESSIONS, MUNDO_IMAGES, RAIDS_IMAGES);

// compute __dirname in ESM
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, "..", "client", "public", "avatars");
fs.mkdirSync(outDir, { recursive: true });

async function download(url: string, dest: string): Promise<void> {
  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await new Promise<void>((resolve, reject) => {
        const client = url.startsWith("https") ? https : http;
        const parsed = new URL(url);
        const options: any = {
          hostname: parsed.hostname,
          path: parsed.pathname + (parsed.search || ""),
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': 'https://localhost/',
            'Accept': '*/*'
          }
        };

        const req = client.request(options, (res) => {
          // follow redirects
          if (res.statusCode && (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308)) {
            const loc = res.headers.location;
            if (loc) {
              // try redirected URL
              res.resume();
              download(loc, dest).then(resolve).catch(reject);
              return;
            }
          }

          if (res.statusCode && res.statusCode >= 400) {
            reject(new Error(`HTTP ${res.statusCode}`));
            return;
          }

          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
          file.on('error', (err) => reject(err));
        });

        req.on('error', reject);
        req.end();
      });

      // success
      return;
    } catch (err: any) {
      // If 403, wait and retry with a slightly different referer
      console.warn(`attempt ${attempt} failed for ${url}: ${err.message}`);
      if (attempt === maxRetries) throw err;
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
}

(async () => {
  console.log(`Downloading ${urls.length} avatar images to ${outDir}`);
  for (const u of urls) {
    try {
      const filename = path.basename(new URL(u).pathname);
      const dest = path.join(outDir, filename);
      if (fs.existsSync(dest)) {
        console.log("skip", filename);
        continue;
      }
      console.log("fetch", u);
      await download(u, dest);
    } catch (e) {
      console.error("failed", u, e);
    }
  }
  console.log("done");
})();