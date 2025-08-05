import type { Express } from "express";
import Stripe from "stripe";
import { storage } from "../storage";
// We'll use the requireAuth middleware from routes.ts instead

// Force live mode for refund testing - use live keys
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error(`Missing required Stripe secret: STRIPE_SECRET_KEY`);
}

console.log(`🔒 Using Stripe LIVE mode`);

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia",
});

// Pricing configuration - Separate for test and live modes
const PRICING_CONFIG = {
  free: {
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceId: null,
    stripeYearlyPriceId: null
  },
  pro: {
    monthlyPrice: 24,
    yearlyPrice: 240, // $240/year total (20% discount)
    // Test price IDs - you'll need to create these in Stripe test mode
    stripePriceId: 'price_1RncgSGTriQojbPQX65SA4Do',
    stripeYearlyPriceId: 'price_1RnchDGTriQojbPQ75f5koOK'
  },
  premium: {
    monthlyPrice: 44,
    yearlyPrice: 432, // $432/year total (20% discount)
    // Test price IDs - you'll need to create these in Stripe test mode
    stripePriceId: 'price_1RnchqGTriQojbPQVhsCJgGX',
    stripeYearlyPriceId: 'price_1RnciZGTriQojbPQUUDxXW1Y'
  },
  'premium-early-bird': {
    monthlyPrice: 22, // 50% off regular premium price
    yearlyPrice: 264, // $22 * 12 months
    // Test price IDs for early bird pricing
    stripePriceId: process.env.NODE_ENV === 'development' ? 'price_test_early_bird_monthly' : null,
    stripeYearlyPriceId: process.env.NODE_ENV === 'development' ? 'price_test_early_bird_yearly' : null
  }
};

