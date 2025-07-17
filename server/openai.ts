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
