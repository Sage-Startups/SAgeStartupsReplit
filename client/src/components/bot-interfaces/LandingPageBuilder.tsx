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
import { Layout, Target, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  pageObjective: z.string().min(1, "Page objective is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  pageType: z.string().min(1, "Page type is required"),
  productService: z.string().optional(),
  valueProposition: z.string().optional(),
  keyBenefits: z.string().optional(),
  currentConversionRate: z.string().optional(),
  targetConversionRate: z.string().optional(),
  trafficSource: z.array(z.string()).optional(),
  pageElements: z.array(z.string()).optional(),
  designStyle: z.string().optional(),
  brandGuidelines: z.string().optional(),
  competitors: z.string().optional(),
  userJourney: z.string().optional(),
  painPoints: z.string().optional(),
  objections: z.string().optional(),
  socialProof: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  technicalRequirements: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const pageTypeOptions = [
  "Product Launch", "Lead Generation", "Sales Page", "Sign-up Page", "Download Page", "Event Registration", "Webinar Registration", "Service Page"
];

const trafficSourceOptions = [
  "Google Ads", "Facebook Ads", "Email Campaign", "Social Media", "SEO/Organic", "Direct Traffic", "Affiliate", "PR/Media"
];

const pageElementOptions = [
  "Hero Section", "Value Proposition", "Benefits", "Social Proof", "Testimonials", "Features", "Pricing", "FAQ", "Contact Form", "CTA Buttons", "Product Demo", "Video"
];

const designStyleOptions = [
  "Minimal", "Modern", "Professional", "Creative", "Corporate", "Tech/SaaS", "E-commerce", "Startup"
];

interface LandingPageBuilderProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function LandingPageBuilder({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: LandingPageBuilderProps = {}) {
  const [sessionId, setSessionId] = useState<number | null>(propSessionId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      pageObjective: "",
      targetAudience: "",
      pageType: "",
      productService: "",
      valueProposition: "",
      keyBenefits: "",
      currentConversionRate: "",
      targetConversionRate: "",
      trafficSource: [],
      pageElements: [],
      designStyle: "",
      brandGuidelines: "",
      competitors: "",
      userJourney: "",
      painPoints: "",
      objections: "",
      socialProof: "",
      budget: "",
      timeline: "",
      technicalRequirements: "",
      additionalContext: "",
    },
  });

  const handleTrafficSourceChange = (source: string, checked: boolean) => {
    const currentSources = form.getValues("trafficSource") || [];
    if (checked) {
      form.setValue("trafficSource", [...currentSources, source]);
    } else {
      form.setValue("trafficSource", currentSources.filter(s => s !== source));
    }
  };

  const handleElementChange = (element: string, checked: boolean) => {
    const currentElements = form.getValues("pageElements") || [];
    if (checked) {
      form.setValue("pageElements", [...currentElements, element]);
    } else {
      form.setValue("pageElements", currentElements.filter(e => e !== element));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a comprehensive landing page strategy for ${data.businessName} in the ${data.industry} industry.

**Page Foundation:**
- Page Objective: ${data.pageObjective}
- Page Type: ${data.pageType}
- Target Audience: ${data.targetAudience}
${data.productService ? `- Product/Service: ${data.productService}` : ""}

**Conversion Goals:**
${data.valueProposition ? `- Value Proposition: ${data.valueProposition}` : ""}
${data.keyBenefits ? `- Key Benefits: ${data.keyBenefits}` : ""}
${data.currentConversionRate ? `- Current Conversion Rate: ${data.currentConversionRate}` : ""}
${data.targetConversionRate ? `- Target Conversion Rate: ${data.targetConversionRate}` : ""}

**Traffic & Design:**
${data.trafficSource?.length ? `- Traffic Sources: ${data.trafficSource.join(", ")}` : ""}
${data.designStyle ? `- Design Style: ${data.designStyle}` : ""}
${data.brandGuidelines ? `- Brand Guidelines: ${data.brandGuidelines}` : ""}

**Page Structure:**
${data.pageElements?.length ? `- Required Elements: ${data.pageElements.join(", ")}` : ""}
${data.userJourney ? `- User Journey: ${data.userJourney}` : ""}

**User Psychology:**
${data.painPoints ? `- Pain Points: ${data.painPoints}` : ""}
${data.objections ? `- Common Objections: ${data.objections}` : ""}
${data.socialProof ? `- Social Proof Available: ${data.socialProof}` : ""}

**Competitive Context:**
${data.competitors ? `- Competitor Analysis: ${data.competitors}` : ""}

**Project Context:**
${data.budget ? `- Budget: ${data.budget}` : ""}
${data.timeline ? `- Timeline: ${data.timeline}` : ""}
${data.technicalRequirements ? `- Technical Requirements: ${data.technicalRequirements}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive landing page strategy that includes:

1. **Page Structure & Layout** - Optimal page flow, section hierarchy, and content organization
2. **Conversion Optimization** - CRO best practices, persuasion principles, and conversion elements
3. **UX Design Principles** - User experience guidelines, navigation, and interaction design
4. **Performance Tracking** - Analytics setup, conversion tracking, and success metrics
5. **Copy Framework** - Headlines, subheadings, body copy, and CTA optimization
6. **Visual Design Strategy** - Layout principles, visual hierarchy, and design elements
7. **Mobile Optimization** - Responsive design considerations and mobile-first approach
8. **Loading & Technical** - Page speed optimization and technical implementation
9. **Testing Strategy** - A/B testing recommendations and optimization opportunities
10. **Conversion Elements** - Forms, CTAs, trust signals, and persuasion techniques
11. **Content Strategy** - Messaging hierarchy, value communication, and benefit articulation
12. **User Journey Mapping** - Visitor flow optimization and experience design

Format with specific design recommendations, copy suggestions, and implementation guidelines with wireframe descriptions.`;

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
      console.error("Landing page builder error:", error);
      toast({
        title: "Error",
        description: `Failed to start landing page design: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            <Layout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page Builder</h1>
            <p className="text-gray-600">Conversion-focused pages, UX design, and performance optimization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Page Structure</p>
                  <p className="text-xs text-gray-600">Optimal layout</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Conversion Optimization</p>
                  <p className="text-xs text-gray-600">CRO best practices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">UX Design</p>
                  <p className="text-xs text-gray-600">User experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Performance Tracking</p>
                  <p className="text-xs text-gray-600">Analytics & metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {sessionId && propSessionId ? (
        <BotChatInterface sessionId={sessionId} botType="landing-pages" />
      ) : (
        <>
          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Landing Page Configuration
              </CardTitle>
              <CardDescription>
                Define your page objectives and requirements for optimal conversion design
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="pageObjective"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Objective *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What should this landing page achieve? (e.g., generate leads, drive sales, increase signups)"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-page-objective"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Audience *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your ideal visitor for this page..."
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="pageType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Page Type *</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-page-type">
                                  <SelectValue placeholder="Select page type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {pageTypeOptions.map((option) => (
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
                        name="designStyle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Design Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-design-style">
                                  <SelectValue placeholder="Select design style" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {designStyleOptions.map((option) => (
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
                      name="productService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what you're promoting on this landing page..."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-product-service"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Value Proposition */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Value Proposition</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="valueProposition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Value Proposition</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What unique value do you provide? Why should visitors choose you?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-value-proposition"
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
                                placeholder="List the main benefits visitors will get (one per line)"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-key-benefits"
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
                        name="painPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Pain Points</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What problems does your audience face that you solve?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-pain-points"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="objections"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Common Objections</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What concerns or objections do visitors typically have?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-objections"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Conversion & Performance */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Conversion & Performance</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="currentConversionRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Conversion Rate</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2.5%, Not applicable" 
                                {...field} 
                                data-testid="input-current-conversion-rate"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="targetConversionRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Conversion Rate</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 5%, 10%" 
                                {...field} 
                                data-testid="input-target-conversion-rate"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div>
                      <Label className="text-base font-medium">Traffic Sources</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {trafficSourceOptions.map((source) => (
                          <div key={source} className="flex items-center space-x-2">
                            <Checkbox
                              id={`traffic-${source}`}
                              checked={form.watch("trafficSource")?.includes(source)}
                              onCheckedChange={(checked) => handleTrafficSourceChange(source, checked as boolean)}
                            />
                            <Label htmlFor={`traffic-${source}`} className="text-sm">{source}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="userJourney"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Journey</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe how visitors typically find and interact with your business..."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-user-journey"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Page Elements */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Page Elements</h3>
                    
                    <div>
                      <Label className="text-base font-medium">Required Page Elements</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {pageElementOptions.map((element) => (
                          <div key={element} className="flex items-center space-x-2">
                            <Checkbox
                              id={`element-${element}`}
                              checked={form.watch("pageElements")?.includes(element)}
                              onCheckedChange={(checked) => handleElementChange(element, checked as boolean)}
                            />
                            <Label htmlFor={`element-${element}`} className="text-sm">{element}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="socialProof"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Social Proof Available</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Testimonials, reviews, case studies, client logos, awards..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-social-proof"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="brandGuidelines"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Guidelines</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Colors, fonts, logos, style preferences..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-brand-guidelines"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="competitors"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Competitor Analysis</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What are competitors doing on their landing pages? What works/doesn't work?"
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-competitors"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Project Details</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $5,000, $50,000, No budget limit" 
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
                        name="timeline"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Timeline</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., 2 weeks, 1 month, ASAP" 
                                {...field} 
                                data-testid="input-timeline"
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
                        name="technicalRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technical Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Platform, CMS, integrations, mobile requirements..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-technical-requirements"
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
                                placeholder="Any other relevant information for landing page design..."
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
                    data-testid="button-build-page"
                  >
                    {isLoading || propIsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Building Landing Page Strategy...
                      </>
                    ) : (
                      <>
                        <Layout className="w-4 h-4 mr-2" />
                        Generate Page Strategy
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