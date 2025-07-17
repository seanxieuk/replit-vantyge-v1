import {
  users,
  companies,
  competitors,
  competitiveAnalyses,
  contentItems,
  contentStrategies,
  type User,
  type UpsertUser,
  type Company,
  type InsertCompany,
  type Competitor,
  type InsertCompetitor,
  type ContentItem,
  type InsertContentItem,
  type ContentStrategy,
  type InsertContentStrategy,
  type CompetitiveAnalysis,
  type InsertCompetitiveAnalysis,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Company operations
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  
  // Competitor operations
  getCompetitorsByCompanyId(companyId: number): Promise<Competitor[]>;
  createCompetitor(competitor: InsertCompetitor): Promise<Competitor>;
  deleteCompetitor(id: number): Promise<void>;
  
  // Competitive analysis operations
  getCompetitiveAnalysesByCompanyId(companyId: number): Promise<CompetitiveAnalysis[]>;
  createCompetitiveAnalysis(analysis: InsertCompetitiveAnalysis): Promise<CompetitiveAnalysis>;
  
  // Content operations
  getContentItemsByCompanyId(companyId: number): Promise<ContentItem[]>;
  createContentItem(content: InsertContentItem): Promise<ContentItem>;
  updateContentItem(id: number, content: Partial<InsertContentItem>): Promise<ContentItem>;
  
  // Content strategy operations
  getContentStrategiesByCompanyId(companyId: number): Promise<ContentStrategy[]>;
  createContentStrategy(strategy: InsertContentStrategy): Promise<ContentStrategy>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

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

  // Company operations
  async getCompanyByUserId(userId: string): Promise<Company | undefined> {
    const [company] = await db.select().from(companies).where(eq(companies.userId, userId));
    return company;
  }

  async createCompany(company: InsertCompany): Promise<Company> {
    const [newCompany] = await db.insert(companies).values(company).returning();
    return newCompany;
  }

  async updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company> {
    const [updatedCompany] = await db
      .update(companies)
      .set({ ...company, updatedAt: new Date() })
      .where(eq(companies.id, id))
      .returning();
    return updatedCompany;
  }

  // Competitor operations
  async getCompetitorsByCompanyId(companyId: number): Promise<Competitor[]> {
    return await db.select().from(competitors).where(eq(competitors.companyId, companyId));
  }

  async createCompetitor(competitor: InsertCompetitor): Promise<Competitor> {
    const [newCompetitor] = await db.insert(competitors).values(competitor).returning();
    return newCompetitor;
  }

  async deleteCompetitor(id: number): Promise<void> {
    await db.delete(competitors).where(eq(competitors.id, id));
  }

  // Competitive analysis operations
  async getCompetitiveAnalysesByCompanyId(companyId: number): Promise<CompetitiveAnalysis[]> {
    return await db.select().from(competitiveAnalyses).where(eq(competitiveAnalyses.companyId, companyId));
  }

  async createCompetitiveAnalysis(analysis: InsertCompetitiveAnalysis): Promise<CompetitiveAnalysis> {
    const [newAnalysis] = await db.insert(competitiveAnalyses).values(analysis).returning();
    return newAnalysis;
  }

  // Content operations
  async getContentItemsByCompanyId(companyId: number): Promise<ContentItem[]> {
    return await db.select().from(contentItems).where(eq(contentItems.companyId, companyId));
  }

  async createContentItem(content: InsertContentItem): Promise<ContentItem> {
    const [newContent] = await db.insert(contentItems).values(content).returning();
    return newContent;
  }

  async updateContentItem(id: number, content: Partial<InsertContentItem>): Promise<ContentItem> {
    const [updatedContent] = await db
      .update(contentItems)
      .set({ ...content, updatedAt: new Date() })
      .where(eq(contentItems.id, id))
      .returning();
    return updatedContent;
  }

  // Content strategy operations
  async getContentStrategiesByCompanyId(companyId: number): Promise<ContentStrategy[]> {
    return await db.select().from(contentStrategies).where(eq(contentStrategies.companyId, companyId));
  }

  async createContentStrategy(strategy: InsertContentStrategy): Promise<ContentStrategy> {
    const [newStrategy] = await db.insert(contentStrategies).values(strategy).returning();
    return newStrategy;
  }
}

export const storage = new DatabaseStorage();
