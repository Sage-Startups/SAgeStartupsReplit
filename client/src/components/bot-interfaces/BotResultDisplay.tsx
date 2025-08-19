import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  CheckCircle, 
  Copy, 
  Download, 
  Share2, 
  Palette, 
  FileText,
  Lightbulb,
  Target,
  BarChart3,
  Eye,
  Zap,
  Clock,
  ArrowRight
} from "lucide-react";
import ReactMarkdown from 'react-markdown';

interface BotResultDisplayProps {
  content: string;
  botType?: string;
}

export function BotResultDisplay({ content, botType }: BotResultDisplayProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Parse the content into structured sections
  const parseContent = (text: string) => {
    const sections: { [key: string]: string } = {};
    const lines = text.split('\n');
    let currentSection = '';
    let currentContent: string[] = [];

    lines.forEach(line => {
      // Check for main section headers (### or ##)
      if (line.startsWith('### ') || line.startsWith('## ')) {
        if (currentSection && currentContent.length > 0) {
          sections[currentSection] = currentContent.join('\n').trim();
        }
        currentSection = line.replace(/^###?\s+\d*\.?\s*/, '').trim();
        currentContent = [];
      } else {
        currentContent.push(line);
      }
    });

    // Add the last section
    if (currentSection && currentContent.length > 0) {
      sections[currentSection] = currentContent.join('\n').trim();
    }

    return sections;
  };

  const sections = parseContent(content);
  const sectionKeys = Object.keys(sections);

  const handleCopy = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getIconForSection = (sectionTitle: string) => {
    const title = sectionTitle.toLowerCase();
    if (title.includes('color') || title.includes('palette')) return <Palette className="w-4 h-4" />;
    if (title.includes('guide') || title.includes('usage')) return <FileText className="w-4 h-4" />;
    if (title.includes('insight') || title.includes('tip')) return <Lightbulb className="w-4 h-4" />;
    if (title.includes('target') || title.includes('goal')) return <Target className="w-4 h-4" />;
    if (title.includes('metric') || title.includes('performance')) return <BarChart3 className="w-4 h-4" />;
    if (title.includes('accessibility') || title.includes('view')) return <Eye className="w-4 h-4" />;
    if (title.includes('implement') || title.includes('technical')) return <Zap className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  // Special rendering for color palette results
  const renderColorPalette = (paletteText: string) => {
    const colorRegex = /#[0-9A-Fa-f]{6}/g;
    const colors = paletteText.match(colorRegex) || [];
    
    return (
      <div className="space-y-4">
        {colors.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {colors.slice(0, 8).map((color, index) => (
              <div key={index} className="group relative">
                <div 
                  className="w-20 h-20 rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-110"
                  style={{ backgroundColor: color }}
                  onClick={() => handleCopy(color, `color-${index}`)}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Badge className="bg-white/90 text-gray-900">
                    {copiedSection === `color-${index}` ? 'Copied!' : color}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{paletteText}</ReactMarkdown>
        </div>
      </div>
    );
  };

  // Determine if this is a color palette result
  const isColorPalette = botType === 'color-palette' || content.toLowerCase().includes('color palette');

  // Get first 3-4 sections for the overview tab
  const overviewSections = sectionKeys.slice(0, 4);
  const detailSections = sectionKeys.slice(4);

  return (
    <div className="w-full space-y-6">
      {/* Header with quick actions */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Results Generated Successfully</CardTitle>
                <p className="text-sm text-gray-600 mt-1">Your AI-powered analysis is ready</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleCopy(content, 'full')}
              >
                <Copy className="w-4 h-4 mr-1" />
                {copiedSection === 'full' ? 'Copied!' : 'Copy All'}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main content with tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Analysis</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {overviewSections.map((sectionKey, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                <CardTitle className="flex items-center gap-2 text-base">
                  {getIconForSection(sectionKey)}
                  {sectionKey}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {isColorPalette && index === 0 ? (
                  renderColorPalette(sections[sectionKey])
                ) : (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown>{sections[sectionKey]}</ReactMarkdown>
                  </div>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-4"
                  onClick={() => handleCopy(sections[sectionKey], `section-${index}`)}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copiedSection === `section-${index}` ? 'Copied!' : 'Copy Section'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {detailSections.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {detailSections.map((sectionKey, index) => (
                <AccordionItem key={index} value={`detail-${index}`}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      {getIconForSection(sectionKey)}
                      <span className="font-medium">{sectionKey}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-4 pb-2">
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{sections[sectionKey]}</ReactMarkdown>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => handleCopy(sections[sectionKey], `detail-${index}`)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedSection === `detail-${index}` ? 'Copied!' : 'Copy Section'}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 text-center">No additional details available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="implementation" className="space-y-4">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Implementation Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Review Generated Content</h4>
                    <p className="text-sm text-gray-600 mt-1">Carefully review all sections and customize as needed for your brand</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Export and Share</h4>
                    <p className="text-sm text-gray-600 mt-1">Download the results and share with your team or stakeholders</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Implement Guidelines</h4>
                    <p className="text-sm text-gray-600 mt-1">Apply the recommendations across your brand touchpoints</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Implementation Progress</span>
                  <span className="text-sm text-gray-600">Ready to implement</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Implementation checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Implementation Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Review all sections', 'Customize for your needs', 'Share with team', 'Create implementation plan', 'Begin rollout'].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to action */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to take the next step?</h3>
              <p className="text-sm mt-1 text-white/90">Generate more content or refine your results</p>
            </div>
            <Button variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
              Continue Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}