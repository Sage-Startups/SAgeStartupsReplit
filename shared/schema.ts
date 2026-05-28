import {
  pgTable,
  text,
  uuid,
  timestamp,
  jsonb,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const subscriptionTierEnum = pgEnum("subscription_tier", [
  "free",
  "pro",
  "premium",
]);

export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "trialing",
  "active",
  "cancelled",
  "expired",
]);

export const messageRoleEnum = pgEnum("message_role", ["user", "assistant"]);

// ─── Tables ───────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  passwordHash: text("password_hash"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  subscriptionTier: subscriptionTierEnum("subscription_tier")
    .default("free")
    .notNull(),
  subscriptionStatus: subscriptionStatusEnum("subscription_status")
    .default("trialing")
    .notNull(),
  trialEndsAt: timestamp("trial_ends_at"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  isEarlyBird: boolean("is_early_bird").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Express session table — managed by connect-pg-simple
export const sessions = pgTable("session", {
  sid: text("sid").primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire", { precision: 6 }).notNull(),
});

export const botSessions = pgTable("bot_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  botId: text("bot_id").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const botMessages = pgTable("bot_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  botSessionId: uuid("bot_session_id")
    .notNull()
    .references(() => botSessions.id, { onDelete: "cascade" }),
  role: messageRoleEnum("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  source: text("source").notNull().default("direct"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const analyticsEvents = pgTable("analytics_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  sessionId: text("session_id").notNull(),
  eventType: text("event_type").notNull(),
  pagePath: text("page_path"),
  deviceType: text("device_type"),
  country: text("country"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const siteVisits = pgTable("site_visits", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: text("session_id").notNull(),
  ipHash: text("ip_hash"),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  country: text("country"),
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

// ─── Insert schemas (auto-fields omitted) ─────────────────────────────────────

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertBotSessionSchema = createInsertSchema(botSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBotMessageSchema = createInsertSchema(botMessages).omit({
  id: true,
  createdAt: true,
});

export const insertWaitlistSchema = createInsertSchema(waitlist).omit({
  id: true,
  createdAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(
  analyticsEvents
).omit({ id: true, createdAt: true });

export const insertSiteVisitSchema = createInsertSchema(siteVisits).omit({
  id: true,
  firstSeenAt: true,
  lastSeenAt: true,
});

// ─── Select types ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BotSession = typeof botSessions.$inferSelect;
export type InsertBotSession = z.infer<typeof insertBotSessionSchema>;

export type BotMessage = typeof botMessages.$inferSelect;
export type InsertBotMessage = z.infer<typeof insertBotMessageSchema>;

export type Waitlist = typeof waitlist.$inferSelect;
export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;

export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
