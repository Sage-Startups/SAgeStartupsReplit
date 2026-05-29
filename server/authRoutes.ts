import { Router } from "express";
import { z } from "zod";
import { storage } from "./storage.js";
import {
  hashPassword,
  verifyPassword,
  setSessionUser,
  clearSession,
  getSessionUser,
  safeUser,
} from "./auth.js";

export const authRouter = Router();

// Early bird cutoff — must match client/src/components/early-bird-banner.tsx
const EARLY_BIRD_CUTOFF = new Date("2026-09-01T00:00:00Z");

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }

  const { email, password, firstName, lastName } = parsed.data;

  const existing = await storage.getUserByEmail(email);
  if (existing) {
    res.status(409).json({ message: "Email already registered" });
    return;
  }

  const passwordHash = await hashPassword(password);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 7);

  const isEarlyBird = new Date() < EARLY_BIRD_CUTOFF;

  const user = await storage.createUser({
    email,
    passwordHash,
    firstName: firstName ?? null,
    lastName: lastName ?? null,
    subscriptionTier: "free",
    subscriptionStatus: "trialing",
    trialEndsAt,
    isEarlyBird,
  });

  setSessionUser(req, user);
  res.status(201).json(safeUser(user));
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input" });
    return;
  }

  const { email, password } = parsed.data;
  const user = await storage.getUserByEmail(email);

  if (!user || !user.passwordHash || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  setSessionUser(req, user);
  res.json(safeUser(user));
});

authRouter.post("/logout", async (req, res) => {
  await clearSession(req);
  res.json({ message: "Logged out" });
});

authRouter.get("/user", (req, res) => {
  const user = getSessionUser(req);
  if (!user) { res.status(401).json({ message: "Unauthorized" }); return; }
  res.json(safeUser(user));
});

// Alias used by the frontend
authRouter.get("/me", (req, res) => {
  const user = getSessionUser(req);
  if (!user) { res.status(401).json({ message: "Unauthorized" }); return; }
  res.json(safeUser(user));
});

authRouter.patch("/me", async (req, res) => {
  const user = getSessionUser(req);
  if (!user) { res.status(401).json({ message: "Unauthorized" }); return; }
  const schema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().optional(),
    email: z.string().email().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ message: "Invalid input" }); return; }
  const updated = await storage.updateUser(user.id, parsed.data);
  setSessionUser(req, updated);
  res.json(safeUser(updated));
});
