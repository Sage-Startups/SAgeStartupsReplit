import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Target, Zap, Share2, Clock, ArrowRightLeft } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ContentRepurposerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ContentRepurposer({ onSendMessage, isLoading, sessionId }: ContentRepurposerProps) {
  const [originalContent, setOriginalContent] = useState('');
  const [contentType, setContentType] = useState('');
  const [targetFormats, setTargetFormats] = useState<string[]>([]);
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([]);
  const [contentGoals, setContentGoals] = useState<string[]>([]);
  const [brandGuidelines, setBrandGuidelines] = useState('');
  const [targetAudiences, setTargetAudiences] = useState('');
  const [keyMessages, setKeyMessages] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [performanceData, setPerformanceData] = useState('');

  const formatOptions = [
    { id: 'blog-post', label: 'Blog Post', category: 'Long-form' },
    { id: 'social-posts', label: 'Social Media Posts', category: 'Social' },
    { id: 'infographic', label: 'Infographic', category: 'Visual' },
    { id: 'video-script', label: 'Video Script', category: 'Video' },
    { id: 'podcast-episode', label: 'Podcast Episode', category: 'Audio' },
    { id: 'email-newsletter', label: 'Email Newsletter', category: 'Email' },
    { id: 'carousel-slides', label: 'Carousel Slides', category: 'Social' },
    { id: 'thread', label: 'Twitter Thread', category: 'Social' },
    { id: 'presentation', label: 'Presentation', category: 'Visual' },
    { id: 'case-study', label: 'Case Study', category: 'Long-form' },
    { id: 'ebook-chapter', label: 'eBook Chapter', category: 'Long-form' },
    { id: 'whitepaper', label: 'Whitepaper', category: 'Long-form' }
  ];

  const platformOptions = [
    { id: 'linkedin', label: 'LinkedIn', category: 'Professional' },
    { id: 'twitter', label: 'Twitter/X', category: 'Social' },
    { id: 'facebook', label: 'Facebook', category: 'Social' },
    { id: 'instagram', label: 'Instagram', category: 'Visual' },
    { id: 'youtube', label: 'YouTube', category: 'Video' },
    { id: 'tiktok', label: 'TikTok', category: 'Short Video' },
    { id: 'medium', label: 'Medium', category: 'Publishing' },
    { id: 'newsletter', label: 'Email Newsletter', category: 'Direct' },
    { id: 'website-blog', label: 'Website Blog', category: 'Owned' },
    { id: 'reddit', label: 'Reddit', category: 'Community' },
    { id: 'quora', label: 'Quora', category: 'Q&A' },
    { id: 'pinterest', label: 'Pinterest', category: 'Visual' }
  ];

  const goalOptions = [
    { id: 'reach-expansion', label: 'Expand Reach', icon: <Share2 className="w-4 h-4" /> },
    { id: 'engagement-boost', label: 'Boost Engagement', icon: <Target className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Generate Leads', icon: <Target className="w-4 h-4" /> },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: <Target className="w-4 h-4" /> },
    { id: 'thought-leadership', label: 'Thought Leadership', icon: <Target className="w-4 h-4" /> },
    { id: 'traffic-drive', label: 'Drive Website Traffic', icon: <Target className="w-4 h-4" /> },
    { id: 'community-building', label: 'Community Building', icon: <Target className="w-4 h-4" /> },
    { id: 'education', label: 'Educate Audience', icon: <Target className="w-4 h-4" /> }
  ];

  const handleFormatToggle = (formatId: string) => {
    setTargetFormats(prev => 
      prev.includes(formatId) 
        ? prev.filter(id => id !== formatId)
        : [...prev, formatId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setTargetPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGoalToggle = (goalId: string) => {
    setContentGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleRepurposeContent = () => {
    const selectedFormatLabels = formatOptions
      .filter(format => targetFormats.includes(format.id))
      .map(format => format.label);
    
    const selectedPlatformLabels = platformOptions
      .filter(platform => targetPlatforms.includes(platform.id))
      .map(platform => platform.label);
    
    const selectedGoalLabels = goalOptions
      .filter(goal => contentGoals.includes(goal.id))
      .map(goal => goal.label);

    const message = `Repurpose and adapt content for multiple formats and platforms:

**Original Content Information:**
- Title: ${contentTitle}
- Current Format: ${contentType}
- Key Messages: ${keyMessages}
- Performance Data: ${performanceData}

**Repurposing Strategy:**
- Target Formats: ${selectedFormatLabels.join(', ')}
- Target Platforms: ${selectedPlatformLabels.join(', ')}
- Content Goals: ${selectedGoalLabels.join(', ')}

**Brand & Audience Context:**
- Brand Guidelines: ${brandGuidelines}
- Target Audiences: ${targetAudiences}

**ORIGINAL CONTENT TO REPURPOSE:**
${originalContent}

Please provide:

1. **Multi-Format Content Adaptations**
   - Complete content versions for each selected format
   - Format-specific optimizations and best practices
   - Length and structure adjustments
   - Call-to-action adaptations

2. **Platform-Specific Optimizations**
   - Platform-tailored content versions
   - Character limits and formatting requirements
   - Hashtag and tagging strategies
   - Optimal posting times and frequencies

3. **Content Distribution Strategy**
   - Content calendar for multi-platform rollout
   - Cross-promotion opportunities
   - Sequencing and timing recommendations
   - Platform-specific engagement tactics

4. **Value Maximization Framework**
   - Content atomization strategy
   - Micro-content creation from main piece
   - Quote cards and visual snippets
   - Key takeaway highlights

5. **Format Conversion Guidelines**
   - Long-form to short-form adaptations
   - Visual content creation suggestions
   - Audio/video script development
   - Interactive content opportunities

6. **Audience Targeting Adjustments**
   - Platform-specific audience considerations
   - Tone and messaging adaptations
   - Cultural and demographic adjustments
   - Professional vs casual variations

7. **Performance Optimization**
   - SEO optimizations for each format
   - Engagement-driving elements
   - Social proof integration
   - Conversion optimization tactics

8. **Content Series Development**
   - Multi-part content series creation
   - Episodic content planning
   - Sequel and follow-up content ideas
   - Franchise development opportunities

Provide ready-to-use content adaptations with specific formatting, optimal posting strategies, and performance tracking recommendations for each platform and format.`;

    onSendMessage(message);
  };

  const isFormValid = originalContent && contentType && targetFormats.length > 0 && targetPlatforms.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Repurposer</h2>
          <p className="text-gray-600">Transform content for multiple formats, platforms, and audiences to maximize reach and engagement</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-green-600" />
              Original Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentTitle">Content Title</Label>
              <Input
                id="contentTitle"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter the title of your original content"
              />
            </div>

            <div>
              <Label htmlFor="contentType">Current Format *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="podcast">Podcast Episode</SelectItem>
                  <SelectItem value="presentation">Presentation</SelectItem>
                  <SelectItem value="whitepaper">Whitepaper</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="social-post">Social Media Post</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keyMessages">Key Messages</Label>
              <Textarea
                id="keyMessages"
                value={keyMessages}
                onChange={(e) => setKeyMessages(e.target.value)}
                placeholder="What are the main points and key takeaways from your content?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="performanceData">Performance Data (Optional)</Label>
              <Textarea
                id="performanceData"
                value={performanceData}
                onChange={(e) => setPerformanceData(e.target.value)}
                placeholder="How did this content perform? Views, engagement, conversions, etc."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Strategy Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Strategy Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudiences">Target Audiences</Label>
              <Textarea
                id="targetAudiences"
                value={targetAudiences}
                onChange={(e) => setTargetAudiences(e.target.value)}
                placeholder="Describe your different audience segments for various platforms"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandGuidelines">Brand Guidelines</Label>
              <Textarea
                id="brandGuidelines"
                value={brandGuidelines}
                onChange={(e) => setBrandGuidelines(e.target.value)}
                placeholder="Brand voice, tone, style guidelines, and messaging requirements"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Original Content Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-600" />
            Original Content *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={originalContent}
            onChange={(e) => setOriginalContent(e.target.value)}
            placeholder="Paste your original content here (text, script, outline, etc.)"
            rows={12}
            className="min-h-[300px]"
          />
          <div className="mt-2 text-sm text-gray-500">
            Word count: {originalContent.split(/\s+/).filter(word => word.length > 0).length} words
          </div>
        </CardContent>
      </Card>

      {/* Target Formats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Target Formats *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Long-form', 'Social', 'Visual', 'Video', 'Audio', 'Email'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formatOptions
                    .filter(format => format.category === category)
                    .map((format) => (
                      <div
                        key={format.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          targetFormats.includes(format.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleFormatToggle(format.id)}
                      >
                        <Checkbox
                          checked={targetFormats.includes(format.id)}
                          onChange={() => handleFormatToggle(format.id)}
                        />
                        <span className="text-sm">{format.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {targetFormats.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {targetFormats.slice(0, 6).map((formatId) => {
                const format = formatOptions.find(f => f.id === formatId);
                return format ? (
                  <Badge key={formatId} variant="secondary">
                    {format.label}
                  </Badge>
                ) : null;
              })}
              {targetFormats.length > 6 && (
                <Badge variant="outline">
                  +{targetFormats.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-600" />
            Target Platforms *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Professional', 'Social', 'Visual', 'Video', 'Short Video', 'Publishing', 'Direct', 'Owned', 'Community', 'Q&A'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {platformOptions
                    .filter(platform => platform.category === category)
                    .map((platform) => (
                      <div
                        key={platform.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          targetPlatforms.includes(platform.id)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <Checkbox
                          checked={targetPlatforms.includes(platform.id)}
                          onChange={() => handlePlatformToggle(platform.id)}
                        />
                        <span className="text-sm">{platform.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {targetPlatforms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {targetPlatforms.slice(0, 6).map((platformId) => {
                const platform = platformOptions.find(p => p.id === platformId);
                return platform ? (
                  <Badge key={platformId} variant="secondary">
                    {platform.label}
                  </Badge>
                ) : null;
              })}
              {targetPlatforms.length > 6 && (
                <Badge variant="outline">
                  +{targetPlatforms.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Content Goals (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  contentGoals.includes(goal.id)
                    ? 'border-green-500 bg-green-50'
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

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleRepurposeContent}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Repurposing Content...
            </>
          ) : (
            <>
              <RefreshCw className="w-4 h-4 mr-2" />
              Repurpose Content
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Repurposed Content & Distribution Strategy</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}