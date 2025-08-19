import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Star, Users, MessageCircle, Handshake, Target } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface InfluencerOutreachBotProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function InfluencerOutreachBot({ onSendMessage, isLoading, sessionId }: InfluencerOutreachBotProps) {
  const [businessName, setBusinessName] = useState('');
  const [industry, setIndustry] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [budget, setBudget] = useState('');
  const [campaignDuration, setCampaignDuration] = useState('');
  const [brandValues, setBrandValues] = useState('');
  const [productService, setProductService] = useState('');
  
  // Platform and influencer type selection
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [influencerTypes, setInfluencerTypes] = useState<string[]>([]);

  const platformOptions = [
    { id: 'instagram', label: 'Instagram', audience: 'Visual content, lifestyle, fashion' },
    { id: 'youtube', label: 'YouTube', audience: 'Long-form content, tutorials, reviews' },
    { id: 'tiktok', label: 'TikTok', audience: 'Short videos, trends, entertainment' },
    { id: 'twitter', label: 'Twitter/X', audience: 'News, opinions, real-time engagement' },
    { id: 'linkedin', label: 'LinkedIn', audience: 'Professional, B2B, thought leadership' },
    { id: 'facebook', label: 'Facebook', audience: 'Community, groups, diverse demographics' },
    { id: 'twitch', label: 'Twitch', audience: 'Gaming, live streaming, tech' },
    { id: 'pinterest', label: 'Pinterest', audience: 'DIY, inspiration, visual discovery' }
  ];

  const influencerTypeOptions = [
    { id: 'nano', label: 'Nano Influencers (1K-10K)', benefits: 'High engagement, niche audiences, cost-effective' },
    { id: 'micro', label: 'Micro Influencers (10K-100K)', benefits: 'Trusted voices, targeted reach, authentic content' },
    { id: 'mid-tier', label: 'Mid-Tier Influencers (100K-1M)', benefits: 'Broader reach, professional content, established' },
    { id: 'macro', label: 'Macro Influencers (1M-10M)', benefits: 'Mass reach, celebrity status, viral potential' },
    { id: 'celebrity', label: 'Celebrity Influencers (10M+)', benefits: 'Maximum exposure, prestige, mainstream appeal' }
  ];

  const handlePlatformToggle = (platformId: string) => {
    setPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleInfluencerTypeToggle = (typeId: string) => {
    setInfluencerTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  const handleGenerateStrategy = () => {
    const selectedPlatformLabels = platforms.map(id => 
      platformOptions.find(p => p.id === id)?.label
    ).join(', ');
    
    const selectedInfluencerTypes = influencerTypes.map(id => 
      influencerTypeOptions.find(it => it.id === id)?.label
    ).join(', ');

    const prompt = `Create a comprehensive influencer outreach strategy and partnership framework with the following specifications:

**Business Information:**
- Business Name: ${businessName}
- Industry: ${industry}
- Product/Service: ${productService}
- Target Audience: ${targetAudience}
- Brand Values: ${brandValues}

**Campaign Details:**
- Campaign Goal: ${campaignGoal}
- Budget Range: ${budget}
- Campaign Duration: ${campaignDuration}
- Platforms: ${selectedPlatformLabels}
- Influencer Types: ${selectedInfluencerTypes}

**Please provide a complete influencer marketing strategy including:**

1. **Ideal Influencer Profile & Identification:**
   - Detailed persona of ideal influencers for your brand
   - Specific criteria for influencer selection (follower count, engagement rate, audience demographics)
   - Platform-specific influencer characteristics
   - Red flags and exclusion criteria
   - Tools and methods for finding relevant influencers
   - Specific influencer recommendations (if possible to research)

2. **Outreach Templates & Scripts:**
   Create 5-7 different outreach email/DM templates:
   - Initial outreach template (cold contact)
   - Follow-up template (no response)
   - Partnership proposal template
   - Media kit request template
   - Collaboration confirmation template
   - Post-campaign thank you template
   - Long-term partnership invitation template

   Each template should be:
   - Personalized and authentic
   - Clear about expectations
   - Professional yet friendly
   - Include clear next steps

3. **Partnership Terms & Conditions:**
   
   **Content Requirements:**
   - Deliverables specification (posts, stories, videos, etc.)
   - Content guidelines and brand requirements
   - Hashtag and mention requirements
   - Content approval process
   - Usage rights and licensing

   **Compensation Structure:**
   - Payment terms and schedules
   - Performance bonuses and incentives
   - Product gifting arrangements
   - Commission structures (if applicable)
   - Expense coverage policies

   **Legal & Compliance:**
   - FTC disclosure requirements
   - Content ownership and usage rights
   - Exclusivity clauses
   - Termination conditions
   - Revision and feedback processes

4. **Campaign Strategy & Management:**
   - Platform-specific campaign strategies
   - Content calendar and posting schedule
   - Campaign phases and milestones
   - Cross-platform amplification strategies
   - Community management during campaigns

5. **Performance Tracking & Metrics:**
   - Key performance indicators (KPIs) to track
   - Success metrics for each platform
   - ROI calculation methods
   - Reporting schedule and format
   - Tools for tracking and analytics

6. **Relationship Management:**
   - Onboarding process for new influencers
   - Communication protocols and expectations
   - Feedback and review systems
   - Long-term relationship building strategies
   - Influencer network development

7. **Budget Allocation & Optimization:**
   - Budget breakdown by platform and influencer type
   - Cost-per-engagement benchmarks
   - Payment structure recommendations
   - Budget scaling strategies
   - ROI optimization tactics

8. **Risk Management & Quality Control:**
   - Content review and approval process
   - Brand safety measures
   - Crisis management protocols
   - Performance monitoring and adjustment strategies
   - Contract violation procedures

Please ensure all recommendations align with ${brandValues} and are optimized for ${campaignGoal}. Include specific examples and actionable steps throughout the strategy.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-yellow-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Influencer Outreach Strategy</h2>
        <p className="text-gray-600 mb-6">
          Identify ideal influencers, create outreach templates, and develop partnership terms & conditions
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Brand & Campaign Details
            </CardTitle>
            <CardDescription>Tell us about your brand and campaign objectives</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry/Niche</Label>
              <Input
                id="industry"
                placeholder="e.g., Fashion, Tech, Health & Wellness, Gaming"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="productService">Product/Service</Label>
              <Textarea
                id="productService"
                placeholder="Describe what you're promoting and its key benefits"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandValues">Brand Values</Label>
              <Textarea
                id="brandValues"
                placeholder="What does your brand stand for? What values should influencers align with?"
                value={brandValues}
                onChange={(e) => setBrandValues(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                placeholder="Describe your ideal customers (age, interests, demographics, behaviors)"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="w-5 h-5" />
              Campaign Parameters
            </CardTitle>
            <CardDescription>Define your influencer marketing campaign scope</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaignGoal">Campaign Goal</Label>
              <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                  <SelectItem value="lead-generation">Lead Generation</SelectItem>
                  <SelectItem value="sales-conversion">Sales & Conversions</SelectItem>
                  <SelectItem value="community-building">Community Building</SelectItem>
                  <SelectItem value="content-creation">Content Creation</SelectItem>
                  <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                  <SelectItem value="event-promotion">Event Promotion</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="budget">Budget Range</Label>
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
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-plus">$100,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="campaignDuration">Campaign Duration</Label>
              <Select value={campaignDuration} onValueChange={setCampaignDuration}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time Collaboration</SelectItem>
                  <SelectItem value="2-weeks">2 Weeks</SelectItem>
                  <SelectItem value="1-month">1 Month</SelectItem>
                  <SelectItem value="3-months">3 Months</SelectItem>
                  <SelectItem value="6-months">6 Months</SelectItem>
                  <SelectItem value="ongoing">Ongoing Partnership</SelectItem>
                  <SelectItem value="seasonal">Seasonal Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Strategy Includes:</h4>
                <div className="space-y-2 text-sm text-yellow-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Ideal influencer identification
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Professional outreach templates
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Partnership terms & contracts
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Campaign management strategy
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Platform Selection
          </CardTitle>
          <CardDescription>Choose which platforms to focus your influencer outreach on</CardDescription>
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
                  <p className="text-sm text-gray-600 mt-1">{platform.audience}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Influencer Types
          </CardTitle>
          <CardDescription>Select the tiers of influencers you want to work with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-1 gap-4">
            {influencerTypeOptions.map((type) => (
              <div key={type.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                <Checkbox
                  id={type.id}
                  checked={influencerTypes.includes(type.id)}
                  onCheckedChange={() => handleInfluencerTypeToggle(type.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={type.id} className="font-medium cursor-pointer">
                    {type.label}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">{type.benefits}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button 
          onClick={handleGenerateStrategy}
          disabled={!businessName || !industry || !productService || !campaignGoal || !budget || platforms.length === 0 || influencerTypes.length === 0 || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Star className="w-4 h-4 mr-2 animate-spin" />
              Creating Strategy...
            </>
          ) : (
            <>
              <Star className="w-4 h-4 mr-2" />
              Generate Influencer Strategy
            </>
          )}
        </Button>
        
        <div className="mt-4 space-y-2">
          {platforms.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-600">Platforms:</span>
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
          
          {influencerTypes.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-600">Influencer types:</span>
              {influencerTypes.slice(0, 3).map(typeId => {
                const type = influencerTypeOptions.find(t => t.id === typeId);
                return (
                  <Badge key={typeId} variant="outline">
                    {type?.label.split(' ')[0]} {/* Show just the first word like "Nano", "Micro" */}
                  </Badge>
                );
              })}
              {influencerTypes.length > 3 && (
                <Badge variant="outline">
                  +{influencerTypes.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">AI Assistant Response</h3>
          <BotChatInterface sessionId={sessionId} botType="influencer-outreach" />
        </div>
      )}
    </div>
  );
}