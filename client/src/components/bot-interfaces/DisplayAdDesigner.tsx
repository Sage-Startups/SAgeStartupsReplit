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
import { Monitor, Palette, Target, Zap, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface DisplayAdDesignerProps {
  sessionId: number;
  botName: string;
}

export function DisplayAdDesigner({ sessionId, botName }: DisplayAdDesignerProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    productService: '',
    targetAudience: '',
    adGoal: '',
    adFormat: '',
    platform: '',
    colorPreferences: '',
    brandGuidelines: '',
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

  const createDesignMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Display Ad Design: ${formData.productService}`
      });

      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create a comprehensive display ad design strategy for ${formData.businessName} promoting ${formData.productService}.

**Display Ad Requirements:**
- Business Name: ${formData.businessName}
- Product/Service: ${formData.productService}
- Target Audience: ${formData.targetAudience}
- Ad Goal: ${formData.adGoal}
- Ad Format: ${formData.adFormat}
- Platform: ${formData.platform}
- Color Preferences: ${formData.colorPreferences}
- Brand Guidelines: ${formData.brandGuidelines}
- Key Message: ${formData.keyMessage}
- Call to Action: ${formData.callToAction}

Please provide a complete display ad design strategy with:

## 🎨 **Visual Design Strategy**
- Color palette recommendations with hex codes
- Typography choices and font pairings
- Layout composition and visual hierarchy
- Image and graphic recommendations
- Brand integration and consistency guidelines
- Platform-specific design adaptations

## 📐 **Ad Format Specifications**
- Exact dimensions and aspect ratios
- Safe zones and text placement guidelines
- File size and format requirements
- Animation and interactive elements
- Multi-format variations and sizes
- Technical specifications for each platform

## 💬 **Copy & Messaging**
- Headline variations with A/B test options
- Supporting text and descriptions
- Call-to-action button text and placement
- Value proposition communication
- Emotional trigger integration
- Brand voice and tone consistency

## 🎯 **Audience Targeting Elements**
- Visual elements that appeal to target audience
- Demographic-specific design choices
- Psychographic appeal strategies
- Cultural and social considerations
- Age-appropriate design elements
- Interest-based visual cues

## 📊 **Performance Optimization**
- Eye-tracking and attention optimization
- Conversion-focused design elements
- Click-through rate improvement strategies
- Brand recall enhancement techniques
- Mobile optimization considerations
- Accessibility compliance features

## 🚀 **Implementation Guidelines**
- Design software recommendations
- Asset creation workflow
- Quality assurance checklist
- Launch preparation steps
- Performance tracking setup
- Optimization iteration plan

## 🔧 **Technical Requirements**
- File formats and compression settings
- Color profile specifications
- Resolution and DPI requirements
- Animation frame rates and duration
- Loading speed optimization
- Cross-browser compatibility checks

Format as a comprehensive display ad design brief with visual mockups descriptions and implementation guidelines.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Design Created!",
        description: "Your display ad design strategy has been generated with implementation guidelines.",
      });
      // Invalidate messages to refresh the chat
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create design: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
    createDesignMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="display-ad-designer" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Monitor className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Designing Your Display Ad</h3>
                <p className="text-gray-600 mb-4">Creating visual design strategy with platform specifications...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Display Ad Designer</h2>
            <p className="text-gray-600">Create compelling visual ad designs with technical specifications</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Visual Design</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Audience Targeting</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Performance Optimized</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Display Ad Configuration</CardTitle>
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
                  placeholder="What are you advertising?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience *</Label>
                <Textarea
                  id="target-audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Describe your ideal customers (demographics, interests, behaviors)"
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
                    <SelectItem value="traffic">Drive Traffic</SelectItem>
                    <SelectItem value="leads">Generate Leads</SelectItem>
                    <SelectItem value="sales">Drive Sales</SelectItem>
                    <SelectItem value="app-promotion">App Promotion</SelectItem>
                    <SelectItem value="retargeting">Retargeting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-format">Ad Format</Label>
                <Select onValueChange={(value) => handleInputChange('adFormat', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner (728x90)</SelectItem>
                    <SelectItem value="rectangle">Rectangle (300x250)</SelectItem>
                    <SelectItem value="square">Square (1080x1080)</SelectItem>
                    <SelectItem value="skyscraper">Skyscraper (160x600)</SelectItem>
                    <SelectItem value="mobile-banner">Mobile Banner (320x50)</SelectItem>
                    <SelectItem value="multiple">Multiple Formats</SelectItem>
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
                    <SelectItem value="google-display">Google Display Network</SelectItem>
                    <SelectItem value="facebook">Facebook & Instagram</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="programmatic">Programmatic Advertising</SelectItem>
                    <SelectItem value="native">Native Advertising</SelectItem>
                    <SelectItem value="multiple">Multiple Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color-preferences">Color Preferences</Label>
                <Input
                  id="color-preferences"
                  value={formData.colorPreferences}
                  onChange={(e) => handleInputChange('colorPreferences', e.target.value)}
                  placeholder="Preferred colors or brand colors (e.g., blue, red, #FF5733)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand-guidelines">Brand Guidelines</Label>
                <Textarea
                  id="brand-guidelines"
                  value={formData.brandGuidelines}
                  onChange={(e) => handleInputChange('brandGuidelines', e.target.value)}
                  placeholder="Any specific brand requirements, fonts, or style guidelines?"
                  rows={2}
                />
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
                  placeholder="What action should viewers take? (e.g., 'Shop Now', 'Learn More')"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createDesignMutation.isPending}>
              {createDesignMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Design...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Display Ad Design
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