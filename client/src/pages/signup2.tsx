import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Loader2, Zap, Check } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const signUpSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  company: z.string().optional(),
  subscriptionTier: z.enum(["free", "premium"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const subscriptionTiers = [
  {
    id: "free",
    name: "Free Trial",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "7 days free access to 8 AI bots",
    features: ["8 AI bots", "7-day free trial", "Basic support", "No credit card required"]
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 22, // Discounted from $44
    yearlyPrice: 264, // $22 * 12 months
    description: "All 60+ AI bots - Lifetime discount!",
    features: ["60+ AI bots", "24/7 support", "Custom integrations", "Team collaboration", "50% Lifetime Discount"],
    originalMonthlyPrice: 44,
    isDiscounted: true
  }
];

export default function SignUp2() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      company: "",
      subscriptionTier: "premium", // Default to premium for early bird
    },
  });

  const selectedTier = form.watch("subscriptionTier");

  const signUpMutation = useMutation({
    mutationFn: async (data: SignUpFormData) => {
      return await apiRequest("POST", "/api/auth/signup", data);
    },
    onSuccess: async (response) => {
      const selectedTier = form.getValues().subscriptionTier;
      
      // If free tier, sign in immediately
      if (selectedTier === 'free') {
        const signInData = {
          email: form.getValues().email,
          password: form.getValues().password
        };
        
        try {
          const signInResponse = await apiRequest("POST", "/api/auth/signin", signInData);
          const result = await signInResponse.json();
          
          // Invalidate auth cache to trigger useAuth to refetch
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          
          toast({
            title: "Welcome to Sage-Startups!",
            description: "Your free trial has been activated and you're now signed in.",
          });
          
          // Redirect to dashboard
          setLocation("/");
        } catch (signInError) {
          toast({
            title: "Account created successfully!",
            description: "Please sign in with your new account.",
          });
          setLocation("/signin");
        }
      } else {
        // For premium tier, sign in first then redirect to payment
        const signInData = {
          email: form.getValues().email,
          password: form.getValues().password
        };
        
        try {
          const signInResponse = await apiRequest("POST", "/api/auth/signin", signInData);
          
          // Invalidate auth cache
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          
          toast({
            title: "Account created!",
            description: `Please complete your premium subscription payment at the discounted rate.`,
          });
          
          // Redirect to checkout with discounted tier and billing cycle after a short delay
          const billingCycle = isYearly ? 'yearly' : 'monthly';
          setTimeout(() => {
            try {
              setLocation(`/checkout?tier=premium&plan=${billingCycle}&discount=early-bird`);
            } catch (error) {
              console.error('Error redirecting to checkout:', error);
              toast({
                title: "Navigation Error",
                description: "Please manually navigate to the checkout page.",
                variant: "destructive",
              });
            }
          }, 500); // Small delay to ensure authentication is established
        } catch (signInError) {
          toast({
            title: "Account created!",
            description: "Please sign in and complete your premium subscription.",
          });
          setLocation("/signin");
        }
      }
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: SignUpFormData) => {
    setError("");
    signUpMutation.mutate(data);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Welcome to Sage-Startups!</CardTitle>
              <CardDescription>
                We've sent a verification email to your inbox. Please check your email and click the verification link to activate your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button variant="outline" onClick={() => setLocation("/signin")}>
                Back to Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Sage-Startups</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Pricing Plans */}
          <div className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Choose Your Plan
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Get started with our early bird pricing - Limited time 50% discount!
              </p>
              
              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-3 mb-8">
                <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <Switch
                  checked={isYearly}
                  onCheckedChange={setIsYearly}
                />
                <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                  Yearly
                </span>
                {isYearly && (
                  <Badge variant="secondary" className="ml-2">
                    2 months free
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {subscriptionTiers.map((tier) => {
                const isSelected = selectedTier === tier.id;
                const price = isYearly ? tier.yearlyPrice : tier.monthlyPrice;
                const originalPrice = tier.originalMonthlyPrice ? (isYearly ? tier.originalMonthlyPrice * 12 : tier.originalMonthlyPrice) : null;
                
                return (
                  <Card
                    key={tier.id}
                    className={`relative cursor-pointer transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-500 shadow-lg'
                        : 'hover:shadow-md'
                    } ${tier.isDiscounted ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' : ''}`}
                    onClick={() => form.setValue('subscriptionTier', tier.id as "free" | "premium")}
                  >
                    {tier.isDiscounted && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-blue-500">🔥 Early Bird Special - 50% Off!</Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-2">
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <div className="mt-4">
                        {originalPrice && (
                          <p className="text-2xl text-gray-400 line-through">
                            ${originalPrice}{isYearly ? '/year' : '/month'}
                          </p>
                        )}
                        <p className="text-4xl font-bold text-gray-900">
                          ${price}
                          <span className="text-lg text-gray-600 font-normal">
                            {price === 0 ? '' : isYearly ? '/year' : '/month'}
                          </span>
                        </p>
                        {tier.isDiscounted && (
                          <p className="text-sm text-blue-600 font-medium mt-1">
                            Lifetime discount - Never pay full price!
                          </p>
                        )}
                      </div>
                      <CardDescription className="mt-2">
                        {tier.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-2">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        type="button"
                        className={`w-full mt-4 ${
                          isSelected
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                        }`}
                        onClick={() => form.setValue('subscriptionTier', tier.id as "free" | "premium")}
                      >
                        {isSelected ? 'Selected' : 'Select Plan'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Sign Up Form */}
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>
                  Start your journey with Sage-Startups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company Name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {error && (
                      <Alert>
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={signUpMutation.isPending}
                    >
                      {signUpMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {selectedTier === 'free' ? 'Start Free Trial' : 'Continue to Payment'}
                    </Button>
                  </form>
                </Form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link href="/signin" className="text-blue-600 hover:underline">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}