import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, TrendingUp, BarChart3, Zap, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CompetitorBenchmarkingProps {
  sessionId: number;
  botName: string;
}

export function CompetitorBenchmarking({ sessionId, botName }: CompetitorBenchmarkingProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    competitors: '',
    analysisType: '',
    keyMetrics: '',
    timeframe: '',
    goals: '',
    currentPosition: ''
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  // Load existing session
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
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Competitor Analysis: ${formData.businessName}`
      });

      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Perform a comprehensive competitive benchmarking analysis for ${formData.businessName} in the ${formData.industry} industry.

**Analysis Parameters:**
- Business Name: ${formData.businessName}
- Industry: ${formData.industry}
- Key Competitors: ${formData.competitors}
- Analysis Focus: ${formData.analysisType}
- Key Metrics: ${formData.keyMetrics}
- Analysis Timeframe: ${formData.timeframe}
- Business Goals: ${formData.goals}
- Current Market Position: ${formData.currentPosition}

Please provide detailed competitive intelligence:

## 🎯 **Competitive Landscape Overview**
- Market position analysis and industry dynamics
- Competitive strengths and weaknesses assessment
- Market share estimations and growth trajectories
- Pricing strategy comparisons and positioning
- Target audience overlap and differentiation opportunities

## 📊 **Performance Benchmarks**
- Key metric comparisons across competitors
- Performance gap analysis with actionable insights
- Industry average comparisons and market standards
- Growth rate analysis and trend identification
- Market penetration rates and expansion strategies

## 🚀 **Strategic Opportunities**
- Market gaps and untapped opportunities
- Competitive advantage areas to leverage
- Differentiation strategies and positioning options
- Blue ocean opportunities and innovation potential
- Partnership possibilities and collaboration opportunities

## 📈 **Market Intelligence**
- Industry trend analysis and future predictions
- Competitive threat assessment and risk evaluation
- Market positioning recommendations and strategies
- Strategic recommendations for competitive advantage
- Action plan priorities with timeline and resources

## 🔍 **SWOT Analysis**
- Competitive strengths to leverage and amplify
- Weaknesses to address and mitigate
- Market opportunities to pursue and capture
- Competitive threats to monitor and counter

## 💡 **Implementation Strategy**
- Priority actions with immediate impact
- Medium-term strategic initiatives
- Long-term competitive positioning goals
- Resource allocation recommendations
- Success metrics and KPI tracking

## 🎨 **Visual Competitive Matrix**
- Feature comparison matrix
- Pricing comparison table
- Market positioning map
- Competitive analysis dashboard
- Performance benchmark charts

Format with specific metrics, actionable insights, and strategic recommendations for competitive advantage.`;

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
        description: "Your competitive benchmarking analysis has been generated.",
      });
      // Invalidate messages to refresh the chat
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.industry || !formData.competitors) {
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
    return <BotChatInterface sessionId={sessionId} botType="competitor-benchmarking" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Competition</h3>
                <p className="text-gray-600 mb-4">Benchmarking your market position and identifying strategic opportunities...</p>
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
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Competitor Benchmarking</h2>
            <p className="text-gray-600">Analyze market position and competitive landscape</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Market Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Performance Benchmarks</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Strategic Insights</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Competitive Analysis Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Your Business Name *</Label>
                <Input
                  id="business-name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Market *</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g., E-commerce, SaaS, Healthcare"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Key Competitors *</Label>
                <Textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                  placeholder="List your main competitors (company names, websites, etc.)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Focus</Label>
                <Select onValueChange={(value) => handleInputChange('analysisType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall-performance">Overall Performance</SelectItem>
                    <SelectItem value="pricing-strategy">Pricing Strategy</SelectItem>
                    <SelectItem value="marketing-approach">Marketing Approach</SelectItem>
                    <SelectItem value="product-features">Product Features</SelectItem>
                    <SelectItem value="customer-experience">Customer Experience</SelectItem>
                    <SelectItem value="market-positioning">Market Positioning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Compare</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="What specific metrics should be compared? (e.g., pricing, features, market share, customer reviews)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current/Real-time</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="historical-trend">Historical Trend</SelectItem>
                    <SelectItem value="future-projection">Future Projection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Business Goals</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What are your main competitive goals? (e.g., gain market share, improve positioning)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-position">Current Market Position</Label>
                <Input
                  id="current-position"
                  value={formData.currentPosition}
                  onChange={(e) => handleInputChange('currentPosition', e.target.value)}
                  placeholder="How do you currently position yourself? (e.g., premium, budget-friendly, innovative)"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalysisMutation.isPending}>
              {createAnalysisMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing Competitors...
                </span>
              ) : (
                <span className="flex items-center">
                  Generate Competitive Analysis
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