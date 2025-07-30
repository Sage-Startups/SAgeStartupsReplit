import { Request, Response, NextFunction } from 'express';
import { storage } from '../storage';
import { v4 as uuidv4 } from 'uuid';
import { UAParser } from 'ua-parser-js';

declare module 'express-session' {
  interface SessionData {
    analyticsSessionId?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      analyticsSessionId?: string;
      analyticsVisitId?: number;
    }
  }
}

interface AnalyticsRequest extends Request {
  analyticsSessionId?: string;
  analyticsVisitId?: number;
  user?: {
    claims: {
      sub: string;
    };
  };
}

export const analyticsMiddleware = async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
  try {
    // Skip analytics for API routes, static files, and already processed requests
    if (req.path.startsWith('/api') || 
        req.path.includes('.') || 
        req.analyticsSessionId ||
        req.method !== 'GET') {
      return next();
    }

    // Get or create session ID
    let sessionId = req.session?.analyticsSessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      if (req.session) {
        req.session.analyticsSessionId = sessionId;
      }
    }

    req.analyticsSessionId = sessionId;

    // Parse user agent for device info
    const parser = new UAParser();
    parser.setUA(req.headers['user-agent'] || '');
    const ua = parser.getResult();
    const device = ua.device.type || 'desktop';
    const browser = ua.browser.name || 'Unknown';
    const os = ua.os.name || 'Unknown';

    // Get IP address
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.headers['x-forwarded-for'] as string || 
                     '127.0.0.1';

    // Extract UTM parameters
    const utmSource = req.query.utm_source as string;
    const utmMedium = req.query.utm_medium as string;
    const utmCampaign = req.query.utm_campaign as string;

    // Check if this is an existing visit
    let visit = await storage.getSiteVisit(sessionId);
    
    if (!visit) {
      // Create new visit
      visit = await storage.createSiteVisit({
        sessionId,
        userId: req.user?.claims?.sub || null,
        ipAddress,
        userAgent: req.headers['user-agent'] || '',
        referrer: req.headers.referer || null,
        utmSource,
        utmMedium,
        utmCampaign,
        browser,
        os,
        device,
        isAuthenticated: !!req.user,
      });
    } else {
      // Update existing visit
      await storage.updateSiteVisit(visit.id, {
        pageViews: (visit.pageViews || 0) + 1,
        isAuthenticated: !!req.user,
        userId: req.user?.claims?.sub || visit.userId,
      });
    }

    req.analyticsVisitId = visit.id;

    // Create page view record
    await storage.createPageView({
      visitId: visit.id,
      sessionId,
      userId: req.user?.claims?.sub || null,
      path: req.path,
      title: '', // Will be updated by client-side script
    });

    next();
  } catch (error) {
    console.error('Analytics middleware error:', error);
    // Don't block the request if analytics fails
    next();
  }
};

// Middleware to track user actions (for POST/PUT/DELETE requests)
export const actionTrackingMiddleware = async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
  try {
    // Only track specific actions
    if (req.method === 'GET' || !req.analyticsSessionId) {
      return next();
    }

    // Track various actions based on the endpoint
    let action = 'unknown';
    let element = req.path;
    
    if (req.path.includes('/auth/login')) action = 'login_attempt';
    else if (req.path.includes('/auth/signup')) action = 'signup_attempt';
    else if (req.path.includes('/sessions') && req.method === 'POST') action = 'create_session';
    else if (req.path.includes('/messages') && req.method === 'POST') action = 'send_message';
    else if (req.path.includes('/waitlist')) action = 'waitlist_signup';
    else if (req.method === 'POST') action = 'form_submit';
    else if (req.method === 'PUT') action = 'update';
    else if (req.method === 'DELETE') action = 'delete';

    if (req.analyticsVisitId) {
      await storage.createUserAction({
        visitId: req.analyticsVisitId,
        sessionId: req.analyticsSessionId,
        userId: req.user?.claims?.sub || null,
        action,
        element,
        page: req.headers.referer || req.path,
        metadata: {
          method: req.method,
          timestamp: new Date().toISOString(),
        },
      });
    }

    next();
  } catch (error) {
    console.error('Action tracking middleware error:', error);
    next();
  }
};

// Middleware to track conversion events
export const conversionTrackingMiddleware = (eventType: string, eventValue?: number) => {
  return async (req: AnalyticsRequest, res: Response, next: NextFunction) => {
    try {
      if (req.analyticsVisitId && req.analyticsSessionId) {
        await storage.createConversionEvent({
          visitId: req.analyticsVisitId,
          sessionId: req.analyticsSessionId,
          userId: req.user?.claims?.sub || null,
          eventType,
          eventValue,
          source: req.headers.referer || 'direct',
        });
      }
      next();
    } catch (error) {
      console.error('Conversion tracking middleware error:', error);
      next();
    }
  };
};