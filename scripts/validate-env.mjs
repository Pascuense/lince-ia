#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const fileArgIndex = args.findIndex(arg => arg === "--file");
const envFile =
  fileArgIndex >= 0 && args[fileArgIndex + 1] ? args[fileArgIndex + 1] : ".env";

const envPath = path.resolve(process.cwd(), envFile);

const parseDotEnv = content => {
  const entries = {};
  const lines = content.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const equalIndex = line.indexOf("=");
    if (equalIndex <= 0) continue;

    const key = line.slice(0, equalIndex).trim();
    let value = line.slice(equalIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
};

if (fs.existsSync(envPath)) {
  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const [key, value] of Object.entries(parsed)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  console.log(`ℹ️ Cargando variables desde ${envFile}`);
} else {
  console.log(
    `ℹ️ No se encontró ${envFile}; se validará únicamente process.env actual.`
  );
}

const requiredVars = [
  "DATABASE_URL",
  "JWT_SECRET",
  "AZURE_OPENAI_ENDPOINT",
  "AZURE_OPENAI_KEY",
  "AZURE_OPENAI_DEPLOYMENT",
  "AZURE_STORAGE_CONNECTION_STRING",
  "AZURE_STORAGE_CONTAINER",
  "VAPID_PUBLIC_KEY",
  "VAPID_PRIVATE_KEY",
  "VAPID_CONTACT_EMAIL",
  "NODE_ENV",
  "PORT",
];

const recommendedVars = ["VITE_APP_TITLE", "VITE_VAPID_PUBLIC_KEY"];

const missingRequired = [];
const missingRecommended = [];
const suspicious = [];

const hasPlaceholder = value =>
  value.includes("TU_") ||
  value.includes("REEMPLAZAR_") ||
  value.includes("YOUR_") ||
  value.includes("CHANGEME") ||
  value.includes("PLACEHOLDER");

for (const key of requiredVars) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    missingRequired.push(key);
    continue;
  }

  if (hasPlaceholder(value)) {
    suspicious.push(`${key} (placeholder detectado)`);
  }
}

for (const key of recommendedVars) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    missingRecommended.push(key);
    continue;
  }

  if (hasPlaceholder(value)) {
    suspicious.push(`${key} (placeholder detectado)`);
  }
}

if (process.env.DATABASE_URL) {
  if (!process.env.DATABASE_URL.startsWith("mysql://")) {
    suspicious.push("DATABASE_URL (debe iniciar con mysql://)");
  } else {
    try {
      new URL(process.env.DATABASE_URL);
    } catch {
      suspicious.push("DATABASE_URL (URI inválida)");
    }
  }
}

if (
  process.env.AZURE_OPENAI_ENDPOINT &&
  !process.env.AZURE_OPENAI_ENDPOINT.includes(".openai.azure.com")
) {
  suspicious.push("AZURE_OPENAI_ENDPOINT (no parece endpoint de Azure OpenAI)");
}

if (
  process.env.NODE_ENV &&
  !["production", "development", "test"].includes(process.env.NODE_ENV)
) {
  suspicious.push("NODE_ENV (valor esperado: production/development/test)");
}

if (process.env.PORT && Number.isNaN(Number(process.env.PORT))) {
  suspicious.push("PORT (debe ser numérico)");
}

if (missingRequired.length > 0 || suspicious.length > 0) {
  console.error("\n❌ Validación de variables de entorno fallida.\n");

  if (missingRequired.length > 0) {
    console.error("Variables obligatorias faltantes:");
    for (const item of missingRequired) console.error(` - ${item}`);
    console.error("");
  }

  if (suspicious.length > 0) {
    console.error("Variables con formato sospechoso:");
    for (const item of suspicious) console.error(` - ${item}`);
    console.error("");
  }

  if (missingRecommended.length > 0) {
    console.error("Variables recomendadas faltantes (no bloqueantes):");
    for (const item of missingRecommended) console.error(` - ${item}`);
    console.error("");
  }

  console.error(
    "Sugerencia: revisa Azure App Service > Variables de entorno y reinicia la app después de guardar."
  );

  process.exit(1);
}

console.log("\n✅ Variables obligatorias válidas para despliegue.");

if (missingRecommended.length > 0) {
  console.log("\n⚠️ Variables recomendadas faltantes (no bloqueantes):");
  for (const item of missingRecommended) console.log(` - ${item}`);
}
