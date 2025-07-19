import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateBotResponse } from "./services/openai";
import { insertProjectSchema, insertBotSessionSchema, insertChatMessageSchema, insertGeneratedAssetSchema } from "@shared/schema";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { bots } from "../client/src/lib/bot-definitions";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user's available bots based on subscription tier
  app.get("/api/user/bots", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let availableBots = [];
      
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
  app.get("/api/user/analytics", isAuthenticated, async (req: any, res) => {
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

  // Subscription management
  app.post("/api/user/subscription", isAuthenticated, async (req: any, res) => {
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

      // Update subscription tier (in real app, this would integrate with payment processing)
      const updatedUser = await storage.upsertUser({
        ...user,
        subscriptionTier: tier,
        subscriptionStatus: 'active',
        subscriptionExpires: tier === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating subscription:", error);
      res.status(500).json({ message: "Failed to update subscription" });
    }
  });
  
  // Projects
  app.get("/api/projects", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjectsByUserId(userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req: any, res) => {
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

  app.get("/api/projects/:id", isAuthenticated, async (req, res) => {
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

  // Bot Sessions
  app.get("/api/projects/:projectId/sessions", isAuthenticated, async (req, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const sessions = await storage.getBotSessionsByProjectId(projectId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/projects/:projectId/sessions", isAuthenticated, async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.projectId);
      const userId = req.user.claims.sub;
      
      // Check if user has access to this bot
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { botId } = req.body;
      const userBots = await getUserAvailableBots(user.subscriptionTier);
      const hasAccess = userBots.some(bot => bot.id === botId);
      
      if (!hasAccess) {
        return res.status(403).json({ message: "Bot not available in your subscription plan" });
      }

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

  app.get("/api/sessions/:sessionId", isAuthenticated, async (req, res) => {
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

  // Chat Messages
  app.get("/api/sessions/:sessionId/messages", isAuthenticated, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const messages = await storage.getChatMessagesBySessionId(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  app.post("/api/sessions/:sessionId/messages", isAuthenticated, async (req: any, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const userId = req.user.claims.sub;
      
      const validatedData = insertChatMessageSchema.parse({
        ...req.body,
        sessionId
      });

      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);

      // Get bot session to determine bot context
      const session = await storage.getBotSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }

      // Generate AI response
      const botResponse = await generateBotResponse(session.botId, validatedData.content);
      
      // Save AI response
      const aiMessage = await storage.createChatMessage({
        sessionId,
        role: 'assistant',
        content: botResponse,
        metadata: null
      });

      // Update analytics
      const analytics = await storage.getUserAnalytics(userId);
      await storage.updateUserAnalytics(userId, {
        totalMessages: (analytics?.totalMessages || 0) + 2,
        lastActive: new Date()
      });

      res.json({ userMessage, aiMessage });
    } catch (error) {
      res.status(400).json({ message: error instanceof Error ? error.message : 'An error occurred' });
    }
  });

  // Generated Assets
  app.get("/api/sessions/:sessionId/assets", isAuthenticated, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const assets = await storage.getGeneratedAssetsBySessionId(sessionId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
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