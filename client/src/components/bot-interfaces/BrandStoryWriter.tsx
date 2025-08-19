import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, Heart, Users, TrendingUp, ArrowRight, Feather } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  brandName: z.string().min(1, "Brand name is required"),
  industry: z.string().min(1, "Industry is required"),
  foundingStory: z.string().min(1, "Tell us how your brand started"),
  brandMission: z.string().min(1, "What's your brand's mission?"),
  targetAudience: z.string().min(1, "Who is your target audience?"),
  storyTone: z.string().min(1, "Story tone is required"),
  founderBackground: z.string().optional(),
  coreValues: z.string().optional(),
  uniqueValue: z.string().optional(),
  keyMilestones: z.string().optional(),
  challenges: z.string().optional(),
  emotionalConnection: z.string().optional(),
  brandPersonality: z.string().optional(),
  futureVision: z.string().optional(),
  customerImpact: z.string().optional(),
  narrativeStyle: z.string().optional(),
  keyThemes: z.string().optional(),
  competitorStories: z.string().optional(),
  additionalContext: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const storyToneOptions = [
  "Inspirational & Uplifting",
  "Professional & Authoritative",
  "Personal & Intimate",
  "Bold & Confident",
  "Humble & Authentic",
  "Innovative & Forward-thinking",
  "Caring & Empathetic",
  "Energetic & Dynamic",
  "Sophisticated & Elegant",
  "Warm & Approachable"
];

const narrativeStyleOptions = [
  "Hero's Journey",
  "Origin Story",
  "Problem-Solution Narrative",
  "David vs. Goliath",
  "Transformation Story",
  "Mission-Driven Story",
  "Innovation Story",
  "Community Impact Story",
  "Personal Journey",
  "Legacy Building"
];

