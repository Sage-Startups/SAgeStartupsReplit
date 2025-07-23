import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Megaphone, 
  Copy, 
  Download, 
  Share2, 
  Printer,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Search,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';

interface AdCopyData {
  product: string;
  usp: string;
  targetAudience: string;
  platform: string;
  tone: string;
  cta: string;
}

interface GeneratedAd {
  versionA: {
    headline: string;
    primaryText: string;
    description?: string;
    hooks: string[];
    carouselCaptions?: string[];
    reelsText?: string;
  };
  versionB: {
    headline: string;
    primaryText: string;
    description?: string;
    hooks: string[];
    carouselCaptions?: string[];
    reelsText?: string;
  };
}

export default function AdCopyGeneratorBot({ sessionId, initialData }: { sessionId: number; initialData?: any }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [adData, setAdData] = useState<AdCopyData>({
    product: initialData?.product || '',
    usp: initialData?.usp || '',
    targetAudience: initialData?.targetAudience || '',
    platform: initialData?.platform || '',
    tone: initialData?.tone || '',
    cta: initialData?.cta || ''
  });
  const [generatedAds, setGeneratedAds] = useState<GeneratedAd | null>(initialData?.generatedAds || null);
  const [selectedVersion, setSelectedVersion] = useState<'A' | 'B'>('A');

  const platforms = [
    { value: 'google-search', label: 'Google Search Ads', icon: Search },
    { value: 'facebook', label: 'Facebook Ads', icon: Facebook },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'twitter', label: 'Twitter/X', icon: Twitter },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube }
  ];

  const tones = [
    'Professional', 'Casual', 'Friendly', 'Urgent', 'Inspirational', 
    'Humorous', 'Educational', 'Emotional', 'Authoritative', 'Conversational'
  ];

  // Save session data
  const saveSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PUT', `/api/sessions/${sessionId}`, {
        data: {
          adData,
          generatedAds,
          currentStep: step
        }
      });
    }
  });

  // Generate ad copy using AI
  const generateAdsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: `Generate ad copy with the following details:
Product/Service: ${adData.product}
Unique Selling Proposition: ${adData.usp}
Target Audience: ${adData.targetAudience}
Platform: ${adData.platform}
Tone: ${adData.tone}
Call to Action: ${adData.cta}

Please provide TWO versions (A/B test) with:
- Compelling headlines
- Primary text/body copy
${adData.platform === 'google-search' ? '- Description text for Google Ads' : ''}
- 3-4 attention-grabbing hooks/openers
${adData.platform === 'instagram' ? '- 5 carousel caption ideas\n- Instagram Reels text overlay suggestions' : ''}

Make the copy platform-specific and optimized for ${adData.platform}.`,
        role: 'user'
      });
    },
    onSuccess: async (response: any) => {
      console.log('Ad generation response:', response);
      
      if (!response?.aiMessage?.content) {
        console.error('Invalid response structure:', response);
        toast({
          title: "Generation Failed",
          description: "Invalid response from AI service",
          variant: "destructive",
        });
        return;
      }
      
      const aiResponse = response.aiMessage;
      console.log('AI response content:', aiResponse.content);
      
      // Parse AI response to extract structured ad copy
      const ads = parseAIResponse(aiResponse.content);
      console.log('Parsed ads:', ads);
      
      setGeneratedAds(ads);
      setStep(3);
      
      try {
        await saveSessionMutation.mutateAsync();
      } catch (saveError) {
        console.error('Save error:', saveError);
        // Continue even if save fails
      }
      
      toast({
        title: "Ad Copy Generated",
        description: "Your A/B test versions are ready!",
      });
    },
    onError: (error: any) => {
      console.error('Ad generation error:', error);
      toast({
        title: "Generation Failed",
        description: `Failed to generate ad copy: ${error.message || 'Please try again.'}`,
        variant: "destructive",
      });
    }
  });

  // Parse AI response into structured format
  const parseAIResponse = (content: string): GeneratedAd => {
    // More robust parsing with fallbacks
    const sections = content.split(/(?:Version [AB]:|A\/B Version [AB]:|VERSION [AB])/i);
    
    const parseVersion = (text: string) => {
      if (!text || text.trim().length === 0) {
        return {
          headline: `${adData.product} - ${adData.usp}`,
          primaryText: `Transform your experience with ${adData.product}. ${adData.cta}`,
          hooks: [`Discover ${adData.product}`, `${adData.usp}`, `Perfect for ${adData.targetAudience}`],
          carouselCaptions: undefined,
          reelsText: undefined
        };
      }

      // Extract content with more flexible patterns
      const extractSection = (pattern: RegExp, defaultValue = '') => {
        const match = text.match(pattern);
        return match?.[1]?.trim() || defaultValue;
      };

      const extractList = (pattern: RegExp) => {
        const match = text.match(pattern);
        if (!match?.[1]) return [];
        return match[1].split('\n')
          .filter(item => item.trim())
          .map(item => item.replace(/^[-•*\d.]\s*/, '').trim())
          .filter(item => item.length > 0);
      };

      const headline = extractSection(/(?:Headline[s]?|Title):?\s*(.+?)(?=\n|Primary|Body|Description|Hooks|$)/i, 
        `${adData.product} - ${adData.usp}`);
      
      const primaryText = extractSection(/(?:Primary Text|Body Copy|Text):?\s*((?:.|\n)*?)(?=Description|Hooks|Carousel|Reels|$)/i,
        `Transform your experience with ${adData.product}. ${adData.cta}`);
      
      const description = extractSection(/Description:?\s*(.+?)(?=\n|Hooks|Carousel|Reels|$)/i);
      
      const hooks = extractList(/(?:Hooks?|Openers?):?\s*((?:.|\n)*?)(?=Carousel|Reels|Caption|$)/i);
      if (hooks.length === 0) {
        hooks.push(`Discover ${adData.product}`, `${adData.usp}`, `Perfect for ${adData.targetAudience}`);
      }

      const carouselCaptions = adData.platform === 'instagram' ? 
        extractList(/(?:Carousel Captions?|Instagram Carousel):?\s*((?:.|\n)*?)(?=Reels|$)/i) : undefined;
      
      const reelsText = adData.platform === 'instagram' ? 
        extractSection(/(?:Reels Text|Instagram Reels|Reels):?\s*(.+?)$/i) : undefined;

      return {
        headline,
        primaryText,
        description: description || undefined,
        hooks: hooks.slice(0, 4), // Limit to 4 hooks
        carouselCaptions: carouselCaptions?.slice(0, 5), // Limit to 5 captions
        reelsText
      };
    };

    // Parse both versions with fallbacks
    const versionA = parseVersion(sections[1] || sections[0] || content);
    const versionB = parseVersion(sections[2] || sections[0] || content);

    // Ensure versions are different
    if (versionA.headline === versionB.headline) {
      versionB.headline = `${versionA.headline} - Alternative`;
    }
    if (versionA.primaryText === versionB.primaryText) {
      versionB.primaryText = `${adData.product} delivers ${adData.usp}. ${adData.cta}`;
    }

    return { versionA, versionB };
  };

  const handleNext = () => {
    if (step === 1) {
      if (!adData.product || !adData.usp || !adData.targetAudience) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!adData.platform || !adData.tone || !adData.cta) {
        toast({
          title: "Missing Information",
          description: "Please complete all fields",
          variant: "destructive",
        });
        return;
      }
      generateAdsMutation.mutate();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Ad copy has been copied to clipboard",
    });
  };

  const downloadAds = () => {
    const content = `Ad Copy Generator Results
========================

Product/Service: ${adData.product}
USP: ${adData.usp}
Target Audience: ${adData.targetAudience}
Platform: ${adData.platform}
Tone: ${adData.tone}
CTA: ${adData.cta}

VERSION A
---------
Headline: ${generatedAds?.versionA.headline}
Primary Text: ${generatedAds?.versionA.primaryText}
${generatedAds?.versionA.description ? `Description: ${generatedAds.versionA.description}` : ''}

Hooks/Openers:
${generatedAds?.versionA.hooks.map(h => `• ${h}`).join('\n')}

${generatedAds?.versionA.carouselCaptions ? `
Carousel Captions:
${generatedAds.versionA.carouselCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')}
` : ''}

${generatedAds?.versionA.reelsText ? `Reels Text: ${generatedAds.versionA.reelsText}` : ''}

VERSION B
---------
Headline: ${generatedAds?.versionB.headline}
Primary Text: ${generatedAds?.versionB.primaryText}
${generatedAds?.versionB.description ? `Description: ${generatedAds.versionB.description}` : ''}

Hooks/Openers:
${generatedAds?.versionB.hooks.map(h => `• ${h}`).join('\n')}

${generatedAds?.versionB.carouselCaptions ? `
Carousel Captions:
${generatedAds.versionB.carouselCaptions.map((c, i) => `${i + 1}. ${c}`).join('\n')}
` : ''}

${generatedAds?.versionB.reelsText ? `Reels Text: ${generatedAds.versionB.reelsText}` : ''}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ad-copy-${adData.product.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData ? <platformData.icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Megaphone className="w-6 h-6 text-purple-600" />
            <CardTitle>Ad Copy Generator</CardTitle>
          </div>
          <CardDescription>
            Create compelling, platform-optimized ad copy with A/B testing variants
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                step > s ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Tell us about what you're advertising</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="product">Product or Service Name *</Label>
              <Input
                id="product"
                value={adData.product}
                onChange={(e) => setAdData({ ...adData, product: e.target.value })}
                placeholder="e.g., Premium Yoga Mat, Tax Consulting Service"
              />
            </div>

            <div>
              <Label htmlFor="usp">Unique Selling Proposition (USP) *</Label>
              <Textarea
                id="usp"
                value={adData.usp}
                onChange={(e) => setAdData({ ...adData, usp: e.target.value })}
                placeholder="What makes your product/service unique? e.g., '30% more cushioning than competitors' or '24/7 support with certified experts'"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="audience">Target Audience *</Label>
              <Textarea
                id="audience"
                value={adData.targetAudience}
                onChange={(e) => setAdData({ ...adData, targetAudience: e.target.value })}
                placeholder="Describe your ideal customer. e.g., 'Health-conscious millennials aged 25-35 who practice yoga regularly'"
                rows={3}
              />
            </div>

            <Button onClick={handleNext} className="w-full">
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Platform & Style */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Platform & Style</CardTitle>
            <CardDescription>Choose where and how to advertise</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="platform">Advertising Platform *</Label>
              <Select value={adData.platform} onValueChange={(value) => setAdData({ ...adData, platform: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center space-x-2">
                        <platform.icon className="w-4 h-4" />
                        <span>{platform.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="tone">Tone of Voice *</Label>
              <Select value={adData.tone} onValueChange={(value) => setAdData({ ...adData, tone: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                <SelectContent>
                  {tones.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cta">Call to Action (CTA) *</Label>
              <Input
                id="cta"
                value={adData.cta}
                onChange={(e) => setAdData({ ...adData, cta: e.target.value })}
                placeholder="e.g., Shop Now, Get Free Quote, Start Free Trial"
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={generateAdsMutation.isPending}
              >
                {generateAdsMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Ad Copy <Sparkles className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generated Results */}
      {step === 3 && generatedAds && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadAds} variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Download
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  <Printer className="mr-2 w-4 h-4" />
                  Print
                </Button>
                <Button onClick={() => {
                  setStep(1);
                  setGeneratedAds(null);
                }} variant="outline">
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* A/B Test Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Ad Copy</span>
                <div className="flex items-center space-x-2">
                  {getPlatformIcon(adData.platform)}
                  <Badge>{platforms.find(p => p.value === adData.platform)?.label}</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                A/B test versions for {adData.product}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedVersion} onValueChange={(v) => setSelectedVersion(v as 'A' | 'B')}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="A">Version A</TabsTrigger>
                  <TabsTrigger value="B">Version B</TabsTrigger>
                </TabsList>

                <TabsContent value="A" className="space-y-4">
                  <AdVersionDisplay 
                    version={generatedAds.versionA} 
                    platform={adData.platform}
                    onCopy={copyToClipboard}
                  />
                </TabsContent>

                <TabsContent value="B" className="space-y-4">
                  <AdVersionDisplay 
                    version={generatedAds.versionB} 
                    platform={adData.platform}
                    onCopy={copyToClipboard}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Ad Details Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Product:</span> {adData.product}
                </div>
                <div>
                  <span className="font-medium">Platform:</span> {platforms.find(p => p.value === adData.platform)?.label}
                </div>
                <div>
                  <span className="font-medium">Target Audience:</span> {adData.targetAudience}
                </div>
                <div>
                  <span className="font-medium">Tone:</span> {adData.tone}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">USP:</span> {adData.usp}
                </div>
                <div className="col-span-2">
                  <span className="font-medium">CTA:</span> {adData.cta}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Component to display ad version
function AdVersionDisplay({ 
  version, 
  platform, 
  onCopy 
}: { 
  version: GeneratedAd['versionA'], 
  platform: string,
  onCopy: (text: string) => void 
}) {
  return (
    <div className="space-y-4">
      {/* Headline */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <Label className="text-sm font-medium">Headline</Label>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onCopy(version.headline)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-lg font-semibold">{version.headline}</p>
      </div>

      {/* Primary Text */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-start mb-2">
          <Label className="text-sm font-medium">Primary Text</Label>
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onCopy(version.primaryText)}
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p>{version.primaryText}</p>
      </div>

      {/* Description (for Google Ads) */}
      {platform === 'google-search' && version.description && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <Label className="text-sm font-medium">Description</Label>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => onCopy(version.description!)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
          <p>{version.description}</p>
        </div>
      )}

      {/* Hooks/Openers */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <Label className="text-sm font-medium mb-2 block">Ad Hooks/Openers</Label>
        <ul className="space-y-2">
          {version.hooks.map((hook, index) => (
            <li key={index} className="flex items-start space-x-2">
              <Target className="w-4 h-4 text-purple-600 mt-0.5" />
              <span className="flex-1">{hook}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Carousel Captions (for Instagram) */}
      {platform === 'instagram' && version.carouselCaptions && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Carousel Caption Ideas</Label>
          <div className="space-y-2">
            {version.carouselCaptions.map((caption, index) => (
              <div key={index} className="flex items-start space-x-2">
                <Badge variant="outline">{index + 1}</Badge>
                <span className="flex-1 text-sm">{caption}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reels Text (for Instagram) */}
      {platform === 'instagram' && version.reelsText && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium mb-2 block">Instagram Reels Text Overlay</Label>
          <p className="italic">{version.reelsText}</p>
        </div>
      )}
    </div>
  );
}