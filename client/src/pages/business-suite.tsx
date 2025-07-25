import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
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
  ArrowRight,
  ChevronDown,
  ChevronRight
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
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

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

        {/* Tools Grid with Collapsible Sections */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryTools = businessTools.filter(tool => tool.category === category.id);
            
            if (selectedCategory && selectedCategory !== category.id) return null;
            
            const isExpanded = expandedSections.includes(category.id);
            
            // Define themed colors for each category
            const getCategoryTheme = (categoryId: string) => {
              const themes = {
                'financial': { bg: 'bg-green-50', iconBg: 'bg-green-500', borderColor: 'border-green-200' },
                'customer': { bg: 'bg-blue-50', iconBg: 'bg-blue-500', borderColor: 'border-blue-200' },
                'operations': { bg: 'bg-purple-50', iconBg: 'bg-purple-500', borderColor: 'border-purple-200' },
                'analytics': { bg: 'bg-orange-50', iconBg: 'bg-orange-500', borderColor: 'border-orange-200' }
              };
              return themes[categoryId as keyof typeof themes] || themes.financial;
            };

            const theme = getCategoryTheme(category.id);
            
            return (
              <Card key={category.id} className={`${theme.borderColor} border-2`}>
                <Collapsible open={isExpanded} onOpenChange={() => toggleSection(category.id)}>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-14 h-14 rounded-2xl ${theme.iconBg} flex items-center justify-center shadow-sm`}>
                            {React.cloneElement(category.icon as React.ReactElement, { 
                              className: "w-7 h-7 text-white" 
                            })}
                          </div>
                          <div className="text-left flex-1">
                            <CardTitle className="flex items-center text-xl">
                              {category.name}
                              {isExpanded ? (
                                <ChevronDown className="w-5 h-5 ml-2 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-5 h-5 ml-2 text-gray-500" />
                              )}
                            </CardTitle>
                            <CardDescription className="text-base mt-1">
                              {category.description} • {categoryTools.length} tools available
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-sm">
                          {categoryTools.length} tools
                        </Badge>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryTools.map((tool, index) => {
                          // Get themed colors for each tool card
                          const getToolTheme = (index: number) => {
                            const themes = [
                              { bg: 'bg-blue-50', iconBg: 'bg-blue-500', circleBg: 'bg-blue-100' },
                              { bg: 'bg-green-50', iconBg: 'bg-green-500', circleBg: 'bg-green-100' },
                              { bg: 'bg-purple-50', iconBg: 'bg-purple-500', circleBg: 'bg-purple-100' },
                              { bg: 'bg-red-50', iconBg: 'bg-red-500', circleBg: 'bg-red-100' },
                              { bg: 'bg-orange-50', iconBg: 'bg-orange-500', circleBg: 'bg-orange-100' },
                              { bg: 'bg-pink-50', iconBg: 'bg-pink-500', circleBg: 'bg-pink-100' },
                              { bg: 'bg-indigo-50', iconBg: 'bg-indigo-500', circleBg: 'bg-indigo-100' },
                              { bg: 'bg-teal-50', iconBg: 'bg-teal-500', circleBg: 'bg-teal-100' },
                            ];
                            return themes[index % themes.length];
                          };

                          const toolTheme = getToolTheme(index);

                          return (
                            <div 
                              key={tool.id}
                              className={`relative p-6 rounded-2xl hover:shadow-lg transition-all duration-200 cursor-pointer ${toolTheme.bg} group border border-white/20`}
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
                              {/* Decorative circle background */}
                              <div className={`absolute top-0 right-0 w-24 h-24 ${toolTheme.circleBg} rounded-full opacity-40 -translate-y-6 translate-x-6`}></div>
                              <div className={`absolute top-8 right-8 w-16 h-16 ${toolTheme.circleBg} rounded-full opacity-30`}></div>
                              
                              {/* Coming Soon Badge */}
                              {tool.comingSoon && (
                                <div className="absolute top-4 right-4 z-10">
                                  <Badge variant="secondary">Coming Soon</Badge>
                                </div>
                              )}
                              
                              {/* Icon */}
                              <div className={`w-14 h-14 ${toolTheme.iconBg} rounded-2xl flex items-center justify-center mb-4 relative z-10`}>
                                {React.cloneElement(tool.icon as React.ReactElement, { 
                                  className: "w-7 h-7 text-white" 
                                })}
                              </div>
                              
                              {/* Content */}
                              <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-800">
                                  {tool.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                  {tool.description}
                                </p>
                                
                                {/* Key Features */}
                                <div className="mb-4">
                                  <h4 className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">Key Features:</h4>
                                  <div className="space-y-1">
                                    {tool.features?.slice(0, 3).map((feature: any, i: number) => (
                                      <div key={i} className="flex items-center text-xs text-gray-600">
                                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                                        {feature}
                                      </div>
                                    ))}
                                    {tool.features.length > 3 && (
                                      <div className="text-xs text-gray-500">
                                        +{tool.features.length - 3} more features
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Action Button */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center text-sm text-gray-500">
                                    <Briefcase className="w-4 h-4 mr-1" />
                                    <span>{tool.comingSoon ? "Coming Soon" : "Open Tool"}</span>
                                  </div>
                                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}