import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";

// Paths that only hold real files; a miss must be a 404, never the SPA shell,
// or the service worker caches index.html under a .js/.png URL after a deploy.
const FILE_ONLY_PREFIXES = ["/api", "/assets", "/avatars", "/icons"];

const IMAGE_DIRS = /^\/(assets|avatars)\//;
// Vite output carries a content hash ("index-DmkYCHGF.js"), so it can be cached forever
const HASHED_BUNDLE = /-[A-Za-z0-9_-]{8}\.(js|css|woff2?)$/;
const IMAGE = /\.(png|jpe?g|webp|gif|svg|ico)$/i;

/** Serve a pre-generated .webp sibling when the browser accepts it */
function preferWebp(distPath: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (
      (req.method === "GET" || req.method === "HEAD") &&
      IMAGE_DIRS.test(req.path) &&
      /\.(png|jpe?g)$/i.test(req.path)
    ) {
      res.vary("Accept");
      if (req.headers.accept?.includes("image/webp")) {
        const webpPath = req.path.replace(/\.(png|jpe?g)$/i, ".webp");
        const file = path.join(distPath, decodeURIComponent(webpPath));
        if (file.startsWith(distPath + path.sep) && fs.existsSync(file)) {
          req.url = webpPath + req.url.slice(req.path.length);
        }
      }
    }
    next();
  };
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(preferWebp(distPath));

  app.use(
    express.static(distPath, {
      dotfiles: "allow",
      setHeaders(res, filePath) {
        if (filePath.endsWith(".html") || filePath.endsWith("sw.js")) {
          res.setHeader("Cache-Control", "no-cache");
        } else if (HASHED_BUNDLE.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else if (IMAGE.test(filePath)) {
          res.setHeader("Cache-Control", "public, max-age=604800");
        }
      },
    })
  );

  app.use(FILE_ONLY_PREFIXES, (_req, res) => {
    res.sendStatus(404);
  });

  // fall through to index.html for client-side routes
  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
