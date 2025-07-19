import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function CTA() {
  return (
    <section className="py-20 gradient-primary text-white">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold mb-6">
          Ready to Transform Your Startup's Branding?
        </h2>
        <p className="text-xl mb-8 text-indigo-100">
          Join thousands of startups already using BrandAI Pro to automate their branding and marketing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <Button className="bg-white text-primary px-8 py-4 text-lg hover:bg-gray-100">
              Start 14-Day Free Trial
            </Button>
          </Link>
          <Button variant="outline" className="border-2 border-white text-white px-8 py-4 text-lg hover:bg-white hover:text-primary">
            Schedule Demo
          </Button>
        </div>
        <p className="text-sm text-indigo-200 mt-6">
          No credit card required • Cancel anytime • Full access to all 60+ bots
        </p>
      </div>
    </section>
  );
}
