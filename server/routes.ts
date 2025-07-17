import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCompanySchema, 
  insertCompetitorSchema, 
  insertContentItemSchema,
  insertContentStrategySchema 
} from "@shared/schema";
import { analyzeCompetitor, generateContent, generateContentStrategy } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Company routes
  app.get('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      res.json(company);
    } catch (error) {
      console.error("Error fetching company:", error);
      res.status(500).json({ message: "Failed to fetch company" });
    }
  });

  app.post('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const companyData = insertCompanySchema.parse({ ...req.body, userId });
      
      const existingCompany = await storage.getCompanyByUserId(userId);
      let company;
      
      if (existingCompany) {
        company = await storage.updateCompany(existingCompany.id, companyData);
      } else {
        company = await storage.createCompany(companyData);
      }
      
      res.json(company);
    } catch (error) {
      console.error("Error saving company:", error);
      res.status(500).json({ message: "Failed to save company" });
    }
  });

  // Competitor routes
  app.get('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      res.json(competitors);
    } catch (error) {
      console.error("Error fetching competitors:", error);
      res.status(500).json({ message: "Failed to fetch competitors" });
    }
  });

  app.post('/api/competitors', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const competitorData = insertCompetitorSchema.parse({ 
        ...req.body, 
        companyId: company.id 
      });
      
      const competitor = await storage.createCompetitor(competitorData);
      res.json(competitor);
    } catch (error) {
      console.error("Error creating competitor:", error);
      res.status(500).json({ message: "Failed to create competitor" });
    }
  });

  app.delete('/api/competitors/:id', isAuthenticated, async (req, res) => {
    try {
      const competitorId = parseInt(req.params.id);
      await storage.deleteCompetitor(competitorId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting competitor:", error);
      res.status(500).json({ message: "Failed to delete competitor" });
    }
  });

  // Competitive analysis routes
  app.get('/api/competitive-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const analyses = await storage.getCompetitiveAnalysesByCompanyId(company.id);
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching competitive analyses:", error);
      res.status(500).json({ message: "Failed to fetch competitive analyses" });
    }
  });

  app.post('/api/competitive-analysis/run', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      const companyContext = `${company.name} - ${company.description} in ${company.industry}`;
      
      const analyses = [];
      
      for (const competitor of competitors) {
        try {
          const analysisResult = await analyzeCompetitor(
            competitor.name,
            competitor.website || "",
            companyContext
          );
          
          const analysis = await storage.createCompetitiveAnalysis({
            companyId: company.id,
            competitorId: competitor.id,
            marketShare: analysisResult.marketShare,
            contentVolume: analysisResult.contentVolume,
            seoStrength: analysisResult.seoStrength,
            insights: analysisResult.insights,
            threats: analysisResult.threats,
            opportunities: analysisResult.opportunities,
            recommendations: analysisResult.recommendations,
          });
          
          analyses.push(analysis);
        } catch (error) {
          console.error(`Error analyzing competitor ${competitor.name}:`, error);
        }
      }
      
      res.json(analyses);
    } catch (error) {
      console.error("Error running competitive analysis:", error);
      res.status(500).json({ message: "Failed to run competitive analysis" });
    }
  });

  // Content generation routes
  app.post('/api/content/generate', isAuthenticated, async (req: any, res) => {
    try {
      const { topic, keywords, tone, wordCount, contentType, additionalInstructions } = req.body;
      
      const content = await generateContent({
        topic,
        keywords,
        tone,
        wordCount,
        contentType,
        additionalInstructions
      });
      
      res.json({ content });
    } catch (error) {
      console.error("Error generating content:", error);
      res.status(500).json({ message: "Failed to generate content" });
    }
  });

  // Content items routes
  app.get('/api/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const content = await storage.getContentItemsByCompanyId(company.id);
      res.json(content);
    } catch (error) {
      console.error("Error fetching content:", error);
      res.status(500).json({ message: "Failed to fetch content" });
    }
  });

  app.post('/api/content', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const contentData = insertContentItemSchema.parse({ 
        ...req.body, 
        companyId: company.id 
      });
      
      const content = await storage.createContentItem(contentData);
      res.json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.patch('/api/content/:id', isAuthenticated, async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      const updates = req.body;
      
      const content = await storage.updateContentItem(contentId, updates);
      res.json(content);
    } catch (error) {
      console.error("Error updating content:", error);
      res.status(500).json({ message: "Failed to update content" });
    }
  });

  // Content strategy routes
  app.get('/api/content-strategy', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const strategies = await storage.getContentStrategiesByCompanyId(company.id);
      res.json(strategies);
    } catch (error) {
      console.error("Error fetching content strategies:", error);
      res.status(500).json({ message: "Failed to fetch content strategies" });
    }
  });

  app.post('/api/content-strategy/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const strategyResult = await generateContentStrategy(
        company.description || "",
        company.targetAudience || "",
        company.industry || ""
      );
      
      const strategy = await storage.createContentStrategy({
        companyId: company.id,
        title: strategyResult.title,
        description: strategyResult.description,
        targetKeywords: strategyResult.targetKeywords,
        contentPillars: strategyResult.contentPillars,
        recommendations: strategyResult.recommendations,
      });
      
      res.json(strategy);
    } catch (error) {
      console.error("Error generating content strategy:", error);
      res.status(500).json({ message: "Failed to generate content strategy" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
