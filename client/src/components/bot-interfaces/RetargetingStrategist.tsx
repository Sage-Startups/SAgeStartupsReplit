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
import { RefreshCw, Users, MessageSquare, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  productName: z.string().min(1, "Product name is required"),
  customerJourney: z.string().min(1, "Customer journey stage is required"),
  audienceSegment: z.string().min(1, "Audience segment is required"),
  retargetingGoal: z.string().min(1, "Retargeting goal is required"),
  timeWindow: z.string().min(1, "Time window is required"),
  platform: z.string().min(1, "Platform is required"),
});

type FormData = z.infer<typeof formSchema>;

const journeyStageOptions = [
  "Awareness (Top of Funnel)", "Consideration (Middle of Funnel)", "Decision (Bottom of Funnel)", "Post-Purchase", "Cart Abandonment"
];

const audienceSegmentOptions = [
  "Website Visitors", "Cart Abandoners", "Product Viewers", "Past Purchasers", "Email Subscribers", "App Users", "Video Viewers"
];

const retargetingGoalOptions = [
  "Complete Purchase", "Increase Brand Recall", "Drive App Downloads", "Generate Leads", "Upsell/Cross-sell", "Win Back Customers"
];

const timeWindowOptions = [
  "1-3 days", "4-7 days", "8-14 days", "15-30 days", "31-60 days", "61-90 days"
];

const platformOptions = [
  "Facebook/Instagram", "Google Ads", "LinkedIn", "Twitter", "TikTok", "YouTube", "Cross-Platform"
];

interface RetargetingStrategistProps {
  sessionId?: number | null;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export function RetargetingStrategist({ sessionId: propSessionId, onSendMessage, isLoading: propIsLoading }: RetargetingStrategistProps = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      productName: "",
      customerJourney: "",
      audienceSegment: "",
      retargetingGoal: "",
      timeWindow: "",
      platform: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const prompt = `Create a comprehensive retargeting strategy for ${data.businessName}'s ${data.productName}.

**Campaign Configuration:**
- Customer Journey Stage: ${data.customerJourney}
- Audience Segment: ${data.audienceSegment}
- Retargeting Goal: ${data.retargetingGoal}
- Time Window: ${data.timeWindow}
- Platform: ${data.platform}

Please provide a detailed retargeting strategy with:

## 👥 **Audience Segmentation**
- Detailed segment definitions
- Behavioral triggers and criteria
- Audience size estimates
- Exclusion lists and rules
- Lookalike audience opportunities

## 📨 **Message Sequencing**
- Day-by-day message progression
- Creative rotation strategy
- Personalization elements
- Dynamic content recommendations
- Cross-channel coordination

## ⏰ **Frequency Capping**
- Optimal impression frequency
- Daily/weekly/monthly caps
- Platform-specific limits
- Fatigue prevention strategies
- Timing optimization

## 🎯 **Campaign Structure**
- Funnel stage alignment
- Budget allocation by segment
- Bid strategy recommendations
- Campaign hierarchy
- Attribution model

## 💬 **Creative Strategy**
- Message variations by segment
- Visual treatment guidelines
- Copy tone adjustments
- Urgency and incentive tactics
- Social proof integration

## 📊 **Performance Tracking**
- Key metrics to monitor
- Conversion attribution
- Segment performance analysis
- A/B testing framework
- Optimization triggers

## 🔄 **Re-engagement Tactics**
- Win-back campaigns
- Loyalty program integration
- Special offers and incentives
- Content marketing support
- Email coordination

Format with specific timeframes, message examples, and implementation guidelines.`;

      if (onSendMessage) {
        onSendMessage(prompt);
        toast({
          title: "Retargeting Strategy Started",
          description: "Creating audience segmentation and message sequencing...",
        });
      } else {
        toast({
          title: "No active session",
          description: "Please start a session from the bot page to use this tool.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Retargeting strategist error:", error);
      toast({
        title: "Error",
        description: `Failed to generate retargeting strategy: ${error instanceof Error ? error.message : 'Unknown error'}`,
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
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
            <RefreshCw className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Retargeting Strategist</h1>
            <p className="text-gray-600">Audience segmentation, message sequencing, and frequency capping</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-l-4 border-l-orange-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-semibold text-sm">Audience Segmentation</p>
                  <p className="text-xs text-gray-600">Precise targeting</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-amber-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="font-semibold text-sm">Message Sequencing</p>
                  <p className="text-xs text-gray-600">Timed messaging</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-semibold text-sm">Frequency Capping</p>
                  <p className="text-xs text-gray-600">Optimal exposure</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-lime-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-lime-600" />
                <div>
                  <p className="font-semibold text-sm">Re-engagement</p>
                  <p className="text-xs text-gray-600">Win-back tactics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {false ? (
        <BotChatInterface sessionId={propSessionId} botType="retargeting" />
      ) : (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Retargeting Configuration
            </CardTitle>
            <CardDescription>
              Define your retargeting campaign parameters for optimal re-engagement
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
                    name="productName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product/Service Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What are you promoting?" 
                            {...field} 
                            data-testid="input-product-name"
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
                    name="customerJourney"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Journey Stage *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-journey">
                              <SelectValue placeholder="Select funnel stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {journeyStageOptions.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
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
                    name="audienceSegment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience Segment *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-segment">
                              <SelectValue placeholder="Who to retarget?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {audienceSegmentOptions.map((segment) => (
                              <SelectItem key={segment} value={segment}>
                                {segment}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="retargetingGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retargeting Goal *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-goal">
                              <SelectValue placeholder="What's your objective?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {retargetingGoalOptions.map((goal) => (
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

                  <FormField
                    control={form.control}
                    name="timeWindow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time Window *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-time">
                              <SelectValue placeholder="Retargeting duration" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {timeWindowOptions.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
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
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Platform *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-platform">
                            <SelectValue placeholder="Choose advertising platform" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {platformOptions.map((platform) => (
                            <SelectItem key={platform} value={platform}>
                              {platform}
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
                  data-testid="button-generate-strategy"
                >
                  {isLoading || propIsLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating Retargeting Strategy...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Generate Retargeting Strategy
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