import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Target, MousePointer, BarChart3, Eye, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface MetaDescriptionWriterProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function MetaDescriptionWriter({ onSendMessage, isLoading, sessionId }: MetaDescriptionWriterProps) {
  const [pageTitle, setPageTitle] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [primaryKeyword, setPrimaryKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [pageType, setPageType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [optimizationGoals, setOptimizationGoals] = useState<string[]>([]);
  const [brandVoice, setBrandVoice] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [currentMetaDescription, setCurrentMetaDescription] = useState('');

  const goalOptions = [
    { id: 'click-through', label: 'Maximize Click-Through Rate', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'search-ranking', label: 'Improve Search Rankings', icon: <Search className="w-4 h-4" /> },
    { id: 'user-intent', label: 'Match User Intent', icon: <Target className="w-4 h-4" /> },
    { id: 'brand-awareness', label: 'Increase Brand Awareness', icon: <Eye className="w-4 h-4" /> },
    { id: 'conversions', label: 'Drive Conversions', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'local-seo', label: 'Local SEO Optimization', icon: <Target className="w-4 h-4" /> },
    { id: 'featured-snippets', label: 'Featured Snippet Targeting', icon: <Search className="w-4 h-4" /> },
    { id: 'mobile-optimization', label: 'Mobile Search Optimization', icon: <Target className="w-4 h-4" /> }
  ];

  const handleGoalToggle = (goalId: string) => {
    setOptimizationGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleWriteMetaDescriptions = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => optimizationGoals.includes(goal.id))
      .map(goal => goal.label);

    const message = `Create optimized meta descriptions for SERP performance and click-through optimization:

**Page Information:**
- Page Title: ${pageTitle}
- Page Type: ${pageType}
- Primary Keyword: ${primaryKeyword}
- Secondary Keywords: ${secondaryKeywords}
- Business Type: ${businessType}

**Current Meta Description:** ${currentMetaDescription}

**Content Context:**
- Target Audience: ${targetAudience}
- Brand Voice: ${brandVoice}
- Optimization Goals: ${selectedGoalLabels.join(', ')}

**Competitive Analysis:** ${competitorAnalysis}

**PAGE CONTENT SUMMARY:**
${pageContent}

Please provide:

1. **Primary Meta Description Collection (8-12 variations)**
   - Optimized 150-160 character descriptions
   - Keyword-rich but natural language
   - Compelling calls-to-action
   - Emotional triggers and benefits

2. **SERP Optimization Analysis**
   - Character count optimization (150-160 chars)
   - Keyword placement strategy
   - Search intent alignment
   - Mobile SERP considerations

3. **Click-Through Rate Optimization**
   - Psychological triggers implementation
   - Urgency and scarcity elements
   - Benefit-focused messaging
   - Action-oriented language

4. **Search Snippet Enhancement**
   - Title tag and meta description synergy
   - Rich snippet opportunities
   - Schema markup recommendations
   - Featured snippet optimization

5. **A/B Testing Framework**
   - Test variations for split testing
   - Performance metrics to track
   - Testing duration recommendations
   - Success benchmarks

6. **Competitive Advantage**
   - Differentiation from competitors
   - Unique value proposition highlights
   - Market positioning elements
   - Brand personality integration

7. **Technical SEO Considerations**
   - Google guidelines compliance
   - Truncation prevention strategies
   - Special character usage
   - Local SEO optimizations (if applicable)

8. **Performance Prediction & Tracking**
   - Expected CTR improvements
   - Search ranking impact
   - Conversion potential
   - Monitoring recommendations

Format meta descriptions clearly with character counts, optimization explanations, and performance predictions for each variation.`;

    onSendMessage(message);
  };

  const isFormValid = pageTitle && primaryKeyword && pageType && optimizationGoals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Meta Description Writer</h2>
          <p className="text-gray-600">Create SERP-optimized meta descriptions that maximize click-through rates and search performance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-600" />
              Page Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="pageTitle">Page Title *</Label>
              <Input
                id="pageTitle"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                placeholder="Enter the page title/H1"
              />
            </div>

            <div>
              <Label htmlFor="pageType">Page Type *</Label>
              <Select value={pageType} onValueChange={setPageType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="homepage">Homepage</SelectItem>
                  <SelectItem value="product">Product Page</SelectItem>
                  <SelectItem value="service">Service Page</SelectItem>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="category">Category Page</SelectItem>
                  <SelectItem value="about">About Page</SelectItem>
                  <SelectItem value="contact">Contact Page</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="pricing">Pricing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="primaryKeyword">Primary Keyword *</Label>
              <Input
                id="primaryKeyword"
                value={primaryKeyword}
                onChange={(e) => setPrimaryKeyword(e.target.value)}
                placeholder="Main keyword to target"
              />
            </div>

            <div>
              <Label htmlFor="secondaryKeywords">Secondary Keywords</Label>
              <Input
                id="secondaryKeywords"
                value={secondaryKeywords}
                onChange={(e) => setSecondaryKeywords(e.target.value)}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="service">Service Business</SelectItem>
                  <SelectItem value="local">Local Business</SelectItem>
                  <SelectItem value="blog">Blog/Media</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentMetaDescription">Current Meta Description</Label>
              <Textarea
                id="currentMetaDescription"
                value={currentMetaDescription}
                onChange={(e) => setCurrentMetaDescription(e.target.value)}
                placeholder="Paste current meta description to improve (if any)"
                rows={3}
              />
              <div className="mt-1 text-sm text-gray-500">
                Character count: {currentMetaDescription.length}/160
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Context & Strategy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-600" />
              Context & Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Who is searching for this page? (demographics, intent, needs)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice & Tone</Label>
              <Select value={brandVoice} onValueChange={setBrandVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand voice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="urgent">Urgent & Direct</SelectItem>
                  <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                  <SelectItem value="innovative">Innovative & Modern</SelectItem>
                  <SelectItem value="luxury">Premium & Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="competitorAnalysis">Competitor Analysis</Label>
              <Textarea
                id="competitorAnalysis"
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="List competitor meta descriptions or URLs for analysis"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Page Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-600" />
            Page Content Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={pageContent}
            onChange={(e) => setPageContent(e.target.value)}
            placeholder="Describe what this page is about, key benefits, features, or main content points..."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Optimization Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-cyan-600" />
            Optimization Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  optimizationGoals.includes(goal.id)
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={optimizationGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {optimizationGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {optimizationGoals.map((goalId) => {
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

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleWriteMetaDescriptions}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Writing Meta Descriptions...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Generate Meta Descriptions
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Optimized Meta Descriptions & SERP Strategy</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}