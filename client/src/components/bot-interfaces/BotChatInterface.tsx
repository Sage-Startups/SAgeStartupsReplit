import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Copy, Bot, User, CheckCircle } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from "framer-motion";
import { BotResultDisplay } from "./BotResultDisplay";

interface Message {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

interface BotChatInterfaceProps {
  sessionId: number;
  className?: string;
  botType?: string;
}

export function BotChatInterface({ sessionId, className = "", botType }: BotChatInterfaceProps) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [useRichDisplay, setUseRichDisplay] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/sessions/${sessionId}/messages`);
      if (!response.ok) throw new Error('Failed to fetch messages');
      return response.json();
    },
    enabled: !!sessionId,
    refetchInterval: 2000, // Refresh every 2 seconds to catch new messages
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleCopyMessage = async (messageId: number, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-4 h-4 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Check if we have an assistant response to show in rich display
  const lastAssistantMessage = messages.filter((m: Message) => m.role === 'assistant').pop();
  
  // Show rich display if we have an assistant message and useRichDisplay is true
  if (useRichDisplay && lastAssistantMessage) {
    return (
      <div className="space-y-4">
        {/* Toggle button for switching views */}
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseRichDisplay(false)}
          >
            View Conversation History
          </Button>
        </div>
        
        {/* Rich display for the result */}
        <BotResultDisplay 
          content={lastAssistantMessage.content} 
          botType={botType}
        />
      </div>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* Toggle button to switch back to rich display */}
        {lastAssistantMessage && (
          <div className="p-4 border-b">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUseRichDisplay(true)}
            >
              View Formatted Results
            </Button>
          </div>
        )}
        
        <ScrollArea className="h-[500px] p-4">
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message: Message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                    <div className={`rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      {message.role === 'assistant' ? (
                        <div className="text-gray-900 bg-transparent">
                          <ReactMarkdown
                            components={{
                              h1: ({ children }: any) => <h1 className="text-lg font-bold mb-2 text-gray-900">{children}</h1>,
                              h2: ({ children }: any) => <h2 className="text-base font-semibold mb-2 text-gray-800">{children}</h2>,
                              h3: ({ children }: any) => <h3 className="text-sm font-medium mb-1 text-gray-800">{children}</h3>,
                              ul: ({ children }: any) => <ul className="list-disc list-inside space-y-1 mb-2 text-gray-700">{children}</ul>,
                              ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-1 mb-2 text-gray-700">{children}</ol>,
                              li: ({ children }: any) => <li className="text-sm text-gray-700">{children}</li>,
                              p: ({ children }: any) => <p className="text-sm mb-2 last:mb-0 text-gray-700">{children}</p>,
                              strong: ({ children }: any) => <strong className="font-semibold text-gray-900">{children}</strong>,
                              em: ({ children }: any) => <em className="italic text-gray-700">{children}</em>,
                              code: ({ children }: any) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-xs">{children}</code>,
                              blockquote: ({ children }: any) => (
                                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-2 bg-blue-50">
                                  {children}
                                </blockquote>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      )}
                    </div>

                    {/* Message Actions */}
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </Badge>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2"
                        onClick={() => handleCopyMessage(message.id, message.content)}
                      >
                        {copiedId === message.id ? (
                          <CheckCircle className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Auto-scroll anchor */}
            <div ref={messagesEndRef} />
          </div>

          {/* Empty State */}
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Ready to start!</h3>
                <p className="text-gray-500 text-sm">
                  Fill out the form above and click generate to begin your AI-powered session.
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}