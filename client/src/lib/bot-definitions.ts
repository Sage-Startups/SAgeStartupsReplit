export interface BotDefinition {
  id: string;
  name: string;
  description: string;
  section: string;
  icon: string;
  color: string;
  features: string[];
}

export const sections = [
  {
    id: 'marketing',
    name: 'Marketing',
    description: '20+ AI bots for campaign strategy, content planning, SEO optimization, performance analytics, and blog content creation.',
    icon: 'bullhorn',
    color: 'bg-blue-50 border-blue-200 text-primary',
    iconColor: 'text-primary'
  },
  {
    id: 'branding',
    name: 'Branding',
    description: '10 AI bots for logo design, brand guidelines, color schemes, and visual identity creation.',
    icon: 'palette',
    color: 'bg-purple-50 border-purple-200',
    iconColor: 'text-secondary'
  },
  {
    id: 'advertising',
    name: 'Advertising',
    description: '10 AI bots for ad copy, creative concepts, targeting strategies, and budget optimization.',
    icon: 'ad',
    color: 'bg-green-50 border-green-200',
    iconColor: 'text-success'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: '10 AI bots for data analysis, reporting, insights generation, and performance tracking.',
    icon: 'chart-line',
    color: 'bg-cyan-50 border-cyan-200',
    iconColor: 'text-accent'
  }
];

