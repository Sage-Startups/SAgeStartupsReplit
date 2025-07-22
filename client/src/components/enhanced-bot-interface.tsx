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
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, Download, Loader2, Copy, CheckCircle, Star, Target, 
  Lightbulb, Zap, FileText, TrendingUp, DollarSign, Users,
  Calendar, BarChart3, PieChart, ArrowRight, Check, X,
  Rocket, Brain, MessageSquare, ChevronRight, Share2,
  Printer, Mail, Eye, Edit, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EnhancedBotInterfaceProps {
  sessionId: number;
  botName: string;
  botId: string;
  botColor: string;
}

// Enhanced options with visual elements
const getEnhancedOptionsForBot = (botId: string) => {
  if (botId.includes('campaign') || botId.includes('marketing')) {
    return [
      { 
        label: 'New Product Launch', 
        value: 'product-launch', 
        description: 'Create a comprehensive launch strategy',
        icon: <Rocket className="w-5 h-5" />,
        color: 'bg-purple-100 text-purple-700'
      },
      { 
        label: 'Brand Awareness', 
        value: 'brand-awareness', 
        description: 'Build visibility and recognition',
        icon: <Eye className="w-5 h-5" />,
        color: 'bg-blue-100 text-blue-700'
      },
      { 
        label: 'Lead Generation', 
        value: 'lead-generation', 
        description: 'Generate qualified prospects',
        icon: <Users className="w-5 h-5" />,
        color: 'bg-green-100 text-green-700'
      },
      { 
        label: 'Customer Retention', 
        value: 'customer-retention', 
        description: 'Keep existing customers engaged',
        icon: <Target className="w-5 h-5" />,
        color: 'bg-orange-100 text-orange-700'
      },
      { 
        label: 'Market Expansion', 
        value: 'market-expansion', 
        description: 'Enter new markets or segments',
        icon: <TrendingUp className="w-5 h-5" />,
        color: 'bg-indigo-100 text-indigo-700'
      }
    ];
  }
  
  // Default options
  return [
    { 
      label: 'Strategy Development', 
      value: 'strategy', 
      description: 'Create a comprehensive strategy',
      icon: <Brain className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-700'
    }
  ];
};

