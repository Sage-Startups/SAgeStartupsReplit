import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Search, Zap } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface TrendAnalyserProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function TrendAnalyser({ sessionId: propSessionId, onSendMessage, isLoading }: TrendAnalyserProps) {
  const [formData, setFormData] = useState({
    industry: "",
    analysisScope: "",
    dataPoints: "",
    timeHorizon: "",
    focusArea: "",
    businessContext: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Perform comprehensive trend analysis with these parameters:

Industry/Market: ${formData.industry}
Analysis Scope: ${formData.analysisScope}
Key Data Points: ${formData.dataPoints}
Time Horizon: ${formData.timeHorizon}
Focus Area: ${formData.focusArea}
Business Context: ${formData.businessContext}

Please provide:
1. Pattern recognition analysis
2. Current trend identification
3. Pattern detection insights
4. Future predictions and forecasting
5. Market opportunity assessment
6. Risk and challenge identification
7. Strategic recommendations based on trends

Focus on actionable trend insights that can guide business strategy.`;

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Trend Analyser</h2>
            <p className="text-gray-600">Identify patterns and predict future trends</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Pattern Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Trend Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Future Predictions</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="trend-analyser" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trend Analysis Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry/Market</Label>
                  <Input
                    id="industry"
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    placeholder="e.g., E-commerce, SaaS, Healthcare"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-scope">Analysis Scope</Label>
                  <Select value={formData.analysisScope} onValueChange={(value) => handleInputChange('analysisScope', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="market-trends">Market Trends</SelectItem>
                      <SelectItem value="consumer-behavior">Consumer Behavior</SelectItem>
                      <SelectItem value="technology-trends">Technology Trends</SelectItem>
                      <SelectItem value="competitor-analysis">Competitor Analysis</SelectItem>
                      <SelectItem value="industry-shifts">Industry Shifts</SelectItem>
                      <SelectItem value="global-trends">Global Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-points">Key Data Points</Label>
                  <Textarea
                    id="data-points"
                    value={formData.dataPoints}
                    onChange={(e) => handleInputChange('dataPoints', e.target.value)}
                    placeholder="What specific metrics or data should be analyzed?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time-horizon">Prediction Time Horizon</Label>
                  <Select value={formData.timeHorizon} onValueChange={(value) => handleInputChange('timeHorizon', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prediction timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-term">Short-term (3-6 months)</SelectItem>
                      <SelectItem value="medium-term">Medium-term (6-12 months)</SelectItem>
                      <SelectItem value="long-term">Long-term (1-2 years)</SelectItem>
                      <SelectItem value="strategic">Strategic (2+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus-area">Specific Focus Area</Label>
                  <Input
                    id="focus-area"
                    value={formData.focusArea}
                    onChange={(e) => handleInputChange('focusArea', e.target.value)}
                    placeholder="Any particular trend area to emphasize?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-context">Business Context</Label>
                  <Input
                    id="business-context"
                    value={formData.businessContext}
                    onChange={(e) => handleInputChange('businessContext', e.target.value)}
                    placeholder="How will this trend analysis be used?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Analyzing Trends..." : "Generate Trend Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}