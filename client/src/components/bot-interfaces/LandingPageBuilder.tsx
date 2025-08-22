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
import { Layout, Target, TrendingUp, Zap, Palette, MousePointer, Monitor } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  primaryGoal: z.string().min(1, "Primary goal is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  valueProposition: z.string().min(1, "Value proposition is required"),
  designStyle: z.string().min(1, "Design style is required"),
});

type FormData = z.infer<typeof formSchema>;

const goalOptions = [
  "Generate leads", "Increase sales", "Build email list", "Promote product launch", "Drive app downloads", "Register users"
];

const designStyleOptions = [
  "Minimal", "Modern", "Professional", "Creative", "Tech/SaaS", "E-commerce"
];

interface LandingPageBuilderProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function LandingPageBuilder({ sessionId, onSendMessage, isLoading }: LandingPageBuilderProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      primaryGoal: "",
      targetAudience: "",
      valueProposition: "",
      designStyle: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive landing page strategy for ${data.businessName}.

**Project Brief:**
- Primary Goal: ${data.primaryGoal}
- Target Audience: ${data.targetAudience}
- Value Proposition: ${data.valueProposition}
- Design Style: ${data.designStyle}

Please provide a detailed, modern landing page strategy covering:

## 🏗️ PAGE STRUCTURE
- Hero section layout with compelling headline and subheadline
- Above-the-fold content strategy and visual hierarchy
- Section-by-section page flow and content organization
- Navigation and user journey mapping
- Mobile-first responsive design considerations
- Call-to-action placement and frequency throughout the page

## 🎯 CONVERSION OPTIMIZATION
- High-converting headline formulas and examples
- Trust signals and social proof placement strategies
- CTA button design, copy, and optimization techniques
- Form design best practices to reduce friction
- Urgency and scarcity psychological triggers
- Risk reversal and guarantee strategies
- A/B testing elements and priority testing queue

## 🎨 UX DESIGN
- Visual design principles and color psychology
- Typography hierarchy and readability optimization
- White space utilization and content density
- Interactive elements and micro-interactions
- Loading speed optimization techniques
- Accessibility and inclusive design considerations
- Mobile UX optimization and touch-friendly design

## ⚡ IMPLEMENTATION ROADMAP
- Technical requirements and platform recommendations
- Content creation checklist and copywriting guidelines
- Design asset requirements and specifications
- Analytics and tracking setup instructions
- Launch checklist and quality assurance protocols
- Post-launch optimization strategies and monitoring

Format the response with specific examples, actionable recommendations, and modern design principles. Use emojis and clear sections to make it user-friendly and engaging.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Landing Page Design Started",
          description: "Creating conversion-focused page structure and UX optimization...",
        });
      }
    } catch (error) {
      console.error("Landing page builder error:", error);
      toast({
        title: "Error",
        description: "Failed to start landing page design",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Landing Page Builder</h2>
              <p className="text-gray-600">AI-powered page structure and conversion optimization</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Monitor className="w-4 h-4" />
              <span>Page Structure</span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Conversion Optimization</span>
            </div>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>UX Design</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Page Structure</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete page layout with hero sections, content flow, and mobile-responsive design strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500 bg-gradient-to-br from-red-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-red-500 flex items-center justify-center">
                  <MousePointer className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Conversion Optimization</h3>
              </div>
              <p className="text-sm text-gray-600">
                High-converting CTAs, trust signals, and psychological triggers to maximize conversions
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">UX Design</h3>
              </div>
              <p className="text-sm text-gray-600">
                Modern design principles, visual hierarchy, and user experience optimization techniques
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Build Your Landing Page</CardTitle>
            <CardDescription>
              Create a session to access the page builder form and receive comprehensive design strategies
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
                  <Target className="w-4 h-4" />
                  <span>High Converting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Results Focused</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the landing page builder
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Landing Page Builder</h2>
            <p className="text-gray-600">AI-powered page structure and conversion optimization</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Page Structure</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Conversion Optimization</span>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>UX Design</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-orange-800">
            <Layout className="w-5 h-5" />
            <span>Landing Page Configuration</span>
          </CardTitle>
          <CardDescription className="text-orange-700">
            Provide your project details for comprehensive page structure and conversion optimization
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
                          className="bg-white border-orange-200 focus:border-orange-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="primaryGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Primary Goal *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400" data-testid="select-primary-goal">
                            <SelectValue placeholder="Select primary goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {goalOptions.map((goal) => (
                            <SelectItem key={goal} value={goal.toLowerCase().replace(/\s+/g, '-')}>
                              {goal}
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
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Target Audience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your target audience (demographics, interests, pain points)..."
                          className="min-h-[80px] bg-white border-orange-200 focus:border-orange-400"
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
                  name="designStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Design Style *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-orange-200 focus:border-orange-400" data-testid="select-design-style">
                            <SelectValue placeholder="Select design style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {designStyleOptions.map((style) => (
                            <SelectItem key={style} value={style.toLowerCase().replace(/\//g, '-')}>
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
                name="valueProposition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Value Proposition *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What unique value do you offer? What problem do you solve for your customers?"
                        className="min-h-[100px] bg-white border-orange-200 focus:border-orange-400"
                        {...field} 
                        data-testid="textarea-value-proposition"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-medium py-3"
                data-testid="button-build-page"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Building Page...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Build My Landing Page
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="landing-page-builder" />
    </div>
  );
}