import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface CompetitorAnalysisResult {
  marketShare: number;
  contentVolume: "low" | "medium" | "high";
  seoStrength: "weak" | "moderate" | "strong";
  insights: string;
  threats: string;
  opportunities: string;
  recommendations: string;
}

export interface ContentGenerationRequest {
  topic: string;
  keywords: string;
  tone: string;
  wordCount: string;
  contentType: string;
  additionalInstructions?: string;
}

export interface ContentStrategyResult {
  title: string;
  description: string;
  targetKeywords: string[];
  contentPillars: string[];
  recommendations: string;
}

export async function analyzeCompetitor(
  competitorName: string,
  competitorWebsite: string,
  mozData: {
    domainAuthority: number;
    pageAuthority: number;
    spamScore: number;
    linkingDomains: number;
    totalLinks: number;
    seoStrength: string;
  },
  company?: any
): Promise<{
  insights: string;
  threats: string;
  opportunities: string;
  recommendations: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a competitive intelligence expert. Analyze the given competitor using real SEO data from Moz API. Provide insights for marketing strategy. Respond with JSON in this exact format: {
            "insights": "string",
            "threats": "string", 
            "opportunities": "string",
            "recommendations": "string"
          }`
        },
        {
          role: "user",
          content: `Analyze competitor: ${competitorName} (${competitorWebsite}) using real Moz SEO data:
          
          SEO Metrics:
          - Domain Authority: ${mozData.domainAuthority}/100
          - Page Authority: ${mozData.pageAuthority}/100
          - Spam Score: ${mozData.spamScore}/100
          - Linking Domains: ${mozData.linkingDomains}
          - Total Links: ${mozData.totalLinks}
          - SEO Strength: ${mozData.seoStrength}
          
          ${company ? `
          Company Context:
          - Company: ${company.name}
          - Industry: ${company.industry || 'Not specified'}
          - Products/Services: ${company.products?.join(', ') || 'Not specified'}
          - Target Audience: ${company.idealCustomerProfiles || 'Not specified'}
          - Unique Selling Proposition: ${company.uniqueSellingProposition || 'Not specified'}
          - Website: ${company.website || 'Not specified'}
          
          Compare this competitor's SEO performance against our company and provide strategic insights.` : ''}
          
          Based on these authentic SEO metrics${company ? ' and company context' : ''}, provide strategic marketing insights and actionable recommendations.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      insights: result.insights || "",
      threats: result.threats || "",
      opportunities: result.opportunities || "",
      recommendations: result.recommendations || ""
    };
  } catch (error) {
    throw new Error("Failed to analyze competitor: " + (error as Error).message);
  }
}

export async function generateContent(request: ContentGenerationRequest): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional content writer. Create high-quality marketing content based on the user's requirements. Write in the specified tone and include the target keywords naturally.`
        },
        {
          role: "user",
          content: `Create a ${request.contentType} about "${request.topic}".
          
Requirements:
- Target keywords: ${request.keywords}
- Tone: ${request.tone}
- Word count: ${request.wordCount}
- Additional instructions: ${request.additionalInstructions || "None"}

Please write engaging, professional content that would be suitable for marketing purposes.`
        }
      ],
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    throw new Error("Failed to generate content: " + (error as Error).message);
  }
}

export async function generateContentStrategy(
  companyDescription: string,
  targetAudience: string,
  industry: string
): Promise<ContentStrategyResult> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a content strategy expert. Create a comprehensive content strategy based on the company information. Respond with JSON in this exact format: {
            "title": "string",
            "description": "string",
            "targetKeywords": ["keyword1", "keyword2", "keyword3"],
            "contentPillars": ["pillar1", "pillar2", "pillar3"],
            "recommendations": "string"
          }`
        },
        {
          role: "user",
          content: `Create a content strategy for:
Company: ${companyDescription}
Target Audience: ${targetAudience}
Industry: ${industry}

Provide strategic recommendations for content marketing including key pillars, target keywords, and actionable recommendations.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      title: result.title || "Content Strategy",
      description: result.description || "",
      targetKeywords: Array.isArray(result.targetKeywords) ? result.targetKeywords : [],
      contentPillars: Array.isArray(result.contentPillars) ? result.contentPillars : [],
      recommendations: result.recommendations || ""
    };
  } catch (error) {
    throw new Error("Failed to generate content strategy: " + (error as Error).message);
  }
}

