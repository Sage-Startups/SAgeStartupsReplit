import express from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

const app = express();

// Use test keys in development, live keys in production
const stripeSecretKey = process.env.NODE_ENV === 'development' 
  ? process.env.STRIPE_TEST_SECRET_KEY 
  : process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  const requiredKey = process.env.NODE_ENV === 'development' ? 'STRIPE_TEST_SECRET_KEY' : 'STRIPE_SECRET_KEY';
  throw new Error(`Missing required Stripe secret: ${requiredKey}`);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2024-12-18.acacia",
});

// Webhook endpoint for Stripe events
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    // In production, you should set STRIPE_WEBHOOK_SECRET
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // For development, just parse the body
      event = JSON.parse(req.body.toString());
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed:`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Stripe webhook received: ${event.type}`);

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
        
        // Handle early bird payment success
        if (paymentIntent.metadata?.isEarlyBird === 'true') {
          await handleEarlyBirdPaymentSuccess(paymentIntent);
        }
        // Handle regular subscription payment
        else if (paymentIntent.metadata?.subscriptionId) {
          const subscription = await stripe.subscriptions.retrieve(paymentIntent.metadata.subscriptionId);
          await handleSubscriptionPaymentSuccess(subscription);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`📋 Invoice payment succeeded: ${invoice.id}`);
        
        if (invoice.subscription_details?.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription_details.subscription as string);
          await handleSubscriptionPaymentSuccess(subscription);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`🔄 Subscription updated: ${subscription.id}`);
        
        if (subscription.status === 'active') {
          await handleSubscriptionPaymentSuccess(subscription);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`❌ Subscription cancelled: ${subscription.id}`);
        
        // Find user by subscription ID and downgrade to free
        const users = await storage.getAllUsers();
        const user = users.find(u => u.stripeSubscriptionId === subscription.id);
        
        if (user) {
          await storage.updateUser(user.id, {
            subscriptionTier: 'free',
            subscriptionStatus: 'cancelled',
            stripeSubscriptionId: null,
            pendingSubscription: null
          });
          console.log(`⬇️ User ${user.id} downgraded to free plan`);
        }
        break;
      }

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error: any) {
    console.error(`❌ Webhook handler error:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Handle successful subscription payment
async function handleSubscriptionPaymentSuccess(subscription: Stripe.Subscription) {
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('❌ No userId in subscription metadata');
      return;
    }

    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    // Get the pending subscription tier
    const pendingTier = user.pendingSubscription;
    if (!pendingTier) {
      console.log(`ℹ️ No pending subscription for user ${userId}`);
      return;
    }

    // Upgrade user to paid tier
    await storage.updateUser(userId, {
      subscriptionTier: pendingTier,
      subscriptionStatus: 'active',
      stripeSubscriptionId: subscription.id,
      pendingSubscription: null // Clear pending subscription
    });

    console.log(`✅ User ${userId} upgraded to ${pendingTier} plan successfully`);

  } catch (error: any) {
    console.error(`❌ Error handling subscription success:`, error);
  }
}

// Handle successful early bird payment
async function handleEarlyBirdPaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const userId = paymentIntent.metadata?.userId;
    if (!userId) {
      console.error('❌ No userId in payment intent metadata');
      return;
    }

    const user = await storage.getUser(userId);
    if (!user) {
      console.error(`❌ User not found: ${userId}`);
      return;
    }

    // Upgrade user to premium with early bird pricing
    const monthlyPrice = parseInt(paymentIntent.metadata.monthlyPrice || '22');
    
    await storage.updateUser(userId, {
      subscriptionTier: 'premium',
      subscriptionStatus: 'active',
      pendingSubscription: null, // Clear pending subscription
      subscriptionExpires: null // No expiration for paid subscriptions
    });

    console.log(`✅ User ${userId} upgraded to premium early bird plan at $${monthlyPrice}/month`);
    
    // TODO: Set up monthly recurring billing for the early bird price
    // For now, they get premium access and will need to manually manage billing

  } catch (error: any) {
    console.error(`❌ Error handling early bird payment success:`, error);
  }
}

export { app as webhookRoutes };