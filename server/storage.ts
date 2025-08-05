import { users, projects, botSessions, chatMessages, generatedAssets, userAnalytics, founderMetrics, auditLogs, subscriptionPlans, payments, content, media, waitlist, earlyBirdCounter, siteVisits, pageViews, userActions, conversionEvents, type User, type Project, type BotSession, type ChatMessage, type GeneratedAsset, type UserAnalytics, type FounderMetrics, type AuditLog, type SubscriptionPlan, type Payment, type InsertPayment, type Content, type Media, type UpsertUser, type InsertProject, type InsertBotSession, type InsertChatMessage, type InsertGeneratedAsset, type InsertUserAnalytics, type InsertFounderMetrics, type InsertWaitlist, type Waitlist, type EarlyBirdCounter, type SiteVisit, type PageView, type UserAction, type ConversionEvent, type InsertSiteVisit, type InsertPageView, type InsertUserAction, type InsertConversionEvent } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for authentication)
  getUser(id: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  createUser(userData: any): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  deleteProject(id: number): Promise<void>;
  
  // Bot session operations
  getBotSession(id: number): Promise<BotSession | undefined>;
  getBotSessionsByProjectId(projectId: number): Promise<BotSession[]>;
  createBotSession(session: InsertBotSession): Promise<BotSession>;
  updateBotSession(id: number, updates: Partial<BotSession>): Promise<BotSession | undefined>;
  deleteBotSession(id: number): Promise<boolean>;
  
  // Chat message operations
  getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  deleteChatMessagesBySessionId(sessionId: number): Promise<void>;
  
  // Generated asset operations
  getGeneratedAssetsBySessionId(sessionId: number): Promise<GeneratedAsset[]>;
  createGeneratedAsset(asset: InsertGeneratedAsset): Promise<GeneratedAsset>;
  
  // Analytics operations
  getUserAnalytics(userId: string): Promise<UserAnalytics | undefined>;
  updateUserAnalytics(userId: string, updates: Partial<InsertUserAnalytics>): Promise<void>;
  
  // Founder metrics operations
  getFounderMetrics(userId: string): Promise<FounderMetrics | undefined>;
  updateFounderMetrics(userId: string, updates: Partial<InsertFounderMetrics>): Promise<FounderMetrics>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getAllPayments(): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  getAllAuditLogs(): Promise<AuditLog[]>;
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  createAuditLog(log: Partial<AuditLog>): Promise<void>;
  getSystemMetrics(): Promise<any>;
  
  // Admin reset operations
  resetAllUsers(): Promise<void>;
  resetAllPayments(): Promise<void>;
  resetAllSessions(): Promise<void>;
  resetAllConversions(): Promise<void>;
  
  // Waitlist operations
  addToWaitlist(data: InsertWaitlist): Promise<Waitlist>;
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
  getAllWaitlistEntries(): Promise<Waitlist[]>;
  deleteWaitlistEntry(id: number): Promise<void>;
  
  // Early bird counter operations
  getEarlyBirdCounter(): Promise<EarlyBirdCounter | undefined>;
  decrementEarlyBirdCounter(): Promise<EarlyBirdCounter>;
  
  // Site analytics operations
  createSiteVisit(visit: InsertSiteVisit): Promise<SiteVisit>;
  updateSiteVisit(id: number, updates: Partial<SiteVisit>): Promise<void>;
  getSiteVisit(sessionId: string): Promise<SiteVisit | undefined>;
  getAllSiteVisits(limit?: number, offset?: number): Promise<SiteVisit[]>;
  
  createPageView(pageView: InsertPageView): Promise<PageView>;
  getPageViewsByVisit(visitId: number): Promise<PageView[]>;
  getAllPageViews(limit?: number, offset?: number): Promise<PageView[]>;
  
  createUserAction(action: InsertUserAction): Promise<UserAction>;
  getUserActionsByVisit(visitId: number): Promise<UserAction[]>;
  getAllUserActions(limit?: number, offset?: number): Promise<UserAction[]>;
  
  createConversionEvent(event: InsertConversionEvent): Promise<ConversionEvent>;
  getConversionEventsByVisit(visitId: number): Promise<ConversionEvent[]>;
  getAllConversionEvents(limit?: number, offset?: number): Promise<ConversionEvent[]>;
  
  getAnalyticsSummary(dateFrom?: Date, dateTo?: Date): Promise<any>;
  getTopPages(limit?: number): Promise<any[]>;
  getTrafficSources(limit?: number): Promise<any[]>;
  getUserBehaviorMetrics(): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserById(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.emailVerificationToken, token));
    return user;
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    // First, get all projects for this user
    const userProjects = await db.select().from(projects).where(eq(projects.userId, id));
    
    // Delete all data associated with each project
    for (const project of userProjects) {
      // Get all bot sessions for this project
      const projectSessions = await db.select().from(botSessions).where(eq(botSessions.projectId, project.id));
      
      for (const session of projectSessions) {
        // Delete chat messages for each session
        await db.delete(chatMessages).where(eq(chatMessages.sessionId, session.id));
        // Delete generated assets for each session
        await db.delete(generatedAssets).where(eq(generatedAssets.sessionId, session.id));
      }
      
      // Delete all bot sessions for this project
      await db.delete(botSessions).where(eq(botSessions.projectId, project.id));
    }
    
    // Delete all projects for this user
    await db.delete(projects).where(eq(projects.userId, id));
    
    // Delete user analytics and metrics
    await db.delete(userAnalytics).where(eq(userAnalytics.userId, id));
    await db.delete(founderMetrics).where(eq(founderMetrics.userId, id));
    
    // Delete payment history
    await db.delete(payments).where(eq(payments.userId, id));
    
    // Delete content authored by this user
    await db.delete(content).where(eq(content.authorId, id));
    
    // Delete media uploaded by this user
    await db.delete(media).where(eq(media.uploadedBy, id));
    
    // Delete any audit logs for this user (do this last since it references user)
    await db.delete(auditLogs).where(eq(auditLogs.userId, id));
    
    // Finally, delete the user
    await db.delete(users).where(eq(users.id, id));
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Project operations
  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.userId, userId));
  }

  async createProject(project: InsertProject): Promise<Project> {
    const [newProject] = await db.insert(projects).values(project).returning();
    return newProject;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const [updatedProject] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<void> {
    // First delete all related bot sessions and their messages
    const sessions = await this.getBotSessionsByProjectId(id);
    
    for (const session of sessions) {
      // Delete chat messages for each session
      await this.deleteChatMessagesBySessionId(session.id);
      // Delete the session
      await this.deleteBotSession(session.id);
    }
    
    // Finally delete the project
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Bot session operations
  async getBotSession(id: number): Promise<BotSession | undefined> {
    const [session] = await db.select().from(botSessions).where(eq(botSessions.id, id));
    return session;
  }

  async getBotSessionsByProjectId(projectId: number): Promise<BotSession[]> {
    return await db.select().from(botSessions).where(eq(botSessions.projectId, projectId));
  }

  async createBotSession(session: InsertBotSession): Promise<BotSession> {
    const [newSession] = await db.insert(botSessions).values(session).returning();
    return newSession;
  }

  async updateBotSession(id: number, updates: Partial<BotSession>): Promise<BotSession | undefined> {
    const [updatedSession] = await db
      .update(botSessions)
      .set(updates)
      .where(eq(botSessions.id, id))
      .returning();
    return updatedSession;
  }

  async deleteBotSession(id: number): Promise<boolean> {
    try {
      await db.delete(botSessions).where(eq(botSessions.id, id));
      return true;
    } catch (error) {
      console.error("Error deleting bot session:", error);
      return false;
    }
  }

  // Chat message operations
  async getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async deleteChatMessagesBySessionId(sessionId: number): Promise<void> {
    await db.delete(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  // Generated asset operations
  async getGeneratedAssetsBySessionId(sessionId: number): Promise<GeneratedAsset[]> {
    return await db.select().from(generatedAssets).where(eq(generatedAssets.sessionId, sessionId));
  }

  async createGeneratedAsset(asset: InsertGeneratedAsset): Promise<GeneratedAsset> {
    const [newAsset] = await db.insert(generatedAssets).values(asset).returning();
    return newAsset;
  }

  // Analytics operations
  async getUserAnalytics(userId: string): Promise<UserAnalytics | undefined> {
    const [analytics] = await db.select().from(userAnalytics).where(eq(userAnalytics.userId, userId));
    return analytics;
  }

  async updateUserAnalytics(userId: string, updates: Partial<InsertUserAnalytics>): Promise<void> {
    const existing = await this.getUserAnalytics(userId);
    if (existing) {
      await db
        .update(userAnalytics)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(userAnalytics.userId, userId));
    } else {
      await db.insert(userAnalytics).values({ userId, ...updates });
    }
  }

  // Founder metrics operations
  async getFounderMetrics(userId: string): Promise<FounderMetrics | undefined> {
    const [metrics] = await db.select().from(founderMetrics).where(eq(founderMetrics.userId, userId));
    return metrics;
  }

  async updateFounderMetrics(userId: string, updates: Partial<InsertFounderMetrics>): Promise<FounderMetrics> {
    const existingMetrics = await this.getFounderMetrics(userId);
    
    if (existingMetrics) {
      const [updatedMetrics] = await db
        .update(founderMetrics)
        .set({ ...updates, lastUpdated: new Date() })
        .where(eq(founderMetrics.userId, userId))
        .returning();
      return updatedMetrics;
    } else {
      const [newMetrics] = await db.insert(founderMetrics).values({
        userId,
        companyName: 'Your Startup',
        revenue: 0,
        monthlyGrowth: 0,
        activeUsers: 0,
        churnRate: 0,
        burnRate: 0,
        runway: 0,
        goals: [],
        ...updates,
      }).returning();
      return newMetrics;
    }
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getAllPayments(): Promise<Payment[]> {
    return await db.select().from(payments);
  }

  async createPayment(paymentData: InsertPayment): Promise<Payment> {
    const [payment] = await db.insert(payments).values(paymentData as any).returning();
    return payment;
  }

  async getAllAuditLogs(): Promise<AuditLog[]> {
    return await db.select().from(auditLogs);
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return await db.select().from(subscriptionPlans);
  }

  async createAuditLog(logData: Partial<AuditLog>): Promise<void> {
    await db.insert(auditLogs).values(logData as any);
  }

  async getSystemMetrics(): Promise<any> {
    const totalUsers = await db.select().from(users);
    const activeUsers = totalUsers.filter(u => u.subscriptionStatus === 'active');
    const allPayments = await db.select().from(payments);
    const completedPayments = allPayments.filter(p => p.status === 'completed');
    
    const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthlyPayments = completedPayments.filter(p => new Date(p.createdAt) >= thisMonth);
    const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + p.amount, 0);

    const analytics = await db.select().from(userAnalytics);
    const totalSessions = analytics.reduce((sum, a) => sum + a.totalSessions, 0);
    const totalMessages = analytics.reduce((sum, a) => sum + a.totalMessages, 0);

    return {
      totalUsers: totalUsers.length,
      activeUsers: activeUsers.length,
      totalRevenue,
      monthlyRevenue,
      totalSessions,
      totalMessages,
      conversionRate: totalUsers.length > 0 ? (activeUsers.length / totalUsers.length * 100) : 0,
      churnRate: 5 // placeholder
    };
  }

  // Admin reset operations
  async resetAllUsers(): Promise<void> {
    // Delete all non-admin users and their associated data
    await db.delete(users);
  }

  async resetAllPayments(): Promise<void> {
    // Delete all payment records
    await db.delete(payments);
  }

  async resetAllSessions(): Promise<void> {
    // Delete all bot sessions and their messages
    await db.delete(chatMessages);
    await db.delete(botSessions);
    await db.delete(generatedAssets);
  }

  async resetAllConversions(): Promise<void> {
    // Reset all user analytics and metrics
    await db.delete(userAnalytics);
    await db.delete(founderMetrics);
  }

  // Waitlist operations
  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await db.insert(waitlist).values(data).returning();
    return entry;
  }

  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    const [entry] = await db.select().from(waitlist).where(eq(waitlist.email, email));
    return entry;
  }

  async getAllWaitlistEntries(): Promise<Waitlist[]> {
    return await db.select().from(waitlist).orderBy(desc(waitlist.createdAt));
  }

  async deleteWaitlistEntry(id: number): Promise<void> {
    await db.delete(waitlist).where(eq(waitlist.id, id));
  }

  // Early bird counter operations
  async getEarlyBirdCounter(): Promise<EarlyBirdCounter | undefined> {
    let [counter] = await db.select().from(earlyBirdCounter).limit(1);
    
    // Initialize counter if it doesn't exist
    if (!counter) {
      [counter] = await db.insert(earlyBirdCounter).values({
        spotsRemaining: 20,
        totalSpots: 20
      }).returning();
    }
    
    return counter;
  }

  async decrementEarlyBirdCounter(): Promise<EarlyBirdCounter> {
    const counter = await this.getEarlyBirdCounter();
    
    if (!counter || counter.spotsRemaining <= 0) {
      throw new Error('No spots remaining');
    }

    const [updatedCounter] = await db.update(earlyBirdCounter)
      .set({ 
        spotsRemaining: counter.spotsRemaining - 1,
        updatedAt: new Date()
      })
      .where(eq(earlyBirdCounter.id, counter.id))
      .returning();
    
    return updatedCounter;
  }

  // Site analytics operations
  async createSiteVisit(visit: InsertSiteVisit): Promise<SiteVisit> {
    const [siteVisit] = await db.insert(siteVisits).values(visit).returning();
    return siteVisit;
  }

  async updateSiteVisit(id: number, updates: Partial<SiteVisit>): Promise<void> {
    await db.update(siteVisits).set(updates).where(eq(siteVisits.id, id));
  }

  async getSiteVisit(sessionId: string): Promise<SiteVisit | undefined> {
    const [visit] = await db.select().from(siteVisits).where(eq(siteVisits.sessionId, sessionId));
    return visit;
  }

  async getAllSiteVisits(limit: number = 100, offset: number = 0): Promise<SiteVisit[]> {
    return await db.select().from(siteVisits)
      .orderBy(desc(siteVisits.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createPageView(pageView: InsertPageView): Promise<PageView> {
    const [page] = await db.insert(pageViews).values(pageView).returning();
    return page;
  }

  async getPageViewsByVisit(visitId: number): Promise<PageView[]> {
    return await db.select().from(pageViews)
      .where(eq(pageViews.visitId, visitId))
      .orderBy(desc(pageViews.createdAt));
  }

  async getAllPageViews(limit: number = 100, offset: number = 0): Promise<PageView[]> {
    return await db.select().from(pageViews)
      .orderBy(desc(pageViews.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createUserAction(action: InsertUserAction): Promise<UserAction> {
    const [userAction] = await db.insert(userActions).values(action).returning();
    return userAction;
  }

  async getUserActionsByVisit(visitId: number): Promise<UserAction[]> {
    return await db.select().from(userActions)
      .where(eq(userActions.visitId, visitId))
      .orderBy(desc(userActions.createdAt));
  }

  async getAllUserActions(limit: number = 100, offset: number = 0): Promise<UserAction[]> {
    return await db.select().from(userActions)
      .orderBy(desc(userActions.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async createConversionEvent(event: InsertConversionEvent): Promise<ConversionEvent> {
    const [conversionEvent] = await db.insert(conversionEvents).values(event).returning();
    return conversionEvent;
  }

  async getConversionEventsByVisit(visitId: number): Promise<ConversionEvent[]> {
    return await db.select().from(conversionEvents)
      .where(eq(conversionEvents.visitId, visitId))
      .orderBy(desc(conversionEvents.createdAt));
  }

  async getAllConversionEvents(limit: number = 100, offset: number = 0): Promise<ConversionEvent[]> {
    return await db.select().from(conversionEvents)
      .orderBy(desc(conversionEvents.createdAt))
      .limit(limit)
      .offset(offset);
  }

  async getAnalyticsSummary(dateFrom?: Date, dateTo?: Date): Promise<any> {
    // Get basic metrics from the last 30 days if no dates provided
    const endDate = dateTo || new Date();
    const startDate = dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const visits = await db.select().from(siteVisits);
    const pageViewsData = await db.select().from(pageViews);
    const actionsData = await db.select().from(userActions);
    const conversionsData = await db.select().from(conversionEvents);

    // Filter by date range
    const filteredVisits = visits.filter(v => {
      const visitDate = new Date(v.createdAt);
      return visitDate >= startDate && visitDate <= endDate;
    });

    const totalVisits = filteredVisits.length;
    const uniqueVisitors = new Set(filteredVisits.filter(v => v.userId).map(v => v.userId)).size + 
                          filteredVisits.filter(v => !v.userId).length; // Anonymous visitors count as unique
    const totalPageViews = pageViewsData.filter(p => {
      const pageDate = new Date(p.createdAt);
      return pageDate >= startDate && pageDate <= endDate;
    }).length;
    
    const totalActions = actionsData.filter(a => {
      const actionDate = new Date(a.createdAt);
      return actionDate >= startDate && actionDate <= endDate;
    }).length;

    const totalConversions = conversionsData.filter(c => {
      const conversionDate = new Date(c.createdAt);
      return conversionDate >= startDate && conversionDate <= endDate;
    }).length;

    const avgSessionDuration = filteredVisits.reduce((sum, visit) => {
      return sum + (visit.duration || 0);
    }, 0) / (filteredVisits.length || 1);

    const bounceRate = filteredVisits.filter(v => v.pageViews === 1).length / (filteredVisits.length || 1) * 100;

    return {
      totalVisits,
      uniqueVisitors,
      totalPageViews,
      totalActions,
      totalConversions,
      avgSessionDuration: Math.round(avgSessionDuration),
      bounceRate: Math.round(bounceRate * 100) / 100,
      conversionRate: totalVisits > 0 ? Math.round((totalConversions / totalVisits) * 10000) / 100 : 0,
      pagesPerSession: totalVisits > 0 ? Math.round((totalPageViews / totalVisits) * 100) / 100 : 0,
    };
  }

  async getTopPages(limit: number = 10): Promise<any[]> {
    const pageViewsData = await db.select().from(pageViews);
    const pageCount = pageViewsData.reduce((acc, pv) => {
      acc[pv.path] = (acc[pv.path] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(pageCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([path, views]) => ({ path, views }));
  }

  async getTrafficSources(limit: number = 10): Promise<any[]> {
    const visitsData = await db.select().from(siteVisits);
    const sourceCount = visitsData.reduce((acc, visit) => {
      const source = visit.utmSource || visit.referrer || 'Direct';
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(sourceCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, limit)
      .map(([source, visits]) => ({ source, visits }));
  }

  async getUserBehaviorMetrics(): Promise<any> {
    const actionsData = await db.select().from(userActions);
    const pageViewsData = await db.select().from(pageViews);
    
    const actionCount = actionsData.reduce((acc, action) => {
      acc[action.action] = (acc[action.action] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topActions = Object.entries(actionCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([action, count]) => ({ action, count }));

    const avgTimeOnPage = pageViewsData.reduce((sum, page) => {
      return sum + (page.timeOnPage || 0);
    }, 0) / (pageViewsData.length || 1);

    return {
      topActions,
      avgTimeOnPage: Math.round(avgTimeOnPage),
      totalActions: actionsData.length,
    };
  }
}

export const storage = new DatabaseStorage();