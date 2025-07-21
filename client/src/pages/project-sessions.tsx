import { useParams, Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MessageSquare, Bot as BotIcon, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Project, BotSession } from "@shared/schema";
import { getBotById } from "@/lib/bot-definitions";
import { format } from "date-fns";

export default function ProjectSessions() {
  const { projectId } = useParams();
  
  if (!projectId) {
    return <div>Project not found</div>;
  }

  const { data: project } = useQuery<Project>({
    queryKey: ['/api/projects', projectId]
  });

  const { data: sessions = [] } = useQuery<BotSession[]>({
    queryKey: ['/api/projects', projectId, 'sessions']
  });

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Project not found</h1>
            <Link href="/dashboard">
              <Button className="mt-4">Back to Dashboard</Button>
            </Link>
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
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          
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
                          <Link href={`/bot/${botId}?project=${projectId}&session=${session.id}`}>
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Session
                            </Button>
                          </Link>
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