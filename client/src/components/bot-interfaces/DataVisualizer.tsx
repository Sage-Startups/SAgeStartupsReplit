import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, PieChart, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataVisualizerProps {
  sessionId: number | null;
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const formSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  dataType: z.string().min(1, "Data type is required"),
  visualizationType: z.string().min(1, "Visualization type is required"),
  keyMetrics: z.string().min(1, "Key metrics are required"),
  audience: z.string().min(1, "Audience is required"),
  interactivityLevel: z.string().min(1, "Interactivity level is required"),
});

type FormData = z.infer<typeof formSchema>;

export function DataVisualizer({ sessionId: propSessionId, onSendMessage, isLoading }: DataVisualizerProps) {
  const { toast } = useToast();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: "",
      dataType: "",
      visualizationType: "",
      keyMetrics: "",
      audience: "",
      interactivityLevel: "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    try {
      const prompt = `Create comprehensive data visualization recommendations for the ${data.projectName} project.

**Visualization Requirements:**
- Project Name: ${data.projectName}
- Data Type: ${data.dataType}
- Visualization Type: ${data.visualizationType}
- Key Metrics: ${data.keyMetrics}
- Target Audience: ${data.audience}
- Interactivity Level: ${data.interactivityLevel}

Please provide detailed visualization strategy:

## 📊 **Visualization Design Framework**
- Chart type recommendations
- Visual hierarchy principles
- Color scheme suggestions
- Layout and composition
- Typography and labeling

## 🎯 **Data Storytelling Strategy**
- Narrative structure
- Key insights to highlight
- Data flow and progression
- Context and background information
- Call-to-action elements

## 📈 **Interactive Elements**
- User interaction design
- Drill-down capabilities
- Filtering and sorting options
- Dynamic updates and real-time data
- Mobile responsiveness

## 🎨 **Visual Design Specifications**
- Color palette recommendations
- Chart styling guidelines
- Icon and symbol usage
- Spacing and alignment
- Accessibility considerations

## 🔧 **Technical Implementation**
- Recommended visualization tools
- Data preparation requirements
- Performance optimization
- Browser compatibility
- Export and sharing options

## 📱 **Dashboard Layout**
- Component organization
- Information hierarchy
- Navigation structure
- Responsive design principles
- User experience flow

## 🚀 **Best Practices & Optimization**
- Data accuracy verification
- Performance monitoring
- User testing recommendations
- Maintenance and updates
- Analytics and tracking

Format with specific design recommendations, technical specifications, and implementation guidelines.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Data Visualization Started",
          description: "Creating charts, graphs and interactive dashboards...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Data visualization error:", error);
      toast({
        title: "Error",
        description: `Failed to generate data visualization: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Visualizer</h2>
            <p className="text-gray-600">Create compelling charts, graphs and interactive dashboards</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Data Visualization</span>
          </div>
          <div className="flex items-center space-x-2">
            <PieChart className="w-4 h-4" />
            <span>Chart Creation</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4" />
            <span>Interactive Dashboards</span>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Visualization Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project/Dashboard Name</Label>
                <Input
                  id="project-name"
                  {...form.register("projectName")}
                  placeholder="Enter your project name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-type">Data Type</Label>
                <Select onValueChange={(value) => form.setValue("dataType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales-revenue">Sales & Revenue</SelectItem>
                    <SelectItem value="marketing-analytics">Marketing Analytics</SelectItem>
                    <SelectItem value="financial-data">Financial Data</SelectItem>
                    <SelectItem value="operational-metrics">Operational Metrics</SelectItem>
                    <SelectItem value="customer-data">Customer Data</SelectItem>
                    <SelectItem value="performance-kpis">Performance KPIs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="visualization-type">Primary Visualization Type</Label>
                <Select onValueChange={(value) => form.setValue("visualizationType", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select visualization type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dashboard">Executive Dashboard</SelectItem>
                    <SelectItem value="charts">Charts & Graphs</SelectItem>
                    <SelectItem value="infographic">Infographic</SelectItem>
                    <SelectItem value="report">Data Report</SelectItem>
                    <SelectItem value="real-time">Real-time Display</SelectItem>
                    <SelectItem value="interactive">Interactive Visualization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-metrics">Key Metrics to Visualize</Label>
                <Textarea
                  id="key-metrics"
                  {...form.register("keyMetrics")}
                  placeholder="List the most important metrics and data points to visualize..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select onValueChange={(value) => form.setValue("audience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Who will view this?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="executives">Executives/C-Suite</SelectItem>
                    <SelectItem value="managers">Department Managers</SelectItem>
                    <SelectItem value="analysts">Data Analysts</SelectItem>
                    <SelectItem value="stakeholders">External Stakeholders</SelectItem>
                    <SelectItem value="clients">Clients/Customers</SelectItem>
                    <SelectItem value="general">General Audience</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interactivity-level">Interactivity Level</Label>
                <Select onValueChange={(value) => form.setValue("interactivityLevel", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select interactivity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="static">Static (Print-ready)</SelectItem>
                    <SelectItem value="basic">Basic Interactivity</SelectItem>
                    <SelectItem value="moderate">Moderate Interactivity</SelectItem>
                    <SelectItem value="high">High Interactivity</SelectItem>
                    <SelectItem value="real-time">Real-time Updates</SelectItem>
                    <SelectItem value="collaborative">Collaborative Features</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Visualization..." : "Generate Data Visualization"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}