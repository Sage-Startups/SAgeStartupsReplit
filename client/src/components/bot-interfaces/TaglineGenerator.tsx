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
import { MessageSquare, Target, Lightbulb, TrendingUp, ArrowRight, Zap } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  brandPersonality: z.string().min(1, "Brand personality is required"),
  uniqueValueProp: z.string().min(1, "Unique value proposition is required"),
  keyBenefits: z.string().min(1, "Key benefits are required"),
  emotionalConnection: z.string().min(1, "Emotional connection is required"),
  competitiveLandscape: z.string().min(1, "Competitive landscape is required"),
  taglineStyle: z.string().min(1, "Tagline style is required"),
  tonePreference: z.string().min(1, "Tone preference is required"),
  lengthPreference: z.string().min(1, "Length preference is required"),
  keywordsToInclude: z.string().optional(),
  keywordsToAvoid: z.string().optional(),
  currentTagline: z.string().optional(),
  usageContext: z.array(z.string()).min(1, "At least one usage context is required"),
  testingGoals: z.string().min(1, "Testing goals are required"),
  additionalRequirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const taglineStyleOptions = [
  "Action-oriented",
  "Benefit-focused",
  "Emotional Appeal",
  "Problem-solving",
  "Aspirational",
  "Descriptive",
  "Question-based",
  "Rhyming/Catchy",
  "Play on Words",
  "Direct & Simple"
];

const tonePreferenceOptions = [
  "Professional",
  "Friendly & Approachable",
  "Bold & Confident",
  "Inspirational",
  "Trustworthy",
  "Innovative",
  "Caring & Empathetic",
  "Energetic",
  "Sophisticated",
  "Playful & Fun"
];

const lengthPreferenceOptions = [
  "2-3 words",
  "4-5 words",
  "6-8 words",
  "Short phrase (2-4 words)",
  "Medium phrase (5-7 words)",
  "Longer phrase (8+ words)",
  "No preference"
];

const usageContextOptions = [
  "Website Header",
  "Business Cards",
  "Advertising Campaigns",
  "Social Media",
  "Email Signatures",
  "Product Packaging",
  "Trade Shows",
  "Print Materials",
  "TV/Radio Ads",
  "Digital Marketing"
];

