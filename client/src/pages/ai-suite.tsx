import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/seo-head";

interface Bot {
  id: string;
  name: string;
  category: "branding" | "marketing" | "advertising" | "analytics";
  description: string;
  icon: string;
  outputType: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  branding: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
  marketing: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  advertising: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
  analytics: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
};

const CATEGORY_BADGE: Record<string, string> = {
  branding: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  marketing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  advertising: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  analytics: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

function BotIcon({ icon, category }: { icon: string; category: string }) {
  const iconName = icon
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");
  const Icon = (LucideIcons as Record<string, any>)[iconName] ?? LucideIcons.Sparkles;
  return (
    <div className={`p-3 rounded-xl shrink-0 ${CATEGORY_COLORS[category]}`}>
      <Icon className="h-5 w-5" />
    </div>
  );
}

function BotCard({ bot }: { bot: Bot }) {
  return (
    <Link href={`/bot/${bot.id}`}>
      <div className="bg-white dark:bg-card border border-gray-200 dark:border-border rounded-xl p-4 flex flex-col gap-3 hover:-translate-y-1 hover:shadow-md transition-all cursor-pointer group h-full">
        <div className="flex items-start gap-3">
          <BotIcon icon={bot.icon} category={bot.category} />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{bot.name}</h3>
            <Badge className={`text-[10px] mt-1 border-0 ${CATEGORY_BADGE[bot.category]}`}>
              {bot.category}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 flex-1">{bot.description}</p>
        <Button size="sm" variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          Open <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </Link>
  );
}

function BotGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="border rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <Skeleton className="h-11 w-11 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ))}
    </div>
  );
}

const TABS = ["all", "branding", "marketing", "advertising", "analytics"] as const;

export default function AISuitePage() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data: bots, isLoading } = useQuery<Bot[]>({
    queryKey: ["/api/bots"],
  });

  const filtered = (bots ?? []).filter((b) => {
    const matchesTab = activeTab === "all" || b.category === activeTab;
    const matchesSearch = !search || b.name.toLowerCase().includes(search.toLowerCase()) || b.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <SEOHead title="AI Suite — Sage Startups" description="Browse all 67 AI bots for branding, marketing, advertising, and analytics." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">AI Suite</h1>
            <p className="text-muted-foreground">
              {bots ? `${bots.length} bots across branding, marketing, advertising, and analytics.` : "Loading bots…"}
            </p>
          </div>

          {/* Search */}
          <div className="relative mb-6 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bots…"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              {TABS.map((tab) => (
                <TabsTrigger key={tab} value={tab} className="capitalize">
                  {tab === "all" ? `All (${bots?.length ?? 0})` : `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${bots?.filter((b) => b.category === tab).length ?? 0})`}
                </TabsTrigger>
              ))}
            </TabsList>

            {TABS.map((tab) => (
              <TabsContent key={tab} value={tab}>
                {isLoading ? (
                  <BotGridSkeleton />
                ) : filtered.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((bot) => <BotCard key={bot.id} bot={bot} />)}
                  </div>
                ) : (
                  <div className="text-center py-16 text-muted-foreground">
                    <p>No bots found{search ? ` for "${search}"` : ""}.</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </>
  );
}
