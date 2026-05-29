import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CreditCard, User, Key, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SEOHead } from "@/components/seo-head";
import { Confetti } from "@/components/confetti";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email"),
});

const TIER_LABELS: Record<string, string> = { free: "Free Trial", pro: "Pro", premium: "Premium" };
const STATUS_COLORS: Record<string, string> = {
  trialing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  active: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  expired: "bg-gray-100 text-gray-600 dark:bg-gray-900/40 dark:text-gray-400",
};

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultTab = params.get("tab") ?? "profile";
  const showSuccess = params.get("success") === "true";
  const [confetti, setConfetti] = useState(showSuccess);

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setConfetti(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: z.infer<typeof profileSchema>) => apiRequest("PATCH", "/api/auth/me", data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({ title: "Profile updated" });
    },
    onError: (err: Error) => {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    },
  });

  const trialDaysLeft = user?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  const trialDayUsed = trialDaysLeft !== null ? 7 - trialDaysLeft : 0;

  return (
    <>
      <SEOHead title="Account — Sage Startups" description="Manage your Sage Startups account, subscription, and settings." />
      <Confetti active={confetti} />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          {showSuccess && (
            <div className="mb-6 flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">Subscription activated!</p>
                <p className="text-sm text-green-700 dark:text-green-300">Welcome to the team. All features are now unlocked.</p>
              </div>
            </div>
          )}

          <h1 className="text-2xl font-bold mb-6">Account</h1>

          <Tabs defaultValue={defaultTab}>
            <TabsList className="mb-6 flex-wrap h-auto">
              <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" />Profile</TabsTrigger>
              <TabsTrigger value="subscription" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" />Subscription</TabsTrigger>
              <TabsTrigger value="billing" className="gap-1.5"><Clock className="h-3.5 w-3.5" />Billing</TabsTrigger>
              <TabsTrigger value="api" className="gap-1.5"><Key className="h-3.5 w-3.5" />API Keys</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Update your personal information.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit((d) => updateMutation.mutate(d))} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="fn">First name</Label>
                        <Input id="fn" {...form.register("firstName")} />
                        {form.formState.errors.firstName && (
                          <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ln">Last name</Label>
                        <Input id="ln" {...form.register("lastName")} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...form.register("email")} />
                      {form.formState.errors.email && (
                        <p className="text-xs text-destructive">{form.formState.errors.email.message}</p>
                      )}
                    </div>
                    <Button type="submit" disabled={updateMutation.isPending}>
                      {updateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save changes
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Your current plan and usage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-xl">{TIER_LABELS[user?.subscriptionTier ?? "free"]}</p>
                      <Badge className={`text-xs mt-1 border-0 ${STATUS_COLORS[user?.subscriptionStatus ?? "trialing"]}`}>
                        {user?.subscriptionStatus}
                      </Badge>
                    </div>
                    {user?.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
                      <div className="text-right">
                        <p className="text-2xl font-bold">{trialDaysLeft}</p>
                        <p className="text-xs text-muted-foreground">days left in trial</p>
                      </div>
                    )}
                  </div>

                  {user?.subscriptionStatus === "trialing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Trial progress</span>
                        <span>{trialDayUsed} / 7 days used</span>
                      </div>
                      <Progress value={(trialDayUsed / 7) * 100} />
                    </div>
                  )}

                  {user?.subscriptionStatus !== "active" && (
                    <div className="rounded-xl border p-4 space-y-2">
                      <p className="text-sm font-medium">Unlock with Pro</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Unlimited bot runs</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Priority support</li>
                        <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-primary" />Export assets & brand vault</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={() => { window.location.href = "/checkout?tier=" + (user?.subscriptionTier === "pro" ? "premium" : "pro"); }}>
                      {user?.subscriptionStatus === "active" ? "Manage plan" : "Upgrade now"}
                    </Button>
                    {user?.subscriptionStatus === "active" && (
                      <Button variant="outline" className="text-destructive hover:text-destructive">Cancel subscription</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Past invoices and payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground space-y-2">
                    <Clock className="h-8 w-8 mx-auto opacity-30" />
                    <p className="text-sm">No billing history yet.</p>
                    <p className="text-xs">Invoices will appear here once you subscribe.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Programmatic access to Sage bots.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground space-y-2">
                    <Key className="h-8 w-8 mx-auto opacity-30" />
                    <p className="text-sm">API access is coming soon.</p>
                    <p className="text-xs">Available on the Premium plan.</p>
                    <Button size="sm" variant="outline" className="mt-2" onClick={() => { window.location.href = "/checkout?tier=premium"; }}>
                      Upgrade to Premium
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
