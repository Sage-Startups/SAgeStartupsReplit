import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Zap, Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  // Sample blog posts - in a real app, these would come from a CMS or API
  const blogPosts = [
    {
      id: 1,
      title: "10 AI Tools Every Startup Founder Needs in 2025",
      excerpt: "Discover the essential AI tools that can transform your startup's productivity and help you compete with larger companies.",
      category: "AI Tools",
      readTime: "5 min read",
      date: "January 15, 2025",
      featured: true
    },
    {
      id: 2,
      title: "How to Create a Professional Brand Identity on a Budget",
      excerpt: "Learn the step-by-step process to build a cohesive brand identity that resonates with your target audience without breaking the bank.",
      category: "Branding",
      readTime: "8 min read",
      date: "January 12, 2025",
      featured: false
    },
    {
      id: 3,
      title: "The Complete Guide to Startup Marketing Strategy",
      excerpt: "From market research to customer acquisition, everything you need to know about building an effective marketing strategy for your startup.",
      category: "Marketing",
      readTime: "12 min read",
      date: "January 10, 2025",
      featured: false
    },
    {
      id: 4,
      title: "Why 90% of Startups Fail and How to Beat the Odds",
      excerpt: "Understand the common pitfalls that lead to startup failure and learn actionable strategies to increase your chances of success.",
      category: "Business Strategy",
      readTime: "10 min read",
      date: "January 8, 2025",
      featured: false
    },
    {
      id: 5,
      title: "Building Your MVP: A Practical Approach",
      excerpt: "Turn your idea into a minimum viable product with this practical guide that covers planning, development, and validation.",
      category: "Product Development",
      readTime: "15 min read",
      date: "January 5, 2025",
      featured: false
    },
    {
      id: 6,
      title: "Fundraising 101: Preparing for Your First Investment Round",
      excerpt: "Everything you need to know about preparing for and executing your first fundraising round, from pitch decks to investor meetings.",
      category: "Fundraising",
      readTime: "20 min read",
      date: "January 3, 2025",
      featured: false
    }
  ];

  const categories = ["All", "AI Tools", "Branding", "Marketing", "Business Strategy", "Product Development", "Fundraising"];

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
      <section className="py-16 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Startup Insights & Resources
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Expert advice, actionable strategies, and the latest trends in entrepreneurship and AI-powered business growth.
          </p>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-8 px-4 border-b">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={category === "All" ? "default" : "secondary"}
                className="cursor-pointer hover:bg-blue-100 transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Post</h2>
          
          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="mb-8 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 p-8 text-white flex items-center justify-center">
                  <div className="text-center">
                    <Badge className="mb-4 bg-white/20 text-white">{post.category}</Badge>
                    <h3 className="text-2xl font-bold mb-2">Featured</h3>
                    <p className="text-blue-100">Latest insights</p>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-2xl mb-2">{post.title}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {post.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <Button>
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Recent Posts</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                  <CardTitle className="text-xl hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {post.date}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{post.excerpt}</p>
                  <Button variant="outline" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest startup insights and AI tools delivered to your inbox weekly
          </p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button variant="secondary" size="lg">
              Subscribe
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-4">
            No spam, unsubscribe anytime
          </p>
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