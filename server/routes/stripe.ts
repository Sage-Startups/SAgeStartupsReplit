import { Router } from "express";
import { requireAuth, getSessionUser } from "../auth.js";
import { storage } from "../storage.js";

const router = Router();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

if (!STRIPE_SECRET_KEY) {
  console.warn("[stripe] STRIPE_SECRET_KEY not set — payment routes will return 503");
}

// POST /api/stripe/create-subscription-intent
router.post("/create-subscription-intent", requireAuth, async (req, res) => {
  if (!STRIPE_SECRET_KEY) {
    res.status(503).json({ message: "Payment processing not configured" });
    return;
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2025-02-24.acacia" });

  const user = getSessionUser(req)!;
  const { priceId } = req.body;
  if (!priceId || typeof priceId !== "string") {
    res.status(400).json({ message: "priceId is required" });
    return;
  }

  try {
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: [user.firstName, user.lastName].filter(Boolean).join(" ") || undefined,
      });
      customerId = customer.id;
      await storage.updateUser(user.id, { stripeCustomerId: customerId });
    }

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    const invoice = subscription.latest_invoice as any;
    const clientSecret = invoice?.payment_intent?.client_secret ?? null;

    res.json({ subscriptionId: subscription.id, clientSecret });
  } catch (err: any) {
    console.error("[stripe]", err.message);
    res.status(500).json({ message: err.message ?? "Stripe error" });
  }
});

// GET /api/stripe/plans
router.get("/plans", (_req, res) => {
  if (!STRIPE_SECRET_KEY) {
    res.status(503).json({ message: "Payment processing not configured" });
    return;
  }
  // Static plan definitions — replace price IDs with real Stripe price IDs
  res.json([
    {
      id: "pro",
      name: "Pro",
      price: 29,
      interval: "month",
      priceId: process.env.STRIPE_PRO_PRICE_ID ?? "",
      features: ["All 67 AI bots", "Unlimited sessions", "Priority support"],
    },
    {
      id: "premium",
      name: "Premium",
      price: 79,
      interval: "month",
      priceId: process.env.STRIPE_PREMIUM_PRICE_ID ?? "",
      features: ["Everything in Pro", "White-label exports", "Dedicated onboarding"],
    },
  ]);
});

export { router as stripeRouter };
