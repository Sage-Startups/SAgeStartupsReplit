import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MainNavigation } from '@/components/main-navigation';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { 
  Bot, 
  Code2, 
  Settings, 
  Sparkles, 
  Save, 
  Play, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Brain,
  Workflow,
  Calendar,
  MessageSquare,
  Database
} from 'lucide-react';
import { isUnauthorizedError } from '@/lib/authUtils';
import { useEffect } from 'react';

interface BotProgram {
  id: string;
  botId: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'event' | 'api';
  schedule?: string;
  event?: string;
  enabled: boolean;
  instructions: string;
  parameters: Record<string, any>;
  lastRun?: Date;
  status: 'idle' | 'running' | 'completed' | 'failed';
}

export default function BotProgramming() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [selectedBot, setSelectedBot] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<BotProgram | null>(null);
  const [isCreatingProgram, setIsCreatingProgram] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  const [newProgram, setNewProgram] = useState<Partial<BotProgram>>({
    name: '',
    description: '',
    trigger: 'manual',
    instructions: '',
    parameters: {},
    enabled: true
  });

  // Fetch available bots
  const { data: bots = [] } = useQuery<any[]>({
    queryKey: ['/api/bots'],
    enabled: isAuthenticated
  });

  // Fetch bot programs
  const { data: programs = [] } = useQuery<BotProgram[]>({
    queryKey: ['/api/bot-programs'],
    enabled: isAuthenticated
  });

  // Create/Update bot program
  const saveProgramMutation = useMutation({
    mutationFn: async (program: Partial<BotProgram>) => {
      const endpoint = program.id 
        ? `/api/bot-programs/${program.id}`
        : '/api/bot-programs';
      const method = program.id ? 'PUT' : 'POST';
      
      return apiRequest(method, endpoint, program);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bot-programs'] });
      toast({
        title: "Program Saved",
        description: "Bot program has been saved successfully",
      });
      setIsCreatingProgram(false);
      setNewProgram({
        name: '',
        description: '',
        trigger: 'manual',
        instructions: '',
        parameters: {},
        enabled: true
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to save bot program",
        variant: "destructive",
      });
    }
  });

  // Execute bot program
  const executeProgramMutation = useMutation({
    mutationFn: async (programId: string) => {
      return apiRequest('POST', `/api/bot-programs/${programId}/execute`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/bot-programs'] });
      toast({
        title: "Program Executed",
        description: "Bot program is now running",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Execution Failed",
        description: "Failed to execute bot program",
        variant: "destructive",
      });
    }
  });

  const triggerIcons = {
    manual: <Play className="w-4 h-4" />,
    scheduled: <Clock className="w-4 h-4" />,
    event: <Zap className="w-4 h-4" />,
    api: <Code2 className="w-4 h-4" />
  };

  const statusColors = {
    idle: 'bg-gray-500',
    running: 'bg-blue-500',
    completed: 'bg-green-500',
    failed: 'bg-red-500'
  };

  const botPrograms = programs.filter((p) => 
    !selectedBot || p.botId === selectedBot
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-8 h-8 text-purple-600" />
            AI Bot Programming
          </h1>
          <p className="mt-2 text-gray-600">
            Program your AI bots to perform specific jobs automatically
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bot Selection Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  Available Bots
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={!selectedBot ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setSelectedBot('')}
                >
                  All Bots
                </Button>
                {bots.map((bot: any) => (
                  <Button
                    key={bot.id}
                    variant={selectedBot === bot.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedBot(bot.id)}
                  >
                    <bot.icon className="w-4 h-4 mr-2" />
                    {bot.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="programs" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="programs">Bot Programs</TabsTrigger>
                <TabsTrigger value="create">Create Program</TabsTrigger>
                <TabsTrigger value="logs">Execution Logs</TabsTrigger>
              </TabsList>

              {/* Bot Programs Tab */}
              <TabsContent value="programs" className="space-y-4">
                {botPrograms.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No programs created yet</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Create your first bot program to get started
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {botPrograms.map((program: BotProgram) => (
                      <Card key={program.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {triggerIcons[program.trigger]}
                              <div>
                                <CardTitle className="text-lg">{program.name}</CardTitle>
                                <CardDescription>{program.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={statusColors[program.status]}>
                                {program.status}
                              </Badge>
                              <Switch
                                checked={program.enabled}
                                onCheckedChange={(checked) => {
                                  saveProgramMutation.mutate({
                                    ...program,
                                    enabled: checked
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <MessageSquare className="w-4 h-4" />
                              <span className="font-medium">Instructions:</span>
                              <span className="truncate">{program.instructions}</span>
                            </div>
                            {program.trigger === 'scheduled' && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="font-medium">Schedule:</span>
                                <span>{program.schedule}</span>
                              </div>
                            )}
                            {program.lastRun && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Last Run:</span>
                                <span>{new Date(program.lastRun).toLocaleString()}</span>
                              </div>
                            )}
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                onClick={() => executeProgramMutation.mutate(program.id)}
                                disabled={!program.enabled || program.status === 'running'}
                              >
                                <Play className="w-4 h-4 mr-1" />
                                Execute
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedProgram(program)}
                              >
                                <Settings className="w-4 h-4 mr-1" />
                                Configure
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Create Program Tab */}
              <TabsContent value="create">
                <Card>
                  <CardHeader>
                    <CardTitle>Create New Bot Program</CardTitle>
                    <CardDescription>
                      Program your AI bots to perform specific tasks automatically
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="program-name">Program Name</Label>
                        <Input
                          id="program-name"
                          placeholder="e.g., Daily SEO Report"
                          value={newProgram.name}
                          onChange={(e) => setNewProgram({
                            ...newProgram,
                            name: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bot-select">Select Bot</Label>
                        <Select
                          value={newProgram.botId}
                          onValueChange={(value) => setNewProgram({
                            ...newProgram,
                            botId: value
                          })}
                        >
                          <SelectTrigger id="bot-select">
                            <SelectValue placeholder="Choose a bot" />
                          </SelectTrigger>
                          <SelectContent>
                            {bots.map((bot: any) => (
                              <SelectItem key={bot.id} value={bot.id}>
                                {bot.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        placeholder="What does this program do?"
                        value={newProgram.description}
                        onChange={(e) => setNewProgram({
                          ...newProgram,
                          description: e.target.value
                        })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trigger">Trigger Type</Label>
                      <Select
                        value={newProgram.trigger}
                        onValueChange={(value: any) => setNewProgram({
                          ...newProgram,
                          trigger: value
                        })}
                      >
                        <SelectTrigger id="trigger">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manual">Manual Execution</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="event">Event-based</SelectItem>
                          <SelectItem value="api">API Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {newProgram.trigger === 'scheduled' && (
                      <div className="space-y-2">
                        <Label htmlFor="schedule">Schedule (Cron Expression)</Label>
                        <Input
                          id="schedule"
                          placeholder="e.g., 0 9 * * * (daily at 9am)"
                          value={newProgram.schedule}
                          onChange={(e) => setNewProgram({
                            ...newProgram,
                            schedule: e.target.value
                          })}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="instructions">
                        AI Instructions
                        <span className="text-sm text-gray-500 ml-2">
                          (Tell the bot exactly what to do)
                        </span>
                      </Label>
                      <Textarea
                        id="instructions"
                        placeholder="e.g., Analyze my website's SEO performance and generate a comprehensive report with actionable recommendations. Focus on technical issues, keyword opportunities, and competitor analysis."
                        className="min-h-[150px]"
                        value={newProgram.instructions}
                        onChange={(e) => setNewProgram({
                          ...newProgram,
                          instructions: e.target.value
                        })}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Pro Tips for Bot Instructions
                      </h4>
                      <ul className="mt-2 space-y-1 text-sm text-blue-800">
                        <li>• Be specific about what you want the bot to analyze or create</li>
                        <li>• Include any constraints or requirements</li>
                        <li>• Specify the format of the output you expect</li>
                        <li>• Mention any data sources or references to use</li>
                      </ul>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => saveProgramMutation.mutate(newProgram)}
                      disabled={!newProgram.name || !newProgram.botId || !newProgram.instructions}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Create Program
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Execution Logs Tab */}
              <TabsContent value="logs">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution History</CardTitle>
                    <CardDescription>
                      View the history of your bot program executions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Mock execution logs - would be fetched from API */}
                      <div className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Daily SEO Report</p>
                            <p className="text-sm text-gray-600">
                              Completed successfully - Generated 15-page report
                            </p>
                          </div>
                          <div className="text-right">
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                            <p className="text-sm text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Content Generation Batch</p>
                            <p className="text-sm text-gray-600">
                              Running - Processing 5/10 articles
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 ml-auto" />
                            <p className="text-sm text-gray-500">Started 15 min ago</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Competitor Analysis</p>
                            <p className="text-sm text-gray-600">
                              Failed - API rate limit exceeded
                            </p>
                          </div>
                          <div className="text-right">
                            <AlertCircle className="w-5 h-5 text-red-500 ml-auto" />
                            <p className="text-sm text-gray-500">1 day ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}