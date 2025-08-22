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
import { Image, Palette, Layout, Sparkles, Zap, Monitor, Crop } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  adSize: z.string().min(1, "Ad size is required"),
  visualStyle: z.string().min(1, "Visual style is required"),
  keyMessage: z.string().min(1, "Key message is required"),
});

type FormData = z.infer<typeof formSchema>;

const adSizeOptions = [
  "300x250 (Medium Rectangle)", "728x90 (Leaderboard)", "300x600 (Half Page)", 
  "320x50 (Mobile Banner)", "970x90 (Large Leaderboard)", "1200x628 (Social Media)"
];

const visualStyleOptions = [
  "Minimalist", "Bold & Colorful", "Professional", "Playful", "Tech/Modern", "Elegant"
];

interface DisplayAdDesignerProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function DisplayAdDesigner({ sessionId, onSendMessage, isLoading }: DisplayAdDesignerProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      adSize: "",
      visualStyle: "",
      keyMessage: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create comprehensive display ad designs for ${data.businessName}'s ${data.productName}.

**Ad Specifications:**
- Ad Size: ${data.adSize}
- Visual Style: ${data.visualStyle}
- Key Message: ${data.keyMessage}

Please provide detailed, user-friendly display ad design guidance covering:

## 🎨 BANNER DESIGN
- Complete visual concept and layout structure with modern design principles
- Visual hierarchy and element placement strategies for maximum impact
- Background treatments, textures, and design foundations
- Typography selection with font pairings and size recommendations
- Color palette with primary, secondary, and accent color suggestions
- Logo integration and brand element positioning guidelines
- Call-to-action button design with placement optimization

## 💡 VISUAL CONCEPTS
- Multiple creative concept variations and design approaches
- Image and graphic element recommendations with styling guidelines
- Visual storytelling techniques and narrative flow
- Product showcase strategies and feature highlighting methods
- Trust signals, testimonials, and credibility boosters integration
- Interactive element suggestions and hover state designs
- Platform-specific optimization strategies for different networks

## 📐 SIZE VARIATIONS
- Responsive design adaptations for multiple ad formats
- Mobile vs desktop layout optimization strategies  
- Aspect ratio considerations and scaling guidelines
- Platform-specific requirements (Google Display, Facebook, Instagram, LinkedIn)
- Cross-device compatibility and performance optimization
- File size recommendations and compression techniques
- Animation and motion graphics suggestions for dynamic ads

## ⚡ IMPLEMENTATION GUIDE
- Step-by-step design creation workflow and process
- Technical specifications and export settings for each format
- Quality assurance checklist and testing procedures
- A/B testing recommendations for design elements
- Performance metrics and optimization strategies
- Accessibility compliance and inclusive design practices
- Tools and software recommendations for ad creation

Format the response with specific design examples, color codes, dimension details, and actionable creation steps. Use modern formatting and emojis to make it engaging and easy to follow for designers and marketers.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Display Ad Design Started",
          description: "Creating comprehensive banner designs and visual concepts...",
        });
      }
    } catch (error) {
      console.error("Display ad design error:", error);
      toast({
        title: "Error",
        description: "Failed to start display ad design",
        variant: "destructive",
      });
    }
  };

  // If there's no active session, show the session creation interface
  if (!sessionId) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
              <Image className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Display Ad Designer</h2>
              <p className="text-gray-600">AI-powered banner design with visual concepts and size variations</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Layout className="w-4 h-4" />
              <span>Banner Design</span>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Visual Concepts</span>
            </div>
            <div className="flex items-center space-x-2">
              <Crop className="w-4 h-4" />
              <span>Size Variations</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                  <Layout className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Banner Design</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete visual layouts with typography, color palettes, and brand integration strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-teal-500 bg-gradient-to-br from-teal-50 to-cyan-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Visual Concepts</h3>
              </div>
              <p className="text-sm text-gray-600">
                Creative concepts with storytelling techniques and interactive element recommendations
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Size Variations</h3>
              </div>
              <p className="text-sm text-gray-600">
                Responsive adaptations for multiple formats with platform-specific optimization
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Design Your Display Ads</CardTitle>
            <CardDescription>
              Create a session to access the display ad designer and receive comprehensive design strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Design</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Image className="w-4 h-4" />
                  <span>Multi-Format</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4" />
                  <span>Professional Quality</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the display ad designer
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If there's an active session, show the form or chat interface
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <Image className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Display Ad Designer</h2>
            <p className="text-gray-600">AI-powered banner design with visual concepts and size variations</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Layout className="w-4 h-4" />
            <span>Banner Design</span>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Visual Concepts</span>
          </div>
          <div className="flex items-center space-x-2">
            <Crop className="w-4 h-4" />
            <span>Size Variations</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-green-800">
            <Image className="w-5 h-5" />
            <span>Display Ad Configuration</span>
          </CardTitle>
          <CardDescription className="text-green-700">
            Provide your ad details for comprehensive banner design with visual concepts and size variations
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
                      <FormLabel className="text-gray-800 font-medium">Business Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your business name" 
                          {...field} 
                          data-testid="input-business-name"
                          className="bg-white border-green-200 focus:border-green-400"
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
                      <FormLabel className="text-gray-800 font-medium">Product/Service Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What are you advertising?" 
                          {...field} 
                          data-testid="input-product-name"
                          className="bg-white border-green-200 focus:border-green-400"
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
                      <FormLabel className="text-gray-800 font-medium">Primary Ad Size *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-green-200 focus:border-green-400" data-testid="select-ad-size">
                            <SelectValue placeholder="Select ad dimensions" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {adSizeOptions.map((size) => (
                            <SelectItem key={size} value={size.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
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
                  name="visualStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Visual Style *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-green-200 focus:border-green-400" data-testid="select-visual-style">
                            <SelectValue placeholder="Select design style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {visualStyleOptions.map((style) => (
                            <SelectItem key={style} value={style.toLowerCase().replace(/[^a-z0-9]/g, '-')}>
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
                name="keyMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Key Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What's the main message or offer you want to communicate in your display ad?"
                        className="min-h-[100px] bg-white border-green-200 focus:border-green-400"
                        {...field} 
                        data-testid="textarea-key-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium py-3"
                data-testid="button-design-ad"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Designing Ad...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Design My Display Ad
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="display-ad-designer" />
    </div>
  );
}