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
import { TrendingUp, BarChart3, Activity, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface TrendAnalyserProps {
  sessionId: number;
  botName: string;
}

export function TrendAnalyser({ sessionId, botName }: TrendAnalyserProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    analysisType: '',
    timeframe: '',
    dataSource: '',
    keyMetrics: '',
    trendFocus: '',
    businessGoals: ''
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
        sessionTitle: `Trend Analysis: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Conduct comprehensive trend analysis for ${formData.businessName} in the ${formData.industry} industry.

**Analysis Parameters:**
- Business Name: ${formData.businessName}
- Industry: ${formData.industry}
- Analysis Type: ${formData.analysisType}
- Time Frame: ${formData.timeframe}
- Data Source: ${formData.dataSource}
- Key Metrics: ${formData.keyMetrics}
- Trend Focus: ${formData.trendFocus}
- Business Goals: ${formData.businessGoals}

Please provide detailed trend analysis with:

## 📈 **Trend Identification & Analysis**
- Primary trends and patterns
- Emerging trends and signals
- Cyclical patterns and seasonality
- Growth trajectories and momentum
- Trend correlation analysis
- Anomaly detection and outliers

## 🎯 **Business Impact Assessment**
- Revenue impact of identified trends
- Market opportunity sizing
- Risk assessment and mitigation
- Competitive implications
- Strategic alignment evaluation
- Resource allocation implications

## 📊 **Predictive Insights**
- Future trend projections
- Scenario planning and modeling
- Probability assessments
- Timeline predictions
- Critical inflection points
- Early warning indicators

## 💡 **Strategic Recommendations**
- Trend-based opportunities
- Market positioning adjustments
- Product/service adaptations
- Investment priorities
- Partnership opportunities
- Innovation directions

## 🚀 **Implementation Strategy**
- Short-term tactical responses
- Medium-term strategic initiatives
- Long-term positioning plans
- Resource requirements
- Timeline and milestones
- Success measurement framework

## 🔧 **Monitoring & Optimization**
- KPI tracking recommendations
- Trend monitoring dashboard
- Alert system setup
- Regular review processes
- Adaptation mechanisms
- Continuous improvement plan

Format with specific trend data, quantified impacts, and actionable strategic recommendations.`;

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
        description: "Your trend analysis has been generated with strategic insights.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to analyze trends: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.analysisType || !formData.keyMetrics) {
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
    return <BotChatInterface sessionId={sessionId} botType="trend-analyser" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Trends</h3>
                <p className="text-gray-600 mb-4">Identifying patterns and predicting future opportunities...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trend Analyser</h2>
            <p className="text-gray-600">Identify patterns and predict future market opportunities</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Pattern Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Future Predictions</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Strategic Insights</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Trend Analysis Configuration</CardTitle>
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
                <Label htmlFor="industry">Industry/Market</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g., E-commerce, SaaS, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Type *</Label>
                <Select onValueChange={(value) => handleInputChange('analysisType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="market-trends">Market Trends</SelectItem>
                    <SelectItem value="performance-trends">Performance Trends</SelectItem>
                    <SelectItem value="customer-behavior">Customer Behavior Trends</SelectItem>
                    <SelectItem value="industry-trends">Industry Trends</SelectItem>
                    <SelectItem value="seasonal-patterns">Seasonal Patterns</SelectItem>
                    <SelectItem value="competitive-trends">Competitive Trends</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="last-2-years">Last 2 Years</SelectItem>
                    <SelectItem value="last-3-years">Last 3 Years</SelectItem>
                    <SelectItem value="custom-period">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">Primary Data Source</Label>
                <Select onValueChange={(value) => handleInputChange('dataSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website-analytics">Website Analytics</SelectItem>
                    <SelectItem value="sales-data">Sales Data</SelectItem>
                    <SelectItem value="social-media">Social Media Data</SelectItem>
                    <SelectItem value="market-research">Market Research</SelectItem>
                    <SelectItem value="customer-data">Customer Data</SelectItem>
                    <SelectItem value="financial-reports">Financial Reports</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Analyze *</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="List the metrics you want to analyze for trends (e.g., revenue, traffic, conversions, customer satisfaction)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trend-focus">Trend Focus</Label>
                <Select onValueChange={(value) => handleInputChange('trendFocus', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What trends are most important?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="growth-trends">Growth Trends</SelectItem>
                    <SelectItem value="decline-patterns">Decline Patterns</SelectItem>
                    <SelectItem value="cyclical-patterns">Cyclical Patterns</SelectItem>
                    <SelectItem value="emerging-opportunities">Emerging Opportunities</SelectItem>
                    <SelectItem value="risk-indicators">Risk Indicators</SelectItem>
                    <SelectItem value="all-patterns">All Pattern Types</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-goals">Business Goals</Label>
                <Textarea
                  id="business-goals"
                  value={formData.businessGoals}
                  onChange={(e) => handleInputChange('businessGoals', e.target.value)}
                  placeholder="What business goals should the trend analysis support? (e.g., increase revenue, expand market share)"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalysisMutation.isPending}>
              {createAnalysisMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing Trends...
                </span>
              ) : (
                <span className="flex items-center">
                  Generate Trend Analysis
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