export function TaglineGenerator() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      targetAudience: "",
      brandPersonality: "",
      uniqueValueProp: "",
      keyBenefits: "",
      emotionalConnection: "",
      competitiveLandscape: "",
      taglineStyle: "",
      tonePreference: "",
      lengthPreference: "",
      keywordsToInclude: "",
      keywordsToAvoid: "",
      currentTagline: "",
      usageContext: [],
      testingGoals: "",
      additionalRequirements: "",
    },
  });

  const handleUsageContextChange = (context: string, checked: boolean) => {
    const currentContexts = form.getValues("usageContext");
    if (checked) {
      form.setValue("usageContext", [...currentContexts, context]);
    } else {
      form.setValue("usageContext", currentContexts.filter(c => c !== context));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `As a Tagline and Slogan Expert, please create memorable brand taglines and comprehensive message testing strategies based on the following brand information:

**Brand Foundation:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Target Audience: ${data.targetAudience}
- Brand Personality: ${data.brandPersonality}

**Value Proposition & Benefits:**
- Unique Value Proposition: ${data.uniqueValueProp}
- Key Benefits: ${data.keyBenefits}
- Emotional Connection: ${data.emotionalConnection}
- Competitive Landscape: ${data.competitiveLandscape}

**Tagline Preferences:**
- Style: ${data.taglineStyle}
- Tone: ${data.tonePreference}
- Length: ${data.lengthPreference}
${data.keywordsToInclude ? `- Keywords to Include: ${data.keywordsToInclude}` : ""}
${data.keywordsToAvoid ? `- Keywords to Avoid: ${data.keywordsToAvoid}` : ""}
${data.currentTagline ? `- Current Tagline (for reference): ${data.currentTagline}` : ""}

**Usage & Testing:**
- Usage Contexts: ${data.usageContext.join(", ")}
- Testing Goals: ${data.testingGoals}
${data.additionalRequirements ? `- Additional Requirements: ${data.additionalRequirements}` : ""}

Please provide:

1. **Primary Tagline Recommendations (10-15 options):**
   - Categorized by style (emotional, benefit-focused, action-oriented, etc.)
   - Detailed explanation for each tagline's strategic approach
   - Psychology and emotional impact analysis
   - Memorability and stickiness assessment

2. **Tagline Variations & Adaptations:**
   - Short versions for limited space applications
   - Extended versions for detailed contexts
   - Industry-specific adaptations
   - Seasonal or campaign-specific variations

3. **Message Testing Framework:**
   - A/B testing strategy and methodology
   - Key performance indicators to measure
   - Survey questions for target audience testing
   - Focus group discussion guide
   - Digital testing recommendations (social media, ads, etc.)

4. **Linguistic Analysis:**
   - Phonetic appeal and pronunciation ease
   - Rhythm and cadence evaluation
   - Word association and semantic analysis
   - Cross-cultural considerations (if applicable)
   - Trademark and legal considerations

5. **Application Guidelines:**
   - Context-specific usage recommendations
   - Visual presentation suggestions
   - Voice and delivery guidelines for audio/video
   - Integration with existing brand messaging
   - Flexibility for different marketing channels

6. **Competitive Differentiation:**
   - Analysis against competitor taglines
   - Unique positioning advantages
   - Market differentiation opportunities
   - Brand recall improvement strategies

7. **Implementation Strategy:**
   - Rollout timeline and phases
   - Employee and stakeholder communication plan
   - Marketing campaign integration
   - Brand consistency maintenance
   - Performance monitoring recommendations

8. **Testing Templates:**
   - Survey questionnaires for audience feedback
   - Social media testing post templates
   - A/B testing email subject line variations
   - Landing page testing scenarios
   - Brand recall testing methodology

9. **Refinement Process:**
   - Iterative improvement framework
   - Feedback incorporation guidelines
   - Performance-based optimization
   - Long-term evolution strategy

Format the response with clear sections, rank taglines by strategic fit, and provide actionable testing and implementation guidance. Include specific examples and practical next steps.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "tagline-generator",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Tagline Generation Started",
        description: "Creating memorable brand slogans and testing strategies...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start tagline generation. Please try again.",
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tagline Generator</h1>
            <p className="text-gray-600">Create memorable brand slogans with testing strategies and variations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-sm">Memorable Slogans</p>
                  <p className="text-xs text-gray-600">Catchy & impactful</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-sm">Message Testing</p>
                  <p className="text-xs text-gray-600">A/B testing framework</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-sm">Multiple Variations</p>
                  <p className="text-xs text-gray-600">Different contexts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-sm">Performance Analysis</p>
                  <p className="text-xs text-gray-600">Impact measurement</p>
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
            Brand & Message Requirements
          </CardTitle>
          <CardDescription>
            Provide your brand details to generate compelling taglines and comprehensive testing strategies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Brand Foundation */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Brand Foundation</h3>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your target audience demographics and characteristics"
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
                    name="brandPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Personality</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your brand's personality and character traits"
                            {...field} 
                            data-testid="textarea-brand-personality"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Value Proposition */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Value Proposition & Messaging</h3>
                
                <FormField
                  control={form.control}
                  name="uniqueValueProp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Value Proposition</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What makes your brand unique? What's your core value promise?"
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
                          placeholder="List the main benefits customers get from your brand"
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
                  name="emotionalConnection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Emotional Connection</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you want customers to feel about your brand? What emotions should your tagline evoke?"
                          {...field} 
                          data-testid="textarea-emotional-connection"
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
                          placeholder="Describe your key competitors and how you differentiate from them"
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

              {/* Tagline Preferences */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Tagline Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="taglineStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tagline Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tagline-style">
                              <SelectValue placeholder="Choose style approach" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {taglineStyleOptions.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
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
                    name="tonePreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tone Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tone-preference">
                              <SelectValue placeholder="Choose tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tonePreferenceOptions.map((tone) => (
                              <SelectItem key={tone} value={tone}>
                                {tone}
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
                    name="lengthPreference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Length Preference</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-length-preference">
                              <SelectValue placeholder="Choose length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {lengthPreferenceOptions.map((length) => (
                              <SelectItem key={length} value={length}>
                                {length}
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
                    name="keywordsToInclude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords to Include (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Words that should be included in taglines"
                            {...field} 
                            data-testid="input-keywords-include"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keywordsToAvoid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Keywords to Avoid (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Words to avoid in taglines"
                            {...field} 
                            data-testid="input-keywords-avoid"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currentTagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Tagline (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your existing tagline for reference and improvement"
                          {...field} 
                          data-testid="input-current-tagline"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Usage & Testing */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Usage Context & Testing</h3>
                
                <div className="space-y-3">
                  <FormLabel>Usage Contexts (Select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {usageContextOptions.map((context) => (
                      <div key={context} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={context}
                          onChange={(e) => handleUsageContextChange(context, e.target.checked)}
                          className="rounded border-gray-300"
                          data-testid={`checkbox-${context.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`}
                        />
                        <label htmlFor={context} className="text-sm text-gray-700">
                          {context}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.usageContext && (
                    <p className="text-sm text-red-600">At least one usage context is required</p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="testingGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Testing Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What do you want to measure? (e.g., brand recall, emotional response, purchase intent)"
                          {...field} 
                          data-testid="textarea-testing-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalRequirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Requirements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other specific requirements or considerations for your taglines"
                          {...field} 
                          data-testid="textarea-additional-requirements"
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
                data-testid="button-generate-taglines"
              >
                {isLoading ? "Generating Taglines..." : "Create Memorable Taglines & Testing Strategy"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Taglines & Message Testing Strategy</h3>
          <BotChatInterface sessionId={sessionId} botType="tagline-generator" />
        </div>
      )}
    </div>
  );
}