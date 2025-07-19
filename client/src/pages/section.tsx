import { useParams, Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search, Calendar, Eye, Star, Rocket, Target, BarChart, CheckCircle, FileText, Hash, MessageSquare, Image, Camera, Video, Edit3, Globe, Share2, Heart, Lightbulb, ChevronRight, Zap, Shield, Sparkles } from "lucide-react";
import { getSectionById, getBotsBySection } from "@/lib/bot-definitions";

// Icon mapping for bots
const botIconMap: Record<string, any> = {
  'chess': Target,
  'search': Search,
  'envelope': MessageSquare,
  'calendar': Calendar,
  'eye': Eye,
  'star': Star,
  'rocket': Rocket,
  'target': Target,
  'bar-chart': BarChart,
  'check-circle': CheckCircle,
  'file-text': FileText,
  'hash': Hash,
  'message-square': MessageSquare,
  'image': Image,
  'camera': Camera,
  'video': Video,
  'edit-3': Edit3,
  'globe': Globe,
  'share-2': Share2,
  'heart': Heart,
  'lightbulb': Lightbulb,
  'chevron-right': ChevronRight,
  'zap': Zap,
  'shield': Shield,
  'sparkles': Sparkles
};

export default function Section() {
  const { sectionId } = useParams();
  
  if (!sectionId) {
    return <div>Section not found</div>;
  }

  const section = getSectionById(sectionId);
  const bots = getBotsBySection(sectionId);

  if (!section) {
    return <div>Section not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{section.name} Bots</h1>
          <p className="text-gray-600">{section.description}</p>
        </div>

        {/* Bots Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map((bot) => (
            <Link key={bot.id} href={`/bot/${bot.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      bot.color === 'text-primary' ? 'bg-primary' : 
                      bot.color === 'text-secondary' ? 'bg-secondary' : 
                      bot.color === 'text-success' ? 'bg-success' : 
                      bot.color === 'text-warning' ? 'bg-warning' : 
                      bot.color === 'text-danger' ? 'bg-danger' : 
                      'bg-accent'
                    }`}>
                      {(() => {
                        const IconComponent = botIconMap[bot.icon] || Sparkles;
                        return <IconComponent className="w-4 h-4 text-white" />;
                      })()}
                    </div>
                    <span className="text-lg">{bot.name}</span>
                  </CardTitle>
                  <CardDescription>{bot.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {bot.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center">
                        <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                    {bot.features.length > 3 && (
                      <div className="text-sm text-gray-500 mt-2">
                        +{bot.features.length - 3} more features
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
