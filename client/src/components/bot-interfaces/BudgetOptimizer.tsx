import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Coins, DollarSign, TrendingUp, Calculator, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  totalBudget: z.string().min(1, "Total budget is required"),
  budgetPeriod: z.string().min(1, "Budget period is required"),
  campaignGoals: z.string().min(1, "Campaign goals are required"),
  currentPerformance: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  productPrice: z.string().optional(),
  targetCPL: z.string().optional(),
  targetROAS: z.string().optional(),
  conversionRate: z.string().optional(),
  currentCPM: z.string().optional(),
  currentCPC: z.string().optional(),
  audienceSize: z.string().optional(),
  geoTargeting: z.string().optional(),
  seasonality: z.string().optional(),
  competitorSpend: z.string().optional(),
  bidStrategy: z.string().optional(),
  constraints: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const budgetPeriodOptions = [
  "Daily", "Weekly", "Monthly", "Quarterly", "Campaign Duration"
];

const platformOptions = [
  "Google Ads", "Facebook Ads", "Instagram Ads", "LinkedIn Ads", "Twitter Ads", "TikTok Ads", "YouTube Ads", "Snapchat Ads", "Pinterest Ads"
];

const bidStrategyOptions = [
  "Manual CPC", "Enhanced CPC", "Target CPA", "Target ROAS", "Maximize Clicks", "Maximize Conversions", "Target Impression Share"
];

