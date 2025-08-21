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
import { Target, TrendingUp, BarChart3, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ConversionTrackingProps {
  sessionId: number;
  botName: string;
}

export function ConversionTracking({ sessionId, botName }: ConversionTrackingProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    conversionGoals: '',
    trackingTools: '',
    funnelStages: '',
    dataSource: '',
    analysisType: '',
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

  const createTrackingMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Conversion Tracking: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create comprehensive conversion tracking strategy for ${formData.businessName} (${formData.website}).

**Conversion Tracking Parameters:**
- Business Name: ${formData.businessName}
- Website: ${formData.website}
- Conversion Goals: ${formData.conversionGoals}
- Tracking Tools: ${formData.trackingTools}
- Funnel Stages: ${formData.funnelStages}
- Data Source: ${formData.dataSource}
- Analysis Type: ${formData.analysisType}
- Current Challenges: ${formData.currentChallenges}

Please provide detailed conversion tracking analysis with:

## 🎯 **Conversion Goal Setup & Configuration**
- Primary and secondary conversion goals
- Conversion value assignment and tracking
- Goal funnel configuration and steps
- Event tracking setup and parameters
- Cross-device and cross-platform tracking
- Conversion attribution modeling

## 📊 **Funnel Analysis & Optimization**
- Conversion funnel performance analysis
- Drop-off point identification and analysis
- Bottleneck detection and resolution
- User journey mapping and optimization
- Multi-touch attribution analysis
- Conversion path analysis and insights

## 🔍 **Tracking Implementation Strategy**
- Google Analytics 4 setup and configuration
- Tag Manager implementation and management
- Facebook Pixel and social media tracking
- Email marketing conversion tracking
- Phone call and offline conversion tracking
- Custom event and micro-conversion tracking

## 💡 **Data Analysis & Insights**
- Conversion rate analysis by traffic source
- Audience segmentation and performance
- Campaign performance and ROI analysis
- A/B test results and statistical significance
- Cohort analysis and customer lifetime value
- Seasonal trends and pattern identification

## 📈 **Performance Metrics & KPIs**
- Conversion rate optimization benchmarks
- Cost per conversion and acquisition costs
- Revenue attribution and profit analysis
- Customer acquisition cost (CAC) tracking
- Return on ad spend (ROAS) measurement
- Lifetime value to acquisition cost ratios

## 🚀 **Optimization Recommendations**
- Landing page conversion optimization
- Form and checkout process improvements
- Call-to-action testing and placement
- Mobile conversion experience enhancement
- Site speed and technical optimization
- Personalization and targeting strategies

## 🔧 **Reporting & Dashboard Setup**
- Automated conversion reporting system
- Real-time dashboard configuration
- Alert system for conversion anomalies
- Stakeholder reporting templates
- Data visualization and presentation
- Integration with business intelligence tools

Format with specific conversion metrics, actionable optimization strategies, and implementation timelines.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Conversion Strategy Created!",
        description: "Your conversion tracking and optimization plan is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create conversion strategy: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.website || !formData.conversionGoals) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createTrackingMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="conversion-tracking" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto">
                <Target className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Building Conversion Strategy</h3>
                <p className="text-gray-600 mb-4">Creating comprehensive tracking and optimization plan...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
            <Target className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Conversion Tracking</h2>
            <p className="text-gray-600">Comprehensive conversion analysis and optimization</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Goal Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Funnel Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversion Tracking Setup</CardTitle>
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
                <Label htmlFor="conversion-goals">Conversion Goals *</Label>
                <Textarea
                  id="conversion-goals"
                  value={formData.conversionGoals}
                  onChange={(e) => handleInputChange('conversionGoals', e.target.value)}
                  placeholder="List your primary conversion goals (e.g., purchase, lead generation, signup, download)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="funnel-stages">Funnel Stages</Label>
                <Textarea
                  id="funnel-stages"
                  value={formData.funnelStages}
                  onChange={(e) => handleInputChange('funnelStages', e.target.value)}
                  placeholder="Describe your conversion funnel stages (awareness → consideration → purchase)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tracking-tools">Current Tracking Tools</Label>
                <Input
                  id="tracking-tools"
                  value={formData.trackingTools}
                  onChange={(e) => handleInputChange('trackingTools', e.target.value)}
                  placeholder="Google Analytics, Facebook Pixel, Hotjar, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Focus</Label>
                <Select onValueChange={(value) => handleInputChange('analysisType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                    <SelectItem value="funnel-optimization">Funnel Optimization</SelectItem>
                    <SelectItem value="attribution-modeling">Attribution Modeling</SelectItem>
                    <SelectItem value="mobile-conversion">Mobile Conversion</SelectItem>
                    <SelectItem value="ecommerce-tracking">E-commerce Tracking</SelectItem>
                    <SelectItem value="lead-generation">Lead Generation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">Primary Data Source</Label>
                <Select onValueChange={(value) => handleInputChange('dataSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select primary data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-analytics">Google Analytics</SelectItem>
                    <SelectItem value="adobe-analytics">Adobe Analytics</SelectItem>
                    <SelectItem value="mixpanel">Mixpanel</SelectItem>
                    <SelectItem value="facebook-analytics">Facebook Analytics</SelectItem>
                    <SelectItem value="custom-tracking">Custom Tracking</SelectItem>
                    <SelectItem value="crm-data">CRM Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-challenges">Current Challenges</Label>
                <Textarea
                  id="current-challenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleInputChange('currentChallenges', e.target.value)}
                  placeholder="What conversion tracking challenges are you currently facing?"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createTrackingMutation.isPending}>
              {createTrackingMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Conversion Strategy...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Conversion Tracking Plan
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