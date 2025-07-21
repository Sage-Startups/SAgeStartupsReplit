import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import { sections, BotDefinition, getAvailableBots, getBotsBySection, hasAccessToBot, bots } from "@/lib/bot-definitions";
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
  Lock,
  Megaphone,
  Palette,
  Monitor,
  Users,
  PenTool
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
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // Get available bots based on subscription tier
  const userSubscriptionTier = (user as any)?.subscriptionTier || 'free';
  const availableBots = getAvailableBots(userSubscriptionTier);
  
  // Total bots function
  const getTotalBots = () => {
    return sections.reduce((total, section) => {
      return total + getBotsBySection(section.id).length;
    }, 0);
  };

  // Fetch user analytics
  const { data: analytics } = useQuery<UserAnalytics>({
    queryKey: ["/api/user/analytics"],
    enabled: !!user
  });

  // Fetch user projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    enabled: !!user,
  });

  // Subscription upgrade mutation
  const upgradeMutation = useMutation({
    mutationFn: async (tier: string) => {
      const response = await apiRequest("POST", "/api/user/subscription", { tier });
      return response.json();
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

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/projects', data);
      return response.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsCreateProjectDialogOpen(false);
      setProjectName("");
      setProjectDescription("");
      toast({
        title: "Project created!",
        description: "Your new project has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    
    createProjectMutation.mutate({
      name: projectName.trim(),
      description: projectDescription.trim() || undefined
    });
  };

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





  const subInfo = getSubscriptionInfo((user as any)?.subscriptionTier || 'free');

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
                {(user as any)?.profileImageUrl ? (
                  <img 
                    src={(user as any).profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                )}
                <span className="text-sm font-medium">
                  {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}
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
            Welcome back, {(user as any)?.firstName || (user as any)?.email?.split('@')[0] || 'User'}!
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
              {userSubscriptionTier === 'free' && (
                <Button onClick={() => upgradeMutation.mutate('pro')}>
                  Upgrade to Access More Bots
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {sections.map((section) => {
                // Get icon component mapping
                const getIconComponent = (iconName: string) => {
                  const iconMap: { [key: string]: any } = {
                    'bullhorn': Megaphone,
                    'palette': Palette,
                    'ad': Monitor,
                    'users': Users,
                    'pen-nib': PenTool,
                    'chart-line': TrendingUp
                  };
                  return iconMap[iconName] || Zap;
                };
                
                const IconComponent = getIconComponent(section.icon);
                const allSectionBots = getBotsBySection(section.id);
                const availableSectionBots = allSectionBots.filter(bot => hasAccessToBot(bot.id, userSubscriptionTier));
                const lockedSectionBots = allSectionBots.filter(bot => !hasAccessToBot(bot.id, userSubscriptionTier));
                
                return (
                  <Card key={section.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle>{section.name}</CardTitle>
                            <CardDescription>
                              {availableSectionBots.length} of {allSectionBots.length} bots available
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {allSectionBots.length} total
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Available bots */}
                        {availableSectionBots.map((bot: any) => (
                          <div 
                            key={bot.id}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                            onClick={() => setLocation(`/bot/${bot.id}`)}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{bot.name}</h4>
                              <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{bot.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {bot.features?.slice(0, 2).map((feature: any, i: number) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {/* Locked bots */}
                        {lockedSectionBots.map((bot: any) => (
                          <div 
                            key={`locked-${bot.id}`}
                            className="p-4 border border-dashed rounded-lg bg-gray-50 relative opacity-60"
                          >
                            <div className="absolute top-2 right-2">
                              <Lock className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-500">{bot.name}</h4>
                            </div>
                            <p className="text-sm text-gray-500 mb-3">{bot.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
                                {userSubscriptionTier === 'free' ? 'Pro Required' : 'Premium Required'}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-6"
                                onClick={() => upgradeMutation.mutate(userSubscriptionTier === 'free' ? 'pro' : 'premium')}
                              >
                                Upgrade
                              </Button>
                            </div>
                          </div>
                        ))}
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
              <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                      Create a new project to organize your branding work
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleCreateProject}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                          Project Name
                        </label>
                        <input
                          type="text"
                          id="projectName"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Enter project name"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                          Description (Optional)
                        </label>
                        <textarea
                          id="projectDescription"
                          value={projectDescription}
                          onChange={(e) => setProjectDescription(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Describe your project"
                        />
                      </div>
                    </div>
                    <DialogFooter className="mt-6">
                      <Button type="button" variant="outline" onClick={() => setIsCreateProjectDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={!projectName.trim() || createProjectMutation.isPending}>
                        {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: Project) => (
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
                    <Button onClick={() => setIsCreateProjectDialogOpen(true)}>
                      Create Project
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
              <Card className={(user as any)?.subscriptionTier === 'free' ? 'border-gray-200' : (user as any)?.subscriptionTier === 'pro' ? 'border-blue-500' : 'border-purple-500'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Free Trial</CardTitle>
                    {(user as any)?.subscriptionTier === 'free' && <Badge>Current Plan</Badge>}
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
                  {(user as any)?.subscriptionTier !== 'free' && (
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

              <Card className={(user as any)?.subscriptionTier === 'pro' ? 'border-blue-500' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Pro Plan</CardTitle>
                    {(user as any)?.subscriptionTier === 'pro' && <Badge>Current Plan</Badge>}
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
                    disabled={(user as any)?.subscriptionTier === 'pro' || upgradeMutation.isPending}
                  >
                    {(user as any)?.subscriptionTier === 'pro' ? 'Current Plan' : 'Choose Pro'}
                  </Button>
                </CardContent>
              </Card>

              <Card className={(user as any)?.subscriptionTier === 'premium' ? 'border-purple-500' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium Plan</CardTitle>
                    {(user as any)?.subscriptionTier === 'premium' && <Badge>Current Plan</Badge>}
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
                    disabled={(user as any)?.subscriptionTier === 'premium' || upgradeMutation.isPending}
                  >
                    {(user as any)?.subscriptionTier === 'premium' ? 'Current Plan' : 'Choose Premium'}
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