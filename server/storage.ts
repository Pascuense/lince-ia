import {
  BlobSASPermissions,
  BlobServiceClient,
  type ContainerClient,
} from "@azure/storage-blob";
import { ENV } from "./env";

// Uploaded images are embedded long-term (avatars, gallery), so links stay valid for 10 years.
const SAS_TTL_MS = 10 * 365 * 24 * 60 * 60 * 1000;

let container: ContainerClient | null = null;

async function getContainer(): Promise<ContainerClient> {
  if (container) return container;
  if (!ENV.azureStorageConnectionString) {
    throw new Error(
      "Azure Storage no está configurado: define AZURE_STORAGE_CONNECTION_STRING"
    );
  }
  const service = BlobServiceClient.fromConnectionString(
    ENV.azureStorageConnectionString
  );
  const client = service.getContainerClient(ENV.azureStorageContainer);
  await client.createIfNotExists();
  container = client;
  return client;
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

async function readUrl(key: string): Promise<string> {
  const blob = (await getContainer()).getBlockBlobClient(key);
  return blob.generateSasUrl({
    permissions: BlobSASPermissions.parse("r"),
    expiresOn: new Date(Date.now() + SAS_TTL_MS),
  });
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const body = typeof data === "string" ? Buffer.from(data) : Buffer.from(data);
  const blob = (await getContainer()).getBlockBlobClient(key);
  await blob.uploadData(body, {
    blobHTTPHeaders: {
      blobContentType: contentType,
      blobCacheControl: "public, max-age=31536000, immutable",
    },
  });
  return { key, url: await readUrl(key) };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: await readUrl(key) };
}
