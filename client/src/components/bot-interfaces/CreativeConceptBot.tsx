import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Lightbulb, 
  Copy, 
  Download, 
  Share2, 
  Printer,
  RefreshCw,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Target,
  Palette,
  MessageSquare,
  Hash,
  Image,
  FileText,
  TrendingUp,
  Megaphone
} from 'lucide-react';

interface ConceptData {
  projectType: string;
  brandName: string;
  industry: string;
  targetAudience: string;
  challenge: string;
  inspiration: string;
  preferences: string;
}

interface GeneratedConcepts {
  concepts: Array<{
    id: string;
    name: string;
    summary: string;
    headlines: string[];
    taglines: string[];
    visualSuggestions: string[];
    toneSuggestions: string[];
    hashtags: string[];
    coreIdeas: string[];
    implementation: string;
  }>;
}

export default function CreativeConceptBot({ sessionId, initialData }: { sessionId: number; initialData?: any }) {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [conceptData, setConceptData] = useState<ConceptData>({
    projectType: initialData?.projectType || '',
    brandName: initialData?.brandName || '',
    industry: initialData?.industry || '',
    targetAudience: initialData?.targetAudience || '',
    challenge: initialData?.challenge || '',
    inspiration: initialData?.inspiration || '',
    preferences: initialData?.preferences || ''
  });
  const [generatedConcepts, setGeneratedConcepts] = useState<GeneratedConcepts | null>(initialData?.generatedConcepts || null);
  const [selectedConcept, setSelectedConcept] = useState(0);

  const projectTypes = [
    'Marketing Campaign',
    'Brand Name',
    'Product Launch',
    'Social Media Campaign',
    'Ad Campaign',
    'Rebranding',
    'Event Campaign',
    'Content Series',
    'Seasonal Campaign',
    'Awareness Campaign'
  ];

  // Save session data
  const saveSessionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PUT', `/api/sessions/${sessionId}`, {
        data: {
          conceptData,
          generatedConcepts,
          currentStep: step
        }
      });
    }
  });

  // Generate concepts using AI
  const generateConceptsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: `Generate creative concepts for the following project:

Project Type: ${conceptData.projectType}
Brand/Company: ${conceptData.brandName}
Industry: ${conceptData.industry}
Target Audience: ${conceptData.targetAudience}
Challenge/Goal: ${conceptData.challenge}
Inspiration/References: ${conceptData.inspiration}
Preferences/Requirements: ${conceptData.preferences}

Please provide 3 unique creative concepts, each with:
1. Concept name and brief summary
2. 3-5 headlines or main messages
3. 3-5 taglines or slogans
4. Visual direction suggestions (colors, imagery, style)
5. Tone and voice recommendations
6. 10 relevant hashtags
7. Core ideas and themes
8. Basic implementation roadmap

Make each concept distinct and creative, tailored to the ${conceptData.projectType} project type.`,
        role: 'user'
      });
    },
    onSuccess: async (response: any) => {
      const aiResponse = response.aiMessage;
      // Parse AI response to extract structured concepts
      const concepts = parseAIResponse(aiResponse.content);
      setGeneratedConcepts(concepts);
      setStep(3);
      await saveSessionMutation.mutateAsync();
      toast({
        title: "Concepts Generated",
        description: "Your creative concepts are ready!",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate concepts. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Parse AI response into structured format
  const parseAIResponse = (content: string): GeneratedConcepts => {
    // Split by concept markers
    const conceptSections = content.split(/Concept \d+:|Creative Concept \d+:/i).slice(1);
    
    const concepts = conceptSections.map((section, index) => {
      const nameMatch = section.match(/(?:Name|Title):?\s*(.+?)(?=\n|Summary|$)/i);
      const summaryMatch = section.match(/(?:Summary|Overview|Description):?\s*((?:.|\n)+?)(?=Headlines?|Main Messages|$)/i);
      const headlinesMatch = section.match(/(?:Headlines?|Main Messages?):?\s*((?:.|\n)+?)(?=Taglines?|Slogans?|$)/i);
      const taglinesMatch = section.match(/(?:Taglines?|Slogans?):?\s*((?:.|\n)+?)(?=Visual|Tone|$)/i);
      const visualMatch = section.match(/(?:Visual(?:s| Direction| Suggestions?)?):?\s*((?:.|\n)+?)(?=Tone|Voice|$)/i);
      const toneMatch = section.match(/(?:Tone(?: and Voice)?|Voice):?\s*((?:.|\n)+?)(?=Hashtags?|Core|$)/i);
      const hashtagsMatch = section.match(/(?:Hashtags?):?\s*((?:.|\n)+?)(?=Core Ideas?|Implementation|$)/i);
      const coreIdeasMatch = section.match(/(?:Core Ideas?(?: and Themes?)?|Themes?):?\s*((?:.|\n)+?)(?=Implementation|Roadmap|$)/i);
      const implementationMatch = section.match(/(?:Implementation(?: Roadmap)?|Roadmap):?\s*((?:.|\n)+?)$/i);

      const extractItems = (text: string | undefined) => {
        if (!text) return [];
        return text.split('\n')
          .filter(line => line.trim())
          .map(line => line.replace(/^[-•*\d.]\s*/, '').trim())
          .filter(item => item.length > 0);
      };

      return {
        id: `concept-${index + 1}`,
        name: nameMatch?.[1]?.trim() || `Creative Concept ${index + 1}`,
        summary: summaryMatch?.[1]?.trim() || 'Innovative concept tailored to your needs',
        headlines: extractItems(headlinesMatch?.[1]),
        taglines: extractItems(taglinesMatch?.[1]),
        visualSuggestions: extractItems(visualMatch?.[1]),
        toneSuggestions: extractItems(toneMatch?.[1]),
        hashtags: extractItems(hashtagsMatch?.[1]).map(tag => tag.startsWith('#') ? tag : `#${tag}`),
        coreIdeas: extractItems(coreIdeasMatch?.[1]),
        implementation: implementationMatch?.[1]?.trim() || 'Strategic implementation plan'
      };
    });

    return { concepts };
  };

  const handleNext = () => {
    if (step === 1) {
      if (!conceptData.projectType || !conceptData.brandName || !conceptData.industry) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!conceptData.targetAudience || !conceptData.challenge) {
        toast({
          title: "Missing Information",
          description: "Please complete all required fields",
          variant: "destructive",
        });
        return;
      }
      generateConceptsMutation.mutate();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content has been copied to clipboard",
    });
  };

  const downloadConcepts = () => {
    const content = `Creative Concepts Report
========================

Project Details:
- Type: ${conceptData.projectType}
- Brand: ${conceptData.brandName}
- Industry: ${conceptData.industry}
- Target Audience: ${conceptData.targetAudience}
- Challenge: ${conceptData.challenge}

${generatedConcepts?.concepts.map((concept, index) => `
CONCEPT ${index + 1}: ${concept.name}
================================
Summary: ${concept.summary}

Headlines:
${concept.headlines.map(h => `• ${h}`).join('\n')}

Taglines:
${concept.taglines.map(t => `• ${t}`).join('\n')}

Visual Direction:
${concept.visualSuggestions.map(v => `• ${v}`).join('\n')}

Tone & Voice:
${concept.toneSuggestions.map(t => `• ${t}`).join('\n')}

Hashtags:
${concept.hashtags.join(' ')}

Core Ideas:
${concept.coreIdeas.map(i => `• ${i}`).join('\n')}

Implementation:
${concept.implementation}
`).join('\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creative-concepts-${conceptData.brandName.toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Lightbulb className="w-6 h-6 text-yellow-600" />
            <CardTitle>Creative Concept Generator</CardTitle>
          </div>
          <CardDescription>
            Generate innovative ideas for marketing campaigns, brand names, and creative projects
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step >= s ? 'bg-yellow-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > s ? <CheckCircle className="w-6 h-6" /> : s}
            </div>
            {s < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                step > s ? 'bg-yellow-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Project Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
            <CardDescription>Tell us about your creative project</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="projectType">Project Type *</Label>
              <Select value={conceptData.projectType} onValueChange={(value) => setConceptData({ ...conceptData, projectType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  {projectTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="brandName">Brand/Company Name *</Label>
              <Input
                id="brandName"
                value={conceptData.brandName}
                onChange={(e) => setConceptData({ ...conceptData, brandName: e.target.value })}
                placeholder="e.g., TechStart, Green Living Co."
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry/Sector *</Label>
              <Input
                id="industry"
                value={conceptData.industry}
                onChange={(e) => setConceptData({ ...conceptData, industry: e.target.value })}
                placeholder="e.g., Technology, Healthcare, Sustainable Fashion"
              />
            </div>

            <Button onClick={handleNext} className="w-full">
              Next <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Creative Brief */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Creative Brief</CardTitle>
            <CardDescription>Help us understand your vision and goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Textarea
                id="targetAudience"
                value={conceptData.targetAudience}
                onChange={(e) => setConceptData({ ...conceptData, targetAudience: e.target.value })}
                placeholder="Describe your ideal audience. Demographics, interests, behaviors..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="challenge">Challenge/Goal *</Label>
              <Textarea
                id="challenge"
                value={conceptData.challenge}
                onChange={(e) => setConceptData({ ...conceptData, challenge: e.target.value })}
                placeholder="What problem are you solving? What do you want to achieve?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="inspiration">Inspiration/References</Label>
              <Textarea
                id="inspiration"
                value={conceptData.inspiration}
                onChange={(e) => setConceptData({ ...conceptData, inspiration: e.target.value })}
                placeholder="Any campaigns, brands, or ideas that inspire you? (Optional)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="preferences">Preferences/Requirements</Label>
              <Textarea
                id="preferences"
                value={conceptData.preferences}
                onChange={(e) => setConceptData({ ...conceptData, preferences: e.target.value })}
                placeholder="Any specific requirements, themes to avoid, or must-haves? (Optional)"
                rows={2}
              />
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1"
                disabled={generateConceptsMutation.isPending}
              >
                {generateConceptsMutation.isPending ? (
                  <>
                    <RefreshCw className="mr-2 w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Generate Concepts <Sparkles className="ml-2 w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Generated Concepts */}
      {step === 3 && generatedConcepts && (
        <div className="space-y-6">
          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                <Button onClick={downloadConcepts} variant="outline">
                  <Download className="mr-2 w-4 h-4" />
                  Download All
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  <Printer className="mr-2 w-4 h-4" />
                  Print
                </Button>
                <Button onClick={() => {
                  setStep(1);
                  setGeneratedConcepts(null);
                }} variant="outline">
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Concepts Tabs */}
          <Card>
            <CardHeader>
              <CardTitle>Creative Concepts</CardTitle>
              <CardDescription>
                {generatedConcepts.concepts.length} unique concepts for your {conceptData.projectType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedConcept.toString()} onValueChange={(v) => setSelectedConcept(parseInt(v))}>
                <TabsList className="grid w-full grid-cols-3">
                  {generatedConcepts.concepts.map((concept, index) => (
                    <TabsTrigger key={concept.id} value={index.toString()}>
                      Concept {index + 1}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {generatedConcepts.concepts.map((concept, index) => (
                  <TabsContent key={concept.id} value={index.toString()} className="space-y-4">
                    <ConceptDisplay concept={concept} onCopy={copyToClipboard} />
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Component to display a single concept
function ConceptDisplay({ 
  concept, 
  onCopy 
}: { 
  concept: GeneratedConcepts['concepts'][0],
  onCopy: (text: string) => void 
}) {
  return (
    <div className="space-y-4">
      {/* Concept Name & Summary */}
      <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
        <h3 className="text-xl font-bold mb-2">{concept.name}</h3>
        <p className="text-gray-700">{concept.summary}</p>
      </div>

      <Accordion type="multiple" className="w-full" defaultValue={['headlines', 'taglines']}>
        {/* Headlines */}
        <AccordionItem value="headlines">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Megaphone className="w-4 h-4" />
              <span>Headlines & Messages</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4">
              {concept.headlines.map((headline, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1">{headline}</span>
                  <Button size="sm" variant="ghost" onClick={() => onCopy(headline)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Taglines */}
        <AccordionItem value="taglines">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Taglines & Slogans</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4">
              {concept.taglines.map((tagline, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="flex-1 italic">"{tagline}"</span>
                  <Button size="sm" variant="ghost" onClick={() => onCopy(tagline)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Visual Direction */}
        <AccordionItem value="visual">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4" />
              <span>Visual Direction</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4">
              {concept.visualSuggestions.map((visual, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Image className="w-4 h-4 text-purple-600 mt-0.5" />
                  <span className="flex-1">{visual}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Tone & Voice */}
        <AccordionItem value="tone">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Tone & Voice</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4">
              {concept.toneSuggestions.map((tone, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <Target className="w-4 h-4 text-blue-600 mt-0.5" />
                  <span className="flex-1">{tone}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Hashtags */}
        <AccordionItem value="hashtags">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Hash className="w-4 h-4" />
              <span>Hashtags</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4">
              <div className="flex flex-wrap gap-2">
                {concept.hashtags.map((tag, idx) => (
                  <Badge 
                    key={idx} 
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => onCopy(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Core Ideas */}
        <AccordionItem value="ideas">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Core Ideas & Themes</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4">
              {concept.coreIdeas.map((idea, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-600 mt-0.5" />
                  <span className="flex-1">{idea}</span>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Implementation */}
        <AccordionItem value="implementation">
          <AccordionTrigger>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Implementation Roadmap</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-wrap">{concept.implementation}</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}