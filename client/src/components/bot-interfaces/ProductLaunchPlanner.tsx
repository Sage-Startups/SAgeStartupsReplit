import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Rocket, Calendar, Share2, Megaphone, Target, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ProductLaunchPlannerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ProductLaunchPlanner({ onSendMessage, isLoading, sessionId }: ProductLaunchPlannerProps) {
  const [productName, setProductName] = useState('');
  const [productType, setProductType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [launchDate, setLaunchDate] = useState('');
  const [budget, setBudget] = useState('');
  const [launchGoals, setLaunchGoals] = useState<string[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [productDescription, setProductDescription] = useState('');
  const [uniqueSellingPoints, setUniqueSellingPoints] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');

  const launchGoalOptions = [
    { id: 'awareness', label: 'Brand Awareness', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'sales', label: 'Sales Volume', icon: <Target className="w-4 h-4" /> },
    { id: 'signups', label: 'User Signups', icon: <Target className="w-4 h-4" /> },
    { id: 'media', label: 'Media Coverage', icon: <Share2 className="w-4 h-4" /> },
    { id: 'feedback', label: 'User Feedback', icon: <Target className="w-4 h-4" /> },
    { id: 'partnerships', label: 'Strategic Partnerships', icon: <Target className="w-4 h-4" /> }
  ];

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', category: 'Social Media' },
    { id: 'facebook', label: 'Facebook', category: 'Social Media' },
    { id: 'twitter', label: 'Twitter/X', category: 'Social Media' },
    { id: 'linkedin', label: 'LinkedIn', category: 'Social Media' },
    { id: 'tiktok', label: 'TikTok', category: 'Social Media' },
    { id: 'youtube', label: 'YouTube', category: 'Video' },
    { id: 'email', label: 'Email Marketing', category: 'Direct' },
    { id: 'pr', label: 'Press Releases', category: 'PR' },
    { id: 'influencers', label: 'Influencer Marketing', category: 'Partnerships' },
    { id: 'content', label: 'Content Marketing', category: 'Content' },
    { id: 'paid-ads', label: 'Paid Advertising', category: 'Advertising' },
    { id: 'seo', label: 'SEO/Blog', category: 'Content' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setLaunchGoals(prev => 
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

  const handleGeneratePlan = () => {
    const selectedGoalLabels = launchGoalOptions
      .filter(goal => launchGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedPlatformLabels = platformOptions
      .filter(platform => platforms.includes(platform.id))
      .map(platform => platform.label);

    const message = `Create a comprehensive product launch plan with the following details:

**Product Information:**
- Product Name: ${productName}
- Product Type: ${productType}
- Product Description: ${productDescription}
- Unique Selling Points: ${uniqueSellingPoints}

**Launch Details:**
- Target Launch Date: ${launchDate}
- Target Audience: ${targetAudience}
- Launch Budget: ${budget}
- Launch Goals: ${selectedGoalLabels.join(', ')}

**Marketing Channels:**
- Selected Platforms: ${selectedPlatformLabels.join(', ')}

**Competitive Context:**
${competitorAnalysis}

Please provide:
1. **Pre-Launch Timeline** (8-12 weeks before launch)
   - Week-by-week action items
   - Content creation schedule
   - PR outreach timeline

2. **Social Media Strategy**
   - Platform-specific content suggestions
   - Posting schedule and frequency
   - Hashtag strategies
   - Engagement tactics

3. **PR Planning**
   - Media outreach strategy
   - Press release templates
   - Key messaging points
   - Influencer collaboration ideas

4. **Launch Week Strategy**
   - Hour-by-hour launch day plan
   - Crisis management preparation
   - Real-time engagement tactics

5. **Post-Launch Activities**
   - Follow-up campaigns
   - Community building
   - Performance tracking metrics
   - Optimization recommendations

Make this actionable with specific deadlines, content examples, and measurable goals.`;

    onSendMessage(message);
  };

  const isFormValid = productName && productType && targetAudience && launchDate && launchGoals.length > 0 && platforms.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Rocket className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Launch Planner</h2>
          <p className="text-gray-600">Create a comprehensive launch strategy with timeline, social media plan, and PR strategy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-600" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Enter your product name"
              />
            </div>

            <div>
              <Label htmlFor="productType">Product Type *</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS/Software</SelectItem>
                  <SelectItem value="mobile-app">Mobile App</SelectItem>
                  <SelectItem value="physical-product">Physical Product</SelectItem>
                  <SelectItem value="digital-product">Digital Product</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="course">Online Course</SelectItem>
                  <SelectItem value="book">Book/eBook</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="productDescription">Product Description</Label>
              <Textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                placeholder="Describe your product and its main features"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="uniqueSellingPoints">Unique Selling Points</Label>
              <Textarea
                id="uniqueSellingPoints"
                value={uniqueSellingPoints}
                onChange={(e) => setUniqueSellingPoints(e.target.value)}
                placeholder="What makes your product unique? Key differentiators..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Launch Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-600" />
              Launch Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="launchDate">Target Launch Date *</Label>
              <Input
                id="launchDate"
                type="date"
                value={launchDate}
                onChange={(e) => setLaunchDate(e.target.value)}
              />
            </div>

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
              <Label htmlFor="budget">Launch Budget</Label>
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                  <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                  <SelectItem value="50k-plus">$50,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="competitorAnalysis">Competitive Landscape</Label>
              <Textarea
                id="competitorAnalysis"
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="Who are your main competitors? What are they doing for their launches?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Launch Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {launchGoalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  launchGoals.includes(goal.id)
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={launchGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {launchGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {launchGoals.map((goalId) => {
                const goal = launchGoalOptions.find(g => g.id === goalId);
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

      {/* Marketing Platforms */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-purple-600" />
            Marketing Platforms *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Social Media', 'Video', 'Direct', 'PR', 'Partnerships', 'Content', 'Advertising'].map((category) => (
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
          onClick={handleGeneratePlan}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Launch Plan...
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4 mr-2" />
              Generate Launch Plan
            </>
          )}
        </Button>
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