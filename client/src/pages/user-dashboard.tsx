import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { sections, BotDefinition } from "@/lib/bot-definitions";
import { Link, useLocation } from "wouter";
import { 
  User, 
  Crown, 
  BarChart, 
  MessageSquare, 
  FileText, 
  Calendar,
  TrendingUp,
  Zap,
  Settings,
  LogOut,
  Plus,
  ArrowRight,
  Lock
} from "lucide-react";

interface UserAnalytics {
  totalSessions: number;
  totalMessages: number;
  totalAssets: number;
  favoriteSection: string | null;
  lastActive: string;
}

export default function UserDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  // Fetch user's available bots
  const { data: availableBots = [], isLoading: botsLoading } = useQuery<BotDefinition[]>({
    queryKey: ["/api/user/bots"],
    enabled: !!user,
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    }
  });

  // Fetch user analytics
  const { data: analytics } = useQuery<UserAnalytics>({
    queryKey: ["/api/user/analytics"],
    enabled: !!user,
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
      }
    }
  });

  // Fetch user projects
  const { data: projects = [] } = useQuery({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  // Subscription upgrade mutation
  const upgradeMutation = useMutation({
    mutationFn: async (tier: string) => {
      return apiRequest("/api/user/subscription", {
        method: "POST",
        body: { tier }
      });
    },
    onSuccess: () => {
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/bots"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update subscription. Please try again.",
        variant: "destructive",
      });
    }
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  const getSubscriptionInfo = (tier: string) => {
    switch (tier) {
      case 'free':
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', icon: User };
      case 'pro':
        return { name: 'Pro Plan', color: 'bg-blue-100 text-blue-800', icon: Zap };
      case 'premium':
        return { name: 'Premium Plan', color: 'bg-purple-100 text-purple-800', icon: Crown };
      default:
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', icon: User };
    }
  };

  const getBotsBySection = (sectionId: string) => {
    return availableBots.filter(bot => bot.section === sectionId);
  };

  const getTotalBots = () => {
    switch (user.subscriptionTier) {
      case 'free': return 6;
      case 'pro': return 30;
      case 'premium': return 60;
      default: return 6;
    }
  };

  const subInfo = getSubscriptionInfo(user.subscriptionTier);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">BrandAI Pro</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge className={subInfo.color}>
                <subInfo.icon className="w-4 h-4 mr-1" />
                {subInfo.name}
              </Badge>
              
              <div className="flex items-center space-x-2">
                {user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <span className="text-sm font-medium">
                  {user.firstName || user.email?.split('@')[0] || 'User'}
                </span>
              </div>
              
              <Button variant="outline" size="sm" asChild>
                <a href="/api/logout">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.firstName || user.email?.split('@')[0] || 'User'}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your projects, access your AI bots, and track your branding progress.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bots">My Bots</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalSessions || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Bot conversations started
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <BarChart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalMessages || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    AI interactions completed
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assets Created</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalAssets || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    Generated branding assets
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Bots</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableBots.length}</div>
                  <p className="text-xs text-muted-foreground">
                    of {getTotalBots()} total bots
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions with AI bots</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.lastActive ? (
                  <p className="text-sm text-gray-600">
                    Last active: {new Date(analytics.lastActive).toLocaleDateString()}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bots Tab */}
          <TabsContent value="bots" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your AI Bots</h2>
                <p className="text-gray-600">
                  You have access to {availableBots.length} specialized AI bots
                </p>
              </div>
              {user.subscriptionTier === 'free' && (
                <Button onClick={() => upgradeMutation.mutate('pro')}>
                  Upgrade to Access More Bots
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {sections.map((section) => {
                const sectionBots = getBotsBySection(section.id);
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.gradient} flex items-center justify-center`}>
                            <section.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle>{section.name}</CardTitle>
                            <CardDescription>
                              {sectionBots.length} of {section.totalBots} bots available
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {sectionBots.length} bots
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sectionBots.map((bot) => (
                          <div 
                            key={bot.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => setLocation(`/bot/${bot.id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{bot.name}</h4>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{bot.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {bot.features.slice(0, 2).map((feature, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {/* Show locked bots for free/pro users */}
                        {user.subscriptionTier !== 'premium' && (
                          <div className="p-4 border border-dashed rounded-lg bg-gray-50 flex items-center justify-center">
                            <div className="text-center">
                              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-500">More bots available</p>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="mt-2"
                                onClick={() => upgradeMutation.mutate(user.subscriptionTier === 'free' ? 'pro' : 'premium')}
                              >
                                Upgrade Plan
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Projects</h2>
                <p className="text-gray-600">Organize your branding work by project</p>
              </div>
              <Button asChild>
                <Link href="/dashboard">
                  <Plus className="w-4 h-4 mr-2" />
                  New Project
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                      <Button size="sm" asChild>
                        <Link href={`/project/${project.id}`}>Open</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {projects.length === 0 && (
                <Card className="col-span-full">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="w-12 h-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
                    <p className="text-gray-500 text-center mb-4">
                      Create your first project to start organizing your branding work
                    </p>
                    <Button asChild>
                      <Link href="/dashboard">Create Project</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Subscription Management</h2>
              <p className="text-gray-600">Manage your plan and billing</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Current Plan */}
              <Card className={user.subscriptionTier === 'free' ? 'border-gray-200' : user.subscriptionTier === 'pro' ? 'border-blue-500' : 'border-purple-500'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Free Trial</CardTitle>
                    {user.subscriptionTier === 'free' && <Badge>Current Plan</Badge>}
                  </div>
                  <CardDescription>Perfect for trying out our platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">$0<span className="text-base font-normal">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ 1 bot per section (6 total)</li>
                    <li>✓ Unlimited conversations</li>
                    <li>✓ Basic asset generation</li>
                    <li>✓ Project management</li>
                  </ul>
                  {user.subscriptionTier !== 'free' && (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => upgradeMutation.mutate('free')}
                      disabled={upgradeMutation.isPending}
                    >
                      Downgrade
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className={user.subscriptionTier === 'pro' ? 'border-blue-500' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro Plan</CardTitle>
                    {user.subscriptionTier === 'pro' && <Badge>Current Plan</Badge>}
                  </div>
                  <CardDescription>Great for growing startups</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">$24<span className="text-base font-normal">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ 50% of all bots (30 total)</li>
                    <li>✓ Priority AI responses</li>
                    <li>✓ Advanced asset generation</li>
                    <li>✓ Analytics dashboard</li>
                    <li>✓ Email support</li>
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => upgradeMutation.mutate('pro')}
                    disabled={user.subscriptionTier === 'pro' || upgradeMutation.isPending}
                  >
                    {user.subscriptionTier === 'pro' ? 'Current Plan' : 'Choose Pro'}
                  </Button>
                </CardContent>
              </Card>

              <Card className={user.subscriptionTier === 'premium' ? 'border-purple-500' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium Plan</CardTitle>
                    {user.subscriptionTier === 'premium' && <Badge>Current Plan</Badge>}
                  </div>
                  <CardDescription>Complete branding solution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-2xl font-bold">$44<span className="text-base font-normal">/month</span></div>
                  <ul className="space-y-2 text-sm">
                    <li>✓ All 60+ bots</li>
                    <li>✓ Fastest AI responses</li>
                    <li>✓ Premium asset generation</li>
                    <li>✓ Advanced analytics</li>
                    <li>✓ Priority support</li>
                  </ul>
                  <Button 
                    className="w-full"
                    onClick={() => upgradeMutation.mutate('premium')}
                    disabled={user.subscriptionTier === 'premium' || upgradeMutation.isPending}
                  >
                    {user.subscriptionTier === 'premium' ? 'Current Plan' : 'Choose Premium'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}