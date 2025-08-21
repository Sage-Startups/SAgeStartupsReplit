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
import { FileText, Users, BarChart3, ArrowRight } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CustomerReportBuilderProps {
  sessionId: number;
  botName: string;
}

export function CustomerReportBuilder({ sessionId, botName }: CustomerReportBuilderProps) {
  const [phase, setPhase] = useState<'input' | 'processing' | 'complete'>('input');
  const [formData, setFormData] = useState({
    businessName: '',
    reportType: '',
    audience: '',
    timeframe: '',
    keyMetrics: '',
    reportFrequency: '',
    deliveryFormat: '',
    customerSegments: ''
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

  const createReportMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) {
        throw new Error('No session available');
      }
      
      setPhase('processing');
      
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Customer Report: ${formData.reportType}`
      });

      for (let i = 0; i <= 100; i += 10) {
        setProcessingProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const prompt = `Create a comprehensive customer report for ${formData.businessName}.

**Report Specifications:**
- Business Name: ${formData.businessName}
- Report Type: ${formData.reportType}
- Target Audience: ${formData.audience}
- Analysis Timeframe: ${formData.timeframe}
- Key Metrics: ${formData.keyMetrics}
- Report Frequency: ${formData.reportFrequency}
- Delivery Format: ${formData.deliveryFormat}
- Customer Segments: ${formData.customerSegments}

Please provide detailed customer analysis report with:

## 📋 **Executive Summary**
- Key findings and insights overview
- Critical performance indicators
- Major trends and patterns
- Strategic recommendations summary
- Action items and priorities
- Report highlights and concerns

## 👥 **Customer Demographics & Segmentation**
- Customer profile analysis
- Demographic breakdown and trends
- Geographic distribution patterns
- Behavioral segmentation insights
- Lifecycle stage analysis
- Value-based customer tiers

## 📊 **Performance Metrics Analysis**
- Customer acquisition metrics
- Retention and churn analysis
- Customer lifetime value (CLV)
- Average order value trends
- Purchase frequency patterns
- Satisfaction and loyalty scores

## 💡 **Customer Journey Insights**
- Touchpoint analysis and mapping
- Conversion funnel performance
- Drop-off points identification
- Channel effectiveness evaluation
- Experience quality assessment
- Pain point identification

## 🎯 **Behavioral Analysis**
- Purchase behavior patterns
- Product/service preferences
- Seasonal usage trends
- Communication preferences
- Engagement levels and patterns
- Cross-sell and upsell opportunities

## 📈 **Trends & Forecasting**
- Customer growth projections
- Market share analysis
- Competitive benchmarking
- Future opportunity identification
- Risk assessment and mitigation
- Strategic positioning recommendations

## 🚀 **Action Plan & Recommendations**
- Priority improvement areas
- Customer experience enhancements
- Retention strategy improvements
- Acquisition optimization tactics
- Revenue growth opportunities
- Implementation timeline and resources

Format with specific metrics, visual data representations, and actionable business recommendations.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: () => {
      setPhase('complete');
      toast({
        title: "Report Generated!",
        description: "Your customer report has been created with actionable insights.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
    },
    onError: (error) => {
      setPhase('input');
      toast({
        title: "Error",
        description: `Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.reportType || !formData.keyMetrics) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    createReportMutation.mutate();
  };

  if (phase === 'complete') {
    return <BotChatInterface sessionId={sessionId} botType="customer-report-builder" />;
  }

  if (phase === 'processing') {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Building Customer Report</h3>
                <p className="text-gray-600 mb-4">Analyzing customer data and generating comprehensive insights...</p>
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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Report Builder</h2>
            <p className="text-gray-600">Generate comprehensive customer analysis and insights reports</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Customer Analysis</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Professional Reports</span>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
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
                <Label htmlFor="report-type">Report Type *</Label>
                <Select onValueChange={(value) => handleInputChange('reportType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer-overview">Customer Overview</SelectItem>
                    <SelectItem value="retention-analysis">Retention Analysis</SelectItem>
                    <SelectItem value="acquisition-report">Acquisition Report</SelectItem>
                    <SelectItem value="satisfaction-analysis">Satisfaction Analysis</SelectItem>
                    <SelectItem value="behavior-insights">Behavior Insights</SelectItem>
                    <SelectItem value="comprehensive-analysis">Comprehensive Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Report Audience</Label>
                <Select onValueChange={(value) => handleInputChange('audience', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who will read this report?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executives">Executive Team</SelectItem>
                    <SelectItem value="marketing-team">Marketing Team</SelectItem>
                    <SelectItem value="sales-team">Sales Team</SelectItem>
                    <SelectItem value="customer-service">Customer Service</SelectItem>
                    <SelectItem value="stakeholders">External Stakeholders</SelectItem>
                    <SelectItem value="board-members">Board Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Analysis Timeframe</Label>
                <Select onValueChange={(value) => handleInputChange('timeframe', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="last-quarter">Last Quarter</SelectItem>
                    <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                    <SelectItem value="last-year">Last Year</SelectItem>
                    <SelectItem value="year-to-date">Year to Date</SelectItem>
                    <SelectItem value="custom-period">Custom Period</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Include *</Label>
                <Textarea
                  id="key-metrics"
                  value={formData.keyMetrics}
                  onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                  placeholder="List the most important metrics for this report (e.g., customer satisfaction, retention rate, CLV)"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-segments">Customer Segments</Label>
                <Textarea
                  id="customer-segments"
                  value={formData.customerSegments}
                  onChange={(e) => handleInputChange('customerSegments', e.target.value)}
                  placeholder="Describe customer segments to analyze (e.g., new customers, loyal customers, high-value segments)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-frequency">Report Frequency</Label>
                <Select onValueChange={(value) => handleInputChange('reportFrequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="How often will this be generated?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annually">Annually</SelectItem>
                    <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-format">Delivery Format</Label>
                <Select onValueChange={(value) => handleInputChange('deliveryFormat', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="dashboard">Interactive Dashboard</SelectItem>
                    <SelectItem value="email">Email Summary</SelectItem>
                    <SelectItem value="powerpoint">PowerPoint Presentation</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="web-portal">Web Portal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={createReportMutation.isPending}>
              {createReportMutation.isPending ? (
                <span className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Building Report...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Customer Report
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