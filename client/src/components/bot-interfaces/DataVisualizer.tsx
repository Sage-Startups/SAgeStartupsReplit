import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, PieChart, LineChart } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface DataVisualizerProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export function DataVisualizer({ sessionId: propSessionId, onSendMessage, isLoading }: DataVisualizerProps) {
  const [formData, setFormData] = useState({
    dataType: "",
    visualizationType: "",
    dataSource: "",
    audience: "",
    keyInsights: "",
    interactivity: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const prompt = `Create comprehensive data visualization strategy:

Data Type: ${formData.dataType}
Visualization Type: ${formData.visualizationType}
Data Source: ${formData.dataSource}
Target Audience: ${formData.audience}
Key Insights to Highlight: ${formData.keyInsights}
Interactivity Level: ${formData.interactivity}

Please provide:
1. Chart and graph generation recommendations
2. Data visualization best practices
3. Chart creation guidelines and specifications
4. Interactive dashboard design
5. Visual hierarchy and design principles
6. Color schemes and styling recommendations
7. Implementation tools and technologies

Focus on creating clear, impactful visualizations that effectively communicate data insights.`;

    onSendMessage(prompt);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Visualizer</h2>
            <p className="text-gray-600">Create charts, graphs and interactive dashboards</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Chart Generation</span>
          </div>
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Data Visualization</span>
          </div>
          <div className="flex items-center space-x-2">
            <LineChart className="w-4 h-4" />
            <span>Interactive Dashboard</span>
          </div>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="data-visualizer" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Visualization Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="data-type">Data Type</Label>
                  <Select value={formData.dataType} onValueChange={(value) => handleInputChange('dataType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What type of data?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales/Revenue Data</SelectItem>
                      <SelectItem value="user-behavior">User Behavior</SelectItem>
                      <SelectItem value="marketing">Marketing Metrics</SelectItem>
                      <SelectItem value="financial">Financial Data</SelectItem>
                      <SelectItem value="operational">Operational Metrics</SelectItem>
                      <SelectItem value="survey">Survey/Feedback Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="visualization-type">Preferred Visualization</Label>
                  <Select value={formData.visualizationType} onValueChange={(value) => handleInputChange('visualizationType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select chart type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dashboard">Multi-chart Dashboard</SelectItem>
                      <SelectItem value="bar-charts">Bar/Column Charts</SelectItem>
                      <SelectItem value="line-charts">Line Charts</SelectItem>
                      <SelectItem value="pie-charts">Pie/Donut Charts</SelectItem>
                      <SelectItem value="heatmaps">Heatmaps</SelectItem>
                      <SelectItem value="mixed">Mixed Chart Types</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data-source">Data Source</Label>
                  <Input
                    id="data-source"
                    value={formData.dataSource}
                    onChange={(e) => handleInputChange('dataSource', e.target.value)}
                    placeholder="e.g., Excel, Google Analytics, Database"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Select value={formData.audience} onValueChange={(value) => handleInputChange('audience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Who will view this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executives">Executives</SelectItem>
                      <SelectItem value="managers">Department Managers</SelectItem>
                      <SelectItem value="analysts">Data Analysts</SelectItem>
                      <SelectItem value="team-members">Team Members</SelectItem>
                      <SelectItem value="clients">External Clients</SelectItem>
                      <SelectItem value="stakeholders">Stakeholders</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="key-insights">Key Insights to Highlight</Label>
                  <Textarea
                    id="key-insights"
                    value={formData.keyInsights}
                    onChange={(e) => handleInputChange('keyInsights', e.target.value)}
                    placeholder="What important patterns or insights should be emphasized?"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interactivity">Interactivity Level</Label>
                  <Select value={formData.interactivity} onValueChange={(value) => handleInputChange('interactivity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Level of interaction" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="static">Static Charts</SelectItem>
                      <SelectItem value="basic">Basic Interactivity</SelectItem>
                      <SelectItem value="advanced">Advanced Interactive</SelectItem>
                      <SelectItem value="real-time">Real-time Updates</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating Visualizations..." : "Generate Data Visualization Strategy"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}