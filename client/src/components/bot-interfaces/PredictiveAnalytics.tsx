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
import { Zap, TrendingUp, Target, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface PredictiveAnalyticsProps {
  sessionId: number;
  botName: string;
}

export function PredictiveAnalytics({ sessionId, botName }: PredictiveAnalyticsProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    predictionGoal: '',
    dataSource: '',
    historicalData: '',
    keyVariables: '',
    timeHorizon: '',
    predictionType: '',
    businessContext: ''
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

  const createPredictionMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Predictive Analysis: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create comprehensive predictive analytics for ${formData.businessName}.

**Prediction Parameters:**
- Business Name: ${formData.businessName}
- Prediction Goal: ${formData.predictionGoal}
- Data Source: ${formData.dataSource}
- Historical Data: ${formData.historicalData}
- Key Variables: ${formData.keyVariables}
- Time Horizon: ${formData.timeHorizon}
- Prediction Type: ${formData.predictionType}
- Business Context: ${formData.businessContext}

Please provide detailed predictive analysis with:

## 🔮 **Predictive Models & Forecasts**
- Primary prediction models and methodologies
- Statistical significance and confidence intervals
- Multiple scenario forecasting (best/worst/likely cases)
- Trend extrapolation and pattern recognition
- Seasonal adjustment and cyclical factors
- Model validation and accuracy assessment

## 📊 **Data Analysis & Patterns**
- Historical data pattern analysis
- Key variable correlation analysis
- Leading and lagging indicator identification
- Anomaly detection and outlier analysis
- Data quality assessment and limitations
- Missing data impact evaluation

## 🎯 **Business Impact Predictions**
- Revenue and growth projections
- Market opportunity forecasting
- Resource requirement predictions
- Risk probability assessments
- Customer behavior forecasting
- Competitive landscape predictions

## 💡 **Strategic Recommendations**
- Data-driven decision guidance
- Risk mitigation strategies
- Opportunity capitalization plans
- Resource allocation optimization
- Timing and scheduling recommendations
- Performance optimization strategies

## 🚀 **Implementation Framework**
- Prediction monitoring dashboard
- Early warning system setup
- Model updating and refinement process
- Decision support system integration
- Performance tracking mechanisms
- Continuous improvement protocols

## 🔧 **Technical Specifications**
- Data collection requirements
- Model accuracy metrics and thresholds
- Prediction update frequency
- Technology stack recommendations
- Integration with existing systems
- Quality assurance procedures

Format with specific predictions, confidence levels, and actionable business recommendations.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Predictions Generated!",
        description: "Your predictive analytics model has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to generate predictions: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.predictionGoal || !formData.keyVariables) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createPredictionMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="predictive-analytics" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Generating Predictions</h3>
                <p className="text-gray-600 mb-4">Building predictive models and forecasting future outcomes...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
            <p className="text-gray-600">Forecast future outcomes and trends using data science</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Future Forecasting</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trend Prediction</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Risk Assessment</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Predictive Analytics Setup</CardTitle>
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
                <Label htmlFor="prediction-goal">Prediction Goal *</Label>
                <Select onValueChange={(value) => handleInputChange('predictionGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What do you want to predict?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue-forecasting">Revenue Forecasting</SelectItem>
                    <SelectItem value="demand-prediction">Demand Prediction</SelectItem>
                    <SelectItem value="customer-churn">Customer Churn</SelectItem>
                    <SelectItem value="market-trends">Market Trends</SelectItem>
                    <SelectItem value="risk-assessment">Risk Assessment</SelectItem>
                    <SelectItem value="performance-forecasting">Performance Forecasting</SelectItem>
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
                    <SelectItem value="sales-data">Sales Data</SelectItem>
                    <SelectItem value="website-analytics">Website Analytics</SelectItem>
                    <SelectItem value="customer-data">Customer Data</SelectItem>
                    <SelectItem value="financial-reports">Financial Reports</SelectItem>
                    <SelectItem value="operational-data">Operational Data</SelectItem>
                    <SelectItem value="market-data">Market Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="time-horizon">Prediction Time Horizon</Label>
                <Select onValueChange={(value) => handleInputChange('timeHorizon', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How far into the future?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="next-month">Next Month</SelectItem>
                    <SelectItem value="next-quarter">Next Quarter</SelectItem>
                    <SelectItem value="next-6-months">Next 6 Months</SelectItem>
                    <SelectItem value="next-year">Next Year</SelectItem>
                    <SelectItem value="next-2-years">Next 2 Years</SelectItem>
                    <SelectItem value="custom-period">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="historical-data">Historical Data Available</Label>
                <Textarea
                  id="historical-data"
                  value={formData.historicalData}
                  onChange={(e) => handleInputChange('historicalData', e.target.value)}
                  placeholder="Describe what historical data you have (time period, metrics, quality)"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-variables">Key Variables to Consider *</Label>
                <Textarea
                  id="key-variables"
                  value={formData.keyVariables}
                  onChange={(e) => handleInputChange('keyVariables', e.target.value)}
                  placeholder="List important variables that might affect predictions (seasonality, marketing spend, economic factors, etc.)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prediction-type">Prediction Type</Label>
                <Select onValueChange={(value) => handleInputChange('predictionType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select prediction approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trend-analysis">Trend Analysis</SelectItem>
                    <SelectItem value="regression-modeling">Regression Modeling</SelectItem>
                    <SelectItem value="time-series">Time Series Analysis</SelectItem>
                    <SelectItem value="machine-learning">Machine Learning</SelectItem>
                    <SelectItem value="scenario-modeling">Scenario Modeling</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-context">Business Context</Label>
                <Textarea
                  id="business-context"
                  value={formData.businessContext}
                  onChange={(e) => handleInputChange('businessContext', e.target.value)}
                  placeholder="Provide context about your business situation, upcoming changes, or specific concerns"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createPredictionMutation.isPending}>
              {createPredictionMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Generating Predictions...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Predictive Analysis
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