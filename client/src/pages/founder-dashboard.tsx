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

function EditableCard({ title, value, type, onSave, icon, description, gradient }: EditableCardProps & { gradient?: string }) {
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
    <div className={`bubble-card p-6 ${gradient || ''} relative overflow-hidden group`}>
      {gradient && (
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-6 translate-x-6"></div>
      )}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <CardTitle className="text-sm font-medium text-gray-700">{title}</CardTitle>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${gradient ? 'bg-white/30' : 'bg-purple-100'}`}>
          {icon}
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 absolute -top-1 -right-1 bg-white/80"
              onClick={() => setIsEditing(true)}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      <div className="relative z-10">
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              type={type === 'text' ? 'text' : 'number'}
              className="text-2xl font-bold bg-white/80 border-white/50"
            />
            <div className="flex space-x-2">
              <Button size="sm" onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="bg-white/80">
                <X className="h-3 w-3 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold cursor-pointer hover:scale-105 transition-all duration-300 text-gray-800">
              {formatValue(value)}
            </div>
            {description && (
              <p className="text-xs text-gray-600">{description}</p>
            )}
          </>
        )}
      </div>
    </div>
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
      const currentGoals = Array.isArray(metrics?.goals) ? metrics.goals : [];
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
      const currentGoals = Array.isArray(metrics?.goals) ? metrics.goals : [];
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
      const currentGoals = Array.isArray(metrics?.goals) ? metrics.goals : [];
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
    <div className="min-h-screen bubble-bg relative">
      <MainNavigation />
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
            icon={<DollarSign className="h-5 w-5 text-white" />}
            description="Total monthly recurring revenue"
            gradient="colorful-gradient-4"
          />
          
          <EditableCard
            title="Monthly Growth"
            value={currentMetrics.monthlyGrowth}
            type="percentage"
            onSave={(value) => handleMetricUpdate('monthlyGrowth', value)}
            icon={currentMetrics.monthlyGrowth >= 0 ? 
              <TrendingUp className="h-5 w-5 text-white" /> : 
              <TrendingDown className="h-5 w-5 text-white" />
            }
            description="Month-over-month growth rate"
            gradient="colorful-gradient-3"
          />
          
          <EditableCard
            title="Active Users"
            value={currentMetrics.activeUsers}
            type="number"
            onSave={(value) => handleMetricUpdate('activeUsers', value)}
            icon={<Users className="h-5 w-5 text-white" />}
            description="Monthly active users"
            gradient="colorful-gradient-1"
          />
          
          <EditableCard
            title="Churn Rate"
            value={currentMetrics.churnRate}
            type="percentage"
            onSave={(value) => handleMetricUpdate('churnRate', value)}
            icon={<BarChart3 className="h-5 w-5 text-white" />}
            description="Monthly customer churn"
            gradient="colorful-gradient-5"
          />
        </div>

        {/* Financial Health */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bubble-card p-6 colorful-gradient-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-6 -translate-x-6"></div>
            <CardHeader className="p-0 mb-6 relative z-10">
              <CardTitle className="flex items-center text-white">
                <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Financial Health
              </CardTitle>
            </CardHeader>
            <div className="space-y-4 relative z-10">
              <EditableCard
                title="Monthly Burn Rate"
                value={currentMetrics.burnRate}
                type="currency"
                onSave={(value) => handleMetricUpdate('burnRate', value)}
                icon={<TrendingDown className="h-5 w-5 text-white" />}
                description="Monthly cash burn"
                gradient="colorful-gradient-6"
              />
              <EditableCard
                title="Runway (Months)"
                value={currentMetrics.runway}
                type="number"
                onSave={(value) => handleMetricUpdate('runway', value)}
                icon={<Calendar className="h-5 w-5 text-white" />}
                description="Months until cash runs out"
                gradient="colorful-gradient-7"
              />
            </div>
          </div>

          {/* Goals & Objectives */}
          <div className="bubble-card p-6 colorful-gradient-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 -translate-x-8"></div>
            <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/15 rounded-full translate-y-10 translate-x-10"></div>
            <CardHeader className="p-0 mb-6 relative z-10">
              <CardTitle className="flex items-center text-white">
                <div className="w-12 h-12 bg-white/30 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                Goals & Objectives
              </CardTitle>
            </CardHeader>
            <div className="relative z-10">
              <div className="space-y-3 mb-4">
                {Array.isArray(currentMetrics.goals) ? currentMetrics.goals.map((goal: any, index: number) => (
                  <div key={goal.id || goal.text || index} className="flex items-center justify-between p-4 bg-white/30 backdrop-blur-sm rounded-2xl border border-white/20">
                    <div className="flex items-center space-x-3 flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleGoalMutation.mutate(goal.id || goal.text)}
                        className="h-8 w-8 p-0 bg-white/50 hover:bg-white/70 rounded-full"
                      >
                        {goal.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-white" />
                        )}
                      </Button>
                      <div className="flex-1">
                        <span className={`text-sm font-medium ${goal.completed ? 'line-through text-white/70' : 'text-white'}`}>
                          {goal.text || goal}
                        </span>
                        {goal.completed && goal.completedAt && (
                          <div className="text-xs text-white/80 mt-1">
                            Completed {new Date(goal.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGoalMutation.mutate(goal.id || goal.text)}
                      className="h-8 w-8 p-0 bg-white/50 hover:bg-red-500/80 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                )) : []}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a new goal..."
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addGoal()}
                  className="bg-white/30 border-white/40 text-white placeholder:text-white/70 backdrop-blur-sm"
                />
                <Button onClick={addGoal} size="sm" className="bg-white/40 hover:bg-white/60 text-white backdrop-blur-sm rounded-2xl">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bubble-card p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-pink-200/30 to-yellow-200/30 rounded-full"></div>
          
          <CardHeader className="p-0 mb-6 relative z-10">
            <CardTitle className="text-2xl font-bold text-gray-800">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">Access your most used tools and features</CardDescription>
          </CardHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div 
              className="bubble-card colorful-gradient-1 p-6 cursor-pointer hover:scale-105 transition-all duration-300 float-animation"
              onClick={() => setLocation('/ai-suite')}
              style={{ animationDelay: '0s' }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">AI Suite</span>
                <span className="text-white/80 text-sm text-center">Access 60+ AI-powered business tools</span>
              </div>
            </div>
            
            <div 
              className="bubble-card colorful-gradient-4 p-6 cursor-pointer hover:scale-105 transition-all duration-300 float-animation"
              onClick={() => setLocation('/business-suite-coming-soon')}
              style={{ animationDelay: '1s' }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">Business Suite</span>
                <span className="text-white/80 text-sm text-center">Comprehensive business management tools</span>
              </div>
            </div>
            
            <div 
              className="bubble-card colorful-gradient-5 p-6 cursor-pointer hover:scale-105 transition-all duration-300 float-animation"
              onClick={() => setLocation('/account')}
              style={{ animationDelay: '2s' }}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <span className="text-white font-semibold text-lg">Account Settings</span>
                <span className="text-white/80 text-sm text-center">Manage subscription and preferences</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}