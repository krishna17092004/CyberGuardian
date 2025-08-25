import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  role: text("role").notNull().default("operator"), // admin, analyst, operator
  status: text("status").notNull().default("active"), // active, suspended, inactive
  profileImageUrl: text("profile_image_url"),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // phishing, ransomware, malware, insider, ddos
  title: text("title").notNull(),
  description: text("description").notNull(),
  severity: text("severity").notNull(), // critical, high, medium, low
  status: text("status").notNull().default("active"), // active, mitigated, analyzing, resolved
  sourceIp: text("source_ip"),
  targetSystem: text("target_system"),
  location: text("location"),
  aiConfidence: integer("ai_confidence").notNull().default(0), // 0-100
  affectedUsers: integer("affected_users").default(0),
  detectedAt: timestamp("detected_at").defaultNow(),
  mitigatedAt: timestamp("mitigated_at"),
  metadata: jsonb("metadata"), // additional threat-specific data
});

export const newsArticles = pgTable("news_articles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  source: text("source").notNull(),
  category: text("category").notNull(), // vulnerability, breach, attack, regulation
  tags: text("tags").array(), // array of tags
  url: text("url"),
  imageUrl: text("image_url"),
  publishedAt: timestamp("published_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // phishing, network-defense, incident-response, malware-analysis
  difficulty: text("difficulty").notNull(), // beginner, intermediate, expert
  duration: integer("duration").notNull(), // minutes
  maxPoints: integer("max_points").notNull(),
  instructions: text("instructions").notNull(),
  scenarios: jsonb("scenarios"), // simulation scenarios and challenges
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userSimulations = pgTable("user_simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  simulationId: varchar("simulation_id").notNull().references(() => simulations.id),
  score: integer("score").default(0),
  completedAt: timestamp("completed_at"),
  timeSpent: integer("time_spent"), // minutes
  results: jsonb("results"), // detailed simulation results
  startedAt: timestamp("started_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  response: text("response"),
  type: text("type").notNull().default("general"), // general, threat-analysis, platform-help
  metadata: jsonb("metadata"), // additional context
  createdAt: timestamp("created_at").defaultNow(),
});

export const systemMetrics = pgTable("system_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: text("metric_type").notNull(), // threat_count, system_health, ai_confidence
  value: integer("value").notNull(),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  simulations: many(userSimulations),
  chatMessages: many(chatMessages),
}));

export const threatsRelations = relations(threats, ({ one }) => ({
  // Add relations as needed
}));

export const simulationsRelations = relations(simulations, ({ many }) => ({
  userSimulations: many(userSimulations),
}));

export const userSimulationsRelations = relations(userSimulations, ({ one }) => ({
  user: one(users, {
    fields: [userSimulations.userId],
    references: [users.id],
  }),
  simulation: one(simulations, {
    fields: [userSimulations.simulationId],
    references: [simulations.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

// Zod schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastActive: true,
});

export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  detectedAt: true,
});

export const insertNewsArticleSchema = createInsertSchema(newsArticles).omit({
  id: true,
  createdAt: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Threat = typeof threats.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;

export type UserSimulation = typeof userSimulations.$inferSelect;
export type InsertUserSimulation = typeof userSimulations.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type SystemMetric = typeof systemMetrics.$inferSelect;
export type InsertSystemMetric = typeof systemMetrics.$inferInsert;
