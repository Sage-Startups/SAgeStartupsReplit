import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, ArrowRight, Download, FileText, Copy, CheckCircle } from "lucide-react";

interface BrandVoiceBotProps {
  sessionId: number;
  botName: string;
}

interface VoiceProfile {
  tone: string;
  personality: string[];
  writingStyle: string;
  vocabulary: string;
  sentenceStructure: string;
  formality: string;
  emotionalTone: string;
  examples: {
    email: string;
    social: string;
    website: string;
    announcement: string;
  };
  guidelines: string[];
  doList: string[];
  dontList: string[];
}

export function BrandVoiceBot({ sessionId, botName }: BrandVoiceBotProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [voiceProfile, setVoiceProfile] = useState<VoiceProfile | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const [answers, setAnswers] = useState({
    brandName: '',
    industry: '',
    targetAudience: '',
    brandValues: '',
    brandPersonality: '',
    communicationGoals: '',
    competitorStyle: '',
    tonePreference: 'professional',
    formalityLevel: 'balanced',
    emotionalConnection: 'moderate',
    uniqueTraits: ''
  });

  const questions = [
    {
      id: 'basic',
      title: 'Basic Brand Information',
      fields: [
        { key: 'brandName', label: 'What is your brand name?', type: 'input', placeholder: 'Enter your brand name' },
        { key: 'industry', label: 'What industry are you in?', type: 'input', placeholder: 'e.g., Technology, Fashion, Healthcare' },
        { key: 'targetAudience', label: 'Who is your target audience?', type: 'textarea', placeholder: 'Describe your ideal customers (age, interests, values)' }
      ]
    },
    {
      id: 'values',
      title: 'Brand Values & Personality',
      fields: [
        { key: 'brandValues', label: 'What are your core brand values?', type: 'textarea', placeholder: 'e.g., Innovation, Sustainability, Trust, Excellence' },
        { key: 'brandPersonality', label: 'If your brand was a person, how would you describe them?', type: 'textarea', placeholder: 'e.g., Friendly expert, Bold innovator, Trusted advisor' },
        { key: 'communicationGoals', label: 'What do you want people to feel when they interact with your brand?', type: 'textarea', placeholder: 'e.g., Confident, Inspired, Supported, Excited' }
      ]
    },
    {
      id: 'style',
      title: 'Communication Style Preferences',
      fields: [
        { 
          key: 'tonePreference', 
          label: 'What tone best represents your brand?', 
          type: 'radio',
          options: [
            { value: 'professional', label: 'Professional & Authoritative' },
            { value: 'friendly', label: 'Friendly & Approachable' },
            { value: 'playful', label: 'Playful & Humorous' },
            { value: 'inspirational', label: 'Inspirational & Motivating' }
          ]
        },
        {
          key: 'formalityLevel',
          label: 'How formal should your communication be?',
          type: 'radio',
          options: [
            { value: 'very-formal', label: 'Very Formal (Sir/Madam, corporate language)' },
            { value: 'formal', label: 'Formal (Professional but accessible)' },
            { value: 'balanced', label: 'Balanced (Mix of professional and casual)' },
            { value: 'casual', label: 'Casual (Conversational and relaxed)' }
          ]
        }
      ]
    },
    {
      id: 'differentiation',
      title: 'Differentiation & Unique Traits',
      fields: [
        { key: 'competitorStyle', label: 'How do your competitors communicate? How do you want to be different?', type: 'textarea', placeholder: 'Describe competitor communication styles and how you want to stand out' },
        { key: 'uniqueTraits', label: 'What unique phrases, words, or communication quirks should your brand have?', type: 'textarea', placeholder: 'e.g., Always use "team" instead of "staff", End emails with "Onwards!"' }
      ]
    }
  ];

  const generateVoiceProfileMutation = useMutation({
    mutationFn: async () => {
      // Update session title
      await apiRequest('PUT', `/api/sessions/${sessionId}`, { 
        sessionTitle: `Brand Voice: ${answers.brandName}`
      });

      const prompt = `As a brand voice expert, create a comprehensive brand voice guide for:
        Brand Name: ${answers.brandName}
        Industry: ${answers.industry}
        Target Audience: ${answers.targetAudience}
        Brand Values: ${answers.brandValues}
        Brand Personality: ${answers.brandPersonality}
        Communication Goals: ${answers.communicationGoals}
        Tone Preference: ${answers.tonePreference}
        Formality Level: ${answers.formalityLevel}
        Competitor Differentiation: ${answers.competitorStyle}
        Unique Traits: ${answers.uniqueTraits}
        
        Create a detailed brand voice profile with specific writing guidelines, examples, and dos/don'ts.`;

      const response = await apiRequest('POST', `/api/sessions/${sessionId}/messages`, {
        content: prompt,
        role: 'user'
      });

      return response.json();
    },
    onSuccess: (data) => {
      // Generate comprehensive voice profile based on AI response
      const profile: VoiceProfile = {
        tone: getToneDescription(answers.tonePreference),
        personality: getPersonalityTraits(answers.brandPersonality),
        writingStyle: getWritingStyle(answers.formalityLevel, answers.tonePreference),
        vocabulary: getVocabularyLevel(answers.formalityLevel, answers.industry),
        sentenceStructure: getSentenceStructure(answers.formalityLevel),
        formality: answers.formalityLevel,
        emotionalTone: answers.communicationGoals,
        examples: {
          email: generateEmailExample(answers),
          social: generateSocialExample(answers),
          website: generateWebsiteExample(answers),
          announcement: generateAnnouncementExample(answers)
        },
        guidelines: generateGuidelines(answers),
        doList: generateDoList(answers),
        dontList: generateDontList(answers)
      };
      
      setVoiceProfile(profile);
      
      toast({
        title: "Brand Voice Profile Created! 🎯",
        description: "Your unique brand voice guide is ready",
      });
    }
  });

  const getToneDescription = (tone: string): string => {
    const toneMap: { [key: string]: string } = {
      'professional': 'Professional, authoritative, and knowledgeable',
      'friendly': 'Warm, approachable, and conversational',
      'playful': 'Fun, energetic, and lighthearted',
      'inspirational': 'Motivating, uplifting, and empowering'
    };
    return toneMap[tone] || 'Balanced and adaptable';
  };

  const getPersonalityTraits = (personality: string): string[] => {
    const traits = personality.toLowerCase();
    const extractedTraits = [];
    
    if (traits.includes('friend')) extractedTraits.push('Friendly');
    if (traits.includes('expert')) extractedTraits.push('Knowledgeable');
    if (traits.includes('innovat')) extractedTraits.push('Innovative');
    if (traits.includes('trust')) extractedTraits.push('Trustworthy');
    if (traits.includes('bold')) extractedTraits.push('Bold');
    if (traits.includes('help')) extractedTraits.push('Helpful');
    
    return extractedTraits.length > 0 ? extractedTraits : ['Professional', 'Reliable', 'Approachable'];
  };

  const getWritingStyle = (formality: string, tone: string): string => {
    if (formality === 'very-formal') return 'Formal, structured, and traditional';
    if (formality === 'casual' && tone === 'playful') return 'Conversational with humor and personality';
    if (tone === 'inspirational') return 'Storytelling with emotional appeal';
    return 'Clear, concise, and engaging';
  };

  const getVocabularyLevel = (formality: string, industry: string): string => {
    if (formality === 'very-formal') return 'Industry-specific terminology, sophisticated vocabulary';
    if (formality === 'casual') return 'Simple, everyday language, avoid jargon';
    return `Balanced mix of ${industry} terms and accessible language`;
  };

  const getSentenceStructure = (formality: string): string => {
    if (formality === 'very-formal') return 'Complex sentences, formal transitions';
    if (formality === 'casual') return 'Short, punchy sentences. Conversational flow.';
    return 'Varied sentence length for rhythm and readability';
  };

  const generateEmailExample = (answers: any): string => {
    if (answers.tonePreference === 'friendly' && answers.formalityLevel === 'casual') {
      return `Hey ${answers.targetAudience.split(' ')[0] || 'there'}! 👋\n\nExciting news - we've been working on something special just for you.\n\nCan't wait to share more details soon!\n\nCheers,\n${answers.brandName} Team`;
    }
    return `Dear Valued ${answers.industry} Partner,\n\nWe are pleased to announce an important update regarding our services.\n\nWe look forward to continuing our partnership.\n\nBest regards,\n${answers.brandName}`;
  };

  const generateSocialExample = (answers: any): string => {
    if (answers.tonePreference === 'playful') {
      return `🚀 Big things coming! Who's ready to ${answers.communicationGoals.toLowerCase()}? Drop a 💙 if you're with us! #${answers.brandName}`;
    }
    return `Introducing our latest ${answers.industry} innovation. Discover how ${answers.brandName} is transforming the way you ${answers.communicationGoals.toLowerCase()}.`;
  };

  const generateWebsiteExample = (answers: any): string => {
    return `Welcome to ${answers.brandName} - Where ${answers.brandValues} Meet ${answers.industry} Excellence.\n\nWe help ${answers.targetAudience} achieve ${answers.communicationGoals.toLowerCase()} through innovative solutions.`;
  };

  const generateAnnouncementExample = (answers: any): string => {
    return `${answers.brandName} is thrilled to announce our latest milestone in ${answers.industry}. This achievement reflects our commitment to ${answers.brandValues.toLowerCase()}.`;
  };

  const generateGuidelines = (answers: any): string[] => {
    const guidelines = [
      `Always maintain a ${answers.tonePreference} tone`,
      `Use ${answers.formalityLevel.replace('-', ' ')} language`,
      `Focus on making ${answers.targetAudience} feel ${answers.communicationGoals}`,
      `Incorporate brand values: ${answers.brandValues}`,
      `Reflect brand personality: ${answers.brandPersonality}`
    ];
    
    if (answers.uniqueTraits) {
      guidelines.push(`Include unique brand elements: ${answers.uniqueTraits}`);
    }
    
    return guidelines;
  };

  const generateDoList = (answers: any): string[] => {
    return [
      `Use active voice to convey ${answers.brandPersonality}`,
      `Address ${answers.targetAudience} directly`,
      `Include ${answers.industry}-specific examples`,
      `End with clear calls-to-action`,
      `Use inclusive language`
    ];
  };

  const generateDontList = (answers: any): string[] => {
    const donts = ['Use generic corporate speak', 'Overcomplicate messages'];
    
    if (answers.formalityLevel === 'casual') {
      donts.push('Use overly formal language');
    }
    if (answers.tonePreference === 'professional') {
      donts.push('Use slang or colloquialisms');
    }
    if (answers.competitorStyle) {
      donts.push(`Copy competitor communication style`);
    }
    
    return donts;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadVoiceGuide = () => {
    if (!voiceProfile) return;
    
    const content = `
${answers.brandName} BRAND VOICE GUIDE

TONE: ${voiceProfile.tone}
PERSONALITY: ${voiceProfile.personality.join(', ')}
WRITING STYLE: ${voiceProfile.writingStyle}
VOCABULARY: ${voiceProfile.vocabulary}
SENTENCE STRUCTURE: ${voiceProfile.sentenceStructure}

COMMUNICATION EXAMPLES:

Email:
${voiceProfile.examples.email}

Social Media:
${voiceProfile.examples.social}

Website Copy:
${voiceProfile.examples.website}

Announcement:
${voiceProfile.examples.announcement}

GUIDELINES:
${voiceProfile.guidelines.map(g => `• ${g}`).join('\n')}

DO:
${voiceProfile.doList.map(d => `✓ ${d}`).join('\n')}

DON'T:
${voiceProfile.dontList.map(d => `✗ ${d}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${answers.brandName}-brand-voice-guide.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentQuestionSet = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MessageSquare className="w-8 h-8" />
            {botName}
          </CardTitle>
          <CardDescription className="text-blue-100">
            I'll help you define your unique brand voice and communication style
          </CardDescription>
        </CardHeader>
      </Card>

      {!voiceProfile ? (
        <>
          {/* Progress */}
          <div className="flex items-center justify-between mb-6">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  index <= currentQuestion ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle>{currentQuestionSet.title}</CardTitle>
              <CardDescription>
                Question {currentQuestion + 1} of {questions.length}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentQuestionSet.fields.map((field) => (
                <div key={field.key}>
                  <Label className="text-base mb-2 block">{field.label}</Label>
                  {field.type === 'input' && (
                    <Input
                      value={answers[field.key as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                    />
                  )}
                  {field.type === 'textarea' && (
                    <Textarea
                      value={answers[field.key as keyof typeof answers]}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      rows={3}
                    />
                  )}
                  {field.type === 'radio' && field.options && (
                    <RadioGroup
                      value={answers[field.key as keyof typeof answers]}
                      onValueChange={(value) => setAnswers(prev => ({ ...prev, [field.key]: value }))}
                    >
                      <div className="space-y-2">
                        {field.options.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <Label htmlFor={option.value} className="font-normal">
                              {option.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  )}
                </div>
              ))}

              <div className="flex gap-3">
                {currentQuestion > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestion(prev => prev - 1)}
                  >
                    Back
                  </Button>
                )}
                {!isLastQuestion ? (
                  <Button
                    onClick={() => setCurrentQuestion(prev => prev + 1)}
                    className="flex-1"
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => generateVoiceProfileMutation.mutate()}
                    disabled={generateVoiceProfileMutation.isPending}
                    className="flex-1"
                  >
                    Generate Voice Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Voice Profile Results */
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Brand Voice Profile</CardTitle>
              <CardDescription>
                A comprehensive guide to {answers.brandName}'s communication style
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Voice Characteristics */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Voice Characteristics</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Tone:</span>
                      <p className="font-medium">{voiceProfile.tone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Personality:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {voiceProfile.personality.map((trait) => (
                          <Badge key={trait} variant="secondary">{trait}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Writing Style</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Style:</span>
                      <p className="font-medium">{voiceProfile.writingStyle}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Vocabulary:</span>
                      <p className="font-medium">{voiceProfile.vocabulary}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Communication Examples */}
              <div>
                <h4 className="font-medium mb-4">Communication Examples</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(voiceProfile.examples).map(([type, example]) => (
                    <Card key={type} className="relative">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm capitalize">{type}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 whitespace-pre-line">{example}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(example, type)}
                        >
                          {copied === type ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Guidelines */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-green-700">Do's ✓</h4>
                  <ul className="space-y-1">
                    {voiceProfile.doList.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-red-700">Don'ts ✗</h4>
                  <ul className="space-y-1">
                    {voiceProfile.dontList.map((item, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <span className="text-red-600 mt-0.5 flex-shrink-0">✗</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Key Guidelines */}
              <Card className="bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-lg">Key Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {voiceProfile.guidelines.map((guideline, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span className="text-sm">{guideline}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button onClick={downloadVoiceGuide} className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Voice Guide
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}