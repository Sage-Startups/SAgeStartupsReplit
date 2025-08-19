import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { RefreshCw, Users, Calendar, MessageSquare, ArrowRight, Sparkles } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  rebrandingReason: z.string().min(1, "Why are you rebranding?"),
  rebrandingScope: z.string().min(1, "What needs to change?"),
  timeline: z.string().min(1, "Timeline is required"),
  currentBrandIssues: z.string().optional(),
  targetAudience: z.string().optional(),
  brandHistory: z.string().optional(),
  currentAssets: z.string().optional(),
  desiredBrandImage: z.string().optional(),
  marketChanges: z.string().optional(),
  competitiveLandscape: z.string().optional(),
  stakeholderConcerns: z.string().optional(),
  budget: z.string().optional(),
  riskFactors: z.string().optional(),
  successMetrics: z.string().optional(),
  communicationChallenges: z.string().optional(),
  customerRetention: z.string().optional(),
  rebrandingGoals: z.string().optional(),
  changeManagement: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const rebrandingReasonOptions = [
  "Market repositioning",
  "Merger or acquisition",
  "Outdated brand image",
  "Target audience shift",
  "Competitive pressure",
  "Business model change",
  "Geographic expansion",
  "Product line evolution",
  "Negative brand perception",
  "Leadership change"
];

const rebrandingScopeOptions = [
  "Complete rebrand (name, logo, everything)",
  "Visual identity refresh",
  "Logo and identity update",
  "Messaging and positioning",
  "Name change only",
  "Brand architecture restructure",
  "Digital presence overhaul",
  "Product branding update",
  "Corporate identity refresh",
  "Selective brand elements"
];

const timelineOptions = [
  "3-6 months",
  "6-12 months",
  "1-2 years",
  "2+ years",
  "Flexible timeline",
  "Aggressive/Fast-track"
];

