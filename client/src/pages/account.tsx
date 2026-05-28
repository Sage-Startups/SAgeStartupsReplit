import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2, CreditCard, User, Key, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SEOHead } from "@/components/seo-head";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const profileSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().optional(),
  email: z.string().email(),
});

const TIER_LABELS: Record<string, string> = { free: "Free Trial", pro: "Pro", premium: "Premium" };
const STATUS_COLORS: Record<string, string> = {
  trialing: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
};

export default function AccountPage() {
  const { user } = useAuth();
  const { toast } = useToast();

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

  return (
    <>
      <SEOHead title="Account — Sage Startups" description="Manage your Sage Startups account, subscription, and settings." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-8">
          <h1 className="text-2xl font-bold mb-6">Account</h1>

          <Tabs defaultValue="profile">
            <TabsList className="mb-6">
              <TabsTrigger value="profile"><User className="h-4 w-4 mr-1.5" />Profile</TabsTrigger>
              <TabsTrigger value="subscription"><CreditCard className="h-4 w-4 mr-1.5" />Subscription</TabsTrigger>
              <TabsTrigger value="billing"><Clock className="h-4 w-4 mr-1.5" />Billing</TabsTrigger>
              <TabsTrigger value="api"><Key className="h-4 w-4 mr-1.5" />API Keys</TabsTrigger>
            </TabsList>

            {/* Profile tab */}
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
                        <Label>First name</Label>
                        <Input {...form.register("firstName")} />
                        {form.formState.errors.firstName && (
                          <p className="text-xs text-destructive">{form.formState.errors.firstName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Last name</Label>
                        <Input {...form.register("lastName")} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Email</Label>
                      <Input type="email" {...form.register("email")} />
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

            {/* Subscription tab */}
            <TabsContent value="subscription">
              <Card>
                <CardHeader>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Your current plan and usage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-lg">{TIER_LABELS[user?.subscriptionTier ?? "free"]}</p>
                      <Badge className={`text-xs mt-1 border-0 ${STATUS_COLORS[user?.subscriptionStatus ?? "trialing"]}`}>
                        {user?.subscriptionStatus}
                      </Badge>
                    </div>
                    {user?.subscriptionStatus === "trialing" && trialDaysLeft !== null && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{trialDaysLeft} days left</p>
                        <p className="text-xs text-muted-foreground">in your free trial</p>
                      </div>
                    )}
                  </div>

                  {user?.subscriptionStatus === "trialing" && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Trial progress</span>
                        <span>{7 - (trialDaysLeft ?? 0)} / 7 days</span>
                      </div>
                      <Progress value={((7 - (trialDaysLeft ?? 0)) / 7) * 100} />
                    </div>
                  )}

                  <div className="border rounded-xl p-4 space-y-2">
                    <p className="text-sm font-medium">Upgrade to unlock</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>✓ Unlimited bot runs</li>
                      <li>✓ Priority support</li>
                      <li>✓ Export assets</li>
                      <li>✓ Brand vault</li>
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <Button onClick={() => { window.location.href = "/checkout"; }}>
                      {user?.subscriptionStatus === "active" ? "Manage billing" : "Upgrade plan"}
                    </Button>
                    {user?.subscriptionStatus === "active" && (
                      <Button variant="outline">Cancel subscription</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing tab */}
            <TabsContent value="billing">
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your past invoices and payments.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground">
                    <Clock className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No billing history yet.</p>
                    <p className="text-xs mt-1">Invoices will appear here once you subscribe.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Keys tab */}
            <TabsContent value="api">
              <Card>
                <CardHeader>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Programmatic access to Sage bots.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-10 text-muted-foreground">
                    <Key className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">API access is coming soon.</p>
                    <p className="text-xs mt-1">Available on the Premium plan.</p>
                    <Button size="sm" variant="outline" className="mt-4" onClick={() => { window.location.href = "/checkout"; }}>
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
