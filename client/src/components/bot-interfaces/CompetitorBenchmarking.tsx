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
import { Target, TrendingUp, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CompetitorBenchmarkingProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  competitors: z.string().min(1, "Competitor information is required"),
  analysisType: z.string().min(1, "Analysis type is required"),
  keyMetrics: z.string().min(1, "Key metrics are required"),
  timeframe: z.string().min(1, "Timeframe is required"),
});

type FormData = z.infer<typeof formSchema>;

export function CompetitorBenchmarking({ sessionId: propSessionId, onSendMessage, isLoading }: CompetitorBenchmarkingProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      competitors: "",
      analysisType: "",
      keyMetrics: "",
      timeframe: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const prompt = `Perform a comprehensive competitive benchmarking analysis for ${data.businessName} in the ${data.industry} industry.

**Business Details:**
- Business Name: ${data.businessName}
- Industry: ${data.industry}
- Key Competitors: ${data.competitors}
- Analysis Type: ${data.analysisType}
- Key Metrics: ${data.keyMetrics}
- Analysis Timeframe: ${data.timeframe}

Please provide detailed competitive intelligence:

## 🎯 **Competitive Landscape Overview**
- Market position analysis
- Competitive strengths and weaknesses
- Market share estimations
- Pricing strategy comparisons
- Target audience overlap

## 📊 **Performance Benchmarks**
- Key metric comparisons
- Performance gap analysis
- Industry average comparisons
- Growth rate analysis
- Market penetration rates

## 🚀 **Strategic Opportunities**
- Market gaps and opportunities
- Competitive advantage areas
- Differentiation strategies
- Blue ocean opportunities
- Partnership possibilities

## 📈 **Market Intelligence**
- Trend analysis and predictions
- Competitive threat assessment
- Market positioning recommendations
- Strategic recommendations
- Action plan priorities

## 🔍 **SWOT Analysis**
- Competitive strengths to leverage
- Weaknesses to address
- Market opportunities to pursue
- Competitive threats to monitor

Format with specific metrics, actionable insights, and strategic recommendations.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Competitive Analysis Started",
          description: "Analyzing market position and competitive landscape...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Competitor benchmarking error:", error);
      toast({
        title: "Error",
        description: `Failed to generate competitive analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Competitor Benchmarking</h2>
            <p className="text-gray-600">Analyze market position and competitive landscape</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Market Comparison</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Performance Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Strategic Insights</span>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Competitive Analysis Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Your Business Name</Label>
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
                <Label htmlFor="competitors">Key Competitors</Label>
                <Textarea
                  id="competitors"
                  {...form.register("competitors")}
                  placeholder="List your main competitors (company names, websites, etc.)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Focus</Label>
                <Select onValueChange={(value) => form.setValue("analysisType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overall-performance">Overall Performance</SelectItem>
                    <SelectItem value="pricing-strategy">Pricing Strategy</SelectItem>
                    <SelectItem value="marketing-approach">Marketing Approach</SelectItem>
                    <SelectItem value="product-features">Product Features</SelectItem>
                    <SelectItem value="customer-experience">Customer Experience</SelectItem>
                    <SelectItem value="market-positioning">Market Positioning</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Compare</Label>
                <Textarea
                  id="key-metrics"
                  {...form.register("keyMetrics")}
                  placeholder="What specific metrics should be compared? (e.g., pricing, features, market share, customer reviews)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => form.setValue("timeframe", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current/Real-time</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="historical-trend">Historical Trend</SelectItem>
                    <SelectItem value="future-projection">Future Projection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Analyzing Competitors..." : "Generate Competitive Analysis"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}