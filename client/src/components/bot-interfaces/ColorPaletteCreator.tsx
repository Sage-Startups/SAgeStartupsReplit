import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Palette, Eye, CheckCircle, Target, Zap, Clock } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ColorPaletteCreatorProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ColorPaletteCreator({ onSendMessage, isLoading, sessionId }: ColorPaletteCreatorProps) {
  const [brandName, setBrandName] = useState('');
  const [industry, setIndustry] = useState('');
  const [brandPersonality, setBrandPersonality] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState('');
  const [existingColors, setExistingColors] = useState('');
  const [colorHarmony, setColorHarmony] = useState('');
  const [paletteSize, setPaletteSize] = useState('');
  const [accessibilityLevel, setAccessibilityLevel] = useState('');
  const [usageContext, setUsageContext] = useState<string[]>([]);
  const [competitorAnalysis, setCompetitorAnalysis] = useState('');
  const [culturalConsiderations, setCulturalConsiderations] = useState('');

  const personalityOptions = [
    { id: 'trustworthy', label: 'Trustworthy', color: 'bg-blue-100 text-blue-800' },
    { id: 'innovative', label: 'Innovative', color: 'bg-purple-100 text-purple-800' },
    { id: 'energetic', label: 'Energetic', color: 'bg-orange-100 text-orange-800' },
    { id: 'sophisticated', label: 'Sophisticated', color: 'bg-gray-100 text-gray-800' },
    { id: 'friendly', label: 'Friendly', color: 'bg-green-100 text-green-800' },
    { id: 'luxurious', label: 'Luxurious', color: 'bg-amber-100 text-amber-800' },
    { id: 'minimalist', label: 'Minimalist', color: 'bg-slate-100 text-slate-800' },
    { id: 'playful', label: 'Playful', color: 'bg-pink-100 text-pink-800' },
    { id: 'professional', label: 'Professional', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'sustainable', label: 'Sustainable', color: 'bg-emerald-100 text-emerald-800' },
    { id: 'bold', label: 'Bold', color: 'bg-red-100 text-red-800' },
    { id: 'calming', label: 'Calming', color: 'bg-sky-100 text-sky-800' }
  ];

  const usageOptions = [
    { id: 'website', label: 'Website Design', icon: <Target className="w-4 h-4" /> },
    { id: 'mobile-app', label: 'Mobile App', icon: <Target className="w-4 h-4" /> },
    { id: 'print-materials', label: 'Print Materials', icon: <Target className="w-4 h-4" /> },
    { id: 'social-media', label: 'Social Media', icon: <Target className="w-4 h-4" /> },
    { id: 'packaging', label: 'Product Packaging', icon: <Target className="w-4 h-4" /> },
    { id: 'signage', label: 'Signage & Displays', icon: <Target className="w-4 h-4" /> },
    { id: 'merchandise', label: 'Merchandise', icon: <Target className="w-4 h-4" /> },
    { id: 'presentations', label: 'Presentations', icon: <Target className="w-4 h-4" /> }
  ];

  const handlePersonalityToggle = (personalityId: string) => {
    setBrandPersonality(prev => 
      prev.includes(personalityId) 
        ? prev.filter(id => id !== personalityId)
        : [...prev, personalityId]
    );
  };

  const handleUsageToggle = (usageId: string) => {
    setUsageContext(prev => 
      prev.includes(usageId) 
        ? prev.filter(id => id !== usageId)
        : [...prev, usageId]
    );
  };

  const handleCreatePalette = () => {
    const selectedPersonalities = personalityOptions
      .filter(personality => brandPersonality.includes(personality.id))
      .map(personality => personality.label);
    
    const selectedUsageContexts = usageOptions
      .filter(usage => usageContext.includes(usage.id))
      .map(usage => usage.label);

    const message = `Create a comprehensive color palette for this brand with professional analysis and guidelines:

**Brand Information:**
- Brand Name: ${brandName}
- Industry: ${industry}
- Brand Personality: ${selectedPersonalities.join(', ')}
- Target Audience: ${targetAudience}

**Color Requirements:**
- Existing Brand Colors: ${existingColors}
- Preferred Color Harmony: ${colorHarmony}
- Palette Size: ${paletteSize}
- Accessibility Level: ${accessibilityLevel}

**Usage Context:** ${selectedUsageContexts.join(', ')}

**Additional Considerations:**
- Competitor Analysis: ${competitorAnalysis}
- Cultural Considerations: ${culturalConsiderations}

Please provide:

1. **Primary Color Palette**
   - 5-8 main colors with exact hex codes
   - Color names and descriptions
   - RGB, HSL, and CMYK values
   - Color temperature and saturation analysis

2. **Color Harmony Analysis**
   - Harmony theory explanation (complementary, triadic, etc.)
   - Color relationships and balance
   - Visual weight distribution
   - Emotional impact of color combinations

3. **Accessibility Compliance**
   - WCAG contrast ratio analysis
   - Color blindness considerations
   - Alternative color combinations for accessibility
   - High contrast variations

4. **Extended Color System**
   - Primary, secondary, and accent colors
   - Neutral color palette (grays, whites, blacks)
   - Gradient and tint variations
   - Color hierarchy recommendations

5. **Usage Guidelines**
   - Primary brand color usage rules
   - Background and text color pairings
   - Do's and don'ts for color application
   - Platform-specific color adaptations

6. **Color Psychology & Brand Alignment**
   - Psychological impact of each color
   - Brand personality color matching
   - Audience perception analysis
   - Industry color trends and differentiation

7. **Technical Specifications**
   - Print color specifications (CMYK, Pantone)
   - Digital color specifications (RGB, hex)
   - Color management guidelines
   - File format recommendations

8. **Implementation Toolkit**
   - Color palette export formats
   - Design system integration
   - Brand guideline templates
   - Quality control checklists

Present the palette visually with color swatches, provide exact color codes, and include comprehensive usage guidelines for consistent brand application across all touchpoints.`;

    onSendMessage(message);
  };

  const isFormValid = brandName && industry && brandPersonality.length > 0 && colorHarmony && accessibilityLevel;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 via-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
          <Palette className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Color Palette Creator</h2>
          <p className="text-gray-600">Generate harmonious color palettes with accessibility checks and professional usage guidelines</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Brand Foundation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              Brand Foundation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="brandName">Brand Name *</Label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Enter your brand name"
              />
            </div>

            <div>
              <Label htmlFor="industry">Industry *</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technology">Technology</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="food-beverage">Food & Beverage</SelectItem>
                  <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                  <SelectItem value="real-estate">Real Estate</SelectItem>
                  <SelectItem value="automotive">Automotive</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="nonprofit">Non-profit</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Describe your target audience (age, demographics, preferences, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="existingColors">Existing Brand Colors</Label>
              <Input
                id="existingColors"
                value={existingColors}
                onChange={(e) => setExistingColors(e.target.value)}
                placeholder="e.g., #3B82F6, Blue, Logo colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Color Specifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-rose-600" />
              Color Specifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="colorHarmony">Color Harmony Type *</Label>
              <Select value={colorHarmony} onValueChange={setColorHarmony}>
                <SelectTrigger>
                  <SelectValue placeholder="Select color harmony" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="tetradic">Tetradic (Square)</SelectItem>
                  <SelectItem value="split-complementary">Split Complementary</SelectItem>
                  <SelectItem value="custom">Custom/Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="paletteSize">Palette Size</Label>
              <Select value={paletteSize} onValueChange={setPaletteSize}>
                <SelectTrigger>
                  <SelectValue placeholder="Select palette size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minimal">Minimal (3-4 colors)</SelectItem>
                  <SelectItem value="standard">Standard (5-6 colors)</SelectItem>
                  <SelectItem value="extended">Extended (7-8 colors)</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive (9+ colors)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="accessibilityLevel">Accessibility Level *</Label>
              <Select value={accessibilityLevel} onValueChange={setAccessibilityLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select accessibility standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wcag-aa">WCAG 2.1 AA (Standard)</SelectItem>
                  <SelectItem value="wcag-aaa">WCAG 2.1 AAA (Enhanced)</SelectItem>
                  <SelectItem value="basic">Basic Accessibility</SelectItem>
                  <SelectItem value="colorblind">Color Blindness Optimized</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="culturalConsiderations">Cultural Considerations</Label>
              <Textarea
                id="culturalConsiderations"
                value={culturalConsiderations}
                onChange={(e) => setCulturalConsiderations(e.target.value)}
                placeholder="Any cultural or regional color considerations?"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Brand Personality */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-rose-600" />
            Brand Personality *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {personalityOptions.map((personality) => (
              <div
                key={personality.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                  brandPersonality.includes(personality.id)
                    ? 'border-rose-500 bg-rose-50 scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
                onClick={() => handlePersonalityToggle(personality.id)}
              >
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={brandPersonality.includes(personality.id)}
                    onChange={() => handlePersonalityToggle(personality.id)}
                  />
                  <Badge variant="secondary" className={personality.color}>
                    {personality.label}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          {brandPersonality.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected Personality Traits:</p>
              <div className="flex flex-wrap gap-2">
                {brandPersonality.map((personalityId) => {
                  const personality = personalityOptions.find(p => p.id === personalityId);
                  return personality ? (
                    <Badge key={personalityId} variant="secondary" className={personality.color}>
                      {personality.label}
                    </Badge>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Context */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-rose-600" />
            Usage Context
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {usageOptions.map((usage) => (
              <div
                key={usage.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  usageContext.includes(usage.id)
                    ? 'border-rose-500 bg-rose-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleUsageToggle(usage.id)}
              >
                <Checkbox
                  checked={usageContext.includes(usage.id)}
                  onChange={() => handleUsageToggle(usage.id)}
                />
                <div className="flex items-center gap-2">
                  {usage.icon}
                  <span className="text-sm font-medium">{usage.label}</span>
                </div>
              </div>
            ))}
          </div>
          {usageContext.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {usageContext.map((usageId) => {
                const usage = usageOptions.find(u => u.id === usageId);
                return usage ? (
                  <Badge key={usageId} variant="outline" className="flex items-center gap-1">
                    {usage.icon}
                    {usage.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-rose-600" />
            Competitive Analysis (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={competitorAnalysis}
            onChange={(e) => setCompetitorAnalysis(e.target.value)}
            placeholder="List competitor brands and their colors, or describe color trends in your industry that you want to differentiate from..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleCreatePalette}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500 hover:from-rose-600 hover:via-purple-600 hover:to-indigo-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Color Palette...
            </>
          ) : (
            <>
              <Palette className="w-4 h-4 mr-2" />
              Generate Color Palette
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Color Palette & Guidelines</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}