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
import { Calculator, DollarSign, TrendingUp, Zap, PieChart, BarChart3, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  investmentType: z.string().min(1, "Investment type is required"),
  totalInvestment: z.string().min(1, "Total investment is required"),
  timeframe: z.string().min(1, "Timeframe is required"),
  revenueGenerated: z.string().min(1, "Revenue generated is required"),
  additionalCosts: z.string().min(1, "Additional costs are required"),
});

type FormData = z.infer<typeof formSchema>;

const investmentTypeOptions = [
  "Marketing Campaign", "Technology/Software", "Equipment/Tools", "Personnel/Training", "Product Development", "Infrastructure"
];

const timeframeOptions = [
  "1 month", "3 months", "6 months", "12 months", "18 months", "24 months"
];

interface ROICalculatorProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function ROICalculator({ sessionId, onSendMessage, isLoading }: ROICalculatorProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      investmentType: "",
      totalInvestment: "",
      timeframe: "",
      revenueGenerated: "",
      additionalCosts: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Calculate comprehensive ROI analysis and investment tracking for ${data.businessName}.

**Investment Details:**
- Investment Type: ${data.investmentType}
- Total Investment: $${data.totalInvestment}
- Analysis Timeframe: ${data.timeframe}
- Revenue Generated: $${data.revenueGenerated}
- Additional Costs: $${data.additionalCosts}

Please provide detailed, user-friendly ROI analysis covering:

## 💰 ROI CALCULATION & TRACKING
- Complete ROI calculation with formula breakdown and percentage returns
- Investment tracking with detailed cost categorization and timeline analysis
- Net profit calculation with gross profit margins and profit-to-investment ratios
- Break-even analysis with payback period calculation and cash flow timing
- ROI performance benchmarking against industry standards and best practices
- Monthly and quarterly ROI tracking with trend analysis and variance reporting
- Cost per result analysis with efficiency metrics and performance indicators

## 📊 PROFITABLE ANALYSIS
- Profitability assessment with detailed margin analysis and revenue attribution
- Revenue optimization opportunities with growth potential identification
- Cost reduction strategies with efficiency improvements and waste elimination
- Profit margin enhancement recommendations with pricing strategy optimization
- Investment performance evaluation with risk-adjusted returns and scenario analysis
- Future profitability projections with growth modeling and revenue forecasting
- Competitive ROI positioning with market comparison and benchmark analysis

## 📈 INVESTMENT PERFORMANCE METRICS
- Key performance indicators with measurement frameworks and success criteria
- Return on investment trends with historical performance and pattern analysis
- Investment efficiency ratios with productivity metrics and utilization rates
- Risk-adjusted returns with volatility assessment and downside protection
- Performance attribution analysis with factor decomposition and driver identification
- Investment portfolio optimization with allocation recommendations and diversification strategies
- Value creation metrics with economic value added and shareholder returns

## ⚡ OPTIMIZATION RECOMMENDATIONS
- Strategic recommendations for improving ROI with actionable implementation steps
- Investment reallocation strategies with portfolio optimization and risk management
- Performance improvement tactics with operational efficiency and process optimization
- Cost optimization opportunities with expense reduction and resource utilization
- Revenue enhancement strategies with market expansion and customer acquisition
- Timeline optimization with milestone planning and resource scheduling
- Risk mitigation strategies with contingency planning and scenario management

Format the response with specific calculations, percentage returns, dollar amounts, and actionable recommendations. Use clear financial terminology suitable for business owners and financial decision makers.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "ROI Analysis Started",
          description: "Calculating investment returns and profitability analysis...",
        });
      }
    } catch (error) {
      console.error("ROI calculation error:", error);
      toast({
        title: "Error",
        description: "Failed to start ROI calculation",
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
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
              <p className="text-gray-600">AI-powered investment tracking with ROI calculation and profit analysis</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4" />
              <span>Investment Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4" />
              <span>ROI Calculator</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Profit Analysis</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Investment Tracking</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive cost tracking with detailed categorization and timeline analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">ROI Calculator</h3>
              </div>
              <p className="text-sm text-gray-600">
                Precise ROI calculations with performance benchmarking and trend analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Profit Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Profitability assessment with optimization recommendations and growth strategies
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Calculate Your Investment ROI</CardTitle>
            <CardDescription>
              Create a session to access the ROI calculator and receive comprehensive investment analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant Calculations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <PieChart className="w-4 h-4" />
                  <span>Detailed Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Growth Insights</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the ROI calculator
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
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">ROI Calculator</h2>
            <p className="text-gray-600">AI-powered investment tracking with ROI calculation and profit analysis</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4" />
            <span>Investment Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-4 h-4" />
            <span>ROI Calculator</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Profit Analysis</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Calculator className="w-5 h-5" />
            <span>Investment Analysis Configuration</span>
          </CardTitle>
          <CardDescription className="text-emerald-700">
            Provide your investment details for comprehensive ROI calculation and profitability analysis
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
                  name="investmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Investment Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400" data-testid="select-investment-type">
                            <SelectValue placeholder="Select investment category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investmentTypeOptions.map((type) => (
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="totalInvestment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Total Investment Amount ($) *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 50000" 
                          {...field} 
                          data-testid="input-total-investment"
                          className="bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </FormControl>
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
                          <SelectTrigger className="bg-white border-emerald-200 focus:border-emerald-400" data-testid="select-timeframe">
                            <SelectValue placeholder="Select analysis period" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="revenueGenerated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Revenue Generated ($) *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Total revenue from this investment" 
                          {...field} 
                          data-testid="input-revenue-generated"
                          className="bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalCosts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Additional Costs ($) *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Ongoing costs, maintenance, etc." 
                          {...field} 
                          data-testid="input-additional-costs"
                          className="bg-white border-emerald-200 focus:border-emerald-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-medium py-3"
                data-testid="button-calculate-roi"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Calculating ROI...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Calculate Investment ROI
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="roi-calculator" />
    </div>
  );
}