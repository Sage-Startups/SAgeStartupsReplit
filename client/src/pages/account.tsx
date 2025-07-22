import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MainNavigation } from "@/components/main-navigation";
import { 
  User,
  Crown,
  CreditCard,
  Shield,
  Bell,
  Mail,
  Phone,
  MapPin,
  Globe,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Check,
  AlertTriangle,
  Download,
  Trash2,
  Upload,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  company?: string;
  jobTitle?: string;
  phone?: string;
  location?: string;
  timezone?: string;
  language?: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  subscriptionExpires?: string;
  emailNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
  createdAt: string;
  lastActive?: string;
}

function getInitialTab() {
  const params = new URLSearchParams(window.location.search);
  return params.get('tab') || 'profile';
}

export default function Account() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<UserProfile>>({});
  const [isYearlyBilling, setIsYearlyBilling] = useState(false);

  // Fetch user profile
  const { data: profile, isLoading } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
    enabled: !!user
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
      const response = await apiRequest("PUT", "/api/user/profile", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      setIsEditing(false);
      setEditedProfile({});
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update subscription mutation
  const updateSubscriptionMutation = useMutation({
    mutationFn: async (tier: string) => {
      const response = await apiRequest("POST", "/api/user/subscription", { tier });
      if (!response.ok) {
        throw new Error('Failed to update subscription');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
      toast({
        title: "Subscription Updated",
        description: "Your subscription has been updated successfully.",
      });
    }
  });

  // Delete account mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("DELETE", "/api/user/account");
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
      window.location.href = "/api/logout";
    }
  });

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(editedProfile);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedProfile({});
  };

  const handleInputChange = (field: keyof UserProfile, value: string | boolean) => {
    setEditedProfile(prev => ({ ...prev, [field]: value }));
  };

  const getSubscriptionInfo = (tier: string) => {
    switch (tier) {
      case 'free':
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', price: '$0', features: ['6 AI Bots', 'Basic Support'] };
      case 'pro':
        return { name: 'Pro Plan', color: 'bg-blue-100 text-blue-800', price: '$24/month', features: ['30 AI Bots', 'Priority Support', 'Advanced Analytics'] };
      case 'premium':
        return { name: 'Premium Plan', color: 'bg-purple-100 text-purple-800', price: '$44/month', features: ['60+ AI Bots', 'Premium Support', 'All Features'] };
      default:
        return { name: 'Free Trial', color: 'bg-gray-100 text-gray-800', price: '$0', features: ['6 AI Bots'] };
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

  const currentProfile = profile || {
    ...user,
    subscriptionTier: 'free',
    subscriptionStatus: 'active',
    emailNotifications: true,
    marketingEmails: false,
    securityAlerts: true,
    createdAt: new Date().toISOString()
  } as UserProfile;

  const subInfo = getSubscriptionInfo(currentProfile.subscriptionTier);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <User className="w-8 h-8 mr-3 text-blue-600" />
            Account Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile, subscription, and account preferences
          </p>
        </div>

        <Tabs defaultValue={getInitialTab()} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information and contact details</CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline">
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={currentProfile.profileImageUrl} />
                    <AvatarFallback className="text-lg">
                      {currentProfile.firstName?.[0]}{currentProfile.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">
                      {currentProfile.firstName} {currentProfile.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{currentProfile.email}</p>
                    {isEditing && (
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Personal Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editedProfile.firstName ?? currentProfile.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.firstName}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editedProfile.lastName ?? currentProfile.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.lastName}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="p-3 bg-gray-100 rounded-md text-gray-500">
                      {currentProfile.email}
                      <span className="text-xs ml-2">(Cannot be changed)</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile.phone ?? currentProfile.phone ?? ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.phone || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    {isEditing ? (
                      <Input
                        id="company"
                        value={editedProfile.company ?? currentProfile.company ?? ''}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Your company name"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.company || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    {isEditing ? (
                      <Input
                        id="jobTitle"
                        value={editedProfile.jobTitle ?? currentProfile.jobTitle ?? ''}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        placeholder="Your job title"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.jobTitle || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editedProfile.location ?? currentProfile.location ?? ''}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, Country"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.location || 'Not provided'}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    {isEditing ? (
                      <Select value={editedProfile.timezone ?? currentProfile.timezone ?? ''} onValueChange={(value) => handleInputChange('timezone', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-3 bg-gray-50 rounded-md">{currentProfile.timezone || 'Not set'}</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subscription Tab */}
          <TabsContent value="subscription">
            <div className="space-y-6">
              {/* Current Plan */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Subscription</CardTitle>
                  <CardDescription>Manage your subscription plan and billing</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Crown className="w-8 h-8 text-purple-600" />
                      <div>
                        <h3 className="font-semibold">{subInfo.name}</h3>
                        <p className="text-sm text-gray-600">{subInfo.price}</p>
                      </div>
                    </div>
                    <Badge className={subInfo.color}>{currentProfile.subscriptionStatus}</Badge>
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <h4 className="font-medium">Plan Features:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {subInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-600 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {currentProfile.subscriptionExpires && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-yellow-600 mr-2" />
                        <span className="text-sm text-yellow-800">
                          Expires on {new Date(currentProfile.subscriptionExpires).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Plan Options */}
              <Card>
                <CardHeader>
                  <CardTitle>Available Plans</CardTitle>
                  <CardDescription>Upgrade or downgrade your subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Billing Toggle */}
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <span className={`text-sm ${!isYearlyBilling ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                      Monthly
                    </span>
                    <Switch 
                      checked={isYearlyBilling}
                      onCheckedChange={setIsYearlyBilling}
                      className="mx-2"
                    />
                    <span className={`text-sm ${isYearlyBilling ? 'text-gray-900 font-semibold' : 'text-gray-500'}`}>
                      Yearly
                    </span>
                    <Badge className="ml-2 bg-green-100 text-green-800">
                      Save 20%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      {
                        tier: 'free',
                        name: 'Free Trial',
                        monthlyPrice: 0,
                        yearlyPrice: 0,
                        features: ['8 AI bots access', 'Basic asset generation', 'Standard support', 'Project management'],
                        popular: false
                      },
                      {
                        tier: 'pro',
                        name: 'Pro Plan',
                        monthlyPrice: 24,
                        yearlyPrice: 240,
                        features: ['30 AI bots access', 'Advanced asset generation', 'Priority support', 'Team collaboration', 'Advanced analytics'],
                        popular: true
                      },
                      {
                        tier: 'premium',
                        name: 'Premium Plan',
                        monthlyPrice: 44,
                        yearlyPrice: 432,
                        features: ['All 60+ bots', 'Fastest AI responses', 'Premium asset generation', 'Advanced analytics', 'Priority support'],
                        popular: false
                      }
                    ].map((plan) => {
                      const isCurrent = currentProfile.subscriptionTier === plan.tier;
                      const currentPrice = isYearlyBilling ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
                      const fullYearlyPrice = plan.yearlyPrice;
                      const totalYearlyDiscount = plan.monthlyPrice > 0 ? (plan.monthlyPrice * 12) - plan.yearlyPrice : 0;
                      
                      return (
                        <div key={plan.tier} className={`relative p-4 border rounded-lg ${isCurrent ? 'border-blue-500 bg-blue-50' : plan.popular ? 'border-blue-300 bg-blue-50/50' : 'border-gray-200'}`}>
                          {plan.popular && !isCurrent && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                              Most Popular
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                              Current Plan
                            </Badge>
                          )}
                          <div className="pt-2">
                            <h3 className="font-semibold text-lg">{plan.name}</h3>
                            <div className="mt-2">
                              <span className="text-2xl font-bold text-blue-600">${currentPrice}</span>
                              <span className="text-gray-600">
                                {plan.monthlyPrice === 0 ? '/free' : isYearlyBilling ? '/month (billed yearly)' : '/month'}
                              </span>
                              {isYearlyBilling && plan.monthlyPrice > 0 && totalYearlyDiscount > 0 && (
                                <div className="text-sm text-green-600 mt-1">
                                  Save ${totalYearlyDiscount}/year (billed ${fullYearlyPrice} annually)
                                </div>
                              )}
                            </div>
                            <ul className="mt-4 space-y-2 text-sm">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                  <Check className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                                  {feature}
                                </li>
                              ))}
                            </ul>
                            <Button 
                              className="w-full mt-4" 
                              variant={isCurrent ? "outline" : plan.popular ? "default" : "outline"}
                              disabled={isCurrent}
                              onClick={() => {
                                if (plan.tier === 'free') {
                                  // Handle downgrade to free
                                  const confirmed = confirm('Are you sure you want to downgrade to the free plan? This will cancel your current subscription.');
                                  if (confirmed) {
                                    // Call API to downgrade
                                    apiRequest('POST', '/api/stripe/cancel-subscription')
                                      .then(() => {
                                        toast({
                                          title: "Subscription cancelled",
                                          description: "Your subscription has been cancelled successfully."
                                        });
                                        queryClient.invalidateQueries({ queryKey: ["/api/user/profile"] });
                                      })
                                      .catch((error) => {
                                        toast({
                                          title: "Error",
                                          description: "Failed to cancel subscription. Please try again.",
                                          variant: "destructive"
                                        });
                                      });
                                  }
                                } else {
                                  // For paid plans, redirect to checkout
                                  sessionStorage.setItem('selectedPlan', JSON.stringify({
                                    tier: plan.tier,
                                    billingCycle: isYearlyBilling ? 'yearly' : 'monthly',
                                    name: plan.name,
                                    price: currentPrice,
                                    yearlyDiscount: isYearlyBilling ? (plan.monthlyPrice - plan.yearlyPrice) * 12 : 0
                                  }));
                                  window.location.href = '/checkout';
                                }
                              }}
                            >
                              {isCurrent ? 'Current Plan' : `Upgrade to ${plan.name}`}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how and when you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-blue-600" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <p className="text-sm text-gray-600">Receive notifications about your account and activity</p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={editedProfile.emailNotifications ?? currentProfile.emailNotifications}
                    onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Bell className="w-4 h-4 mr-2 text-green-600" />
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    </div>
                    <p className="text-sm text-gray-600">Receive updates about new features and promotions</p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={editedProfile.marketingEmails ?? currentProfile.marketingEmails}
                    onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-2 text-red-600" />
                      <Label htmlFor="security-alerts">Security Alerts</Label>
                    </div>
                    <p className="text-sm text-gray-600">Important security notifications (recommended)</p>
                  </div>
                  <Switch
                    id="security-alerts"
                    checked={editedProfile.securityAlerts ?? currentProfile.securityAlerts}
                    onCheckedChange={(checked) => handleInputChange('securityAlerts', checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select value={editedProfile.language ?? currentProfile.language ?? 'en'} onValueChange={(value) => handleInputChange('language', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                          <SelectItem value="ja">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button onClick={handleSaveProfile} disabled={updateProfileMutation.isPending}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Account Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>View your account details and activity</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account Created</Label>
                      <p className="text-sm">{new Date(currentProfile.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Last Active</Label>
                      <p className="text-sm">{currentProfile.lastActive ? new Date(currentProfile.lastActive).toLocaleDateString() : 'Today'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Account ID</Label>
                      <p className="text-sm font-mono">{currentProfile.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600">Subscription Status</Label>
                      <Badge className={subInfo.color}>{currentProfile.subscriptionStatus}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card>
                <CardHeader>
                  <CardTitle>Data Export</CardTitle>
                  <CardDescription>Download your data and account information</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export My Data
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    Download a copy of your account data including profile information, projects, and activity history.
                  </p>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-700">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Once you delete your account, there is no going back. Please be certain.
                    </AlertDescription>
                  </Alert>
                  <Button 
                    variant="destructive" 
                    className="mt-4"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                        deleteAccountMutation.mutate();
                      }
                    }}
                    disabled={deleteAccountMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>



      </div>
    </div>
  );
}