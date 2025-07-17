import {
  users,
  companies,
  competitors,
  competitiveAnalyses,
  contentItems,
  contentStrategies,
  rejectedBlogIdeas,
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
  type RejectedBlogIdea,
  type InsertRejectedBlogIdea,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  
  // Company operations
  getCompanyByUserId(userId: string): Promise<Company | undefined>;
  createCompany(company: InsertCompany): Promise<Company>;
  updateCompany(id: number, company: Partial<InsertCompany>): Promise<Company>;
  updateCompanyByUserId(userId: string, company: Partial<InsertCompany>): Promise<Company>;
  
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
  
  // Positioning recommendations (mock implementation for now)
  getPositioningRecommendations(companyId: number): Promise<any[]>;
  
  // Competitive landscape analysis results
  getCompetitiveLandscapeAnalysis(companyId: number): Promise<any | null>;
  saveCompetitiveLandscapeAnalysis(companyId: number, analysis: any): Promise<any>;
  
  // Rejected blog ideas operations
  rejectBlogIdea(companyId: number, idea: any, rejectionReason: string): Promise<RejectedBlogIdea>;
  getRejectedBlogIdeas(companyId: number): Promise<RejectedBlogIdea[]>;
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

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
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

  async updateCompanyByUserId(userId: string, companyData: Partial<InsertCompany>): Promise<Company> {
    // First check if company exists for this user
    const existingCompany = await this.getCompanyByUserId(userId);
    
    if (existingCompany) {
      // Update existing company
      const [updatedCompany] = await db
        .update(companies)
        .set({ ...companyData, updatedAt: new Date() })
        .where(eq(companies.userId, userId))
        .returning();
      return updatedCompany;
    } else {
      // Create new company for user
      const [newCompany] = await db
        .insert(companies)
        .values({ ...companyData, userId })
        .returning();
      return newCompany;
    }
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

  // Positioning recommendations (mock implementation for now)
  async getPositioningRecommendations(companyId: number): Promise<any[]> {
    // For now, return empty array since we don't have a positioning recommendations table
    // This could be extended in the future to store and retrieve actual positioning recommendations
    return [];
  }

  // Competitive landscape analysis results
  async getCompetitiveLandscapeAnalysis(companyId: number): Promise<any | null> {
    // Store landscape analysis as content strategy with a special title
    const [analysis] = await db
      .select()
      .from(contentStrategies)
      .where(eq(contentStrategies.companyId, companyId))
      .orderBy(contentStrategies.createdAt)
      .limit(1);
    
    if (!analysis || analysis.title !== '__competitive_landscape_analysis__') {
      return null;
    }
    
    try {
      return JSON.parse(analysis.description || '{}');
    } catch {
      return null;
    }
  }

  async saveCompetitiveLandscapeAnalysis(companyId: number, analysis: any): Promise<any> {
    // First, delete any existing landscape analysis
    await db
      .delete(contentStrategies)
      .where(
        and(
          eq(contentStrategies.companyId, companyId),
          eq(contentStrategies.title, '__competitive_landscape_analysis__')
        )
      );
    
    // Insert new analysis
    const [saved] = await db
      .insert(contentStrategies)
      .values({
        companyId,
        title: '__competitive_landscape_analysis__',
        description: JSON.stringify(analysis),
        targetKeywords: [],
        contentPillars: [],
        recommendations: '',
      })
      .returning();
    
    return analysis;
  }

  // Rejected blog ideas operations
  async rejectBlogIdea(companyId: number, idea: any, rejectionReason: string): Promise<RejectedBlogIdea> {
    const [rejectedIdea] = await db
      .insert(rejectedBlogIdeas)
      .values({
        companyId,
        ideaData: idea,
        rejectionReason,
      })
      .returning();
    return rejectedIdea;
  }

  async getRejectedBlogIdeas(companyId: number): Promise<RejectedBlogIdea[]> {
    const ideas = await db
      .select()
      .from(rejectedBlogIdeas)
      .where(eq(rejectedBlogIdeas.companyId, companyId))
      .orderBy(rejectedBlogIdeas.rejectedAt);
    return ideas;
  }
}

export const storage = new DatabaseStorage();
