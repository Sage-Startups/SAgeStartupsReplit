import express from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

const app = express();

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
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
        
        // Get the subscription from payment intent
        if (paymentIntent.metadata?.subscriptionId) {
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

export { app as webhookRoutes };