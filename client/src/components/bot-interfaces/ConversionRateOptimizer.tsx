import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, Target, Zap, TestTube, Eye } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ConversionRateOptimizerProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ConversionRateOptimizer({ onSendMessage, isLoading, sessionId }: ConversionRateOptimizerProps) {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [currentConversionRate, setCurrentConversionRate] = useState('');
  const [trafficVolume, setTrafficVolume] = useState('');
  const [primaryGoal, setPrimaryGoal] = useState('');
  const [funnelStages, setFunnelStages] = useState<string[]>([]);
  const [currentIssues, setCurrentIssues] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [currentTools, setCurrentTools] = useState('');
  const [testingExperience, setTestingExperience] = useState('');

  const funnelStageOptions = [
    { id: 'awareness', label: 'Awareness/Landing', icon: <Eye className="w-4 h-4" /> },
    { id: 'interest', label: 'Interest/Browse', icon: <Target className="w-4 h-4" /> },
    { id: 'consideration', label: 'Consideration/Compare', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'intent', label: 'Intent/Cart', icon: <Target className="w-4 h-4" /> },
    { id: 'purchase', label: 'Purchase/Checkout', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'retention', label: 'Retention/Upsell', icon: <Target className="w-4 h-4" /> }
  ];

  const commonIssueOptions = [
    { id: 'slow-loading', label: 'Slow Page Loading', category: 'Technical' },
    { id: 'mobile-issues', label: 'Mobile Experience Issues', category: 'Technical' },
    { id: 'unclear-value', label: 'Unclear Value Proposition', category: 'Messaging' },
    { id: 'weak-cta', label: 'Weak Call-to-Actions', category: 'Messaging' },
    { id: 'complex-forms', label: 'Complex Forms/Checkout', category: 'UX' },
    { id: 'navigation', label: 'Poor Navigation', category: 'UX' },
    { id: 'trust-signals', label: 'Lack of Trust Signals', category: 'Social Proof' },
    { id: 'reviews', label: 'Missing Reviews/Testimonials', category: 'Social Proof' },
    { id: 'pricing', label: 'Pricing Concerns', category: 'Pricing' },
    { id: 'shipping', label: 'Shipping/Policy Issues', category: 'Pricing' },
    { id: 'support', label: 'Poor Customer Support', category: 'Support' },
    { id: 'follow-up', label: 'Weak Follow-up Process', category: 'Support' }
  ];

  const handleFunnelStageToggle = (stageId: string) => {
    setFunnelStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleIssueToggle = (issueId: string) => {
    setCurrentIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleGenerateOptimization = () => {
    const selectedStageLabels = funnelStageOptions
      .filter(stage => funnelStages.includes(stage.id))
      .map(stage => stage.label);
    
    const selectedIssueLabels = commonIssueOptions
      .filter(issue => currentIssues.includes(issue.id))
      .map(issue => issue.label);

    const message = `Create a comprehensive conversion rate optimization analysis and strategy with the following details:

**Website & Business Information:**
- Website URL: ${websiteUrl}
- Business Type: ${businessType}
- Primary Conversion Goal: ${primaryGoal}
- Current Conversion Rate: ${currentConversionRate}
- Monthly Traffic Volume: ${trafficVolume}

**Target Audience:**
${targetAudience}

**Funnel Focus Areas:**
- Stages to Optimize: ${selectedStageLabels.join(', ')}

**Current Issues Identified:**
- Known Problems: ${selectedIssueLabels.join(', ')}

**Current Setup:**
- Analytics/Testing Tools: ${currentTools}
- A/B Testing Experience: ${testingExperience}

**Competitive Context:**
${competitorAnalysis}

Please provide:

1. **Funnel Analysis & Audit**
   - Stage-by-stage conversion breakdown
   - Identify biggest drop-off points
   - Calculate potential revenue impact
   - Prioritize optimization opportunities

2. **Performance Improvement Recommendations**
   - Technical optimizations (speed, mobile, UX)
   - Content and messaging improvements
   - Design and layout changes
   - Trust signal enhancements
   - Form and checkout optimizations

3. **A/B Testing Strategy**
   - Prioritized list of tests to run
   - Test hypotheses and expected outcomes
   - Test duration and sample size requirements
   - Statistical significance targets
   - Test variation ideas and mockups

4. **Implementation Roadmap**
   - Quick wins (0-2 weeks)
   - Medium-term improvements (1-3 months)
   - Long-term strategic changes (3-6 months)
   - Resource requirements for each phase

5. **Measurement & Analytics**
   - Key metrics to track
   - Analytics setup recommendations
   - Reporting dashboard suggestions
   - Success criteria and benchmarks

6. **Projected Impact**
   - Expected conversion rate improvements
   - Revenue impact calculations
   - Timeline for seeing results
   - ROI projections

Make this actionable with specific implementation steps, tools needed, and measurable outcomes.`;

    onSendMessage(message);
  };

  const isFormValid = websiteUrl && businessType && primaryGoal && funnelStages.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conversion Rate Optimizer</h2>
          <p className="text-gray-600">Analyze your funnel, get optimization recommendations, and plan A/B tests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Website Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label htmlFor="businessType">Business Type *</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ecommerce">E-commerce</SelectItem>
                  <SelectItem value="saas">SaaS/Software</SelectItem>
                  <SelectItem value="lead-gen">Lead Generation</SelectItem>
                  <SelectItem value="subscription">Subscription Service</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="service">Service Business</SelectItem>
                  <SelectItem value="content">Content/Media</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="primaryGoal">Primary Conversion Goal *</Label>
              <Select value={primaryGoal} onValueChange={setPrimaryGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Product Purchase</SelectItem>
                  <SelectItem value="signup">User Signup/Registration</SelectItem>
                  <SelectItem value="trial">Free Trial Signup</SelectItem>
                  <SelectItem value="demo">Demo Request</SelectItem>
                  <SelectItem value="lead">Lead Generation</SelectItem>
                  <SelectItem value="subscription">Subscription/Membership</SelectItem>
                  <SelectItem value="download">Download/Install</SelectItem>
                  <SelectItem value="contact">Contact Form Submission</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (demographics, behavior, preferences)"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              Current Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="currentConversionRate">Current Conversion Rate</Label>
              <Select value={currentConversionRate} onValueChange={setCurrentConversionRate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select current conversion rate" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1">Under 1%</SelectItem>
                  <SelectItem value="1-2">1% - 2%</SelectItem>
                  <SelectItem value="2-3">2% - 3%</SelectItem>
                  <SelectItem value="3-5">3% - 5%</SelectItem>
                  <SelectItem value="5-10">5% - 10%</SelectItem>
                  <SelectItem value="over-10">Over 10%</SelectItem>
                  <SelectItem value="unknown">Don't know</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="trafficVolume">Monthly Traffic Volume</Label>
              <Select value={trafficVolume} onValueChange={setTrafficVolume}>
                <SelectTrigger>
                  <SelectValue placeholder="Select traffic volume" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-1k">Under 1,000 visitors</SelectItem>
                  <SelectItem value="1k-5k">1,000 - 5,000 visitors</SelectItem>
                  <SelectItem value="5k-10k">5,000 - 10,000 visitors</SelectItem>
                  <SelectItem value="10k-50k">10,000 - 50,000 visitors</SelectItem>
                  <SelectItem value="50k-100k">50,000 - 100,000 visitors</SelectItem>
                  <SelectItem value="over-100k">Over 100,000 visitors</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="currentTools">Current Analytics/Testing Tools</Label>
              <Textarea
                id="currentTools"
                value={currentTools}
                onChange={(e) => setCurrentTools(e.target.value)}
                placeholder="What tools do you currently use? (Google Analytics, Hotjar, Optimizely, etc.)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="testingExperience">A/B Testing Experience</Label>
              <Select value={testingExperience} onValueChange={setTestingExperience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select testing experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No experience</SelectItem>
                  <SelectItem value="beginner">Beginner (1-5 tests)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (5-20 tests)</SelectItem>
                  <SelectItem value="advanced">Advanced (20+ tests)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funnel Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-600" />
            Funnel Stages to Optimize *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {funnelStageOptions.map((stage) => (
              <div
                key={stage.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  funnelStages.includes(stage.id)
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFunnelStageToggle(stage.id)}
              >
                <Checkbox
                  checked={funnelStages.includes(stage.id)}
                  onChange={() => handleFunnelStageToggle(stage.id)}
                />
                <div className="flex items-center gap-2">
                  {stage.icon}
                  <span className="text-sm font-medium">{stage.label}</span>
                </div>
              </div>
            ))}
          </div>
          {funnelStages.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {funnelStages.map((stageId) => {
                const stage = funnelStageOptions.find(s => s.id === stageId);
                return stage ? (
                  <Badge key={stageId} variant="secondary" className="flex items-center gap-1">
                    {stage.icon}
                    {stage.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5 text-green-600" />
            Current Issues (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {['Technical', 'Messaging', 'UX', 'Social Proof', 'Pricing', 'Support'].map((category) => (
              <div key={category}>
                <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {commonIssueOptions
                    .filter(issue => issue.category === category)
                    .map((issue) => (
                      <div
                        key={issue.id}
                        className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${
                          currentIssues.includes(issue.id)
                            ? 'border-orange-500 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handleIssueToggle(issue.id)}
                      >
                        <Checkbox
                          checked={currentIssues.includes(issue.id)}
                          onChange={() => handleIssueToggle(issue.id)}
                        />
                        <span className="text-sm">{issue.label}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
          {currentIssues.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {currentIssues.slice(0, 6).map((issueId) => {
                const issue = commonIssueOptions.find(i => i.id === issueId);
                return issue ? (
                  <Badge key={issueId} variant="destructive">
                    {issue.label}
                  </Badge>
                ) : null;
              })}
              {currentIssues.length > 6 && (
                <Badge variant="outline">
                  +{currentIssues.length - 6} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitive Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Competitive Analysis (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            id="competitorAnalysis"
            value={competitorAnalysis}
            onChange={(e) => setCompetitorAnalysis(e.target.value)}
            placeholder="How do competitors handle conversions? What best practices have you noticed?"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerateOptimization}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
        >
          {isLoading ? (
            <>
              <BarChart3 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing Conversion Funnel...
            </>
          ) : (
            <>
              <TrendingUp className="w-4 h-4 mr-2" />
              Generate Optimization Plan
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