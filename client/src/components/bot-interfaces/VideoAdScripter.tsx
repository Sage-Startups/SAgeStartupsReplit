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
import { Video, Film, PlayCircle, Clapperboard, Zap, Camera, Edit } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  videoDuration: z.string().min(1, "Video duration is required"),
  platform: z.string().min(1, "Platform is required"),
  keyMessage: z.string().min(1, "Key message is required"),
});

type FormData = z.infer<typeof formSchema>;

const videoDurationOptions = [
  "6 seconds", "15 seconds", "30 seconds", "60 seconds", "90 seconds", "2-3 minutes"
];

const platformOptions = [
  "YouTube", "Facebook", "Instagram", "TikTok", "LinkedIn", "Twitter", "Snapchat"
];

interface VideoAdScripterProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function VideoAdScripter({ sessionId, onSendMessage, isLoading }: VideoAdScripterProps = {}) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      videoDuration: "",
      platform: "",
      keyMessage: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const prompt = `Create an engaging video ad script for ${data.businessName}'s ${data.productName}.

**Video Specifications:**
- Duration: ${data.videoDuration}
- Platform: ${data.platform}
- Key Message: ${data.keyMessage}

Please provide a comprehensive, user-friendly video ad strategy covering:

## 🎬 HOOK CREATION
- Powerful opening hooks for the first 3 seconds to grab attention
- Pattern interrupt techniques and curiosity gaps
- Platform-specific hook strategies and formats
- Visual hook elements and opening scenes
- Sound and music recommendations for maximum impact
- Hook A/B testing variations and alternatives
- Psychological triggers and emotional hooks

## 📝 VIDEO SCRIPT
- Complete scene-by-scene script breakdown with timestamps
- Natural dialogue and voiceover copy that flows seamlessly
- Story arc structure with clear beginning, middle, and end
- Character development and personality injection
- Transition scripts and scene connections
- On-screen text overlays and graphic callouts
- Platform-optimized pacing and rhythm for ${data.platform}

## 🎯 STORYBOARDING
- Detailed visual descriptions for each scene
- Camera angle recommendations and shot types
- Visual composition and framing guidelines  
- Props, settings, and background requirements
- Actor/presenter positioning and movement
- Color palette and visual mood suggestions
- Graphic elements and animation opportunities

## ⚡ PRODUCTION GUIDE
- Step-by-step filming instructions and shot list
- Equipment recommendations and technical requirements
- Lighting setup and cinematography tips
- Audio recording and music integration guidelines
- Editing workflow and post-production notes
- Platform-specific formatting and export settings
- Call-to-action placement and optimization strategies

Format the response with specific examples, actual dialogue, detailed visual descriptions, and actionable production tips. Use emojis and modern formatting to make it engaging and easy to follow for content creators.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Video Script Started",
          description: "Creating engaging video script with hooks and storyboarding...",
        });
      }
    } catch (error) {
      console.error("Video script generation error:", error);
      toast({
        title: "Error",
        description: "Failed to start video script generation",
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Video Ad Scripter</h2>
              <p className="text-gray-600">AI-powered script creation with hooks and storyboarding</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <PlayCircle className="w-4 h-4" />
              <span>Hook Creation</span>
            </div>
            <div className="flex items-center space-x-2">
              <Film className="w-4 h-4" />
              <span>Video Script</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clapperboard className="w-4 h-4" />
              <span>Storyboarding</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Hook Creation</h3>
              </div>
              <p className="text-sm text-gray-600">
                Powerful opening hooks and attention-grabbing techniques for the first 3 seconds
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Video Script</h3>
              </div>
              <p className="text-sm text-gray-600">
                Complete scene-by-scene scripts with natural dialogue and platform optimization
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500 flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Storyboarding</h3>
              </div>
              <p className="text-sm text-gray-600">
                Detailed visual descriptions, camera angles, and production guidelines
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-gray-900">Create Your Video Script</CardTitle>
            <CardDescription>
              Create a session to access the video scripter and receive comprehensive scripts with storyboards
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Quick Scripts</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Platform Optimized</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Film className="w-4 h-4" />
                  <span>Production Ready</span>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Select a project and start a new session to access the video ad scripter
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Video Ad Scripter</h2>
            <p className="text-gray-600">AI-powered script creation with hooks and storyboarding</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <PlayCircle className="w-4 h-4" />
            <span>Hook Creation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Film className="w-4 h-4" />
            <span>Video Script</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clapperboard className="w-4 h-4" />
            <span>Storyboarding</span>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <Video className="w-5 h-5" />
            <span>Video Script Configuration</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            Provide your video details for comprehensive script creation with hooks and storyboarding
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
                          className="bg-white border-blue-200 focus:border-blue-400"
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
                          placeholder="What are you promoting?" 
                          {...field} 
                          data-testid="input-product-name"
                          className="bg-white border-blue-200 focus:border-blue-400"
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
                  name="videoDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-800 font-medium">Video Duration *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400" data-testid="select-video-duration">
                            <SelectValue placeholder="Select video length" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {videoDurationOptions.map((duration) => (
                            <SelectItem key={duration} value={duration.toLowerCase().replace(/\s+/g, '-')}>
                              {duration}
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
                      <FormLabel className="text-gray-800 font-medium">Target Platform *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400" data-testid="select-platform">
                            <SelectValue placeholder="Select platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platformOptions.map((platform) => (
                            <SelectItem key={platform} value={platform.toLowerCase()}>
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

              <FormField
                control={form.control}
                name="keyMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-800 font-medium">Key Message *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What's the main message you want to communicate? What problem do you solve or benefit do you provide?"
                        className="min-h-[100px] bg-white border-blue-200 focus:border-blue-400"
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3"
                data-testid="button-create-script"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Creating Script...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create My Video Script
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <BotChatInterface sessionId={sessionId} botType="video-ad-scripter" />
    </div>
  );
}