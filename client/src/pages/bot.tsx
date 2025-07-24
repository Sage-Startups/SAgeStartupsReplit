import { useState, useEffect } from "react";
import { useParams, Link, useSearch, useLocation } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
import { EnhancedBotInterface } from "@/components/enhanced-bot-interface";
import { MarketingStrategyBot } from "@/components/bot-interfaces/MarketingStrategyBot";
import { BrandingBot } from "@/components/bot-interfaces/BrandingBot";
import { ContentCreatorBot } from "@/components/bot-interfaces/ContentCreatorBot";
import { SEOExpertBot } from "@/components/bot-interfaces/SEOExpertBot";
import { LogoDesignBot } from "@/components/bot-interfaces/LogoDesignBot";
import { BrandVoiceBot } from "@/components/bot-interfaces/BrandVoiceBot";
import AdCopyGeneratorBot from "@/components/bot-interfaces/AdCopyGeneratorBot";
import CreativeConceptBot from "@/components/bot-interfaces/CreativeConceptBot";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Plus, FolderOpen, Sparkles, Lock, Crown } from "lucide-react";
import { getBotById, hasAccessToBot } from "@/lib/bot-definitions";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, BotSession } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Bot() {
  const { botId } = useParams();
  const searchParams = useSearch();
  const [, setLocation] = useLocation();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [activeSessionId, setActiveSessionId] = useState<number | null>(null);
  const [isCreateProjectDialogOpen, setIsCreateProjectDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Parse URL parameters to load existing session
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    const projectParam = params.get('project');
    const sessionParam = params.get('session');
    
    if (projectParam) {
      setSelectedProjectId(projectParam);
    }
    if (sessionParam) {
      setActiveSessionId(parseInt(sessionParam));
    }
  }, [searchParams]);

  if (!botId) {
    return <div>Bot not found</div>;
  }

  const bot = getBotById(botId);

  // Check if user has access to this bot
  const userSubscriptionTier = (user as any)?.subscriptionTier || 'free';
  const hasAccess = hasAccessToBot(botId, userSubscriptionTier);

  // Redirect to pricing page if user doesn't have access
  useEffect(() => {
    if (!authLoading && user && !hasAccess) {
      setLocation('/');
      toast({
        title: "Upgrade Required",
        description: `This bot requires a ${bot?.section === 'marketing' || bot?.section === 'branding' ? 'Pro' : 'Premium'} subscription. Please upgrade to access this feature.`,
        variant: "destructive",
      });
    }
  }, [authLoading, user, hasAccess, setLocation, toast, bot]);

  if (!bot) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Bot not found</h1>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show access denied page if user doesn't have access
  if (!authLoading && user && !hasAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Upgrade Required</h1>
              <p className="text-gray-600 mb-6">
                The <strong>{bot.name}</strong> requires a {userSubscriptionTier === 'free' ? 'Pro or Premium' : 'Premium'} subscription to access.
              </p>
              <div className="space-y-3">
                <Button size="lg" onClick={() => setLocation('/')} className="w-full">
                  <Crown className="w-4 h-4 mr-2" />
                  View Pricing Plans
                </Button>
                <Button variant="outline" size="lg" onClick={() => setLocation('/')} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects']
  });

  const { data: sessions = [] } = useQuery<BotSession[]>({
    queryKey: ['/api/projects', selectedProjectId, 'sessions'],
    enabled: !!selectedProjectId
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const response = await apiRequest('POST', '/api/projects', data);
      return response.json();
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setSelectedProjectId(newProject.id.toString());
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

  const createSessionMutation = useMutation({
    mutationFn: async (projectId: number) => {
      // Generate a descriptive session title
      const sessionTitle = `${bot.name} Session`;
      
      const response = await apiRequest('POST', `/api/projects/${projectId}/sessions`, {
        botId: bot.id,
        botName: bot.name,
        section: bot.section,
        sessionTitle
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', selectedProjectId, 'sessions'] });
      setActiveSessionId(newSession.id);
      toast({
        title: "Session started!",
        description: `Started new ${bot.name} session.`
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start bot session. Please try again.",
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

  const handleStartNewSession = () => {
    if (!selectedProjectId) {
      toast({
        title: "Select a project",
        description: "Please select a project first to start a bot session.",
        variant: "destructive"
      });
      return;
    }
    createSessionMutation.mutate(parseInt(selectedProjectId));
  };

  const getColorClass = () => {
    switch (bot.color) {
      case 'text-primary': return 'primary';
      case 'text-secondary': return 'secondary';
      case 'text-success': return 'success';
      case 'text-warning': return 'warning';
      case 'text-danger': return 'danger';
      case 'text-accent': return 'accent';
      default: return 'primary';
    }
  };

  const botSessions = sessions.filter((session: BotSession) => session.botId === bot.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/section/${bot.section}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to {bot.section.charAt(0).toUpperCase() + bot.section.slice(1)}
            </Button>
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                bot.color === 'text-primary' ? 'bg-primary' : 
                bot.color === 'text-secondary' ? 'bg-secondary' : 
                bot.color === 'text-success' ? 'bg-success' : 
                bot.color === 'text-warning' ? 'bg-warning' : 
                bot.color === 'text-danger' ? 'bg-danger' : 
                'bg-accent'
              }`}>
                <i className={`fas fa-${bot.icon} text-white text-2xl`}></i>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{bot.name}</h1>
                <p className="text-gray-600 text-lg mb-4">{bot.description}</p>
                <Badge variant="secondary" className="mb-4">
                  {bot.section.charAt(0).toUpperCase() + bot.section.slice(1)} Bot
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Bot Info & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Bot Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {bot.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Project Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FolderOpen className="w-5 h-5 mr-2" />
                  Project Selection
                </CardTitle>
                <CardDescription>
                  Choose a project to organize your bot sessions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-select">Select Project</Label>
                  <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project: Project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Dialog open={isCreateProjectDialogOpen} onOpenChange={setIsCreateProjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Project</DialogTitle>
                      <DialogDescription>
                        Create a project to organize your {bot.name} sessions.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateProject}>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name">Project Name</Label>
                          <Input
                            id="name"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            placeholder="e.g., EcoTech Solutions Brand Development"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description (Optional)</Label>
                          <Textarea
                            id="description"
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Brief description of your project goals..."
                          />
                        </div>
                      </div>
                      <DialogFooter className="mt-6">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsCreateProjectDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={!projectName.trim() || createProjectMutation.isPending}
                        >
                          Create Project
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <Button 
                  onClick={handleStartNewSession}
                  disabled={!selectedProjectId || createSessionMutation.isPending}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start New Session
                </Button>
              </CardContent>
            </Card>

            {/* Previous Sessions */}
            {selectedProjectId && botSessions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Previous Sessions</CardTitle>
                  <CardDescription>
                    Continue from where you left off
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {botSessions.map((session: BotSession) => (
                      <Button
                        key={session.id}
                        variant={activeSessionId === session.id ? "default" : "outline"}
                        className="w-full justify-start"
                        onClick={() => setActiveSessionId(session.id)}
                      >
                        <div className="text-left">
                          <div className="font-medium">
                            {(session as any).sessionTitle || `${bot.name} Session`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(session.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content - Chat Interface */}
          <div className="lg:col-span-2">
            {activeSessionId ? (
              <>
                {/* Marketing Strategy Bot */}
                {bot.id === 'marketing-strategy' && (
                  <MarketingStrategyBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* Brand Identity Bot */}
                {bot.id === 'brand-identity' && (
                  <BrandingBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* Content Creator Bot */}
                {(bot.id === 'content-creator' || bot.id === 'blog-writer' || bot.id === 'social-media') && (
                  <ContentCreatorBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* SEO Expert Bot */}
                {(bot.id === 'seo-content' || bot.id === 'keyword-research') && (
                  <SEOExpertBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* Logo Design Bot */}
                {bot.id === 'logo-design' && (
                  <LogoDesignBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* Brand Voice Bot */}
                {bot.id === 'brand-voice' && (
                  <BrandVoiceBot 
                    sessionId={activeSessionId}
                    botName={bot.name}
                  />
                )}
                
                {/* Ad Copy Generator Bot */}
                {bot.id === 'ad-copy' && (
                  <AdCopyGeneratorBot 
                    sessionId={activeSessionId}
                  />
                )}
                
                {/* Creative Concept Bot */}
                {bot.id === 'creative-concept' && (
                  <CreativeConceptBot 
                    sessionId={activeSessionId}
                  />
                )}
                
                {/* Default Enhanced Bot Interface for others */}
                {!['marketing-strategy', 'brand-identity', 'content-creator', 'blog-writer', 'social-media', 'seo-content', 'keyword-research', 'logo-design', 'brand-voice', 'ad-copy', 'creative-concept'].includes(bot.id) && (
                  <EnhancedBotInterface 
                    sessionId={activeSessionId}
                    botName={bot.name}
                    botId={bot.id}
                    botColor={bot.color}
                  />
                )}
              </>
            ) : (
              <Card className="h-96">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                      bot.color === 'text-primary' ? 'bg-primary' : 
                      bot.color === 'text-secondary' ? 'bg-secondary' : 
                      bot.color === 'text-success' ? 'bg-success' : 
                      bot.color === 'text-warning' ? 'bg-warning' : 
                      bot.color === 'text-danger' ? 'bg-danger' : 
                      'bg-accent'
                    }`}>
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to start with {bot.name}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Select a project and start a new session to begin your AI-powered {bot.section} workflow.
                    </p>
                    {!selectedProjectId && (
                      <p className="text-sm text-amber-600">
                        Please select a project first to get started.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
