import type { Express } from "express";
import { createServer, type Server } from "http";
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

export async function registerRoutes(app: Express): Promise<Server> {
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
      const { sessionTitle } = req.body;
      
      const updatedSession = await storage.updateBotSession(sessionId, { sessionTitle });
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
  app.get("/api/sessions/:sessionId/assets", requireAuth, async (req, res) => {
    try {
      const sessionId = parseInt(req.params.sessionId);
      const assets = await storage.getGeneratedAssetsBySessionId(sessionId);
      res.json(assets);
    } catch (error) {
      res.status(500).json({ message: error instanceof Error ? error.message : 'An error occurred' });
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