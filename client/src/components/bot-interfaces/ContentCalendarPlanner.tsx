import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Zap, TrendingUp } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ContentCalendarPlannerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ContentCalendarPlanner({ onSendMessage, isLoading, sessionId }: ContentCalendarPlannerProps) {
  const [businessType, setBusinessType] = useState('');
  const [contentGoals, setContentGoals] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [postFrequency, setPostFrequency] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  
  // Platform selection
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [contentTypes, setContentTypes] = useState<string[]>([]);

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', optimal: 'Visual content, Stories, Reels' },
    { id: 'facebook', label: 'Facebook', optimal: 'Community posts, Events, Videos' },
    { id: 'twitter', label: 'Twitter/X', optimal: 'Real-time updates, Threads, Engagement' },
    { id: 'linkedin', label: 'LinkedIn', optimal: 'Professional content, Articles, Networking' },
    { id: 'tiktok', label: 'TikTok', optimal: 'Short videos, Trends, Entertainment' },
    { id: 'youtube', label: 'YouTube', optimal: 'Long-form videos, Tutorials, Series' },
    { id: 'pinterest', label: 'Pinterest', optimal: 'Visual inspiration, DIY, Lifestyle' },
    { id: 'threads', label: 'Threads', optimal: 'Conversations, Quick updates, Community' }
  ];

  const contentTypeOptions = [
    { id: 'educational', label: 'Educational Content' },
    { id: 'behind-scenes', label: 'Behind-the-Scenes' },
    { id: 'user-generated', label: 'User-Generated Content' },
    { id: 'promotional', label: 'Promotional Posts' },
    { id: 'inspirational', label: 'Inspirational/Motivational' },
    { id: 'news-updates', label: 'Industry News & Updates' },
    { id: 'interactive', label: 'Polls, Q&As, Contests' },
    { id: 'storytelling', label: 'Brand Storytelling' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleContentTypeToggle = (typeId: string) => {
    setContentTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerateCalendar = () => {
    const selectedPlatformLabels = platforms.map(id => 
      platformOptions.find(p => p.id === id)?.label
    ).join(', ');
    
    const selectedContentTypes = contentTypes.map(id => 
      contentTypeOptions.find(ct => ct.id === id)?.label
    ).join(', ');

    const prompt = `Create a comprehensive content calendar and posting strategy with the following specifications:

**Business Information:**
- Business Type: ${businessType}
- Content Goals: ${contentGoals}
- Target Audience: ${targetAudience}
- Brand Voice: ${brandVoice}

**Calendar Requirements:**
- Timeframe: ${timeframe}
- Post Frequency: ${postFrequency}
- Platforms: ${selectedPlatformLabels}
- Content Types: ${selectedContentTypes}

**Please provide:**

1. **Platform-Specific Strategy:**
   For each selected platform (${selectedPlatformLabels}):
   - Optimal posting times and frequency
   - Platform-specific content formats
   - Hashtag strategies
   - Engagement tactics
   - Content specifications (image sizes, video length, etc.)

2. **Detailed Content Calendar:**
   Create a ${timeframe} content calendar including:
   - Daily/weekly posting schedule
   - Specific content topics and themes
   - Content type for each post
   - Platform allocation for each piece of content
   - Seasonal/trending opportunities
   - Special campaign days/weeks

3. **Content Ideas & Themes:**
   - Weekly themes and content buckets
   - 50+ specific content ideas ready to execute
   - Holiday and seasonal content opportunities
   - Trending topics and hashtags to leverage
   - User-generated content campaigns

4. **Posting Schedule Optimization:**
   - Best posting times for each platform
   - Cross-platform content repurposing strategies
   - Content batching and creation workflows
   - Engagement and community management schedule

5. **Performance Tracking:**
   - Key metrics to monitor per platform
   - Content performance indicators
   - Monthly review and optimization strategies
   - A/B testing suggestions for content

6. **Content Creation Workflow:**
   - Content creation timeline and deadlines
   - Team roles and responsibilities
   - Content approval processes
   - Tools and resources needed

Please ensure all content suggestions align with ${brandVoice} brand voice and ${contentGoals} objectives. Include specific posting times based on target audience behavior and platform algorithms.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Content Calendar Planner</h2>
        <p className="text-gray-600 mb-6">
          Create strategic content schedules with platform recommendations, posting times, and content themes
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Business & Goals
            </CardTitle>
            <CardDescription>Define your content strategy foundation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                placeholder="e.g., E-commerce fashion brand, Tech startup"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="contentGoals">Content Goals</Label>
              <Textarea
                id="contentGoals"
                placeholder="What do you want to achieve? (brand awareness, lead generation, community building, etc.)"
                value={contentGoals}
                onChange={(e) => setContentGoals(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                placeholder="Describe your ideal followers and their interests"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice</Label>
              <Select value={brandVoice} onValueChange={setBrandVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your brand personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional & Expert</SelectItem>
                  <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                  <SelectItem value="playful">Playful & Fun</SelectItem>
                  <SelectItem value="inspirational">Inspirational & Motivating</SelectItem>
                  <SelectItem value="authentic">Authentic & Personal</SelectItem>
                  <SelectItem value="educational">Educational & Informative</SelectItem>
                  <SelectItem value="luxury">Luxury & Premium</SelectItem>
                  <SelectItem value="community">Community-focused</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Calendar Settings
            </CardTitle>
            <CardDescription>Set your posting schedule preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timeframe">Calendar Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select planning period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months (Quarterly)</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="1-year">1 Year (Annual)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="postFrequency">Posting Frequency</Label>
              <Select value={postFrequency} onValueChange={setPostFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="How often will you post?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily (7 posts/week)</SelectItem>
                  <SelectItem value="5-times-week">5 times per week</SelectItem>
                  <SelectItem value="3-times-week">3 times per week</SelectItem>
                  <SelectItem value="daily-weekdays">Daily on weekdays</SelectItem>
                  <SelectItem value="every-other-day">Every other day</SelectItem>
                  <SelectItem value="twice-week">Twice per week</SelectItem>
                  <SelectItem value="once-week">Once per week</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Selection</CardTitle>
          <CardDescription>Choose which social media platforms to include in your content calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {platformOptions.map((platform) => (
              <div key={platform.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={platform.id}
                  checked={platforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={platform.id} className="font-medium cursor-pointer">
                    {platform.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{platform.optimal}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Content Types</CardTitle>
          <CardDescription>Select the types of content you want to include in your calendar</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {contentTypeOptions.map((type) => (
              <div key={type.id} className="flex items-center space-x-3">
                <Checkbox
                  id={type.id}
                  checked={contentTypes.includes(type.id)}
                  onCheckedChange={() => handleContentTypeToggle(type.id)}
                />
                <Label htmlFor={type.id} className="cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleGenerateCalendar}
          disabled={!businessType || !contentGoals || !timeframe || !postFrequency || platforms.length === 0 || contentTypes.length === 0 || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Calendar...
            </>
          ) : (
            <>
              <Calendar className="w-4 h-4 mr-2" />
              Generate Content Calendar
            </>
          )}
        </Button>
        
        {platforms.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <span className="text-sm text-gray-600">Selected platforms:</span>
            {platforms.map(platformId => {
              const platform = platformOptions.find(p => p.id === platformId);
              return (
                <Badge key={platformId} variant="secondary">
                  {platform?.label}
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
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}