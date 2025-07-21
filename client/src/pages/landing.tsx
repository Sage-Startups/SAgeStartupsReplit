import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Users, BarChart, Rocket, ArrowRight, Megaphone, Palette, Sparkles, PenTool, TrendingUp } from "lucide-react";
import { sections, bots } from "@/lib/bot-definitions";
import { Link } from "wouter";

const iconMap = {
  bullhorn: Megaphone,
  palette: Palette,
  ad: Sparkles,
  users: Users,
  'pen-nib': PenTool,
  'chart-line': TrendingUp
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Sage-Startups</span>
          </div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <a href="/api/login">Sign In</a>
            </Button>
            <Button asChild>
              <a href="/api/login">Get Started Free</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-200">
            60+ AI-Powered Branding Bots
          </Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Branding
            <span className="text-blue-600"> Automation Platform</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Transform your startup's branding with 60+ specialized AI bots across marketing, branding, advertising, community, blog, and analytics. Get professional results in minutes, not hours.
          </p>
          <div className="space-x-4">
            <Button size="lg" asChild>
              <a href="/api/login">
                Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
          <div className="flex items-center justify-center mt-6 space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-1" />
              Free trial available
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-1" />
              No credit card required
            </div>
            <div className="flex items-center">
              <Check className="w-4 h-4 text-green-500 mr-1" />
              Cancel anytime
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything Your Startup Needs for Branding
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform covers every aspect of startup branding with specialized AI assistants
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => {
              const sectionBots = bots.filter(bot => bot.section === section.id);
              const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Sparkles;
              return (
                <Card key={section.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center`}>
                        <IconComponent className={`w-6 h-6 ${section.iconColor}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{section.name}</CardTitle>
                        <CardDescription>{sectionBots.length} specialized bots</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{section.description}</p>
                    <div className="space-y-2">
                      {sectionBots.slice(0, 3).map((bot) => (
                        <div key={bot.id} className="flex items-center text-sm text-gray-600">
                          <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                          {bot.name}
                        </div>
                      ))}
                      {sectionBots.length > 3 && (
                        <p className="text-sm text-blue-600 font-medium">
                          +{sectionBots.length - 3} more bots
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start with our free trial and upgrade as you grow. All plans include full chat history and asset generation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Trial */}
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Free Trial</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>Perfect for trying out our platform</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>2 bots per section (8 total)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Unlimited conversations</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Basic asset generation</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Project management</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href="/api/login">Start Free Trial</a>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-2 border-blue-500 relative hover:border-blue-600 transition-colors">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                Most Popular
              </Badge>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Pro Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$24</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>Great for growing startups</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>50% of all bots (30 total)</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority AI responses</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Advanced asset generation</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Analytics dashboard</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Email support</span>
                  </div>
                </div>
                <Button className="w-full" asChild>
                  <a href="/api/login">Choose Pro</a>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Premium Plan</CardTitle>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$44</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>Complete branding solution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>All 60+ bots</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Fastest AI responses</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Premium asset generation</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    <span>Priority support</span>
                  </div>
                </div>
                <Button className="w-full" variant="outline" asChild>
                  <a href="/api/login">Choose Premium</a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Trusted by Growing Startups</h2>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">10K+</div>
              <div className="text-gray-400">Messages Generated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-gray-400">Startups Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">95%</div>
              <div className="text-gray-400">Customer Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">24/7</div>
              <div className="text-gray-400">AI Availability</div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="ml-2 text-gray-300">4.9/5 from 200+ reviews</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Branding?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join hundreds of startups using Sage-Startups to create professional branding in minutes, not hours.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <a href="/api/login">
              Start Your Free Trial <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </Button>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Cancel anytime • Full access for 7 days
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">Sage-Startups</span>
          </div>
          <p className="text-sm">© 2025 Sage-Startups. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}