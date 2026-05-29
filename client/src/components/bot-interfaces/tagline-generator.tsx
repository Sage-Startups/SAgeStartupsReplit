import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Star, Tag, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Props {
  onResult: (sessionId: string, message: any) => void;
  sessionId?: string;
}

function parseTaglines(content: string): string[] {
  try {
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) return parsed.map(String);
    if (parsed.taglines) return parsed.taglines.map(String);
  } catch {}
  // fallback: numbered list
  return content
    .split("\n")
    .map((l) => l.replace(/^\d+[\.\)]\s*/, "").replace(/^[-•*]\s*/, "").trim())
    .filter((l) => l.length > 3 && l.length < 120);
}

const STORAGE_KEY = "sage_tagline_stars";

export function TaglineGeneratorInterface({ onResult, sessionId }: Props) {
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [valueProposition, setValueProposition] = useState("");
  const [audience, setAudience] = useState("");
  const [taglines, setTaglines] = useState<string[]>([]);
  const [starred, setStarred] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]")); } catch { return new Set(); }
  });
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...starred]));
  }, [starred]);

  function toggleStar(t: string) {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(t)) next.delete(t); else next.add(t);
      return next;
    });
  }

  function copyTagline(t: string) {
    navigator.clipboard.writeText(t);
    setCopied(t);
    setTimeout(() => setCopied(null), 1500);
  }

  const runMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/bots/tagline-generator/run", {
        input,
        sessionId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      onResult(data.sessionId, data.message);
      setTaglines(parseTaglines(data.message?.content ?? ""));
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleSubmit() {
    if (!brandName.trim()) {
      toast({ title: "Brand name required", variant: "destructive" });
      return;
    }
    const input = [
      `Brand name: ${brandName}`,
      valueProposition ? `What we do / value proposition: ${valueProposition}` : null,
      audience ? `Target audience: ${audience}` : null,
      "Generate exactly 10 taglines. Return JSON array of 10 strings. Vary the styles: punchy, descriptive, aspirational, question-based, and rhyming.",
    ].filter(Boolean).join("\n");
    runMutation.mutate(input);
  }

  const starredTaglines = taglines.filter((t) => starred.has(t));
  const unstarredTaglines = taglines.filter((t) => !starred.has(t));

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5">
        <Label>Brand name *</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Sage Startups"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Value proposition</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. AI branding tools for founders"
          value={valueProposition}
          onChange={(e) => setValueProposition(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Target audience</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. early-stage startup founders"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <Button onClick={handleSubmit} disabled={runMutation.isPending} className="w-full">
        {runMutation.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating 10 taglines…</>
        ) : (
          <><Tag className="h-4 w-4 mr-2" />Generate taglines</>
        )}
      </Button>

      {taglines.length > 0 && (
        <div className="space-y-2">
          {starredTaglines.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-amber-600 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-500" />Favorites
              </p>
              {starredTaglines.map((t) => (
                <TaglineRow key={t} tagline={t} starred={true} copied={copied === t} onStar={() => toggleStar(t)} onCopy={() => copyTagline(t)} />
              ))}
            </div>
          )}
          <div className="space-y-1">
            {starredTaglines.length > 0 && <p className="text-xs text-muted-foreground font-medium">All taglines</p>}
            {unstarredTaglines.map((t) => (
              <TaglineRow key={t} tagline={t} starred={false} copied={copied === t} onStar={() => toggleStar(t)} onCopy={() => copyTagline(t)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaglineRow({ tagline, starred, copied, onStar, onCopy }: { tagline: string; starred: boolean; copied: boolean; onStar: () => void; onCopy: () => void }) {
  return (
    <div className={`flex items-center gap-2 p-3 rounded-lg border group transition-colors ${starred ? "border-amber-300 bg-amber-50 dark:border-amber-700 dark:bg-amber-950/20" : "border-border hover:bg-muted/50"}`}>
      <button onClick={onStar} aria-label={starred ? "Unstar tagline" : "Star tagline"} className="shrink-0">
        <Star className={`h-4 w-4 transition-colors ${starred ? "fill-amber-400 text-amber-400" : "text-muted-foreground hover:text-amber-400"}`} />
      </button>
      <p className="flex-1 text-sm">{tagline}</p>
      <button onClick={onCopy} aria-label="Copy tagline" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
      </button>
    </div>
  );
}
