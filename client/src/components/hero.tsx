import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Brain } from "lucide-react";

export function Hero() {
  return (
    <section className="gradient-primary text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              AI-Powered Branding Automation for <span className="text-accent">Startups</span>
            </h1>
            <p className="text-xl mb-8 text-indigo-100">
              Transform your startup's branding with 60+ specialized AI bots. From logo creation to marketing copy, 
              automate everything with cutting-edge GPT technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button className="bg-white text-primary px-8 py-3 text-lg hover:bg-gray-100">
                  Start Free Trial
                </Button>
              </Link>
              <Button variant="outline" className="border-2 border-white text-white px-8 py-3 text-lg hover:bg-white hover:text-primary">
                Watch Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Modern startup workspace with AI branding tools" 
              className="rounded-xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-accent text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center">
                <Brain className="h-8 w-8 mr-2" />
                <div>
                  <div className="font-semibold">60+ AI Bots</div>
                  <div className="text-sm opacity-90">Always Learning</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
