import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Monitor, Smartphone, Tablet, Globe, TrendingUp, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const DEVICE_COLORS = ["#4ade80", "#60a5fa", "#f472b6"];
const DEVICE_ICONS: Record<string, typeof Monitor> = {
  desktop: Monitor,
  mobile: Smartphone,
  tablet: Tablet,
};

interface AnalyticsData {
  totalVisits: number;
  uniqueSessions: number;
  pageViews: number;
  topPages: Array<{ path: string; views: number }>;
  deviceBreakdown: Array<{ type: string; count: number }>;
  visitsByDay: Array<{ date: string; visits: number }>;
}

function StatCard({ title, value, icon: Icon, gradient }: { title: string; value: string | number; icon: typeof Users; gradient: string }) {
  return (
    <Card className={`border-0 ${gradient} text-white overflow-hidden`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-white/80 text-sm">{title}</p>
            <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-white/20">
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonCard() {
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-16" />
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics/stats"],
    refetchInterval: 30_000,
    retry: false,
  });

  // Fallback demo data when API not yet wired
  const stats = data ?? {
    totalVisits: 0,
    uniqueSessions: 0,
    pageViews: 0,
    topPages: [],
    deviceBreakdown: [
      { type: "desktop", count: 0 },
      { type: "mobile", count: 0 },
      { type: "tablet", count: 0 },
    ],
    visitsByDay: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return { date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }), visits: 0 };
    }),
  };

  return (
    <>
      <SEOHead title="Analytics — Sage Startups" description="Real-time analytics for your Sage Startups account." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Auto-refreshes every 30 seconds.
                <Badge variant="secondary" className="ml-2 text-[10px]">Live</Badge>
              </p>
            </div>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {isLoading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                <StatCard title="Total Visits" value={stats.totalVisits} icon={Globe} gradient="bg-gradient-to-br from-blue-500 to-blue-600" />
                <StatCard title="Unique Sessions" value={stats.uniqueSessions} icon={Users} gradient="bg-gradient-to-br from-emerald-500 to-emerald-600" />
                <StatCard title="Page Views" value={stats.pageViews} icon={Eye} gradient="bg-gradient-to-br from-purple-500 to-purple-600" />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visits over time */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Visits (last 7 days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={stats.visitsByDay} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                      />
                      <Line type="monotone" dataKey="visits" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Device breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Device Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48 w-full" />
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie data={stats.deviceBreakdown} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={60}>
                          {stats.deviceBreakdown.map((_, i) => (
                            <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {stats.deviceBreakdown.map((d, i) => {
                        const Icon = DEVICE_ICONS[d.type] ?? Monitor;
                        return (
                          <div key={d.type} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i] }} />
                              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                              <span className="capitalize">{d.type}</span>
                            </div>
                            <span className="font-medium">{d.count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Top pages */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base">Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => <Skeleton key={i} className="h-8 w-full" />)}
                  </div>
                ) : stats.topPages.length > 0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground text-xs">
                        <th className="text-left pb-2 font-medium">Page</th>
                        <th className="text-right pb-2 font-medium">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {stats.topPages.slice(0, 10).map((p) => (
                        <tr key={p.path}>
                          <td className="py-2 font-mono text-xs">{p.path}</td>
                          <td className="py-2 text-right font-medium">{p.views.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-center py-8 text-sm text-muted-foreground">No page view data yet.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
