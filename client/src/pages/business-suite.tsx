import { Link } from "wouter";
import { Scale, DollarSign, Settings, Users, ArrowRight, FileText, PieChart, Handshake, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/seo-head";

const CATEGORIES = [
  {
    icon: Scale,
    color: "blue",
    label: "Legal",
    description: "Contract templates, IP guidance, incorporation resources.",
    bots: [
      { id: "brand-guidelines-builder", name: "Brand Guidelines" },
      { id: "brand-positioning-bot", name: "Brand Positioning" },
    ],
  },
  {
    icon: DollarSign,
    color: "green",
    label: "Finance",
    description: "Revenue modeling, pricing strategy, financial narratives.",
    bots: [
      { id: "budget-optimizer-bot", name: "Budget Optimizer" },
      { id: "conversion-analyst-bot", name: "Conversion Analyst" },
    ],
  },
  {
    icon: Settings,
    color: "orange",
    label: "Operations",
    description: "Process design, supplier outreach, SOP drafting.",
    bots: [
      { id: "marketing-strategy-bot", name: "Marketing Strategy" },
      { id: "funnel-auditor-bot", name: "Funnel Auditor" },
    ],
  },
  {
    icon: Users,
    color: "purple",
    label: "HR & Culture",
    description: "Job descriptions, culture playbooks, onboarding docs.",
    bots: [
      { id: "brand-story-writer", name: "Brand Story" },
      { id: "brand-voice-generator", name: "Brand Voice" },
    ],
  },
];

const COLOR_MAP: Record<string, { card: string; icon: string }> = {
  blue: { card: "border-blue-200 dark:border-blue-800", icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400" },
  green: { card: "border-green-200 dark:border-green-800", icon: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400" },
  orange: { card: "border-orange-200 dark:border-orange-800", icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400" },
  purple: { card: "border-purple-200 dark:border-purple-800", icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400" },
};

export default function BusinessSuitePage() {
  return (
    <>
      <SEOHead title="Business Suite — Sage Startups" description="Legal, finance, operations, and HR tools for founders." />
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Business Suite</h1>
            <p className="text-muted-foreground">
              Tools for the operational side of building your startup — legal, finance, operations, and people.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map(({ icon: Icon, color, label, description, bots }) => (
              <Card key={label} className={`${COLOR_MAP[color].card} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${COLOR_MAP[color].icon}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{label}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {bots.map((bot) => (
                    <Link key={bot.id} href={`/bot/${bot.id}`}>
                      <div className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-border hover:bg-muted/50 transition-colors cursor-pointer">
                        <span className="text-sm font-medium">{bot.name}</span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </Link>
                  ))}
                  <Link href="/ai-suite">
                    <Button variant="ghost" size="sm" className="w-full text-xs mt-1">
                      Browse all {label.toLowerCase()} bots <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Coming soon section */}
          <div className="mt-10 p-6 rounded-2xl border border-dashed border-border text-center">
            <Badge variant="secondary" className="mb-3">Coming soon</Badge>
            <h3 className="font-semibold mb-1">Dedicated business tools</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Full document drafting, e-signature integration, financial modeling, and payroll tools are on the roadmap.
            </p>
            <Button variant="outline" size="sm">Join waitlist for early access</Button>
          </div>
        </div>
      </div>
    </>
  );
}
