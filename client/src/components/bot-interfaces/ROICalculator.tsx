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
import { Calculator, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ROICalculatorProps {
  sessionId: number;
  botName: string;
}

export function ROICalculator({ sessionId, botName }: ROICalculatorProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    investmentType: '',
    initialInvestment: '',
    timeframe: '',
    expectedReturns: '',
    costs: '',
    revenue: '',
    calculationMethod: ''
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

  const createROIAnalysisMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `ROI Analysis: ${formData.investmentType}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Calculate comprehensive ROI analysis for ${formData.businessName}.

**Investment Details:**
- Business Name: ${formData.businessName}
- Investment Type: ${formData.investmentType}
- Initial Investment: ${formData.initialInvestment}
- Analysis Timeframe: ${formData.timeframe}
- Expected Returns: ${formData.expectedReturns}
- Associated Costs: ${formData.costs}
- Revenue Information: ${formData.revenue}
- Calculation Method: ${formData.calculationMethod}

Please provide detailed ROI analysis with:

## 💰 **ROI Calculations & Metrics**
- Basic ROI percentage calculation
- Net present value (NPV) analysis
- Payback period estimation
- Internal rate of return (IRR)
- Break-even analysis
- Cost-benefit ratio

## 📊 **Financial Performance Analysis**
- Revenue projections and forecasts
- Cost breakdown and analysis
- Profit margin calculations
- Cash flow projections
- Risk-adjusted returns
- Scenario analysis (best/worst/likely cases)

## 📈 **Investment Evaluation**
- Investment attractiveness assessment
- Comparison with industry benchmarks
- Risk assessment and mitigation
- Opportunity cost analysis
- Strategic value considerations
- Long-term impact evaluation

## 🎯 **Decision Framework**
- Investment recommendation (proceed/modify/reject)
- Key success factors and assumptions
- Performance monitoring metrics
- Critical milestones and checkpoints
- Optimization opportunities
- Exit strategy considerations

## 🔧 **Implementation Guidelines**
- Investment deployment phases
- Resource allocation recommendations
- Timeline and milestone planning
- Performance tracking dashboard
- Regular review and adjustment plan
- Risk management strategies

## 📋 **Executive Summary**
- Key findings and recommendations
- Financial highlights and projections
- Strategic implications
- Next steps and action items
- Success criteria definition

Format with specific calculations, financial projections, and actionable investment recommendations.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "ROI Analysis Complete!",
        description: "Your return on investment analysis has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to calculate ROI: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.investmentType || !formData.initialInvestment) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createROIAnalysisMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="roi-calculator" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Calculator className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Calculating ROI</h3>
                <p className="text-gray-600 mb-4">Analyzing financial returns and investment performance...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
            <p className="text-gray-600">Calculate return on investment and financial performance</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Financial Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>ROI Calculation</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Investment Strategy</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ROI Analysis Setup</CardTitle>
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
                <Label htmlFor="investment-type">Investment Type *</Label>
                <Select onValueChange={(value) => handleInputChange('investmentType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select investment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                    <SelectItem value="new-equipment">New Equipment</SelectItem>
                    <SelectItem value="software-system">Software System</SelectItem>
                    <SelectItem value="staff-training">Staff Training</SelectItem>
                    <SelectItem value="expansion-project">Expansion Project</SelectItem>
                    <SelectItem value="technology-upgrade">Technology Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="initial-investment">Initial Investment Amount *</Label>
                <Input
                  id="initial-investment"
                  value={formData.initialInvestment}
                  onChange={(e) => handleInputChange('initialInvestment', e.target.value)}
                  placeholder="Enter investment amount (e.g., $50,000)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3-months">3 Months</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="2-years">2 Years</SelectItem>
                    <SelectItem value="3-years">3 Years</SelectItem>
                    <SelectItem value="5-years">5 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expected-returns">Expected Returns/Benefits</Label>
                <Textarea
                  id="expected-returns"
                  value={formData.expectedReturns}
                  onChange={(e) => handleInputChange('expectedReturns', e.target.value)}
                  placeholder="Describe expected financial returns, revenue increases, cost savings, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costs">Associated Costs</Label>
                <Textarea
                  id="costs"
                  value={formData.costs}
                  onChange={(e) => handleInputChange('costs', e.target.value)}
                  placeholder="List ongoing costs, maintenance, training, etc."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Current Revenue Information</Label>
                <Textarea
                  id="revenue"
                  value={formData.revenue}
                  onChange={(e) => handleInputChange('revenue', e.target.value)}
                  placeholder="Provide current revenue figures and financial context"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calculation-method">Calculation Method</Label>
                <Select onValueChange={(value) => handleInputChange('calculationMethod', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select calculation approach" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="simple-roi">Simple ROI</SelectItem>
                    <SelectItem value="net-present-value">Net Present Value</SelectItem>
                    <SelectItem value="internal-rate-return">Internal Rate of Return</SelectItem>
                    <SelectItem value="payback-period">Payback Period</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createROIAnalysisMutation.isPending}>
              {createROIAnalysisMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Calculating ROI...
                </span>
              ) : (
                <span className="flex items-center">
                  Calculate ROI Analysis
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