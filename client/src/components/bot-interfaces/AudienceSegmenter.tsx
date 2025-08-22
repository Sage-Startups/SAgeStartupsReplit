import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, UserCheck, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface AudienceSegmenterProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function AudienceSegmenter({ sessionId: propSessionId, onSendMessage, isLoading }: AudienceSegmenterProps) {
  const [formData, setFormData] = useState({
    customerBase: "",
    segmentationCriteria: "",
    businessGoal: "",
    dataAvailable: "",
    targetSegments: "",
    analysisDepth: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create comprehensive audience segmentation analysis:

Customer Base Size: ${formData.customerBase}
Segmentation Criteria: ${formData.segmentationCriteria}
Business Goal: ${formData.businessGoal}
Available Data: ${formData.dataAvailable}
Target Number of Segments: ${formData.targetSegments}
Analysis Depth: ${formData.analysisDepth}

Please provide:
1. Customer grouping strategy
2. Audience segmentation framework
3. Behavioral analysis insights
4. Customer profiling for each segment
5. Segment characteristics and personas
6. Targeting recommendations for each segment
7. Personalization strategies by segment

Focus on actionable segments that enable targeted marketing and improved customer experience.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audience Segmenter</h2>
            <p className="text-gray-600">Customer grouping and behavioral analysis</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Customer Grouping</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4" />
            <span>Behavioral Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Customer Profiling</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="audience-segmenter" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Segmentation Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customer-base">Customer Base Size</Label>
                  <Input
                    id="customer-base"
                    value={formData.customerBase}
                    onChange={(e) => handleInputChange('customerBase', e.target.value)}
                    placeholder="e.g., 10,000 customers, 500 users"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="segmentation-criteria">Segmentation Criteria</Label>
                  <Select value={formData.segmentationCriteria} onValueChange={(value) => handleInputChange('segmentationCriteria', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Primary segmentation basis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="demographics">Demographics</SelectItem>
                      <SelectItem value="behavior">Behavior/Usage</SelectItem>
                      <SelectItem value="psychographics">Psychographics</SelectItem>
                      <SelectItem value="value">Customer Value/CLV</SelectItem>
                      <SelectItem value="lifecycle">Lifecycle Stage</SelectItem>
                      <SelectItem value="geographic">Geographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-goal">Business Goal</Label>
                  <Select value={formData.businessGoal} onValueChange={(value) => handleInputChange('businessGoal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's the goal?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personalization">Personalization</SelectItem>
                      <SelectItem value="retention">Customer Retention</SelectItem>
                      <SelectItem value="acquisition">Customer Acquisition</SelectItem>
                      <SelectItem value="upselling">Upselling/Cross-selling</SelectItem>
                      <SelectItem value="churn-reduction">Churn Reduction</SelectItem>
                      <SelectItem value="product-development">Product Development</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-available">Available Data</Label>
                  <Textarea
                    id="data-available"
                    value={formData.dataAvailable}
                    onChange={(e) => handleInputChange('dataAvailable', e.target.value)}
                    placeholder="What customer data do you have? (purchase history, demographics, behavior, etc.)"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-segments">Target Number of Segments</Label>
                  <Select value={formData.targetSegments} onValueChange={(value) => handleInputChange('targetSegments', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How many segments?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3-4">3-4 Segments</SelectItem>
                      <SelectItem value="5-6">5-6 Segments</SelectItem>
                      <SelectItem value="7-8">7-8 Segments</SelectItem>
                      <SelectItem value="flexible">Flexible (Let data decide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analysis-depth">Analysis Depth</Label>
                  <Select value={formData.analysisDepth} onValueChange={(value) => handleInputChange('analysisDepth', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level of detail" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Segmentation</SelectItem>
                      <SelectItem value="detailed">Detailed Personas</SelectItem>
                      <SelectItem value="advanced">Advanced with Predictions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Analyzing Audience..." : "Generate Audience Segmentation"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}