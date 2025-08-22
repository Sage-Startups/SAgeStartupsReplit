import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Brain, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface InsightsGeneratorProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function InsightsGenerator({ sessionId: propSessionId, onSendMessage, isLoading }: InsightsGeneratorProps) {
  const [formData, setFormData] = useState({
    dataSource: "",
    analysisType: "",
    businessQuestion: "",
    dataTimeframe: "",
    currentChallenges: "",
    expectedOutcome: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Generate actionable business insights with these parameters:

Data Source: ${formData.dataSource}
Analysis Type: ${formData.analysisType}
Business Question: ${formData.businessQuestion}
Data Timeframe: ${formData.dataTimeframe}
Current Challenges: ${formData.currentChallenges}
Expected Outcome: ${formData.expectedOutcome}

Please provide:
1. Pattern recognition analysis of the data
2. Key insights and findings
3. Actionable intelligence recommendations
4. Data-driven strategic suggestions
5. Risk assessment and opportunities
6. Implementation roadmap for insights

Focus on delivering clear, actionable insights that can drive business decisions.`;

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insights Generator</h2>
            <p className="text-gray-600">Transform data into actionable business intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Pattern Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Actionable Intelligence</span>
          </div>
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Data Analysis</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="insights-generator" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Insights Analysis Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Input
                    id="data-source"
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                    placeholder="e.g., Website analytics, Sales data, CRM"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-type">Analysis Type</Label>
                  <Select value={formData.analysisType} onValueChange={(value) => handleInputChange('analysisType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis focus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="customer-behavior">Customer Behavior</SelectItem>
                      <SelectItem value="sales-performance">Sales Performance</SelectItem>
                      <SelectItem value="marketing-effectiveness">Marketing Effectiveness</SelectItem>
                      <SelectItem value="operational-efficiency">Operational Efficiency</SelectItem>
                      <SelectItem value="financial-analysis">Financial Analysis</SelectItem>
                      <SelectItem value="market-trends">Market Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-question">Key Business Question</Label>
                  <Textarea
                    id="business-question"
                    value={formData.businessQuestion}
                    onChange={(e) => handleInputChange('businessQuestion', e.target.value)}
                    placeholder="What specific business question do you want answered?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-timeframe">Data Timeframe</Label>
                  <Select value={formData.dataTimeframe} onValueChange={(value) => handleInputChange('dataTimeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="year-over-year">Year over Year</SelectItem>
                      <SelectItem value="custom">Custom Period</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-challenges">Current Challenges</Label>
                  <Textarea
                    id="current-challenges"
                    value={formData.currentChallenges}
                    onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                    placeholder="What challenges are you trying to solve?"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expected-outcome">Expected Outcome</Label>
                  <Input
                    id="expected-outcome"
                    value={formData.expectedOutcome}
                    onChange={(e) => handleInputChange('expectedOutcome', e.target.value)}
                    placeholder="What action do you want to take based on insights?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating Insights..." : "Generate Actionable Insights"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}