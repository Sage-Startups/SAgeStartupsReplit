import { storage } from './storage';

export async function seedAnalyticsData() {
  try {
    console.log('Seeding analytics data...');
    
    // Create some sample site visits
    const visits = [
      {
        sessionId: 'session-1',
        userId: null,
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        referrer: 'https://google.com',
        utmSource: 'google',
        utmMedium: 'cpc',
        utmCampaign: 'startup-tools',
        browser: 'Chrome',
        os: 'Windows',
        device: 'desktop',
        pageViews: 5,
        duration: 450000, // 7.5 minutes
        isAuthenticated: false,
      },
      {
        sessionId: 'session-2',
        userId: null,
        ipAddress: '10.0.0.50',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
        referrer: null,
        utmSource: null,
        utmMedium: null,
        utmCampaign: null,
        browser: 'Safari',
        os: 'iOS',
        device: 'mobile',
        pageViews: 3,
        duration: 180000, // 3 minutes
        isAuthenticated: false,
      },
      {
        sessionId: 'session-3',
        userId: 'b9d16e5f-5694-4c00-b1a0-8098105af403',
        ipAddress: '172.16.0.25',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        referrer: 'https://twitter.com',
        utmSource: 'twitter',
        utmMedium: 'social',
        utmCampaign: 'product-launch',
        browser: 'Firefox',
        os: 'macOS',
        device: 'desktop',
        pageViews: 8,
        duration: 720000, // 12 minutes
        isAuthenticated: true,
      }
    ];

    for (const visitData of visits) {
      const visit = await storage.createSiteVisit(visitData);
      
      // Create page views for each visit
      const pages = ['/', '/dashboard', '/ai-suite', '/business-suite', '/analytics'];
      for (let i = 0; i < visitData.pageViews; i++) {
        const page = pages[i % pages.length];
        await storage.createPageView({
          visitId: visit.id,
          sessionId: visit.sessionId,
          userId: visit.userId,
          path: page,
          title: `Page ${page}`,
          timeOnPage: Math.floor(Math.random() * 60000) + 30000, // 30s - 90s
        });
      }

      // Create user actions
      const actions = ['click', 'scroll', 'form_submit', 'button_click'];
      for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
        await storage.createUserAction({
          visitId: visit.id,
          sessionId: visit.sessionId,
          userId: visit.userId,
          action: actions[Math.floor(Math.random() * actions.length)],
          element: `button-${i}`,
          elementText: `Action ${i}`,
          page: pages[Math.floor(Math.random() * pages.length)],
          metadata: { timestamp: new Date().toISOString() },
        });
      }

      // Create conversion events
      if (Math.random() > 0.5) {
        await storage.createConversionEvent({
          visitId: visit.id,
          sessionId: visit.sessionId,
          userId: visit.userId,
          eventType: 'signup',
          eventValue: 0,
          source: visit.referrer || 'direct',
        });
      }
    }

    console.log('Analytics data seeded successfully!');
  } catch (error) {
    console.error('Error seeding analytics data:', error);
  }
}