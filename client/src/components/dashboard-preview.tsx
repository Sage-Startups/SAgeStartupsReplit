import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, Activity, FolderOpen, PieChart, Images } from "lucide-react";

export function DashboardPreview() {
  return (
    <section id="dashboard" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Your AI-Powered Brand Command Center
          </h2>
          <p className="text-xl text-gray-600">
            Intuitive dashboard with instant access to all your branding tools and AI assistants.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-gray-900 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="text-primary text-2xl mr-3" />
                <h3 className="text-xl font-semibold">BrandAI Pro Dashboard</h3>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-300">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  All Systems Operational
                </div>
                <Link href="/dashboard">
                  <Button className="bg-primary hover:bg-primary/90">
                    New Project
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="p-6">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="gradient-primary text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm opacity-90">AI Generations</div>
                  </div>
                  <Brain className="text-3xl opacity-80" />
                </div>
              </div>
              <div className="gradient-success text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm opacity-90">Active Projects</div>
                  </div>
                  <FolderOpen className="text-3xl opacity-80" />
                </div>
              </div>
              <div className="gradient-warning text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">89%</div>
                    <div className="text-sm opacity-90">Brand Consistency</div>
                  </div>
                  <PieChart className="text-3xl opacity-80" />
                </div>
              </div>
              <div className="gradient-accent text-white p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">156</div>
                    <div className="text-sm opacity-90">Assets Created</div>
                  </div>
                  <Images className="text-3xl opacity-80" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="text-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Access Full Dashboard →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
