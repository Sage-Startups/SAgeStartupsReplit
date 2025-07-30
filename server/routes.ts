import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import path from "path";
import { storage } from "./storage";
import { generateBotResponse } from "./services/openai";
import { insertProjectSchema, insertBotSessionSchema, insertChatMessageSchema, insertGeneratedAssetSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { bots } from "../client/src/lib/bot-definitions";
import authRoutes from "./authRoutes";
import { AuthService } from "./auth";
import { registerStripeRoutes } from "./routes/stripe";

import session from "express-session";
import connectPg from "connect-pg-simple";
import { v4 as uuidv4 } from "uuid";
import Stripe from "stripe";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enhanced video serving with proper headers and range support
  app.get('/website-video*.mp4', (req, res) => {
    const videoPath = path.join(process.cwd(), 'client/public', req.path);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=31536000');
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(videoPath, { start, end });
      
      res.status(206);
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', chunksize);
      file.pipe(res);
    } else {
      res.setHeader('Content-Length', fileSize);
      fs.createReadStream(videoPath).pipe(res);
    }
  });
  // Session configuration for custom auth
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: 7 * 24 * 60 * 60 * 1000, // 1 week
    tableName: "sessions",
  });

  app.use(session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET || 'your-session-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  }));

  // Custom authentication routes
  app.use('/api/auth', authRoutes);

  // Auth middleware for Replit Auth (keeping for backwards compatibility)
  await setupAuth(app);

  // Custom authentication middleware
  const requireAuth = async (req: any, res: any, next: any) => {
    const session = req.session as any;
    
    if (!session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await storage.getUser(session.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = { claims: { sub: user.id }, id: user.id };
    req.currentUser = user;
    next();
  };

  // Stripe payment routes
  registerStripeRoutes(app, requireAuth);
  

  
  // Import and mount webhook routes
  const { webhookRoutes } = await import('./routes/webhooks');
  app.use(webhookRoutes);



  // Auth routes (now handled by authRoutes)
  // Keep this for backwards compatibility with Replit Auth
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // First try custom auth
      const session = req.session as any;
      if (session.userId) {
        const user = await storage.getUser(session.userId);
        if (user) {
          const { password, emailVerificationToken, passwordResetToken, ...safeUser } = user;
          return res.json(safeUser);
        }
      }

      // Fallback to Replit Auth
      if (req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      }

      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's available bots based on subscription tier
  app.get("/api/user/bots", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let availableBots: any[] = [];
      
      if (user.subscriptionTier === 'free') {
        // Free tier: 1 bot per section (first bot of each section)
        const sections = ['marketing', 'branding', 'advertising', 'community', 'blog', 'analytics'];
        availableBots = sections.map(section => 
          bots.find(bot => bot.section === section)
        ).filter(Boolean);
      } else if (user.subscriptionTier === 'pro') {
        // Pro tier: 50% of bots (first half of each section)
        availableBots = bots.filter((bot, index) => {
          const sectionBots = bots.filter(b => b.section === bot.section);
          const botIndexInSection = sectionBots.findIndex(b => b.id === bot.id);
          return botIndexInSection < Math.ceil(sectionBots.length / 2);
        });
      } else if (user.subscriptionTier === 'premium') {
        // Premium tier: All bots
        availableBots = bots;
      }

      res.json(availableBots);
    } catch (error) {
      console.error("Error fetching user bots:", error);
      res.status(500).json({ message: "Failed to fetch user bots" });
    }
  });

  // Get user analytics
  app.get("/api/user/analytics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const analytics = await storage.getUserAnalytics(userId);
      const user = await storage.getUser(userId);
      
      const response = {
        ...(analytics || {
          userId,
          totalSessions: 0,
          totalMessages: 0,
          totalAssets: 0,
          favoriteSection: null,
          lastActive: new Date(),
          updatedAt: new Date()
        }),
        subscriptionTier: user?.subscriptionTier || 'free',
        subscriptionStatus: user?.subscriptionStatus || 'active'
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error fetching user analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Recent activity endpoint
  app.get("/api/user/recent-activity", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get all user projects first
      const projects = await storage.getProjectsByUserId(userId);
      
      if (projects.length === 0) {
        return res.json([]);
      }
      
      // Get all sessions from all projects
      let allSessions: any[] = [];
      for (const project of projects) {
        const projectSessions = await storage.getBotSessionsByProjectId(project.id);
        allSessions = allSessions.concat(projectSessions.map(session => ({
          ...session,
          projectName: project.name
        })));
      }
      
      // Sort by creation date and get the last 2
      const recentSessions = allSessions
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);
      
      // Get recent messages for each session to create meaningful headlines
      const activitiesWithContent = await Promise.all(
        recentSessions.map(async (session) => {
          const messages = await storage.getChatMessagesBySessionId(session.id);
          const assistantMessages = messages.filter(msg => msg.role === 'assistant');
          const userMessages = messages.filter(msg => msg.role === 'user');
          
          // Generate a meaningful headline based on the content
          let headline = session.sessionTitle || `${session.botId} session`;
          
          if (assistantMessages.length > 0) {
            const lastAssistantMessage = assistantMessages[assistantMessages.length - 1];
            const content = lastAssistantMessage.content;
            
            // Create headline based on bot type and content
            if (session.botId.includes('logo')) {
              headline = 'Logo design concepts generated';
            } else if (session.botId.includes('strategy') || session.botId.includes('campaign')) {
              headline = 'Marketing strategy developed';
            } else if (session.botId.includes('ad') || session.botId.includes('copy')) {
              headline = 'Ad copy and messaging created';
            } else if (session.botId.includes('brand')) {
              headline = 'Brand guidelines established';
            } else if (session.botId.includes('blog') || session.botId.includes('content')) {
              headline = 'Content strategy planned';
            } else if (session.botId.includes('analytics') || session.botId.includes('performance')) {
              headline = 'Performance insights generated';
            } else if (content.length > 0) {
              // Extract first meaningful words from AI response
              const words = content.split(' ').slice(0, 6).join(' ');
              headline = words.endsWith('.') ? words : words + '...';
            }
          } else if (userMessages.length > 0) {
            const lastUserMessage = userMessages[userMessages.length - 1];
            headline = `Working on: ${lastUserMessage.content.slice(0, 40)}...`;
          }
          
          return {
            id: session.id,
            headline,
            botId: session.botId,
            projectName: session.projectName,
            createdAt: session.createdAt,
            messagesCount: messages.length
          };
        })
      );
      
      res.json(activitiesWithContent);
    } catch (error) {
      console.error("Error fetching recent activity:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Subscription management
  app.post("/api/user/subscription", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tier } = req.body;
      
      if (!['free', 'pro', 'premium'].includes(tier)) {
        return res.status(400).json({ message: "Invalid subscription tier" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if this is an upgrade to a paid tier
      if (tier !== 'free' && user.subscriptionTier !== tier) {
        // Return a response indicating that payment is required
        return res.status(402).json({ 
          message: "Payment required",
          requiresPayment: true,
          redirectTo: '/checkout',
          tier: tier
        });
      }

      // Only allow direct updates for downgrades to free tier
      if (tier === 'free') {
        // For downgrades, keep the current tier until subscription expires
        let updateData: any = {
          ...user,
          subscriptionStatus: 'cancelling', // Mark as cancelling
          nextTier: 'free' // Set the tier they'll move to after expiration
        };
        
        // Cancel Stripe subscription at period end if exists
        if (user.stripeSubscriptionId) {
          try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
              apiVersion: "2025-06-30.basil"
            });
            // Cancel at period end instead of immediately
            await stripe.subscriptions.update(user.stripeSubscriptionId, {
              cancel_at_period_end: true
            });
          } catch (error) {
            console.error("Error canceling Stripe subscription:", error);
          }
        }
        
        const updatedUser = await storage.upsertUser(updateData);
        res.json({
          ...updatedUser,
          message: `Your subscription will be downgraded to free tier at the end of your current billing period${user.subscriptionExpires ? ` on ${new Date(user.subscriptionExpires).toLocaleDateString()}` : ''}`
        });
      } else {
        // For paid tiers, payment must be processed through Stripe first
        res.status(402).json({ 
          message: "Payment required",
          requiresPayment: true,
          redirectTo: '/checkout',
          tier: tier
        });
      }
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });
  
  // Projects
  app.get("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId
      });
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.get("/api/projects/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.delete("/api/projects/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Verify project belongs to user
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      if (project.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this project" });
      }
      
      await storage.deleteProject(id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Bot Sessions
  app.get("/api/projects/:projectId/sessions", requireAuth, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const sessions = await storage.getBotSessionsByProjectId(projectId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects/:projectId/sessions", requireAuth, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = req.user.claims.sub;
      
      // Check if user has access to this bot
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { botId } = req.body;
      // For now, allow access to all bots - subscription enforcement can be added later
      // const userBots = await getUserAvailableBots(user.subscriptionTier);
      // const hasAccess = userBots.some(bot => bot.id === botId);
      
      // if (!hasAccess) {
      //   return res.status(403).json({ message: "Bot not available in your subscription plan" });
      // }

      const validatedData = insertBotSessionSchema.parse({
        ...req.body,
        projectId
      });
      const session = await storage.createBotSession(validatedData);
      
      // Update analytics
      await storage.updateUserAnalytics(userId, {
        totalSessions: (await storage.getUserAnalytics(userId))?.totalSessions || 0 + 1
      });
      
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.get("/api/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.put("/api/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { sessionTitle, data } = req.body;
      
      const updateData: any = {};
      if (sessionTitle !== undefined) updateData.sessionTitle = sessionTitle;
      if (data !== undefined) updateData.data = data;
      
      const updatedSession = await storage.updateBotSession(sessionId, updateData);
      if (!updatedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.delete("/api/sessions/:sessionId", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      console.log(`Attempting to delete session ${sessionId}`);
      
      // First check if session exists
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        console.log(`Session ${sessionId} not found`);
        return res.status(404).json({ message: "Session not found" });
      }
      
      console.log(`Found session ${sessionId}, proceeding with deletion`);
      
      // First delete all associated chat messages
      await storage.deleteChatMessagesBySessionId(sessionId);
      console.log(`Deleted chat messages for session ${sessionId}`);
      
      // Then delete the session itself
      const deleted = await storage.deleteBotSession(sessionId);
      console.log(`Session deletion result: ${deleted}`);
      
      res.json({ message: "Session deleted successfully" });
    } catch (error) {
      console.error("Error deleting session:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Chat Messages
  app.get("/api/sessions/:sessionId/messages", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/sessions/:sessionId/messages", requireAuth, async (req: any, res) => {
    try {
      console.log('Message route started, sessionId:', req.params.sessionId);
      console.log('Request body:', req.body);
      
      const sessionId = parseInt(req.params.sessionId);
      const userId = req.user.claims.sub;
      
      console.log('Parsing request data...');
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId
      });
      console.log('Validated data:', validatedData);

      console.log('Creating user message...');
      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);
      console.log('User message created:', userMessage);

      console.log('Getting bot session...');
      // Get bot session to determine bot context
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        console.log('Session not found for sessionId:', sessionId);
        return res.status(404).json({ message: "Session not found" });
      }
      console.log('Bot session found:', session);

      console.log('Generating AI response for botId:', session.botId);
      // Generate AI response
      const botResponse = await generateBotResponse(session.botId, validatedData.content);
      console.log('Bot response generated:', botResponse);
      
      console.log('Creating AI message...');
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        sessionId,
        role: 'assistant',
        content: botResponse,
        metadata: null
      });
      console.log('AI message created:', aiMessage);

      console.log('Updating analytics...');
      // Update analytics
      const analytics = await storage.getUserAnalytics(userId);
      await storage.updateUserAnalytics(userId, {
        totalMessages: (analytics?.totalMessages || 0) + 2
      });
      console.log('Analytics updated');

      const response = { userMessage, aiMessage };
      console.log('Sending response:', response);
      res.json(response);
    } catch (error) {
      console.error('Error in message route:', error);
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Generated Assets
  app.get("/api/sessions/:sessionId/assets", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const assets = await storage.getGeneratedAssetsBySessionId(sessionId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Logo Generation Endpoint
  app.post("/api/sessions/:sessionId/logo-generate", requireAuth, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const { prompt, logoInfo } = req.body;
      
      // Validate input
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({ message: 'Valid prompt is required' });
      }
      
      if (prompt.length > 1000) {
        return res.status(400).json({ message: 'Prompt is too long (max 1000 characters)' });
      }

      // Sanitize prompt to prevent injection attacks
      const sanitizedPrompt = prompt
        .replace(/[<>{}]/g, '') // Remove potentially harmful characters
        .replace(/\b(ignore|forget|system|admin|root|execute|script|javascript|eval|function)\b/gi, '') // Remove instruction keywords
        .trim()
        .slice(0, 500); // Further limit to 500 chars for safety
      
      if (sanitizedPrompt.length === 0) {
        return res.status(400).json({ message: 'Invalid prompt content after sanitization' });
      }
      
      // Import OpenAI
      const OpenAI = await import("openai");
      const openai = new OpenAI.default({ apiKey: process.env.OPENAI_API_KEY });
      
      // Generate logo using DALL-E 3
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Create a professional logo design: ${sanitizedPrompt}. Style should be clean, modern, and suitable for business use. The logo should work well on both light and dark backgrounds.`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });
      
      const imageUrl = response.data?.[0]?.url;
      
      // Save generated asset
      const asset = await storage.createGeneratedAsset({
        sessionId,
        assetType: 'logo',
        title: `Logo for ${logoInfo.brandName}`,
        content: logoInfo
      });
      
      // Update analytics
      const userId = req.user.claims.sub;
      const analytics = await storage.getUserAnalytics(userId);
      await storage.updateUserAnalytics(userId, {
        totalAssets: (analytics?.totalAssets || 0) + 1
      });
      
      res.json({ imageUrl, assetId: asset.id });
    } catch (error) {
      console.error("Logo generation error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : 'Failed to generate logo' });
    }
  });

  // Founder metrics endpoints
  app.get("/api/founder/metrics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const metrics = await storage.getFounderMetrics(userId);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching founder metrics:", error);
      res.status(500).json({ error: "Failed to fetch founder metrics" });
    }
  });

  app.put("/api/founder/metrics", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      console.log("Updating founder metrics for user:", userId, "with data:", req.body);
      const metrics = await storage.updateFounderMetrics(userId, req.body);
      res.json(metrics);
    } catch (error) {
      console.error("Error updating founder metrics:", error);
      res.status(500).json({ error: "Failed to update founder metrics", details: error instanceof Error ? error.message : String(error) });
    }
  });

  // User profile endpoints
  app.get("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Failed to get user profile:", error);
      res.status(500).json({ error: "Failed to get user profile" });
    }
  });

  app.put("/api/user/profile", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated via this endpoint
      delete updates.id;
      delete updates.email;
      delete updates.subscriptionTier;
      delete updates.subscriptionStatus;
      delete updates.createdAt;
      
      const updatedUser = await storage.updateUser(userId, updates);
      res.json(updatedUser);
    } catch (error) {
      console.error("Failed to update user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  });

  app.post("/api/user/subscription", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { tier } = req.body;
      
      if (!['free', 'pro', 'premium'].includes(tier)) {
        return res.status(400).json({ error: "Invalid subscription tier" });
      }
      
      const updatedUser = await storage.updateUser(userId, { 
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscriptionExpires: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Failed to update subscription:", error);
      res.status(500).json({ error: "Failed to update subscription" });
    }
  });

  app.delete("/api/user/account", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteUser(userId);
      
      // Clear the session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Failed to destroy session:", err);
        }
      });
      
      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      console.error("Failed to delete account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  // Super Admin middleware
  const requireSuperAdmin = async (req: any, res: any, next: any) => {
    try {
      if (!req.user?.claims?.sub) {
        return res.status(401).json({ error: "Unauthorized" });
      }
      
      const user = await storage.getUserById(req.user.claims.sub);
      if (!user || user.role !== 'super_admin') {
        return res.status(403).json({ error: "Super admin access required" });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: "Authorization check failed" });
    }
  };

  // Super Admin API Routes
  app.post("/api/admin/users", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const { email, firstName, lastName, password, role, subscriptionTier } = req.body;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ error: "User with this email already exists" });
      }
      
      // Hash the password
      const hashedPassword = await AuthService.hashPassword(password);
      
      // Create new user  
      const newUser = await storage.createUser({
        id: uuidv4(),
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role: role || 'client',
        subscriptionTier: subscriptionTier || 'free',
        subscriptionStatus: 'active',
        profileImageUrl: null,
        company: null,
        jobTitle: null,
        phone: null,
        location: null,
        timezone: null,
        language: 'en',
        subscriptionExpires: null,
        trialUsed: false,
        emailNotifications: true,
        marketingEmails: false,
        securityAlerts: true,
        lastActive: new Date(),
        emailVerified: true, // Admin created users are auto-verified
        passwordResetToken: null,
        passwordResetExpires: null,
        emailVerificationToken: null,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'create',
        resource: 'user',
        resourceId: newUser.id,
        details: { email, role, subscriptionTier },
        ipAddress: req.ip
      });
      
      res.json(newUser);
    } catch (error) {
      console.error("Failed to create user:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  app.get("/api/admin/users", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const users = await storage.getAllUsers();
      
      // Get analytics for each user
      const usersWithAnalytics = await Promise.all(users.map(async (user) => {
        const analytics = await storage.getUserAnalytics(user.id);
        return {
          ...user,
          totalSessions: analytics?.totalSessions || 0,
          totalMessages: analytics?.totalMessages || 0
        };
      }));
      
      res.json(usersWithAnalytics);
    } catch (error) {
      console.error("Failed to get users:", error);
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  app.put("/api/admin/users/:userId", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const updates = req.body;
      
      // If password is included, hash it
      if (updates.password) {
        updates.password = await AuthService.hashPassword(updates.password);
      }
      
      // Add updatedAt timestamp
      updates.updatedAt = new Date();
      
      const updatedUser = await storage.updateUser(userId, updates);
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'update',
        resource: 'user',
        resourceId: userId,
        details: { ...updates, password: updates.password ? '[REDACTED]' : undefined },
        ipAddress: req.ip
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:userId", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      
      await storage.deleteUser(userId);
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'delete',
        resource: 'user',
        resourceId: userId,
        details: {},
        ipAddress: req.ip
      });
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Failed to delete user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Reset all users data (except admin accounts)
  app.delete("/api/admin/users/reset", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      await storage.resetAllUsers();
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'reset',
        resource: 'users',
        resourceId: 'all',
        details: { action: 'bulk_user_reset' },
        ipAddress: req.ip
      });
      
      res.json({ message: "All user data reset successfully" });
    } catch (error) {
      console.error("Failed to reset users:", error);
      res.status(500).json({ error: "Failed to reset users" });
    }
  });

  // Reset all revenue/payment data
  app.delete("/api/admin/revenue/reset", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      await storage.resetAllPayments();
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'reset',
        resource: 'payments',
        resourceId: 'all',
        details: { action: 'bulk_payment_reset' },
        ipAddress: req.ip
      });
      
      res.json({ message: "All revenue data reset successfully" });
    } catch (error) {
      console.error("Failed to reset revenue:", error);
      res.status(500).json({ error: "Failed to reset revenue" });
    }
  });

  // Reset all session data
  app.delete("/api/admin/sessions/reset", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      await storage.resetAllSessions();
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'reset',
        resource: 'sessions',
        resourceId: 'all',
        details: { action: 'bulk_session_reset' },
        ipAddress: req.ip
      });
      
      res.json({ message: "All session data reset successfully" });
    } catch (error) {
      console.error("Failed to reset sessions:", error);
      res.status(500).json({ error: "Failed to reset sessions" });
    }
  });

  // Reset all conversion data
  app.delete("/api/admin/conversions/reset", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      await storage.resetAllConversions();
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'reset',
        resource: 'conversions',
        resourceId: 'all',
        details: { action: 'bulk_conversion_reset' },
        ipAddress: req.ip
      });
      
      res.json({ message: "All conversion data reset successfully" });
    } catch (error) {
      console.error("Failed to reset conversions:", error);
      res.status(500).json({ error: "Failed to reset conversions" });
    }
  });

  // Reset user password endpoint
  app.post("/api/admin/users/:userId/reset-password", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const { userId } = req.params;
      const { password } = req.body;
      
      if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" });
      }
      
      // Hash the new password
      const hashedPassword = await AuthService.hashPassword(password);
      
      // Update user password
      const updatedUser = await storage.updateUser(userId, { 
        password: hashedPassword,
        updatedAt: new Date()
      });
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'password_reset',
        resource: 'user',
        resourceId: userId,
        details: { message: "Password reset by admin" },
        ipAddress: req.ip
      });
      
      res.json({ message: "Password reset successfully" });
    } catch (error) {
      console.error("Failed to reset password:", error);
      res.status(500).json({ error: "Failed to reset password" });
    }
  });

  app.get("/api/admin/plans", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const plans = await storage.getAllSubscriptionPlans();
      res.json(plans);
    } catch (error) {
      console.error("Failed to get plans:", error);
      res.status(500).json({ error: "Failed to get plans" });
    }
  });

  app.get("/api/admin/payments", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const payments = await storage.getAllPayments();
      
      // Get user emails for payments
      const paymentsWithUsers = await Promise.all(payments.map(async (payment) => {
        const user = await storage.getUserById(payment.userId);
        return {
          ...payment,
          userEmail: user?.email || 'Unknown'
        };
      }));
      
      res.json(paymentsWithUsers);
    } catch (error) {
      console.error("Failed to get payments:", error);
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  app.get("/api/admin/audit-logs", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const logs = await storage.getAllAuditLogs();
      
      // Get user emails for logs
      const logsWithUsers = await Promise.all(logs.map(async (log) => {
        const user = await storage.getUserById(log.userId);
        return {
          ...log,
          userEmail: user?.email || 'Unknown'
        };
      }));
      
      res.json(logsWithUsers);
    } catch (error) {
      console.error("Failed to get audit logs:", error);
      res.status(500).json({ error: "Failed to get audit logs" });
    }
  });

  app.get("/api/admin/metrics", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const metrics = await storage.getSystemMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Failed to get metrics:", error);
      res.status(500).json({ error: "Failed to get metrics" });
    }
  });

  app.get("/api/admin/waitlist", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const waitlistEntries = await storage.getAllWaitlistEntries();
      res.json(waitlistEntries);
    } catch (error) {
      console.error("Failed to get waitlist:", error);
      res.status(500).json({ error: "Failed to get waitlist" });
    }
  });

  // Delete individual waitlist entry
  app.delete("/api/admin/waitlist/:entryId", requireAuth, requireSuperAdmin, async (req: any, res) => {
    try {
      const { entryId } = req.params;
      
      await storage.deleteWaitlistEntry(parseInt(entryId));
      
      // Log the action
      await storage.createAuditLog({
        userId: req.session.userId,
        action: 'delete',
        resource: 'waitlist_entry',
        resourceId: entryId,
        details: { action: 'delete_waitlist_entry' },
        ipAddress: req.ip
      });
      
      res.json({ message: "Waitlist entry deleted successfully" });
    } catch (error) {
      console.error("Failed to delete waitlist entry:", error);
      res.status(500).json({ error: "Failed to delete waitlist entry" });
    }
  });

  // Reset founder metrics endpoint
  app.post("/api/founder/metrics/reset", requireAuth, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Reset to default values
      const resetData = {
        companyName: 'Your Startup',
        revenue: 0,
        monthlyGrowth: 0,
        activeUsers: 0,
        churnRate: 0,
        burnRate: 0,
        runway: 0,
        goals: []
      };
      
      const updatedMetrics = await storage.updateFounderMetrics(userId, resetData);
      res.json(updatedMetrics);
    } catch (error) {
      console.error("Failed to reset metrics:", error);
      res.status(500).json({ error: "Failed to reset metrics" });
    }
  });

  // Admin endpoint to update Stripe Price IDs
  app.post('/api/admin/update-stripe-secrets', isAuthenticated, async (req, res) => {
    try {
      const { 
        STRIPE_PRO_MONTHLY_PRICE_ID,
        STRIPE_PRO_YEARLY_PRICE_ID,
        STRIPE_PREMIUM_MONTHLY_PRICE_ID,
        STRIPE_PREMIUM_YEARLY_PRICE_ID
      } = req.body;

      // Validate all Price IDs
      const priceIds = [
        STRIPE_PRO_MONTHLY_PRICE_ID,
        STRIPE_PRO_YEARLY_PRICE_ID,
        STRIPE_PREMIUM_MONTHLY_PRICE_ID,
        STRIPE_PREMIUM_YEARLY_PRICE_ID
      ];

      if (!priceIds.every(id => id?.startsWith('price_'))) {
        return res.status(400).json({ 
          message: 'All Price IDs must start with "price_"' 
        });
      }

      // Update environment variables
      process.env.STRIPE_PRO_MONTHLY_PRICE_ID = STRIPE_PRO_MONTHLY_PRICE_ID;
      process.env.STRIPE_PRO_YEARLY_PRICE_ID = STRIPE_PRO_YEARLY_PRICE_ID;
      process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID = STRIPE_PREMIUM_MONTHLY_PRICE_ID;
      process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID = STRIPE_PREMIUM_YEARLY_PRICE_ID;

      console.log('✅ Updated Stripe Price IDs:', {
        PRO_MONTHLY: STRIPE_PRO_MONTHLY_PRICE_ID.substring(0, 20) + '...',
        PRO_YEARLY: STRIPE_PRO_YEARLY_PRICE_ID.substring(0, 20) + '...',
        PREMIUM_MONTHLY: STRIPE_PREMIUM_MONTHLY_PRICE_ID.substring(0, 20) + '...',
        PREMIUM_YEARLY: STRIPE_PREMIUM_YEARLY_PRICE_ID.substring(0, 20) + '...'
      });

      res.json({ 
        message: 'Stripe Price IDs updated successfully',
        success: true
      });
    } catch (error) {
      console.error('Error updating Stripe secrets:', error);
      res.status(500).json({ message: 'Failed to update secrets' });
    }
  });

  // Waitlist endpoint for landing page 2
  app.post("/api/waitlist", async (req, res) => {
    try {
      const { name, email, source = 'landing-page-2', referrer = null, isEarlyBird = false } = req.body;
      
      if (!name || name.trim().length === 0) {
        return res.status(400).json({ message: "Name is required" });
      }
      
      if (!email || !email.includes('@')) {
        return res.status(400).json({ message: "Invalid email address" });
      }
      
      // Check if already on waitlist
      const existing = await storage.getWaitlistByEmail(email);
      if (existing) {
        return res.status(400).json({ message: "You're already on the waitlist!" });
      }

      // If this is an early bird signup, check and decrement counter
      if (isEarlyBird) {
        const counter = await storage.getEarlyBirdCounter();
        
        if (!counter || counter.spotsRemaining <= 0) {
          return res.status(400).json({ message: 'Early bird offer is no longer available' });
        }

        // Decrement the counter
        await storage.decrementEarlyBirdCounter();
      }
      
      // Add to waitlist
      await storage.addToWaitlist({
        name: name.trim(),
        email,
        source,
        referrer,
        isEarlyBird
      });
      
      // Send welcome email using SendGrid
      const sgMail = await import("@sendgrid/mail");
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);
      
      const emailContent = {
        to: email,
        from: 'contact@sage-startups.com',
        subject: "You're on the Sage-Startups waitlist! 🚀",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to the Revolution!</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hi ${name},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Thank you for joining the Sage-Startups waitlist! You're now part of an exclusive group of founders who will get early access to our AI-powered startup platform.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-bottom: 15px;">What happens next?</h3>
              <ul style="color: #374151; line-height: 1.6;">
                <li><strong>Early Access:</strong> You'll be among the first to try our platform</li>
                <li><strong>40% Discount:</strong> Exclusive lifetime discount for early supporters</li>
                <li><strong>Founder Benefits:</strong> Special features and priority support</li>
                <li><strong>Community Access:</strong> Join our private founder community</li>
              </ul>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              We're working hard to launch soon. In the meantime, here's what you can do:
            </p>
            
            <ol style="color: #374151; line-height: 1.8;">
              <li>Reply to this email with your biggest startup challenge - we'll prioritize features based on your needs</li>
              <li>Follow us on social media for updates and founder tips</li>
              <li>Share with other founders who could benefit from AI-powered tools</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'https://sage-startups.replit.app'}" 
                 style="background: linear-gradient(90deg, #3b82f6, #8b5cf6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Visit Our Site
              </a>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="font-size: 14px; color: #6b7280;">
                Questions? Reply to this email and we'll get back to you ASAP.<br><br>
                To your success,<br>
                The Sage-Startups Team
              </p>
            </div>
          </div>
        `
      };
      
      // Send admin notification email
      const adminEmailContent = {
        to: 'contact@sage-startups.com',
        from: 'contact@sage-startups.com',
        subject: 'New Waitlist Signup - Sage-Startups',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937;">New Waitlist Signup</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Source:</strong> ${source}</p>
            <p><strong>Referrer:</strong> ${referrer || 'Direct'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px;">
              <p style="margin: 0; color: #374151;">Check the admin panel for all waitlist subscribers.</p>
            </div>
          </div>
        `
      };

      // Send both emails
      try {
        await Promise.all([
          sgMail.default.send(emailContent),
          sgMail.default.send(adminEmailContent)
        ]);
        console.log(`✅ Emails sent successfully for ${name} (${email})`);
      } catch (emailError) {
        console.error("❌ SendGrid email error:", emailError);
        // Continue anyway - user is still added to waitlist
      }
      
      res.json({ message: "Successfully joined waitlist!" });
    } catch (error) {
      console.error("Waitlist error:", error);
      res.status(500).json({ message: "Failed to join waitlist. Please try again." });
    }
  });

  // Early bird counter endpoint
  app.get("/api/early-bird-counter", async (req, res) => {
    try {
      const counter = await storage.getEarlyBirdCounter();
      res.json(counter);
    } catch (error) {
      console.error('Error fetching early bird counter:', error);
      res.status(500).json({ error: 'Failed to fetch counter' });
    }
  });

  // Business Suite waitlist endpoint
  app.post("/api/business-suite/join-waitlist", requireAuth, async (req: any, res) => {
    try {
      const { email, name, company } = req.body;
      
      if (!email || !name) {
        return res.status(400).json({ message: "Name and email are required" });
      }

      // Import SendGrid
      const sgMail = await import("@sendgrid/mail");
      sgMail.default.setApiKey(process.env.SENDGRID_API_KEY!);

      // Send notification email to admin
      const adminEmailContent = {
        to: 'contact@sage-startups.com',
        from: 'contact@sage-startups.com',
        subject: 'New Business Suite Waitlist Signup',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">New Business Suite Waitlist Signup</h2>
            
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 15px;">Contact Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${company ? `<p><strong>Company:</strong> ${company}</p>` : ''}
              <p><strong>Signup Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <p style="margin: 0; color: #1e40af;">
                <strong>Action Required:</strong> Add this user to the Business Suite waitlist.
              </p>
            </div>
          </div>
        `
      };

      // Send confirmation email to user
      const userEmailContent = {
        to: email,
        from: 'contact@sage-startups.com',
        subject: 'Welcome to the Business Suite Waitlist!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to the Waitlist!</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); margin: 0 auto;"></div>
            </div>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">Hi ${name},</p>
            
            <p style="font-size: 16px; color: #374151; line-height: 1.6;">
              Thank you for joining the waitlist for our Business Suite! We're excited to have you on board.
            </p>
            
            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c4a6e; margin-bottom: 15px;">What's Next?</h3>
              <ul style="color: #374151; line-height: 1.6;">
                <li>You'll be among the first to know when we launch</li>
                <li>Get exclusive early access to new features</li>
                <li>Receive a 50% discount on your first year</li>
                <li>Personal onboarding and setup assistance</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.REPLIT_DEV_DOMAIN || 'https://sage-startups.replit.app'}/business-suite" 
                 style="background: linear-gradient(90deg, #3b82f6, #8b5cf6); color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Explore Beta Version
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              In the meantime, feel free to explore our current beta version of the Business Suite to get a preview of what's coming.
            </p>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="font-size: 14px; color: #6b7280;">
                Best regards,<br>
                The Sage-Startups Team
              </p>
            </div>
          </div>
        `
      };

      // Send both emails
      await Promise.all([
        sgMail.default.send(adminEmailContent),
        sgMail.default.send(userEmailContent)
      ]);

      res.json({ message: "Successfully joined waitlist" });
    } catch (error) {
      console.error("Error joining waitlist:", error);
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to get user's available bots
async function getUserAvailableBots(subscriptionTier: string) {
  if (subscriptionTier === 'free') {
    const sections = ['marketing', 'branding', 'advertising', 'community', 'blog', 'analytics'];
    return sections.map(section => 
      bots.find(bot => bot.section === section)
    ).filter(Boolean);
  } else if (subscriptionTier === 'pro') {
    return bots.filter((bot, index) => {
      const sectionBots = bots.filter(b => b.section === bot.section);
      const botIndexInSection = sectionBots.findIndex(b => b.id === bot.id);
      return botIndexInSection < Math.ceil(sectionBots.length / 2);
    });
  } else if (subscriptionTier === 'premium') {
    return bots;
  }
  return [];
}