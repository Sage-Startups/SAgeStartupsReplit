import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Image, Palette, Layout, Sparkles } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  adSize: z.string().min(1, "Ad size is required"),
  platform: z.string().min(1, "Platform is required"),
  visualStyle: z.string().min(1, "Visual style is required"),
  colorScheme: z.string().min(1, "Color scheme is required"),
  keyMessage: z.string().min(1, "Key message is required"),
});

type FormData = z.infer<typeof formSchema>;

const adSizeOptions = [
  "300x250 (Medium Rectangle)", "728x90 (Leaderboard)", "300x600 (Half Page)", 
  "320x50 (Mobile Banner)", "970x90 (Large Leaderboard)", "250x250 (Square)",
  "336x280 (Large Rectangle)", "1200x628 (Facebook)", "1080x1080 (Instagram Square)"
];

const platformOptions = [
  "Google Display Network", "Facebook", "Instagram", "LinkedIn", "Twitter", "Pinterest", "Programmatic"
];

const visualStyleOptions = [
  "Minimalist", "Bold & Colorful", "Professional", "Playful", "Elegant", "Tech/Modern", "Vintage/Retro"
];

const colorSchemeOptions = [
  "Brand Colors", "Monochrome", "Vibrant", "Pastel", "Dark Mode", "Light & Airy", "Gradient"
];

interface DisplayAdDesignerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function DisplayAdDesigner({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: DisplayAdDesignerProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      adSize: "",
      platform: "",
      visualStyle: "",
      colorScheme: "",
      keyMessage: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a visual display ad design for ${data.businessName}'s ${data.productName}.

**Ad Specifications:**
- Ad Size: ${data.adSize}
- Platform: ${data.platform}
- Visual Style: ${data.visualStyle}
- Color Scheme: ${data.colorScheme}
- Key Message: ${data.keyMessage}

Please provide comprehensive display ad design guidance:

## 🎨 **Visual Concept & Layout**
- Overall design concept
- Layout structure and composition
- Visual hierarchy
- Element placement and spacing
- Background treatment

## 🖼️ **Image Generation Prompt**
Create a detailed prompt for generating the display ad visual:
"Professional display advertisement for ${data.productName}, ${data.visualStyle} style, ${data.colorScheme} colors, ${data.adSize.split(' ')[0]} dimensions, featuring [specific visual elements], clean composition with clear call-to-action space, high-quality commercial design"

## 📝 **Copy & Typography**
- Headline text and styling
- Body copy recommendations
- CTA button text and design
- Font pairings and sizes
- Text hierarchy and placement

## 🎯 **Brand Elements**
- Logo placement and size
- Brand color usage
- Visual consistency guidelines
- Trust signals and badges
- Product imagery treatment

## 💫 **Visual Effects & Enhancement**
- Color overlays and gradients
- Shadow and depth effects
- Animation suggestions (if applicable)
- Interactive elements
- Hover state designs

## 📱 **Size Variations**
- Responsive design adaptations
- Mobile optimization
- Desktop vs mobile layouts
- Aspect ratio considerations
- Platform-specific requirements

## 🚀 **Performance Optimization**
- File size recommendations
- Loading optimization
- Accessibility considerations
- Click-through area optimization
- A/B testing variations

Format with specific design specifications, hex color codes, and detailed visual descriptions.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Display Ad Design Started",
          description: "Creating visual banner concepts and specifications...",
        });
        
        // Generate an image for the display ad
        setGeneratedImageUrl("/api/placeholder-ad.jpg"); // This would be replaced with actual image generation
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Display ad designer error:", error);
      toast({
        title: "Error",
        description: `Failed to generate display ad design: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
            <Image className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Display Ad Designer</h1>
            <p className="text-gray-600">Visual banner creation, design concepts, and brand consistency</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Image className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Banner Design</p>
                  <p className="text-xs text-gray-600">Visual creation</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="font-semibold text-sm">Visual Concepts</p>
                  <p className="text-xs text-gray-600">Creative ideas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-violet-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-violet-600" />
                <div>
                  <p className="font-semibold text-sm">Size Variations</p>
                  <p className="text-xs text-gray-600">Multiple formats</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-fuchsia-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-fuchsia-600" />
                <div>
                  <p className="font-semibold text-sm">Brand Consistency</p>
                  <p className="text-xs text-gray-600">Visual identity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="display-ads" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Display Ad Configuration
            </CardTitle>
            <CardDescription>
              Tell us about your display ad needs to create stunning visuals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
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
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product/Service Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What are you advertising?" 
                            {...field} 
                            data-testid="input-product-name"
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
                    name="adSize"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Size *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-ad-size">
                              <SelectValue placeholder="Select ad dimensions" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {adSizeOptions.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
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
                    name="platform"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Platform *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-platform">
                              <SelectValue placeholder="Where will it be displayed?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {platformOptions.map((platform) => (
                              <SelectItem key={platform} value={platform}>
                                {platform}
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
                    name="visualStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visual Style *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-visual-style">
                              <SelectValue placeholder="Choose design style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {visualStyleOptions.map((style) => (
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
                    name="colorScheme"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color Scheme *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-color-scheme">
                              <SelectValue placeholder="Select color palette" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {colorSchemeOptions.map((scheme) => (
                              <SelectItem key={scheme} value={scheme}>
                                {scheme}
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
                  name="keyMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Message *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What's the main message or offer you want to communicate?"
                          {...field} 
                          data-testid="textarea-key-message"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {generatedImageUrl && (
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="text-sm">Generated Display Ad Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="aspect-video bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">Display ad visual will appear here</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || propIsLoading}
                  data-testid="button-design-ad"
                >
                  {isLoading || propIsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Designing Display Ad...
                    </>
                  ) : (
                    <>
                      <Image className="w-4 h-4 mr-2" />
                      Design Display Ad
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}