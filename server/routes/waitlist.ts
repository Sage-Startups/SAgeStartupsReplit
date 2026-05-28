import { Router } from "express";
import { insertWaitlistSchema } from "../../shared/schema.js";
import { storage } from "../storage.js";
import { sendWaitlistConfirmation } from "../email.js";

const router = Router();

// POST /api/waitlist
router.post("/", async (req, res) => {
  const parsed = insertWaitlistSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: "Invalid input", errors: parsed.error.flatten() });
    return;
  }
  try {
    const entry = await storage.addToWaitlist(parsed.data);
    sendWaitlistConfirmation(parsed.data.email).catch(() => {});
    res.status(201).json({ id: entry.id });
  } catch (err: any) {
    if (err?.message?.includes("unique") || err?.code === "23505") {
      res.status(409).json({ message: "Already on the waitlist" });
    } else {
      throw err;
    }
  }
});

// GET /api/waitlist/count
router.get("/count", async (_req, res) => {
  const count = await storage.getWaitlistCount();
  res.json({ count });
});

export { router as waitlistRouter };
