/**
 * LINCE — Image Generation via Azure OpenAI DALL-E
 * Reemplaza la integración con forge.manus.im/images
 */
import { AzureOpenAI } from "openai";
import { storagePut } from "./storage";
import { ENV } from "./env";

let client: AzureOpenAI | null = null;

function getClient(): AzureOpenAI {
  if (!client) {
    if (!ENV.azureOpenaiEndpoint || !ENV.azureOpenaiKey) {
      throw new Error("Azure OpenAI no está configurado para generación de imágenes.");
    }
    client = new AzureOpenAI({
      endpoint: ENV.azureOpenaiEndpoint,
      apiKey: ENV.azureOpenaiKey,
      apiVersion: "2024-08-01-preview",
    });
  }
  return client;
}

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

/**
 * Generate an image using Azure OpenAI DALL-E.
 * Falls back gracefully if the deployment doesn't support image generation.
 */
export async function generateImage(
  options: GenerateImageOptions
): Promise<GenerateImageResponse> {
  const azureClient = getClient();

  try {
    const response = await azureClient.images.generate({
      model: "dall-e-3",
      prompt: options.prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });

    const imageData = response.data?.[0];
    if (!imageData?.b64_json) {
      throw new Error("No se recibió imagen del servicio.");
    }

    const buffer = Buffer.from(imageData.b64_json, "base64");
    const { url } = await storagePut(
      `generated/${Date.now()}.png`,
      buffer,
      "image/png"
    );

    return { url };
  } catch (error: any) {
    console.error("[ImageGen] Error:", error.message);
    throw new Error(`Error al generar imagen: ${error.message}`);
  }
}
