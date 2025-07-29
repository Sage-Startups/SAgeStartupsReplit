import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Zap, Target, Users, Lightbulb } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Sage-Startups</span>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Sage-Startups
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            We're on a mission to democratize business success by giving every entrepreneur 
            access to the same AI-powered tools that Fortune 500 companies use.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Story</h2>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Sage-Startups was born from a simple observation: most startup failures aren't due to 
              bad ideas, but because founders lack access to the right tools and expertise at the right time.
            </p>
            
            <p className="text-gray-600 mb-6">
              In 2024, our founder experienced this firsthand while launching their first startup. 
              Despite having a solid product idea, they struggled with branding, marketing strategy, 
              and business planning. The cost of hiring consultants was prohibitive, and generic 
              online tools didn't provide the personalized guidance needed.
            </p>
            
            <p className="text-gray-600 mb-6">
              That's when the idea for Sage-Startups emerged: what if we could combine the power 
              of artificial intelligence with proven business methodologies to create an affordable, 
              accessible platform that guides entrepreneurs through every step of building their business?
            </p>
            
            <p className="text-gray-600">
              Today, we're building that vision into reality. Sage-Startups brings together 60+ 
              specialized AI tools, each designed to tackle specific business challenges that every 
              entrepreneur faces. From logo design to market research, from SEO strategy to financial 
              planning - we're creating the complete startup operating system.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Mission & Values</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Target className="w-8 h-8 text-blue-600 mb-4" />
                <CardTitle className="text-xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To turn every great idea into a launch-ready business by making professional 
                  business tools accessible to entrepreneurs worldwide.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-green-600 mb-4" />
                <CardTitle className="text-xl">Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We believe great business tools shouldn't be limited to those who can afford 
                  expensive consultants. Quality should be accessible to all.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Lightbulb className="w-8 h-8 text-yellow-600 mb-4" />
                <CardTitle className="text-xl">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We're constantly pushing the boundaries of what AI can do for business, 
                  creating tools that are both powerful and intuitive.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-purple-600 mb-4" />
                <CardTitle className="text-xl">Empowerment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Every feature we build is designed to empower entrepreneurs to make better 
                  decisions and execute faster than ever before.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Vision</h2>
          <p className="text-xl text-gray-600 mb-8">
            We envision a world where anyone with a business idea can access the same level of 
            strategic guidance, creative resources, and analytical insights that were previously 
            available only to well-funded startups.
          </p>
          <p className="text-lg text-gray-600">
            By 2030, we aim to have helped 100,000 entrepreneurs successfully launch their 
            businesses, creating millions of jobs and driving innovation across every industry.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Join Our Mission?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Be part of the next generation of successful entrepreneurs
          </p>
          <Link href="/signup2">
            <Button size="lg" variant="secondary">
              Join the Waitlist
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Zap className="w-6 h-6 text-blue-400" />
            <span className="text-white font-semibold">Sage-Startups</span>
          </div>
          <p className="text-sm">
            &copy; 2025 Sage-Startups. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}