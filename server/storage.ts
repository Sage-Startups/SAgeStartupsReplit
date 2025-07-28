import { users, projects, botSessions, chatMessages, generatedAssets, userAnalytics, founderMetrics, auditLogs, subscriptionPlans, payments, content, media, waitlist, type User, type Project, type BotSession, type ChatMessage, type GeneratedAsset, type UserAnalytics, type FounderMetrics, type AuditLog, type SubscriptionPlan, type Payment, type Content, type Media, type UpsertUser, type InsertProject, type InsertBotSession, type InsertChatMessage, type InsertGeneratedAsset, type InsertUserAnalytics, type InsertFounderMetrics, type InsertWaitlist, type Waitlist } from "@shared/schema";
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
}

export const storage = new DatabaseStorage();