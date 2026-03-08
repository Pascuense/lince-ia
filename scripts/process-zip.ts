import fs from "fs";
import path from "path";
import unzipper from "unzipper";

async function extract(zipPath: string, dest: string) {
  console.log(`Extracting ${zipPath} -> ${dest}`);
  await fs.promises.mkdir(dest, { recursive: true });
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: dest }))
      .on("close", () => resolve())
      .on("error", reject);
  });
}

async function main() {
  const arg = process.argv[2] || "avatars.zip";
  const zipPath = path.resolve(arg);
  if (!fs.existsSync(zipPath)) {
    console.error("ZIP file not found:", zipPath);
    console.error(
      "Place the file in the workspace and pass its path as the first argument."
    );
    process.exit(1);
  }

  const outDir = path.resolve("client", "public", "avatars");
  await extract(zipPath, outDir);

  // flatten directory structure: move all files from subfolders to root
  console.log("Flattening avatar directory structure...");
  const walk = async (dir: string) => {
    for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        // remove empty directory after walking
        await fs.promises.rmdir(full, { recursive: true }).catch(() => {});
      } else if (entry.isFile()) {
        const dest = path.join(outDir, entry.name);
        if (full !== dest) {
          await fs.promises.rename(full, dest).catch(() => {});
        }
      }
    }
  };
  await walk(outDir);

  console.log("Extraction complete and avatars flattened.");
  console.log(
    "You can now rebuild the frontend (npm run build) and/or run npm run upload:folder to upload the extracted files to Azure."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
