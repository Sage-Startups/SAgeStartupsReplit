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
import { Video, Film, PlayCircle, Clapperboard } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  videoDuration: z.string().min(1, "Video duration is required"),
  platform: z.string().min(1, "Platform is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  keyMessage: z.string().min(1, "Key message is required"),
  toneStyle: z.string().min(1, "Tone and style is required"),
});

type FormData = z.infer<typeof formSchema>;

const videoDurationOptions = [
  "6 seconds", "15 seconds", "30 seconds", "60 seconds", "90 seconds", "2-3 minutes"
];

const platformOptions = [
  "YouTube", "Facebook", "Instagram", "TikTok", "LinkedIn", "Twitter", "Snapchat"
];

const toneOptions = [
  "Humorous", "Emotional", "Professional", "Energetic", "Inspirational", "Educational", "Dramatic"
];

interface VideoAdScripterProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function VideoAdScripter({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: VideoAdScripterProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      videoDuration: "",
      platform: "",
      targetAudience: "",
      keyMessage: "",
      toneStyle: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create an engaging video ad script for ${data.businessName}'s ${data.productName}.

**Video Specifications:**
- Duration: ${data.videoDuration}
- Platform: ${data.platform}
- Target Audience: ${data.targetAudience}
- Key Message: ${data.keyMessage}
- Tone & Style: ${data.toneStyle}

Please provide a comprehensive video ad script with:

## 🎬 **Opening Hook (First 3 seconds)**
- Attention-grabbing opening line
- Visual description
- Sound/music suggestions
- Text overlay recommendations

## 📝 **Main Script & Storyboard**
- Scene-by-scene breakdown
- Dialogue/voiceover script
- Visual descriptions for each scene
- Transition suggestions
- On-screen text and graphics

## 🎯 **Key Product Highlights**
- Features to showcase
- Benefits to emphasize
- Visual demonstrations
- Proof points and credibility

## 💥 **Call-to-Action**
- Clear CTA script
- Visual CTA treatment
- Urgency elements
- Next steps for viewers

## 🎵 **Production Notes**
- Music and sound effects suggestions
- Pacing and timing guidelines
- Camera angles and shots
- Editing transitions
- Color grading mood

## 📊 **Platform Optimization**
- Platform-specific best practices
- Aspect ratio recommendations
- Caption requirements
- Hashtag suggestions

Format with specific timestamps, actual dialogue, and detailed visual descriptions for easy production.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Video Script Generation Started",
          description: "Creating engaging video content and storyboard...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Video ad scripter error:", error);
      toast({
        title: "Error",
        description: `Failed to generate video script: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Video Ad Scripter</h1>
            <p className="text-gray-600">Engaging video content, script writing, storyboarding, and hook creation</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Film className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-semibold text-sm">Script Writing</p>
                  <p className="text-xs text-gray-600">Compelling dialogue</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clapperboard className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-semibold text-sm">Storyboarding</p>
                  <p className="text-xs text-gray-600">Scene planning</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-rose-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-semibold text-sm">Hook Creation</p>
                  <p className="text-xs text-gray-600">Attention grabbing</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-fuchsia-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Video className="h-5 w-5 text-fuchsia-600" />
                <div>
                  <p className="font-semibold text-sm">Production Notes</p>
                  <p className="text-xs text-gray-600">Technical guidance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="video-scripts" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Video Ad Configuration
            </CardTitle>
            <CardDescription>
              Tell us about your video project to create an engaging script
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
                            placeholder="What are you promoting?" 
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
                    name="videoDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Video Duration *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-duration">
                              <SelectValue placeholder="Select video length" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {videoDurationOptions.map((duration) => (
                              <SelectItem key={duration} value={duration}>
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
                        <FormLabel>Platform *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-platform">
                              <SelectValue placeholder="Where will it be shown?" />
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

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe who will watch this video"
                          {...field} 
                          data-testid="textarea-target-audience"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyMessage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Message *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What's the main point you want to communicate?"
                          {...field} 
                          data-testid="textarea-key-message"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="toneStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tone & Style *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-tone">
                            <SelectValue placeholder="Choose the video tone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {toneOptions.map((tone) => (
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

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || propIsLoading}
                  data-testid="button-generate-script"
                >
                  {isLoading || propIsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Video Script...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4 mr-2" />
                      Generate Video Script
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