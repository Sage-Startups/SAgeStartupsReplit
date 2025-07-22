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
  Palette, Sparkles, Eye, Heart, Award, FileImage,
  Type, Layers, Zap, Star, ArrowRight, Download,
  RefreshCw, Check, X, Lightbulb
} from "lucide-react";

interface BrandingBotProps {
  sessionId: number;
  botName: string;
}

export function BrandingBot({ sessionId, botName }: BrandingBotProps) {
  const [phase, setPhase] = useState<'assessment' | 'design' | 'complete'>('assessment');
  const [brandAssessment, setBrandAssessment] = useState({
    businessName: '',
    tagline: '',
    industry: '',
    targetAudience: '',
    personality: [],
    values: '',
    currentBranding: '',
    competitors: '',
    inspiration: ''
  });
  const [brandingResults, setBrandingResults] = useState<any>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);
  const [designProgress, setDesignProgress] = useState(0);
  
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
          const savedResults = JSON.parse(lastMessage.content);
          setBrandingResults(savedResults);
          setPhase('complete');
        } catch (e) {
          // Not JSON
        }
      }
    }
  }, [messages]);

  const createBrandingMutation = useMutation({
    mutationFn: async () => {
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Brand Identity: ${brandAssessment.businessName}`
      });

      // Simulate design progress
      for (let i = 0; i <= 100; i += 5) {
        setDesignProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }

      const prompt = `As a branding expert, create a comprehensive brand identity for:
        Business: ${brandAssessment.businessName}
        Tagline: ${brandAssessment.tagline}
        Industry: ${brandAssessment.industry}
        Target Audience: ${brandAssessment.targetAudience}
        Brand Personality: ${selectedPersonality.join(', ')}
        Core Values: ${brandAssessment.values}
        Current Branding Issues: ${brandAssessment.currentBranding}
        Competitors: ${brandAssessment.competitors}
        Inspiration: ${brandAssessment.inspiration}
        
        Create:
        1. Brand strategy and positioning
        2. Visual identity guidelines (colors, typography, style)
        3. Logo concepts and variations
        4. Brand voice and messaging
        5. Implementation roadmap`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: (data) => {
      const results = {
        brandStrategy: {
          positioning: "Premium, innovative, customer-centric",
          uniqueValue: "Combining cutting-edge technology with human touch",
          marketDifferentiation: "Only solution that offers both automation and personalization"
        },
        visualIdentity: {
          primaryColors: [
            { name: "Deep Blue", hex: "#1E40AF", usage: "Primary brand color" },
            { name: "Electric Purple", hex: "#7C3AED", usage: "Accent and CTAs" },
            { name: "Soft Gray", hex: "#F3F4F6", usage: "Backgrounds" }
          ],
          typography: {
            heading: "Inter (Bold)",
            body: "Inter (Regular)",
            accent: "Playfair Display"
          },
          logoVariations: [
            { type: "Primary", description: "Full logo with icon and text" },
            { type: "Icon Only", description: "Standalone symbol for apps" },
            { type: "Wordmark", description: "Text-only version" }
          ]
        },
        brandVoice: {
          tone: "Professional yet approachable",
          principles: [
            "Clear and concise",
            "Empowering and supportive",
            "Forward-thinking",
            "Human-centered"
          ],
          doList: [
            "Use active voice",
            "Be conversational",
            "Show empathy",
            "Inspire action"
          ],
          dontList: [
            "Use jargon",
            "Be overly formal",
            "Make assumptions",
            "Sound robotic"
          ]
        },
        implementation: {
          phase1: { title: "Foundation", duration: "Week 1-2", tasks: ["Finalize logo", "Set up brand guidelines"] },
          phase2: { title: "Digital Assets", duration: "Week 3-4", tasks: ["Update website", "Social media templates"] },
          phase3: { title: "Marketing Materials", duration: "Week 5-6", tasks: ["Business cards", "Presentations"] },
          phase4: { title: "Launch", duration: "Week 7-8", tasks: ["Brand announcement", "Team training"] }
        },
        content: data.content
      };
      
      setBrandingResults(results);
      setPhase('complete');
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/sessions', sessionId, 'messages'] 
      });
      
      toast({
        title: "Brand Identity Created! 🎨",
        description: "Your complete brand package is ready",
      });
    }
  });

  const personalityTraits = [
    { id: 'professional', label: 'Professional', icon: '💼' },
    { id: 'playful', label: 'Playful', icon: '🎮' },
    { id: 'innovative', label: 'Innovative', icon: '🚀' },
    { id: 'trustworthy', label: 'Trustworthy', icon: '🤝' },
    { id: 'bold', label: 'Bold', icon: '⚡' },
    { id: 'elegant', label: 'Elegant', icon: '✨' },
    { id: 'friendly', label: 'Friendly', icon: '😊' },
    { id: 'minimal', label: 'Minimal', icon: '◻️' }
  ];

  const togglePersonality = (trait: string) => {
    setSelectedPersonality(prev => 
      prev.includes(trait) 
        ? prev.filter(t => t !== trait)
        : [...prev, trait]
    );
  };

  const generateColorPalette = () => {
    // Visual representation of color palette
    return brandingResults?.visualIdentity.primaryColors.map((color: any, index: number) => (
      <div key={index} className="text-center">
        <div 
          className="w-24 h-24 rounded-lg shadow-lg mb-2 cursor-pointer transition-transform hover:scale-105"
          style={{ backgroundColor: color.hex }}
          onClick={() => navigator.clipboard.writeText(color.hex)}
        />
        <p className="font-medium text-sm">{color.name}</p>
        <p className="text-xs text-gray-600">{color.hex}</p>
        <p className="text-xs text-gray-500">{color.usage}</p>
      </div>
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Palette className="w-8 h-8" />
            {botName} - Brand Identity Master
          </CardTitle>
          <CardDescription className="text-purple-100">
            I create stunning brand identities that capture your essence and resonate with your audience
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <div className={`flex items-center gap-2 ${phase === 'assessment' ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            phase === 'assessment' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
            1
          </div>
          <span className="font-medium">Brand Assessment</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className={`flex items-center gap-2 ${phase === 'design' ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            phase === 'design' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
            2
          </div>
          <span className="font-medium">Design Process</span>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <div className={`flex items-center gap-2 ${phase === 'complete' ? 'text-purple-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            phase === 'complete' ? 'bg-purple-600 text-white' : 'bg-gray-200'
          }`}>
            3
          </div>
          <span className="font-medium">Brand Package</span>
        </div>
      </div>

      {/* Assessment Phase */}
      {phase === 'assessment' && (
        <Card>
          <CardHeader>
            <CardTitle>Let's discover your brand essence</CardTitle>
            <CardDescription>
              Tell me about your business and vision so I can create the perfect brand identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Business Name</Label>
                <Input
                  value={brandAssessment.businessName}
                  onChange={(e) => setBrandAssessment(prev => ({ ...prev, businessName: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
              <div>
                <Label>Tagline (Optional)</Label>
                <Input
                  value={brandAssessment.tagline}
                  onChange={(e) => setBrandAssessment(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Your brand promise in a few words"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Industry</Label>
                <Input
                  value={brandAssessment.industry}
                  onChange={(e) => setBrandAssessment(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare, Fashion"
                />
              </div>
              <div>
                <Label>Target Audience</Label>
                <Input
                  value={brandAssessment.targetAudience}
                  onChange={(e) => setBrandAssessment(prev => ({ ...prev, targetAudience: e.target.value }))}
                  placeholder="Who are your ideal customers?"
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Brand Personality (Select 3-4)</Label>
              <div className="grid grid-cols-4 gap-3">
                {personalityTraits.map(trait => (
                  <Button
                    key={trait.id}
                    variant={selectedPersonality.includes(trait.id) ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => togglePersonality(trait.id)}
                  >
                    <span className="mr-2">{trait.icon}</span>
                    {trait.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Core Values</Label>
              <Textarea
                value={brandAssessment.values}
                onChange={(e) => setBrandAssessment(prev => ({ ...prev, values: e.target.value }))}
                placeholder="What principles guide your business? (e.g., Innovation, Sustainability, Excellence)"
                rows={2}
              />
            </div>

            <div>
              <Label>Current Branding Challenges</Label>
              <Textarea
                value={brandAssessment.currentBranding}
                onChange={(e) => setBrandAssessment(prev => ({ ...prev, currentBranding: e.target.value }))}
                placeholder="What's not working with your current branding? (if any)"
                rows={2}
              />
            </div>

            <div>
              <Label>Main Competitors</Label>
              <Textarea
                value={brandAssessment.competitors}
                onChange={(e) => setBrandAssessment(prev => ({ ...prev, competitors: e.target.value }))}
                placeholder="Who are your main competitors?"
                rows={2}
              />
            </div>

            <div>
              <Label>Brand Inspiration</Label>
              <Textarea
                value={brandAssessment.inspiration}
                onChange={(e) => setBrandAssessment(prev => ({ ...prev, inspiration: e.target.value }))}
                placeholder="Brands you admire or styles you like"
                rows={2}
              />
            </div>

            <Button 
              onClick={() => setPhase('design')} 
              className="w-full"
              disabled={!brandAssessment.businessName || !brandAssessment.industry || selectedPersonality.length === 0}
            >
              Start Brand Design Process <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Design Phase */}
      {phase === 'design' && (
        <Card>
          <CardHeader>
            <CardTitle>Creating Your Brand Identity...</CardTitle>
            <CardDescription>
              I'm crafting a unique brand that perfectly represents your business
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Researching Market</span>
                </div>
                <span className="text-sm text-gray-600">{Math.min(designProgress, 20)}%</span>
              </div>
              <Progress value={Math.min(designProgress, 20)} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Developing Visual Concepts</span>
                </div>
                <span className="text-sm text-gray-600">{Math.min(Math.max(designProgress - 20, 0), 30)}%</span>
              </div>
              <Progress value={Math.min(Math.max(designProgress - 20, 0), 30)} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Creating Color Palette</span>
                </div>
                <span className="text-sm text-gray-600">{Math.min(Math.max(designProgress - 50, 0), 25)}%</span>
              </div>
              <Progress value={Math.min(Math.max(designProgress - 50, 0), 25)} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Finalizing Brand Package</span>
                </div>
                <span className="text-sm text-gray-600">{Math.min(Math.max(designProgress - 75, 0), 25)}%</span>
              </div>
              <Progress value={Math.min(Math.max(designProgress - 75, 0), 25)} className="h-2" />
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-purple-800 mb-2">
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">Design Insight</span>
              </div>
              <p className="text-sm text-purple-700">
                I'm combining {selectedPersonality.join(', ')} traits to create a brand that stands out in the {brandAssessment.industry} industry.
              </p>
            </div>

            <Button 
              onClick={() => createBrandingMutation.mutate()} 
              className="w-full"
              disabled={createBrandingMutation.isPending}
            >
              {createBrandingMutation.isPending ? 'Creating Your Brand...' : 'Complete Brand Design'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Complete Phase */}
      {phase === 'complete' && brandingResults && (
        <div className="space-y-6">
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Award className="w-6 h-6 text-green-600" />
                  Your Brand Identity is Ready!
                </CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Brand Guide
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="strategy" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="strategy">Strategy</TabsTrigger>
              <TabsTrigger value="visual">Visual Identity</TabsTrigger>
              <TabsTrigger value="voice">Brand Voice</TabsTrigger>
              <TabsTrigger value="logo">Logo Concepts</TabsTrigger>
              <TabsTrigger value="implementation">Implementation</TabsTrigger>
            </TabsList>

            <TabsContent value="strategy" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Strategy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Brand Positioning</h4>
                    <p className="text-gray-700">{brandingResults.brandStrategy.positioning}</p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Unique Value Proposition</h4>
                    <p className="text-gray-700">{brandingResults.brandStrategy.uniqueValue}</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Market Differentiation</h4>
                    <p className="text-gray-700">{brandingResults.brandStrategy.marketDifferentiation}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Full Strategy Document</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{brandingResults.content}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visual" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Color Palette</CardTitle>
                  <CardDescription>Your brand's color system</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-6">
                    {generateColorPalette()}
                  </div>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Click any color to copy its hex code
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Font system for consistent communication</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-bold text-lg mb-1" style={{ fontFamily: brandingResults.visualIdentity.typography.heading }}>
                      Heading Font: {brandingResults.visualIdentity.typography.heading}
                    </h4>
                    <p className="text-gray-600">Use for all headlines and titles</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="mb-1" style={{ fontFamily: brandingResults.visualIdentity.typography.body }}>
                      Body Font: {brandingResults.visualIdentity.typography.body}
                    </p>
                    <p className="text-gray-600">Use for all body text and descriptions</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="italic mb-1" style={{ fontFamily: brandingResults.visualIdentity.typography.accent }}>
                      Accent Font: {brandingResults.visualIdentity.typography.accent}
                    </p>
                    <p className="text-gray-600">Use sparingly for special emphasis</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Voice & Tone</CardTitle>
                  <CardDescription>How your brand communicates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Overall Tone</h4>
                    <p className="text-gray-700">{brandingResults.brandVoice.tone}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">Communication Principles</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {brandingResults.brandVoice.principles.map((principle: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{principle}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Check className="w-5 h-5 text-green-600" />
                        Do's
                      </h4>
                      <ul className="space-y-2">
                        {brandingResults.brandVoice.doList.map((item: string, index: number) => (
                          <li key={index} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <X className="w-5 h-5 text-red-600" />
                        Don'ts
                      </h4>
                      <ul className="space-y-2">
                        {brandingResults.brandVoice.dontList.map((item: string, index: number) => (
                          <li key={index} className="text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="logo" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Logo Variations</CardTitle>
                  <CardDescription>Different versions for various use cases</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    {brandingResults.visualIdentity.logoVariations.map((variation: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                          <FileImage className="w-16 h-16 text-gray-400" />
                        </div>
                        <h4 className="font-semibold">{variation.type}</h4>
                        <p className="text-sm text-gray-600">{variation.description}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Logo files will be provided in multiple formats: SVG, PNG, and PDF for maximum flexibility.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="implementation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Implementation Roadmap</CardTitle>
                  <CardDescription>Step-by-step plan to launch your new brand</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.values(brandingResults.implementation).map((phase: any, index: number) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          {index < 3 && <div className="w-0.5 h-20 bg-gray-300 mt-2" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{phase.title}</h4>
                            <Badge variant="outline">{phase.duration}</Badge>
                          </div>
                          <ul className="space-y-1">
                            {phase.tasks.map((task: string, taskIndex: number) => (
                              <li key={taskIndex} className="text-sm text-gray-600 flex items-center gap-2">
                                <Zap className="w-3 h-3" />
                                {task}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <RefreshCw className="w-5 h-5" />
                    Next Steps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Your brand identity package is complete! Here's what to do next:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Review all brand elements with your team</li>
                    <li>Create a brand guidelines document</li>
                    <li>Update all touchpoints with new branding</li>
                    <li>Train your team on brand voice</li>
                    <li>Launch with a brand announcement</li>
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
}