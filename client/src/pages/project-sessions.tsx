import { useParams, Link } from "wouter";
import { MainNavigation } from "@/components/main-navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { ArrowLeft, Calendar, MessageSquare, Bot as BotIcon, ExternalLink, Trash2 } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Project, BotSession } from "@shared/schema";
import { getBotById } from "@/lib/bot-definitions";
import { format } from "date-fns";

export default function ProjectSessions() {
  const { projectId } = useParams();
  const { toast } = useToast();
  
  if (!projectId) {
    return <div>Project not found</div>;
  }

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId]
  });

  const { data: sessions = [] } = useQuery<BotSession[]>({
    queryKey: ['/api/projects', projectId, 'sessions']
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      return await apiRequest("DELETE", `/api/sessions/${sessionId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/analytics'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/recent-activity'] });
      toast({
        title: "Session deleted",
        description: "The bot session has been successfully deleted.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete session",
        variant: "destructive",
      });
    },
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNavigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
              <Button className="mt-4" onClick={() => window.history.back()}>Back</Button>
          </div>
        </div>
      </div>
    );
  }

  // Group sessions by bot
  const sessionsByBot = sessions.reduce((acc: Record<string, BotSession[]>, session) => {
    if (!acc[session.botId]) {
      acc[session.botId] = [];
    }
    acc[session.botId].push(session);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNavigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
            <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.name}</h1>
              {project.description && (
                <p className="text-gray-600 text-lg mb-4">{project.description}</p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {format(new Date(project.createdAt), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  {sessions.length} session{sessions.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions */}
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BotIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions yet</h3>
                <p className="text-gray-600 mb-6">
                  You haven't created any bot sessions for this project yet.
                </p>
                <Link href="/dashboard">
                  <Button>
                    Start Your First Session
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            Object.entries(sessionsByBot).map(([botId, botSessions]) => {
              const bot = getBotById(botId);
              if (!bot) return null;

              return (
                <Card key={botId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          bot.color === 'text-primary' ? 'bg-blue-100' : 
                          bot.color === 'text-secondary' ? 'bg-gray-100' : 
                          bot.color === 'text-success' ? 'bg-green-100' : 
                          bot.color === 'text-warning' ? 'bg-yellow-100' : 
                          bot.color === 'text-danger' ? 'bg-red-100' : 
                          'bg-purple-100'
                        }`}>
                          <i className={`fas fa-${bot.icon} ${bot.color} text-lg`}></i>
                        </div>
                        <div>
                          <CardTitle className="text-lg">{bot.name}</CardTitle>
                          <CardDescription>{bot.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {botSessions.length} session{botSessions.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {botSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                Session #{session.id}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(new Date(session.createdAt), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Link href={`/bot/${botId}?project=${projectId}&session=${session.id}`}>
                              <Button variant="outline" size="sm">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Session
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Session</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete Session #{session.id}? This will permanently remove all messages and cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteSessionMutation.mutate(session.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                    disabled={deleteSessionMutation.isPending}
                                  >
                                    {deleteSessionMutation.isPending ? "Deleting..." : "Delete Session"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}