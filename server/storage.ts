import {
  users,
  threats,
  newsArticles,
  simulations,
  userSimulations,
  chatMessages,
  systemMetrics,
  type User,
  type InsertUser,
  type Threat,
  type InsertThreat,
  type NewsArticle,
  type InsertNewsArticle,
  type Simulation,
  type UserSimulation,
  type InsertUserSimulation,
  type ChatMessage,
  type InsertChatMessage,
  type SystemMetric,
  type InsertSystemMetric,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  getUsers(limit?: number): Promise<User[]>;
  
  // Threat operations
  getThreat(id: string): Promise<Threat | undefined>;
  getThreats(filters?: { status?: string; severity?: string; type?: string }): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreat(id: string, updates: Partial<Threat>): Promise<Threat>;
  getThreatStats(): Promise<{ critical: number; high: number; medium: number; low: number }>;
  
  // News operations
  getNewsArticles(limit?: number): Promise<NewsArticle[]>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  
  // Simulation operations
  getSimulations(): Promise<Simulation[]>;
  getUserSimulations(userId: string): Promise<UserSimulation[]>;
  createUserSimulation(userSim: InsertUserSimulation): Promise<UserSimulation>;
  updateUserSimulation(id: string, updates: Partial<UserSimulation>): Promise<UserSimulation>;
  
  // Chat operations
  getChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // System metrics
  getSystemMetrics(type?: string): Promise<SystemMetric[]>;
  createSystemMetric(metric: InsertSystemMetric): Promise<SystemMetric>;
  getLatestMetrics(): Promise<{ threatCount: number; systemHealth: number; aiConfidence: number }>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getUsers(limit: number = 100): Promise<User[]> {
    return await db.select().from(users).limit(limit).orderBy(desc(users.createdAt));
  }

  // Threat operations
  async getThreat(id: string): Promise<Threat | undefined> {
    const [threat] = await db.select().from(threats).where(eq(threats.id, id));
    return threat;
  }

  async getThreats(filters: { status?: string; severity?: string; type?: string } = {}): Promise<Threat[]> {
    let query = db.select().from(threats);
    
    const conditions = [];
    if (filters.status) conditions.push(eq(threats.status, filters.status));
    if (filters.severity) conditions.push(eq(threats.severity, filters.severity));
    if (filters.type) conditions.push(eq(threats.type, filters.type));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }
    
    return await query.orderBy(desc(threats.detectedAt));
  }

  async createThreat(insertThreat: InsertThreat): Promise<Threat> {
    const [threat] = await db.insert(threats).values(insertThreat).returning();
    return threat;
  }

  async updateThreat(id: string, updates: Partial<Threat>): Promise<Threat> {
    const [threat] = await db
      .update(threats)
      .set(updates)
      .where(eq(threats.id, id))
      .returning();
    return threat;
  }

  async getThreatStats(): Promise<{ critical: number; high: number; medium: number; low: number }> {
    const stats = await db
      .select({
        severity: threats.severity,
        count: count(),
      })
      .from(threats)
      .where(eq(threats.status, 'active'))
      .groupBy(threats.severity);

    const result = { critical: 0, high: 0, medium: 0, low: 0 };
    stats.forEach(stat => {
      if (stat.severity in result) {
        result[stat.severity as keyof typeof result] = stat.count;
      }
    });

    return result;
  }

  // News operations
  async getNewsArticles(limit: number = 50): Promise<NewsArticle[]> {
    return await db
      .select()
      .from(newsArticles)
      .orderBy(desc(newsArticles.publishedAt))
      .limit(limit);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await db.insert(newsArticles).values(insertArticle).returning();
    return article;
  }

  // Simulation operations
  async getSimulations(): Promise<Simulation[]> {
    return await db.select().from(simulations).where(eq(simulations.isActive, true));
  }

  async getUserSimulations(userId: string): Promise<UserSimulation[]> {
    return await db
      .select()
      .from(userSimulations)
      .where(eq(userSimulations.userId, userId))
      .orderBy(desc(userSimulations.startedAt));
  }

  async createUserSimulation(insertUserSim: InsertUserSimulation): Promise<UserSimulation> {
    const [userSim] = await db.insert(userSimulations).values(insertUserSim).returning();
    return userSim;
  }

  async updateUserSimulation(id: string, updates: Partial<UserSimulation>): Promise<UserSimulation> {
    const [userSim] = await db
      .update(userSimulations)
      .set(updates)
      .where(eq(userSimulations.id, id))
      .returning();
    return userSim;
  }

  // Chat operations
  async getChatMessages(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db.insert(chatMessages).values(insertMessage).returning();
    return message;
  }

  // System metrics
  async getSystemMetrics(type?: string): Promise<SystemMetric[]> {
    let query = db.select().from(systemMetrics);
    
    if (type) {
      query = query.where(eq(systemMetrics.metricType, type));
    }
    
    return await query.orderBy(desc(systemMetrics.timestamp));
  }

  async createSystemMetric(insertMetric: InsertSystemMetric): Promise<SystemMetric> {
    const [metric] = await db.insert(systemMetrics).values(insertMetric).returning();
    return metric;
  }

  async getLatestMetrics(): Promise<{ threatCount: number; systemHealth: number; aiConfidence: number }> {
    const activeThreats = await db
      .select({ count: count() })
      .from(threats)
      .where(eq(threats.status, 'active'));

    const [latestHealth] = await db
      .select()
      .from(systemMetrics)
      .where(eq(systemMetrics.metricType, 'system_health'))
      .orderBy(desc(systemMetrics.timestamp))
      .limit(1);

    const [latestAI] = await db
      .select()
      .from(systemMetrics)
      .where(eq(systemMetrics.metricType, 'ai_confidence'))
      .orderBy(desc(systemMetrics.timestamp))
      .limit(1);

    return {
      threatCount: activeThreats[0]?.count || 0,
      systemHealth: latestHealth?.value || 96,
      aiConfidence: latestAI?.value || 94,
    };
  }
}

export const storage = new DatabaseStorage();
