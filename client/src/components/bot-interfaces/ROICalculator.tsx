import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, DollarSign, TrendingUp } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ROICalculatorProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function ROICalculator({ sessionId: propSessionId, onSendMessage, isLoading }: ROICalculatorProps) {
  const [formData, setFormData] = useState({
    investmentType: "",
    totalInvestment: "",
    timeframe: "",
    revenueGenerated: "",
    additionalCosts: "",
    targetROI: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Calculate comprehensive ROI analysis with these parameters:

Investment Type: ${formData.investmentType}
Total Investment Amount: $${formData.totalInvestment}
Analysis Timeframe: ${formData.timeframe}
Revenue Generated: $${formData.revenueGenerated}
Additional Costs: $${formData.additionalCosts}
Target ROI: ${formData.targetROI}%

Please provide:
1. ROI calculation and current performance
2. Investment tracking breakdown
3. Profit analysis and margins
4. Cost-benefit analysis
5. Performance benchmarking
6. Optimization recommendations for better ROI
7. Future ROI projections

Focus on delivering actionable insights to improve investment returns.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
            <p className="text-gray-600">Track investments and calculate return on investment</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Investment Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>ROI Calculator</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Profit Analysis</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="roi-calculator" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>ROI Analysis Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="investment-type">Investment Type</Label>
                  <Select value={formData.investmentType} onValueChange={(value) => handleInputChange('investmentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="marketing-campaign">Marketing Campaign</SelectItem>
                      <SelectItem value="technology">Technology/Software</SelectItem>
                      <SelectItem value="equipment">Equipment/Tools</SelectItem>
                      <SelectItem value="personnel">Personnel/Training</SelectItem>
                      <SelectItem value="product-development">Product Development</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="total-investment">Total Investment Amount ($)</Label>
                  <Input
                    id="total-investment"
                    type="number"
                    value={formData.totalInvestment}
                    onChange={(e) => handleInputChange('totalInvestment', e.target.value)}
                    placeholder="Enter total investment amount"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Analysis Timeframe</Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                      <SelectItem value="ongoing">Ongoing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="revenue-generated">Revenue Generated ($)</Label>
                  <Input
                    id="revenue-generated"
                    type="number"
                    value={formData.revenueGenerated}
                    onChange={(e) => handleInputChange('revenueGenerated', e.target.value)}
                    placeholder="Revenue attributed to this investment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional-costs">Additional Costs ($)</Label>
                  <Input
                    id="additional-costs"
                    type="number"
                    value={formData.additionalCosts}
                    onChange={(e) => handleInputChange('additionalCosts', e.target.value)}
                    placeholder="Ongoing maintenance, operational costs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-roi">Target ROI (%)</Label>
                  <Input
                    id="target-roi"
                    type="number"
                    value={formData.targetROI}
                    onChange={(e) => handleInputChange('targetROI', e.target.value)}
                    placeholder="Your target return percentage"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Calculating ROI..." : "Calculate ROI & Generate Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}