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
import { Layers, Grid, Palette, Package, ArrowRight, Eye } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  brandPersonality: z.string().min(1, "Brand personality is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  designStyle: z.string().min(1, "Design style is required"),
  colorPalette: z.string().min(1, "Color palette is required"),
  typography: z.string().optional(),
  logoStyle: z.string().min(1, "Logo style is required"),
  imageryStyle: z.string().min(1, "Imagery style is required"),
  usageContexts: z.array(z.string()).min(1, "At least one usage context is required"),
  brandValues: z.string().min(1, "Brand values are required"),
  competitivePositioning: z.string().min(1, "Competitive positioning is required"),
  visualGoals: z.string().min(1, "Visual goals are required"),
  patternNeeds: z.string().min(1, "Pattern needs are required"),
  iconographyStyle: z.string().min(1, "Iconography style is required"),
  layoutPreferences: z.string().min(1, "Layout preferences are required"),
  brandDifferentiators: z.string().min(1, "Brand differentiators are required"),
  implementationScope: z.string().min(1, "Implementation scope is required"),
  additionalRequirements: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const designStyleOptions = [
  "Modern & Minimalist",
  "Classic & Traditional",
  "Bold & Dynamic",
  "Elegant & Sophisticated",
  "Playful & Creative",
  "Tech & Futuristic",
  "Organic & Natural",
  "Luxury & Premium",
  "Industrial & Raw",
  "Artistic & Expressive"
];

const logoStyleOptions = [
  "Wordmark/Logotype",
  "Symbol/Icon-based",
  "Combination Mark",
  "Emblem/Badge",
  "Abstract/Geometric",
  "Illustrative/Pictorial",
  "Monogram/Letter-based",
  "Signature/Script",
  "Vintage/Retro",
  "Modern/Contemporary"
];

const imageryStyleOptions = [
  "Photography-focused",
  "Illustration-based",
  "Mixed Media",
  "Minimalist Graphics",
  "Bold & Colorful",
  "Black & White",
  "Icons & Symbols",
  "Patterns & Textures",
  "Abstract Art",
  "Lifestyle Photography"
];

const iconographyStyleOptions = [
  "Line/Outlined Icons",
  "Filled/Solid Icons",
  "Duotone Icons",
  "Hand-drawn Icons",
  "Geometric Icons",
  "Detailed Illustrations",
  "Minimalist Symbols",
  "3D/Isometric Icons",
  "Vintage/Retro Icons",
  "Custom Illustrations"
];

const usageContextOptions = [
  "Website & Digital",
  "Print Materials",
  "Packaging",
  "Signage & Environmental",
  "Social Media",
  "Advertising",
  "Corporate Communications",
  "Product Design",
  "Merchandise",
  "Trade Shows & Events"
];

export function VisualIdentitySystem() {
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
      designStyle: "",
      colorPalette: "",
      typography: "",
      logoStyle: "",
      imageryStyle: "",
      usageContexts: [],
      brandValues: "",
      competitivePositioning: "",
      visualGoals: "",
      patternNeeds: "",
      iconographyStyle: "",
      layoutPreferences: "",
      brandDifferentiators: "",
      implementationScope: "",
      additionalRequirements: "",
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
      const prompt = `As a Visual Identity System Expert and Design Strategist, create a comprehensive visual identity system with cohesive design elements, visual system architecture, and complete pattern library based on the following brand requirements:

**Brand Foundation:**
- Brand Name: ${data.brandName}
- Industry: ${data.industry}
- Brand Personality: ${data.brandPersonality}
- Target Audience: ${data.targetAudience}
- Brand Values: ${data.brandValues}
- Competitive Positioning: ${data.competitivePositioning}
- Brand Differentiators: ${data.brandDifferentiators}

**Visual Direction:**
- Design Style: ${data.designStyle}
- Color Palette: ${data.colorPalette}
${data.typography ? `- Typography: ${data.typography}` : ""}
- Logo Style: ${data.logoStyle}
- Imagery Style: ${data.imageryStyle}
- Iconography Style: ${data.iconographyStyle}

**System Requirements:**
- Usage Contexts: ${data.usageContexts.join(", ")}
- Visual Goals: ${data.visualGoals}
- Pattern Needs: ${data.patternNeeds}
- Layout Preferences: ${data.layoutPreferences}
- Implementation Scope: ${data.implementationScope}
${data.additionalRequirements ? `- Additional Requirements: ${data.additionalRequirements}` : ""}

Please create a comprehensive visual identity system package that includes:

1. **Visual System Architecture:**
   - Brand identity hierarchy and structure
   - Primary, secondary, and supporting visual elements
   - System flexibility and scalability guidelines
   - Brand expression spectrum (from conservative to bold)
   - Visual identity governance framework

2. **Cohesive Design Elements:**
   - Logo system with variations and usage rules
   - Color palette with primary, secondary, and accent colors
   - Typography hierarchy and font pairing system
   - Iconography and symbol library
   - Photography and imagery guidelines

3. **Comprehensive Pattern Library:**
   - Geometric patterns and background textures
   - Brand-specific graphic elements and motifs
   - Decorative patterns for different applications
   - Scalable pattern systems for various formats
   - Pattern usage guidelines and combinations

4. **Design Element Specifications:**
   - Logo construction guidelines and measurements
   - Color codes (HEX, RGB, CMYK, Pantone)
   - Typography specifications and sizing
   - Icon grid systems and proportions
   - Spacing and layout grid systems

5. **Visual System Components:**
   - Primary logo and symbol variations
   - Sub-brand and co-brand treatments
   - Signature lockups and endorsements
   - Social media profile and cover templates
   - Watermark and small-size applications

6. **Application Guidelines:**
   - Website and digital design standards
   - Print material specifications
   - Packaging design guidelines
   - Environmental and signage applications
   - Merchandise and promotional item standards

7. **Pattern & Texture Library:**
   - Brand-specific patterns in multiple scales
   - Texture libraries for different moods/applications
   - Background patterns for presentations
   - Social media pattern overlays
   - Print-ready pattern files

8. **Layout & Composition Systems:**
   - Grid systems for different formats
   - Layout templates for common applications
   - Composition rules and best practices
   - White space and breathing room guidelines
   - Visual hierarchy principles

9. **Brand Consistency Framework:**
   - Visual audit checklist
   - Quality control standards
   - Brand compliance guidelines
   - Designer handoff specifications
   - Version control and asset management

10. **Implementation Toolkit:**
    - File organization and naming conventions
    - Asset library structure
    - Team training and onboarding materials
    - Vendor and partner brand guidelines
    - Performance measurement and optimization

11. **Digital Asset Management:**
    - File formats and resolution guidelines
    - Color profile management
    - Web-optimized asset specifications
    - Print production requirements
    - Accessibility and compliance standards

12. **Evolution & Scalability:**
    - System growth and expansion guidelines
    - Seasonal and campaign adaptations
    - Sub-brand integration strategies
    - Future-proofing recommendations
    - Refresh and update protocols

Format the response with detailed specifications, visual descriptions, and practical implementation guidance. Include specific measurements, color codes, and usage scenarios for each design element.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "visual-identity",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Visual Identity System Creation Started",
        description: "Generating cohesive design elements and pattern library...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start visual identity system creation. Please try again.",
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
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Visual Identity System</h1>
            <p className="text-gray-600">Cohesive design elements, visual systems, and comprehensive pattern libraries</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-sm">Visual System</p>
                  <p className="text-xs text-gray-600">Cohesive framework</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Grid className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-sm">Design Elements</p>
                  <p className="text-xs text-gray-600">Complete toolkit</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-sky-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-sky-600" />
                <div>
                  <p className="font-semibold text-sm">Pattern Library</p>
                  <p className="text-xs text-gray-600">Scalable patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Brand Consistency</p>
                  <p className="text-xs text-gray-600">Usage guidelines</p>
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
            Visual Identity Requirements
          </CardTitle>
          <CardDescription>
            Define your brand's visual identity needs to create a comprehensive design system and pattern library
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

                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your target audience and their preferences"
                            {...field} 
                            data-testid="textarea-target-audience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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
                    name="competitivePositioning"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Competitive Positioning</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How do you position against competitors? What makes you different?"
                            {...field} 
                            data-testid="textarea-competitive-positioning"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandDifferentiators"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Differentiators</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Key differentiators that should be reflected in your visual identity"
                            {...field} 
                            data-testid="textarea-brand-differentiators"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Visual Direction */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Visual Direction</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="designStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-design-style">
                              <SelectValue placeholder="Choose design style" />
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

                  <FormField
                    control={form.control}
                    name="logoStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-logo-style">
                              <SelectValue placeholder="Choose logo style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {logoStyleOptions.map((style) => (
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="imageryStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imagery Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-imagery-style">
                              <SelectValue placeholder="Choose imagery style" />
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

                  <FormField
                    control={form.control}
                    name="iconographyStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Iconography Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-iconography-style">
                              <SelectValue placeholder="Choose iconography style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {iconographyStyleOptions.map((style) => (
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

                <FormField
                  control={form.control}
                  name="colorPalette"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color Palette</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your desired color palette or list specific colors/hex codes"
                          {...field} 
                          data-testid="textarea-color-palette"
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
              </div>

              <Separator />

              {/* System Requirements */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">System Requirements</h3>
                
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
                  name="visualGoals"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Visual Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What do you want your visual identity to achieve? What impression should it make?"
                          {...field} 
                          data-testid="textarea-visual-goals"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patternNeeds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pattern & Design Element Needs</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What types of patterns, textures, or recurring design elements do you need?"
                          {...field} 
                          data-testid="textarea-pattern-needs"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="layoutPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Layout Preferences</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your preferences for layout, spacing, grid systems, and composition"
                          {...field} 
                          data-testid="textarea-layout-preferences"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="implementationScope"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Implementation Scope</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Where will this visual identity be implemented? What deliverables do you need?"
                          {...field} 
                          data-testid="textarea-implementation-scope"
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
                          placeholder="Any other specific requirements, constraints, or preferences for your visual identity system"
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
                data-testid="button-generate-system"
              >
                {isLoading ? "Creating Visual Identity System..." : "Generate Comprehensive Visual System"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Visual Identity System & Design Elements</h3>
          <BotChatInterface sessionId={sessionId} botType="visual-identity" />
        </div>
      )}
    </div>
  );
}