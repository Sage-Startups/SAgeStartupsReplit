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
import { Beaker, BarChart3, TrendingUp, Target, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  testObjective: z.string().min(1, "Test objective is required"),
  testType: z.string().min(1, "Test type is required"),
  currentMetrics: z.string().min(1, "Current metrics are required"),
  primaryGoal: z.string().optional(),
  hypothesis: z.string().optional(),
  targetAudience: z.string().optional(),
  testVariables: z.array(z.string()).optional(),
  trafficSplit: z.string().optional(),
  sampleSize: z.string().optional(),
  testDuration: z.string().optional(),
  significanceLevel: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  currentPerformance: z.string().optional(),
  constraints: z.string().optional(),
  expectedLift: z.string().optional(),
  budget: z.string().optional(),
  stakeholders: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const testTypeOptions = [
  "A/B Test", "Multivariate Test", "Split URL Test", "Landing Page Test", "Ad Creative Test", "Email Test", "Product Test"
];

const testVariableOptions = [
  "Headlines", "Call-to-Action", "Images", "Colors", "Layout", "Copy", "Pricing", "Forms", "Navigation", "Product Features"
];

const platformOptions = [
  "Website", "Google Ads", "Facebook Ads", "Email Campaign", "Landing Page", "App", "Social Media"
];

const significanceLevelOptions = [
  "90% (0.10)", "95% (0.05)", "99% (0.01)"
];

const trafficSplitOptions = [
  "50/50", "33/33/33", "25/25/25/25", "60/40", "70/30", "80/20"
];

export function ABTestDesigner() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      testObjective: "",
      testType: "",
      currentMetrics: "",
      primaryGoal: "",
      hypothesis: "",
      targetAudience: "",
      testVariables: [],
      trafficSplit: "",
      sampleSize: "",
      testDuration: "",
      significanceLevel: "",
      platforms: [],
      currentPerformance: "",
      constraints: "",
      expectedLift: "",
      budget: "",
      stakeholders: "",
      additionalContext: "",
    },
  });

  const handleVariableChange = (variable: string, checked: boolean) => {
    const currentVariables = form.getValues("testVariables") || [];
    if (checked) {
      form.setValue("testVariables", [...currentVariables, variable]);
    } else {
      form.setValue("testVariables", currentVariables.filter(v => v !== variable));
    }
  };

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
      const prompt = `Design a comprehensive A/B testing strategy for ${data.businessName} in the ${data.industry} industry.

**Test Foundation:**
- Test Objective: ${data.testObjective}
- Test Type: ${data.testType}
- Current Metrics: ${data.currentMetrics}
${data.primaryGoal ? `- Primary Goal: ${data.primaryGoal}` : ""}
${data.hypothesis ? `- Hypothesis: ${data.hypothesis}` : ""}

**Test Configuration:**
${data.testVariables?.length ? `- Test Variables: ${data.testVariables.join(", ")}` : ""}
${data.trafficSplit ? `- Traffic Split: ${data.trafficSplit}` : ""}
${data.sampleSize ? `- Sample Size: ${data.sampleSize}` : ""}
${data.testDuration ? `- Test Duration: ${data.testDuration}` : ""}
${data.significanceLevel ? `- Significance Level: ${data.significanceLevel}` : ""}

**Audience & Performance:**
${data.targetAudience ? `- Target Audience: ${data.targetAudience}` : ""}
${data.currentPerformance ? `- Current Performance: ${data.currentPerformance}` : ""}
${data.expectedLift ? `- Expected Lift: ${data.expectedLift}` : ""}

**Platform Context:**
${data.platforms?.length ? `- Test Platforms: ${data.platforms.join(", ")}` : ""}
${data.budget ? `- Budget: ${data.budget}` : ""}

**Project Context:**
${data.constraints ? `- Constraints: ${data.constraints}` : ""}
${data.stakeholders ? `- Stakeholders: ${data.stakeholders}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive A/B testing strategy that includes:

