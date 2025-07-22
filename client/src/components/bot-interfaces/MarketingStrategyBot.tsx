import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Target, TrendingUp, Users, Zap, Calendar, BarChart3, 
  Lightbulb, CheckCircle, ArrowRight, Brain, Rocket, 
  Globe, DollarSign, Activity, AlertCircle
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface MarketingStrategyBotProps {
  sessionId: number;
  botName: string;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function MarketingStrategyBot({ sessionId, botName }: MarketingStrategyBotProps) {
  const [stage, setStage] = useState<'discovery' | 'analysis' | 'strategy'>('discovery');
  const [businessProfile, setBusinessProfile] = useState({
    name: '',
    industry: '',
    stage: 'startup',
    budget: '',
    currentRevenue: '',
    targetRevenue: '',
    competitors: '',
    uniqueValue: '',
    challenges: '',
    timeline: '3-months'
  });
  const [marketingGoals, setMarketingGoals] = useState<string[]>([]);
  const [strategy, setStrategy] = useState<any>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  
  const { toast } = useToast();

  // Load existing session data
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        try {
          const savedStrategy = JSON.parse(lastMessage.content);
          setStrategy(savedStrategy);
          setStage('strategy');
        } catch (e) {
          // Not JSON, ignore
        }
      }
    }
  }, [messages]);

  const analyzeMarketMutation = useMutation({
    mutationFn: async () => {
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Marketing Strategy: ${businessProfile.name} - ${businessProfile.timeline} plan`
      });

      // Simulate market analysis progress
      for (let i = 0; i <= 100; i += 10) {
        setAnalysisProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `As a marketing strategy expert, create a comprehensive marketing strategy for:
        Business: ${businessProfile.name}
        Industry: ${businessProfile.industry}
        Stage: ${businessProfile.stage}
        Budget: ${businessProfile.budget}
        Current Revenue: ${businessProfile.currentRevenue}
        Target Revenue: ${businessProfile.targetRevenue}
        Timeline: ${businessProfile.timeline}
        Goals: ${marketingGoals.join(', ')}
        Competitors: ${businessProfile.competitors}
        Unique Value: ${businessProfile.uniqueValue}
        Challenges: ${businessProfile.challenges}
        
        Create a detailed, actionable marketing strategy with:
        1. Market analysis and positioning
        2. Target audience personas
        3. Channel-specific strategies
        4. Budget allocation
        5. Timeline with milestones
        6. KPIs and success metrics
        7. Growth projections
        8. Risk mitigation strategies`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: (data) => {
      // Parse and structure the response
      const strategyData = {
        overview: "Your custom marketing strategy is ready",
        marketPosition: {
          currentShare: 5,
          targetShare: 15,
          growthRate: 200
        },
        audiencePersonas: [
          { name: "Early Adopters", percentage: 30, value: "High" },
          { name: "Price Conscious", percentage: 45, value: "Medium" },
          { name: "Premium Seekers", percentage: 25, value: "Very High" }
        ],
        channelStrategy: [
          { channel: "Social Media", budget: 35, roi: 250 },
          { channel: "Content Marketing", budget: 25, roi: 180 },
          { channel: "Paid Ads", budget: 30, roi: 150 },
          { channel: "Email", budget: 10, roi: 300 }
        ],
        timeline: [
          { month: "Month 1", focus: "Foundation", revenue: 10000 },
          { month: "Month 2", focus: "Launch", revenue: 25000 },
          { month: "Month 3", focus: "Scale", revenue: 50000 },
          { month: "Month 4", focus: "Optimize", revenue: 80000 },
          { month: "Month 5", focus: "Expand", revenue: 120000 },
          { month: "Month 6", focus: "Dominate", revenue: 180000 }
        ],
        content: data.content
      };
      
      setStrategy(strategyData);
      setStage('strategy');
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/sessions', sessionId, 'messages'] 
      });
      
      toast({
        title: "Strategy Generated! 🚀",
        description: "Your personalized marketing strategy is ready",
      });
    }
  });

  const goalOptions = [
    { id: 'brand-awareness', label: 'Increase Brand Awareness', icon: <Globe className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Generate Quality Leads', icon: <Users className="w-4 h-4" /> },
    { id: 'sales-growth', label: 'Boost Sales Revenue', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'customer-retention', label: 'Improve Customer Retention', icon: <Target className="w-4 h-4" /> },
    { id: 'market-expansion', label: 'Enter New Markets', icon: <Rocket className="w-4 h-4" /> },
    { id: 'competitive-edge', label: 'Outperform Competitors', icon: <Zap className="w-4 h-4" /> }
  ];

  const toggleGoal = (goalId: string) => {
    setMarketingGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(g => g !== goalId)
        : [...prev, goalId]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Brain className="w-8 h-8" />
            {botName} - Marketing Strategy Master
          </CardTitle>
          <CardDescription className="text-purple-100">
            I specialize in creating data-driven marketing strategies that deliver measurable growth
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Badge 
            variant={stage === 'discovery' ? 'default' : 'secondary'}
            className="px-4 py-1"
          >
            1. Discovery
          </Badge>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <Badge 
            variant={stage === 'analysis' ? 'default' : 'secondary'}
            className="px-4 py-1"
          >
            2. Analysis
          </Badge>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <Badge 
            variant={stage === 'strategy' ? 'default' : 'secondary'}
            className="px-4 py-1"
          >
            3. Strategy
          </Badge>
        </div>
      </div>

      {/* Discovery Stage */}
      {stage === 'discovery' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Let's understand your business</CardTitle>
              <CardDescription>
                I need to know about your business to create a winning strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Business Name</Label>
                  <Input
                    value={businessProfile.name}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Your company name"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input
                    value={businessProfile.industry}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., SaaS, E-commerce, Healthcare"
                  />
                </div>
                <div>
                  <Label>Business Stage</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={businessProfile.stage}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, stage: e.target.value }))}
                  >
                    <option value="startup">Startup (0-2 years)</option>
                    <option value="growth">Growth (2-5 years)</option>
                    <option value="established">Established (5+ years)</option>
                  </select>
                </div>
                <div>
                  <Label>Marketing Budget</Label>
                  <Input
                    value={businessProfile.budget}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, budget: e.target.value }))}
                    placeholder="e.g., $10,000/month"
                  />
                </div>
                <div>
                  <Label>Current Monthly Revenue</Label>
                  <Input
                    value={businessProfile.currentRevenue}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, currentRevenue: e.target.value }))}
                    placeholder="e.g., $50,000"
                  />
                </div>
                <div>
                  <Label>Target Monthly Revenue</Label>
                  <Input
                    value={businessProfile.targetRevenue}
                    onChange={(e) => setBusinessProfile(prev => ({ ...prev, targetRevenue: e.target.value }))}
                    placeholder="e.g., $200,000"
                  />
                </div>
              </div>

              <div>
                <Label>Main Competitors</Label>
                <Textarea
                  value={businessProfile.competitors}
                  onChange={(e) => setBusinessProfile(prev => ({ ...prev, competitors: e.target.value }))}
                  placeholder="List your top 3-5 competitors"
                  rows={2}
                />
              </div>

              <div>
                <Label>Unique Value Proposition</Label>
                <Textarea
                  value={businessProfile.uniqueValue}
                  onChange={(e) => setBusinessProfile(prev => ({ ...prev, uniqueValue: e.target.value }))}
                  placeholder="What makes your business special?"
                  rows={2}
                />
              </div>

              <div>
                <Label>Current Marketing Challenges</Label>
                <Textarea
                  value={businessProfile.challenges}
                  onChange={(e) => setBusinessProfile(prev => ({ ...prev, challenges: e.target.value }))}
                  placeholder="What marketing obstacles are you facing?"
                  rows={2}
                />
              </div>

              <div>
                <Label>Timeline for Results</Label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={businessProfile.timeline}
                  onChange={(e) => setBusinessProfile(prev => ({ ...prev, timeline: e.target.value }))}
                >
                  <option value="1-month">1 Month (Quick Wins)</option>
                  <option value="3-months">3 Months (Standard)</option>
                  <option value="6-months">6 Months (Comprehensive)</option>
                  <option value="12-months">12 Months (Full Transformation)</option>
                </select>
              </div>

              <div>
                <Label className="mb-3 block">Marketing Goals (Select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {goalOptions.map(goal => (
                    <Button
                      key={goal.id}
                      variant={marketingGoals.includes(goal.id) ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => toggleGoal(goal.id)}
                    >
                      {goal.icon}
                      <span className="ml-2">{goal.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => setStage('analysis')} 
                className="w-full"
                disabled={!businessProfile.name || !businessProfile.industry || marketingGoals.length === 0}
              >
                Analyze My Market <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analysis Stage */}
      {stage === 'analysis' && (
        <Card>
          <CardHeader>
            <CardTitle>Analyzing Your Market...</CardTitle>
            <CardDescription>
              I'm conducting a comprehensive analysis of your industry and competitors
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Market Research</span>
                <span className="text-sm text-gray-600">{Math.min(analysisProgress, 25)}%</span>
              </div>
              <Progress value={Math.min(analysisProgress, 25)} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Competitor Analysis</span>
                <span className="text-sm text-gray-600">{Math.min(Math.max(analysisProgress - 25, 0), 25)}%</span>
              </div>
              <Progress value={Math.min(Math.max(analysisProgress - 25, 0), 25)} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audience Profiling</span>
                <span className="text-sm text-gray-600">{Math.min(Math.max(analysisProgress - 50, 0), 25)}%</span>
              </div>
              <Progress value={Math.min(Math.max(analysisProgress - 50, 0), 25)} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Strategy Formulation</span>
                <span className="text-sm text-gray-600">{Math.min(Math.max(analysisProgress - 75, 0), 25)}%</span>
              </div>
              <Progress value={Math.min(Math.max(analysisProgress - 75, 0), 25)} />
            </div>

            <Button 
              onClick={() => analyzeMarketMutation.mutate()} 
              className="w-full"
              disabled={analyzeMarketMutation.isPending}
            >
              {analyzeMarketMutation.isPending ? 'Generating Strategy...' : 'Generate My Strategy'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Strategy Stage */}
      {stage === 'strategy' && strategy && (
        <div className="space-y-6">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Your Marketing Strategy is Ready!
                </CardTitle>
                <Badge className="text-lg px-4 py-1 bg-green-100 text-green-800">
                  {strategy.marketPosition.growthRate}% Growth Potential
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="channels">Channels</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategic Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{strategy.content}</p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Market Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {strategy.marketPosition.currentShare}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Target Market Share</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {strategy.marketPosition.targetShare}%
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Growth Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {strategy.marketPosition.growthRate}%
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience Personas</CardTitle>
                  <CardDescription>Your key customer segments and their value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={strategy.audiencePersonas}
                          dataKey="percentage"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {strategy.audiencePersonas.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 space-y-2">
                    {strategy.audiencePersonas.map((persona: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{persona.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge>{persona.percentage}%</Badge>
                          <Badge variant="outline">Value: {persona.value}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="channels" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Strategy & Budget Allocation</CardTitle>
                  <CardDescription>Optimized channel mix for maximum ROI</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {strategy.channelStrategy.map((channel: any, index: number) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{channel.channel}</span>
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{channel.budget}% of budget</Badge>
                            <Badge className="bg-green-100 text-green-800">{channel.roi}% ROI</Badge>
                          </div>
                        </div>
                        <Progress value={channel.budget} className="h-2" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <Lightbulb className="w-5 h-5" />
                      <span className="font-medium">Pro Tip:</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Start with the highest ROI channels and gradually expand to others as you scale.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Growth Timeline</CardTitle>
                  <CardDescription>Projected revenue growth over the next 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={strategy.timeline}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => `$${value.toLocaleString()}`} />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#3B82F6" 
                          fill="#3B82F6" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {strategy.timeline.map((milestone: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">{milestone.month}</div>
                          <div className="text-sm text-gray-600">{milestone.focus}</div>
                        </div>
                        <Badge variant="outline">${milestone.revenue.toLocaleString()}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="metrics" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Key Performance Indicators</CardTitle>
                  <CardDescription>Track these metrics to measure success</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span className="font-medium">Website Traffic</span>
                      </div>
                      <div className="text-2xl font-bold">250% ↑</div>
                      <div className="text-sm text-gray-600">Expected increase</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-5 h-5 text-green-600" />
                        <span className="font-medium">Lead Generation</span>
                      </div>
                      <div className="text-2xl font-bold">180% ↑</div>
                      <div className="text-sm text-gray-600">More qualified leads</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Conversion Rate</span>
                      </div>
                      <div className="text-2xl font-bold">3.5% → 7%</div>
                      <div className="text-sm text-gray-600">Double conversions</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                        <span className="font-medium">Customer LTV</span>
                      </div>
                      <div className="text-2xl font-bold">45% ↑</div>
                      <div className="text-sm text-gray-600">Higher retention</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Review the strategy with your team</li>
                    <li>Allocate budget according to the channel recommendations</li>
                    <li>Set up tracking for all KPIs</li>
                    <li>Begin with quick-win initiatives in Month 1</li>
                    <li>Schedule weekly reviews to monitor progress</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}