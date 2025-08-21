import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Target, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudienceSegmenterProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  segmentationGoal: z.string().min(1, "Segmentation goal is required"),
  dataSource: z.string().min(1, "Data source is required"),
  segmentationCriteria: z.string().min(1, "Segmentation criteria are required"),
  targetingObjective: z.string().min(1, "Targeting objective is required"),
});

type FormData = z.infer<typeof formSchema>;

export function AudienceSegmenter({ sessionId: propSessionId, onSendMessage, isLoading }: AudienceSegmenterProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      segmentationGoal: "",
      dataSource: "",
      segmentationCriteria: "",
      targetingObjective: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive audience segmentation analysis for ${data.businessName} in the ${data.industry} industry.

**Segmentation Parameters:**
- Business Name: ${data.businessName}
- Industry: ${data.industry}
- Segmentation Goal: ${data.segmentationGoal}
- Data Source: ${data.dataSource}
- Segmentation Criteria: ${data.segmentationCriteria}
- Targeting Objective: ${data.targetingObjective}

Please provide detailed customer segmentation analysis:

## 👥 **Customer Segments Identification**
- Primary audience segments
- Segment size and characteristics
- Demographic profiles
- Psychographic attributes
- Behavioral patterns

## 🎯 **Segment Prioritization**
- High-value segment identification
- Growth potential analysis
- Accessibility and reachability
- Competitive landscape by segment
- Resource allocation recommendations

## 📊 **Behavioral Analysis**
- Purchase behavior patterns
- Engagement preferences
- Communication channel preferences
- Decision-making processes
- Pain points and motivations

## 💡 **Targeting Strategies**
- Segment-specific messaging
- Channel optimization by segment
- Personalization opportunities
- Campaign strategies
- Product/service positioning

## 📈 **Optimization Opportunities**
- Cross-segment insights
- Segment migration potential
- Lifetime value optimization
- Retention strategies
- Acquisition recommendations

## 🚀 **Implementation Roadmap**
- Segmentation implementation steps
- Data collection requirements
- Technology and tools needed
- Measurement and KPIs
- Testing and optimization plan

Format with specific segment profiles, targeting recommendations, and actionable strategies.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Audience Segmentation Started",
          description: "Analyzing customer groups and behavioral patterns...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Audience segmentation error:", error);
      toast({
        title: "Error",
        description: `Failed to generate audience segmentation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audience Segmenter</h2>
            <p className="text-gray-600">Identify and analyze customer groups for targeted marketing</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Audience Segmentation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Behavioral Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Targeting Optimization</span>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Segmentation Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name</Label>
                <Input
                  id="business-name"
                  {...form.register("businessName")}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Market</Label>
                <Input
                  id="industry"
                  {...form.register("industry")}
                  placeholder="e.g., E-commerce, SaaS, Healthcare"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="segmentation-goal">Segmentation Goal</Label>
                <Select onValueChange={(value) => form.setValue("segmentationGoal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personalization">Personalization</SelectItem>
                    <SelectItem value="targeting">Improved Targeting</SelectItem>
                    <SelectItem value="retention">Customer Retention</SelectItem>
                    <SelectItem value="acquisition">Customer Acquisition</SelectItem>
                    <SelectItem value="product-development">Product Development</SelectItem>
                    <SelectItem value="pricing-strategy">Pricing Strategy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">Primary Data Source</Label>
                <Select onValueChange={(value) => form.setValue("dataSource", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website-analytics">Website Analytics</SelectItem>
                    <SelectItem value="crm-data">CRM Data</SelectItem>
                    <SelectItem value="transaction-data">Transaction Data</SelectItem>
                    <SelectItem value="survey-data">Survey Data</SelectItem>
                    <SelectItem value="social-media">Social Media Data</SelectItem>
                    <SelectItem value="mixed-sources">Mixed Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="segmentation-criteria">Segmentation Criteria</Label>
                <Textarea
                  id="segmentation-criteria"
                  {...form.register("segmentationCriteria")}
                  placeholder="What criteria should be used? (e.g., demographics, behavior, purchase history, engagement level)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targeting-objective">Targeting Objective</Label>
                <Select onValueChange={(value) => form.setValue("targetingObjective", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select targeting objective" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="increase-conversions">Increase Conversions</SelectItem>
                    <SelectItem value="improve-engagement">Improve Engagement</SelectItem>
                    <SelectItem value="reduce-churn">Reduce Churn</SelectItem>
                    <SelectItem value="upsell-cross-sell">Upsell/Cross-sell</SelectItem>
                    <SelectItem value="brand-loyalty">Brand Loyalty</SelectItem>
                    <SelectItem value="market-expansion">Market Expansion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Analyzing Audience Segments..." : "Generate Audience Segmentation"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}