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
import { GitBranch, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttributionModelerProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  conversionGoal: z.string().min(1, "Conversion goal is required"),
  marketingChannels: z.string().min(1, "Marketing channels are required"),
  customerJourney: z.string().min(1, "Customer journey is required"),
  attributionModel: z.string().min(1, "Attribution model is required"),
  trackingPeriod: z.string().min(1, "Tracking period is required"),
});

type FormData = z.infer<typeof formSchema>;

export function AttributionModeler({ sessionId: propSessionId, onSendMessage, isLoading }: AttributionModelerProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      conversionGoal: "",
      marketingChannels: "",
      customerJourney: "",
      attributionModel: "",
      trackingPeriod: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive attribution modeling analysis for ${data.businessName}.

**Attribution Parameters:**
- Business Name: ${data.businessName}
- Conversion Goal: ${data.conversionGoal}
- Marketing Channels: ${data.marketingChannels}
- Customer Journey: ${data.customerJourney}
- Attribution Model: ${data.attributionModel}
- Tracking Period: ${data.trackingPeriod}

Please provide detailed channel contribution analysis:

## 🔍 **Attribution Model Framework**
- Attribution methodology explanation
- Model selection rationale
- Data collection requirements
- Tracking implementation guide
- Cross-device considerations

## 📊 **Channel Performance Analysis**
- Individual channel contribution
- Multi-touch attribution weights
- First-touch vs last-touch analysis
- Assist vs direct conversions
- Channel interaction effects

## 🎯 **Customer Journey Mapping**
- Typical customer path analysis
- Touch point identification
- Journey stage attribution
- Conversion path variations
- Drop-off point analysis

## 💡 **Attribution Insights**
- Top performing channel combinations
- Undervalued channel identification
- Budget reallocation recommendations
- Cross-channel synergies
- Attribution model optimization

## 📈 **Performance Metrics**
- Channel-specific conversion rates
- Cost per acquisition by channel
- Return on ad spend (ROAS)
- Lifetime value attribution
- Multi-touch conversion paths

## 🚀 **Optimization Recommendations**
- Budget allocation strategies
- Channel mix optimization
- Attribution model refinements
- Tracking improvements
- Performance enhancement tactics

Format with specific metrics, attribution weights, and actionable recommendations.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Attribution Analysis Started",
          description: "Modeling channel contributions and customer journeys...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Attribution modeling error:", error);
      toast({
        title: "Error",
        description: `Failed to generate attribution model: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Attribution Modeler</h2>
            <p className="text-gray-600">Analyze channel contribution and customer journey impact</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4" />
            <span>Attribution Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Channel Performance</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Customer Journey</span>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Attribution Model Configuration</CardTitle>
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
                <Label htmlFor="conversion-goal">Primary Conversion Goal</Label>
                <Select onValueChange={(value) => form.setValue("conversionGoal", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select conversion goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales/Revenue</SelectItem>
                    <SelectItem value="leads">Lead Generation</SelectItem>
                    <SelectItem value="signups">Sign-ups/Registrations</SelectItem>
                    <SelectItem value="subscriptions">Subscriptions</SelectItem>
                    <SelectItem value="downloads">Downloads</SelectItem>
                    <SelectItem value="engagement">Engagement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="marketing-channels">Marketing Channels</Label>
                <Textarea
                  id="marketing-channels"
                  {...form.register("marketingChannels")}
                  placeholder="List all marketing channels (e.g., Google Ads, Facebook, Email, Organic Search, etc.)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-journey">Typical Customer Journey</Label>
                <Textarea
                  id="customer-journey"
                  {...form.register("customerJourney")}
                  placeholder="Describe typical customer touchpoints and journey stages"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attribution-model">Attribution Model Type</Label>
                <Select onValueChange={(value) => form.setValue("attributionModel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select attribution model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first-touch">First-Touch</SelectItem>
                    <SelectItem value="last-touch">Last-Touch</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="time-decay">Time-Decay</SelectItem>
                    <SelectItem value="position-based">Position-Based (U-shaped)</SelectItem>
                    <SelectItem value="data-driven">Data-Driven</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking-period">Analysis Period</Label>
                <Select onValueChange={(value) => form.setValue("trackingPeriod", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tracking period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7-days">7 Days</SelectItem>
                    <SelectItem value="30-days">30 Days</SelectItem>
                    <SelectItem value="90-days">90 Days</SelectItem>
                    <SelectItem value="6-months">6 Months</SelectItem>
                    <SelectItem value="1-year">1 Year</SelectItem>
                    <SelectItem value="custom">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Building Attribution Model..." : "Create Attribution Analysis"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}