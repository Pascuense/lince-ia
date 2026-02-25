/**
 * LINCE — Server Entry Point (Azure Edition)
 * Sin dependencias de Manus. Express + tRPC + Vite.
 */
import express from "express";
import { createServer } from "http";
import net from "net";
import helmet from "helmet";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerAuthRoutes } from "./auth";
import { appRouter } from "./routers";
import { createContext } from "./trpc";
import { ensureContainer } from "./storage";
import { ENV } from "./env";
import fs from "fs";
import path from "path";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) return port;
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── Security: Helmet.js ───
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "https://fonts.googleapis.com",
          ],
          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            "https://fonts.googleapis.com",
          ],
          imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://files.manuscdn.com",
            "https://*.blob.core.windows.net",
          ],
          fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
          connectSrc: [
            "'self'",
            "https://*.openai.azure.com",
            "https://*.blob.core.windows.net",
          ],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginResourcePolicy: { policy: "cross-origin" },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    })
  );

  // Body parser
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // ─── Auth Routes (JWT/bcrypt) ───
  registerAuthRoutes(app);

  // ─── tRPC API ───
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  // ─── Static Files / Vite Dev ───
  if (process.env.NODE_ENV === "development") {
    // Dynamic import to avoid loading Vite in production
    const { setupVite } = await import("./vite");
    await setupVite(app, server);
  } else {
    // Serve built static files
    const distPath = path.resolve(import.meta.dirname, "public");
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.use("*", (_req, res) => {
        res.sendFile(path.resolve(distPath, "index.html"));
      });
    } else {
      console.error(
        `Build directory not found: ${distPath}. Run 'pnpm build' first.`
      );
    }
  }

  // ─── Ensure Azure Blob container exists ───
  await ensureContainer().catch(e =>
    console.warn("[Storage] Container init:", e.message)
  );

  // ─── Start Push Scheduler ───
  try {
    const { startPushScheduler } = await import("./pushScheduler");
    startPushScheduler();
  } catch (e) {
    console.warn("[PushScheduler] Could not start:", e);
  }

  // ─── Listen ───
  const preferredPort = ENV.port;
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`LINCE server running on http://localhost:${port}/`);
    console.log(
      `Environment: ${ENV.isProduction ? "production" : "development"}`
    );
  });
}

startServer().catch(console.error);
