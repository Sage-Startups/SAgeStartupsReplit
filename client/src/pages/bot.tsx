import { useState, useEffect } from "react";
import { useParams, useSearch, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  ArrowLeft, Loader2, ChevronDown, ChevronUp, Trash2
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SEOHead } from "@/components/seo-head";
import { BotResultDisplay } from "@/components/bot-result-display";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface BotDef {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  outputType: "text" | "colorPalette" | "logoImage" | "structuredAnalysis";
}

interface BotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

interface SessionWithMessages {
  id: string;
  botId: string;
  title: string;
  messages: BotMessage[];
  createdAt: string;
  updatedAt: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  branding: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  marketing: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  advertising: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  analytics: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
};

const inputSchema = z.object({ input: z.string().min(1, "Please describe what you need") });

export default function BotPage() {
  const { botId } = useParams<{ botId: string }>();
  const search = useSearch();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();

  const searchParams = new URLSearchParams(search);
  const initialSessionId = searchParams.get("session");

  const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId ?? undefined);
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);

  const { data: bot, isLoading: botLoading } = useQuery<BotDef>({
    queryKey: [`/api/bots/${botId}`],
  });

  const { data: sessionData } = useQuery<SessionWithMessages>({
    queryKey: [`/api/bot-sessions/${sessionId}`],
    enabled: !!sessionId,
  });

  const { data: allSessions } = useQuery<SessionWithMessages[]>({
    queryKey: ["/api/bot-sessions"],
  });

  useEffect(() => {
    if (sessionData?.messages) {
      setMessages(sessionData.messages);
    }
  }, [sessionData]);

  const form = useForm<z.infer<typeof inputSchema>>({
    resolver: zodResolver(inputSchema),
    defaultValues: { input: "" },
  });

  const runMutation = useMutation({
    mutationFn: async (data: { input: string; sessionId?: string }) => {
      const res = await apiRequest("POST", `/api/bots/${botId}/run`, data);
      return res.json();
    },
    onSuccess: (result) => {
      if (!sessionId) {
        setSessionId(result.sessionId);
        setLocation(`/bot/${botId}?session=${result.sessionId}`, { replace: true });
      }
      setMessages((prev) => {
        const withUser = prev.find((m) => m.role === "user" && m.content === form.getValues("input"))
          ? prev
          : [...prev, { id: `u-${Date.now()}`, role: "user" as const, content: form.getValues("input"), createdAt: new Date().toISOString() }];
        return [...withUser, result.message];
      });
      form.reset();
      qc.invalidateQueries({ queryKey: ["/api/bot-sessions"] });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/bot-sessions/${id}`),
    onSuccess: () => {
      setSessionId(undefined);
      setMessages([]);
      setLocation(`/bot/${botId}`, { replace: true });
      qc.invalidateQueries({ queryKey: ["/api/bot-sessions"] });
      toast({ title: "Session deleted" });
    },
  });

  const thisSessionSessions = allSessions?.filter((s) => s.botId === botId) ?? [];

  const iconName = bot?.icon
    ? bot.icon.split("-").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join("")
    : "Sparkles";
  const Icon = (LucideIcons as Record<string, any>)[iconName] ?? LucideIcons.Sparkles;

  function onSubmit(data: z.infer<typeof inputSchema>) {
    const optimisticUser: BotMessage = {
      id: `optimistic-${Date.now()}`,
      role: "user",
      content: data.input,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);
    runMutation.mutate({ input: data.input, sessionId });
  }

  if (botLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-4 w-72 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!bot) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-lg font-medium">Bot not found</p>
          <Button variant="outline" className="mt-4" onClick={() => setLocation("/ai-suite")}>
            Back to AI Suite
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={`${bot.name} — Sage Startups`} description={bot.description} />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <div className="border-b bg-background px-4 sm:px-6 py-4">
          <div className="mx-auto max-w-7xl flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/ai-suite")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className={`p-2 rounded-lg shrink-0 ${CATEGORY_COLORS[bot.category]?.replace("text-", "bg-").replace("bg-", "bg-").split(" ")[0] ?? "bg-muted"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-lg leading-tight truncate">{bot.name}</h1>
                <div className="flex items-center gap-2">
                  <Badge className={`text-[10px] border-0 ${CATEGORY_COLORS[bot.category]}`}>
                    {bot.category}
                  </Badge>
                  {sessionId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 text-muted-foreground hover:text-destructive"
                      onClick={() => deleteMutation.mutate(sessionId)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input pane */}
            <div className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">{bot.description}</p>

              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="input">Your input</Label>
                  <Textarea
                    id="input"
                    rows={8}
                    placeholder="Describe your brand, product, or what you need help with…"
                    {...form.register("input")}
                    className="resize-none"
                  />
                  {form.formState.errors.input && (
                    <p className="text-xs text-destructive">{form.formState.errors.input.message}</p>
                  )}
                </div>
                <Button type="submit" disabled={runMutation.isPending} className="w-full sm:w-auto">
                  {runMutation.isPending ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Running…</>
                  ) : (
                    "Run bot"
                  )}
                </Button>
              </form>

              {/* Session history drawer */}
              {thisSessionSessions.length > 0 && (
                <div className="border rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/50 transition-colors"
                    onClick={() => setHistoryOpen(!historyOpen)}
                  >
                    <span>Session history ({thisSessionSessions.length})</span>
                    {historyOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {historyOpen && (
                    <div className="border-t divide-y">
                      {thisSessionSessions.map((s) => (
                        <button
                          key={s.id}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-muted/50 transition-colors ${s.id === sessionId ? "bg-primary/5" : ""}`}
                          onClick={() => {
                            setSessionId(s.id);
                            setLocation(`/bot/${botId}?session=${s.id}`, { replace: true });
                          }}
                        >
                          <p className="font-medium truncate">{s.title}</p>
                          <p className="text-xs text-muted-foreground">{new Date(s.updatedAt).toLocaleDateString()}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Result pane */}
            <div className="border rounded-xl overflow-hidden bg-background min-h-[400px] flex flex-col">
              <BotResultDisplay
                outputType={bot.outputType}
                messages={messages}
                isLoading={runMutation.isPending && messages.length === 0}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
