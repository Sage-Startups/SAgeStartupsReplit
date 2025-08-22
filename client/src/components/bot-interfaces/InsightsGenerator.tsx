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
import { Lightbulb, Brain, Target, Zap, TrendingUp, Search, Eye } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  dataSource: z.string().min(1, "Data source is required"),
  analysisType: z.string().min(1, "Analysis type is required"),
  businessQuestion: z.string().min(1, "Business question is required"),
  currentPerformance: z.string().min(1, "Current performance data is required"),
  specificGoals: z.string().min(1, "Specific goals are required"),
  timeframe: z.string().min(1, "Timeframe is required"),
});

type FormData = z.infer<typeof formSchema>;

const dataSourceOptions = [
  "Website Analytics", "Sales Data", "CRM System", "Marketing Campaigns", "Customer Surveys", "Financial Reports", "Social Media", "Multi-source"
];

const analysisTypeOptions = [
  "Customer Behavior Analysis", "Sales Performance", "Marketing ROI", "Operational Efficiency", "Financial Trends", "Market Opportunities"
];

const timeframeOptions = [
  "Last 30 days", "Last 3 months", "Last 6 months", "Last 12 months", "Custom period"
];

interface InsightsGeneratorProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function InsightsGenerator({ sessionId, onSendMessage, isLoading }: InsightsGeneratorProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      dataSource: "",
      analysisType: "",
      businessQuestion: "",
      currentPerformance: "",
      specificGoals: "",
      timeframe: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Generate comprehensive actionable business insights for ${data.businessName}.

**Analysis Configuration:**
- Data Source: ${data.dataSource}
- Analysis Type: ${data.analysisType}
- Business Question: ${data.businessQuestion}
- Current Performance: ${data.currentPerformance}
- Specific Goals: ${data.specificGoals}
- Timeframe: ${data.timeframe}

Please provide detailed, user-friendly intelligence analysis covering:

## 🔍 PATTERN RECOGNITION ANALYSIS
- Deep dive into data patterns and trends with statistical significance
- Correlation analysis between different business metrics and performance indicators
- Seasonal patterns, cyclical trends, and anomaly detection in the data
- Customer behavior patterns and engagement trend identification
- Market opportunity patterns and competitive intelligence insights
- Performance benchmark analysis against industry standards
- Predictive pattern modeling for future trend forecasting

## 🧠 ACTIONABLE INTELLIGENCE
- Strategic recommendations based on data-driven insights and analysis
- Prioritized action items with impact assessment and resource requirements
- Quick wins that can be implemented immediately for measurable results
- Medium-term strategic initiatives with timeline and success metrics
- Long-term growth opportunities with market positioning strategies
- Risk mitigation strategies and contingency planning recommendations
- Performance optimization tactics across key business functions

## 📊 DATA-DRIVEN INSIGHTS
- Key findings with quantified impact analysis and supporting evidence
- Performance gaps identification with root cause analysis
- Opportunity sizing with revenue potential and market share implications
- Customer segment insights with behavioral profiling and preferences
- Competitive advantage analysis with differentiation opportunities
- Operational efficiency improvements with cost-benefit analysis
- Revenue optimization strategies with pricing and product insights

## ⚡ IMPLEMENTATION ROADMAP
- Step-by-step implementation plan with clear milestones and deliverables
- Resource allocation recommendations with budget and team requirements
- Timeline with phases and dependencies for successful execution
- Success measurement framework with KPIs and tracking mechanisms
- Risk assessment with mitigation strategies and alternative approaches
- Change management guidelines for organizational adoption
- Continuous monitoring and optimization protocols for sustained success

Format the response with specific metrics, quantified recommendations, and clear implementation steps. Use business-friendly language that translates complex data into actionable strategies for decision makers.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Insights Analysis Started",
          description: "Generating actionable intelligence with pattern recognition and strategic recommendations...",
        });
      }
    } catch (error) {
      console.error("Insights analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to start insights analysis",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Insights Generator</h2>
              <p className="text-gray-600">AI-powered data analysis with pattern recognition and actionable intelligence</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Search className="w-4 h-4" />
              <span>Pattern Recognition</span>
            </div>
            <div className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>Data Intelligence</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Actionable Insights</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Pattern Recognition</h3>
              </div>
              <p className="text-sm text-gray-600">
                Deep data analysis with trend identification and predictive modeling capabilities
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Data Intelligence</h3>
              </div>
              <p className="text-sm text-gray-600">
                Strategic recommendations with quantified impact analysis and evidence-based insights
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Strategic Insights</h3>
              </div>
              <p className="text-sm text-gray-600">
                Implementation roadmaps with clear milestones and success measurement frameworks
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Generate Business Insights</CardTitle>
            <CardDescription>
              Create a session to access the insights generator and receive comprehensive data analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>AI-Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Predictive Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>Strategic Focus</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the insights generator
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Insights Generator</h2>
            <p className="text-gray-600">AI-powered data analysis with pattern recognition and actionable intelligence</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Pattern Recognition</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="w-4 h-4" />
            <span>Data Intelligence</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Actionable Insights</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-indigo-800">
            <Lightbulb className="w-5 h-5" />
            <span>Insights Analysis Configuration</span>
          </CardTitle>
          <CardDescription className="text-indigo-700">
            Provide detailed business context for comprehensive data analysis and strategic intelligence generation
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
                          className="bg-white border-indigo-200 focus:border-indigo-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataSource"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Primary Data Source *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-indigo-200 focus:border-indigo-400" data-testid="select-data-source">
                            <SelectValue placeholder="Select data source" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dataSourceOptions.map((source) => (
                            <SelectItem key={source} value={source.toLowerCase().replace(/\s+/g, '-')}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="analysisType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Analysis Focus *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-indigo-200 focus:border-indigo-400" data-testid="select-analysis-type">
                            <SelectValue placeholder="Select analysis type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {analysisTypeOptions.map((type) => (
                            <SelectItem key={type} value={type.toLowerCase().replace(/\s+/g, '-')}>
                              {type}
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
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Analysis Timeframe *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-indigo-200 focus:border-indigo-400" data-testid="select-timeframe">
                            <SelectValue placeholder="Select timeframe" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeframeOptions.map((frame) => (
                            <SelectItem key={frame} value={frame.toLowerCase().replace(/\s+/g, '-')}>
                              {frame}
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
                name="businessQuestion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Key Business Question *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What specific business question or challenge are you trying to solve? (e.g., Why are conversions declining? How can we improve customer retention? What drives our best performing campaigns?)"
                        className="min-h-[80px] bg-white border-indigo-200 focus:border-indigo-400"
                        {...field} 
                        data-testid="textarea-business-question"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Current Performance Context *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your current performance metrics, trends you've noticed, and any context that would help with analysis (e.g., revenue trends, customer behavior changes, market conditions)"
                        className="min-h-[100px] bg-white border-indigo-200 focus:border-indigo-400"
                        {...field} 
                        data-testid="textarea-current-performance"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="specificGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Specific Goals & Success Metrics *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What specific outcomes are you looking to achieve? Include measurable goals, target metrics, and success criteria (e.g., increase conversion rate by 25%, reduce churn to under 5%, grow MRR by $50k)"
                        className="min-h-[100px] bg-white border-indigo-200 focus:border-indigo-400"
                        {...field} 
                        data-testid="textarea-specific-goals"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3"
                data-testid="button-generate-insights"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Generate Business Insights
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="insights-generator" />
    </div>
  );
}