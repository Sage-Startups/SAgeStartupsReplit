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

// Use test keys in development, live keys in production
const stripePublicKey = import.meta.env.DEV 
  ? import.meta.env.VITE_STRIPE_TEST_PUBLIC_KEY 
  : import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!stripePublicKey) {
  const requiredKey = import.meta.env.DEV ? 'VITE_STRIPE_TEST_PUBLIC_KEY' : 'VITE_STRIPE_PUBLIC_KEY';
  throw new Error(`Missing required Stripe key: ${requiredKey}`);
}

console.log(`🔒 Frontend using Stripe ${import.meta.env.DEV ? 'TEST' : 'LIVE'} mode`);

const stripePromise = loadStripe(stripePublicKey);

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
              {planDetails.isEarlyBird && (
                <Badge className="bg-blue-500 text-white mt-2">
                  🔥 Early Bird Discount - 50% Off!
                </Badge>
              )}
            </div>
            <div className="text-right">
              {planDetails.originalPrice && (
                <div className="text-lg text-gray-400 line-through">
                  ${planDetails.originalPrice}
                </div>
              )}
              <div className="text-2xl font-bold">
                ${planDetails.price}
              </div>
              <div className="text-sm text-gray-600">
                {planDetails.billingCycle === 'yearly' ? '/year (paid today)' : '/month'}
              </div>
              {planDetails.isEarlyBird && (
                <div className="text-sm text-blue-600 mt-1 font-medium">
                  Lifetime 50% discount!
                </div>
              )}
              {planDetails.billingCycle === 'yearly' && !planDetails.isEarlyBird && (
                <div className="text-sm text-green-600 mt-1">
                  Save 20% vs monthly billing
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
          {isProcessing ? 'Processing...' : `Pay $${planDetails.price} ${planDetails.billingCycle === 'yearly' ? 'for full year' : '/month'}`}
        </Button>

        <p className="text-xs text-gray-500 text-center">
          {planDetails.billingCycle === 'yearly' 
            ? `You will be charged $${planDetails.price} today for a full year of access. Your subscription will automatically renew on ${new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}.`
            : `You will be charged $${planDetails.price} today and then monthly. You can cancel anytime.`
          }
          <br />
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </div>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [planDetails, setPlanDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Get selected plan from sessionStorage or URL parameters
    let plan: any;
    const selectedPlan = sessionStorage.getItem('selectedPlan');
    const urlParams = new URLSearchParams(window.location.search);
    const tierFromUrl = urlParams.get('tier');
    const planFromUrl = urlParams.get('plan') || 'monthly';
    
    if (selectedPlan) {
      plan = JSON.parse(selectedPlan);
    } else if (tierFromUrl) {
      // Create plan object from URL parameters (for signup redirects)
      const discountFromUrl = urlParams.get('discount');
      const isEarlyBird = discountFromUrl === 'early-bird';
      
      const tierPricing = {
        pro: { monthly: 24, yearly: 240 },
        premium: { 
          monthly: isEarlyBird ? 22 : 44, 
          yearly: isEarlyBird ? 264 : 432 
        }
      };
      
      const isYearly = planFromUrl === 'yearly';
      const pricing = tierPricing[tierFromUrl as 'pro' | 'premium'];
      const price = isYearly ? pricing.yearly : pricing.monthly;
      
      plan = {
        tier: tierFromUrl,
        billingCycle: planFromUrl,
        name: `${tierFromUrl.charAt(0).toUpperCase() + tierFromUrl.slice(1)} Plan`,
        price: price,
        description: `${tierFromUrl === 'pro' ? '30' : '60+'} AI bots for your business`,
        isEarlyBird: isEarlyBird,
        originalPrice: isEarlyBird && tierFromUrl === 'premium' ? (isYearly ? 432 : 44) : null
      };
    } else {
      window.location.href = '/';
      return;
    }


    setPlanDetails(plan);

    // Create payment intent with retry logic for authentication
    const createPaymentIntent = async (retries = 2) => {
      try {
        const response = await apiRequest("POST", "/api/stripe/create-subscription-intent", {
          tier: plan.tier,
          billingCycle: plan.billingCycle,
          discount: plan.isEarlyBird ? 'early-bird' : undefined
        });
        
        if (!response.ok) {
          if (response.status === 401 && retries > 0) {
            // Wait a bit and retry if unauthorized (auth might still be establishing)
            console.log('Authentication issue, retrying...');
            setTimeout(() => {
              createPaymentIntent(retries - 1).catch(console.error);
            }, 1000);
            return;
          }
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating subscription:', error);
        if (retries === 0) {
          // If all retries failed, show error and redirect to signin
          toast({
            title: "Payment Setup Failed",
            description: "Unable to set up payment. Please try signing in again.",
            variant: "destructive",
          });
          setTimeout(() => {
            window.location.href = '/signin?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
          }, 2000);
        }
        setIsLoading(false);
      }
    };
    
    createPaymentIntent().catch(console.error);
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
            <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          
          {import.meta.env.DEV && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="font-medium text-green-800">🧪 Test Mode - Safe Testing</h4>
                  <p className="text-sm text-green-600">
                    No real charges will be made. Use test card: 4242 4242 4242 4242
                  </p>
                </div>
              </div>
            </div>
          )}
          
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