export function BrandStoryWriter() {
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandName: "",
      industry: "",
      foundingStory: "",
      founderBackground: "",
      brandMission: "",
      coreValues: "",
      targetAudience: "",
      uniqueValue: "",
      keyMilestones: "",
      challenges: "",
      emotionalConnection: "",
      brandPersonality: "",
      futureVision: "",
      customerImpact: "",
      storyTone: "",
      narrativeStyle: "",
      keyThemes: "",
      competitorStories: "",
      additionalContext: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a compelling brand story for ${data.brandName} in the ${data.industry} industry.

**Core Information:**
- Founding Story: ${data.foundingStory}
- Brand Mission: ${data.brandMission}
- Target Audience: ${data.targetAudience}
- Story Tone: ${data.storyTone}
${data.founderBackground ? `- Founder Background: ${data.founderBackground}` : ""}
${data.coreValues ? `- Core Values: ${data.coreValues}` : ""}
${data.uniqueValue ? `- Unique Value: ${data.uniqueValue}` : ""}
${data.keyMilestones ? `- Key Milestones: ${data.keyMilestones}` : ""}
${data.challenges ? `- Challenges Overcome: ${data.challenges}` : ""}
${data.brandPersonality ? `- Brand Personality: ${data.brandPersonality}` : ""}
${data.futureVision ? `- Future Vision: ${data.futureVision}` : ""}
${data.customerImpact ? `- Customer Impact: ${data.customerImpact}` : ""}
${data.emotionalConnection ? `- Emotional Connection: ${data.emotionalConnection}` : ""}
${data.narrativeStyle ? `- Narrative Style: ${data.narrativeStyle}` : ""}
${data.additionalContext ? `- Additional Context: ${data.additionalContext}` : ""}

Please provide a comprehensive brand story that includes:

1. **Core Brand Story (Multiple Versions):**
   - Executive summary version (2-3 sentences)
   - Elevator pitch version (30-60 seconds)
   - Website "About Us" version (2-3 paragraphs)
   - Extended narrative version (500-800 words)
   - Social media snippet version (1-2 sentences)

2. **Narrative Structure Analysis:**
   - Story arc breakdown with key plot points
   - Character development (brand as protagonist)
   - Conflict and resolution elements
   - Climax and transformation moments
   - Call to action integration

3. **Emotional Connection Framework:**
   - Primary emotional drivers identified
   - Audience emotional journey mapping
   - Empathy touchpoints throughout the story
   - Emotional resonance strategies
   - Trust-building narrative elements

4. **Story Development Components:**
   - Origin story with compelling hook
   - Founder's journey and motivation
   - Mission-driven narrative threads
   - Values demonstration through actions
   - Vision for future impact

5. **Compelling Narrative Elements:**
   - Memorable opening hooks (5+ options)
   - Powerful closing statements (5+ options)
   - Key story beats and transitions
   - Dialogue and voice integration
   - Sensory details and vivid imagery

6. **Multi-Channel Story Adaptation:**
   - Website storytelling strategy
   - Social media story series
   - Video script narratives
   - Presentation story flow
   - Marketing campaign narratives

7. **Emotional Engagement Strategies:**
   - Vulnerability and authenticity moments
   - Triumph and achievement highlights
   - Relatable challenge descriptions
   - Inspiring vision statements
   - Community and impact stories

8. **Narrative Consistency Guidelines:**
   - Core story elements to maintain
   - Tone and voice consistency rules
   - Key messages to reinforce
   - Story variation guidelines
   - Brand story evolution framework

9. **Implementation Roadmap:**
   - Story rollout timeline and phases
   - Team training and alignment
   - Content creation priorities
   - Stakeholder communication plan
   - Performance measurement metrics

10. **Story Testing & Optimization:**
    - Audience feedback collection methods
    - Story effectiveness metrics
    - A/B testing recommendations
    - Iteration and refinement process
    - Long-term story evolution strategy

Format the response with clear sections, compelling narrative examples, and actionable implementation guidance. Include specific story snippets, emotional triggers, and practical application scenarios.`;

      const response = await apiRequest("POST", "/api/sessions", {
        botType: "brand-story",
        initialMessage: prompt,
      });

      const session = await response.json();
      setSessionId(session.id);

      toast({
        title: "Brand Story Development Started",
        description: "Creating compelling narratives and story structure...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start brand story development. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Feather className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brand Story Writer</h1>
            <p className="text-gray-600">Compelling narratives with emotional connection and story development</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-pink-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-pink-600" />
                <div>
                  <p className="font-semibold text-sm">Story Development</p>
                  <p className="text-xs text-gray-600">Compelling narratives</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-semibold text-sm">Emotional Connection</p>
                  <p className="text-xs text-gray-600">Audience engagement</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-rose-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="font-semibold text-sm">Narrative Structure</p>
                  <p className="text-xs text-gray-600">Story architecture</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-fuchsia-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-fuchsia-600" />
                <div>
                  <p className="font-semibold text-sm">Multi-Channel</p>
                  <p className="text-xs text-gray-600">Story adaptation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Brand Story Foundation
          </CardTitle>
          <CardDescription>
            Share your brand's journey and details to create compelling narratives that resonate with your audience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Brand Information */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Brand Basics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brandName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your brand name" 
                            {...field} 
                            data-testid="input-brand-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Technology, Healthcare, Fashion" 
                            {...field} 
                            data-testid="input-industry"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="brandMission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Mission</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What is your brand's core mission and purpose?"
                            {...field} 
                            data-testid="textarea-brand-mission"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coreValues"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Core Values</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List your brand's fundamental values and beliefs"
                            {...field} 
                            data-testid="textarea-core-values"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your ideal customers and their characteristics"
                            {...field} 
                            data-testid="textarea-target-audience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brandPersonality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Personality</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How would you describe your brand's personality and character?"
                            {...field} 
                            data-testid="textarea-brand-personality"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Origin & Journey */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Origin & Journey</h3>
                
                <FormField
                  control={form.control}
                  name="foundingStory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founding Story</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell the story of how your brand was founded - the moment, inspiration, or catalyst"
                          {...field} 
                          data-testid="textarea-founding-story"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="founderBackground"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Founder Background</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Share the founder's background, expertise, and what led them to create this brand"
                          {...field} 
                          data-testid="textarea-founder-background"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyMilestones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Milestones</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List significant achievements, moments, or milestones in your brand's journey"
                          {...field} 
                          data-testid="textarea-key-milestones"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenges Overcome</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe major challenges, obstacles, or setbacks your brand has overcome"
                          {...field} 
                          data-testid="textarea-challenges"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Impact & Value */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Impact & Value</h3>
                
                <FormField
                  control={form.control}
                  name="uniqueValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unique Value Proposition</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What makes your brand unique? What value do you provide that others don't?"
                          {...field} 
                          data-testid="textarea-unique-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="customerImpact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Impact</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How has your brand positively impacted customers' lives? Include specific examples or stories"
                          {...field} 
                          data-testid="textarea-customer-impact"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="futureVision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Future Vision</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Where is your brand heading? What's your vision for the future?"
                          {...field} 
                          data-testid="textarea-future-vision"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emotionalConnection"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Emotional Connection</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do you want people to feel when they hear your brand story? What emotions should it evoke?"
                          {...field} 
                          data-testid="textarea-emotional-connection"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Narrative Direction */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Narrative Direction</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="storyTone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Story Tone</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-story-tone">
                              <SelectValue placeholder="Choose your story tone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {storyToneOptions.map((tone) => (
                              <SelectItem key={tone} value={tone}>
                                {tone}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="narrativeStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Narrative Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-narrative-style">
                              <SelectValue placeholder="Choose narrative approach" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {narrativeStyleOptions.map((style) => (
                              <SelectItem key={style} value={style}>
                                {style}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="keyThemes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Key Themes (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Innovation, Community, Sustainability, Growth"
                          {...field} 
                          data-testid="input-key-themes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="competitorStories"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Competitor Story Analysis (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How do competitors tell their stories? What gaps or opportunities do you see?"
                          {...field} 
                          data-testid="textarea-competitor-stories"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalContext"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Context (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any other important context, specific requirements, or elements you want included in your brand story"
                          {...field} 
                          data-testid="textarea-additional-context"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-generate-story"
              >
                {isLoading ? "Creating Brand Story..." : "Generate Compelling Brand Narrative"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Your Brand Story & Narrative Development</h3>
          <BotChatInterface sessionId={sessionId} botType="brand-story" />
        </div>
      )}
    </div>
  );
}