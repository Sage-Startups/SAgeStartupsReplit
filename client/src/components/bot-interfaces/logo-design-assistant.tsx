import { useState, useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { Loader2, Upload, RefreshCw, Download, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const STYLES = ["Modern", "Minimalist", "Playful", "Corporate", "Vintage", "Geometric", "Hand-drawn", "Abstract"];
const COLORS = [
  { name: "Sage", value: "#4d7c5f" },
  { name: "Navy", value: "#1e3a5f" },
  { name: "Coral", value: "#e85d4a" },
  { name: "Gold", value: "#d4a017" },
  { name: "Slate", value: "#4a5568" },
  { name: "Emerald", value: "#059669" },
  { name: "Purple", value: "#7c3aed" },
  { name: "Rose", value: "#e11d48" },
];

interface Props {
  onResult: (sessionId: string, message: { id: string; role: string; content: string; metadata?: any; createdAt: string }) => void;
  sessionId?: string;
}

export function LogoDesignAssistantInterface({ onResult, sessionId }: Props) {
  const { toast } = useToast();
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const runMutation = useMutation({
    mutationFn: async (input: string) => {
      const res = await apiRequest("POST", "/api/bots/logo-design-assistant/run", {
        input,
        sessionId,
      });
      return res.json();
    },
    onSuccess: (data) => {
      const content = data.message?.content ?? "";
      let url: string | null = null;
      try {
        const parsed = JSON.parse(content);
        url = parsed.imageUrl ?? null;
      } catch {}
      setResultImage(url);
      onResult(data.sessionId, data.message);
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  function toggleStyle(s: string) {
    setSelectedStyles((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]);
  }

  function toggleColor(c: string) {
    setSelectedColors((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);
  }

  function handleSubmit() {
    if (!brandName.trim()) {
      toast({ title: "Brand name required", variant: "destructive" });
      return;
    }
    const colorNames = selectedColors.map((v) => COLORS.find((c) => c.value === v)?.name ?? v);
    const input = [
      `Brand name: ${brandName}`,
      industry ? `Industry: ${industry}` : null,
      selectedStyles.length ? `Style preferences: ${selectedStyles.join(", ")}` : null,
      colorNames.length ? `Color preferences: ${colorNames.join(", ")}` : null,
      imagePreview ? "Inspiration image provided — incorporate its aesthetic direction." : null,
    ].filter(Boolean).join("\n");

    runMutation.mutate(input);
  }

  return (
    <div className="space-y-5 p-1">
      <div className="space-y-1.5">
        <Label htmlFor="brand-name">Brand name *</Label>
        <input
          id="brand-name"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Verda Foods"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="industry">Industry</Label>
        <input
          id="industry"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="e.g. Health & Wellness, SaaS, Food"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
        />
      </div>

      {/* Style chips */}
      <div className="space-y-2">
        <Label>Style preferences</Label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s}
              onClick={() => toggleStyle(s)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedStyles.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="space-y-2">
        <Label>Color preferences</Label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => toggleColor(c.value)}
              title={c.name}
              aria-label={`Select ${c.name} color`}
              className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                selectedColors.includes(c.value) ? "border-foreground scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      {/* File drop zone */}
      <div className="space-y-2">
        <Label>Inspiration image (optional)</Label>
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          {imagePreview ? (
            <div className="space-y-2">
              <img src={imagePreview} alt="Inspiration" className="h-24 mx-auto rounded-lg object-cover" />
              <button onClick={() => setImagePreview(null)} className="text-xs text-muted-foreground hover:text-destructive">Remove</button>
            </div>
          ) : (
            <>
              <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Drop an image here or</p>
              <label className="cursor-pointer text-xs text-primary hover:underline">
                browse files
                <input type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
              </label>
            </>
          )}
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={runMutation.isPending} className="w-full">
        {runMutation.isPending ? (
          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Generating logo…</>
        ) : (
          <><ImageIcon className="h-4 w-4 mr-2" />Generate logo concept</>
        )}
      </Button>

      {resultImage && (
        <div className="space-y-3 border rounded-xl p-4">
          <img src={resultImage} alt="Generated logo" className="w-full rounded-lg" />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={handleSubmit} disabled={runMutation.isPending}>
              <RefreshCw className="h-4 w-4 mr-1" />Regenerate
            </Button>
            <a href={resultImage} download="logo-concept.png" target="_blank" rel="noreferrer" className="flex-1">
              <Button size="sm" variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-1" />Download
              </Button>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
