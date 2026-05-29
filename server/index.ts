import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { hasDb } from "./db.js";
import { registerRoutes } from "./routes.js";
import { analyticsMiddleware } from "./middleware/analytics.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProd = process.env.NODE_ENV === "production";
const PORT = parseInt(process.env.PORT ?? "5000", 10);

const app = express();

// Railway sits behind a proxy
app.set("trust proxy", 1);

// Webhook routes need raw body for Stripe signature verification
app.use((req, res, next) => {
  if (req.path.startsWith("/api/webhooks")) return next();
  express.json()(req, res, next);
});
app.use((req, res, next) => {
  if (req.path.startsWith("/api/webhooks")) return next();
  express.urlencoded({ extended: false })(req, res, next);
});
app.use(cookieParser());

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Session store — PgSession when DB available, MemoryStore otherwise
let sessionStore: session.Store | undefined;
if (hasDb()) {
  const ConnectPgSimple = (await import("connect-pg-simple")).default;
  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const { default: ws } = await import("ws");
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
  sessionStore = new (ConnectPgSimple(session))({
    pool,
    tableName: "session",
    createTableIfMissing: false,
  });
}

app.use(
  session({
    secret: process.env.SESSION_SECRET ?? "dev-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      secure: isProd,
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: isProd ? "strict" : "lax",
    },
  })
);

app.use(analyticsMiddleware);

// Health check — must respond before routes so Railway deploy succeeds
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", storage: hasDb() ? "db" : "mem" });
});

await registerRoutes(app);

if (isProd) {
  const staticDir = path.resolve(__dirname, "public");
  app.use(express.static(staticDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticDir, "index.html"));
  });
} else {
  const { setupVite } = await import("./vite.js");
  await setupVite(app);
}

// Global error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ message: err.message ?? "Internal server error" });
});

const HOST = process.env.HOST ?? "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(
    `Server running on http://${HOST}:${PORT} [${isProd ? "production" : "development"}] storage=${hasDb() ? "db" : "mem"}`
  );
});
