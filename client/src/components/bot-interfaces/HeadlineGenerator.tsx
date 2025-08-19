import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Zap, Target, BarChart3, MousePointer, Eye, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface HeadlineGeneratorProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function HeadlineGenerator({ onSendMessage, isLoading, sessionId }: HeadlineGeneratorProps) {
  const [contentTopic, setContentTopic] = useState('');
  const [contentType, setContentType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [headlineGoals, setHeadlineGoals] = useState<string[]>([]);
  const [emotionalTriggers, setEmotionalTriggers] = useState<string[]>([]);
  const [keyBenefits, setKeyBenefits] = useState('');
  const [brandTone, setBrandTone] = useState('');
  const [competitorHeadlines, setCompetitorHeadlines] = useState('');
  const [platform, setPlatform] = useState('');
  const [characterLimit, setCharacterLimit] = useState('');

  const goalOptions = [
    { id: 'click-through', label: 'Maximize Click-Through', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'engagement', label: 'Drive Engagement', icon: <Target className="w-4 h-4" /> },
    { id: 'conversions', label: 'Boost Conversions', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: <Eye className="w-4 h-4" /> },
    { id: 'social-shares', label: 'Social Sharing', icon: <Target className="w-4 h-4" /> },
    { id: 'search-ranking', label: 'SEO Ranking', icon: <Target className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Lead Generation', icon: <Target className="w-4 h-4" /> },
    { id: 'email-opens', label: 'Email Opens', icon: <Target className="w-4 h-4" /> }
  ];

  const triggerOptions = [
    { id: 'urgency', label: 'Urgency', example: 'Limited time, Act now' },
    { id: 'curiosity', label: 'Curiosity', example: 'Secret, Hidden truth' },
    { id: 'fear', label: 'Fear of Missing Out', example: 'Don\'t miss, Last chance' },
    { id: 'benefit', label: 'Clear Benefit', example: 'Save money, Get results' },
    { id: 'social-proof', label: 'Social Proof', example: 'Trusted by thousands' },
    { id: 'authority', label: 'Authority', example: 'Expert reveals, Science proves' },
    { id: 'controversy', label: 'Controversy', example: 'Shocking truth, Myth busted' },
    { id: 'personalization', label: 'Personalization', example: 'For you, Your solution' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setHeadlineGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleTriggerToggle = (triggerId: string) => {
    setEmotionalTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  const handleGenerateHeadlines = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => headlineGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedTriggerLabels = triggerOptions
      .filter(trigger => emotionalTriggers.includes(trigger.id))
      .map(trigger => trigger.label);

    const message = `Generate high-converting headlines with A/B testing variations and optimization advice:

**Content Information:**
- Topic/Subject: ${contentTopic}
- Content Type: ${contentType}
- Platform: ${platform}
- Character Limit: ${characterLimit}

**Audience & Goals:**
- Target Audience: ${targetAudience}
- Headline Goals: ${selectedGoalLabels.join(', ')}
- Emotional Triggers: ${selectedTriggerLabels.join(', ')}

**Brand & Context:**
- Brand Tone: ${brandTone}
- Key Benefits to Highlight: ${keyBenefits}

**Competitive Analysis:** ${competitorHeadlines}

Please provide:

1. **Primary Headlines Collection (20-30 variations)**
   - High-converting headline variations
   - Different angles and approaches
   - Varying lengths for different platforms
   - Power word integration

2. **A/B Testing Framework**
   - Test Group A vs B headline pairs
   - Testing methodology and duration
   - Success metrics to track
   - Statistical significance guidelines

3. **Click Optimization Analysis**
   - Psychological triggers used in each headline
   - Emotional impact scoring (1-10)
   - Predicted click-through rates
   - Engagement potential assessment

4. **Platform-Specific Optimizations**
   - Headlines optimized for each platform
   - Character count variations
   - Platform best practices integration
   - Visual presentation recommendations

5. **Performance Prediction**
   - Expected performance ranking
   - Audience resonance scoring
   - Conversion potential analysis
   - Risk vs reward assessment

6. **Headline Categories**
   - Question-based headlines
   - Benefit-driven headlines
   - How-to and listicle headlines
   - Urgency and scarcity headlines
   - Authority and credibility headlines

7. **Testing Schedule & Strategy**
   - A/B testing timeline (2-4 weeks)
   - Sample size requirements
   - Performance benchmarks
   - Optimization iteration plan

8. **Advanced Optimization Tips**
   - Power words and trigger phrases
   - Headline structure formulas
   - Psychological principles application
   - Common mistakes to avoid

Format headlines clearly with performance predictions, testing recommendations, and actionable optimization advice.`;

    onSendMessage(message);
  };

  const isFormValid = contentTopic && contentType && targetAudience && headlineGoals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Headline Generator</h2>
          <p className="text-gray-600">Create click-worthy headlines with A/B testing variations and optimization strategies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-yellow-600" />
              Content Setup
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentTopic">Content Topic/Subject *</Label>
              <Input
                id="contentTopic"
                value={contentTopic}
                onChange={(e) => setContentTopic(e.target.value)}
                placeholder="e.g., '10 Marketing Strategies for Small Business'"
              />
            </div>

            <div>
              <Label htmlFor="contentType">Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="email-subject">Email Subject Line</SelectItem>
                  <SelectItem value="social-media">Social Media Post</SelectItem>
                  <SelectItem value="youtube-video">YouTube Video</SelectItem>
                  <SelectItem value="podcast">Podcast Episode</SelectItem>
                  <SelectItem value="webinar">Webinar</SelectItem>
                  <SelectItem value="ebook">eBook/Guide</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="product-page">Product Page</SelectItem>
                  <SelectItem value="landing-page">Landing Page</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="platform">Primary Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website/Blog</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="google-ads">Google Ads</SelectItem>
                  <SelectItem value="multiple">Multiple Platforms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="characterLimit">Character Limit</Label>
              <Select value={characterLimit} onValueChange={setCharacterLimit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select character limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 characters (Ads)</SelectItem>
                  <SelectItem value="60">60 characters (Title Tags)</SelectItem>
                  <SelectItem value="100">100 characters (Social)</SelectItem>
                  <SelectItem value="160">160 characters (Email)</SelectItem>
                  <SelectItem value="unlimited">No Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="keyBenefits">Key Benefits to Highlight</Label>
              <Textarea
                id="keyBenefits"
                value={keyBenefits}
                onChange={(e) => setKeyBenefits(e.target.value)}
                placeholder="What benefits, results, or value does your content provide?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audience & Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-yellow-600" />
              Audience & Brand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (demographics, interests, pain points)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandTone">Brand Tone & Voice</Label>
              <Select value={brandTone} onValueChange={setBrandTone}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly & Casual</SelectItem>
                  <SelectItem value="authoritative">Authoritative</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="urgent">Urgent & Direct</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="luxury">Premium & Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="competitorHeadlines">Competitor Headlines (Reference)</Label>
              <Textarea
                id="competitorHeadlines"
                value={competitorHeadlines}
                onChange={(e) => setCompetitorHeadlines(e.target.value)}
                placeholder="List any competitor headlines you want to reference or differentiate from"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Headline Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
            Headline Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  headlineGoals.includes(goal.id)
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={headlineGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {headlineGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {headlineGoals.map((goalId) => {
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

      {/* Emotional Triggers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MousePointer className="w-5 h-5 text-yellow-600" />
            Emotional Triggers (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {triggerOptions.map((trigger) => (
              <div
                key={trigger.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  emotionalTriggers.includes(trigger.id)
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleTriggerToggle(trigger.id)}
              >
                <Checkbox
                  checked={emotionalTriggers.includes(trigger.id)}
                  onChange={() => handleTriggerToggle(trigger.id)}
                  className="mt-0.5"
                />
                <div>
                  <div className="font-medium text-sm">{trigger.label}</div>
                  <div className="text-xs text-gray-600">{trigger.example}</div>
                </div>
              </div>
            ))}
          </div>
          {emotionalTriggers.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {emotionalTriggers.slice(0, 6).map((triggerId) => {
                const trigger = triggerOptions.find(t => t.id === triggerId);
                return trigger ? (
                  <Badge key={triggerId} variant="secondary">
                    {trigger.label}
                  </Badge>
                ) : null;
              })}
              {emotionalTriggers.length > 6 && (
                <Badge variant="outline">
                  +{emotionalTriggers.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateHeadlines}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Headlines...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Generate Headlines
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Generated Headlines & Testing Strategy</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}