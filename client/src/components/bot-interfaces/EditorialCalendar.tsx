import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, Clock, Users, Zap, CalendarDays } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface EditorialCalendarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function EditorialCalendar({ onSendMessage, isLoading, sessionId }: EditorialCalendarProps) {
  const [calendarPeriod, setCalendarPeriod] = useState('');
  const [contentFrequency, setContentFrequency] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [themes, setThemes] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [businessGoals, setBusinessGoals] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [keyEvents, setKeyEvents] = useState('');
  const [resourceConstraints, setResourceConstraints] = useState('');
  const [brandVoice, setBrandVoice] = useState('');

  const contentTypeOptions = [
    { id: 'blog-posts', label: 'Blog Posts', category: 'Written' },
    { id: 'social-media', label: 'Social Media Posts', category: 'Social' },
    { id: 'videos', label: 'Video Content', category: 'Video' },
    { id: 'podcasts', label: 'Podcast Episodes', category: 'Audio' },
    { id: 'infographics', label: 'Infographics', category: 'Visual' },
    { id: 'newsletters', label: 'Email Newsletters', category: 'Email' },
    { id: 'webinars', label: 'Webinars', category: 'Educational' },
    { id: 'case-studies', label: 'Case Studies', category: 'Long-form' },
    { id: 'whitepapers', label: 'Whitepapers', category: 'Long-form' },
    { id: 'press-releases', label: 'Press Releases', category: 'PR' }
  ];

  const themeOptions = [
    { id: 'educational', label: 'Educational Content', icon: <Target className="w-4 h-4" /> },
    { id: 'product-focused', label: 'Product-Focused', icon: <Zap className="w-4 h-4" /> },
    { id: 'industry-trends', label: 'Industry Trends', icon: <Target className="w-4 h-4" /> },
    { id: 'behind-scenes', label: 'Behind the Scenes', icon: <Users className="w-4 h-4" /> },
    { id: 'customer-stories', label: 'Customer Stories', icon: <Users className="w-4 h-4" /> },
    { id: 'thought-leadership', label: 'Thought Leadership', icon: <Target className="w-4 h-4" /> },
    { id: 'seasonal-content', label: 'Seasonal Content', icon: <Calendar className="w-4 h-4" /> },
    { id: 'how-to-guides', label: 'How-to Guides', icon: <Target className="w-4 h-4" /> }
  ];

  const platformOptions = [
    { id: 'blog', label: 'Company Blog', category: 'Owned' },
    { id: 'linkedin', label: 'LinkedIn', category: 'Social' },
    { id: 'twitter', label: 'Twitter/X', category: 'Social' },
    { id: 'facebook', label: 'Facebook', category: 'Social' },
    { id: 'instagram', label: 'Instagram', category: 'Social' },
    { id: 'youtube', label: 'YouTube', category: 'Video' },
    { id: 'tiktok', label: 'TikTok', category: 'Video' },
    { id: 'email', label: 'Email Newsletter', category: 'Direct' },
    { id: 'medium', label: 'Medium', category: 'Publishing' },
    { id: 'podcast', label: 'Podcast Platforms', category: 'Audio' }
  ];

  const handleContentTypeToggle = (typeId: string) => {
    setContentTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleThemeToggle = (themeId: string) => {
    setThemes(prev => 
      prev.includes(themeId) 
        ? prev.filter(id => id !== themeId)
        : [...prev, themeId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerateCalendar = () => {
    const selectedContentTypes = contentTypeOptions
      .filter(type => contentTypes.includes(type.id))
      .map(type => type.label);
    
    const selectedThemes = themeOptions
      .filter(theme => themes.includes(theme.id))
      .map(theme => theme.label);
    
    const selectedPlatforms = platformOptions
      .filter(platform => platforms.includes(platform.id))
      .map(platform => platform.label);

    const message = `Create a comprehensive editorial calendar with the following specifications:

**Calendar Parameters:**
- Time Period: ${calendarPeriod}
- Publishing Frequency: ${contentFrequency}
- Content Types: ${selectedContentTypes.join(', ')}
- Content Themes: ${selectedThemes.join(', ')}
- Publishing Platforms: ${selectedPlatforms.join(', ')}

**Business Context:**
- Business Goals: ${businessGoals}
- Target Audience: ${targetAudience}
- Brand Voice: ${brandVoice}
- Resource Constraints: ${resourceConstraints}

**Key Events & Dates:** ${keyEvents}

Please provide:

1. **Complete Editorial Calendar**
   - Month-by-month content schedule
   - Weekly publishing rhythm
   - Daily content recommendations
   - Platform-specific posting times

2. **Content Theme Coordination**
   - Monthly theme focus areas
   - Weekly theme variations
   - Seasonal content integration
   - Holiday and event alignment

3. **Publishing Schedule Optimization**
   - Best posting times per platform
   - Content distribution strategy
   - Cross-platform content adaptation
   - Frequency recommendations by content type

4. **Content Planning Framework**
   - Content categories and pillars
   - Topic research and ideation process
   - Content gap analysis
   - Trending topic integration

5. **Resource Allocation**
   - Content creation timeline
   - Team assignment recommendations
   - Production workflow
   - Quality control checkpoints

6. **Performance Tracking**
   - Key metrics to monitor
   - Content performance indicators
   - Engagement benchmarks
   - ROI measurement framework

7. **Content Templates & Guidelines**
   - Template structures for each content type
   - Brand voice guidelines
   - Visual style recommendations
   - Approval process workflow

8. **Flexibility & Adaptation**
   - Real-time content opportunities
   - Crisis communication protocols
   - Trending topic integration
   - Calendar adjustment strategies

Format the calendar in an easy-to-read, actionable structure with specific dates, topics, and platform assignments.`;

    onSendMessage(message);
  };

  const isFormValid = calendarPeriod && contentFrequency && contentTypes.length > 0 && themes.length > 0 && platforms.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Editorial Calendar</h2>
          <p className="text-gray-600">Plan your content strategy with organized scheduling, theme coordination, and publishing optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-purple-600" />
              Calendar Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="calendarPeriod">Calendar Period *</Label>
              <Select value={calendarPeriod} onValueChange={setCalendarPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select calendar period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months (Quarter)</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="12-months">12 Months (Annual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contentFrequency">Publishing Frequency *</Label>
              <Select value={contentFrequency} onValueChange={setContentFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="3-per-week">3 times per week</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="mixed">Mixed frequency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessGoals">Business Goals</Label>
              <Textarea
                id="businessGoals"
                value={businessGoals}
                onChange={(e) => setBusinessGoals(e.target.value)}
                placeholder="What are your key business objectives for this content calendar?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="resourceConstraints">Resource Constraints</Label>
              <Textarea
                id="resourceConstraints"
                value={resourceConstraints}
                onChange={(e) => setResourceConstraints(e.target.value)}
                placeholder="Team size, budget limitations, time constraints, etc."
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Audience & Brand */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Audience & Brand
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (demographics, interests, content preferences)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice & Tone</Label>
              <Textarea
                id="brandVoice"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="How should your content sound? (professional, friendly, authoritative, etc.)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="keyEvents">Key Events & Dates</Label>
              <Textarea
                id="keyEvents"
                value={keyEvents}
                onChange={(e) => setKeyEvents(e.target.value)}
                placeholder="Product launches, holidays, industry events, sales periods, etc."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Types */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Content Types *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Written', 'Social', 'Video', 'Audio', 'Visual', 'Email', 'Educational', 'Long-form', 'PR'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {contentTypeOptions
                    .filter(type => type.category === category)
                    .map((type) => (
                      <div
                        key={type.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          contentTypes.includes(type.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleContentTypeToggle(type.id)}
                      >
                        <Checkbox
                          checked={contentTypes.includes(type.id)}
                          onChange={() => handleContentTypeToggle(type.id)}
                        />
                        <span className="text-sm">{type.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {contentTypes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {contentTypes.slice(0, 6).map((typeId) => {
                const type = contentTypeOptions.find(t => t.id === typeId);
                return type ? (
                  <Badge key={typeId} variant="secondary">
                    {type.label}
                  </Badge>
                ) : null;
              })}
              {contentTypes.length > 6 && (
                <Badge variant="outline">
                  +{contentTypes.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Content Themes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Content Themes *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themeOptions.map((theme) => (
              <div
                key={theme.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  themes.includes(theme.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleThemeToggle(theme.id)}
              >
                <Checkbox
                  checked={themes.includes(theme.id)}
                  onChange={() => handleThemeToggle(theme.id)}
                />
                <div className="flex items-center gap-2">
                  {theme.icon}
                  <span className="text-sm font-medium">{theme.label}</span>
                </div>
              </div>
            ))}
          </div>
          {themes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {themes.map((themeId) => {
                const theme = themeOptions.find(t => t.id === themeId);
                return theme ? (
                  <Badge key={themeId} variant="secondary" className="flex items-center gap-1">
                    {theme.icon}
                    {theme.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Publishing Platforms *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Owned', 'Social', 'Video', 'Direct', 'Publishing', 'Audio'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {platformOptions
                    .filter(platform => platform.category === category)
                    .map((platform) => (
                      <div
                        key={platform.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          platforms.includes(platform.id)
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <Checkbox
                          checked={platforms.includes(platform.id)}
                          onChange={() => handlePlatformToggle(platform.id)}
                        />
                        <span className="text-sm">{platform.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {platforms.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {platforms.slice(0, 6).map((platformId) => {
                const platform = platformOptions.find(p => p.id === platformId);
                return platform ? (
                  <Badge key={platformId} variant="secondary">
                    {platform.label}
                  </Badge>
                ) : null;
              })}
              {platforms.length > 6 && (
                <Badge variant="outline">
                  +{platforms.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateCalendar}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Calendar...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Generate Editorial Calendar
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Editorial Calendar Results</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}