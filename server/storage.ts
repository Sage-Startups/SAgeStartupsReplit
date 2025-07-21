import { users, projects, botSessions, chatMessages, generatedAssets, userAnalytics, type User, type Project, type BotSession, type ChatMessage, type GeneratedAsset, type UserAnalytics, type UpsertUser, type InsertProject, type InsertBotSession, type InsertChatMessage, type InsertGeneratedAsset, type InsertUserAnalytics } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Project operations
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Bot session operations
  getBotSession(id: number): Promise<BotSession | undefined>;
  getBotSessionsByProjectId(projectId: number): Promise<BotSession[]>;
  createBotSession(session: InsertBotSession): Promise<BotSession>;
  updateBotSession(id: number, updates: Partial<BotSession>): Promise<BotSession | undefined>;
  
  // Chat message operations
  getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Generated asset operations
  getGeneratedAssetsBySessionId(sessionId: number): Promise<GeneratedAsset[]>;
  createGeneratedAsset(asset: InsertGeneratedAsset): Promise<GeneratedAsset>;
  
  // Analytics operations
  getUserAnalytics(userId: string): Promise<UserAnalytics | undefined>;
  updateUserAnalytics(userId: string, updates: Partial<InsertUserAnalytics>): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
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

  // Chat message operations
  async getChatMessagesBySessionId(sessionId: number): Promise<ChatMessage[]> {
    return await db.select().from(chatMessages).where(eq(chatMessages.sessionId, sessionId));
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
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
}

export const storage = new DatabaseStorage();