import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Megaphone, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const PLATFORMS = [
  { id: "google", label: "Google Search", headline: 30, desc: 90, cta: 15 },
  { id: "meta", label: "Meta (Facebook/Instagram)", headline: 40, desc: 125, cta: 20 },
  { id: "linkedin", label: "LinkedIn", headline: 70, desc: 600, cta: 25 },
  { id: "twitter", label: "X / Twitter", headline: 0, desc: 280, cta: 0 },
];

interface AdVariant { headline?: string; description: string; cta?: string }

interface Props {
  onResult: (sessionId: string, message: any) => void;
  sessionId?: string;
}

function CharCount({ text, max, label }: { text: string; max: number; label: string }) {
  const len = text.length;
  const over = len > max;
  return (
    <div className={`flex justify-between text-xs mt-0.5 ${over ? "text-destructive" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span>{len}/{max}{over ? " — too long!" : ""}</span>
    </div>
  );
}

export function AdCopyGeneratorInterface({ onResult, sessionId }: Props) {
  const { toast } = useToast();
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");
  const [goal, setGoal] = useState("conversions");
  const [variants, setVariants] = useState<AdVariant[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const runMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/bots/ad-copy-generator/run", {
        input,
        sessionId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      onResult(data.sessionId, data.message);
      const content = data.message?.content ?? "";
      try {
        const parsed = JSON.parse(content);
        setVariants(Array.isArray(parsed) ? parsed : (parsed.variants ?? [parsed]));
      } catch {
        setVariants([{ description: content }]);
      }
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleSubmit() {
    if (!product.trim()) {
      toast({ title: "Product description required", variant: "destructive" });
      return;
    }
    const plat = platform;
    const input = [
      `Platform: ${plat.label}`,
      `Product/Service: ${product}`,
      audience ? `Target audience: ${audience}` : null,
      `Campaign goal: ${goal}`,
      `Character limits — Headline: ${plat.headline || "N/A"}, Description: ${plat.desc}${plat.cta ? `, CTA: ${plat.cta}` : ""}`,
      "Generate 3 ad copy variants. Return JSON array where each item has: headline (if applicable), description, cta (if applicable). STRICTLY respect the character limits.",
    ].filter(Boolean).join("\n");
    runMutation.mutate(input);
  }

  function copyVariant(v: AdVariant, i: number) {
    const text = [v.headline, v.description, v.cta].filter(Boolean).join("\n\n");
    navigator.clipboard.writeText(text);
    setCopiedIdx(i);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <div className="space-y-4 p-1">
      {/* Platform selector */}
      <div className="space-y-1.5">
        <Label>Platform</Label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPlatform(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                platform.id === p.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Limits badge */}
      <div className="flex flex-wrap gap-2 text-[10px]">
        {platform.headline > 0 && (
          <span className="px-2 py-0.5 rounded bg-muted">Headline: {platform.headline} chars</span>
        )}
        <span className="px-2 py-0.5 rounded bg-muted">Body: {platform.desc} chars</span>
        {platform.cta > 0 && (
          <span className="px-2 py-0.5 rounded bg-muted">CTA: {platform.cta} chars</span>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>Product / Service *</Label>
        <Textarea
          rows={3}
          placeholder="Describe what you're advertising and its key benefits…"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="resize-none"
        />
      </div>

      <div className="space-y-1.5">
        <Label>Target audience</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. startup founders aged 25-45"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Campaign goal</Label>
        <div className="flex gap-2">
          {["conversions", "awareness", "traffic", "leads"].map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`px-3 py-1 rounded-full text-xs border capitalize transition-colors ${
                goal === g ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={runMutation.isPending} className="w-full">
        {runMutation.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Writing ad copy…</>
        ) : (
          <><Megaphone className="h-4 w-4 mr-2" />Generate 3 variants</>
        )}
      </Button>

      {variants.length > 0 && (
        <div className="space-y-3">
          {variants.map((v, i) => (
            <div key={i} className="border rounded-xl p-4 space-y-2 relative group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">Variant {i + 1}</span>
                <button onClick={() => copyVariant(v, i)} aria-label="Copy variant" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedIdx === i ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                </button>
              </div>
              {v.headline && (
                <div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Headline</p>
                  </div>
                  <p className="text-sm font-semibold">{v.headline}</p>
                  {platform.headline > 0 && <CharCount text={v.headline} max={platform.headline} label="" />}
                </div>
              )}
              <div>
                <p className="text-xs text-muted-foreground">Body copy</p>
                <p className="text-sm whitespace-pre-wrap">{v.description}</p>
                <CharCount text={v.description} max={platform.desc} label="" />
              </div>
              {v.cta && (
                <div>
                  <p className="text-xs text-muted-foreground">CTA</p>
                  <p className="text-sm font-medium text-primary">{v.cta}</p>
                  {platform.cta > 0 && <CharCount text={v.cta} max={platform.cta} label="" />}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
