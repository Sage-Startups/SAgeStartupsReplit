import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Download, Loader2, Copy, CheckCircle, Star, Target, Lightbulb, Zap } from "lucide-react";

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
  const [copiedSections, setCopiedSections] = useState<Set<number>>(new Set());
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Load existing messages for this session
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  // Load previous results when session loads
  useEffect(() => {
    if (messages.length > 0) {
      // Find the last assistant message and set as result
      const lastAssistantMessage = messages
        .filter((msg: any) => msg.role === 'assistant')
        .pop();
      
      if (lastAssistantMessage) {
        setResult(lastAssistantMessage.content);
      }

      // Try to restore form data from first user message
      const firstUserMessage = messages.find((msg: any) => msg.role === 'user');
      if (firstUserMessage) {
        const content = firstUserMessage.content;
        const businessMatch = content.match(/Business:\s*(.+)/);
        const industryMatch = content.match(/Industry:\s*(.+)/);
        const targetMatch = content.match(/Target Audience:\s*(.+)/);
        const infoMatch = content.match(/Additional Information:\s*(.+)/);
        
        if (businessMatch) setBusinessName(businessMatch[1].trim());
        if (industryMatch) setIndustry(industryMatch[1].trim());
        if (targetMatch) setTargetAudience(targetMatch[1].trim());
        if (infoMatch) setAdditionalInfo(infoMatch[1].trim());
      }
    }
  }, [messages]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const prompt = buildPrompt();
      const options = getOptionsForBot(botId);
      const option = options.find((opt: any) => opt.value === selectedOption);
      
      // Update session title with descriptive name
      const sessionTitle = `${botName}: ${option?.label || selectedOption} for ${businessName}`;
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle 
      });
      
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
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] }); // Refresh projects to update session titles
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

  const copyToClipboard = async (text: string, sectionIndex: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSections(prev => new Set(prev).add(sectionIndex));
      setTimeout(() => {
        setCopiedSections(prev => {
          const newSet = new Set(prev);
          newSet.delete(sectionIndex);
          return newSet;
        });
      }, 2000);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy content",
        variant: "destructive"
      });
    }
  };

  const parseAndFormatResult = (content: string) => {
    // Split content into sections based on markdown headers
    const sections = content.split(/(?=^#{1,3}\s)/gm).filter(section => section.trim());
    
    return sections.map((section, index) => {
      const lines = section.trim().split('\n');
      const headerMatch = lines[0].match(/^(#{1,3})\s+(.+)/);
      
      if (headerMatch) {
        const level = headerMatch[1].length;
        const title = headerMatch[2].replace(/[🌿📱💡⚡🎯✨]/g, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        return {
          type: 'section',
          level,
          title,
          content,
          index
        };
      } else {
        return {
          type: 'content',
          content: section,
          index
        };
      }
    });
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
        <div className="space-y-6">
          {/* Header */}
          <Card className="border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-green-800">Content Generated Successfully</CardTitle>
                    <CardDescription className="text-green-600">
                      Your {selectedOption.replace('-', ' ')} content is ready
                    </CardDescription>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={exportResult}>
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Formatted Content Sections */}
          <div className="space-y-4">
            {parseAndFormatResult(result).map((section, index) => {
              if (section.type === 'section') {
                return (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-blue-500">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {section.level === 1 && <Star className="w-5 h-5 text-blue-600" />}
                          {section.level === 2 && <Target className="w-5 h-5 text-purple-600" />}
                          {section.level === 3 && <Lightbulb className="w-4 h-4 text-orange-500" />}
                          <CardTitle className={`${
                            section.level === 1 ? 'text-lg text-blue-800' :
                            section.level === 2 ? 'text-base text-purple-700' :
                            'text-sm text-orange-600'
                          }`}>
                            {section.title}
                          </CardTitle>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(section.content, section.index)}
                          className="h-8 w-8 p-0"
                        >
                          {copiedSections.has(section.index) ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              } else {
                return (
                  <Card key={index} className="border-gray-200">
                    <CardContent className="pt-6">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(section.content, section.index)}
                        >
                          {copiedSections.has(section.index) ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>

          {/* Quick Actions */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Zap className="w-5 h-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-gray-900">Ready to use this content?</h4>
                    <p className="text-sm text-gray-600">Copy sections individually or export everything</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(result, -1)}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy All
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setResult("");
                      setSelectedOption("");
                      setBusinessName("");
                      setIndustry("");
                      setTargetAudience("");
                      setAdditionalInfo("");
                    }}
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate New
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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