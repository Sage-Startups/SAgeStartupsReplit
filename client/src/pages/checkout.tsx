import { useState, useEffect } from "react";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SEOHead } from "@/components/seo-head";
import { Confetti } from "@/components/confetti";
import { useLocation, useSearch } from "wouter";

const stripePublicKey = (import.meta as any).env?.VITE_STRIPE_PUBLIC_KEY as string | undefined;

const PLANS = [
  {
    id: "pro",
    name: "Pro",
    price: 24,
    features: ["All 67 AI bots", "Unlimited runs", "Priority support", "Export assets", "Brand vault"],
    priceId: (import.meta as any).env?.VITE_STRIPE_PRO_PRICE_ID ?? "",
  },
  {
    id: "premium",
    name: "Premium",
    price: 22,
    originalPrice: 44,
    badge: "⚡ Early Bird — 50% off for life",
    features: ["Everything in Pro", "White-label exports", "Dedicated onboarding", "API access", "Custom bots"],
    priceId: (import.meta as any).env?.VITE_STRIPE_PREMIUM_PRICE_ID ?? "",
  },
] as const;

function UnavailableCard({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle>Checkout temporarily unavailable</CardTitle>
          <CardDescription>
            Payment processing is not configured yet. Please contact support or check back soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);

  const tierParam = params.get("tier") ?? "pro";
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    PLANS.find((p) => p.id === tierParam)?.id ?? "pro"
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId) ?? PLANS[0];

  if (!stripePublicKey) {
    return (
      <>
        <SEOHead title="Checkout — Sage Startups" description="Upgrade your Sage Startups plan." />
        <UnavailableCard onBack={() => setLocation("/account")} />
      </>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/stripe/create-subscription-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId: selectedPlan.priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Checkout failed");

      if (data.clientSecret) {
        const { loadStripe } = await import("@stripe/stripe-js");
        const stripe = await loadStripe(stripePublicKey!);
        if (!stripe) throw new Error("Stripe failed to load");
        const { error } = await stripe.confirmCardPayment(data.clientSecret);
        if (error) throw new Error(error.message ?? "Payment failed");
      }
      setSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message ?? "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <>
        <SEOHead title="Welcome to Pro — Sage Startups" />
        <Confetti active={true} />
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-sm space-y-4">
            <CheckCircle2 className="h-14 w-14 text-primary mx-auto" />
            <h2 className="text-2xl font-bold">You're all set!</h2>
            <p className="text-muted-foreground">
              Your <strong>{selectedPlan.name}</strong> subscription is now active. Time to build something incredible.
            </p>
            <Button
              className="w-full"
              onClick={() => setLocation("/account?tab=subscription&success=true")}
            >
              Go to Account
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead title="Checkout — Sage Startups" description="Upgrade your Sage Startups plan." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-xl px-4 py-12">
          <Button variant="ghost" size="sm" className="mb-6" onClick={() => setLocation("/account")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>

          <h1 className="text-2xl font-bold mb-1">Choose your plan</h1>
          <p className="text-muted-foreground text-sm mb-8">Cancel anytime. No contracts.</p>

          <div className="space-y-4 mb-8">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  selectedPlanId === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 dark:border-border hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {"badge" in plan && plan.badge && (
                      <span className="inline-block bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full mb-2">
                        {plan.badge}
                      </span>
                    )}
                    <h3 className="font-semibold">{plan.name}</h3>
                    <ul className="mt-2 space-y-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold">${plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></div>
                    {"originalPrice" in plan && plan.originalPrice && (
                      <div className="text-sm text-muted-foreground line-through">${plan.originalPrice}/mo</div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{errorMsg}</div>
          )}

          <Button className="w-full" size="lg" onClick={handleCheckout} disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing…</> : `Subscribe to ${selectedPlan.name} — $${selectedPlan.price}/mo`}
          </Button>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Secured by Stripe · Cancel anytime from account settings
          </p>
        </div>
      </div>
    </>
  );
}
