/**
 * LINCE — File Storage via Azure Blob Storage
 * Reemplaza completamente la integración con AWS S3 de Manus.
 */
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters,
  BlobSASPermissions,
  SASProtocol,
} from "@azure/storage-blob";
import { ENV } from "./env";

let blobServiceClient: BlobServiceClient | null = null;

function getClient(): BlobServiceClient {
  if (!blobServiceClient) {
    if (!ENV.azureStorageConnectionString) {
      throw new Error("Azure Blob Storage no está configurado. Verifica AZURE_STORAGE_CONNECTION_STRING.");
    }
    blobServiceClient = BlobServiceClient.fromConnectionString(ENV.azureStorageConnectionString);
  }
  return blobServiceClient;
}

function getContainerClient() {
  return getClient().getContainerClient(ENV.azureStorageContainer);
}

/**
 * Ensure the storage container exists (call once at startup).
 */
export async function ensureContainer(): Promise<void> {
  try {
    const containerClient = getContainerClient();
    await containerClient.createIfNotExists({ access: "blob" });
  } catch (error) {
    console.warn("[Storage] Could not ensure container:", error);
  }
}

// ─── Upload Validation ───
const ALLOWED_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Upload a file to Azure Blob Storage.
 * @param key - The blob name/path (e.g., "avatars/image.png")
 * @param data - File content as Buffer, Uint8Array, or string
 * @param contentType - MIME type (e.g., "image/png")
 * @returns Object with key and public URL
 */
export async function storagePut(
  key: string,
  data: Buffer | Uint8Array | string,
  contentType?: string
): Promise<{ key: string; url: string }> {
  const buffer = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);

  // Validate file size
  if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(`El archivo supera el tamaño máximo permitido de ${MAX_FILE_SIZE_BYTES / 1024 / 1024} MB.`);
  }

  // Validate MIME type
  const resolvedType = contentType || "application/octet-stream";
  if (!ALLOWED_MIME_TYPES.has(resolvedType)) {
    throw new Error(`Tipo de archivo no permitido: ${resolvedType}. Solo se aceptan imágenes.`);
  }

  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(key);

  await blockBlobClient.uploadData(buffer, {
    blobHTTPHeaders: {
      blobContentType: resolvedType,
    },
  });

  return {
    key,
    url: blockBlobClient.url,
  };
}

/**
 * Get a URL for a blob. Since the container has public blob access,
 * we can return the direct URL.
 * @param key - The blob name/path
 * @returns Object with key and URL
 */
export async function storageGet(
  key: string
): Promise<{ key: string; url: string }> {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(key);

  return {
    key,
    url: blockBlobClient.url,
  };
}

/**
 * Delete a blob from storage.
 * @param key - The blob name/path
 */
export async function storageDelete(key: string): Promise<void> {
  const containerClient = getContainerClient();
  const blockBlobClient = containerClient.getBlockBlobClient(key);
  await blockBlobClient.deleteIfExists();
}
