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
import { Share2, TrendingUp, Users, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface SocialMediaAnalyticsProps {
  sessionId: number;
  botName: string;
}

export function SocialMediaAnalytics({ sessionId, botName }: SocialMediaAnalyticsProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    socialPlatforms: '',
    analyticsGoals: '',
    contentTypes: '',
    targetAudience: '',
    competitorAnalysis: '',
    reportingNeeds: '',
    currentChallenges: ''
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const { data: messages = [] } = useQuery<any[]>({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        setPhase('complete');
      }
    }
  }, [messages]);

  const createAnalyticsMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Social Analytics: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create comprehensive social media analytics strategy for ${formData.businessName}.

**Social Media Analytics Parameters:**
- Business Name: ${formData.businessName}
- Social Platforms: ${formData.socialPlatforms}
- Analytics Goals: ${formData.analyticsGoals}
- Content Types: ${formData.contentTypes}
- Target Audience: ${formData.targetAudience}
- Competitor Analysis: ${formData.competitorAnalysis}
- Reporting Needs: ${formData.reportingNeeds}
- Current Challenges: ${formData.currentChallenges}

Please provide detailed social media analytics with:

## 📱 **Platform Performance Analysis**
- Individual platform performance metrics
- Cross-platform comparison and insights
- Platform-specific optimization strategies
- Audience behavior analysis by platform
- Content performance by platform
- Growth trajectory and trend analysis

## 📊 **Engagement & Reach Metrics**
- Engagement rate analysis and benchmarking
- Reach and impression optimization
- Follower growth and acquisition analysis
- Share and viral content identification
- Community growth and retention metrics
- Influence and authority measurement

## 🎯 **Content Performance Analysis**
- Top-performing content identification
- Content type effectiveness analysis
- Optimal posting time and frequency
- Content theme and topic performance
- Visual content vs text performance
- User-generated content analysis

## 💡 **Audience Insights & Demographics**
- Detailed audience demographic analysis
- Psychographic and behavioral insights
- Audience sentiment analysis
- Community engagement patterns
- Influencer and brand advocate identification
- Geographic and temporal audience trends

## 🔍 **Competitive Analysis & Benchmarking**
- Competitor performance comparison
- Share of voice analysis
- Competitive content strategy insights
- Market positioning and differentiation
- Competitive advantage identification
- Industry benchmark comparison

## 📈 **ROI & Business Impact**
- Social media ROI calculation
- Lead generation and conversion tracking
- Brand awareness and recall metrics
- Customer acquisition cost from social
- Social commerce performance analysis
- Attribution modeling for social channels

## 🚀 **Strategy Optimization & Recommendations**
- Content strategy optimization plans
- Posting schedule and frequency optimization
- Community management best practices
- Paid social media integration strategies
- Influencer collaboration opportunities
- Crisis management and reputation monitoring

Format with specific social media metrics, platform insights, and actionable optimization strategies.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Social Analytics Complete!",
        description: "Your social media analytics strategy has been created.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create social analytics: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.socialPlatforms || !formData.analyticsGoals) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createAnalyticsMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="social-media-analytics" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <Share2 className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Social Media</h3>
                <p className="text-gray-600 mb-4">Creating comprehensive social analytics strategy and insights...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Share2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Social Media Analytics</h2>
            <p className="text-gray-600">Comprehensive social media performance analysis and insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Platform Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Engagement Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Audience Insights</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Social Media Analytics Setup</CardTitle>
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
                <Label htmlFor="social-platforms">Social Platforms *</Label>
                <Textarea
                  id="social-platforms"
                  value={formData.socialPlatforms}
                  onChange={(e) => handleInputChange('socialPlatforms', e.target.value)}
                  placeholder="List your active social media platforms (Facebook, Instagram, Twitter, LinkedIn, TikTok, etc.)"
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analytics-goals">Analytics Goals *</Label>
                <Textarea
                  id="analytics-goals"
                  value={formData.analyticsGoals}
                  onChange={(e) => handleInputChange('analyticsGoals', e.target.value)}
                  placeholder="What insights do you want from social media analytics? (brand awareness, engagement, lead generation)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content-types">Content Types</Label>
                <Textarea
                  id="content-types"
                  value={formData.contentTypes}
                  onChange={(e) => handleInputChange('contentTypes', e.target.value)}
                  placeholder="Types of content you post (images, videos, stories, polls, articles)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-audience">Target Audience</Label>
                <Textarea
                  id="target-audience"
                  value={formData.targetAudience}
                  onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                  placeholder="Describe your target audience demographics and interests"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitor-analysis">Competitor Analysis</Label>
                <Input
                  id="competitor-analysis"
                  value={formData.competitorAnalysis}
                  onChange={(e) => handleInputChange('competitorAnalysis', e.target.value)}
                  placeholder="List main competitors to analyze"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporting-needs">Reporting Needs</Label>
                <Select onValueChange={(value) => handleInputChange('reportingNeeds', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you need reports?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Insights</SelectItem>
                    <SelectItem value="weekly">Weekly Reports</SelectItem>
                    <SelectItem value="monthly">Monthly Analysis</SelectItem>
                    <SelectItem value="campaign-based">Campaign-based</SelectItem>
                    <SelectItem value="real-time">Real-time Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-challenges">Current Challenges</Label>
                <Textarea
                  id="current-challenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  placeholder="What social media analytics challenges are you facing?"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalyticsMutation.isPending}>
              {createAnalyticsMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Social Analytics...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Social Media Analytics
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