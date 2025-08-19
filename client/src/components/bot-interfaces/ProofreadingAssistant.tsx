import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Target, Zap, Eye, Clock, FileText } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface ProofreadingAssistantProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function ProofreadingAssistant({ onSendMessage, isLoading, sessionId }: ProofreadingAssistantProps) {
  const [contentToProofread, setContentToProofread] = useState('');
  const [contentType, setContentType] = useState('');
  const [writingStyle, setWritingStyle] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [proofreadingFocus, setProofreadingFocus] = useState<string[]>([]);
  const [brandVoice, setBrandVoice] = useState('');
  const [specificConcerns, setSpecificConcerns] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [industryContext, setIndustryContext] = useState('');

  const focusOptions = [
    { id: 'grammar', label: 'Grammar & Punctuation', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'spelling', label: 'Spelling Errors', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'clarity', label: 'Clarity & Flow', icon: <Eye className="w-4 h-4" /> },
    { id: 'style', label: 'Writing Style', icon: <Target className="w-4 h-4" /> },
    { id: 'tone', label: 'Tone Consistency', icon: <Target className="w-4 h-4" /> },
    { id: 'structure', label: 'Structure & Organization', icon: <FileText className="w-4 h-4" /> },
    { id: 'readability', label: 'Readability & Engagement', icon: <Eye className="w-4 h-4" /> },
    { id: 'word-choice', label: 'Word Choice & Vocabulary', icon: <Target className="w-4 h-4" /> },
    { id: 'conciseness', label: 'Conciseness & Brevity', icon: <Zap className="w-4 h-4" /> },
    { id: 'consistency', label: 'Terminology Consistency', icon: <CheckCircle className="w-4 h-4" /> },
    { id: 'formatting', label: 'Formatting & Style', icon: <FileText className="w-4 h-4" /> },
    { id: 'fact-checking', label: 'Fact Checking', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const handleFocusToggle = (focusId: string) => {
    setProofreadingFocus(prev => 
      prev.includes(focusId) 
        ? prev.filter(id => id !== focusId)
        : [...prev, focusId]
    );
  };

  const handleProofreadContent = () => {
    const selectedFocusLabels = focusOptions
      .filter(focus => proofreadingFocus.includes(focus.id))
      .map(focus => focus.label);

    const message = `Please provide comprehensive proofreading and improvement suggestions for this content:

**Content Information:**
- Title: ${contentTitle}
- Content Type: ${contentType}
- Target Audience: ${targetAudience}
- Industry Context: ${industryContext}

**Writing Specifications:**
- Desired Writing Style: ${writingStyle}
- Brand Voice: ${brandVoice}
- Urgency Level: ${urgencyLevel}

**Proofreading Focus Areas:** ${selectedFocusLabels.join(', ')}

**Specific Concerns:** ${specificConcerns}

**CONTENT TO PROOFREAD:**
${contentToProofread}

Please provide:

1. **Grammar & Language Analysis**
   - Grammar errors with corrections
   - Punctuation improvements
   - Spelling mistakes and fixes
   - Sentence structure enhancements

2. **Style & Clarity Improvements**
   - Clarity and flow enhancements
   - Word choice optimization
   - Tone and voice consistency
   - Redundancy elimination

3. **Structure & Organization**
   - Content structure analysis
   - Logical flow improvements
   - Paragraph organization
   - Transition enhancements

4. **Readability Enhancement**
   - Readability score assessment
   - Sentence length optimization
   - Complex phrase simplification
   - Engagement improvements

5. **Brand Voice Alignment**
   - Brand voice consistency check
   - Tone adjustments
   - Messaging alignment
   - Style guide compliance

6. **Content Quality Score**
   - Overall quality rating (1-10)
   - Strengths identification
   - Improvement priority ranking
   - Performance prediction

7. **Detailed Corrections**
   - Line-by-line corrections
   - Before/after comparisons
   - Explanation for each change
   - Alternative suggestions

8. **Final Polished Version**
   - Complete corrected version
   - Highlighted improvements
   - Summary of changes made
   - Quality assurance checklist

Provide specific corrections with explanations, alternative phrasings, and a final polished version ready for publication.`;

    onSendMessage(message);
  };

  const isFormValid = contentToProofread && contentType && proofreadingFocus.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Proofreading Assistant</h2>
          <p className="text-gray-600">Professional grammar checking, style improvement, and clarity enhancement for perfect content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Content Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contentTitle">Content Title</Label>
              <Input
                id="contentTitle"
                value={contentTitle}
                onChange={(e) => setContentTitle(e.target.value)}
                placeholder="Enter the title of your content"
              />
            </div>

            <div>
              <Label htmlFor="contentType">Content Type *</Label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blog-post">Blog Post</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social-media">Social Media Post</SelectItem>
                  <SelectItem value="press-release">Press Release</SelectItem>
                  <SelectItem value="whitepaper">Whitepaper</SelectItem>
                  <SelectItem value="case-study">Case Study</SelectItem>
                  <SelectItem value="newsletter">Newsletter</SelectItem>
                  <SelectItem value="website-copy">Website Copy</SelectItem>
                  <SelectItem value="proposal">Business Proposal</SelectItem>
                  <SelectItem value="report">Report</SelectItem>
                  <SelectItem value="script">Script/Speech</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="writingStyle">Writing Style</Label>
              <Select value={writingStyle} onValueChange={setWritingStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select writing style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional/Business</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="conversational">Conversational</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="journalistic">Journalistic</SelectItem>
                  <SelectItem value="marketing">Marketing/Sales</SelectItem>
                  <SelectItem value="informal">Informal/Casual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="urgencyLevel">Urgency Level</Label>
              <Select value={urgencyLevel} onValueChange={setUrgencyLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                  <SelectItem value="high">High Priority</SelectItem>
                  <SelectItem value="medium">Medium Priority</SelectItem>
                  <SelectItem value="low">Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="industryContext">Industry/Field</Label>
              <Input
                id="industryContext"
                value={industryContext}
                onChange={(e) => setIndustryContext(e.target.value)}
                placeholder="e.g., Technology, Healthcare, Finance"
              />
            </div>
          </CardContent>
        </Card>

        {/* Context & Style */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-red-600" />
              Context & Style
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Textarea
                id="targetAudience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Who will read this content? (executives, customers, students, etc.)"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="brandVoice">Brand Voice & Guidelines</Label>
              <Textarea
                id="brandVoice"
                value={brandVoice}
                onChange={(e) => setBrandVoice(e.target.value)}
                placeholder="How should the content sound? Any specific style guidelines?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="specificConcerns">Specific Concerns</Label>
              <Textarea
                id="specificConcerns"
                value={specificConcerns}
                onChange={(e) => setSpecificConcerns(e.target.value)}
                placeholder="Any particular areas you're concerned about or want focus on?"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content to Proofread */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-600" />
            Content to Proofread *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={contentToProofread}
            onChange={(e) => setContentToProofread(e.target.value)}
            placeholder="Paste the content you want proofread and improved here..."
            rows={15}
            className="min-h-[400px]"
          />
          <div className="mt-2 flex justify-between text-sm text-gray-500">
            <span>Word count: {contentToProofread.split(/\s+/).filter(word => word.length > 0).length} words</span>
            <span>Character count: {contentToProofread.length} characters</span>
          </div>
        </CardContent>
      </Card>

      {/* Proofreading Focus */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            Proofreading Focus *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {focusOptions.map((focus) => (
              <div
                key={focus.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  proofreadingFocus.includes(focus.id)
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleFocusToggle(focus.id)}
              >
                <Checkbox
                  checked={proofreadingFocus.includes(focus.id)}
                  onChange={() => handleFocusToggle(focus.id)}
                />
                <div className="flex items-center gap-2">
                  {focus.icon}
                  <span className="text-sm font-medium">{focus.label}</span>
                </div>
              </div>
            ))}
          </div>
          {proofreadingFocus.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {proofreadingFocus.map((focusId) => {
                const focus = focusOptions.find(f => f.id === focusId);
                return focus ? (
                  <Badge key={focusId} variant="secondary" className="flex items-center gap-1">
                    {focus.icon}
                    {focus.label}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleProofreadContent}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Proofreading Content...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Proofread & Improve
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Proofreading Results & Improvements</h3>
          <BotChatInterface sessionId={sessionId} botType="proofreading" />
        </div>
      )}
    </div>
  );
}