import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).notNull().default("free"), // 'free', 'pro', 'premium'
  subscriptionStatus: varchar("subscription_status", { length: 20 }).notNull().default("active"), // 'active', 'cancelled', 'expired'
  subscriptionExpires: timestamp("subscription_expires"),
  trialUsed: boolean("trial_used").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const userAnalytics = pgTable("user_analytics", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalSessions: integer("total_sessions").notNull().default(0),
  totalMessages: integer("total_messages").notNull().default(0),
  totalAssets: integer("total_assets").notNull().default(0),
  favoriteSection: varchar("favorite_section", { length: 50 }),
  lastActive: timestamp("last_active").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const botSessions = pgTable("bot_sessions", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull(),
  botId: text("bot_id").notNull(),
  botName: text("bot_name").notNull(),
  section: text("section").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // for storing additional data like generated assets
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const generatedAssets = pgTable("generated_assets", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull(),
  assetType: text("asset_type").notNull(), // 'logo', 'copy', 'strategy', etc.
  content: jsonb("content").notNull(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// UpsertUser for authentication system
export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  name: true,
  description: true,
  userId: true,
});

export const insertBotSessionSchema = createInsertSchema(botSessions).pick({
  projectId: true,
  botId: true,
  botName: true,
  section: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).pick({
  sessionId: true,
  role: true,
  content: true,
  metadata: true,
});

export const insertGeneratedAssetSchema = createInsertSchema(generatedAssets).pick({
  sessionId: true,
  assetType: true,
  content: true,
  title: true,
});

export const insertUserAnalyticsSchema = createInsertSchema(userAnalytics).pick({
  userId: true,
  totalSessions: true,
  totalMessages: true,
  totalAssets: true,
  favoriteSection: true,
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertBotSession = z.infer<typeof insertBotSessionSchema>;
export type BotSession = typeof botSessions.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertGeneratedAsset = z.infer<typeof insertGeneratedAssetSchema>;
export type GeneratedAsset = typeof generatedAssets.$inferSelect;
export type InsertUserAnalytics = z.infer<typeof insertUserAnalyticsSchema>;
export type UserAnalytics = typeof userAnalytics.$inferSelect;
