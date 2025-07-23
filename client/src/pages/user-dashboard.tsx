import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import { sections, BotDefinition, getAvailableBots, getBotsBySection, hasAccessToBot, bots } from "@/lib/bot-definitions";
import { Link, useLocation } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
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
  PenTool,
  ChevronDown,
  ChevronRight,
  Trash2,
  MoreVertical,
  Target,
  Search,
  Mail,
  Eye,
  Star,
  Rocket,
  Map,
  Calculator,
  MessageCircle,
  Type,
  Building,
  FolderOpen,
  Shield,
  Briefcase,
  Video,
  BarChart3,
  PieChart,
  Lightbulb,
  BookOpen,
  Mic,
  Image,
  Volume2,
  Gauge
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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

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

  // Fetch recent activity
  const { data: recentActivity = [] } = useQuery<any[]>({
    queryKey: ["/api/user/recent-activity"],
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
      const data = await response.json();
      
      // Check if payment is required
      if (response.status === 402 && data.requiresPayment) {
        // Redirect to checkout page with the tier
        setLocation(`/checkout?tier=${tier}`);
        return data;
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Only show success if payment wasn't required
      if (!data.requiresPayment) {
        toast({
          title: "Subscription Updated",
          description: "Your subscription has been updated successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        queryClient.invalidateQueries({ queryKey: ["/api/user/bots"] });
      }
    },
    onError: (error) => {
      // Don't show error for payment required responses
      if (!error.message.includes("402")) {
        toast({
          title: "Error",
          description: "Failed to update subscription. Please try again.",
          variant: "destructive",
        });
      }
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

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (projectId: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setProjectToDelete(null);
      toast({
        title: "Project deleted!",
        description: "The project and all its sessions have been deleted."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
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
      <MainNavigation />
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50" style={{ display: 'none' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Sage-Startups</span>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bots">Tools</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
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
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div 
                        key={activity.id} 
                        className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                        onClick={() => {
                          // Find the project that contains this session
                          const project = projects.find(p => p.name === activity.projectName);
                          if (project) {
                            setLocation(`/bot/${activity.botId}?project=${project.id}&session=${activity.id}`);
                          }
                        }}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Zap className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {activity.headline}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <span className="truncate">{activity.projectName}</span>
                            <span className="mx-1">•</span>
                            <span>{new Date(activity.createdAt).toLocaleDateString()}</span>
                            <span className="mx-1">•</span>
                            <span>{activity.messagesCount} messages</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Zap className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400">Start a conversation with an AI tool to see activity here</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tools Tab (formerly Bots) */}
          <TabsContent value="bots" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">AI Tools</h2>
                <p className="text-gray-600">
                  You have access to {availableBots.length} specialized AI tools
                </p>
              </div>
              {userSubscriptionTier === 'free' && (
                <Button onClick={() => upgradeMutation.mutate('pro')}>
                  Upgrade to Access More Tools
                </Button>
              )}
            </div>

            <div className="space-y-4">
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
                const isExpanded = expandedSections.includes(section.id);
                
                return (
                  <Card key={section.id}>
                    <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
                      <CollapsibleTrigger className="w-full">
                        <CardHeader className="hover:bg-gray-50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center`}>
                                <IconComponent className="w-6 h-6 text-blue-600" />
                              </div>
                              <div className="text-left">
                                <CardTitle className="flex items-center">
                                  {section.name}
                                  {isExpanded ? (
                                    <ChevronDown className="w-4 h-4 ml-2 text-gray-500" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 ml-2 text-gray-500" />
                                  )}
                                </CardTitle>
                                <CardDescription>
                                  {availableSectionBots.length} of {allSectionBots.length} tools available
                                </CardDescription>
                              </div>
                            </div>
                            <Badge variant="secondary">
                              {allSectionBots.length} total
                            </Badge>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Available bots */}
                        {availableSectionBots.map((bot: any) => {
                          // Get icon for each bot
                          const getBotIcon = (iconName: string) => {
                            const iconMap: { [key: string]: any } = {
                              'chess': Target,
                              'search': Search,
                              'envelope': Mail,
                              'calendar': Calendar,
                              'eye': Eye,
                              'star': Star,
                              'rocket': Rocket,
                              'route': Map,
                              'chart-up': TrendingUp,
                              'calculator': Calculator,
                              'palette': Palette,
                              'comment': MessageCircle,
                              'swatches': Palette,
                              'font': Type,
                              'pencil': PenTool,
                              'building': Building,
                              'megaphone': Megaphone,
                              'folder': FolderOpen,
                              'shield': Shield,
                              'briefcase': Briefcase,
                              'bullseye': Target,
                              'video': Video,
                              'newspaper': FileText,
                              'chart-bar': BarChart3,
                              'bar-chart': BarChart3,
                              'chart-pie': PieChart,
                              'lightbulb': Lightbulb,
                              'book': BookOpen,
                              'users': Users,
                              'microphone': Mic,
                              'image': Image,
                              'speaker': Volume2,
                              'gauge': Gauge
                            };
                            return iconMap[iconName] || Zap;
                          };
                          
                          const BotIcon = getBotIcon(bot.icon);
                          
                          return (
                            <div 
                              key={bot.id}
                              className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                              onClick={() => setLocation(`/bot/${bot.id}`)}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <BotIcon className="w-4 h-4 text-gray-600" />
                                  <h4 className="font-medium text-gray-900">{bot.name}</h4>
                                </div>
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
                          );
                        })}
                        
                        {/* Locked bots */}
                        {lockedSectionBots.map((bot: any) => {
                          // Get icon for each bot
                          const getBotIcon = (iconName: string) => {
                            const iconMap: { [key: string]: any } = {
                              'chess': Target,
                              'search': Search,
                              'envelope': Mail,
                              'calendar': Calendar,
                              'eye': Eye,
                              'star': Star,
                              'rocket': Rocket,
                              'route': Map,
                              'chart-up': TrendingUp,
                              'calculator': Calculator,
                              'palette': Palette,
                              'comment': MessageCircle,
                              'swatches': Palette,
                              'font': Type,
                              'pencil': PenTool,
                              'building': Building,
                              'megaphone': Megaphone,
                              'folder': FolderOpen,
                              'shield': Shield,
                              'briefcase': Briefcase,
                              'bullseye': Target,
                              'video': Video,
                              'newspaper': FileText,
                              'chart-bar': BarChart3,
                              'bar-chart': BarChart3,
                              'chart-pie': PieChart,
                              'lightbulb': Lightbulb,
                              'book': BookOpen,
                              'users': Users,
                              'microphone': Mic,
                              'image': Image,
                              'speaker': Volume2,
                              'gauge': Gauge
                            };
                            return iconMap[iconName] || Zap;
                          };
                          
                          const BotIcon = getBotIcon(bot.icon);
                          
                          return (
                            <div 
                              key={`locked-${bot.id}`}
                              className="p-4 border border-dashed rounded-lg bg-gray-50 relative opacity-60"
                            >
                              <div className="absolute top-2 right-2">
                                <Lock className="w-4 h-4 text-gray-400" />
                              </div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <BotIcon className="w-4 h-4 text-gray-500" />
                                  <h4 className="font-medium text-gray-500">{bot.name}</h4>
                                </div>
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
                          );
                        })}
                        </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
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
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{project.name}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => setProjectToDelete(project)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Project
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
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
        </Tabs>
        
        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Project</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{projectToDelete?.name}"? This will permanently delete the project and all its sessions, conversations, and generated content. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => projectToDelete && deleteProjectMutation.mutate(projectToDelete.id)}
                className="bg-red-600 hover:bg-red-700"
                disabled={deleteProjectMutation.isPending}
              >
                {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}