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
import { BarChart3, Globe, Users, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface WebAnalyticsProps {
  sessionId: number;
  botName: string;
}

export function WebAnalytics({ sessionId, botName }: WebAnalyticsProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    analyticsGoals: '',
    currentTools: '',
    audienceSegments: '',
    keyMetrics: '',
    reportingFrequency: '',
    dataConnections: ''
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
        sessionTitle: `Web Analytics: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create comprehensive web analytics strategy for ${formData.businessName} (${formData.website}).

**Web Analytics Parameters:**
- Business Name: ${formData.businessName}
- Website: ${formData.website}
- Analytics Goals: ${formData.analyticsGoals}
- Current Tools: ${formData.currentTools}
- Audience Segments: ${formData.audienceSegments}
- Key Metrics: ${formData.keyMetrics}
- Reporting Frequency: ${formData.reportingFrequency}
- Data Connections: ${formData.dataConnections}

Please provide detailed web analytics analysis with:

## 📊 **Analytics Setup & Configuration**
- Google Analytics 4 implementation and setup
- Tag Manager configuration and event tracking
- Custom dimension and metric definitions
- Goal setup and conversion tracking
- Audience segmentation configuration
- Enhanced ecommerce tracking setup

## 🎯 **Traffic Analysis & Insights**
- Traffic source analysis and attribution
- User acquisition channel performance
- Organic vs paid traffic breakdown
- Geographic and demographic insights
- Device and technology usage patterns
- Session behavior and engagement metrics

## 📈 **User Behavior Analysis**
- User journey mapping and flow analysis
- Page performance and content analysis
- Site search behavior and optimization
- Form completion and abandonment rates
- Scroll depth and engagement tracking
- Exit page analysis and optimization

## 💡 **Conversion & Goal Analysis**
- Conversion funnel performance analysis
- Multi-channel attribution modeling
- Goal completion rates and optimization
- E-commerce transaction analysis
- Revenue attribution and ROI tracking
- Customer lifetime value analysis

## 🔍 **Audience Insights & Segmentation**
- User demographic and psychographic analysis
- Behavioral audience segmentation
- Custom audience creation and targeting
- Cohort analysis and retention tracking
- New vs returning visitor analysis
- High-value customer identification

## 🚀 **Performance Optimization**
- Site speed and Core Web Vitals analysis
- Mobile experience optimization insights
- Content performance and optimization
- Landing page effectiveness analysis
- Internal search optimization recommendations
- User experience improvement strategies

## 🔧 **Reporting & Dashboard Creation**
- Custom dashboard development
- Automated reporting setup
- KPI monitoring and alerts
- Data visualization and presentation
- Stakeholder reporting templates
- Data export and integration options

Format with specific analytics metrics, actionable insights, and implementation recommendations.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Analytics Strategy Complete!",
        description: "Your web analytics implementation plan is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create analytics strategy: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.website || !formData.analyticsGoals) {
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
    return <BotChatInterface sessionId={sessionId} botType="web-analytics" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Web Data</h3>
                <p className="text-gray-600 mb-4">Creating comprehensive analytics strategy and insights...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Web Analytics</h2>
            <p className="text-gray-600">Comprehensive website data analysis and insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Traffic Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>User Behavior</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Web Analytics Configuration</CardTitle>
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
                <Label htmlFor="website">Website URL *</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://yourwebsite.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analytics-goals">Analytics Goals *</Label>
                <Textarea
                  id="analytics-goals"
                  value={formData.analyticsGoals}
                  onChange={(e) => handleInputChange('analyticsGoals', e.target.value)}
                  placeholder="What insights do you want to gain from your website analytics?"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="List important metrics to track (traffic, conversions, engagement)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-tools">Current Analytics Tools</Label>
                <Input
                  id="current-tools"
                  value={formData.currentTools}
                  onChange={(e) => handleInputChange('currentTools', e.target.value)}
                  placeholder="Google Analytics, Adobe Analytics, Mixpanel, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience-segments">Audience Segments</Label>
                <Input
                  id="audience-segments"
                  value={formData.audienceSegments}
                  onChange={(e) => handleInputChange('audienceSegments', e.target.value)}
                  placeholder="Target audiences or customer segments"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporting-frequency">Reporting Frequency</Label>
                <Select onValueChange={(value) => handleInputChange('reportingFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often do you need reports?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="real-time">Real-time Dashboard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-connections">Data Connections</Label>
                <Input
                  id="data-connections"
                  value={formData.dataConnections}
                  onChange={(e) => handleInputChange('dataConnections', e.target.value)}
                  placeholder="CRM, email marketing, advertising platforms"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalyticsMutation.isPending}>
              {createAnalyticsMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Analytics Strategy...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Web Analytics Plan
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