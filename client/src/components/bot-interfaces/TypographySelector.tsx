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
import { Type, Palette, Eye, CheckCircle, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  brandPersonality: z.string().min(1, "Brand personality is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  usageContext: z.array(z.string()).min(1, "At least one usage context is required"),
  designStyle: z.string().min(1, "Design style is required"),
  readabilityRequirements: z.string().min(1, "Readability requirements are required"),
  technicalConstraints: z.string().optional(),
  currentFonts: z.string().optional(),
  additionalRequirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const usageContextOptions = [
  "Website Headers",
  "Body Text",
  "Marketing Materials",
  "Business Cards",
  "Mobile Apps",
  "Print Materials",
  "Social Media",
  "Email Campaigns",
  "Presentations",
  "Packaging"
];

const designStyleOptions = [
  "Modern & Minimalist",
  "Classic & Traditional",
  "Bold & Dynamic",
  "Elegant & Sophisticated",
  "Playful & Creative",
  "Professional & Corporate",
  "Artistic & Expressive",
  "Tech & Futuristic"
];

export function TypographySelector() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      brandPersonality: "",
      targetAudience: "",
      usageContext: [],
      designStyle: "",
      readabilityRequirements: "",
      technicalConstraints: "",
      currentFonts: "",
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
      const prompt = `As a Typography Expert, please analyze the following brand requirements and provide comprehensive font pairing recommendations, typography hierarchy, and readability analysis:

**Brand Information:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Brand Personality: ${data.brandPersonality}
- Target Audience: ${data.targetAudience}

**Design Requirements:**
- Usage Contexts: ${data.usageContext.join(", ")}
- Design Style: ${data.designStyle}
- Readability Requirements: ${data.readabilityRequirements}
${data.technicalConstraints ? `- Technical Constraints: ${data.technicalConstraints}` : ""}
${data.currentFonts ? `- Current Fonts (if any): ${data.currentFonts}` : ""}
${data.additionalRequirements ? `- Additional Requirements: ${data.additionalRequirements}` : ""}

Please provide:

1. **Primary Font Recommendations:**
   - 3-5 font options for headers/display text with detailed analysis
   - Rationale for each choice based on brand personality and industry
   - Licensing information and availability

2. **Secondary Font Pairings:**
   - Body text font recommendations that pair well with each primary option
   - Font hierarchy suggestions (H1, H2, H3, body, captions)
   - Contrast and complement analysis

3. **Typography Hierarchy System:**
   - Detailed size, weight, and spacing recommendations
   - Responsive scaling guidelines
   - Accessibility considerations

4. **Readability Analysis:**
   - Font legibility assessment for different contexts
   - Optimal line height, letter spacing, and paragraph spacing
   - Color contrast recommendations
   - Performance across different devices and screen sizes

5. **Usage Guidelines:**
   - Do's and don'ts for each font pairing
   - Context-specific recommendations
   - Fallback font suggestions
   - Implementation best practices

6. **Font Psychology & Brand Alignment:**
   - How each recommendation supports the brand personality
   - Emotional impact analysis
   - Competitive differentiation insights

Format the response with clear sections, specific font names, and actionable implementation guidance.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "typography-selector",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Typography Analysis Started",
        description: "Generating comprehensive font recommendations and typography guidelines...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start typography analysis. Please try again.",
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <Type className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Typography Selector</h1>
            <p className="text-gray-600">Perfect font pairings, hierarchy, and readability analysis</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Font Pairing</p>
                  <p className="text-xs text-gray-600">Perfect combinations</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-sm">Readability</p>
                  <p className="text-xs text-gray-600">Accessibility focused</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Typography Rules</p>
                  <p className="text-xs text-gray-600">Complete hierarchy</p>
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
            Typography Requirements
          </CardTitle>
          <CardDescription>
            Tell us about your brand and typography needs for personalized font recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Brand Information */}
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
                  name="brandPersonality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Personality</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Professional, Creative, Bold, Elegant" 
                          {...field} 
                          data-testid="input-brand-personality"
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
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Young professionals, Luxury consumers" 
                          {...field} 
                          data-testid="input-target-audience"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Design Preferences */}
              <FormField
                control={form.control}
                name="designStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Design Style Preference</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-design-style">
                          <SelectValue placeholder="Choose your preferred design style" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {designStyleOptions.map((style) => (
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

              {/* Usage Context */}
              <div className="space-y-3">
                <FormLabel>Usage Context (Select all that apply)</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {usageContextOptions.map((context) => (
                    <div key={context} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={context}
                        onChange={(e) => handleUsageContextChange(context, e.target.checked)}
                        className="rounded border-gray-300"
                        data-testid={`checkbox-${context.toLowerCase().replace(/\s+/g, '-')}`}
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
                name="readabilityRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Readability Requirements</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe specific readability needs (e.g., must work well at small sizes, high contrast requirements, accessibility considerations)"
                        {...field} 
                        data-testid="textarea-readability-requirements"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator />

              {/* Optional Fields */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Additional Information (Optional)</h3>
                
                <FormField
                  control={form.control}
                  name="technicalConstraints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Constraints</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any technical limitations (e.g., web fonts only, Google Fonts preferred, file size constraints)"
                          {...field} 
                          data-testid="textarea-technical-constraints"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentFonts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Fonts (if any)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="List any fonts you're currently using or considering"
                          {...field} 
                          data-testid="input-current-fonts"
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
                      <FormLabel>Additional Requirements</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other specific requirements or preferences for your typography system"
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
                data-testid="button-generate-typography"
              >
                {isLoading ? "Analyzing Typography..." : "Generate Font Recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Typography Recommendations & Analysis</h3>
          <BotChatInterface sessionId={sessionId} botType="typography-selector" />
        </div>
      )}
    </div>
  );
}