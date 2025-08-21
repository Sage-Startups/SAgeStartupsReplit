import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Scale, Trophy } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CompetitorBenchmarkingProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function CompetitorBenchmarking({ sessionId: propSessionId, onSendMessage, isLoading }: CompetitorBenchmarkingProps) {
  const [formData, setFormData] = useState({
    industry: "",
    competitors: "",
    benchmarkArea: "",
    keyMetrics: "",
    analysisGoal: "",
    timeframe: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Conduct comprehensive competitor benchmarking analysis:

Industry: ${formData.industry}
Key Competitors: ${formData.competitors}
Benchmark Area: ${formData.benchmarkArea}
Key Metrics: ${formData.keyMetrics}
Analysis Goal: ${formData.analysisGoal}
Timeframe: ${formData.timeframe}

Please provide:
1. Market comparison analysis
2. Competitive analysis framework
3. Market benchmarking results
4. Performance comparison insights
5. Competitive positioning assessment
6. Gap analysis and opportunities
7. Strategic recommendations for competitive advantage

Focus on actionable insights to improve competitive positioning.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Competitor Benchmarking</h2>
            <p className="text-gray-600">Analyze market competition and performance comparison</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4" />
            <span>Market Comparison</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Competitive Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4" />
            <span>Performance Benchmarking</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="competitor-benchmarking" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Benchmarking Analysis Setup</CardTitle>
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
                    placeholder="e.g., E-commerce, SaaS, Fintech"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitors">Key Competitors</Label>
                  <Textarea
                    id="competitors"
                    value={formData.competitors}
                    onChange={(e) => handleInputChange('competitors', e.target.value)}
                    placeholder="List main competitors to analyze..."
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benchmark-area">Benchmark Area</Label>
                  <Select value={formData.benchmarkArea} onValueChange={(value) => handleInputChange('benchmarkArea', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pricing">Pricing Strategy</SelectItem>
                      <SelectItem value="product-features">Product Features</SelectItem>
                      <SelectItem value="marketing">Marketing Performance</SelectItem>
                      <SelectItem value="customer-service">Customer Service</SelectItem>
                      <SelectItem value="market-share">Market Share</SelectItem>
                      <SelectItem value="digital-presence">Digital Presence</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-metrics">Key Metrics to Compare</Label>
                  <Textarea
                    id="key-metrics"
                    value={formData.keyMetrics}
                    onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                    placeholder="What specific metrics should be benchmarked?"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-goal">Analysis Goal</Label>
                  <Input
                    id="analysis-goal"
                    value={formData.analysisGoal}
                    onChange={(e) => handleInputChange('analysisGoal', e.target.value)}
                    placeholder="What do you want to achieve with this analysis?"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeframe">Analysis Timeframe</Label>
                  <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current State</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="historical">Historical Trends</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Analyzing Competitors..." : "Generate Benchmarking Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}