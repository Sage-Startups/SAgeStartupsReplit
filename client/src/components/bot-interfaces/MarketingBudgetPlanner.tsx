import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calculator, Target, TrendingUp, BarChart3, PieChart } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface MarketingBudgetPlannerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function MarketingBudgetPlanner({ onSendMessage, isLoading, sessionId }: MarketingBudgetPlannerProps) {
  const [totalBudget, setTotalBudget] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [primaryGoals, setPrimaryGoals] = useState<string[]>([]);
  const [marketingChannels, setMarketingChannels] = useState<string[]>([]);
  const [currentRevenue, setCurrentRevenue] = useState('');
  const [targetROI, setTargetROI] = useState('');
  const [customerValue, setCustomerValue] = useState('');
  const [acquisitionCost, setAcquisitionCost] = useState('');
  const [industryType, setIndustryType] = useState('');
  const [competitiveLevel, setCompetitiveLevel] = useState('');
  const [seasonality, setSeasonality] = useState('');

  const goalOptions = [
    { id: 'brand-awareness', label: 'Brand Awareness', icon: <Target className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Lead Generation', icon: <Target className="w-4 h-4" /> },
    { id: 'sales-growth', label: 'Sales Growth', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'customer-acquisition', label: 'Customer Acquisition', icon: <Target className="w-4 h-4" /> },
    { id: 'customer-retention', label: 'Customer Retention', icon: <Target className="w-4 h-4" /> },
    { id: 'market-expansion', label: 'Market Expansion', icon: <Target className="w-4 h-4" /> },
    { id: 'product-launch', label: 'Product Launch', icon: <Target className="w-4 h-4" /> },
    { id: 'engagement', label: 'Engagement & Community', icon: <Target className="w-4 h-4" /> }
  ];

  const channelOptions = [
    { id: 'google-ads', label: 'Google Ads', category: 'Paid Advertising', cost: 'High' },
    { id: 'facebook-ads', label: 'Facebook/Meta Ads', category: 'Paid Advertising', cost: 'Medium' },
    { id: 'linkedin-ads', label: 'LinkedIn Ads', category: 'Paid Advertising', cost: 'High' },
    { id: 'display-ads', label: 'Display Advertising', category: 'Paid Advertising', cost: 'Medium' },
    { id: 'seo', label: 'SEO/Organic Search', category: 'Organic', cost: 'Low' },
    { id: 'content-marketing', label: 'Content Marketing', category: 'Organic', cost: 'Low' },
    { id: 'social-media', label: 'Social Media Management', category: 'Organic', cost: 'Low' },
    { id: 'email-marketing', label: 'Email Marketing', category: 'Direct', cost: 'Low' },
    { id: 'influencer', label: 'Influencer Marketing', category: 'Partnerships', cost: 'Medium' },
    { id: 'affiliate', label: 'Affiliate Marketing', category: 'Partnerships', cost: 'Variable' },
    { id: 'pr', label: 'Public Relations', category: 'Earned Media', cost: 'Medium' },
    { id: 'events', label: 'Events & Trade Shows', category: 'Events', cost: 'High' },
    { id: 'direct-mail', label: 'Direct Mail', category: 'Traditional', cost: 'High' },
    { id: 'podcast', label: 'Podcast Advertising', category: 'Audio', cost: 'Medium' }
  ];

  const handleGoalToggle = (goalId: string) => {
    setPrimaryGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleChannelToggle = (channelId: string) => {
    setMarketingChannels(prev => 
      prev.includes(channelId) 
        ? prev.filter(id => id !== channelId)
        : [...prev, channelId]
    );
  };

  const handleGenerateBudgetPlan = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => primaryGoals.includes(goal.id))
      .map(goal => goal.label);
    
    const selectedChannelLabels = marketingChannels.map(channelId => {
      const channel = channelOptions.find(c => c.id === channelId);
      return channel ? `${channel.label} (${channel.cost} cost)` : channelId;
    });

    const message = `Create a comprehensive marketing budget plan and ROI analysis with the following details:

**Budget Information:**
- Total Marketing Budget: ${totalBudget}
- Time Period: ${timePeriod}
- Business Type: ${businessType}
- Industry: ${industryType}
- Competitive Level: ${competitiveLevel}

**Business Metrics:**
- Current Revenue: ${currentRevenue}
- Target ROI: ${targetROI}
- Customer Lifetime Value: ${customerValue}
- Current Customer Acquisition Cost: ${acquisitionCost}
- Seasonality Considerations: ${seasonality}

**Marketing Objectives:**
- Primary Goals: ${selectedGoalLabels.join(', ')}

**Preferred Marketing Channels:**
- Selected Channels: ${selectedChannelLabels.join(', ')}

Please provide:

1. **Budget Allocation Strategy**
   - Detailed breakdown by channel and category
   - Percentage allocation recommendations
   - Monthly/quarterly spending plan
   - Reserve fund for testing and opportunities

2. **ROI Analysis & Projections**
   - Expected return for each channel
   - Break-even analysis timeline
   - Customer acquisition cost projections
   - Lifetime value optimization opportunities
   - Risk assessment for each channel

3. **Channel-Specific Recommendations**
   - Optimal spend levels for each selected channel
   - Expected performance metrics
   - Scaling strategies for high-performing channels
   - Testing budget allocations

4. **Spend Tracking System**
   - Key metrics to monitor for each channel
   - Budget management best practices
   - Alert systems for overspending
   - Performance review schedules
   - Adjustment protocols

5. **Optimization Framework**
   - When and how to reallocate budget
   - Testing and experimentation budget (10-20%)
   - Scaling successful campaigns
   - Cutting underperforming channels

6. **Implementation Timeline**
   - Month 1: Initial setup and testing
   - Month 2-3: Optimization and scaling
   - Month 4-6: Full execution and refinement
   - Quarterly review and adjustment points

7. **Success Metrics & KPIs**
   - Primary performance indicators
   - Secondary metrics to track
   - Reporting dashboard setup
   - ROI calculation methods

Make this actionable with specific dollar amounts, percentages, timelines, and measurable targets.`;

    onSendMessage(message);
  };

  const isFormValid = totalBudget && timePeriod && businessType && primaryGoals.length > 0 && marketingChannels.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Marketing Budget Planner</h2>
          <p className="text-gray-600">Optimize budget allocation, calculate ROI, and track marketing spend effectively</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              Budget Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="totalBudget">Total Marketing Budget *</Label>
              <Select value={totalBudget} onValueChange={setTotalBudget}>
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
                  <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="250k-plus">$250,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timePeriod">Time Period *</Label>
              <Select value={timePeriod} onValueChange={setTimePeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="semi-annual">Semi-Annual</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="startup">Startup</SelectItem>
                  <SelectItem value="small-business">Small Business</SelectItem>
                  <SelectItem value="medium-business">Medium Business</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="agency">Agency</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industryType">Industry</Label>
              <Select value={industryType} onValueChange={setIndustryType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="professional-services">Professional Services</SelectItem>
                  <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Business Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Business Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentRevenue">Current Monthly Revenue</Label>
              <Select value={currentRevenue} onValueChange={setCurrentRevenue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select revenue range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-10k">Under $10,000</SelectItem>
                  <SelectItem value="10k-50k">$10,000 - $50,000</SelectItem>
                  <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="100k-500k">$100,000 - $500,000</SelectItem>
                  <SelectItem value="500k-1m">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="over-1m">Over $1,000,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetROI">Target ROI</Label>
              <Select value={targetROI} onValueChange={setTargetROI}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target ROI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2x">2:1 (200% ROI)</SelectItem>
                  <SelectItem value="3x">3:1 (300% ROI)</SelectItem>
                  <SelectItem value="4x">4:1 (400% ROI)</SelectItem>
                  <SelectItem value="5x">5:1 (500% ROI)</SelectItem>
                  <SelectItem value="higher">Higher than 5:1</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customerValue">Average Customer Lifetime Value</Label>
              <Select value={customerValue} onValueChange={setCustomerValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select CLV range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-100">Under $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                  <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                  <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                  <SelectItem value="over-10k">Over $10,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="acquisitionCost">Current Customer Acquisition Cost</Label>
              <Select value={acquisitionCost} onValueChange={setAcquisitionCost}>
                <SelectTrigger>
                  <SelectValue placeholder="Select CAC range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-50">Under $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-250">$100 - $250</SelectItem>
                  <SelectItem value="250-500">$250 - $500</SelectItem>
                  <SelectItem value="500-1k">$500 - $1,000</SelectItem>
                  <SelectItem value="over-1k">Over $1,000</SelectItem>
                  <SelectItem value="unknown">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Marketing Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-600" />
            Primary Marketing Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  primaryGoals.includes(goal.id)
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={primaryGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {primaryGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {primaryGoals.map((goalId) => {
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

      {/* Marketing Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-600" />
            Marketing Channels *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Paid Advertising', 'Organic', 'Direct', 'Partnerships', 'Earned Media', 'Events', 'Traditional', 'Audio'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {channelOptions
                    .filter(channel => channel.category === category)
                    .map((channel) => (
                      <div
                        key={channel.id}
                        className={`flex items-center justify-between space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          marketingChannels.includes(channel.id)
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleChannelToggle(channel.id)}
                      >
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={marketingChannels.includes(channel.id)}
                            onChange={() => handleChannelToggle(channel.id)}
                          />
                          <span className="text-sm">{channel.label}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {channel.cost}
                        </Badge>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {marketingChannels.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {marketingChannels.slice(0, 6).map((channelId) => {
                const channel = channelOptions.find(c => c.id === channelId);
                return channel ? (
                  <Badge key={channelId} variant="secondary">
                    {channel.label}
                  </Badge>
                ) : null;
              })}
              {marketingChannels.length > 6 && (
                <Badge variant="outline">
                  +{marketingChannels.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Context (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="competitiveLevel">Competitive Level</Label>
            <Select value={competitiveLevel} onValueChange={setCompetitiveLevel}>
              <SelectTrigger>
                <SelectValue placeholder="How competitive is your market?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low Competition</SelectItem>
                <SelectItem value="moderate">Moderate Competition</SelectItem>
                <SelectItem value="high">High Competition</SelectItem>
                <SelectItem value="very-high">Very High Competition</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="seasonality">Seasonality Considerations</Label>
            <Textarea
              id="seasonality"
              value={seasonality}
              onChange={(e) => setSeasonality(e.target.value)}
              placeholder="Any seasonal trends, peak periods, or timing considerations for your business?"
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateBudgetPlan}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          {isLoading ? (
            <>
              <Calculator className="w-4 h-4 mr-2 animate-spin" />
              Calculating Budget Plan...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Generate Budget Plan
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