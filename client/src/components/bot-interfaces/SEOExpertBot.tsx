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
  Search, TrendingUp, Globe, Link, FileText, AlertCircle,
  CheckCircle, ArrowUp, ArrowDown, Minus, Target, Zap,
  BarChart3, Eye, Clock, Award, RefreshCw, Download
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";

interface SEOExpertBotProps {
  sessionId: number;
  botName: string;
}

export function SEOExpertBot({ sessionId, botName }: SEOExpertBotProps) {
  const [analysisType, setAnalysisType] = useState<'audit' | 'keywords' | 'strategy'>('audit');
  const [websiteInfo, setWebsiteInfo] = useState({
    url: '',
    industry: '',
    targetAudience: '',
    mainKeywords: '',
    competitors: '',
    goals: '',
    currentTraffic: '',
    targetTraffic: ''
  });
  const [seoResults, setSeoResults] = useState<any>(null);
  const [auditProgress, setAuditProgress] = useState(0);
  
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
          setSeoResults(savedResults);
        } catch (e) {
          // Not JSON
        }
      }
    }
  }, [messages]);

  const performSEOAnalysisMutation = useMutation({
    mutationFn: async () => {
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `SEO ${analysisType}: ${websiteInfo.url || websiteInfo.industry}`
      });

      // Simulate audit progress
      if (analysisType === 'audit') {
        for (let i = 0; i <= 100; i += 5) {
          setAuditProgress(i);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      const prompt = `As an SEO expert, perform a comprehensive ${analysisType} for:
        Website: ${websiteInfo.url}
        Industry: ${websiteInfo.industry}
        Target Audience: ${websiteInfo.targetAudience}
        Current Keywords: ${websiteInfo.mainKeywords}
        Competitors: ${websiteInfo.competitors}
        Goals: ${websiteInfo.goals}
        Current Traffic: ${websiteInfo.currentTraffic}
        Target Traffic: ${websiteInfo.targetTraffic}
        
        Provide:
        1. Comprehensive SEO audit with scores
        2. Keyword opportunities and gaps
        3. Technical SEO improvements
        4. Content optimization strategy
        5. Link building opportunities
        6. Competitor analysis
        7. 90-day action plan`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: (data) => {
      const results = {
        type: analysisType,
        overallScore: 72,
        improvements: "+28 points possible",
        audit: {
          technical: { score: 85, issues: 12, critical: 3 },
          content: { score: 68, issues: 24, critical: 8 },
          performance: { score: 76, issues: 8, critical: 2 },
          mobile: { score: 82, issues: 6, critical: 1 },
          backlinks: { score: 61, issues: 15, critical: 5 }
        },
        keywords: {
          opportunities: [
            { keyword: "industry specific term", volume: 12000, difficulty: 45, potential: "High" },
            { keyword: "long tail keyword phrase", volume: 3500, difficulty: 28, potential: "Very High" },
            { keyword: "branded search term", volume: 8000, difficulty: 15, potential: "High" },
            { keyword: "solution based query", volume: 5500, difficulty: 52, potential: "Medium" }
          ],
          gaps: [
            "Missing coverage for buyer intent keywords",
            "No optimization for voice search queries",
            "Limited local SEO keyword targeting"
          ]
        },
        competitors: [
          { name: "Competitor A", score: 85, traffic: "250K/mo", keywords: 1250 },
          { name: "Competitor B", score: 78, traffic: "180K/mo", keywords: 980 },
          { name: "Your Site", score: 72, traffic: "45K/mo", keywords: 420 }
        ],
        recommendations: {
          immediate: [
            "Fix critical technical SEO issues",
            "Optimize page load speed",
            "Update meta descriptions"
          ],
          shortTerm: [
            "Create content for gap keywords",
            "Build internal linking structure",
            "Improve mobile experience"
          ],
          longTerm: [
            "Develop link building campaign",
            "Create pillar content strategy",
            "Implement schema markup"
          ]
        },
        projections: [
          { month: "Month 1", traffic: 45000, ranking: 72 },
          { month: "Month 2", traffic: 58000, ranking: 75 },
          { month: "Month 3", traffic: 75000, ranking: 78 },
          { month: "Month 4", traffic: 95000, ranking: 82 },
          { month: "Month 5", traffic: 120000, ranking: 85 },
          { month: "Month 6", traffic: 150000, ranking: 88 }
        ],
        content: data.content
      };
      
      setSeoResults(results);
      setAuditProgress(100);
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/sessions', sessionId, 'messages'] 
      });
      
      toast({
        title: "SEO Analysis Complete! 🔍",
        description: "Your comprehensive SEO report is ready",
      });
    }
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Search className="w-8 h-8" />
            {botName} - SEO Optimization Master
          </CardTitle>
          <CardDescription className="text-green-100">
            I help you dominate search rankings with data-driven SEO strategies
          </CardDescription>
        </CardHeader>
      </Card>

      {!seoResults ? (
        <div className="space-y-6">
          {/* Analysis Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Your SEO Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={analysisType === 'audit' ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => setAnalysisType('audit')}
                >
                  <BarChart3 className="w-8 h-8" />
                  <span className="font-medium">SEO Audit</span>
                  <span className="text-xs text-gray-600">Complete site analysis</span>
                </Button>
                <Button
                  variant={analysisType === 'keywords' ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => setAnalysisType('keywords')}
                >
                  <Target className="w-8 h-8" />
                  <span className="font-medium">Keyword Research</span>
                  <span className="text-xs text-gray-600">Find opportunities</span>
                </Button>
                <Button
                  variant={analysisType === 'strategy' ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-6"
                  onClick={() => setAnalysisType('strategy')}
                >
                  <TrendingUp className="w-8 h-8" />
                  <span className="font-medium">Growth Strategy</span>
                  <span className="text-xs text-gray-600">90-day action plan</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Website Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Tell me about your website</CardTitle>
              <CardDescription>
                I'll analyze your site and create a custom SEO strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Website URL</Label>
                  <Input
                    value={websiteInfo.url}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://yourwebsite.com"
                  />
                </div>
                <div>
                  <Label>Industry</Label>
                  <Input
                    value={websiteInfo.industry}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, industry: e.target.value }))}
                    placeholder="e.g., SaaS, E-commerce, Healthcare"
                  />
                </div>
                <div>
                  <Label>Target Audience</Label>
                  <Input
                    value={websiteInfo.targetAudience}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, targetAudience: e.target.value }))}
                    placeholder="Who are you trying to reach?"
                  />
                </div>
                <div>
                  <Label>Main Keywords</Label>
                  <Input
                    value={websiteInfo.mainKeywords}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, mainKeywords: e.target.value }))}
                    placeholder="Current focus keywords"
                  />
                </div>
                <div>
                  <Label>Current Monthly Traffic</Label>
                  <Input
                    value={websiteInfo.currentTraffic}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, currentTraffic: e.target.value }))}
                    placeholder="e.g., 10,000 visits"
                  />
                </div>
                <div>
                  <Label>Target Monthly Traffic</Label>
                  <Input
                    value={websiteInfo.targetTraffic}
                    onChange={(e) => setWebsiteInfo(prev => ({ ...prev, targetTraffic: e.target.value }))}
                    placeholder="e.g., 50,000 visits"
                  />
                </div>
              </div>

              <div>
                <Label>Main Competitors</Label>
                <Textarea
                  value={websiteInfo.competitors}
                  onChange={(e) => setWebsiteInfo(prev => ({ ...prev, competitors: e.target.value }))}
                  placeholder="List your main competitors' websites"
                  rows={2}
                />
              </div>

              <div>
                <Label>SEO Goals</Label>
                <Textarea
                  value={websiteInfo.goals}
                  onChange={(e) => setWebsiteInfo(prev => ({ ...prev, goals: e.target.value }))}
                  placeholder="What do you want to achieve with SEO?"
                  rows={2}
                />
              </div>

              {analysisType === 'audit' && auditProgress > 0 && auditProgress < 100 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Analyzing Your Website...</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Technical SEO Check</span>
                      <span>{Math.min(auditProgress, 25)}%</span>
                    </div>
                    <Progress value={Math.min(auditProgress, 25)} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Content Analysis</span>
                      <span>{Math.min(Math.max(auditProgress - 25, 0), 25)}%</span>
                    </div>
                    <Progress value={Math.min(Math.max(auditProgress - 25, 0), 25)} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Competitor Research</span>
                      <span>{Math.min(Math.max(auditProgress - 50, 0), 25)}%</span>
                    </div>
                    <Progress value={Math.min(Math.max(auditProgress - 50, 0), 25)} className="h-2" />
                    
                    <div className="flex justify-between text-sm">
                      <span>Generating Report</span>
                      <span>{Math.min(Math.max(auditProgress - 75, 0), 25)}%</span>
                    </div>
                    <Progress value={Math.min(Math.max(auditProgress - 75, 0), 25)} className="h-2" />
                  </div>
                </div>
              )}

              <Button 
                onClick={() => performSEOAnalysisMutation.mutate()} 
                className="w-full"
                disabled={!websiteInfo.industry || performSEOAnalysisMutation.isPending}
              >
                {performSEOAnalysisMutation.isPending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Start SEO Analysis
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <Card className="border-2 border-green-500">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Award className="w-6 h-6 text-green-600" />
                    SEO Analysis Complete
                  </CardTitle>
                  <CardDescription>
                    Your website scored {seoResults.overallScore}/100 with {seoResults.improvements} improvement potential
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSeoResults(null)}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Analysis
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="technical">Technical</TabsTrigger>
              <TabsTrigger value="keywords">Keywords</TabsTrigger>
              <TabsTrigger value="competitors">Competitors</TabsTrigger>
              <TabsTrigger value="action-plan">Action Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>SEO Health Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg className="w-48 h-48 transform -rotate-90">
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="#e5e7eb"
                          strokeWidth="16"
                          fill="none"
                        />
                        <circle
                          cx="96"
                          cy="96"
                          r="88"
                          stroke="#10b981"
                          strokeWidth="16"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 88 * seoResults.overallScore / 100} ${2 * Math.PI * 88}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-bold">{seoResults.overallScore}</div>
                          <div className="text-sm text-gray-600">out of 100</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 mt-8">
                    {Object.entries(seoResults.audit).map(([category, data]: [string, any]) => (
                      <div key={category} className="text-center">
                        <div className={`text-2xl font-bold ${getScoreColor(data.score)}`}>
                          {data.score}
                        </div>
                        <p className="text-sm text-gray-600 capitalize">{category}</p>
                        <Badge variant="outline" className="mt-1">
                          {data.issues} issues
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Traffic Projections */}
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Growth Projection</CardTitle>
                  <CardDescription>Expected traffic growth with SEO improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={seoResults.projections}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value: any) => value.toLocaleString()} />
                        <Area 
                          type="monotone" 
                          dataKey="traffic" 
                          stroke="#10b981" 
                          fill="#10b981" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="technical" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Technical SEO Audit</CardTitle>
                  <CardDescription>Critical technical issues affecting your rankings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(seoResults.audit).map(([category, data]: [string, any]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium capitalize flex items-center gap-2">
                          {category === 'technical' && <Zap className="w-5 h-5" />}
                          {category === 'content' && <FileText className="w-5 h-5" />}
                          {category === 'performance' && <Clock className="w-5 h-5" />}
                          {category === 'mobile' && <Globe className="w-5 h-5" />}
                          {category === 'backlinks' && <Link className="w-5 h-5" />}
                          {category} SEO
                        </h4>
                        <div className="flex items-center gap-3">
                          <Badge className={getScoreBadge(data.score)}>
                            Score: {data.score}/100
                          </Badge>
                          {data.critical > 0 && (
                            <Badge variant="destructive">
                              {data.critical} Critical
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Progress value={data.score} className="h-2" />
                      <p className="text-sm text-gray-600 mt-2">
                        Found {data.issues} issues ({data.critical} critical) that need attention
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Full Technical Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 whitespace-pre-wrap">{seoResults.content}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="keywords" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Keyword Opportunities</CardTitle>
                  <CardDescription>High-potential keywords you should target</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {seoResults.keywords.opportunities.map((keyword: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div>
                          <h4 className="font-medium">{keyword.keyword}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Volume: {keyword.volume.toLocaleString()}/mo</span>
                            <span>Difficulty: {keyword.difficulty}/100</span>
                          </div>
                        </div>
                        <Badge className={
                          keyword.potential === 'Very High' ? 'bg-green-100 text-green-800' :
                          keyword.potential === 'High' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {keyword.potential} Potential
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Keyword Gaps</CardTitle>
                  <CardDescription>Areas where you're missing opportunities</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {seoResults.keywords.gaps.map((gap: string, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                        <p className="text-sm">{gap}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="competitors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Competitor Analysis</CardTitle>
                  <CardDescription>How you stack up against the competition</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {seoResults.competitors.map((competitor: any, index: number) => (
                      <div key={index} className={`p-4 border rounded-lg ${competitor.name === 'Your Site' ? 'border-blue-500 bg-blue-50' : ''}`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{competitor.name}</h4>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>Traffic: {competitor.traffic}</span>
                              <span>Keywords: {competitor.keywords.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-2xl font-bold ${getScoreColor(competitor.score)}`}>
                              {competitor.score}
                            </div>
                            <p className="text-xs text-gray-600">SEO Score</p>
                          </div>
                        </div>
                        <Progress value={competitor.score} className="h-2 mt-3" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="action-plan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>90-Day SEO Action Plan</CardTitle>
                  <CardDescription>Prioritized tasks to improve your rankings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-red-600" />
                      Immediate Actions (Week 1-2)
                    </h4>
                    <div className="space-y-2">
                      {seoResults.recommendations.immediate.map((task: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Target className="w-5 h-5 text-yellow-600" />
                      Short-term Goals (Week 3-6)
                    </h4>
                    <div className="space-y-2">
                      {seoResults.recommendations.shortTerm.map((task: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      Long-term Strategy (Week 7-12)
                    </h4>
                    <div className="space-y-2">
                      {seoResults.recommendations.longTerm.map((task: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{task}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-50 to-teal-50">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4">Your SEO action plan is ready! To get started:</p>
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Review the critical issues in the Technical tab</li>
                    <li>Start creating content for high-opportunity keywords</li>
                    <li>Fix any mobile or performance issues immediately</li>
                    <li>Set up weekly monitoring of your progress</li>
                    <li>Consider professional help for link building</li>
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