import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Monitor } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface PerformanceDashboardProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function PerformanceDashboard({ sessionId: propSessionId, onSendMessage, isLoading }: PerformanceDashboardProps) {
  const [formData, setFormData] = useState({
    businessType: "",
    dashboardGoal: "",
    keyMetrics: "",
    updateFrequency: "",
    currentTools: "",
    specificFocus: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create a comprehensive performance dashboard strategy with these requirements:

Business Type: ${formData.businessType}
Dashboard Goal: ${formData.dashboardGoal}
Key Metrics to Track: ${formData.keyMetrics}
Update Frequency: ${formData.updateFrequency}
Current Tools: ${formData.currentTools}
Specific Focus Area: ${formData.specificFocus}

Please provide:
1. Recommended KPIs and metrics structure
2. Dashboard layout and organization suggestions
3. Real-time monitoring setup recommendations
4. Data visualization best practices
5. Actionable insights framework
6. Performance benchmarks and targets

Focus on creating a practical, actionable dashboard strategy that provides clear business insights.`;

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
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard Designer</h2>
            <p className="text-gray-600">Create comprehensive KPI tracking and monitoring dashboards</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Monitor className="w-4 h-4" />
            <span>Real-time Monitoring</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>KPI Tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Performance Metrics</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="performance-dashboard" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dashboard Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="business-type">Business Type</Label>
                  <Input
                    id="business-type"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange('businessType', e.target.value)}
                    placeholder="e.g., E-commerce, SaaS, Agency"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dashboard-goal">Dashboard Goal</Label>
                  <Select value={formData.dashboardGoal} onValueChange={(value) => handleInputChange('dashboardGoal', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive Overview</SelectItem>
                      <SelectItem value="operational">Operational Monitoring</SelectItem>
                      <SelectItem value="marketing">Marketing Performance</SelectItem>
                      <SelectItem value="sales">Sales Analytics</SelectItem>
                      <SelectItem value="financial">Financial Tracking</SelectItem>
                      <SelectItem value="customer">Customer Insights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-metrics">Key Metrics to Track</Label>
                  <Textarea
                    id="key-metrics"
                    value={formData.keyMetrics}
                    onChange={(e) => handleInputChange('keyMetrics', e.target.value)}
                    placeholder="List the most important metrics you want to monitor..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="update-frequency">Update Frequency</Label>
                  <Select value={formData.updateFrequency} onValueChange={(value) => handleInputChange('updateFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="How often to update?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="real-time">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-tools">Current Analytics Tools</Label>
                  <Input
                    id="current-tools"
                    value={formData.currentTools}
                    onChange={(e) => handleInputChange('currentTools', e.target.value)}
                    placeholder="e.g., Google Analytics, Mixpanel, Custom DB"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specific-focus">Specific Focus Area</Label>
                  <Input
                    id="specific-focus"
                    value={formData.specificFocus}
                    onChange={(e) => handleInputChange('specificFocus', e.target.value)}
                    placeholder="Any particular area to emphasize?"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Dashboard Strategy..." : "Generate Performance Dashboard"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}