// Component for rendering rich content sections
function RichContentSection({ title, content, icon, type = 'text' }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (type === 'list') {
    return (
      <Card className="mb-4 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {content.map((item: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    );
  }

  if (type === 'timeline') {
    return (
      <Card className="mb-4 border-l-4 border-l-purple-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopy}
              className="h-8"
            >
              {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {content.map((item: any, index: number) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  {index < content.length - 1 && <div className="w-0.5 h-16 bg-gray-300" />}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className="font-semibold text-sm">{item.phase}</h4>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {item.duration}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (type === 'metrics') {
    return (
      <Card className="mb-4 border-l-4 border-l-green-500">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.map((metric: any, index: number) => (
              <div key={index} className="text-center">
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default text type
  return (
    <Card className="mb-4 border-l-4 border-l-gray-400">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-8"
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">{content}</p>
      </CardContent>
    </Card>
  );
}

export function EnhancedBotInterface({ sessionId, botName, botId, botColor }: EnhancedBotInterfaceProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [result, setResult] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [completionProgress, setCompletionProgress] = useState(0);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const options = getEnhancedOptionsForBot(botId);

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
        const structuredResult = parseAIResponse(lastAssistantMessage.content);
        setResult(structuredResult);
        setCompletionProgress(100);
      }

      // Try to restore form data from first user message
      const firstUserMessage = messages.find((msg: any) => msg.role === 'user');
      if (firstUserMessage) {
        const content = firstUserMessage.content;
        const businessMatch = content.match(/Business:\s*(.+)/);
        const industryMatch = content.match(/Industry:\s*(.+)/);
        const targetMatch = content.match(/Target Audience:\s*(.+)/);
        const goalMatch = content.match(/Goal:\s*(.+)/);
        const infoMatch = content.match(/Additional Info:\s*(.+)/);
        
        if (businessMatch) setBusinessName(businessMatch[1].trim());
        if (industryMatch) setIndustry(industryMatch[1].trim());
        if (targetMatch) setTargetAudience(targetMatch[1].trim());
        if (goalMatch) setSelectedOption(goalMatch[1].trim());
        if (infoMatch) setAdditionalInfo(infoMatch[1].trim());
        
        // Set to step 3 if data is loaded
        if (businessMatch && industryMatch && targetMatch) {
          setCurrentStep(3);
        }
      }
    }
  }, [messages]);

  // Simulate progress animation
  useEffect(() => {
    if (result && completionProgress < 100) {
      const timer = setTimeout(() => {
        setCompletionProgress(prev => Math.min(prev + 10, 100));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result, completionProgress]);

  const generateMutation = useMutation({
    mutationFn: async () => {
      const message = `Business: ${businessName}
Industry: ${industry}
Target Audience: ${targetAudience}
Goal: ${selectedOption}
Additional Info: ${additionalInfo}`;

      // Update session title with descriptive name
      const selectedOptionObj = options.find((opt: any) => opt.value === selectedOption);
      const sessionTitle = `${botName}: ${selectedOptionObj?.label || selectedOption} for ${businessName}`;
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle 
      });

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: message,
        role: 'user'
      });
      
      const responseData = await response.json();
      return responseData;
    },
    onSuccess: (data) => {
      // Parse and structure the AI response into rich sections
      const structuredResult = parseAIResponse(data.content);
      setResult(structuredResult);
      setCompletionProgress(0);
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/sessions', sessionId, 'messages'] 
      });
      
      toast({
        title: "Strategy Generated! 🎉",
        description: "Your customized strategy is ready",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Parse AI response into structured sections
  const parseAIResponse = (content: string) => {
    // This is a simplified parser - in production, you'd parse the actual AI response
    return {
      summary: "Your comprehensive marketing strategy has been generated with actionable insights and timeline.",
      sections: [
        {
          type: 'text',
          title: 'Executive Summary',
          icon: <FileText className="w-5 h-5 text-blue-600" />,
          content: 'Based on your business profile and goals, we\'ve created a tailored strategy focusing on digital transformation and customer engagement.'
        },
        {
          type: 'timeline',
          title: 'Implementation Timeline',
          icon: <Calendar className="w-5 h-5 text-purple-600" />,
          content: [
            { phase: 'Phase 1: Foundation', description: 'Set up core infrastructure and team', duration: '2 weeks' },
            { phase: 'Phase 2: Launch', description: 'Execute initial campaigns and gather data', duration: '4 weeks' },
            { phase: 'Phase 3: Optimize', description: 'Analyze results and refine approach', duration: '2 weeks' },
            { phase: 'Phase 4: Scale', description: 'Expand successful initiatives', duration: 'Ongoing' }
          ]
        },
        {
          type: 'list',
          title: 'Key Action Items',
          icon: <Target className="w-5 h-5 text-green-600" />,
          content: [
            'Define brand voice and visual identity guidelines',
            'Set up social media profiles on 3 primary platforms',
            'Create content calendar for next 30 days',
            'Implement email marketing automation',
            'Launch paid advertising campaigns'
          ]
        },
        {
          type: 'metrics',
          title: 'Expected Outcomes',
          icon: <BarChart3 className="w-5 h-5 text-orange-600" />,
          content: [
            { label: 'Reach', value: '50K+' },
            { label: 'Engagement', value: '15%' },
            { label: 'Conversions', value: '3-5%' },
            { label: 'ROI', value: '250%' }
          ]
        }
      ],
      rawContent: content
    };
  };

  const handleGenerate = () => {
    if (!selectedOption || !businessName || !industry || !targetAudience) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    generateMutation.mutate();
  };

  const exportAsFormat = (format: string) => {
    // Implement export functionality
    toast({
      title: `Exporting as ${format}`,
      description: "Your document is being prepared for download",
    });
  };

  const shareResult = () => {
    // Implement sharing functionality
    toast({
      title: "Share Link Created",
      description: "Copy the link to share your strategy",
    });
  };

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <div className={`w-24 h-1 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="shadow-lg border-t-4 border-t-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Tell us about your business
          </CardTitle>
          <CardDescription>
            Provide details to get a customized strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enhanced Option Selection */}
          <div className="space-y-2">
            <Label>What would you like to create?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {options.map((option) => (
                <motion.div
                  key={option.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={`cursor-pointer transition-all ${
                      selectedOption === option.value 
                        ? 'ring-2 ring-blue-600 shadow-md' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => {
                      setSelectedOption(option.value);
                      setCurrentStep(2);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{option.label}</h4>
                          <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                        </div>
                        {selectedOption === option.value && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Business Details */}
          <AnimatePresence>
            {selectedOption && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name *</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => {
                        setBusinessName(e.target.value);
                        if (e.target.value && industry && targetAudience) {
                          setCurrentStep(3);
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Input
                      id="industry"
                      placeholder="e.g., E-commerce, SaaS, Healthcare"
                      value={industry}
                      onChange={(e) => {
                        setIndustry(e.target.value);
                        if (businessName && e.target.value && targetAudience) {
                          setCurrentStep(3);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Input
                    id="targetAudience"
                    placeholder="Describe your ideal customers"
                    value={targetAudience}
                    onChange={(e) => {
                      setTargetAudience(e.target.value);
                      if (businessName && industry && e.target.value) {
                        setCurrentStep(3);
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
                  <Textarea
                    id="additionalInfo"
                    placeholder="Any specific requirements or context..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    rows={3}
                  />
                </div>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={generateMutation.isPending || !selectedOption || !businessName || !industry || !targetAudience}
                  className="w-full"
                  size="lg"
                >
                  {generateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Strategy...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Strategy
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Results Section */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {/* Progress Bar */}
            {completionProgress < 100 && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Generating your strategy...</span>
                      <span>{completionProgress}%</span>
                    </div>
                    <Progress value={completionProgress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Bar */}
            <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">Your Strategy is Ready!</h3>
                    <p className="text-sm text-gray-600">{result.summary}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportAsFormat('PDF')}>
                      <Download className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportAsFormat('DOC')}>
                      <FileText className="w-4 h-4 mr-1" />
                      DOC
                    </Button>
                    <Button variant="outline" size="sm" onClick={shareResult}>
                      <Share2 className="w-4 h-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rich Content Sections */}
            <div className="space-y-4">
              {result.sections.map((section: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <RichContentSection {...section} />
                </motion.div>
              ))}
            </div>

            {/* Templates Section */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Related Templates
                </CardTitle>
                <CardDescription>
                  Download ready-to-use templates for your strategy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Marketing Calendar
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Budget Tracker
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    KPI Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}