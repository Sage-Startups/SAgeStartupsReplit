import { sections, bots } from "@/lib/bot-definitions";
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

export function AllBots() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            60+ Specialized AI Bots
          </h2>
          <p className="text-xl text-gray-600">
            Every bot is fine-tuned with specialized prompts and trained on industry best practices.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {sections.map((section) => {
            const sectionBots = bots.filter(bot => bot.section === section.id);
            const IconComponent = iconMap[section.icon as keyof typeof iconMap] || Sparkles;
            
            return (
              <div key={section.id} className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <IconComponent className={`${section.iconColor} text-2xl mr-3`} />
                  <h3 className="text-2xl font-bold text-gray-900">{section.name} Bots</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {sectionBots.map((bot) => (
                    <Link key={bot.id} href={`/bot/${bot.id}`}>
                      <div className={`p-3 ${section.color} rounded-lg border hover:shadow-md transition cursor-pointer`}>
                        <div className="font-medium text-gray-900">{bot.name}</div>
                        <div className="text-sm text-gray-600">{bot.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
