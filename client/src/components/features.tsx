import { sections } from "@/lib/bot-definitions";
import { Link } from "wouter";
import { 
  Megaphone, 
  Palette, 
  Users, 
  PenTool, 
  TrendingUp, 
  Sparkles
} from "lucide-react";

const iconMap = {
  bullhorn: Megaphone,
  palette: Palette,
  ad: Sparkles,
  users: Users,
  'pen-nib': PenTool,
  'chart-line': TrendingUp
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Everything Your Startup Needs to Build a Strong Brand
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Six comprehensive sections with specialized AI bots to handle every aspect of your branding and marketing needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => {
            const IconComponent = iconMap[section.icon as keyof typeof iconMap];
            return (
              <Link key={section.id} href={`/section/${section.id}`}>
                <div className={`${section.color} p-8 rounded-xl border hover:shadow-lg transition cursor-pointer`}>
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${section.iconColor === 'text-primary' ? 'bg-primary' : section.iconColor === 'text-secondary' ? 'bg-secondary' : section.iconColor === 'text-success' ? 'bg-success' : section.iconColor === 'text-warning' ? 'bg-warning' : section.iconColor === 'text-danger' ? 'bg-danger' : 'bg-accent'}`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{section.name}</h3>
                  <p className="text-gray-600 mb-4">{section.description}</p>
                  <div className="text-sm text-gray-500">
                    <div className="mb-1">• Campaign Strategy Bot</div>
                    <div className="mb-1">• SEO Content Generator</div>
                    <div>• Performance Analyzer</div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
