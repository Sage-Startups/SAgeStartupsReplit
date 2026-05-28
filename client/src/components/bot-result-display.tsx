import { useState } from "react";
import { Copy, Download, Check, FileText, List, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface BotMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

interface BotResultDisplayProps {
  outputType: "text" | "colorPalette" | "logoImage" | "structuredAnalysis";
  messages: BotMessage[];
  isLoading?: boolean;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <Button variant="ghost" size="icon" onClick={copy} className="h-7 w-7 shrink-0">
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

function ColorPaletteDisplay({ content }: { content: string }) {
  let colors: Array<{ name: string; hex: string }> = [];
  try {
    const parsed = JSON.parse(content);
    colors = Array.isArray(parsed) ? parsed : (parsed.colors ?? []);
  } catch {
    const hexes = content.match(/#[0-9A-Fa-f]{6}/g) ?? [];
    colors = hexes.map((hex, i) => ({ name: `Color ${i + 1}`, hex }));
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
      {colors.map((c, i) => (
        <button
          key={i}
          onClick={() => navigator.clipboard.writeText(c.hex)}
          className="group flex flex-col gap-2 rounded-xl overflow-hidden border hover:shadow-md transition-shadow"
          title="Click to copy"
        >
          <div className="h-16 w-full" style={{ backgroundColor: c.hex }} />
          <div className="px-2 pb-2 text-left">
            <p className="text-xs font-medium truncate">{c.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{c.hex}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function LogoImageDisplay({ metadata, content }: { metadata?: Record<string, unknown> | null; content: string }) {
  let imageUrl = metadata?.imageUrl as string | undefined;
  let prompt = metadata?.prompt as string | undefined;

  if (!imageUrl) {
    try {
      const p = JSON.parse(content);
      imageUrl = p.imageUrl;
      prompt = p.prompt;
    } catch {}
  }

  if (!imageUrl) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <p className="text-sm">Image generation result unavailable.</p>
        <p className="text-xs mt-1">{content}</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <img src={imageUrl} alt="Generated logo" className="w-full max-w-sm mx-auto rounded-xl border shadow" />
      {prompt && <p className="text-xs text-muted-foreground text-center italic">{prompt}</p>}
      <div className="flex justify-center">
        <a href={imageUrl} download="logo.png" target="_blank" rel="noreferrer">
          <Button size="sm" variant="outline">
            <Download className="h-4 w-4 mr-1" /> Download
          </Button>
        </a>
      </div>
    </div>
  );
}

function StructuredAnalysisDisplay({ content }: { content: string }) {
  let data: Record<string, unknown> | null = null;
  try { data = JSON.parse(content); } catch {}

  if (!data) {
    return <div className="p-4 prose dark:prose-invert max-w-none text-sm"><ReactMarkdown>{content}</ReactMarkdown></div>;
  }

  return (
    <div className="p-4 space-y-4">
      {Object.entries(data).map(([key, value]) => (
        <div key={key} className="rounded-lg border bg-muted/30 p-3">
          <h4 className="text-sm font-semibold capitalize mb-1">{key.replace(/_/g, " ")}</h4>
          {Array.isArray(value) ? (
            <ul className="list-disc list-inside space-y-0.5">
              {value.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground">{String(item)}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">{String(value)}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-20 w-full mt-4" />
    </div>
  );
}

function exportAsMarkdown(messages: BotMessage[]) {
  const md = messages
    .map((m) => `**${m.role === "user" ? "You" : "Assistant"}:**\n\n${m.content}`)
    .join("\n\n---\n\n");
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "session.md";
  a.click();
  URL.revokeObjectURL(url);
}

export function BotResultDisplay({ outputType, messages, isLoading }: BotResultDisplayProps) {
  const [showRaw, setShowRaw] = useState(false);
  const assistantMessages = messages.filter((m) => m.role === "assistant");
  const lastAssistant = assistantMessages[assistantMessages.length - 1];

  if (isLoading) return <LoadingSkeleton />;
  if (!lastAssistant) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-2">
        <Wrench className="h-8 w-8 opacity-40" />
        <p className="text-sm">Results will appear here after you submit.</p>
      </div>
    );
  }

  function renderResult(msg: BotMessage) {
    if (showRaw) {
      return (
        <div className="relative">
          <pre className="p-4 text-xs bg-muted/40 rounded-lg overflow-auto whitespace-pre-wrap break-words">{msg.content}</pre>
          <div className="absolute top-2 right-2"><CopyButton text={msg.content} /></div>
        </div>
      );
    }
    switch (outputType) {
      case "colorPalette": return <ColorPaletteDisplay content={msg.content} />;
      case "logoImage": return <LogoImageDisplay metadata={msg.metadata} content={msg.content} />;
      case "structuredAnalysis": return <StructuredAnalysisDisplay content={msg.content} />;
      default:
        return (
          <div className="relative group">
            <div className="p-4 prose dark:prose-invert max-w-none text-sm">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={msg.content} />
            </div>
          </div>
        );
    }
  }

  return (
    <div className="flex flex-col h-full">
      <Tabs defaultValue="overview" className="flex flex-col flex-1">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <TabsList className="h-7">
            <TabsTrigger value="overview" className="text-xs px-2 py-1 h-5">
              <FileText className="h-3 w-3 mr-1" />Overview
            </TabsTrigger>
            <TabsTrigger value="history" className="text-xs px-2 py-1 h-5">
              <List className="h-3 w-3 mr-1" />History
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7"
              onClick={() => setShowRaw(!showRaw)}
            >
              {showRaw ? "Formatted" : "Raw"}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => exportAsMarkdown(messages)}>
              <Download className="h-3 w-3 mr-1" />MD
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="flex-1 overflow-auto m-0">
          {renderResult(lastAssistant)}
        </TabsContent>

        <TabsContent value="history" className="flex-1 overflow-auto m-0 p-3 space-y-3">
          {messages.map((msg, i) => (
            <div key={msg.id ?? i} className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                {msg.content.length > 300 ? msg.content.slice(0, 300) + "…" : msg.content}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
