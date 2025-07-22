import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "../storage";
// We'll use the requireAuth middleware from routes.ts instead

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-12-18.acacia",
});

// Pricing configuration
const PRICING_CONFIG = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceId: null,
    stripeYearlyPriceId: null
  },
  pro: {
    monthlyPrice: 24,
    yearlyPrice: 20, // $240/year = $20/month
    stripePriceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID
  },
  premium: {
    monthlyPrice: 44,
    yearlyPrice: 36, // $432/year = $36/month
    stripePriceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
    stripeYearlyPriceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
  }
};

export function registerStripeRoutes(app: Express, requireAuth: any) {
  // Create subscription intent
  app.post("/api/stripe/create-subscription-intent", requireAuth, async (req: any, res) => {
    try {
      const { tier, billingCycle } = req.body;
      const userId = req.user.id;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pricingConfig = PRICING_CONFIG[tier as keyof typeof PRICING_CONFIG];
      if (!pricingConfig) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      // Free tier doesn't need payment
      if (tier === 'free') {
        return res.status(400).json({ message: "Free tier doesn't require payment" });
      }

      const price = billingCycle === 'yearly' ? pricingConfig.yearlyPrice : pricingConfig.monthlyPrice;
      const stripePriceId = billingCycle === 'yearly' ? pricingConfig.stripeYearlyPriceId : pricingConfig.stripePriceId;

      console.log(`🔍 Stripe subscription request:`, {
        tier,
        billingCycle,
        price,
        stripePriceId,
        env: process.env.NODE_ENV
      });

      if (!stripePriceId) {
        console.error(`❌ Price ID not configured for ${tier} ${billingCycle}`);
        return res.status(400).json({ message: "Price ID not configured for this plan" });
      }

      // Create or get Stripe customer
      let stripeCustomerId = user.stripeCustomerId;
      if (!stripeCustomerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          metadata: {
            userId: user.id,
          },
        });
        
        stripeCustomerId = customer.id;
        await storage.updateUser(userId, { stripeCustomerId });
      }

      // Verify price exists in Stripe first
      try {
        const stripePrice = await stripe.prices.retrieve(stripePriceId);
        console.log(`✅ Price ID validated:`, {
          id: stripePrice.id,
          amount: stripePrice.unit_amount,
          currency: stripePrice.currency,
          mode: stripePrice.livemode ? 'live' : 'test'
        });
      } catch (priceError: any) {
        console.error(`❌ Invalid Price ID ${stripePriceId}:`, priceError.message);
        
        // Check if it's a Product ID instead of Price ID
        if (stripePriceId.startsWith('prod_')) {
          return res.status(400).json({ 
            message: `Configuration Error: "${stripePriceId}" is a Product ID, but we need a Price ID. Price IDs start with "price_", not "prod_". Please check your Stripe dashboard and get the Price ID for this product.`,
            error: 'Invalid Price ID format'
          });
        }
        
        return res.status(400).json({ 
          message: `Invalid Price ID: ${stripePriceId}. Please check your Stripe dashboard.`,
          error: priceError.message
        });
      }

      // Create subscription
      console.log(`🚀 Creating Stripe subscription with Price ID: ${stripePriceId}`);
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: [{
          price: stripePriceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          userId,
          tier,
          billingCycle,
        },
      });
      console.log(`✅ Stripe subscription created:`, subscription.id);

      // Save subscription info to user
      await storage.updateUser(userId, { 
        stripeSubscriptionId: subscription.id,
        subscriptionTier: tier,
        subscriptionStatus: subscription.status === 'active' ? 'active' : 'pending'
      });

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        price,
        billingCycle
      });

    } catch (error: any) {
      console.error("❌ Stripe subscription error:", {
        message: error.message,
        code: error.code,
        param: error.param,
        type: error.type
      });
      res.status(400).json({ 
        message: error.message || "Failed to create subscription",
        code: error.code,
        param: error.param
      });
    }
  });

  // Update subscription
  app.post("/api/stripe/update-subscription", requireAuth, async (req: any, res) => {
    try {
      const { tier, billingCycle } = req.body;
      const userId = req.user.id;
      
      const user = await storage.getUser(userId);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "Active subscription not found" });
      }

      const pricingConfig = PRICING_CONFIG[tier as keyof typeof PRICING_CONFIG];
      if (!pricingConfig) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      if (tier === 'free') {
        // Cancel subscription
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
        await storage.updateUser(userId, {
          subscriptionTier: 'free',
          subscriptionStatus: 'cancelled',
          stripeSubscriptionId: null
        });
      } else {
        // Update subscription
        const stripePriceId = billingCycle === 'yearly' ? pricingConfig.stripeYearlyPriceId : pricingConfig.stripePriceId;
        
        if (!stripePriceId) {
          return res.status(400).json({ message: "Price ID not configured for this plan" });
        }

        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          items: [{
            id: subscription.items.data[0].id,
            price: stripePriceId,
          }],
          proration_behavior: 'create_prorations',
        });

        await storage.updateUser(userId, {
          subscriptionTier: tier,
          subscriptionStatus: 'active'
        });
      }

      res.json({ message: "Subscription updated successfully" });

    } catch (error: any) {
      console.error("Stripe update error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Cancel subscription
  app.post("/api/stripe/cancel-subscription", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.id;
      
      const user = await storage.getUser(userId);
      if (!user || !user.stripeSubscriptionId) {
        return res.status(404).json({ message: "Active subscription not found" });
      }

      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      
      await storage.updateUser(userId, {
        subscriptionTier: 'free',
        subscriptionStatus: 'cancelled',
        stripeSubscriptionId: null
      });

      res.json({ message: "Subscription cancelled successfully" });

    } catch (error: any) {
      console.error("Stripe cancellation error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Stripe webhook handler
  app.post('/api/stripe/webhook', async (req, res) => {
    const sig = req.headers['stripe-signature'] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!endpointSecret) {
      console.error('Stripe webhook secret not configured');
      return res.status(400).send('Webhook secret not configured');
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;
        
        if (userId) {
          const status = subscription.status === 'active' ? 'active' : 
                       subscription.status === 'canceled' ? 'cancelled' : 'pending';
          
          await storage.updateUser(userId, {
            subscriptionStatus: status,
            subscriptionExpires: subscription.current_period_end ? 
              new Date(subscription.current_period_end * 1000).toISOString() : null
          });
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription && invoice.customer) {
          // Payment successful, subscription is active
          const subscriptionId = invoice.subscription as string;
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = sub.metadata?.userId;
          
          if (userId) {
            await storage.updateUser(userId, {
              subscriptionStatus: 'active',
              subscriptionExpires: sub.current_period_end ? 
                new Date(sub.current_period_end * 1000).toISOString() : null
            });
          }
        }
        break;

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice;
        if (failedInvoice.subscription) {
          const subscriptionId = failedInvoice.subscription as string;
          const sub = await stripe.subscriptions.retrieve(subscriptionId);
          const userId = sub.metadata?.userId;
          
          if (userId) {
            await storage.updateUser(userId, {
              subscriptionStatus: 'past_due'
            });
          }
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  });
}