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
import { Lightbulb, BarChart3, TrendingUp, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface InsightsGeneratorProps {
  sessionId: number;
  botName: string;
}

export function InsightsGenerator({ sessionId, botName }: InsightsGeneratorProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    dataSource: '',
    insightGoal: '',
    dataRange: '',
    keyQuestions: '',
    businessContext: '',
    outputFormat: '',
    decisionContext: ''
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

  const createInsightsMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Insights Analysis: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Generate comprehensive business insights for ${formData.businessName}.

**Analysis Parameters:**
- Business Name: ${formData.businessName}
- Data Source: ${formData.dataSource}
- Insight Goal: ${formData.insightGoal}
- Data Range: ${formData.dataRange}
- Key Questions: ${formData.keyQuestions}
- Business Context: ${formData.businessContext}
- Output Format: ${formData.outputFormat}
- Decision Context: ${formData.decisionContext}

Please provide detailed insights with:

## 🔍 **Key Findings & Discoveries**
- Primary insights and breakthrough discoveries
- Hidden patterns and correlations
- Unexpected trends and anomalies
- Data-driven revelations
- Critical observations

## 📊 **Data Analysis & Patterns**
- Statistical insights and significance
- Trend analysis and forecasting
- Segmentation insights
- Performance correlations
- Behavioral patterns

## 💡 **Strategic Recommendations**
- Actionable business strategies
- Optimization opportunities
- Risk mitigation strategies
- Growth opportunities
- Competitive advantages

## 🎯 **Impact Assessment**
- Potential business impact
- Implementation priorities
- Resource requirements
- Timeline considerations
- Success metrics

## 📈 **Implementation Roadmap**
- Phase 1: Quick wins
- Phase 2: Strategic initiatives
- Phase 3: Long-term opportunities
- Monitoring and evaluation plan
- Continuous improvement strategy

Format with specific data points, actionable recommendations, and clear implementation steps.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Insights Generated!",
        description: "Your business insights analysis has been completed.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to generate insights: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.insightGoal || !formData.keyQuestions) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createInsightsMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="insights-generator" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto">
                <Lightbulb className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Insights</h3>
                <p className="text-gray-600 mb-4">Analyzing data and discovering actionable business insights...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insights Generator</h2>
            <p className="text-gray-600">Transform data into actionable business insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Data Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Strategic Insights</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Actionable Recommendations</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Insights Configuration</CardTitle>
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
                <Label htmlFor="data-source">Primary Data Source</Label>
                <Select onValueChange={(value) => handleInputChange('dataSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website-analytics">Website Analytics</SelectItem>
                    <SelectItem value="sales-data">Sales Data</SelectItem>
                    <SelectItem value="customer-feedback">Customer Feedback</SelectItem>
                    <SelectItem value="financial-reports">Financial Reports</SelectItem>
                    <SelectItem value="operational-metrics">Operational Metrics</SelectItem>
                    <SelectItem value="multiple-sources">Multiple Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="insight-goal">Insight Goal *</Label>
                <Select onValueChange={(value) => handleInputChange('insightGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What insights do you need?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="performance-optimization">Performance Optimization</SelectItem>
                    <SelectItem value="growth-opportunities">Growth Opportunities</SelectItem>
                    <SelectItem value="cost-reduction">Cost Reduction</SelectItem>
                    <SelectItem value="customer-behavior">Customer Behavior</SelectItem>
                    <SelectItem value="market-trends">Market Trends</SelectItem>
                    <SelectItem value="strategic-planning">Strategic Planning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-range">Data Time Range</Label>
                <Select onValueChange={(value) => handleInputChange('dataRange', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                    <SelectItem value="custom-period">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-questions">Key Questions to Answer *</Label>
                <Textarea
                  id="key-questions"
                  value={formData.keyQuestions}
                  onChange={(e) => handleInputChange('keyQuestions', e.target.value)}
                  placeholder="What specific questions do you need answered? (e.g., Why did sales drop? What drives customer retention?)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-context">Business Context</Label>
                <Textarea
                  id="business-context"
                  value={formData.businessContext}
                  onChange={(e) => handleInputChange('businessContext', e.target.value)}
                  placeholder="Provide context about your business situation, recent changes, or challenges"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="output-format">Output Format</Label>
                <Select onValueChange={(value) => handleInputChange('outputFormat', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How should insights be presented?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive-summary">Executive Summary</SelectItem>
                    <SelectItem value="detailed-report">Detailed Report</SelectItem>
                    <SelectItem value="action-plan">Action Plan</SelectItem>
                    <SelectItem value="dashboard-summary">Dashboard Summary</SelectItem>
                    <SelectItem value="presentation-format">Presentation Format</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="decision-context">Decision Context</Label>
                <Input
                  id="decision-context"
                  value={formData.decisionContext}
                  onChange={(e) => handleInputChange('decisionContext', e.target.value)}
                  placeholder="What decisions will these insights help you make?"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createInsightsMutation.isPending}>
              {createInsightsMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Insights...
                </span>
              ) : (
                <span className="flex items-center">
                  Generate Business Insights
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