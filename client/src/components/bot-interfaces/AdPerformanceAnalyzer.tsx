import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { BarChart3, Target, TrendingUp, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface AdPerformanceAnalyzerProps {
  sessionId: number;
  botName: string;
}

export function AdPerformanceAnalyzer({ sessionId, botName }: AdPerformanceAnalyzerProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    adCampaigns: '',
    platforms: '',
    budget: '',
    goals: '',
    timeframe: '',
    keyMetrics: '',
    challenges: ''
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        setPhase('complete');
      }
    }
  }, [messages]);

  const createAnalysisMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Ad Performance Analysis: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Analyze advertising performance for ${formData.businessName}.

**Campaign Details:**
- Business Name: ${formData.businessName}
- Ad Campaigns: ${formData.adCampaigns}
- Advertising Platforms: ${formData.platforms}
- Budget Information: ${formData.budget}
- Campaign Goals: ${formData.goals}
- Analysis Timeframe: ${formData.timeframe}
- Key Metrics: ${formData.keyMetrics}
- Current Challenges: ${formData.challenges}

Please provide comprehensive ad performance analysis with:

## 📊 **Performance Metrics Analysis**
- Click-through rates (CTR) and trends
- Conversion rates and funnel analysis
- Cost per click (CPC) and cost per acquisition (CPA)
- Return on ad spend (ROAS)
- Impression share and reach analysis
- Engagement rates and quality scores

## 🎯 **Campaign Effectiveness Review**
- Campaign-by-campaign performance breakdown
- Platform comparison and effectiveness
- Audience targeting performance
- Creative performance analysis
- Budget allocation efficiency
- Goal achievement assessment

## 📈 **Trend Analysis & Insights**
- Performance trends over time
- Seasonal patterns and variations
- Peak performance periods identification
- Declining performance indicators
- Competitive landscape impact
- Market condition influences

## 💡 **Optimization Recommendations**
- Immediate improvement opportunities
- Budget reallocation strategies
- Targeting refinement suggestions
- Creative optimization ideas
- Platform-specific optimizations
- Bidding strategy adjustments

## 🚀 **Action Plan & Strategy**
- Priority optimization tasks
- Testing and experimentation plan
- Performance improvement timeline
- Resource allocation recommendations
- Success measurement framework
- Monitoring and reporting setup

## 📋 **Executive Summary**
- Key findings and insights
- Performance highlights and concerns
- Strategic recommendations
- Expected impact projections
- Next steps and priorities

Format with specific metrics, performance data, and actionable optimization strategies.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Analysis Complete!",
        description: "Your ad performance analysis has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to analyze performance: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.adCampaigns || !formData.platforms) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createAnalysisMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="ad-performance-analyzer" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Ad Performance</h3>
                <p className="text-gray-600 mb-4">Evaluating campaign effectiveness and identifying optimization opportunities...</p>
                <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{processingProgress}% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ad Performance Analyzer</h2>
            <p className="text-gray-600">Analyze campaign effectiveness and optimize advertising performance</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Campaign Optimization</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>ROI Improvement</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ad Performance Analysis Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platforms">Advertising Platforms *</Label>
                <Select onValueChange={(value) => handleInputChange('platforms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-ads">Google Ads</SelectItem>
                    <SelectItem value="facebook-instagram">Facebook & Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn Ads</SelectItem>
                    <SelectItem value="twitter">Twitter Ads</SelectItem>
                    <SelectItem value="tiktok">TikTok Ads</SelectItem>
                    <SelectItem value="multiple-platforms">Multiple Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-campaigns">Ad Campaigns *</Label>
                <Textarea
                  id="ad-campaigns"
                  value={formData.adCampaigns}
                  onChange={(e) => handleInputChange('adCampaigns', e.target.value)}
                  placeholder="List your ad campaigns and their objectives (e.g., Brand Awareness Campaign, Lead Gen Campaign)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Information</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Total ad spend or budget range (e.g., $5,000/month)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Campaign Goals</Label>
                <Select onValueChange={(value) => handleInputChange('goals', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What are you trying to achieve?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales-conversion">Sales Conversion</SelectItem>
                    <SelectItem value="website-traffic">Website Traffic</SelectItem>
                    <SelectItem value="app-installs">App Installs</SelectItem>
                    <SelectItem value="multiple-goals">Multiple Goals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-week">Last Week</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Analyze</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="Which metrics are most important? (e.g., CTR, CPA, ROAS, conversions)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="challenges">Current Challenges</Label>
                <Textarea
                  id="challenges"
                  value={formData.challenges}
                  onChange={(e) => handleInputChange('challenges', e.target.value)}
                  placeholder="What issues are you experiencing? (e.g., high costs, low conversions, declining performance)"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalysisMutation.isPending}>
              {createAnalysisMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing Performance...
                </span>
              ) : (
                <span className="flex items-center">
                  Analyze Ad Performance
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}