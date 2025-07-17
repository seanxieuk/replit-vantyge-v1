import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  role: varchar("role"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Company information
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  domain: text("domain"),
  website: text("website"), // Keep existing field to preserve data
  linkedinUrl: text("linkedin_url"),
  industry: text("industry"),
  size: text("size"),
  description: text("description"),
  uniqueSellingProposition: text("unique_selling_proposition"),
  products: text("products").array(),
  services: text("services").array(),
  idealCustomerProfiles: text("ideal_customer_profiles"),
  customerPainPoints: text("customer_pain_points").array(),
  targetAudience: text("target_audience"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitors
export const competitors = pgTable("competitors", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  name: text("name").notNull(),
  website: text("website"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Competitive analysis results
export const competitiveAnalyses = pgTable("competitive_analyses", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  competitorId: integer("competitor_id").notNull().references(() => competitors.id),
  domainAuthority: integer("domain_authority"),
  pageAuthority: integer("page_authority"),
  spamScore: integer("spam_score"),
  linkingDomains: integer("linking_domains"),
  totalLinks: integer("total_links"),
  seoStrength: text("seo_strength"),
  insights: text("insights"),
  threats: text("threats"),
  opportunities: text("opportunities"),
  recommendations: text("recommendations"),
  analyzedAt: timestamp("analyzed_at").defaultNow(),
});

// Content items
export const contentItems = pgTable("content_items", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  content: text("content"),
  type: text("type").notNull(), // blog, social, email, etc.
  status: text("status").notNull().default("draft"), // draft, review, published
  keywords: text("keywords"),
  tone: text("tone"),
  wordCount: integer("word_count"),
  scheduledFor: timestamp("scheduled_for"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Content strategies
export const contentStrategies = pgTable("content_strategies", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  title: text("title").notNull(),
  description: text("description"),
  targetKeywords: text("target_keywords").array(),
  contentPillars: text("content_pillars").array(),
  recommendations: text("recommendations"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Competitive landscape analysis results
export const competitiveLandscapeAnalyses = pgTable("competitive_landscape_analyses", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull().references(() => companies.id),
  summary: text("summary").notNull(),
  keyInsights: text("key_insights").array(),
  strengthsWeaknesses: text("strengths_weaknesses"),
  marketOpportunities: text("market_opportunities").array(),
  strategicImplications: text("strategic_implications").array(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema exports
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export const insertCompetitorSchema = createInsertSchema(competitors).omit({
  id: true,
  createdAt: true,
});
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

export const insertContentItemSchema = createInsertSchema(contentItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentItem = z.infer<typeof insertContentItemSchema>;
export type ContentItem = typeof contentItems.$inferSelect;

export const insertContentStrategySchema = createInsertSchema(contentStrategies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertContentStrategy = z.infer<typeof insertContentStrategySchema>;
export type ContentStrategy = typeof contentStrategies.$inferSelect;

export type CompetitiveAnalysis = typeof competitiveAnalyses.$inferSelect;
export const insertCompetitiveAnalysisSchema = createInsertSchema(competitiveAnalyses).omit({
  id: true,
  analyzedAt: true,
});
export type InsertCompetitiveAnalysis = z.infer<typeof insertCompetitiveAnalysisSchema>;

export type CompetitiveLandscapeAnalysis = typeof competitiveLandscapeAnalyses.$inferSelect;
export const insertCompetitiveLandscapeAnalysisSchema = createInsertSchema(competitiveLandscapeAnalyses).omit({
  id: true,
  createdAt: true,
});
export type InsertCompetitiveLandscapeAnalysis = z.infer<typeof insertCompetitiveLandscapeAnalysisSchema>;
