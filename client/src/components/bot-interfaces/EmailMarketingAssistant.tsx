import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Target, Sparkles } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface EmailCampaign {
  sequence: number;
  subject: string;
  content: string;
  timing: string;
  purpose: string;
}

interface EmailMarketingAssistantProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function EmailMarketingAssistant({ onSendMessage, isLoading, sessionId }: EmailMarketingAssistantProps) {
  const [businessType, setBusinessType] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [campaignGoal, setCampaignGoal] = useState('');
  const [campaignLength, setCampaignLength] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [productService, setProductService] = useState('');

  const handleGenerateCampaign = () => {
    const prompt = `Create a comprehensive email marketing campaign with the following specifications:

**Business Information:**
- Business Type: ${businessType}
- Product/Service: ${productService}
- Brand Voice: ${brandVoice}

**Campaign Details:**
- Target Audience: ${targetAudience}
- Campaign Goal: ${campaignGoal}
- Number of Emails: ${campaignLength} emails

**Requirements:**
Generate a complete email sequence (${campaignLength} emails) including:

1. **Campaign Overview:**
   - Campaign strategy and timeline
   - Key messaging themes
   - Success metrics to track

2. **For Each Email (${campaignLength} emails total):**
   - Email #[X] Subject Line (3-5 variations per email)
   - Full email content (personalized and engaging)
   - Optimal send timing (day/time recommendations)
   - Email purpose and goal
   - Call-to-action suggestions

3. **Email Sequence Strategy:**
   - Welcome/Introduction email
   - Value-driven content emails
   - Social proof/testimonial emails
   - Promotional/sales emails (if applicable)
   - Follow-up/retention emails

4. **Advanced Recommendations:**
   - Personalization strategies
   - Segmentation suggestions
   - A/B testing ideas
   - Automation triggers
   - Performance optimization tips

5. **Technical Specifications:**
   - Optimal email length
   - Mobile optimization tips
   - Deliverability best practices
   - Legal compliance (CAN-SPAM, GDPR)

Please create engaging, conversion-focused email content that matches the brand voice and resonates with the target audience. Include specific subject line variations and detailed email content for each message in the sequence.`;

    onSendMessage(prompt);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Email Marketing Campaign Generator</h2>
        <p className="text-gray-600 mb-6">
          Create complete email sequences with subject lines, content, and timing for 2-7 email campaigns
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Campaign Setup
            </CardTitle>
            <CardDescription>Define your email campaign parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="businessType">Business Type</Label>
              <Input
                id="businessType"
                placeholder="e.g., SaaS startup, E-commerce, Consulting"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="productService">Product/Service</Label>
              <Input
                id="productService"
                placeholder="Brief description of what you offer"
                value={productService}
                onChange={(e) => setProductService(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                placeholder="Describe your ideal customer demographics, interests, and pain points"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="campaignGoal">Campaign Goal</Label>
              <Select value={campaignGoal} onValueChange={setCampaignGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign objective" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="welcome-onboarding">Welcome & Onboarding</SelectItem>
                  <SelectItem value="product-launch">Product Launch</SelectItem>
                  <SelectItem value="lead-nurturing">Lead Nurturing</SelectItem>
                  <SelectItem value="customer-retention">Customer Retention</SelectItem>
                  <SelectItem value="sales-conversion">Sales Conversion</SelectItem>
                  <SelectItem value="brand-awareness">Brand Awareness</SelectItem>
                  <SelectItem value="event-promotion">Event Promotion</SelectItem>
                  <SelectItem value="re-engagement">Re-engagement Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Campaign Details
            </CardTitle>
            <CardDescription>Customize your email sequence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="campaignLength">Number of Emails</Label>
              <Select value={campaignLength} onValueChange={setCampaignLength}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sequence length" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 Emails - Quick Introduction</SelectItem>
                  <SelectItem value="3">3 Emails - Standard Sequence</SelectItem>
                  <SelectItem value="4">4 Emails - Balanced Campaign</SelectItem>
                  <SelectItem value="5">5 Emails - Comprehensive Series</SelectItem>
                  <SelectItem value="6">6 Emails - Extended Nurturing</SelectItem>
                  <SelectItem value="7">7 Emails - Full Journey Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice & Tone</Label>
              <Select value={brandVoice} onValueChange={setBrandVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select brand personality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional & Authoritative</SelectItem>
                  <SelectItem value="friendly">Friendly & Conversational</SelectItem>
                  <SelectItem value="casual">Casual & Relaxed</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic & Energetic</SelectItem>
                  <SelectItem value="trustworthy">Trustworthy & Reliable</SelectItem>
                  <SelectItem value="innovative">Innovative & Forward-thinking</SelectItem>
                  <SelectItem value="caring">Caring & Supportive</SelectItem>
                  <SelectItem value="exclusive">Exclusive & Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">What You'll Get:</h4>
                <div className="space-y-2 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Complete email sequence with timing
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    3-5 subject line variations per email
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Personalized email content
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">✓</Badge>
                    Optimization recommendations
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleGenerateCampaign}
          disabled={!businessType || !targetAudience || !campaignGoal || !campaignLength || !brandVoice || isLoading}
          size="lg"
          className="px-8"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Generating Campaign...
            </>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Generate Email Campaign
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