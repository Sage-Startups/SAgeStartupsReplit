import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { MainNavigation } from "@/components/main-navigation";
import { RefreshCw, TrendingUp, Users, Eye, MousePointer, Globe, Clock, BarChart3, Activity, Wifi, WifiOff, AlertCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface AnalyticsSummary {
  totalVisits: number;
  uniqueVisitors: number;
  totalPageViews: number;
  totalActions: number;
  totalConversions: number;
  avgSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  pagesPerSession: number;
}

interface SiteVisit {
  id: number;
  sessionId: string;
  userId?: string;
  ipAddress: string;
  userAgent: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  country?: string;
  city?: string;
  browser?: string;
  os?: string;
  device: string;
  visitStart: string;
  visitEnd?: string;
  duration?: number;
  pageViews: number;
  isAuthenticated: boolean;
  createdAt: string;
}

interface UserAction {
  id: number;
  visitId: number;
  sessionId: string;
  userId?: string;
  action: string;
  element?: string;
  elementText?: string;
  page: string;
  metadata?: any;
  createdAt: string;
}

interface ConversionEvent {
  id: number;
  visitId: number;
  sessionId: string;
  userId?: string;
  eventType: string;
  eventValue?: number;
  funnel?: string;
  source?: string;
  createdAt: string;
}

interface TopPage {
  path: string;
  views: number;
}

interface TrafficSource {
  source: string;
  visits: number;
}

interface UserBehavior {
  topActions: Array<{ action: string; count: number }>;
  avgTimeOnPage: number;
  totalActions: number;
}

export default function Analytics() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const autoRefreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Set default date range (last 30 days)
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateFrom(format(thirtyDaysAgo, 'yyyy-MM-dd'));
    setDateTo(format(now, 'yyyy-MM-dd'));
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (autoRefresh) {
      autoRefreshIntervalRef.current = setInterval(() => {
        setRefreshKey(prev => prev + 1);
        setLastUpdate(new Date());
      }, 10000); // Refresh every 10 seconds
    } else {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    }

    return () => {
      if (autoRefreshIntervalRef.current) {
        clearInterval(autoRefreshIntervalRef.current);
      }
    };
  }, [autoRefresh]);

  const { data: summary, isLoading: summaryLoading, isError: summaryError } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/admin/analytics/summary", dateFrom, dateTo, refreshKey],
    enabled: !!dateFrom && !!dateTo,
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: visits, isLoading: visitsLoading, isError: visitsError } = useQuery<SiteVisit[]>({
    queryKey: ["/api/admin/analytics/visits", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: actions, isLoading: actionsLoading, isError: actionsError } = useQuery<UserAction[]>({
    queryKey: ["/api/admin/analytics/actions", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: conversions, isLoading: conversionsLoading, isError: conversionsError } = useQuery<ConversionEvent[]>({
    queryKey: ["/api/admin/analytics/conversions", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: topPages, isLoading: pagesLoading, isError: pagesError } = useQuery<TopPage[]>({
    queryKey: ["/api/admin/analytics/pages", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: trafficSources, isLoading: sourcesLoading, isError: sourcesError } = useQuery<TrafficSource[]>({
    queryKey: ["/api/admin/analytics/sources", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  const { data: userBehavior, isLoading: behaviorLoading, isError: behaviorError } = useQuery<UserBehavior>({
    queryKey: ["/api/admin/analytics/behavior", refreshKey],
    staleTime: 5000,
    refetchInterval: autoRefresh ? 10000 : false,
  });

  // Check connection status
  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setLastUpdate(new Date());
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'mobile': return '📱';
      case 'tablet': return '📱';
      default: return '💻';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Live Status Bar */}
        <div className="mb-4 flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-2 border">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {isOnline ? (
                <Badge variant="default" className="bg-green-100 text-green-800 border-green-200 flex items-center">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Activity className="w-4 h-4 mr-1 text-blue-500" />
              Last updated: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </div>
            <Button
              variant={autoRefresh ? "default" : "outline"}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="ml-4"
            >
              {autoRefresh ? (
                <>
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Auto-refresh ON
                </>
              ) : (
                <>
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Auto-refresh OFF
                </>
              )}
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs text-gray-500">
              Refreshing every 10 seconds
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                try {
                  const response = await fetch("/api/admin/analytics/seed", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                  });
                  if (response.ok) {
                    setRefreshKey(prev => prev + 1);
                    setLastUpdate(new Date());
                  }
                } catch (error) {
                  console.error("Failed to seed data:", error);
                }
              }}
            >
              Add Test Data
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              <BarChart3 className="w-10 h-10 mr-3 text-blue-600" />
              Live Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Real-time website traffic and user behavior monitoring
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-1 shadow-sm border">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40 border-0 focus:ring-0"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40 border-0 focus:ring-0"
              />
            </div>
            <Button
              variant="default"
              size="sm"
              onClick={handleRefresh}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Now
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
          {summaryLoading ? (
            <>
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-20 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </>
          ) : summaryError ? (
            <Card className="col-span-full bg-red-50 border-red-200">
              <CardContent className="flex items-center justify-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mr-3" />
                <p className="text-red-700">Failed to load analytics summary. Please refresh.</p>
              </CardContent>
            </Card>
          ) : summary ? (
            <>
              <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-blue-900">Total Visits</CardTitle>
                  <Users className="h-5 w-5 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{summary.totalVisits.toLocaleString()}</div>
                  <p className="text-xs text-blue-700 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {summary.uniqueVisitors} unique
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-purple-900">Page Views</CardTitle>
                  <Eye className="h-5 w-5 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{summary.totalPageViews.toLocaleString()}</div>
                  <p className="text-xs text-purple-700 flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    {summary.pagesPerSession.toFixed(1)} per session
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-white border-green-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-green-900">User Actions</CardTitle>
                  <MousePointer className="h-5 w-5 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{summary.totalActions.toLocaleString()}</div>
                  <p className="text-xs text-green-700">
                    Clicks & interactions
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-orange-900">Conversions</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-900">{summary.totalConversions.toLocaleString()}</div>
                  <p className="text-xs text-orange-700 flex items-center mt-1">
                    <Activity className="w-3 h-3 mr-1" />
                    {summary.conversionRate.toFixed(1)}% rate
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-white border-indigo-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-indigo-900">Avg Session</CardTitle>
                  <Clock className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-900">{formatDuration(summary.avgSessionDuration)}</div>
                  <p className="text-xs text-indigo-700">
                    Time spent
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-red-50 to-white border-red-200 shadow-sm hover:shadow-md transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-red-900">Bounce Rate</CardTitle>
                  <Globe className="h-5 w-5 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-900">{summary.bounceRate.toFixed(1)}%</div>
                  <p className="text-xs text-red-700">
                    Single page exits
                  </p>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="visits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm border rounded-lg p-1">
            <TabsTrigger value="visits" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Site Visits
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Top Pages
            </TabsTrigger>
            <TabsTrigger value="sources" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Traffic Sources
            </TabsTrigger>
            <TabsTrigger value="actions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              User Actions
            </TabsTrigger>
            <TabsTrigger value="conversions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Conversions
            </TabsTrigger>
            <TabsTrigger value="behavior" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              User Behavior
            </TabsTrigger>
          </TabsList>

          {/* Site Visits Tab */}
          <TabsContent value="visits">
            <Card className="shadow-md border-0">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Live Site Visits</CardTitle>
                    <CardDescription className="text-gray-700">
                      Real-time visitor activity and session tracking
                    </CardDescription>
                  </div>
                  {!visitsLoading && visits && (
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                      {visits.length} total visits
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {visitsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="border rounded-lg p-4 space-y-2 animate-pulse">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Skeleton className="w-10 h-10 rounded-full" />
                            <div>
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-48" />
                            </div>
                          </div>
                          <div className="text-right">
                            <Skeleton className="h-3 w-24 mb-1" />
                            <Skeleton className="h-3 w-32" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : visitsError ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-700">Failed to load visits. Please refresh.</p>
                  </div>
                ) : visits && visits.length > 0 ? (
                  <div className="space-y-3">
                    {visits.slice(0, 20).map((visit, index) => (
                      <div key={visit.id} className={`border rounded-lg p-4 space-y-2 transition-all hover:shadow-md ${index === 0 ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getDeviceIcon(visit.device)}</span>
                            <div>
                              <div className="font-semibold flex items-center">
                                {visit.ipAddress}
                                {visit.isAuthenticated && (
                                  <Badge variant="default" className="ml-2 bg-green-100 text-green-800 border-green-200">
                                    <Users className="w-3 h-3 mr-1" />
                                    Authenticated
                                  </Badge>
                                )}
                                {index === 0 && (
                                  <Badge className="ml-2 bg-red-100 text-red-800 border-red-200 animate-pulse">
                                    <Activity className="w-3 h-3 mr-1" />
                                    LIVE
                                  </Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-600 flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                {visit.browser} on {visit.os} • {visit.device}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-semibold text-gray-800">
                              <Eye className="w-4 h-4 inline mr-1" />
                              {visit.pageViews} pages • 
                              <Clock className="w-4 h-4 inline mx-1" />
                              {formatDuration(visit.duration || 0)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(visit.createdAt), { addSuffix: true })}
                            </div>
                          </div>
                        </div>
                        
                        {(visit.referrer || visit.utmSource) && (
                          <div className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-1">
                            <span className="font-medium">Source:</span>{' '}
                            {visit.utmSource ? (
                              <span className="text-blue-600">
                                {visit.utmSource}
                                {visit.utmMedium && ` (${visit.utmMedium})`}
                                {visit.utmCampaign && ` - ${visit.utmCampaign}`}
                              </span>
                            ) : (
                              <span className="text-gray-700">{visit.referrer || 'Direct'}</span>
                            )}
                          </div>
                        )}
                        
                        {(visit.country || visit.city) && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span>{' '}
                            <span className="text-purple-600">
                              {[visit.city, visit.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No visits recorded yet</p>
                    <p className="text-gray-400 text-sm mt-2">Visits will appear here in real-time</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Pages Tab */}
          <TabsContent value="pages">
            <Card className="shadow-md border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold text-gray-900">Top Performing Pages</CardTitle>
                    <CardDescription className="text-gray-700">
                      Most visited pages ranked by popularity
                    </CardDescription>
                  </div>
                  {!pagesLoading && topPages && (
                    <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                      {topPages.length} pages tracked
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {pagesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg animate-pulse">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-6 w-10" />
                          <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                    ))}
                  </div>
                ) : topPages && topPages.length > 0 ? (
                  <div className="space-y-3">
                    {topPages.map((page, index) => {
                      const percentage = topPages[0].views > 0 ? (page.views / topPages[0].views) * 100 : 0;
                      return (
                        <div key={page.path} className={`relative p-4 border rounded-lg overflow-hidden transition-all hover:shadow-md ${index === 0 ? 'border-purple-300 bg-purple-50' : 'bg-white'}`}>
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-transparent" 
                               style={{ width: `${percentage}%`, opacity: 0.3 }} />
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={`${index === 0 ? 'bg-purple-600 text-white' : index === 1 ? 'bg-purple-500 text-white' : index === 2 ? 'bg-purple-400 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                #{index + 1}
                              </Badge>
                              <span className="font-semibold text-gray-800">{page.path}</span>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-purple-700 flex items-center">
                                <Eye className="w-4 h-4 mr-1" />
                                {page.views.toLocaleString()} views
                              </div>
                              <div className="text-xs text-gray-500">{percentage.toFixed(0)}% of top page</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No page data available yet</p>
                    <p className="text-gray-400 text-sm mt-2">Page views will be tracked automatically</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Traffic Sources Tab */}
          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>
                  Where your visitors are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sourcesLoading ? (
                  <div className="text-center py-8">Loading sources...</div>
                ) : trafficSources && trafficSources.length > 0 ? (
                  <div className="space-y-4">
                    {trafficSources.map((source, index) => (
                      <div key={source.source} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{source.source}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-green-600">{source.visits} visits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No traffic source data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Actions Tab */}
          <TabsContent value="actions">
            <Card>
              <CardHeader>
                <CardTitle>Recent User Actions</CardTitle>
                <CardDescription>
                  Latest user interactions and behavior
                </CardDescription>
              </CardHeader>
              <CardContent>
                {actionsLoading ? (
                  <div className="text-center py-8">Loading actions...</div>
                ) : actions && actions.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {actions.slice(0, 100).map((action) => (
                      <div key={action.id} className="border rounded p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary">{action.action}</Badge>
                            <span className="text-sm">{action.page}</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {format(new Date(action.createdAt), 'MMM dd, HH:mm')}
                          </div>
                        </div>
                        {action.element && (
                          <div className="text-sm text-gray-600 mt-1">
                            Element: {action.element}
                            {action.elementText && ` - "${action.elementText}"`}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No user actions recorded yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversions Tab */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Events</CardTitle>
                <CardDescription>
                  Important user actions that indicate success
                </CardDescription>
              </CardHeader>
              <CardContent>
                {conversionsLoading ? (
                  <div className="text-center py-8">Loading conversions...</div>
                ) : conversions && conversions.length > 0 ? (
                  <div className="space-y-4">
                    {conversions.map((conversion) => (
                      <div key={conversion.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Badge variant="default">{conversion.eventType}</Badge>
                            <div>
                              <div className="font-medium">
                                {conversion.eventType.replace(/_/g, ' ').toUpperCase()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Source: {conversion.source || 'Direct'}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            {conversion.eventValue && (
                              <div className="font-semibold text-green-600">
                                ${conversion.eventValue}
                              </div>
                            )}
                            <div className="text-xs text-gray-500">
                              {format(new Date(conversion.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No conversions recorded yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Behavior Tab */}
          <TabsContent value="behavior">
            <Card>
              <CardHeader>
                <CardTitle>User Behavior Analysis</CardTitle>
                <CardDescription>
                  Insights into how users interact with your site
                </CardDescription>
              </CardHeader>
              <CardContent>
                {behaviorLoading ? (
                  <div className="text-center py-8">Loading behavior data...</div>
                ) : userBehavior ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Top User Actions</h3>
                      <div className="space-y-2">
                        {userBehavior.topActions.map((action, index) => (
                          <div key={action.action} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <span>{action.action.replace(/_/g, ' ')}</span>
                            </div>
                            <span className="font-semibold">{action.count} times</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold">Average Time on Page</h4>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatDuration(userBehavior.avgTimeOnPage)}
                        </div>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold">Total Actions</h4>
                        <div className="text-2xl font-bold text-green-600">
                          {userBehavior.totalActions.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No behavior data available</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}