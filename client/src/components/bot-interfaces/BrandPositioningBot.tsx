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
import { Target, Trophy, TrendingUp, Users, ArrowRight, Crosshair } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  targetMarket: z.string().min(1, "Target market is required"),
  primaryAudience: z.string().min(1, "Primary audience is required"),
  secondaryAudience: z.string().optional(),
  currentPosition: z.string().min(1, "Current market position is required"),
  desiredPosition: z.string().min(1, "Desired market position is required"),
  uniqueValueProp: z.string().min(1, "Unique value proposition is required"),
  keyBenefits: z.string().min(1, "Key benefits are required"),
  competitorAnalysis: z.string().min(1, "Competitor analysis is required"),
  marketChallenges: z.string().min(1, "Market challenges are required"),
  brandStrengths: z.string().min(1, "Brand strengths are required"),
  brandWeaknesses: z.string().min(1, "Brand weaknesses are required"),
  marketOpportunities: z.string().min(1, "Market opportunities are required"),
  competitiveThreats: z.string().min(1, "Competitive threats are required"),
  pricingStrategy: z.string().min(1, "Pricing strategy is required"),
  distributionChannels: z.string().min(1, "Distribution channels are required"),
  messagingStrategy: z.string().min(1, "Messaging strategy is required"),
  positioningGoals: z.string().min(1, "Positioning goals are required"),
  successMetrics: z.string().min(1, "Success metrics are required"),
  timeframe: z.string().min(1, "Implementation timeframe is required"),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const pricingStrategyOptions = [
  "Premium/High-end",
  "Competitive/Market Rate",
  "Value/Budget-friendly",
  "Penetration Pricing",
  "Skimming Strategy",
  "Dynamic Pricing",
  "Freemium Model",
  "Subscription-based",
  "Cost-plus Pricing",
  "Psychological Pricing"
];

const timeframeOptions = [
  "3-6 months",
  "6-12 months",
  "1-2 years",
  "2-3 years",
  "3+ years",
  "Ongoing/Continuous"
];

