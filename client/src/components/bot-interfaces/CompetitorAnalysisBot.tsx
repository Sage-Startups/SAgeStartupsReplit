import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Eye, Search, BarChart3, Target, TrendingUp } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CompetitorAnalysisBotProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function CompetitorAnalysisBot({ onSendMessage, isLoading, sessionId }: CompetitorAnalysisBotProps) {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [targetMarket, setTargetMarket] = useState('');
  const [competitors, setCompetitors] = useState('');
  const [analysisScope, setAnalysisScope] = useState('');
  const [marketPosition, setMarketPosition] = useState('');
  
  // Analysis areas selection
  const [analysisAreas, setAnalysisAreas] = useState<string[]>([]);

  const analysisOptions = [
    { id: 'pricing', label: 'Pricing Strategy', description: 'Price comparison and positioning' },
    { id: 'marketing', label: 'Marketing Tactics', description: 'Advertising, content, and promotion strategies' },
    { id: 'products', label: 'Product/Service Analysis', description: 'Feature comparison and positioning' },
    { id: 'digital', label: 'Digital Presence', description: 'Website, SEO, social media analysis' },
    { id: 'customer', label: 'Customer Experience', description: 'Support, reviews, and satisfaction' },
    { id: 'financial', label: 'Financial Performance', description: 'Revenue, funding, and growth metrics' },
    { id: 'technology', label: 'Technology Stack', description: 'Tools, platforms, and tech capabilities' },
    { id: 'partnerships', label: 'Partnerships & Alliances', description: 'Strategic relationships and collaborations' }
  ];

  const handleAnalysisAreaToggle = (areaId: string) => {
    setAnalysisAreas(prev => 
      prev.includes(areaId) 
        ? prev.filter(id => id !== areaId)
        : [...prev, areaId]
    );
  };

  const handleGenerateAnalysis = () => {
    const selectedAnalysisAreas = analysisAreas.map(id => 
      analysisOptions.find(a => a.id === id)?.label
    ).join(', ');

    const prompt = `Conduct a comprehensive competitor analysis and SWOT analysis with web research for the following business:

**Business Information:**
- Business Name: ${businessName}
- Industry: ${industry}
- Business Description: ${businessDescription}
- Target Market: ${targetMarket}
- Current Market Position: ${marketPosition}

**Competitors to Analyze:**
${competitors}

**Analysis Focus Areas:**
${selectedAnalysisAreas}

**Analysis Scope:**
${analysisScope}

**Please provide a detailed competitive intelligence report including:**

1. **Web Research & Market Intelligence:**
   - Search for latest information about each competitor
   - Industry trends and market dynamics
   - Recent news, funding, partnerships, or changes
   - Market size and growth projections
   - Regulatory environment and challenges

2. **Detailed Competitor Profiles:**
   For each competitor, provide:
   - Company overview and history
   - Business model and revenue streams
   - Key products/services and features
   - Pricing strategy and positioning
   - Target audience and customer segments
   - Marketing strategies and channels
   - Strengths and weaknesses
   - Recent developments and strategic moves

3. **Comprehensive SWOT Analysis:**
   
   **Your Business SWOT:**
   - **Strengths:** Internal advantages and capabilities
   - **Weaknesses:** Areas for improvement and limitations
   - **Opportunities:** Market gaps and growth potential
   - **Threats:** Competitive risks and market challenges

   **Market SWOT Analysis:**
   - Industry opportunities and threats
   - Competitive landscape assessment
   - Market entry barriers and advantages

4. **Market Positioning Analysis:**
   - Competitive positioning map
   - Market gaps and white space opportunities
   - Differentiation opportunities
   - Value proposition comparison
   - Brand positioning recommendations

5. **Strategic Insights & Recommendations:**
   - Key competitive advantages to leverage
   - Market opportunities to pursue
   - Defensive strategies against competitive threats
   - Product/service development recommendations
   - Marketing and positioning strategies
   - Pricing strategy recommendations

6. **Action Plan:**
   - Immediate tactical moves (0-3 months)
   - Medium-term strategic initiatives (3-12 months)
   - Long-term competitive strategy (1-2 years)
   - Key metrics to monitor
   - Competitive intelligence monitoring plan

7. **Risk Assessment:**
   - Competitive threats and mitigation strategies
   - Market risks and contingency plans
   - Technology disruption risks
   - Regulatory and compliance considerations

Please use web search to gather the most current and accurate information about competitors, market trends, and industry developments. Focus on actionable insights that can inform strategic decision-making.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Eye className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Competitor Analysis & SWOT</h2>
        <p className="text-gray-600 mb-6">
          Comprehensive market intelligence, competitor research, and strategic positioning analysis
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Your Business
            </CardTitle>
            <CardDescription>Tell us about your business and market</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry/Market</Label>
              <Input
                id="industry"
                placeholder="e.g., SaaS, E-commerce, Healthcare, FinTech"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="businessDescription">Business Description</Label>
              <Textarea
                id="businessDescription"
                placeholder="Describe your products/services, value proposition, and what makes you unique"
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetMarket">Target Market</Label>
              <Textarea
                id="targetMarket"
                placeholder="Describe your ideal customers, market segments, and geographic focus"
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="marketPosition">Current Market Position</Label>
              <Select value={marketPosition} onValueChange={setMarketPosition}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your market position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup/New Entrant</SelectItem>
                  <SelectItem value="small-player">Small Player</SelectItem>
                  <SelectItem value="growing">Growing Company</SelectItem>
                  <SelectItem value="established">Established Player</SelectItem>
                  <SelectItem value="market-leader">Market Leader</SelectItem>
                  <SelectItem value="niche-specialist">Niche Specialist</SelectItem>
                  <SelectItem value="challenger">Market Challenger</SelectItem>
                  <SelectItem value="follower">Market Follower</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Analysis Parameters
            </CardTitle>
            <CardDescription>Define the scope of your competitive analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="competitors">Key Competitors</Label>
              <Textarea
                id="competitors"
                placeholder="List your main competitors (company names, websites, or descriptions). Include direct and indirect competitors."
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="analysisScope">Analysis Scope</Label>
              <Select value={analysisScope} onValueChange={setAnalysisScope}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quick-overview">Quick Overview (3-5 competitors)</SelectItem>
                  <SelectItem value="standard">Standard Analysis (5-8 competitors)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Analysis (8-12 competitors)</SelectItem>
                  <SelectItem value="deep-dive">Deep Dive (Top 3-5 competitors)</SelectItem>
                  <SelectItem value="market-landscape">Full Market Landscape</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Analysis Includes:</h4>
                <div className="space-y-2 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Web research and latest intelligence
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Complete SWOT analysis
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Market positioning strategy
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Actionable recommendations
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Analysis Focus Areas
          </CardTitle>
          <CardDescription>Select the specific areas you want to analyze about your competitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {analysisOptions.map((option) => (
              <div key={option.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={option.id}
                  checked={analysisAreas.includes(option.id)}
                  onCheckedChange={() => handleAnalysisAreaToggle(option.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={option.id} className="font-medium cursor-pointer">
                    {option.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleGenerateAnalysis}
          disabled={!businessName || !industry || !businessDescription || !competitors || !analysisScope || analysisAreas.length === 0 || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Search className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Competitors...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Generate Competitor Analysis
            </>
          )}
        </Button>
        
        {analysisAreas.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-600">Analysis areas:</span>
            {analysisAreas.map(areaId => {
              const area = analysisOptions.find(a => a.id === areaId);
              return (
                <Badge key={areaId} variant="secondary">
                  {area?.label}
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">AI Assistant Response</h3>
          <BotChatInterface sessionId={sessionId} botType="competitor-analysis" />
        </div>
      )}
    </div>
  );
}