/**
 * Watermark utility for LINCE IA
 * Adds a branded watermark (logo + text) to generated images
 */
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// A "/assets/..." path is read from the static public folder; an absolute URL is fetched.
const LINCE_LOGO =
  "https://files.manuscdn.com/user_upload_by_module/session_file/310419663032363896/hbjWdClTNpqzvCwu.png";

let cachedLogoBuffer: Buffer | null = null;

async function getLogoBuffer(): Promise<Buffer | null> {
  if (cachedLogoBuffer) return cachedLogoBuffer;
  try {
    if (LINCE_LOGO.startsWith("/")) {
      const rel = LINCE_LOGO.slice(1);
      const candidates = [
        path.resolve(import.meta.dirname, "public", rel),
        path.resolve(import.meta.dirname, "..", "client", "public", rel),
      ];
      for (const file of candidates) {
        try {
          cachedLogoBuffer = await fs.readFile(file);
          return cachedLogoBuffer;
        } catch {}
      }
      return null;
    }
    const res = await fetch(LINCE_LOGO);
    if (!res.ok) return null;
    cachedLogoBuffer = Buffer.from(await res.arrayBuffer());
    return cachedLogoBuffer;
  } catch {
    return null;
  }
}

/**
 * Creates an SVG text overlay for the watermark
 */
function createTextSvg(width: number, fontSize: number): Buffer {
  const svg = `
    <svg width="${width}" height="${fontSize + 10}" xmlns="http://www.w3.org/2000/svg">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700');
        .brand { 
          font-family: 'Space Grotesk', Arial, sans-serif; 
          font-weight: 700; 
          font-size: ${fontSize}px;
          filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.8));
        }
      </style>
      <text x="0" y="${fontSize}" class="brand">
        <tspan fill="#FFFFFF">LINCE</tspan>
        <tspan fill="#00E5FF" dx="4">IA</tspan>
      </text>
    </svg>`;
  return Buffer.from(svg);
}

/**
 * Adds LINCE IA watermark to an image buffer
 * Places logo + "LINCE IA" text in the bottom-right corner
 * with a semi-transparent dark background strip
 */
export async function addWatermark(imageBuffer: Buffer): Promise<Buffer> {
  const image = sharp(imageBuffer);
  const metadata = await image.metadata();
  const imgWidth = metadata.width || 1024;
  const imgHeight = metadata.height || 1024;

  // Scale watermark elements based on image size
  const logoSize = Math.max(32, Math.round(imgWidth * 0.05));
  const fontSize = Math.max(14, Math.round(imgWidth * 0.025));
  const padding = Math.max(8, Math.round(imgWidth * 0.012));
  const stripHeight = logoSize + padding * 2;

  // Prepare the logo (circular, resized); the watermark degrades to text-only if it is unavailable
  const logoBuffer = await getLogoBuffer();
  const resizedLogo = logoBuffer
    ? await sharp(logoBuffer)
        .resize(logoSize, logoSize, { fit: "cover" })
        .composite([
          {
            input: Buffer.from(
              `<svg width="${logoSize}" height="${logoSize}">
                <circle cx="${logoSize / 2}" cy="${logoSize / 2}" r="${logoSize / 2}" fill="white"/>
              </svg>`
            ),
            blend: "dest-in",
          },
        ])
        .png()
        .toBuffer()
    : null;

  // Create the text SVG
  const textSvg = createTextSvg(imgWidth, fontSize);

  // Create semi-transparent dark strip for the bottom
  const stripSvg = Buffer.from(
    `<svg width="${imgWidth}" height="${stripHeight}">
      <rect width="${imgWidth}" height="${stripHeight}" fill="rgba(0,0,0,0.55)" rx="0"/>
    </svg>`
  );

  // Composite everything onto the image
  const result = await sharp(imageBuffer)
    .composite([
      // Dark strip at bottom
      {
        input: stripSvg,
        top: imgHeight - stripHeight,
        left: 0,
      },
      // Logo in bottom-right
      ...(resizedLogo
        ? [
            {
              input: resizedLogo,
              top: imgHeight - stripHeight + padding,
              left: imgWidth - logoSize - padding - Math.round(fontSize * 4.5) - padding,
            },
          ]
        : []),
      // "LINCE IA" text
      {
        input: textSvg,
        top: imgHeight - stripHeight + padding + Math.round((logoSize - fontSize) / 2),
        left: imgWidth - Math.round(fontSize * 4.5) - padding,
      },
    ])
    .png()
    .toBuffer();

  return result;
}
