import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertCompanySchema, 
  insertCompetitorSchema, 
  insertContentItemSchema,
  insertContentStrategySchema,
  insertRejectedBlogIdeaSchema
} from "@shared/schema";
import { analyzeCompetitor, generateContent, generateContentStrategy, analyzePositioning, analyzeCompetitiveLandscape, generateBlogIdeas, generateFullArticle } from "./openai";
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

  // Update user profile
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, email, role } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        role
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Upload profile photo
  app.post('/api/user/upload-photo', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ message: "No image data provided" });
      }

      // Update user with the new profile image URL (base64 data URL)
      const updatedUser = await storage.updateUser(userId, {
        profileImageUrl: imageData
      });
      
      res.json({ 
        message: "Profile photo uploaded successfully",
        profileImageUrl: updatedUser.profileImageUrl 
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      res.status(500).json({ message: "Failed to upload photo" });
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

  // Update company information
  app.patch('/api/company', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name, industry, description } = req.body;
      
      const updatedCompany = await storage.updateCompanyByUserId(userId, {
        name,
        industry,
        description
      });
      
      res.json(updatedCompany);
    } catch (error) {
      console.error("Error updating company:", error);
      res.status(500).json({ message: "Failed to update company" });
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

  // Get company domain authority analysis
  app.get('/api/company-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company not found" });
      }

      const websiteUrl = company.website || company.domain;
      if (!websiteUrl) {
        return res.status(400).json({ message: "Company website or domain not provided" });
      }

      // Use Moz API to analyze company's domain
      const mozAnalysis = await mozApi.analyzeCompetitor(websiteUrl);
      
      res.json({
        id: `company-${company.id}`,
        competitorId: null, // This is for the company itself
        companyId: company.id,
        domainAuthority: mozAnalysis.domainAuthority,
        pageAuthority: mozAnalysis.pageAuthority,
        spamScore: mozAnalysis.spamScore,
        linkingDomains: mozAnalysis.linkingDomains,
        totalLinks: mozAnalysis.totalLinks,
        seoStrength: mozAnalysis.seoStrength,
        insights: `Domain analysis for ${company.name}`,
        recommendations: `Based on the domain authority of ${mozAnalysis.domainAuthority}, consider focusing on link building and content strategy.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error analyzing company domain:", error);
      res.status(500).json({ message: "Failed to analyze company domain" });
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
      
      // Get real SEO data from Moz API with keywords
      const mozData = await mozApi.analyzeCompetitor(competitor.website || '', competitor.name);
      
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
        topKeywords: mozData.topKeywords,
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
        console.log(`Processing competitor:`, competitor);
        if (!competitor.id || (typeof competitor.id !== 'number' && isNaN(Number(competitor.id)))) {
          console.error(`Invalid competitor ID: ${competitor.id}, type: ${typeof competitor.id}`);
          continue;
        }
        
        try {
          // Get real SEO data from Moz API (with fallback) including keywords
          const mozData = await mozApi.analyzeCompetitor(competitor.website || competitor.name || '', competitor.name);
          
          // Generate AI insights using OpenAI with company context
          const aiInsights = await analyzeCompetitor(competitor.name, competitor.website || '', mozData, company);
          
          const analysis = await storage.createCompetitiveAnalysis({
            companyId: company.id,
            competitorId: Number(competitor.id),
            domainAuthority: mozData.domainAuthority,
            pageAuthority: mozData.pageAuthority,
            spamScore: mozData.spamScore,
            linkingDomains: mozData.linkingDomains,
            totalLinks: mozData.totalLinks,
            seoStrength: mozData.seoStrength,
            topKeywords: mozData.topKeywords,
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

  // Positioning workshops routes
  app.get('/api/positioning-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }
      
      // Use OpenAI to analyze positioning based on company data
      const analysis = await analyzePositioning(company);
      
      res.json(analysis.recommendations);
    } catch (error) {
      console.error("Error generating positioning recommendations:", error);
      res.status(500).json({ message: "Failed to generate positioning recommendations" });
    }
  });

    app.post('/api/positioning-recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }
      
      // Use OpenAI to analyze positioning based on company data
      const analysis = await analyzePositioning(company);
      
      res.json(analysis.recommendations);
    } catch (error) {
      console.error("Error generating positioning recommendations:", error);
      res.status(500).json({ message: "Failed to generate positioning recommendations" });
    }
  });

  // New route for comprehensive positioning analysis
  app.get('/api/positioning-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }
      
      // Use OpenAI to analyze positioning based on company data
      const analysis = await analyzePositioning(company);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error generating positioning analysis:", error);
      res.status(500).json({ message: "Failed to generate positioning analysis" });
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
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }

      // Get optional data to enhance topic generation
      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      const positioningRecommendations = await storage.getPositioningRecommendations(company.id);
      const rejectedIdeas = await storage.getRejectedBlogIdeas(company.id);
      
      // Generate AI-powered blog ideas with rejected ideas context
      const blogIdeas = await generateBlogIdeas(company, competitors, positioningRecommendations, rejectedIdeas);
      
      res.json(blogIdeas);
    } catch (error) {
      console.error("Error generating blog ideas:", error);
      res.status(500).json({ message: "Failed to generate blog ideas" });
    }
  });

  // Generate full article endpoint
  app.post('/api/generate-article', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { idea } = req.body;
      
      if (!idea) {
        return res.status(400).json({ message: "Blog idea is required" });
      }

      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }

      // Get optional data to enhance article generation
      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      const positioningRecommendations = await storage.getPositioningRecommendations(company.id);
      
      // Generate AI-powered full article
      const generatedArticle = await generateFullArticle(idea, company, competitors, positioningRecommendations);
      
      res.json(generatedArticle);
    } catch (error) {
      console.error("Error generating article:", error);
      res.status(500).json({ message: "Failed to generate article" });
    }
  });

  // Reject blog idea endpoint
  app.post('/api/reject-blog-idea', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { idea, rejectionReason } = req.body;
      
      if (!idea || !rejectionReason) {
        return res.status(400).json({ message: "Blog idea and rejection reason are required" });
      }

      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      // Store the rejected idea
      const rejectedIdea = await storage.rejectBlogIdea(company.id, idea, rejectionReason);
      
      res.json({ message: "Blog idea rejected successfully", rejectedIdea });
    } catch (error) {
      console.error("Error rejecting blog idea:", error);
      res.status(500).json({ message: "Failed to reject blog idea" });
    }
  });

  // Publish blog idea endpoint
  app.post('/api/publish-blog-idea', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { idea, publicationDate } = req.body;
      
      if (!idea || !publicationDate) {
        return res.status(400).json({ message: "Blog idea and publication date are required" });
      }

      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      // Store the published idea
      const publishedIdea = await storage.publishBlogIdea(company.id, idea, new Date(publicationDate));
      
      res.json({ message: "Blog idea published successfully", publishedIdea });
    } catch (error) {
      console.error("Error publishing blog idea:", error);
      res.status(500).json({ message: "Failed to publish blog idea" });
    }
  });

  // Delete blog idea endpoint
  app.post('/api/delete-blog-idea', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { idea } = req.body;
      
      if (!idea) {
        return res.status(400).json({ message: "Blog idea is required" });
      }

      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      // Store the deleted idea
      const deletedIdea = await storage.deleteBlogIdea(company.id, idea);
      
      res.json({ message: "Blog idea deleted successfully", deletedIdea });
    } catch (error) {
      console.error("Error deleting blog idea:", error);
      res.status(500).json({ message: "Failed to delete blog idea" });
    }
  });

  // Get rejected blog ideas endpoint
  app.get('/api/rejected-blog-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      const rejectedIdeas = await storage.getRejectedBlogIdeas(company.id);
      
      res.json(rejectedIdeas);
    } catch (error) {
      console.error("Error fetching rejected blog ideas:", error);
      res.status(500).json({ message: "Failed to fetch rejected blog ideas" });
    }
  });

  // Get published blog ideas endpoint
  app.get('/api/published-blog-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      const publishedIdeas = await storage.getPublishedBlogIdeas(company.id);
      
      res.json(publishedIdeas);
    } catch (error) {
      console.error("Error fetching published blog ideas:", error);
      res.status(500).json({ message: "Failed to fetch published blog ideas" });
    }
  });

  // Get deleted blog ideas endpoint
  app.get('/api/deleted-blog-ideas', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found" });
      }

      const deletedIdeas = await storage.getDeletedBlogIdeas(company.id);
      
      res.json(deletedIdeas);
    } catch (error) {
      console.error("Error fetching deleted blog ideas:", error);
      res.status(500).json({ message: "Failed to fetch deleted blog ideas" });
    }
  });

  // Get existing competitive landscape analysis
  app.get('/api/competitive-landscape-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company not found" });
      }

      const existingAnalysis = await storage.getCompetitiveLandscapeAnalysis(company.id);
      res.json(existingAnalysis);
    } catch (error) {
      console.error("Error fetching competitive landscape analysis:", error);
      res.status(500).json({ message: "Failed to fetch analysis" });
    }
  });

  // Competitive landscape analysis endpoint
  app.post('/api/competitive-landscape-analysis', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }

      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      
      if (!competitors || competitors.length === 0) {
        return res.status(400).json({ message: "No competitors found. Please add competitors to perform analysis." });
      }

      // Use OpenAI to analyze competitive landscape
      const analysis = await analyzeCompetitiveLandscape(company, competitors);
      
      // Save the analysis results to the database
      await storage.saveCompetitiveLandscapeAnalysis(company.id, analysis);
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing competitive landscape:", error);
      res.status(500).json({ message: "Failed to analyze competitive landscape" });
    }
  });

  // Simple Domain Authority analysis endpoint (without full competitive analysis)
  app.post('/api/domain-authority/analyze-all', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const company = await storage.getCompanyByUserId(userId);
      
      if (!company) {
        return res.status(400).json({ message: "Company profile not found. Please complete your company setup first." });
      }

      const competitors = await storage.getCompetitorsByCompanyId(company.id);
      const results = [];
      
      // Analyze company domain
      if (company.website || company.domain) {
        try {
          const companyDomain = company.website || company.domain;
          const mozData = await mozApi.analyzeCompetitor(companyDomain);
          results.push({
            type: 'company',
            name: company.name,
            domain: companyDomain,
            domainAuthority: mozData.domainAuthority,
            seoStrength: mozData.seoStrength
          });
        } catch (error) {
          console.error(`Error analyzing company domain:`, error);
        }
      }
      
      // Analyze competitor domains
      if (competitors && competitors.length > 0) {
        for (const competitor of competitors) {
          try {
            const domain = competitor.website || competitor.name;
            const mozData = await mozApi.analyzeCompetitor(domain);
            results.push({
              type: 'competitor',
              id: competitor.id,
              name: competitor.name,
              domain: domain,
              domainAuthority: mozData.domainAuthority,
              seoStrength: mozData.seoStrength
            });
          } catch (error) {
            console.error(`Error analyzing competitor ${competitor.name}:`, error);
          }
        }
      }
      
      res.json(results);
    } catch (error) {
      console.error("Error analyzing domain authority:", error);
      res.status(500).json({ message: "Failed to analyze domain authority" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
