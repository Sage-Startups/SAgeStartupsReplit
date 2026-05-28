import type { Express, Request, Response } from "express";
import express from "express";
import { z } from "zod";
import { authRouter } from "./authRoutes.js";
import { botsRouter, botSessionsRouter } from "./routes/bots.js";
import { waitlistRouter } from "./routes/waitlist.js";
import { stripeRouter } from "./routes/stripe.js";
import { webhooksRouter } from "./routes/webhooks.js";
import { storage } from "./storage.js";
import { getSessionUser, setSessionUser } from "./auth.js";

export async function registerRoutes(app: Express) {
  // Stripe webhooks must receive raw body — register before express.json()
  app.use("/api/webhooks", express.raw({ type: "application/json" }), webhooksRouter);

  // Auth routes
  app.use("/api/auth", authRouter);

  // Bot routes
  app.use("/api/bots", botsRouter);
  app.use("/api/bot-sessions", botSessionsRouter);

  // Waitlist
  app.use("/api/waitlist", waitlistRouter);

  // Stripe
  app.use("/api/stripe", stripeRouter);

  // Analytics event (client-side tracking)
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
      metadata: (parsed.data.metadata ?? null) as any,
      pagePath: parsed.data.pagePath ?? null,
      deviceType: parsed.data.deviceType ?? null,
      country: parsed.data.country ?? null,
    });
    res.status(204).end();
  });

  // Replit OIDC — only when env vars are present
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
