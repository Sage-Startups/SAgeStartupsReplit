import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  userId: integer("user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertBotSession = z.infer<typeof insertBotSessionSchema>;
export type BotSession = typeof botSessions.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertGeneratedAsset = z.infer<typeof insertGeneratedAssetSchema>;
export type GeneratedAsset = typeof generatedAssets.$inferSelect;
