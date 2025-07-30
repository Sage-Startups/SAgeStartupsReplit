import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNavigation } from "@/components/main-navigation";
import { RefreshCw, TrendingUp, Users, Eye, MousePointer, Globe, Clock, BarChart3 } from "lucide-react";
import { format } from "date-fns";

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

  // Set default date range (last 30 days)
  useEffect(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateFrom(format(thirtyDaysAgo, 'yyyy-MM-dd'));
    setDateTo(format(now, 'yyyy-MM-dd'));
  }, []);

  const { data: summary, isLoading: summaryLoading } = useQuery<AnalyticsSummary>({
    queryKey: ["/api/admin/analytics/summary", dateFrom, dateTo, refreshKey],
    enabled: !!dateFrom && !!dateTo,
  });

  const { data: visits, isLoading: visitsLoading } = useQuery<SiteVisit[]>({
    queryKey: ["/api/admin/analytics/visits", refreshKey],
  });

  const { data: actions, isLoading: actionsLoading } = useQuery<UserAction[]>({
    queryKey: ["/api/admin/analytics/actions", refreshKey],
  });

  const { data: conversions, isLoading: conversionsLoading } = useQuery<ConversionEvent[]>({
    queryKey: ["/api/admin/analytics/conversions", refreshKey],
  });

  const { data: topPages, isLoading: pagesLoading } = useQuery<TopPage[]>({
    queryKey: ["/api/admin/analytics/pages", refreshKey],
  });

  const { data: trafficSources, isLoading: sourcesLoading } = useQuery<TrafficSource[]>({
    queryKey: ["/api/admin/analytics/sources", refreshKey],
  });

  const { data: userBehavior, isLoading: behaviorLoading } = useQuery<UserBehavior>({
    queryKey: ["/api/admin/analytics/behavior", refreshKey],
  });

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
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
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
              Site Analytics
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive website traffic and user behavior analysis
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-40"
              />
              <span className="text-gray-500">to</span>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-40"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalVisits.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.uniqueVisitors} unique visitors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalPageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.pagesPerSession} pages per session
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Actions</CardTitle>
                <MousePointer className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalActions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Clicks, forms, interactions
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.totalConversions.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {summary.conversionRate}% conversion rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(summary.avgSessionDuration)}</div>
                <p className="text-xs text-muted-foreground">
                  Session duration
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{summary.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Single page visits
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Analytics Tabs */}
        <Tabs defaultValue="visits" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="visits">Site Visits</TabsTrigger>
            <TabsTrigger value="pages">Top Pages</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
            <TabsTrigger value="actions">User Actions</TabsTrigger>
            <TabsTrigger value="conversions">Conversions</TabsTrigger>
            <TabsTrigger value="behavior">User Behavior</TabsTrigger>
          </TabsList>

          {/* Site Visits Tab */}
          <TabsContent value="visits">
            <Card>
              <CardHeader>
                <CardTitle>Recent Site Visits</CardTitle>
                <CardDescription>
                  Latest visitors and their session details
                </CardDescription>
              </CardHeader>
              <CardContent>
                {visitsLoading ? (
                  <div className="text-center py-8">Loading visits...</div>
                ) : visits && visits.length > 0 ? (
                  <div className="space-y-4">
                    {visits.slice(0, 50).map((visit) => (
                      <div key={visit.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{getDeviceIcon(visit.device)}</span>
                            <div>
                              <div className="font-medium">
                                {visit.ipAddress}
                                {visit.isAuthenticated && (
                                  <Badge variant="secondary" className="ml-2">Authenticated</Badge>
                                )}
                              </div>
                              <div className="text-sm text-gray-500">
                                {visit.browser} on {visit.os} • {visit.device}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              {visit.pageViews} pages • {formatDuration(visit.duration || 0)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {format(new Date(visit.createdAt), 'MMM dd, yyyy HH:mm')}
                            </div>
                          </div>
                        </div>
                        
                        {(visit.referrer || visit.utmSource) && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Source:</span>{' '}
                            {visit.utmSource ? (
                              <span>
                                {visit.utmSource}
                                {visit.utmMedium && ` (${visit.utmMedium})`}
                                {visit.utmCampaign && ` - ${visit.utmCampaign}`}
                              </span>
                            ) : (
                              visit.referrer || 'Direct'
                            )}
                          </div>
                        )}
                        
                        {(visit.country || visit.city) && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Location:</span>{' '}
                            {[visit.city, visit.country].filter(Boolean).join(', ')}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No visits recorded yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Pages Tab */}
          <TabsContent value="pages">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Pages</CardTitle>
                <CardDescription>
                  Pages with the most views
                </CardDescription>
              </CardHeader>
              <CardContent>
                {pagesLoading ? (
                  <div className="text-center py-8">Loading pages...</div>
                ) : topPages && topPages.length > 0 ? (
                  <div className="space-y-4">
                    {topPages.map((page, index) => (
                      <div key={page.path} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">#{index + 1}</Badge>
                          <span className="font-medium">{page.path}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-blue-600">{page.views} views</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">No page data available</div>
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