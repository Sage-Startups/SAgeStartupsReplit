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
import { Search, TrendingUp, Target, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface SEOAnalyticsProps {
  sessionId: number;
  botName: string;
}

export function SEOAnalytics({ sessionId, botName }: SEOAnalyticsProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    targetKeywords: '',
    competitors: '',
    analysisType: '',
    timeframe: '',
    reportingGoals: '',
    currentSEOTools: ''
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

  const createAnalysisMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error('No session available');
      }
      
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `SEO Analysis: ${formData.businessName}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create comprehensive SEO analytics analysis for ${formData.businessName} (${formData.website}).

**SEO Analysis Parameters:**
- Business Name: ${formData.businessName}
- Website: ${formData.website}
- Target Keywords: ${formData.targetKeywords}
- Competitors: ${formData.competitors}
- Analysis Type: ${formData.analysisType}
- Timeframe: ${formData.timeframe}
- Reporting Goals: ${formData.reportingGoals}
- Current SEO Tools: ${formData.currentSEOTools}

Please provide detailed SEO analytics with:

## 🔍 **Current SEO Performance Analysis**
- Organic search traffic assessment
- Keyword ranking analysis and opportunities
- Technical SEO health evaluation
- Page load speed and Core Web Vitals
- Mobile-friendliness and user experience
- Site architecture and crawlability assessment

## 📊 **Keyword & Content Analysis**
- Target keyword performance tracking
- Content gap analysis and opportunities
- Long-tail keyword identification
- Search intent mapping and optimization
- Content quality and relevance scoring
- Featured snippet and SERP feature analysis

## 🎯 **Competitive SEO Analysis**
- Competitor keyword overlap and gaps
- Backlink profile comparison
- Content strategy benchmarking
- Technical SEO competitive advantages
- Market share and visibility analysis
- Opportunity identification and prioritization

## 💡 **Technical SEO Audit**
- Site speed optimization recommendations
- Mobile optimization requirements
- Schema markup implementation
- Internal linking strategy optimization
- URL structure and canonicalization
- XML sitemap and robots.txt analysis

## 📈 **Performance Metrics & KPIs**
- Organic traffic growth tracking
- Click-through rate optimization
- Conversion rate from organic traffic
- Local SEO performance (if applicable)
- Brand visibility and awareness metrics
- ROI measurement and attribution

## 🚀 **SEO Strategy & Recommendations**
- Priority action items and quick wins
- Long-term SEO roadmap development
- Content calendar and keyword targeting
- Link building strategy and outreach
- Technical improvement implementation
- Performance monitoring and reporting setup

## 🔧 **Implementation Framework**
- SEO tool stack recommendations
- Tracking and analytics setup
- Monthly reporting templates
- Performance monitoring dashboard
- Team responsibilities and workflows
- Budget allocation and resource planning

Format with specific SEO metrics, actionable recommendations, and implementation timelines.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "SEO Analysis Complete!",
        description: "Your comprehensive SEO analytics report has been generated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to analyze SEO: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.website || !formData.targetKeywords) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createAnalysisMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="seo-analytics" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing SEO Performance</h3>
                <p className="text-gray-600 mb-4">Conducting comprehensive SEO audit and competitive analysis...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <Search className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">SEO Analytics</h2>
            <p className="text-gray-600">Comprehensive SEO performance analysis and optimization</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Search className="w-4 h-4" />
            <span>Technical Audit</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Ranking Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Competitor Research</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SEO Analytics Setup</CardTitle>
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
                <Label htmlFor="target-keywords">Target Keywords *</Label>
                <Textarea
                  id="target-keywords"
                  value={formData.targetKeywords}
                  onChange={(e) => handleInputChange('targetKeywords', e.target.value)}
                  placeholder="List your main target keywords (e.g., digital marketing, SEO services, content strategy)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="competitors">Main Competitors</Label>
                <Textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => handleInputChange('competitors', e.target.value)}
                  placeholder="List competitor websites for comparison"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="analysis-type">Analysis Type</Label>
                <Select onValueChange={(value) => handleInputChange('analysisType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select analysis focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comprehensive">Comprehensive SEO Audit</SelectItem>
                    <SelectItem value="technical">Technical SEO Focus</SelectItem>
                    <SelectItem value="content">Content & Keywords Focus</SelectItem>
                    <SelectItem value="competitive">Competitive Analysis</SelectItem>
                    <SelectItem value="local-seo">Local SEO Analysis</SelectItem>
                    <SelectItem value="performance">Performance Optimization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timeframe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current State Analysis</SelectItem>
                    <SelectItem value="last-3-months">Last 3 Months</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-year">Last 12 Months</SelectItem>
                    <SelectItem value="historical">Historical Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reporting-goals">Reporting Goals</Label>
                <Textarea
                  id="reporting-goals"
                  value={formData.reportingGoals}
                  onChange={(e) => handleInputChange('reportingGoals', e.target.value)}
                  placeholder="What specific SEO goals or challenges are you trying to address?"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-seo-tools">Current SEO Tools</Label>
                <Input
                  id="current-seo-tools"
                  value={formData.currentSEOTools}
                  onChange={(e) => handleInputChange('currentSEOTools', e.target.value)}
                  placeholder="Google Analytics, SEMrush, Ahrefs, etc."
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createAnalysisMutation.isPending}>
              {createAnalysisMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Analyzing SEO Performance...
                </span>
              ) : (
                <span className="flex items-center">
                  Create SEO Analytics Report
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