interface BudgetOptimizerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function BudgetOptimizer({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: BudgetOptimizerProps = {}) {
  const [sessionId, setSessionId] = useState<number | null>(propSessionId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      totalBudget: "",
      budgetPeriod: "",
      campaignGoals: "",
      currentPerformance: "",
      platforms: [],
      productPrice: "",
      targetCPL: "",
      targetROAS: "",
      conversionRate: "",
      currentCPM: "",
      currentCPC: "",
      audienceSize: "",
      geoTargeting: "",
      seasonality: "",
      competitorSpend: "",
      bidStrategy: "",
      constraints: "",
      additionalContext: "",
    },
  });

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = form.getValues("platforms") || [];
    if (checked) {
      form.setValue("platforms", [...currentPlatforms, platform]);
    } else {
      form.setValue("platforms", currentPlatforms.filter(p => p !== platform));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a comprehensive budget optimization strategy for ${data.businessName} in the ${data.industry} industry.

**Budget Parameters:**
- Total Budget: ${data.totalBudget}
- Budget Period: ${data.budgetPeriod}
- Campaign Goals: ${data.campaignGoals}
${data.currentPerformance ? `- Current Performance: ${data.currentPerformance}` : ""}

**Financial Context:**
${data.productPrice ? `- Product/Service Price: ${data.productPrice}` : ""}
${data.targetCPL ? `- Target Cost per Lead: ${data.targetCPL}` : ""}
${data.targetROAS ? `- Target ROAS: ${data.targetROAS}` : ""}
${data.conversionRate ? `- Conversion Rate: ${data.conversionRate}` : ""}

**Current Metrics:**
${data.currentCPM ? `- Current CPM: ${data.currentCPM}` : ""}
${data.currentCPC ? `- Current CPC: ${data.currentCPC}` : ""}
${data.audienceSize ? `- Audience Size: ${data.audienceSize}` : ""}

**Platform Distribution:**
${data.platforms?.length ? `- Target Platforms: ${data.platforms.join(", ")}` : ""}
${data.bidStrategy ? `- Preferred Bid Strategy: ${data.bidStrategy}` : ""}

**Market Context:**
${data.geoTargeting ? `- Geographic Targeting: ${data.geoTargeting}` : ""}
${data.seasonality ? `- Seasonality Factors: ${data.seasonality}` : ""}
${data.competitorSpend ? `- Competitor Spend Analysis: ${data.competitorSpend}` : ""}

**Constraints:**
${data.constraints ? `- Budget Constraints: ${data.constraints}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive budget optimization strategy that includes:

1. **Budget Allocation Matrix** - Detailed breakdown across platforms, campaigns, and objectives
2. **Cost-Effective Strategies** - Methods to maximize ROI and minimize waste
3. **Bid Optimization** - Smart bidding strategies and automated rules
4. **Spend Allocation** - Daily, weekly, and campaign-level budget distribution
5. **Performance Forecasting** - Expected results based on budget allocation
6. **ROI Maximization** - Strategies to improve return on ad spend
7. **Budget Scaling** - How to increase budget efficiently as performance improves
8. **Cost Control** - Methods to prevent overspend and optimize costs
9. **Platform-Specific Budgeting** - Tailored strategies for each advertising platform
10. **Monitoring & Adjustment** - KPIs to track and optimization triggers
11. **Emergency Budget Plans** - Contingency strategies for performance drops
12. **Seasonal Budget Planning** - Adjustments for peak and off-season periods

Format with specific dollar amounts, percentages, and actionable implementation steps.`;

      if (onSendMessage) {
        onSendMessage(prompt);
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Budget optimizer error:", error);
      toast({
        title: "Error",
        description: `Failed to start budget optimization: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            <Coins className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Budget Optimizer</h1>
            <p className="text-gray-600">Cost-effective allocation, bid strategies, and spend optimization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Budget Optimization</p>
                  <p className="text-xs text-gray-600">Maximize efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Bid Strategies</p>
                  <p className="text-xs text-gray-600">Smart bidding</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Spend Allocation</p>
                  <p className="text-xs text-gray-600">Strategic distribution</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">ROI Maximization</p>
                  <p className="text-xs text-gray-600">Performance focus</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {sessionId && propSessionId ? (
        <BotChatInterface sessionId={sessionId} botType="budget-optimizer" />
      ) : (
        <>
          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Budget Optimization Setup
              </CardTitle>
              <CardDescription>
                Provide your budget parameters and performance goals for optimal allocation strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Business Foundation */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Business Foundation</h3>
                    
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
                        name="industry"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Industry *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., E-commerce, SaaS, Healthcare" 
                                {...field} 
                                data-testid="input-industry"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="campaignGoals"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Campaign Goals *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What are your primary campaign objectives? (leads, sales, awareness, etc.)"
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-campaign-goals"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Budget Parameters */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Budget Parameters</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="totalBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Budget *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $5,000, $50,000" 
                                {...field} 
                                data-testid="input-total-budget"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="budgetPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Period *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-budget-period">
                                  <SelectValue placeholder="Select period" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {budgetPeriodOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
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
                      name="currentPerformance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Performance (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your current ad performance, metrics, and challenges..."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-current-performance"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Financial Targets */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Financial Targets</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="productPrice"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product/Service Price</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $99, $199/month" 
                                {...field} 
                                data-testid="input-product-price"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetCPL"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Cost per Lead</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $25, $50" 
                                {...field} 
                                data-testid="input-target-cpl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetROAS"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target ROAS</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 3:1, 5:1" 
                                {...field} 
                                data-testid="input-target-roas"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="conversionRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Conversion Rate</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2%, 5%" 
                                {...field} 
                                data-testid="input-conversion-rate"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentCPM"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current CPM</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $5, $15" 
                                {...field} 
                                data-testid="input-current-cpm"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentCPC"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current CPC</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $1.50, $3.00" 
                                {...field} 
                                data-testid="input-current-cpc"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Platform Strategy */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Platform Strategy</h3>
                    
                    <div>
                      <Label className="text-base font-medium">Target Platforms</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {platformOptions.map((platform) => (
                          <div key={platform} className="flex items-center space-x-2">
                            <Checkbox
                              id={`platform-${platform}`}
                              checked={form.watch("platforms")?.includes(platform)}
                              onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                            />
                            <Label htmlFor={`platform-${platform}`} className="text-sm">{platform}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="bidStrategy"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Bid Strategy</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-bid-strategy">
                                  <SelectValue placeholder="Select bid strategy" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {bidStrategyOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="audienceSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience Size</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 100K, 1M, 5M+" 
                                {...field} 
                                data-testid="input-audience-size"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Market Context */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Market Context</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="geoTargeting"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Geographic Targeting</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., US, California, European Union" 
                                {...field} 
                                data-testid="input-geo-targeting"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="seasonality"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Seasonality Factors</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Holiday peaks, Summer lows" 
                                {...field} 
                                data-testid="input-seasonality"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="competitorSpend"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitor Spend Analysis</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What do you know about competitor advertising spend and strategies?"
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-competitor-spend"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="constraints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Constraints</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any limitations or restrictions on budget allocation?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-constraints"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="additionalContext"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Context</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any other relevant information for budget optimization..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-additional-context"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading || propIsLoading}
                    data-testid="button-optimize-budget"
                  >
                    {isLoading || propIsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Optimizing Budget Allocation...
                      </>
                    ) : (
                      <>
                        <Coins className="w-4 h-4 mr-2" />
                        Generate Budget Strategy
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}