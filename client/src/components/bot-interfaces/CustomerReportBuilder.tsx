import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, BarChart3, Users } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CustomerReportBuilderProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function CustomerReportBuilder({ sessionId: propSessionId, onSendMessage, isLoading }: CustomerReportBuilderProps) {
  const [formData, setFormData] = useState({
    reportType: "",
    audience: "",
    dataSource: "",
    reportFrequency: "",
    keyMetrics: "",
    deliveryFormat: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create a custom analytics report with these specifications:

Report Type: ${formData.reportType}
Target Audience: ${formData.audience}
Data Source: ${formData.dataSource}
Report Frequency: ${formData.reportFrequency}
Key Metrics: ${formData.keyMetrics}
Delivery Format: ${formData.deliveryFormat}

Please provide:
1. Tailored analytics report structure
2. Custom reporting framework
3. Data visualization recommendations
4. Automated reporting setup
5. KPI dashboard design
6. Executive summary format
7. Implementation guidelines for automation

Focus on creating professional, actionable reports that meet specific business needs.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Customer Report Builder</h2>
            <p className="text-gray-600">Create tailored analytics and custom reporting solutions</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4" />
            <span>Custom Reporting</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Data Visualization</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Automated Reports</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="customer-report-builder" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Report Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={formData.reportType} onValueChange={(value) => handleInputChange('reportType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive-summary">Executive Summary</SelectItem>
                      <SelectItem value="performance-dashboard">Performance Dashboard</SelectItem>
                      <SelectItem value="customer-analytics">Customer Analytics</SelectItem>
                      <SelectItem value="sales-report">Sales Report</SelectItem>
                      <SelectItem value="marketing-metrics">Marketing Metrics</SelectItem>
                      <SelectItem value="financial-analysis">Financial Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={formData.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Who will receive this report?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executives">Executives/C-Suite</SelectItem>
                      <SelectItem value="managers">Department Managers</SelectItem>
                      <SelectItem value="team-leads">Team Leads</SelectItem>
                      <SelectItem value="stakeholders">External Stakeholders</SelectItem>
                      <SelectItem value="board">Board of Directors</SelectItem>
                      <SelectItem value="clients">Clients/Customers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Input
                    id="data-source"
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                    placeholder="e.g., CRM, Google Analytics, Sales DB"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-frequency">Report Frequency</Label>
                  <Select value={formData.reportFrequency} onValueChange={(value) => handleInputChange('reportFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How often to generate?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="ad-hoc">Ad-hoc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-metrics">Key Metrics to Include</Label>
                  <Textarea
                    id="key-metrics"
                    value={formData.keyMetrics}
                    onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                    placeholder="List the most important metrics for this report..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="delivery-format">Delivery Format</Label>
                  <Select value={formData.deliveryFormat} onValueChange={(value) => handleInputChange('deliveryFormat', value)}>
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

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Building Report..." : "Create Custom Report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}