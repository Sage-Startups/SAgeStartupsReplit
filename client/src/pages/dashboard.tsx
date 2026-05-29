import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, TrendingUp, Clock, Bot, CheckSquare,
  ArrowRight, Palette, MessageSquare, BarChart3, Megaphone
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/seo-head";
import { useAuth } from "@/hooks/useAuth";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

const GOALS = [
  { id: "brand_name", label: "Define your brand name" },
  { id: "color_palette", label: "Generate color palette" },
  { id: "brand_voice", label: "Write brand voice guide" },
  { id: "tagline", label: "Create a tagline" },
  { id: "logo", label: "Design a logo concept" },
  { id: "website_copy", label: "Write website hero copy" },
];

const QUICK_BOTS = [
  { id: "brand-voice-generator", name: "Brand Voice", icon: MessageSquare, color: "purple" },
  { id: "color-palette-creator", name: "Color Palette", icon: Palette, color: "pink" },
  { id: "tagline-generator", name: "Tagline", icon: Sparkles, color: "green" },
  { id: "marketing-strategy-bot", name: "Marketing Strategy", icon: TrendingUp, color: "blue" },
  { id: "ad-copy-generator", name: "Ad Copy", icon: Megaphone, color: "orange" },
  { id: "competitor-tracker-bot", name: "Competitors", icon: BarChart3, color: "sage" },
];

const COLOR_MAP: Record<string, string> = {
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  sage: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
};

function StatCard({ value, label, icon: Icon, iconClass }: {
  value: number; label: string; icon: typeof Clock; iconClass: string;
}) {
  const animated = useAnimatedNumber(value);
  return (
    <Card className="border-gray-200 dark:border-border">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shrink-0 ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <p className="text-2xl font-bold tabular-nums">{animated}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 ml-1">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
    </span>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [checkedGoals, setCheckedGoals] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem("sage_goals");
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });

  const { data: sessions, isLoading: sessionsLoading } = useQuery<any[]>({
    queryKey: ["/api/bot-sessions"],
    refetchInterval: 30_000,
    staleTime: 30_000,
  });

  useEffect(() => {
    localStorage.setItem("sage_goals", JSON.stringify([...checkedGoals]));
  }, [checkedGoals]);

  function toggleGoal(id: string) {
    setCheckedGoals((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  const progress = Math.round((checkedGoals.size / GOALS.length) * 100);
  const thisWeekSessions = sessions?.filter((s) => {
    const d = new Date(s.updatedAt);
    const now = new Date();
    return (now.getTime() - d.getTime()) < 7 * 24 * 60 * 60 * 1000;
  }).length ?? 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
  };

  const trialDaysLeft = user?.trialEndsAt
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <>
      <SEOHead title="Dashboard — Sage Startups" description="Your Sage Startups founder dashboard." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                {greeting()}, {user?.firstName ?? "Founder"} 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {user?.subscriptionStatus === "trialing" && trialDaysLeft !== null ? (
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-xs">
                    {trialDaysLeft} days left in trial
                  </Badge>
                ) : (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0 text-xs capitalize">
                    {user?.subscriptionTier} plan
                  </Badge>
                )}
                <span className="flex items-center text-xs text-muted-foreground">
                  Live <LiveDot />
                </span>
              </div>
            </div>
            {user?.subscriptionStatus === "trialing" && (
              <Link href="/checkout?tier=pro">
                <Button size="sm">Upgrade</Button>
              </Link>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard value={thisWeekSessions} label="Sessions this week" icon={Clock} iconClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" />
            <StatCard value={sessions?.length ?? 0} label="Total sessions" icon={Bot} iconClass="bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" />
            <StatCard value={checkedGoals.size} label={`Goals (of ${GOALS.length})`} icon={CheckSquare} iconClass="bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" />
            <StatCard value={67} label="AI bots available" icon={Sparkles} iconClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goal tracker */}
            <Card className="border-gray-200 dark:border-border lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Brand Launchpad
                  <span className="text-xs font-normal text-muted-foreground">{progress}% complete</span>
                </CardTitle>
                <Progress value={progress} className="h-1.5" />
              </CardHeader>
              <CardContent className="space-y-3">
                {GOALS.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-3">
                    <Checkbox
                      id={goal.id}
                      checked={checkedGoals.has(goal.id)}
                      onCheckedChange={() => toggleGoal(goal.id)}
                    />
                    <label
                      htmlFor={goal.id}
                      className={`text-sm cursor-pointer select-none ${checkedGoals.has(goal.id) ? "line-through text-muted-foreground" : ""}`}
                    >
                      {goal.label}
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick launch bots */}
            <Card className="border-gray-200 dark:border-border lg:col-span-2">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Quick Launch</CardTitle>
                <Link href="/ai-suite">
                  <Button variant="ghost" size="sm" className="text-xs gap-1">
                    View all 67 <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {QUICK_BOTS.map(({ id, name, icon: Icon, color }) => (
                    <Link key={id} href={`/bot/${id}`}>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-left group">
                        <div className={`p-2 rounded-lg shrink-0 ${COLOR_MAP[color]}`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium leading-tight">{name}</span>
                      </button>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent sessions */}
            <Card className="border-gray-200 dark:border-border lg:col-span-3">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Sessions</CardTitle>
                <Link href="/ai-suite">
                  <Button variant="ghost" size="sm" className="text-xs">+ New session</Button>
                </Link>
              </CardHeader>
              <CardContent>
                {sessionsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
                  </div>
                ) : sessions && sessions.length > 0 ? (
                  <div className="space-y-2">
                    {sessions.slice(0, 5).map((s) => (
                      <Link key={s.id} href={`/bot/${s.botId}?session=${s.id}`}>
                        <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-border hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{s.title}</p>
                            <p className="text-xs text-muted-foreground">{s.botId}</p>
                          </div>
                          <div className="text-xs text-muted-foreground shrink-0 ml-3">
                            {new Date(s.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground space-y-3">
                    <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Bot className="h-7 w-7 opacity-40" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">No sessions yet</p>
                      <p className="text-xs mt-0.5">Pick an AI bot to get started building your brand.</p>
                    </div>
                    <Link href="/ai-suite">
                      <Button size="sm" variant="outline">Browse AI Suite</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
