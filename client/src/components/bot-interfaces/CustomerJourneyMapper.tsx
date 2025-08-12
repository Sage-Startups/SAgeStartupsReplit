import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Map, Target, AlertTriangle, Heart, Search } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface CustomerJourneyMapperProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function CustomerJourneyMapper({ onSendMessage, isLoading, sessionId }: CustomerJourneyMapperProps) {
  const [businessType, setBusinessType] = useState('');
  const [targetCustomer, setTargetCustomer] = useState('');
  const [customerGoals, setCustomerGoals] = useState('');
  const [businessGoals, setBusinessGoals] = useState('');
  const [currentChallenges, setCurrentChallenges] = useState('');
  const [touchpoints, setTouchpoints] = useState<string[]>([]);
  const [painPoints, setPainPoints] = useState<string[]>([]);
  const [customerSegment, setCustomerSegment] = useState('');
  const [decisionFactors, setDecisionFactors] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');

  const touchpointOptions = [
    { id: 'social-media', label: 'Social Media', category: 'Digital' },
    { id: 'website', label: 'Website', category: 'Digital' },
    { id: 'email', label: 'Email', category: 'Digital' },
    { id: 'search-engines', label: 'Search Engines', category: 'Digital' },
    { id: 'mobile-app', label: 'Mobile App', category: 'Digital' },
    { id: 'online-ads', label: 'Online Advertising', category: 'Digital' },
    { id: 'phone-call', label: 'Phone/Support', category: 'Direct' },
    { id: 'in-person', label: 'In-Person Meeting', category: 'Direct' },
    { id: 'retail-store', label: 'Retail Store', category: 'Physical' },
    { id: 'events', label: 'Events/Trade Shows', category: 'Physical' },
    { id: 'referrals', label: 'Referrals', category: 'Word of Mouth' },
    { id: 'reviews', label: 'Reviews/Testimonials', category: 'Word of Mouth' },
    { id: 'influencers', label: 'Influencer Content', category: 'Word of Mouth' },
    { id: 'pr-media', label: 'PR/Media Coverage', category: 'Media' }
  ];

  const painPointOptions = [
    { id: 'awareness', label: 'Low Brand Awareness', category: 'Discovery' },
    { id: 'information', label: 'Lack of Information', category: 'Discovery' },
    { id: 'trust', label: 'Trust Issues', category: 'Consideration' },
    { id: 'comparison', label: 'Difficult Comparison', category: 'Consideration' },
    { id: 'pricing', label: 'Pricing Concerns', category: 'Evaluation' },
    { id: 'complexity', label: 'Too Complex/Confusing', category: 'Evaluation' },
    { id: 'support', label: 'Poor Customer Support', category: 'Purchase' },
    { id: 'checkout', label: 'Complicated Checkout', category: 'Purchase' },
    { id: 'onboarding', label: 'Poor Onboarding', category: 'Post-Purchase' },
    { id: 'delivery', label: 'Slow Delivery/Setup', category: 'Post-Purchase' },
    { id: 'expectations', label: 'Unmet Expectations', category: 'Usage' },
    { id: 'learning-curve', label: 'Steep Learning Curve', category: 'Usage' }
  ];

  const handleTouchpointToggle = (touchpointId: string) => {
    setTouchpoints(prev => 
      prev.includes(touchpointId) 
        ? prev.filter(id => id !== touchpointId)
        : [...prev, touchpointId]
    );
  };

  const handlePainPointToggle = (painPointId: string) => {
    setPainPoints(prev => 
      prev.includes(painPointId) 
        ? prev.filter(id => id !== painPointId)
        : [...prev, painPointId]
    );
  };

  const handleGenerateMap = () => {
    const selectedTouchpointLabels = touchpointOptions
      .filter(touchpoint => touchpoints.includes(touchpoint.id))
      .map(touchpoint => touchpoint.label);
    
    const selectedPainPointLabels = painPointOptions
      .filter(painPoint => painPoints.includes(painPoint.id))
      .map(painPoint => painPoint.label);

    const message = `Create a comprehensive customer journey map analysis with the following details:

**Business Information:**
- Business Type: ${businessType}
- Customer Segment: ${customerSegment}
- Business Goals: ${businessGoals}

**Target Customer Profile:**
- Target Customer Description: ${targetCustomer}
- Customer Goals: ${customerGoals}
- Decision-Making Factors: ${decisionFactors}

**Current State Analysis:**
- Current Challenges: ${currentChallenges}
- Active Touchpoints: ${selectedTouchpointLabels.join(', ')}
- Identified Pain Points: ${selectedPainPointLabels.join(', ')}

**Competitive Context:**
${competitorAnalysis}

Please provide:

1. **Detailed Customer Persona**
   - Demographics and psychographics
   - Goals, motivations, and frustrations
   - Preferred communication channels
   - Decision-making process

2. **Complete Customer Journey Map**
   - Awareness Stage: How they discover your brand
   - Consideration Stage: Research and evaluation process
   - Purchase Stage: Decision and transaction process
   - Onboarding Stage: Initial experience
   - Usage Stage: Ongoing relationship
   - Advocacy Stage: Referral and retention

3. **Touchpoint Analysis**
   - Map each touchpoint to journey stages
   - Identify interaction quality scores
   - Highlight critical moments of truth
   - Recommend touchpoint improvements

4. **Pain Point Identification & Solutions**
   - Categorize pain points by journey stage
   - Assess impact and frequency of each pain point
   - Provide specific solutions for each pain point
   - Prioritize fixes based on business impact

5. **Opportunity Mapping**
   - Identify gaps in current journey
   - Suggest new touchpoints to add
   - Recommend experience improvements
   - Define success metrics for each stage

6. **Action Plan**
   - Prioritized list of improvements
   - Timeline for implementation
   - Resource requirements
   - Expected impact on customer satisfaction

Make this actionable with specific recommendations, metrics to track, and implementation steps.`;

    onSendMessage(message);
  };

  const isFormValid = businessType && targetCustomer && customerGoals && touchpoints.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <Map className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Journey Mapper</h2>
          <p className="text-gray-600">Map your customer's perfect journey with touchpoint analysis and pain point identification</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="saas">SaaS/Software</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="service">Service Business</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="b2b">B2B Services</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customerSegment">Primary Customer Segment</Label>
              <Select value={customerSegment} onValueChange={setCustomerSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select customer segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="enterprise">Enterprise/Large Business</SelectItem>
                  <SelectItem value="smb">Small-Medium Business</SelectItem>
                  <SelectItem value="startup">Startups</SelectItem>
                  <SelectItem value="individual">Individual Consumers</SelectItem>
                  <SelectItem value="professionals">Professionals/Freelancers</SelectItem>
                  <SelectItem value="students">Students/Educators</SelectItem>
                  <SelectItem value="seniors">Senior Citizens</SelectItem>
                  <SelectItem value="parents">Parents/Families</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessGoals">Business Goals</Label>
              <Textarea
                id="businessGoals"
                value={businessGoals}
                onChange={(e) => setBusinessGoals(e.target.value)}
                placeholder="What are your key business objectives? (revenue growth, market expansion, customer retention, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="currentChallenges">Current Challenges</Label>
              <Textarea
                id="currentChallenges"
                value={currentChallenges}
                onChange={(e) => setCurrentChallenges(e.target.value)}
                placeholder="What challenges are you facing with your current customer experience?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Target Customer Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetCustomer">Target Customer Description *</Label>
              <Textarea
                id="targetCustomer"
                value={targetCustomer}
                onChange={(e) => setTargetCustomer(e.target.value)}
                placeholder="Describe your ideal customer (demographics, role, company size, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="customerGoals">Customer Goals & Motivations *</Label>
              <Textarea
                id="customerGoals"
                value={customerGoals}
                onChange={(e) => setCustomerGoals(e.target.value)}
                placeholder="What are your customers trying to achieve? What motivates them?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="decisionFactors">Decision-Making Factors</Label>
              <Textarea
                id="decisionFactors"
                value={decisionFactors}
                onChange={(e) => setDecisionFactors(e.target.value)}
                placeholder="What factors influence their purchasing decisions? (price, features, support, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="competitorAnalysis">Competitive Landscape</Label>
              <Textarea
                id="competitorAnalysis"
                value={competitorAnalysis}
                onChange={(e) => setCompetitorAnalysis(e.target.value)}
                placeholder="How do competitors handle customer experience? What can we learn?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Touchpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-blue-600" />
            Customer Touchpoints *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Digital', 'Direct', 'Physical', 'Word of Mouth', 'Media'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {touchpointOptions
                    .filter(touchpoint => touchpoint.category === category)
                    .map((touchpoint) => (
                      <div
                        key={touchpoint.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          touchpoints.includes(touchpoint.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleTouchpointToggle(touchpoint.id)}
                      >
                        <Checkbox
                          checked={touchpoints.includes(touchpoint.id)}
                          onChange={() => handleTouchpointToggle(touchpoint.id)}
                        />
                        <span className="text-sm">{touchpoint.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {touchpoints.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {touchpoints.slice(0, 6).map((touchpointId) => {
                const touchpoint = touchpointOptions.find(t => t.id === touchpointId);
                return touchpoint ? (
                  <Badge key={touchpointId} variant="secondary">
                    {touchpoint.label}
                  </Badge>
                ) : null;
              })}
              {touchpoints.length > 6 && (
                <Badge variant="outline">
                  +{touchpoints.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pain Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-blue-600" />
            Current Pain Points
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Discovery', 'Consideration', 'Evaluation', 'Purchase', 'Post-Purchase', 'Usage'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {painPointOptions
                    .filter(painPoint => painPoint.category === category)
                    .map((painPoint) => (
                      <div
                        key={painPoint.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          painPoints.includes(painPoint.id)
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePainPointToggle(painPoint.id)}
                      >
                        <Checkbox
                          checked={painPoints.includes(painPoint.id)}
                          onChange={() => handlePainPointToggle(painPoint.id)}
                        />
                        <span className="text-sm">{painPoint.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {painPoints.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {painPoints.slice(0, 6).map((painPointId) => {
                const painPoint = painPointOptions.find(p => p.id === painPointId);
                return painPoint ? (
                  <Badge key={painPointId} variant="destructive">
                    {painPoint.label}
                  </Badge>
                ) : null;
              })}
              {painPoints.length > 6 && (
                <Badge variant="outline">
                  +{painPoints.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateMap}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        >
          {isLoading ? (
            <>
              <Search className="w-4 h-4 mr-2 animate-spin" />
              Mapping Customer Journey...
            </>
          ) : (
            <>
              <Map className="w-4 h-4 mr-2" />
              Generate Journey Map
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