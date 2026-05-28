import { Router } from "express";
import type { Request, Response } from "express";
import { storage } from "../storage.js";

const router = Router();

// POST /api/webhooks/stripe — raw body required for signature verification
router.post("/stripe", async (req: Request, res: Response) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey || !webhookSecret) {
    res.status(503).json({ message: "Stripe not configured" });
    return;
  }

  const sig = req.headers["stripe-signature"];
  if (!sig) {
    res.status(400).json({ message: "Missing stripe-signature header" });
    return;
  }

  let event: any;
  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(stripeKey, { apiVersion: "2025-02-24.acacia" });
    event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
  } catch (err: any) {
    console.error("[webhook] signature verification failed:", err.message);
    res.status(400).json({ message: `Webhook error: ${err.message}` });
    return;
  }

  try {
    await handleStripeEvent(event);
  } catch (err: any) {
    console.error("[webhook] handler error:", err.message);
    // Return 200 anyway — Stripe will retry if we return non-2xx
  }

  res.json({ received: true });
});

async function handleStripeEvent(event: any) {
  const obj = event.data?.object ?? {};

  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const customerId = obj.customer as string;
      const status = obj.status as string;
      const priceId = obj.items?.data?.[0]?.price?.id as string | undefined;

      const user = await findUserByCustomerId(customerId);
      if (!user) { console.warn("[webhook] no user for customer", customerId); break; }

      const tier = priceId === process.env.STRIPE_PREMIUM_PRICE_ID ? "premium" : "pro";
      const subStatus =
        status === "active" ? "active"
        : status === "trialing" ? "trialing"
        : status === "canceled" ? "cancelled"
        : "expired";

      await storage.updateUser(user.id, {
        subscriptionTier: tier,
        subscriptionStatus: subStatus,
        stripeSubscriptionId: obj.id,
      });
      console.log(`[webhook] subscription ${event.type} → user ${user.id} tier=${tier} status=${subStatus}`);
      break;
    }

    case "customer.subscription.deleted": {
      const customerId = obj.customer as string;
      const user = await findUserByCustomerId(customerId);
      if (!user) break;
      await storage.updateUser(user.id, {
        subscriptionTier: "free",
        subscriptionStatus: "cancelled",
        stripeSubscriptionId: null,
      });
      console.log(`[webhook] subscription deleted → user ${user.id} downgraded to free`);
      break;
    }

    default:
      console.log(`[webhook] unhandled event type: ${event.type}`);
  }
}

async function findUserByCustomerId(customerId: string) {
  // IStorage doesn't expose a by-customerId lookup, so we do a workaround
  // This is acceptable — webhook volume is low
  const { getDb, hasDb } = await import("../db.js");
  if (!hasDb()) return undefined;
  const { users } = await import("../../shared/schema.js");
  const { eq } = await import("drizzle-orm");
  const [user] = await getDb().select().from(users).where(eq(users.stripeCustomerId, customerId));
  return user;
}

export { router as webhooksRouter };
