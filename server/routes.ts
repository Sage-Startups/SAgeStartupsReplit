import type { Express, Request, Response } from "express";
import { z } from "zod";
import { authRouter } from "./authRoutes.js";
import { storage } from "./storage.js";
import { requireAuth, getSessionUser, setSessionUser, safeUser } from "./auth.js";
import { insertWaitlistSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express) {
  // Auth routes
  app.use("/api/auth", authRouter);

  // Waitlist
  app.post("/api/waitlist", async (req: Request, res: Response) => {
    const parsed = insertWaitlistSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
      return;
    }
    try {
      const entry = await storage.addToWaitlist(parsed.data);
      res.status(201).json({ id: entry.id });
    } catch (err: any) {
      if (err?.message?.includes("unique")) {
        res.status(409).json({ message: "Already on the waitlist" });
      } else {
        throw err;
      }
    }
  });

  // Analytics event
  app.post("/api/analytics/event", async (req: Request, res: Response) => {
    const schema = z.object({
      sessionId: z.string(),
      eventType: z.string(),
      pagePath: z.string().optional(),
      deviceType: z.string().optional(),
      country: z.string().optional(),
      metadata: z.record(z.unknown()).optional(),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: "Invalid input" }); return; }

    const user = getSessionUser(req);
    await storage.trackEvent({
      ...parsed.data,
      userId: user?.id ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: (parsed.data.metadata ?? null) as any,
      pagePath: parsed.data.pagePath ?? null,
      deviceType: parsed.data.deviceType ?? null,
      country: parsed.data.country ?? null,
    });
    res.status(204).end();
  });

  // Bot sessions
  app.get("/api/bots/sessions", requireAuth, async (req: Request, res: Response) => {
    const user = getSessionUser(req)!;
    const sessions = await storage.getBotSessions(user.id);
    res.json(sessions);
  });

  app.post("/api/bots/sessions", requireAuth, async (req: Request, res: Response) => {
    const schema = z.object({ botId: z.string(), title: z.string() });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ message: "Invalid input" }); return; }
    const user = getSessionUser(req)!;
    const session = await storage.createBotSession({ ...parsed.data, userId: user.id });
    res.status(201).json(session);
  });

  app.get("/api/bots/sessions/:id/messages", requireAuth, async (req: Request, res: Response) => {
    const messages = await storage.getBotMessages(String(req.params.id));
    res.json(messages);
  });

  // Replit OIDC — set up only when env vars are present
  if (process.env.REPL_ID && process.env.REPLIT_DOMAINS) {
    await setupReplitAuth(app);
  }
}

async function setupReplitAuth(app: Express) {
  try {
    const { Issuer } = await import("openid-client");
    const passport = (await import("passport")).default;

    const issuerUrl = process.env.ISSUER_URL ?? "https://replit.com/oidc";
    const domains = (process.env.REPLIT_DOMAINS ?? "").split(",").map((d) => d.trim());
    const redirectUris = domains.map((d) => `https://${d}/api/auth/callback`);

    const issuer = await Issuer.discover(issuerUrl);
    const client = new issuer.Client({
      client_id: process.env.REPL_ID!,
      response_types: ["code"],
      redirect_uris: redirectUris,
    });

    const { Strategy } = await import("openid-client");

    passport.use(
      "oidc",
      new Strategy({ client }, async (tokenSet: any, userinfo: any, done: any) => {
        try {
          const email = userinfo.email ?? `${userinfo.sub}@replit.user`;
          let user = await storage.getUserByEmail(email);
          if (!user) {
            user = await storage.createUser({
              email,
              firstName: userinfo.first_name ?? userinfo.name?.split(" ")[0] ?? null,
              lastName: userinfo.last_name ?? null,
              profileImageUrl: userinfo.profile_image_url ?? null,
            });
          }
          done(null, user);
        } catch (err) {
          done(err);
        }
      })
    );

    passport.serializeUser((user: any, done) => done(null, user.id));
    passport.deserializeUser(async (id: string, done) => {
      try {
        done(null, await storage.getUser(id));
      } catch (err) {
        done(err);
      }
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/api/auth/replit", passport.authenticate("oidc"));

    app.get(
      "/api/auth/callback",
      passport.authenticate("oidc", { failureRedirect: "/login" }),
      (req: Request, res: Response) => {
        const user = req.user as any;
        if (user) setSessionUser(req, user);
        res.redirect("/");
      }
    );

    console.log("Replit OIDC auth enabled");
  } catch (err) {
    console.warn("Replit OIDC setup failed (continuing without it):", (err as Error).message);
  }
}
