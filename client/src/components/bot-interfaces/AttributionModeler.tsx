import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitBranch, Users, BarChart3 } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface AttributionModelerProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function AttributionModeler({ sessionId: propSessionId, onSendMessage, isLoading }: AttributionModelerProps) {
  const [formData, setFormData] = useState({
    businessModel: "",
    channels: "",
    conversionGoal: "",
    touchpoints: "",
    attributionModel: "",
    analysisTimeframe: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create comprehensive attribution modeling analysis:

Business Model: ${formData.businessModel}
Marketing Channels: ${formData.channels}
Conversion Goal: ${formData.conversionGoal}
Customer Touchpoints: ${formData.touchpoints}
Attribution Model Type: ${formData.attributionModel}
Analysis Timeframe: ${formData.analysisTimeframe}

Please provide:
1. Channel contribution analysis
2. Attribution analysis framework
3. Channel performance assessment
4. Customer journey mapping and insights
5. Multi-touch attribution recommendations
6. ROI by channel breakdown
7. Optimization strategies for underperforming channels

Focus on actionable insights to optimize marketing channel investments.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attribution Modeler</h2>
            <p className="text-gray-600">Analyze channel contribution and customer journey</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Channel Contribution</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Customer Journey</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Attribution Analysis</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="attribution-modeler" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Attribution Model Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business-model">Business Model</Label>
                  <Select value={formData.businessModel} onValueChange={(value) => handleInputChange('businessModel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="saas">SaaS/Software</SelectItem>
                      <SelectItem value="lead-gen">Lead Generation</SelectItem>
                      <SelectItem value="content">Content/Media</SelectItem>
                      <SelectItem value="service">Service Business</SelectItem>
                      <SelectItem value="marketplace">Marketplace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="channels">Marketing Channels</Label>
                  <Textarea
                    id="channels"
                    value={formData.channels}
                    onChange={(e) => handleInputChange('channels', e.target.value)}
                    placeholder="List your marketing channels (Google Ads, Facebook, Email, etc.)"
                    rows={2}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="conversion-goal">Primary Conversion Goal</Label>
                  <Input
                    id="conversion-goal"
                    value={formData.conversionGoal}
                    onChange={(e) => handleInputChange('conversionGoal', e.target.value)}
                    placeholder="e.g., Purchase, Sign-up, Download"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="touchpoints">Customer Touchpoints</Label>
                  <Textarea
                    id="touchpoints"
                    value={formData.touchpoints}
                    onChange={(e) => handleInputChange('touchpoints', e.target.value)}
                    placeholder="Describe the typical customer journey touchpoints..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attribution-model">Attribution Model</Label>
                  <Select value={formData.attributionModel} onValueChange={(value) => handleInputChange('attributionModel', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select attribution model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="first-touch">First Touch</SelectItem>
                      <SelectItem value="last-touch">Last Touch</SelectItem>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="time-decay">Time Decay</SelectItem>
                      <SelectItem value="position-based">Position Based</SelectItem>
                      <SelectItem value="data-driven">Data Driven</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-timeframe">Analysis Timeframe</Label>
                  <Select value={formData.analysisTimeframe} onValueChange={(value) => handleInputChange('analysisTimeframe', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Building Attribution Model..." : "Generate Attribution Analysis"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}