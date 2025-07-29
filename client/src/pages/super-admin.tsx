import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/main-navigation";
import { 
  Shield, Users, CreditCard, FileText, BarChart3, Settings, 
  Search, Plus, Edit, Trash2, Ban, CheckCircle, XCircle,
  Download, Upload, Eye, AlertTriangle, Clock, DollarSign,
  Activity, Database, Lock, Mail, Calendar, Globe, Crown,
  Filter, MoreHorizontal, RefreshCw, TrendingUp, TrendingDown,
  UserPlus
} from "lucide-react";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  createdAt: string;
  lastActive: string;
  totalSessions: number;
  totalMessages: number;
}

interface SubscriptionPlan {
  id: number;
  name: string;
  tier: string;
  price: number;
  billingInterval: string;
  features: string[];
  botLimit: number;
  isActive: boolean;
}

interface Payment {
  id: number;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
}

interface AuditLog {
  id: number;
  userId: string;
  userEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  createdAt: string;
}

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalSessions: number;
  totalMessages: number;
  conversionRate: number;
  churnRate: number;
}

interface WaitlistEntry {
  id: number;
  name: string;
  email: string;
  source: string;
  referrer: string | null;
  createdAt: string;
}

const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["super_admin", "moderator", "client"]),
  subscriptionTier: z.enum(["free", "pro", "premium"])
});

const editUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(["super_admin", "moderator", "client"]),
  subscriptionTier: z.enum(["free", "pro", "premium"]),
  password: z.string().min(8, "Password must be at least 8 characters").optional()
});

