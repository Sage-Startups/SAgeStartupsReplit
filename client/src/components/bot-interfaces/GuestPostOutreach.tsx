import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Users, Target, Mail, Handshake, Clock, Send } from "lucide-react";
import { BotChatInterface } from "./BotChatInterface";

interface GuestPostOutreachProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  sessionId?: number;
}

export function GuestPostOutreach({ onSendMessage, isLoading, sessionId }: GuestPostOutreachProps) {
  const [yourWebsite, setYourWebsite] = useState('');
  const [yourNiche, setYourNiche] = useState('');
  const [yourExpertise, setYourExpertise] = useState('');
  const [contentTopics, setContentTopics] = useState('');
  const [outreachGoals, setOutreachGoals] = useState<string[]>([]);
  const [targetSites, setTargetSites] = useState('');
  const [yourCredentials, setYourCredentials] = useState('');
  const [previousWork, setPreviousWork] = useState('');
  const [outreachStrategy, setOutreachStrategy] = useState('');
  const [timeCommitment, setTimeCommitment] = useState('');
  const [contentStyle, setContentStyle] = useState('');

  const goalOptions = [
    { id: 'backlinks', label: 'Quality Backlinks', icon: <Target className="w-4 h-4" /> },
    { id: 'brand-exposure', label: 'Brand Exposure', icon: <Users className="w-4 h-4" /> },
    { id: 'authority-building', label: 'Authority Building', icon: <Target className="w-4 h-4" /> },
    { id: 'traffic-generation', label: 'Traffic Generation', icon: <Target className="w-4 h-4" /> },
    { id: 'lead-generation', label: 'Lead Generation', icon: <Target className="w-4 h-4" /> },
    { id: 'network-building', label: 'Network Building', icon: <Handshake className="w-4 h-4" /> },
    { id: 'thought-leadership', label: 'Thought Leadership', icon: <Users className="w-4 h-4" /> },
    { id: 'content-distribution', label: 'Content Distribution', icon: <Target className="w-4 h-4" /> }
  ];

  const handleGoalToggle = (goalId: string) => {
    setOutreachGoals(prev => 
      prev.includes(goalId) 
        ? prev.filter(id => id !== goalId)
        : [...prev, goalId]
    );
  };

  const handleGenerateOutreach = () => {
    const selectedGoalLabels = goalOptions
      .filter(goal => outreachGoals.includes(goal.id))
      .map(goal => goal.label);

    const message = `Create a comprehensive guest post outreach strategy and campaign:

**Your Profile & Expertise:**
- Website/Brand: ${yourWebsite}
- Industry/Niche: ${yourNiche}
- Area of Expertise: ${yourExpertise}
- Credentials & Background: ${yourCredentials}

**Content Strategy:**
- Proposed Topics: ${contentTopics}
- Content Style: ${contentStyle}
- Previous Work Examples: ${previousWork}

**Outreach Objectives:**
- Primary Goals: ${selectedGoalLabels.join(', ')}
- Target Websites: ${targetSites}
- Preferred Strategy: ${outreachStrategy}
- Time Commitment: ${timeCommitment}

Please provide:

1. **Comprehensive Outreach Strategy**
   - Target website identification process
   - Site evaluation criteria and metrics
   - Outreach prioritization framework
   - Success rate optimization tactics

2. **Partnership Development Plan**
   - Relationship building timeline
   - Value proposition development
   - Long-term partnership strategies
   - Mutual benefit frameworks

3. **Email Outreach Templates (5-8 variations)**
   - Initial outreach emails
   - Follow-up sequences
   - Pitch emails with topic ideas
   - Relationship building messages
   - Post-publication thank you emails

4. **Content Collaboration Framework**
   - Content ideation process
   - Collaborative writing approaches
   - Content quality standards
   - Revision and feedback protocols
   - Publishing timeline management

5. **Target Website Research**
   - Site discovery methods and tools
   - Quality assessment criteria
   - Contact information finding
   - Editorial guidelines research
   - Competition analysis

6. **Pitch Development System**
   - Topic ideation and validation
   - Compelling pitch creation
   - Value proposition articulation
   - Content outline development
   - Visual pitch presentations

7. **Relationship Management**
   - CRM system recommendations
   - Follow-up scheduling
   - Relationship nurturing strategies
   - Network expansion tactics
   - Community building approaches

8. **Performance Tracking & Optimization**
   - Outreach metrics to monitor
   - Response rate optimization
   - Campaign performance analysis
   - ROI measurement methods
   - Strategy refinement process

Provide ready-to-use email templates, actionable outreach strategies, and systematic approaches for building lasting editorial relationships.`;

    onSendMessage(message);
  };

  const isFormValid = yourWebsite && yourNiche && yourExpertise && contentTopics && outreachGoals.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guest Post Outreach</h2>
          <p className="text-gray-600">Develop outreach strategies, build partnerships, and create effective collaboration frameworks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Your Profile & Expertise
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="yourWebsite">Your Website/Brand *</Label>
              <Input
                id="yourWebsite"
                value={yourWebsite}
                onChange={(e) => setYourWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
            </div>

            <div>
              <Label htmlFor="yourNiche">Industry/Niche *</Label>
              <Input
                id="yourNiche"
                value={yourNiche}
                onChange={(e) => setYourNiche(e.target.value)}
                placeholder="e.g., Digital Marketing, SaaS, Health Tech"
              />
            </div>

            <div>
              <Label htmlFor="yourExpertise">Area of Expertise *</Label>
              <Textarea
                id="yourExpertise"
                value={yourExpertise}
                onChange={(e) => setYourExpertise(e.target.value)}
                placeholder="What specific expertise do you offer? What makes you qualified to write guest posts?"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="yourCredentials">Credentials & Background</Label>
              <Textarea
                id="yourCredentials"
                value={yourCredentials}
                onChange={(e) => setYourCredentials(e.target.value)}
                placeholder="Your background, achievements, certifications, notable work, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="previousWork">Previous Work Examples</Label>
              <Textarea
                id="previousWork"
                value={previousWork}
                onChange={(e) => setPreviousWork(e.target.value)}
                placeholder="Links to published articles, guest posts, or portfolio pieces"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Strategy & Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Strategy & Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="targetSites">Target Websites/Publications</Label>
              <Textarea
                id="targetSites"
                value={targetSites}
                onChange={(e) => setTargetSites(e.target.value)}
                placeholder="List specific websites you want to target, or describe the type of sites you're looking for"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="outreachStrategy">Preferred Outreach Strategy</Label>
              <Select value={outreachStrategy} onValueChange={setOutreachStrategy}>
                <SelectTrigger>
                  <SelectValue placeholder="Select outreach approach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold-outreach">Cold Email Outreach</SelectItem>
                  <SelectItem value="warm-introductions">Warm Introductions</SelectItem>
                  <SelectItem value="social-media">Social Media Connection</SelectItem>
                  <SelectItem value="content-collaboration">Content Collaboration</SelectItem>
                  <SelectItem value="community-building">Community Building</SelectItem>
                  <SelectItem value="mixed-approach">Mixed Approach</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeCommitment">Time Commitment</Label>
              <Select value={timeCommitment} onValueChange={setTimeCommitment}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time commitment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-2-hours">1-2 hours per week</SelectItem>
                  <SelectItem value="3-5-hours">3-5 hours per week</SelectItem>
                  <SelectItem value="5-10-hours">5-10 hours per week</SelectItem>
                  <SelectItem value="10-plus-hours">10+ hours per week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contentStyle">Content Style</Label>
              <Select value={contentStyle} onValueChange={setContentStyle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="educational">Educational/How-to</SelectItem>
                  <SelectItem value="thought-leadership">Thought Leadership</SelectItem>
                  <SelectItem value="case-studies">Case Studies</SelectItem>
                  <SelectItem value="industry-insights">Industry Insights</SelectItem>
                  <SelectItem value="personal-stories">Personal Stories</SelectItem>
                  <SelectItem value="data-driven">Data-Driven</SelectItem>
                  <SelectItem value="opinion-pieces">Opinion Pieces</SelectItem>
                  <SelectItem value="mixed">Mixed Styles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600" />
            Content Topics & Ideas *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={contentTopics}
            onChange={(e) => setContentTopics(e.target.value)}
            placeholder="What topics can you write about? List specific article ideas, subjects you're passionate about, or areas where you can provide unique insights..."
            rows={6}
          />
        </CardContent>
      </Card>

      {/* Outreach Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-indigo-600" />
            Outreach Goals *
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {goalOptions.map((goal) => (
              <div
                key={goal.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  outreachGoals.includes(goal.id)
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleGoalToggle(goal.id)}
              >
                <Checkbox
                  checked={outreachGoals.includes(goal.id)}
                  onChange={() => handleGoalToggle(goal.id)}
                />
                <div className="flex items-center gap-2">
                  {goal.icon}
                  <span className="text-sm font-medium">{goal.label}</span>
                </div>
              </div>
            ))}
          </div>
          {outreachGoals.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {outreachGoals.map((goalId) => {
                const goal = goalOptions.find(g => g.id === goalId);
                return goal ? (
                  <Badge key={goalId} variant="secondary" className="flex items-center gap-1">
                    {goal.icon}
                    {goal.label}
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
          onClick={handleGenerateOutreach}
          disabled={!isFormValid || isLoading}
          size="lg"
          className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
        >
          {isLoading ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Creating Outreach Strategy...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Generate Outreach Strategy
            </>
          )}
        </Button>
      </div>

      {/* Chat Interface */}
      {sessionId && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Outreach Strategy & Templates</h3>
          <BotChatInterface sessionId={sessionId} />
        </div>
      )}
    </div>
  );
}