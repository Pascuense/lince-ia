/**
 * LINCE — Environment Variables (Azure Edition)
 * Todas las dependencias de Manus han sido eliminadas.
 */
export const ENV = {
  // Database
  databaseUrl: process.env.DATABASE_URL ?? "",

  // JWT Auth
  jwtSecret: process.env.JWT_SECRET ?? "",

  // Azure OpenAI
  azureOpenaiEndpoint: process.env.AZURE_OPENAI_ENDPOINT ?? "",
  azureOpenaiKey: process.env.AZURE_OPENAI_KEY ?? "",
  azureOpenaiDeployment: process.env.AZURE_OPENAI_DEPLOYMENT ?? "gpt-4o",

  // Azure Blob Storage
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING ?? "",
  azureStorageContainer: process.env.AZURE_STORAGE_CONTAINER ?? "lince-uploads",

  // VAPID Push Notifications
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY ?? "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY ?? "",
  vapidContactEmail: process.env.VAPID_CONTACT_EMAIL ?? "cristobal@acnb.es",

  // Server
  isProduction: process.env.NODE_ENV === "production",
  port: parseInt(process.env.PORT || "8080"),
};
