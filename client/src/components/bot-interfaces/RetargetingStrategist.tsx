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
import { RefreshCw, Users, MessageSquare, Clock, Zap, Target, Layers } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  audienceSegment: z.string().min(1, "Audience segment is required"),
  retargetingGoal: z.string().min(1, "Retargeting goal is required"),
  timeWindow: z.string().min(1, "Time window is required"),
});

type FormData = z.infer<typeof formSchema>;

const audienceSegmentOptions = [
  "Website Visitors", "Cart Abandoners", "Product Viewers", "Past Purchasers", "Email Subscribers", "Video Viewers"
];

const retargetingGoalOptions = [
  "Complete Purchase", "Increase Brand Recall", "Generate Leads", "Upsell/Cross-sell", "Win Back Customers"
];

const timeWindowOptions = [
  "1-7 days", "8-14 days", "15-30 days", "31-60 days", "61-90 days"
];

interface RetargetingStrategistProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function RetargetingStrategist({ sessionId, onSendMessage, isLoading }: RetargetingStrategistProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      audienceSegment: "",
      retargetingGoal: "",
      timeWindow: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create a comprehensive retargeting strategy for ${data.businessName}'s ${data.productName}.

**Campaign Configuration:**
- Audience Segment: ${data.audienceSegment}
- Retargeting Goal: ${data.retargetingGoal}
- Time Window: ${data.timeWindow}

Please provide detailed, user-friendly retargeting campaign guidance covering:

## 👥 AUDIENCE SEGMENTATION
- Detailed segment definitions with behavioral triggers and criteria
- Advanced audience layering strategies for precise targeting
- Custom audience creation guidelines and best practices
- Exclusion lists and negative audience strategies
- Lookalike audience opportunities and expansion tactics
- Dynamic audience refresh strategies and automation rules
- Audience size optimization and performance monitoring

## 📨 MESSAGE SEQUENCING
- Day-by-day message progression with strategic timing
- Creative rotation strategies to prevent ad fatigue
- Personalization elements based on user behavior and preferences
- Dynamic content recommendations and automated messaging
- Cross-channel coordination for consistent brand experience
- Progressive messaging intensity and urgency escalation
- Behavioral trigger-based message customization

## ⏰ FREQUENCY CAPPING
- Optimal impression frequency recommendations by platform
- Daily, weekly, and monthly cap strategies for maximum impact
- Platform-specific frequency limits and best practices
- Ad fatigue prevention techniques and creative refresh cycles
- Timing optimization based on audience behavior patterns
- Frequency testing frameworks and performance monitoring
- Budget allocation strategies across different frequency levels

## ⚡ IMPLEMENTATION STRATEGY
- Step-by-step campaign setup and launch procedures
- Platform-specific configuration guides (Facebook, Google, etc.)
- Tracking pixel implementation and conversion setup
- Campaign structure and hierarchy optimization
- Budget allocation and bid strategy recommendations
- Quality assurance checklist and testing protocols
- Performance monitoring and optimization workflows

Format the response with specific examples, actionable setup steps, and best practice recommendations. Use modern formatting and emojis to make it engaging and easy to follow for digital marketers.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Retargeting Strategy Started",
          description: "Creating comprehensive audience segmentation and message sequencing...",
        });
      }
    } catch (error) {
      console.error("Retargeting strategy error:", error);
      toast({
        title: "Error",
        description: "Failed to start retargeting strategy",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Retargeting Strategist</h2>
              <p className="text-gray-600">AI-powered retargeting with audience segmentation and message sequencing</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Audience Segmentation</span>
            </div>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Message Sequencing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Frequency Capping</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Audience Segmentation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Advanced audience layering with behavioral triggers and lookalike expansion strategies
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500 bg-gradient-to-br from-pink-50 to-rose-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Message Sequencing</h3>
              </div>
              <p className="text-sm text-gray-600">
                Strategic message progression with personalization and cross-channel coordination
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-rose-500 bg-gradient-to-br from-rose-50 to-red-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-rose-500 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Frequency Capping</h3>
              </div>
              <p className="text-sm text-gray-600">
                Optimal frequency strategies with fatigue prevention and timing optimization
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Build Your Retargeting Strategy</CardTitle>
            <CardDescription>
              Create a session to access the retargeting strategist and receive comprehensive campaign strategies
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Smart Targeting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4" />
                  <span>Automated Sequences</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4" />
                  <span>High Converting</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the retargeting strategist
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <RefreshCw className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Retargeting Strategist</h2>
            <p className="text-gray-600">AI-powered retargeting with audience segmentation and message sequencing</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Audience Segmentation</span>
          </div>
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>Message Sequencing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Frequency Capping</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-purple-800">
            <RefreshCw className="w-5 h-5" />
            <span>Retargeting Campaign Configuration</span>
          </CardTitle>
          <CardDescription className="text-purple-700">
            Provide your campaign details for comprehensive retargeting strategy with audience segmentation
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
                          className="bg-white border-purple-200 focus:border-purple-400"
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
                          placeholder="What are you retargeting for?" 
                          {...field} 
                          data-testid="input-product-name"
                          className="bg-white border-purple-200 focus:border-purple-400"
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
                  name="audienceSegment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Primary Audience Segment *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400" data-testid="select-audience-segment">
                            <SelectValue placeholder="Select audience type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {audienceSegmentOptions.map((segment) => (
                            <SelectItem key={segment} value={segment.toLowerCase().replace(/\s+/g, '-')}>
                              {segment}
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
                  name="retargetingGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Retargeting Goal *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400" data-testid="select-retargeting-goal">
                            <SelectValue placeholder="Select campaign goal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {retargetingGoalOptions.map((goal) => (
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

              <FormField
                control={form.control}
                name="timeWindow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Retargeting Time Window *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400" data-testid="select-time-window">
                          <SelectValue placeholder="Select time window for retargeting" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {timeWindowOptions.map((window) => (
                          <SelectItem key={window} value={window.toLowerCase().replace(/\s+/g, '-')}>
                            {window}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3"
                data-testid="button-create-strategy"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Creating Strategy...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Retargeting Strategy
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="retargeting-strategist" />
    </div>
  );
}