import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Palette, RefreshCw, Download, Loader2 } from "lucide-react";

interface LogoDesignBotProps {
  sessionId: number;
  botName: string;
}

export function LogoDesignBot({ sessionId, botName }: LogoDesignBotProps) {
  const [step, setStep] = useState(1);
  const [redesignCount, setRedesignCount] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const [logoInfo, setLogoInfo] = useState({
    brandName: '',
    industry: '',
    brandColors: '',
    logoType: 'combination',
    style: 'modern',
    inspirations: '',
    additionalNotes: ''
  });

  const generateLogoMutation = useMutation({
    mutationFn: async () => {
      setIsGenerating(true);
      
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Logo Design: ${logoInfo.brandName}`
      });

      const prompt = `Create a professional logo design brief for:
        Brand Name: ${logoInfo.brandName}
        Industry: ${logoInfo.industry}
        Brand Colors: ${logoInfo.brandColors}
        Logo Type: ${logoInfo.logoType}
        Style: ${logoInfo.style}
        Inspirations: ${logoInfo.inspirations}
        Additional Notes: ${logoInfo.additionalNotes}
        
        Generate a detailed visual description for a logo that captures the brand's essence.`;

      // Send to ChatGPT API for logo generation
      const response = await apiRequest('POST', `/api/sessions/${sessionId}/logo-generate`, {
        prompt: prompt,
        logoInfo: logoInfo
      });

      return response.json();
    },
    onSuccess: (data) => {
      setLogoUrl(data.imageUrl);
      setIsGenerating(false);
      setStep(3);
      
      toast({
        title: "Logo Generated! 🎨",
        description: "Your logo design is ready for review",
      });
    },
    onError: (error) => {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate logo. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleRedesign = () => {
    if (redesignCount >= 3) {
      toast({
        title: "Redesign Limit Reached",
        description: "You've reached the maximum number of redesigns (3).",
        variant: "destructive",
      });
      return;
    }
    
    setRedesignCount(prev => prev + 1);
    setStep(1);
    setLogoUrl(null);
  };

  const handleDownload = () => {
    if (logoUrl) {
      const link = document.createElement('a');
      link.href = logoUrl;
      link.download = `${logoInfo.brandName}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Palette className="w-8 h-8" />
            {botName}
          </CardTitle>
          <CardDescription className="text-purple-100">
            I'll help you create a unique logo that perfectly represents your brand
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 1: Basic Brand Information</CardTitle>
            <CardDescription>Tell me about your brand</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Brand Name</Label>
                <Input
                  value={logoInfo.brandName}
                  onChange={(e) => setLogoInfo(prev => ({ ...prev, brandName: e.target.value }))}
                  placeholder="Your brand name"
                />
              </div>
              <div>
                <Label>Industry</Label>
                <Input
                  value={logoInfo.industry}
                  onChange={(e) => setLogoInfo(prev => ({ ...prev, industry: e.target.value }))}
                  placeholder="e.g., Technology, Healthcare, Fashion"
                />
              </div>
            </div>

            <div>
              <Label>Brand Colors</Label>
              <Input
                value={logoInfo.brandColors}
                onChange={(e) => setLogoInfo(prev => ({ ...prev, brandColors: e.target.value }))}
                placeholder="e.g., Blue and white, Earth tones, Vibrant colors"
              />
              <p className="text-sm text-gray-500 mt-1">
                Describe your preferred color palette or specific colors
              </p>
            </div>

            <Button 
              onClick={() => setStep(2)}
              disabled={!logoInfo.brandName || !logoInfo.industry}
              className="w-full"
            >
              Continue to Style Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Style Preferences */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Logo Style & Preferences</CardTitle>
            <CardDescription>Define your logo style</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base mb-3 block">Logo Type</Label>
              <RadioGroup 
                value={logoInfo.logoType} 
                onValueChange={(value) => setLogoInfo(prev => ({ ...prev, logoType: value }))}
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="wordmark" id="wordmark" />
                    <Label htmlFor="wordmark" className="font-normal">
                      Wordmark - Text only (e.g., Google, Coca-Cola)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="lettermark" id="lettermark" />
                    <Label htmlFor="lettermark" className="font-normal">
                      Lettermark - Initials only (e.g., IBM, CNN)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="icon" id="icon" />
                    <Label htmlFor="icon" className="font-normal">
                      Icon/Symbol - Image only (e.g., Apple, Twitter)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="combination" id="combination" />
                    <Label htmlFor="combination" className="font-normal">
                      Combination - Icon + Text (e.g., Adidas, Burger King)
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label className="text-base mb-3 block">Design Style</Label>
              <RadioGroup 
                value={logoInfo.style} 
                onValueChange={(value) => setLogoInfo(prev => ({ ...prev, style: value }))}
              >
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="modern" id="modern" />
                    <Label htmlFor="modern" className="font-normal">Modern & Minimal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="classic" id="classic" />
                    <Label htmlFor="classic" className="font-normal">Classic & Timeless</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="playful" id="playful" />
                    <Label htmlFor="playful" className="font-normal">Playful & Fun</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="elegant" id="elegant" />
                    <Label htmlFor="elegant" className="font-normal">Elegant & Sophisticated</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Inspirations & References</Label>
              <Textarea
                value={logoInfo.inspirations}
                onChange={(e) => setLogoInfo(prev => ({ ...prev, inspirations: e.target.value }))}
                placeholder="Describe logos you like or brands that inspire you"
                rows={3}
              />
            </div>

            <div>
              <Label>Additional Notes</Label>
              <Textarea
                value={logoInfo.additionalNotes}
                onChange={(e) => setLogoInfo(prev => ({ ...prev, additionalNotes: e.target.value }))}
                placeholder="Any specific requirements, symbols, or ideas you want included"
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => generateLogoMutation.mutate()}
                disabled={isGenerating}
                className="flex-1"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Logo...
                  </>
                ) : (
                  'Generate Logo'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Logo Result */}
      {step === 3 && logoUrl && (
        <Card>
          <CardHeader>
            <CardTitle>Your Logo Design</CardTitle>
            <CardDescription>
              {redesignCount > 0 ? `Redesign ${redesignCount} of 3` : 'Initial design'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center min-h-[400px]">
              <img 
                src={logoUrl} 
                alt={`${logoInfo.brandName} logo`}
                className="max-w-full h-auto"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Design Details</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Type:</strong> {logoInfo.logoType}</p>
                  <p><strong>Style:</strong> {logoInfo.style}</p>
                  <p><strong>Colors:</strong> {logoInfo.brandColors}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Usage Guidelines</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Minimum size: 100px width</li>
                  <li>• Clear space: 20% of logo width</li>
                  <li>• Use on light backgrounds</li>
                  <li>• Maintain aspect ratio</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleRedesign}
                disabled={redesignCount >= 3}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Redesign ({3 - redesignCount} left)
              </Button>
              <Button onClick={handleDownload} className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download Logo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}