export interface PositioningAnalysis {
  currentPositioning: {
    overview: string;
    strengths: string[];
    weaknesses: string[];
    marketPosition: string;
  };
  recommendations: {
    id: string;
    category: string;
    title: string;
    description: string;
    keyPoints: string[];
    messagingStyle: string;
    valueProposition: string;
    differentiators: string[];
    targetSegments: string[];
    confidence: number;
  }[];
}

export async function analyzePositioning(company: any): Promise<PositioningAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a strategic positioning expert. Analyze the company's current positioning and provide comprehensive recommendations. Respond with JSON in this exact format: {
            "currentPositioning": {
              "overview": "string - comprehensive overview of current positioning",
              "strengths": ["strength1", "strength2", "strength3"],
              "weaknesses": ["weakness1", "weakness2", "weakness3"],
              "marketPosition": "string - current market position assessment"
            },
            "recommendations": [
              {
                "id": "string",
                "category": "string - category like 'Messaging', 'Differentiation', 'Target Market'",
                "title": "string - short title",
                "description": "string - detailed description",
                "keyPoints": ["point1", "point2", "point3"],
                "messagingStyle": "string - recommended messaging style",
                "valueProposition": "string - refined value proposition",
                "differentiators": ["diff1", "diff2", "diff3"],
                "targetSegments": ["segment1", "segment2"],
                "confidence": 0.85
              }
            ]
          }`
        },
        {
          role: "user",
          content: `Analyze positioning for this company:
          
Company Information:
- Name: ${company.name}
- Industry: ${company.industry || 'Not specified'}
- Website: ${company.website || 'Not specified'}
- Description: ${company.description || 'Not specified'}
- Products/Services: ${company.products?.join(', ') || 'Not specified'}
- Unique Selling Proposition: ${company.uniqueSellingProposition || 'Not specified'}
- Target Audience: ${company.idealCustomerProfiles || 'Not specified'}
- Customer Pain Points: ${company.customerPainPoints?.join(', ') || 'Not specified'}

Provide:
1. Current positioning analysis with strengths/weaknesses
2. At least 3 specific positioning recommendations with actionable insights
3. Refined messaging and value proposition suggestions
4. Market differentiation strategies

Focus on actionable, strategic recommendations based on the company data provided.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      currentPositioning: {
        overview: result.currentPositioning?.overview || "Analysis unavailable",
        strengths: Array.isArray(result.currentPositioning?.strengths) ? result.currentPositioning.strengths : [],
        weaknesses: Array.isArray(result.currentPositioning?.weaknesses) ? result.currentPositioning.weaknesses : [],
        marketPosition: result.currentPositioning?.marketPosition || "Position unclear"
      },
      recommendations: Array.isArray(result.recommendations) ? result.recommendations.map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        category: rec.category || "General",
        title: rec.title || "Positioning Recommendation",
        description: rec.description || "",
        keyPoints: Array.isArray(rec.keyPoints) ? rec.keyPoints : [],
        messagingStyle: rec.messagingStyle || "",
        valueProposition: rec.valueProposition || "",
        differentiators: Array.isArray(rec.differentiators) ? rec.differentiators : [],
        targetSegments: Array.isArray(rec.targetSegments) ? rec.targetSegments : [],
        confidence: typeof rec.confidence === 'number' ? rec.confidence : 0.7
      })) : []
    };
  } catch (error) {
    throw new Error("Failed to analyze positioning: " + (error as Error).message);
  }
}

