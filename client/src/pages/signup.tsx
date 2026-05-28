import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Leaf, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SEOHead } from "@/components/seo-head";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
  firstName: z.string().min(1, "Required").optional(),
  lastName: z.string().optional(),
});

export default function SignUpPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "", firstName: "", lastName: "" },
  });

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof schema>) => apiRequest("POST", "/api/auth/register", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/dashboard");
    },
    onError: (err: Error) => {
      toast({ title: "Registration failed", description: err.message, variant: "destructive" });
    },
  });

  return (
    <>
      <SEOHead title="Sign Up — Sage Startups" description="Create your Sage Startups account and start your 7-day free trial." />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-green-950/20 dark:to-background p-4">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 text-primary font-bold text-xl mb-2">
              <Leaf className="h-5 w-5" /> Sage
            </Link>
            <CardTitle>Start your free trial</CardTitle>
            <CardDescription>7 days free · No credit card required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" placeholder="Alex" {...form.register("firstName")} />
                  {form.formState.errors.firstName && (
                    <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" placeholder="Smith" {...form.register("lastName")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="8+ characters" {...form.register("password")} />
                {form.formState.errors.password && (
                  <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create account
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => { window.location.href = "/api/login"; }}>
              Continue with Replit
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By creating an account you agree to our{" "}
              <a href="#" className="underline">Terms</a> and{" "}
              <a href="#" className="underline">Privacy Policy</a>.
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link href="/signin" className="text-primary hover:underline font-medium">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