1. **Experiment Design** - Test structure, control vs variants, and methodology
2. **Variable Selection** - What elements to test and why they matter
3. **Statistical Framework** - Sample size calculation, power analysis, and confidence intervals
4. **Test Setup** - Technical implementation, tracking, and measurement setup
5. **Results Analysis** - Statistical significance, practical significance, and interpretation methods
6. **Implementation Plan** - Timeline, resources needed, and rollout strategy
7. **Success Metrics** - Primary and secondary KPIs with measurement criteria
8. **Risk Assessment** - Potential issues and mitigation strategies
9. **Testing Calendar** - Sequential testing plan and iteration strategy
10. **Documentation Framework** - Test logging, results tracking, and knowledge management
11. **Platform-Specific Guidelines** - Implementation details for each testing platform
12. **Post-Test Actions** - Winner implementation, learnings capture, and next test planning

Format with specific statistical calculations, actionable implementation steps, and clear success criteria.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "ab-testing",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "A/B Test Design Started",
        description: "Creating experiment framework with statistical analysis...",
      });
    } catch (error) {
      console.error("A/B test designer error:", error);
      toast({
        title: "Error",
        description: `Failed to start A/B test design: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            <Beaker className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">A/B Test Designer</h1>
            <p className="text-gray-600">Experiment planning, variable selection, and statistical analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Beaker className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Test Design</p>
                  <p className="text-xs text-gray-600">Experiment planning</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Variable Selection</p>
                  <p className="text-xs text-gray-600">Smart testing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Statistical Analysis</p>
                  <p className="text-xs text-gray-600">Data-driven insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Results Interpretation</p>
                  <p className="text-xs text-gray-600">Actionable outcomes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {sessionId ? (
        <BotChatInterface sessionId={sessionId} botType="ab-testing" />
      ) : (
        <>
          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                A/B Test Configuration
              </CardTitle>
              <CardDescription>
                Design your experiment with proper statistical framework and testing methodology
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
                      name="testObjective"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Test Objective *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What do you want to achieve with this A/B test? (e.g., increase conversion rate, improve click-through rate)"
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-test-objective"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="testType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-test-type">
                                  <SelectValue placeholder="Select test type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {testTypeOptions.map((option) => (
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
                        name="primaryGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Goal</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Increase signup rate by 15%" 
                                {...field} 
                                data-testid="input-primary-goal"
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
                          <FormLabel>Current Metrics *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your current performance metrics, conversion rates, traffic volumes, etc."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-current-metrics"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Test Design */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Test Design</h3>
                    
                    <FormField
                      control={form.control}
                      name="hypothesis"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hypothesis</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What is your hypothesis? (e.g., If we change the CTA color from blue to green, then conversion rate will increase because...)"
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-hypothesis"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div>
                      <Label className="text-base font-medium">Test Variables</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {testVariableOptions.map((variable) => (
                          <div key={variable} className="flex items-center space-x-2">
                            <Checkbox
                              id={`variable-${variable}`}
                              checked={form.watch("testVariables")?.includes(variable)}
                              onCheckedChange={(checked) => handleVariableChange(variable, checked as boolean)}
                            />
                            <Label htmlFor={`variable-${variable}`} className="text-sm">{variable}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="trafficSplit"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Traffic Split</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-traffic-split">
                                  <SelectValue placeholder="Select split" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {trafficSplitOptions.map((option) => (
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
                        name="sampleSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sample Size</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 10,000 visitors" 
                                {...field} 
                                data-testid="input-sample-size"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="testDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test Duration</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2 weeks, 30 days" 
                                {...field} 
                                data-testid="input-test-duration"
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
                        name="significanceLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Significance Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-significance-level">
                                  <SelectValue placeholder="Select significance" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {significanceLevelOptions.map((option) => (
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
                        name="expectedLift"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Lift</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 10%, 15%, 25%" 
                                {...field} 
                                data-testid="input-expected-lift"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Target Audience</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe your target audience for this test..."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-target-audience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Platform & Implementation */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Platform & Implementation</h3>
                    
                    <div>
                      <Label className="text-base font-medium">Test Platforms</Label>
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
                        name="currentPerformance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Performance</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Current conversion rates, engagement metrics, performance data..."
                                className="min-h-[80px]"
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
                        name="constraints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Constraints</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any technical, budget, or time constraints..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-constraints"
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
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $5,000, No budget limit" 
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
                        name="stakeholders"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stakeholders</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Who needs to approve or review results?" 
                                {...field} 
                                data-testid="input-stakeholders"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="additionalContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Context</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Any other relevant information for test design..."
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

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-design-test"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Designing A/B Test...
                      </>
                    ) : (
                      <>
                        <Beaker className="w-4 h-4 mr-2" />
                        Generate Test Design
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