export interface CompetitiveLandscapeAnalysis {
  summary: string;
  competitivePosition: {
    marketPosition: string;
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  competitorInsights: {
    id: string;
    name: string;
    positioning: string;
    strengths: string[];
    weaknesses: string[];
    marketShare: string;
    threat_level: "Low" | "Medium" | "High";
  }[];
  recommendations: {
    id: string;
    category: string;
    priority: "High" | "Medium" | "Low";
    title: string;
    description: string;
    actionItems: string[];
    timeline: string;
    expectedImpact: string;
  }[];
  marketOpportunities: string[];
  strategicImplications: string[];
}

export async function analyzeCompetitiveLandscape(
  company: any,
  competitors: any[]
): Promise<CompetitiveLandscapeAnalysis> {
  try {
    const competitorData = competitors.map(comp => ({
      name: comp.name,
      website: comp.website,
      description: comp.description,
      domainAuthority: comp.domainAuthority,
      pageAuthority: comp.pageAuthority,
      spamScore: comp.spamScore
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: `You are a competitive intelligence expert. Analyze the competitive landscape and provide strategic insights. Respond with JSON in this exact format: {
            "summary": "string - comprehensive market overview",
            "competitivePosition": {
              "marketPosition": "string - current market position",
              "strengths": ["strength1", "strength2", "strength3"],
              "weaknesses": ["weakness1", "weakness2", "weakness3"],
              "opportunities": ["opportunity1", "opportunity2", "opportunity3"],
              "threats": ["threat1", "threat2", "threat3"]
            },
            "competitorInsights": [
              {
                "id": "comp1",
                "name": "Competitor Name",
                "positioning": "string - their market positioning",
                "strengths": ["strength1", "strength2"],
                "weaknesses": ["weakness1", "weakness2"],
                "marketShare": "string - estimated market share",
                "threat_level": "High"
              }
            ],
            "recommendations": [
              {
                "id": "rec1",
                "category": "Market Strategy",
                "priority": "High",
                "title": "Strategic Recommendation",
                "description": "Detailed description",
                "actionItems": ["action1", "action2", "action3"],
                "timeline": "3-6 months",
                "expectedImpact": "Expected outcome"
              }
            ],
            "marketOpportunities": ["opportunity1", "opportunity2", "opportunity3"],
            "strategicImplications": ["implication1", "implication2", "implication3"]
          }`
        },
        {
          role: "user",
          content: `Analyze the competitive landscape for:

Your Company:
- Name: ${company.name}
- Industry: ${company.industry || 'Not specified'}
- Website: ${company.website || 'Not specified'}
- Description: ${company.description || 'Not specified'}
- Products/Services: ${company.products?.join(', ') || 'Not specified'}
- Unique Selling Proposition: ${company.uniqueSellingProposition || 'Not specified'}
- Target Audience: ${company.idealCustomerProfiles || 'Not specified'}

Competitors:
${competitorData.map(comp => `
- Name: ${comp.name}
- Website: ${comp.website || 'Not specified'}
- Description: ${comp.description || 'Not specified'}
- Domain Authority: ${comp.domainAuthority || 'Not available'}
- Page Authority: ${comp.pageAuthority || 'Not available'}
- Spam Score: ${comp.spamScore || 'Not available'}
`).join('\n')}

Provide:
1. Comprehensive competitive landscape analysis
2. SWOT analysis for your company in this competitive context
3. Individual competitor insights with threat assessment
4. Strategic recommendations with priorities and timelines
5. Market opportunities and strategic implications

Focus on actionable insights that can inform strategic decisions.`
        }
      ],
      response_format: { type: "json_object" },
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      summary: result.summary || "Analysis unavailable",
      competitivePosition: {
        marketPosition: result.competitivePosition?.marketPosition || "Position unclear",
        strengths: Array.isArray(result.competitivePosition?.strengths) ? result.competitivePosition.strengths : [],
        weaknesses: Array.isArray(result.competitivePosition?.weaknesses) ? result.competitivePosition.weaknesses : [],
        opportunities: Array.isArray(result.competitivePosition?.opportunities) ? result.competitivePosition.opportunities : [],
        threats: Array.isArray(result.competitivePosition?.threats) ? result.competitivePosition.threats : []
      },
      competitorInsights: Array.isArray(result.competitorInsights) ? result.competitorInsights.map((comp: any, index: number) => ({
        id: comp.id || `comp-${index}`,
        name: comp.name || "Unknown Competitor",
        positioning: comp.positioning || "",
        strengths: Array.isArray(comp.strengths) ? comp.strengths : [],
        weaknesses: Array.isArray(comp.weaknesses) ? comp.weaknesses : [],
        marketShare: comp.marketShare || "Unknown",
        threat_level: ["Low", "Medium", "High"].includes(comp.threat_level) ? comp.threat_level : "Medium"
      })) : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations.map((rec: any, index: number) => ({
        id: rec.id || `rec-${index}`,
        category: rec.category || "General",
        priority: ["High", "Medium", "Low"].includes(rec.priority) ? rec.priority : "Medium",
        title: rec.title || "Strategic Recommendation",
        description: rec.description || "",
        actionItems: Array.isArray(rec.actionItems) ? rec.actionItems : [],
        timeline: rec.timeline || "TBD",
        expectedImpact: rec.expectedImpact || ""
      })) : [],
      marketOpportunities: Array.isArray(result.marketOpportunities) ? result.marketOpportunities : [],
      strategicImplications: Array.isArray(result.strategicImplications) ? result.strategicImplications : []
    };
  } catch (error) {
    throw new Error("Failed to analyze competitive landscape: " + (error as Error).message);
  }
}
