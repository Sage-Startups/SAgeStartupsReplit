import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Download, Loader2 } from "lucide-react";

interface BotDropdownInterfaceProps {
  sessionId: number;
  botName: string;
  botId: string;
  botColor: string;
}

// Universal dropdown options that work for all bots - automatically adapts based on bot type
const getOptionsForBot = (botId: string) => {
  // Marketing bots
  if (botId.includes('campaign') || botId.includes('marketing')) {
    return [
      { label: 'New Product Launch', value: 'product-launch', description: 'Create a comprehensive launch strategy' },
      { label: 'Brand Awareness', value: 'brand-awareness', description: 'Build visibility and recognition' },
      { label: 'Lead Generation', value: 'lead-generation', description: 'Generate qualified prospects' },
      { label: 'Customer Retention', value: 'customer-retention', description: 'Keep existing customers engaged' },
      { label: 'Market Expansion', value: 'market-expansion', description: 'Enter new markets or segments' }
    ];
  }
  
  // Branding bots
  if (botId.includes('logo') || botId.includes('brand') || botId.includes('design')) {
    return [
      { label: 'Modern Minimalist', value: 'minimalist', description: 'Clean, simple design with strong typography' },
      { label: 'Classic & Timeless', value: 'classic', description: 'Traditional design that stands the test of time' },
      { label: 'Bold & Dynamic', value: 'bold', description: 'Eye-catching design with strong visual impact' },
      { label: 'Tech & Innovation', value: 'tech', description: 'Modern design for technology companies' },
      { label: 'Organic & Natural', value: 'organic', description: 'Flowing design for health/wellness brands' }
    ];
  }
  
  // Content bots
  if (botId.includes('content') || botId.includes('seo') || botId.includes('blog')) {
    return [
      { label: 'Blog Posts', value: 'blog-posts', description: 'SEO-optimized article content' },
      { label: 'Product Descriptions', value: 'product-descriptions', description: 'E-commerce copy that ranks' },
      { label: 'Landing Pages', value: 'landing-pages', description: 'Conversion-focused page content' },
      { label: 'Meta Descriptions', value: 'meta-descriptions', description: 'Search result snippets' },
      { label: 'Website Copy', value: 'website-copy', description: 'About us, services, and main pages' }
    ];
  }
  
  // Ad bots
  if (botId.includes('ad') || botId.includes('copy')) {
    return [
      { label: 'Social Media Ads', value: 'social-media', description: 'Short, engaging copy for platforms' },
      { label: 'Google Ads', value: 'google-ads', description: 'Search-focused headlines and descriptions' },
      { label: 'Email Marketing', value: 'email', description: 'Subject lines and body copy' },
      { label: 'Print Advertising', value: 'print', description: 'Traditional media copy' },
      { label: 'Video Scripts', value: 'video', description: 'Narration and call-to-action scripts' }
    ];
  }
  
  // Analytics/Strategy bots
  if (botId.includes('analytics') || botId.includes('insights') || botId.includes('performance')) {
    return [
      { label: 'Performance Analysis', value: 'performance', description: 'Analyze current marketing performance' },
      { label: 'Competitor Research', value: 'competitor', description: 'Research and analyze competitors' },
      { label: 'Market Trends', value: 'trends', description: 'Identify market opportunities' },
      { label: 'ROI Optimization', value: 'roi', description: 'Improve return on investment' },
      { label: 'KPI Dashboard', value: 'dashboard', description: 'Set up key metrics tracking' }
    ];
  }
  
  // Community/Social bots
  if (botId.includes('social') || botId.includes('community') || botId.includes('engagement')) {
    return [
      { label: 'Content Calendar', value: 'calendar', description: 'Plan social media posts' },
      { label: 'Engagement Strategy', value: 'engagement', description: 'Increase follower interaction' },
      { label: 'Hashtag Research', value: 'hashtags', description: 'Find trending hashtags' },
      { label: 'Community Events', value: 'events', description: 'Plan online/offline events' },
      { label: 'Influencer Outreach', value: 'influencer', description: 'Connect with key influencers' }
    ];
  }
  
  // Default universal options for any bot
  return [
    { label: 'Strategy Development', value: 'strategy', description: 'Create a comprehensive strategy' },
    { label: 'Content Creation', value: 'content', description: 'Generate relevant content' },
    { label: 'Analysis & Research', value: 'analysis', description: 'Research and analyze opportunities' },
    { label: 'Optimization', value: 'optimization', description: 'Improve existing efforts' },
    { label: 'Implementation Plan', value: 'implementation', description: 'Step-by-step action plan' }
  ];
};

export function BotDropdownInterface({ sessionId, botName, botId, botColor }: BotDropdownInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState("");
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const prompt = buildPrompt();
      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, { 
        content: prompt,
        role: 'user'
      });
      return response.json();
    },
    onSuccess: (data) => {
      console.log('API Response:', data); // Debug log
      const content = data.aiMessage?.content || data.content || '';
      setResult(content);
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
      toast({
        title: "Generated!",
        description: "Your content has been created successfully."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive"
      });
    }
  });

  const buildPrompt = () => {
    const options = getOptionsForBot(botId);
    const option = options.find((opt: any) => opt.value === selectedOption);
    return `Create ${option?.label || selectedOption} for:
Business: ${businessName}
Industry: ${industry}
Target Audience: ${targetAudience}
Additional Information: ${additionalInfo}

Please provide a comprehensive, actionable response.`;
  };

  const handleGenerate = () => {
    if (!selectedOption || !businessName) {
      toast({
        title: "Missing Information",
        description: "Please select an option and enter your business name.",
        variant: "destructive"
      });
      return;
    }
    generateMutation.mutate();
  };

  const exportResult = () => {
    if (!result) return;
    
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName}_${selectedOption}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const options = getOptionsForBot(botId);

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
              botColor === 'text-primary' ? 'bg-primary' : 
              botColor === 'text-secondary' ? 'bg-secondary' : 
              'bg-accent'
            }`}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {botName}
          </CardTitle>
          <CardDescription>
            Select options and provide your business information to generate tailored content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="option">What would you like to create?</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an option..." />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="business-name">Business Name *</Label>
              <Input
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Enter your business name"
                required
              />
            </div>
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g., Technology, Healthcare, Retail"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="target-audience">Target Audience</Label>
            <Input
              id="target-audience"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Small business owners, Young professionals"
            />
          </div>

          <div>
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea
              id="additional-info"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any specific requirements, brand values, or additional context..."
              rows={3}
            />
          </div>

          <Button 
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !selectedOption || !businessName}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Content</CardTitle>
              <Button variant="outline" size="sm" onClick={exportResult}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg border">
                {result}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Debug info - remove in production */}
      {generateMutation.isPending && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-500">
              Generating content... This may take a few moments.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}