export function RebrandingConsultant() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      rebrandingReason: "",
      currentBrandIssues: "",
      targetAudience: "",
      brandHistory: "",
      currentAssets: "",
      desiredBrandImage: "",
      marketChanges: "",
      competitiveLandscape: "",
      stakeholderConcerns: "",
      rebrandingScope: "",
      budget: "",
      timeline: "",
      riskFactors: "",
      successMetrics: "",
      communicationChallenges: "",
      customerRetention: "",
      rebrandingGoals: "",
      changeManagement: "",
      additionalContext: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `As a Rebranding Consultant, create a comprehensive rebranding strategy for ${data.brandName} (${data.industry}).

**Situation Analysis:**
Reason: ${data.rebrandingReason}
Issues: ${data.currentBrandIssues}
Scope: ${data.rebrandingScope}
Timeline: ${data.timeline}
Goals: ${data.rebrandingGoals}

**Key Context:**
Target: ${data.targetAudience}
Market Changes: ${data.marketChanges}
Desired Image: ${data.desiredBrandImage}
Stakeholder Concerns: ${data.stakeholderConcerns}
Budget: ${data.budget}
${data.additionalContext ? `Additional: ${data.additionalContext}` : ""}

Provide a strategic rebranding plan with:

1. **Evolution Strategy** - Brand assessment, evolution approach, equity preservation
2. **Rebrand Framework** - Positioning evolution, visual transformation, digital migration
3. **Implementation Roadmap** - Phases, milestones, resource allocation, coordination
4. **Stakeholder Communication** - Internal alignment, customer education, PR strategy
5. **Risk Management** - Assessment matrix, prevention strategies, contingency plans
6. **Change Management** - Organizational strategy, employee adoption, training programs
7. **Performance Tracking** - KPIs, perception monitoring, success measurement
8. **Budget Planning** - Cost breakdown, resource optimization, ROI projections

Include specific timelines, actionable recommendations, and practical implementation guidance.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "rebranding-consultant",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Rebranding Strategy Development Started",
        description: "Creating comprehensive rebrand plan with transition strategy...",
      });
    } catch (error) {
      console.error("Rebranding consultant error:", error);
      toast({
        title: "Error", 
        description: `Failed to start rebranding consultation: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Rebranding Consultant</h1>
            <p className="text-gray-600">Evolution strategy, rebrand planning, transition management, and stakeholder communication</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="font-semibold text-sm">Evolution Strategy</p>
                  <p className="text-xs text-gray-600">Brand transformation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Rebrand Strategy</p>
                  <p className="text-xs text-gray-600">Complete framework</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-sm">Transition Planning</p>
                  <p className="text-xs text-gray-600">Implementation roadmap</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-fuchsia-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-fuchsia-600" />
                <div>
                  <p className="font-semibold text-sm">Stakeholder Comms</p>
                  <p className="text-xs text-gray-600">Change management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Rebranding Assessment
          </CardTitle>
          <CardDescription>
            Provide details about your current brand situation and rebranding needs for a comprehensive strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Current Brand Situation */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Current Brand Situation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your current brand name" 
                            {...field} 
                            data-testid="input-brand-name"
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
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Technology, Healthcare, Fashion" 
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
                  name="rebrandingReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Rebranding Reason</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-rebranding-reason">
                            <SelectValue placeholder="Why are you considering rebranding?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rebrandingReasonOptions.map((reason) => (
                            <SelectItem key={reason} value={reason}>
                              {reason}
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
                  name="currentBrandIssues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Brand Issues</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific problems or challenges are you facing with your current brand?"
                          {...field} 
                          data-testid="textarea-current-brand-issues"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandHistory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand History</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide a brief history of your brand - when founded, major milestones, previous changes"
                          {...field} 
                          data-testid="textarea-brand-history"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentAssets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Brand Assets</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your current brand assets - logo, colors, fonts, messaging, etc."
                          {...field} 
                          data-testid="textarea-current-assets"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Target & Market Context */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Target & Market Context</h3>
                
                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience - demographics, needs, preferences"
                          {...field} 
                          data-testid="textarea-target-audience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="desiredBrandImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Brand Image</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you want your brand to be perceived after the rebrand?"
                          {...field} 
                          data-testid="textarea-desired-brand-image"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketChanges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Changes</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What changes in your market or industry are driving the need for rebranding?"
                          {...field} 
                          data-testid="textarea-market-changes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitiveLandscape"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitive Landscape</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How have your competitors evolved? What's your competitive position?"
                          {...field} 
                          data-testid="textarea-competitive-landscape"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Rebranding Scope & Goals */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Rebranding Scope & Goals</h3>
                
                <FormField
                  control={form.control}
                  name="rebrandingScope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rebranding Scope</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-rebranding-scope">
                            <SelectValue placeholder="What scope of rebranding are you considering?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {rebrandingScopeOptions.map((scope) => (
                            <SelectItem key={scope} value={scope}>
                              {scope}
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
                  name="rebrandingGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rebranding Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific goals do you want to achieve through rebranding?"
                          {...field} 
                          data-testid="textarea-rebranding-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget Considerations</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What's your budget range and any constraints?"
                            {...field} 
                            data-testid="textarea-budget"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeline">
                              <SelectValue placeholder="What's your timeline?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timelineOptions.map((timeline) => (
                              <SelectItem key={timeline} value={timeline}>
                                {timeline}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Challenges & Stakeholders */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Challenges & Stakeholders</h3>
                
                <FormField
                  control={form.control}
                  name="stakeholderConcerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stakeholder Concerns</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What concerns do stakeholders (employees, customers, investors) have about rebranding?"
                          {...field} 
                          data-testid="textarea-stakeholder-concerns"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="riskFactors"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Factors</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What risks are you most concerned about with the rebranding?"
                          {...field} 
                          data-testid="textarea-risk-factors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communicationChallenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Challenges</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What communication challenges do you anticipate during the rebrand?"
                          {...field} 
                          data-testid="textarea-communication-challenges"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerRetention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Retention Strategy</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you plan to retain existing customers during the rebrand?"
                          {...field} 
                          data-testid="textarea-customer-retention"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="successMetrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Metrics</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How will you measure the success of the rebrand?"
                          {...field} 
                          data-testid="textarea-success-metrics"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="changeManagement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Change Management Needs (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What change management support might you need during the transition?"
                          {...field} 
                          data-testid="textarea-change-management"
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
                      <FormLabel>Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other relevant information about your rebranding situation"
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
                className="w-full" 
                disabled={isLoading}
                data-testid="button-generate-rebrand-strategy"
              >
                {isLoading ? "Developing Rebranding Strategy..." : "Create Comprehensive Rebrand Plan"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Rebranding Strategy & Implementation Plan</h3>
          <BotChatInterface sessionId={sessionId} botType="rebranding-consultant" />
        </div>
      )}
    </div>
  );
}