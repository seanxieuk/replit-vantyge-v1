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
import { mozApi } from "./mozApi";

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
      
      const company = await storage.createCompany(companyData);
      res.json(company);
    } catch (error) {
      console.error("Error creating company:", error);
      res.status(500).json({ message: "Failed to create company" });
    }
  });

  app.put('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const existingCompany = await storage.getCompanyByUserId(userId);
      
      if (!existingCompany) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      const companyData = insertCompanySchema.parse({ ...req.body, userId });
      const company = await storage.updateCompany(existingCompany.id, companyData);
      res.json(company);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
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
      res.json({ message: "Competitor deleted successfully" });
    } catch (error) {
      console.error("Error deleting competitor:", error);
      res.status(500).json({ message: "Failed to delete competitor" });
    }
  });

  // Competitive analysis routes
  app.get('/api/competitive-analyses', isAuthenticated, async (req: any, res) => {
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

  app.post('/api/competitive-analyses/:competitorId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      const competitorId = parseInt(req.params.competitorId);
      
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      
      if (!competitorId || isNaN(competitorId)) {
        return res.status(400).json({ message: "Invalid competitor ID" });
      }
      
      // Get competitor details
      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      const competitor = competitors.find(c => c.id === competitorId);
      
      if (!competitor) {
        return res.status(404).json({ message: "Competitor not found" });
      }
      
      // Get real SEO data from Moz API
      const mozData = await mozApi.analyzeCompetitor(competitor.website || '');
      
      // Generate AI insights using OpenAI with company context
      const aiInsights = await analyzeCompetitor(competitor.name, competitor.website || '', mozData, company);
      
      const analysis = await storage.createCompetitiveAnalysis({
        companyId: company.id,
        competitorId: competitorId,
        domainAuthority: mozData.domainAuthority,
        pageAuthority: mozData.pageAuthority,
        spamScore: mozData.spamScore,
        linkingDomains: mozData.linkingDomains,
        totalLinks: mozData.totalLinks,
        seoStrength: mozData.seoStrength,
        insights: aiInsights.insights,
        threats: aiInsights.threats,
        opportunities: aiInsights.opportunities,
        recommendations: aiInsights.recommendations
      });
      
      res.json(analysis);
    } catch (error) {
      console.error("Error creating competitive analysis:", error);
      res.status(500).json({ message: "Failed to create competitive analysis" });
    }
  });

  app.post('/api/competitive-analyses/analyze-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }

      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      
      if (!competitors || competitors.length === 0) {
        return res.status(400).json({ message: "No competitors found. Please add competitors first." });
      }

      const analyses = [];
      
      for (const competitor of competitors) {
        // Check if competitor.id is valid
        if (!competitor.id || isNaN(competitor.id)) {
          console.error(`Invalid competitor ID: ${competitor.id}`);
          continue;
        }
        
        try {
          // Get real SEO data from Moz API
          const mozData = await mozApi.analyzeCompetitor(competitor.website || '');
          
          // Generate AI insights using OpenAI with company context
          const aiInsights = await analyzeCompetitor(competitor.name, competitor.website || '', mozData, company);
          
          const analysis = await storage.createCompetitiveAnalysis({
            companyId: company.id,
            competitorId: competitor.id,
            domainAuthority: mozData.domainAuthority,
            pageAuthority: mozData.pageAuthority,
            spamScore: mozData.spamScore,
            linkingDomains: mozData.linkingDomains,
            totalLinks: mozData.totalLinks,
            seoStrength: mozData.seoStrength,
            insights: aiInsights.insights,
            threats: aiInsights.threats,
            opportunities: aiInsights.opportunities,
            recommendations: aiInsights.recommendations
          });
          
          analyses.push(analysis);
        } catch (error) {
          console.error(`Error analyzing competitor ${competitor.name}:`, error);
          // Continue with other competitors even if one fails
        }
      }
      
      res.json(analyses);
    } catch (error) {
      console.error("Error analyzing all competitors:", error);
      res.status(500).json({ message: "Failed to analyze all competitors" });
    }
  });

  // Content routes
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

      const contentData = {
        ...req.body,
        companyId: company.id,
        content: "Generated content will appear here...", // Placeholder for now
        wordCount: 1000 // Mock word count
      };
      
      const content = await storage.createContentItem(contentData);
      res.json(content);
    } catch (error) {
      console.error("Error creating content:", error);
      res.status(500).json({ message: "Failed to create content" });
    }
  });

  app.delete('/api/content/:id', isAuthenticated, async (req, res) => {
    try {
      const contentId = parseInt(req.params.id);
      // Add delete logic here when needed
      res.json({ message: "Content deleted successfully" });
    } catch (error) {
      console.error("Error deleting content:", error);
      res.status(500).json({ message: "Failed to delete content" });
    }
  });

  // Mock routes for positioning recommendations and blog ideas
  app.get('/api/positioning-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      // Mock data for now
      const recommendations = [
        {
          id: "1",
          category: "Market Positioning",
          title: "Focus on Innovation Leadership",
          description: "Position your company as the innovation leader in your industry",
          keyPoints: ["Cutting-edge technology", "First-to-market solutions", "R&D investment"],
          messagingStyle: "Bold, forward-thinking, and technical",
          valueProposition: "We deliver tomorrow's solutions today",
          differentiators: ["Advanced AI capabilities", "Faster time-to-market", "Superior technical expertise"],
          targetSegments: ["Early adopters", "Tech-savvy enterprises", "Innovation-focused teams"],
          confidence: 0.85
        }
      ];
      res.json(recommendations);
    } catch (error) {
      console.error("Error fetching positioning recommendations:", error);
      res.status(500).json({ message: "Failed to fetch positioning recommendations" });
    }
  });

  app.post('/api/positioning-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      // Mock generating recommendations
      const recommendations = [
        {
          id: "1",
          category: "Market Positioning",
          title: "Focus on Innovation Leadership",
          description: "Position your company as the innovation leader in your industry",
          keyPoints: ["Cutting-edge technology", "First-to-market solutions", "R&D investment"],
          messagingStyle: "Bold, forward-thinking, and technical",
          valueProposition: "We deliver tomorrow's solutions today",
          differentiators: ["Advanced AI capabilities", "Faster time-to-market", "Superior technical expertise"],
          targetSegments: ["Early adopters", "Tech-savvy enterprises", "Innovation-focused teams"],
          confidence: 0.85
        }
      ];
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating positioning recommendations:", error);
      res.status(500).json({ message: "Failed to generate positioning recommendations" });
    }
  });

  app.get('/api/blog-ideas', isAuthenticated, async (req: any, res) => {
    try {
      // Mock blog ideas for now
      const ideas = [
        {
          id: "1",
          title: "The Future of AI in Your Industry",
          description: "Explore how artificial intelligence is transforming business operations",
          keywords: ["AI", "automation", "innovation", "efficiency"],
          estimatedLength: "1200-1500 words",
          difficulty: "Medium",
          targetAudience: "Business leaders and decision makers",
          contentPillars: ["Technology", "Innovation", "Business Strategy"],
          seoScore: 85
        }
      ];
      res.json(ideas);
    } catch (error) {
      console.error("Error fetching blog ideas:", error);
      res.status(500).json({ message: "Failed to fetch blog ideas" });
    }
  });

  app.post('/api/blog-ideas', isAuthenticated, async (req: any, res) => {
    try {
      // Mock generating blog ideas
      const ideas = [
        {
          id: "1",
          title: "The Future of AI in Your Industry",
          description: "Explore how artificial intelligence is transforming business operations",
          keywords: ["AI", "automation", "innovation", "efficiency"],
          estimatedLength: "1200-1500 words",
          difficulty: "Medium",
          targetAudience: "Business leaders and decision makers",
          contentPillars: ["Technology", "Innovation", "Business Strategy"],
          seoScore: 85
        }
      ];
      res.json(ideas);
    } catch (error) {
      console.error("Error generating blog ideas:", error);
      res.status(500).json({ message: "Failed to generate blog ideas" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
