import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Users, Target, TrendingUp, BarChart3, Zap, Brain, Search } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  productService: z.string().min(1, "Product/service description is required"),
  targetGoals: z.string().min(1, "Targeting goals are required"),
  currentAudience: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AudienceTargetingAssistantProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function AudienceTargetingAssistant({ sessionId, onSendMessage, isLoading }: AudienceTargetingAssistantProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      productService: "",
      targetGoals: "",
      currentAudience: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Conduct a comprehensive audience targeting analysis for ${data.businessName} in the ${data.industry} industry.

**Business Context:**
- Product/Service: ${data.productService}
- Targeting Goals: ${data.targetGoals}
${data.currentAudience ? `- Current Audience: ${data.currentAudience}` : ""}

Please provide a detailed, modern analysis covering:

## 🎯 AUDIENCE RESEARCH
- Primary audience personas with detailed demographics
- Secondary audience opportunities
- Market size and potential reach
- Behavioral patterns and motivations
- Customer journey mapping

## 📊 DEMOGRAPHIC ANALYSIS
- Age group breakdowns with targeting ratios
- Gender distribution and preferences  
- Geographic targeting recommendations
- Income level segmentation
- Education and occupation insights
- Device and platform usage patterns

## 💡 INTEREST TARGETING
- Core interest categories and subcategories
- Behavioral targeting parameters
- Lookalike audience strategies
- Custom audience recommendations
- Cross-platform interest mapping
- Seasonal targeting opportunities

## 🚀 IMPLEMENTATION STRATEGY
- Platform-specific targeting tactics
- Budget allocation recommendations
- Testing and optimization framework
- Performance tracking metrics
- Scaling strategies

Format the response with clear sections, actionable insights, and specific targeting parameters. Use emojis and modern formatting to make it visually appealing and easy to scan.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Audience Analysis Started",
          description: "Generating comprehensive targeting insights and demographic analysis...",
        });
      }
    } catch (error) {
      console.error("Audience targeting error:", error);
      toast({
        title: "Error",
        description: "Failed to start audience analysis",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Audience Targeting Assistant</h2>
              <p className="text-gray-600">AI-powered audience research and demographic analysis</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Precision Targeting</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Demographic Analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Interest Mapping</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Audience Research</h3>
              </div>
              <p className="text-sm text-gray-600">
                Deep dive into your target audience with persona development, behavioral analysis, and market sizing
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Demographic Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive demographic breakdowns with age, gender, location, and income targeting strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Interest Targeting</h3>
              </div>
              <p className="text-sm text-gray-600">
                Advanced interest and behavioral targeting with lookalike audiences and custom segments
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Start Your Audience Analysis</CardTitle>
            <CardDescription>
              Create a session to access the audience targeting form and begin your comprehensive analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Precise Results</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Actionable Insights</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the targeting form
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audience Targeting Assistant</h2>
            <p className="text-gray-600">AI-powered audience research and demographic analysis</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Precision Targeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Demographic Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Interest Mapping</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-cyan-800">
            <Target className="w-5 h-5" />
            <span>Audience Targeting Configuration</span>
          </CardTitle>
          <CardDescription className="text-cyan-700">
            Provide your business details for comprehensive audience research and targeting insights
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
                          className="bg-white border-cyan-200 focus:border-cyan-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Industry *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., E-commerce, SaaS, Healthcare" 
                          {...field} 
                          data-testid="input-industry"
                          className="bg-white border-cyan-200 focus:border-cyan-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="productService"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Product/Service Description *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe what you sell and its key benefits..."
                        className="min-h-[100px] bg-white border-cyan-200 focus:border-cyan-400"
                        {...field} 
                        data-testid="textarea-product-service"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Targeting Goals *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What do you want to achieve with your audience targeting?"
                        className="min-h-[80px] bg-white border-cyan-200 focus:border-cyan-400"
                        {...field} 
                        data-testid="textarea-target-goals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Current Audience (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your existing customers and what you know about them..."
                        className="min-h-[80px] bg-white border-cyan-200 focus:border-cyan-400"
                        {...field} 
                        data-testid="textarea-current-audience"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium py-3"
                data-testid="button-start-analysis"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Analyzing Audience...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Start Audience Analysis
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="audience-targeting" />
    </div>
  );
}