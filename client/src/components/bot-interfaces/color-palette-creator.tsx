import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Copy, Check, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const MOODS = ["Calm & Trustworthy", "Bold & Energetic", "Playful & Fun", "Luxurious & Premium", "Natural & Organic", "Tech & Futuristic", "Warm & Friendly", "Clean & Minimal"];
const INDUSTRIES = ["SaaS / Tech", "Health & Wellness", "Food & Beverage", "Fashion & Beauty", "Finance", "Education", "Real Estate", "Creative / Agency", "E-commerce", "Non-profit"];

interface Color { name: string; hex: string; usage: string }

interface Props {
  onResult: (sessionId: string, message: any) => void;
  sessionId?: string;
}

function CopiedHex({ hex }: { hex: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(hex);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`Copy ${hex}`}
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
      {hex}
    </button>
  );
}

export function ColorPaletteCreatorInterface({ onResult, sessionId }: Props) {
  const { toast } = useToast();
  const [mood, setMood] = useState("");
  const [industry, setIndustry] = useState("");
  const [brandName, setBrandName] = useState("");
  const [palette, setPalette] = useState<Color[]>([]);

  const runMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/bots/color-palette-creator/run", {
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
        const colors: Color[] = Array.isArray(parsed)
          ? parsed
          : (parsed.colors ?? parsed.palette ?? []);
        setPalette(colors);
      } catch {
        const hexes = (content.match(/#[0-9A-Fa-f]{6}/g) ?? []).map((hex: string, i: number) => ({
          name: `Color ${i + 1}`,
          hex,
          usage: "",
        }));
        setPalette(hexes);
      }
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleSubmit() {
    if (!mood) { toast({ title: "Please select a mood", variant: "destructive" }); return; }
    const input = [
      brandName ? `Brand name: ${brandName}` : null,
      `Mood / Personality: ${mood}`,
      industry ? `Industry: ${industry}` : null,
      "Generate a 5-color brand palette. Return JSON with array of {name, hex, usage} objects.",
    ].filter(Boolean).join("\n");
    runMutation.mutate(input);
  }

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-1.5">
        <Label>Brand name (optional)</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Bloom Studio"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Brand mood / personality *</Label>
        <div className="flex flex-wrap gap-2">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                mood === m ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-primary/50"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Industry</Label>
        <Select value={industry} onValueChange={setIndustry}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry…" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((i) => (
              <SelectItem key={i} value={i}>{i}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button onClick={handleSubmit} disabled={runMutation.isPending} className="w-full">
        {runMutation.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating palette…</>
        ) : (
          <><Palette className="h-4 w-4 mr-2" />Generate palette</>
        )}
      </Button>

      {palette.length > 0 && (
        <div className="space-y-3 border rounded-xl overflow-hidden">
          {/* Color strip */}
          <div className="flex h-16">
            {palette.map((c) => (
              <div key={c.hex} className="flex-1" style={{ backgroundColor: c.hex }} title={c.name} />
            ))}
          </div>
          {/* Color details */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
            {palette.map((c) => (
              <div key={c.hex} className="space-y-1.5">
                <div
                  className="h-10 rounded-lg border cursor-pointer hover:scale-105 transition-transform"
                  style={{ backgroundColor: c.hex }}
                  onClick={() => navigator.clipboard.writeText(c.hex)}
                  title="Click to copy"
                />
                <p className="text-xs font-medium truncate">{c.name}</p>
                <CopiedHex hex={c.hex} />
                {c.usage && <p className="text-[10px] text-muted-foreground">{c.usage}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
