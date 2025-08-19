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
import { FileText, Palette, Shield, Users, ArrowRight, BookOpen } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  brandMission: z.string().min(1, "Brand mission is required"),
  brandValues: z.string().min(1, "Brand values are required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  brandPersonality: z.string().min(1, "Brand personality is required"),
  primaryColors: z.string().min(1, "Primary colors are required"),
  secondaryColors: z.string().optional(),
  logoVariations: z.string().min(1, "Logo information is required"),
  typography: z.string().optional(),
  imageryStyle: z.string().min(1, "Imagery style is required"),
  toneOfVoice: z.string().min(1, "Tone of voice is required"),
  communicationGuidelines: z.string().min(1, "Communication guidelines are required"),
  usageContexts: z.array(z.string()).min(1, "At least one usage context is required"),
  brandDifferentiators: z.string().min(1, "Brand differentiators are required"),
  competitorAnalysis: z.string().optional(),
  additionalElements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const usageContextOptions = [
  "Website & Digital",
  "Print Materials",
  "Social Media",
  "Packaging",
  "Advertising",
  "Corporate Communications",
  "Trade Shows & Events",
  "Internal Documents",
  "Email Marketing",
  "Mobile Applications"
];

const imageryStyleOptions = [
  "Photography-focused",
  "Illustration-based",
  "Minimalist Graphics",
  "Bold & Colorful",
  "Black & White",
  "Mixed Media",
  "Icons & Symbols",
  "Lifestyle Photography",
  "Product-focused",
  "Abstract & Artistic"
];

export function BrandGuidelinesBuilder() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      brandMission: "",
      brandValues: "",
      targetAudience: "",
      brandPersonality: "",
      primaryColors: "",
      secondaryColors: "",
      logoVariations: "",
      typography: "",
      imageryStyle: "",
      toneOfVoice: "",
      communicationGuidelines: "",
      usageContexts: [],
      brandDifferentiators: "",
      competitorAnalysis: "",
      additionalElements: "",
    },
  });

  const handleUsageContextChange = (context: string, checked: boolean) => {
    const currentContexts = form.getValues("usageContexts");
    if (checked) {
      form.setValue("usageContexts", [...currentContexts, context]);
    } else {
      form.setValue("usageContexts", currentContexts.filter(c => c !== context));
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `As a Brand Guidelines Expert, please create a comprehensive brand style guide based on the following information:

**Brand Foundation:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Mission: ${data.brandMission}
- Core Values: ${data.brandValues}
- Target Audience: ${data.targetAudience}
- Brand Personality: ${data.brandPersonality}

**Visual Identity:**
- Primary Colors: ${data.primaryColors}
${data.secondaryColors ? `- Secondary Colors: ${data.secondaryColors}` : ""}
- Logo Information: ${data.logoVariations}
${data.typography ? `- Typography: ${data.typography}` : ""}
- Imagery Style: ${data.imageryStyle}

**Communication:**
- Tone of Voice: ${data.toneOfVoice}
- Communication Guidelines: ${data.communicationGuidelines}

**Application:**
- Usage Contexts: ${data.usageContexts.join(", ")}
- Brand Differentiators: ${data.brandDifferentiators}
${data.competitorAnalysis ? `- Competitor Analysis: ${data.competitorAnalysis}` : ""}
${data.additionalElements ? `- Additional Elements: ${data.additionalElements}` : ""}

Please create a comprehensive brand guidelines document that includes:

1. **Brand Overview & Foundation:**
   - Mission, vision, and values statement
   - Brand personality and positioning
   - Target audience definition
   - Brand promise and unique value proposition

2. **Logo Usage Guidelines:**
   - Primary logo specifications and variations
   - Minimum size requirements and clear space rules
   - Acceptable and unacceptable logo usage examples
   - Color variations and background treatments
   - File formats and resolution guidelines

3. **Color Palette System:**
   - Primary and secondary color definitions (HEX, RGB, CMYK, Pantone)
   - Color psychology and meaning explanations
   - Usage hierarchy and combinations
   - Accessibility considerations
   - Color usage do's and don'ts

4. **Typography Guidelines:**
   - Primary and secondary typeface selections
   - Font hierarchy system (headings, body text, captions)
   - Size, weight, and spacing specifications
   - Licensing and usage rights information
   - Fallback font recommendations

5. **Imagery & Visual Style:**
   - Photography style guidelines
   - Illustration standards
   - Graphic elements and patterns
   - Image treatment and filters
   - Visual composition rules

6. **Voice & Tone Guidelines:**
   - Brand voice characteristics
   - Tone variations for different contexts
   - Writing style preferences
   - Messaging framework
   - Communication do's and don'ts

7. **Application Standards:**
   - Website and digital guidelines
   - Print material specifications
   - Social media usage rules
   - Packaging and product guidelines
   - Advertising and marketing applications

8. **Usage Rules & Restrictions:**
   - Brand protection guidelines
   - Approval processes for brand applications
   - Common mistakes to avoid
   - Legal considerations
   - Brand compliance checklist

9. **Implementation Framework:**
   - Team roles and responsibilities
   - Brand review and approval process
   - Training and onboarding guidelines
   - Quality control measures
   - Regular brand audit recommendations

10. **Templates & Resources:**
    - Ready-to-use templates for common applications
    - Asset library organization
    - Contact information for brand queries
    - Version control and update procedures

Format the response as a professional brand guidelines document with clear sections, specific measurements, color codes, and actionable implementation guidance. Include visual examples and practical usage scenarios.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "brand-guidelines",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Brand Guidelines Creation Started",
        description: "Generating your comprehensive brand style guide...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start brand guidelines creation. Please try again.",
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
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Guidelines Builder</h1>
            <p className="text-gray-600">Create comprehensive style guides with usage rules and visual standards</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Style Guide</p>
                  <p className="text-xs text-gray-600">Complete documentation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Visual Standards</p>
                  <p className="text-xs text-gray-600">Colors, fonts, imagery</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">Usage Rules</p>
                  <p className="text-xs text-gray-600">Do's and don'ts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-sm">Team Implementation</p>
                  <p className="text-xs text-gray-600">Guidelines & training</p>
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
            Brand Information
          </CardTitle>
          <CardDescription>
            Provide your brand details to create a comprehensive style guide and usage guidelines
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

                <FormField
                  control={form.control}
                  name="brandMission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Mission</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your brand's mission and purpose"
                          {...field} 
                          data-testid="textarea-brand-mission"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brandValues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Values</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your core brand values and what your brand stands for"
                          {...field} 
                          data-testid="textarea-brand-values"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your target audience demographics and psychographics"
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
                            placeholder="Describe your brand's personality traits and characteristics"
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

              {/* Visual Identity */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Visual Identity</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="primaryColors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Colors</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your primary brand colors (include hex codes if available)"
                            {...field} 
                            data-testid="textarea-primary-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryColors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Colors (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List any secondary or accent colors"
                            {...field} 
                            data-testid="textarea-secondary-colors"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="logoVariations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo Information</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your logo, available variations, and any existing usage guidelines"
                          {...field} 
                          data-testid="textarea-logo-variations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="typography"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Typography (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Current fonts or typography preferences"
                          {...field} 
                          data-testid="input-typography"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageryStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagery Style</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-imagery-style">
                            <SelectValue placeholder="Choose your imagery style preference" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {imageryStyleOptions.map((style) => (
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
              </div>

              <Separator />

              {/* Communication */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Communication & Voice</h3>
                
                <FormField
                  control={form.control}
                  name="toneOfVoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone of Voice</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe how your brand communicates (e.g., professional, friendly, authoritative, playful)"
                          {...field} 
                          data-testid="textarea-tone-of-voice"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="communicationGuidelines"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Communication Guidelines</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe key messaging, language preferences, and communication style"
                          {...field} 
                          data-testid="textarea-communication-guidelines"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Application & Context */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Application & Usage</h3>
                
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
                          data-testid={`checkbox-${context.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and')}`}
                        />
                        <label htmlFor={context} className="text-sm text-gray-700">
                          {context}
                        </label>
                      </div>
                    ))}
                  </div>
                  {form.formState.errors.usageContexts && (
                    <p className="text-sm text-red-600">At least one usage context is required</p>
                  )}
                </div>

                <FormField
                  control={form.control}
                  name="brandDifferentiators"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Differentiators</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What makes your brand unique? How do you stand out from competitors?"
                          {...field} 
                          data-testid="textarea-brand-differentiators"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitorAnalysis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Analysis (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Key competitors and how your brand positioning differs"
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
                  name="additionalElements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Brand Elements (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other brand elements, patterns, icons, or specific requirements"
                          {...field} 
                          data-testid="textarea-additional-elements"
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
                data-testid="button-generate-guidelines"
              >
                {isLoading ? "Creating Brand Guidelines..." : "Generate Comprehensive Style Guide"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Brand Guidelines & Style Guide</h3>
          <BotChatInterface sessionId={sessionId} botType="brand-guidelines" />
        </div>
      )}
    </div>
  );
}