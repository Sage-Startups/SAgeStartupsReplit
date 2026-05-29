import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface SliderProps {
  label: string;
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (v: number) => void;
}

function ToneSlider({ label, leftLabel, rightLabel, value, onChange }: SliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{leftLabel}</span>
        <span className="font-medium text-foreground">{label}</span>
        <span>{rightLabel}</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={label}
      />
    </div>
  );
}

interface Props {
  onResult: (sessionId: string, message: any) => void;
  sessionId?: string;
}

interface VoiceResult {
  voiceDescription?: string;
  examples?: string[];
  keywords?: string[];
  doList?: string[];
  dontList?: string[];
}

export function BrandVoiceGeneratorInterface({ onResult, sessionId }: Props) {
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [audience, setAudience] = useState("");
  const [formality, setFormality] = useState(50);
  const [playfulness, setPlayfulness] = useState(50);
  const [boldness, setBoldness] = useState(50);
  const [result, setResult] = useState<VoiceResult | null>(null);

  const runMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/bots/brand-voice-generator/run", {
        input,
        sessionId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      onResult(data.sessionId, data.message);
      const content = data.message?.content ?? "";
      try {
        setResult(JSON.parse(content));
      } catch {
        setResult({ voiceDescription: content });
      }
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
    const toneDesc = `Formality: ${formality < 35 ? "very casual" : formality > 65 ? "very formal" : "balanced"}, Playfulness: ${playfulness < 35 ? "serious" : playfulness > 65 ? "very playful" : "moderate"}, Boldness: ${boldness < 35 ? "soft" : boldness > 65 ? "very bold" : "confident"}`;
    const input = [
      `Brand name: ${brandName}`,
      audience ? `Target audience: ${audience}` : null,
      `Tone dials — ${toneDesc}`,
      "Return JSON with: voiceDescription (paragraph), examples (3 sample sentences), keywords (5 voice keywords), doList (3 dos), dontList (3 don'ts).",
    ].filter(Boolean).join("\n");
    runMutation.mutate(input);
  }

  return (
    <div className="space-y-5 p-1">
      <div className="space-y-1.5">
        <Label>Brand name *</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Meridian Health"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Target audience</Label>
        <input
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. B2B founders, Gen Z consumers, health-conscious parents"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
        />
      </div>

      <div className="space-y-4 p-4 rounded-xl bg-muted/30 border">
        <p className="text-sm font-medium">Tone dials</p>
        <ToneSlider label="Formality" leftLabel="Casual" rightLabel="Formal" value={formality} onChange={setFormality} />
        <ToneSlider label="Playfulness" leftLabel="Serious" rightLabel="Playful" value={playfulness} onChange={setPlayfulness} />
        <ToneSlider label="Boldness" leftLabel="Soft" rightLabel="Bold" value={boldness} onChange={setBoldness} />
      </div>

      <Button onClick={handleSubmit} disabled={runMutation.isPending} className="w-full">
        {runMutation.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating voice…</>
        ) : (
          <><Mic className="h-4 w-4 mr-2" />Generate brand voice</>
        )}
      </Button>

      {result && (
        <div className="space-y-4 border rounded-xl p-4">
          {result.voiceDescription && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Voice Profile</p>
              <p className="text-sm">{result.voiceDescription}</p>
            </div>
          )}
          {result.keywords && result.keywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Voice Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {result.keywords.map((k) => (
                  <span key={k} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{k}</span>
                ))}
              </div>
            </div>
          )}
          {result.examples && result.examples.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">Example Sentences</p>
              <div className="space-y-2">
                {result.examples.map((ex, i) => (
                  <p key={i} className="text-sm italic border-l-2 border-primary pl-3 text-muted-foreground">"{ex}"</p>
                ))}
              </div>
            </div>
          )}
          {(result.doList || result.dontList) && (
            <div className="grid grid-cols-2 gap-3">
              {result.doList && (
                <div>
                  <p className="text-xs font-semibold text-green-600 mb-1">✓ Do</p>
                  {result.doList.map((d) => <p key={d} className="text-xs text-muted-foreground">{d}</p>)}
                </div>
              )}
              {result.dontList && (
                <div>
                  <p className="text-xs font-semibold text-red-600 mb-1">✗ Don't</p>
                  {result.dontList.map((d) => <p key={d} className="text-xs text-muted-foreground">{d}</p>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
