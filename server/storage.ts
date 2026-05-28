import { eq, desc, count } from "drizzle-orm";
import { getDb, hasDb } from "./db.js";
import {
  users,
  botSessions,
  botMessages,
  waitlist,
  analyticsEvents,
  siteVisits,
  type User,
  type InsertUser,
  type BotSession,
  type InsertBotSession,
  type BotMessage,
  type InsertBotMessage,
  type Waitlist,
  type InsertWaitlist,
  type AnalyticsEvent,
  type InsertAnalyticsEvent,
  type SiteVisit,
  type InsertSiteVisit,
} from "../shared/schema.js";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;
  getBotSessions(userId: string): Promise<BotSession[]>;
  getBotSession(id: string): Promise<BotSession | undefined>;
  createBotSession(session: InsertBotSession): Promise<BotSession>;
  deleteBotSession(id: string): Promise<void>;
  getBotMessages(sessionId: string): Promise<BotMessage[]>;
  createBotMessage(message: InsertBotMessage): Promise<BotMessage>;
  addToWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  getWaitlistCount(): Promise<number>;
  trackEvent(event: InsertAnalyticsEvent): Promise<void>;
  trackVisit(visit: InsertSiteVisit): Promise<void>;
}

export class MemStorage implements IStorage {
  private _users = new Map<string, User>();
  private _botSessions = new Map<string, BotSession>();
  private _botMessages = new Map<string, BotMessage>();
  private _waitlist = new Map<string, Waitlist>();

  async getUser(id: string) {
    return this._users.get(id);
  }

  async getUserByEmail(email: string) {
    return [...this._users.values()].find((u) => u.email === email);
  }

  async createUser(data: InsertUser): Promise<User> {
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 7);
    const user: User = {
      id: crypto.randomUUID(),
      email: data.email,
      passwordHash: data.passwordHash ?? null,
      firstName: data.firstName ?? null,
      lastName: data.lastName ?? null,
      profileImageUrl: data.profileImageUrl ?? null,
      subscriptionTier: data.subscriptionTier ?? "free",
      subscriptionStatus: data.subscriptionStatus ?? "trialing",
      trialEndsAt: data.trialEndsAt ?? trialEndsAt,
      stripeCustomerId: data.stripeCustomerId ?? null,
      stripeSubscriptionId: data.stripeSubscriptionId ?? null,
      isEarlyBird: data.isEarlyBird ?? false,
      createdAt: new Date(),
    };
    this._users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const existing = this._users.get(id);
    if (!existing) throw new Error("User not found");
    const updated = { ...existing, ...updates };
    this._users.set(id, updated);
    return updated;
  }

  async getBotSessions(userId: string): Promise<BotSession[]> {
    return [...this._botSessions.values()]
      .filter((s) => s.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async getBotSession(id: string) {
    return this._botSessions.get(id);
  }

  async createBotSession(data: InsertBotSession): Promise<BotSession> {
    const session: BotSession = {
      id: crypto.randomUUID(),
      userId: data.userId,
      botId: data.botId,
      title: data.title,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._botSessions.set(session.id, session);
    return session;
  }

  async getBotMessages(sessionId: string): Promise<BotMessage[]> {
    return [...this._botMessages.values()]
      .filter((m) => m.botSessionId === sessionId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async createBotMessage(data: InsertBotMessage): Promise<BotMessage> {
    const message: BotMessage = {
      id: crypto.randomUUID(),
      botSessionId: data.botSessionId,
      role: data.role,
      content: data.content,
      metadata: data.metadata ?? null,
      createdAt: new Date(),
    };
    this._botMessages.set(message.id, message);
    return message;
  }

  async deleteBotSession(id: string): Promise<void> {
    this._botSessions.delete(id);
    for (const [msgId, msg] of this._botMessages) {
      if (msg.botSessionId === id) this._botMessages.delete(msgId);
    }
  }

  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const entry: Waitlist = {
      id: crypto.randomUUID(),
      email: data.email,
      source: data.source ?? "direct",
      createdAt: new Date(),
    };
    this._waitlist.set(entry.id, entry);
    return entry;
  }

  async getWaitlistCount(): Promise<number> {
    return this._waitlist.size;
  }

  async trackEvent(_event: InsertAnalyticsEvent) {}
  async trackVisit(_visit: InsertSiteVisit) {}
}

export class DbStorage implements IStorage {
  private get db() {
    return getDb();
  }

  async getUser(id: string) {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));
    return user;
  }

  async createUser(data: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(data).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [user] = await this.db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getBotSessions(userId: string): Promise<BotSession[]> {
    return this.db
      .select()
      .from(botSessions)
      .where(eq(botSessions.userId, userId))
      .orderBy(desc(botSessions.updatedAt));
  }

  async getBotSession(id: string) {
    const [session] = await this.db
      .select()
      .from(botSessions)
      .where(eq(botSessions.id, id));
    return session;
  }

  async createBotSession(data: InsertBotSession): Promise<BotSession> {
    const [session] = await this.db
      .insert(botSessions)
      .values(data)
      .returning();
    return session;
  }

  async deleteBotSession(id: string): Promise<void> {
    await this.db.delete(botMessages).where(eq(botMessages.botSessionId, id));
    await this.db.delete(botSessions).where(eq(botSessions.id, id));
  }

  async getBotMessages(sessionId: string): Promise<BotMessage[]> {
    return this.db
      .select()
      .from(botMessages)
      .where(eq(botMessages.botSessionId, sessionId))
      .orderBy(botMessages.createdAt);
  }

  async createBotMessage(data: InsertBotMessage): Promise<BotMessage> {
    const [message] = await this.db
      .insert(botMessages)
      .values(data)
      .returning();
    return message;
  }

  async addToWaitlist(data: InsertWaitlist): Promise<Waitlist> {
    const [entry] = await this.db.insert(waitlist).values(data).returning();
    return entry;
  }

  async getWaitlistCount(): Promise<number> {
    const [row] = await this.db.select({ value: count() }).from(waitlist);
    return row?.value ?? 0;
  }

  async trackEvent(event: InsertAnalyticsEvent) {
    await this.db.insert(analyticsEvents).values(event);
  }

  async trackVisit(visit: InsertSiteVisit) {
    await this.db.insert(siteVisits).values(visit);
  }
}

export const storage: IStorage = hasDb() ? new DbStorage() : new MemStorage();