export function registerStripeRoutes(app: Express, requireAuth: any) {
  // Helper function to create or get test prices
  async function getOrCreateTestPrice(productName: string, amount: number, interval: 'month' | 'year') {
    try {
      // In test mode, create prices dynamically
      if (process.env.NODE_ENV === 'development') {
        const price = await stripe.prices.create({
          unit_amount: amount * 100, // Convert to cents
          currency: 'usd',
          recurring: { interval },
          product_data: {
            name: `${productName} Plan - Test Mode`,
            description: `Test mode subscription for ${productName} plan`
          },
        });
        return price.id;
      }
      
      // In production, return the configured price ID
      return null; // This should never be reached with current logic
    } catch (error) {
      console.error('Error creating test price:', error);
      throw error;
    }
  }

  // Create subscription intent
  app.post("/api/stripe/create-subscription-intent", requireAuth, async (req: any, res) => {
    try {
      const { tier, billingCycle, discount } = req.body;
      const userId = req.user.id;
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Handle early bird discount for premium tier
      let pricingKey = tier;
      if (tier === 'premium' && discount === 'early-bird') {
        pricingKey = 'premium-early-bird';
      }
      
      const pricingConfig = PRICING_CONFIG[pricingKey as keyof typeof PRICING_CONFIG];
      if (!pricingConfig) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      // Free tier doesn't need payment
      if (tier === 'free') {
        return res.status(400).json({ message: "Free tier doesn't require payment" });
      }

      const price = billingCycle === 'yearly' ? pricingConfig.yearlyPrice : pricingConfig.monthlyPrice;
      let stripePriceId = billingCycle === 'yearly' ? pricingConfig.stripeYearlyPriceId : pricingConfig.stripePriceId;
      
      // In development, create test prices dynamically if needed
      if (process.env.NODE_ENV === 'development' && (!stripePriceId || stripePriceId.startsWith('price_test_'))) {
        const interval = billingCycle === 'yearly' ? 'year' : 'month';
        stripePriceId = await getOrCreateTestPrice(tier, price, interval);
        console.log(`🧪 Created test price: ${stripePriceId} for ${tier} ${interval}`);
      }

      console.log(`🔍 Stripe subscription request:`, {
        tier,
        billingCycle,
        price,
        stripePriceId,
        discount,
        pricingKey,
        env: process.env.NODE_ENV
      });

      // Create or get Stripe customer first (needed for both early bird and regular pricing)
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

      // For early bird pricing, create a one-time payment to start their monthly recurring subscription
      if (pricingKey === 'premium-early-bird') {
        console.log(`🔥 Creating early bird payment intent for $${price}`);
        
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(price * 100), // Convert to cents
          currency: "usd",
          customer: stripeCustomerId,
          setup_future_usage: 'off_session', // Save payment method for future monthly charges
          metadata: {
            userId,
            tier: 'premium',
            billingCycle: 'monthly', // Always monthly for early bird
            discount: 'early-bird',
            originalPrice: 44,
            isEarlyBird: 'true',
            monthlyPrice: price // $22/month going forward
          },
          description: `Sage-Startups Premium Early Bird - $${price}/month recurring`
        });

        return res.json({ 
          clientSecret: paymentIntent.client_secret,
          paymentType: 'early-bird-payment' // Special flag for early bird payments
        });
      }

      if (!stripePriceId) {
        console.error(`❌ Price ID not configured for ${pricingKey} ${billingCycle}`);
        return res.status(400).json({ message: "Price ID not configured for this plan" });
      }

      // Basic price ID format validation
      if (!stripePriceId.startsWith('price_')) {
        console.error(`❌ Invalid Price ID format: ${stripePriceId}`);
        return res.status(400).json({ message: "Invalid Price ID format" });
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

      // Save subscription ID but DON'T upgrade tier until payment is confirmed
      await storage.updateUser(userId, { 
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status === 'active' ? 'active' : 'pending',
        pendingSubscription: tier // Store the tier they're trying to upgrade to
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
        // Cancel subscription at period end
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true
        });
        await storage.updateUser(userId, {
          subscriptionStatus: 'cancelling',
          nextTier: 'free'
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

      // Cancel at period end instead of immediately
      const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
        cancel_at_period_end: true
      });
      
      await storage.updateUser(userId, {
        subscriptionStatus: 'cancelling',
        nextTier: 'free',
        subscriptionExpires: new Date(subscription.current_period_end * 1000)
      });

      res.json({ message: "Subscription cancelled successfully" });

    } catch (error: any) {
      console.error("Stripe cancellation error:", error);
      res.status(400).json({ message: error.message });
    }
  });

  // Admin refund endpoint
  app.post("/api/admin/refund", requireAuth, async (req: any, res) => {
    try {
      const { userId, amount, refundType } = req.body;
      
      // Check if current user is super admin
      const currentUser = await storage.getUser(req.user.id);
      if (!currentUser || currentUser.role !== 'super_admin') {
        return res.status(403).json({ message: "Only super admins can process refunds" });
      }
      
      const user = await storage.getUser(userId);
      if (!user || !user.stripeCustomerId) {
        return res.status(404).json({ message: "User or Stripe customer not found" });
      }

      let refundAmount: number;
      
      if (refundType === 'last_payment') {
        // Get the latest successful payment for this customer
        const charges = await stripe.charges.list({
          customer: user.stripeCustomerId,
          limit: 1
        });
        
        if (!charges.data.length || charges.data[0].status !== 'succeeded') {
          return res.status(404).json({ message: "No successful payments found for this user" });
        }
        
        refundAmount = charges.data[0].amount / 100; // Convert from cents
      } else {
        // Custom amount
        refundAmount = amount;
        if (!refundAmount || refundAmount <= 0) {
          return res.status(400).json({ message: "Invalid refund amount" });
        }
      }

      // Process the refund
      const refund = await stripe.refunds.create({
        charge: (await stripe.charges.list({
          customer: user.stripeCustomerId,
          limit: 1
        })).data[0].id,
        amount: Math.round(refundAmount * 100) // Convert to cents
      });

      res.json({ 
        message: "Refund processed successfully",
        amount: refundAmount,
        refundId: refund.id
      });

    } catch (error: any) {
      console.error("Refund error:", error);
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