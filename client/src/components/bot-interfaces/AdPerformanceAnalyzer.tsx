import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { BarChart3, TrendingUp, DollarSign, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  campaignName: z.string().min(1, "Campaign name is required"),
  platform: z.string().min(1, "Platform is required"),
  campaignType: z.string().min(1, "Campaign type is required"),
  budget: z.string().min(1, "Budget is required"),
  currentMetrics: z.string().min(1, "Current metrics are required"),
  goals: z.string().min(1, "Campaign goals are required"),
});

type FormData = z.infer<typeof formSchema>;

const platformOptions = [
  "Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "Twitter Ads", "TikTok Ads", "YouTube Ads", "Multi-Platform"
];

const campaignTypeOptions = [
  "Search", "Display", "Video", "Shopping", "Social", "Remarketing", "Brand Awareness", "Lead Generation"
];

interface AdPerformanceAnalyzerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function AdPerformanceAnalyzer({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: AdPerformanceAnalyzerProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      campaignName: "",
      platform: "",
      campaignType: "",
      budget: "",
      currentMetrics: "",
      goals: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Analyze ad performance and provide optimization recommendations for ${data.businessName}'s ${data.campaignName} campaign.

**Campaign Details:**
- Platform: ${data.platform}
- Campaign Type: ${data.campaignType}
- Budget: ${data.budget}
- Current Metrics: ${data.currentMetrics}
- Goals: ${data.goals}

Please provide comprehensive performance analysis and optimization recommendations:

## 💰 **ROI Analysis**
- Current ROI calculation
- Cost per acquisition breakdown
- Revenue attribution analysis
- Profit margin assessment
- Lifetime value considerations
- Budget efficiency score

## 📊 **Performance Metrics Deep Dive**
- CTR analysis and benchmarks
- Conversion rate optimization opportunities
- Quality score improvements
- Impression share analysis
- Audience engagement metrics
- Device and placement performance

## 🎯 **Optimization Recommendations**
### Immediate Actions (Quick Wins)
- Bid adjustments
- Negative keywords
- Ad schedule optimization
- Budget reallocation
- Underperforming ad pausing

### Medium-term Improvements
- Creative refresh strategies
- Landing page optimization
- Audience refinement
- New ad formats to test
- Geographic expansion/restriction

### Long-term Strategic Changes
- Campaign structure overhaul
- Attribution model changes
- Cross-channel integration
- Competitive positioning
- Market expansion opportunities

## 📈 **Performance Forecasting**
- Expected improvements from optimizations
- ROI projections (30/60/90 days)
- Budget scaling recommendations
- Risk assessment
- Seasonal considerations

## 🔍 **Competitive Analysis**
- Industry benchmarks comparison
- Competitive gaps and opportunities
- Share of voice analysis
- Pricing strategy recommendations
- Unique selling proposition refinement

## 🛠️ **Testing Framework**
- A/B test priorities
- Testing timeline
- Success metrics
- Statistical significance requirements
- Implementation roadmap

## 📝 **Action Plan**
- Week 1 priorities
- Month 1 milestones
- Quarter 1 goals
- Resource requirements
- Monitoring schedule

Format with specific numbers, percentages, and actionable steps for immediate implementation.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Performance Analysis Started",
          description: "Analyzing ROI and generating optimization recommendations...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Ad performance analyzer error:", error);
      toast({
        title: "Error",
        description: `Failed to analyze ad performance: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ad Performance Analyzer</h1>
            <p className="text-gray-600">ROI analysis, performance optimization, and recommendations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">ROI Analysis</p>
                  <p className="text-xs text-gray-600">Return tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Performance Metrics</p>
                  <p className="text-xs text-gray-600">Deep analysis</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Optimization</p>
                  <p className="text-xs text-gray-600">Improvements</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Recommendations</p>
                  <p className="text-xs text-gray-600">Action plans</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {false ? (
        <BotChatInterface sessionId={propSessionId} botType="ad-performance" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Campaign Performance Details
            </CardTitle>
            <CardDescription>
              Provide your campaign data for comprehensive performance analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your business name" 
                            {...field} 
                            data-testid="input-business-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Name of your ad campaign" 
                            {...field} 
                            data-testid="input-campaign-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-platform">
                              <SelectValue placeholder="Select ad platform" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {platformOptions.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-campaign-type">
                              <SelectValue placeholder="Type of campaign" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {campaignTypeOptions.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., $5,000/month or $100/day"
                          {...field} 
                          data-testid="input-budget"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentMetrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Metrics *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share your current performance data (CTR, CPC, conversions, etc.)"
                          {...field} 
                          data-testid="textarea-metrics"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="goals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Goals *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What are you trying to achieve with this campaign?"
                          {...field} 
                          data-testid="textarea-goals"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || propIsLoading}
                  data-testid="button-analyze-performance"
                >
                  {isLoading || propIsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Analyzing Performance...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Analyze Ad Performance
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}