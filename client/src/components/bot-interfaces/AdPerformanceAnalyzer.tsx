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
import { BarChart3, TrendingUp, DollarSign, Target, Zap, PieChart, Activity } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  campaignName: z.string().min(1, "Campaign name is required"),
  platform: z.string().min(1, "Platform is required"),
  budget: z.string().min(1, "Budget is required"),
  currentMetrics: z.string().min(1, "Current metrics are required"),
});

type FormData = z.infer<typeof formSchema>;

const platformOptions = [
  "Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "TikTok Ads", "Multi-Platform"
];

interface AdPerformanceAnalyzerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function AdPerformanceAnalyzer({ sessionId, onSendMessage, isLoading }: AdPerformanceAnalyzerProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      campaignName: "",
      platform: "",
      budget: "",
      currentMetrics: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Analyze ad performance and provide comprehensive optimization recommendations for ${data.businessName}'s ${data.campaignName} campaign.

**Campaign Details:**
- Platform: ${data.platform}
- Budget: ${data.budget}
- Current Metrics: ${data.currentMetrics}

Please provide detailed, user-friendly ad performance analysis covering:

## 💰 ROI ANALYSIS
- Comprehensive ROI calculation with current performance breakdown
- Cost per acquisition (CPA) analysis and industry benchmark comparison
- Revenue attribution analysis across different touchpoints
- Profit margin assessment and lifetime value considerations
- Budget efficiency scoring and allocation recommendations
- Return on ad spend (ROAS) optimization opportunities
- Cost-effectiveness analysis by campaign elements and audience segments

## 📊 PERFORMANCE TRENDS
- Key performance metrics analysis with trend identification
- Click-through rate (CTR) performance and improvement opportunities
- Conversion rate trends and optimization potential
- Audience engagement patterns and behavioral insights
- Device and placement performance breakdowns
- Geographic performance analysis and expansion opportunities
- Time-based performance patterns and scheduling optimization

## 🎯 OPTIMIZATION SUGGESTIONS
### Immediate Quick Wins (Implement Today)
- Bid adjustment recommendations for better ROI
- Negative keyword additions to reduce wasted spend
- Ad scheduling optimization for peak performance times
- Budget reallocation strategies for high-performing segments
- Underperforming ad creative pausing and replacement

### Short-term Improvements (Next 2-4 Weeks)
- Creative refresh strategies with A/B testing frameworks
- Landing page optimization recommendations for better conversion
- Audience refinement and targeting expansion strategies
- New ad formats and placement testing opportunities
- Campaign structure optimization for better performance tracking

### Long-term Strategic Changes (Next 1-3 Months)
- Campaign architecture overhaul for scale and efficiency
- Cross-channel integration and attribution modeling
- Competitive positioning and market expansion strategies
- Advanced automation and smart bidding implementations
- Performance forecasting and growth planning initiatives

## ⚡ IMPLEMENTATION ROADMAP
- Step-by-step optimization implementation guide
- Priority matrix for maximum impact changes
- Timeline and resource allocation for improvements
- Testing methodologies and success measurement frameworks
- Risk assessment and mitigation strategies
- Performance monitoring and ongoing optimization workflows

Format the response with specific metrics, actionable recommendations, and implementation timelines. Use modern formatting and clear explanations to make it accessible for marketing teams and business owners.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Performance Analysis Started",
          description: "Analyzing ROI, trends, and creating optimization recommendations...",
        });
      }
    } catch (error) {
      console.error("Performance analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to start performance analysis",
        variant: "destructive",
      });
    }
  };

  // If there's no active session, show the session creation interface
  if (!sessionId) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Ad Performance Analyzer</h2>
              <p className="text-gray-600">AI-powered ROI analysis with performance trends and optimization suggestions</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>ROI Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Performance Trends</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Optimization Tips</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">ROI Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive return analysis with cost breakdowns and profit optimization strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Performance Trends</h3>
              </div>
              <p className="text-sm text-gray-600">
                Trend identification with engagement patterns and performance forecasting
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Optimization Tips</h3>
              </div>
              <p className="text-sm text-gray-600">
                Actionable recommendations with implementation roadmaps and success frameworks
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Analyze Your Ad Performance</CardTitle>
            <CardDescription>
              Create a session to access the performance analyzer and receive comprehensive ROI insights
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Data-Driven</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Comprehensive Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Actionable Insights</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the ad performance analyzer
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If there's an active session, show the form or chat interface
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Ad Performance Analyzer</h2>
            <p className="text-gray-600">AI-powered ROI analysis with performance trends and optimization suggestions</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>ROI Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Performance Trends</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Optimization Tips</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <BarChart3 className="w-5 h-5" />
            <span>Campaign Performance Analysis</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            Provide your campaign details for comprehensive performance analysis and optimization recommendations
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
                      <FormLabel className="text-gray-800 font-medium">Business Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your business name" 
                          {...field} 
                          data-testid="input-business-name"
                          className="bg-white border-blue-200 focus:border-blue-400"
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
                      <FormLabel className="text-gray-800 font-medium">Campaign Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Name of campaign to analyze" 
                          {...field} 
                          data-testid="input-campaign-name"
                          className="bg-white border-blue-200 focus:border-blue-400"
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
                      <FormLabel className="text-gray-800 font-medium">Platform *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400" data-testid="select-platform">
                            <SelectValue placeholder="Select advertising platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platformOptions.map((platform) => (
                            <SelectItem key={platform} value={platform.toLowerCase().replace(/\s+/g, '-')}>
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
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Campaign Budget *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., $5,000/month or $50/day" 
                          {...field} 
                          data-testid="input-budget"
                          className="bg-white border-blue-200 focus:border-blue-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentMetrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Current Performance Metrics *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your current ad metrics (CTR, CPC, conversions, ROAS, etc.) and any performance data you'd like analyzed"
                        className="min-h-[100px] bg-white border-blue-200 focus:border-blue-400"
                        {...field} 
                        data-testid="textarea-current-metrics"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3"
                data-testid="button-analyze-performance"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing Performance...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Ad Performance
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="ad-performance-analyzer" />
    </div>
  );
}