import { useState, useEffect } from "react";
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/main-navigation";
import { ArrowLeft, CreditCard, Lock, CheckCircle } from "lucide-react";
import { Link } from "wouter";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ planDetails }: { planDetails: any }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/account?tab=subscription&success=true`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Welcome to your new subscription!",
      });
    }

    setIsProcessing(false);
  };

  return (
    <div className="space-y-6">
      {/* Plan Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span>Subscription Summary</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-semibold">{planDetails.name}</h3>
              <p className="text-sm text-gray-600">{planDetails.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">
                ${(() => {
                  const displayPrice = planDetails.billingCycle === 'yearly' ? Math.round(planDetails.price / 12) : planDetails.price;
                  console.log('💰 Display price calculation:', {
                    originalPrice: planDetails.price,
                    billingCycle: planDetails.billingCycle,
                    displayPrice
                  });
                  return displayPrice;
                })()}
              </div>
              <div className="text-sm text-gray-600">
                /{planDetails.billingCycle === 'yearly' ? 'month (billed yearly)' : 'month'}
              </div>
              {planDetails.billingCycle === 'yearly' && (
                <div className="text-sm text-green-600 mt-1">
                  Billed ${planDetails.price} annually
                </div>
              )}
            </div>
          </div>
          {planDetails.billingCycle === 'yearly' && (
            <Badge className="bg-green-100 text-green-800">
              Save 20% with yearly billing
            </Badge>
          )}
        </CardContent>
      </Card>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Payment Details</span>
            </CardTitle>
            <CardDescription>
              Your payment information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaymentElement />
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          className="w-full" 
          size="lg"
          disabled={!stripe || !elements || isProcessing}
        >
          <Lock className="w-4 h-4 mr-2" />
          {isProcessing ? 'Processing...' : `Subscribe for $${planDetails.billingCycle === 'yearly' ? Math.round(planDetails.price / 12) + '/month (billed $' + planDetails.price + ' yearly)' : planDetails.price + '/month'}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our Terms of Service and Privacy Policy. 
          You can cancel your subscription at any time.
        </p>
      </form>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Clear any old sessionStorage data to prevent pricing issues
    sessionStorage.removeItem('selectedPlan');
    
    // Get selected plan from URL parameters only (more reliable)
    let plan: any;
    const selectedPlan = null; // Disable sessionStorage for now
    const urlParams = new URLSearchParams(window.location.search);
    const tierFromUrl = urlParams.get('tier');
    const planFromUrl = urlParams.get('plan') || 'monthly';
    
    if (selectedPlan) {
      plan = JSON.parse(selectedPlan);
    } else if (tierFromUrl) {
      // Create plan object from URL parameters (for signup redirects)
      const tierPricing = {
        pro: { monthly: 24, yearly: 240 },
        premium: { monthly: 44, yearly: 432 }
      };
      
      const isYearly = planFromUrl === 'yearly';
      const pricing = tierPricing[tierFromUrl as 'pro' | 'premium'];
      const price = isYearly ? pricing.yearly : pricing.monthly;
      
      plan = {
        tier: tierFromUrl,
        billingCycle: planFromUrl,
        name: `${tierFromUrl.charAt(0).toUpperCase() + tierFromUrl.slice(1)} Plan`,
        price: price,
        description: `${tierFromUrl === 'pro' ? '30' : '60+'} AI bots for your business`
      };
    } else {
      window.location.href = '/';
      return;
    }

    console.log('🔍 Plan details for checkout:', plan);
    setPlanDetails(plan);

    // Create payment intent
    apiRequest("POST", "/api/stripe/create-subscription-intent", {
      tier: plan.tier,
      billingCycle: plan.billingCycle
    })
      .then((response) => response.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error creating subscription:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading || !clientSecret || !planDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <div className="max-w-md mx-auto pt-20">
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
            <p className="mt-4 text-gray-600">Setting up your subscription...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Subscription</h1>
          <p className="text-gray-600 mt-2">Secure checkout powered by Stripe</p>
        </div>

        {/* Checkout Form */}
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
            }
          }}
        >
          <CheckoutForm planDetails={planDetails} />
        </Elements>
      </div>
    </div>
  );
}