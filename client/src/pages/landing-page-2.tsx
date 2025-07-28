import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Zap, ArrowRight, TrendingUp, Shield, Rocket, Star, Users, Target, Clock, ChevronRight, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage2() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleWaitlistSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email) return;

    setIsLoading(true);
    try {
      // Add to waitlist
      await apiRequest("POST", "/api/waitlist", { name: name.trim(), email });
      
      toast({
        title: "You're on the list! 🎉",
        description: "We'll notify you as soon as we launch. Check your email for confirmation.",
      });
      
      setName("");
      setEmail("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to join waitlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold">Sage-Startups</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/signin">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Early Access</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <Badge className="mb-4 px-4 py-1" variant="secondary">
            <Clock className="w-3 h-3 mr-1 inline" />
            Limited Early Access Available
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Turn Your Idea Into a<br />
            <span className="text-blue-600">Launch-Ready Business</span><br />
            in Minutes
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Sage-Startups uses AI to generate business plans, branding and logos, marketing content, and automated market research—everything you need to launch successfully.
          </p>

          {/* Benefits List */}
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-lg text-gray-700">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Complete business plans in minutes
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              AI-generated branding & logos
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Marketing content that converts
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              Automated market research
            </div>
          </div>

          <form onSubmit={handleWaitlistSignup} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1"
                required
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
                required
              />
              <Button type="submit" size="lg" disabled={isLoading || !name.trim() || !email}>
                {isLoading ? "Joining..." : "Join Waitlist"}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-sm text-gray-500 mt-4">
            🔥 247 founders joined this week • No credit card required
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Launch
            </h2>
            <p className="text-xl text-gray-600">
              Five powerful AI capabilities in one platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">AI-Generated Business Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">
                  Get comprehensive business plans with market analysis, financial projections, 
                  and go-to-market strategies in minutes, not weeks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-purple-900">Brand & Logo Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700">
                  Generate professional brand identities, logos, color palettes, and 
                  typography that perfectly capture your vision.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-900">Marketing & Content Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700">
                  Create high-converting ad copy, social media content, blog posts, 
                  and email campaigns that drive real results.
                </p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle className="text-orange-900">Market Research & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700">
                  Automated competitor analysis, market sizing, and customer insights 
                  to validate your idea and find opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 bg-teal-50">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-teal-600" />
                </div>
                <CardTitle className="text-teal-900">Idea Validation & Roadmaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-teal-700">
                  Test your concept, get feedback insights, and receive step-by-step 
                  roadmaps to turn ideas into reality.
                </p>
              </CardContent>
            </Card>

            <Card className="border-indigo-200 bg-indigo-50">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle className="text-indigo-900">Business Suite Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-700">
                  Essential startup tools including legal document templates, 
                  financial calculators, and project management resources.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Waitlist Benefits Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Early Adopter Benefits
            </h2>
            <p className="text-xl text-gray-600">
              Join our waitlist and get exclusive founder perks
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-gold-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-lg">Early Access</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Be among the first to access our platform before public launch
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Founder Discounts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  50% off lifetime access - exclusive pricing for early supporters
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Shape Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Your feedback influences features and helps us build what you need
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Founder Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Exclusive access to our private founder community and networking
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Affordable Pricing for Startups
            </h2>
            <p className="text-xl text-gray-600">
              Comparable AI tools cost $12-40/month. We're building something better.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Trial */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free Trial</CardTitle>
                <CardDescription>Test everything risk-free</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-500"> for 7 days</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Access to 8 AI tools in the AI Suite</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Create unlimited logos and branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Generate branding strategy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">No credit card required</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => setLocation('/signup?tier=free')}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* Early Bird Lifetime */}
            <Card className="relative border-blue-500 shadow-xl bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-500">🔥 Early Bird Special</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Lifetime Access</CardTitle>
                <CardDescription>One-time payment, forever access</CardDescription>
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl text-gray-400 line-through">£60</span>
                    <span className="text-4xl font-bold text-blue-600">£30</span>
                  </div>
                  <span className="text-sm text-blue-600 font-medium">50% off for waitlist members</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">All current & future AI tools</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Unlimited business plans & branding</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Priority support & feature requests</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Private founder community access</span>
                  </li>
                </ul>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Join Waitlist for £30 Deal
                </Button>
              </CardContent>
            </Card>


          </div>
        </div>
      </section>

      {/* Coming Soon Roadmap */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Coming Soon
            </h2>
            <p className="text-xl text-gray-600">
              Exciting features we're building for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-dashed border-2 border-gray-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg text-gray-700">Pitch Deck Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  AI-generated investor pitch decks with compelling storytelling
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-dashed border-2 border-gray-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Rocket className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg text-gray-700">Website Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Launch-ready websites integrated with your branding and content
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-dashed border-2 border-gray-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg text-gray-700">SEO Keywords</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  Automated keyword research and SEO optimization suggestions
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-dashed border-2 border-gray-300">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-lg text-gray-700">24/7 Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">
                  AI-powered support and human experts available around the clock
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Founders
            </h2>
            <p className="text-xl text-gray-600">
              Join the community of successful entrepreneurs
            </p>
          </div>

          <div className="text-center mb-12">
            <Badge className="text-lg px-6 py-2 bg-blue-100 text-blue-800">
              Featured on WhatTheAI
            </Badge>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">"Game-changing for startups"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "Sage-Startups helped me create a complete business plan and brand identity in just 2 hours. 
                  What would have taken me weeks was done perfectly."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">SA</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sarah Anderson</p>
                    <p className="text-gray-500 text-xs">Founder, TechFlow</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">"Incredibly powerful AI"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "The market research and competitor analysis features are incredible. 
                  It's like having a team of consultants working 24/7."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">MR</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Mike Rodriguez</p>
                    <p className="text-gray-500 text-xs">CEO, EcoVenture</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">"Worth every penny"</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  "I saved thousands on branding and marketing agencies. The AI generates 
                  professional-quality content that converts."
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">JL</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Jennifer Liu</p>
                    <p className="text-gray-500 text-xs">Founder, StyleSpace</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Rocket className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Launch</h3>
                <p className="text-gray-600 text-sm">
                  Get your brand identity, marketing strategy, and content ready in hours, not months
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Smart Analytics</h3>
                <p className="text-gray-600 text-sm">
                  Track your progress with real-time insights and AI-powered recommendations
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-gray-600 text-sm">
                  Your data is encrypted and never shared. Build with confidence
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">AI-Powered</h3>
                <p className="text-gray-600 text-sm">
                  Latest AI technology trained on successful startup strategies
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Growth Tools</h3>
                <p className="text-gray-600 text-sm">
                  SEO optimization, social media strategies, and conversion tools built-in
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Founder Community</h3>
                <p className="text-gray-600 text-sm">
                  Connect with other founders and share strategies that work
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about Sage-Startups
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-left">What exactly does Sage-Startups do?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sage-Startups is an AI-powered platform that helps entrepreneurs create complete business plans, 
                  professional branding, marketing content, and market research in minutes. It's like having a team 
                  of business consultants, designers, and marketers working for you 24/7.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-left">When will the platform launch?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're launching in Q2 2025. Waitlist members get early access 2 weeks before public launch, 
                  plus exclusive lifetime pricing at 50% off.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-left">How is my data kept private and secure?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Your business data is encrypted end-to-end and never shared with third parties. We use enterprise-grade 
                  security and comply with GDPR and SOC 2 standards. You own your data completely.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-left">What will the pricing be like?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We'll offer a free trial and plans starting from £15/month. Waitlist members get lifetime access 
                  for a one-time payment of £30 (50% off the regular £60). This includes all current and future features.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Second CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Launch Your Startup?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the founder community and get lifetime access for £30. Limited time offer.
          </p>

          <form onSubmit={handleWaitlistSignup} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                required
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                required
              />
              <Button type="submit" size="lg" variant="secondary" disabled={isLoading || !name.trim() || !email}>
                {isLoading ? "Joining..." : "Join Waitlist"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-sm text-blue-100 mt-4">
            💡 Join 500+ founders building the future • No spam, ever
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Founders Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of successful startups using Sage-Startups
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Game Changer for Startups</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "I launched my SaaS in half the time thanks to Sage-Startups. The AI marketing strategist alone saved me $10k in consulting fees."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">Sarah Chen</p>
                    <p className="text-xs text-gray-500">Founder, TechFlow</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Finally, AI That Delivers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "The logo designer created 5 amazing concepts in minutes. What would have taken weeks with a designer was done in an afternoon."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">Michael Rodriguez</p>
                    <p className="text-xs text-gray-500">CEO, GrowthLab</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <CardTitle className="text-lg">Must-Have for Founders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  "From brand voice to SEO strategy, everything is cohesive. It's like having a full marketing team at a fraction of the cost."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div>
                    <p className="font-semibold text-sm">Emma Watson</p>
                    <p className="text-xs text-gray-500">Founder, EcoStart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center space-x-8">
              <div>
                <p className="text-3xl font-bold text-gray-900">500+</p>
                <p className="text-gray-600">Active Founders</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-3xl font-bold text-gray-900">50k+</p>
                <p className="text-gray-600">AI Tasks Completed</p>
              </div>
              <div className="w-px h-12 bg-gray-300" />
              <div>
                <p className="text-3xl font-bold text-gray-900">4.9/5</p>
                <p className="text-gray-600">Average Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-white/20 text-white border-white/30">
            Limited Time Offer
          </Badge>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join the AI Revolution Before It's Too Late
          </h2>
          
          <p className="text-xl mb-8 text-blue-100">
            Early access members get lifetime discounts and exclusive features. 
            Only 50 spots left this month.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold">72hrs</p>
                <p className="text-sm text-blue-100">Until price increase</p>
              </div>
              <div>
                <p className="text-3xl font-bold">50</p>
                <p className="text-sm text-blue-100">Spots remaining</p>
              </div>
              <div>
                <p className="text-3xl font-bold">40%</p>
                <p className="text-sm text-blue-100">Early bird discount</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleWaitlistSignup} className="max-w-lg mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                required
              />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/70"
                required
              />
              <Button type="submit" size="lg" variant="secondary" disabled={isLoading || !name.trim() || !email}>
                {isLoading ? "Joining..." : "Claim Your Spot"}
                <ChevronRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </form>

          <p className="text-sm text-blue-100 mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
                <span className="text-white font-semibold">Sage-Startups</span>
              </div>
              <p className="text-sm">
                AI-powered tools for ambitious startup founders.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/pricing">Pricing</Link></li>
                <li><Link href="/roadmap">Roadmap</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about">About</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2025 Sage-Startups. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}