export const bots: BotDefinition[] = [
  // Marketing Bots
  {
    id: 'campaign-strategy',
    name: 'Campaign Strategy Bot',
    description: 'End-to-end campaign planning',
    section: 'marketing',
    icon: 'chess',
    color: 'text-primary',
    features: ['Campaign planning', 'Timeline creation', 'Channel strategy', 'Budget allocation']
  },
  {
    id: 'seo-content',
    name: 'SEO Content Generator',
    description: 'Search-optimized content',
    section: 'marketing',
    icon: 'search',
    color: 'text-primary',
    features: ['Keyword research', 'Content optimization', 'Meta descriptions', 'SEO scoring']
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing Assistant',
    description: 'Automated email campaigns',
    section: 'marketing',
    icon: 'envelope',
    color: 'text-primary',
    features: ['Email sequences', 'Subject lines', 'Personalization', 'A/B testing']
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar Planner',
    description: 'Strategic content scheduling',
    section: 'marketing',
    icon: 'calendar',
    color: 'text-primary',
    features: ['Content planning', 'Scheduling', 'Platform optimization', 'Theme planning']
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis Bot',
    description: 'Market intelligence',
    section: 'marketing',
    icon: 'eye',
    color: 'text-primary',
    features: ['Competitor research', 'SWOT analysis', 'Market positioning', 'Gap analysis']
  },
  {
    id: 'influencer-outreach',
    name: 'Influencer Outreach',
    description: 'Partnership strategies',
    section: 'marketing',
    icon: 'star',
    color: 'text-primary',
    features: ['Influencer identification', 'Outreach templates', 'Partnership terms', 'Campaign tracking']
  },
  {
    id: 'product-launch',
    name: 'Product Launch Planner',
    description: 'Launch strategy & timeline',
    section: 'marketing',
    icon: 'rocket',
    color: 'text-primary',
    features: ['Launch timeline', 'Media strategy', 'PR planning', 'Success metrics']
  },
  {
    id: 'customer-journey',
    name: 'Customer Journey Mapper',
    description: 'Experience optimization',
    section: 'marketing',
    icon: 'route',
    color: 'text-primary',
    features: ['Journey mapping', 'Touchpoint analysis', 'Pain point identification', 'Experience design']
  },
  {
    id: 'conversion-optimizer',
    name: 'Conversion Rate Optimizer',
    description: 'Performance improvement',
    section: 'marketing',
    icon: 'chart-up',
    color: 'text-primary',
    features: ['Funnel analysis', 'Optimization recommendations', 'A/B test planning', 'Performance tracking']
  },
  {
    id: 'budget-planner',
    name: 'Marketing Budget Planner',
    description: 'ROI-focused allocation',
    section: 'marketing',
    icon: 'calculator',
    color: 'text-primary',
    features: ['Budget allocation', 'ROI calculation', 'Spend tracking', 'Performance analysis']
  },

  // Branding Bots
  {
    id: 'logo-design',
    name: 'Logo Design Assistant',
    description: 'AI-powered logo creation',
    section: 'branding',
    icon: 'brush',
    color: 'text-secondary',
    features: ['Logo concepts', 'Style variations', 'Color schemes', 'Usage guidelines']
  },
  {
    id: 'brand-voice',
    name: 'Brand Voice Generator',
    description: 'Tone & personality definition',
    section: 'branding',
    icon: 'bullhorn',
    color: 'text-secondary',
    features: ['Voice definition', 'Tone guidelines', 'Messaging framework', 'Communication style']
  },
  {
    id: 'color-palette',
    name: 'Color Palette Creator',
    description: 'Harmonious color schemes',
    section: 'branding',
    icon: 'swatches',
    color: 'text-secondary',
    features: ['Color harmony', 'Accessibility check', 'Usage guidelines', 'Mood boards']
  },
  {
    id: 'typography-selector',
    name: 'Typography Selector',
    description: 'Perfect font pairing & hierarchy',
    section: 'branding',
    icon: 'type',
    color: 'text-secondary',
    features: ['Font pairing', 'Typography hierarchy', 'Readability analysis', 'Usage guidelines']
  },
  {
    id: 'brand-guidelines',
    name: 'Brand Guidelines Builder',
    description: 'Comprehensive style guide creation',
    section: 'branding',
    icon: 'book-open',
    color: 'text-secondary',
    features: ['Style guide', 'Usage rules', 'Visual standards', 'Implementation guide']
  },
  {
    id: 'tagline-generator',
    name: 'Tagline Generator',
    description: 'Memorable brand slogans',
    section: 'branding',
    icon: 'zap',
    color: 'text-secondary',
    features: ['Memorable slogans', 'Message testing', 'Tagline variations', 'Performance analysis']
  },
  {
    id: 'typography',
    name: 'Typography Selector',
    description: 'Font pairing & hierarchy',
    section: 'branding',
    icon: 'font',
    color: 'text-secondary',
    features: ['Font pairing', 'Typography hierarchy', 'Readability analysis', 'Style guidelines']
  },
  {
    id: 'brand-guidelines',
    name: 'Brand Guidelines Builder',
    description: 'Comprehensive style guide',
    section: 'branding',
    icon: 'book',
    color: 'text-secondary',
    features: ['Style guide creation', 'Usage rules', 'Visual standards', 'Brand application']
  },
  {
    id: 'tagline-generator',
    name: 'Tagline Generator',
    description: 'Memorable brand slogans',
    section: 'branding',
    icon: 'quote-left',
    color: 'text-secondary',
    features: ['Slogan creation', 'Tagline variations', 'Message testing', 'Impact analysis']
  },
  {
    id: 'brand-story',
    name: 'Brand Story Writer',
    description: 'Compelling narratives',
    section: 'branding',
    icon: 'feather',
    color: 'text-secondary',
    features: ['Story development', 'Narrative structure', 'Emotional connection', 'Message consistency']
  },
  {
    id: 'visual-identity',
    name: 'Visual Identity System',
    description: 'Cohesive design elements',
    section: 'branding',
    icon: 'layer-group',
    color: 'text-secondary',
    features: ['Visual system', 'Design elements', 'Pattern library', 'Brand consistency']
  },
  {
    id: 'brand-positioning',
    name: 'Brand Positioning Bot',
    description: 'Market differentiation',
    section: 'branding',
    icon: 'target',
    color: 'text-secondary',
    features: ['Market positioning', 'Competitive advantage', 'Value proposition', 'Differentiation strategy']
  },
  {
    id: 'rebranding',
    name: 'Rebranding Consultant',
    description: 'Evolution strategy',
    section: 'branding',
    icon: 'sync',
    color: 'text-secondary',
    features: ['Rebrand strategy', 'Transition planning', 'Stakeholder communication', 'Change management']
  },

  // Advertising Bots
  {
    id: 'ad-copy',
    name: 'Ad Copy Generator',
    description: 'Persuasive ad content',
    section: 'advertising',
    icon: 'megaphone',
    color: 'text-success',
    features: ['Ad copywriting', 'CTA optimization', 'Platform adaptation', 'Performance optimization']
  },
  {
    id: 'creative-concept',
    name: 'Creative Concept Bot',
    description: 'Innovative ad ideas',
    section: 'advertising',
    icon: 'lightbulb',
    color: 'text-success',
    features: ['Creative ideation', 'Concept development', 'Campaign themes', 'Visual concepts']
  },
  {
    id: 'audience-targeting',
    name: 'Audience Targeting Assistant',
    description: 'Precise targeting strategies',
    section: 'advertising',
    icon: 'users-cog',
    color: 'text-success',
    features: ['Audience research', 'Demographic analysis', 'Interest targeting', 'Lookalike audiences']
  },
  {
    id: 'budget-optimizer',
    name: 'Budget Optimizer',
    description: 'Cost-effective allocation',
    section: 'advertising',
    icon: 'coins',
    color: 'text-success',
    features: ['Budget optimization', 'Bid strategies', 'Spend allocation', 'ROI maximization']
  },
  {
    id: 'ab-testing',
    name: 'A/B Test Designer',
    description: 'Experiment planning',
    section: 'advertising',
    icon: 'flask',
    color: 'text-success',
    features: ['Test design', 'Variable selection', 'Statistical analysis', 'Results interpretation']
  },
  {
    id: 'landing-pages',
    name: 'Landing Page Builder',
    description: 'Conversion-focused pages',
    section: 'advertising',
    icon: 'window-maximize',
    color: 'text-success',
    features: ['Page structure', 'Conversion optimization', 'UX design', 'Performance tracking']
  },
  {
    id: 'video-scripts',
    name: 'Video Ad Scripter',
    description: 'Engaging video content',
    section: 'advertising',
    icon: 'video',
    color: 'text-success',
    features: ['Script writing', 'Storyboarding', 'Hook creation', 'Call-to-action']
  },
  {
    id: 'display-ads',
    name: 'Display Ad Designer',
    description: 'Visual banner creation',
    section: 'advertising',
    icon: 'image',
    color: 'text-success',
    features: ['Banner design', 'Visual concepts', 'Size variations', 'Brand consistency']
  },
  {
    id: 'retargeting',
    name: 'Retargeting Strategist',
    description: 'Re-engagement campaigns',
    section: 'advertising',
    icon: 'redo',
    color: 'text-success',
    features: ['Audience segmentation', 'Message sequencing', 'Frequency capping', 'Campaign optimization']
  },
  {
    id: 'performance-analyzer',
    name: 'Ad Performance Analyzer',
    description: 'ROI optimization',
    section: 'advertising',
    icon: 'chart-bar',
    color: 'text-success',
    features: ['Performance analysis', 'Optimization recommendations', 'Trend identification', 'ROI tracking']
  },



  // Blog Bots (moved to Marketing section)
  {
    id: 'blog-generator',
    name: 'Blog Post Generator',
    description: 'Full article creation',
    section: 'marketing',
    icon: 'file-alt',
    color: 'text-primary',
    features: ['Article writing', 'Content structure', 'SEO optimization', 'Readability analysis']
  },
  {
    id: 'topic-research',
    name: 'Topic Research Bot',
    description: 'Content idea generation',
    section: 'marketing',
    icon: 'search-plus',
    color: 'text-primary',
    features: ['Topic research', 'Trend analysis', 'Keyword opportunities', 'Content gaps']
  },
  {
    id: 'seo-optimizer',
    name: 'SEO Article Optimizer',
    description: 'Search-friendly content',
    section: 'marketing',
    icon: 'search-location',
    color: 'text-primary',
    features: ['SEO optimization', 'Keyword integration', 'Meta optimization', 'Ranking factors']
  },
  {
    id: 'editorial-calendar',
    name: 'Editorial Calendar',
    description: 'Content planning',
    section: 'marketing',
    icon: 'calendar-week',
    color: 'text-primary',
    features: ['Content planning', 'Publishing schedule', 'Theme coordination', 'Resource allocation']
  },
  {
    id: 'headline-generator',
    name: 'Headline Generator',
    description: 'Click-worthy titles',
    section: 'marketing',
    icon: 'heading',
    color: 'text-primary',
    features: ['Headline creation', 'A/B testing', 'Click optimization', 'Emotional impact']
  },
  {
    id: 'content-repurposer',
    name: 'Content Repurposer',
    description: 'Multi-format adaptation',
    section: 'marketing',
    icon: 'retweet',
    color: 'text-primary',
    features: ['Content adaptation', 'Format conversion', 'Platform optimization', 'Value maximization']
  },
  {
    id: 'proofreading',
    name: 'Proofreading Assistant',
    description: 'Grammar & style checking',
    section: 'marketing',
    icon: 'spell-check',
    color: 'text-primary',
    features: ['Grammar checking', 'Style improvement', 'Clarity enhancement', 'Consistency review']
  },
  {
    id: 'meta-descriptions',
    name: 'Meta Description Writer',
    description: 'Search snippet optimization',
    section: 'marketing',
    icon: 'tag',
    color: 'text-primary',
    features: ['Meta descriptions', 'SERP optimization', 'Click-through rates', 'Character limits']
  },
  {
    id: 'guest-posting',
    name: 'Guest Post Outreach',
    description: 'Partnership content',
    section: 'marketing',
    icon: 'handshake',
    color: 'text-primary',
    features: ['Outreach strategy', 'Partnership development', 'Content collaboration', 'Relationship building']
  },
  {
    id: 'content-performance',
    name: 'Content Performance Tracker',
    description: 'Engagement analysis',
    section: 'marketing',
    icon: 'analytics',
    color: 'text-primary',
    features: ['Performance tracking', 'Engagement metrics', 'Optimization insights', 'Content ROI']
  },

  // Analytics Bots
  {
    id: 'performance-dashboard',
    name: 'Performance Dashboard',
    description: 'Real-time metrics',
    section: 'analytics',
    icon: 'tachometer-alt',
    color: 'text-accent',
    features: ['Dashboard creation', 'KPI tracking', 'Real-time monitoring', 'Custom metrics']
  },
  {
    id: 'insights-generator',
    name: 'Insights Generator',
    description: 'Actionable intelligence',
    section: 'analytics',
    icon: 'brain',
    color: 'text-accent',
    features: ['Data analysis', 'Pattern recognition', 'Actionable insights', 'Strategic recommendations']
  },
  {
    id: 'roi-calculator',
    name: 'ROI Calculator',
    description: 'Investment tracking',
    section: 'analytics',
    icon: 'percentage',
    color: 'text-accent',
    features: ['ROI calculation', 'Investment tracking', 'Profitability analysis', 'Performance metrics']
  },
  {
    id: 'trend-analyzer',
    name: 'Trend Analyzer',
    description: 'Pattern recognition',
    section: 'analytics',
    icon: 'chart-area',
    color: 'text-accent',
    features: ['Trend analysis', 'Pattern detection', 'Future predictions', 'Market insights']
  },
  {
    id: 'custom-reports',
    name: 'Custom Report Builder',
    description: 'Tailored analytics',
    section: 'analytics',
    icon: 'file-chart',
    color: 'text-accent',
    features: ['Custom reporting', 'Data visualization', 'Automated reports', 'Stakeholder communication']
  },
  {
    id: 'competitor-benchmarking',
    name: 'Competitor Benchmarking',
    description: 'Market comparison',
    section: 'analytics',
    icon: 'balance-scale',
    color: 'text-accent',
    features: ['Competitive analysis', 'Market benchmarking', 'Performance comparison', 'Strategic positioning']
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics',
    description: 'Future forecasting',
    section: 'analytics',
    icon: 'crystal-ball',
    color: 'text-accent',
    features: ['Predictive modeling', 'Forecasting', 'Risk assessment', 'Opportunity identification']
  },
  {
    id: 'attribution-modeling',
    name: 'Attribution Modeler',
    description: 'Channel contribution',
    section: 'analytics',
    icon: 'project-diagram',
    color: 'text-accent',
    features: ['Attribution analysis', 'Channel performance', 'Customer journey', 'Touch point analysis']
  },
  {
    id: 'audience-segmentation',
    name: 'Audience Segmenter',
    description: 'Customer grouping',
    section: 'analytics',
    icon: 'users-rectangle',
    color: 'text-accent',
    features: ['Audience segmentation', 'Behavioral analysis', 'Customer profiling', 'Targeting optimization']
  },
  {
    id: 'data-visualization',
    name: 'Data Visualizer',
    description: 'Chart & graph generation',
    section: 'analytics',
    icon: 'chart-pie',
    color: 'text-accent',
    features: ['Data visualization', 'Chart creation', 'Interactive dashboards', 'Visual storytelling']
  }
];

