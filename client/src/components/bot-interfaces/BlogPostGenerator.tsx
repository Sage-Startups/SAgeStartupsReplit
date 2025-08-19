import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { FileText, PenTool, Users, Target, Search, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface BlogPostGeneratorProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function BlogPostGenerator({ onSendMessage, isLoading, sessionId }: BlogPostGeneratorProps) {
  const [blogTopic, setBlogTopic] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [postLength, setPostLength] = useState('');
  const [contentType, setContentType] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentGoals, setContentGoals] = useState<string[]>([]);
  const [industryContext, setIndustryContext] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [callToAction, setCallToAction] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [includeSections, setIncludeSections] = useState<string[]>([]);

  const goalOptions = [
    { id: 'educate', label: 'Educate Audience', icon: <Target className="w-4 h-4" /> },
    { id: 'generate-leads', label: 'Generate Leads', icon: <Target className="w-4 h-4" /> },
    { id: 'build-authority', label: 'Build Authority', icon: <Target className="w-4 h-4" /> },
    { id: 'drive-traffic', label: 'Drive Website Traffic', icon: <Target className="w-4 h-4" /> },
    { id: 'increase-engagement', label: 'Increase Engagement', icon: <Target className="w-4 h-4" /> },
    { id: 'seo-ranking', label: 'Improve SEO Rankings', icon: <Search className="w-4 h-4" /> },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: <Target className="w-4 h-4" /> },
    { id: 'product-promotion', label: 'Product Promotion', icon: <Target className="w-4 h-4" /> }
  ];

  const sectionOptions = [
    { id: 'intro', label: 'Introduction', description: 'Engaging opening paragraph' },
    { id: 'problem', label: 'Problem Statement', description: 'Define the challenge or issue' },
    { id: 'solution', label: 'Solution/How-to', description: 'Actionable steps or solutions' },
    { id: 'examples', label: 'Examples/Case Studies', description: 'Real-world examples' },
    { id: 'statistics', label: 'Data & Statistics', description: 'Supporting research and numbers' },
    { id: 'quotes', label: 'Expert Quotes', description: 'Industry expert insights' },
    { id: 'tips', label: 'Pro Tips', description: 'Additional actionable advice' },
    { id: 'resources', label: 'Additional Resources', description: 'Links and further reading' },
    { id: 'conclusion', label: 'Conclusion', description: 'Summary and key takeaways' },
    { id: 'cta', label: 'Call-to-Action', description: 'Next steps for readers' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setContentGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleSectionToggle = (sectionId: string) => {
    setIncludeSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const handleGenerateBlogPost = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => contentGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedSectionLabels = sectionOptions
      .filter(section => includeSections.includes(section.id))
      .map(section => section.label);

    const message = `Write a comprehensive blog post with the following specifications:

**Blog Post Topic & Focus:**
- Main Topic: ${blogTopic}
- Target Keywords: ${keywords}
- Industry Context: ${industryContext}

**Content Specifications:**
- Post Length: ${postLength}
- Content Type: ${contentType}
- Writing Style: ${writingStyle}
- Brand Voice: ${brandVoice}

**Audience & Goals:**
- Target Audience: ${targetAudience}
- Content Goals: ${selectedGoalLabels.join(', ')}
- Desired Call-to-Action: ${callToAction}

**Structure Requirements:**
- Include These Sections: ${selectedSectionLabels.join(', ')}

**Competitive Context:**
${competitorAnalysis}

Please create a full, ready-to-publish blog post that includes:

1. **SEO-Optimized Title**
   - Compelling and keyword-rich headline
   - Multiple title variations to choose from
   - Meta description suggestion

2. **Complete Article Content**
   - Engaging introduction that hooks readers
   - Well-structured body with clear headings
   - Actionable insights and practical advice
   - Supporting examples and data where relevant
   - Natural keyword integration for SEO

3. **Visual Content Suggestions**
   - Recommended images, infographics, or charts
   - Alt text suggestions for accessibility
   - Featured image recommendations

4. **SEO Elements**
   - Header tags (H1, H2, H3) structure
   - Internal linking opportunities
   - External link suggestions to authoritative sources
   - Schema markup recommendations

5. **Engagement Features**
   - Pull quotes for social sharing
   - Discussion questions for comments
   - Social media snippet suggestions
   - Email newsletter excerpt

6. **Call-to-Action Integration**
   - Natural CTA placement throughout the post
   - Multiple CTA variations
   - Lead magnet suggestions if applicable

7. **Publishing Checklist**
   - Pre-publication optimization tips
   - Social media promotion strategy
   - Follow-up content ideas

Make this a complete, professional blog post that's ready to publish and optimized for both readers and search engines. The content should be original, valuable, and aligned with the specified goals and audience.`;

    onSendMessage(message);
  };

  const isFormValid = blogTopic && targetAudience && writingStyle && postLength && contentGoals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <PenTool className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Post Generator</h2>
          <p className="text-gray-600">Generate complete, SEO-optimized blog articles ready for publication</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Content Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="blogTopic">Blog Topic/Title *</Label>
              <Input
                id="blogTopic"
                value={blogTopic}
                onChange={(e) => setBlogTopic(e.target.value)}
                placeholder="Enter your blog post topic or working title"
              />
            </div>

            <div>
              <Label htmlFor="keywords">Target Keywords</Label>
              <Input
                id="keywords"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="primary keyword, secondary keyword, long-tail keywords"
              />
            </div>

            <div>
              <Label htmlFor="postLength">Post Length *</Label>
              <Select value={postLength} onValueChange={setPostLength}>
                <SelectTrigger>
                  <SelectValue placeholder="Select post length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short (800-1,200 words)</SelectItem>
                  <SelectItem value="medium">Medium (1,200-2,000 words)</SelectItem>
                  <SelectItem value="long">Long (2,000-3,000 words)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive (3,000+ words)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contentType">Content Type</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="how-to">How-to Guide</SelectItem>
                  <SelectItem value="listicle">List Article</SelectItem>
                  <SelectItem value="opinion">Opinion/Thought Leadership</SelectItem>
                  <SelectItem value="news">News/Industry Update</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="comparison">Product/Service Comparison</SelectItem>
                  <SelectItem value="interview">Interview/Q&A</SelectItem>
                  <SelectItem value="review">Review/Analysis</SelectItem>
                  <SelectItem value="beginner-guide">Beginner's Guide</SelectItem>
                  <SelectItem value="trends">Trends/Predictions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industryContext">Industry/Niche</Label>
              <Input
                id="industryContext"
                value={industryContext}
                onChange={(e) => setIndustryContext(e.target.value)}
                placeholder="e.g., SaaS, E-commerce, Healthcare, Finance, etc."
              />
            </div>
          </CardContent>
        </Card>

        {/* Style & Audience */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Style & Audience
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target readers (role, experience level, interests, pain points)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="writingStyle">Writing Style *</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional/Business</SelectItem>
                  <SelectItem value="conversational">Conversational/Friendly</SelectItem>
                  <SelectItem value="academic">Academic/Research-based</SelectItem>
                  <SelectItem value="casual">Casual/Informal</SelectItem>
                  <SelectItem value="authoritative">Authoritative/Expert</SelectItem>
                  <SelectItem value="storytelling">Storytelling/Narrative</SelectItem>
                  <SelectItem value="technical">Technical/Detailed</SelectItem>
                  <SelectItem value="inspirational">Inspirational/Motivational</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice/Tone</Label>
              <Textarea
                id="brandVoice"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="Describe your brand's personality and tone (helpful, innovative, trustworthy, etc.)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="callToAction">Desired Call-to-Action</Label>
              <Textarea
                id="callToAction"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="What action do you want readers to take? (subscribe, download, contact, purchase, etc.)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="competitorAnalysis">Competitive Content Analysis</Label>
              <Textarea
                id="competitorAnalysis"
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="Any competitor content on this topic? What gaps can we fill or improve upon?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Content Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  contentGoals.includes(goal.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={contentGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {contentGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {contentGoals.map((goalId) => {
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

      {/* Content Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Content Structure (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sectionOptions.map((section) => (
              <div
                key={section.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  includeSections.includes(section.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSectionToggle(section.id)}
              >
                <Checkbox
                  checked={includeSections.includes(section.id)}
                  onChange={() => handleSectionToggle(section.id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-sm">{section.label}</div>
                  <div className="text-xs text-gray-600">{section.description}</div>
                </div>
              </div>
            ))}
          </div>
          {includeSections.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {includeSections.slice(0, 6).map((sectionId) => {
                const section = sectionOptions.find(s => s.id === sectionId);
                return section ? (
                  <Badge key={sectionId} variant="secondary">
                    {section.label}
                  </Badge>
                ) : null;
              })}
              {includeSections.length > 6 && (
                <Badge variant="outline">
                  +{includeSections.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateBlogPost}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Writing Blog Post...
            </>
          ) : (
            <>
              <PenTool className="w-4 h-4 mr-2" />
              Generate Blog Post
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">AI Assistant Response</h3>
          <BotChatInterface sessionId={sessionId} botType="blog-generator" />
        </div>
      )}
    </div>
  );
}