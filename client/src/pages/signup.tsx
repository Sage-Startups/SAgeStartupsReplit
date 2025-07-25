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
  subscriptionTier: z.enum(["free", "pro", "premium"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormData = z.infer<typeof signUpSchema>;

const subscriptionTiers = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "8 AI bots to get started",
    features: ["8 AI bots", "Basic support", "Email notifications"]
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 24,
    yearlyPrice: 240,
    description: "30 AI bots for growing businesses",
    features: ["30 AI bots", "Priority support", "Advanced analytics", "Custom branding"]
  },
  {
    id: "premium",
    name: "Premium",
    monthlyPrice: 44,
    yearlyPrice: 432,
    description: "All 60+ AI bots for enterprises",
    features: ["60+ AI bots", "24/7 support", "Custom integrations", "Team collaboration"]
  }
];

export default function SignUp() {
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
      subscriptionTier: (() => {
        // Get tier from URL parameters if present
        const urlParams = new URLSearchParams(window.location.search);
        const tierFromUrl = urlParams.get('tier');
        return tierFromUrl && ['pro', 'premium'].includes(tierFromUrl) ? tierFromUrl : 'free';
      })(),
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
            description: "Your free account has been created and you're now signed in.",
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
        // For paid tiers, sign in first then redirect to payment
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
            description: `Please complete your ${selectedTier} subscription payment.`,
          });
          
          // Redirect to checkout with selected tier and billing cycle
          const billingCycle = isYearly ? 'yearly' : 'monthly';
          setLocation(`/checkout?tier=${selectedTier}&plan=${billingCycle}`);
        } catch (signInError) {
          toast({
            title: "Account created!",
            description: "Please sign in and complete your subscription.",
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
                Your account has been created successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to <strong>{form.getValues("email")}</strong>. 
                Please check your inbox and click the verification link to activate your account.
              </p>
              <Button asChild className="w-full">
                <Link href="/signin">Continue to Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold">Sage-Startups</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Get started for free</h1>
          <p className="text-gray-600">Create your account and start building your brand with AI</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create Your Account</CardTitle>
            <CardDescription>
              Join thousands of startups using AI to build their brand
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
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
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          {...field}
                        />
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

                {/* Password */}
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Minimum 8 characters"
                            {...field}
                          />
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
                          <Input
                            type="password"
                            placeholder="Confirm password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Subscription Selection */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="subscriptionTier"
                    render={({ field }) => {
                      // Check if tier is pre-selected from URL
                      const urlParams = new URLSearchParams(window.location.search);
                      const tierFromUrl = urlParams.get('tier');
                      const isPreSelected = tierFromUrl && ['pro', 'premium'].includes(tierFromUrl);
                      
                      return (
                        <FormItem>
                          <FormLabel>Choose Your Plan</FormLabel>
                          {isPreSelected && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                              <p className="text-sm text-blue-800">
                                You've selected the <strong>{tierFromUrl?.charAt(0).toUpperCase() + tierFromUrl?.slice(1)} Plan</strong>. 
                                After account creation, you'll be redirected to complete your subscription.
                              </p>
                            </div>
                          )}
                          
                          {/* Yearly/Monthly Toggle */}
                          {!isPreSelected && (
                            <div className="flex items-center justify-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
                              <span className={`text-sm ${!isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Monthly</span>
                              <Switch
                                checked={isYearly}
                                onCheckedChange={setIsYearly}
                                className="data-[state=checked]:bg-blue-600"
                              />
                              <span className={`text-sm ${isYearly ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>Yearly</span>
                              {isYearly && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                                  Save 20%
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="grid gap-4">
                            {subscriptionTiers.map((tier) => {
                              const isDisabled = isPreSelected && tier.id !== tierFromUrl;
                              return (
                                <div
                                  key={tier.id}
                                  className={`border rounded-lg p-4 transition-colors ${
                                    field.value === tier.id
                                      ? "border-blue-500 bg-blue-50"
                                      : isDisabled 
                                        ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                                        : "border-gray-200 hover:border-gray-300 cursor-pointer"
                                  }`}
                                  onClick={() => !isDisabled && field.onChange(tier.id)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold">{tier.name}</h3>
                                        <span className="text-sm font-medium text-blue-600">
                                          {tier.id === 'free' ? 'Free' : `$${isYearly ? tier.yearlyPrice : tier.monthlyPrice}/${isYearly ? 'year' : 'month'}`}
                                        </span>
                                        {tier.id !== 'free' && isYearly && (
                                          <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs">
                                            Save 20%
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{tier.description}</p>
                                      <div className="flex flex-wrap gap-2 mt-2">
                                        {tier.features.map((feature, index) => (
                                          <span
                                            key={index}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                          >
                                            {feature}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <input
                                      type="radio"
                                      checked={field.value === tier.id}
                                      onChange={() => !isDisabled && field.onChange(tier.id)}
                                      disabled={isDisabled}
                                      className="h-4 w-4 text-blue-600"
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={signUpMutation.isPending}
                >
                  {signUpMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/signin" className="text-blue-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <button onClick={() => window.history.back()} className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}