import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, BarChart3, Target, Lightbulb, Eye } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface TopicResearchBotProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function TopicResearchBot({ onSendMessage, isLoading, sessionId }: TopicResearchBotProps) {
  const [researchTopic, setResearchTopic] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [researchGoals, setResearchGoals] = useState<string[]>([]);
  const [contentFormats, setContentFormats] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [currentKeywords, setCurrentKeywords] = useState('');
  const [researchDepth, setResearchDepth] = useState('');
  const [geographicFocus, setGeographicFocus] = useState('');
  const [businessContext, setBusinessContext] = useState('');

  const goalOptions = [
    { id: 'trend-analysis', label: 'Trend Analysis', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'keyword-research', label: 'Keyword Research', icon: <Search className="w-4 h-4" /> },
    { id: 'content-ideas', label: 'Content Ideas', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'market-analysis', label: 'Market Analysis', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'competitor-insights', label: 'Competitor Insights', icon: <Eye className="w-4 h-4" /> },
    { id: 'audience-interests', label: 'Audience Interests', icon: <Target className="w-4 h-4" /> },
    { id: 'seasonal-trends', label: 'Seasonal Trends', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'opportunity-gaps', label: 'Opportunity Gaps', icon: <Target className="w-4 h-4" /> }
  ];

  const formatOptions = [
    { id: 'blog-posts', label: 'Blog Posts', category: 'Written Content' },
    { id: 'social-media', label: 'Social Media Posts', category: 'Social' },
    { id: 'videos', label: 'Video Content', category: 'Video' },
    { id: 'podcasts', label: 'Podcast Episodes', category: 'Audio' },
    { id: 'infographics', label: 'Infographics', category: 'Visual' },
    { id: 'whitepapers', label: 'Whitepapers', category: 'Long-form' },
    { id: 'case-studies', label: 'Case Studies', category: 'Long-form' },
    { id: 'webinars', label: 'Webinars', category: 'Educational' },
    { id: 'newsletters', label: 'Email Newsletters', category: 'Direct' },
    { id: 'ebooks', label: 'eBooks/Guides', category: 'Long-form' },
    { id: 'press-releases', label: 'Press Releases', category: 'PR' },
    { id: 'product-descriptions', label: 'Product Descriptions', category: 'Commercial' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setResearchGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleFormatToggle = (formatId: string) => {
    setContentFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handleGenerateResearch = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => researchGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedFormatLabels = formatOptions
      .filter(format => contentFormats.includes(format.id))
      .map(format => format.label);

    const message = `Conduct comprehensive topic research and trend analysis with the following parameters:

**Research Topic & Scope:**
- Primary Research Topic: ${researchTopic}
- Industry/Niche: ${industry}
- Geographic Focus: ${geographicFocus}
- Research Depth: ${researchDepth}
- Research Timeframe: ${timeframe}

**Target Audience:**
${targetAudience}

**Business Context:**
${businessContext}

**Research Objectives:**
- Primary Goals: ${selectedGoalLabels.join(', ')}
- Content Formats: ${selectedFormatLabels.join(', ')}

**Current State:**
- Existing Keywords: ${currentKeywords}
- Competitor Landscape: ${competitorAnalysis}

Please provide:

1. **Comprehensive Trend Analysis**
   - Current trend status and momentum
   - Historical trend data and patterns
   - Projected future trends and direction
   - Seasonal variations and cyclical patterns
   - Peak interest periods and timing

2. **In-Depth Keyword Research**
   - Primary keywords with search volumes
   - Long-tail keyword opportunities
   - Related and semantic keywords
   - Keyword difficulty and competition analysis
   - Intent-based keyword categorization (informational, commercial, transactional)
   - Question-based keywords and voice search opportunities

3. **Market & Audience Analysis**
   - Market size and growth potential
   - Audience demographics and psychographics
   - Pain points and challenges
   - Information consumption preferences
   - Social media behavior and platform preferences
   - Purchasing behavior and decision factors

4. **Competitive Landscape Mapping**
   - Key players and market leaders
   - Content gaps and opportunities
   - Competitor content performance analysis
   - Unique positioning opportunities
   - Emerging competitors and disruptors

5. **Content Opportunity Matrix**
   - High-opportunity content topics
   - Content format recommendations
   - Optimal content timing and frequency
   - Distribution channel recommendations
   - Content themes and pillars
   - Evergreen vs. trending content balance

6. **Actionable Insights & Recommendations**
   - Top 10 content ideas ready for development
   - Priority keywords to target immediately
   - Content calendar suggestions
   - SEO optimization strategies
   - Social media content angles
   - Thought leadership opportunities

7. **Implementation Roadmap**
   - Quick wins (immediate opportunities)
   - Short-term content strategy (1-3 months)
   - Long-term positioning strategy (6-12 months)
   - Resource requirements and team structure
   - Success metrics and KPIs to track

8. **Trend Monitoring & Updates**
   - Tools and sources for ongoing monitoring
   - Alert systems for trend changes
   - Regular review schedule recommendations
   - Adaptation strategies for trend shifts

Make this research comprehensive, data-driven, and immediately actionable with specific recommendations, keywords, content ideas, and implementation steps.`;

    onSendMessage(message);
  };

  const isFormValid = researchTopic && industry && targetAudience && researchGoals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Topic Research Bot</h2>
          <p className="text-gray-600">Research topics, analyze trends, and discover keyword opportunities</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Research Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-orange-600" />
              Research Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="researchTopic">Research Topic *</Label>
              <Input
                id="researchTopic"
                value={researchTopic}
                onChange={(e) => setResearchTopic(e.target.value)}
                placeholder="Enter the main topic you want to research"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry/Niche *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology/Software</SelectItem>
                  <SelectItem value="healthcare">Healthcare/Medical</SelectItem>
                  <SelectItem value="finance">Finance/Fintech</SelectItem>
                  <SelectItem value="education">Education/E-learning</SelectItem>
                  <SelectItem value="ecommerce">E-commerce/Retail</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="fitness">Fitness/Wellness</SelectItem>
                  <SelectItem value="food">Food/Restaurant</SelectItem>
                  <SelectItem value="travel">Travel/Tourism</SelectItem>
                  <SelectItem value="fashion">Fashion/Beauty</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="entertainment">Entertainment/Media</SelectItem>
                  <SelectItem value="b2b-services">B2B Services</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="researchDepth">Research Depth</Label>
              <Select value={researchDepth} onValueChange={setResearchDepth}>
                <SelectTrigger>
                  <SelectValue placeholder="Select research depth" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="surface">Surface Level Overview</SelectItem>
                  <SelectItem value="moderate">Moderate Analysis</SelectItem>
                  <SelectItem value="deep">Deep Dive Research</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Study</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeframe">Research Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current State Only</SelectItem>
                  <SelectItem value="3-months">Last 3 Months</SelectItem>
                  <SelectItem value="6-months">Last 6 Months</SelectItem>
                  <SelectItem value="1-year">Last 12 Months</SelectItem>
                  <SelectItem value="multi-year">Multi-Year Trends</SelectItem>
                  <SelectItem value="seasonal">Seasonal Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="geographicFocus">Geographic Focus</Label>
              <Select value={geographicFocus} onValueChange={setGeographicFocus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select geographic focus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="global">Global</SelectItem>
                  <SelectItem value="north-america">North America</SelectItem>
                  <SelectItem value="usa">United States</SelectItem>
                  <SelectItem value="europe">Europe</SelectItem>
                  <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
                  <SelectItem value="latin-america">Latin America</SelectItem>
                  <SelectItem value="local">Local/Regional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Context Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Context Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (demographics, interests, behavior, needs)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="businessContext">Business Context</Label>
              <Textarea
                id="businessContext"
                value={businessContext}
                onChange={(e) => setBusinessContext(e.target.value)}
                placeholder="Describe your business goals, positioning, and how this research fits your strategy"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="currentKeywords">Current Keywords (if any)</Label>
              <Textarea
                id="currentKeywords"
                value={currentKeywords}
                onChange={(e) => setCurrentKeywords(e.target.value)}
                placeholder="List any keywords you're currently targeting or want to analyze"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="competitorAnalysis">Competitor Landscape</Label>
              <Textarea
                id="competitorAnalysis"
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="Who are your main competitors? What content strategies are they using?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Research Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Research Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  researchGoals.includes(goal.id)
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={researchGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {researchGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {researchGoals.map((goalId) => {
                const goal = goalOptions.find(g => g.id === goalId);
                return goal ? (
                  <Badge key={goalId} variant="secondary" className="flex items-center gap-1">
                    {goal.icon}
                    {goal.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600" />
            Content Formats (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Written Content', 'Social', 'Video', 'Audio', 'Visual', 'Long-form', 'Educational', 'Direct', 'PR', 'Commercial'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formatOptions
                    .filter(format => format.category === category)
                    .map((format) => (
                      <div
                        key={format.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          contentFormats.includes(format.id)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFormatToggle(format.id)}
                      >
                        <Checkbox
                          checked={contentFormats.includes(format.id)}
                          onChange={() => handleFormatToggle(format.id)}
                        />
                        <span className="text-sm">{format.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {contentFormats.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {contentFormats.slice(0, 8).map((formatId) => {
                const format = formatOptions.find(f => f.id === formatId);
                return format ? (
                  <Badge key={formatId} variant="secondary">
                    {format.label}
                  </Badge>
                ) : null;
              })}
              {contentFormats.length > 8 && (
                <Badge variant="outline">
                  +{contentFormats.length - 8} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateResearch}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
        >
          {isLoading ? (
            <>
              <TrendingUp className="w-4 h-4 mr-2 animate-spin" />
              Researching Topic...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Generate Research Report
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">AI Assistant Response</h3>
          <BotChatInterface sessionId={sessionId} botType="topic-research" />
        </div>
      )}
    </div>
  );
}