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
import { DollarSign, TrendingUp, Calculator, PieChart, Zap, Target, BarChart3 } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  totalBudget: z.string().min(1, "Total budget is required"),
  budgetPeriod: z.string().min(1, "Budget period is required"),
  campaignGoals: z.string().min(1, "Campaign goals are required"),
  currentPerformance: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const budgetPeriodOptions = [
  "Daily", "Weekly", "Monthly", "Quarterly"
];

interface BudgetOptimizerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function BudgetOptimizer({ sessionId, onSendMessage, isLoading }: BudgetOptimizerProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      totalBudget: "",
      budgetPeriod: "",
      campaignGoals: "",
      currentPerformance: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive budget optimization strategy for ${data.businessName}.

**Budget Parameters:**
- Total Budget: ${data.totalBudget}
- Budget Period: ${data.budgetPeriod}
- Campaign Goals: ${data.campaignGoals}
${data.currentPerformance ? `- Current Performance: ${data.currentPerformance}` : ""}

Please provide a detailed, modern analysis covering:

## 💰 BUDGET OPTIMIZATION
- Optimal budget allocation across channels and campaigns
- Performance-based budget distribution recommendations
- Budget scaling strategies based on performance metrics
- Daily/weekly budget pacing recommendations
- Emergency budget reallocation protocols

## 🎯 BID STRATEGIES
- Platform-specific bidding recommendations (Google, Facebook, LinkedIn, etc.)
- Automated vs. manual bidding strategy selection
- Target CPA, ROAS, and impression share strategies
- Bid adjustment recommendations by device, location, time
- Smart bidding optimization techniques
- A/B testing frameworks for bid strategies

## 📊 SPEND ALLOCATION
- Channel-wise budget distribution with percentage breakdowns
- Campaign priority matrix and budget tiers
- Geographic and demographic allocation strategies
- Seasonal budget adjustment recommendations
- Performance monitoring and reallocation triggers
- ROI-based spending optimization

## ⚡ IMPLEMENTATION ROADMAP
- Phase-wise budget rollout strategy
- Key performance indicators and monitoring dashboards
- Budget adjustment workflows and decision trees
- Scaling protocols for successful campaigns
- Risk management and budget protection strategies

Format the response with clear sections, actionable insights, specific budget allocations, and performance metrics. Use emojis and modern formatting to make it visually appealing and easy to scan.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Budget Analysis Started",
          description: "Generating comprehensive budget optimization and allocation strategies...",
        });
      }
    } catch (error) {
      console.error("Budget optimization error:", error);
      toast({
        title: "Error",
        description: "Failed to start budget analysis",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Budget Optimizer</h2>
              <p className="text-gray-600">AI-powered budget allocation and bid strategy optimization</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>Smart Allocation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Bid Strategies</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>ROI Optimization</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Budget Allocation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Optimal distribution across channels with performance-based recommendations and scaling strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-teal-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Bid Strategies</h3>
              </div>
              <p className="text-sm text-gray-600">
                Platform-specific bidding recommendations with automated and manual strategy selection
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Spend Optimization</h3>
              </div>
              <p className="text-sm text-gray-600">
                ROI-based spending optimization with real-time monitoring and adjustment protocols
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Optimize Your Budget</CardTitle>
            <CardDescription>
              Create a session to access the budget optimization form and receive comprehensive allocation strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4" />
                  <span>Smart Allocation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>ROI Focused</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the budget optimization form
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Budget Optimizer</h2>
            <p className="text-gray-600">AI-powered budget allocation and bid strategy optimization</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>Smart Allocation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Bid Strategies</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>ROI Optimization</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            <span>Budget Optimization Configuration</span>
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Provide your budget details for comprehensive optimization and allocation strategies
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
                          className="bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalBudget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Total Budget *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., $10,000 or 10000" 
                          {...field} 
                          data-testid="input-total-budget"
                          className="bg-white border-emerald-200 focus:border-emerald-400"
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
                  name="budgetPeriod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Budget Period *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400" data-testid="select-budget-period">
                            <SelectValue placeholder="Select budget period" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {budgetPeriodOptions.map((period) => (
                            <SelectItem key={period} value={period.toLowerCase()}>
                              {period}
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
                  name="campaignGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Campaign Goals *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Lead generation, Sales, Brand awareness" 
                          {...field} 
                          data-testid="input-campaign-goals"
                          className="bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="currentPerformance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Current Performance (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your current campaign performance, metrics, challenges, or areas for improvement..."
                        className="min-h-[100px] bg-white border-emerald-200 focus:border-emerald-400"
                        {...field} 
                        data-testid="textarea-current-performance"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3"
                data-testid="button-optimize-budget"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Optimizing Budget...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Optimize My Budget
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="budget-optimizer" />
    </div>
  );
}