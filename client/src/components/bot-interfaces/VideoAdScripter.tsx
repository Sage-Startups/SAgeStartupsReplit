import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Video, Play, Target, Zap, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface VideoAdScripterProps {
  sessionId: number;
  botName: string;
}

export function VideoAdScripter({ sessionId, botName }: VideoAdScripterProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    productService: '',
    targetAudience: '',
    adGoal: '',
    videoDuration: '',
    platform: '',
    tone: '',
    keyMessage: '',
    callToAction: ''
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  // Load existing session
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        setPhase('complete');
      }
    }
  }, [messages]);

  const createScriptMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Video Ad Script: ${formData.productService}`
      });

      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create a compelling video ad script for ${formData.businessName} promoting ${formData.productService}.

**Video Ad Requirements:**
- Business Name: ${formData.businessName}
- Product/Service: ${formData.productService}
- Target Audience: ${formData.targetAudience}
- Ad Goal: ${formData.adGoal}
- Video Duration: ${formData.videoDuration}
- Platform: ${formData.platform}
- Tone: ${formData.tone}
- Key Message: ${formData.keyMessage}
- Call to Action: ${formData.callToAction}

Please provide a complete video ad script with:

## 🎬 **Script Structure**
- Hook (0-3 seconds): Attention-grabbing opening
- Problem/Pain Point (3-8 seconds): Connect with audience needs
- Solution Introduction (8-15 seconds): Present your product/service
- Benefits & Features (15-25 seconds): Key value propositions
- Social Proof (25-30 seconds): Trust indicators
- Call to Action (30+ seconds): Clear next steps

## 📝 **Detailed Script**
- Scene-by-scene breakdown with timestamps
- Voiceover/dialogue with delivery notes
- Visual descriptions and shot suggestions
- Text overlay recommendations
- Music and sound effect cues
- Pacing and transition notes

## 🎯 **Platform Optimization**
- ${formData.platform}-specific formatting
- Optimal aspect ratio recommendations
- Thumbnail and title suggestions
- Caption and hashtag recommendations
- Best posting time suggestions
- Audience targeting refinements

## 🎨 **Visual Direction**
- Color palette suggestions
- Font and text styling
- Animation and motion recommendations
- Product showcase techniques
- Background and setting ideas
- Lighting and mood guidelines

## 📊 **Performance Elements**
- Engagement hooks throughout the video
- Retention optimization techniques
- Conversion optimization strategies
- A/B testing variations
- Success metrics to track
- Optimization recommendations

## 🚀 **Production Guidelines**
- Equipment recommendations
- Shooting tips and best practices
- Editing software suggestions
- Budget considerations
- Timeline for production
- Post-production checklist

Format as a professional video production script with clear scene directions and timing.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Script Created!",
        description: "Your video ad script has been generated with production guidelines.",
      });
      // Invalidate messages to refresh the chat
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create script: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.productService || !formData.targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createScriptMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="video-ad-scripter" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto">
                <Video className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Writing Your Video Script</h3>
                <p className="text-gray-600 mb-4">Creating compelling video ad script with production guidelines...</p>
                <Progress value={processingProgress} className="w-full max-w-md mx-auto" />
                <p className="text-sm text-gray-500 mt-2">{processingProgress}% Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Video Ad Scripter</h2>
            <p className="text-gray-600">Create compelling video ad scripts with production guidelines</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Play className="w-4 h-4" />
            <span>Script Writing</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Audience Targeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Production Ready</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Video Ad Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="business-name">Business Name *</Label>
                <Input
                  id="business-name"
                  value={formData.businessName}
                  onChange={(e) => handleInputChange('businessName', e.target.value)}
                  placeholder="Enter your business name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product-service">Product/Service *</Label>
                <Input
                  id="product-service"
                  value={formData.productService}
                  onChange={(e) => handleInputChange('productService', e.target.value)}
                  placeholder="What are you promoting?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience *</Label>
                <Textarea
                  id="target-audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Describe your ideal customers (age, interests, pain points, etc.)"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-goal">Ad Goal</Label>
                <Select onValueChange={(value) => handleInputChange('adGoal', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's the primary goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                    <SelectItem value="sales-conversion">Sales Conversion</SelectItem>
                    <SelectItem value="app-install">App Install</SelectItem>
                    <SelectItem value="event-promotion">Event Promotion</SelectItem>
                    <SelectItem value="retargeting">Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-duration">Video Duration</Label>
                <Select onValueChange={(value) => handleInputChange('videoDuration', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select video length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15-seconds">15 seconds</SelectItem>
                    <SelectItem value="30-seconds">30 seconds</SelectItem>
                    <SelectItem value="60-seconds">60 seconds</SelectItem>
                    <SelectItem value="90-seconds">90 seconds</SelectItem>
                    <SelectItem value="2-minutes">2 minutes</SelectItem>
                    <SelectItem value="3-minutes">3+ minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select onValueChange={(value) => handleInputChange('platform', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Where will this run?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook-instagram">Facebook & Instagram</SelectItem>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="tiktok">TikTok</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter/X</SelectItem>
                    <SelectItem value="multiple">Multiple Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone & Style</Label>
                <Select onValueChange={(value) => handleInputChange('tone', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual-friendly">Casual & Friendly</SelectItem>
                    <SelectItem value="energetic">Energetic & Bold</SelectItem>
                    <SelectItem value="emotional">Emotional & Inspiring</SelectItem>
                    <SelectItem value="humorous">Humorous & Fun</SelectItem>
                    <SelectItem value="urgent">Urgent & Direct</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-message">Key Message</Label>
                <Textarea
                  id="key-message"
                  value={formData.keyMessage}
                  onChange={(e) => handleInputChange('keyMessage', e.target.value)}
                  placeholder="What's the main message you want to communicate?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="call-to-action">Call to Action</Label>
                <Input
                  id="call-to-action"
                  value={formData.callToAction}
                  onChange={(e) => handleInputChange('callToAction', e.target.value)}
                  placeholder="What action should viewers take? (e.g., 'Visit our website', 'Download now')"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createScriptMutation.isPending}>
              {createScriptMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Writing Script...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Video Ad Script
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}