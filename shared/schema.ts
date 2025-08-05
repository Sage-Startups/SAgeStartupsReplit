import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, index, real } from "drizzle-orm/pg-core";
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
  email: varchar("email").unique().notNull(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  company: varchar("company"),
  jobTitle: varchar("job_title"),
  phone: varchar("phone"),
  location: varchar("location"),
  timezone: varchar("timezone"),
  language: varchar("language").default("en"),
  subscriptionTier: varchar("subscription_tier", { length: 20 }).notNull().default("free"), // 'free', 'pro', 'premium'
  subscriptionStatus: varchar("subscription_status", { length: 20 }).notNull().default("active"), // 'active', 'cancelling', 'cancelled', 'expired'
  nextTier: varchar("next_tier", { length: 20 }), // Tier to switch to after expiration
  role: varchar("role", { length: 20 }).notNull().default("client"), // 'super_admin', 'moderator', 'client'
  subscriptionExpires: timestamp("subscription_expires"),
  trialUsed: boolean("trial_used").notNull().default(false),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  marketingEmails: boolean("marketing_emails").notNull().default(false),
  securityAlerts: boolean("security_alerts").notNull().default(true),
  lastActive: timestamp("last_active"),
  emailVerified: boolean("email_verified").notNull().default(false),
  emailVerificationToken: varchar("email_verification_token"),
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpires: timestamp("password_reset_expires"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  pendingSubscription: varchar("pending_subscription", { length: 20 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit logs for tracking admin actions
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  action: varchar("action").notNull(), // 'create', 'update', 'delete', 'login', etc.
  resource: varchar("resource").notNull(), // 'user', 'subscription', 'content', etc.
  resourceId: varchar("resource_id"), // ID of affected resource
  details: jsonb("details"), // Additional action details
  ipAddress: varchar("ip_address"),
  userAgent: varchar("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Subscription plans management
export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  tier: varchar("tier").notNull(), // 'free', 'pro', 'premium'
  price: real("price").notNull(),
  billingInterval: varchar("billing_interval").notNull(), // 'monthly', 'yearly'
  features: jsonb("features").notNull(),
  botLimit: integer("bot_limit").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment history
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  planId: integer("plan_id").references(() => subscriptionPlans.id),
  amount: real("amount").notNull(),
  currency: varchar("currency").notNull().default("USD"),
  status: varchar("status").notNull(), // 'pending', 'completed', 'failed', 'refunded'
  paymentMethod: varchar("payment_method"), // 'stripe', 'paypal'
  transactionId: varchar("transaction_id"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Content management
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  type: varchar("type").notNull(), // 'blog_post', 'help_doc', 'page'
  title: varchar("title").notNull(),
  slug: varchar("slug").unique().notNull(),
  content: text("content").notNull(),
  status: varchar("status").notNull().default("draft"), // 'draft', 'published', 'archived'
  authorId: varchar("author_id").notNull().references(() => users.id),
  metadata: jsonb("metadata"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Media assets
export const media = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: varchar("filename").notNull(),
  originalName: varchar("original_name").notNull(),
  mimeType: varchar("mime_type").notNull(),
  size: integer("size").notNull(),
  url: varchar("url").notNull(),
  uploadedBy: varchar("uploaded_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
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
  sessionTitle: text("session_title"), // Descriptive title based on user request
  data: jsonb("data"), // Store bot-specific state data
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

// Bot Programs - For programming bots to do specific jobs
export const botPrograms = pgTable("bot_programs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  botId: varchar("bot_id").notNull(),
  name: varchar("name").notNull(),
  description: text("description"),
  trigger: varchar("trigger").notNull(), // 'manual', 'scheduled', 'event', 'api'
  schedule: varchar("schedule"), // Cron expression for scheduled triggers
  event: varchar("event"), // Event name for event-based triggers
  enabled: boolean("enabled").default(true),
  instructions: text("instructions").notNull(),
  parameters: jsonb("parameters"),
  lastRun: timestamp("last_run"),
  status: varchar("status").default('idle'), // 'idle', 'running', 'completed', 'failed'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
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
  sessionTitle: true,
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

export const insertBotProgramSchema = createInsertSchema(botPrograms).pick({
  userId: true,
  botId: true,
  name: true,
  description: true,
  trigger: true,
  schedule: true,
  event: true,
  enabled: true,
  instructions: true,
  parameters: true,
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
export type InsertBotProgram = z.infer<typeof insertBotProgramSchema>;
export type BotProgram = typeof botPrograms.$inferSelect;

export const founderMetrics = pgTable('founder_metrics', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id').notNull().references(() => users.id),
  companyName: text('company_name').notNull().default('Your Startup'),
  revenue: integer('revenue').notNull().default(0),
  monthlyGrowth: integer('monthly_growth').notNull().default(0),
  activeUsers: integer('active_users').notNull().default(0),
  churnRate: integer('churn_rate').notNull().default(0),
  burnRate: integer('burn_rate').notNull().default(0),
  runway: integer('runway').notNull().default(0),
  goals: jsonb('goals').notNull().default([]),
  lastUpdated: timestamp('last_updated').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Waitlist table for capturing early signups
export const waitlist = pgTable('waitlist', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  source: varchar('source').default('landing-page-2'),
  referrer: varchar('referrer'),
  isEarlyBird: boolean('is_early_bird').notNull().default(false), // Track if they signed up for the early bird deal
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Early bird counter table
export const earlyBirdCounter = pgTable('early_bird_counter', {
  id: serial('id').primaryKey(),
  spotsRemaining: integer('spots_remaining').notNull().default(20),
  totalSpots: integer('total_spots').notNull().default(20),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  name: true,
  email: true,
  source: true,
  referrer: true,
  isEarlyBird: true,
});

export const insertEarlyBirdCounterSchema = createInsertSchema(earlyBirdCounter).pick({
  spotsRemaining: true,
  totalSpots: true,
});

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;
export type InsertEarlyBirdCounter = z.infer<typeof insertEarlyBirdCounterSchema>;
export type EarlyBirdCounter = typeof earlyBirdCounter.$inferSelect;

export const insertFounderMetricsSchema = createInsertSchema(founderMetrics).pick({
  userId: true,
  companyName: true,
  revenue: true,
  monthlyGrowth: true,
  activeUsers: true,
  churnRate: true,
  burnRate: true,
  runway: true,
  goals: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  planId: true,
  amount: true,
  currency: true,
  status: true,
  paymentMethod: true,
  transactionId: true,
  metadata: true,
});

// Site Analytics Tables
export const siteVisits = pgTable("site_visits", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id").notNull(), // Unique session identifier
  userId: varchar("user_id").references(() => users.id), // Null for anonymous visitors
  ipAddress: varchar("ip_address").notNull(),
  userAgent: varchar("user_agent"),
  referrer: varchar("referrer"),
  utmSource: varchar("utm_source"),
  utmMedium: varchar("utm_medium"),
  utmCampaign: varchar("utm_campaign"),
  country: varchar("country"),
  city: varchar("city"),
  browser: varchar("browser"),
  os: varchar("os"),
  device: varchar("device"), // 'desktop', 'mobile', 'tablet'
  visitStart: timestamp("visit_start").defaultNow().notNull(),
  visitEnd: timestamp("visit_end"),
  duration: integer("duration"), // in seconds
  pageViews: integer("page_views").default(1),
  isAuthenticated: boolean("is_authenticated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pageViews = pgTable("page_views", {
  id: serial("id").primaryKey(),
  visitId: integer("visit_id").notNull().references(() => siteVisits.id),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  path: varchar("path").notNull(),
  title: varchar("title"),
  timeOnPage: integer("time_on_page"), // in seconds
  exitPage: boolean("exit_page").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userActions = pgTable("user_actions", {
  id: serial("id").primaryKey(),
  visitId: integer("visit_id").notNull().references(() => siteVisits.id),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  action: varchar("action").notNull(), // 'click', 'form_submit', 'scroll', 'hover', 'download', etc.
  element: varchar("element"), // button ID, form name, etc.
  elementText: varchar("element_text"),
  page: varchar("page").notNull(),
  metadata: jsonb("metadata"), // Additional action data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const conversionEvents = pgTable("conversion_events", {
  id: serial("id").primaryKey(),
  visitId: integer("visit_id").notNull().references(() => siteVisits.id),
  sessionId: varchar("session_id").notNull(),
  userId: varchar("user_id").references(() => users.id),
  eventType: varchar("event_type").notNull(), // 'signup', 'subscription', 'trial_start', 'waitlist_join'
  eventValue: real("event_value"), // Revenue value for the conversion
  funnel: varchar("funnel"), // Which funnel this conversion belongs to
  source: varchar("source"), // Where the conversion came from
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas for analytics tables
export const insertSiteVisitSchema = createInsertSchema(siteVisits).pick({
  sessionId: true,
  userId: true,
  ipAddress: true,
  userAgent: true,
  referrer: true,
  utmSource: true,
  utmMedium: true,
  utmCampaign: true,
  country: true,
  city: true,
  browser: true,
  os: true,
  device: true,
  isAuthenticated: true,
});

export const insertPageViewSchema = createInsertSchema(pageViews).pick({
  visitId: true,
  sessionId: true,
  userId: true,
  path: true,
  title: true,
  timeOnPage: true,
  exitPage: true,
});

export const insertUserActionSchema = createInsertSchema(userActions).pick({
  visitId: true,
  sessionId: true,
  userId: true,
  action: true,
  element: true,
  elementText: true,
  page: true,
  metadata: true,
});

export const insertConversionEventSchema = createInsertSchema(conversionEvents).pick({
  visitId: true,
  sessionId: true,
  userId: true,
  eventType: true,
  eventValue: true,
  funnel: true,
  source: true,
});

export type InsertFounderMetrics = z.infer<typeof insertFounderMetricsSchema>;
export type FounderMetrics = typeof founderMetrics.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Content = typeof content.$inferSelect;
export type Media = typeof media.$inferSelect;

// Analytics types
export type InsertSiteVisit = z.infer<typeof insertSiteVisitSchema>;
export type SiteVisit = typeof siteVisits.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertUserAction = z.infer<typeof insertUserActionSchema>;
export type UserAction = typeof userActions.$inferSelect;
export type InsertConversionEvent = z.infer<typeof insertConversionEventSchema>;
export type ConversionEvent = typeof conversionEvents.$inferSelect;
