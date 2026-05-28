import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles, TrendingUp, Clock, Bot, CheckSquare, Square,
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
  { id: "competitor-tracker-bot", name: "Competitor Analysis", icon: BarChart3, color: "sage" },
];

const COLOR_MAP: Record<string, string> = {
  purple: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  pink: "bg-pink-100 text-pink-600 dark:bg-pink-900/40 dark:text-pink-400",
  green: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  orange: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  sage: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
};

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

  return (
    <>
      <SEOHead title="Dashboard — Sage Startups" description="Your Sage Startups founder dashboard." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">
              {greeting()}, {user?.firstName ?? "Founder"} 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.subscriptionStatus === "trialing" ? "Free trial active" : `${user?.subscriptionTier} plan`}
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-gray-200 dark:border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{thisWeekSessions}</p>
                    <p className="text-xs text-muted-foreground">Sessions this week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{sessions?.length ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Total sessions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400">
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{checkedGoals.size}/{GOALS.length}</p>
                    <p className="text-xs text-muted-foreground">Goals completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-gray-200 dark:border-border">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">67</p>
                    <p className="text-xs text-muted-foreground">AI bots available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Goal tracker */}
            <Card className="border-gray-200 dark:border-border lg:col-span-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  Brand Launchpad
                  <span className="text-xs font-normal text-muted-foreground">{progress}% done</span>
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
                      className={`text-sm cursor-pointer ${checkedGoals.has(goal.id) ? "line-through text-muted-foreground" : ""}`}
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
                    View all <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {QUICK_BOTS.map(({ id, name, icon: Icon, color }) => (
                    <Link key={id} href={`/bot/${id}`}>
                      <button className="w-full flex items-center gap-3 p-3 rounded-xl border border-gray-200 dark:border-border bg-card hover:shadow-md hover:-translate-y-0.5 transition-all text-left">
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
                  <Button variant="ghost" size="sm" className="text-xs">New session</Button>
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
                          <div>
                            <p className="text-sm font-medium">{s.title}</p>
                            <p className="text-xs text-muted-foreground">{s.botId}</p>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(s.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No sessions yet.</p>
                    <Link href="/ai-suite">
                      <Button size="sm" variant="outline" className="mt-3">Launch your first bot</Button>
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
