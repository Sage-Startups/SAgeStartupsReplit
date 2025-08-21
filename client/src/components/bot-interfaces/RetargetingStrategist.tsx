import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Target, Users, ArrowRightLeft, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface RetargetingStrategistProps {
  sessionId: number;
  botName: string;
}

export function RetargetingStrategist({ sessionId, botName }: RetargetingStrategistProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    audienceSegments: '',
    conversionGoals: '',
    currentRetargeting: '',
    platforms: '',
    budget: '',
    customerJourney: ''
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

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

  const createStrategyMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Retargeting Strategy: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create a comprehensive retargeting strategy for ${formData.businessName}.

**Business Details:**
- Business Name: ${formData.businessName}
- Website: ${formData.website}
- Audience Segments: ${formData.audienceSegments}
- Conversion Goals: ${formData.conversionGoals}
- Current Retargeting: ${formData.currentRetargeting}
- Platforms: ${formData.platforms}
- Budget: ${formData.budget}
- Customer Journey: ${formData.customerJourney}

Please provide detailed retargeting strategy with:

## 🎯 **Audience Segmentation Strategy**
- Website visitor segmentation by behavior
- Engagement-based audience categories
- Purchase intent level classification
- Time-based visitor segments
- Device and channel-specific audiences
- Custom audience creation guidelines

## 🔄 **Retargeting Campaign Framework**
- Campaign structure and organization
- Ad sequence and messaging progression
- Frequency capping and timing optimization
- Budget allocation across segments
- Platform-specific campaign strategies
- Cross-platform retargeting coordination

## 💬 **Messaging & Creative Strategy**
- Personalized messaging by audience segment
- Progressive disclosure of value propositions
- Urgency and scarcity tactics
- Social proof integration
- Creative variations and testing
- Brand consistency across touchpoints

## 📊 **Performance Optimization**
- Conversion tracking and attribution
- Audience quality scoring
- Campaign performance metrics
- A/B testing framework
- Optimization triggers and thresholds
- ROI measurement and reporting

## 🚀 **Implementation Roadmap**
- Phase 1: Foundation setup and pixel implementation
- Phase 2: Basic campaign launch and testing
- Phase 3: Advanced segmentation and optimization
- Phase 4: Scale and automation
- Success metrics and KPI tracking
- Timeline and milestone planning

## 🔧 **Technical Implementation**
- Pixel and tracking setup requirements
- Audience creation and management
- Campaign structure and settings
- Integration with existing marketing stack
- Data privacy and compliance considerations
- Troubleshooting and maintenance

Format with specific audience definitions, campaign structures, and implementation steps.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Strategy Created!",
        description: "Your retargeting strategy has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create strategy: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.conversionGoals || !formData.audienceSegments) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createStrategyMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="retargeting-strategist" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Retargeting Strategy</h3>
                <p className="text-gray-600 mb-4">Developing audience segmentation and campaign strategies...</p>
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
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Retargeting Strategist</h2>
            <p className="text-gray-600">Create effective retargeting campaigns to re-engage visitors</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Audience Segmentation</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Targeted Campaigns</span>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-4 h-4" />
            <span>Re-engagement</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Retargeting Strategy Setup</CardTitle>
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
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience-segments">Target Audience Segments *</Label>
                <Textarea
                  id="audience-segments"
                  value={formData.audienceSegments}
                  onChange={(e) => handleInputChange('audienceSegments', e.target.value)}
                  placeholder="Describe your audience segments (e.g., cart abandoners, product viewers, blog readers)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conversion-goals">Conversion Goals *</Label>
                <Select onValueChange={(value) => handleInputChange('conversionGoals', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="What's your primary goal?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="complete-purchase">Complete Purchase</SelectItem>
                    <SelectItem value="generate-leads">Generate Leads</SelectItem>
                    <SelectItem value="increase-engagement">Increase Engagement</SelectItem>
                    <SelectItem value="app-download">App Download</SelectItem>
                    <SelectItem value="newsletter-signup">Newsletter Signup</SelectItem>
                    <SelectItem value="multiple-goals">Multiple Goals</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-retargeting">Current Retargeting Efforts</Label>
                <Textarea
                  id="current-retargeting"
                  value={formData.currentRetargeting}
                  onChange={(e) => handleInputChange('currentRetargeting', e.target.value)}
                  placeholder="Describe any existing retargeting campaigns or strategies"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="platforms">Retargeting Platforms</Label>
                <Select onValueChange={(value) => handleInputChange('platforms', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary platform" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facebook-instagram">Facebook & Instagram</SelectItem>
                    <SelectItem value="google-display">Google Display Network</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="twitter">Twitter</SelectItem>
                    <SelectItem value="multiple-platforms">Multiple Platforms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Monthly Budget</Label>
                <Input
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="Enter budget range (e.g., $2,000 - $5,000)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-journey">Customer Journey</Label>
                <Textarea
                  id="customer-journey"
                  value={formData.customerJourney}
                  onChange={(e) => handleInputChange('customerJourney', e.target.value)}
                  placeholder="Describe typical customer journey from awareness to conversion"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createStrategyMutation.isPending}>
              {createStrategyMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Strategy...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Retargeting Strategy
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