export function BrandPositioningBot() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      targetMarket: "",
      primaryAudience: "",
      secondaryAudience: "",
      currentPosition: "",
      desiredPosition: "",
      uniqueValueProp: "",
      keyBenefits: "",
      competitorAnalysis: "",
      marketChallenges: "",
      brandStrengths: "",
      brandWeaknesses: "",
      marketOpportunities: "",
      competitiveThreats: "",
      pricingStrategy: "",
      distributionChannels: "",
      messagingStrategy: "",
      positioningGoals: "",
      successMetrics: "",
      timeframe: "",
      additionalContext: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `As a Brand Positioning Strategist and Market Differentiation Expert, develop a comprehensive brand positioning strategy with competitive advantage framework and value proposition optimization based on the following information:

**Brand & Market Foundation:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Target Market: ${data.targetMarket}
- Primary Audience: ${data.primaryAudience}
${data.secondaryAudience ? `- Secondary Audience: ${data.secondaryAudience}` : ""}

**Current vs. Desired Positioning:**
- Current Market Position: ${data.currentPosition}
- Desired Market Position: ${data.desiredPosition}
- Positioning Goals: ${data.positioningGoals}

**Value Proposition & Benefits:**
- Unique Value Proposition: ${data.uniqueValueProp}
- Key Benefits: ${data.keyBenefits}
- Messaging Strategy: ${data.messagingStrategy}

**Competitive Landscape:**
- Competitor Analysis: ${data.competitorAnalysis}
- Market Challenges: ${data.marketChallenges}

**SWOT Analysis:**
- Brand Strengths: ${data.brandStrengths}
- Brand Weaknesses: ${data.brandWeaknesses}
- Market Opportunities: ${data.marketOpportunities}
- Competitive Threats: ${data.competitiveThreats}

**Strategic Elements:**
- Pricing Strategy: ${data.pricingStrategy}
- Distribution Channels: ${data.distributionChannels}
- Success Metrics: ${data.successMetrics}
- Implementation Timeframe: ${data.timeframe}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive brand positioning strategy that includes:

1. **Market Positioning Framework:**
   - Positioning statement and brand promise
   - Market category definition and boundaries
   - Competitive landscape mapping
   - Target audience segmentation and prioritization
   - Brand positioning matrix and perceptual map

2. **Competitive Advantage Strategy:**
   - Unique selling proposition (USP) development
   - Competitive differentiation analysis
   - Barriers to entry and competitive moats
   - White space identification and exploitation
   - Competitive response strategies

3. **Value Proposition Architecture:**
   - Core value proposition refinement
   - Supporting value pillars and proof points
   - Customer benefit hierarchy
   - Value communication framework
   - ROI and value demonstration methods

4. **Market Differentiation Strategy:**
   - Primary differentiation factors
   - Secondary differentiation opportunities
   - Brand personality and character differentiation
   - Service and experience differentiation
   - Innovation and feature differentiation

5. **Target Audience Positioning:**
   - Primary audience positioning strategy
   - Secondary audience positioning approach
   - Audience-specific value propositions
   - Messaging customization by segment
   - Channel strategy by audience

6. **Competitive Analysis & Response:**
   - Direct competitor positioning analysis
   - Indirect competitor threat assessment
   - Competitive advantage sustainability
   - Competitive response scenarios
   - Market leadership strategies

7. **Messaging & Communication Strategy:**
   - Core brand messaging framework
   - Position-specific messaging pillars
   - Proof points and supporting evidence
   - Communication tone and personality
   - Channel-specific messaging adaptation

8. **Pricing & Value Strategy:**
   - Pricing positioning strategy
   - Value-based pricing framework
   - Competitive pricing analysis
   - Price-value perception optimization
   - Revenue model alignment

9. **Go-to-Market Positioning:**
   - Market entry strategy
   - Channel positioning and partnerships
   - Sales enablement and training
   - Customer acquisition positioning
   - Market penetration tactics

10. **Performance Measurement:**
    - Brand positioning KPIs and metrics
    - Market share and position tracking
    - Customer perception monitoring
    - Competitive benchmark analysis
    - ROI measurement framework

11. **Implementation Roadmap:**
    - Phase-by-phase positioning rollout
    - Team alignment and training requirements
    - Marketing campaign integration
    - Sales and customer service alignment
    - Stakeholder communication plan

12. **Risk Management & Contingency:**
    - Positioning risk assessment
    - Market change adaptation strategies
    - Competitive threat response plans
    - Brand reputation protection
    - Crisis communication positioning

Format the response with strategic frameworks, actionable recommendations, and specific implementation guidance. Include competitive analysis matrices, positioning maps, and performance measurement tools.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "brand-positioning",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Brand Positioning Strategy Started",
        description: "Developing competitive advantage and market positioning...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start brand positioning analysis. Please try again.",
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
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Positioning Bot</h1>
            <p className="text-gray-600">Market differentiation, competitive advantage, and strategic value proposition</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Crosshair className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Market Positioning</p>
                  <p className="text-xs text-gray-600">Strategic framework</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Competitive Advantage</p>
                  <p className="text-xs text-gray-600">Differentiation strategy</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Value Proposition</p>
                  <p className="text-xs text-gray-600">Unique selling points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Market Strategy</p>
                  <p className="text-xs text-gray-600">Go-to-market approach</p>
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
            Brand Positioning Analysis
          </CardTitle>
          <CardDescription>
            Provide your brand and market details to develop a comprehensive positioning strategy with competitive advantage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Brand & Market Foundation */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Brand & Market Foundation</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your brand name" 
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
                  name="targetMarket"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Market</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target market size, characteristics, and geographic scope"
                          {...field} 
                          data-testid="textarea-target-market"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primaryAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Detailed description of your primary target audience"
                            {...field} 
                            data-testid="textarea-primary-audience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Audience (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Description of secondary target audience"
                            {...field} 
                            data-testid="textarea-secondary-audience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Current vs. Desired Positioning */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Positioning Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Market Position</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How is your brand currently positioned in the market?"
                            {...field} 
                            data-testid="textarea-current-position"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="desiredPosition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Market Position</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Where do you want your brand to be positioned?"
                            {...field} 
                            data-testid="textarea-desired-position"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="positioningGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Positioning Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific positioning goals do you want to achieve?"
                          {...field} 
                          data-testid="textarea-positioning-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Value Proposition */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Value Proposition & Benefits</h3>
                
                <FormField
                  control={form.control}
                  name="uniqueValueProp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Value Proposition</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What unique value does your brand provide to customers?"
                          {...field} 
                          data-testid="textarea-unique-value-prop"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyBenefits"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Benefits</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List the main benefits customers receive from your brand"
                          {...field} 
                          data-testid="textarea-key-benefits"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="messagingStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Messaging Strategy</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you currently communicate your brand value?"
                          {...field} 
                          data-testid="textarea-messaging-strategy"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* SWOT Analysis */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">SWOT Analysis</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brandStrengths"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Strengths</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What are your brand's key strengths and advantages?"
                            {...field} 
                            data-testid="textarea-brand-strengths"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandWeaknesses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Weaknesses</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What are your brand's current weaknesses or limitations?"
                            {...field} 
                            data-testid="textarea-brand-weaknesses"
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
                    name="marketOpportunities"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Opportunities</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What market opportunities can your brand capitalize on?"
                            {...field} 
                            data-testid="textarea-market-opportunities"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="competitiveThreats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competitive Threats</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What competitive threats does your brand face?"
                            {...field} 
                            data-testid="textarea-competitive-threats"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Competitive & Strategic Elements */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Competitive & Strategic Elements</h3>
                
                <FormField
                  control={form.control}
                  name="competitorAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Analysis</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Analyze your main competitors, their positioning, and competitive advantages"
                          {...field} 
                          data-testid="textarea-competitor-analysis"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketChallenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Market Challenges</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What are the main challenges in your market or industry?"
                          {...field} 
                          data-testid="textarea-market-challenges"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="pricingStrategy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pricing Strategy</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-pricing-strategy">
                              <SelectValue placeholder="Choose pricing approach" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pricingStrategyOptions.map((strategy) => (
                              <SelectItem key={strategy} value={strategy}>
                                {strategy}
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
                        <FormLabel>Implementation Timeframe</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-timeframe">
                              <SelectValue placeholder="Choose timeframe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeframeOptions.map((timeframe) => (
                              <SelectItem key={timeframe} value={timeframe}>
                                {timeframe}
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
                  name="distributionChannels"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distribution Channels</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your current and planned distribution channels"
                          {...field} 
                          data-testid="textarea-distribution-channels"
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
                          placeholder="How will you measure the success of your positioning strategy?"
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
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other relevant information about your brand, market, or positioning challenges"
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
                data-testid="button-generate-positioning"
              >
                {isLoading ? "Developing Positioning Strategy..." : "Generate Brand Positioning Strategy"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Brand Positioning Strategy & Competitive Analysis</h3>
          <BotChatInterface sessionId={sessionId} botType="brand-positioning" />
        </div>
      )}
    </div>
  );
}