export function getBotsBySection(sectionId: string): BotDefinition[] {
  return bots.filter(bot => bot.section === sectionId);
}

export function getBotById(botId: string): BotDefinition | undefined {
  return bots.find(bot => bot.id === botId);
}

export function getSectionById(sectionId: string) {
  return sections.find(section => section.id === sectionId);
}

// Function to get available bots based on subscription tier
export function getAvailableBots(subscriptionTier: string): BotDefinition[] {
  if (subscriptionTier === 'free') {
    // Free tier: 8 bots (2 from each of the 4 sections)
    const marketingBots = bots.filter(bot => bot.section === 'marketing').slice(0, 2);
    const brandingBots = bots.filter(bot => bot.section === 'branding').slice(0, 2);
    const advertisingBots = bots.filter(bot => bot.section === 'advertising').slice(0, 2);
    const analyticsBots = bots.filter(bot => bot.section === 'analytics').slice(0, 2);
    
    return [...marketingBots, ...brandingBots, ...advertisingBots, ...analyticsBots];
  } else if (subscriptionTier === 'pro') {
    // Pro tier: 30 bots (roughly 7-8 from each section)
    return bots.slice(0, 30);
  } else if (subscriptionTier === 'premium') {
    // Premium tier: All 60+ bots
    return bots;
  }
  
  // Default to free tier if subscription tier not recognized
  return getAvailableBots('free');
}

// Function to check if user has access to a specific bot
export function hasAccessToBot(botId: string, subscriptionTier: string): boolean {
  const availableBots = getAvailableBots(subscriptionTier);
  return availableBots.some(bot => bot.id === botId);
}
