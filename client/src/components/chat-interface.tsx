import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Download, Share, Shield, Bot, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage, GeneratedAsset } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ChatInterfaceProps {
  sessionId: number;
  botName: string;
  botColor: string;
}

export function ChatInterface({ sessionId, botName, botColor }: ChatInterfaceProps) {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'messages'],
    enabled: !!sessionId
  });

  const { data: assets = [] } = useQuery({
    queryKey: ['/api/sessions', sessionId, 'assets'],
    enabled: !!sessionId
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, { 
        content,
        role: 'user'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/sessions', sessionId, 'assets'] });
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(message.trim());
  };

  const exportChat = () => {
    const chatContent = messages.map((msg: ChatMessage) => 
      `${msg.role === 'user' ? 'You' : botName}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${botName}_chat_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: `${botName} Results`,
        text: 'Check out my AI-generated branding results from BrandAI Pro!',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Share link copied to clipboard"
      });
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Bot Header */}
      <div className={`gradient-${botColor} text-white p-6`}>
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
            <Bot className="text-2xl" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">{botName}</h3>
            <p className="text-white/80">Powered by GPT-4 • Specialized AI Assistant</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="h-96 bg-gray-50 p-6 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Bot className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Start a conversation with {botName}</p>
              <p className="text-sm mt-2">Ask questions or describe what you need help with.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg: ChatMessage) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className={`w-8 h-8 bg-${botColor} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                    <Bot className="text-white text-sm" />
                  </div>
                )}
                <div className={`rounded-lg p-4 shadow-sm max-w-lg ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white' 
                    : 'bg-white text-gray-900 border'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.metadata?.assets && msg.metadata.assets.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {msg.metadata.assets.map((asset: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-sm">{asset.title}</span>
                            <Button size="sm" variant="outline" className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Export
                            </Button>
                          </div>
                          <div className="text-sm text-gray-600">
                            {asset.type === 'color_palette' && asset.content.colors && (
                              <div className="flex gap-2 mt-2">
                                {asset.content.colors.map((color: string, i: number) => (
                                  <div
                                    key={i}
                                    className="w-8 h-8 rounded border"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                  />
                                ))}
                              </div>
                            )}
                            {asset.type === 'logo_concept' && (
                              <p>{asset.content.description}</p>
                            )}
                            {asset.type === 'copy_variation' && (
                              <p className="font-medium">{asset.content.text}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
                    <User className="text-white text-sm" />
                  </div>
                )}
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <div className={`w-8 h-8 bg-${botColor} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}>
                  <Bot className="text-white text-sm" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.2s' }}></div>
                    <div className="animate-pulse w-2 h-2 bg-gray-400 rounded-full" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message or ask for help..."
            className="flex-1 min-h-[40px] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!message.trim() || sendMessageMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-2" />
            Send
          </Button>
        </form>
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-1" />
            End-to-end encrypted
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={exportChat}
              className="hover:text-gray-700 transition flex items-center"
              disabled={messages.length === 0}
            >
              <Download className="w-4 h-4 mr-1" />
              Export Chat
            </button>
            <button 
              onClick={shareResults}
              className="hover:text-gray-700 transition flex items-center"
            >
              <Share className="w-4 h-4 mr-1" />
              Share Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
