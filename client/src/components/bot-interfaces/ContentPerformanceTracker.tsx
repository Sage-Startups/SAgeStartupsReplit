import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, TrendingUp, Eye, Users, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ContentPerformanceTrackerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ContentPerformanceTracker({ onSendMessage, isLoading, sessionId }: ContentPerformanceTrackerProps) {
  const [contentUrls, setContentUrls] = useState('');
  const [contentTypes, setContentTypes] = useState<string[]>([]);
  const [trackingGoals, setTrackingGoals] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState('');
  const [currentTools, setCurrentTools] = useState('');
  const [businessGoals, setBusinessGoals] = useState('');
  const [benchmarkData, setBenchmarkData] = useState('');
  const [competitorContent, setCompetitorContent] = useState('');
  const [reportingFrequency, setReportingFrequency] = useState('');

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

  const goalOptions = [
    { id: 'traffic-analysis', label: 'Traffic Analysis', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'engagement-tracking', label: 'Engagement Tracking', icon: <Users className="w-4 h-4" /> },
    { id: 'conversion-tracking', label: 'Conversion Tracking', icon: <Target className="w-4 h-4" /> },
    { id: 'seo-performance', label: 'SEO Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'social-metrics', label: 'Social Media Metrics', icon: <Users className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Lead Generation', icon: <Target className="w-4 h-4" /> },
    { id: 'brand-awareness', label: 'Brand Awareness', icon: <Eye className="w-4 h-4" /> },
    { id: 'roi-analysis', label: 'ROI Analysis', icon: <BarChart3 className="w-4 h-4" /> }
  ];

  const platformOptions = [
    { id: 'website', label: 'Website/Blog', category: 'Owned' },
    { id: 'google-analytics', label: 'Google Analytics', category: 'Analytics' },
    { id: 'linkedin', label: 'LinkedIn', category: 'Social' },
    { id: 'twitter', label: 'Twitter/X', category: 'Social' },
    { id: 'facebook', label: 'Facebook', category: 'Social' },
    { id: 'instagram', label: 'Instagram', category: 'Social' },
    { id: 'youtube', label: 'YouTube', category: 'Video' },
    { id: 'email', label: 'Email Platforms', category: 'Direct' },
    { id: 'search-console', label: 'Google Search Console', category: 'Analytics' },
    { id: 'social-media-tools', label: 'Social Media Tools', category: 'Analytics' }
  ];

  const handleContentTypeToggle = (typeId: string) => {
    setContentTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGoalToggle = (goalId: string) => {
    setTrackingGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleGenerateTrackingSystem = () => {
    const selectedContentTypes = contentTypeOptions
      .filter(type => contentTypes.includes(type.id))
      .map(type => type.label);
    
    const selectedGoalLabels = goalOptions
      .filter(goal => trackingGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedPlatformLabels = platformOptions
      .filter(platform => platforms.includes(platform.id))
      .map(platform => platform.label);

    const message = `Create a comprehensive content performance tracking and analysis system:

**Content Portfolio:**
- Content URLs/Examples: ${contentUrls}
- Content Types: ${selectedContentTypes.join(', ')}
- Tracking Platforms: ${selectedPlatformLabels.join(', ')}

**Tracking Objectives:**
- Primary Goals: ${selectedGoalLabels.join(', ')}
- Business Goals: ${businessGoals}
- Analysis Timeframe: ${timeframe}
- Reporting Frequency: ${reportingFrequency}

**Current Setup:**
- Existing Tools: ${currentTools}
- Benchmark Data: ${benchmarkData}
- Competitor Content: ${competitorContent}

Please provide:

1. **Comprehensive Performance Dashboard**
   - Key performance indicators (KPIs) framework
   - Metric prioritization and categorization
   - Visual dashboard design recommendations
   - Real-time vs periodic tracking setup

2. **Engagement Analysis System**
   - Engagement metrics breakdown by platform
   - Audience behavior analysis methods
   - Content interaction tracking
   - Community engagement measurement

3. **Performance Tracking Framework**
   - Traffic and reach analytics
   - Conversion funnel analysis
   - Content attribution modeling
   - Multi-channel performance correlation

4. **Optimization Insights Engine**
   - Performance pattern identification
   - Content optimization recommendations
   - A/B testing framework for content
   - Predictive performance modeling

5. **Analytics Tool Integration**
   - Recommended analytics stack
   - Tool configuration guidelines
   - Data integration strategies
   - Custom tracking implementation

6. **Reporting & Visualization**
   - Automated reporting templates
   - Executive summary formats
   - Stakeholder-specific dashboards
   - Performance trend visualization

7. **Competitive Benchmarking**
   - Competitor performance tracking
   - Industry benchmark comparisons
   - Market position analysis
   - Competitive advantage identification

8. **ROI & Attribution Analysis**
   - Content ROI calculation methods
   - Attribution modeling setup
   - Revenue impact measurement
   - Cost-per-engagement analysis

9. **Actionable Recommendations System**
   - Performance improvement strategies
   - Content optimization prioritization
   - Resource allocation recommendations
   - Strategic content planning insights

10. **Implementation Roadmap**
    - Phase-by-phase setup guide
    - Tool implementation timeline
    - Team training requirements
    - Success milestone definitions

Provide a complete system with specific tools, metrics, formulas, and actionable insights for maximizing content performance and ROI.`;

    onSendMessage(message);
  };

  const isFormValid = trackingGoals.length > 0 && platforms.length > 0 && timeframe;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Performance Tracker</h2>
          <p className="text-gray-600">Track engagement, analyze performance metrics, and optimize content strategy with data-driven insights</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Portfolio */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-teal-600" />
              Content Portfolio
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentUrls">Content URLs/Examples</Label>
              <Textarea
                id="contentUrls"
                value={contentUrls}
                onChange={(e) => setContentUrls(e.target.value)}
                placeholder="List URLs of content you want to track or analyze:
https://yourblog.com/post1
https://linkedin.com/post123
https://youtube.com/video456"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="timeframe">Analysis Timeframe</Label>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-30-days">Last 30 Days</SelectItem>
                  <SelectItem value="last-90-days">Last 90 Days</SelectItem>
                  <SelectItem value="last-6-months">Last 6 Months</SelectItem>
                  <SelectItem value="last-12-months">Last 12 Months</SelectItem>
                  <SelectItem value="ongoing">Ongoing Tracking</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="reportingFrequency">Reporting Frequency</Label>
              <Select value={reportingFrequency} onValueChange={setReportingFrequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentTools">Current Analytics Tools</Label>
              <Textarea
                id="currentTools"
                value={currentTools}
                onChange={(e) => setCurrentTools(e.target.value)}
                placeholder="What analytics tools do you currently use? (Google Analytics, social media insights, etc.)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Strategy Context */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" />
              Strategy Context
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessGoals">Business Goals</Label>
              <Textarea
                id="businessGoals"
                value={businessGoals}
                onChange={(e) => setBusinessGoals(e.target.value)}
                placeholder="What business objectives are you trying to achieve with content?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="benchmarkData">Current Benchmark Data</Label>
              <Textarea
                id="benchmarkData"
                value={benchmarkData}
                onChange={(e) => setBenchmarkData(e.target.value)}
                placeholder="Share any current performance data you have (views, engagement rates, conversions, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="competitorContent">Competitor Content Analysis</Label>
              <Textarea
                id="competitorContent"
                value={competitorContent}
                onChange={(e) => setCompetitorContent(e.target.value)}
                placeholder="List competitor content or profiles you want to benchmark against"
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
            <Target className="w-5 h-5 text-teal-600" />
            Content Types to Track
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
                            ? 'border-teal-500 bg-teal-50'
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

      {/* Tracking Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            Tracking Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  trackingGoals.includes(goal.id)
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={trackingGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {trackingGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {trackingGoals.map((goalId) => {
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

      {/* Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            Platforms & Tools *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Owned', 'Analytics', 'Social', 'Video', 'Direct'].map((category) => (
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
                            ? 'border-teal-500 bg-teal-50'
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
          onClick={handleGenerateTrackingSystem}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Tracking System...
            </>
          ) : (
            <>
              <BarChart3 className="w-4 h-4 mr-2" />
              Generate Performance Tracker
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Performance Tracking System & Analytics</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}