import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
import { 
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  FileText,
  Calendar,
  Mail,
  Phone,
  MessageSquare,
  Briefcase,
  PieChart,
  LineChart,
  Calculator,
  Building,
  Globe,
  Zap,
  ArrowRight
} from "lucide-react";

interface BusinessTool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  features: string[];
  comingSoon?: boolean;
}

const businessTools: BusinessTool[] = [
  // Financial Management
  {
    id: 'financial-dashboard',
    name: 'Financial Dashboard',
    description: 'Track revenue, expenses, and cash flow',
    category: 'financial',
    icon: <DollarSign className="w-6 h-6" />,
    features: ['Revenue tracking', 'Expense management', 'Cash flow analysis', 'Financial reports']
  },
  {
    id: 'budget-planner',
    name: 'Budget Planner',
    description: 'Plan and manage your startup budget',
    category: 'financial',
    icon: <Calculator className="w-6 h-6" />,
    features: ['Budget creation', 'Expense categories', 'Variance analysis', 'Forecasting']
  },
  {
    id: 'investor-reports',
    name: 'Investor Reports',
    description: 'Generate investor-ready financial reports',
    category: 'financial',
    icon: <FileText className="w-6 h-6" />,
    features: ['Monthly reports', 'KPI dashboards', 'Growth metrics', 'Slide templates']
  },

  // Customer Management
  {
    id: 'customer-dashboard',
    name: 'Customer Dashboard',
    description: 'Manage customer relationships and data',
    category: 'customer',
    icon: <Users className="w-6 h-6" />,
    features: ['Customer profiles', 'Interaction history', 'Segmentation', 'Analytics']
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline',
    description: 'Track deals and sales opportunities',
    category: 'customer',
    icon: <Target className="w-6 h-6" />,
    features: ['Deal tracking', 'Pipeline stages', 'Conversion rates', 'Sales forecasting']
  },
  {
    id: 'support-tickets',
    name: 'Support Tickets',
    description: 'Manage customer support requests',
    category: 'customer',
    icon: <MessageSquare className="w-6 h-6" />,
    features: ['Ticket management', 'Priority levels', 'Response tracking', 'Customer satisfaction']
  },

  // Operations
  {
    id: 'task-management',
    name: 'Task Management',
    description: 'Organize and track team tasks',
    category: 'operations',
    icon: <Briefcase className="w-6 h-6" />,
    features: ['Task creation', 'Team assignments', 'Progress tracking', 'Deadlines']
  },
  {
    id: 'team-calendar',
    name: 'Team Calendar',
    description: 'Schedule meetings and events',
    category: 'operations',
    icon: <Calendar className="w-6 h-6" />,
    features: ['Event scheduling', 'Team availability', 'Meeting rooms', 'Reminders']
  },
  {
    id: 'document-library',
    name: 'Document Library',
    description: 'Store and organize important documents',
    category: 'operations',
    icon: <FileText className="w-6 h-6" />,
    features: ['File storage', 'Version control', 'Access permissions', 'Search']
  },

  // Analytics
  {
    id: 'business-analytics',
    name: 'Business Analytics',
    description: 'Comprehensive business intelligence',
    category: 'analytics',
    icon: <BarChart3 className="w-6 h-6" />,
    features: ['Custom dashboards', 'Data visualization', 'Trend analysis', 'Export reports']
  },
  {
    id: 'growth-metrics',
    name: 'Growth Metrics',
    description: 'Track key growth indicators',
    category: 'analytics',
    icon: <TrendingUp className="w-6 h-6" />,
    features: ['User acquisition', 'Retention rates', 'Cohort analysis', 'Growth projections']
  },
  {
    id: 'market-research',
    name: 'Market Research',
    description: 'Analyze market trends and competition',
    category: 'analytics',
    icon: <Globe className="w-6 h-6" />,
    features: ['Competitor analysis', 'Market sizing', 'Trend tracking', 'Industry reports']
  }
];

const categories = [
  {
    id: 'financial',
    name: 'Financial Management',
    description: 'Track revenue, expenses, and financial health',
    icon: <DollarSign className="w-5 h-5" />,
    color: 'bg-green-100 text-green-800'
  },
  {
    id: 'customer',
    name: 'Customer Management',
    description: 'Manage relationships and sales pipeline',
    icon: <Users className="w-5 h-5" />,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'operations',
    name: 'Operations',
    description: 'Streamline team workflows and processes',
    icon: <Briefcase className="w-5 h-5" />,
    color: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'Business intelligence and insights',
    icon: <BarChart3 className="w-5 h-5" />,
    color: 'bg-orange-100 text-orange-800'
  }
];

export default function BusinessSuite() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    window.location.href = "/api/login";
    return null;
  }

  const filteredTools = selectedCategory 
    ? businessTools.filter(tool => tool.category === selectedCategory)
    : businessTools;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Building className="w-8 h-8 mr-3 text-blue-600" />
            Business Suite
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive tools to manage and grow your startup
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tools</CardTitle>
              <Zap className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{businessTools.length}</div>
              <p className="text-xs text-muted-foreground">
                Available business tools
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <Building className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">
                Business categories
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Integration</CardTitle>
              <Globe className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">100%</div>
              <p className="text-xs text-muted-foreground">
                Platform integration
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5+</div>
              <p className="text-xs text-muted-foreground">
                New tools in development
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              onClick={() => setSelectedCategory(null)}
              className="mb-2"
            >
              All Tools
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="mb-2"
              >
                {category.icon}
                <span className="ml-2">{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryTools = businessTools.filter(tool => tool.category === category.id);
            
            if (selectedCategory && selectedCategory !== category.id) return null;
            
            return (
              <div key={category.id}>
                <div className="flex items-center mb-4">
                  <div className={`w-10 h-10 rounded-lg ${category.color.replace('text-', 'bg-').replace('-800', '-100')} flex items-center justify-center mr-3`}>
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryTools.map((tool) => (
                    <Card key={tool.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              {tool.icon}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{tool.name}</CardTitle>
                            </div>
                          </div>
                          {tool.comingSoon && (
                            <Badge variant="secondary">Coming Soon</Badge>
                          )}
                        </div>
                        <CardDescription>{tool.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-1">
                            {tool.features.slice(0, 3).map((feature, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {tool.features.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{tool.features.length - 3} more
                              </Badge>
                            )}
                          </div>
                          <Button 
                            className="w-full" 
                            variant={tool.comingSoon ? "outline" : "default"}
                            disabled={tool.comingSoon}
                            onClick={() => {
                              if (tool.id === 'financial-dashboard') {
                                setLocation('/financial-dashboard');
                              } else if (tool.id === 'task-management') {
                                setLocation('/task-manager');
                              } else if (!tool.comingSoon) {
                                toast({
                                  title: "Coming Soon",
                                  description: `${tool.name} functionality will be available soon!`,
                                });
                              }
                            }}
                          >
                            {tool.comingSoon ? "Coming Soon" : "Open Tool"}
                            {!tool.comingSoon && <ArrowRight className="w-4 h-4 ml-2" />}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}