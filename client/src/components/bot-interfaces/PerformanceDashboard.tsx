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
import { BarChart3, TrendingUp, Monitor, Zap, PieChart, Activity, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  dashboardGoal: z.string().min(1, "Dashboard goal is required"),
  keyMetrics: z.string().min(1, "Key metrics are required"),
  updateFrequency: z.string().min(1, "Update frequency is required"),
});

type FormData = z.infer<typeof formSchema>;

const businessTypeOptions = [
  "E-commerce", "SaaS", "Agency", "Consulting", "Manufacturing", "Retail", "Healthcare", "Education"
];

const dashboardGoalOptions = [
  "Executive Overview", "Operational Monitoring", "Marketing Performance", "Sales Analytics", "Financial Tracking"
];

const updateFrequencyOptions = [
  "Real-time", "Hourly", "Daily", "Weekly", "Monthly"
];

interface PerformanceDashboardProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function PerformanceDashboard({ sessionId, onSendMessage, isLoading }: PerformanceDashboardProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      dashboardGoal: "",
      keyMetrics: "",
      updateFrequency: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive performance dashboard strategy for ${data.businessName}.

**Dashboard Configuration:**
- Business Type: ${data.businessType}
- Dashboard Goal: ${data.dashboardGoal}
- Key Metrics Focus: ${data.keyMetrics}
- Update Frequency: ${data.updateFrequency}

Please provide detailed, user-friendly dashboard design guidance covering:

## 📊 REAL-TIME METRICS
- Essential KPIs for ${data.businessType} business with specific measurement criteria
- Real-time monitoring setup and data refresh strategies
- Critical performance indicators that require immediate attention
- Live tracking implementation for key business drivers
- Automated alert systems for threshold breaches
- Data accuracy and reliability protocols
- Mobile dashboard optimization for on-the-go monitoring

## 📈 KPI TRACKING RECOMMENDATIONS
- Primary KPIs aligned with ${data.dashboardGoal} objectives
- Secondary metrics that support main business goals
- Leading vs lagging indicator classification and balance
- Industry benchmark comparisons and competitive analysis
- Target setting methodologies and realistic goal frameworks
- Performance trend analysis and pattern recognition
- Predictive analytics integration for future planning

## 📋 DASHBOARD RECORDING STRUCTURE
- Daily tracking metrics with automated data collection
- Weekly summary reports and trend analysis
- Monthly performance reviews and strategic insights
- Quarterly business health assessments
- Custom reporting frameworks for stakeholder communication
- Data governance and quality assurance protocols
- Historical data preservation and archiving strategies

## ⚡ IMPLEMENTATION FRAMEWORK
- Step-by-step dashboard creation and setup process
- Tool recommendations and integration strategies
- Data source connections and API configurations
- Visualization best practices and user experience design
- Team access controls and permission management
- Training protocols for dashboard users
- Maintenance schedules and optimization procedures

Format the response with specific KPI examples, measurement methods, and practical implementation steps. Use clear explanations suitable for business owners and their teams.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Dashboard Analysis Started",
          description: "Creating comprehensive KPI tracking and real-time monitoring strategy...",
        });
      }
    } catch (error) {
      console.error("Dashboard analysis error:", error);
      toast({
        title: "Error",
        description: "Failed to start dashboard analysis",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
              <p className="text-gray-600">AI-powered real-time metrics with KPI tracking and recording suggestions</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Real-time Metrics</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>KPI Tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Recording Guide</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Real-time Metrics</h3>
              </div>
              <p className="text-sm text-gray-600">
                Live monitoring setup with critical performance indicators and automated alerts
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">KPI Tracking</h3>
              </div>
              <p className="text-sm text-gray-600">
                Strategic KPI selection with industry benchmarks and goal-setting frameworks
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Recording Guide</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive recording structure with automated data collection and reporting
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Design Your Performance Dashboard</CardTitle>
            <CardDescription>
              Create a session to access the dashboard designer and receive comprehensive KPI strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Live Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Custom KPIs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Smart Insights</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the performance dashboard designer
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <p className="text-gray-600">AI-powered real-time metrics with KPI tracking and recording suggestions</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Real-time Metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>KPI Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>Recording Guide</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <BarChart3 className="w-5 h-5" />
            <span>Dashboard Configuration</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            Provide your business details for comprehensive performance dashboard design and KPI recommendations
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
                          className="bg-white border-orange-200 focus:border-orange-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Business Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400" data-testid="select-business-type">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {businessTypeOptions.map((type) => (
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
                  name="dashboardGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Dashboard Goal *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400" data-testid="select-dashboard-goal">
                            <SelectValue placeholder="Select primary goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dashboardGoalOptions.map((goal) => (
                            <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                              {goal}
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
                  name="updateFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Update Frequency *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400" data-testid="select-update-frequency">
                            <SelectValue placeholder="Select update frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {updateFrequencyOptions.map((frequency) => (
                            <SelectItem key={frequency} value={frequency.toLowerCase().replace(/\s+/g, '-')}>
                              {frequency}
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
                name="keyMetrics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Key Metrics to Track *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What specific metrics and KPIs are most important for your business? (e.g., revenue, customer acquisition, conversion rates, user engagement)"
                        className="min-h-[100px] bg-white border-orange-200 focus:border-orange-400"
                        {...field} 
                        data-testid="textarea-key-metrics"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3"
                data-testid="button-design-dashboard"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Designing Dashboard...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Design Performance Dashboard
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="performance-dashboard" />
    </div>
  );
}