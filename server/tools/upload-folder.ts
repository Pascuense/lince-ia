import fs from "fs";
import path from "path";
import { storagePut } from "../storage";

// Recursively gather files under a directory
async function gatherFiles(dir: string): Promise<string[]> {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await gatherFiles(full)));
    } else if (entry.isFile()) {
      files.push(full);
    }
  }

  return files;
}

function mimeTypeFromExt(ext: string): string | null {
  ext = ext.toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    default:
      return null;
  }
}

async function main() {
  const folder = process.argv[2];
  if (!folder) {
    console.error("Usage: tsx server/tools/upload-folder.ts <path-to-folder>");
    process.exit(1);
  }

  const absFolder = path.resolve(folder);
  if (!fs.existsSync(absFolder)) {
    console.error("Folder not found:", absFolder);
    process.exit(1);
  }

  console.log("Scanning", absFolder);
  const allFiles = await gatherFiles(absFolder);
  console.log(`Found ${allFiles.length} files`);

  const results: Array<{ local: string; key: string; url: string }> = [];

  for (const file of allFiles) {
    const ext = path.extname(file);
    const mime = mimeTypeFromExt(ext);
    if (!mime) continue; // skip non-image

    const data = await fs.promises.readFile(file);
    const key = `bulk/${Date.now()}-${path.basename(file)}`;
    try {
      const { url } = await storagePut(key, data, mime);
      console.log(file, "->", url);
      results.push({ local: file, key, url });
    } catch (e: any) {
      console.error("Error uploading", file, e.message || e);
    }
  }

  const outPath = path.join(process.cwd(), "upload-results.json");
  await fs.promises.writeFile(outPath, JSON.stringify(results, null, 2));
  console.log("Finished. Results written to", outPath);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});