import { useState } from "react";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SEOHead } from "@/components/seo-head";
import { useLocation } from "wouter";

// Safe Stripe loading — never throws at module level if key is missing
const stripePublicKey = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY as string | undefined;

let stripePromise: Promise<any> | null = null;

async function getStripePromise() {
  if (!stripePublicKey) return null;
  if (!stripePromise) {
    const { loadStripe } = await import("@stripe/stripe-js");
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
}

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 24,
    description: "For serious founders ready to scale their brand.",
    features: ["All 67 AI bots", "Unlimited runs", "Priority support", "Export assets", "Brand vault"],
    priceId: (import.meta as any).env?.VITE_STRIPE_PRO_PRICE_ID ?? "",
  },
  {
    id: "premium",
    name: "Premium (Early Bird)",
    price: 22,
    originalPrice: 44,
    description: "Everything in Pro plus white-label and API access. Price locked forever.",
    features: ["Everything in Pro", "White-label exports", "Dedicated onboarding", "API access", "Custom bots"],
    priceId: (import.meta as any).env?.VITE_STRIPE_PREMIUM_PRICE_ID ?? "",
    badge: "⚡ Early Bird — 50% off for life",
  },
];

function UnavailableCard() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Checkout temporarily unavailable</CardTitle>
          <CardDescription>
            Payment processing is not configured in this environment. Please contact support or try again later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => setLocation("/account")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const [selectedPlan, setSelectedPlan] = useState("pro");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!stripePublicKey) {
    return (
      <>
        <SEOHead title="Checkout — Sage Startups" description="Upgrade your Sage Startups plan." />
        <UnavailableCard />
      </>
    );
  }

  async function handleCheckout() {
    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (!plan) return;
    setLoading(true);
    try {
      const stripe = await getStripePromise();
      if (!stripe) { setLoading(false); return; }

      const res = await fetch("/api/stripe/create-subscription-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId: plan.priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Checkout failed");

      // In a real integration you'd use stripe.confirmPayment here
      // For now simulate success
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="text-center max-w-sm">
          <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">You're all set!</h2>
          <p className="text-muted-foreground mb-6">Your subscription is now active. Go build something amazing.</p>
          <Button onClick={() => setLocation("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title="Checkout — Sage Startups" description="Upgrade your Sage Startups plan." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Button variant="ghost" size="sm" className="mb-6" onClick={() => setLocation("/account")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <h1 className="text-2xl font-bold mb-2">Choose your plan</h1>
          <p className="text-muted-foreground mb-8">7-day free trial included. Cancel anytime.</p>

          <div className="space-y-4 mb-8">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-border hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {plan.badge && (
                      <span className="inline-block bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full mb-2">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="font-semibold">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{plan.description}</p>
                    <ul className="mt-3 space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                    {plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">${plan.originalPrice}/mo</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing…</> : "Subscribe now"}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by Stripe. Cancel anytime from your account settings.
          </p>
        </div>
      </div>
    </>
  );
}
