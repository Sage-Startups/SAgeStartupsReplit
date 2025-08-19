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
  rebrandingReason: z.string().min(1, "Rebranding reason is required"),
  currentBrandIssues: z.string().min(1, "Current brand issues are required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  brandHistory: z.string().min(1, "Brand history is required"),
  currentAssets: z.string().min(1, "Current brand assets are required"),
  desiredBrandImage: z.string().min(1, "Desired brand image is required"),
  marketChanges: z.string().min(1, "Market changes are required"),
  competitiveLandscape: z.string().min(1, "Competitive landscape is required"),
  stakeholderConcerns: z.string().min(1, "Stakeholder concerns are required"),
  rebrandingScope: z.string().min(1, "Rebranding scope is required"),
  budget: z.string().min(1, "Budget considerations are required"),
  timeline: z.string().min(1, "Timeline is required"),
  riskFactors: z.string().min(1, "Risk factors are required"),
  successMetrics: z.string().min(1, "Success metrics are required"),
  communicationChallenges: z.string().min(1, "Communication challenges are required"),
  customerRetention: z.string().min(1, "Customer retention strategy is required"),
  rebrandingGoals: z.string().min(1, "Rebranding goals are required"),
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
      const prompt = `As a Rebranding Consultant and Brand Evolution Strategist, develop a comprehensive rebranding strategy with evolution planning, rebrand strategy, transition planning, and stakeholder communication based on the following information:

**Current Brand Situation:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Rebranding Reason: ${data.rebrandingReason}
- Current Brand Issues: ${data.currentBrandIssues}
- Brand History: ${data.brandHistory}
- Current Brand Assets: ${data.currentAssets}

**Target & Market Context:**
- Target Audience: ${data.targetAudience}
- Market Changes: ${data.marketChanges}
- Competitive Landscape: ${data.competitiveLandscape}
- Desired Brand Image: ${data.desiredBrandImage}

**Rebranding Scope & Constraints:**
- Rebranding Scope: ${data.rebrandingScope}
- Budget Considerations: ${data.budget}
- Timeline: ${data.timeline}
- Rebranding Goals: ${data.rebrandingGoals}

**Challenges & Stakeholders:**
- Stakeholder Concerns: ${data.stakeholderConcerns}
- Risk Factors: ${data.riskFactors}
- Communication Challenges: ${data.communicationChallenges}
- Customer Retention Strategy: ${data.customerRetention}
- Success Metrics: ${data.successMetrics}
${data.changeManagement ? `- Change Management Needs: ${data.changeManagement}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive rebranding strategy and implementation plan that includes:

1. **Brand Evolution Strategy:**
   - Current brand audit and assessment
   - Evolution vs. revolution approach analysis
   - Brand equity preservation strategies
   - Legacy element retention recommendations
   - Progressive evolution timeline and phases

2. **Comprehensive Rebrand Strategy:**
   - Strategic rebranding framework
   - Brand positioning and messaging evolution
   - Visual identity transformation plan
   - Digital presence migration strategy
   - Product and service branding updates

3. **Detailed Transition Planning:**
   - Phase-by-phase implementation roadmap
   - Critical milestone identification
   - Resource allocation and team structure
   - Vendor and partner coordination
   - Quality control and approval processes

4. **Stakeholder Communication Plan:**
   - Internal stakeholder alignment strategy
   - Employee communication and training
   - Customer notification and education
   - Partner and vendor communication
   - Media and public relations strategy

5. **Risk Management & Mitigation:**
   - Rebranding risk assessment matrix
   - Customer confusion prevention strategies
   - Brand equity protection measures
   - Crisis communication protocols
   - Contingency planning and backup strategies

6. **Implementation Timeline:**
   - Detailed project timeline with dependencies
   - Pre-launch preparation phases
   - Launch sequence and coordination
   - Post-launch monitoring and optimization
   - Long-term brand establishment phases

7. **Change Management Framework:**
   - Organizational change strategy
   - Employee adoption and buy-in tactics
   - Training and education programs
   - Cultural integration approaches
   - Performance and behavior alignment

8. **Customer Retention Strategy:**
   - Customer loyalty preservation tactics
   - Communication to minimize confusion
   - Value proposition continuity
   - Service level maintenance
   - Feedback collection and response systems

9. **Asset Management & Migration:**
   - Current asset inventory and audit
   - Asset retirement and archival plan
   - New asset development priorities
   - Digital asset migration strategy
   - Legal and trademark considerations

10. **Launch & Communication Strategy:**
    - Launch event planning and execution
    - Marketing campaign development
    - Media relations and PR strategy
    - Digital and social media rollout
    - Customer experience continuity

11. **Performance Monitoring:**
    - Key performance indicators (KPIs)
    - Brand perception tracking
    - Customer satisfaction monitoring
    - Market response analysis
    - ROI and success measurement

12. **Post-Rebrand Optimization:**
    - Performance review and analysis
    - Continuous improvement processes
    - Long-term brand building strategy
    - Market position strengthening
    - Competitive advantage maximization

13. **Budget & Resource Planning:**
    - Detailed budget breakdown by category
    - Resource allocation and optimization
    - Cost-benefit analysis framework
    - ROI projections and timelines
    - Contingency budget recommendations

14. **Legal & Compliance Considerations:**
    - Trademark and intellectual property issues
    - Regulatory compliance requirements
    - Contract and agreement updates
    - Vendor and partner legal considerations
    - Risk assessment and mitigation

15. **Success Measurement Framework:**
    - Pre and post-rebrand benchmarking
    - Quantitative and qualitative metrics
    - Customer perception studies
    - Market share and position tracking
    - Long-term impact assessment

Format the response with detailed implementation guidance, timeline specifics, and actionable recommendations. Include risk mitigation strategies, communication templates, and success measurement tools.`;

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
      toast({
        title: "Error",
        description: "Failed to start rebranding consultation. Please try again.",
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