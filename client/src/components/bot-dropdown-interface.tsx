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

// Bot-specific dropdown options
const botOptions: Record<string, Array<{ label: string; value: string; description: string }>> = {
  'campaign-strategy': [
    { label: 'New Product Launch', value: 'product-launch', description: 'Create a comprehensive launch strategy' },
    { label: 'Brand Awareness', value: 'brand-awareness', description: 'Build visibility and recognition' },
    { label: 'Lead Generation', value: 'lead-generation', description: 'Generate qualified prospects' },
    { label: 'Customer Retention', value: 'customer-retention', description: 'Keep existing customers engaged' },
    { label: 'Market Expansion', value: 'market-expansion', description: 'Enter new markets or segments' }
  ],
  'logo-design': [
    { label: 'Modern Minimalist', value: 'minimalist', description: 'Clean, simple design with strong typography' },
    { label: 'Classic & Timeless', value: 'classic', description: 'Traditional design that stands the test of time' },
    { label: 'Bold & Dynamic', value: 'bold', description: 'Eye-catching design with strong visual impact' },
    { label: 'Tech & Innovation', value: 'tech', description: 'Modern design for technology companies' },
    { label: 'Organic & Natural', value: 'organic', description: 'Flowing design for health/wellness brands' }
  ],
  'brand-voice': [
    { label: 'Professional & Authoritative', value: 'professional', description: 'Formal tone for B2B and corporate' },
    { label: 'Friendly & Approachable', value: 'friendly', description: 'Warm tone for consumer brands' },
    { label: 'Innovative & Forward-thinking', value: 'innovative', description: 'Modern tone for tech companies' },
    { label: 'Luxury & Premium', value: 'luxury', description: 'Sophisticated tone for high-end brands' },
    { label: 'Fun & Playful', value: 'playful', description: 'Casual tone for lifestyle brands' }
  ],
  'ad-copy': [
    { label: 'Social Media Ads', value: 'social-media', description: 'Short, engaging copy for platforms' },
    { label: 'Google Ads', value: 'google-ads', description: 'Search-focused headlines and descriptions' },
    { label: 'Email Marketing', value: 'email', description: 'Subject lines and body copy' },
    { label: 'Print Advertising', value: 'print', description: 'Traditional media copy' },
    { label: 'Video Scripts', value: 'video', description: 'Narration and call-to-action scripts' }
  ],
  'seo-content': [
    { label: 'Blog Posts', value: 'blog-posts', description: 'SEO-optimized article content' },
    { label: 'Product Descriptions', value: 'product-descriptions', description: 'E-commerce copy that ranks' },
    { label: 'Landing Pages', value: 'landing-pages', description: 'Conversion-focused page content' },
    { label: 'Meta Descriptions', value: 'meta-descriptions', description: 'Search result snippets' },
    { label: 'Category Pages', value: 'category-pages', description: 'Navigation and overview content' }
  ]
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
    const option = botOptions[botId]?.find(opt => opt.value === selectedOption);
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

  const options = botOptions[botId] || [
    { label: 'General Analysis', value: 'general', description: 'Comprehensive business analysis' }
  ];

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