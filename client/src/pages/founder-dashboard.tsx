import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
import type { FounderMetrics } from "@shared/schema";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Target,
  Zap,
  MessageSquare,
  FileText,
  Edit3,
  Save,
  X,
  Plus,
  CheckCircle,
  Circle,
  RotateCcw
} from "lucide-react";



interface EditableCardProps {
  title: string;
  value: string | number;
  type: 'text' | 'number' | 'currency' | 'percentage';
  onSave: (value: string | number) => void;
  icon: React.ReactNode;
  description?: string;
}

function EditableCard({ title, value, type, onSave, icon, description }: EditableCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());

  const handleSave = () => {
    const newValue = type === 'number' || type === 'currency' || type === 'percentage' 
      ? parseFloat(editValue) || 0 
      : editValue;
    onSave(newValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value.toString());
    setIsEditing(false);
  };

  const formatValue = (val: string | number) => {
    if (type === 'currency') return `$${Number(val).toLocaleString()}`;
    if (type === 'percentage') return `${val}%`;
    return val.toString();
  };

  return (
    <Card className="relative group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {icon}
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              type={type === 'text' ? 'text' : 'number'}
              className="text-2xl font-bold"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel}>
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatValue(value)}</div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function FounderDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [newGoal, setNewGoal] = useState("");

  // Fetch founder metrics
  const { data: metrics, isLoading } = useQuery<FounderMetrics>({
    queryKey: ["/api/founder/metrics"],
    enabled: !!user
  });

  // Update metrics mutation
  const updateMetricsMutation = useMutation({
    mutationFn: async (data: Partial<FounderMetrics>) => {
      console.log("Updating metrics with data:", data);
      const response = await apiRequest("PUT", "/api/founder/metrics", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to update metrics');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder/metrics"] });
      toast({
        title: "Metrics Updated",
        description: "Your business metrics have been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error("Error updating metrics:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update metrics. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Add goal mutation
  const addGoalMutation = useMutation({
    mutationFn: async (goal: string) => {
      const currentGoals = metrics?.goals || [];
      const newGoal = {
        id: Date.now().toString(),
        text: goal,
        completed: false,
        completedAt: null,
        createdAt: new Date().toISOString()
      };
      const updatedGoals = [...currentGoals, newGoal];
      const response = await apiRequest("PUT", "/api/founder/metrics", { goals: updatedGoals });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder/metrics"] });
      setNewGoal("");
      toast({
        title: "Goal Added",
        description: "New goal has been added to your list.",
      });
    }
  });

  // Toggle goal completion mutation
  const toggleGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const currentGoals = metrics?.goals || [];
      const updatedGoals = currentGoals.map((goal: any) =>
        goal.id === goalId
          ? {
              ...goal,
              completed: !goal.completed,
              completedAt: !goal.completed ? new Date().toISOString() : null
            }
          : goal
      );
      const response = await apiRequest("PUT", "/api/founder/metrics", { goals: updatedGoals });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder/metrics"] });
    }
  });

  // Remove goal mutation
  const removeGoalMutation = useMutation({
    mutationFn: async (goalId: string) => {
      const currentGoals = metrics?.goals || [];
      const updatedGoals = currentGoals.filter((goal: any) => goal.id !== goalId);
      const response = await apiRequest("PUT", "/api/founder/metrics", { goals: updatedGoals });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder/metrics"] });
    }
  });

  // Reset metrics mutation
  const resetMetrics = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/founder/metrics/reset");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/founder/metrics"] });
      toast({ 
        title: "Metrics Reset", 
        description: "All metrics have been reset to default values" 
      });
    },
    onError: () => {
      toast({ 
        title: "Failed to reset metrics", 
        variant: "destructive" 
      });
    }
  });

  const handleMetricUpdate = (field: keyof FounderMetrics, value: string | number) => {
    updateMetricsMutation.mutate({ [field]: value });
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      addGoalMutation.mutate(newGoal.trim());
    }
  };

  if (authLoading || isLoading) {
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

  const defaultMetrics: FounderMetrics = {
    id: 0,
    userId: (user as any)?.id || '',
    companyName: "Your Startup",
    revenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    churnRate: 0,
    burnRate: 0,
    runway: 0,
    goals: [],
    lastUpdated: new Date(),
    createdAt: new Date()
  };

  const currentMetrics = metrics || defaultMetrics;

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {(user as any)?.firstName || (user as any)?.name || 'Founder'}! 👋
            </h1>
            <p className="text-gray-600 mt-2">
              Here's how your business is performing today.
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Metrics
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset All Metrics?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all your business metrics (revenue, growth, users, etc.) to default values and clear all goals. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => resetMetrics.mutate()}
                  className="bg-red-600 hover:bg-red-700"
                  disabled={resetMetrics.isPending}
                >
                  {resetMetrics.isPending ? "Resetting..." : "Reset All Data"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <EditableCard
            title="Monthly Revenue"
            value={currentMetrics.revenue}
            type="currency"
            onSave={(value) => handleMetricUpdate('revenue', value)}
            icon={<DollarSign className="h-4 w-4 text-green-600" />}
            description="Total monthly recurring revenue"
          />
          
          <EditableCard
            title="Monthly Growth"
            value={currentMetrics.monthlyGrowth}
            type="percentage"
            onSave={(value) => handleMetricUpdate('monthlyGrowth', value)}
            icon={currentMetrics.monthlyGrowth >= 0 ? 
              <TrendingUp className="h-4 w-4 text-green-600" /> : 
              <TrendingDown className="h-4 w-4 text-red-600" />
            }
            description="Month-over-month growth rate"
          />
          
          <EditableCard
            title="Active Users"
            value={currentMetrics.activeUsers}
            type="number"
            onSave={(value) => handleMetricUpdate('activeUsers', value)}
            icon={<Users className="h-4 w-4 text-blue-600" />}
            description="Monthly active users"
          />
          
          <EditableCard
            title="Churn Rate"
            value={currentMetrics.churnRate}
            type="percentage"
            onSave={(value) => handleMetricUpdate('churnRate', value)}
            icon={<BarChart3 className="h-4 w-4 text-orange-600" />}
            description="Monthly customer churn"
          />
        </div>

        {/* Financial Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-red-600" />
                Financial Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <EditableCard
                title="Monthly Burn Rate"
                value={currentMetrics.burnRate}
                type="currency"
                onSave={(value) => handleMetricUpdate('burnRate', value)}
                icon={<TrendingDown className="h-4 w-4 text-red-600" />}
                description="Monthly cash burn"
              />
              <EditableCard
                title="Runway (Months)"
                value={currentMetrics.runway}
                type="number"
                onSave={(value) => handleMetricUpdate('runway', value)}
                icon={<Calendar className="h-4 w-4 text-purple-600" />}
                description="Months until cash runs out"
              />
            </CardContent>
          </Card>

          {/* Goals & Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-green-600" />
                Goals & Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                {(currentMetrics.goals || []).map((goal: any, index: number) => (
                  <div key={goal.id || goal.text || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGoalMutation.mutate(goal.id || goal.text)}
                        className="h-6 w-6 p-0"
                      >
                        {goal.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <span className={`text-sm ${goal.completed ? 'line-through text-gray-500' : ''}`}>
                          {goal.text || goal}
                        </span>
                        {goal.completed && goal.completedAt && (
                          <div className="text-xs text-green-600 mt-1">
                            Completed {new Date(goal.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoalMutation.mutate(goal.id || goal.text)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                />
                <Button onClick={addGoal} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Access your most used tools and features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setLocation('/ai-suite')}
              >
                <Zap className="h-6 w-6 text-blue-600" />
                <span>AI Suite</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setLocation('/business-suite')}
              >
                <BarChart3 className="h-6 w-6 text-green-600" />
                <span>Business Suite</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-20 flex flex-col items-center justify-center space-y-2"
                onClick={() => setLocation('/account')}
              >
                <Users className="h-6 w-6 text-purple-600" />
                <span>Account Settings</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}