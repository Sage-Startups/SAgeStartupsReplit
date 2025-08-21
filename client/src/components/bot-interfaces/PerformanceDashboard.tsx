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
import { BarChart3, TrendingUp, Target, Zap, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface PerformanceDashboardProps {
  sessionId: number;
  botName: string;
}

export function PerformanceDashboard({ sessionId, botName }: PerformanceDashboardProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    industry: '',
    dashboardType: '',
    keyMetrics: '',
    dataSource: '',
    updateFrequency: '',
    audience: '',
    goals: ''
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

  const createDashboardMutation = useMutation({
    mutationFn: async () => {
      setPhase('processing');
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Performance Dashboard: ${formData.businessName}`
      });

      // Simulate processing progress
      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create a comprehensive performance dashboard strategy for ${formData.businessName} in the ${formData.industry} industry.

**Dashboard Requirements:**
- Business Name: ${formData.businessName}
- Industry: ${formData.industry}
- Dashboard Type: ${formData.dashboardType}
- Key Metrics: ${formData.keyMetrics}
- Data Source: ${formData.dataSource}
- Update Frequency: ${formData.updateFrequency}
- Target Audience: ${formData.audience}
- Business Goals: ${formData.goals}

Please provide a detailed dashboard design with:

## 📊 **Dashboard Architecture**
- Layout and component organization
- Visual hierarchy and information flow
- Key metrics placement and prioritization
- Navigation structure and user experience
- Mobile responsiveness considerations

## 📈 **Metrics & KPIs Framework**
- Primary performance indicators
- Secondary supporting metrics
- Real-time vs historical data display
- Benchmarking and target comparisons
- Alert thresholds and notifications

## 🎨 **Visual Design System**
- Color coding for different metric categories
- Chart types and visualization recommendations
- Interactive elements and drill-down capabilities
- Consistent styling and branding guidelines
- Accessibility and usability features

## 🔧 **Technical Specifications**
- Data integration requirements
- Update mechanisms and refresh schedules
- Performance optimization strategies
- Security and access control measures
- Backup and data recovery protocols

## 📱 **User Experience Design**
- Customization and personalization options
- Filter and search functionality
- Export and sharing capabilities
- Training and onboarding recommendations
- Feedback collection and iteration plans

## 🚀 **Implementation Roadmap**
- Phase 1: Core metrics and basic layout
- Phase 2: Advanced features and integrations
- Phase 3: Optimization and scaling
- Timeline estimates and resource requirements
- Success metrics and evaluation criteria

Format as a comprehensive dashboard specification with actionable implementation steps.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Dashboard Created!",
        description: "Your performance dashboard strategy has been generated.",
      });
      // Invalidate messages to refresh the chat
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to create dashboard: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.dashboardType || !formData.keyMetrics) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createDashboardMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="performance-dashboard" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
                <BarChart3 className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Creating Your Dashboard</h3>
                <p className="text-gray-600 mb-4">Analyzing your requirements and designing the perfect performance dashboard...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard Designer</h2>
            <p className="text-gray-600">Create custom analytics dashboards for real-time insights</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>KPI Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Performance Analytics</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Real-time Updates</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dashboard Configuration</CardTitle>
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
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  placeholder="e.g., E-commerce, SaaS, Healthcare"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dashboard-type">Dashboard Type *</Label>
                <Select onValueChange={(value) => handleInputChange('dashboardType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dashboard type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executive">Executive Dashboard</SelectItem>
                    <SelectItem value="operations">Operations Dashboard</SelectItem>
                    <SelectItem value="marketing">Marketing Dashboard</SelectItem>
                    <SelectItem value="sales">Sales Dashboard</SelectItem>
                    <SelectItem value="financial">Financial Dashboard</SelectItem>
                    <SelectItem value="customer">Customer Analytics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-source">Primary Data Source</Label>
                <Select onValueChange={(value) => handleInputChange('dataSource', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="google-analytics">Google Analytics</SelectItem>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="database">Internal Database</SelectItem>
                    <SelectItem value="spreadsheet">Excel/Spreadsheet</SelectItem>
                    <SelectItem value="multiple">Multiple Sources</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Track *</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="List the most important metrics you want to track (e.g., revenue, conversion rate, customer satisfaction)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select onValueChange={(value) => handleInputChange('audience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who will use this dashboard?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executives">C-Suite Executives</SelectItem>
                    <SelectItem value="managers">Department Managers</SelectItem>
                    <SelectItem value="analysts">Data Analysts</SelectItem>
                    <SelectItem value="team-leads">Team Leads</SelectItem>
                    <SelectItem value="stakeholders">External Stakeholders</SelectItem>
                    <SelectItem value="mixed">Mixed Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="update-frequency">Update Frequency</Label>
                <Select onValueChange={(value) => handleInputChange('updateFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often should data update?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="real-time">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="on-demand">On-demand</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">Business Goals</Label>
                <Textarea
                  id="goals"
                  value={formData.goals}
                  onChange={(e) => handleInputChange('goals', e.target.value)}
                  placeholder="What are your main business objectives? (e.g., increase revenue, improve efficiency, reduce costs)"
                  rows={2}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createDashboardMutation.isPending}>
              {createDashboardMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Creating Dashboard...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Performance Dashboard
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