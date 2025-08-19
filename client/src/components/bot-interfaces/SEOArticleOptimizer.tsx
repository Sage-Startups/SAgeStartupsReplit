import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search, Target, BarChart3, Lightbulb, Zap, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface SEOArticleOptimizerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function SEOArticleOptimizer({ onSendMessage, isLoading, sessionId }: SEOArticleOptimizerProps) {
  const [articleTitle, setArticleTitle] = useState('');
  const [articleContent, setArticleContent] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [secondaryKeywords, setSecondaryKeywords] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [contentGoal, setContentGoal] = useState('');
  const [optimizationFocus, setOptimizationFocus] = useState<string[]>([]);
  const [competitorUrls, setCompetitorUrls] = useState('');
  const [currentMetaDescription, setCurrentMetaDescription] = useState('');
  const [industryContext, setIndustryContext] = useState('');

  const focusOptions = [
    { id: 'keyword-density', label: 'Keyword Density Optimization', icon: <Target className="w-4 h-4" /> },
    { id: 'header-tags', label: 'Header Tags (H1-H6)', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'meta-tags', label: 'Meta Tags & Descriptions', icon: <Search className="w-4 h-4" /> },
    { id: 'internal-linking', label: 'Internal Linking Strategy', icon: <Zap className="w-4 h-4" /> },
    { id: 'readability', label: 'Readability & User Experience', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'featured-snippets', label: 'Featured Snippet Optimization', icon: <Target className="w-4 h-4" /> },
    { id: 'image-alt-text', label: 'Image Alt Text & SEO', icon: <Search className="w-4 h-4" /> },
    { id: 'schema-markup', label: 'Schema Markup Suggestions', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const handleFocusToggle = (focusId: string) => {
    setOptimizationFocus(prev => 
      prev.includes(focusId) 
        ? prev.filter(id => id !== focusId)
        : [...prev, focusId]
    );
  };

  const handleOptimizeArticle = () => {
    const selectedFocusLabels = focusOptions
      .filter(focus => optimizationFocus.includes(focus.id))
      .map(focus => focus.label);

    const message = `Please provide comprehensive SEO optimization for this article:

**Article Information:**
- Title: ${articleTitle}
- Target Keyword: ${targetKeyword}
- Secondary Keywords: ${secondaryKeywords}
- Industry/Niche: ${industryContext}

**Content Goal:** ${contentGoal}
**Target Audience:** ${targetAudience}

**Current Meta Description:** ${currentMetaDescription}

**Optimization Focus Areas:** ${selectedFocusLabels.join(', ')}

**Competitor Analysis:** ${competitorUrls}

**ARTICLE CONTENT TO OPTIMIZE:**
${articleContent}

Please provide:

1. **SEO Score & Analysis**
   - Overall SEO score (0-100)
   - Keyword density analysis
   - Readability score and improvements
   - Content length recommendations

2. **Keyword Optimization**
   - Primary keyword placement suggestions
   - Secondary keyword integration opportunities
   - Long-tail keyword variations to include
   - Keyword cannibalization warnings

3. **Meta Tag Optimization**
   - Optimized title tag (under 60 characters)
   - Meta description (150-160 characters)
   - Meta keywords suggestions
   - Open Graph tags for social sharing

4. **Content Structure Improvements**
   - Header tag optimization (H1, H2, H3 suggestions)
   - Content outline improvements
   - Paragraph structure enhancements
   - Bullet points and formatting tips

5. **Technical SEO Recommendations**
   - Internal linking opportunities
   - External linking suggestions
   - Image optimization and alt text
   - Schema markup recommendations

6. **Featured Snippet Optimization**
   - Question-based content opportunities
   - List and table formatting suggestions
   - How-to step optimization
   - Definition and summary boxes

7. **Competitive Advantage**
   - Content gaps to fill vs competitors
   - Unique value propositions to highlight
   - Authority-building opportunities
   - Differentiation strategies

8. **Implementation Checklist**
   - Priority order for optimizations
   - Quick wins (immediate improvements)
   - Long-term SEO strategy
   - Performance tracking metrics

Provide specific, actionable recommendations with examples and before/after comparisons where helpful.`;

    onSendMessage(message);
  };

  const isFormValid = articleTitle && articleContent && targetKeyword && optimizationFocus.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <Search className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">SEO Article Optimizer</h2>
          <p className="text-gray-600">Optimize your content for search engines with keyword integration and technical SEO improvements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Article Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Article Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="articleTitle">Article Title *</Label>
              <Input
                id="articleTitle"
                value={articleTitle}
                onChange={(e) => setArticleTitle(e.target.value)}
                placeholder="Enter your current article title"
              />
            </div>

            <div>
              <Label htmlFor="targetKeyword">Primary Target Keyword *</Label>
              <Input
                id="targetKeyword"
                value={targetKeyword}
                onChange={(e) => setTargetKeyword(e.target.value)}
                placeholder="e.g., 'digital marketing strategy'"
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
              <Label htmlFor="industryContext">Industry/Niche</Label>
              <Input
                id="industryContext"
                value={industryContext}
                onChange={(e) => setIndustryContext(e.target.value)}
                placeholder="e.g., SaaS, E-commerce, Healthcare"
              />
            </div>

            <div>
              <Label htmlFor="currentMetaDescription">Current Meta Description</Label>
              <Textarea
                id="currentMetaDescription"
                value={currentMetaDescription}
                onChange={(e) => setCurrentMetaDescription(e.target.value)}
                placeholder="Your current meta description (if any)"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Content Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentGoal">Content Goal</Label>
              <Select value={contentGoal} onValueChange={setContentGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inform">Inform/Educate</SelectItem>
                  <SelectItem value="convert">Convert/Sell</SelectItem>
                  <SelectItem value="engage">Engage/Entertain</SelectItem>
                  <SelectItem value="authority">Build Authority</SelectItem>
                  <SelectItem value="traffic">Drive Traffic</SelectItem>
                  <SelectItem value="leads">Generate Leads</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target readers (demographics, expertise level, interests)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="competitorUrls">Competitor Articles (URLs)</Label>
              <Textarea
                id="competitorUrls"
                value={competitorUrls}
                onChange={(e) => setCompetitorUrls(e.target.value)}
                placeholder="https://competitor1.com/article
https://competitor2.com/article"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Article Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Article Content *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
            placeholder="Paste your complete article content here for SEO optimization..."
            rows={12}
            className="min-h-[300px]"
          />
          <div className="mt-2 text-sm text-gray-500">
            Word count: {articleContent.split(/\s+/).filter(word => word.length > 0).length} words
          </div>
        </CardContent>
      </Card>

      {/* Optimization Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            SEO Optimization Focus *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {focusOptions.map((focus) => (
              <div
                key={focus.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  optimizationFocus.includes(focus.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFocusToggle(focus.id)}
              >
                <Checkbox
                  checked={optimizationFocus.includes(focus.id)}
                  onChange={() => handleFocusToggle(focus.id)}
                />
                <div className="flex items-center gap-2">
                  {focus.icon}
                  <span className="text-sm font-medium">{focus.label}</span>
                </div>
              </div>
            ))}
          </div>
          {optimizationFocus.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {optimizationFocus.map((focusId) => {
                const focus = focusOptions.find(f => f.id === focusId);
                return focus ? (
                  <Badge key={focusId} variant="secondary" className="flex items-center gap-1">
                    {focus.icon}
                    {focus.label}
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
          onClick={handleOptimizeArticle}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Optimizing Article...
            </>
          ) : (
            <>
              <Search className="w-4 h-4 mr-2" />
              Optimize for SEO
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">SEO Optimization Results</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}