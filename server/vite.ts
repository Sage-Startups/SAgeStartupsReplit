import type { Express } from "express";
import { createServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupVite(app: Express) {
  const vite = await createServer({
    root: path.resolve(__dirname, "../client"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}
