import { toFile } from "openai";
import { ENV } from "./env";
import { getAzureOpenAI } from "./llm";
import { storagePut } from "./storage";
import { addWatermark } from "./watermark";

export type GenerateImageOptions = {
  prompt: string;
  originalImages?: Array<{
    url?: string;
    b64Json?: string;
    mimeType?: string;
  }>;
};

export type GenerateImageResponse = {
  url?: string;
};

async function loadImage(
  img: NonNullable<GenerateImageOptions["originalImages"]>[number],
  index: number
) {
  const mimeType = img.mimeType || "image/png";
  let buffer: Buffer;
  if (img.b64Json) {
    buffer = Buffer.from(img.b64Json, "base64");
  } else if (img.url) {
    const res = await fetch(img.url);
    if (!res.ok) throw new Error(`No se pudo descargar la imagen original (${res.status})`);
    buffer = Buffer.from(await res.arrayBuffer());
  } else {
    throw new Error("Imagen original sin url ni datos");
  }
  const ext = mimeType.split("/")[1] || "png";
  return toFile(buffer, `original-${index}.${ext}`, { type: mimeType });
}

// gpt-image models always return base64; with originalImages the call becomes an edit.
export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  const ai = getAzureOpenAI();
  const model = ENV.azureOpenaiImageDeployment;
  const sources = options.originalImages?.filter(i => i.url || i.b64Json) ?? [];

  try {
    const response = sources.length
      ? await ai.images.edit({
          model,
          prompt: options.prompt,
          image: await Promise.all(sources.map(loadImage)),
          size: "1024x1024",
        })
      : await ai.images.generate({
          model,
          prompt: options.prompt,
          n: 1,
          size: "1024x1024",
        });

    const b64 = response.data?.[0]?.b64_json;
    if (!b64) throw new Error("No se recibió imagen del servicio.");

    const raw = Buffer.from(b64, "base64");
    let buffer: Buffer = raw;
    try {
      buffer = await addWatermark(raw);
    } catch (err) {
      console.error("[Watermark] No se pudo aplicar, se usa la original:", err);
    }

    const { url } = await storagePut(
      `generated/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`,
      buffer,
      "image/png"
    );
    return { url };
  } catch (error: any) {
    console.error("[ImageGen] Error:", error.message);
    throw new Error(`Error al generar imagen: ${error.message}`);
  }
}
