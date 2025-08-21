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
import { Users, Target, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  industry: z.string().min(1, "Industry is required"),
  productService: z.string().min(1, "Product/service description is required"),
  targetGoals: z.string().min(1, "Targeting goals are required"),
  currentAudience: z.string().optional(),
  ageGroups: z.array(z.string()).optional(),
  genderTarget: z.string().optional(),
  locationTarget: z.string().optional(),
  incomeLevel: z.string().optional(),
  interests: z.string().optional(),
  behaviors: z.string().optional(),
  platforms: z.array(z.string()).optional(),
  budget: z.string().optional(),
  campaignType: z.string().optional(),
  competitorAudience: z.string().optional(),
  painPoints: z.string().optional(),
  customAudience: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const ageGroupOptions = [
  "18-24", "25-34", "35-44", "45-54", "55-64", "65+"
];

const platformOptions = [
  "Facebook", "Instagram", "Google Ads", "LinkedIn", "Twitter", "TikTok", "YouTube", "Snapchat", "Pinterest"
];

const campaignTypeOptions = [
  "Brand Awareness", "Lead Generation", "Sales/Conversions", "App Downloads", "Website Traffic", "Video Views", "Engagement"
];

const genderOptions = ["All Genders", "Male", "Female", "Non-binary"];
const incomeOptions = ["All Income Levels", "Low Income", "Middle Income", "High Income", "Luxury Market"];

interface AudienceTargetingAssistantProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function AudienceTargetingAssistant({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: AudienceTargetingAssistantProps = {}) {
  const [sessionId, setSessionId] = useState<number | null>(propSessionId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      industry: "",
      productService: "",
      targetGoals: "",
      currentAudience: "",
      ageGroups: [],
      genderTarget: "",
      locationTarget: "",
      incomeLevel: "",
      interests: "",
      behaviors: "",
      platforms: [],
      budget: "",
      campaignType: "",
      competitorAudience: "",
      painPoints: "",
      customAudience: "",
      additionalContext: "",
    },
  });

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    const currentAgeGroups = form.getValues("ageGroups") || [];
    if (checked) {
      form.setValue("ageGroups", [...currentAgeGroups, ageGroup]);
    } else {
      form.setValue("ageGroups", currentAgeGroups.filter(ag => ag !== ageGroup));
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
      const prompt = `Create a comprehensive audience targeting strategy for ${data.businessName} in the ${data.industry} industry.

**Business Context:**
- Product/Service: ${data.productService}
- Targeting Goals: ${data.targetGoals}
- Campaign Type: ${data.campaignType}
${data.currentAudience ? `- Current Audience: ${data.currentAudience}` : ""}
${data.budget ? `- Budget: ${data.budget}` : ""}

**Demographic Preferences:**
${data.ageGroups?.length ? `- Age Groups: ${data.ageGroups.join(", ")}` : ""}
${data.genderTarget ? `- Gender: ${data.genderTarget}` : ""}
${data.locationTarget ? `- Location: ${data.locationTarget}` : ""}
${data.incomeLevel ? `- Income Level: ${data.incomeLevel}` : ""}

**Psychographic Insights:**
${data.interests ? `- Interests: ${data.interests}` : ""}
${data.behaviors ? `- Behaviors: ${data.behaviors}` : ""}
${data.painPoints ? `- Pain Points: ${data.painPoints}` : ""}

**Platform Context:**
${data.platforms?.length ? `- Target Platforms: ${data.platforms.join(", ")}` : ""}
${data.competitorAudience ? `- Competitor Analysis: ${data.competitorAudience}` : ""}
${data.customAudience ? `- Custom Audience Data: ${data.customAudience}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive audience targeting strategy that includes:

1. **Primary Audience Personas** - Detailed profiles with demographics, psychographics, and motivations
2. **Precise Targeting Parameters** - Specific demographic, interest, and behavioral targeting options
3. **Platform-Specific Strategies** - Tailored approaches for each advertising platform
4. **Lookalike Audience Recommendations** - Custom and similar audience strategies
5. **Interest Targeting Matrix** - Detailed interest categories and combinations
6. **Demographic Analysis** - Age, gender, location, and income targeting insights
7. **Behavioral Targeting** - Purchase behaviors, online activities, and engagement patterns
8. **Audience Segmentation** - Multiple audience segments for different campaign goals
9. **Testing Recommendations** - A/B testing strategies for audience optimization
10. **Performance Tracking** - Key metrics and KPIs to measure audience effectiveness

Format with actionable targeting parameters, specific audience sizes, and platform-specific implementation guidance.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Audience Targeting Analysis Started",
          description: "Developing precise targeting strategies and demographic analysis...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Audience targeting error:", error);
      toast({
        title: "Error",
        description: `Failed to start audience targeting analysis: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Audience Targeting Assistant</h1>
            <p className="text-gray-600">Precise targeting strategies, demographic analysis, and interest targeting</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Audience Research</p>
                  <p className="text-xs text-gray-600">Precision targeting</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Demographic Analysis</p>
                  <p className="text-xs text-gray-600">Data-driven insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Interest Targeting</p>
                  <p className="text-xs text-gray-600">Behavioral insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Lookalike Audiences</p>
                  <p className="text-xs text-gray-600">Expansion strategies</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {sessionId && propSessionId ? (
        <BotChatInterface sessionId={sessionId} botType="audience-targeting" />
      ) : (
        <>
          {/* Form */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5" />
                Audience Targeting Configuration
              </CardTitle>
              <CardDescription>
                Provide your business details and targeting preferences for precise audience strategies
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
                      name="productService"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product/Service Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe what you sell and its key benefits..."
                              className="min-h-[80px]"
                              {...field} 
                              data-testid="textarea-product-service"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="targetGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Targeting Goals *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What do you want to achieve with targeting?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-target-goals"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Audience (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your existing customers..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-current-audience"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Demographics */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Demographics</h3>
                    
                    <div>
                      <Label className="text-base font-medium">Age Groups</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {ageGroupOptions.map((ageGroup) => (
                          <div key={ageGroup} className="flex items-center space-x-2">
                            <Checkbox
                              id={`age-${ageGroup}`}
                              checked={form.watch("ageGroups")?.includes(ageGroup)}
                              onCheckedChange={(checked) => handleAgeGroupChange(ageGroup, checked as boolean)}
                            />
                            <Label htmlFor={`age-${ageGroup}`} className="text-sm">{ageGroup}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="genderTarget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Gender Target</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-gender-target">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {genderOptions.map((option) => (
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
                        name="locationTarget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location Target</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., US, California, London" 
                                {...field} 
                                data-testid="input-location-target"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="incomeLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Income Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-income-level">
                                  <SelectValue placeholder="Select income" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {incomeOptions.map((option) => (
                                  <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Psychographics */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Psychographics</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interests</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What are your audience's interests? (hobbies, activities, topics)"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-interests"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="behaviors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Behaviors</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Online behaviors, purchase patterns, app usage..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-behaviors"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

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
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">Campaign Details</h3>
                    
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
                        name="campaignType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Campaign Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-campaign-type">
                                  <SelectValue placeholder="Select campaign type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {campaignTypeOptions.map((option) => (
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
                        name="budget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Budget Range</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., $1,000/month, $50/day" 
                                {...field} 
                                data-testid="input-budget"
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
                        name="competitorAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Competitor Audience Analysis</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What do you know about your competitors' audiences?"
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-competitor-audience"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="customAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Audience Data</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Email lists, website visitors, existing customer data..."
                                className="min-h-[80px]"
                                {...field} 
                                data-testid="textarea-custom-audience"
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
                              placeholder="Any other relevant information for audience targeting..."
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
                    disabled={isLoading || propIsLoading}
                    data-testid="button-generate-targeting"
                  >
                    {isLoading || propIsLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Analyzing Target Audience...
                      </>
                    ) : (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Generate Targeting Strategy
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