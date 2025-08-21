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
import { EmailMarketingAssistant } from "@/components/bot-interfaces/EmailMarketingAssistant";
import { ContentCalendarPlanner } from "@/components/bot-interfaces/ContentCalendarPlanner";
import { CompetitorAnalysisBot } from "@/components/bot-interfaces/CompetitorAnalysisBot";
import { InfluencerOutreachBot } from "@/components/bot-interfaces/InfluencerOutreachBot";
import { ProductLaunchPlanner } from "@/components/bot-interfaces/ProductLaunchPlanner";
import { CustomerJourneyMapper } from "@/components/bot-interfaces/CustomerJourneyMapper";
import { ConversionRateOptimizer } from "@/components/bot-interfaces/ConversionRateOptimizer";
import { MarketingBudgetPlanner } from "@/components/bot-interfaces/MarketingBudgetPlanner";
import { BlogPostGenerator } from "@/components/bot-interfaces/BlogPostGenerator";
import { TopicResearchBot } from "@/components/bot-interfaces/TopicResearchBot";
import { SEOArticleOptimizer } from "@/components/bot-interfaces/SEOArticleOptimizer";
import { EditorialCalendar } from "@/components/bot-interfaces/EditorialCalendar";
import { HeadlineGenerator } from "@/components/bot-interfaces/HeadlineGenerator";
import { ContentRepurposer } from "@/components/bot-interfaces/ContentRepurposer";
import { ProofreadingAssistant } from "@/components/bot-interfaces/ProofreadingAssistant";
import { MetaDescriptionWriter } from "@/components/bot-interfaces/MetaDescriptionWriter";
import { GuestPostOutreach } from "@/components/bot-interfaces/GuestPostOutreach";
import { ContentPerformanceTracker } from "@/components/bot-interfaces/ContentPerformanceTracker";
import { ColorPaletteCreator } from "@/components/bot-interfaces/ColorPaletteCreator";
import { TypographySelector } from "@/components/bot-interfaces/TypographySelector";
import { BrandGuidelinesBuilder } from "@/components/bot-interfaces/BrandGuidelinesBuilder";
import { TaglineGenerator } from "@/components/bot-interfaces/TaglineGenerator";
import { BrandStoryWriter } from "@/components/bot-interfaces/BrandStoryWriter";
import { VisualIdentitySystem } from "@/components/bot-interfaces/VisualIdentitySystem";
import { BrandPositioningBot } from "@/components/bot-interfaces/BrandPositioningBot";
import { RebrandingConsultant } from "@/components/bot-interfaces/RebrandingConsultant";
import { AudienceTargetingAssistant } from "@/components/bot-interfaces/AudienceTargetingAssistant";
import { BudgetOptimizer } from "@/components/bot-interfaces/BudgetOptimizer";
import { ABTestDesigner } from "@/components/bot-interfaces/ABTestDesigner";
import { LandingPageBuilder } from "@/components/bot-interfaces/LandingPageBuilder";
import { VideoAdScripter } from "@/components/bot-interfaces/VideoAdScripter";
import { DisplayAdDesigner } from "@/components/bot-interfaces/DisplayAdDesigner";
import { RetargetingStrategist } from "@/components/bot-interfaces/RetargetingStrategist";
import { AdPerformanceAnalyzer } from "@/components/bot-interfaces/AdPerformanceAnalyzer";
import { PerformanceDashboard } from "@/components/bot-interfaces/PerformanceDashboard";
import { InsightsGenerator } from "@/components/bot-interfaces/InsightsGenerator";
import { ROICalculator } from "@/components/bot-interfaces/ROICalculator";
import { TrendAnalyser } from "@/components/bot-interfaces/TrendAnalyser";
import { CustomerReportBuilder } from "@/components/bot-interfaces/CustomerReportBuilder";
import { CompetitorBenchmarking } from "@/components/bot-interfaces/CompetitorBenchmarking";
import { PredictiveAnalytics } from "@/components/bot-interfaces/PredictiveAnalytics";
import { AttributionModeler } from "@/components/bot-interfaces/AttributionModeler";
import { AudienceSegmenter } from "@/components/bot-interfaces/AudienceSegmenter";
import { DataVisualizer } from "@/components/bot-interfaces/DataVisualizer";
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

  // Message sending mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!activeSessionId) throw new Error('No active session');
      const response = await apiRequest('POST', `/api/sessions/${activeSessionId}/messages`, {
        content: message,
        role: 'user'
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate messages to refresh the chat
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', activeSessionId, 'messages'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSendMessage = (message: string) => {
    if (!activeSessionId) {
      toast({
        title: "No active session",
        description: "Please start a session first to send messages.",
        variant: "destructive"
      });
      return;
    }
    sendMessageMutation.mutate(message);
  };

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
                <Button variant="outline" size="lg" onClick={() => window.history.back()} className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
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
      // Get project name for context
      const project = projects.find(p => p.id === parseInt(selectedProjectId));
      const projectName = project?.name || "Project";
      
      // Generate a more descriptive session title based on bot type
      let sessionTitle = `${bot.name}`;
      
      // Add context based on bot type
      switch (bot.id) {
        case 'logo-design':
          sessionTitle = `Logo Design for ${projectName}`;
          break;
        case 'marketing-strategy':
          sessionTitle = `Marketing Strategy for ${projectName}`;
          break;
        case 'brand-voice':
          sessionTitle = `Brand Voice for ${projectName}`;
          break;
        case 'content-creator':
          sessionTitle = `Content Creation for ${projectName}`;
          break;
        case 'seo-expert':
          sessionTitle = `SEO Analysis for ${projectName}`;
          break;
        case 'ad-copy':
          sessionTitle = `Ad Copy for ${projectName}`;
          break;
        case 'creative-concept':
          sessionTitle = `Creative Concepts for ${projectName}`;
          break;
        case 'email-marketing':
          sessionTitle = `Email Campaigns for ${projectName}`;
          break;
        case 'content-calendar':
          sessionTitle = `Content Calendar for ${projectName}`;
          break;
        case 'competitor-analysis':
          sessionTitle = `Competitor Analysis for ${projectName}`;
          break;
        case 'influencer-outreach':
          sessionTitle = `Influencer Strategy for ${projectName}`;
          break;
        case 'product-launch':
          sessionTitle = `Product Launch Plan for ${projectName}`;
          break;
        case 'customer-journey':
          sessionTitle = `Customer Journey Map for ${projectName}`;
          break;
        case 'conversion-optimizer':
          sessionTitle = `CRO Analysis for ${projectName}`;
          break;
        case 'budget-planner':
          sessionTitle = `Marketing Budget for ${projectName}`;
          break;
        case 'blog-generator':
          sessionTitle = `Blog Content for ${projectName}`;
          break;
        case 'topic-research':
          sessionTitle = `Topic Research for ${projectName}`;
          break;
        case 'seo-optimizer':
          sessionTitle = `SEO Optimization for ${projectName}`;
          break;
        case 'editorial-calendar':
          sessionTitle = `Editorial Calendar for ${projectName}`;
          break;
        case 'headline-generator':
          sessionTitle = `Headlines for ${projectName}`;
          break;
        case 'content-repurposer':
          sessionTitle = `Content Repurposing for ${projectName}`;
          break;
        case 'proofreading':
          sessionTitle = `Proofreading for ${projectName}`;
          break;
        case 'meta-descriptions':
          sessionTitle = `Meta Descriptions for ${projectName}`;
          break;
        case 'guest-posting':
          sessionTitle = `Guest Post Strategy for ${projectName}`;
          break;
        case 'content-performance':
          sessionTitle = `Content Analytics for ${projectName}`;
          break;
        case 'color-palette':
          sessionTitle = `Color Palette for ${projectName}`;
          break;
        case 'typography-selector':
          sessionTitle = `Typography Selection for ${projectName}`;
          break;
        case 'brand-guidelines':
          sessionTitle = `Brand Guidelines for ${projectName}`;
          break;
        case 'tagline-generator':
          sessionTitle = `Tagline Generation for ${projectName}`;
          break;
        case 'brand-story':
          sessionTitle = `Brand Story for ${projectName}`;
          break;
        case 'visual-identity':
          sessionTitle = `Visual Identity System for ${projectName}`;
          break;
        case 'brand-positioning':
          sessionTitle = `Brand Positioning for ${projectName}`;
          break;
        case 'rebranding-consultant':
          sessionTitle = `Rebranding Strategy for ${projectName}`;
          break;
        case 'audience-targeting':
          sessionTitle = `Audience Targeting for ${projectName}`;
          break;
        case 'budget-optimizer':
          sessionTitle = `Budget Optimization for ${projectName}`;
          break;
        case 'ab-testing':
          sessionTitle = `A/B Testing for ${projectName}`;
          break;
        case 'landing-pages':
          sessionTitle = `Landing Page for ${projectName}`;
          break;
        default:
          sessionTitle = `${bot.name} - ${projectName}`;
      }
      
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
            <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          
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

            {/* Bot Interfaces - Show forms immediately when activeSessionId exists */}
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
            {(bot.id === 'seo-content' || bot.id === 'keyword-research' || bot.id === 'seo-expert') && (
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
            
            {/* Email Marketing Assistant */}
            {bot.id === 'email-marketing' && (
              <EmailMarketingAssistant 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Content Calendar Planner */}
            {bot.id === 'content-calendar' && (
              <ContentCalendarPlanner 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Competitor Analysis Bot */}
            {bot.id === 'competitor-analysis' && (
              <CompetitorAnalysisBot 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Influencer Outreach Bot */}
            {bot.id === 'influencer-outreach' && (
              <InfluencerOutreachBot 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Product Launch Planner */}
            {bot.id === 'product-launch' && (
              <ProductLaunchPlanner 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Customer Journey Mapper */}
            {bot.id === 'customer-journey' && (
              <CustomerJourneyMapper 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Conversion Rate Optimizer */}
            {bot.id === 'conversion-optimizer' && (
              <ConversionRateOptimizer 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Marketing Budget Planner */}
            {bot.id === 'budget-planner' && (
              <MarketingBudgetPlanner 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Blog Post Generator */}
            {bot.id === 'blog-generator' && (
              <BlogPostGenerator 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Topic Research Bot */}
            {bot.id === 'topic-research' && (
              <TopicResearchBot 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* SEO Article Optimizer */}
            {bot.id === 'seo-optimizer' && (
              <SEOArticleOptimizer 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Editorial Calendar */}
            {bot.id === 'editorial-calendar' && (
              <EditorialCalendar 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Headline Generator */}
            {bot.id === 'headline-generator' && (
              <HeadlineGenerator 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Content Repurposer */}
            {bot.id === 'content-repurposer' && (
              <ContentRepurposer 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Proofreading Assistant */}
            {bot.id === 'proofreading' && (
              <ProofreadingAssistant 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Meta Description Writer */}
            {bot.id === 'meta-descriptions' && (
              <MetaDescriptionWriter 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Guest Post Outreach */}
            {bot.id === 'guest-posting' && (
              <GuestPostOutreach 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Content Performance Tracker */}
            {bot.id === 'content-performance' && (
              <ContentPerformanceTracker 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Color Palette Creator */}
            {bot.id === 'color-palette' && (
              <ColorPaletteCreator 
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
                sessionId={activeSessionId}
              />
            )}
            
            {/* Typography Selector */}
            {bot.id === 'typography-selector' && (
              <TypographySelector 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Brand Guidelines Builder */}
            {bot.id === 'brand-guidelines' && (
              <BrandGuidelinesBuilder 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Tagline Generator */}
            {bot.id === 'tagline-generator' && (
              <TaglineGenerator 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Brand Story Writer */}
            {bot.id === 'brand-story' && (
              <BrandStoryWriter 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Visual Identity System */}
            {bot.id === 'visual-identity' && (
              <VisualIdentitySystem 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Brand Positioning Bot */}
            {bot.id === 'brand-positioning' && (
              <BrandPositioningBot 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Rebranding Consultant */}
            {bot.id === 'rebranding-consultant' && (
              <RebrandingConsultant 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}

            {/* Advertising Bots */}
            {/* Audience Targeting Assistant */}
            {bot.id === 'audience-targeting' && (
              <AudienceTargetingAssistant 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Budget Optimizer */}
            {bot.id === 'budget-optimizer' && (
              <BudgetOptimizer 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* A/B Test Designer */}
            {bot.id === 'ab-testing' && (
              <ABTestDesigner 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Landing Page Builder */}
            {bot.id === 'landing-pages' && (
              <LandingPageBuilder 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Video Ad Scripter */}
            {bot.id === 'video-scripts' && (
              <VideoAdScripter 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Display Ad Designer */}
            {bot.id === 'display-ads' && (
              <DisplayAdDesigner 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Retargeting Strategist */}
            {bot.id === 'retargeting' && (
              <RetargetingStrategist 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Ad Performance Analyzer */}
            {bot.id === 'performance-analyzer' && (
              <AdPerformanceAnalyzer 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}

            {/* Analytics Bots */}
            {/* Performance Dashboard */}
            {bot.id === 'performance-dashboard' && (
              <PerformanceDashboard 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Insights Generator */}
            {bot.id === 'insights-generator' && (
              <InsightsGenerator 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* ROI Calculator */}
            {bot.id === 'roi-calculator' && (
              <ROICalculator 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Trend Analyser */}
            {bot.id === 'trend-analysis' && (
              <TrendAnalyser 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Customer Report Builder */}
            {bot.id === 'customer-reports' && (
              <CustomerReportBuilder 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Competitor Benchmarking */}
            {bot.id === 'competitor-benchmarking' && (
              <CompetitorBenchmarking 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Predictive Analytics */}
            {bot.id === 'predictive-analytics' && (
              <PredictiveAnalytics 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Attribution Modeler */}
            {bot.id === 'attribution-modeling' && (
              <AttributionModeler 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Audience Segmenter */}
            {bot.id === 'audience-segmentation' && (
              <AudienceSegmenter 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Data Visualizer */}
            {bot.id === 'data-visualization' && (
              <DataVisualizer 
                sessionId={activeSessionId}
                onSendMessage={handleSendMessage}
                isLoading={sendMessageMutation.isPending}
              />
            )}
            
            {/* Default Enhanced Bot Interface for others */}
            {!['marketing-strategy', 'brand-identity', 'content-creator', 'blog-writer', 'social-media', 'seo-content', 'keyword-research', 'seo-expert', 'logo-design', 'brand-voice', 'ad-copy', 'creative-concept', 'email-marketing', 'content-calendar', 'competitor-analysis', 'influencer-outreach', 'product-launch', 'customer-journey', 'conversion-optimizer', 'budget-planner', 'blog-generator', 'topic-research', 'seo-optimizer', 'editorial-calendar', 'headline-generator', 'content-repurposer', 'proofreading', 'meta-descriptions', 'guest-posting', 'content-performance', 'color-palette', 'typography-selector', 'brand-guidelines', 'tagline-generator', 'brand-story', 'visual-identity', 'brand-positioning', 'rebranding-consultant', 'audience-targeting', 'budget-optimizer', 'ab-testing', 'landing-pages', 'video-scripts', 'display-ads', 'retargeting', 'performance-analyzer', 'performance-dashboard', 'insights-generator', 'roi-calculator', 'trend-analysis', 'customer-reports', 'competitor-benchmarking', 'predictive-analytics', 'attribution-modeling', 'audience-segmentation', 'data-visualization'].includes(bot.id) && (
              <EnhancedBotInterface 
                sessionId={activeSessionId}
                botName={bot.name}
                botId={bot.id}
                botColor={bot.color}
              />
            )}

            {/* Show initial message only when no session is active and no project selected */}
            {!activeSessionId && (
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
                      {!selectedProjectId ? 
                        `Select a project and start a new session to begin your AI-powered ${bot.section} workflow.` :
                        `Click "Start New Session" to begin your AI-powered ${bot.section} workflow.`
                      }
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
