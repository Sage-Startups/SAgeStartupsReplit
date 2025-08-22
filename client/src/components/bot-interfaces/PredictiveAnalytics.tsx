import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, AlertTriangle, TrendingUp } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface PredictiveAnalyticsProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function PredictiveAnalytics({ sessionId: propSessionId, onSendMessage, isLoading }: PredictiveAnalyticsProps) {
  const [formData, setFormData] = useState({
    predictionType: "",
    historicalData: "",
    forecastPeriod: "",
    keyVariables: "",
    riskFactors: "",
    businessImpact: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create predictive analytics model with these parameters:

Prediction Type: ${formData.predictionType}
Historical Data Available: ${formData.historicalData}
Forecast Period: ${formData.forecastPeriod}
Key Variables: ${formData.keyVariables}
Risk Factors: ${formData.riskFactors}
Business Impact: ${formData.businessImpact}

Please provide:
1. Future forecasting analysis
2. Predictive modeling recommendations
3. Forecasting methodology and approach
4. Risk assessment and mitigation strategies
5. Scenario planning and outcomes
6. Confidence intervals and accuracy measures
7. Implementation roadmap for predictive systems

Focus on actionable predictions that enable proactive business decisions.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Predictive Analytics</h2>
            <p className="text-gray-600">Future forecasting and predictive modeling</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Future Forecasting</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Predictive Modeling</span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Risk Assessment</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="predictive-analytics" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Predictive Model Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="prediction-type">Prediction Type</Label>
                  <Select value={formData.predictionType} onValueChange={(value) => handleInputChange('predictionType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What to predict?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales-forecast">Sales Forecast</SelectItem>
                      <SelectItem value="customer-churn">Customer Churn</SelectItem>
                      <SelectItem value="demand-planning">Demand Planning</SelectItem>
                      <SelectItem value="revenue-projection">Revenue Projection</SelectItem>
                      <SelectItem value="market-trends">Market Trends</SelectItem>
                      <SelectItem value="risk-analysis">Risk Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="historical-data">Historical Data Available</Label>
                  <Input
                    id="historical-data"
                    value={formData.historicalData}
                    onChange={(e) => handleInputChange('historicalData', e.target.value)}
                    placeholder="e.g., 2 years sales data, 6 months user behavior"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forecast-period">Forecast Period</Label>
                  <Select value={formData.forecastPeriod} onValueChange={(value) => handleInputChange('forecastPeriod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How far ahead?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-month">1 Month</SelectItem>
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="1-year">1 Year</SelectItem>
                      <SelectItem value="2-years">2 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-variables">Key Variables/Factors</Label>
                  <Textarea
                    id="key-variables"
                    value={formData.keyVariables}
                    onChange={(e) => handleInputChange('keyVariables', e.target.value)}
                    placeholder="What factors influence the outcome you're predicting?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="risk-factors">Known Risk Factors</Label>
                  <Textarea
                    id="risk-factors"
                    value={formData.riskFactors}
                    onChange={(e) => handleInputChange('riskFactors', e.target.value)}
                    placeholder="What could negatively impact predictions?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-impact">Business Impact</Label>
                  <Input
                    id="business-impact"
                    value={formData.businessImpact}
                    onChange={(e) => handleInputChange('businessImpact', e.target.value)}
                    placeholder="How will predictions be used in business?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Building Predictive Model..." : "Generate Predictive Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}