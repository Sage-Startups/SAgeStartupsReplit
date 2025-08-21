import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Layout, Target, TrendingUp, Zap } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  primaryGoal: z.string().min(1, "Primary goal is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  valueProposition: z.string().min(1, "Value proposition is required"),
  designStyle: z.string().min(1, "Design style is required"),
});

type FormData = z.infer<typeof formSchema>;

const goalOptions = [
  "Generate leads", "Increase sales", "Build email list", "Promote product launch", "Drive app downloads", "Register users"
];

const designStyleOptions = [
  "Minimal", "Modern", "Professional", "Creative", "Tech/SaaS", "E-commerce"
];

interface LandingPageBuilderProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function LandingPageBuilder({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: LandingPageBuilderProps = {}) {
  const [sessionId, setSessionId] = useState<number | null>(propSessionId || null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      primaryGoal: "",
      targetAudience: "",
      valueProposition: "",
      designStyle: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a high-converting landing page strategy for ${data.businessName}.

**Project Brief:**
- Primary Goal: ${data.primaryGoal}
- Target Audience: ${data.targetAudience}
- Value Proposition: ${data.valueProposition}
- Design Style: ${data.designStyle}

Please provide a comprehensive, actionable landing page strategy with:

## 📝 **Page Structure & Copy**
- Hero section with compelling headline and subheadline
- Value proposition statement
- Key benefits (3-5 bullet points)
- Call-to-action buttons and placement
- Social proof section
- FAQ or objection handling

## 🎨 **Visual Design & Layout**
- Page layout wireframe description
- Color scheme recommendations
- Typography hierarchy
- Visual elements and imagery suggestions
- Mobile-responsive considerations

## 🚀 **Conversion Optimization**
- CTA optimization strategies
- Trust signals and credibility boosters
- Urgency and scarcity tactics
- Form design best practices
- A/B testing recommendations

## 📊 **Performance & Analytics**
- Key metrics to track
- Conversion tracking setup
- Analytics implementation
- Success benchmarks

## 💡 **Implementation Tips**
- Technical requirements
- Timeline suggestions
- Common pitfalls to avoid
- Optimization opportunities

Format each section with specific, actionable recommendations and include actual copy examples where possible.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Landing Page Strategy Started",
          description: "Creating conversion-focused design and UX optimization...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Landing page builder error:", error);
      toast({
        title: "Error",
        description: `Failed to start landing page design: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <Layout className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page Builder</h1>
            <p className="text-gray-600">Conversion-focused pages, UX design, and performance optimization</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Layout className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm">Page Structure</p>
                  <p className="text-xs text-gray-600">Optimal layout</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-emerald-600" />
                <div>
                  <p className="font-semibold text-sm">Conversion Optimization</p>
                  <p className="text-xs text-gray-600">CRO best practices</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-teal-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-teal-600" />
                <div>
                  <p className="font-semibold text-sm">UX Design</p>
                  <p className="text-xs text-gray-600">User experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-cyan-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <div>
                  <p className="font-semibold text-sm">Performance Tracking</p>
                  <p className="text-xs text-gray-600">Analytics & metrics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {propSessionId ? (
        <BotChatInterface sessionId={propSessionId} botType="landing-pages" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Landing Page Configuration
            </CardTitle>
            <CardDescription>
              Tell us about your business and goals to create the perfect landing page strategy
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your business name" 
                            {...field} 
                            data-testid="input-business-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Goal *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-primary-goal">
                              <SelectValue placeholder="What's your main objective?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {goalOptions.map((goal) => (
                              <SelectItem key={goal} value={goal}>
                                {goal}
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
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your ideal customers (e.g., small business owners, tech professionals, young parents...)"
                          {...field} 
                          data-testid="textarea-target-audience"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="valueProposition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Value Proposition *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What unique value do you offer? What problem do you solve?"
                          {...field} 
                          data-testid="textarea-value-proposition"
                          rows={3}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Design Style *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-design-style">
                            <SelectValue placeholder="Choose your preferred style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {designStyleOptions.map((style) => (
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

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full"
                  disabled={isLoading || propIsLoading}
                  data-testid="button-build-page"
                >
                  {isLoading || propIsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Building Landing Page Strategy...
                    </>
                  ) : (
                    <>
                      <Layout className="w-4 h-4 mr-2" />
                      Build Landing Page Strategy
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}