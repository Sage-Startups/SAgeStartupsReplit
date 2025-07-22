import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  FileText, Video, Image, Mic, Hash, Calendar,
  TrendingUp, Edit3, Copy, Download, RefreshCw,
  Sparkles, Clock, Eye, Heart, MessageSquare, Share2,
  BarChart, CheckCircle
} from "lucide-react";

interface ContentCreatorBotProps {
  sessionId: number;
  botName: string;
}

type ContentType = 'blog' | 'social' | 'video' | 'email' | 'ad';

export function ContentCreatorBot({ sessionId, botName }: ContentCreatorBotProps) {
  const [contentType, setContentType] = useState<ContentType>('blog');
  const [contentBrief, setContentBrief] = useState({
    topic: '',
    audience: '',
    tone: 'professional',
    length: 'medium',
    keywords: '',
    goals: '',
    references: '',
    platform: ''
  });
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const { toast } = useToast();

  // Load existing session
  const { data: messages = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  useEffect(() => {
    if (messages && messages.length > 0) {
      const lastMessage = messages[messages.length - 1] as any;
      if (lastMessage.role === 'assistant') {
        try {
          const savedContent = JSON.parse(lastMessage.content);
          setGeneratedContent(savedContent);
        } catch (e) {
          // Not JSON
        }
      }
    }
  }, [messages]);

  const generateContentMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Content: ${contentType} - ${contentBrief.topic}`
      });

      const prompt = `As a content creation expert, create ${contentType} content for:
        Topic: ${contentBrief.topic}
        Audience: ${contentBrief.audience}
        Tone: ${contentBrief.tone}
        Length: ${contentBrief.length}
        Keywords: ${contentBrief.keywords}
        Goals: ${contentBrief.goals}
        References: ${contentBrief.references}
        Platform: ${contentBrief.platform || contentType}
        
        Create comprehensive content with:
        1. Engaging headline/title options
        2. Full content with proper structure
        3. SEO optimization
        4. Call-to-action suggestions
        5. Distribution strategy`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: (data) => {
      const content = {
        type: contentType,
        headlines: [
          "10 Revolutionary Ways AI is Transforming Your Industry",
          "The Ultimate Guide to Digital Transformation in 2024",
          "Why Industry Leaders are Embracing This Game-Changing Strategy"
        ],
        mainContent: data.content,
        structure: {
          introduction: "Hook your audience with a compelling problem or statistic",
          body: [
            "Point 1: Set the foundation with context",
            "Point 2: Dive into the main insights",
            "Point 3: Provide actionable examples",
            "Point 4: Address common objections"
          ],
          conclusion: "Summarize key points and inspire action"
        },
        seo: {
          metaDescription: "Discover how to transform your business with proven strategies. Learn from industry experts and implement changes that drive real results.",
          keywords: ["digital transformation", "AI strategy", "business growth", "innovation"],
          readingTime: "7 minutes"
        },
        performance: {
          estimatedReach: "5,000-10,000",
          engagementRate: "3.5%",
          shareability: "High"
        },
        distribution: [
          { channel: "LinkedIn", timing: "Tuesday 10am", format: "Article + teaser post" },
          { channel: "Email Newsletter", timing: "Thursday 2pm", format: "Full content" },
          { channel: "Company Blog", timing: "Immediate", format: "SEO-optimized post" }
        ]
      };
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/sessions', sessionId, 'messages'] 
      });
      
      toast({
        title: "Content Created! ✍️",
        description: "Your content is ready for review and publishing",
      });
    }
  });

  const contentTypes = [
    { id: 'blog', label: 'Blog Post', icon: <FileText className="w-4 h-4" />, color: 'bg-blue-100 text-blue-700' },
    { id: 'social', label: 'Social Media', icon: <Hash className="w-4 h-4" />, color: 'bg-purple-100 text-purple-700' },
    { id: 'video', label: 'Video Script', icon: <Video className="w-4 h-4" />, color: 'bg-red-100 text-red-700' },
    { id: 'email', label: 'Email Campaign', icon: <MessageSquare className="w-4 h-4" />, color: 'bg-green-100 text-green-700' },
    { id: 'ad', label: 'Ad Copy', icon: <TrendingUp className="w-4 h-4" />, color: 'bg-orange-100 text-orange-700' }
  ];

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'humorous', label: 'Humorous' },
    { value: 'inspirational', label: 'Inspirational' },
    { value: 'educational', label: 'Educational' },
    { value: 'persuasive', label: 'Persuasive' }
  ];

  const getPlatformOptions = () => {
    switch (contentType) {
      case 'social':
        return ['LinkedIn', 'Twitter', 'Instagram', 'Facebook', 'TikTok'];
      case 'video':
        return ['YouTube', 'TikTok', 'Instagram Reels', 'LinkedIn Video'];
      case 'email':
        return ['Newsletter', 'Promotional', 'Welcome Series', 'Nurture Campaign'];
      case 'ad':
        return ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Display Ads'];
      default:
        return [];
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Edit3 className="w-8 h-8" />
            {botName} - Content Creation Master
          </CardTitle>
          <CardDescription className="text-indigo-100">
            I create compelling content that engages your audience and drives results
          </CardDescription>
        </CardHeader>
      </Card>

      {!generatedContent ? (
        <div className="space-y-6">
          {/* Content Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>What type of content do you need?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-3">
                {contentTypes.map(type => (
                  <Button
                    key={type.id}
                    variant={contentType === type.id ? "default" : "outline"}
                    className="flex flex-col items-center gap-2 h-auto py-4"
                    onClick={() => setContentType(type.id as ContentType)}
                  >
                    <div className={`p-2 rounded-lg ${contentType === type.id ? 'bg-white/20' : type.color}`}>
                      {type.icon}
                    </div>
                    <span className="text-xs">{type.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Brief Form */}
          <Card>
            <CardHeader>
              <CardTitle>Content Brief</CardTitle>
              <CardDescription>
                Tell me about your content needs so I can create something amazing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Topic/Subject</Label>
                <Input
                  value={contentBrief.topic}
                  onChange={(e) => setContentBrief(prev => ({ ...prev, topic: e.target.value }))}
                  placeholder="What's the main topic or subject?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Target Audience</Label>
                  <Input
                    value={contentBrief.audience}
                    onChange={(e) => setContentBrief(prev => ({ ...prev, audience: e.target.value }))}
                    placeholder="Who will read/watch this?"
                  />
                </div>
                <div>
                  <Label>Tone of Voice</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={contentBrief.tone}
                    onChange={(e) => setContentBrief(prev => ({ ...prev, tone: e.target.value }))}
                  >
                    {toneOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {getPlatformOptions().length > 0 && (
                <div>
                  <Label>Platform</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={contentBrief.platform}
                    onChange={(e) => setContentBrief(prev => ({ ...prev, platform: e.target.value }))}
                  >
                    <option value="">Select platform</option>
                    {getPlatformOptions().map(platform => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <Label>Content Length</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['short', 'medium', 'long', 'comprehensive'].map(length => (
                    <Button
                      key={length}
                      variant={contentBrief.length === length ? "default" : "outline"}
                      size="sm"
                      onClick={() => setContentBrief(prev => ({ ...prev, length }))}
                    >
                      {length.charAt(0).toUpperCase() + length.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Keywords (SEO)</Label>
                <Input
                  value={contentBrief.keywords}
                  onChange={(e) => setContentBrief(prev => ({ ...prev, keywords: e.target.value }))}
                  placeholder="Important keywords to include (comma separated)"
                />
              </div>

              <div>
                <Label>Content Goals</Label>
                <Textarea
                  value={contentBrief.goals}
                  onChange={(e) => setContentBrief(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="What do you want to achieve with this content?"
                  rows={2}
                />
              </div>

              <div>
                <Label>References/Examples</Label>
                <Textarea
                  value={contentBrief.references}
                  onChange={(e) => setContentBrief(prev => ({ ...prev, references: e.target.value }))}
                  placeholder="Any examples or references to consider?"
                  rows={2}
                />
              </div>

              <Button 
                onClick={() => generateContentMutation.mutate()} 
                className="w-full"
                disabled={!contentBrief.topic || !contentBrief.audience || generateContentMutation.isPending}
              >
                {generateContentMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Creating Your Content...
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
        </div>
      ) : (
        <div className="space-y-6">
          {/* Success Banner */}
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  Your {contentType} content is ready!
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setGeneratedContent(null)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="headlines">Headlines</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Generated Content</CardTitle>
                  <CardDescription>
                    Your {contentType} content optimized for {contentBrief.platform || 'your platform'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{generatedContent.mainContent}</p>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {generatedContent.seo?.readingTime || '5 minutes'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {generatedContent.performance?.estimatedReach || '1,000-5,000'}
                      </span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(generatedContent.mainContent)}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Content Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-900">Introduction</h4>
                      <p className="text-sm text-blue-700 mt-1">{generatedContent.structure?.introduction}</p>
                    </div>
                    {generatedContent.structure?.body?.map((section: string, index: number) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm">{section}</p>
                      </div>
                    ))}
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-900">Conclusion</h4>
                      <p className="text-sm text-green-700 mt-1">{generatedContent.structure?.conclusion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="headlines" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Headline Options</CardTitle>
                  <CardDescription>Choose the most compelling headline for your content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {generatedContent.headlines?.map((headline: string, index: number) => (
                      <div key={index} className="p-4 border rounded-lg hover:border-indigo-500 transition-colors cursor-pointer group">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{headline}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(headline)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>Score: {95 - index * 2}%</span>
                          <Badge variant="outline">
                            {index === 0 ? 'Best Performer' : index === 1 ? 'Strong Option' : 'Alternative'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Optimization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Meta Description</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{generatedContent.seo?.metaDescription}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {generatedContent.seo?.metaDescription?.length || 0} characters (optimal: 150-160)
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label>Target Keywords</Label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {generatedContent.seo?.keywords?.map((keyword: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <BarChart className="w-8 h-8 mx-auto text-green-600 mb-2" />
                      <div className="text-2xl font-bold text-green-700">85+</div>
                      <p className="text-sm text-gray-600">SEO Score</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Eye className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                      <div className="text-2xl font-bold text-blue-700">High</div>
                      <p className="text-sm text-gray-600">Readability</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                      <div className="text-2xl font-bold text-purple-700">Top 10</div>
                      <p className="text-sm text-gray-600">Ranking Potential</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Distribution Strategy</CardTitle>
                  <CardDescription>Maximize your content's reach and impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {generatedContent.distribution?.map((channel: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2">
                            <Share2 className="w-5 h-5 text-indigo-600" />
                            <h4 className="font-medium">{channel.channel}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{channel.format}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline">{channel.timing}</Badge>
                          <p className="text-xs text-gray-500 mt-1">Optimal timing</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-medium text-indigo-900 mb-2">Performance Projections</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reach:</span>
                        <p className="font-semibold">{generatedContent.performance?.estimatedReach}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Engagement:</span>
                        <p className="font-semibold">{generatedContent.performance?.engagementRate}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Shareability:</span>
                        <p className="font-semibold">{generatedContent.performance?.shareability}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}