export default function SuperAdmin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingPlan, setIsCreatingPlan] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetUser, setPasswordResetUser] = useState<AdminUser | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Create user form
  const createUserForm = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "client",
      subscriptionTier: "free"
    }
  });

  // Edit user form
  const editUserForm = useForm<z.infer<typeof editUserSchema>>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      role: "client",
      subscriptionTier: "free",
      password: ""
    }
  });

  // Check if user is super admin
  const { data: currentUserProfile } = useQuery<{ role: string }>({
    queryKey: ["/api/user/profile"],
    enabled: !!user
  });

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Fetch subscription plans
  const { data: plans = [], isLoading: plansLoading } = useQuery<SubscriptionPlan[]>({
    queryKey: ["/api/admin/plans"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Fetch payments
  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Fetch audit logs
  const { data: auditLogs = [], isLoading: logsLoading } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/audit-logs"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Fetch system metrics
  const { data: metrics } = useQuery<SystemMetrics>({
    queryKey: ["/api/admin/metrics"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Fetch waitlist entries
  const { data: waitlistEntries = [] } = useQuery<WaitlistEntry[]>({
    queryKey: ["/api/admin/waitlist"],
    enabled: !!user && currentUserProfile?.role === 'super_admin'
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (data: { userId: string; updates: Partial<AdminUser> & { password?: string } }) => {
      const response = await apiRequest("PUT", `/api/admin/users/${data.userId}`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsEditingUser(false);
      setSelectedUser(null);
      editUserForm.reset();
      toast({ title: "User updated successfully" });
    }
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof createUserSchema>) => {
      const response = await apiRequest("POST", "/api/admin/users", userData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsCreatingUser(false);
      createUserForm.reset();
      toast({ title: "User created successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create user", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  // Create plan mutation
  const createPlanMutation = useMutation({
    mutationFn: async (planData: Omit<SubscriptionPlan, 'id'>) => {
      const response = await apiRequest("POST", "/api/admin/plans", planData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/plans"] });
      setIsCreatingPlan(false);
      toast({ title: "Plan created successfully" });
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "User deleted successfully" });
    }
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { userId: string; newPassword: string }) => {
      const response = await apiRequest("POST", `/api/admin/users/${data.userId}/reset-password`, {
        password: data.newPassword
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      setIsResettingPassword(false);
      setPasswordResetUser(null);
      toast({ title: "Password reset successfully" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to reset password", 
        description: error.message,
        variant: "destructive" 
      });
    }
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || currentUserProfile?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You don't have permission to access the super admin panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.subscriptionStatus === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Shield className="w-8 h-8 mr-3 text-red-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Complete system administration and management
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/plans"] });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/audit-logs"] });
                queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
                toast({
                  title: "Data Refreshed",
                  description: "All admin data has been refreshed successfully.",
                });
              }}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh All Data
            </Button>
          </div>
        </div>

        {/* System Metrics Overview */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold">{metrics.totalUsers}</p>
                      <p className="text-sm text-green-600">{metrics.activeUsers} active</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                        toast({ title: "User metrics refreshed" });
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset User Data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all user accounts except admin accounts. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await apiRequest("DELETE", "/api/admin/users/reset");
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                                toast({ title: "User data reset successfully" });
                              } catch (error: any) {
                                toast({ title: "Error", description: error.message, variant: "destructive" });
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reset Users
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-2xl font-bold">${metrics.totalRevenue}</p>
                      <p className="text-sm text-green-600">${metrics.monthlyRevenue} this month</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                        toast({ title: "Revenue metrics refreshed" });
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Revenue Data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all payment records and reset revenue metrics. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await apiRequest("DELETE", "/api/admin/revenue/reset");
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/payments"] });
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                                toast({ title: "Revenue data reset successfully" });
                              } catch (error: any) {
                                toast({ title: "Error", description: error.message, variant: "destructive" });
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reset Revenue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Activity className="w-8 h-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Sessions</p>
                      <p className="text-2xl font-bold">{metrics.totalSessions}</p>
                      <p className="text-sm text-blue-600">{metrics.totalMessages} messages</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                        toast({ title: "Session metrics refreshed" });
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Session Data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete all user sessions and chat messages. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await apiRequest("DELETE", "/api/admin/sessions/reset");
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                                toast({ title: "Session data reset successfully" });
                              } catch (error: any) {
                                toast({ title: "Error", description: error.message, variant: "destructive" });
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reset Sessions
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <TrendingUp className="w-8 h-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Conversion</p>
                      <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                      <p className="text-sm text-red-600">{metrics.churnRate}% churn</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                        toast({ title: "Conversion metrics refreshed" });
                      }}
                    >
                      <RefreshCw className="h-3 w-3" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Conversion Data?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently reset all conversion tracking and analytics data. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              try {
                                await apiRequest("DELETE", "/api/admin/conversions/reset");
                                queryClient.invalidateQueries({ queryKey: ["/api/admin/metrics"] });
                                toast({ title: "Conversion data reset successfully" });
                              } catch (error: any) {
                                toast({ title: "Error", description: error.message, variant: "destructive" });
                              }
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Reset Conversions
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="waitlist">Waiting List</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Users Management Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all user accounts, roles, and permissions</CardDescription>
                  </div>
                  <Dialog open={isCreatingUser} onOpenChange={setIsCreatingUser}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Add User
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Create New User</DialogTitle>
                        <DialogDescription>Add a new user to the system</DialogDescription>
                      </DialogHeader>
                      <Form {...createUserForm}>
                        <form onSubmit={createUserForm.handleSubmit((data) => createUserMutation.mutate(data))} className="space-y-4">
                          <FormField
                            control={createUserForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={createUserForm.control}
                              name="firstName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>First Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="John" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={createUserForm.control}
                              name="lastName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Last Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Doe" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={createUserForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={createUserForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="client">Client</SelectItem>
                                    <SelectItem value="moderator">Moderator</SelectItem>
                                    <SelectItem value="super_admin">Super Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={createUserForm.control}
                            name="subscriptionTier"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subscription Tier</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select a subscription tier" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="free">Free</SelectItem>
                                    <SelectItem value="pro">Pro</SelectItem>
                                    <SelectItem value="premium">Premium</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setIsCreatingUser(false)}
                            >
                              Cancel
                            </Button>
                            <Button 
                              type="submit" 
                              disabled={createUserMutation.isPending}
                            >
                              {createUserMutation.isPending ? "Creating..." : "Create User"}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex items-center space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Password</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Subscription</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.firstName} {user.lastName}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded">
                              [Encrypted]
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-blue-600 hover:text-blue-800 p-0 h-auto"
                              onClick={() => {
                                setPasswordResetUser(user);
                                setIsResettingPassword(true);
                              }}
                            >
                              Reset Password
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'super_admin' ? 'destructive' : user.role === 'moderator' ? 'secondary' : 'outline'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="capitalize">{user.subscriptionTier}</p>
                              <p className="text-sm text-gray-500">{user.totalSessions} sessions</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.subscriptionStatus === 'active' ? 'default' : 'secondary'}>
                              {user.subscriptionStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{user.totalMessages} messages</p>
                              <p className="text-xs text-gray-500">Last: {new Date(user.lastActive).toLocaleDateString()}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedUser(user);
                                  editUserForm.reset({
                                    firstName: user.firstName,
                                    lastName: user.lastName,
                                    role: user.role as "super_admin" | "moderator" | "client",
                                    subscriptionTier: user.subscriptionTier as "free" | "pro" | "premium",
                                    password: ""
                                  });
                                  setIsEditingUser(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete User</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete {user.email} and all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => deleteUserMutation.mutate(user.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscriptions Management Tab */}
          <TabsContent value="subscriptions">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Subscription Plans</CardTitle>
                      <CardDescription>Manage subscription tiers and pricing</CardDescription>
                    </div>
                    <Button onClick={() => setIsCreatingPlan(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Plan
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((plan) => (
                      <Card key={plan.id} className={`${!plan.isActive ? 'opacity-50' : ''}`}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{plan.name}</CardTitle>
                            <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                              {plan.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <CardDescription>
                            ${plan.price}/{plan.billingInterval}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p className="text-sm font-medium">{plan.botLimit} AI Bots</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View all transactions and payment details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">
                            {payment.transactionId}
                          </TableCell>
                          <TableCell>{payment.userEmail}</TableCell>
                          <TableCell>
                            ${payment.amount} {payment.currency}
                          </TableCell>
                          <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                payment.status === 'completed' ? 'default' :
                                payment.status === 'failed' ? 'destructive' :
                                'secondary'
                              }
                            >
                              {payment.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Waiting List Tab */}
          <TabsContent value="waitlist">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Waiting List Management
                </CardTitle>
                <CardDescription>
                  View and manage users who have joined the waitlist from the landing page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">
                      {waitlistEntries.length} Total Subscribers
                    </Badge>
                    <Badge variant="outline">
                      {waitlistEntries.filter(entry => entry.source === 'landing-page-2').length} From Landing Page
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
                      toast({ title: "Waitlist data refreshed" });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                {waitlistEntries.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No waitlist subscribers yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Users who sign up on the landing page will appear here
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Referrer</TableHead>
                          <TableHead>Joined Date</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {waitlistEntries.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-2 text-green-600" />
                                {entry.name}
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex items-center">
                                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                                {entry.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={entry.source === 'landing-page-2' ? 'default' : 'outline'}>
                                {entry.source}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {entry.referrer ? (
                                <span className="text-sm text-gray-600">{entry.referrer}</span>
                              ) : (
                                <span className="text-sm text-gray-400">Direct</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(entry.createdAt).toLocaleDateString()}
                              </div>
                            </TableCell>
                            <TableCell>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Waitlist Entry?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently remove {entry.name} ({entry.email}) from the waitlist. This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={async () => {
                                        try {
                                          await apiRequest("DELETE", `/api/admin/waitlist/${entry.id}`);
                                          queryClient.invalidateQueries({ queryKey: ["/api/admin/waitlist"] });
                                          toast({ title: "Waitlist entry deleted successfully" });
                                        } catch (error: any) {
                                          toast({ title: "Error", description: error.message, variant: "destructive" });
                                        }
                                      }}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Analytics</CardTitle>
                  <CardDescription>Detailed analytics and usage metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Advanced analytics dashboard coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security & Audit Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security & Audit Logs</CardTitle>
                <CardDescription>Monitor system security and user actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Resource</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>{log.userEmail}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.resource}</TableCell>
                          <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                          <TableCell>
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditingUser} onOpenChange={setIsEditingUser}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Update user information and permissions
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <Form {...editUserForm}>
                <form onSubmit={editUserForm.handleSubmit((data) => {
                  const updates: any = {
                    firstName: data.firstName,
                    lastName: data.lastName,
                    role: data.role,
                    subscriptionTier: data.subscriptionTier
                  };
                  if (data.password && data.password.length >= 8) {
                    updates.password = data.password;
                  }
                  updateUserMutation.mutate({
                    userId: selectedUser.id,
                    updates
                  });
                })} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedUser.email} disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editUserForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editUserForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={editUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password (optional)</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Leave empty to keep current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editUserForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="client">Client</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editUserForm.control}
                    name="subscriptionTier"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subscription Tier</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a tier" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="free">Free</SelectItem>
                            <SelectItem value="pro">Pro</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsEditingUser(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateUserMutation.isPending}>
                      {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>

        {/* Password Reset Dialog */}
        <Dialog open={isResettingPassword} onOpenChange={setIsResettingPassword}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new password for {passwordResetUser?.email}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newPassword = formData.get('password') as string;
              if (passwordResetUser && newPassword) {
                resetPasswordMutation.mutate({
                  userId: passwordResetUser.id,
                  newPassword
                });
              }
            }} className="space-y-4">
              <div>
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password (min 8 characters)"
                  required
                  minLength={8}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResettingPassword(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={resetPasswordMutation.isPending}>
                  {resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}