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
import { Beaker, BarChart3, TrendingUp, Target, Zap, FlaskConical, Activity } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  testObjective: z.string().min(1, "Test objective is required"),
  testType: z.string().min(1, "Test type is required"),
  currentMetrics: z.string().min(1, "Current metrics are required"),
  hypothesis: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const testTypeOptions = [
  "A/B Test", "Multivariate Test", "Landing Page Test", "Ad Creative Test", "Email Test"
];

interface ABTestDesignerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function ABTestDesigner({ sessionId, onSendMessage, isLoading }: ABTestDesignerProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      testObjective: "",
      testType: "",
      currentMetrics: "",
      hypothesis: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Design a comprehensive A/B testing strategy for ${data.businessName}.

**Test Foundation:**
- Test Objective: ${data.testObjective}
- Test Type: ${data.testType}
- Current Metrics: ${data.currentMetrics}
${data.hypothesis ? `- Hypothesis: ${data.hypothesis}` : ""}

Please provide a detailed, user-friendly analysis covering:

## 🧪 TEST DESIGN
- Clear test structure and methodology
- Step-by-step test setup instructions
- Control vs. variation design recommendations
- Test timeline and duration planning
- Sample size calculations and requirements
- Traffic allocation strategies (50/50, 70/30, etc.)

## 🎯 VARIABLE SELECTION
- Primary variables to test (headlines, CTAs, images, layouts)
- Secondary variables for multivariate testing
- Variable priority ranking and impact assessment
- Element-specific testing recommendations
- Risk assessment for each variable change
- Implementation complexity analysis

## 📊 STATISTICAL ANALYSIS
- Statistical significance requirements (95% confidence level)
- Power analysis and minimum detectable effect
- Sample size calculations with formulas
- Test duration estimation based on traffic
- Key metrics to track and monitor
- Results interpretation guidelines
- Decision-making frameworks for test conclusions

## ⚡ IMPLEMENTATION GUIDE
- Pre-launch checklist and quality assurance
- Monitoring and tracking setup instructions
- Test launching and management procedures
- Results collection and analysis methods
- Post-test action recommendations
- Scaling successful variations

Format the response with clear sections, actionable steps, specific calculations, and easy-to-understand explanations. Use emojis and modern formatting to make it user-friendly and engaging.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "A/B Test Design Started",
          description: "Creating comprehensive test strategy with statistical analysis...",
        });
      }
    } catch (error) {
      console.error("A/B test design error:", error);
      toast({
        title: "Error",
        description: "Failed to start A/B test design",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Beaker className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">A/B Test Designer</h2>
              <p className="text-gray-600">AI-powered test design with statistical analysis</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <FlaskConical className="w-4 h-4" />
              <span>Test Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Variable Selection</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Statistical Analysis</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <FlaskConical className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Test Design</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete test methodology with control vs. variation setup, sample size calculations, and timeline planning
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Variable Selection</h3>
              </div>
              <p className="text-sm text-gray-600">
                Smart variable prioritization with impact assessment and implementation complexity analysis
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Statistical Analysis</h3>
              </div>
              <p className="text-sm text-gray-600">
                Comprehensive statistical framework with significance testing and results interpretation guidelines
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Design Your A/B Test</CardTitle>
            <CardDescription>
              Create a session to access the test designer form and receive comprehensive testing strategies
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
                  <Beaker className="w-4 h-4" />
                  <span>Scientific Method</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Data-Driven Results</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the A/B test designer
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
            <Beaker className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">A/B Test Designer</h2>
            <p className="text-gray-600">AI-powered test design with statistical analysis</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <FlaskConical className="w-4 h-4" />
            <span>Test Design</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Variable Selection</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Statistical Analysis</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <Beaker className="w-5 h-5" />
            <span>A/B Test Configuration</span>
          </CardTitle>
          <CardDescription className="text-purple-700">
            Provide your test details for comprehensive A/B testing strategy and statistical analysis
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
                          className="bg-white border-purple-200 focus:border-purple-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="testType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Test Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400" data-testid="select-test-type">
                            <SelectValue placeholder="Select test type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {testTypeOptions.map((type) => (
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

              <FormField
                control={form.control}
                name="testObjective"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Test Objective *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What are you trying to improve or optimize? (e.g., increase conversion rate, improve click-through rate, reduce bounce rate)"
                        className="min-h-[80px] bg-white border-purple-200 focus:border-purple-400"
                        {...field} 
                        data-testid="textarea-test-objective"
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
                    <FormLabel className="text-gray-800 font-medium">Current Performance Metrics *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Share your current performance data (e.g., conversion rate: 2.5%, CTR: 1.2%, monthly visitors: 10,000)"
                        className="min-h-[100px] bg-white border-purple-200 focus:border-purple-400"
                        {...field} 
                        data-testid="textarea-current-metrics"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hypothesis"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Test Hypothesis (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="If you have a specific hypothesis about what changes will improve performance, share it here..."
                        className="min-h-[80px] bg-white border-purple-200 focus:border-purple-400"
                        {...field} 
                        data-testid="textarea-hypothesis"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3"
                data-testid="button-design-test"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Designing Test...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Design My A/B Test
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="ab-test-designer" />
    </div>
  );
}