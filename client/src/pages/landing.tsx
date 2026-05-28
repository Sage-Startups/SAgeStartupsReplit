import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Leaf, Sparkles, Zap, Shield, TrendingUp, Users, Star,
  CheckCircle2, ArrowRight, Palette, MessageSquare, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SEOHead } from "@/components/seo-head";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const waitlistSchema = z.object({ email: z.string().email("Please enter a valid email") });

const FEATURES = [
  { icon: Sparkles, color: "purple", title: "67 AI Bots", desc: "From logo design to competitor tracking, every branding need covered." },
  { icon: Palette, color: "pink", title: "Brand Identity", desc: "Generate color palettes, typography, and brand guidelines in seconds." },
  { icon: BarChart3, color: "blue", title: "Growth Analytics", desc: "Track your brand performance with actionable insights." },
  { icon: MessageSquare, color: "green", title: "Content Engine", desc: "AI-powered copy for ads, emails, and social — always on-brand." },
  { icon: TrendingUp, color: "orange", title: "Market Intelligence", desc: "Competitor analysis and positioning strategy at your fingertips." },
  { icon: Shield, color: "sage", title: "Enterprise-grade", desc: "SOC 2 compliant. Your data stays private and secure." },
];

const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Founder, NovaPay", quote: "Sage compressed 3 months of branding work into a single afternoon. The brand voice generator alone is worth 10x the price." },
  { name: "Marcus T.", role: "Co-founder, GreenLoop", quote: "I pitched to investors with a deck and brand identity we built on Sage. They thought we had a full-time design team." },
  { name: "Priya Singh", role: "CEO, CloudNest", quote: "The AI suite replaced 4 different SaaS tools we were paying for. The ROI was immediate." },
];

const FAQS = [
  { q: "What's included in the free trial?", a: "Full access to all 67 AI bots for 7 days. No credit card required." },
  { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings — no calls, no friction." },
  { q: "Is my brand data private?", a: "Absolutely. Your inputs are never used to train models or shared with third parties." },
  { q: "Do I need design experience?", a: "Not at all. Our bots are designed for founders, not designers. Just describe what you need in plain English." },
  { q: "What's the Early Bird deal?", a: "The first 500 users lock in $22/mo (50% off) for life. Once spots are gone, they're gone." },
];

export default function LandingPage() {
  const { toast } = useToast();
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: ["/api/waitlist/count"],
    staleTime: 30_000,
  });

  const form = useForm<z.infer<typeof waitlistSchema>>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: { email: "" },
  });

  const joinMutation = useMutation({
    mutationFn: (data: z.infer<typeof waitlistSchema>) => apiRequest("POST", "/api/waitlist", data),
    onSuccess: () => {
      toast({ title: "You're on the list!", description: "We'll notify you the moment your spot opens." });
      form.reset();
    },
    onError: (err: Error) => {
      if (err.message.includes("Already")) {
        toast({ title: "Already registered", description: "This email is already on the waitlist." });
      } else {
        toast({ title: "Something went wrong", variant: "destructive" });
      }
    },
  });

  return (
    <>
      <SEOHead title="Sage Startups — AI Branding for Founders" description="67 AI bots for brand building. Logo design, marketing strategy, analytics and more. Built for ambitious startups." />

      {/* Nav */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-primary text-lg">
            <Leaf className="h-5 w-5" />
            Sage Startups
          </div>
          <div className="flex items-center gap-2">
            <Link href="/signin">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get started free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white dark:from-green-950/30 dark:to-background py-20 sm:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-0">
            <Zap className="h-3 w-3 mr-1" /> 67 AI bots, zero design skills needed
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground mb-6">
            AI-powered branding for{" "}
            <span className="text-primary">ambitious startups</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Build a professional brand identity, marketing strategy, and growth system in hours — not months. Sage gives founders the tools of a full agency at a fraction of the cost.
          </p>

          {/* Waitlist form */}
          <form
            onSubmit={form.handleSubmit((d) => joinMutation.mutate(d))}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4"
          >
            <Input
              type="email"
              placeholder="your@email.com"
              {...form.register("email")}
              className="flex-1 h-11"
            />
            <Button type="submit" size="lg" disabled={joinMutation.isPending} className="h-11 px-6">
              {joinMutation.isPending ? "Joining…" : "Join the waitlist"}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>
          {form.formState.errors.email && (
            <p className="text-sm text-destructive mb-2">{form.formState.errors.email.message}</p>
          )}
          {countData && (
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {countData.count.toLocaleString()} founders already on the list
            </p>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything a founder needs</h2>
            <p className="text-muted-foreground">One platform. 67 AI-powered tools across branding, marketing, advertising, and analytics.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <Card key={title} className="border-gray-200 dark:border-border hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-${color}-100 text-${color}-600 dark:bg-${color}-900/40 dark:text-${color}-400 mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you're ready. Cancel anytime.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free */}
            <Card className="border-gray-200 dark:border-border">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">Free Trial</Badge>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$0<span className="text-base font-normal text-muted-foreground">/7 days</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Access to all 67 bots", "10 runs/day", "Community support"].map((f) => (
                  <div key={f} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button variant="outline" className="w-full mt-4">Start free trial</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro */}
            <Card className="border-primary ring-2 ring-primary relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most popular</Badge>
              </div>
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <div className="text-3xl font-bold">$24<span className="text-base font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {["All 67 AI bots", "Unlimited runs", "Priority support", "Export assets", "Brand vault"].map((f) => (
                  <div key={f} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button className="w-full mt-4">Get started</Button>
                </Link>
              </CardContent>
            </Card>

            {/* Early Bird */}
            <Card className="border-amber-400 dark:border-amber-600 bg-amber-50 dark:bg-amber-950/20">
              <CardHeader>
                <Badge className="w-fit mb-2 bg-amber-500 text-white border-0">⚡ Early Bird</Badge>
                <CardTitle>Premium</CardTitle>
                <div className="flex items-end gap-2">
                  <div className="text-3xl font-bold">$22<span className="text-base font-normal text-muted-foreground">/month</span></div>
                  <span className="text-muted-foreground line-through text-sm mb-1">$44</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">Locked in for life — first 500 only</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {["Everything in Pro", "White-label exports", "Dedicated onboarding", "API access", "Custom bots"].map((f) => (
                  <div key={f} className="flex gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />{f}</div>
                ))}
                <Link href="/signup">
                  <Button className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white">Claim early bird</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Founders love Sage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-gray-200 dark:border-border">
                <CardContent className="pt-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">"{t.quote}"</p>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/30 dark:bg-muted/10">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="bg-background rounded-lg border px-4">
                <AccordionTrigger className="text-sm font-medium">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to build your brand?</h2>
          <p className="opacity-90 mb-8">Join {countData?.count.toLocaleString() ?? "hundreds of"} founders already using Sage.</p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-primary">
              Start your free trial <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 bg-background">
        <div className="mx-auto max-w-6xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-primary font-semibold">
            <Leaf className="h-4 w-4" />Sage Startups
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Sage Startups. All rights reserved.</p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </>
  );
}
