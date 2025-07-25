import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
import { apiRequest } from "@/lib/queryClient";
import { 
  Building2, 
  Rocket, 
  Star, 
  ArrowRight,
  DollarSign,
  Users,
  Briefcase,
  BarChart3,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  Clock,
  Mail,
  CheckCircle
} from "lucide-react";

const upcomingFeatures = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Advanced Financial Analytics",
    description: "Real-time cash flow tracking, automated expense categorization, and investor-ready financial reports.",
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Smart CRM Integration",
    description: "AI-powered customer insights, automated lead scoring, and personalized engagement workflows.",
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600"
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Growth Intelligence Hub",
    description: "Predictive analytics, market opportunity mapping, and automated growth recommendations.",
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Compliance Automation",
    description: "Automated regulatory compliance tracking, document management, and audit preparation.",
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600"
  }
];

const earlyBenefits = [
  { icon: <Star className="w-5 h-5" />, text: "50% discount on first year subscription" },
  { icon: <Zap className="w-5 h-5" />, text: "Priority access to new features and tools" },
  { icon: <Globe className="w-5 h-5" />, text: "Exclusive founder-only community access" },
  { icon: <CheckCircle className="w-5 h-5" />, text: "Personal onboarding and setup assistance" }
];

export default function BusinessSuiteComingSoon() {
  const { user, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Join waitlist mutation
  const joinWaitlistMutation = useMutation({
    mutationFn: async (data: { email: string; name: string; company: string }) => {
      const response = await apiRequest("POST", "/api/business-suite/join-waitlist", data);
      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }
      return response.json();
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll notify you as soon as the Business Suite launches.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email.",
        variant: "destructive"
      });
      return;
    }
    joinWaitlistMutation.mutate({ email, name, company });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <Badge className="mb-4 bg-orange-100 text-orange-800 hover:bg-orange-100">
            <Clock className="w-3 h-3 mr-1" />
            Coming Soon
          </Badge>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Business Suite
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              The Complete Startup OS
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            A comprehensive business management platform designed specifically for startups. 
            Manage finances, customers, operations, and growth - all in one intelligent suite.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/business-suite">
              <Button size="lg" className="px-8 py-3">
                <Rocket className="w-5 h-5 mr-2" />
                Preview Beta Version
              </Button>
            </Link>
            <Button size="lg" variant="outline" onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}>
              Join Waitlist
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>

        {/* Features Preview */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What's Coming</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced tools and features to streamline every aspect of your startup operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index} className={`${feature.color} border-2 hover:shadow-lg transition-all duration-200`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center ${feature.iconColor}`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Early Access Benefits */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Early Access Benefits</CardTitle>
              <CardDescription className="text-blue-100">
                Join our waitlist and get exclusive founder benefits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earlyBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                      {benefit.icon}
                    </div>
                    <span className="text-blue-50">{benefit.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Waitlist Section */}
        <div id="waitlist" className="max-w-2xl mx-auto">
          <Card className="border-2 border-gray-200 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">
                {isSubmitted ? "You're on the list!" : "Join the Waitlist"}
              </CardTitle>
              <CardDescription>
                {isSubmitted 
                  ? "We'll notify you as soon as the Business Suite launches."
                  : "Be among the first to access the complete Business Suite when it launches."
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Thank you for joining!</h3>
                  <p className="text-gray-600 mb-6">
                    You'll receive early access updates and be notified when we launch.
                  </p>
                  <Link href="/business-suite">
                    <Button>
                      Explore Beta Version
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company Name (Optional)</Label>
                    <Input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Enter your company name"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    size="lg"
                    disabled={joinWaitlistMutation.isPending}
                  >
                    {joinWaitlistMutation.isPending ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Joining...
                      </div>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Join Waitlist
                      </>
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}